
// RECORD AUDIO
// TODO : new Worker( new URL('./recorder.worker.js', import.meta.url), {type: 'module'} )
		

// TODO: Add in AnalyzerNode and record the waveform data too if requested
// If audio data available then push  it to the chunk array 
export const record = (stream)=>{

	let recording = false
	let dataArray = []
	let mediaRecorder

	const startRecording = stream => {

		return new Promise((resolve,reject)=>{
			
			if (recording)
			{
				return reject("already recording")
			}
			
			mediaRecorder = new MediaRecorder(stream)
			mediaRecorder.onstart = event => {
				dataArray.length = 0
				resolve({mediaRecorder,dataArray,stream})
			}

			mediaRecorder.ondataavailable = (ev) =>{ 
				dataArray.push(ev.data)
			}

			mediaRecorder.onwarning = function(e) {
				console.warn('onwarning fired')
			}
			
			mediaRecorder.onerror = (error) => {
				console.error('onerror fired',error.name,error)
				switch(error.name) {
					case 'InvalidState':
						break;
		
					case 'OutOfMemory':
						break;
		
					case 'IllegalStreamModification':
						break;
		
					case 'OtherRecordingError':
						break;
		
					case 'GenericError':
						break;
		
					default:
						console.error('MediaRecorder Error', error);
						break;
				}
			}

			// Convert the audio data in to blob  
			// after stopping the recording 
			mediaRecorder.start()
			recording = true	
			//console.log("recording", {mediaRecorder, dataArray})
		})
	}

	const stopRecording = ( ) => {
		return new Promise((resolve,reject)=>{
			if (!recording)
			{
				return reject("Not recording")
			}
			
			mediaRecorder.onstop = event => { 
	
				// After fill up the chunk  
				// array make it empty 
				recording = false
				mediaRecorder = null

				// Pass the audio url to the 2nd video tag 
				resolve( dataArray )
			}
			mediaRecorder.stop()
		})
	}

	const encodeRecording = ( format="audio", type= "mp3", codecs="") => {
		// ='audio/mp3;'
		// var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' 
		// 'audio': [
		// 	'audio/webm;codecs=opus',
		// 	'audio/webm',
		// 	'audio/ogg',
		// 	'audio/mp3',
		// 	'audio/wav'
		// ],
		// 'video': [
		// 	'video/webm;codecs=vp9',
		// 	'video/webm;codecs=vp8',
		// 	'video/webm;codecs=h264',
		// 	'video/webm;codecs=opus',
		// 	'video/webm',
		// 	'video/mp4',
		// 	'video/mpeg'
		// ]

		const encode = `${format}/${type}` + codecs.length ? ';codecs=' + codecs : ''
		//console.error("Encoding", encode, dataArray)
		const audioData = new Blob(dataArray, { 'type': encode })
		return audioData
	}

	// const looper = (blob) => {
	// 	const audioURL = window.URL.createObjectURL(blob)
 	// 	const audio = document.createElement('audio')
	// 	audio.setAttribute('controls', '')
	// 	audio.src = audioURL;
	// }

	const downloadRecording = ( fileName="recording", format="audio", type= "ogg", codec="opus" ) => {
		console.log("downloadRecording", {fileName,format,type,codec})
		const blob = encodeRecording( format, type, codec )
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		document.body.appendChild(a)
		a.style = "display: none"
		a.href = url
		a.download = `${fileName}.${codec||type}`
		a.click()
		URL.revokeObjectURL(url)
		return blob
	}

	const isRecordingAvailable = () => !!(window && window.MediaRecorder && typeof window.MediaRecorder.isTypeSupported === 'function' && window.Blob)
	const isRecording = () => recording

	return { isRecordingAvailable, downloadRecording, encodeRecording, startRecording,stopRecording, isRecording}
} 

/**
 * To save to a server as Base64
 * @param {Blob} blob 
 * @returns 
 */
export const blobToBase64 = (blob) => {
	const reader = new FileReader()
	reader.readAsDataURL(blob)
	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result)
		}
	})
}