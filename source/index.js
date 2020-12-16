// Just a simple face detection script with visual overlaid feedback and audio
// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
// Best used with the Looking Glass Portrait

// const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection')
// FaceLandmarksDetector, FaceLandmarksPrediction, FaceLandmarksDetection
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow-models/face-landmarks-detection'
import {ready, setBackend} from '@tensorflow/tfjs'
// If you are using the WebGL backend:
// require('@tensorflow/tfjs-backend-webgl')
import '@tensorflow/tfjs-backend-webgl'

// CPU Only
//import '@tensorflow/tfjs-backend-cpu'

// If you are using the WASM backend:
// require('@tensorflow/tfjs-backend-wasm')
//import '@tensorflow/tfjs-backend-wasm'
// You need to require the backend explicitly because facemesh itself does not
import { 
	audioContext,inputNode,
	active, playing, 
	FOLDERS,
	loadInstrument, INSTRUMENT_NAMES, randomInstrument, 
	playTrack, playAudio, stopAudio, 
	bufferLength,dataArray, 
	setupAudio, createKick, createSnare,
	setShape, setFrequency, setAmplitude, 
	record } from './audio'
import { start, stop, getMode, setMode, setTimeBetween } from './timing.js'
import { setupMIDI } from './midi'
import { setupCamera, setupImage} from './visual'
import { easeInSine, easeOutSine , easeInCubic, lerp,clamp, TAU} from "./maths"
import {updateCanvasSize, clear,drawFace, drawPoints, drawPart, drawEye, drawMouth,drawBoundingBox, canvas, canvasContext, drawWaves, drawBars, drawQuantise} from './visual'
import Person, {LIPS_RANGE} from './person'
import {setupInterface} from './ui'
// import from './person'

const main = document.querySelector("main")
const video = document.querySelector("video")
const image = document.querySelector("img")
const feedback = document.getElementById("feedback")
const buttonInstrument = document.getElementById("button-instrument")
const buttonVideo = document.getElementById("button-video")

// options
const ease = easeInCubic // easeInSine

const people = []
let inputElement = image
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
	const i = randomInstrument() 
	// console.log("Loading random instrument", i)
	setFeedback(`Loading ${i}`)
	// instrument = await loadInstrument( i )
	const person = people[0]
	if (person)
	{
		await person.loadInstrument( i )
		setFeedback(`${i} loaded!`)
	}
	return i
}

const previousInstrument = async() => {
	const person = people[0]
	if (person)
	{
		const index = FOLDERS.indexOf(person.instrumentName)
		const newIndex = index-1 < 0 ? 0 : index-1
		await person.loadInstrument( FOLDERS[newIndex] )
		setFeedback(`${FOLDERS[newIndex]} loaded!`)
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
	}
}

async function predict(model){

	// Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
	// array of detected faces from the MediaPipe graph. If passing in a video
	// stream, a single prediction per frame will be returned.
	const predictions = await model.estimateFaces({
		// webcam element with video
	  	// input: video
	  	input: inputElement
	})

	// Fetch the UV coords for use with 3D renderers
	// const uvs = FaceLandmarksDetection.getUVCoords()

	// determine head rotation?
	// take the UV of the eyes and use them to determine angle

	//console.log("Predicting", inputElement, predictions)
	// firstly check to see if there any predictions
	if (predictions.length > 0) 
	{
		// now loop through all predictions?
		for (let p = 0, l = predictions.length; p < l; p++) 
		{
			const prediction = predictions[p]
			
			// more than likely there is a face on the screen :P
			const {boundingBox, mesh, scaledMesh, annotations} = prediction
			
			// now there are some points already isolated :)
			// so we can work out how much area the mouth is using up

			// See keypoints.js

			const topOfHead = 0
			const bottomOfHead = 0

			// There are three points on the face that we can compare against
			const {leftEyeIris,rightEyeIris} = annotations
			const {leftEyeLower0, rightEyeLower0, midwayBetweenEyes} = annotations

			// eyes pointing in directions?
			const eyeLeft = leftEyeIris[0]
			const eyeRight = rightEyeIris[0]
			const midPoint = midwayBetweenEyes[0]

			const lookingRight = eyeLeft[2] < eyeRight[2]

			// add in some extras to make things easier 
			// the midpoint can be used to triangulate the yaw
			const lx = leftEyeLower0[0][0] 
			const rx = rightEyeLower0[0][0] 
			const ly = leftEyeLower0[0][1] 
			const ry = rightEyeLower0[0][1] 
			const mx = midwayBetweenEyes[0][0] 

			// lengths of the triangle
			const lmx = (mx - lx) * -1
			const rmx = mx - rx

			const {rightCheek,leftCheek, silhouette} = annotations

			prediction.lookingRight = lookingRight


			// and now we want the angle formed
			const yaw = -1 * (Math.atan2(lmx, rmx) - 0.75)
 			//const yaw = 0.5 - Math.atan( midPoint[2], -1 * midPoint[0] ) / ( 2.0 * Math.PI )
		  
			// this is from forehead to chin...
			// if the chin is in front (z) of forehead, head tilting back
			const pitch = 0.5 - Math.asin( midPoint[1] ) / Math.PI

			// if either eye is lower than the other
			const rollX = (lx - rx)
			const rollY = (ly - ry)

			const roll = Math.atan2(rollX, rollY) - Math.PI * 0.5
			//console.log("roll",roll, {rollX,rollY} )
			
			// leaning head as if to look at own chest / sky
			prediction.pitch = pitch
			// tilting head towards shoulders
			prediction.roll = roll
			// regular left right movement
			prediction.yaw = yaw

			
			// Lip work --------------------------------

			const {lipsUpperInner,lipsLowerInner } = annotations
	
			// central piece of the mouth
			const lipUpperMiddle = lipsUpperInner[5]
			const lipLowerMiddle = lipsLowerInner[5]

			// use hypotheneuse
			const lipVerticalOpeningX = lipLowerMiddle[0] - lipUpperMiddle[0]
			const lipVerticalOpeningY = lipLowerMiddle[1] - lipUpperMiddle[1]
			
			 const lipVerticalOpening = Math.sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			//const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
			prediction.mouthRange = lipVerticalOpening

			// this is the size of the mouth as a factor of the head size
			prediction.mouthOpen = 1

			// -1 -> 1
			prediction.happiness = 0

			//console.log(prediction, {lmx,rmx,yaw},{lookingRight, eyeLeft,eyeRight}, {leftEyeIris,rightEyeIris})
		} 
		
	}else{
		//console.log("No face in shot")
	}
	
	return predictions
}

