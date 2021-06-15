import {clamp, lerp, TAU} from "../maths/maths"
import {cleanTitle} from './instruments'

import { chain } from './rack'

// Effects
import { createReverb, randomReverb, getImpulseList } from './effects/reverb'
import {createDelay} from './effects/delay'
import {createDub} from './effects/dub'
import {createCompressor} from './effects/compressor'
import {createDistortion} from './effects/distortion'
import {createAmplitude} from './effects/amplitude'

import {INSTRUMENT_FOLDERS} from "./instruments"

import {
	createInstrumentBanks,
	// getNoteName,
	// getNoteSound, getNoteText,
	NOTE_NAMES, NOTE_NAMES_FRIENDLY
} from './notes'

export const randomInstrument = () => INSTRUMENT_FOLDERS[ Math.floor( Math.random() * INSTRUMENT_FOLDERS.length ) ]

export let audioContext

export let bufferLength
export let dataArray

let oscillator
let analyser
let compressor
let distortion
let reverb
let delay
let dub
let gain

export let playing = false
export let active = false

// // just does linear connects in sequence for easier protyping
// const chain = ( routes, connect=true ) => {

// 	const quantity = routes.length

// 	for (let i=1; i<quantity; ++i)
// 	{
// 		const previous = routes[ i-1 ]
// 		const route = routes[ i ]

// 		if (route.name)
// 		{
// 			console.error("Object fx needs i/o", route)
// 		}

// 		// check to see if it is a wrapped object...

// 		previous.connect(route)
		
// 		// if last one...
// 		if (connect && i === quantity-1 )
// 		{
// 			route.connect(audioContext.destination)
// 		}
// 	}

// 	// grab the first one
// 	outputNode = routes[0]
// 	return outputNode
// }

export const chooseFilters = async (options) => {

	// create some filters based on some options?

	return chain( [
		
		gain,
		await createCompressor( audioContext ), 
		// await createReverb(audioContext, 0.5),
		
		//, await createDelay(audioContext)
		//await createDub(audioContext)
		await createDistortion(audioContext)

	], audioContext )
}

const DEFAULT_OPTIONS = {
	// quantity of reverb
	reverb:0.1,
	// flatten pops and clicks
	// but omg does it cost a lot
	normalise:true,
	// frequency analyser pulse smoothing (for cool visual effects!)
	// how quick it drops < 0.85 looks cool
	smoothingTimeConstant:0.45
}

export const setReverb = async (filename) => {
	const impulse = !filename ? await randomReverb() : filename // await getImpulseList()[0]
	return reverb.impulseFilter( impulse )
}

export const setupAudio = async (settings) => {

	// BUFFER_SIZE = 2048, // the buffer size in units of sample-frames.
	// INPUT_CHANNELS = 1, // the number of channels for this node's input, defaults to 2
	// OUTPUT_CHANNELS = 1 // the number of channels for this node's output, defaults to 2

	const options = Object.assign ( {}, DEFAULT_OPTIONS, settings )

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	audioContext = new (window.AudioContext || window.webkitAudioContext)()

	// universal volume setter
	gain = await createAmplitude(audioContext, 1)
	
	// this should hopefully balance the outputs
	// compressor = await createCompressor( audioContext )

	reverb = await createReverb( audioContext, options.reverb, options.normalise  )//, await randomReverb()
	// reverb.impulseFilter()
	
	// some space dubs!
	// delay = await createDelay(audioContext)
	// dub = await createDub(audioContext)
	
	// masher (expensive)
	// distortion = await createDistortion(audioContext)

	// UI spectrum analyser
	analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = options.smoothingTimeConstant

	bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
	
	//recorder = audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNELS, OUTPUT_CHANNELS)
	
	// chain( [ delayNode, feedbackNode, delayNode, 
	// 			gainNode, reverb, 
	// 				compressor.node, analyser], audioContext )

	// fixes old ios bug about audio not starting until buttons or something
	// resumeAudioContext()

	return chain( [

		gain,
		
		// this should hopefully balance the outputs
		//await createCompressor( audioContext ),
		
		reverb
		//await createDelay(audioContext)
		//await createDub(audioContext)
		//await createDistortion(audioContext)

	], audioContext )
	
	// all mod cons
	// return chain( [ delayNode, feedbackNode, delayNode, gainNode, reverb, compressor, analyser ], audioContext )
	
	// just compressor and reverb
	// return chain( [ gain.node, reverb.node, compressor.node, analyser], audioContext )
	
	// just rever, delay and compressor
	//return chain([ gain, analyser ], audioContext )
	return chain([ gain, compressor, reverb, analyser ], audioContext )
	
	return chain([ compressor.node, reverb.node, delay.node, gain.node, analyser ], audioContext )
	
	// all mod cons
	return chain( [ gain.node, reverb.node, delay.node, compressor.node, analyser ], audioContext )
}

export const updateByteFrequencyData = ()=> {
	analyser.fftSize = 2048
	analyser.getByteFrequencyData(dataArray)
	// for waves?
	//bufferLength = analyser.fftSize
	bufferLength = analyser.frequencyBinCount
}

export const updateByteTimeDomainData = ()=> {
	analyser.fftSize = 256
	// for bars
	analyser.getByteTimeDomainData(dataArray)
	bufferLength = analyser.frequencyBinCount
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

export const getVolume = () => gain.volume()
export const setVolume = (destinationVolume) => gain.volume(destinationVolume)

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


export const loadInstrumentParts = (instrumentName="alto_sax-mp3", path="FluidR3_GM") => {
	const instrumentPath = `${path}/${instrumentName}`
	const parts = createInstrumentBanks()
	// array of buffers to pass to playTrack
	const instruments = parts.map( part => loadAudio( `./assets/audio/${instrumentPath}/${part}` ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	return instruments	// array of promises
}

export const loadInstrumentPack = async (instrumentName="alto_sax-mp3", path="FluidR3_GM", progressCallback ) => {	
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