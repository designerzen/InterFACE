import PersonEyebrowEffects, { bendEyebrowInstrument, EYEBROW_AUDIO_EFFECTS } from '../source/audio/effects/person-eyebrows.js'
import { readFileSync } from 'fs'
import { exportPersonQueryOptions, getPersonQueryOptions } from '../source/people/person.query.js'

const parameter = () => ({ value:0, setTargetAtTime:jest.fn() })
const createContext = () => {
	const nodes = []
	const node = type => {
		const result = { type, connect:jest.fn(), disconnect:jest.fn() }
		for (const key of ['gain', 'frequency', 'Q', 'threshold', 'ratio', 'delayTime']) result[key] = parameter()
		nodes.push(result)
		return result
	}
	return {
		nodes, sampleRate:8000, currentTime:2,
		createGain:() => node('gain'), createBiquadFilter:() => node('filter'),
		createDynamicsCompressor:() => node('compressor'), createDelay:() => node('delay'),
		createConvolver:() => node('reverb'),
		createBuffer:(channels, length) => ({ getChannelData:() => new Float32Array(length) })
	}
}

test('defaults bypass all eyebrow audio processing, independently of drawing and MIDI options', () => {
	const context = createContext()
	const effects = new PersonEyebrowEffects(context)
	effects.update({eyebrowsRaisedBy:1}, {drawEyebrows:true, pitchBend:true})
	expect(context.nodes).toHaveLength(2)
	expect(effects.input.connect).toHaveBeenLastCalledWith(effects.output)
	const source = readFileSync('source/settings/options.people.js', 'utf8')
	for (const [key] of EYEBROW_AUDIO_EFFECTS) expect(source).toContain(`${key}:false`)
})

test('combines effects per person, smooths bounded values, and fully bypasses disabled effects', () => {
	const context = createContext()
	const effects = new PersonEyebrowEffects(context)
	const other = new PersonEyebrowEffects(context)
	const options = Object.fromEntries(EYEBROW_AUDIO_EFFECTS.map(([key]) => [key, true]))
	effects.update({eyebrowsRaisedBy:5}, options)
	expect(effects.filter.frequency.setTargetAtTime).toHaveBeenLastCalledWith(300, 2, 0.025)
	expect(effects.compressor.ratio.setTargetAtTime).toHaveBeenLastCalledWith(12, 2, 0.025)
	expect(effects.feedback.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.45, 2, 0.025)
	expect(effects.reverbWet.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.6, 2, 0.025)
	expect(effects.delay.connect).toHaveBeenCalledWith(effects.feedback)
	expect(effects.feedback.connect).toHaveBeenCalledWith(effects.delay)
	expect(other.nodes).toHaveLength(0)
	const previous = [...effects.nodes]
	const count = context.nodes.length
	effects.update(null, options)
	expect(context.nodes).toHaveLength(count)
	expect(effects.delayWet.gain.setTargetAtTime).toHaveBeenLastCalledWith(0, 2, 0.025)
	effects.update({}, {})
	previous.forEach(node => expect(node.disconnect).toHaveBeenCalled())
	expect(effects.nodes).toHaveLength(0)
	expect(effects.input.connect).toHaveBeenLastCalledWith(effects.output)
})

test('pitch bend reaches chord voices using each backend convention and resets when disabled', () => {
	const sample = {activeSamples:new Map(), pitchBend:jest.fn()}
	const synth = {pitchBend:jest.fn()}
	const instrument = {instruments:[{instruments:[sample]}, synth]}
	bendEyebrowInstrument(instrument, 1)
	expect(sample.pitchBend).toHaveBeenLastCalledWith(2 ** (2 / 12))
	expect(synth.pitchBend).toHaveBeenLastCalledWith(1)
	const source = readFileSync('source/people/person.js', 'utf8')
	const start = source.indexOf('\tupdateEyebrowPitchBend(prediction = {}){')
	const method = source.slice(start + '\tupdateEyebrowPitchBend(prediction = {}){'.length, source.indexOf('\n\t}', start))
	const update = new Function('prediction', 'bendEyebrowInstrument', method)
	const person = {options:{eyebrowPitchBend:true}, activeInstrument:instrument}
	update.call(person, {eyebrowExtents:2}, bendEyebrowInstrument)
	person.options.eyebrowPitchBend = false
	update.call(person, {eyebrowExtents:2}, bendEyebrowInstrument)
	expect(sample.pitchBend).toHaveBeenLastCalledWith(1)
	expect(synth.pitchBend).toHaveBeenLastCalledWith(0)
})

test('each panel toggle persists per person and round-trips through saved query settings', () => {
	const source = readFileSync('source/people/person.js', 'utf8')
	const start = source.indexOf('\tsetPanelOption(option, value){')
	const body = source.slice(start + '\tsetPanelOption(option, value){'.length, source.indexOf('\n\t}', start))
	const change = new Function('option', 'value', 'EVENT_PERSON_OPTIONS_CHANGED', body)
	const person = {
		options:{}, playerNumber:0, dispatchPersonEvent:jest.fn(),
		setOptions(options){ Object.assign(this.options, options) }
	}
	for (const [key] of EYEBROW_AUDIO_EFFECTS) {
		change.call(person, key, true, 'options-changed')
		expect(person.dispatchPersonEvent).toHaveBeenLastCalledWith('options-changed', {person, options:{[key]:true}})
	}
	const saved = exportPersonQueryOptions(person)
	const restored = getPersonQueryOptions(saved, ['p-1'])
	for (const [key] of EYEBROW_AUDIO_EFFECTS) expect(restored[key]).toBe(true)
	expect(getPersonQueryOptions(saved, ['p-2'])).toEqual({})
})
