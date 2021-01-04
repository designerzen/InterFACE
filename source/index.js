// Just a simple face detection script with visual overlaid feedback and audio
// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
// Best used with the Looking Glass Portrait

// const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection')
// FaceLandmarksDetector, FaceLandmarksPrediction, FaceLandmarksDetection
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow-models/face-landmarks-detection'
import { setBackend} from '@tensorflow/tfjs'
// If you are using the WebGL backend:
// require('@tensorflow/tfjs-backend-webgl')
import '@tensorflow/tfjs-backend-webgl'

// CPU Only
//import '@tensorflow/tfjs-backend-cpu'

// If you are using the WASM backend:
// require('@tensorflow/tfjs-backend-wasm')
//import '@tensorflow/tfjs-backend-wasm'

import {loadModel} from './predictor'

// You need to require the backend explicitly because facemesh itself does not
import { 
	audioContext,
	active, playing, 
	randomInstrument, playTrack, playAudio, stopAudio, 
	bufferLength,dataArray, 
	setupAudio, setAmplitude, 
	record } from './audio'

import {setupInterface, bindTextElement } from './ui'
import {getLocationSettings} from './location-handler'

import { createKick, createKicks, createSnare, createHihat, createCowbell, createDrumkit } from './synthesizers'
import { start, stop, getMode, setMode, setTimeBetween } from './timing.js'
import { setupMIDI } from './midi'
import { setupCamera, setupImage} from './visual'
import { easeInSine, easeOutSine , easeInCubic, lerp,clamp, TAU} from "./maths"
import { setNodeCount, updateCanvasSize, clear, canvas, canvasContext,
	drawWaves, drawBars, drawQuantise, drawElement } from './visual'
import Person, {DEFAULT_OPTIONS} from './person'
import { playNextPart, kitSequence } from './patterns'

// DOM Elements
const body = document.documentElement
const main = document.querySelector("main")
const video = document.querySelector("video")
const image = document.querySelector("img")
const buttonMIDI = document.getElementById("button-midi")
	
// Record stuff
const {isRecording, startRecording, stopRecording} = record()

// Feedback ui
const setFeedback = bindTextElement( document.getElementById("feedback") )
const setToast = bindTextElement( document.getElementById("toast") )

// coletion of persons
const people = []
let inputElement = video // image
		
let instrument

let camera
let photo
let audio 
let midi

// samples and synths
let kit
let patterns
let recorder

// As each sample is 2403 ms long, we should try and do it 
// as a factor of that, so perhaps bars would be better than BPM?
let bars = 16
let timePerBar =()=> 2403 / bars
let midiAvailable = false

// realtime UI options
const ui = getLocationSettings({
	metronome:true,
	backingTrack:false,
	synch:true,
	debug:false,
	duet:false
})

const SETTINGS = {

	// maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
	maxFaces:ui.duet ? 2 : 1,
	
   	// Whether to load the MediaPipe iris detection model (an additional 2.6 MB of weights). The MediaPipe iris detection model provides (1) an additional 10 keypoints outlining the irises and (2) improved eye region keypoints enabling blink detection. Defaults to true.
	shouldLoadIrisModel:true,
	
	/*
	maxContinuousChecks - How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
    detectionConfidence - Threshold for discarding a prediction. Defaults to 0.9.
    iouThreshold - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3. A score of 0 means no overlapping faces will be detected, whereas a score closer to 1 means the model will attempt to detect completely overlapping faces.
    scoreThreshold - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75. Increase this score in order to reduce false positives (detects fewer faces).
    modelUrl - Optional param for specifying a custom facemesh model url or a tf.io.IOHandler object.
    irisModelUrl - Optional param for specifying a custom iris model url or a tf.io.IOHandler object.
	*/
}

// For all people!
const loadInstruments = async (method) => people.map( async (person) => { 
	const instrument = await person[method]()
	setFeedback(`${person.name} has ${instrument} loaded`)
	return instrument
})

