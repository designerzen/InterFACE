import SessionRecorder, {deleteStoredSession,exportStoredSession,exportStoredDAWProject,exportStoredMusicXML,readSessionMedia,readSessionNoteWindow} from './session-recorder.js'
import {setSessionEventRecorder,clearSessionEventRecorder} from './session-events.js'
import {createSessionMediaCapture} from '../audio/record/session-media.js'
import {createSessionNotePlayer} from '../audio/record/session-note-player.js'

// MIDI owns the session; media takes never reset its clock or event history.
export const createSessionController = ({getContext,getOutput,getCanvas,getTempo,onChange=()=>{},onError=()=>{}}) => {
	let recorder=null,lastId=null,capture=null,destination=null,output=null,take,mediaStartedAt=0,auto=true,queue=Promise.resolve(),pending=0
	let player,lastDuration=null,replayGeneration=0
	const state=()=>({id:recorder?.sessionId ?? lastId,recording:!!capture,midi:!!recorder?.isRecording,busy:pending>0,auto,mediaStartedAt,
		durationMs:capture?Math.max(0,performance.now()-mediaStartedAt):(lastDuration ?? recorder?.elapsed ?? 0),
		hasNotes:(recorder?.sequence ?? 0)>0,hasMedia:(recorder?.mediaIndices?.size ?? 0)>0,bpm:Number(getTempo?.())||120,replay:player?.state()})
	const notify=()=>onChange(state())
	player=createSessionNotePlayer({getContext,onChange:notify,onError})
	const serial=operation=>{
		pending++; notify()
		const task=queue.then(operation)
		queue=task.catch(onError).finally(()=>{pending--;notify()})
		return task
	}
	const startNotes=async()=>{
		if(recorder?.isRecording) return recorder.sessionId
		if(recorder) await stopNotes()
		const next=new SessionRecorder({onError:error=>{onError(error); api.stop().catch(()=>{}); notify()}})
		try { await next.open(); await next.start() }
		catch(error) {next.destroy();throw error}
		recorder=next;lastId=next.sessionId
		next.manifest.tempoMap=[{time:0,bpm:getTempo?.() || 120}]
		next.dirty=true
		setSessionEventRecorder(next)
		return next.sessionId
	}
	const disconnect=()=>{
		if(destination) {
			try {output.disconnect(destination)} catch {}
			for(const track of destination.stream.getTracks()) track.stop()
		}
		destination=null;output=null
	}
	const stopMedia=async()=>{
		if(!capture) return
		const current=capture;let failure
		lastDuration=Math.max(0,performance.now()-mediaStartedAt)
		try {await current.stop()} catch(error) {failure=error}
		finally {
			capture=null;disconnect()
			try {await recorder?.endTake(take,failure)} catch(error) {failure ??= error}
		}
		if(failure) throw failure
	}
	const stopNotes=async()=>{
		let failure
		try {await stopMedia()} catch(error) {failure=error}
		if(recorder) {
			const current=recorder;clearSessionEventRecorder(current);recorder=null
			try {await current.stop()} catch(error) {failure ??= error}
		}
		if(failure) throw failure
	}
	const api={
		state,
		start:()=>serial(startNotes),
		stop:()=>serial(stopNotes),
		deleteSession:id=>serial(async()=>{
			if(recorder?.sessionId===id)throw new Error('Stop audio, video and automatic MIDI recording before deleting this recording')
			if(player.state().id===id){replayGeneration++;player.destroy()}
			await deleteStoredSession(id)
			if(lastId===id){lastId=null;lastDuration=null}
		}),
		setAuto:value=>serial(async()=>{auto=value;if(auto)await startNotes();else if(!capture)await stopNotes()}),
		setTempo:bpm=>recorder?.setTempo(bpm),
		readLastMedia:(kind='audio')=>readSessionMedia(lastId,kind,take),
		loadReplay:async id=>{
			const generation=++replayGeneration
			const snapshot=await serial(async()=>{
				if(recorder?.sessionId!==id)return {}
				await recorder.flush()
				return {eventBytes:recorder.offset,durationMs:recorder.elapsed}
			})
			if(generation===replayGeneration)await player.load((from,to)=>readSessionNoteWindow(id,{...snapshot,from,to}),id)
		},
		playReplay:()=>player.play(),
		pauseReplay:()=>{replayGeneration++;player.pause()},
		seekReplay:time=>player.seek(time),
		startMedia:({audio=true,video=false}={})=>serial(async()=>{
			if(capture)return
			if(!audio&&!video)throw new Error('Select audio or video to record')
			await startNotes()
			const session=recorder
			take=session.beginTake({audio,video})
			try {
				if(audio) {
					const context=getContext();output=getOutput()
					if(!context||!output)throw new Error('Audio is not ready')
					await context.resume()
					destination=context.createMediaStreamDestination();output.connect(destination)
				}
				const canvas=video ? getCanvas() : null
				if(video&&!canvas)throw new Error('Video display is not ready')
				capture=createSessionMediaCapture({audioStream:destination?.stream,canvas,take,sessionStart:session.startTime,
					onChunk:(kind,blob,metadata)=>session.addMediaChunk(kind,blob,metadata),
					onError:error=>{onError(error);api.stopMedia().catch(()=>{})}})
				capture.start()
				mediaStartedAt=performance.now()
			} catch(error) {
				try {await capture?.stop()} catch {}
				capture=null;disconnect();await session.endTake(take,error).catch(()=>{})
				if(!auto)await stopNotes().catch(()=>{})
				throw error
			}
		}),
		stopMedia:()=>serial(async()=>{try {await stopMedia()} finally {if(!auto)await stopNotes()}}),
		exportMIDI:async(id,options={})=>{
			const snapshot=await serial(async()=>{
				const sessionId=id ?? lastId
				if(recorder?.sessionId!==sessionId)return {id:sessionId,options}
				await recorder.flush()
				return {id:sessionId,options:{tempoMap:[...recorder.manifest.tempoMap],eventBytes:recorder.offset,endTime:recorder.elapsed,...options}}
			})
			// Long exports must not hold the transport queue or block Stop.
			return exportStoredSession(snapshot.id,snapshot.options)
		},
		exportDAWProject:async(id,options={})=>{
			const snapshot=await serial(async()=>{
				const sessionId=id ?? lastId
				if(recorder?.sessionId!==sessionId)return {id:sessionId,options}
				await recorder.flush()
				return {id:sessionId,options:{tempoMap:[...recorder.manifest.tempoMap],eventBytes:recorder.offset,endTime:recorder.elapsed,...options}}
			})
			// Long exports must not hold the transport queue or block Stop.
			return exportStoredDAWProject(snapshot.id,snapshot.options)
		},
		exportMusicXML:async(id,options={})=>{
			const snapshot=await serial(async()=>{
				const sessionId=id ?? lastId
				if(recorder?.sessionId!==sessionId)return {id:sessionId,options}
				await recorder.flush()
				return {id:sessionId,options:{tempoMap:[...recorder.manifest.tempoMap],eventBytes:recorder.offset,endTime:recorder.elapsed,...options}}
			})
			// Long exports must not hold the transport queue or block Stop.
			return exportStoredMusicXML(snapshot.id,snapshot.options)
		},
		flush:()=>{try {capture?.requestData()} catch(error) {onError(error)};return recorder?.flush().catch(onError)},
	}
	return api
}
