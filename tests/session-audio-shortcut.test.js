/** @jest-environment node */
jest.mock('../source/storage/session-recorder.js',()=>({__esModule:true,default:jest.fn(),readSessionMedia:jest.fn()}))
jest.mock('../source/dom/download.js',()=>({downloadBlob:jest.fn()}))
import {recordAudio} from '../source/audio/record/record.audio.js'
import SessionRecorder from '../source/storage/session-recorder.js'
import {downloadBlob} from '../source/dom/download.js'

test('legacy audio shortcut shares the transport take and preserves the real file encoding',async()=>{
	let recording=false
	const blob=new Blob(['encoded bytes'],{type:'audio/webm;codecs=opus'})
	const controller={state:()=>({recording,mediaStartedAt:0}),startMedia:jest.fn(async()=>{recording=true}),stopMedia:jest.fn(async()=>{recording=false}),readLastMedia:jest.fn(async()=>blob)}
	const audio=recordAudio(controller)
	await audio.startRecording()
	expect(audio.isRecording()).toBe(true)
	await expect(audio.startRecording()).rejects.toThrow('Already recording')
	expect(await audio.stopRecording()).toBe(blob)
	expect(await audio.encodeRecording('audio','mp3')).toBe(blob)
	await audio.downloadRecording('take','audio','mp3')
	expect(downloadBlob).toHaveBeenCalledWith(blob,'take.webm')
	expect(SessionRecorder).not.toHaveBeenCalled()
})
