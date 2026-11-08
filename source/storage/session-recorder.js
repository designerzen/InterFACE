import StorageOPFS from './opfs.js'
import { encodeSessionEvents, SESSION_EVENT_HEADER_SIZE, SESSION_EVENT_RECORD_SIZE } from './session-format.js'

export const withSessionStorage = async callback => {
	const storage = new StorageOPFS({timeout:300000})
	try { return await callback(storage) } finally { storage.destroy() }
}
export const recoverSessionManifests = () => withSessionStorage(storage => storage.send('session:list'))
export const deleteStoredSession = id => withSessionStorage(storage => storage.send('session:remove',{id}))
export const exportStoredSession = (id, options={}) => withSessionStorage(storage => storage.send('session:midi',{id,options}))
export const exportStoredDAWProject = (id, options={}) => withSessionStorage(storage => storage.send('session:dawproject',{id,options}))
export const exportStoredMusicXML = (id, options={}) => withSessionStorage(storage => storage.send('session:musicxml',{id,options}))
export const readSessionMedia = (id, kind, take) => withSessionStorage(storage => storage.send('session:media',{id,kind,take}))
export const readSessionOrphan = name => withSessionStorage(storage => storage.send('session:orphan',{name}))
export const readSessionNoteWindow = (id,options) => withSessionStorage(storage => storage.send('session:noteWindow',{id,...options}))

