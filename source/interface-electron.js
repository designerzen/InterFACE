import { APPLICATION_EVENTS, createInterface } from './interface.js'
import MIDIBridgeConnection from './audio/midi/midi-connection-electron-bridge.js'
import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'

/**
 * Electron-specific interface composition.
 *
 * The application implementation remains in interface.js. Desktop-only
 * connections are supplied here so the web and Electron renderers cannot
 * drift into separate implementations again.
 */
export const getElectronMIDIConnectionClasses = () => {
	const connections = [WebMIDIClass]

	if (globalThis.electron?.midi?.available) {
		connections.unshift(MIDIBridgeConnection)
	}

	return connections
}

export { APPLICATION_EVENTS, createInterface }
