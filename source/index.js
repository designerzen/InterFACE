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
	audioContext,inputNode,
	active, playing, 
	FOLDERS,
	loadInstrument, INSTRUMENT_NAMES, randomInstrument, 
	playTrack, playAudio, stopAudio, 
	bufferLength,dataArray, 
	setupAudio, 
	createKick, createKicks, createSnare,
	setShape, setFrequency, setAmplitude, 
	record } from './audio'
import { start, stop, getMode, setMode, setTimeBetween } from './timing.js'
import { setupMIDI } from './midi'
import { setupCamera, setupImage} from './visual'
import { easeInSine, easeOutSine , easeInCubic, lerp,clamp, TAU} from "./maths"
import {updateCanvasSize, clear,drawFace, drawPoints, drawPart, drawEye, drawMouth,drawBoundingBox, canvas, canvasContext, drawWaves, drawBars, drawQuantise} from './visual'
import Person, {DEFAULT_OPTIONS} from './person'
import {setupInterface} from './ui'

// import from './person'
const body = document.documentElement
const main = document.querySelector("main")
const video = document.querySelector("video")
const image = document.querySelector("img")
const feedback = document.getElementById("feedback")
const buttonInstrument = document.getElementById("button-instrument")
const buttonVideo = document.getElementById("button-video")

// options
const people = []
let inputElement = video // image
		
let instrument

let camera
let photo
let audio 
let midi

let kick
let snare

// As each sample is 2403 ms long, we should try and do it 
// as a factor of that, so perhaps bars would be better than BPM?
let bars = 16
let timePerBar =()=> 2403 / bars

const SETTINGS = {

	// maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
	maxFaces:1,
	
   	// Whether to load the MediaPipe iris detection model (an additional 2.6 MB of weights). The MediaPipe iris detection model provides (1) an additional 10 keypoints outlining the irises and (2) improved eye region keypoints enabling blink detection. Defaults to true.
	shouldLoadIrisModel:true,
	
	/*maxContinuousChecks - How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
    detectionConfidence - Threshold for discarding a prediction. Defaults to 0.9.
    iouThreshold - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3. A score of 0 means no overlapping faces will be detected, whereas a score closer to 1 means the model will attempt to detect completely overlapping faces.
    scoreThreshold - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75. Increase this score in order to reduce false positives (detects fewer faces).
    modelUrl - Optional param for specifying a custom facemesh model url or a tf.io.IOHandler object.
    irisModelUrl - Optional param for specifying a custom iris model url or a tf.io.IOHandler object.
	*/
}

// realtime UI options
const ui = {
	metronome:true,
	backingTrack:false
}

function debounce(callback, wait) {
	let timerId
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	}
}

let cachedFeedback= null

// updates the text on screen
const setToast = (info, rate=200) => {

	// change it after debounce timeout to prevent flooding
	debounce(()=>{
		toast.innerHTML = info
	}, rate)()

}

//
// updates the text on screen
const setFeedback = (info, rate=200) => {
	// debounce and only change if var has
	if (cachedFeedback != info)
	{
		// change it after debounce timeout to prevent flooding
		debounce(()=>{
			feedback.innerHTML = info
			cachedFeedback = info
		}, rate)()
	}
}

//
const loadRandomInstrument = async () => {
	// console.log("Loading random instrument", i)
	setFeedback(`Changing all instruments`)
	
	for (let p in people)
	{
		const i = randomInstrument() 
		const person = people[p]
		// instrument = await loadInstrument( i )
		await person.loadInstrument( i )
		setFeedback(`${i} loaded!`)
	}

	return people.map( person => person.instrument )
}

const previousInstrument = async() => {
	const person = people[0]
	if (person)
	{
		const index = FOLDERS.indexOf(person.instrumentName)
		const newIndex = index-1 < 0 ? 0 : index-1
		await person.loadInstrument( FOLDERS[newIndex] )
		setFeedback(`${FOLDERS[newIndex]} loaded!`)
		setToast(`${FOLDERS[newIndex]}`)
	}
}
const nextInstrument = async() => {
	const person = people[0]
	if (person)
	{
		const index = FOLDERS.indexOf(person.instrumentName)
		const newIndex = index+1 >= FOLDERS.length ? 0 : index+1
		await person.loadInstrument( FOLDERS[newIndex] )
		setFeedback(`${FOLDERS[newIndex]} loaded!`)
		setToast(`${FOLDERS[newIndex]}`)
	}
}

// We cahce every new user!
const getPerson = (index) => {
	
	if (people[index] == undefined)
	{
		const options = { dots:'green', leftEyeIris:'blue', rightEyeIris:'blue' }
		const person = new Person('person-'+['a','b','c'][index], audioContext, audio, options ) 
		person.loadInstrument( randomInstrument() )
		if (midi && midi.outputs && midi.outputs.length > 0) {
			person.setMIDI( midi.outputs[0] )
		}
		people.push( person )
		return person
	} else{
		return people[index]
	}
}

// BEGIN ---------------------------------------

const onFace = ()=>{

}

// start on click as things require gesture for permission

