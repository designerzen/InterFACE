import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import {
	getLipVolume, getLipCurvePosition, normaliseLipOptions, normaliseLipRangeOverride, normaliseMouthDynamicsOverride,
	normaliseMouthDynamics, normaliseMouthGate, parseMouthCurve, serialiseMouthCurve, evaluateMouthCurve,
	getMouthDynamicsPresetId, resolveLipSetting, formatLipSetting, LIP_SENSITIVITY_INHERIT,
	MOUTH_DYNAMICS_PRESETS, MOUTH_CURVE_CUSTOM, MAX_MOUTH_CURVE_POINTS, DEFAULT_MOUTH_GATE
} from '../source/people/lip-sensitivity.js'
import { parseType } from '../source/utils/location-handler.js'
import { easeInSine, easeOutExpo, easeOutSine } from '../source/maths/easing.js'

const options = { mouthCutOff:0.06, lipRange:'long', mouthDynamics:'gentle' }
const gateOpening = Math.acos(1 - options.mouthCutOff) * 2 / Math.PI

// Exercise the actual Person methods without loading browser/audio engines.
const source = readFileSync('source/people/person.js', 'utf8')
const method = name => {
	const start = source.indexOf(`\t${name}(`)
	assert.ok(start >= 0)
	return source.slice(start, source.indexOf('\n\t}', start) + 3).trim()
}

test('curves survive the URL state parser and normalise to fixed ends', () => {
	for (const preset of MOUTH_DYNAMICS_PRESETS) {
		const stored = serialiseMouthCurve(preset.points)
		// Commas would come back as arrays and leading digits as numbers.
		assert.equal(parseType(stored), stored)
		assert.deepEqual(parseMouthCurve(stored), preset.points)
		assert.equal(getMouthDynamicsPresetId(stored), preset.id)
	}
	assert.deepEqual(parseMouthCurve([[60, 20], [0, 50], [30, 120], [31, 5], [100, 0]]), [[0, 0], [30, 100], [60, 20], [100, 100]])
	assert.equal(parseMouthCurve(Array.from({ length:20 }, (_, i) => [i * 5 + 3, i * 5])).length, MAX_MOUTH_CURVE_POINTS)
	assert.equal(normaliseMouthDynamics('bad'), serialiseMouthCurve(parseMouthCurve('gentle')))
	assert.equal(normaliseMouthDynamics(true), normaliseMouthDynamics('gentle'))
	assert.equal(getMouthDynamicsPresetId('c0x0_50x10_100x100'), MOUTH_CURVE_CUSTOM)
	assert.equal(formatLipSetting('mouthDynamics', 'c0x0_50x10_100x100'), 'Custom curve')
	assert.equal(formatLipSetting('mouthDynamics', 'whisper'), 'Whisper')
	assert.equal(normaliseMouthGate(undefined), DEFAULT_MOUTH_GATE)
	assert.equal(normaliseMouthGate(90), 40)
	assert.equal(normaliseMouthGate('12'), 12)
})

test('curve interpolation passes through handles, stays bounded and never overshoots', () => {
	for (const { points } of MOUTH_DYNAMICS_PRESETS) {
		for (const [x, y] of points) assert.ok(Math.abs(evaluateMouthCurve(points, x / 100) - y / 100) < 1e-9)
		let previous = 0
		for (let i = 0; i <= 1000; i++) {
			const volume = evaluateMouthCurve(points, i / 1000)
			assert.ok(volume >= previous - 1e-12 && volume <= 1)
			previous = volume
		}
	}
	// A flat quiet shelf stays flat instead of dipping below silence.
	const shelf = [[0, 0], [20, 5], [60, 5], [100, 100]]
	for (let i = 20; i <= 60; i++) assert.ok(Math.abs(evaluateMouthCurve(shelf, i / 100) - 0.05) < 1e-9)
	assert.equal(evaluateMouthCurve(shelf, NaN), 0)
	assert.equal(evaluateMouthCurve(shelf, 2), 1)
})

test('quiet presets give small openings more room than punchy ones', () => {
	const at = (mouthDynamics, t) => evaluateMouthCurve(mouthDynamics, t)
	for (const t of [0.1, 0.2, 0.3]) {
		assert.ok(at('whisper', t) < at('gentle', t))
		assert.ok(at('gentle', t) < at('linear', t))
		assert.ok(at('linear', t) < at('punchy', t))
	}
	const small = gateOpening + 0.02
	assert.ok(getLipVolume(small, options) > 0 && getLipVolume(small, options) < 0.05)
	assert.ok(getLipVolume(small, options) < getLipVolume(small, { ...options, mouthDynamics:'punchy' }))
})

