// Just a simple face detection script with visual overlaid feedback and audio
// Best used with the Looking Glass Portrait





// TODO: Lazy load more of these...
// import {midiLikeEvents} from './timing/rhythm'
import { createStore} from './store'
import { say, hasSpeech} from './audio/speech'
import { record } from './audio/recorder'
import { 
	setupAudio,	audioContext,
	// FX
	setReverb,
	active, playing, 
	randomInstrument,
	updateByteFrequencyData, updateByteTimeDomainData,
	bufferLength,dataArray, 
	getVolume, setVolume } from './audio/audio'
import { createDrumkit } from './audio/synthesizers'
import { setupMIDI, testForMIDI } from './audio/midi-out'

import { 
	tapTempo,
	getBars, setBars, getBar, 
	startTimer, stopTimer, now, 
	getBarProgress,
	setTimeBetween, timePerBar, getBPM 
} from './timing/timing.js'
	
import {
	updateTempo,
	showPlayerSelector, 
	video,isVideoVisible,toggleVideoVisiblity,  
	setupCameraForm, setupInterface,
	toggleVisibility,
	focusApp
} from './dom/ui'

import { connectSelect, connectReverbControls } from './dom/select'
import { setToggle } from './dom/toggle'
import { setButton, showUpdateButton, showReloadButton, setupMIDIButton } from './dom/button'
import { setFeedback, setToast, addToolTips } from './dom/text'
import { showError } from './dom/errors'
import { setLoadProgress, getLoadProgress } from './dom/load-progress'
import { appendPhotographElement } from './dom/photographs'

import { 
	drawElement,
	updateCanvasSize, copyCanvasToClipboard, 
	overdraw, clear, canvas
} from './visual/canvas'

import { setupImage, setNodeCount } from './visual/2d'

import { drawWaves, drawBars } from './visual/spectrograms'

import { drawQuantise } from './visual/quantise'

import { 
	getReferer, getRefererHostname, 
	getLocationSettings, getShareLink, 
	forceSecure, addToHistory } from './location-handler'

import { findBestCamera, loadCamera } from './camera'
import { playNextPart, kitSequence } from './timing/patterns'
// TODO: Lazy load
import { getInstruction, getHelp } from './models/instructions'
import { setupReporting, track, trackError, trackExit } from './reporting'
import { VERSION } from './version'
import { TAU } from "./maths/maths"

import Person, { 
	DEFAULT_OPTIONS, EYE_COLOURS, 
	EVENT_INSTRUMENT_CHANGED 
} from './person'

import { getBrowserLocales } from './i18n'
import { getDomainDefaults, NAMES } from './settings'

import {
	convertOptionToObject,
	addMouseTapAndHoldEvents, 
	MOUSE_HELD, MOUSE_HOLDING,MOUSE_TAP
} from './utils'

import { installOrUpdate } from './pwa/pwa'

// this is the amount of time to run before we "check" for things
const TIME_BEFORE_REFRESH = 24 * 60 * 60 * 1000

// if we have a specific referer, we can change the options accordingly
// allow different domains to show different styles / options / configs
// current domains that point this way include :
// interface.place
// interface.lol	<- defaults to simple 'kid' mode
// interface.band	<- defaults to duet mode
const referer = getReferer()
const LTD = getRefererHostname().split('.').pop()
const defaultOptions = getDomainDefaults( LTD ) 
let ui = getLocationSettings( defaultOptions )


// DOM Elements
const body = document.documentElement
const main = document.querySelector("main")
const image = document.querySelector("img")

// should be set on the html but jic
body.classList.toggle("loading", true)
body.classList.add(LTD)

// Record stuff
const { isRecording, startRecording, stopRecording } = record()

// state management
const store = createStore()

// i18n / l10n
const language = getBrowserLocales()[0]

// collection of persons
const people = []
let inputElement = video // image

// dom elements wrapped in js
let camera
let photo
let audio 
let midi
let midiButton
let timer
let reporter

// samples and synths
let kit
let patterns
let recorder

// As each sample is 2403 ms long, we should try and do it 
// as a factor of that, so perhaps bars would be better than BPM?
let canBeInstalled = true
let isLoading = true
let beatJustPlayed = false
let ultimateFailure = false
let midiAvailable = false
let cameraLoading = true
let noFacesFound = false
let userLocated = false

// TODO:
let cookieConsent = false

// This allows us to determine how long the app has been running for?

let counter = 0

const information = store.getItem('info') || {
	lastTime:-1,
	count:0
}

const timeElapsedSinceLastPlay = information.lastTime > 0 ? Date.now() - information.lastTime : -1
	
// performance indicators
const statistics = {
	lag:0, 
	drift:0
}

// for disco mode!
const cameraPan = {x:1,y:1}

// if on http flip to https
forceSecure(ui.debug)



// ESCAPE - no cameras found on system?
// ESCAPE - no GPU?

////////////////////////////////////////////////////////////////////
// Vocal mode uses speech synthesis to talk the toSay string
////////////////////////////////////////////////////////////////////
const speak = toSay => {
	if ( ui.speak && hasSpeech() ) 
	{
		say(toSay,true)
	}
}

