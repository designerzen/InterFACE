import {FM_FACTORY_PRESETS} from '../source/audio/instruments/presets/dx7.js'
import {TextEncoder} from 'util'

global.TextEncoder=TextEncoder

const messages=[]
let mockNextId
const audioNode = () => ({connect:jest.fn(),disconnect:jest.fn()})
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
const {createSuperSonicBackend} = require('../source/audio/voice-engines/supersonic.js')
let backend,previousContext
beforeEach(async()=>{
	messages.length=0;mockNextId=1000
	previousContext=global.AudioContext
	global.AudioContext=class {
		sampleRate=48000
		async resume(){}
		async close(){}
		createChannelSplitter(){return audioNode()}
		createChannelMerger(){return audioNode()}
		createMediaStreamDestination(){return {...audioNode(),stream:{getTracks:()=>[]}}}
	}
	backend=await createSuperSonicBackend({currentTime:0,createMediaStreamSource:audioNode},FM_FACTORY_PRESETS)
})
afterEach(async()=>{await backend?.destroy();global.AudioContext=previousContext})
const handle=()=>({program:48,patch:'gm',currentTime:0,output:audioNode()})

test('aftertouch retains the same preset amplitude scaling as note-on',async()=>{
	const a={...handle(),program:32};await backend.attach(a)
	backend.noteOn(a,60,0.8)
	const message=messages.at(-1), id=message[2], amplitude=message[message.indexOf('amp')+1]
	backend.pressure(a,60,0.8)
	expect(messages.at(-1)).toEqual(['/n_set',id,'amp',amplitude])
})

test('chord note-offs release the node for that note number independently of order and part',async()=>{
	const a=handle(),b=handle()
	await backend.attach(a);await backend.attach(b)
	for(const note of [60,64,67]) backend.noteOn(a,note,.8)
	backend.noteOn(b,60,.8)
	const ids=messages.filter(message=>message[0]==='/s_new').map(message=>message[2])
	backend.noteOff(a,67);backend.noteOff(a,60);backend.noteOff(a,64)
	expect(messages.filter(message=>message[0]==='/n_set')).toEqual([
		['/n_set',ids[2],'gate',0],['/n_set',ids[0],'gate',0],['/n_set',ids[1],'gate',0]
	])
	expect(backend.diagnostics().heldNotes).toEqual([[],[60]])
	backend.noteOff(b,60)
	expect(messages.at(-1)).toEqual(['/n_set',ids[3],'gate',0])
	const count=messages.length
	backend.noteOff(a,60)
	expect(messages).toHaveLength(count)
})

test('retriggering a note releases its previous synth before replacing its node id',async()=>{
	const a=handle();await backend.attach(a)
	backend.noteOn(a,60,.8)
	const previous=messages.at(-1)[2]
	backend.noteOn(a,60,.8)
	const current=messages.at(-1)[2]
	expect(current).not.toBe(previous)
	expect(messages.at(-2)).toEqual(['/n_set',previous,'gate',0])
	backend.noteOff(a,60)
	expect(messages.at(-1)).toEqual(['/n_set',current,'gate',0])
	expect(backend.diagnostics().heldNotes).toEqual([[]])
})
