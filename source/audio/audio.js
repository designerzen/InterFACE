import {clamp, lerp, TAU} from "../maths"
import {cleanTitle} from './instruments'

import {INSTRUMENT_FOLDERS} from "./instruments"

const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]

const NOTES_BLACK = ["Ab", "Bb", "Db", "Eb", "Gb"]
const NOTES_WHITE = ["A","B","C","D","E","F", "G" ]
const NOTES_BLACK_INDEXES = NOTES_BLACK.length - 1
const NOTES_WHITE_INDEXES = NOTES_WHITE.length - 1

// renamed white notes
export const SOLFEGE_SCALE = ['Doe', 'Ray', 'Me', 'Far', 'Sew', 'La', 'Tea' ]


export const randomInstrument = () => INSTRUMENT_FOLDERS[ Math.floor( Math.random() * INSTRUMENT_FOLDERS.length ) ]

export let audioContext
let mediaRecorder

export let bufferLength
export let dataArray

let oscillator
let gainNode
let delayNode
let feedbackNode
let analyser
let compressor
let reverb
let recorder
let destinationVolume = 0

export let playing = false
export let active = false

export const inputNode = () => delayNode
export const inputDryNode = () => gainNode

export const setupAudio = (
	BUFFER_SIZE = 2048, // the buffer size in units of sample-frames.
	INPUT_CHANNELS = 1, // the number of channels for this node's input, defaults to 2
	OUTPUT_CHANNELS = 1 // the number of channels for this node's output, defaults to 2
) => {

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	audioContext = new (window.AudioContext || window.webkitAudioContext)()

	gainNode = audioContext.createGain()
	gainNode.gain.value = 0

	// oscillator = audioContext.createOscillator()
	// oscillator.type = "sine" // "sawtooth"
	// oscillator.frequency.value = 261.63
	// oscillator.connect(delayNode)
	// oscillator.start()

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

	reverb = audioContext.createConvolver()
	// reverb = audioContext.createConvolver(null, true)
	delayNode = audioContext.createDelay(0.01)
	feedbackNode = audioContext.createGain()

	//delayNode.delayTime.value = 0
	feedbackNode.gain.value = 0.2

	analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = 0.85

	// for waves
	// analyser.fftSize = 2048
	// bufferLength = analyser.fftSize

	// for bars
	analyser.fftSize = 256
	bufferLength = analyser.frequencyBinCount
	
    dataArray = new Uint8Array(bufferLength)
	
	//console.error("instrument",{oscillator, compressor, dataArray} )
	
	// To recreate feedback...
	delayNode.connect(feedbackNode)
	feedbackNode.connect(delayNode)
	delayNode.connect(gainNode)

	// delayNode.connect(reverb)
	// reverb.connect(gainNode)

	gainNode.connect(compressor)
	compressor.connect(analyser)

	recorder = audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNELS, OUTPUT_CHANNELS)

	analyser.connect(audioContext.destination)
	
	return delayNode
}


export const updateByteFrequencyData = ()=> analyser.getByteFrequencyData(dataArray)
export const updateByteTimeDomainData = ()=> analyser.getByteTimeDomainData(dataArray)

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
export const playAudio = () => {
	if (playing)
	{
		return false
	}else{
		if (audioContext.state === 'suspended') 
		{
			audioContext.resume()
		}
		// analyser.connect(audioContext.destination)
		//oscillator.connect(delayNode)
		
		playing = true
		monitor()
		return true
	}
	//console.error("start audio",{playing})
	return oscillator
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

async function loadAudio(path) {
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

const createInstrumentBanks = (fileTye="mp3", dot=".")=>{

	const bank = []
	for (let b=0; b<BANKS.length;++b)
	{
		const key = BANKS[b]
		// insert a 0 for A
		if (key==="A")
		{
			bank.push( `A0${dot}${fileTye}` )
		}
		for (let i=1; i<8; ++i)
		{
			bank.push( `${key}${i}${dot}${fileTye}` )
		}
		// add an extra one for C
		if (key==="C")
		{
			bank.push( `C8${dot}${fileTye}` )
		}
	}
	return bank
	
	// A0-7
	// Ab1-7
	// B0-7
	// Bb1-Bb7
	// C1-C8
	// D1-7
	// Db1-7
	// E1-7
	// Eb1-7
	// F1-7
	// G1-7
	// Gb1-7
}

export const NOTE_NAMES = createInstrumentBanks('','')

// this is an object with the keys being the NOTE_NAMES
const NOTE_NAMES_FRIENDLY = {}

NOTE_NAMES.forEach( note => {
	// for each name we do a clever thing innit...
	NOTE_NAMES_FRIENDLY[note] = note
} )

// console.error({BANKS, NOTE_NAMES, NOTE_NAMES_FRIENDLY})

// return the relevent do re me fah so lat ti
 export const getNoteSound = (percent, isMinor=false) => {
	return SOLFEGE_SCALE[ Math.floor( percent * (SOLFEGE_SCALE.length-1) ) ]
 }

 export const getNoteText = noteName => {
	 const note = noteName.charAt(0)
	 let octave
	 // if we have 3 figures we swap out the 2nd one for a 
	 if (noteName.length === 3)
	 {
		octave = parseInt( noteName.charAt(2) ) + 1
		return `${note}#${octave}`
	 }
	 octave = parseInt( noteName.charAt(1) ) + 1
	 return `${note}${octave}`
 }

// octaves 1-7
// returns A1 Ab1 etc
export const getNoteName = (percent, octave=3, isMinor=false) => {

	// restrict to 1-7 even though 0 is available for many
	// octave = clamp(octave, 1, 7)
	let noteNumber
	let noteName
	
	if (isMinor)
	{
		noteNumber = Math.floor( percent * NOTES_BLACK_INDEXES )
		noteName = NOTES_BLACK[noteNumber]
	}else{
		noteNumber = Math.floor( percent * NOTES_WHITE_INDEXES )
		noteName = NOTES_WHITE[noteNumber]
	}

	// here is where we need to do our majic
	// const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
	// play a note from bank (this is the same for every octave?)
	// const noteNumber = Math.floor( percent * (BANKS.length-1) )
	
	// console.log("Creating note", {percent, octave, isMinor, noteNumber, noteName} )
	// const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
	// const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
	// const noteNumber = Math.floor( lipPercentage * (INSTRUMENT_NAMES.length-1) )
	// const noteName = NOTE_NAMES[noteNumber]

	// just in case the note name is not found?
	return `${noteName}${clamp(octave, 1, 7)}`
	// return noteName ? `${noteName}${clamp(octave, 1, 7)}` : `A0`
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