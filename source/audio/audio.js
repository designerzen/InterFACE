
import { initializeWamHost } from "@webaudiomodules/sdk"

import {clamp, lerp, TAU} from "../maths/maths"

import { chain } from './rack'
import {getInstrumentFamily, loadInstrumentFromSoundFontSamplesViaWorker, loadInstrumentFromSoundFontString, loadInstrumentFromSoundFontStringViaWorker} from './sound-font-instruments'
// Effects
import { createReverb, randomReverb, getImpulseList } from './effects/reverb'
import {createDelay} from './effects/delay'
import {createDub} from './effects/dub'
import {createCompressor} from './effects/compressor'
import {createDistortion} from './effects/distortion'
import {createAmplitude} from './effects/amplitude'

import {
	createInstrumentBanks,
	// getNoteName,
	// getNoteSound, getNoteText,
	NOTE_NAMES
} from './tuning/notes'

export const ZERO = 0.0000001

export let audioContext
export let offlineAudioContext

export let bufferLength
export let dataArray

let createAnalyser

let analyser
let compressor
let distortion
let reverb
let delay
let dub
let gain
let mixer
let percussion

export let playing = false
export let active = false

/**
 * get Percussion Mixer
 * @returns Pre FX -> PRE MIXER, Accompaniment mixer
 */
export const getPercussionNode = () => {
	return percussion.node
}

/**
 * get Master Output Mixer
 * @returns Post FX -> MIXER
 */
export const getMasterMixdown = () => {
	return mixer.node
}

/**
 * get Master Recording Node (pre percussion)
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
	// { latencyHint: 'playback' } tells the context to try and smooth playback
	audioContext = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'playback' })

	// check to see if we have an offline context...
	offlineAudioContext = OfflineAudioContext ?? new OfflineAudioContext(2, 44100 * 40, 44100) 
 
	// universal volume setter
	mixer = await createAmplitude(audioContext, 1)
	gain = await createAmplitude(audioContext, 1)
	percussion = await createAmplitude(audioContext, 0.1 )
	
	// this should hopefully balance the outputs
	compressor = await createCompressor( audioContext )
	percussion.node.connect( compressor.node )
	compressor.node.connect( getMasterMixdown())
	
	reverb = await createReverb( audioContext, options.reverb, options.normalise  )//, await randomReverb()
	// reverb.impulseFilter()


	
	// Web Audio Modules! --------------------------
	// const { default: samplerWAMPlugin } = await import("./wam2/sampler/index.js")
	
	// const [hostGroupId] = await initializeWamHost(audioContext)
	// const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// // link the sampler to the output
	// samplerPlugin.audioNode.connect( compressor.node )
	

	// samplerPlugin.

	// console.log("Created samplerPlugin Instrument", {samplerPlugin} )


	
	
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

		mixer,

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

/**
 * 
 * @returns 
 */
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

