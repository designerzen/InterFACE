/**
 * Singleton Audio Bus
 */
import { chain } from './rack'
import {getInstrumentFamily, loadInstrumentFromSoundFontSamplesViaWorker, loadInstrumentFromSoundFontString, loadInstrumentFromSoundFontStringViaWorker} from './sound-font-instruments'
// Effects
import { createReverb, randomReverb, getImpulseList, createCustomReverb } from './effects/reverb'
import { createDelay} from './effects/delay'
import { createDub} from './effects/dub'
import { createCompressor} from './effects/compressor'
import { createDistortion} from './effects/distortion'
import { createAmplitude} from './effects/amplitude'
import { createLowPassFilter } from "./effects/filter"
import { createSaturationFilter } from "./effects/saturator"

import { rearrangeArrayBySnake } from "../utils/array-tools"

import {
	createInstrumentBanks,
	// getNoteName,
	// getNoteSound, getNoteText,
	NOTE_NAMES
} from './tuning/notes'

const DEFAULT_OPTIONS = {

	// quantity of reverb
	reverb:0.2,

	// frequency analyser pulse smoothing (for cool visual effects!)
	// how quick it drops < 0.85 looks cool
	smoothingTimeConstant:0.45,

	// pass the raw drums through a compressor
	drumCompressor:false,

	// default volume for the drum track
	drumVolume:0.14
}

export const CUSTOM_REVERB_OPTIONS = {
	// seconds
	duration:0.9, 

	gain : 1,

	// as ratios except sustain which is a level
	attack:0.001, 
	decay:0.1, 
	sustain:0.8,
	release:0.5,

	// booleans
	
	// flatten pops and clicks but omg does it cost a lot
	normalize : true,
	reverse:false,

	stereo:true,
	
	// noise:'white' 
	// noise:'pink'  
	noise:'white' 
} 

// 
export const ZERO = 0.0000001 // Math.min

export let audioContext
export let offlineAudioContext

export let bufferLength
export let dataArray

// some audio nodes
let analyser
let limiter
let compressor
let distortion
let lowPassFilter
let saturator
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
 * TODO:
 * Create a chain of audio effects
 * @param {?Object} options config
 * @returns {Promise} Chain of effects

export const chooseFilters = async (options) => {

	// create some filters based on some options?

	return chain( [
		
		gain,
		// await createCompressor( audioContext ), 
		// await createReverb(audioContext, 0.5),
		
		//, await createDelay(audioContext)
		//await createDub(audioContext)
		// await createDistortion(audioContext)

	], audioContext )
}
 */

/**
 * 
 * @param {Sting|Object} filenameOrObject 
 * @returns 
 */
export const setReverb = async (filenameOrObject) => {
	
	if (filenameOrObject === null)
	{
		// if it is null pick randomly
		const impulse = await randomReverb() // await getImpulseList()[0]
		return reverb.impulseFilter( impulse )
	}
	else if (typeof filenameOrObject === "string")
	{
		// if a filename has been specified load that file
		return reverb.impulseFilter( filenameOrObject )
	}
	reverb = await createCustomReverb( filenameOrObject )
	return reverb
}

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Object} options 
 */
export const setupAnalyser = (audioContext, options={}) => {
	// UI spectrum analyser
	analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = options.smoothingTimeConstant

	bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
}

/**
 * Set up the Audio Engine
 * @param {?Object} settings Options
 * @returns {Promise} Chain of effects
 */
