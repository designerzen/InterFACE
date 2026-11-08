import EyeInstrumentGesture, { eyeInstrumentHoldMs } from '../source/people/eye-instrument-gesture.js'
import { choosePersonInstrument, getPersonInstrumentChoices } from '../source/people/person-instrument-choices.js'
import { GENERAL_MIDI_INSTRUMENT_DATA } from '../source/audio/general-midi-instruments.data.js'
import { FAMILY_BASS, FAMILY_CHROMATIC_PERCUSSION, FAMILY_ETHNIC, FAMILY_PERCUSSIVE } from '../source/audio/midi/general-midi-instrument.constants.js'
import { readFileSync } from 'fs'
import { DEFAULT_EYE_INSTRUMENT_GESTURE_OPTIONS } from '../source/settings/options.gestures.js'
import { getPersonQueryOptions } from '../source/people/person.query.js'

test.each([[100,500], [400,500], [800,1000], [1600,2000], [4000,2000], [60000,2000]])(
	'a %s ms bar gives a %s ms hold within the default limits', (barMs, expected) => {
		expect(eyeInstrumentHoldMs(barMs)).toBe(expected)
	})

test('runtime options configure bars and bounds without becoming state machine settings', () => {
	expect(eyeInstrumentHoldMs(1000, {holdBars:1.4, minHoldMs:300, maxHoldMs:3000})).toBe(1400)
	expect(eyeInstrumentHoldMs(1000, {holdBars:14})).toBe(2000)
	expect(eyeInstrumentHoldMs(1, {minHoldMs:750})).toBe(750)
	expect(eyeInstrumentHoldMs(10000, {maxHoldMs:1500})).toBe(1500)
	expect(eyeInstrumentHoldMs(NaN, {fallbackBarMs:800})).toBe(1000)
	expect(eyeInstrumentHoldMs(1000, {holdBars:NaN, minHoldMs:-1, maxHoldMs:Infinity})).toBe(1250)
	expect(eyeInstrumentHoldMs(1000, {minHoldMs:1500, maxHoldMs:1000})).toBe(1500)
	const query = Object.fromEntries(Object.keys(DEFAULT_EYE_INSTRUMENT_GESTURE_OPTIONS).map(key => [`p-1-${key}`, 1]))
	expect(getPersonQueryOptions(query, ['p-1'])).toEqual({})
})

const frame = (pose, time) => ({time, leftEyeClosed:pose === 'left' || pose === 'both', rightEyeClosed:pose === 'right' || pose === 'both'})
const hold = (gesture, pose, from, to, bar = 2000, blocked = false) => {
	const actions = []
	for (let time = from; time <= to; time += 100) {
		const action = gesture.update(frame(pose, time), time, bar, blocked)
		if (action) actions.push(action)
	}
	return actions
}

test.each(['left', 'right', 'both'])('%s eye holds respect both default time limits', pose => {
	const slow = new EyeInstrumentGesture()
	expect(hold(slow, pose, 0, 1900, 60000)).toEqual([])
	expect(hold(slow, pose, 2000, 5000, 60000)).toHaveLength(1)
	const fast = new EyeInstrumentGesture()
	expect(hold(fast, pose, 0, 400, 100)).toEqual([])
	expect(hold(fast, pose, 500, 1000, 100)).toHaveLength(1)
})

test.each([['left','previous'], ['right','next'], ['both','random']])('%s triggers %s once after more than one bar', (pose, action) => {
	const gesture = new EyeInstrumentGesture({maxHoldMs:10000})
	expect(hold(gesture, pose, 0, 2400)).toEqual([])
	expect(hold(gesture, pose, 2500, 9000)).toEqual([action])
	expect(hold(gesture, 'both', 9100, 12000)).toEqual([])
	gesture.update(frame('open', 12100), 12100, 2000)
	expect(hold(gesture, pose, 12200, 15000)).toEqual([action])
})

test('blinks, changing poses and tracking loss cancel incomplete holds', () => {
	const gesture = new EyeInstrumentGesture({maxHoldMs:10000})
	expect(hold(gesture, 'left', 0, 100)).toEqual([])
	gesture.update(frame('open', 200), 200, 2000)
	expect(hold(gesture, 'left', 300, 2300)).toEqual([])
	expect(hold(gesture, 'both', 2400, 4400)).toEqual([])
	gesture.update(null, 4500, 2000)
	expect(hold(gesture, 'both', 4600, 6600)).toEqual([])
	expect(hold(gesture, 'both', 6700, 7200)).toEqual(['random'])
})

