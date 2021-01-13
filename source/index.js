// Just a simple face detection script with visual overlaid feedback and audio
// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
// Best used with the Looking Glass Portrait






import {createStore} from './store'
import {loadModel} from './predictor'

// You need to require the backend explicitly because facemesh itself does not
import { 
	audioContext,
	active, playing, 
	randomInstrument, playTrack, playAudio, stopAudio, 
	bufferLength,dataArray, 
	setupAudio, setAmplitude, 
	record } from './audio'

import { start, stop, setTimeBetween } from './timing.js'
import { setupCameraForm, setupInterface, setFeedback, setToast, showReloadButton } from './ui'
import { getLocationSettings} from './location-handler'
import { createDrumkit } from './synthesizers'
import { setupMIDI } from './midi'
import { detectCameras, setupCamera, filterVideoCameras } from './camera'
import { setupImage} from './visual'
import { setNodeCount, updateCanvasSize, clear, canvas, drawWaves, drawBars, drawQuantise, drawElement } from './visual'
import { playNextPart, kitSequence } from './patterns'
import { getInstruction, getHelp, getNextInstruction, INSTRUCTIONS, QUICK_START } from './instructions'
import Person, {DEFAULT_OPTIONS, NAMES} from './person'
import { VERSION } from './version'

// DOM Elements
const body = document.documentElement
const main = document.querySelector("main")
const video = document.querySelector("video")
const image = document.querySelector("img")

const buttonMIDI = document.getElementById("button-midi")
	
// Record stuff
const {isRecording, startRecording, stopRecording} = record()

const store = createStore()

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
let barsElapsed = 0
let timePerBar = () => 2403 / bars

let isLoading = true
let ultimateFailure = false
let midiAvailable = false
let cameraLoading = false
let noFacesFound = false


body.classList.add("loading")

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
	
	// maxContinuousChecks - How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
    // detectionConfidence - Threshold for discarding a prediction. Defaults to 0.9.
    // iouThreshold - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3. A score of 0 means no overlapping faces will be detected, whereas a score closer to 1 means the model will attempt to detect completely overlapping faces.
    // scoreThreshold - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75. Increase this score in order to reduce false positives (detects fewer faces).
    // modelUrl - Optional param for specifying a custom facemesh model url or a tf.io.IOHandler object.
    // irisModelUrl - Optional param for specifying a custom iris model url or a tf.io.IOHandler object.
}

// For all people!
const loadInstruments = async (method, callback) => people.map( async (person) => { 
	const instrument = await person[method](callback)
	store.setItem(person.name, {instrument})
	setFeedback(`${person.name} has ${instrument} loaded`)
	console.log(`${person.name} has ${instrument} loaded` )
	return instrument
})

const loadRandomInstrument = async (callback) => await loadInstruments('loadRandomInstrument', callback)
const previousInstrument = async (callback) => await loadInstruments('loadPreviousInstrument', callback)
const nextInstrument = async (callback) => await loadInstruments('loadNextInstrument', callback)

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
		const name = NAMES[index]
		const savedOptions = store.has(name) ? store.getItem(name) : {}
		const person = new Person(name, audioContext, audio, options ) 
		// see if there is a stored name for the instrument...
		const instrument = savedOptions.instrument || randomInstrument()
	
		// the instrument has changed / loaded!
		person.button.addEventListener( 'instrumentchange', event => {
			// save it for next time
			const {detail} = event
			const cache = store.setItem(name, {instrument:detail.instrumentName })
			//console.log("External event for ",{ person, detail , cache})
		})
		person.loadInstrument( instrument, instrumentName => {} )
		
		//console.error(name, {instrument, person, savedOptions})
		
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

const enableMIDIForPerson = (personIndex=0, portIndex=0) => {
	const person = getPerson(personIndex)
	person.setMIDI(midi.outputs[portIndex])
	console.log("Enabling MIDI for", person)
}

