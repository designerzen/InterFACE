import { readFileSync } from 'fs'
import Instrument from '../source/audio/instruments/instrument.js'
import { INSTRUMENT_TYPE_FM } from '../source/audio/instrument-list.js'
import { decodeDX7Voice, FM_FACTORY_PRESETS, parseDX7Presets } from '../source/audio/instruments/presets/dx7.js'
import { FMVoice, FM_ALGORITHMS } from '../source/audio/instruments/fm-engine.js'

const single = () => {
	const data = new Uint8Array(155)
	for (let i=0; i<6; i++) data.set([99,99,99,99,99,99,99,0,39,0,0,0,0,0,0,0,99,0,1,0,7], i*21)
	data.set([99,99,99,99,50,50,50,50,31,0,1,0,0,0,0,1,4,0,24], 126)
	data.set(Array.from('TEST VOICE', char => char.charCodeAt(0)), 145)
	return data
}
const sysex = (data, format=0) => new Uint8Array([0xf0,0x43,0,format,data.length>>7,data.length&127,...data,(-data.reduce((s,v) => s+v,0))&127,0xf7])

test('reads single voices, views with offsets, and concatenated dumps', () => {
	const file = sysex(single())
	const wrapped = new Uint8Array(file.length+8)
	wrapped.set(file, 4)
	const [voice] = parseDX7Presets(wrapped.subarray(4, -4))
	expect(voice.name).toBe('TEST VOICE')
	expect(voice.algorithm).toBe(31)
	expect(voice.transpose).toBe(0)
	expect(voice.operators[0]).toMatchObject({coarse:1, output:99, detune:0, fixed:false})
	expect(parseDX7Presets(new Uint8Array([...file,...file])).map(v => v.name)).toEqual(['TEST VOICE','TEST VOICE (2)'])
})

test('unpacks every bank operator and packed global field', () => {
	const bank = new Uint8Array(4096)
	for (let n=0; n<32; n++) {
		for (let op=0; op<6; op++) {
			const p = n*128+op*17
			bank.set([90,80,70,60,99,80,60,0,39,10,20,14,85,23,90-op,35,42], p)
		}
		bank.set([99,98,97,96,50,51,52,53,17,13,40,20,30,10,91,36], n*128+102)
		bank.set(Array.from('DUPLICATE ', c => c.charCodeAt(0)), n*128+118)
	}
	const voices = parseDX7Presets(sysex(bank,9))
	expect(voices).toHaveLength(32)
	expect(new Set(voices.map(v => v.name)).size).toBe(32)
	expect(voices[0]).toMatchObject({algorithm:17, feedback:5, sync:true, lfoWave:5, pitchSensitivity:5, transpose:12})
	expect(voices[0].operators[0]).toMatchObject({leftCurve:2,rightCurve:3,detune:3,rateScaling:5,ampSensitivity:3,velocitySensitivity:5,output:85,fixed:true,coarse:17,fine:42})
	expect(voices[0].operators[5].output).toBe(90)
	expect(parseDX7Presets(bank)).toEqual(voices)
})

test('rejects damaged, truncated, unsupported and non-7-bit files', () => {
	const badChecksum = sysex(single()); badChecksum[20] ^= 1
	expect(() => parseDX7Presets(badChecksum)).toThrow(/checksum/)
	expect(() => parseDX7Presets(sysex(single()).subarray(0, -1))).toThrow(/truncated/)
	const wrongMaker = sysex(single()); wrongMaker[1] = 0x41
	expect(() => parseDX7Presets(wrongMaker)).toThrow(/Yamaha/)
	expect(() => parseDX7Presets(new Uint8Array(20))).toThrow(/size/)
	const invalid = single(); invalid[1] = 128
	expect(() => parseDX7Presets(invalid)).toThrow(/data bytes/)
	expect(() => parseDX7Presets(new Uint8Array())).toThrow(/Choose/)
})

test.each(Array.from({length:32}, (_, i) => i))('algorithm %i renders finite audio and releases to silence', algorithm => {
	const patch = {...decodeDX7Voice(single()), algorithm}
	const voice = new FMVoice(patch, 69, 1, 12000)
	let energy = 0
	for (let i=0; i<1200; i++) { const sample = voice.next(); expect(Number.isFinite(sample)).toBe(true); energy += sample*sample }
	expect(energy).toBeGreaterThan(0.01)
	voice.release()
	for (let i=0; i<200; i++) voice.next()
	expect(voice.finished).toBe(true)
	expect(voice.next()).toBe(0)
	expect(FM_ALGORITHMS[algorithm].carriers.length).toBeGreaterThan(0)
})

test('ratio and fixed frequency operators respond to pitch correctly', () => {
	const patch = decodeDX7Voice(single())
	patch.operators[0] = {...patch.operators[0], fixed:true, coarse:2, fine:50}
	const low = new FMVoice(patch, 69, 1, 48000)
	const high = new FMVoice(patch, 81, 1, 48000)
	expect(low.ops[0].frequency).toBeCloseTo(10**2.5)
	expect(high.ops[0].frequency).toBe(low.ops[0].frequency)
	expect(high.ops[1].frequency/low.ops[1].frequency).toBe(2)
})

// Execute the instrument with a controllable audio port; browser bundling and
// actual AudioWorklet rendering are checked separately.
const instrumentSource = readFileSync('source/audio/instruments/instrument.fm.js', 'utf8')
	.replace(/^import .*$/gm, '').replace('export default class', 'return class')
	.replace('import.meta.url', '"https://localhost/instrument.fm.js"')
