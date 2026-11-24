import { WebMidi } from 'webmidi'

let activeManager = null
const portListeners = new Set()

const hasActiveManager = () => Boolean(activeManager?.enabled && activeManager.connections?.length)

export const registerActiveMIDIManager = manager => {
	activeManager = manager ?? null
	notifyMIDIPortsChanged()
}

export const notifyMIDIPortsChanged = () => {
	const inputs = getMIDIInputs()
	const outputs = getMIDIOutputs()
	for (const listener of portListeners) listener(outputs, inputs)
}

export const getMIDIInputs = () =>
	hasActiveManager() ? (activeManager.inputs ?? []) : (WebMidi.inputs ?? [])

export const getMIDIOutputs = () =>
	hasActiveManager() ? (activeManager.outputs ?? []) : (WebMidi.outputs ?? [])

export const isMIDIEnabled = () =>
	hasActiveManager() || Boolean(WebMidi.enabled)

export const findMIDIOutput = identifier => {
	const outputs = getMIDIOutputs()
	return outputs.find(output => output.id === identifier) ??
		outputs.find(output => output.name === identifier) ??
		null
}

export const subscribeMIDIPorts = listener => {
	portListeners.add(listener)
	const onWebMidiChange = () => listener(getMIDIOutputs(), getMIDIInputs())
	WebMidi.addListener?.('connected', onWebMidiChange)
	WebMidi.addListener?.('disconnected', onWebMidiChange)
	return () => {
		portListeners.delete(listener)
		WebMidi.removeListener?.('connected', onWebMidiChange)
		WebMidi.removeListener?.('disconnected', onWebMidiChange)
	}
}
