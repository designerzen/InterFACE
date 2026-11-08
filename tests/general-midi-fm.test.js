import { FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../source/audio/midi/general-midi.constants.js'
import { FMVoice } from '../source/audio/instruments/fm-engine.js'

const sampleRate = 12000
const render = (program, note=60, seconds=0.5, velocity=0.8) => {
	const voice = new FMVoice(FM_FACTORY_PRESETS[program],note,velocity,sampleRate)
	return Float32Array.from({length:Math.floor(seconds*sampleRate)}, () => voice.next())
}
const rms = samples => Math.sqrt(samples.reduce((sum,v) => sum+v*v,0)/samples.length)

test('factory bank contains all 128 GM names in program order, with original distinct voices', () => {
	expect(FM_FACTORY_PRESETS).toHaveLength(128)
	expect(FM_FACTORY_PRESETS.map(p => p.name)).toEqual(GENERAL_MIDI_INSTRUMENTS)
	expect(FM_FACTORY_PRESETS.map(p => p.program)).toEqual(Array.from({length:128},(_,i) => i))
	const sounds = FM_FACTORY_PRESETS.map(({name,program,...sound}) => JSON.stringify(sound))
	expect(new Set(sounds).size).toBe(128)
	for (const patch of FM_FACTORY_PRESETS) {
		expect(patch.operators).toHaveLength(6)
		expect(patch.origin).toBe('PhotoSYNTH')
	}
})

test.each(Array.from({length:128},(_,i) => i))('GM program %i is audible, finite and releases at several pitches', program => {
	for (const note of [48,60,84]) {
		const voice = new FMVoice(FM_FACTORY_PRESETS[program],note,0.8,sampleRate)
		let peak = 0, energy = 0
		for (let i=0; i<sampleRate*0.4; i++) {
			const value = voice.next()
			peak = Math.max(peak,Math.abs(value)); energy += value*value
		}
		expect(Number.isFinite(energy)).toBe(true)
		expect(energy).toBeGreaterThan(0.00001)
		expect(peak).toBeLessThan(1)
		voice.release()
		for (let i=0; i<sampleRate*4 && !voice.finished; i++) voice.next()
		expect(voice.finished).toBe(true)
		expect(voice.next()).toBe(0)
	}
})

test('struck sounds decay, organs sustain, and bowed strings swell', () => {
	const wood = render(115,60,0.6)
	expect(rms(wood.slice(3000))).toBeLessThan(rms(wood.slice(0,500))*0.02)
	const organ = render(16,60,1)
	expect(rms(organ.slice(9000))/rms(organ.slice(3000,6000))).toBeGreaterThan(0.7)
	const strings = render(49,60,1)
	expect(rms(strings.slice(8000,10000))).toBeGreaterThan(rms(strings.slice(0,400))*5)
})

test('piano velocity changes energy and timbre', () => {
	const soft = render(0,60,0.4,0.2), hard = render(0,60,0.4,1)
	expect(rms(hard)).toBeGreaterThan(rms(soft)*1.3)
	const softRMS = rms(soft), hardRMS = rms(hard)
	const difference = soft.reduce((sum,value,index) => sum+Math.abs(value/softRMS-hard[index]/hardRMS),0)/soft.length
	expect(difference).toBeGreaterThan(0.1)
})

test('telephone uses fixed ring frequencies and noise effects vary over time', () => {
	const low = render(124,48), high = render(124,84)
	expect(low.every((value,i) => value === high[i])).toBe(true)
	const sea = render(122,60,1)
	expect(rms(sea.slice(6000))).toBeGreaterThan(0.0001)
	const adjacentDifference = sea.slice(6000).reduce((sum,v,i) => sum+Math.abs(v-sea[5999+i]),0)
	expect(adjacentDifference).toBeGreaterThan(0.01)
})