export default class SessionRecorder {
	constructor({ sessionId = `session-${crypto.randomUUID()}`, batchSize=64, flushInterval=500, onError, storage, now=()=>performance.now(), maxPendingBytes=32*1024*1024 }={}) {
		this.sessionId=sessionId
		this.fileName=`${sessionId}.events`
		this.storage=storage ?? new StorageOPFS()
		this.batchSize=batchSize
		this.flushInterval=flushInterval
		this.maxPendingBytes=maxPendingBytes
		this.onError=onError
		this.now=now
		this.state='created'
		this.events=[]
		this.sequence=0
		this.offset=SESSION_EVENT_HEADER_SIZE
		this.queue=Promise.resolve()
		this.pendingBytes=0
		this.pendingOperations=0
		this.dirty=false
		this.lastCheckpoint=0
		this.trackIds=new Map()
		this.channels=new Map()
		this.mediaIndices=new Map()
		this.nextTake=0
		this.manifest={version:2,sessionId,eventFile:this.fileName,mediaIndexFile:`${sessionId}.media-index.jsonl`,status:'created',tracks:{},takes:[],tempoMap:[]}
	}
	get isRecording() { return this.state==='recording' }
	get elapsed() { return this.startTime == null ? 0 : Math.max(0,this.now()-this.startTime) }
	fail(error) {
		if (!this.error) { this.error=error; this.state='error'; clearInterval(this.timer); this.onError?.(error) }
		return error
	}
	enqueue(operation) {
		if(this.pendingOperations>=128)return Promise.reject(this.fail(new Error('Recording storage queue is full')))
		this.pendingOperations++
		const result=this.queue.then(() => {
			if (this.error) throw this.error
			return operation()
		}).finally(()=>{this.pendingOperations--})
		this.queue=result.catch(error => { this.fail(error) })
		return result
	}
	async open() {
		if (this.state!=='created') throw new Error('Session already opened')
		try { await this.storage.send('session:begin',{manifest:this.manifest}); this.state='ready' }
		catch (error) { this.fail(error); this.storage.destroy(); throw error }
	}
	async start() {
		if (this.state!=='ready') throw new Error('Session not ready')
		this.startTime=this.now()
		this.state='recording'
		this.manifest.status='recording'
		this.manifest.startedAt=Date.now()
		await this.enqueue(() => this.storage.send('session:checkpoint',this.manifest))
		this.timer=setInterval(()=>{
			if(!this.pendingOperations&&(this.events.length||this.dirty||this.elapsed-this.lastCheckpoint>=30000))this.flush().catch(()=>{})
		},this.flushInterval)
	}
	record(event) {
		if (!this.isRecording) return false
		if (this.events.length>=8192 || this.pendingBytes>=this.maxPendingBytes) { this.fail(new Error('Recording storage cannot keep up')); return false }
		const time=event.time ?? (event.performanceTime == null ? this.elapsed : event.performanceTime-this.startTime)
		if (!Number.isFinite(time)) return false
		const source=String(event.source ?? event.track ?? 'performance')
		if(event.channel==null&&!this.channels.has(source)) {
			const channel=this.channels.size%15
			this.channels.set(source,channel>=9?channel+1:channel)
			if(this.channels.size>15)this.manifest.channelOverflow=true
		}
		const channel=event.channel ?? this.channels.get(source)
		if (!this.trackIds.has(source)) {
			const id=this.trackIds.size
			if (id>=65535) { this.fail(new Error('Too many recording tracks')); return false }
			this.trackIds.set(source,id)
			this.manifest.tracks[id]={name:event.name ?? source,source,person:event.person,channel,program:event.program}
		}
		this.events.push({...event,channel,time:Math.max(0,time),sequence:this.sequence++,track:this.trackIds.get(source)})
		// Accumulate a bounded batch while storage is busy instead of queuing a write per batch.
		if (this.events.length>=this.batchSize&&!this.pendingOperations) this.flush().catch(()=>{})
		return true
	}
	recordNoteOn(note,velocity=1,channel=0,options={}) { return this.record({...options,type:'noteOn',note,velocity,channel}) }
	recordNoteOff(note,velocity=0,channel=0,options={}) { return this.record({...options,type:'noteOff',note,velocity,channel}) }
	setTempo(bpm) {
		bpm=Number(bpm)
		if (Number.isFinite(bpm) && bpm>0 && this.isRecording && this.manifest.tempoMap.at(-1)?.bpm!==bpm) {
			this.manifest.tempoMap.push({time:this.elapsed,bpm});this.dirty=true
		}
	}
	flush() {
		if (this.error) return Promise.reject(this.error)
		if(!this.events.length&&this.pendingOperations)return this.queue.then(()=>{if(this.error)throw this.error})
		const events=this.events.splice(0)
		let buffer
		try { buffer=encodeSessionEvents(events) } catch(error) { return Promise.reject(this.fail(error)) }
		this.pendingBytes+=buffer.byteLength
		const size=buffer.byteLength
		return this.enqueue(async () => {
			try {
				if (size) this.offset=await this.storage.send('session:appendEvents',{buffer,offset:this.offset},[buffer])
				// Checkpoint also durably flushes the event handle when no events arrived.
				this.dirty=false;this.lastCheckpoint=this.elapsed
				await this.storage.send('session:checkpoint',{...this.manifest,durationMs:this.elapsed})
			} finally { this.pendingBytes-=size }
		})
	}
	beginTake(options) {
		const take=this.nextTake++
		this.manifest.takes.push({take,startTime:this.elapsed,status:'recording',...options})
		this.dirty=true
		return take
	}
	async endTake(take,error) {
		Object.assign(this.manifest.takes.find(t=>t.take===take) ?? {},{endTime:this.elapsed,status:error?'error':'stopped'})
		this.dirty=true
		if (!this.error) await this.flush()
	}
	addMediaChunk(kind,blob,metadata={}) {
		if (!['audio','video'].includes(kind) || !this.isRecording) return Promise.reject(new Error('No active media session'))
		if (this.pendingBytes+blob.size>this.maxPendingBytes) return Promise.reject(this.fail(new Error('Media recording storage cannot keep up')))
		const take=metadata.take ?? 0
		const key=kind+':'+take
		const index=this.mediaIndices.get(key) ?? 0
		this.mediaIndices.set(key,index+1)
		const entry={...metadata,kind,take,index,fileName:`${this.sessionId}.${kind}.${take}.${String(index).padStart(8,'0')}.bin`,mimeType:blob.type || metadata.mimeType,byteLength:blob.size}
		this.pendingBytes+=blob.size
		return this.enqueue(async () => {
			try { return await this.storage.send('session:chunk',{blob,entry}) }
			finally { this.pendingBytes-=blob.size }
		})
	}
	async stop() {
		if (this.state==='stopped') return this.manifest
		clearInterval(this.timer)
		const durationMs=this.elapsed
		try {
			if (this.isRecording) { this.state='stopping'; await this.flush().catch(error=>this.fail(error)) }
			await this.queue
			await this.storage.send('session:finish',{...this.manifest,status:this.error?'error':'stopped',endedAt:Date.now(),durationMs})
		} catch(error) { this.fail(error) }
		finally { this.storage.destroy(); this.state=this.error?'error':'stopped' }
		this.manifest.status=this.state
		if (this.error) throw this.error
		return this.manifest
	}
	async exportMIDI(options={}) {
		await this.flush()
		return exportStoredSession(this.sessionId,{tempoMap:this.manifest.tempoMap,eventBytes:this.offset,endTime:this.elapsed,...options})
	}
	async getStorageEstimate() { return navigator.storage?.estimate?.() ?? null }
	close() { return this.stop() }
	destroy() { clearInterval(this.timer); this.storage.destroy(); this.state='stopped' }
}
