#include <napi.h>
#include <CoreMIDI/CoreMIDI.h>
#include <CoreFoundation/CoreFoundation.h>
#include <algorithm>
#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace {

struct MessagePayload {
	std::string endpointId;
	uint64_t timestamp;
	std::vector<uint32_t> words;
};

struct PortPayload {
	std::string id;
	std::string name;
	std::string manufacturer;
	std::string type;
};

struct SourceContext {
	std::string endpointId;
};

std::string CFStringToUTF8(CFStringRef value) {
	if (!value) return {};
	const auto length = CFStringGetLength(value);
	const auto capacity = CFStringGetMaximumSizeForEncoding(length, kCFStringEncodingUTF8) + 1;
	std::vector<char> buffer(static_cast<size_t>(capacity));
	if (!CFStringGetCString(value, buffer.data(), capacity, kCFStringEncodingUTF8)) return {};
	return buffer.data();
}

std::string GetStringProperty(MIDIObjectRef object, CFStringRef property) {
	CFStringRef value = nullptr;
	if (MIDIObjectGetStringProperty(object, property, &value) != noErr || !value) return {};
	auto result = CFStringToUTF8(value);
	CFRelease(value);
	return result;
}

std::string GetEndpointId(MIDIEndpointRef endpoint) {
	SInt32 uniqueId = 0;
	if (MIDIObjectGetIntegerProperty(endpoint, kMIDIPropertyUniqueID, &uniqueId) != noErr) {
		uniqueId = static_cast<SInt32>(endpoint);
	}
	return "coremidi:" + std::to_string(uniqueId);
}

void ThrowStatus(Napi::Env env, OSStatus status, const char* operation) {
	if (status == noErr) return;
	throw Napi::Error::New(env, std::string(operation) + " failed with CoreMIDI status " + std::to_string(status));
}

class MidiHost {
public:
	static MidiHost& Instance() {
		static MidiHost host;
		return host;
	}

	Napi::Value Start(const Napi::CallbackInfo& info) {
		std::scoped_lock lock(mutex_);
		if (started_) throw Napi::Error::New(info.Env(), "CoreMIDI is already running");
		if (info.Length() != 1 || !info[0].IsObject()) throw Napi::TypeError::New(info.Env(), "Callbacks object required");

		auto callbacks = info[0].As<Napi::Object>();
		messageCallback_ = Napi::ThreadSafeFunction::New(info.Env(), callbacks.Get("onMessage").As<Napi::Function>(), "CoreMIDI UMP message", 0, 1);
		portsCallback_ = Napi::ThreadSafeFunction::New(info.Env(), callbacks.Get("onPortsChanged").As<Napi::Function>(), "CoreMIDI ports", 0, 1);

		auto host = this;
		ThrowStatus(info.Env(), MIDIClientCreateWithBlock(CFSTR("PhotoSYNTH MIDI 2.0"), &client_, ^(const MIDINotification*) {
			host->RefreshPorts(true);
		}), "MIDIClientCreateWithBlock");
		ThrowStatus(info.Env(), MIDIInputPortCreateWithProtocol(client_, CFSTR("PhotoSYNTH MIDI 2.0 Input"), kMIDIProtocol_2_0, &inputPort_, ^(const MIDIEventList* eventList, void* sourceContext) {
			host->Receive(eventList, static_cast<SourceContext*>(sourceContext));
		}), "MIDIInputPortCreateWithProtocol");
		ThrowStatus(info.Env(), MIDIOutputPortCreate(client_, CFSTR("PhotoSYNTH MIDI 2.0 Output"), &outputPort_), "MIDIOutputPortCreate");

		started_ = true;
		RefreshPortsLocked();
		auto result = Napi::Object::New(info.Env());
		result.Set("ports", PortsToJS(info.Env(), ports_));
		return result;
	}

	Napi::Value Send(const Napi::CallbackInfo& info) {
		if (info.Length() < 2 || !info[0].IsString() || !info[1].IsArray()) {
			throw Napi::TypeError::New(info.Env(), "Endpoint id and UMP words are required");
		}
		const auto endpointId = info[0].As<Napi::String>().Utf8Value();
		auto values = info[1].As<Napi::Array>();
		if (values.Length() < 1 || values.Length() > 4) throw Napi::RangeError::New(info.Env(), "UMP messages contain one to four words");

		UInt32 words[4]{};
		for (uint32_t index = 0; index < values.Length(); ++index) words[index] = values.Get(index).As<Napi::Number>().Uint32Value();
		const auto timestamp = info.Length() > 2 ? static_cast<MIDITimeStamp>(info[2].As<Napi::Number>().Int64Value()) : 0;

		MIDIEndpointRef destination = 0;
		{
			std::scoped_lock lock(mutex_);
			if (!started_) throw Napi::Error::New(info.Env(), "CoreMIDI is not running");
			auto found = destinations_.find(endpointId);
			if (found == destinations_.end()) throw Napi::Error::New(info.Env(), "CoreMIDI destination is unavailable");
			destination = found->second;
		}

		MIDIEventList eventList{};
		auto packet = MIDIEventListInit(&eventList, kMIDIProtocol_2_0);
		packet = MIDIEventListAdd(&eventList, sizeof(eventList), packet, timestamp, values.Length(), words);
		if (!packet) throw Napi::Error::New(info.Env(), "Unable to create CoreMIDI UMP event list");
		ThrowStatus(info.Env(), MIDISendEventList(outputPort_, destination, &eventList), "MIDISendEventList");
		return info.Env().Undefined();
	}

