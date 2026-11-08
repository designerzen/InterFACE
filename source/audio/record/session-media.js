const mimeFor = (Recorder,kind) => {
	const choices=kind==='audio' ? ['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'] : ['video/webm;codecs=vp8','video/mp4','video/webm;codecs=vp9']
	return choices.find(type=>Recorder.isTypeSupported?.(type)) ?? ''
}
export const createSessionMediaCapture = ({audioStream,canvas,fps=15,onChunk,onError,now=()=>performance.now(),sessionStart=now(),take=0,Recorder=globalThis.MediaRecorder,maxPendingBytes=32*1024*1024,stopTimeout=15000}) => {
	if (!Recorder) throw new Error('Media recording is unavailable')
	const records=[],ownedTracks=[]
	const received=new Map()
	let failure, pendingBytes=0, writes=Promise.resolve(), stopPromise,hasStarted=false
	const fail=error=>{
		if (!failure) { failure=error; onError?.(error) }
		for (const {recorder} of records) if (recorder.state!=='inactive') {
			try { recorder.stop() } catch {}
		}
	}
	const add=(kind,stream)=>{
		const mimeType=mimeFor(Recorder,kind)
		const recorder=new Recorder(stream,mimeType ? {mimeType} : {})
		let origin=0,firstTimecode
		let resolveStop
		const stopped=new Promise(resolve=>{resolveStop=resolve})
		recorder.addEventListener('start',()=>{origin=now()-sessionStart})
		recorder.addEventListener('error',event=>fail(event.error ?? new Error('Media encoder failed')))
		recorder.addEventListener('stop',resolveStop,{once:true})
		recorder.addEventListener('dataavailable',event=>{
			if (!event.data?.size) return
			received.set(kind,(received.get(kind) ?? 0)+event.data.size)
			if (pendingBytes+event.data.size>maxPendingBytes) { fail(new Error('Media storage cannot keep up')); return }
			pendingBytes+=event.data.size
			const finite=Number.isFinite(event.timecode)
			if (finite && firstTimecode==null) firstTimecode=event.timecode
			const metadata={take,startTime:finite ? origin+event.timecode-firstTimecode : null,streamStartTime:origin,receivedAt:now()-sessionStart,duration:null,mimeType:event.data.type || recorder.mimeType}
			writes=writes.then(()=>onChunk(kind,event.data,metadata)).catch(fail).finally(()=>{pendingBytes-=event.data.size})
		})
		records.push({kind,recorder,stopped,resolveStop,started:false})
	}
	try {
		if (audioStream) add('audio',audioStream)
		if (canvas) {
			if (!canvas.captureStream) throw new Error('This display cannot be captured')
			const stream=canvas.captureStream(fps)
			ownedTracks.push(...stream.getTracks())
			add('video',stream)
		}
		if (!records.length) throw new Error('Select audio or video')
	} catch(error) { for (const track of ownedTracks) track.stop(); throw error }
	return {
		get available(){return records.length>0},
		start(timeslice=1000) {
			if(hasStarted||stopPromise)throw new Error('Capture already started or stopped')
			hasStarted=true
			try { for (const record of records) { record.recorder.start(timeslice); record.started=true } }
			catch(error) { fail(error); for(const track of ownedTracks)track.stop(); throw error }
		},
		requestData() {
			for(const {recorder} of records) if(recorder.state==='recording') recorder.requestData()
		},
		stop() {
			if (stopPromise) return stopPromise
			stopPromise=(async()=>{
				let timer
				try {
					for(const record of records) {
						if (!record.started) record.resolveStop()
						else if(record.recorder.state!=='inactive') record.recorder.stop()
					}
					await Promise.race([Promise.all(records.map(r=>r.stopped)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Media encoder did not finish; saved chunks remain recoverable')),stopTimeout)})])
					await writes
					if(failure) throw failure
					const empty=records.filter(record=>record.started&&!received.get(record.kind)).map(record=>record.kind)
					if(empty.length)throw new Error(`No ${empty.join(' or ')} data was produced. Keep the audio and visual display running while recording.`)
				} finally { clearTimeout(timer);for(const track of ownedTracks)track.stop() }
			})()
			return stopPromise
		}
	}
}