body.classList.add("loading")
setFeedback("Initialising...<br> Please wait")

const enableMIDI = async () => {

	midi = await setupMIDI()
	
	// this needs a user interaction to trigger
	setFeedback("MIDI Available<br>Stand By", 0)
	
	// midi device connected! huzzah!
	midi.addListener("connected", (e) => {
		console.log(e)
		setFeedback("MIDI Device connected!")
		// check outputs
		if (midi.outputs.length > 0)
		{
			const person = getPerson(0)
			person.setMIDI(midi.outputs[0])
		}
	})
	
	// Reacting when a device becomes unavailable
	midi.addListener("disconnected", (e) => {
		console.log(e)
		setFeedback("Lost MIDI Device connection")
	})
}

const showMIDI = async () => {

	// show button
	// to skip clicking but results in a warning
	const onStartRequested = async () => {
		console.log("User input detected so enabling MIDI!")
		await enableMIDI()
		buttonVideo.documentElement.removeEventListener('mousedown', onStartRequested)
	}
	buttonVideo.addEventListener('click', onStartRequested)
}

// this needs to occur on click

const setup = (settings) => {

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

			// instrument = await loadInstrument( randomInstrument() )
			const instrumentName = await loadRandomInstrument()
			// now you can play any of the objects keys with
			// playTrack(instrument[ INSTRUMENT_NAMES[0] ], 0)
			//playTrack(instrument.A0, 0)
			setFeedback(instrumentName+" Samples available...<br>Instrument Sounds downloaded")
			
			kick = createKicks()
			snare = createSnare()
			// console.log("Streamin", {video, photo, camera} )

		}catch(error){

			console.error("Bummer", error)
			setFeedback("Something went wrong :(<br>"+error)
		}


		// MIDI ------
		try{
			// rather than enabling midi directly we show a button to enable it
			await showMIDI()
			main.classList.add('midi')
		
		}catch(error){
			// no midi - don't show midi button
			console.log("no MIDI!")
			main.classList.add('no-midi')
		}
		
		// const {startRecording, stopRecording} = record(stream)
		
		// set the input element to either the image or the video
		// hide the other or just set the class?

		// set the canvas to the size of the video / image
		canvas.width = inputElement.width
		canvas.height = inputElement.height

		// console.error("Tensorflow", tf)
		main.classList.add( inputElement.nodeName.toLowerCase() )
		
		
		// FIXME: set up a basic metronome here too...
		const playing = []

		let counter = 0

		// turn up the amp
		setAmplitude( 1 )

		// set up the instrument selctor etc
		setupInterface()


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
			
				if (barsElapsed%4 === 0)
				{
					kick()	
				}

				if ((barsElapsed+2)%4 === 0 || (barsElapsed)%8 === 0)
				{
					snare()
				}
			}

		}, timePerBar() )


		// after a period of inactivity...
		setFeedback("Everything is ready to "+ (inputElement === video? "record" : "read"))
	
		// remove loading flag as we now have all of our assets!
		body.classList.remove("loading")

		update( inputElement === video, (predictions)=>{

			//console.log(inputElement === video, "Predictions found ",predictions)
		})
		console.log(inputElement === video, "Waiting on predicions")
		return
		// LOOP ---------------------------------------

		// FaceMesh.getUVCoords 
		// this then runs the loop if set to true
		update( inputElement === video, (predictions)=>{

			let tickerTape = ''
			counter++
			
			// clear for invisible canvas
			//clear()

			// draw data frame to canvas
			canvasContext.drawImage(inputElement, 0, 0)

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
					playAudio()
				}else{
					stopAudio()
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
				tickerTape += `<br>PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}% - ${person.instrumentName}`

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
				setFeedback(tickerTape)
				// setFeedback(`PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${Math.ceil(360 * prediction.yaw)} MOUTH:${Math.ceil(100*lipPercentage)}% - ${person.instrumentName}`)
			}else{
				setFeedback(`Look at me and open your mouth`)
			}

			//console.warn("update",predictions, tickerTape )
		} )


	})
}

// set up some extra options from query strings
setup( Object.assign( {}, SETTINGS, {
	// 
	maxFaces:1
}))

// now wire up the bits...
canvas.addEventListener('mousedown',loadRandomInstrument )
video.addEventListener('mousedown', loadRandomInstrument )

window.addEventListener('keydown', (event)=>{

	switch(event.key)
	{
		// case '':
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
		case 'w':
			snare()
			break
		case 'a':
			kick()
			break
		case 's':
			snare()
			break
		case 'd':
			kick()
			break

		default:
			ui.metronome = !ui.metronome
			setFeedback( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
	}
	
	console.log("key", ui, event)

})


// input.addListener("noteon", "all", (event: InputEventNoteon) => {
// 	...
//   }) 

// const {startRecording, stopRecording} = record()
// startRecording(audio)

// stopRecording('audio/mp3;').then(recording=>{
// 	// Creating audio url with reference  
// 	// of created blob named 'audioData' 
// 	const audioSrc = window.URL.createObjectURL(recording)
// })

// Settings that the user can change
