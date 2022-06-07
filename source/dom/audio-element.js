import { now } from '../timing/timing.js'

export const createAudioElement = (src, fileName) => {
	const unique = Math.ceil( now() * 10000000 )
	const id = `audio-${unique}`
	const audio = new Audio()

console.log("Creating an audio element...", audio, {src,fileName})

	audio.onload = e =>{
		URL.revokeObjectURL(audio.src)
	}
	audio.src = URL.createObjectURL(src)

	// if ('srcObject' in audio) {
	// 	audio.srcObject = URL.createObjectURL(src)
	// } else {
		// audio.src = URL.createObjectURL(src)
	// }
	
	const wrapper = document.createElement("div")
	wrapper.className = "audio-player"

	const anchor = document.createElement("a")
	anchor.className = "audio-downloader"
	anchor.href = audio.src
	anchor.innerHTML = `Click to download this audio file as WAVE`
	anchor.id = id
	anchor.download = fileName

	wrapper.appendChild(audio)
	wrapper.appendChild(anchor)
	
	// variations to trigger download
	// const mp3 = encodeRecording(recording, 'audio/mp3;')
	//const ogg = encodeRecording(recording, 'audio/ogg; codecs=')

	// const ogg = downloadRecording("magnum","audio","ogg","opus")
	// const mp3 = downloadRecording("magnum","audio","mp3")

	// Creating audio url with reference  
	// of created blob named 'audioData' 

	return wrapper
}

export const appendAudioElement = (src, fileName) => {
	src = Array.isArray(src) ? src[0] : src
	const audio = createAudioElement(src, fileName)
	document.getElementById("photographs").appendChild( audio )
	// Scroll the audio frame into view
	requestAnimationFrame( ()=>document.getElementById(audio.id).scrollIntoView() )
}