////////////////////////////////////////////////////////////////////
// TODO: a version of the instructor that also reads out the messages
////////////////////////////////////////////////////////////////////
const setToaster = (message, time=0) => {
	speak( message,true)
	setToast(message,time)
}

////////////////////////////////////////////////////////////////////
// This sets the master volume below the compressor
// RETURNS : volume
////////////////////////////////////////////////////////////////////
const setMasterVolume = volume => {
	const r = setVolume(volume)
	store.setItem('audio', { volume:r })
	setToast(`Volume ${Math.ceil(r * 100)}%`,0)
	return r
}

////////////////////////////////////////////////////////////////////
// This sets the rate of the master clock that gets transported 
// through the app in order to perform time based actions
// RETURNS : tempo
////////////////////////////////////////////////////////////////////
const setTempo = (tempo) => {
	setTimeBetween( tempo )
	const bpm = getBPM()
	setToast( `Tempo : Period set at ${tempo} milliseconds between bars<br>or ${bpm}BPM` )
	//console.log({bpm, timer, tempo})
	store.setItem('tempo', { period:tempo, bpm })
	return tempo
}

// 60,000 / BPM = one beat in milliseconds - 10 is fir fun
const setBPM = (bpm) => setTempo( 60000 / bpm  )

////////////////////////////////////////////////////////////////////
// Instruments : Load for all people!
// RETURNS : instrument name (raw)
////////////////////////////////////////////////////////////////////
const loadInstruments = async (method, callback) => people.map( async (person) => { 
	const instrument = await person[method](callback)
	setToast(`${person.name} has ${person.instrumentTitle} loaded`)
	//console.log(`${person.name} has ${instrument} loaded` )
	return instrument
})

const loadRandomInstrument = async (callback) => await loadInstruments('loadRandomInstrument', callback)
const previousInstrument = async (callback) => await loadInstruments('loadPreviousInstrument', callback)
const nextInstrument = async (callback) => await loadInstruments('loadNextInstrument', callback)
const reloadInstrument = async (callback) => await loadInstruments('reloadInstrument', callback)

const createPerson = (name,eyeColour) => {

	const duetAvailable = ui.duet
	
	// TODO: Change these per person...
	const personOptions = { 
		dots:eyeColour, 
		leftEyeIris:eyeColour, 
		rightEyeIris:eyeColour,
		// should probably use a set hue for consistency...
		hue:Math.random() * 360,
		debug:ui.debug,
		// FIXME: why is this per person? should always set per screen
		photoSensitive:ui.photoSensitive,

		instrumentPack:ui.instrumentPack,

		stereoPan:ui.stereo,

		// alternate between mesh and blobs depending on mouth
		// NB. The two above will override this behaviour
		// meshOnSing:false,
		// force draw face mesh
		// drawMesh:false,
		// force draw face blob nodes
		drawMask:ui.masks,
		// drawNodes:ui.masks,
		drawEyes:ui.eyes
	}

	// Load any saved settings for this specific user name
	const savedOptions = store.has(name) ? store.getItem(name) : {}
	const options = Object.assign ( {}, personOptions, savedOptions ) 
	
	// create a new user and load an instrument
	const person = new Person( name, audioContext, audio, options ) 
	// see if there is a stored name for the instrument...
	const instrument = savedOptions.instrument || randomInstrument()

	// the instrument has changed / loaded!
	// so show some feedback
	person.button.addEventListener( EVENT_INSTRUMENT_CHANGED, event => {
		// save it for next time
		const {detail} = event
		const cache = store.setItem(name, {instrument:detail.instrumentName })
		//console.log("External event for ",{ person, detail , cache})
		setToast( `${detail.instrument.title} Loaded` )
	})

	person.loadInstrument( instrument, instrumentName => {} )
	//console.error(name, {instrument, person, savedOptions})
	
	// if (midi && midi.outputs && midi.outputs.length > 0) 
	// {
	// 	person.setMIDI( midi.outputs[0] )
	// }
	return person
}

////////////////////////////////////////////////////////////////////
// Create / Fetch a user (we cache every new user)
////////////////////////////////////////////////////////////////////
const getPerson = (index) => {
	
	if (people[index] == undefined)
	{
		const person = createPerson( NAMES[index] , EYE_COLOURS[index] )
		people.push( person )
		return person
	} else{
		return people[index]
	}
}

const setPlayerOption = (option, value) => {
	// change the default for any new players created
	people.forEach( player => {
		player.options[option] = value
	})
}

// merges all named player options into an array
// [{ values } , { values }]
const fetchPlayerOptions = values => people.map( 
	
	player => values.reduce((accumulator, currentValue, index, array) => {	
		accumulator[currentValue] = player.options[currentValue]
		return accumulator
	}, {} )
)


// Player options
const setPlayerOptions = (values) => {
	const unique = Array.isArray(values) 

	// change the default for any new players created
	people.forEach( (player, index) => {
		// if unique is set, it means different per person
		const p = unique ? values[index] : values
		player.options = { ...player.options, ...p }
		//console.log("settings player.options", {p,unique}, {result:player.options} 
	})
}

// BEGIN ---------------------------------------

