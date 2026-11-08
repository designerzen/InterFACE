/** @jest-environment node */
jest.mock('../source/storage/session-recorder.js',()=>{
	const instances=[]
	class Recorder {
		constructor(options){this.options=options;this.sessionId='session-'+instances.length;this.manifest={tempoMap:[],takes:[]};this.isRecording=false;instances.push(this)}
		open=jest.fn(async()=>{});start=jest.fn(async()=>{this.isRecording=true});stop=jest.fn(async()=>{this.isRecording=false});destroy=jest.fn()
		record=jest.fn();flush=jest.fn(async()=>{});exportMIDI=jest.fn(async()=>new Blob(['midi']));setTempo=jest.fn()
		beginTake=jest.fn(()=>this.manifest.takes.push({})-1);endTake=jest.fn(async()=>{});addMediaChunk=jest.fn(async()=>{})
	}
	return {__esModule:true,default:Recorder,instances,deleteStoredSession:jest.fn(),exportStoredSession:jest.fn(),exportStoredDAWProject:jest.fn(),readSessionMedia:jest.fn(),readSessionNoteWindow:jest.fn()}
})
jest.mock('../source/audio/record/session-media.js',()=>({createSessionMediaCapture:jest.fn(()=>({start:jest.fn(),stop:jest.fn(async()=>{}),requestData:jest.fn()}))}))
import {createSessionController} from '../source/storage/session-controller.js'
import {instances,deleteStoredSession,exportStoredSession,exportStoredDAWProject,readSessionNoteWindow} from '../source/storage/session-recorder.js'
import {createSessionMediaCapture} from '../source/audio/record/session-media.js'

const setup=()=>{
	const track={stop:jest.fn()},destination={stream:{getTracks:()=>[track]}},output={connect:jest.fn(),disconnect:jest.fn()}
	const context={resume:jest.fn(async()=>{}),createMediaStreamDestination:jest.fn(()=>destination)}
	const onError=jest.fn(),controller=createSessionController({getContext:()=>context,getOutput:()=>output,getCanvas:()=>({}),onError})
	return {controller,output,destination,track,onError}
}
test('deletion protects the active session and clears the last recording after stopping',async()=>{
	const {controller}=setup()
	await controller.start()
	const id=controller.state().id
	await expect(controller.deleteSession(id)).rejects.toThrow('Stop audio, video and automatic MIDI')
	expect(deleteStoredSession).not.toHaveBeenCalled()
	await controller.setAuto(false)
	await controller.deleteSession(id)
	expect(deleteStoredSession).toHaveBeenCalledWith(id)
	expect(controller.state().id).toBeNull()
})

test('media takes retain the same always-on MIDI session and Record/Stop state',async()=>{
	const {controller,output,destination,track}=setup()
	await controller.start();const id=controller.state().id
	await controller.startMedia({audio:true,video:true})
	expect(controller.state()).toMatchObject({id,midi:true,recording:true})
	await controller.stopMedia()
	expect(controller.state()).toMatchObject({id,midi:true,recording:false})
	expect(output.disconnect).toHaveBeenCalledWith(destination);expect(track.stop).toHaveBeenCalledTimes(1)
	await controller.startMedia({audio:false,video:true});await controller.stopMedia()
	expect(controller.state().id).toBe(id)
	await controller.stop()
})
test('rapid starts create one media capture; final chunks target their original session',async()=>{
	const {controller}=setup(),before=instances.length
	await Promise.all([controller.startMedia(),controller.startMedia()])
	expect(instances.length-before).toBe(1)
	expect(createSessionMediaCapture).toHaveBeenCalledTimes(1)
	const options=createSessionMediaCapture.mock.calls[0][0],session=instances.at(-1)
	await options.onChunk('audio',new Blob(['last']),{take:0})
	expect(session.addMediaChunk).toHaveBeenCalledTimes(1)
	await controller.stop()
})
test('media failure releases its audio tap and leaves healthy automatic MIDI running',async()=>{
	const {controller,output,track}=setup()
	await controller.startMedia()
	createSessionMediaCapture.mock.results.at(-1).value.stop.mockRejectedValueOnce(Error('Encoder failed'))
	await expect(controller.stopMedia()).rejects.toThrow('Encoder failed')
	expect(controller.state()).toMatchObject({recording:false,midi:true})
	expect(output.disconnect).toHaveBeenCalledTimes(1);expect(track.stop).toHaveBeenCalledTimes(1)
	await controller.stop()
})
test('with Auto MIDI disabled, stopping media finalises the temporary note session',async()=>{
	const {controller}=setup()
	await controller.setAuto(false);await controller.startMedia();await controller.stopMedia()
	expect(controller.state()).toMatchObject({recording:false,midi:false,auto:false})
})

test('a long MIDI export does not block Stop',async()=>{
	const {controller}=setup()
	await controller.startMedia()
	let finishExport
	exportStoredSession.mockReturnValueOnce(new Promise(resolve=>{finishExport=resolve}))
	const exported=controller.exportMIDI()
	await controller.stopMedia()
	expect(controller.state().recording).toBe(false)
	finishExport(new Blob(['midi']));await exported
	await controller.stop()
})

test('cancelling replay while its snapshot is pending prevents a late load',async()=>{
	const {controller}=setup()
	await controller.start()
	let finishFlush;instances.at(-1).flush.mockReturnValueOnce(new Promise(resolve=>{finishFlush=resolve}))
	const loading=controller.loadReplay(controller.state().id)
	controller.pauseReplay();finishFlush();await loading
	expect(readSessionNoteWindow).not.toHaveBeenCalled()
	await controller.stop()
})


test('DAWproject snapshots active notes without holding the transport queue during export',async()=>{
	const {controller}=setup()
	await controller.start()
	const recorder=instances.at(-1)
	recorder.offset=80;recorder.elapsed=2000
	let finish
	exportStoredDAWProject.mockReturnValueOnce(new Promise(resolve=>{finish=resolve}))
	const exported=controller.exportDAWProject(controller.state().id,{title:'Performance'})
	await new Promise(resolve=>setTimeout(resolve,0))
	expect(recorder.flush).toHaveBeenCalled()
	expect(exportStoredDAWProject).toHaveBeenCalledWith(recorder.sessionId,{tempoMap:recorder.manifest.tempoMap,eventBytes:80,endTime:2000,title:'Performance'})
	await controller.stop()
	const blob=new Blob(['project']);finish(blob)
	await expect(exported).resolves.toBe(blob)
})
