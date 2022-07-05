let options
if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    options = {mimeType: 'video/webm; codecs=vp9'};
} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    options = {mimeType: 'video/webm; codecs=vp8'};
} else {
    options = {}
}

// https://codereview.chromium.org/1579693006
// Chrome bugs out for audio
export const canvasVideoRecorder= (canvas, fps=15 ) => {
	
	const stream = canvas.captureStream(fps)
	const recorder = new MediaRecorder(stream, options)
  
	let capturing = false
	
	const start = () => {
		capturing = true
		recorder.start()
	}

	const stop = (callback) => {
		recorder.addEventListener('dataavailable', e => {
			capturing = false
			callback(e.data)
		})
  		recorder.stop()
	}

	return {start, stop}
}

// FIXME: Destroy once played?
export const createVideo = (blob) => {
	const videoURL = URL.createObjectURL(blob)
	const video = new Video()
	video.loop = true
	video.src = videoURL
	video.play()
	return video
}

export const encodeVideo = (data, type="webm") => {
	return new Blob( [ data ], { 'type': `video/${type}` })
}