////////////////////////////////////////////////////////////////////
// start on click as things require gesture for permission
////////////////////////////////////////////////////////////////////
const enableMIDIForPerson = (personIndex=0, midiDevices=[], midiChannel=0) => {
	const person = getPerson(personIndex)
	// try and determine which port the user is expecting
	//const p = midiChannel === "all" ? 0 : midiChannel
	// select instrument
	const port = midiDevices[ personIndex < midiDevices.length ? personIndex : 0 ]
	if (port)
	{
		person.setMIDI(port, midiChannel)
		// console.log(ui.midiChannel, person.hasMIDI ? `Replacing` : `Enabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, midiDevices, personIndex, midiChannel}, midi.outputs[midiChannel])
	}else{
		console.error("No matching MIDI Instrument", ui.midiChannel, person.hasMIDI ? `Enabling` : `Disabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, portIndex: midiChannel}, midi.outputs[midiChannel])
	}
}


const updateMIDIStatus = (outputs)=>{
	const quantity = outputs.length
	if (quantity>0)
	{
		let feedback = outputs.map(midiInstrument => midiInstrument.name || "MIDI Instrument" ).join( "<br>" )
		switch(quantity)
		{
			// FIXME: 2 instruments have been connected,
			// we should send one to each instrument presumably?
			case 2:
				break;

			default:
				// w00t
				// console.error("MIDI devices",midiInstrument, midiInstrumentName, outputs)
				
				//midiButton.setText("Click to disable")
		}

		main.classList.toggle('midi-no-devices', false)
		main.classList.toggle('midi-connected', true)
		main.classList.toggle(`midi-devices-${quantity}`, true)
		main.classList.remove(`midi-unavailable`)

		// use this to fill the peoples
		people.forEach( (person,i) => enableMIDIForPerson(i, outputs, ui.midiChannel) )
		
		feedback = `MIDI Available<br>${feedback}`
				
		setToast( feedback )
		midiButton.setText("<span class='hide-text'>Click to </span>Disable")
		midiButton.setLabel(feedback)

	}else{

		// bugger - either we never had or we lost...
		setFeedback(midiAvailable ? "Lost MIDI Device connection" : "MIDI Available but no instruments detected", 0)
		setToast("No MIDI Devices connected")
		main.classList.toggle('midi-no-devices', true)
		main.classList.toggle('midi-connected', false)
	}
}

////////////////////////////////////////////////////////////////////
// this needs a user interaction to trigger
////////////////////////////////////////////////////////////////////
const enableMIDI = async () => {

	try{
		midi = await setupMIDI()
		
		// midi device connected! huzzah!
		midi.addListener("connected", (e) => updateMIDIStatus(midi.outputs) )
		
		// Reacting when a device becomes unavailable
		midi.addListener("disconnected", (e) => updateMIDIStatus(midi.outputs) )

		updateMIDIStatus(midi.outputs)

		midiAvailable = midi // && midi.outputs && midi.outputs.length > 0
		main.classList.add('midi-available')

	}catch(error){	

		// failed
		console.error("Total MIDI failure", error)
		// this needs a user interaction to trigger
		setFeedback("MIDI NOT Available<br>"+error, 0)
		main.classList.add('midi-unavailable')
		return false
	}

	return true	
}

// TODO:
const disableMIDI = () => {
	// midiButton.setText()
}

// MIDI will require a user interaction
const showMIDI = async () => {

	// to skip clicking but results in a warning
	midiButton = setupMIDIButton( 
		document.getElementById("button-midi"), 
		async (b) => {
			await enableMIDI()
			setFeedback("MIDI available<br>Connecting to instruments...", 0)
			main.classList.add('midi-activated')
			return false
		}
	)
	
	// FIXME:this is supposed to check for midi instrument somehow??!!!
	return true
}

const registerKeyboard = () => {
	let numberSequence = ""

	window.addEventListener('keydown', async (event)=>{

		const isNumber = !isNaN( parseInt(event.key) )
		switch(event.key)
		{
			case 'CapsLock':
				setState("debug", !ui.debug )
				people.forEach( person => person.debug = ui.debug )
				setToast(`DEBUG : ${ui.debug}`)
				speak( ui.debug ? "secret mode unlocked" : "disabling developer mode", true)
				break

			case 'Space':
				loadRandomInstrument() 
				break

			case 'ArrowLeft':
				previousInstrument()
				break

			case 'ArrowRight':
				nextInstrument() 
				break

			case 'QuestionMark':
			case '?':
				// read out last bit of help?
				speak(document.getElementById('toast').innerText, true)
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

			case 'a':
				kit.kick()
				break

			case 'b':
				setState("backingTrack", !ui.backingTrack )
				setToast( ui.backingTrack ? "Backing track starting" : "Ending Backing Track" )
				break
		
			case 'c':
				setState("clear", !ui.clear )
				break

			case 'd':
				kit.hat()
				break

			case 'e':
				kit.clack()
				break

			case 'f':
				toggleVisibility(document.getElementById("shared-controls") )
				break

			case 'g':
				const isVisisble = toggleVisibility(document.getElementById("feedback") )
				toggleVisibility(document.getElementById("toast") )
				ui.text = isVisisble
				break

			case 'h':
				toggleVisibility(canvas)
				break

			// Change impulse filter in the reverb
			case 'i':
				const reverb = await setReverb()
				setToast( `Reverb : '${reverb}' loaded` )
				break

			case 'j':
				toggleVisibility(video)
				break

			// kid mode / advanced mode toggle
			case 'k':
				//doc.documentElement.classList.toggle('advanced', advancedMode)
				//doc.documentElement.classList.toggle(CSS_CLASS, false)
				break

			// toggle speech
			case 'l':
				setState("speak", !ui.speak )
				setToast( ui.speak ? `Reading out instructions` : `Staying quiet` )
				break
		
			case 'm':
				setState("metronome", !ui.metronome )
				setToast( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
				break

			case 'q':
				setState("muted", !ui.muted )
				setMasterVolume( ui.muted ? 1 : 0 )
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

			case 's':
				kit.snare()
				break

			case 't':
				setState("text", !ui.text )
				break


			// Hide video
			case 'v':
				// FIXME: Also enable sync?
				toggleVisibility(video)
				break

			case 'w':
				kit.cowbell()
				break
		
			case 'x':
				// if the time since last one is too great clear?
				const tappedTempo = tapTempo()
				if (tappedTempo > 1)
				{
					setBPM(tappedTempo)
				}
				//console.log("tappedTempo",tappedTempo)
				break

			// Reset help!
			case 'z':
				counter = 0
				break
		

			// don't hijack tab you numpty!
			// FILTER
			case 'Tab':
				break

			default:
				// check if it is numerical...
				if (!isNumber)
				{
					loadRandomInstrument()
					speak("Loading random instruments",true)	
				}
		}

		// Check to see if it is a number
		if (isNumber)
		{
			numberSequence += event.key
			// now check to see if it is 3 numbers long
			if (numberSequence.length === 3)
			{
				// this is a tempo!
				const tempo = parseFloat(numberSequence)
				console.log("Setting tempo to ", tempo)

				setBPM(tempo)
				// reset
				numberSequence = ''
			}

		}else{

			numberSequence = ''
		}

		// we run this when we want to 
		addToHistory(ui, event.key)
		// console.log("key", ui, event)
	})
}



//////////////////////////////////////////////////////////////////
// This creates all the wiring 
//////////////////////////////////////////////////////////////////
const setup = async (update, settings, progressCallback) => {

	const loadTotal = 7
	let loadIndex = 0

	main.classList.add( LTD  )

	try{
		
		setFeedback("Setting things up...<br>This can take a while!")
		progressCallback(loadIndex++/loadTotal, "Setting things up...")

		if (image)
		{
			setFeedback( "Image downloaded...<br> Please wait")
			photo = await setupImage(image)
		}
		
		progressCallback(loadIndex++/loadTotal, "Looking for cameras")

		// wait for video or image to be loaded!
		if (video)
		{
			setFeedback( "Attempting to locate a camera...<br>Please click accept if you are prompted")
		
			const investigastion = await findBestCamera(store, video)
			const {videoCameraDevices} = investigastion
			camera = investigastion.camera
			cameraLoading = false

			//const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
			setFeedback( investigastion.saved ? "Found saved camera" : videoCameraDevices.length > 1 ? "Located a Camera but you can change it in Settings > Camera" : "Located front facing camera")
		
			// check to see if there are multiple cameras and we want a selector
			if (videoCameraDevices.length > 1)
			{
				setupCameraForm(videoCameraDevices, async (selected) => {
					cameraLoading = true
					camera = await loadCamera( video, selected.value, selected.label )
					cameraLoading = false
					// if successful store for next time
					store.setItem('camera', {deviceId:selected.value})
					//console.log( selected.value , "Camera selected",selected, camera)
					setToast( `Camera ${selected.label} changed`, 0 )
				})
				
				// show / hide camera button
				main.classList.toggle("multiple-cameras", true)
			}
			
			setFeedback( "Camera connected", 0 )
			progressCallback(loadIndex++/loadTotal, "Camera connected")
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
		setFeedback(`Camera could not be accessed<br><strong>${errorMessage}</strong>`, 0)
		setToast( errorMessage )
		isLoading = false
		ultimateFailure = true
		trackError('Camera Rejected or Not allowed')
		// FATAL ERROR
		return
	}

	try{
		// , { volume:r }
		const savedVolume = store.getItem('audio')
		const newVolume = savedVolume ? savedVolume.volume : 1
		audio = await setupAudio()
		
		//console.log("Initiating audio", {newVolume,savedVolume, audio})
		
		// if (instrument)
		// {
		// 	setFeedback( "Audio Available...<br>Instrument "+instrument+" Sounds downloaded", 0 )
		// }else{
		// 	setFeedback( `Audio Available. Setting volume to ${getVolume() * 100}`, 0 )
		// }
		setMasterVolume(newVolume)
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

	// This first tests for functions to exist
	if (testForMIDI())
	{
		// then we attempt to connect to it
		try{
			// rather than enabling midi directly we show a button to enable it
			const hasMIDI = await showMIDI()
			if (hasMIDI)
			{
				main.classList.add('midi')
				// setFeedback("MIDI available<br>And device(s) found", 0)
			}else{
				main.classList.add('midi','no-instrument')
				setFeedback("MIDI available<br>Connect a MIDI instrument <strong>and click the button</strong>", 0)
			}
			
		}catch(error){
			// no midi - don't show midi button
			console.log("no MIDI!", error)
			main.classList.add('no-midi')
			main.classList.add('midi-unavailable')
			setFeedback("MIDI unavailable, or no instrument connected<br>"+error, 0)
		}
		progressCallback(loadIndex++/loadTotal, "MIDI Located")

	}else{
		progressCallback(loadIndex++/loadTotal)

		main.classList.add('midi-unavailable')
		setFeedback("MIDI is not available in this browser,<br>It'll work better in Brave, Edge or Chrome", 0)
	}
	
	// const {startRecording, stopRecording} = record(stream)
	
	// set the input element to either the image or the video
	// hide the other or just set the class?

	// set the canvas to the size of the video / image
	canvas.width = inputElement.width
	canvas.height = inputElement.height

	// console.error("Tensorflow", tf)
	main.classList.add( inputElement.nodeName.toLowerCase() )
	
	// this just adds some visual onscreen tooltips to the buttons specified
	addToolTips( document.getElementById("controls") )

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

	// Ensure that the video element is always being fed data
	const shouldUpdate = () => !cameraLoading

	// FaceMesh.getUVCoords 
	// this then runs the loop if set to true
	update( inputElement === video, (predictions)=>{

		// NB. always update the counter
		counter++

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
		
		// do we clear the canvas?
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
			// FUNKY DISCO MODE...
			// switch effect type?
			const t = (counter * 0.01) % TAU
			overdraw( -7 * cameraPan.x + Math.sin(t), -4 * cameraPan.y + Math.cos(t))
		}
		

		// On BEAT if beatjustplayed
		// TODO: convert this into a per user bar and use the last played note to 
		// change the colour of the indicator
		if (ui.quantise)
		{
			// Start on BAR
			// show quantise
			// fetch notes played from user?
			drawQuantise( beatJustPlayed, getBar(), getBars() )
		}
		
		if (ui.spectrogram)
		{
			// updateByteTimeDomainData()
			// drawWaves( dataArray, bufferLength )
			
			updateByteFrequencyData()
			drawBars( dataArray, bufferLength )
		}

		let haveFacesBeenDetected = false	
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

					userLocated = true
					haveFacesBeenDetected = true
						
				}else{

					// stopAudio()
					if (!noFacesFound)
					{
						// no face found!??
						main.classList.toggle( `${person.name}-active`, false)
						main.classList.toggle( `no-faces`, true)
						noFacesFound = true

						// TODO : Switch to hand / body detection whilst faces not found?
						// TODO: Implement part switching behaviour

					}
					
					return
				}

				// first update the person
				person.update(prediction)

				// then redraw them
				// const { yaw, pitch, lipPercentage } = 
				
				// prediction, showText=true, forceRefresh=false
				person.draw(prediction, ui.text, false, beatJustPlayed)
				
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
				}
				
				// you want a tight curve
				//setFrequency( 1/4 * 261.63 + 261.63 * lipPercentage)
				tickerTape += `<br>PITCH:${prediction.pitch} ROLL:${prediction.roll} YAW:${prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
				// tickerTape += `<br>PITCH:${Math.ceil(100*prediction.pitch)} ROLL:${Math.ceil(100*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
			}

			// No face was detected on either user
			if (!haveFacesBeenDetected)
			{
				// No faces located so update help
				setFeedback( getHelp( Math.floor(counter/100) ) )
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
			// Faces found so show the next set of instructions
			setFeedback( getInstruction( Math.floor(counter/100) ))
			// setFeedback(`Look at me and open your mouth`)
		}

		if (beatJustPlayed)
		{
			beatJustPlayed = false
		}
		
		//console.log(counter, "update", {predictions, tickerTape, userLocated, cameraLoading} )

	}, shouldUpdate )


	// Metronome
	timer = startTimer( ( values )=>{
	
		const { bar, bars, 
			barsElapsed, timePassed, 
			elapsed, expected, drift, level, intervals, lag} = values
		
		// TODO: The timer is a good place to determine if the computer
		// 		 is struggling to keep up with the program so we can reduce
		// 		 the visual complexity of the ui and remove some predictions too
		// 		 in order to try and maintain decent performance

		// lag
		statistics.lag = lag
		statistics.drift = drift

		// The app has been running for over x amount of time
		if (elapsed > TIME_BEFORE_REFRESH)
		{
			// so we may want to refresh if the time is appropriate?
	

		}

		// nothing to play!
		if (ui.muted)
		{
			return
		}

		if ( ui.metronome && bars )
		{
			// TODO: change timbre for first & last stroke
			const metronomeLength = 0.1
			kit.clack( metronomeLength, bars % 4 === 0 ? 0.2 : 0.1 )
		}

		// console.log(barsElapsed, "timer", timer)
		// Play metronome!
		if(ui.quantise )
		{
			//const personParameters = []

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

				// save data to an array to record
				// personParameters.push(stuff)
			}
			
		}

		// play some accompanyment music!
		if (ui.backingTrack && bar%2 === 0 )
		{
			const kick = playNextPart( patterns.kick, kit.kick )
			const snare = playNextPart( patterns.snare, kit.snare )
			const hat = playNextPart( patterns.hat, kit.hat )

			//console.error("backing|", {kick, snare, hat })
			// todo: also MIDI beats on channel 16?
		}

		if (playing)
		{
			// timePassed
		}

		if (midiAvailable && midi)
		{
			// value=0] {number} The MIDI beat to cue to (integer between 0 and 16383).
			//midi.setSongPosition( getBarProgress() * 16383 , {})
			//midi.sendClock( )
			//console.log(midi)
		}

		beatJustPlayed = true

		
	}, timePerBar() )
} 




