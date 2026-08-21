import { createMIDIStatusEntries } from '../source/dom/ui.midi.js'
import { isDigitCMPSRPort } from '../source/hardware/digit/cmpsr.js'

describe('MIDI HUD status entries', () => {
	test('lists every person sharing a single MIDI output', () => {
		const people = [
			{ name: 'Ada', playerNumber: 0, midiChannel: 'all' },
			{ name: 'Grace', playerNumber: 1, midiChannel: 'all' },
			{ name: 'Max', playerNumber: 2, midiChannel: 'all' },
		]
		const output = {
			id: 'synth-out',
			name: 'Stage Synth',
			manufacturer: 'Acme',
			state: 'connected',
			connection: 'open',
		}

		const [entry] = createMIDIStatusEntries(people, [output], [], 'all')
		const personConnections = entry.tooltipDetails.slice(-3)

		expect(entry.id).toBe('midi-output-synth-out')
		expect(entry.detail).toBe('Output · All channels (1–16) · 3 people')
		expect(personConnections).toEqual([
			{ label: 'Ada', value: 'Ada → Stage Synth · All channels (1–16)' },
			{ label: 'Grace', value: 'Grace → Stage Synth · All channels (1–16)' },
			{ label: 'Max', value: 'Max → Stage Synth · All channels (1–16)' },
		])
	})

	test('shows dedicated outputs, fallback routing, inputs, and every channel', () => {
		const people = [
			{ name: 'One', playerNumber: 0, midiChannel: 0 },
			{ name: 'Two', playerNumber: 1, midiChannel: 1 },
			{ name: 'Three', playerNumber: 2, midiChannel: 2 },
		]
		const outputs = [
			{ id: 'out-a', name: 'Synth A' },
			{ id: 'out-b', name: 'Synth B' },
		]
		const inputs = [{ id: 'in-a', name: 'Keys', manufacturer: 'Acme' }]

		const entries = createMIDIStatusEntries(people, outputs, inputs, 'all')
		const [input, outputA, outputB] = entries

		expect(input.id).toBe('midi-input-in-a')
		expect(input.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'Channels', value: 'All channels (1–16)' },
			{ label: 'One', value: 'Receives input when active · All channels (1–16)' },
			{ label: 'Two', value: 'Receives input when active · All channels (1–16)' },
			{ label: 'Three', value: 'Receives input when active · All channels (1–16)' },
		]))
		expect(outputA.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'One', value: 'One → Synth A · Channel 1' },
			{ label: 'Three', value: 'Three → Synth A · Channel 3' },
		]))
		expect(outputB.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'Two', value: 'Two → Synth B · Channel 2' },
		]))
	})

	test('detects DIGIT CMPSR MIDI identifiers and announces availability', () => {
		const cmpsrInput = {
			id: 'digit-cmpsr-midi-in',
			name: 'CMPSR MIDI 1',
			manufacturer: 'Digit Music',
		}
		const [entry] = createMIDIStatusEntries([], [], [cmpsrInput])

		expect(isDigitCMPSRPort(cmpsrInput)).toBe(true)
		expect(isDigitCMPSRPort({ id: 'bluetooth-midi', name: 'Digit Composer' })).toBe(true)
		expect(isDigitCMPSRPort({ id: 'other', name: 'Stage Synth', manufacturer: 'Digitone' })).toBe(false)
		expect(entry.label).toBe('DIGIT CMPSR')
		expect(entry.detail).toContain('Available · Input')
		expect(entry.tooltipDetails).toContainEqual({ label: 'Device', value: 'DIGIT CMPSR' })
	})
})