export const setupAudio = async (onlineAudioContext, offlineAudioContext, settings) => {

	// BUFFER_SIZE = 2048, // the buffer size in units of sample-frames.
	// INPUT_CHANNELS = 1, // the number of channels for this node's input, defaults to 2
	// OUTPUT_CHANNELS = 1 // the number of channels for this node's output, defaults to 2
	const options = Object.assign ( {}, DEFAULT_OPTIONS, CUSTOM_REVERB_OPTIONS, settings )

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	// { latencyHint: 'playback' } tells the context to try and smooth playback
	audioContext = onlineAudioContext 
	// fixes old ios bug about audio not starting until buttons or something
	// resumeAudioContext()

	// check to see if we have an offline context...
	offlineAudioContext = offlineAudioContext

	// VU Analyser and data
	setupAnalyser(audioContext, options)

	// universal volume setter
	mixer = await createAmplitude(audioContext, 1)
	gain = await createAmplitude(audioContext, 1)
	percussion = await createAmplitude(audioContext, options.drumVolume ?? 0.5 )
	
	// Creating a compressor but setting a high threshold and 
	// high ratio so it acts as a limiter. More explanation at 
	// https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
	limiter = await createCompressor( audioContext, 
		-5,
		0,
		20,
		0.001,
		0.1
	)

	// Connect percussion through FAT compressor
	// this should hopefully balance the outputs
	compressor = await createCompressor( audioContext,
		-50,
		40,
		12,
		0,
		0.25
   	)
	// createCompressor( audioContext, -85, 40, 20, 0, 0.3, 0)

	// TODO: Use offline 
	// reverb = await createCustomReverb(offlineAudioContext, options )
	reverb = await createCustomReverb(audioContext, options )
		
	//reverb = await createReverb( audioContext, options.reverb, options.normalize  )//, await randomReverb()
	lowPassFilter = await createLowPassFilter( audioContext )
	saturator = await createSaturationFilter( audioContext )
		
	// With added compression set on the drum tracks
	// RAW drums -> Compressor cos c'mon now!
	if (options.drumCompressor)
	{	
		percussion.node.connect( compressor.node )
		compressor.node.connect( getMasterMixdown() )
	}else{
		percussion.node.connect( getMasterMixdown() )
	}
	

	// Web Audio Modules! --------------------------
	// const { default: samplerWAMPlugin } = await import("./wam2/sampler/index.js")
	
	// const [hostGroupId] = await initializeWamHost(audioContext)
	// const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// // link the sampler to the output
	// samplerPlugin.audioNode.connect( compressor.node )
	// samplerPlugin.

	// console.log("Created samplerPlugin Instrument", {samplerPlugin} )


	// some space dubs!
	delay = await createDelay(audioContext)
	dub = await createDub(audioContext)
	
	// masher (expensive)
	// distortion = await createDistortion(audioContext)

	//recorder = audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNELS, OUTPUT_CHANNELS)
	
	// chain( [ delayNode, feedbackNode, delayNode, 
	// 			gainNode, reverb, 
	// 				compressor.node, analyser], audioContext )

	return chain( [

		// gain,

		// lowPassFilter,

		// saturator,
	
		// limiter,
		
		// this should hopefully balance the outputs
		// compressor,

		// delay,
		// await createCompressor( audioContext,
		// 	-50,
		// 	40,
		// 	12,
		// 	0,
		// 	0.25
		// )
		// ,
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
 * For bars graphs
 * update the frequency analyser and fetch EQ data in the Frequency Domain
 * fftSize *must* be a power of 2 number
 */
export const updateByteFrequencyData = (fftSize=256)=> {
	analyser.fftSize = fftSize
	analyser.getByteFrequencyData(dataArray)
	// for waves?
	//bufferLength = analyser.fftSize
	bufferLength = analyser.frequencyBinCount
	return dataArray
}

/**
 * For string based waveforms
 * update the frequency analyser and fetch EQ data in the Time Domian
 */
export const updateByteTimeDomainData = (fftSize=2048)=> {
	analyser.fftSize = fftSize
	analyser.getByteTimeDomainData(dataArray)
	bufferLength = analyser.frequencyBinCount
	return dataArray
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
 * @param {Array} arrayBuffer 
 * @returns {AudioBuffer} Audio buffer
 */
export const convertArrayToBuffer = async (context, arrayBuffer)=>{
	return await context.decodeAudioData(arrayBuffer)
}

/**
 * Load an Audio Buffer
 * @param {String} path Instrument Sample path
 * @returns {HTMLAudioElement} Audio buffer
 */
export const loadAudio = async ( context, path, options ) => {
	const response = await fetch(path)
	const arrayBuffer = await response.arrayBuffer()
	// TODO : Check for offline audio context !
	if (options.offlineAudioContext)
	{

	}else{
		
	}
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
export const playTrack = (context, audioBuffer, offset=0, destination=delayNode, options={ loop:false }, onComplete=()=>{} ) => {
	
	// return new Promise((resolve, reject)=>{

		const trackSource = context.createBufferSource()
		trackSource.buffer = audioBuffer
		
		// loop through options nad add
		// options
		trackSource.loop = options.loop
		// trackSource.detune = options.detune
		if (options.playbackRate)
		{
			trackSource.playbackRate.value = options.playbackRate
		}
		
		trackSource.connect(destination)
		// trackSource.connect(audioContext.destination)
		// console.error("Playing track", {audioBuffer,trackSource} )

		// https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode
		// FIXME: when it has finished playing remove it...
		// trackSource.addEventListener()
		trackSource.onended = () => {
			trackSource.disconnect()
			active = false
			// resolve(trackSource)
			onComplete(trackSource)
		}
		trackSource.onerror = (error) => {
			trackSource.disconnect()
			active = false
			// reject(error)
			onComplete(null)
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
		return trackSource
	// })
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
 * @param {Object} options File path for sample pack
 * @returns {Array<Promise>} Array of instrument load promises that resolve to AudioBuffers
 */
export const loadInstrumentParts = ( context=audioContext, instrumentPath=`./assets/audio/${INSTRUMENT_PACK_FM}`, options={} ) => {
	const parts = rearrangeArrayBySnake( createInstrumentBanks() , options.startIndex )
	const instruments = parts.map( part => loadAudio(context, `${instrumentPath}/${part}` , options ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	return instruments
}


/**
 * This loads the AudioBuffers for the specified audio samples
 * @param {AudioContext} context 
 * @param {String} name 
 * @param {String} path 
 * @param {Object} options 
 * @param {?Function} onProgressCallback 
 * @returns {Object|Array} [ AudioBuffer ] , { A0:AudioBuffer }
 */
export const loadInstrumentFromSoundFontSamples = async( context=audioContext, path="FluidR3_GM", options={}, onProgressCallback=null ) => {
		
	// Load as individual parts
	const partPromises = loadInstrumentParts(context, path, options ) 
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
export const loadInstrumentFromSoundFont = async ( context=audioContext, instrumentName="alto_sax-mp3", instrumentURI="./assets/audio/FluidR3_GM", options={}, onProgressCallback=null ) => {	
	
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

	// console.error("loadInstrumentFromSoundFont:" , options ) 
	
	let instrumentAudioBuffers

	if (options.loadAsOne)
	{
		// load from a single string  
		instrumentAudioBuffers = options.usingWorker ? 
			await loadInstrumentFromSoundFontStringViaWorker( context,  instrumentName, options, onProgressCallback ) :
			await loadInstrumentFromSoundFontString( instrumentName, options, onProgressCallback )
	
	}else{


		// set the location that all the single instruments get loaded from...
		const instrumentPath = `${instrumentURI}/${instrumentName}`
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