///////////////////////////////////////////////////////////
// simply refreshes the ui with any updated options
const refreshState = ()=>{

	Object.entries(ui).forEach(([key,value])=>{
		main.classList.toggle(`flag-${key}`, value )
	})
}

///////////////////////////////////////////////////////////
// This simply allows you to set the state of the ui
const setState = ( key, value, saveHistory=true )=>{
	ui[key] = value
	if (saveHistory)
	{
		addToHistory(ui,key)
	}
	main.classList.toggle(`flag-${key}`, value )

	// FIXME: TODO:
	// also update select for checked and things? bit more complex?
	// see if there is a matching dom element???
	// .checked
}


const load = async (settings, progressCallback) => {

	const loadTotal = 3
	let loadIndex = 0
	
	// TODO: test of loading external scripts sequentially...
	progressCallback(loadIndex++/loadTotal)

	// pick the body parts...
	let loadModel
	switch (settings.model)
	{
		case "body":
			const {loadBodyModel} = await import('./models/body')
			loadModel = loadBodyModel
			break

		// Face
		default:
			const {loadFaceModel} = await import('./models/face')
			loadModel = loadFaceModel
	}

	progressCallback(loadIndex++/loadTotal)

	// set up the instrument selctor etc
	setupInterface( ui )

	progressCallback(loadIndex++/loadTotal)

	// Connect up sone buttons?
	setToggle( "button-quantise", status =>{
		setState( 'quantise', status )
		setToast("Quantise " + (ui.quantise ? 'enabled' : 'disabled')  )
	}, ui.quantise)

	// #button-settings
	setToggle( "button-settings", status =>{ 
		setState( 'showSettings', status )
		setToast("Settings " + (status ? 'enabled' : 'disabled')  )
	}, ui.showSettings )

	// Connect up sone buttons?
	setToggle( "button-metronome", status =>{
		setState( 'metronome', status )
		setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
	}, ui.metronome )

	setToggle( "button-percussion", status =>{
		setState( 'backingTrack', status )
		setToast( ui.backingTrack ? "Backing track starting" : "Ending Backing Track" )
	}, ui.backingTrack )

	setToggle( "button-spectrogram", status =>{
		setState( 'spectrogram', status )
		setToast("Spectrogram " + (ui.spectrogram ? 'enabled' : 'disabled')  )
	}, ui.spectrogram )

	setToggle( "button-speak", status =>{
		setState( 'speak', status )
		setToast("Speaking " + (ui.speak ? 'enabled' : 'disabled')  )
	}, ui.speak )

	// Synch button
	setToggle( "button-transparent", status =>{
		// I inverted the state for UX
		setState( 'transparent', !status )
		setToast("Video Synch " + (ui.spectrogram ? 'enabled' : 'disabled')  )
	}, ui.transparent )

	// Clear canvas between frames
	setToggle( "button-clear", status =>{ 
		setState( 'clear', status )
	}, ui.clear )

	// toggle mute
	setToggle( "button-mute", status =>{ 
		setState( 'muted', !ui.muted )
		setMasterVolume( ui.muted ? 1 : 0 )
	}, ui.muted )

	let discoPreviousState
	// Special disco mode!
	setToggle( "button-disco", status =>{ 
		setState( 'masks', status )
		if (ui.masks)
		{
			ui.clear = false
			// save previous state to go back to later...
			discoPreviousState = fetchPlayerOptions(['drawMask','drawNodes','drawMesh','meshOnSing'])
			
			//console.log(ui.masks,"MTV save old state", discoPreviousState)
			// setPlayerOption("drawMesh", ui.masks)
			setPlayerOptions( {drawMask:true, drawNodes:false, drawMesh:false, meshOnSing:true})
		}else{
			ui.clear = true
			// setPlayerOption("drawNodes", ui.masks)
			//setPlayerOptions( {drawNodes:true, drawMesh:false})
			setPlayerOptions( discoPreviousState )
			//console.log(ui.masks,"MTV load old state", discoPreviousState)
			discoPreviousState = null
		}
	}, ui.muted )

	// Overlays ----
	// Face overlays... should be dropdown?
	setToggle( "button-meshes", status =>{ 
		setState( 'masks', !ui.masks )
		setPlayerOption("drawMask", ui.masks)
	}, ui.masks )

	// hide / show eye overlays
	// NB. this gets hidden in kid mode?
	setToggle( "button-eyes", status => {
		setState( 'eyes', !ui.eyes )
		setPlayerOption("drawEyes", ui.eyes)
	}, ui.eyes )

	// Show the canvas element
	setToggle( "button-overlay", status => toggleVideoVisiblity(), !isVideoVisible() )
	
	// show / hide the text
	setToggle( "button-subtitles", status => {
		setState( 'text', !ui.text )
	} )

	setButton( "button-photograph", event => {	
		// TODO: also copy to clipboard?
		// copyCanvasToClipboard()
		appendPhotographElement()
	} )

	// Button video loads random instruments for all
	setButton( "button-video", status => loadRandomInstrument() )
	
	// reset to factory defaults
	setButton( "button-reset", status =>{ 
		ui = {...defaultOptions}
		refreshState()
	})

	// setButton( "link-about", status => {
		
	// } )

	// set the master tempo
	connectSelect( 'select-tempo', option => {
		const tempo = parseInt( option.innerHTML )
		updateTempo(tempo)
		setBPM(tempo)
		// FIXME:
		// setState( 'bpm', tempo )
	} )

	connectSelect( 'select-eyes', option => {
		const items = option.value.split(",")
		const eye = convertOptionToObject(items)
		//console.log("Setting eyes", eye, {items} )
		setPlayerOptions({ 
			scleraRadius:eye.s,
			irisRadius:eye.i,
			pupilRadius:eye.p,
			eyeRatio:eye.a || 1
		 })
	} )

	// set the master sound font
	connectSelect( 'select-samples', async (option) => {
		const instrumentPack = option.value
		setPlayerOptions({ instrumentPack })
		const instrument = await reloadInstrument()
		setState( 'instrumentPack', instrumentPack )
		//console.log("Loaded sounds",{instrumentPack, instrument}, getPerson(0).options.instrumentPack )
	} )

	connectSelect( 'select-palette', option => {
		const items = option.value.split(",")
		const palette = convertOptionToObject(items)
		
		setPlayerOptions({
			saturation:palette.s,
			luminosity:palette.l,
		})
	})

	// connect the reverb selector to the reverb chooser
	connectReverbControls( async (option) => {
		if (option && option.value)
		{
			const url = option.value
			//console.log(option.value, {url, option})
			const reverb = await setReverb(url)
		}else{
			console.error(option, option.previousSibling )
		}
	})
	

	// change behviours for logo buttons
	const logoButton = document.getElementById( "link-about" )
	
	addMouseTapAndHoldEvents( logoButton )
	
	logoButton.addEventListener( MOUSE_TAP, event => {
		console.log("Logo tapped")
	} )

	logoButton.addEventListener( MOUSE_HELD, event => {
		console.log("Logo held")
	} )
	
	// this takes any existing state from the url and updates our front end
	// so that any previously saved settings show as if the user is continuing
	// their project from before - same buttons selected etc
	refreshState()

	progressCallback(loadIndex++/loadTotal)
	
	// Load tf model and wait
	return loadModel(inputElement, settings)
}