const loadRandomInstrument = async () => await loadInstruments('loadRandomInstrument')
const previousInstrument = async () => await loadInstruments('loadPreviousInstrument')
const nextInstrument = async () => await loadInstruments('loadNextInstrument')


// We cache every new user!
const getPerson = (index) => {
	
	const duetAvailable = ui.duet

	if (people[index] == undefined)
	{
		const options = { 
			dots:'green', 
			leftEyeIris:'blue', 
			rightEyeIris:'blue',
			hue:Math.random() * 360,
			debug:ui.debug
		}
		const name = 'person-'+['a','b','c'][index]
		const person = new Person(name, audioContext, audio, options ) 
		person.loadInstrument( randomInstrument() )
		if (midi && midi.outputs && midi.outputs.length > 0) 
		{
			person.setMIDI( midi.outputs[0] )
		}
		people.push( person )
		return person
	} else{
		return people[index]
	}
}

// BEGIN ---------------------------------------

// start on click as things require gesture for permission

body.classList.add("loading")
setFeedback("Initialising...<br> Please wait")

const enableMIDIForPerson = (personIndex=0, portIndex=0) => {
	const person = getPerson(personIndex)
	person.setMIDI(midi.outputs[portIndex])
	console.log("Enabling MIDI for", person)
}

const enableMIDI = async () => {

	try{
		midi = await setupMIDI()

		// this needs a user interaction to trigger
		
		// console.log(midi.inputs)
		if (midi.outputs.length>0)
		{
			// w00t
			console.log("MIDI devices", midi.outputs, midi)
			setFeedback("MIDI Available<br>Stand By", 0)
			// use this to fill the peoples
			enableMIDIForPerson(0,0)
		}else{
			// bugger
			console.log("No MIDI devices detected", midi)
			setFeedback("MIDI Available but no instruments detected", 0)
		}
		
		// midi device connected! huzzah!
		midi.addListener("connected", (e) => {
			console.log(e)
			setFeedback("MIDI Device connected!")
			// check outputs
			if (midi.outputs.length > 0)
			{
				enableMIDIForPerson(0,0)
			}
		})
		
		// Reacting when a device becomes unavailable
		midi.addListener("disconnected", (e) => {
			console.log(e)
			setFeedback("Lost MIDI Device connection")
		})

		midiAvailable = midi // && midi.outputs && midi.outputs.length > 0
		main.classList.add('midi-available')

	}catch(error){	

		// failed
		console.error("Total failure", error)
		// this needs a user interaction to trigger
		setFeedback("MIDI NOT Available<br>"+error, 0)
		return false
	}
	// suvvess
	return true	
}

const showMIDI = async () => {

	// show button
	// to skip clicking but results in a warning
	const onStartRequested = async (event) => {
		setFeedback("MIDI available<br>Connecting to instruments...", 0)
		console.log("User input detected so enabling MIDI!")
		await enableMIDI()
		buttonMIDI.removeEventListener('mousedown', onStartRequested)
		event.preventDefault()
		main.classList.add('midi-activated')
	}
	buttonMIDI.addEventListener('click', onStartRequested)
	return true
}

// this needs to occur on click

