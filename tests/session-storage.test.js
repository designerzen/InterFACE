/** @jest-environment node */
import {unzipSync,strFromU8} from 'fflate'
jest.mock('../source/storage/opfs.js',()=>({__esModule:true,default:jest.fn()}))
import SessionRecorder from '../source/storage/session-recorder.js'
import {createSessionStore} from '../source/storage/session-store.js'
import {encodeSessionEvents,decodeSessionEvents} from '../source/storage/session-format.js'

const memoryFS=()=>{
	const files=new Map(),handles=new Map()
	const root={
		async removeEntry(name){files.delete(name)},
		async getFileHandle(name,{create=false}={}) {
			if(!files.has(name)) {if(!create)throw Object.assign(new Error('Missing'),{name:'NotFoundError'});files.set(name,new Uint8Array())}
			return {
				getFile:async()=>new Blob([files.get(name)]),
				createWritable:async()=>{let pending;return {write:async value=>{pending=new TextEncoder().encode(value)},close:async()=>files.set(name,pending),abort:async()=>{}}},
				createSyncAccessHandle:async()=>{
					const handle={getSize:()=>files.get(name).length,flush:jest.fn(),close:jest.fn(),truncate:size=>files.set(name,files.get(name).slice(0,size)),
						write:jest.fn((bytes,{at})=>{const next=new Uint8Array(Math.max(at+bytes.length,files.get(name).length));next.set(files.get(name));next.set(bytes,at);files.set(name,next);return bytes.length})}
					handles.set(name,handle);return handle
				}
			}
		},
		async *entries(){for(const name of files.keys())yield [name,{}]}
	}
	return {root,files,handles}
}
const setup=async(options={})=>{
	const fs=memoryFS(),store=createSessionStore(async()=>fs.root)
	const storage={send:jest.fn((type,payload)=>store[type.slice(8)](payload)),destroy:jest.fn()}
	let clock=0
	const recorder=new SessionRecorder({sessionId:'test-session',storage,now:()=>clock,flushInterval:60000,...options})
	await recorder.open();await recorder.start()
	return {...fs,store,storage,recorder,setTime:t=>clock=t}
}

test('deletion removes session media, events and orphan chunks without touching other recordings',async()=>{
	const {recorder,files,store}=await setup()
	await recorder.addMediaChunk('audio',new Blob(['audio']))
	await expect(store.remove({id:recorder.sessionId})).rejects.toThrow('Stop this recording')
	await recorder.stop()
	files.set('test-session.audio.orphan.bin',new Uint8Array([1,2]))
	files.set('test-session-other.events',new Uint8Array([3]))
	const sessions=await store.list()
	expect(sessions[0].storageBytes).toBeGreaterThan(16)
	await expect(store.remove({id:'../'})).rejects.toThrow('Invalid session id')
	await store.remove({id:recorder.sessionId})
	expect([...files.keys()]).toEqual(['test-session-other.events'])
	expect(await store.list()).toEqual([])
})

test('failed deletion keeps its manifest so remaining files can be found and deleted on retry',async()=>{
	const {recorder,files,root,store}=await setup()
	await recorder.addMediaChunk('audio',new Blob(['audio']))
	await recorder.stop()
	const remove=root.removeEntry;let count=0
	root.removeEntry=async name=>{if(++count===2)throw Error('File locked');await remove(name)}
	await expect(store.remove({id:recorder.sessionId})).rejects.toThrow('File locked')
	expect(files.has('test-session.manifest.json')).toBe(true)
	expect(await store.list()).toHaveLength(1)
	root.removeEntry=remove
	await store.remove({id:recorder.sessionId})
	expect(files.size).toBe(0)
})

test('busy storage batches incoming notes instead of overflowing the operation queue',async()=>{
	const {recorder,storage,files}=await setup({batchSize:1})
	const send=storage.send.getMockImplementation()
	let release
	storage.send.mockImplementationOnce((...args)=>new Promise(resolve=>{release=()=>resolve(send(...args))}))
	recorder.recordNoteOn(60)
	await Promise.resolve()
	for(let index=0;index<4000;index++)recorder.recordNoteOff(60)
	expect(recorder.error).toBeUndefined()
	expect(recorder.pendingOperations).toBe(1)
	expect(recorder.events).toHaveLength(4000)
	release()
	await recorder.stop()
	expect(decodeSessionEvents(files.get('test-session.events').slice(16).buffer)).toHaveLength(4001)
})