	void Stop() {
		std::scoped_lock lock(mutex_);
		if (!started_) return;
		for (const auto source : connectedSources_) MIDIPortDisconnectSource(inputPort_, source);
		connectedSources_.clear();
		if (inputPort_) MIDIPortDispose(inputPort_);
		if (outputPort_) MIDIPortDispose(outputPort_);
		if (client_) MIDIClientDispose(client_);
		inputPort_ = outputPort_ = client_ = 0;
		ports_.clear();
		destinations_.clear();
		sourceContexts_.clear();
		started_ = false;
		messageCallback_.Release();
		portsCallback_.Release();
	}

private:
	std::mutex mutex_;
	bool started_{ false };
	MIDIClientRef client_{ 0 };
	MIDIPortRef inputPort_{ 0 };
	MIDIPortRef outputPort_{ 0 };
	Napi::ThreadSafeFunction messageCallback_;
	Napi::ThreadSafeFunction portsCallback_;
	std::vector<PortPayload> ports_;
	std::unordered_map<std::string, MIDIEndpointRef> destinations_;
	std::unordered_map<MIDIEndpointRef, std::unique_ptr<SourceContext>> sourceContexts_;
	std::unordered_set<MIDIEndpointRef> connectedSources_;

	void Receive(const MIDIEventList* eventList, SourceContext* context) {
		if (!eventList || !context) return;
		auto packet = &eventList->packet[0];
		for (UInt32 packetIndex = 0; packetIndex < eventList->numPackets; ++packetIndex) {
			UInt32 offset = 0;
			while (offset < packet->wordCount) {
				const UInt32 lengths[16] = { 1, 1, 1, 2, 2, 4, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4 };
				const auto count = lengths[(packet->words[offset] >> 28) & 0x0f];
				if (offset + count > packet->wordCount) break;
				auto payload = new MessagePayload{ context->endpointId, packet->timeStamp, {} };
				payload->words.assign(packet->words + offset, packet->words + offset + count);
				messageCallback_.NonBlockingCall(payload, [](Napi::Env env, Napi::Function callback, MessagePayload* message) {
					auto value = Napi::Object::New(env);
					value.Set("endpointId", message->endpointId);
					value.Set("timestamp", Napi::Number::New(env, static_cast<double>(message->timestamp)));
					auto words = Napi::Array::New(env, message->words.size());
					for (size_t index = 0; index < message->words.size(); ++index) words.Set(index, Napi::Number::New(env, message->words[index]));
					value.Set("words", words);
					callback.Call({ value });
					delete message;
				});
				offset += count;
			}
			packet = MIDIEventPacketNext(packet);
		}
	}

	void RefreshPorts(bool notify) {
		std::vector<PortPayload> snapshot;
		{
			std::scoped_lock lock(mutex_);
			if (!started_) return;
			RefreshPortsLocked();
			snapshot = ports_;
		}
		if (notify) NotifyPorts(snapshot);
	}

	void RefreshPortsLocked() {
		ports_.clear();
		destinations_.clear();
		std::unordered_set<MIDIEndpointRef> currentSources;

		for (ItemCount index = 0; index < MIDIGetNumberOfSources(); ++index) {
			const auto endpoint = MIDIGetSource(index);
			if (!endpoint) continue;
			const auto id = GetEndpointId(endpoint);
			ports_.push_back({ id, GetStringProperty(endpoint, kMIDIPropertyDisplayName), GetStringProperty(endpoint, kMIDIPropertyManufacturer), "input" });
			currentSources.insert(endpoint);
			if (!sourceContexts_.contains(endpoint)) sourceContexts_[endpoint] = std::make_unique<SourceContext>(SourceContext{ id });
			if (!connectedSources_.contains(endpoint) && MIDIPortConnectSource(inputPort_, endpoint, sourceContexts_[endpoint].get()) == noErr) connectedSources_.insert(endpoint);
		}

		for (auto iterator = connectedSources_.begin(); iterator != connectedSources_.end();) {
			if (!currentSources.contains(*iterator)) {
				MIDIPortDisconnectSource(inputPort_, *iterator);
				iterator = connectedSources_.erase(iterator);
			} else ++iterator;
		}

		for (ItemCount index = 0; index < MIDIGetNumberOfDestinations(); ++index) {
			const auto endpoint = MIDIGetDestination(index);
			if (!endpoint) continue;
			const auto id = GetEndpointId(endpoint);
			ports_.push_back({ id, GetStringProperty(endpoint, kMIDIPropertyDisplayName), GetStringProperty(endpoint, kMIDIPropertyManufacturer), "output" });
			destinations_[id] = endpoint;
		}
	}

	Napi::Array PortsToJS(Napi::Env env, const std::vector<PortPayload>& ports) {
		auto result = Napi::Array::New(env, ports.size());
		for (size_t index = 0; index < ports.size(); ++index) {
			auto value = Napi::Object::New(env);
			value.Set("id", ports[index].id);
			value.Set("name", ports[index].name.empty() ? "CoreMIDI endpoint" : ports[index].name);
			value.Set("manufacturer", ports[index].manufacturer.empty() ? "Apple CoreMIDI" : ports[index].manufacturer);
			value.Set("version", "2.0");
			value.Set("type", ports[index].type);
			value.Set("nativeDataFormat", "ump");
			result.Set(index, value);
		}
		return result;
	}

	void NotifyPorts(const std::vector<PortPayload>& ports) {
		auto snapshot = new std::vector<PortPayload>(ports);
		portsCallback_.NonBlockingCall(snapshot, [this](Napi::Env env, Napi::Function callback, std::vector<PortPayload>* values) {
			callback.Call({ PortsToJS(env, *values) });
			delete values;
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

NODE_API_MODULE(photosynth_macos_coremidi, Init)

}
