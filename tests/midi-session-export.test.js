import { createMIDIFileFromEvents } from '../source/audio/midi/midi-file-create.js'

test('exports timestamped session notes as a valid MIDI track', () => {
	const bytes = createMIDIFileFromEvents([
		{ time: 0, type: 'noteOn', note: 60, velocity: 1 },
		{ time: 500, type: 'noteOff', note: 60, velocity: 0 }
	], { bpm: 120, ppq: 480 })
	expect(Array.from(bytes.slice(0, 4))).toEqual([0x4d, 0x54, 0x68, 0x64])
	expect(Array.from(bytes)).toEqual(expect.arrayContaining([0x4d, 0x54, 0x72, 0x6b]))
	expect(Array.from(bytes)).toContain(0x90)
	expect(Array.from(bytes)).toContain(0x80)
})
