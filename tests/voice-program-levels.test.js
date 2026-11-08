import {TextDecoder,TextEncoder} from 'util'
import {FM_FACTORY_PRESETS} from '../source/audio/instruments/presets/dx7.js'
import {VOICE_ENGINE_PROGRAM_TRIM_DB} from '../source/audio/voice-engines/program-levels.js'
import {voiceProgramGain} from '../source/audio/voice-engine-levels.js'

global.TextEncoder=TextEncoder
global.TextDecoder=TextDecoder

const messages=[]
let mockNextId=1000
const audioNode=()=>({connect:jest.fn(),disconnect:jest.fn(),gain:{value:1}})
jest.mock('@webaudiomodules/sdk',()=>({initializeWamHost:jest.fn()}))
jest.mock('../source/audio/voice-engines/import-module.js',()=>({
	importVoiceModule:async()=>({SuperSonic:class {
		node=audioNode()
		on(){}
		async init(){}
		async sync(){}
		nextNodeId(){return ++mockNextId}
		send(...args){messages.push(args)}
		getRawTree(){return {nodes:[]}}
		async destroy(){}
	}})
}))
const {createSuperSonicBackend}=require('../source/audio/voice-engines/supersonic.js')
const {createMidiVoiceBackend}=require('../source/audio/voice-engines/midi.js')

test.each(['native','supersonic','yoshimi'])('%s has one finite trim for every GM program',engine=>{
	const trims=VOICE_ENGINE_PROGRAM_TRIM_DB[engine]
	expect(trims).toHaveLength(128)
	trims.forEach(trim=>expect(Number.isFinite(trim)).toBe(true))
})

test('Yoshimi trims only attenuate because its shared mix carries the boost',()=>{
	VOICE_ENGINE_PROGRAM_TRIM_DB.yoshimi.forEach(trim=>expect(trim).toBeLessThanOrEqual(0))
})

test('engines without a table keep unity program gain',()=>{
	expect(voiceProgramGain('wam2',121)).toBe(1)
})

test('Native applies its program trim between the voice and its reverb',async()=>{
	const {createVoiceBackend}=require('../source/audio/voice-engines.js')
	const levels=[]
	const context={createGain:()=>{const node=audioNode();levels.push(node);return node}}
	const voice={registeredInstruments:new Map(),loaded:Promise.resolve(),output:audioNode(),loadPreset:jest.fn(async()=>{}),destroy:jest.fn(async()=>{})}
	const backend=await createVoiceBackend('native',context,async()=>voice)
	const handle={options:{},program:82}
	await backend.attach(handle)
	const level=levels[0]
	expect(voice.output.connect).toHaveBeenCalledWith(level)
	expect(level.gain.value).toBeCloseTo(voiceProgramGain('native',82))
	expect(level.gain.value).toBeLessThan(0.2)
	handle.program=1
	await backend.program(handle)
	expect(level.gain.value).toBeCloseTo(voiceProgramGain('native',1))
	await backend.detach(handle)
	expect(level.disconnect).toHaveBeenCalled()
})

test('SuperSonic note-on and aftertouch both apply the program trim',async()=>{
	const previousContext=global.AudioContext
	global.AudioContext=class {
		sampleRate=48000
		async resume(){}
		async close(){}
		createChannelSplitter(){return audioNode()}
		createChannelMerger(){return audioNode()}
		createMediaStreamDestination(){return {...audioNode(),stream:{getTracks:()=>[]}}}
	}
	messages.length=0
	const backend=await createSuperSonicBackend({currentTime:0,createMediaStreamSource:audioNode},FM_FACTORY_PRESETS)
	try {
		// Breath Noise is the quietest raw program in this renderer.
		const handle={program:121,patch:'gm',currentTime:0,output:audioNode()}
		await backend.attach(handle)
		backend.noteOn(handle,60,0.5)
		const note=messages.at(-1), amp=note[note.indexOf('amp')+1]
		expect(amp).toBeCloseTo(0.5*0.14*(FM_FACTORY_PRESETS[121].gain ?? 1)*voiceProgramGain('supersonic',121),5)
		expect(voiceProgramGain('supersonic',121)).toBeGreaterThan(10)
		backend.pressure(handle,60,0.5)
		expect(messages.at(-1)).toEqual(['/n_set',note[2],'amp',amp])
	}finally{await backend.destroy();global.AudioContext=previousContext}
})

describe('Yoshimi part controls',()=>{
	const createRig=async()=>{
		const posted=[]
		global.fetch=jest.fn(async url=>({ok:true,
			json:async()=>['SynthPiano','Pads'].map(name=>({name,instruments:['0001-Patch.xiz']})),
			text:async()=>'',
			arrayBuffer:async()=>new TextEncoder().encode(String(url)).buffer}))
		global.AudioWorkletNode=class {
			connect(){}
			disconnect(){}
			port={postMessage:message=>posted.push(message),close(){}}
		}
		const context={currentTime:0,createGain:audioNode,audioWorklet:{addModule:async()=>{}}}
		const backend=await createMidiVoiceBackend('yoshimi',context,audioNode())
		const controller=number=>posted.filter(({type,data})=>type==='midi'&&(data[0]&0xf0)===0xb0&&data[1]===number).at(-1)?.data[2]
		return {backend,controller}
	}
	const cc=gain=>Math.max(0,Math.min(127,Math.round(127+63.5*Math.log10(gain))))
	const person=gain=>({gainNode:{gain:{value:gain}},trimNode:{gain:{value:1}},stereoNode:{pan:{value:0}}})
	let previousFrame
	beforeEach(()=>{previousFrame=global.requestAnimationFrame;global.requestAnimationFrame=()=>1})
	afterEach(()=>{global.requestAnimationFrame=previousFrame})

	test('program and chord level use CC7 while the mouth moves CC11',async()=>{
		const {backend,controller}=await createRig()
		const handle={currentTime:0,program:95,patch:'gm',volume:0.2,options:{voicePerson:person(0.5)},output:audioNode()}
		await backend.attach(handle)
		expect(controller(7)).toBe(cc(0.2*voiceProgramGain('yoshimi',95)))
		expect(controller(11)).toBe(64)
		await backend.destroy()
	})

	test('a closed mouth reaches the bottom of CC11 and leaves the program level alone',async()=>{
		const {backend,controller}=await createRig()
		const handle={currentTime:0,program:0,patch:'gm',volume:1,options:{voicePerson:person(0)},output:audioNode()}
		await backend.attach(handle)
		expect(controller(11)).toBe(0)
		expect(controller(7)).toBe(cc(voiceProgramGain('yoshimi',0)))
		await backend.destroy()
	})

	test('hand-picked patches are not given another patch trim',async()=>{
		const {backend,controller}=await createRig()
		const handle={currentTime:0,program:0,patch:'SynthPiano/0001-Patch.xiz',volume:1,options:{voicePerson:person(1)},output:audioNode()}
		await backend.attach(handle)
		expect(controller(7)).toBe(127)
		await backend.destroy()
	})
})