test('the gate stays silent, full travel is full volume, and range scales travel', () => {
	for (const { id } of MOUTH_DYNAMICS_PRESETS) {
		const settings = { ...options, mouthDynamics:id }
		assert.equal(getLipVolume(gateOpening - 1e-8, settings), 0)
		assert.ok(getLipVolume(gateOpening + 1e-8, settings) < 1e-4)
		assert.equal(getLipVolume(1, settings), 1)
		assert.equal(getLipVolume(1, settings, 1), 1)
		assert.equal(getLipVolume(0, settings, 0), 0)
		let previous = 0
		for (let i = 0; i <= 110; i++) {
			const volume = getLipVolume(i / 100, settings)
			assert.ok(volume >= previous - 1e-12 && volume <= 1)
			previous = volume
		}
	}
	const shortEnd = gateOpening + (1 - gateOpening) * 0.5
	assert.ok(Math.abs(getLipVolume(shortEnd, { ...options, lipRange:'short' }) - 1) < 1e-12)
	assert.ok(getLipVolume(shortEnd, options) < 1)
	for (const input of [NaN, undefined, Infinity, -1]) assert.equal(getLipVolume(input, options), 0)
	assert.equal(getLipCurvePosition(gateOpening, options), 0)
	assert.equal(getLipCurvePosition(1, options), 1)
})

test('person overrides pick their own curve and return to the latest global one', () => {
	const person = { ...options, mouthDynamicsOverride:'punchy', lipRangeOverride:'inherit' }
	assert.equal(resolveLipSetting(person, 'mouthDynamics'), normaliseMouthDynamics('punchy'))
	assert.equal(getLipVolume(0.4, person), getLipVolume(0.4, { ...options, mouthDynamics:'punchy' }))
	person.mouthDynamics = 'whisper'
	person.mouthDynamicsOverride = 'inherit'
	assert.equal(getLipVolume(0.4, person), getLipVolume(0.4, { ...options, mouthDynamics:'whisper' }))
	assert.equal(normaliseMouthDynamicsOverride(37), LIP_SENSITIVITY_INHERIT)
	assert.equal(normaliseLipRangeOverride('63'), 63)
	assert.deepEqual(normaliseLipOptions({ lipRange:'bad', lipRangeOverride:'bad', mouthDynamics:'bad', mouthDynamicsOverride:null }), {
		lipRange:100, lipRangeOverride:'inherit', mouthDynamics:normaliseMouthDynamics('gentle'), mouthDynamicsOverride:'inherit'
	})
})

test('compact person state round-trips overrides and reads older links', () => {
	const State = new Function('normaliseMouthDynamicsOverride', 'normaliseLipRangeOverride', `
		const EXPORT_DELIMITER = ','
		const INSTRUMENT_TYPE_SOUNDFONT = 'soundfont'
		const normalisePointsOverride = value => value
		const normaliseHeadNoteRangeOverride = value => value
		const normaliseHeadVerticalRangeOverride = value => value
		const console = { error() {} }
		return class { ${method('static createDataExport')} ${method('static parseDataExport')} ${method('importData')} }
	`)(normaliseMouthDynamicsOverride, normaliseLipRangeOverride)
	for (const curve of ['inherit', 'whisper', 'c0x0_40x8_100x100']) for (const range of ['inherit', 'short', 0, 63, 100]) {
		const exported = State.createDataExport(2, 'soundfont', 0, undefined, undefined, undefined, undefined, undefined, normaliseMouthDynamicsOverride(curve), range)
		const imported = new State().importData(State.parseDataExport(exported))
		assert.equal(imported.mouthDynamicsOverride, normaliseMouthDynamicsOverride(curve))
		assert.equal(imported.lipRangeOverride, normaliseLipRangeOverride(range))
	}
	// Older links stored a numeric lip response in the curve slot.
	assert.equal(new State().importData(State.parseDataExport('2,soundfont,0,,,,,,100,50')).mouthDynamicsOverride, 'inherit')
	const legacy = new State().importData(State.parseDataExport('2,soundfont,0'))
	assert.equal(legacy.mouthDynamicsOverride, undefined)
	assert.equal(legacy.lipRangeOverride, undefined)
})

