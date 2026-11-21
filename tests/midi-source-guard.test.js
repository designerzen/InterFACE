jest.mock('../source/storage/session-midi-output.js', () => ({ recordMIDIOutput: jest.fn() }))

import { forgetMIDIInputNotes, isSameMIDIHardware, recordMIDIInputNote, sendGuardedMIDIOutput } from '../source/audio/midi/midi-echo-guard.js'
import { getMIDIDeviceIntegration, setMIDIDeviceIntegration } from '../source/audio/midi/midi-device-integration.js'

const createOutput = (id, name, manufacturer = 'Arcana') => ({ id, name, manufacturer, playNote: jest.fn(), stopNote: jest.fn() })
const strumInput = { id: 'strum-in', name: 'Arcana Strum', manufacturer: 'Arcana' }

afterEach(() => {
	forgetMIDIInputNotes(strumInput)
	jest.useRealTimers()
})

test('a note a device plays is never sent back to that device', () => {
	const strumOutput = createOutput('strum-out', 'Arcana Strum')
	recordMIDIInputNote(strumInput, 52, true)

	expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 52, { channels: 1 }, 'face')).toBe(false)
	expect(strumOutput.playNote).not.toHaveBeenCalled()
})

test('other notes, and other devices, still receive it', () => {
	const strumOutput = createOutput('strum-out-2', 'Arcana Strum')
	const synth = createOutput('synth-out', 'Synth', 'Acme')
	recordMIDIInputNote(strumInput, 53, true)

	expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 57, { channels: 1 }, 'face')).toBe(true)
	expect(sendGuardedMIDIOutput(synth, 'playNote', 53, { channels: 1 }, 'face')).toBe(true)
})

test('the note stays blocked briefly after release, then is allowed', () => {
	jest.useFakeTimers({ now: 0 })
	const strumOutput = createOutput('strum-out-3', 'Arcana Strum')
	recordMIDIInputNote(strumInput, 55, true)
	recordMIDIInputNote(strumInput, 55, false)

	jest.advanceTimersByTime(100)
	expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 55, { channels: 1 }, 'face')).toBe(false)
	jest.advanceTimersByTime(300)
	expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 55, { channels: 1 }, 'face')).toBe(true)
})

test('a device without echo can be sent the note it holds, but not just after release', () => {
	jest.useFakeTimers({ now: 0 })
	const strumOutput = createOutput('strum-out-4', 'Arcana Strum')
	setMIDIDeviceIntegration(strumInput, { echoes: false })
	try {
		recordMIDIInputNote(strumInput, 60, true)
		expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 60, { channels: 1 }, 'face')).toBe(true)
		sendGuardedMIDIOutput(strumOutput, 'stopNote', 60, { channels: 1 }, 'face')
		recordMIDIInputNote(strumInput, 60, false)
		jest.advanceTimersByTime(100)
		expect(sendGuardedMIDIOutput(strumOutput, 'playNote', 60, { channels: 1 }, 'face')).toBe(false)
	} finally {
		setMIDIDeviceIntegration(strumInput, { echoes: true })
	}
})

test('devices are assumed to echo until told otherwise', () => {
	expect(getMIDIDeviceIntegration({ name: 'Unseen', manufacturer: 'Acme' }).echoes).toBe(true)
})

test('recognises the input and output halves of one device', () => {
	expect(isSameMIDIHardware({ id: 'a', name: 'MPK mini 3 IN', manufacturer: 'Akai' }, { id: 'b', name: 'MPK mini 3 OUT', manufacturer: 'Akai' })).toBe(true)
	expect(isSameMIDIHardware({ id: 'a', name: 'MIDIIN2 (Launchkey)', manufacturer: '' }, { id: 'b', name: 'MIDIOUT2 (Launchkey)', manufacturer: '' })).toBe(true)
	expect(isSameMIDIHardware({ id: 'a', name: 'Keys', manufacturer: 'Acme' }, { id: 'b', name: 'Synth', manufacturer: 'Acme' })).toBe(false)
})
