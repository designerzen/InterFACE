import { now } from '../timing/timing.js'
import { addTooltip, removeTooltip } from './tooltips.js'
import { audioContext, getMasterGain } from '../audio/audio.js'

const createCanvasProgressBar = (width, height) => {
	const canvas = document.createElement("canvas")
	canvas.className = "audio-progress"
	canvas.width = width
	canvas.height = height
	return canvas
}

export const createAudioElement = (src, fileName, downloadCallback, waveform=null ) => {
	
	const width = 48
	const height = 48

	let isPlaying = false

	const buttons = []
	const unique = Math.ceil( now() * 10000000 )
	const id = `audio-${unique}`
	
	const wrapper = document.createElement("div")
	wrapper.className = "audio-player paused instrument-"+fileName
	wrapper.id = id

	const progressBar = createCanvasProgressBar(  width, height )
	const canvasContext = progressBar.getContext("2d")
	
	let audio = new Audio()
	let duration = audio.duration
	let currentTime = audio.currentTime	

	// console.log("Creating an audio element...", audio, {src,fileName, duration, currentTime})
	
	audio.onload = e =>{
		
	}
	audio.onloadedmetadata = e => {
		// probably infinity!
		duration = !isNaN(audio.duration) ? audio.duration : -1
		currentTime = audio.currentTime
	}

	// audio.onprogress = e =>{
	// 	console.log("change indicator", e)
	// }

	audio.ontimeupdate = e =>{
		currentTime = audio.currentTime
		duration = audio.duration
		const progress = currentTime / duration
		// cheeat and use canvas for progress
		canvasContext.clearRect(0, 0, width, height)
	
		canvasContext.fillStyle = "white"
		canvasContext.fillRect(0, 0, progress * width, height)
		// expensive : wrapper.setAttribute("style", `--progress:${progress}` )
	}
	audio.src = URL.createObjectURL(src)
	audio.loop = true

	// hijack and re route the audio
	const proxy = audioContext.createMediaElementSource(audio)
	proxy.connect( getMasterGain() )

	const menu = document.createElement("menu")
	menu.className = "audio-download-menu"

	// fileName
	const textPlay = `Play <strong>${fileName}</strong> loop`
	const textPause = `Pause <strong>${fileName}</strong> loop`

	const playPause = document.createElement("button")
	playPause.className = "button-play-pause"
	playPause.innerHTML = textPlay
	playPause.setAttribute("aria-label", `Play or Pause this loop`) 
		
	playPause.addEventListener("click", e => {
		isPlaying ? 
			audio.pause() :
			audio.play() 
		
		isPlaying = !isPlaying
		wrapper.classList.toggle("paused", !isPlaying)
		playPause.innerHTML = isPlaying ? textPause : textPlay
	})

	buttons.push( playPause )

	const exitButton = document.createElement("button")
	exitButton.className = "button-close"
	exitButton.textContent = "Exit"
	exitButton.setAttribute("aria-label", `Clear this loop`) 
	exitButton.addEventListener("click", e => {
		audio.pause()
		audio.ontimeupdate = audio.onloadedmetadata = audio.onload = null
		audio.currentTime = 0
		URL.revokeObjectURL(audio.src)
		audio = null
		wrapper.parentElement.removeChild(wrapper)
		buttons.forEach( button => removeTooltip( button) )
	})
	
	buttons.push( exitButton )

	const anchor = document.createElement("a")
	anchor.className = "audio-downloader"
	anchor.textContent = `Click to download this audio file as WAVE`
	anchor.download = fileName
	anchor.href = audio.src
		
	wrapper.appendChild(audio)
	wrapper.appendChild(anchor)
	wrapper.appendChild(playPause)
	wrapper.appendChild(menu)
	wrapper.appendChild(exitButton)

	const fileTypes = ["mp3", "ogg", "wave"]

	fileTypes.forEach( buttonName => {
		const button = document.createElement("button")
		button.textContent = buttonName
		button.setAttribute("aria-label", `Download as an ${buttonName} file`) 
		button.type = "button"
		button.class = `download button-download-${buttonName}`
		button.addEventListener("click", e => {
			// user has clicked the download button...
			downloadCallback && downloadCallback(buttonName)
		})
		buttons.push( button )
		menu.appendChild(button)
	})

	buttons.forEach( button => addTooltip( button) )
	
	if (waveform)
	{
		const interactiveWaveform = document.createElement("div")
		interactiveWaveform.className ="waveform-wrapper"
		interactiveWaveform.innerHTML = waveform
		interactiveWaveform.appendChild(progressBar)
		wrapper.appendChild(interactiveWaveform)
	}
	
	return wrapper
}

export const appendAudioElement = (src, fileName, downloadCallback, waveform ) => {
	src = Array.isArray(src) ? src[0] : src
	const audio = createAudioElement(src, fileName, downloadCallback, waveform)
	document.getElementById("photographs").appendChild( audio )
	// Scroll the audio frame into view
	requestAnimationFrame( ()=>document.getElementById(audio.id).scrollIntoView() )
}