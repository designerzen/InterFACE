#include <napi.h>
#include <memory>
#include <mutex>
#include <unordered_map>
#include <vector>

#include <windows.h>
#include <winternl.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Devices.Midi2.h>
#include <winrt/Windows.Devices.Midi2.Enumeration.h>

namespace midi = winrt::Windows::Devices::Midi2;
namespace enumeration = midi::Enumeration;
namespace foundation = winrt::Windows::Foundation;

struct MessagePayload {
    std::string endpointId;
    uint64_t timestamp;
    std::vector<uint32_t> words;
};

struct PortPayload {
    std::string id;
    std::string name;
};

class MidiHost {
public:
    static MidiHost& Instance() {
        static MidiHost host;
        return host;
    }

    Napi::Value Start(const Napi::CallbackInfo& info) {
        std::scoped_lock lock(m_mutex);
        if (m_started) throw Napi::Error::New(info.Env(), "Windows MIDI Services is already running");
        if (info.Length() != 1 || !info[0].IsObject()) throw Napi::TypeError::New(info.Env(), "Callbacks object required");

        // RtlGetVersion reports the real build even without an OS compatibility manifest.
        using RtlGetVersionFunction = LONG(WINAPI*)(PRTL_OSVERSIONINFOW);
        auto getVersion = reinterpret_cast<RtlGetVersionFunction>(GetProcAddress(GetModuleHandleW(L"ntdll.dll"), "RtlGetVersion"));
        RTL_OSVERSIONINFOW version{};
        version.dwOSVersionInfoSize = sizeof(version);
        if (!getVersion || getVersion(&version) != 0 || version.dwBuildNumber < 26200)
            throw Napi::Error::New(info.Env(), "Windows.Devices.Midi2 requires Windows 11 25H2 or later");

        // Resolve the system API before allocating callbacks, so missing APIs and
        // Legacy API mode can fall back to Web MIDI without retaining Node handles.
        try {
            winrt::init_apartment(winrt::apartment_type::multi_threaded);
            if (!midi::MidiApi::EnsureServiceAvailable())
                throw Napi::Error::New(info.Env(), "Windows MIDI Service is disabled or unavailable");
            m_session = midi::MidiSession::Create(L"PhotoSYNTH");
            if (!m_session) throw Napi::Error::New(info.Env(), "Unable to create Windows MIDI session");
            m_watcher = enumeration::MidiEndpointDeviceWatcher::Create(enumeration::MidiEndpointDeviceInformationFilters::AllStandardEndpoints);
            if (!m_watcher) throw Napi::Error::New(info.Env(), "Unable to create Windows MIDI endpoint watcher");
        } catch (winrt::hresult_error const& error) {
            m_session = nullptr;
            throw Napi::Error::New(info.Env(), "Windows.Devices.Midi2 unavailable: " + winrt::to_string(error.message()));
        }

        auto callbacks = info[0].As<Napi::Object>();
        m_messageCallback = Napi::ThreadSafeFunction::New(info.Env(), callbacks.Get("onMessage").As<Napi::Function>(), "Windows MIDI message", 0, 1);
        m_portsCallback = Napi::ThreadSafeFunction::New(info.Env(), callbacks.Get("onPortsChanged").As<Napi::Function>(), "Windows MIDI ports", 0, 1);

        m_addedToken = m_watcher.Added({ this, &MidiHost::OnAdded });
        m_removedToken = m_watcher.Removed({ this, &MidiHost::OnRemoved });
        m_updatedToken = m_watcher.Updated({ this, &MidiHost::OnUpdated });
        m_watcher.Start();
        m_started = true;

        auto result = Napi::Object::New(info.Env());
        result.Set("ports", PortsToJS(info.Env()));
        return result;
    }

    Napi::Value Send(const Napi::CallbackInfo& info) {
        if (!m_started) throw Napi::Error::New(info.Env(), "Windows MIDI Services is not running");
        const auto endpointId = info[0].As<Napi::String>().Utf8Value();
        auto wordsValue = info[1].As<Napi::Array>();
        const uint64_t timestamp = info.Length() > 2 ? static_cast<uint64_t>(info[2].As<Napi::Number>().Int64Value()) : 0;

        std::vector<uint32_t> words;
        for (uint32_t index = 0; index < wordsValue.Length(); ++index) words.push_back(wordsValue.Get(index).As<Napi::Number>().Uint32Value());

        std::scoped_lock lock(m_mutex);
        auto connection = GetOrOpenConnection(endpointId);
        midi::MidiSendMessageResults result{};
        const auto sendAt = timestamp == 0 ? midi::MidiClock::TimestampConstantSendImmediately() : timestamp;
        switch (words.size()) {
            case 1: result = connection.SendSingleMessageWords(sendAt, words[0]); break;
            case 2: result = connection.SendSingleMessageWords(sendAt, words[0], words[1]); break;
            case 3: result = connection.SendSingleMessageWords(sendAt, words[0], words[1], words[2]); break;
            case 4: result = connection.SendSingleMessageWords(sendAt, words[0], words[1], words[2], words[3]); break;
            default: throw Napi::RangeError::New(info.Env(), "UMP messages contain one to four words");
        }
        if (midi::MidiEndpointConnection::SendMessageFailed(result)) throw Napi::Error::New(info.Env(), "Windows MIDI Services rejected the UMP message");
        return info.Env().Undefined();
    }