const FMInstrument = new Function('Instrument','INSTRUMENT_TYPE_FM','FM_FACTORY_PRESETS','parseDX7Presets', instrumentSource)(Instrument, INSTRUMENT_TYPE_FM, FM_FACTORY_PRESETS, parseDX7Presets)

test('instrument schedules notes, imports atomically, clones banks and tears down', async () => {
	const original = global.AudioWorkletNode
	global.AudioWorkletNode = class {
		port = {postMessage:jest.fn(), close:jest.fn()}
		connect(){}
		disconnect = jest.fn()
	}
	const context = {
		currentTime:2,
		audioWorklet:{addModule:jest.fn(async () => {})},
		createGain:() => ({gain:{value:1,setValueAtTime:jest.fn()},disconnect:jest.fn()})
	}
	try {
		const instrument = new FMInstrument(context)
		await instrument.loaded
		expect(await instrument.getPresets()).toHaveLength(128)
		expect(instrument.isGeneralMIDIBank).toBe(true)
		for (let program=0; program<128; program++) {
			await instrument.programChange(program)
			expect(instrument.activePreset).toBe(FM_FACTORY_PRESETS[program].name)
		}
		await instrument.programChange('0')
		expect(instrument.activePresetIndex).toBe(0)
		expect(await instrument.programChange(128)).toBe(false)
		expect(await instrument.programChange(-1)).toBe(false)
		instrument.processor.port.postMessage.mockClear()
		instrument.scheduleAt(2)
		const pendingOn = instrument.noteOn(61, 1)
		const pendingOff = instrument.noteOff(61)
		await Promise.all([pendingOn, pendingOff])
		expect(instrument.processor.port.postMessage.mock.calls.slice(0,2).map(([event]) => event.type)).toEqual(['on','off'])
		instrument.scheduleAt(3)
		expect(await instrument.noteOn(60,0.7)).toBe(true)
		expect(await instrument.noteOn(60,0.7)).toBe(false)
		expect(instrument.processor.port.postMessage).toHaveBeenCalledWith(expect.objectContaining({type:'on',time:3,note:60,velocity:0.7}))
		const messages = instrument.processor.port.postMessage.mock.calls.map(([message]) => message)
		expect(messages.filter(message => message.type === 'patch')).toHaveLength(0)
		expect(messages.filter(message => message.type === 'on').every(message => !('patch' in message))).toBe(true)
		await instrument.loadDX7File(single())
		expect(instrument.isGeneralMIDIBank).toBe(false)
		expect(await instrument.getPresets()).toEqual(['TEST VOICE'])
		expect(instrument.activeNotes.size).toBe(0)
		await expect(instrument.loadDX7File(new Uint8Array(2))).rejects.toThrow()
		expect(instrument.activePreset).toBe('TEST VOICE')
		expect(await instrument.programChange('missing')).toBe(false)
		const clone = instrument.clone()
		await clone.loaded
		expect(clone.processor).toBe(instrument.processor)
		expect(clone.part).not.toBe(instrument.part)
		expect(clone.activePreset).toBe('TEST VOICE')
		expect(context.audioWorklet.addModule).toHaveBeenCalledTimes(1)
		await instrument.destroy()
		expect(instrument.processor.port.close).not.toHaveBeenCalled()
		expect(await clone.noteOn(64, 0.5)).toBe(true)
		await clone.destroy()
		expect(instrument.processor.port.close).toHaveBeenCalled()
		expect(instrument.processor.disconnect).toHaveBeenCalled()
	} finally { global.AudioWorkletNode = original }
})

test('worklet startup failure rejects loaded instead of hanging', async () => {
	const instrument = new FMInstrument({currentTime:0})
	await expect(instrument.loaded).rejects.toThrow(/AudioWorklet/)
})

test('failed preset loading releases its part and a full shared engine can be reused',async () => {
	const original = global.AudioWorkletNode, nodes = []
	global.AudioWorkletNode = class {
		constructor(){nodes.push(this)}
		port = {postMessage:jest.fn(),close:jest.fn()}
		connect(){}
		disconnect(){}
	}
	const context = {currentTime:0,audioWorklet:{addModule:jest.fn(async()=>{})},createGain:()=>({gain:{value:1},disconnect(){}})}
	const instruments = []
	try {
		const invalid = new FMInstrument(context,{dx7File:new Uint8Array(2)})
		await expect(invalid.loaded).rejects.toThrow()
		expect(nodes[0].port.close).toHaveBeenCalledTimes(1)
		for(let index=0;index<16;index++){
			const instrument = new FMInstrument(context)
			instruments.push(instrument);await instrument.loaded
		}
		expect(nodes).toHaveLength(2)
		const overflow = new FMInstrument(context)
		await expect(overflow.loaded).rejects.toThrow(/no free/)
		const releasedPart = instruments[0].part
		await instruments.shift().destroy()
		const replacement = new FMInstrument(context)
		instruments.push(replacement);await replacement.loaded
		expect(replacement.part).toBe(releasedPart)
		expect(nodes).toHaveLength(2)
		expect(context.audioWorklet.addModule).toHaveBeenCalledTimes(1)
	}finally{
		await Promise.all(instruments.map(instrument=>instrument.destroy()))
		global.AudioWorkletNode=original
	}
})
