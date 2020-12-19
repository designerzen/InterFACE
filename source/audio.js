import {lerp, TAU} from "./maths"

import INSTRUMENT_FOLDERS from "./instruments"
export const FOLDERS = INSTRUMENT_FOLDERS.split("\n")

export const randomInstrument = () => FOLDERS[ Math.floor( Math.random() * FOLDERS.length ) ]


// import * as instrumentAccordian from "./FluidR3_GM/accordion-ogg"

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
let destinationVolume = 0
export let playing = false
export let active = false

export const inputNode = delayNode

export const setupAudio = () => {

	// set up forked web audio context, for multiple browsers
  	// window. is needed otherwise Safari explodes
	audioContext = new (window.AudioContext || window.webkitAudioContext)()

	gainNode = audioContext.createGain()
	gainNode.gain.value = 0

	oscillator = audioContext.createOscillator()
	oscillator.type = "sine" // "sawtooth"

	// this should hopefully balance the outputs
	compressor = audioContext.createDynamicsCompressor()
	// compressor.threshold.setValueAtTime(-50, audioContext.currentTime)
	// compressor.knee.setValueAtTime(40, audioContext.currentTime)
	// compressor.ratio.setValueAtTime(12, audioContext.currentTime)
	// compressor.attack.setValueAtTime(0, audioContext.currentTime)
	// compressor.release.setValueAtTime(0.25, audioContext.currentTime)
	
	// var compressor = {
	// 	threshold: [-100, 0],
	// 	knee: [0, 40],
	// 	ratio: [1, 20],
	// 	attack: [0, 1],
	// 	release: [0, 1]
	//   }
	compressor.threshold.value = -50
	compressor.knee.value = 40
	compressor.ratio.value = 12
	compressor.attack.value = 0
	compressor.release.value = 0.5

	reverb = audioContext.createConvolver()
	// reverb = audioContext.createConvolver(null, true)
	delayNode = audioContext.createDelay(5)
	feedbackNode = audioContext.createGain()

	delayNode.delayTime.value = 0
	feedbackNode.gain.value = 0.3

	analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = 0.85

	
	// for waves
	analyser.fftSize = 2048
	bufferLength = analyser.fftSize

	// for bars
	analyser.fftSize = 256
	bufferLength = analyser.frequencyBinCount
	
    dataArray = new Uint8Array(bufferLength)
	
	//console.error("instrument",{oscillator, compressor, dataArray} )
	
	//oscillator.type = e.currentTarget.id
	oscillator.frequency.value = 261.63
	
	oscillator.connect(delayNode)
	
	delayNode.connect(feedbackNode)
	feedbackNode.connect(delayNode)

	delayNode.connect(gainNode)
	// delayNode.connect(reverb)
	// reverb.connect(gainNode)

	gainNode.connect(compressor)
	compressor.connect(analyser)

	// oscillator.start()
		
	analyser.connect(audioContext.destination)
	
	return delayNode
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
		oscillator.disconnect()
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
		oscillator.connect(delayNode)
		
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

// smaller means slower
const rate = 0.1
const setVolume = () => {

	//gainNode.gain.value = lerp( gain.gain.value, destinationVolume, 0.1 )
	const newVolume = gainNode.gain.value + (destinationVolume - gainNode.gain.value) * rate
	// gainNode.gain.setValueAtTime(destinationVolume, audioContext.currentTime)
	gainNode.gain.setValueAtTime(newVolume, audioContext.currentTime)

	if (gainNode.gain.value === destinationVolume)
	{

	}else{
		requestAnimationFrame( setVolume )
	}
}


export const setAmplitude = amplitude => {
	// lerp towards
	 destinationVolume = amplitude
	 setVolume()
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
		audio.addEventListener('canplaythrough', () => {
			// available...
			//console.log("Attempting to create audio", { audio, path})
			resolve( audio )
		})
		audio.src = path
		
	})
}

const createInstrumentBanks = (fileTye="mp3", dot=".")=>{

	const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
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

export const INSTRUMENT_NAMES = createInstrumentBanks('','')


export const loadInstrumentParts = (instrumentName="alto_sax-mp3", path="./FluidR3_GM") => {

	const instrumentPath = `${path}/${instrumentName}`
	const parts = createInstrumentBanks()
	// console.error("parts",parts)
	// array of buffers to pass to playTrack
	const instruments = parts.map( part => loadAudio( `${instrumentPath}/${part}` ) )
	//const instruments = parts.map( part => loadInstrumentPart(instrumentPath, part) )
	// eg FluidR3_GM
	// array of promises
	return instruments
}


export const loadInstrument = async (instrumentName="alto_sax-mp3", path="./FluidR3_GM", progressCallback ) => {
	
	const output = {
		title:instrumentName
	}
	// progressCallback?
	const parts = await Promise.all( loadInstrumentParts(instrumentName, path) )
	INSTRUMENT_NAMES.forEach( (instrument, index) => {
		output[ instrument.split('.')[0] ] = parts[index]
	})
	return output
}


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
			recording = true	
	
			mediaRecorder = new MediaRecorder(stream)
			mediaRecorder.ondataavailable = (ev) =>{ 
				dataArray.push(ev.data)
				resolve(mediaRecorder)
			}
	
			// Convert the audio data in to blob  
			// after stopping the recording 
			mediaRecorder.start()
		})
	}

	const stopRecording = ( type='audio/mp3;' ) => {
		return new Promise((resolve,reject)=>{
			if (!recording)
			{
				return reject("Not recording")
			}
			
			mediaRecorder.onstop = event => { 

				// blob of type mp3 
				const audioData = new Blob(dataArray, { 'type': type })
					
				// After fill up the chunk  
				// array make it empty 
				dataArray = []

				recording = false

				// Pass the audio url to the 2nd video tag 
				resolve( audioData )
			}
			mediaRecorder.stop()
		})
	}

	return {startRecording,stopRecording}
} 