// We avoid setting feedback until part 2 of loading...
//setFeedback("Initialising...<br> Please wait")
setLoadProgress( 0, "Initialising... Please wait" )

// create our reporter for analytics
// reporter.track()
reporter = setupReporting("InterFACE")

// Progressive Web Application ---------------------------------

// allow for debug via css
body.classList.toggle("debug", ui.debug )

let installation = null
let extrasLoaded = false

const loadExtras = async ()=> {
	if (extrasLoaded)
	{
		return
	}

	extrasLoaded = true
	
	try{
		// load the share menu :)
		const sharer = await import('share-menu')
	}catch(error){
		// disable the share menu...
		body.classList.add("sharing-disabled")
	}

	
	// at any point we can now trigger the installation
	if (installation)
	{
		try{
			const destination = document.getElementById("shared-controls")
			const needsInstall = await installation( destination )		
			
			canBeInstalled = needsInstall
			
		}catch(error){

			body.classList.add("installation-unavailable")
			console.error("Install/Update issue", error)
		}
		
	}else{
		console.log("Loaded Webpage", VERSION)
	}
}


const onLoaded = async () => {

	const lookForUser = () => {

		if (!userLocated)
		{
			// change this depending on whether a face is detected
			requestAnimationFrame( lookForUser ) 
		}else{
			// change this depending on whether a face is detected
			speak("Hello! Open your mouth to begin!")
			body.classList.toggle("searching-for-user", false)
			// may as well create a user?
			return getPerson(0)
		}
	}

	body.classList.toggle("loading", false)
	body.classList.toggle("loaded", true)
	
	// monitor keyboard events
	registerKeyboard()
	
	// looking...
	// wait for the user - show some visual cues?
	body.classList.toggle("searching-for-user", true)
	
	speak("I am looking for your face")
	
	const user = await lookForUser()

	// focus app?

	// Show hackers message
	if (ui.debug)
	{
		// console.log("Loaded App", {VERSION, needsInstall, needsUpdate })
		console.log(`InterFACE Version ${VERSION} from ${referer} in ${language} used ${information.count} times, last time was ${Math.ceil(information.timeElapsedSinceLastPlay/1000)} seconds ago`, user )	
		// console.log(`Loaded App ${VERSION} ${needsInstall ? "Installable" : needsUpdate ? "Update Available" : ""}` )	
	}
}