const resumeAudioContext = async () => {
	if (audioContext.state === 'suspended') 
	{
		await audioContext.resume()
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
 * buffer source - to convert back to audio...
 * const song = await audioCtx.createBufferSource()
 * song.buffer = renderedAudioBuffer
 * song.connect(audioCtx.destination)
 * 
 * @param {OfflineAudioContext} offlineAudioContext 
 */
export const convertArrayToBuffer = async (context, arrayBuffer)=>{
	return await context.decodeAudioData(arrayBuffer)
}

/**
 * Load an Audio Buffer
 * @param {String} path Instrument Sample path
 * @returns {HTMLAudioElement} Audio buffer
 */
export const loadAudio = async ( context, path ) => {
	const response = await fetch(path)
	const arrayBuffer = await response.arrayBuffer()
	const audioBuffer = await convertArrayToBuffer( context, arrayBuffer )
	return audioBuffer
}


/**
 * Play an Audio Buffer
 * create a buffer, plop in data, connect and play -> modify graph here if required
 * detune:0,,  playbackRate:1
 * @param {AudioContext} context AudioContext to stream track to
 * @param {Object} audioBuffer Audio data buffer
 * @param {Number} offset position to start from
 * @param {AudioNode} destination Audio Node to route to
 * @param {Object} options options such as looping
 * @returns {HTMLAudioElement} Audio object
 */
export const playTrack = (context, audioBuffer, offset=0, destination=delayNode, options={ loop:false } ) => {
	
	return new Promise((resolve, reject)=>{

		const trackSource = context.createBufferSource()
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

		if (context.state === 'suspended') 
		{
			context.resume()
		}
		
		if (offset == 0) 
		{
			trackSource.start()
		//offset = audioContext.currentTime
		} else {
			trackSource.start(0, context.currentTime - offset)
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
export const loadInstrumentParts = ( context=audioContext, instrumentPath=`./assets/audio/${INSTRUMENT_PACK_FM}` ) => {
	const parts = createInstrumentBanks()

	// console.error("Pack data", {parts, instrumentPath} )

	// array of buffers to pass to playTrack
	const instruments = parts.map( part => loadAudio(context, `${instrumentPath}/${part}` ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	return instruments
}


/**
 * This loads the AudioBuffers for the specified audio samples
 * @param {AudioContext} audioContext 
 * @param {String} name 
 * @param {String} path 
 * @param {Object} options 
 * @param {?Function} onProgressCallback 
 * @returns {Object|Array} [ AudioBuffer ] , { A0:AudioBuffer }
 */
export const loadInstrumentFromSoundFontSamples = async( audioContext=audioContext, path="FluidR3_GM", options={}, onProgressCallback=null ) => {
		
	// Load as individual parts
	const partPromises = loadInstrumentParts(audioContext, path ) 
	const parts = options.asArray ? [] : {}

	for (let i=0, l=partPromises.length; i < l; ++i)
	{
		const part = await partPromises[i]
		if (options.asArray === true)
		{
			parts.push( part )
		}else{
			parts[ NOTE_NAMES[i] ] = part
		}
		
		onProgressCallback && onProgressCallback({
			progress:i/l,
			instrumentName:name
		})
	}

	return parts
}



/**
 * Replace the in-memory sample pack with a new pack
 * @param {AudioContext} context Online / Offline Audio Context
 * @param {String} instrumentName Instrument Sample name
 * @param {String} instrumentURI File path for sample pack
 * @param {?Function} onProgressCallback Optional callback to report progress
 * @returns {Object} Instrument information
 */
export const loadInstrumentFromSoundFont = async ( context=audioContext, instrumentName="alto_sax-mp3", instrumentURI="FluidR3_GM", options={}, onProgressCallback=null ) => {	
	
	const title = instrumentName
	// const family = getInstrumentFamily(instrumentName)
	const name = instrumentName
	// .indexOf("-mp3") < 0 ? instrumentName + "-mp3" : instrumentName

	// ensure we have the suffix on the name
	const output = {
		title,
		family:getInstrumentFamily(name) ?? getInstrumentFamily(title),
		name
	}

	// Ensure default options are set
	options = {
		// URI of the sound font
		soundfont : instrumentURI,
		// try and use a seperate thread for loading and decoding the data
		usingWorker : false,
		// load as a single string and convert to individual files
		// NB. this uses less network but more decoding time
		loadAsOne : false,
		// as a collection of elements in an object rather than array { A0: }
		asArray : false,
		// use offline worker if available (may be faster?)
		offlineAudioContext:null,
		...options
	}

	// console.error("AudioContext" , typeof options.offlineAudioContext )
	
	let instrumentAudioBuffers

	if (options.loadAsOne)
	{
		// load from a single string  
		instrumentAudioBuffers = options.usingWorker ? 
			await loadInstrumentFromSoundFontStringViaWorker( context,  instrumentName, options, onProgressCallback ) :
			await loadInstrumentFromSoundFontString( instrumentName, options, onProgressCallback )
	
	}else{

		// set the location that all the single instruments get loaded from...
		const instrumentPath = `./assets/audio/${instrumentURI}/${instrumentName}`
		// load from multiple files from a dedicated folder on server
		// TODO: 
		instrumentAudioBuffers = options.usingWorker ? 
			await loadInstrumentFromSoundFontSamplesViaWorker( context, instrumentPath, options, onProgressCallback ) :
			await loadInstrumentFromSoundFontSamples( context, instrumentPath, options, onProgressCallback )
	}

	NOTE_NAMES.forEach( (instrument, index) => {
		output[ instrument.split('.')[0] ] = instrumentAudioBuffers[instrument] ?? instrumentAudioBuffers[index]
	})

	// console.error("Loaded soundfont", {output, instrumentURI, instrumentAudioBuffers})
	
	return output
}

