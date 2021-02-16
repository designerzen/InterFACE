// Just a simple face detection script with visual overlaid feedback and audio
// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
// Best used with the Looking Glass Portrait
import {installer} from './install.js'

import {createStore} from './store'

import {say, hasSpeech} from './speech'

// You need to require the backend explicitly because facemesh itself does not
import { 
	audioContext,
	active, playing, 
	randomInstrument, 
	playAudio, stopAudio, 
	updateByteFrequencyData,
	bufferLength,dataArray, 
	setupAudio,
	getVolume, setVolume, setAmplitude, 
	record } from './audio'

import { 
	getBars, setBars, getBar, 
	start, stop,
	now, 
	setTimeBetween, timePerBar, 
	getBPM } from './timing.js'
	
import {
	progressBar, 
	video,isVideoVisible,toggleVideoVisiblity,
	setToggle, setButton, 
	setupMIDIButton, 
	showUpdateButton, showReloadButton,
	setupCameraForm, 
	setupInterface, addToolTips,
	setFeedback, setToast } from './ui'
import { getLocationSettings, getShareLink, addToHistory } from './location-handler'
import { createDrumkit } from './synthesizers'
import { setupMIDI } from './midi'
import { detectCameras, setupCamera, filterVideoCameras } from './camera'
import { setupImage, getCanvasDimensions } from './visual'
import { takePhotograph, overdraw, setNodeCount, updateCanvasSize, clear, canvas, drawWaves, drawBars, drawQuantise, drawElement } from './visual'
import { playNextPart, kitSequence } from './patterns'
import { getInstruction, getHelp } from './instructions'
import Person, {DEFAULT_OPTIONS, NAMES} from './person'
import { setupReporting, track, trackError, trackExit } from './reporting'
import { VERSION } from './version'

// DOM Elements
const body = document.documentElement
const main = document.querySelector("main")
const image = document.querySelector("img")

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
let midiButton

let reporter

// samples and synths
let kit
let patterns
let recorder

// As each sample is 2403 ms long, we should try and do it 
// as a factor of that, so perhaps bars would be better than BPM?

let isLoading = true
let ultimateFailure = false
let midiAvailable = false
let cameraLoading = false
let noFacesFound = false
let counter = 0

// for disco mode!
const cameraPan = {x:1,y:1}

// should be set on the html but jic
body.classList.toggle("loading", true)