// this needs a user interaction to trigger
const enableMIDI = async () => {

	try{
		midi = await setupMIDI()
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
			setToast("No MIDI Device connected")
		}
		
		// midi device connected! huzzah!
		midi.addListener("connected", (e) => {
			console.log(e)
			setFeedback("MIDI Device connected!")
			// check outputs
			if (midi.outputs.length > 0)
			{
				people.forEach( (person,i) => enableMIDIForPerson(i,0) )
			}
		})
		
		// Reacting when a device becomes unavailable
		midi.addListener("disconnected", (e) => {
			console.log(e)
			setFeedback("Lost MIDI Device connection")
		})

		midiAvailable = midi // && midi.outputs && midi.outputs.length > 0
		main.classList.add('midi-available')

		setToast(midi.outputs.length > 0 ? "MIDI Connected" : "Connect a MIDI Device to continue")

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

// MIDI will require a user interaction
const showMIDI = async () => {

	// show button
	// to skip clicking but results in a warning
	const onStartRequested = async (event) => {
		event.preventDefault()
		//buttonMIDI.removeEventListener('mousedown', onStartRequested)
		setFeedback("MIDI available<br>Connecting to instruments...", 0)
		console.log("User input detected so enabling MIDI!")
		await enableMIDI()
		main.classList.add('midi-activated')
		return false
	}
	buttonMIDI.addEventListener('mousedown', onStartRequested, { once: true })
	return true
}


// selected
const setup = (settings) => {

	// set up the instrument selctor etc
	setupInterface( ui )

	// Load tf model and wait
	loadModel(inputElement, settings).then( async update =>{ 

		try{
			
			setFeedback("Setting things up")

			if (image)
			{
				setFeedback( "Image downloaded...<br> Please wait")
				photo = await setupImage(image)
			}
			
			setFeedback("Attempting to locate camera...")

			// wait for video or image to be loaded!
			if (video)
			{
				const deviceId = store.has('cameraId') ? store.getItem('cameraId') : undefined
				camera = await setupCamera(video)
				
				// check to see if we want a selector
				const videoCameraDevices = filterVideoCameras( await detectCameras() )
				if (videoCameraDevices.length > 1)
				{
					setupCameraForm(videoCameraDevices, async (selected) => {
						// console.error("Camera selected",selected)
						cameraLoading = true
						camera = await setupCamera( video, selected.deviceId )
						cameraLoading = false
						store.setItem( 'cameraId', selected.deviceId ) 
						setToast( `Camera ${selected.label} selected`, 0 )
					})	
				}
			
				setFeedback( "Camera located!", 0 )
			}
			
			// at this point the video dimensions are accurate
			// so we add the main style vars
			main.style.setProperty('--width', video.width )
			main.style.setProperty('--height', video.height )

			updateCanvasSize(video.width, video.height)
		}catch(error){

			const errorMessage = String(error).replace("NotAllowedError: ",'')
			// NotAllowedError: Permission denied
			setFeedback("Camera could not be accessed<br>"+errorMessage, 0)
			setToast( errorMessage )
			isLoading = false
			ultimateFailure = true
			// FATAL ERROR
			return
		}

		try{
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

			ultimateFailure = true
			setFeedback("Something went wrong with the Audio<br>"+error, 0)
			return 
		}


		// MIDI ------
		try{
			// rather than enabling midi directly we show a button to enable it
			const hasMIDI = await showMIDI()
			if (hasMIDI)
			{
				main.classList.add('midi')
				setFeedback("MIDI available<br>Click the button to connect", 0)
			}else{
				main.classList.add('midi','no-instrument')
				setFeedback("MIDI available<br>Connect an instrument <small>and click the button</small>", 0)
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

		// load install scripts once eveything has completed...
		//setTimeout(async ()=>{
		
		//}, 0 )

		// FIXME: set up a basic metronome here too...
		const playing = []

		let counter = 0

		// ----------------------------------------------------------------------------------
	

		// after a period of inactivity...
		//setFeedback("Everything is ready to "+ (inputElement === video? "record" : "read"))
	
		// remove loading flag as we now have all of our assets!
	
		isLoading = false

		// update( inputElement === video, (predictions)=>{

		// 	//console.log(inputElement === video, "Predictions found ",predictions)
		// })
		// console.log(inputElement === video, "Waiting on predicions")
		// return
		// LOOP ---------------------------------------

		const shouldUpdate = () => !cameraLoading
		// FaceMesh.getUVCoords 
		// this then runs the loop if set to true
		update( inputElement === video, (predictions)=>{

			// return if camera is still connecting...
			if (cameraLoading)
			{
				console.log("update:progress loading")
				return
			}

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
	
			if (ui.metronome)
			{
				// show quantise
				const bar = barsElapsed % bars
				drawQuantise(true, bar)
			}

			// setAmplitude( 1 )
			if (predictions)
			{
				// loop through all predictions...
				for (let i=0, l=predictions.length; i < l; ++i)
				{
					const prediction = predictions[i]
					// create as many people as we need
					const person = getPerson(i)
				
					// face available!
					if (prediction && prediction.faceInViewConfidence > 0.9)
					{
						//if (!act)
						//main.classList.toggle("active", true)
						// playAudio()
						if (noFacesFound)
						{
							noFacesFound = false
							main.classList.toggle( `${person.name}-active`, true)
							main.classList.toggle( `no-faces`, false)
						}
						
					}else{
						// stopAudio()
						setFeedback( getHelp( Math.floor(counter/100) ) )
						
						if (!noFacesFound)
						{
							main.classList.toggle( `${person.name}-active`, false)
							main.classList.toggle( `no-faces`, true)
							noFacesFound = true
						}
						
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
						// unless quantize is turned off
						person.sing()
					}
					
					// you want a tight curve
					//setAmplitude( logAmp )
					//setFrequency( 1/4 * 261.63 + 261.63 * lipPercentage)
					tickerTape += `<br>PITCH:${prediction.pitch} ROLL:${prediction.roll} YAW:${prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
					// tickerTape += `<br>PITCH:${Math.ceil(100*prediction.pitch)} ROLL:${Math.ceil(100*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
		
				}
					
			}else{
				// tickerTape += `No prediction`
			}

			// Feedback text changes depending on time
			if (!predictions)
			{
				// Need to show instructions to the user...
				// as no face can be detected
				setFeedback(getHelp( Math.floor(counter/100)  ))
			// }else if (tickerTape.length){
			// 	setFeedback(tickerTape)
			// 	// setFeedback(`PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${Math.ceil(360 * prediction.yaw)} MOUTH:${Math.ceil(100*lipPercentage)}% - ${person.instrumentName}`)
			}else{
				setFeedback(getInstruction( Math.floor(counter/100) ))
				// setFeedback(`Look at me and open your mouth`)
			}

			//console.warn("update",predictions, tickerTape )
		}, shouldUpdate )

		// Metronome
		const timer = start( ({timePassed, elapsed, expected, drift, level, intervals, lag} )=>{
			
			const bar = barsElapsed % bars

			// Start on BAR
			if (barsElapsed % bars === 0)
			{
				// show quantise
				drawQuantise(true, bar, `/${bars}*` )
			}else{
				drawQuantise(true, bar, `/${bars}-` )
			}

			
			// console.log(barsElapsed, "timer", timer)
			if (ui.metronome)
			{
				const person = getPerson(0).sing()
				//console.log("Timing has occurred... sequence?", person)
			}

			// play some accompanyment music!
			if (ui.backingTrack)
			{
				playNextPart( patterns.kick, kit.kick )
				playNextPart( patterns.snare, kit.snare )
				playNextPart( patterns.hat, kit.hat )

				// todo: also MIDI beats on channel 16?
			}

			if (playing)
			{
				// timePassed
				barsElapsed++
			}
			
		}, timePerBar() )

	} )
	// camera loading just pauses the update mechanism
}

// 
setFeedback("Initialising...<br> Please wait")
// load settings from store?
// set up some extra options from query strings
// any custom overrides (shouldn't be needed : use query strings)
setup( Object.assign( {}, SETTINGS, {} ))

setFeedback("Please wait...")

// Progressive Web Application ---------------------------------
let installation = null

// progressive web app variant
const pwa = async() => {
	try{
		const {installer} = await import('./install.js')
		installation = await installer(true)
		const updater = await import('./update.js') // ,updater,beginInstall
		const sharer = await import('share-menu')
		
		console.log("installer", {updater, installer, installation, sharer})
	
	}catch(error){
		console.error("PWA", error)
	}
}
pwa()


// loop until loaded...
const loadingLoop = () => {

	if (isLoading)
	{ 
		requestAnimationFrame( loadingLoop ) 
	}else{

		body.classList.remove("loading")
		
		if (ultimateFailure)
		{
			body.classList.add("failure")
			showReloadButton()

		}else{
			body.classList.add("loaded")

			// at any point we can now trigger the installation
			if (installation)
			{
				const destination = document.getElementsById("shared-controls")
				const needsInstall = installation( destination )
				console.log("Loaded App", {VERSION, needsInstall, installation})
			}else{
				console.log("Loaded Webpage", VERSION)
			}
			
		}
	}
}
loadingLoop()

// ---- Other forms of input -----

// now wire up the bits...
canvas.addEventListener('mousedown',loadRandomInstrument )
video.addEventListener('mousedown', loadRandomInstrument )
window.addEventListener('keydown', async (event)=>{

	switch(event.key)
	{
		// don't hijack tab you numpty!
		
		case 'CapsLock':
			ui.debug = !ui.debug
			people.forEach( person => person.debug = ui.debug )
			setToast(`DEBUG : ${ui.debug}`)
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
			// setFeedback( `Bars ${bars}`, 0 )
			setToast(`Bars : ${bars}`)
			break

		case 'ArrowDown':
			// bar length
			bars = --bars < 1 ? 1 : bars
			setTimeBetween(timePerBar())
			// setFeedback( `Bars ${bars}`, 0 )
			setToast( `Bars ${bars}` )
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
			setToast( ui.backingTrack ? "Backing track starting" : "Ending Backing Track" )
			break

		case 'r':
			if (!isRecording())
			{
				setToast("Recording START")
				console.error("Recording START", audio)
				recorder = await startRecording(audio)
				console.error("Recording...", recorder)
				

			}else{
				console.error("Recording END", recorder)
				setToast( `Recording Ended - now encoding` )
				stopRecording().then(recording=>{

					const mp3 = encodeRecording(recording, 'audio/mp3;')

					// Creating audio url with reference  
					// of created blob named 'audioData' 
					const audioSrc = window.URL.createObjectURL(mp3)
					console.error("Recording END", {recording, audioSrc, mp3})
				})
			}
			break

		// FILTER
		case 'Tab':
			break

		// DEFAULT
		case 'm':
		default:
			ui.metronome = !ui.metronome
			setToast( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
	}
	
	console.log("key", ui, event)
})