const ZERO = 0.0000001

export const createKick = () => {

    const osc = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    const gainOsc = audioContext.createGain()
    const gainOsc2 = audioContext.createGain()

    osc.type = "triangle"
    osc2.type = "sine"

	const kick = (attack=0.01,duration=0.5) => {

		const time = audioContext.currentTime
		
		// clear anything from previous plays
		gainOsc.gain.cancelScheduledValues(time)
		gainOsc2.gain.cancelScheduledValues(time)
		osc.frequency.cancelScheduledValues(time)
		osc2.frequency.cancelScheduledValues(time)

		gainOsc.gain.setValueAtTime(1, time)
		gainOsc.gain.exponentialRampToValueAtTime(ZERO, time + duration)
	
		gainOsc2.gain.setValueAtTime(1, audioContext.currentTime)
		gainOsc2.gain.exponentialRampToValueAtTime(ZERO, time + duration)
	
		osc.frequency.setValueAtTime(120, audioContext.currentTime)
		osc.frequency.exponentialRampToValueAtTime(attack, time + duration)
	
		osc2.frequency.setValueAtTime(50, audioContext.currentTime)
		osc2.frequency.exponentialRampToValueAtTime(attack, time + duration)
		 
		 try{

			osc.start(time)
			osc2.start(time)

		 }catch(error)
		 {

		 }
	 
		//  osc.stop(audioContext.currentTime + duration)
		//  osc2.stop(audioContext.currentTime + duration)
	}
 
    osc.connect(gainOsc)
    osc2.connect(gainOsc2)
    gainOsc.connect(gainNode)
    gainOsc2.connect(gainNode)

	return kick
}

// this is just an array of kicks
export const createKicks = (quantity=5) => {

	const kicks = []
	for (let i=0; i < quantity; ++i)
	{
		const kick = createKick()
		kicks.push( kick )
	}

	// interface to play
	let index = 0
	const fetchNextKick = (attack=0.01,duration=0.5) => {
		index = index + 1 < quantity ? index + 1 : 0
		const kick = kicks[index]
		kick(attack, duration)
	}
	return fetchNextKick
}

export const createSnare = () => {

    const osc3 = audioContext.createOscillator()
    const gainOsc3 = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const node = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	const filter = audioContext.createBiquadFilter()
	filter.type = "highpass"

	osc3.type = "triangle"
	osc3.frequency.value = 100

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		data[i] = Math.random()
	}

	node.buffer = buffer
	node.loop = true
	
	osc3.connect(gainOsc3)
	gainOsc3.connect(gainNode)	

	node.connect(filter)
	filter.connect(filterGain)
	filterGain.connect(gainNode)

	const snare = () => {

		const time = audioContext.currentTime
		
		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime(1, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, time + 0.2)
	
		gainOsc3.gain.setValueAtTime(ZERO, time)
		gainOsc3.gain.exponentialRampToValueAtTime(ZERO, time+ 0.1)	
		//gainOsc3.gain.value = 0

		filter.frequency.setValueAtTime(100, time)
		filter.frequency.linearRampToValueAtTime(1000,time + 0.2)		
	
		//gainNode.gain.value = 1			
		try{
			osc3.start(time)
			//osc3.stop(audioContext.currentTime + 0.2)
		
			node.start(time)
			//node.stop(audioContext.currentTime + 0.2)	
		}catch(error){

		}
	}

	return snare
}


function hihat() {

    var gainOsc4 = audioContext.createGain();
    var fundamental = 40;
    var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

    var bandpass = audioContext.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 10000;

    var highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 7000;


    ratios.forEach(function(ratio) {

        var osc4 = audioContext.createOscillator();
        osc4.type = "square";
        osc4.frequency.value = fundamental * ratio;
        osc4.connect(bandpass);

        osc4.start(audioContext.currentTime);
        osc4.stop(audioContext.currentTime + 0.05);
        
    });

    gainOsc4.gain.setValueAtTime(1, audioContext.currentTime);
    gainOsc4.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    bandpass.connect(highpass)
    highpass.connect(gainOsc4)
    gainOsc4.connect(mixGain)
}