// loop until loaded...
const loadingLoop = async () => {

	// console.log("loading", {isLoading, userLocated, cameraLoading})
	if ( isLoading )
	{ 
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


// ---------------------------------------------------------
const options = Object.assign( {}, {

	// maxFaces - The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
	maxFaces:ui.duet ? 2 : 1,
	
	// Whether to load the MediaPipe iris detection model (an additional 2.6 MB of weights). The MediaPipe iris detection model provides (1) an additional 10 keypoints outlining the irises and (2) improved eye region keypoints enabling blink detection. Defaults to true.
	shouldLoadIrisModel:true,
	
	// Minimum detection Confidence - Threshold for discarding a prediction. 
	// [0 - 1] for a face to be considered detected
    // detectionConfidence: 0.9,
    
    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    // minTrackingConfidence: 0.5

	// maxContinuousChecks - How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
	// iouThreshold - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3. A score of 0 means no overlapping faces will be detected, whereas a score closer to 1 means the model will attempt to detect completely overlapping faces.
	// scoreThreshold - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75. Increase this score in order to reduce false positives (detects fewer faces).
	// modelUrl - Optional param for specifying a custom facemesh model url or a tf.io.IOHandler object.
	// irisModelUrl - Optional param for specifying a custom iris model url or a tf.io.IOHandler object.
} )

// FIXME: Do we instantly show the user quantity screen
// and load all background elements and scripts

// now load dependencies and show progress
load(options, (progress, message) => {
	
	//console.log("Loading A Side", progress )
	setLoadProgress( progress, message )

}).then( async update =>{ 

	// Select NUMBER of players!
	setFeedback("")
	setToast("")

	// FIXME: Maybe only show if people dont do anything?
	
	// hide the loading screen but dont sdt it to loaded just yet
	body.classList.toggle("loading", false)

	// we can sneakily back ground load in some data
	// whilst the user hits the button!
	requestAnimationFrame( loadExtras )

	// now before doing anything else, let us see if the app is installed and if there is an update available...
	// TODO: Add update checks

	let timeOut = setTimeout(()=>{
		setToast( "Please select how many players you want to play" )
		timeOut = setTimeout(()=>setToast( "by clicking either button" ), 15000 )
	}, 60000 )
	

	// load completed and now we show the ui
	// for selecting regular or multi-face mode!
	try{
		
		const {players,advancedMode} = await showPlayerSelector(options)
		setState("duet",players > 1	)
		setState("advancedMode", advancedMode )
		//console.log("Duet", multiPlayer, ui.duet )

	}catch(error){
		console.error("player selection failed", error)
	}

	setFeedback("Please wait loading! This can take <strong>some</strong> time...")

	// celar timeoiut
	clearInterval( timeOut )

	body.classList.toggle("loading", true)
	
	setToast( "" )

	// load settings from store here too?
	// set up some extra options from query strings
	// any custom overrides (shouldn't be needed : use query strings)
	return setup( update, options, progress => {
		
		// console.log("Loading B Side", progress )
		setLoadProgress(progress)
	})

}).then( data => {

	// done!
	focusApp()
})
.catch( error => {

	// show an on screen error message with the codes...
	showError(error, "Try hard refresh")
})


// wait for stuff to load / be available
loadingLoop()

// Exit
window.onbeforeunload = ()=>{

	const saveSession = Object.assign({}, information, {
		lastTime:Date.now(),
		count:information.count++
	})
	store.setItem('info', saveSession)
	
	// save ui settings in cookie too?
	trackExit()
	//store.setItem(person.name, {instrument})
	setToast("bye bye!")
	setFeedback("<strong>I hope you had fun!</strong>")
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









// needs to be run early on ideally and in a seperate thread
// loads in the relevant data to determine if the app needs to be 
// updated if installed or installed if uninstalled
installOrUpdate(ui.debug).then( state => {

	//console.log( "PWA", state )
	// log,
	// previousVersion, currentVersion,
	// isInstallable, isFirstRun, isRunningAsApp, install:(), updatesAvailable, updating, updated, update:()
	
	// do stuff with this info...
	body.classList.toggle( "updates-available", state.updateAvailable )
	body.classList.toggle( "first-run", state.isFirstRun )
	body.classList.toggle( "installable", state.isInstallable )
	
	if (state.isInstallable)
	{
		// hook into button and show...
		const installButton = document.getElementById("button-install")
		installButton.addEventListener("click", async (event) => {
			
			const installed = await state.install(installButton)
			console.log( "installed", installed.success, {installed} )
			setToast( installed.success ? "Installed to HomeScreen" : "You can always install again in the future" )
		} )

		installButton.hidden = false

	}else if(state.updatesAvailable){

		// show updates button
		const updateButton = document.getElementById("button-update")
		//updateButton.hidden = false
	}
	
	//setToast( canBeInstalled ? "You can install this as an app...<br>Click install when prompted!" : "" )
	
}).catch ( error => console.error("PWA",error) )