/** @jest-environment node */
import {createSessionMediaCapture} from '../source/audio/record/session-media.js'

const setup=(overrides={})=>{
	const recorders=[],track={stop:jest.fn()}
	class Recorder {
		static isTypeSupported=()=>true
		state='inactive';listeners={};mimeType='audio/webm'
		constructor(stream){this.stream=stream;recorders.push(this)}
		addEventListener(type,listener){(this.listeners[type]??=[]).push(listener)}
		emit(type,event={}){for(const listener of this.listeners[type]??[])listener(event)}
		start(){this.state='recording';this.emit('start')}
		stop(){this.state='inactive';this.emit('dataavailable',{data:new Blob(['last']),timecode:1000});this.emit('stop')}
	}
	const capture=createSessionMediaCapture({Recorder,audioStream:{},canvas:{captureStream:()=>({getTracks:()=>[track]})},onChunk:async()=>{},...overrides})
	return {capture,recorders,track}
}
test('stop waits for final chunks, is idempotent, and stops only owned tracks',async()=>{
	let release
	const gate=new Promise(resolve=>{release=resolve}),chunks=[]
	const {capture,track}=setup({onChunk:async(kind,blob)=>{await gate;chunks.push([kind,await blob.text()])}})
	capture.start();const stopped=capture.stop()
	expect(capture.stop()).toBe(stopped)
	expect(track.stop).not.toHaveBeenCalled()
	release();await stopped
	expect(chunks).toEqual([['audio','last'],['video','last']]);expect(track.stop).toHaveBeenCalledTimes(1)
})
test('an early settled write rejection remains a stop failure',async()=>{
	const onError=jest.fn(),{capture,recorders,track}=setup({onError,onChunk:async()=>{throw Error('Quota exceeded')}})
	capture.start();recorders[0].emit('dataavailable',{data:new Blob(['first']),timecode:0})
	await new Promise(resolve=>setImmediate(resolve))
	await expect(capture.stop()).rejects.toThrow('Quota exceeded')
	expect(onError).toHaveBeenCalledTimes(1);expect(track.stop).toHaveBeenCalled()
})
test('timestamps use stream origin and timecodes, not delayed chunk arrival',async()=>{
	let now=1000;const onChunk=jest.fn(async()=>{})
	const {capture,recorders}=setup({now:()=>now,sessionStart:0,onChunk})
	capture.start();now=6000
	recorders[0].emit('dataavailable',{data:new Blob(['first']),timecode:15000})
	recorders[0].emit('dataavailable',{data:new Blob(['second']),timecode:16000})
	await capture.stop()
	expect(onChunk.mock.calls[0][2]).toMatchObject({startTime:1000,streamStartTime:1000,receivedAt:6000})
	expect(onChunk.mock.calls[1][2].startTime).toBe(2000)
})
test('partial encoder start failure does not hang stop',async()=>{
	const {capture,recorders,track}=setup()
	recorders[1].start=()=>{throw Error('Encoder unavailable')}
	expect(()=>capture.start()).toThrow('Encoder unavailable')
	await expect(capture.stop()).rejects.toThrow('Encoder unavailable')
	expect(track.stop).toHaveBeenCalled()
})

test('an empty video stream is reported rather than silently declared saved',async()=>{
	const {capture,recorders}=setup()
	recorders[1].stop=function(){this.state='inactive';this.emit('stop')}
	capture.start()
	await expect(capture.stop()).rejects.toThrow('No video data was produced')
})

test('a missing encoder stop event times out and releases video tracks',async()=>{
	jest.useFakeTimers()
	try {
		const {capture,recorders,track}=setup({stopTimeout:20})
		recorders[1].stop=function(){this.state='inactive'}
		capture.start()
		const stopped=expect(capture.stop()).rejects.toThrow('Media encoder did not finish')
		await jest.advanceTimersByTimeAsync(21);await stopped
		expect(track.stop).toHaveBeenCalled()
	} finally {jest.useRealTimers()}
})
