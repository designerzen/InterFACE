import {clamp, lerp, TAU} from "../maths/maths"
import {cleanTitle} from './instruments'
import {createReverb} from './reverb'

import {INSTRUMENT_FOLDERS} from "./instruments"

import {
	createInstrumentBanks,
	// getNoteName,
	// getNoteSound, getNoteText,
	NOTE_NAMES, NOTE_NAMES_FRIENDLY,
	// NOTES_BLACK, NOTES_WHITE
} from './notes'


export const randomInstrument = () => INSTRUMENT_FOLDERS[ Math.floor( Math.random() * INSTRUMENT_FOLDERS.length ) ]

export let audioContext

export let bufferLength
export let dataArray

let oscillator
let gainNode
let delayNode
let feedbackNode
let analyser
let compressor
let reverb
let destinationVolume = 0

let outputNode = null

export let playing = false
export let active = false

// 
export const inputNode = () => outputNode
export const inputDryNode = () => gainNode


// just does linear connects in sequence for easier protyping
const chain = ( routes, connect=true ) => {

	const quantity = routes.length

	for (let i=1; i<quantity; ++i)
	{
		const previous = routes[ i-1 ]
		const route = routes[ i ]

		previous.connect(route)
		
		// if last one...
		if (connect && i === quantity-1 )
		{
			route.connect(audioContext.destination)
		}
	}

	// grab the first one
	outputNode = routes[0]
	return outputNode
}

export const setupAudio = async (
	BUFFER_SIZE = 2048, // the buffer size in units of sample-frames.
	INPUT_CHANNELS = 1, // the number of channels for this node's input, defaults to 2
	OUTPUT_CHANNELS = 1 // the number of channels for this node's output, defaults to 2
) => {

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	audioContext = new (window.AudioContext || window.webkitAudioContext)()

	gainNode = audioContext.createGain()
	gainNode.gain.value = 0


	// this should hopefully balance the outputs
	compressor = audioContext.createDynamicsCompressor()
	// 	threshold: [-100, 0],
	// 	knee: [0, 40],
	// 	ratio: [1, 20],
	// 	attack: [0, 1],
	// 	release: [0, 1]
	compressor.threshold.value = -70
	compressor.knee.value = 40
	compressor.ratio.value = 15
	compressor.attack.value = 0.2
	compressor.release.value = 0.5

	reverb = await createReverb(audioContext, 0.5)
	// reverb.gain.value = 0.2

	delayNode = audioContext.createDelay(0.01)
	//delayNode.delayTime.value = 0
	
	feedbackNode = audioContext.createGain()
	feedbackNode.gain.value = 0.2

	analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	// how quick it drops 0.85 looks cool
	analyser.smoothingTimeConstant = 0.45

	// for waves
	// analyser.fftSize = 2048
	// bufferLength = analyser.fftSize

	// for bars
	analyser.fftSize = 256

	bufferLength = analyser.frequencyBinCount
	
    dataArray = new Uint8Array(bufferLength)
	
	//recorder = audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNELS, OUTPUT_CHANNELS)
	analyser.connect(audioContext.destination)

	// chain( [ delayNode, feedbackNode, delayNode, 
	// 			gainNode, reverb, 
	// 				compressor, analyser] )

	// fixes old ios bug about audio not starting until buttons or something
	resumeAudioContext()
	
	// all mod cons
	// return chain( [ delayNode, feedbackNode, delayNode, gainNode, reverb, compressor, analyser ] )
	
	// just compressor and reverb
	return chain( [ gainNode, reverb, compressor, analyser] )
}

export const updateByteFrequencyData = ()=> {
	analyser.fftSize = 2048
	analyser.getByteFrequencyData(dataArray)
}

export const updateByteTimeDomainData = ()=> {
	analyser.fftSize = 256
	analyser.getByteTimeDomainData(dataArray)
}

const monitor = () => {

	const result = requestAnimationFrame(monitor)

	// waves
	//analyser.getByteTimeDomainData(dataArray)
	
	// bsrs
	analyser.getByteFrequencyData(dataArray)

	return result
}

export const stopAudio = () => {
	if (playing)
	{
		playing = false
		// you cannot restart an oscillator!
		//oscillator.stop()
		//oscillator.disconnect()
		// analyser.disconnect()
		return true
	}else{
		return false
	}
	//console.error("stop audio",{playing})
}

const resumeAudioContext = () => {
	if (audioContext.state === 'suspended') 
	{
		audioContext.resume()
	}
}

