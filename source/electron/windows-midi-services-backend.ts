import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

export const validateUMPWords = words => {
	if (!Array.isArray(words) || words.length < 1 || words.length > 4) {
		throw new TypeError('A UMP message must contain between one and four 32-bit words')
	}

	if (words.some(word => !Number.isInteger(word) || word < 0 || word > 0xffffffff)) {
		throw new TypeError('UMP words must be unsigned 32-bit integers')
	}

	const packetWords = [1, 1, 1, 2, 2, 4, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4][(words[0] >>> 28) & 0xf]
	if (words.length !== packetWords) throw new TypeError(`UMP message type requires ${packetWords} word(s)`)

	return words.map(word => word >>> 0)
}

export const normalisePorts = ports => {
	const normalised = ports.map(port => ({
		id:String(port.id),
		name:String(port.name || 'Windows MIDI endpoint'),
		manufacturer:String(port.manufacturer || 'Microsoft Windows MIDI Services'),
		version:String(port.version || '2.0'),
		type:port.type || 'bidirectional',
		nativeDataFormat:port.nativeDataFormat || 'ump',
	}))

	return {
		inputs:normalised.filter(port => port.type !== 'output').map(port => ({ ...port, type:'input' })),
		outputs:normalised.filter(port => port.type !== 'input').map(port => ({ ...port, type:'output' })),
	}
}

export const createNativeMIDIBackend = (
	binding,
	events,
) => {
	let ports = []
	const updatePorts = nextPorts => {
		ports = nextPorts
		events.onPortsChanged(normalisePorts(ports))
	}

	const result = binding.start({
		onMessage:message => events.onMessage({ ...message, words:validateUMPWords(message.words) }),
		onPortsChanged:updatePorts,
	})
	ports = result.ports ?? []

	return {
		get inputs(){ return normalisePorts(ports).inputs },
		get outputs(){ return normalisePorts(ports).outputs },
		send:(endpointId, words, timestamp = 0) => binding.send(endpointId, validateUMPWords(words), timestamp),
		destroy:() => binding.stop(),
	}
}

export const createWindowsMIDIServicesBackend = createNativeMIDIBackend

export const getNativeMIDIAddon = platform => ({
	win32:{ packageName:'@photosynth/windows-midi-services', binary:'photosynth_windows_midi.node', label:'Windows MIDI Services' },
	darwin:{ packageName:'@photosynth/macos-coremidi', binary:'photosynth_macos_coremidi.node', label:'CoreMIDI MIDI 2.0' },
}[platform] ?? null)

export const loadNativeMIDIBinding = () => {
	const addon = getNativeMIDIAddon(process.platform)
	if (!addon) return null

	try {
		const moduleBase = process.defaultApp
			? path.join(process.cwd(), 'package.json')
			: path.join(process.resourcesPath, 'app.asar', 'package.json')
		const require = createRequire(moduleBase)
		const nativeAddon = process.defaultApp
			? path.join(process.cwd(), 'dist-electron/native', addon.binary)
			: path.join(process.resourcesPath, 'app.asar.unpacked/dist-electron/native', addon.binary)
		if (fs.existsSync(nativeAddon)) return require(nativeAddon)
		return require(addon.packageName)
	} catch (error) {
		console.info(`${addon.label} native backend unavailable; using Web MIDI`, error)
		return null
	}
}

export const loadWindowsMIDIServicesBinding = loadNativeMIDIBinding
