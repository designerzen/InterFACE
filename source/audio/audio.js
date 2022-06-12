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

import {instrumentFolders} from "./instruments"

import {
	createInstrumentBanks,
	// getNoteName,
	// getNoteSound, getNoteText,
	NOTE_NAMES
} from './notes'

export const ZERO = 0.0000001

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
let mixer

export let playing = false
export let active = false

/**
 * 
 * @returns Post FX -> MIXER
 */
export const getMasterMixdown = () => {
	return mixer.node
}

/**
 * @returns Post FX node but before mixer
 */
export const getRecordableOutputNode = () => {
	return reverb.node
}

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

/**
 * Fetch a random instrument name
 * @returns {String} Instrument Name
 */
export const randomInstrument = () => instrumentFolders[ Math.floor( Math.random() * instrumentFolders.length ) ]

/**
 * Create a chain of audio effects
 * @param {?Object} options config
 * @returns {Promise} Chain of effects
 */
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

/**
 * Set up the Audio Engine
 * @param {?Object} settings Options
 * @returns {Promise} Chain of effects
 */
export const setupAudio = async (settings) => {

	// BUFFER_SIZE = 2048, // the buffer size in units of sample-frames.
	// INPUT_CHANNELS = 1, // the number of channels for this node's input, defaults to 2
	// OUTPUT_CHANNELS = 1 // the number of channels for this node's output, defaults to 2

	const options = Object.assign ( {}, DEFAULT_OPTIONS, settings )

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	audioContext = new (window.AudioContext || window.webkitAudioContext)()

	// universal volume setter
	mixer = await createAmplitude(audioContext, 1)
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
		
		reverb,
		//await createDelay(audioContext)
		//await createDub(audioContext)
		//await createDistortion(audioContext)
		
		analyser,

		mixer

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

/**
 * update the frequency analyser and fetch EQ data in the Frequency Domain
 */
export const updateByteFrequencyData = ()=> {
	analyser.fftSize = 2048
	analyser.getByteFrequencyData(dataArray)
	// for waves?
	//bufferLength = analyser.fftSize
	bufferLength = analyser.frequencyBinCount
}

/**
 * update the frequency analyser and fetch EQ data in the Time Domian
 */
export const updateByteTimeDomainData = ()=> {
	analyser.fftSize = 256
	// for bars
	analyser.getByteTimeDomainData(dataArray)
	bufferLength = analyser.frequencyBinCount
}

/**
 * Automatically Loop and update the frequency analyser and 
 * fetch EQ data in the Frequency Domain
 */
const monitor = () => {


	const result = requestAnimationFrame(monitor)

	// waves
	//analyser.getByteTimeDomainData(dataArray)
	
	// bars
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

/**
 * Get the volume of the audio playback 
 * @returns {Number} Volume
 */
export const getVolume = () => mixer.volume()

/**
 * Set the volume of the audio playback 
 * @param {Number} destinationVolume Volume to set
 * @returns {Number} Volume
 */
export const setVolume = destinationVolume => mixer.volume(destinationVolume)

/**
 * Load an Audio Buffer
 * @param {String} path Instrument Sample path
 * @returns {HTMLAudioElement} Audio buffer
 */
export const loadAudio = async (path) => {
	const response = await fetch(path)
	const arrayBuffer = await response.arrayBuffer()
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
	return audioBuffer
}

/**
 * Play an Audio Buffer
 * create a buffer, plop in data, connect and play -> modify graph here if required
 * detune:0,,  playbackRate:1
 * @param {Object} audioBuffer Audio data buffer
 * @param {Number} offset position to start from
 * @param {AudioNode} destination Audio Node to route to
 * @param {Object} options options such as looping
 * @returns {HTMLAudioElement} Audio object
 */
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

/**
 * Replace the in-memory sample with a new sample
 * This loads only one pitch for the specific sound
 * @param {String} instrumentName Instrument Sample name
 * @param {String} part The part of the instrument to load
 * @returns {HTMLAudioElement} Auudio object
 */
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

/**
 * Replace the in-memory sound with a new dound
 * This loads all pitches for one specific sound
 * @param {String} instrumentName Instrument Sample name
 * @param {String} path File path for sample pack
 * @returns {Array<Promise>} Array of instrument load promises
 */
export const loadInstrumentParts = (instrumentName="alto_sax-mp3", path="FluidR3_GM") => {
	const instrumentPath = `${path}/${instrumentName}`
	const parts = createInstrumentBanks()
	// array of buffers to pass to playTrack
	const instruments = parts.map( part => loadAudio( `./assets/audio/${instrumentPath}/${part}` ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	return instruments
}

/**
 * Replace the in-memory sample pack with a new pack
 * @param {String} instrumentName Instrument Sample name
 * @param {String} path File path for sample pack
 * @param {?Function} progressCallback Optional callback to report progress
 * @returns {Object} Instrument information
 */
export const loadInstrumentPack = async (instrumentName="alto_sax-mp3", path="FluidR3_GM", progressCallback ) => {	
	const output = {
		title:cleanTitle(instrumentName),
		name:instrumentName,
	}
	const partPromises = loadInstrumentParts(instrumentName, path) 
	const parts= []
	for (let i=0, l=partPromises.length; i < l; ++i)
	{
		const part = await partPromises[i]
		parts.push( part )
		progressCallback && progressCallback({
			progress:i/l,
			instrumentName
		})
	}
	
	NOTE_NAMES.forEach( (instrument, index) => {
		output[ instrument.split('.')[0] ] = parts[index]
	})
	return output
}