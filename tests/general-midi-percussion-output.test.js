jest.mock('webmidi', () => ({
	WebMidi:{
		outputs:[],
		time:1000,
	},
}))

jest.mock('../source/audio/midi/midi-echo-guard.js', () => ({
	sendGuardedMIDIOutput:jest.fn(() => true),
}))

import { WebMidi } from 'webmidi'
import { sendGuardedMIDIOutput } from '../source/audio/midi/midi-echo-guard.js'
import {
	GENERAL_MIDI_PERCUSSION_CHANNEL,
	GENERAL_MIDI_PERCUSSION_NOTES,
	sendGeneralMIDIPercussion,
} from '../source/audio/midi/general-midi-percussion-output.js'

beforeEach(() => {
	WebMidi.outputs.length = 0
	WebMidi.outputs.push({ id:'one' }, { id:'two' })
})

test.each([
	['kickAcoustic', 35],
	['kick', 36],
	['clack', 37],
	['snare', 38],
	['clap', 39],
	['snareElectric', 40],
	['tomFloorLow', 41],
	['hatClosed', 42],
	['tomFloorHigh', 43],
	['hatPedal', 44],
	['hatOpen', 46],
	['tomLow', 45],
	['tomMid', 47],
	['tomMidHigh', 48],
	['tomHigh', 50],
	['cowbell', 56],
	['bongoHigh', 60],
	['bongoLow', 61],
	['congaMute', 62],
	['congaHigh', 63],
	['congaLow', 64],
	['cabasa', 69],
	['maracas', 70],
	['triangleMute', 80],
	['triangleOpen', 81],
	['rimshot', 37],
	['crossStick', 37],
	['claves', 75],
	['woodblockHigh', 76],
	['woodblockLow', 77],
	['castanets', 85],
	['crash', 49],
	['ride', 51],
	['rideBell', 53],
	['crash2', 57],
	['vibraslap', 58],
	['ride2', 59],
	['splash', 55],
	['china', 52],
	['tambourine', 54],
	['chekere', 82],
	['jingleBell', 83],
	['agogoHigh', 67],
	['agogoLow', 68],
	['timbaleHigh', 65],
	['timbaleLow', 66],
	['guiroShort', 73],
	['guiroLong', 74],
	['cuicaMute', 78],
	['cuicaOpen', 79],
	['whistleShort', 71],
	['whistleLong', 72],
	['surdoMute', 86],
	['surdoOpen', 87],
	['quijada', 74],
	['starChime', 84],
	['windChime', 84],
	['fingerSnap', 39],
	['syndrum', 47],
	['laserTom', 48],
	['metalHit', 53],
])('%s uses General MIDI percussion note %i on channel 10', (part, noteNumber) => {
	const audioContext = { currentTime:5 }

	expect(GENERAL_MIDI_PERCUSSION_NOTES[part]).toBe(noteNumber)
	expect(sendGeneralMIDIPercussion(part, {
		velocity:0.75,
		triggerAt:5.25,
	}, audioContext)).toBe(2)

	WebMidi.outputs.forEach(output => {
		expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
			output,
			'playNote',
			noteNumber,
			{
				channels:GENERAL_MIDI_PERCUSSION_CHANNEL,
				attack:0.75,
				time:1250,
			},
			`general-midi-percussion-${part}`
		)
	})
})

test('generic hats select the standard open or closed note', () => {
	sendGeneralMIDIPercussion('hat', { open:true })
	sendGeneralMIDIPercussion('hat', { open:false })

	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
		expect.anything(),
		'playNote',
		46,
		expect.objectContaining({ channels:10 }),
		'general-midi-percussion-hatOpen'
	)
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
		expect.anything(),
		'playNote',
		42,
		expect.objectContaining({ channels:10 }),
		'general-midi-percussion-hatClosed'
	)
})