    void Stop() {
        std::scoped_lock lock(m_mutex);
        if (!m_started) return;
        if (m_watcher) {
            m_watcher.Stop();
            m_watcher.Added(m_addedToken);
            m_watcher.Removed(m_removedToken);
            m_watcher.Updated(m_updatedToken);
        }
        for (auto& entry : m_connections) entry.second.connection.MessageReceived(entry.second.messageToken);
        m_connections.clear();
        if (m_session) m_session.Close();
        m_session = nullptr;
        m_watcher = nullptr;
        m_messageCallback.Release();
        m_portsCallback.Release();
        m_ports.clear();
        m_started = false;
    }

private:
    struct ConnectionEntry { midi::MidiEndpointConnection connection{ nullptr }; winrt::event_token messageToken{}; };
    std::mutex m_mutex;
    bool m_started{ false };
    midi::MidiSession m_session{ nullptr };
    enumeration::MidiEndpointDeviceWatcher m_watcher{ nullptr };
    winrt::event_token m_addedToken{}, m_removedToken{}, m_updatedToken{};
    Napi::ThreadSafeFunction m_messageCallback, m_portsCallback;
    std::unordered_map<std::string, PortPayload> m_ports;
    std::unordered_map<std::string, ConnectionEntry> m_connections;

    midi::MidiEndpointConnection GetOrOpenConnection(const std::string& id) {
        if (auto existing = m_connections.find(id); existing != m_connections.end()) return existing->second.connection;
        auto connection = m_session.CreateEndpointConnection(winrt::to_hstring(id));
        auto token = connection.MessageReceived([this, id](midi::IMidiMessageReceivedEventSource const&, midi::MidiMessageReceivedEventArgs const& args) {
            auto packet = args.GetMessagePacket();
            auto payload = new MessagePayload{ id, packet.Timestamp(), {} };
            auto allWords = packet.GetAllWords();
            for (auto word : allWords) payload->words.push_back(word);
            m_messageCallback.NonBlockingCall(payload, [](Napi::Env env, Napi::Function callback, MessagePayload* message) {
                auto value = Napi::Object::New(env);
                value.Set("endpointId", message->endpointId);
                value.Set("timestamp", Napi::Number::New(env, static_cast<double>(message->timestamp)));
                auto words = Napi::Array::New(env, message->words.size());
                for (size_t index = 0; index < message->words.size(); ++index) words.Set(index, Napi::Number::New(env, message->words[index]));
                value.Set("words", words);
                callback.Call({ value });
                delete message;
            });
        });
        if (!connection.Open()) throw std::runtime_error("Unable to open Windows MIDI endpoint");
        m_connections.emplace(id, ConnectionEntry{ connection, token });
        return connection;
    }

    void OnAdded(enumeration::MidiEndpointDeviceWatcher const&, enumeration::MidiEndpointDeviceInformationAddedEventArgs const& args) {
        auto device = args.AddedDevice();
        const auto id = winrt::to_string(device.EndpointDeviceId());
        { std::scoped_lock lock(m_mutex); m_ports[id] = { id, winrt::to_string(device.Name()) }; }
        NotifyPortsChanged();
    }
    void OnRemoved(enumeration::MidiEndpointDeviceWatcher const&, enumeration::MidiEndpointDeviceInformationRemovedEventArgs const& args) {
        const auto id = winrt::to_string(args.RemovedDevice().EndpointDeviceId());
        { std::scoped_lock lock(m_mutex); m_ports.erase(id); m_connections.erase(id); }
        NotifyPortsChanged();
    }
    void OnUpdated(enumeration::MidiEndpointDeviceWatcher const&, enumeration::MidiEndpointDeviceInformationUpdatedEventArgs const& args) {
        auto device = args.UpdatedDevice();
        const auto id = winrt::to_string(device.EndpointDeviceId());
        { std::scoped_lock lock(m_mutex); m_ports[id] = { id, winrt::to_string(device.Name()) }; }
        NotifyPortsChanged();
    }

    Napi::Array PortsToJS(Napi::Env env) {
        auto result = Napi::Array::New(env, m_ports.size());
        size_t index = 0;
        for (const auto& [_, port] : m_ports) {
            auto value = Napi::Object::New(env);
            value.Set("id", port.id); value.Set("name", port.name); value.Set("type", "bidirectional"); value.Set("nativeDataFormat", "ump");
            result.Set(index++, value);
        }
        return result;
    }
    void NotifyPortsChanged() {
        auto snapshot = new std::vector<PortPayload>();
        { std::scoped_lock lock(m_mutex); for (const auto& [_, port] : m_ports) snapshot->push_back(port); }
        m_portsCallback.NonBlockingCall(snapshot, [](Napi::Env env, Napi::Function callback, std::vector<PortPayload>* ports) {
            auto values = Napi::Array::New(env, ports->size());
            for (size_t index = 0; index < ports->size(); ++index) {
                auto value = Napi::Object::New(env); value.Set("id", (*ports)[index].id); value.Set("name", (*ports)[index].name); value.Set("type", "bidirectional"); value.Set("nativeDataFormat", "ump"); values.Set(index, value);
            }
            callback.Call({ values }); delete ports;
        });
    }
};

Napi::Value Start(const Napi::CallbackInfo& info) { return MidiHost::Instance().Start(info); }
Napi::Value Send(const Napi::CallbackInfo& info) { return MidiHost::Instance().Send(info); }
Napi::Value Stop(const Napi::CallbackInfo& info) { MidiHost::Instance().Stop(); return info.Env().Undefined(); }

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("start", Napi::Function::New(env, Start));
    exports.Set("send", Napi::Function::New(env, Send));
    exports.Set("stop", Napi::Function::New(env, Stop));
    return exports;
}

NODE_API_MODULE(photosynth_windows_midi, Init)
