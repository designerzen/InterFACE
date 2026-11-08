import {normaliseEngineSettings,readEngineSettings} from '../source/audio/voice-engine-settings.js'
import {voiceEngineGain} from '../source/audio/voice-engine-levels.js'

jest.mock('@webaudiomodules/sdk',() => ({initializeWamHost:jest.fn()}))
const {createMidiVoiceBackend} = require('../source/audio/voice-engines/midi.js')

test('Yoshimi user gain defaults to zero independently of fixed engine calibration', () => {
	expect(readEngineSettings({yoshimi:{reverbMode:'off'}}).yoshimi.outputGainDb).toBe(0)
	expect(normaliseEngineSettings('yoshimi',{outputGainDb:-6}).outputGainDb).toBe(-6)
	expect(normaliseEngineSettings('yoshimi',{outputGainDb:30}).outputGainDb).toBe(18)
	expect(normaliseEngineSettings('yoshimi',{outputGainDb:'invalid'}).outputGainDb).toBe(0)
})

test.each(['native','fm','yoshimi','wam2','supersonic'])('%s saves an independent bounded output trim', engine => {
	expect(normaliseEngineSettings(engine,{outputGainDb:-30}).outputGainDb).toBe(-18)
	expect(normaliseEngineSettings(engine,{outputGainDb:30}).outputGainDb).toBe(18)
	expect(normaliseEngineSettings(engine,{outputGainDb:-4.5}).outputGainDb).toBe(-4.5)
	const saved = readEngineSettings(JSON.stringify({[engine]:{outputGainDb:-4.5,levelCalibrationVersion:1}}))
	expect(saved[engine].outputGainDb).toBe(-4.5)
})

test('legacy Yoshimi boost migrates once while retaining the user adjustment', () => {
	const saved=readEngineSettings({yoshimi:{outputGainDb:12}})
	expect(saved.yoshimi.outputGainDb).toBe(6)
	expect(readEngineSettings(JSON.stringify(saved))).toEqual(saved)
	expect(readEngineSettings({yoshimi:{outputGainDb:6}}).yoshimi.outputGainDb).toBe(0)
})

test('Yoshimi calibrates its shared audio while mouth expression can still silence each part', async () => {
	const originalFetch = globalThis.fetch
	const originalWorklet = globalThis.AudioWorkletNode
	const gain = {value:1,setTargetAtTime:jest.fn(),cancelScheduledValues:jest.fn(),setValueAtTime:jest.fn(),linearRampToValueAtTime:jest.fn()}
	const mix = {gain,connect:jest.fn(),disconnect:jest.fn()}
	const node = {port:{postMessage:jest.fn(),close:jest.fn()},connect:jest.fn(),disconnect:jest.fn()}
	globalThis.AudioWorkletNode = jest.fn(() => node)
	globalThis.fetch = jest.fn(async () => ({ok:true,arrayBuffer:async () => new ArrayBuffer(0),text:async () => '',json:async () => []}))
	const context = {currentTime:2,createGain:() => mix,audioWorklet:{addModule:jest.fn(async () => {})}}
	let backend
	try {
		backend = await createMidiVoiceBackend('yoshimi',context,{})
		expect(gain.value).toBeCloseTo(voiceEngineGain('yoshimi'))
		await backend.configure(normaliseEngineSettings('yoshimi',{outputGainDb:12}))
		expect(gain.setTargetAtTime).toHaveBeenLastCalledWith(voiceEngineGain('yoshimi',{outputGainDb:12}),2,0.01)
		expect(node.connect).toHaveBeenCalledWith(mix)
		// No patch data is needed to verify expression on an attached MIDI part.
		backend.program = jest.fn(async () => {})
		const person = {gainNode:{gain:{value:1}},trimNode:{gain:{value:1}}}
		const handle = {currentTime:2,volume:1,options:{voicePerson:person}}
		await backend.attach(handle)
		expect(node.port.postMessage).toHaveBeenCalledWith({type:'midi',data:[0xb0,7,127],time:2})
		person.gainNode.gain.value = 0
		backend.sync(handle)
		expect(node.port.postMessage).toHaveBeenCalledWith({type:'midi',data:[0xb0,11,0],time:2})
		backend.fadeOut()
		expect(gain.cancelScheduledValues).toHaveBeenCalledWith(2)
		expect(gain.linearRampToValueAtTime).toHaveBeenCalledWith(0,2.025)
	} finally {
		await backend?.destroy()
		globalThis.fetch = originalFetch
		globalThis.AudioWorkletNode = originalWorklet
	}
})

const createYoshimi = async context => {
	const gain = {value:1,setTargetAtTime:jest.fn(),cancelScheduledValues:jest.fn(),setValueAtTime:jest.fn(),linearRampToValueAtTime:jest.fn()}
	const node = {port:{postMessage:jest.fn(),close:jest.fn()},connect:jest.fn(),disconnect:jest.fn()}
	globalThis.AudioWorkletNode = jest.fn(() => node)
	globalThis.fetch = jest.fn(async () => ({ok:true,arrayBuffer:async () => new ArrayBuffer(0),text:async () => '',json:async () => []}))
	Object.assign(context,{createGain:() => ({gain,connect:jest.fn(),disconnect:jest.fn()}),audioWorklet:{addModule:jest.fn(async () => {})}})
	const backend = await createMidiVoiceBackend('yoshimi',context,{})
	backend.program = jest.fn(async () => {})
	const handle = {currentTime:2,volume:1,options:{voicePerson:{gainNode:{gain:{value:1}},trimNode:{gain:{value:1}}}}}
	await backend.attach(handle)
	node.port.postMessage.mockClear()
	return {backend,handle,midi:() => node.port.postMessage.mock.calls.map(([message]) => message.data)}
}

test('Yoshimi panic releases held notes in order instead of sending its late CC123', async () => {
	const originalFetch = globalThis.fetch, originalWorklet = globalThis.AudioWorkletNode
	let backend
	try {
		const yoshimi = await createYoshimi({currentTime:2,state:'running'})
		backend = yoshimi.backend
		backend.noteOn(yoshimi.handle,60,0.5)
		backend.noteOn(yoshimi.handle,64,0.5)
		backend.noteOff(yoshimi.handle,60)
		const before = yoshimi.midi().length
		backend.panic(yoshimi.handle)
		const sent = yoshimi.midi().slice(before)
		expect(sent).toEqual([[0xb0,64,0],[0x80,64,0]])
	} finally {
		await backend?.destroy()
		globalThis.fetch = originalFetch
		globalThis.AudioWorkletNode = originalWorklet
	}
})

test('Yoshimi settles until its part volume glide has finished on the audio clock', async () => {
	const originalFetch = globalThis.fetch, originalWorklet = globalThis.AudioWorkletNode
	const context = {currentTime:2,state:'running'}
	let backend
	try {
		backend = (await createYoshimi(context)).backend
		let settled = false
		const settling = backend.settle().then(() => { settled = true })
		await new Promise(resolve => setTimeout(resolve,50))
		expect(settled).toBe(false)
		context.currentTime = 2.25
		await settling
		expect(settled).toBe(true)
		// A suspended context cannot glide, so it must not hold up loading.
		context.currentTime = 2
		context.state = 'suspended'
		await backend.settle()
	} finally {
		await backend?.destroy()
		globalThis.fetch = originalFetch
		globalThis.AudioWorkletNode = originalWorklet
	}
})