test('stale cached predictions and long gaps do not count as a held gesture', () => {
	const gesture = new EyeInstrumentGesture({maxHoldMs:10000})
	hold(gesture, 'both', 0, 2000)
	expect(gesture.update(frame('both', 2000), 2600, 2000)).toBeNull()
	expect(hold(gesture, 'both', 2700, 4700)).toEqual([])
	expect(gesture.update(frame('both', 6000), 6000, 2000)).toBeNull()
	expect(hold(gesture, 'both', 6100, 8500)).toEqual(['random'])
})

test('loading blocks gestures and duration follows bar length, frozen at gesture start', () => {
	const gesture = new EyeInstrumentGesture({maxHoldMs:10000})
	expect(eyeInstrumentHoldMs(4000, {maxHoldMs:10000})).toBe(5000)
	expect(eyeInstrumentHoldMs(undefined)).toBe(2000)
	expect(hold(gesture, 'both', 0, 6000, 4000, true)).toEqual([])
	gesture.update(frame('both', 6100), 6100, 4000)
	expect(hold(gesture, 'both', 6200, 11000, 1000)).toEqual([])
	expect(gesture.update(frame('both', 11100), 11100, 1000)).toBe('random')
})

test('role pools preserve percussion, harmony, bass and lead families', () => {
	const percussion = getPersonInstrumentChoices(0)
	expect(percussion.length).toBeGreaterThan(0)
	expect(percussion.every(program => [FAMILY_CHROMATIC_PERCUSSION, FAMILY_ETHNIC, FAMILY_PERCUSSIVE].includes(GENERAL_MIDI_INSTRUMENT_DATA[program].family))).toBe(true)
	const bass = GENERAL_MIDI_INSTRUMENT_DATA.filter(instrument => instrument.family === FAMILY_BASS).map(instrument => instrument.program)
	bass.forEach(program => expect(getPersonInstrumentChoices(2)).toContain(program))
	expect(getPersonInstrumentChoices(1).length).toBeGreaterThan(getPersonInstrumentChoices(3).length)
	expect(getPersonInstrumentChoices(3)).not.toEqual(percussion)
})

test('previous and next wrap within the pool and random excludes the current preset', () => {
	const choices = [8, 10, 14]
	expect(choosePersonInstrument(choices, 14, 'next')).toBe(8)
	expect(choosePersonInstrument(choices, 8, 'previous')).toBe(14)
	expect(choosePersonInstrument(choices, 9, 'next')).toBe(10)
	expect(choosePersonInstrument(choices, 9, 'previous')).toBe(8)
	expect(choosePersonInstrument(choices, 10, 'random', () => 0)).toBe(8)
	expect(choosePersonInstrument(choices, 10, 'random', () => 0.99)).toBe(14)
	expect(choosePersonInstrument([], 0, 'next')).toBeNull()
})

const loadGesturePreset = () => {
	const source = readFileSync('source/people/person.js', 'utf8')
	const start = source.indexOf('\tasync loadEyeGesturePreset(action){')
	const body = source.slice(start + '\tasync loadEyeGesturePreset(action){'.length, source.indexOf('\n\t}', start))
	const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
	const load = new AsyncFunction('action','getPersonInstrumentChoices','choosePersonInstrument','getInstrumentTitle',body)
	return (person, action) => load.call(person, action, getPersonInstrumentChoices, choosePersonInstrument, program => `Preset ${program}`)
}

test('preset loading uses the person role, prevents overlap and releases the loading guard', async () => {
	let finish
	const person = {playerNumber:0, activeInstrument:{activePresetIndex:8}, loadPreset:jest.fn(() => new Promise(resolve => {finish=resolve}))}
	const load = loadGesturePreset()
	const pending = load(person, 'next')
	expect(person.loadPreset).toHaveBeenCalledWith(9, 'Preset 9')
	await load(person, 'previous')
	expect(person.loadPreset).toHaveBeenCalledTimes(1)
	finish()
	await pending
	expect(person.eyeInstrumentLoading).toBe(false)
	person.loadPreset.mockRejectedValueOnce(new Error('Unavailable'))
	await expect(load(person, 'next')).rejects.toThrow('Unavailable')
	expect(person.eyeInstrumentLoading).toBe(false)
})

test('imported banks navigate their own available presets', async () => {
	const person = {playerNumber:2, activeInstrument:{activePresetIndex:1, instruments:[{isGeneralMIDIBank:false}], getPresets:async () => ['Custom A','Custom B','Custom C']}, loadPreset:jest.fn()}
	await loadGesturePreset()(person, 'next')
	expect(person.loadPreset).toHaveBeenCalledWith(2, 'Custom C')
})