async function loadModel(options) {

	// Set the backend to WASM and wait for the module to be ready.
	//await setBackend('wasm')
	await ready()
	
	const detectPeople = options.maxFaces

	if (detectPeople === 1)
	{
		setFeedback( "Loading Face Landmarks Detection model" )
	}else{
		setFeedback( "Loading Group Face Landmarks Detection model" )
	}
	
	// Load the MediaPipe Facemesh package.
	const model = await load( SupportedPackages.mediapipeFacemesh, options)

	console.log("Loaded model", model )
	setFeedback( "Learning Model Loaded" )

	// now subscribe to events and monitor
	const update = async (repeat, callback) => { 

		// single player right now but this could be an array in future
		const predictions = await predict(model) 
		
		// clear for invisible canvas
		//clear()

		// draw data frame to canvas
		canvasContext.drawImage(inputElement, 0, 0)

		if (ui.metronome)
		{
			// show quantise
			drawQuantise()
		}

		//console.log("Predictions narrowed down to", predictions)
		if (predictions.length > 0)
		{
			drawBars( dataArray, bufferLength )
			//drawWaves( dataArray, bufferLength )
			
			// find the smaller value and use as the face quantity
			const quantity = Math.min(detectPeople, predictions.length)
			const people = []
			for (let i=0; i < quantity; ++i)
			{
				const prediction = predictions[i]
				// drawBox( prediction )
				// drawPoints( prediction )
				// drawFace( prediction )
				// drawBoundingBox( prediction.boundingBox )
				people.push( prediction )
			}
		
			if (callback) 
			{
				callback(people)
			}

		}else{

			// nofaces
			if (callback) 
			{
				callback(null)
			}
		}

		// loop
		if (repeat)
		{
			requestAnimationFrame( () => update(repeat, callback) )
		}
	}
	return update
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

main.classList.add("loading")
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

	loadModel(settings).then( async update =>{ 

		try{
			setFeedback("Attempting to locate camera...")

			// wait for video or image to be loaded!
			camera = await setupCamera(video)
			setFeedback( "Camera located!", 0 )

			// at this point the video dimensions are accurate
			// so we add the main style vars
			main.style.setProperty('--width', video.width )
			main.style.setProperty('--height', video.height )

			updateCanvasSize(video.width, video.height)
				
			photo = await setupImage(image)
			setFeedback( "Image downloaded...<br> Please wait")

			audio = setupAudio()
			setFeedback( "Audio Available...<br>Instrument "+instrument+" Sounds downloaded", 0 )

			// instrument = await loadInstrument( randomInstrument() )
			const instrumentName = await loadRandomInstrument()
			// now you can play any of the objects keys with
			// playTrack(instrument[ INSTRUMENT_NAMES[0] ], 0)
			//playTrack(instrument.A0, 0)
			setFeedback(instrumentName+" Samples available...<br>Instrument Sounds downloaded")
			
			kick = createKick()
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
		inputElement = video // image
		// hide the other or just set the class?

		// set the canvas to the size of the video / image
		canvas.width = inputElement.width
		canvas.height = inputElement.height

		// console.error("Tensorflow", tf)
		main.classList.add( inputElement.nodeName.toLowerCase() )
		main.classList.remove("loading")

		// after a period of inactivity...
		setFeedback("Open your mouth to begin!")

		// FIXME: set up a basic metronome here too...
		const playing = []

		let counter = 0

		// turn up the amp
		setAmplitude( 1 )

		let barsElapsed = 0
		const timer = start( ({timePassed, elapsed, expected, drift, level, intervals, lag} )=>{
			
			barsElapsed++

			if (ui.metronome)
			{
				const person = getPerson(0).sing()
				//console.log("Timing has occurred... sequence?", person)

				// show quantise
				drawQuantise(true)
			}
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

		console.log("timer", timer)

		// LOOP ---------------------------------------

		// FaceMesh.getUVCoords 
		// this then runs the loop if set to true
		update( inputElement === video, (predictions)=>{

			let tickerTape = ''
			counter++

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
				tickerTape += `<br>PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/LIPS_RANGE)}% - ${person.instrumentName}`

			}else{

			}

			// Feedback text changes depending on time
			if (counter < 50)
			{
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
		} )
	})
}

setup(SETTINGS) 	

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