export const playAudio = () => {
	if (playing)
	{
		return false
	}else{

		resumeAudioContext()

		// analyser.connect(audioContext.destination)
		//oscillator.connect(delayNode)
		
		playing = true
		monitor()
		return true
	}
	//console.error("start audio",{playing})
	return oscillator
}

export const createOscillator = () => {

	// oscillator = audioContext.createOscillator()
	// oscillator.type = "sine" // "sawtooth"
	// oscillator.frequency.value = 261.63
	// oscillator.connect(outputNode)
	// oscillator.start()
}

export const setShape = shape => {
	oscillator.type = shape
}

export const setFrequency = frequency => {
	oscillator.frequency.value = frequency
}

export const getVolume = () => destinationVolume // gainNode.gain.value

// smaller means slower
export const setVolume = (destinationVolume) => {

	destinationVolume = clamp(destinationVolume, 0, 1)
	//gainNode.gain.setValueAtTime(newVolume, audioContext.currentTime)
	gainNode.gain.value = destinationVolume

	return destinationVolume
}

const rate = 0.1
const fadeVolume = (destinationVolume) => {

	//gainNode.gain.value = lerp( gain.gain.value, destinationVolume, 0.1 )
	const newVolume = gainNode.gain.value + (destinationVolume - gainNode.gain.value) * rate
	gainNode.gain.setValueAtTime(destinationVolume, audioContext.currentTime)
	
	if (gainNode.gain.value === destinationVolume)
	{

	}else{
		requestAnimationFrame( fadeVolume )
	}
	return newVolume
}


export const setAmplitude = amplitude => {
	// lerp towards
	 destinationVolume = amplitude
	 fadeVolume()
	//gainNode.gain.clearValues()
	//gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime)
}

export const loadAudio = async (path) => {
	const response = await fetch(path)
	const arrayBuffer = await response.arrayBuffer()
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
	return audioBuffer
  }

// create a buffer, plop in data, connect and play -> modify graph here if required
// detune:0,,  playbackRate:1
export const playTrack = (audioBuffer, offset=0, destination=delayNode, options={ loop:false } ) => {
	
	return new Promise((resolve, reject)=>{

		const trackSource = audioContext.createBufferSource()
		trackSource.buffer = audioBuffer
		
		// loop through options nad add
		// options
		trackSource.loop = options.loop
		// trackSource.detune = options.detune
		//trackSource.playbackRate = options.playbackRate

		trackSource.connect(destination)
		// trackSource.connect(audioContext.destination)
		// console.error("Playing track", {audioBuffer,trackSource} )

		// https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode
		// FIXME: when it has finished playing remove it...
		// trackSource.addEventListener()
		trackSource.onended = () => {
			trackSource.disconnect()
			active = false
			resolve()
		}
		trackSource.onerror = (error) => {
			trackSource.disconnect()
			active = false
			reject(error)
		}

		if (audioContext.state === 'suspended') 
		{
			audioContext.resume()
		}
		
		if (offset == 0) 
		{
			trackSource.start()
		//offset = audioContext.currentTime
		} else {
			trackSource.start(0, audioContext.currentTime - offset)
		}
		active = true
	})
}

// const track = await loadAudio()
// const r = playTrack(track)

async function loadInstrumentPart (instrumentName, part) {
	return new Promise((resolve,reject)=>{
		const path = `${instrumentName}/${part}`
		const audio = new Audio()

		const resolution = event => {
			disconnect()
			resolve( audio )
		}
		const failure = event =>{
			disconnect()
			reject(event.error)
		} 

		const connect = ()=>{
			audio.addEventListener('canplaythrough',resolution)
			audio.addEventListener('error', failure)
		}
		const disconnect = ()=>{
			audio.removeEventListener('error',failure)
			audio.removeEventListener('canplaythrough',resolution)
		}

		connect()
		audio.src = path
	})
}


export const loadInstrumentParts = (instrumentName="alto_sax-mp3", path="./FluidR3_GM") => {
	const instrumentPath = `${path}/${instrumentName}`
	const parts = createInstrumentBanks()
	// array of buffers to pass to playTrack
	const instruments = parts.map( part => loadAudio( `${instrumentPath}/${part}` ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	return instruments	// array of promises
}

export const loadInstrument = async (instrumentName="alto_sax-mp3", path="./FluidR3_GM", progressCallback ) => {	
	const output = {
		title:cleanTitle(instrumentName),
		name:instrumentName,
	}
	// progressCallback?
	const parts = await Promise.all( loadInstrumentParts(instrumentName, path) )
	NOTE_NAMES.forEach( (instrument, index) => {
		output[ instrument.split('.')[0] ] = parts[index]
	})
	return output
}