const setup = (settings) => {

	// set up the instrument selctor etc
	setupInterface( ui )

	// Load tf model and wait
	loadModel(inputElement, settings).then( async update =>{ 

		try{
			
			setFeedback( "Image downloaded...<br> Please wait")
			photo = await setupImage(image)
			
			setFeedback("Attempting to locate camera...")

			// wait for video or image to be loaded!
			camera = await setupCamera(video)
			setFeedback( "Camera located!", 0 )

			// at this point the video dimensions are accurate
			// so we add the main style vars
			main.style.setProperty('--width', video.width )
			main.style.setProperty('--height', video.height )

			updateCanvasSize(video.width, video.height)
			
			audio = setupAudio()
			setFeedback( "Audio Available...<br>Instrument "+instrument+" Sounds downloaded", 0 )

			// not neccessary if using Person
			// instrument = await loadInstrument( randomInstrument() )
			// const instrumentName = await loadRandomInstrument()
			// // now you can play any of the objects keys with
			// // playTrack(instrument[ INSTRUMENT_NAMES[0] ], 0)
			// //playTrack(instrument.A0, 0)
			// setFeedback( instrumentName.name + " Samples available...<br>Instrument Sounds downloaded")
			
			kit = createDrumkit()

			patterns = kitSequence()

			// console.log("Streamin", {video, photo, camera} )
			setFeedback( "Audio available...<br>Instrument Sounds ready")
			
		}catch(error){

			console.error("Bummer", error)
			setFeedback("Something went wrong :(<br>"+error, 0)
		}


		// MIDI ------
		try{
			// rather than enabling midi directly we show a button to enable it
			const hasMIDI = await showMIDI()
			if (hasMIDI)
			{
				main.classList.add('midi')
				setFeedback("MIDI available<br>Click the screen to connect", 0)
			}else{
				main.classList.add('midi','no-instrument')
				setFeedback("MIDI available<br>Connect an instrument to continue", 0)
			}
			
		}catch(error){
			// no midi - don't show midi button
			console.log("no MIDI!", error)
			main.classList.add('no-midi')
			setFeedback("MIDI unavailable, or no instrument connected<br>"+error, 0)
		}
		
		// const {startRecording, stopRecording} = record(stream)
		
		// set the input element to either the image or the video
		// hide the other or just set the class?

		// set the canvas to the size of the video / image
		canvas.width = inputElement.width
		canvas.height = inputElement.height

		// console.error("Tensorflow", tf)
		main.classList.add( inputElement.nodeName.toLowerCase() )
		
		// turn up the amp
		setAmplitude( 1 )


		// FIXME: set up a basic metronome here too...
		const playing = []

		let counter = 0

		// ----------------------------------------------------------------------------------
	

		// after a period of inactivity...
		//setFeedback("Everything is ready to "+ (inputElement === video? "record" : "read"))
	
		// remove loading flag as we now have all of our assets!
		body.classList.remove("loading")
		body.classList.remove("loaded")

		// update( inputElement === video, (predictions)=>{

		// 	//console.log(inputElement === video, "Predictions found ",predictions)
		// })
		// console.log(inputElement === video, "Waiting on predicions")
		// return
		// LOOP ---------------------------------------

		// FaceMesh.getUVCoords 
		// this then runs the loop if set to true
		update( inputElement === video, (predictions)=>{

			let tickerTape = ''
			counter++
			
			if (ui.synch)
			{
				// paste video frame
				drawElement( inputElement )
			}else{
				// clear for invisible canvas but 
				// NB. this may cause visual disconnect
				clear()
			}
			
			//drawWaves( dataArray, bufferLength )
			drawBars( dataArray, bufferLength )
			// drawBox( prediction )
			// drawPoints( prediction )
			// drawFace( prediction )
			// drawBoundingBox( prediction.boundingBox )

			if (ui.metronome)
			{
				// show quantise
				drawQuantise()
			}

			// setAmplitude( 1 )
			if (predictions)
			{
				// TODO: loop through all predictions...
				const index = 0

				const prediction = predictions[index]
				
				// create as many people as we need
				const person = getPerson(index)
				
				// face available!
				if (prediction && prediction.faceInViewConfidence > 0.9)
				{
					main.classList.toggle("active", true)
					// playAudio()
				}else{
					// stopAudio()
					setFeedback( "I need to see your face!" )
					main.classList.toggle("active", false)
					return
				}

				// first update the person
				person.update(prediction)

				// then redraw them
				//const { yaw, pitch, lipPercentage } = 
				person.draw(prediction)
				
				// then whenever you fancy it,
				if (ui.metronome)
				{
					// we only want it on the beat
				}else{
					person.sing()
				}
				
				// you want a tight curve
				//setAmplitude( logAmp )
				//setFrequency( 1/4 * 261.63 + 261.63 * lipPercentage)
				tickerTape += `<br>PITCH:${prediction.pitch} ROLL:${prediction.roll} YAW:${prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
				// tickerTape += `<br>PITCH:${Math.ceil(100*prediction.pitch)} ROLL:${Math.ceil(100*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`

			}else{
				// tickerTape += `No prediction`
			}

			// Feedback text changes depending on time
			if (!predictions){
				setFeedback(`No faces found!`)
			}else if (counter < 50)	{
				setFeedback(`Smile to begin!`)
			}else if (counter < 150){
				setFeedback(`Look at the screen and open your mouth!`)
			}else if (counter < 250){
				setFeedback(`Click your face to change instruments!`)
			}else if (counter > 10000){
				setFeedback(`OMG I can't believe you are still here!`)
			}else if (tickerTape.length){
				//setFeedback(tickerTape)
				// setFeedback(`PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${Math.ceil(360 * prediction.yaw)} MOUTH:${Math.ceil(100*lipPercentage)}% - ${person.instrumentName}`)
			}else{
				setFeedback(`Look at me and open your mouth`)
			}

			//console.warn("update",predictions, tickerTape )
		} )

		let barsElapsed = 0
		const timer = start( ({timePassed, elapsed, expected, drift, level, intervals, lag} )=>{
			
			barsElapsed++
			
			// console.log(barsElapsed, "timer", timer)
			if (ui.metronome)
			{
				const person = getPerson(0).sing()
				//console.log("Timing has occurred... sequence?", person)

				// show quantise
				drawQuantise(true)
			}

			// play some music!
			if (ui.backingTrack)
			{
				playNextPart( patterns.kick, kit.kick )
				playNextPart( patterns.snare, kit.snare )
				playNextPart( patterns.hat, kit.hat )

				// todo: also MIDI?
			}

			if (playing)
			{
				// timePassed
			}

		}, timePerBar() )

	})
	
}

// set up some extra options from query strings
setup( Object.assign( {}, SETTINGS, {
	// any custom overrides (shouldn't be needed : use query strings)
}))

// now wire up the bits...
canvas.addEventListener('mousedown',loadRandomInstrument )
video.addEventListener('mousedown', loadRandomInstrument )
window.addEventListener('keydown', async (event)=>{

	switch(event.key)
	{
		case 'Tab':
			ui.debug = !ui.debug
			people.forEach( person => person.debug = ui.debug )
			break

		case 'ArrowLeft':
			// next instrument
			previousInstrument()
			break

		case 'ArrowRight':
			// next instrument
			nextInstrument()
			break

		case 'ArrowUp':
			// change amount of bars
			bars = ++bars > 32 ? 32 : bars
			setTimeBetween(timePerBar())
			setFeedback( `Bars ${bars}`, 0 )
			break

		case 'ArrowDown':
			// bar length
			bars = --bars < 1 ? 1 : bars
			setTimeBetween(timePerBar())
			setFeedback( `Bars ${bars}`, 0 )
			break

		case ',':
			setNodeCount(-1)
			break
		
		case '.':
			setNodeCount(1)
			break

		case 'w':
			kit.cowbell()
			break

		case 'a':
			kit.kick()
			break

		case 's':
			kit.snare()
			break

		case 'd':
			kit.hat()
			break

		case 'q':
			kit.clack()
			break
	
		case 'b':
			ui.backingTrack = !ui.backingTrack
			break

		case 'r':
			if (!isRecording())
			{
				setFeedback("Recording START", 0)
				console.error("Recording START")
				recorder = await startRecording(audio)
				console.error("Recording...", recorder)
				
			}else{
				console.error("Recording END", recorder)
				setFeedback( `Recording Ended - now encoding`, 0 )
				stopRecording().then(recording=>{

					const mp3 = encodeRecording(recording, 'audio/mp3;')

					// Creating audio url with reference  
					// of created blob named 'audioData' 
					const audioSrc = window.URL.createObjectURL(mp3)
					console.error("Recording END", {recording, audioSrc, mp3})
				})
			}
			break

		default:
			ui.metronome = !ui.metronome
			setFeedback( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
	}
	
	console.log("key", ui, event)
})