// realtime UI options
const ui = getLocationSettings({
	// play a constant beat
	metronome:false,
	// play music at same time
	backingTrack:false,
	// clear canvas every frame (if transparent will be ignored)
	clear:true,
	// draw video onto canvas
	transparent:true,
	// same thing?
	synch:true,
	// show debug texts
	debug:process.env.NODE_ENV === "development",
	// cancel audio playback (not midi)
	muted:false,
	// dual person mode (required reload)
	duet:false,
	// synchronise the beats with metronome
	quantise:true,
	// show the person's texts above them
	text:true,
	// audio visualiser is actually helpful to play
	spectrogram:true,
	// read out important instructions
	speak:true
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

// TODO: a version of the instructor that also reads out the messages
const setToaster = (message, time=0) => {
	if (ui.speak)
	{
		speak( message,true)
	}
	setToast(message,time)
	
}

// This sets the master volume below the compressor
const setMasterVolume = volume => {
	const r = setVolume(volume)
	store.setItem('audio', { volume:r })
	setToast(`Volume ${Math.ceil(r * 100)}%`,0)
	return r
}

const speak = toSay => {
	if ( ui.speak && hasSpeech() ) 
	{
		say(toSay,true)
	}
}

// For all people!
const loadInstruments = async (method, callback) => people.map( async (person) => { 
	const instrument = await person[method](callback)
	setToast(`${person.name} has ${instrument} loaded`)
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
			console.log("External event for ",{ person, detail , cache})
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
			main.classList.toggle('midi-no-devices', true)
		}
		
		// midi device connected! huzzah!
		midi.addListener("connected", (e) => {
			console.log(e)
			setFeedback("MIDI Device connected!")
			// check outputs
			if (midi.outputs.length > 0)
			{
				main.classList.toggle('midi-no-devices', false)
				people.forEach( (person,i) => enableMIDIForPerson(i,0) )
			}
			midiButton.setText("Click to disable")
		})
		
		// Reacting when a device becomes unavailable
		midi.addListener("disconnected", (e) => {
			console.log(e)
			setFeedback("Lost MIDI Device connection")
			if (midi.outputs.length > 0)
			{

			}else{
				main.classList.toggle('midi-no-devices', true)
			}
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

const disableMIDI = () => {
	// midiButton.setText()
}

// MIDI will require a user interaction
const showMIDI = async () => {

	// to skip clicking but results in a warning
	midiButton = setupMIDIButton( async (b) => {
		await enableMIDI()
		setFeedback("MIDI available<br>Connecting to instruments...", 0)
		console.log("User input detected so enabling MIDI!")
		main.classList.add('midi-activated')
		return false
	})
	
	return true
}

const loadCamera = async (deviceId, name="Default") => {
	let newCamera
	// prevent screen re-draw
	cameraLoading = true
	try{
		
		newCamera = await setupCamera( video, deviceId )
		if (deviceId && deviceId.length > 0)
		{
			store.setItem( 'camera', {deviceId} )
			
			console.log( deviceId, "Camera id saved")
		}
		 
		track('Action', {category:'Camera', label:name, value:deviceId})
						
	}catch(error){
		console.error( deviceId, "Camera errored", error)
		trackError( `${name} camera could not be accessed`, deviceId, "Camera" )
		throw error
	}
	
	cameraLoading = false
	return newCamera
}

// selected
const setup = async (settings, progressCallback) => {

	const loadTotal = 10
	let loadIndex = 0

	progressCallback(loadIndex++/loadTotal)

	// test of loading external scripts sequentially...
	const {loadModel} = await import('./predictor')

	progressCallback(loadIndex++/loadTotal)

	// set up the instrument selctor etc
	setupInterface( ui )
	progressCallback(loadIndex++/loadTotal)

	// Connect up sone buttons?
	setToggle( "button-quantise", status =>{
		ui.quantise = status
		addToHistory(ui,'quantise')
		main.classList.toggle('flag-quantise', status )
		setToast("Quantise " + (ui.quantise ? 'enabled' : 'disabled')  )
	}, ui.quantise)

	// Connect up sone buttons?
	setToggle( "button-metronome", status =>{
		ui.metronome = status
		addToHistory(ui,'metronome')
		main.classList.toggle('flag-metronome', status )
		setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
	}, ui.metronome )

	setToggle( "button-spectrogram", status =>{
		ui.spectrogram = status
		addToHistory(ui,'spectrogram')
		main.classList.toggle('flag-spectrogram', status )
		setToast("Spectrogram " + (ui.spectrogram ? 'enabled' : 'disabled')  )
	}, ui.spectrogram )

	setToggle( "button-transparent", status =>{
		ui.transparent = status
		addToHistory(ui,'transparent')
		main.classList.toggle('flag-transparent', status )
		setToast("Video Synch " + (ui.spectrogram ? 'enabled' : 'disabled')  )
	}, ui.transparent )

	setToggle( "button-clear", status =>{ 
		ui.clear = status
		addToHistory(ui,'clear')
		main.classList.toggle('flag-clear', status )
	}, ui.clear )

	setToggle( "button-overlay", status => toggleVideoVisiblity(), !isVideoVisible() )

	// Button video loads random instruments for all
	setButton( "button-video", status => loadRandomInstrument() )
	
	setButton( "button-photograph", event => {
		const unique = Math.ceil( now() * 10000000 )
		const id = `photograph-${unique}`
		const dimensions = getCanvasDimensions()
		const img = new Image()
		img.src = takePhotograph()
		img.alt = "Photograph taken " + Date.now().toString()
		img.width = dimensions.width
		img.height = dimensions.height

		const anchor = document.createElement("a")
		anchor.href = img.src
		anchor.innerHTML = `Click to download this photograph`
		anchor.id = id
		anchor.download = `snapshot-${unique}.png`
		anchor.appendChild(img)

		document.getElementById("photographs").appendChild(anchor)

		requestAnimationFrame( ()=>document.getElementById(id).scrollIntoView() )
	} )

	progressCallback(loadIndex++/loadTotal)
	
	// create our reporter for analytics
	// reporter.track()
	reporter = setupReporting("InterFACE")

	// Load tf model and wait
	loadModel(inputElement, settings).then( async update =>{ 

		try{
			
			setFeedback("Setting things up")
			progressCallback(loadIndex++/loadTotal)

			if (image)
			{
				setFeedback( "Image downloaded...<br> Please wait")
				photo = await setupImage(image)
			}
			
			progressCallback(loadIndex++/loadTotal)

			// wait for video or image to be loaded!
			if (video)
			{
				const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
				setFeedback( deviceId ? "Found saved camera" : "Attempting to locate a camera...<br>Please click accept if you are prompted")
			
				try{
					camera = await loadCamera(deviceId, "Saved")

				}catch( error ) {

					setFeedback( "Could not open saved camera, looking for another...")
					// bummer! try and use fallback?
					camera = await loadCamera()
					// delete saved key
					store.removeItem('cameraId')
				}

				// check to see if we want a selector
				const videoCameraDevices = filterVideoCameras( await detectCameras() )
				if (videoCameraDevices.length > 1)
				{
					setupCameraForm(videoCameraDevices, async (selected) => {
						camera = loadCamera( selected.deviceId, selected.label )
						//console.log( selected.deviceId, "Camera selected",selected, camera)
						setToast( `Camera ${selected.label} changed`, 0 )
					})
					
					// show / hide camera button
					main.classList.toggle("multiple-cameras", true)
				}
				
				
				setFeedback( "Camera located!", 0 )
				progressCallback(loadIndex++/loadTotal)
			}
			
			// at this point the video dimensions are accurate
			// so we add the main style vars
			main.style.setProperty('--width', video.width )
			main.style.setProperty('--height', video.height )
			main.classList.toggle('landscape', video.width > video.height )
			main.classList.toggle('portrait', video.width < video.height )
			main.classList.toggle('square', video.width === video.height )
			
			updateCanvasSize(video.width, video.height)
			progressCallback(loadIndex++/loadTotal)

		}catch(error){

			const errorMessage = String(error).replace("NotAllowedError: ",'')
			// NotAllowedError: Permission denied
			setFeedback("Camera could not be accessed<br>"+errorMessage, 0)
			setToast( errorMessage )
			isLoading = false
			ultimateFailure = true
			trackError('Camera Rejected or Not allowed')
			// FATAL ERROR
			return
		}

		try{
			audio = setupAudio()
			setFeedback( "Audio Available...<br>Instrument "+instrument+" Sounds downloaded", 0 )
			progressCallback(loadIndex++/loadTotal)

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
			progressCallback(loadIndex++/loadTotal)

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
			progressCallback(loadIndex++/loadTotal)

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
		
		addToolTips()

		// turn up the amp
		const volume = store.getItem('audio') ? parseFloat(store.getItem('audio').volume) : 1
		setVolume( volume > 0 ? volume : 1 )

		// load scripts once eveything has completed...
		// setTimeout( ()=>{
		// }, 0 )

		// ----------------------------------------------------------------------------------
	

		// after a period of inactivity...
		//setFeedback("Everything is ready to "+ (inputElement === video? "record" : "read"))
	
		// remove loading flag as we now have all of our assets!
	
		progressCallback(loadIndex++/loadTotal)
		

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

			if(isLoading)
			{
				isLoading = false
			}

			// return if camera is still connecting...
			if (cameraLoading)
			{
				//console.log("update:progress loading")
				return
			}

			let tickerTape = ''
			counter++
	
			if (ui.clear)
			{
				// clear for invisible canvas but 
				// NB. this may cause visual disconnect
				clear()
				
				if (!ui.transparent)
				{
					// paste video frame
					drawElement( inputElement )
				}

			}else{
				// switch effect type?
				const t = counter * 0.01
				
				overdraw( -7 * cameraPan.x + Math.sin(t), -4 * cameraPan.y + Math.cos(t))
			}
			
			if (ui.quantise)
			{
				// Start on BAR
				// show quantise
				drawQuantise(true, getBar())
			}
			
			if (ui.spectrogram)
			{
				//drawWaves( dataArray, bufferLength )
				
				updateByteFrequencyData()
				drawBars( dataArray, bufferLength )
			}
				
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
						if (!noFacesFound)
						{
							// face found!??
							main.classList.toggle( `${person.name}-active`, false)
							main.classList.toggle( `no-faces`, true)
							noFacesFound = true
						}else{
							setFeedback( getHelp( Math.floor(counter/100) ) )
						}
						
						return
					}

					// first update the person
					person.update(prediction)

					// then redraw them
					// const { yaw, pitch, lipPercentage } = 
					person.draw(prediction, ui.text)
					
					// then whenever you fancy it,
					if (!ui.quantise && !ui.muted)
					{
						// unless quantize is turned off
						const stuff = person.sing()
						// stuff.eyeDirection
						if (i===0)
						{
							// stuff.eyeDirection
							// use person 1's eyes to control other stuff too?
							// in this case the direction of the pan in disco mode
							cameraPan.x = stuff.eyeDirection
							cameraPan.y = stuff.pitch
						}

					}else{
						// we only want it on the beat
						
					}
					
					// you want a tight curve
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
				setFeedback( getHelp( Math.floor(counter/100)  ))
			// }else if (tickerTape.length){
			// 	setFeedback(tickerTape)
			// 	// setFeedback(`PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${Math.ceil(360 * prediction.yaw)} MOUTH:${Math.ceil(100*lipPercentage)}% - ${person.instrumentName}`)
			}else{
				setFeedback( getInstruction( Math.floor(counter/100) ))
				// setFeedback(`Look at me and open your mouth`)
			}

			//console.warn("update",predictions, tickerTape )
		}, shouldUpdate )


		// Metronome
		const timer = start( ({bar, bars, barsElapsed, timePassed, elapsed, expected, drift, level, intervals, lag} )=>{
		
			if (ui.muted)
			{
				return
			}

			if (ui.metronome && bars % 2 === 0 )
			{
				// TODO: change timbre for first & last stroke
				const metronomeLength = 0.1
				kit.clack( metronomeLength, bars % 4 === 0 ? 0.2 : 0.1 )
			}

			// console.log(barsElapsed, "timer", timer)
			// Play metronome!
			if(ui.quantise)
			{
				for (let i=0, l=people.length; i<l; ++i )
				{
					const person = getPerson(i)
					// yaw, pitch, lipPercentage, eyeDirection
					const stuff = person.sing()
					if (i===0)
					{
						
						// stuff.eyeDirection
						// use person 1's eyes to control other stuff too?
						// in this case the direction of the pan in disco mode
						cameraPan.x = stuff.eyeDirection
						cameraPan.y = stuff.pitch
					}
				}
			}


			// play some accompanyment music!
			if (ui.backingTrack && bar%2 === 0 )
			{
				const kick = playNextPart( patterns.kick, kit.kick )
				const snare = playNextPart( patterns.snare, kit.snare )
				const hat = playNextPart( patterns.hat, kit.hat )

				console.error("backing|", {kick, snare, hat })
				// todo: also MIDI beats on channel 16?
			}

			if (playing)
			{
				// timePassed
			}
			
		}, timePerBar() )

	} )
	// camera loading just pauses the update mechanism
}

// 
setFeedback("Initialising...<br> Please wait")


// Progressive Web Application ---------------------------------
let installation = null
let loadMeter = 0

// allow for debug via css
body.classList.toggle("debug", ui.debug )

const onLoaded = async () => {

	body.classList.toggle("loaded", true)
	body.classList.remove("loading")
		
	// at any point we can now trigger the installation
	if (installation)
	{
		try{
			const destination = document.getElementById("shared-controls")
			const needsInstall = await installation( destination )		
			setToast( needsInstall ? "You can install this as an app! Click install below" : "" )
		
		}catch(error){
			console.error("Install/Update issue", error)
		}
		
	}else{
		console.log("Loaded Webpage", VERSION)
	}

	try{
		// load the share menu :)
		const sharer = await import('share-menu')
	}catch(error){
		// disable the share menu...
		document.getElementById("share").style.display = "none"
	}
	
	// change this depending on whether a face is detected
	speak("Open your mouth to begin!")

	// Show hackers message
	if (ui.debug)
	{
		// console.log("Loaded App", {VERSION, needsInstall, needsUpdate })
		console.log(`Loaded App ${VERSION} ${needsInstall ? "Installable" : needsUpdate ? "Update Available" : ""}` )	
	}
}


// loop until loaded...
const loadingLoop = async () => {

	if (isLoading)
	{ 
		// console.log("loading",loadMeter*100)
		requestAnimationFrame( loadingLoop ) 
	}else{

		if (ultimateFailure)
		{
			body.classList.add("failure")
			showReloadButton()

		}else{
			onLoaded()
		}
	}
}

// import {installer} from './install'
// import {update}  from './update.js'
// const test = async ()=>{
// 	const {installer} = await import('./install.js')
// 	const {update} = await import('./update.js')
// 	const destination = document.getElementById("shared-controls")
// 	const install = await installer(true)
// 	const needsInstall = await install( destination )		
// 	const needsUpdate = await update()
// }
// test()

// progressive web app variant
const pwa = async() => {
	try{
		// const {installer} = await import('./install.js')
		installation = await installer(true)
	
		const {updateApp} = await import('./update.js')
		
		// may as well disrupt the load if an update is available!
		// as we reload the thing anyways!
		const {updater, updateAvailable} = await updateApp()

		if (updateAvailable)
		{
			showUpdateButton(updater)
			setToast("An Update is available! Press update to install it" )
		}

		console.log("installer", { installer, installation})
	
	}catch(error){
		console.error("PWA", error)
	}
}

// ---------------------------------------------------------

// load settings from store here too?
// set up some extra options from query strings
// any custom overrides (shouldn't be needed : use query strings)
setup( Object.assign( {}, SETTINGS, {} ), progress => {
	
	//console.log("Loading", progress, progressBar )
	progressBar.setAttribute("value",progress)
	// ease this?
	loadMeter = progress
})

setFeedback("Loading... Please wait<br>This can take <strong>some</strong> time!")
pwa()

loadingLoop()


// Exit
window.onbeforeunload = ()=>{
	// save ui settings in cookie too?
	trackExit()
	//store.setItem(person.name, {instrument})
	setToast("bye bye!")
}

// document.addEventListener( "contextmenu", (e) => {
//     console.log(e)
// })

// if this is a desktop?
window.oncontextmenu = () => {
	// reset instructions
	counter = 0
	// restart counter?
    //return false     // cancel default menu
}
// ---- Other forms of input -----

// now wire up the bits...
// canvas.addEventListener('mousedown',loadRandomInstrument )
// video.addEventListener('mousedown', loadRandomInstrument )

window.addEventListener('keydown', async (event)=>{

	switch(event.key)
	{
		case 'CapsLock':
			ui.debug = !ui.debug
			people.forEach( person => person.debug = ui.debug )
			setToast(`DEBUG : ${ui.debug}`)
			speak( ui.debug ? "secret mode unlocked" : "disabling developer mode", true)
			break

		case 'Space':
			// read out last bit of help?
			speak(document.getElementById('toast').innerText, true)
			loadRandomInstrument() 
			break

		case 'ArrowLeft':
			previousInstrument()
			break

		case 'ArrowRight':
			nextInstrument() 
			break

		// change amount of bars
		case 'ArrowUp':
			let b = getBars() + 1
			let bars = setBars( b )
			let t = setTimeBetween( timePerBar() )
	
			console.error("bars---",bars,  b, t )
			setToast(`Bars : ${bars} / BPM : ${getBPM()}`)
			break

		case 'ArrowDown':
			let ub = getBars() - 1
			let ubars = setBars( ub )
			let ut = setTimeBetween( timePerBar() )
	
			console.error("bars---", ubars, ub, ut )
			setToast( `Bars ${ubars} / BPM : ${getBPM()}` )
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

		case 'c':
			ui.clear = !ui.clear
			break

		case 't':
			ui.text = !ui.text
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

		// Hide video
		case 'v':
			// FIXME: Alsoenable sync?
			video.style.visibility = video.style.visibility === "hidden" ? "visible" : "hidden"
			break

		case 'm':
			ui.metronome = !ui.metronome
			setToast( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
			break

		case '?':
			// toggle speech
			ui.speak = !ui.speak
			setToast( ui.speak ? `Reading out instructions` : `Staying quiet` )
			break

		// don't hijack tab you numpty!
		// FILTER
		case 'Tab':
			break

		default:
			loadRandomInstrument()
			speak("Loading random instruments",true)
	}

	// we run this when we want to 
	addToHistory(ui, event.key)
	console.log("key", ui, event)
})

// URL has been updated internally
window.addEventListener('popstate', (event) => {
	//console.log("location: " + document.location + ", state: " + JSON.stringify(event.state))
})

// window.addEventListener('wheel' , event => {
	
// 	return

// 	let d = event.detail
// 	const w =  event.deltaY || event.wheelDelta
// 	let n = 225
// 	let n1 = n-1
// 	let f

// 	// Normalize delta
// 	d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120
// 	// Quadratic scale if |d| > 1
// 	d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n
// 	// Delta *should* not be greater than 2...
// 	const wheel = Math.min(Math.max(d / 2, -1), 1) * 0.1
// 	const volume = getVolume()
// 	//const result = setMasterVolume(volume + wheel)

// 	console.log("mouse wheel",{ wheel, volume, result}, event)	
// })

// window.addEventListener('deviceorientation' , event => {
// 	//console.log("device orientation", event)
// })