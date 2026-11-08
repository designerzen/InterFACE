const portTransports = new WeakMap()
export const setMIDIPortTransport = (port, transport) => portTransports.set(port, transport)
export const getMIDIPortTransport = port => port.transport ?? port.connectionType ?? portTransports.get(port) ?? 'System MIDI (transport not reported)'

export const getPersonMIDIOutputs = (person, outputs = [], index = person?.playerNumber ?? 0) => {
	const selection = String(person?.options?.midiDevice ?? 'auto')
	if (selection === 'none') return []
	if (selection === 'all') return outputs
	if (selection !== 'auto') return outputs.filter(port => String(port.id) === selection || port.name === selection)
	return outputs.length ? [outputs[index % outputs.length]] : []
}

export const getPersonMIDIChannel = (person, outputs = [], people = [], index = person?.playerNumber ?? 0) => {
	const selection = person?.options?.midiPort ?? 'auto'
	if (selection === 'all') return 'all'
	if (selection !== 'auto' && Number(selection) >= 1 && Number(selection) <= 16) return Number(selection)
	// Shared outputs use separate channels; dedicated outputs use every channel.
	return outputs.length <= 1 || outputs.length < people.length ? (index % 16) + 1 : 'all'
}
