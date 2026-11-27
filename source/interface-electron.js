import { APPLICATION_EVENTS, createInterface } from './interface.js'
import MIDIBridgeConnection from './audio/midi/midi-connection-electron-bridge.js'
import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'
import { createElectronLanTimingClient } from './network/lan-timing-client.js'

/**
 * Electron-specific interface composition.
 *
 * The application implementation remains in interface.js. Desktop-only
 * connections are supplied here so the web and Electron renderers cannot
 * drift into separate implementations again.
 */
export const getElectronMIDIConnectionClasses = () =>
	globalThis.electron?.midi?.available ? [MIDIBridgeConnection] : [WebMIDIClass]

export const getElectronCapabilities = () => ({
	apiVersion: globalThis.electron?.apiVersion ?? 1,
	nativeMIDI: Boolean(globalThis.electron?.midi?.available),
	nativeSerial: Boolean(globalThis.electron?.hardware?.serial?.available),
	nativeStorage: Boolean(globalThis.electron?.storage?.available),
	nativeBackingMelodyAI: Boolean(globalThis.electron?.ai?.backingMelody?.available),
	nativeLanTiming: Boolean(globalThis.electron?.network?.lan?.available),
	assetProtocol: globalThis.electron?.assets?.protocol ?? null,
})

export { APPLICATION_EVENTS, createInterface, createElectronLanTimingClient }
