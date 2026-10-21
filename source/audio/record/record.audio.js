import SessionRecorder, {readSessionMedia} from '../../storage/session-recorder.js'
import {createSessionMediaCapture} from './session-media.js'
import {downloadBlob} from '../../dom/download.js'

// The older recording shortcut shares the transport's OPFS-backed take.
export const recordAudio = controller => {
	let session,capture,blob,started=0,duration=0,recording=false,busy=false
	const isRecording=()=>controller ? controller.state().recording : recording
	const startRecording=async stream=>{
		if(busy||isRecording())throw new Error('Already recording')
		busy=true;blob=null
		try {
			if(controller) await controller.startMedia({audio:true,video:false})
			else {
				session=new SessionRecorder();await session.open();await session.start()
				const take=session.beginTake({audio:true,video:false})
				capture=createSessionMediaCapture({audioStream:stream,take,sessionStart:session.startTime,onChunk:(kind,data,meta)=>session.addMediaChunk(kind,data,meta)})
				capture.start()
			}
			started=performance.now();recording=true
			return {stream}
		} catch(error) {
			try{await capture?.stop()}catch{}
			if(session)await session.stop().catch(()=>{})
			capture=null;session=null;throw error
		} finally {busy=false}
	}
	const stopRecording=async()=>{
		if(busy||!isRecording())throw new Error('Not recording')
		busy=true
		const origin=controller?.state().mediaStartedAt ?? started
		try {
			if(controller) {await controller.stopMedia();blob=await controller.readLastMedia('audio')}
			else {
				try{await capture.stop();await session.endTake(0)}finally{await session.stop()}
				blob=await readSessionMedia(session.sessionId,'audio',0)
			}
			duration=performance.now()-origin;return blob
		} finally {recording=false;busy=false;capture=null;session=null}
	}
	const encodeRecording=async()=>{
		if(!blob)throw new Error('No completed audio recording')
		// MediaRecorder already encoded these bytes. Relabelling is not transcoding.
		return blob
	}
	const downloadRecording=async(fileName='photosynth-audio')=>{
		const result=await encodeRecording()
		const extension=result.type.includes('mp4')?'mp4':result.type.includes('ogg')?'ogg':'webm'
		downloadBlob(result,`${fileName}.${extension}`);return result
	}
	return {isRecording,startRecording,stopRecording,encodeRecording,downloadRecording,
		isRecordingAvailable:()=>typeof globalThis.MediaRecorder==='function'&&!!navigator.storage?.getDirectory,
		getRecordedDuration:()=>isRecording()?performance.now()-(controller?.state().mediaStartedAt ?? started):duration}
}
export const blobToBase64=blob=>new Promise((resolve,reject)=>{
	const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)
})