test('Person singing applies the curve to gain and velocity without moving the note gate', () => {
	const dependencies = {
		getLipVolume, getLipCurvePosition, easeInSine,
		clamp:(value, min, max) => Math.min(max, Math.max(min, value)),
		getNoteNameFromPercentage:() => 'C4',
		convertNoteNameToMIDINoteNumber:() => 60,
		getNoteSoundFromNumber:() => 'Do',
		getFriendlyNoteName:() => 'C',
		getHeadNoteIndex:() => 0,
		STATE_INSTRUMENT_ATTACK:'attack', STATE_INSTRUMENT_SUSTAIN:'sustain',
		STATE_INSTRUMENT_SILENT:'silent', STATE_INSTRUMENT_RELEASE:'release',
		STATE_INSTRUMENT_DECAY:'decay'
	}
	const sing = new Function(...Object.keys(dependencies), `return ({ ${method('sing')} }).sing`)(...Object.values(dependencies))
	const person = {
		options:{ ...options, maximumAmplitude:0.6, mouthSilence:0.03 },
		data:{ mouthRatio:gateOpening + 0.05, happiness:0 },
		percentageDead:0, leftFacingKeys:[], rightFacingKeys:[],
		activeInstrument:{}, gainNode:{ gain:{ value:0 } },
		controlMode:() => ({ noteNumber:0, newOctave:4, octaveNumber:0, pitchBend:1 }),
		setNoteColour() {}, setState(state) { this.state = state }
	}
	const gentle = sing.call(person)
	assert.equal(gentle.singing, true)
	assert.equal(person.noteVelocity, gentle.volume)
	assert.equal(person.gainNode.gain.value, gentle.volume)
	assert.ok(person.mouthCurvePosition > 0 && person.mouthCurvePosition < 1)
	person.options.mouthDynamicsOverride = 'punchy'
	const punchy = sing.call(person)
	assert.equal(punchy.singing, true)
	assert.ok(punchy.volume > gentle.volume)
	// A barely open smiling mouth must not inherit the exaggerated expression
	// signal or happiness as its loudness.
	person.options.mouthDynamicsOverride = 'inherit'
	person.data.mouthVolumeRatio = 0.06
	person.data.mouthRatio = easeOutExpo(easeOutSine(0.06))
	person.data.happiness = 1
	const quiet = sing.call(person)
	assert.equal(quiet.singing, true)
	assert.ok(quiet.volume > 0 && quiet.volume < 0.02)
	person.options.mouthDynamics = 'whisper'
	assert.ok(sing.call(person).volume < quiet.volume)
	person.data.mouthVolumeRatio = 0
	person.data.happiness = 0
	person.data.mouthRatio = 0
	assert.equal(sing.call(person).volume, 0)
	assert.equal(person.singing, false)
})

test('person curve select and range toggle stay in sync with inherited values', () => {
	const scope = {
		normaliseLipOptions, normaliseMouthDynamicsOverride, normaliseLipRangeOverride, resolveLipSetting,
		formatLipSetting, getMouthDynamicsPresetId, LIP_SENSITIVITY_INHERIT, EVENT_PERSON_OPTIONS_CHANGED:'options'
	}
	const methods = new Function(...Object.keys(scope), `return ({ ${method('setPanelOption')}, ${method('syncLipSensitivityControls')} })`)(...Object.values(scope))
	const input = { id:'person-a-lip-range', setAttribute() {} }
	const toggle = {}
	const output = {}
	const select = {}
	const person = {
		...methods,
		options:{ lipRange:100, lipRangeOverride:'inherit', mouthDynamics:'gentle', mouthDynamicsOverride:'inherit' },
		controls:{ querySelector(selector) {
			if (selector.includes('mouthDynamicsOverride')) return select
			if (selector.endsWith('-output')) return output
			return selector.includes('OverrideEnabled') ? toggle : input
		} },
		setOptions(settings) { Object.assign(this.options, normaliseLipOptions(settings)); this.syncLipSensitivityControls() },
		dispatchPersonEvent() {}
	}
	person.setPanelOption('mouthDynamicsOverride', 'whisper')
	assert.equal(person.options.mouthDynamicsOverride, normaliseMouthDynamics('whisper'))
	assert.equal(select.value, 'whisper')
	person.setPanelOption('mouthDynamicsOverride', 'inherit')
	assert.equal(select.value, 'inherit')
	person.setOptions({ lipRange:0 })
	person.setPanelOption('lipRangeOverrideEnabled', true)
	assert.equal(person.options.lipRangeOverride, 0)
	assert.equal(input.disabled, false)
	person.setOptions({ lipRange:75 })
	assert.equal(input.value, 0)
	person.setPanelOption('lipRangeOverrideEnabled', false)
	assert.equal(input.disabled, true)
	assert.equal(input.value, 75)
	assert.equal(output.value, '75% long')
	assert.equal(toggle.checked, false)
})
