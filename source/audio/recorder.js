
// RECORD AUDIO

// If audio data available then push  it to the chunk array 
export const record = (stream)=>{
	let recording = false
	let dataArray

	const startRecording = stream => {

		return new Promise((resolve,reject)=>{
			
			if (recording)
			{
				return reject("already recording")
			}

			dataArray = []
			
			mediaRecorder = new MediaRecorder(stream)
			mediaRecorder.ondataavailable = (ev) =>{ 
				dataArray.push(ev.data)
				resolve({mediaRecorder,dataArray,stream})
			}

			mediaRecorder.onwarning = function(e) {
				console.log('onwarning fired')
			  }
			
			  mediaRecorder.onerror = (error) => {
				console.log('onerror fired')
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

				// Pass the audio url to the 2nd video tag 
				resolve( dataArray )
			}
			mediaRecorder.stop()
		})
	}

	const encodeRecording = (recording, type='audio/mp3;') => {

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
		const audioData = new Blob(recording, { 'type': type })
		return audioData
	}
	const looper = (blob) => {
		const audioURL = window.URL.createObjectURL(blob)
 		const audio = document.createElement('audio')
		audio.setAttribute('controls', '')
		audio.src = audioURL;
	}

	const downloadRecording = () => {
		var blob = new Blob(recordedChunks, {
		  type: "video/webm"
		});
		var url = URL.createObjectURL(blob);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = url;
		a.download = "test.webm";
		a.click();
		window.URL.revokeObjectURL(url);
	  }

	const isAvailable = () => !!(window && window.MediaRecorder && typeof window.MediaRecorder.isTypeSupported === 'function' && window.Blob)
	const isRecording = () => recording

	return {isAvailable, downloadRecording, encodeRecording, startRecording,stopRecording, isRecording}
} 