test('concurrent audio/video chunks reserve unique names, preserve bytes and recover ordered takes',async()=>{
	const {recorder,files,store,storage}=await setup()
	try {
		const entries=await Promise.all([
			recorder.addMediaChunk('audio',new Blob(['one'],{type:'audio/webm'})),
			recorder.addMediaChunk('video',new Blob(['video'],{type:'video/webm'})),
			recorder.addMediaChunk('audio',new Blob(['two'],{type:'audio/webm'}))])
		expect(new Set(entries.map(e=>e.fileName)).size).toBe(3)
		expect(entries.map(e=>e.byteLength)).toEqual([3,5,3])
		expect(new TextDecoder().decode(files.get(entries[1].fileName))).toBe('video')
		await recorder.stop()
		expect(storage.destroy).toHaveBeenCalledTimes(1)
		expect(await (await store.media({id:'test-session',kind:'audio',take:0})).text()).toBe('onetwo')
		expect((await store.recover({id:'test-session'})).media.video).toHaveLength(1)
	} finally {recorder.destroy()}
})
test('partial write failure rolls back, rejects, closes resources and never retries events',async()=>{
	const {recorder,handles,files,storage}=await setup()
	const handle=handles.get('test-session.events'),write=handle.write.getMockImplementation()
	handle.write.mockImplementationOnce((bytes,options)=>write(bytes.subarray(0,4),options)).mockImplementationOnce(()=>{throw Error('Disk full')})
	recorder.recordNoteOn(60)
	await expect(recorder.flush()).rejects.toThrow('Disk full')
	expect(files.get('test-session.events').length).toBe(16)
	await expect(recorder.stop()).rejects.toThrow('Disk full')
	expect(storage.destroy).toHaveBeenCalledTimes(1)
	expect(handle.close).toHaveBeenCalledTimes(1)
	expect(storage.send.mock.calls.filter(([type])=>type==='session:appendEvents')).toHaveLength(1)
})
test('recovery excludes partial tails and exposes unindexed media without inventing an index',async()=>{
	const {recorder,files,store}=await setup()
	await recorder.stop()
	const header=files.get('test-session.events')
	files.set('test-session.events',new Uint8Array([...header,...new Uint8Array(encodeSessionEvents([{type:'noteOn',note:60,velocity:1}])),1,2]))
	files.set('test-session.audio.0.orphan.bin',new Uint8Array([1,2,3]))
	const recovered=await store.recover({id:'test-session'})
	expect(recovered.eventBytes).toBe(48)
	expect(recovered.warnings).toContain('Partial trailing event excluded')
	expect(recovered.orphans).toEqual(['test-session.audio.0.orphan.bin'])
	expect((await store.midi({id:'test-session'})).type).toBe('audio/midi')
})
test('zero clock origin, source dictionary, program, controller and byte velocity survive storage',async()=>{
	const {recorder,files,setTime}=await setup()
	setTime(500)
	recorder.record({type:'noteOn',source:'person-a',note:60,velocity:1,velocityUnit:'midi'})
	recorder.record({type:'programChange',source:'person-a',program:40})
	recorder.record({type:'control',source:'person-a',controller:64,value:127})
	await recorder.stop()
	const events=decodeSessionEvents(files.get('test-session.events').slice(16).buffer)
	expect(events[0]).toMatchObject({time:500,velocity:1,velocityUnit:'midi',track:0})
	expect(events[1].value1).toBe(40)
	expect(events[2]).toMatchObject({note:64,value1:127})
	expect(recorder.manifest.tracks[0].source).toBe('person-a')
})

test('media remains recoverable even when the separate MIDI file is damaged',async()=>{
	const {recorder,files,store}=await setup()
	await recorder.addMediaChunk('audio',new Blob(['saved audio'],{type:'audio/webm'}))
	await recorder.stop();files.set('test-session.events',new Uint8Array([0,0]))
	const manifest=await store.recover({id:'test-session'})
	expect(manifest.eventError).toBe('Unsupported session format')
	expect(manifest.media.audio).toHaveLength(1)
	expect(await(await store.media({id:'test-session',kind:'audio',take:0})).text()).toBe('saved audio')
	await expect(store.midi({id:'test-session'})).rejects.toThrow('Unsupported session format')
})

test('idle Auto MIDI avoids constant disk writes but retains a recovery heartbeat',async()=>{
	jest.useFakeTimers()
	let recorder
	try {
		const setupResult=await setup({flushInterval:500});recorder=setupResult.recorder
		const {storage,setTime}=setupResult,initial=storage.send.mock.calls.length
		setTime(5000);await jest.advanceTimersByTimeAsync(5000)
		expect(storage.send.mock.calls).toHaveLength(initial)
		setTime(30000);await jest.advanceTimersByTimeAsync(500)
		expect(storage.send.mock.calls.at(-1)[0]).toBe('session:checkpoint')
		expect(storage.send.mock.calls).toHaveLength(initial+1)
		await recorder.stop()
	} finally {recorder?.destroy();jest.useRealTimers()}
})

test('replay windows sort scheduled events and reconstruct held notes when seeking',async()=>{
	const {recorder,store,setTime}=await setup()
	recorder.record({type:'noteOn',note:60,velocity:1,time:0})
	recorder.record({type:'noteOff',note:60,time:20000})
	recorder.record({type:'noteOn',note:62,velocity:1,time:10000})
	recorder.record({type:'noteOff',note:62,time:15000})
	setTime(25000);await recorder.stop()
	const window=await store.noteWindow({id:'test-session',from:12000,to:22000})
	expect(window.held.map(e=>e.note)).toEqual([60,62])
	expect(window.events.map(e=>e.time)).toEqual([15000,20000])
	expect(window.durationMs).toBe(25000)
	await expect(store.noteWindow({id:'test-session',from:0,to:100000})).rejects.toThrow('Invalid replay window')
})


test('DAWproject storage export honors the committed event snapshot',async()=>{
	const {recorder,store}=await setup()
	try{
		recorder.recordNoteOn(60,1,0,{time:0})
		await recorder.flush()
		const eventBytes=recorder.offset
		recorder.recordNoteOn(62,1,0,{time:1000})
		await recorder.flush()
		const blob=await store.dawproject({id:recorder.sessionId,options:{eventBytes,endTime:2000}})
		const project=strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['project.xml'])
		expect(project).toContain('key="60"')
		expect(project).not.toContain('key="62"')
		expect(project).toContain('duration="2"')
	}finally{await recorder.stop()}
})
