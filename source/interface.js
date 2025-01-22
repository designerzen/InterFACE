import 'audioworklet-polyfill'

import * as EMOJI from "./models/emoji.js"
import Capabilities from './capabilities.js'

import { loadInstrumentsList } from './settings/options.instruments.js'

// import {midiLikeEvents} from './timing/rhythm'
import State, { EVENT_STATE_CHANGE, createStateFromHost, setElementCheckState } from './utils/state.js'

// TODO :lazy load
import { say, hasSpeech} from './audio/speech.js'
import { recordAudio } from './audio/record/record.audio.js'
import { canvasVideoRecorder, createVideo, encodeVideo } from './audio/record/record.video.js'
import { 
	getRecordableOutputNode,
	active, playing, 
	setupAudio,	audioContext,
	offlineAudioContext,
	setReverb,
	updateByteFrequencyData, updateByteTimeDomainData,
	bufferLength, dataArray, 
	getVolume, setVolume, getPercussionNode, 
	stopAudio
} from './audio/audio.js'

import { 
	getRandomInstrument, 
	createInstruments, 
	getFolderNameForInstrument, 
	getRandomLeadPresetIndex, 
	getRandomBasslinePresetIndex, 
	getRandomBeatsPresetIndex, 
	getRandomHarmonicLeadPresetIndex
} from './audio/sound-font-instruments'

import { createDrumkit } from './audio/drum-kit.js'
// FIXME: 
import { loadMIDIFile, loadMIDIFileThroughClient } from './audio/midi/midi-file'
// import { loadMIDIFile, loadMIDIFileThroughClient } from './audio/midi/midi-file-load'
import { saveMIDIFile, createMIDIFileFromTrack} from './audio/midi/midi-file-create'
import { COMMAND_NOTE_ON, COMMAND_NOTE_OFF } from './audio/midi/midi-commands'

// Different ways of playing sound!
// TODO: Replace with instrumentFactory
import SampleInstrument from './audio/instruments/instrument.sample.js'
// import MIDIInstrument from './audio/instruments/instrument-midi1.js'
// import OscillatorInstrument from './audio/instruments/instrument.oscillator'

// More input mechanisms (per person)
import GamePad from './hardware/gamepad'

// import {midiLikeEvents} from './timing/rhythm'
import { tapTempo, convertBPMToPeriod, now } from './timing/timing.js'
import AudioTimer from './timing/timer.audio.js'

import { playNextPart, kitSequence } from './timing/patterns.js'
	
import {
	controlPanel,
	updateTempo,
	video, isVideoVisible, toggleVideoVisiblity,  
	setupCameraForm, setupInterface,
	toggleVisibility,
	focusApp,
	buttonVideo
} from './dom/ui'

import {getThemeFromReferer, setTheme, setupThemeControls} from './theme/theme.js'

import setupDialogs from './dom/ui.dialog.js'
import { setMIDIControls, createMIDIButton } from './dom/ui.midi.js'
import { setupTempoInterface } from './dom/ui.tempo.js'
import { showPlayerSelector } from './dom/ui.player-selection.js'
import { createSVGWaveformFromData, createWaveform } from './dom/svg-waveform'

import { connectSelect, connectReverbControls, connectReverbSelector } from './dom/select.js'
import { setToggle, setPressureToggle } from './dom/toggle.js'
import { setButton, setPressureButton, setupMIDIButton } from './dom/button.js'
import { addToolTips, setToast, toggleTooltips, updateTooltipPositions } from './dom/tooltips.js'
import { setupFeedbackControls } from './dom/text.js'
import { appendPhotographElement } from './dom/photographs.js'
import { appendAudioElement} from './dom/audio-element.js'
import { connectDropZone } from './dom/drop-zone.js'
import { drawMousePressure } from './dom/mouse-pressure'
import { setupRecordings } from './dom/ui.recording.js'
import { setupVolumeInterface } from './dom/ui.volume.js'
import { toggleFullScreen } from './dom/full-screen.js'

import MusicalKeyboard from './visual/2d.keyboard'
// import Stave from './visual/2d.stave'
import { setupImage } from './visual/image'
import { setNodeCount } from './visual/2d'
import { Quanitiser } from './visual/quantise'

import { getLocationSettings, getShareLink, addToHistory, getRefererHostname } from './utils/location-handler'

// Hardware
import { ERROR_NO_CAMERAS, fetchVideoCameras, findBestCamera, loadCamera } from './hardware/camera'
import { watchMouseCoords  } from './hardware/mouse'
import { howManyHolographicDisplaysAreConnected } from './hardware/looking-glass-portrait.js'

import Person, { 
	EVENT_INSTRUMENT_CHANGED, EVENT_INSTRUMENT_LOADING,
	STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_SUSTAIN,
	STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_RELEASE,
	getRandomPresetForPerson,
	EVENT_PERSON_DEAD,
	EVENT_PERSON_BORN
 } from './person'

import { NAMES, EYE_COLOURS, DEFAULT_TENSORFLOW_OPTIONS, DEFAULT_PEOPLE_OPTIONS, MAX_CANVAS_WIDTH, getDomainDefaults } from './settings/options'

import { TAU } from "./maths/maths"

import { convertOptionToObject } from './utils/utils'
import { observeInactivity } from './utils/inactivity.js'

import { loadDisplayClass, createDisplay, restartCanvas, changeDisplay  } from './display/display-manager.js'
import { DISPLAY_TYPES } from './display/display-types.js'

import { loadMLModel } from './models/load-model'
import { setFaceLandmarkerOptions } from './models/face-landmarks.js'

import MIDIConnectionManager from './audio/midi/midi-connection-manager.js'
import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'
		
import { WebMidi } from 'webmidi'
import { createQRCode, createSVGQRCodeFromURL } from './utils/barcodes.js'

import { updateInstrumentWithPerson } from './audio/instrumentMediators/mediator.person-instrument.js'
import { updtateDrumkitWithPerson } from './audio/instrumentMediators/mediator.person-drumkit.js'
import { updateWebMIDIWithPerson } from './audio/instrumentMediators/mediator.person-webmidi.js'

import { notifyObserversThatWeblinkIsAvailable, observeWeblink } from './audio/instrumentMediators/mediator.weblink-instrument.js'

import InstrumentFactory from './audio/instrument-factory.js'

import { getRandomKickPreset, PRESETS_KICKS } from './audio/synthesizers/kick.js'
import { getRandomHihatPreset, PRESET_HIHATS } from './audio/synthesizers/hihat.js'
import { getRandomSnarePreset, PRESET_SNARES } from './audio/synthesizers/snare.js'

// Lazily loaded in load() method
// import { getInstruction, getHelp } from './models/instructions'
// import { setupReporting, track, trackError, trackExit } from './reporting'

const {DISPLAY_CANVAS_2D,DISPLAY_MEDIA_VISION_2D, DISPLAY_LOOKING_GLASS_3D, DISPLAY_WEB_GL_3D, DISPLAY_COMPOSITE} = DISPLAY_TYPES

let instance = null
class PhotoSYNTH{
	constructor( publicMethods )
	{
		const keys = Object.keys(publicMethods)
		keys.forEach( key => {
			this[key] = publicMethods[key]
		})
		// console.log("PhotoSYNTH", this)
	}
}

/**
 * This is the actual method "app" that acts as a 
 * Singleton Factory for a single instance of the PhotoSYNTH Class
 * @param {Object} defaultOptions - options to overwrite
 * @param {Function} store - state management
 * @param {Capabilities} capabilities - object to represent device specs
 * @param {?Function} midiConnectionClass - MIDI connector
 * @param {?String} language - language code
 * @param {?Function} onLoadProgress - method to call on progress
 * @returns {PhotoSYNTH} Restricted access to properties and methods
 */
export const createInterface = ( 
	defaultOptions, 
	store, 
	capabilities,
	instrumentListURIorObject,
	MIDIConnectionClasses = [],
	language = "en-GB",
	onLoadProgress = null
) => new Promise( (resolve,reject) => {

	// Enforce Singleton and return Class with public methods only
	// This allows us to load all the data upfront and then create a single
	// instance only of this class. Any subsequent instances created will return 
	// the same original instance.
	if (instance)
	{
		return resolve(instance)
	}

	// fetch some elements from the DOM
	const doc = document	// using a reference allows truncation
	const body = doc.documentElement
	const main = doc.querySelector("main")

	// Buttons + Toggles
	const buttonRecordAudio = doc.getElementById("button-record-audio")
	const buttonDiscoModeToggle = doc.getElementById("button-disco")
	const buttonClearToggle = doc.getElementById("button-clear")
	const buttonSpeakToggle = doc.getElementById("button-speak")
	const buttonMetronomeToggle = doc.getElementById("button-metronome")
	const buttonPercussion = document.getElementById("button-percussion")

	const shareCodeElement = doc.querySelector(".qr")
	const feedbackElement = doc.getElementById("feedback")


	// pop up infomation box with html content
	const setFeedback = setupFeedbackControls( feedbackElement, 42, 200, false )

	// Fix dialogs and bind them with events
	const dialogs = setupDialogs()

	let canvasElement = doc.getElementById('photosynth-canvas')

	// where we extract the face data from
	let inputElement = video // image

	// JSON object of available instruments
	let instrumentList

	// dom elements wrapped in js
	let camera
	let photo
	let audioChain

	// canvas / GL adapters for front end
	let displayType = DISPLAY_CANVAS_2D
	let display = null
	
	// lazy loaded imports
	let getInstruction, getHelp
	let textInstructionIndex = 0
	let textHelpIndex = 0
	let quantityInstructions = 0
	let quantityHelp = 0

	let hasNavigationOccurred = ('state' in window.history && window.history.state !== null)
		
	let setupReporting, track, trackError, trackExit

	// Store for gagdets, widgets and buttons
	const toggles = {}
	const selects = {}
	const buttons = {}

	// cookie data 
	// TODO: GDPR
	const information = Object.assign({
		lastTime:-1,
		count:0
	}, store.getItem('info'))

	// Allow parents to see what is happening
	const addEventListener = ( type, callback ) => main.addEventListener( type, callback )
	const dispatchEvent = ( event ) => main.dispatchEvent(event)
	const dispatchCustomEvent = ( type, details, cancelable=true ) =>	{
		dispatchEvent( new CustomEvent(type, {
			cancelable, // without that flag preventDefault doesn't work
			details
		}) )
	}

	// update progress gradually like the old flash days!
	let loadPercent = 0
	let loadProgressMediator = ( newValue, message, hideLoader )=>{
		
		if (!onLoadProgress)
		{
			return
		}

		if (loadPercent < newValue)
		{
			// loadPercent = newValue
			// lerp towards
			loadPercent = loadPercent + 0.005 //.toFixed(2)  loadPercent 
			onLoadProgress(loadPercent, message, hideLoader)
		}

		if (loadPercent < newValue)
		{
			requestAnimationFrame( e => loadProgressMediator(newValue) )
		}else{
			loadPercent = newValue
		}
	}

	// STATE -----------------------------------------------------------------
	
	const createQRCodeFromURL = async (bookmark) => {
		shareCodeElement.innerText = "" // clear existing
		// const hole = document.createElement("div")
		// const space = shareCodeElement.appendChild( hole )
		// const qrcode = await createQRCode( space, {text:bookmark} ) 
		// const qrcode = await createQRCode( shareCodeElement, {text:bookmark} ) 
		const svg = await createSVGQRCodeFromURL( {content:bookmark} ) 
		// console.info("Created QR code", {bookmark, svg}, shareCodeElement.innerHTML )
		// console.info("Created QR code", {bookmark, qrcode}, shareCodeElement.innerHTML )
		// console.info("Created QR code", {bookmark, qrcode, space, hole}, hole.innerHTML )
		shareCodeElement.innerHTML = svg
		// return qrcode
		return svg
	}

	// State management based on HTML globalThis and domain specific options and finally query string overrides
	const hostName = getRefererHostname()
	const globalOptions = Object.assign({}, globalThis._synth)
	const domainOptions = getDomainDefaults( hostName )
	const defaultOptions = { ...domainOptions, ...globalOptions }
	
	// Immediately create a QR code and add it to the screen
	// so that new users watching can continue to play at home
	const existingQueries = (new URL(location.href)).search
	const queryString = new URLSearchParams(globalOptions).toString()
	const concatenatedQueries = existingQueries.length > 0 ? `${existingQueries.toString()}&${queryString}` : queryString
	const url = new URL(location.origin+location.pathname) // location.href
	url.search =  new URLSearchParams(concatenatedQueries)
	createQRCodeFromURL(url.toString()).then( qr => {
		// console.info("URL for QRCode", {qr, url, href:url.toString()})
	})

	// State Machine & Query handler
	const stateMachine = createStateFromHost( main ) // State.getInstance()
	
	//state.setDefaults(defaultOptions)
	stateMachine.loadFromLocation(defaultOptions)

	// updates the URL with the current state (true - encoded)
	// this is useful as immediately after loading the page the URL will be the current state
	// and so can be shared to return to this exact setup
	// states.updateLocation()
	
	// Update UI - this will check all the inputs according to our state	
	// states.updateFrontEnd()
	const uiMap = new Map()
	uiMap.set("backingTrack", doc.getElementById("button-percussion") )
	uiMap.set("clear", doc.querySelector(".qr") )
	uiMap.set("disco", doc.getElementById("button-disco") )
	uiMap.set("display", doc.querySelector(".qr") )
	uiMap.set("eyes", doc.querySelector(".qr") )
	// uiMap.set("gamePad", doc.querySelector(".qr") )
	uiMap.set("gamePad", doc.querySelector(".qr") )
	uiMap.set("metronome", doc.querySelector(".qr") )
	uiMap.set("midi", doc.querySelector(".qr") )
	// uiMap.set("midiChannel", doc.querySelector(".qr") )
	// uiMap.set("model", doc.querySelector(".qr") )
	// uiMap.set("muted", doc.querySelector(".qr") )
	// uiMap.set("overlays", doc.querySelector(".qr") )
	// uiMap.set("photoSensitive", doc.querySelector(".qr") )
	// uiMap.set("players", doc.querySelector(".qr") )
	// uiMap.set("qr", doc.querySelector(".qr") )
	uiMap.set("quantise", doc.querySelector(".qr") )
	// uiMap.set("showPiano", doc.querySelector(".qr") )
	// uiMap.set("showSettings", doc.querySelector(".qr") )
	// uiMap.set("speak", doc.querySelector(".qr") )
	uiMap.set("spectrogram", doc.querySelector(".qr") )
	// uiMap.set("stats", doc.querySelector(".qr") )
	uiMap.set("stats", doc.querySelector(".qr") )
	uiMap.set("synch", doc.querySelector(".qr") )
	uiMap.set("text", doc.querySelector(".qr") )
	uiMap.set("theme", doc.querySelector(".qr") )
	uiMap.set("tooltips", doc.querySelector(".qr") )
	
	// debug
	// starSize
	// stereo
	// stereoPan

	//- window.addEventListener(EVENT_STATE_CHANGE, event => {
	//State.getInstance().addEventListener( event => {
	stateMachine.addEventListener( async (key,value) => {
		
		if (stateMachine.get("qr") && shareCodeElement)
		{
			const svg = await createQRCodeFromURL( stateMachine.asURI )
			// console.info("QR State updated", {svg, state:stateMachine.serialised} ) 
		}
		// TODO: Update GUI with the key value even if toggled manually
		// console.info("State Changed", { key,value, stateMachine } )
		// stateMachine.get()
		// associate inputs and selects with the state keys
		// const method = uiMap.get(key)
		// setElementCheckState(method, value)
	})

	

	// http://localhost:909/?display=DisplayMediaVision2D&tooltips=true&advancedMode=false&showSettings=false&showPiano=false&metronome=true&backingTrack=true&clear=false&synch=true&disco=false&overlays=true&masks=true&eyes=true&quantise=true&text=true&spectrogram=true&speak=true&debug=false&stats=false&muted=false&players=1&stereo=true&stereoPan=true&midi=true&midiChannel=all&starSize=1&autoHide=true&loadMIDIPerformance=false&gamePad=false&model=face&qr=false&theme=theme-mit&instrumentPack=OpenGM24&photoSensitive=true&automationMode=true&referer=mit&bpm=81.56038486395421
	const referer = stateMachine.get("referer")
	
	const modelOptions = Object.assign( {}, DEFAULT_TENSORFLOW_OPTIONS )

	// Record stuff
	const { 
		getRecordedDuration, 
		isRecordingAvailable, 
		isRecording, 
		startRecording, 
		stopRecording, 
		encodeRecording, 
		downloadRecording
	} = recordAudio()
	
	// collection of persons
	const people = []

	// MIDI ---
	const midiManager = new MIDIConnectionManager()

	let webMidi
	let midi
	let midiButton
	let midiDevices = []

	// MIDI File ---
	// load MIDI Track model midi track  / save midi track
	let midiPerformance
	let samplePlayer
	let midiPlayer
	let savedPerformance

	// timer (24 cycles per tick) metronome
	let clock

	// samples and synths
	let kit
	let patterns
	let recorder

	// UI elements
	let waveforms = []
	let musicalKeyboard	
	let quanitiser

	// Automation & engager for installation booth setup
	let automator
	let useAutomator = true

	// Flags
	let isLoading = true
	let isOnline = navigator ? navigator.onLine : true

	// Machine Learning Model connections
	let isPredictionEngineBusy = false
	let fetchPredictionFromEngine
	let peoplePredictions

	// As each sample is 2403 ms long, we should try and do it 
	// as a factor of that, so perhaps bars would be better than BPM?
	let hasBeatJustPlayed = false
	let ultimateFailure = false
	let noFacesFound = false
	let isPersonLocatable = false
	let quantityOfActivePeople = 0

	let isMIDIAvailable = false

	let isCameraLoading = true
	// if the user leaves the tab or removes their face from the frame
	let isUserActive = false

	let recordRequested = false
	let recordCancelRequested = false

	// for disco mode!
	const cameraPan = {x:1,y:1}

	// This allows us to determine how long the app has been running for?
	let counter = 0

	let kickTimbreOptions = PRESETS_KICKS[0]  
	let snareTimbreOptions = PRESET_SNARES[0]
	let hatTimbreOptions = PRESET_HIHATS[0]

	const setRandomDrumTimbres = () => {
		kickTimbreOptions = getRandomKickPreset()
		snareTimbreOptions = getRandomSnarePreset()
		hatTimbreOptions = getRandomHihatPreset()
		// console.info("Setting drum timbres!", 
		// 	{
		// 		kickTimbreOptions,
		// 		snareTimbreOptions,
		// 		hatTimbreOptions
		// 	}
		// )
		// only show percussion change notification if playing percussion
		if (stateMachine.get("backingTrack"))
		{
			setFeedback( `Percussion REMIX #${kickTimbreOptions.name} ${snareTimbreOptions.name} ${hatTimbreOptions.name}`, 0, 'beats' )	 
		}
	}

	// performance indicators
	const statistics = {
		lag:0, 
		drift:0
	}

	// UI ---------------------------------------------------------
	const showLoading = () => {
		body.classList.toggle("loading", true)
		main.setAttribute("aria-busy", true)
	}

	const hideLoading = () => {
		body.classList.toggle("loading", false)
		main.setAttribute("aria-busy", false)
	}

	// TODO : video or canvas copy
	// should canvas be transparent to let video bleed through?#
	// retrun true if we should copy the video output
	// onto the canvas.
	// NB. This should be only possible if we 
	// are *not* showing the video element underneith
	const shouldCopyVideoFrame = () => {
		return  stateMachine.get("clear") ? 
			false :  stateMachine.get("synch") ? 
				true : false
	}

	/**
	 * For Demonstration and automation purposes 
	 * where you want the entire app to be remote
	 * controlled, you can pass in an instance of the Automator
	 * @param {Automator} automataton 
	 * @returns Automator instance
	 */
	const setAutomator = automataton => {
		automator = automataton
		// console.log("Automator set", {useAutomator, automator} )
		return automator
	}

	/**
	 *  Vocal mode uses speech synthesis to talk the toSay string
	 * and uses the accent dictated usually by the IP output
	 * @param {String} toSay Audio phrase to repeat
	 * @param {Boolean} clear Immediately end any xisting speech
	 */
	const speak = (toSay, clear=true) => {
		if (  stateMachine.get("speak") && hasSpeech() ) 
		{
			try{
				say(toSay,clear)
			}catch(error){
				console.error("Speech Synthesis Error", error)	
			}
		}
	}

	/**
	 * Set the tool tip toast popover
	 * TODO: a version of the instructor that also reads out the messages
	 * @param {String} message - String to write
	 * @param {?Number} time - time to display for
	 */
	const setToaster = (message, time=0) => {
		speak( message,true)
		setToast(message,time)
	}


	// AUDIO --------------------------------------------------

	/**
	 * Randomise the drum patterns to create a distinct
	 * and unique style and sound 
	 */
	const setRandomDrumPattern = () => {
		patterns = kitSequence( Math.floor( 17 + Math.random() * 23 ))
		if (stateMachine.get("backingTrack"))
		{
			setFeedback( "Backing Track REMIX!", 0, 'beats' )	
		}
	} 

	// TODO: randomise the drum beat
	const changeDrumPattern = () => {

	}
	
	/**
	 * Toggle the background synthesized percussion
	 */
	const toggleBackgroundPercussion = () => {
		const isEnabled = stateMachine.toggle( 'backingTrack', buttonPercussion )
		setFeedback( isEnabled ? "Backing track starting" : "Ending Backing Track", 0, 'beats' )	
	}

	/**
	 * This sets the master volume below the compressor
	 * @param {Number} value 
	 * @returns volume
	 */
	const setMasterVolume = value => {
		const volume = setVolume(value)
		const percentage = Math.ceil(volume * 100)
		store.setItem('audio', { volume })
		// console.info("Setting volume", volume, "to", percentage + "%")
		setFeedback(`Volume ${percentage}%`,0, 'volume')
		return volume
	}

	/**
	 *  This sets the rate of the master clock that gets transported 
	 *  through the app in order to perform time based actions
	 *  Set the speed of this track by how many ticks per minute
	 *  60,000 / BPM = one beat in milliseconds
	 * @param {Number} bpm Beats per minute
	 * @returns {Number} New Tempo
	 */
	const setBPM = (bpm) => {
		clock.BPM = bpm
		stateMachine.set( 'bpm', bpm )
		setFeedback( `Tempo set to ${Math.ceil(bpm)} BPM (Period set at ${Math.ceil(clock.period)} ms between bars)`, 0, 'tempo' )
		return clock.BPM
	}

	/**
	 * Instruments : Load for all people!
	 * @param {String} method Name of method to call on Person
	 * @param {Function} callback Method to run once instruments have loaded
	 * @returns {Function} instrument name (raw)
	 */
	const loadInstrumentPreset = async (method, callback) => people.map( async (person) => { 
		const instrument = await person[method](callback)
		setFeedback(`${person.name} has ${person.instrumentTitle} loaded`, 0, 'instrument')
		//console.log(`${person.name} has ${instrument} loaded` )
		return instrument
	})

	/**
	 * Be *sure* to make these the identical same as the names in the instrument Interface
	 */
	const loadRandomInstrument = async (callback) => await loadInstrumentPreset('loadRandomPreset', callback)
	const previousInstrument = async (callback) => await loadInstrumentPreset('loadPreviousPreset', callback)
	const nextInstrument = async (callback) => await loadInstrumentPreset('loadNextPreset', callback)
	const reloadInstrument = async (callback) => await loadInstrumentPreset('reloadPreset', callback)

	/**
	 * Instantiate a Person Class and connect it up accordingly
	 * @param {Number} index Player's index
	 * @param {String} eyeColour Player's eye colour
	 * @param {?Number} personIndex -  Player number
	 * @returns {Person} Person fully wired
	 */
	const createPerson = (index, eyeColour, personIndex=0, useGamePad=false ) => {
		
		const defaultOptions = DEFAULT_PEOPLE_OPTIONS[personIndex]
	
		// TODO: load in from the URL and players
		let savedData = undefined

		const locationOptions = new URLSearchParams(window.location.search)
		const locationData = Object.fromEntries(locationOptions)
		const name = NAMES[index]
		// 
		const prefix = name + '-'
		const locationInstrument= locationData[prefix+'instrument' ]
		const locationPreset= locationData[prefix+'preset' ]
	
		// look for preset
		// console.info(personIndex+" PERSON Creating, Please check DATA", {locationData, locationOptions, locationInstrument, locationPreset} )
		// const NAMES[personIndex]

		// check URL for saved options
		// defaultPreset:this.options.defaultPreset,
		// defaultInstrument:this.options.defaultInstrument
		
		// TODO: Change these per person...
		const personOptions = { 
			
			...defaultOptions,

			dots:eyeColour, 
			leftEyeIris:eyeColour, 
			rightEyeIris:eyeColour,
			// FIXME: should probably use a set hue for consistency...
			// hue:Math.random() * 360,
			debug:stateMachine.get('debug'),
			// FIXME: why is this per person? should always set per screen
			photoSensitive:stateMachine.get('photoSensitive'),

			instrumentPack:stateMachine.get('instrumentPack'),

			stereoPan:stateMachine.get('stereo'),

			// alternate between mesh and blobs depending on mouth
			// NB. The two above will override this behaviour
			// meshOnSing:false,
			// force draw face mesh
			// drawMesh:false,
			// force draw face blob nodes
			drawMask:stateMachine.get('masks'),
			// drawNodes:ui.masks,
			drawEyes:stateMachine.get('eyes'),

			recordData:stateMachine.get('recordData'),
		}

		// Load any saved settings for this specific user name
		
		const savedOptions = store.has(name) ? store.getItem(name) : {}
		const options = Object.assign ( {}, savedOptions, personOptions ) 
		
		// Create our person with the specified options
		const person = new Person( index, options, savedData ) 

		// Events dispatched by Person :
		
		const markInstrumentProgress = (progress,instrumentName) =>{ 
			const percent = Math.ceil(progress*100)
			//setFeedback( `${instrumentName} ${Math.ceil(progress*100)} Loading` )
			if (percent < 99){
				setToast( `${instrumentName} ${percent}% Loading...` )
			}else{
				setToast( `${person.instrumentTitle} Loaded!` )
			}
		}


		// the instrument has changed / loaded so show some feedback
		person.addListener( EVENT_PERSON_BORN,  (event) => {
			const {detail} = event
			// console.info("Person has been born!", detail)
			// dispatchEvent(event)
			dispatchCustomEvent(event.type, detail)
		})
		person.addListener( EVENT_PERSON_DEAD,  (event) => {
			const {detail} = event
			// console.info("Person has died!", detail)
			// dispatchEvent(event)
			dispatchCustomEvent(event.type, detail)
		})

		person.addListener( EVENT_INSTRUMENT_LOADING, (event) => {
			const {detail} = event
			const { progress, instrumentName, instrumentPack } = detail
			markInstrumentProgress( progress, instrumentName )
			// console.info("Person preset ["+instrumentName+"] loading!", Math.floor(progress*100))
			dispatchCustomEvent(event.type, detail)
		})

		person.addListener( EVENT_INSTRUMENT_CHANGED,  (event) => {
			const {detail} = event
			const { progress, instrumentName, instrumentPack } = detail
			// save it for next time
			const cache = store.setItem(name, {instrument:instrumentName })
			//console.log("External event for ",{ person, detail , cache})
			setToast( `${person.instrumentTitle} Ready!`.toUpperCase() ) 
			// dispatchEvent(event)
			dispatchCustomEvent(event.type, detail)
		})


		// We assign certain random instruments from groups to each user
		// we want this to happen in the background
		// see if there is a stored name for the instrument...
		// FIXME: Look also in the midiPerformance for the first instrument
		let preset = locationPreset ?? 12

		if (midiPerformance)
		{
			preset = midiPerformance.instruments[0]
			// TODO: Test this is a valid GM instrument!
		}else if (locationPreset){
			// There was a location specified in the location bar 
			// TODO: I should update this to check the stateMachine really!
			preset = locationPreset
		}else{
			preset = getRandomPresetForPerson(personIndex)	
		}

		// console.info("Person created", {preset}, {person})

		// const preset = midiPerformance ? 
		// 	midiPerformance.instruments[0] : 
		// 		locationPreset ?? 
		// 		options.instrument ?? 
		// 		getRandomInstrument()

		// const preset = getFolderNameForInstrument( presetName )
		//console.error("Person created", {instrument}, {person})
		
		if (personOptions.debug)
		{
			console.info("Created Person", {midiPerformance, locationPreset, person, preset, options})
			console.info(options)
		}
		
		// console.error("Creating Person setupAudio", {person, audioContext, audioChain, offlineAudioContext, preset})
		// we need to wait for the instrument to be loaded before we can start
		// await person.setupAudio(audioContext, offlineAudioContext, audioChain)
		person.setupAudio(audioContext, audioChain, offlineAudioContext, preset).then(async()=>{
			// the above command should initalise a default sample player rendering the following line obsolete
			// person.addInstrument( new SampleInstrument(audioContext, audio, {}))
			// const presetData = person.getPresets()[0]
			
			// now assign the instrument to the person!
			person.instrument = await person.loadPreset( preset )

			// FIXME: now append this person's options to the URL
			// const personExportData = person.exportData()
			// console.error("Loaded Preset for Person", { person, personExportData, preset })
		})
		
		/*
		const bindInstrumentPanelToPerson = (personID) => {
			const panel = doc.querySelector(`.person-${personID}-panel`) 
			const togglePanelButton = panel.querySelector(`.person-${personID}-toggle-controls` )
			togglePanelButton.addEventListener("click", e => person.toggleForm() )
			panel.removeAttribute("hidden")
		}

		switch(personIndex)
		{
			// Person A - left side TOP
			case 0:
				bindInstrumentPanelToPerson("a")
				break

			// Person B - right side TOP
			case 1:
				bindInstrumentPanelToPerson("b")
				break

			// Person C - left side BOTTOM
			case 2:
				bindInstrumentPanelToPerson("c")
				break

			// Person D - right side BOTTOM
			case 3:
				bindInstrumentPanelToPerson("d")
				break
		}

		*/

		// Each Person can be also controlled via GamePad
		if (useGamePad)
		{
			const gamePad = addGamePadControlToUser( personIndex, person )	
			person.gamePad = gamePad
		}
		
		//console.error(name, {instrument, person, savedOptions})
		
		// if (midi && midi.outputs && midi.outputs.length > 0) 
		// {
		// 	person.setMIDI( midi.outputs[0] )
		// }
		return person
	}

	const getPlayers = () => people
	const getQuantityOfPlayers = () => people.length

	/**
	 * Create / Fetch a user (we cache every new user)
	 * @param {Number} index Person's at index
	 * @returns {Function} Player Class 
	 */
	const getPerson = (index) => {
		if (people[index] == undefined)
		{
			const useGamePad = stateMachine.get("gamePad") ?? false
			const person = createPerson( index, EYE_COLOURS[index], index, useGamePad )
		
			people.push( person )
			// console.log("getPerson", {person,people})
			return person
		} else{
			return people[index]
		}
	}

	/**
	 * merges all named player options into an array eg. [{ values } , { values }]
	 * @param {Array<string>} values Selective player configuration object keys
	 * @returns {Array<Boolean>} Player configuration object
	 */
	 const fetchPlayerOptions = values => people.map( 
		player => values.reduce((accumulator, currentValue, index, array) => {	
			accumulator[currentValue] = player.options[currentValue]
			return accumulator
		}, {} )
	)

	/**
	 * Set all existing player's options to the selected values 
	 * (change the default for any new players created)
	 * @param {Number} option Variable to set
	 * @param {Number} value Value to set the variable to
	 */
	const setPlayerOption = (option, value) => {
		people.forEach( player => player.options[option] = value)
	}

	/**
	 * Player options batch Update
	 * @param {Array<string>|Object} values - Selective player configuration object keys
	 */
	const setPlayerOptions = (values) => {
		const unique = Array.isArray(values) 
		// change the default for any new players created
		people.forEach( (player, index) => {
			// if unique is set, it means different per person
			const p = unique ? values[index] : values
			player.options = { ...player.options, ...p }
			//console.log("settings player.options", {p,unique}, {result:player.options} 
		})
		setFeedback("Updating player options", 0, 'person' )
	}

	// MIDI --------------------------------------------------------

	/**
	 * name: "midi_banjos.mid"
	 * size: 19444
	 * type: "audio/mid"
	 * @param {File} file - object with above meta
	 */
	const userUploadMediaFile = async (file) => {
		if (file)
		{
			// Load a MIDI file
			switch (file.type)
			{
				case "application/json":
					console.warn("Instrument Pack loading is not supported at this time")
					break

				// case "application/json":
				// 	console.warn("Instrument Pack loading is not supported at this time")
				// 	break

				case "audio/midi":
				case "audio/mid":
					const midiFile = await loadMIDIFileThroughClient( file )
					midiPerformance = midiFile
					onMIDIPerformanceAvailable(midiFile)
					return midiFile

				default:
					console.warn("Dropped file", {file} , "Ignoring as not sure how to interpret it")
			}
			return null
		}
	}




	/**
	 * Connect one person to a MIDI port
	 * NB. start on click as things require gesture for permission
	 * @param {Number} personIndex - person index (player1 is 0)
	 * @param {Array} midiDevices - 
	 * @param {Number} midiChannel - zero means all!
	 * @returns {Number} Port
	 */
	const connectMIDIForPerson = (personIndex=0, midiDevices=[], midiChannel=0) => {
		const person = getPerson(personIndex)
		// try and determine which port the user is expecting
		//const p = midiChannel === "all" ? 0 : midiChannel
		// select instrument
		const port = midiDevices[ personIndex < midiDevices.length ? personIndex : 0 ]
		if (port)
		{
			person.setMIDI(port, midiChannel)	
			//console.info(midiChannel, person.hasMIDI ? `Replacing` : `Enabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, midiDevices, personIndex, midiChannel}, midi.outputs[midiChannel])
		}else{
			console.error("No matching MIDI Instrument", midiChannel, person.hasMIDI ? `Enabling` : `Disabling` , `MIDI #${midiChannel} for ${person.name}` ,{stateMachine, port, portIndex: midiChannel} )
		}
		return port
	}

	// INTERACTIONS -----------------------------------------------------------------

	const addGamePadControlToUser = (personIndex, person) => {
		
		// see if there are any gamepads connected - let's go te whole hog!
		const gamePad = new GamePad( personIndex )
		gamePad.on( (buttonName, value) => {
			switch(buttonName)
			{
				case "disconnected":
					setToast("GamePAD Unplugged")
					break

				case "connected":
					setToast(value)
					break

				// open sidebar
				case "start": 
				case "select":	
					person.showForm() 
					break
				
				case "dup": break
				case "dright": 
					person.loadPreviousInstrument()
					break

				case "ddown": break
				case "dleft": 
					person.loadPreviousInstrument()
					break
			}
		})
		return gamePad
	}
	
	/**
	 *  Add Keyboard listeners and tie in commands
	 */
	const registerKeyboard = () => {
		let numberSequence = ""

		window.addEventListener('keydown', async (event)=>{

			const isNumber = !isNaN( parseInt(event.key) )
			const focussedElement = document.activeElement

			// Allow Tab to continue to perform its default function
			if ( event.key !== 'Tab' ){
				event.preventDefault()
			}
			
			// Contextual hotkeys - if something is focussed then different keys!
			if (focussedElement && focussedElement !== document.documentElement )
			{
				// not body!
				switch(focussedElement.nodeName)
				{
					case "BUTTON":
						// see if a sample is focussed and if so do something different
						if ( focussedElement.classList.contains("button-play-pause") ){
							// find nearest audio element?

							const audio = focussedElement.parentElement.querySelector("audio")
							const rate = isNumber ? 
								parseInt(event.key) : 
								// check to see if this is a+ or - or up or down
								event.key === 'ArrowRight' ? 
									audio.playbackRate + 0.1 :
									event.key === 'ArrowLeft' ? 
										audio.playbackRate - 0.1 :
										0.2 + Math.random() * 3

							const pitch = isNumber ? 
								parseInt(event.key) : 
								// check to see if this is a+ or - or up or down
								event.key === 'ArrowUp' ? 
									audio.detune.value + 10 :
									event.key === 'ArrowDown' ? 
										audio.detune.value - 10 :
										0.2 + Math.random() * 3

							audio.playbackRate = rate

							// value in cents
							audio.detune.value = pitch
							
							return

						}else{
							
						}
						break

					// 
					case "DIALOG":

						break
					
				}

				// we should quit here?
			}

			
			switch(event.key)
			{
				case 'CapsLock':
					const isDebug = stateMachine.toggle( "debug" )
					people.forEach( person => person.debug = isDebug )
					// speak( isDebug ? "secret mode unlocked" : "disabling developer mode", true)
					setFeedback( isDebug ? 'Debug Mode enabled' : 'Debug Mode disabled', 0, 'debug' )
					break

				case 'Del':
				case 'Delete':
					setRandomDrumTimbres()
					break

				case 'Enter':
					if (event.ctrlKey)
					{
						setFeedback( 'Press ESC to exit Full Screen', 0, 'fullscreen' )
						toggleFullScreen()
					}else{
						loadRandomInstrument() 
					}
					break

				case 'Space':
					if (event.ctrlKey)
					{
						setFeedback( 'Press ESC to exit Full Screen', 0, 'fullscreen' )
						toggleFullScreen()
					}else{
						loadRandomInstrument() 
					}
					break

				case 'QuestionMark':
				case '?':
					// read out last bit of help?
					speak(feedbackElement.textContent, true)
					break
	
				// Arrows set timing
				case 'ArrowLeft':
					setBPM( clock.BPM - ( event.shiftKey ? 10 : event.ctrlKey ? 25 : 1 ) )
					break

				case 'ArrowRight':
					setBPM( clock.BPM + ( event.shiftKey ? 10 : event.ctrlKey ? 25 : 1 ) )
					break

				case 'ArrowUp':
					if (event.ctrlKey || event.shiftKey)
					{
						clock.totalBars++
						setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')						
					}else{
						// get existing pitchbend value
						const person = getPerson(0)
						const pitchBend = person.activeInstrument.pitchOffset
						person.activeInstrument.pitchBend( pitchBend+0.5 )
						// console.log("Pitchbending UP!", getPerson(0) )
					}

					break

				// change amount of bars
				case 'ArrowDown':
					if (event.ctrlKey || event.shiftKey)
					{
						clock.totalBars--
						setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')
					}else{
						const person = getPerson(0)
						const pitchBend = person.activeInstrument.pitchOffset
						person.activeInstrument.pitchBend( pitchBend-0.5 )
					}
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
					toggleBackgroundPercussion()
					break
			
				case 'c':
					stateMachine.toggle("clear", buttonClearToggle )
					break

				case 'd':
					kit.hat()
					break

				case 'e':
					kit.clack()
					break

				case 'f':
					toggleVisibility( controlPanel )
					break

				case 'g':
					const isVisisble = toggleVisibility(document.getElementById("feedback") )
					toggleVisibility(document.getElementById("toast") )
					stateMachine.set("text", isVisisble )
					break

				case 'h':
					toggleVisibility(canvasElement)
					break

				// Change impulse filter in the reverb
				case 'i':
					const reverb = await setReverb()
					setFeedback( `Reverb : '${reverb}' loaded`, 0, 'tempo')
					break

				case 'j':
					previousInstrument()
					break

				// kid mode / advanced mode toggle
				// case 'k':
				// 	//doc.documentElement.classList.toggle('advanced', advancedMode)
				// 	//doc.documentElement.classList.toggle(CSS_CLASS, false)
				// 	break
				case 'k':
					nextInstrument() 
					break

				// toggle speech
				case 'l':
					stateMachine.toggle("speak", buttonSpeakToggle )
					setFeedback( stateMachine.get("speak") ? `Reading out instructions` : `Staying quiet`, 0, 'voice' )
					break
			
				case 'm':
					const isMetronomeEnabled = stateMachine.toggle("metronome", buttonMetronomeToggle )
					setFeedback( isMetronomeEnabled ? `Quantised enabled` : `Quantise disabled` )
					break

				case 'n':
					toggleVideoFrameCopy()
					break

				case 'o':
					if (midiPerformance){

					}
					break

				case 'p':
					if (midiPerformance){
						const commands = midiPerformance.getNextCommands()
						commands.forEach( command => {
							command.type === COMMAND_NOTE_ON ?
								samplePlayer.noteOn() : 
								samplePlayer.noteOff()
						})
						
					}
					break

				case 'q':
					// FIXME: 
					stateMachine.toggle("muted" )
					break
			
				case 'r':
					toggleRecording()
					break

				case 's':
					kit.snare()
					break

				case 't':
					stateMachine.toggle("text" )
					break

				case 'u':
					setRandomDrumPattern()
					if (event.ctrlKey)
					{
						setRandomDrumTimbres()
					}else if (event.shiftKey){
						setRandomDrumTimbres()
					}else{
						loadRandomInstrument() 
					}
					break

				// Hide video
				case 'v':
					// FIXME: Also enable sync?
					toggleVideoOutput()
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
				case 'y':
					counter = 0
					break
			

				// FIXME: Reset help!
				case 'z':
					const predictions = getPerson(0).parameterRecorder.export()
					console.log(predictions)
					break
			
				// Swutch between the various displays
				case "F1":
					event.preventDefault()
					switchDisplay( DISPLAY_CANVAS_2D, predictionLoop )
					break
				case "F2":
					event.preventDefault()
					switchDisplay( DISPLAY_MEDIA_VISION_2D, predictionLoop )
					break
				case "F3":
					event.preventDefault()
					switchDisplay( DISPLAY_WEB_GL_3D, predictionLoop )
					break
				case "F4":
					event.preventDefault()
					switchDisplay( DISPLAY_LOOKING_GLASS_3D, predictionLoop )
					break
				case "F5":
					event.preventDefault()
					switchDisplay( DISPLAY_COMPOSITE, predictionLoop )
					break

				// don't hijack tab you numpty!
				// FILTER
				case 'Tab':
					break

				default:
					// check if it is numerical...
					// or if it is a media key?
					if (!isNumber)
					{
						// loadRandomInstrument()
						// speak("Loading random instruments",true)	
					}
					console.log("Key pressed", {event,isNumber,activeElement} )
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
					setBPM(tempo)
					// reset
					numberSequence = ''
				}

			}else{

				numberSequence = ''
			}

			// we run this when we want to ???
			// addToHistory(ui, event.key)
			// console.log("key", ui, event)
		})
	}

	/**
	 * Control the "visualiser" feedback
	 * @param {Boolean} enabled 
	 */
	const setDiscoMode = (enabled=null) => {
		if (enabled === null)
		{
			enabled = !stateMachine.get("disco")
		}
		if (enabled)
		{
			setFeedback("Disco Mode UNLOCKED!",0, 'disco')
			display.nextFilter( )
		}else{
			setFeedback("Disco Mode disabled",0, 'disco')
			display.resetFilter( )
		}
		stateMachine.set("disco", enabled, buttonDiscoModeToggle )
	}

	/**
	 * 
	 * play Audio for a Person using their current face status
	 * TODO: Add WAM2
	 * @param {Person} person 
	 * @returns {Object} of metadata
	 */
	const playPersonAudio = async ( person ) => {
		
		// yaw, pitch, lipPercentage, eyeDirection
		const modelData = person.sing()
		
		// no instruments set in Person - exit now
		if( !person.instrument )
		{
			return modelData
		}

		// extract some note data
		let noteName = modelData.noteName
		let noteNumber = modelData.noteNumberForMIDI
		// let note = modelData.note
		let noteVelocity = modelData.volume
		// let noteFriendlyName = modelData.friendlyNoteName
		
		// If there is a MIDI file in memory, we can use the data to overwrite the
		// person data with the next part from the MIDI file data
		// we can have some fun here and inercept the output
		// and replace them with MIDI performance commands :P
		if ( midiPerformance && person.singing)
		{
			const command = midiPerformance.getNextNoteOnCommand()
			if (command)
			{
				//noteName = getMIDINoteNumberAsName(command.noteNumber)
				noteName = command.noteName
				noteNumber = command.noteNumber
				// to use the gate as a throttle for the velocity too...
				// noteVelocity = command.velocity * 0.01	
				noteVelocity *= command.velocity * 0.01	
				//console.log("Intercepted command via MIDI", noteName, command)
			}else{
				//console.log("No Interception available", command)
			}

			// const commands = midiPerformance.getNextCommands() || []
			// commands.forEach( command => {
				
			// 	switch(command.subtype)
			// 	{
			// 		case COMMAND_NOTE_ON:
			// 			// FIXME:
			// 			noteName = getMIDINoteNumberAsName(command.noteNumber)
			// 			noteNumber = command.noteNumber
			// 			noteVelocity = command.velocity * 0.01
			// 			// playTrack( note, 0, audioContext )
			// 			// samplePlayer.noteOn()
			// 			console.log("Person:intercept", {commands, noteName, noteNumber, noteVelocity } )
			// 			break

			// 		default:
			// 		case COMMAND_NOTE_OFF:
			// 			// playTrack( note, 0, audioContext )
			// 			// samplePlayer.noteOff()
			// 			console.log("Person:intercept ignord", command.subtype, {commands, noteName, noteNumber, noteVelocity } )
			// 			break
			// 	}
			// })
			
		}else{
			// notesPlayed.push()			
			//console.log("Person:sing", { stuff,noteName,note})
		}


		// instrument exists but no note with that name exists	
		// NB. probably still loading...	
		if (!person.instrument[ noteName ])
		{
			//console.warn("SING Exit as no note with that name exists",{noteName,stuff, person:person.instrument})
			return modelData
		}
		
		// console.log("Person:sing", { stuff,noteName,note}, person.instruments )

		// SONIFICATION
		// Make the Person SING!
		person.instruments.forEach( async (instrument) => {

			// console.log("sing", instrument.type, person.state, { instrument, person } )
			switch( instrument.type )
			{
				case "percussion":
					updtateDrumkitWithPerson( instrument, person )
					break

				default:
					updateInstrumentWithPerson( instrument, person )			
			}
		})

		// FIXME: For quick demo of webmidi
		if (webMidi)
		{
			updateWebMIDIWithPerson(person)
		}

		// update the stave with X amount of notes
		// stave.draw(stuff)
		// update the stave with X amount of notes

		if (stateMachine.get("showPiano"))
		{
			// Update visual elements
			switch(person.state)
			{
				case STATE_INSTRUMENT_SILENT:
					musicalKeyboard.noteOff( noteNumber, noteVelocity )
					break

				case STATE_INSTRUMENT_ATTACK:
					musicalKeyboard.noteOn( noteNumber, noteVelocity )
					break

				case STATE_INSTRUMENT_SUSTAIN:
					musicalKeyboard.noteOn( noteNumber, noteVelocity )
					break

				case STATE_INSTRUMENT_PITCH_BEND:
					break

				case STATE_INSTRUMENT_DECAY:
					break

				case STATE_INSTRUMENT_RELEASE:
					musicalKeyboard.noteOff( noteNumber, noteVelocity )
					break
			}	
		}
		

		//const personalSamplePlayer = person.samplePlayer

		// // FIXME: Don't play the audio directly in Person
		// // but instead extract it and pass it to the audioBus
		// // stuff.played is an array of notes
		// // update the stave with X amount of notes
		// // stave.draw(stuff)
		// // update the stave with X amount of notes
		// if (person.singing)
		// {
		// 	musicalKeyboard.noteOn( noteNumber, noteVelocity )
		// 	personalSamplePlayer && personalSamplePlayer.noteOnByName( noteName, noteVelocity )
		// 	//midiPlayer && midiPlayer.noteOn( noteNumber, noteVelocity )
		// 	// person.midiPlayer && person.midiPlayer.noteOn( noteNumber, noteVelocity )
		// 	console.log("Person wants to sing", {note, noteNumber, noteName, track, samplePlayer})
		// 	// stave.noteOn( person.lastNoteName, person.name )

		// 	//person.sendMIDI( "noteOn", noteNumber, noteVelocity )
		// }else{
		// 	// FIXME: We need to send a noteOff when the note
		// 	// changes too, rather than just letting it continue playing?
		// 	// or should we pitch bend to that key?


		// 	musicalKeyboard.noteOff( noteNumber, noteVelocity )
		// 	// FIXME: Gets sent even when not playing!
		// 	personalSamplePlayer && personalSamplePlayer.noteOff( noteNumber )
		// 	//midiPlayer && midiPlayer.noteOff( noteNumber )
		// 	//person.midiPlayer && person.midiPlayer.noteOff( noteNumber )
		// 	console.log("Person silenced", {note, noteNumber, noteName, track, samplePlayer})
		// 	// stave.noteOff( person.name )
		// 	//person.sendMIDI( "noteOff", noteNumber )
		// }
		
		return modelData
	}
	
	/**
	 * if the user has left the area, then ensure that there
	 * is no lingering audio playing
	 * @param {Person} person 
	 */
	const stopPersonAudio = async ( person ) => {
		person.instruments.forEach( async (instrument) => {
			// console.log("sing", instrument.type, person.state, { instrument, person } )
			instrument.noteOff()
		})
	}

	/**
	 * Toggle Start / Stop of the Recording
	 * with optional defering where the record
	 * start and stop occur at the start of bars
	 * only rather than immediately when requested
	 * @param {Boolean} defer 
	 */
	const toggleRecording = (defer = true) => {
		if (recordRequested)
		{
			// console.log("recordRequested")
		}
		if (recordCancelRequested)
		{
			// console.log("recordCancelRequested")
		}

		if ( (defer && recordRequested) || isRecording())
		{
			recordRequested = false
			if (defer){
				setToast("Recording Ending...")
				recordCancelRequested = true
			}else{
				setToast("Recording Ended - now encoding")
				stopRecordingAudio()
			}
			
		}else if ( (defer && !recordRequested) || !isRecording() ){
			
			if (defer){
				setToast("Recording ARMED")
				recordRequested = true
			}else{
				
				startRecordingAudio()
			}
		}else{
			// console.log("record button ignored")
		}
	}

	/**
	 * allows us to record the video stream as audio
	 * @returns  
	 */
	const startRecordingAudio = () => {

		if (!isRecordingAvailable())
		{
			// not supported on this browser
			return
		}
		
		// pipe in some data from the MASTER BUS gain node
		const recordingNode = audioContext.createMediaStreamDestination()
		const masterOutput = getRecordableOutputNode()
		masterOutput.connect(recordingNode)
		
		// empty waveform collector
		waveforms = []
		
		buttonRecordAudio.parentElement.classList.toggle("recording", true)
		
		setToast("Recording STARTED")

		startRecording(recordingNode.stream).then( recorderInstance => {
			recorder = recorderInstance 
			buttonRecordAudio.classList.toggle("progress", true)
		})
	}

	/**
	 * stop recording audio
	 */
	const stopRecordingAudio = () => {
		buttonRecordAudio.parentElement.classList.toggle("cancelling", true)
		
		stopRecording().then(recording=>{
			buttonRecordAudio.parentElement.classList.remove("recording","progress","cancelling")
	
			// get user's instrument names...tempo etc...
			const person = getPerson(0)
			const fileName = person.instrumentTitle || `Sample`
			const svg = createSVGWaveformFromData(waveforms)
			
			// first thing we do before encoding is add it to our output window
			// along with our photos and video recordings
			appendAudioElement( recording, fileName, downloadType => {
					
				//console.log("Download", downloadType, {recording})
				// variations to trigger download
				switch(downloadType)
				{
					case "ogg":
						//encodeRecording("audio", "ogg", "opus")
						downloadRecording("magnum", "audio", "ogg", "opus")
						break

					case "mp3":
						//encodeRecording("audio","mp3")
						downloadRecording("emmpeethree", "audio", "mp3")
						break

					default:
					case "wave":
						//encodeRecording( 'audio','wav')
						downloadRecording("wave","audio","wav")
						break
				}
			}, svg)

			// console.error("Recording END", {recording, ogg})
			// console.error("Recording END", {recording, mp3})
			// clear memory
			recorder = null
			setToast( `Recording Encoded!` )	
		})
	}

	/**
	 * switch display to the specifed one and destroy any existing
	 * ensuring to wipe the canvas ad recrate a new one if required
	 * @param {String} displayType 
	 */
	const switchDisplay = async (displayType, predictionLoop, saveAndExclaim=true) => {
		if (!canvasElement)
		{
			throw Error("No embedded canvas was provided")
		}
		
		if (!canvasElement.parentNode)
		{
			throw Error("No DOM canvas was provided - only an orphaned canvas element")  
		}
		
		if (display)
		{
			// console.info("DISPLAY:destroying existing", display)
			display.destroy()
			display = null
			canvasElement = await restartCanvas( canvasElement, MAX_CANVAS_WIDTH )
		}
				
		display = await createDisplay( canvasElement, displayType, stateMachine.asObject )
		display.setAnimationLoop( predictionLoop )

		// save the display type for next time
		if (saveAndExclaim)
		{
			stateMachine.set( "display", displayType )
			setFeedback('Display changed to '+displayType, 0, 'display' )
		}
		// console.info("Display Created", displayType, display) 
		return display
	}

	/**
	 * Setup the Web Camera in relation to the video element
	 * @param {VideoElement} video 
	 * @param {Function} onProgress 
	 * @returns {String} Status message
	 */
	const setupCamera = async( video, onProgress ) => {

		let investigation
		
		// attempt to get a camera that is suitable for the app
		try{

			investigation = await findBestCamera(store, video, status => {
				// console.info("Camera status", status)
				onProgress && onProgress(status)
			})

		}catch(error){
			console.error("Camera not found SHOW ERROR", error)
			return "Camera could not be accessed"
		}
		
		const quantityOfCameras =  investigation.videoCameraDevices.length
		camera = investigation.camera
		isCameraLoading = false

		const onCameraSelected = async (selected) => {
			isCameraLoading = true
			let newCamera
			try{
				newCamera = await loadCamera( video, selected.value, selected.label )
			
				// if successful store for next time
				if (newCamera)
				{
					camera = newCamera
					// save the name of the camera locally
					store.setItem('camera', {deviceId:selected.value})
					//console.log( selected.value , "Camera selected",selected, camera)
					setToast( `Camera ${selected.label} changed`, 0 )
				}else{
					// no camera?
					console.warn( selected.value , "Camera selected but could not load",selected, camera)
					throw Error( `Camera ${selected.label} changed` )
				}

			}catch(error){
				console.error("Camera:Error > ",{selected,error})
				setToast( `Camera ${selected.label} could not be accessed`, 0 )
			}
			 
			isCameraLoading = false
		}

		// show / hide camera button
		const updateCameraSelector = videoCameraDevices => {
			setupCameraForm(videoCameraDevices, onCameraSelected)
			main.classList.toggle( "multiple-cameras", videoCameraDevices.length > 1 )
		}

		// now ensure that we update the list when devices are added
		navigator.mediaDevices.ondevicechange = async (event) => {
			
			// FIXME: Sometimes software triggers updates heree where no devices
			// have been addeed or removed
			const videoCameraDevices = await fetchVideoCameras()
			updateCameraSelector( videoCameraDevices )
			console.info("New Camera Detected", {videoCameraDevices, event })
			setFeedback( `New cameras detected!`, 0, 'camera' )
		}
		
		// check to see if there are multiple cameras and we want a selector
		if ( quantityOfCameras > 1)
		{
			updateCameraSelector( investigation.videoCameraDevices )
		}

		const cameraFeedbackMessage = investigation.saved ? "Found saved camera" : quantityOfCameras > 1 ? "Located a Camera but you can change it in Settings > Camera" : "Located front facing camera"
		//const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
	
		return cameraFeedbackMessage
	}

	/**
	 * Associate file types with actions here
	 */
	const handlePWADataTypes = () => {
		// PWA file types! Check manifest and 
		// https://web.dev/file-handling/
		if (capabilities.fileHandlerAvailable) 
		{
			// The File Handling API is supported.
			launchQueue.setConsumer((launchParams) => {
				// Nothing to do when the queue is empty.
				if (!launchParams.files.length) {
					return
				}
				// load associated files
				for (const fileHandle of launchParams.files) {
					// Handle the file.
				}
			})
		}
	
	}

	// TIMING LOOPS -----------------------------------------------------------------

	// Ensure that the video element is always being fed data
	// return if camera is still connecting...
	// otherwise tensorflow will try and calculate blankness
	const shouldLoopBeAllowed = () => !isCameraLoading && !isLoading

	/**
	 * Loop 1 - triggered by a prediction becoming available
	 * Pass in the prediction from the Machine Learning
	 * Model and use it to update the app accordingly
	 * @param {Object} predictions 
	 * @returns 
	 */
	const usePredictions = predictions =>{

		// console.error("where does this loop start?")
		// NB. always update the counter
		counter++

		// If there is a attract mode supervisor
		// we update it every tick so that it can 
		// control this class automatically
		if (useAutomator && automator)
		{
			automator.tock(clock.timeElapsed, clock )
		}
	
		let tickerTape = ''
		
		const discoMode = stateMachine.get("disco")

		if (discoMode)
		{	
			// FUNKY DISCO MODE...
			// switch effect type?
			const t = (counter * 0.01) % TAU
			const discoX = -7 * cameraPan.x + Math.sin(t)
			const discoY = -4 * cameraPan.y + Math.cos(t)
			// console.info("DISCO", {t, cameraPan, discoX,discoY})
			display.postProcess({ 
				offsetX:discoX, offsetY:discoY
			})
	
			// this will change the filter
			// if (counter% 100 === 0)
			// {
			// 	display.nextFilter()
			// }
			
		}else{

			// do we clear the canvas?
			// if it is disco mode, we always want it to 
			// copy the previous frames otherwise it will
			// just look like it is janking
			// we also clear if sync is not set to true
			// as this means the video is playing behind
			// the canvas on the DOM
			if (stateMachine.get("clear") || !stateMachine.get("synch"))
			{
				// clear for invisible canvas but 
				// NB. this may cause visual disconnect
				display.clear()
			
			}else if (stateMachine.get("synch")){
				
				// paste video frame if the video is hidden
				display.drawElement( inputElement )
				// drawElement( canvasContext, inputElement )

			}else{
				// video is already showing
			}
		}
		
		// On BEAT if beatjustplayed
		// TODO: convert this into a per user bar and use the last played note to 
		// change the colour of the indicator
		if (stateMachine.get("quantise"))
		{
			// Start on BAR
			// show quantise
			// fetch notes played from user?
			const barColour = `hsl(${getPerson(0).hue },50%,50%)`
			//drawQuantise( canvasContext, beatJustPlayed, clock.bar, clock.totalBars, barColour)
			quanitiser.draw( hasBeatJustPlayed, clock.bar, clock.totalBars, barColour )
		}
		
		if (stateMachine.get("spectrogram"))
		{
			// BARS
			updateByteFrequencyData()
			display.drawVisualiser( dataArray, bufferLength )
			if (recorder)
			{
				waveforms.push(dataArray)
			}
			
			// Lines
			// updateByteTimeDomainData()
			// display.drawVisualiser( dataArray, bufferLength, "line" )
			
			// global VU
			// drawBars( canvasContext, dataArray, bufferLength )

			// updateByteTimeDomainData()
			// analyser.fftSize = 2048
			// const bufferLength = analyser.frequencyBinCount
			// const dataArray = new Uint8Array(bufferLength)
		}

		let haveFacesBeenDetected = false	
		const hasPredictions = predictions && predictions.length > 0
		
		// if (hasPredictions)
		// {
			const range = hasPredictions ? Math.max(predictions.length, people.length) : people.length
			const timeNow = now()
			// FIXME: If there are fewer people than exist, 
			// we also need to noteOff for every person

			// console.log(predictions.length, "predictions", predictions)
			// loop through all predictions...
			
			// for (let i=0, l=predictions.length; i < l; ++i)
			// for (let i=0, l=people.length; i < l; ++i)
			quantityOfActivePeople = 0
			for (let i=0, l=range; i < l; ++i)
			{
				const prediction = hasPredictions ? predictions[i] : null
				// create as many people as we need
				const person = getPerson(i)
			
				// face available!
				if (prediction)
				{
					quantityOfActivePeople++
					//if (!act)
					//main.classList.toggle("active", true)
					// playAudio()

					// reset no faces found state
					if (noFacesFound)
					{
						noFacesFound = false
						main.classList.toggle( `${person.name}-active`, true)
						main.classList.toggle( `no-faces`, false)
					}

					isPersonLocatable = true
					haveFacesBeenDetected = true

					// first update the person - this allows us to sing at will
					person.update( prediction, timeNow )
						
					// add face overlay
					if (discoMode || stateMachine.get("overlays"))
					{
						// FIXME:
						// TODO:
						// prediction, forceRefresh=false
						const colours = person.draw( prediction, false, hasBeatJustPlayed)
					
						display.drawPerson( person, hasBeatJustPlayed, colours )
	
						if (stateMachine.get("text"))
						{
							person.drawText( prediction, display ) 
						}
					}
	
					// then whenever you fancy it,
					if (!stateMachine.get("quantise") && !stateMachine.get("muted"))
					{	
						// unless quantize is turned off
						// we can "sing" in realtime
						if (person.alive)
						{
							playPersonAudio( person )
						}else{
							stopPersonAudio( person )
						}
						
						// add some visual effects to the post processor			
						if (stateMachine.get("disco") && i===0)
						{
							// use person 1's eyes to control other stuff too?
							// in this case the direction of the pan in disco mode
							cameraPan.x = prediction.eyeDirection ?? 0
							cameraPan.y = prediction.pitch ?? 1
						}
					}
						
					// you want a tight curve
					//setFrequency( 1/4 * 261.63 + 261.63 * lipPercentage)
					tickerTape += `<br>PITCH:${prediction.pitch} ROLL:${prediction.roll} YAW:${prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRatio)}%`
					// tickerTape += `<br>PITCH:${Math.ceil(100*prediction.pitch)} ROLL:${Math.ceil(100*prediction.roll)} YAW:${180*prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange/DEFAULT_OPTIONS.LIPS_RANGE)}%`
					// console.info(i, "Person "+person.name, person, prediction )
				
				}else{
					// Person exists but does not have any matching new prediction
					// so we re-use any existing while the person fades away
					// there is a user created but no prediction to drive it,
					// however the person may have started their instrument before bouncing
					if ( person.kill() )
					{
						stopPersonAudio( person )
						//console.info(i, range, "Person "+person.name+" dead", person.percentageDead * 100 + "%", prediction )
					}else{
						//console.info(i, range, "KILLING for time" + person.name, person.percentageDead * 100 + "%", person.deadForDuration * 0.001 )
					}
					
				}
			}
		// }

		// No predictions to drive the engine...
		if (!noFacesFound && !hasPredictions)
		{
			// no face found! :(
			people.forEach( person => main.classList.toggle( `${person.name}-active`, false) )
			main.classList.toggle( `no-faces`, true)
			noFacesFound = true
			// stopAudio()
			// TODO : Switch to hand / body detection whilst faces not found?
			// TODO: Implement part switching behaviour
		}

		// update if neccessary on screen now all people are drawn
		display.render()
				
		// }else{
		// 	// tickerTape += `No prediction`
		// 	// FIXME: no prediction so kill all players?
		

		// this simply forces refresh of the stave notes
		// stave.update( counter )

		// Update TEXT on screen...
		if (isRecording())
		{
			const recordedDuration = getRecordedDuration() * 0.001
			// format the time?
			const minutes = recordedDuration / 60
			const seconds = recordedDuration % 60
			const milliseconds = (seconds % 1) * 1000
			//const recordString = (minutes>>0) + ':' + (seconds>>0)
			const recordString = (minutes>>0) + ':' + (seconds>>0) + ':' + (milliseconds>>0)
			setFeedback(recordString, false)

		}else if ( !setFeedback() ){

			// FEEDBACK TEXT --------------------------------------------
			// we only want to change the instruciton set if the feedback is allowed
			let textInstruction
			// No face was detected on either user
			if (!haveFacesBeenDetected || !predictions)
			{
				// Need to show instructions to the user...
				// as no face can be detected
				textInstruction = getHelp( textHelpIndex )
				textHelpIndex = (textHelpIndex + 1) % quantityInstructions
				
				// textInstruction = getHelp( Math.floor( textHelpIndex * 0.01 ) )
				// }else if (tickerTape.length){
				// 	setFeedback(tickerTape)
				// 	// setFeedback(`PITCH:${Math.ceil(360*prediction.pitch)} ROLL:${Math.ceil(360*prediction.roll)} YAW:${Math.ceil(360 * prediction.yaw)} MOUTH:${Math.ceil(100*lipPercentage)}% - ${person.instrumentName}`)
			}else{
				// Faces found so show the next set of instructions
				textInstruction = getInstruction( textInstructionIndex ) 
				textInstructionIndex = (textInstructionIndex + 1) % quantityHelp
				
				// textInstruction = getInstruction( Math.floor( textInstructionIndex * 0.01 ) ) 
				// console.info("instructions", Math.floor( counter * 0.01 ), getInstruction( Math.floor( counter * 0.01 ) ))
				// setFeedback(`Look at me and open your mouth`)
			}
			// console.error(textInstructionIndex, "HELP UPDATED TO", textInstruction)

			setFeedback( textInstruction )
		}else{
			// something!
			// console.error("HELP IGNORED!")
		}
		

		// update the keyboard if it is available
		if (musicalKeyboard)
		{
			musicalKeyboard.redraw()
			// this is updated previously by the playPersonAudio
			// method that set's the general state of the keyboard
			display.drawElement( musicalKeyboard.canvas, 40, 40, false )
		}

		// finallyu reset this flag
		if (hasBeatJustPlayed)
		{
			hasBeatJustPlayed = false
		}

		//console.log(counter, "update", {predictions, tickerTape, userLocated, isCameraLoading} )
	}

	/**
	 * Application ANIMATION LOOP! - Rejoice!
	 * @returns 
	 */
	const predictionLoop = async ()=>{

		if (!isPredictionEngineBusy && shouldLoopBeAllowed())
		{
			// console.info("Display:Loop-RENDER")
			isPredictionEngineBusy = true
			//peoplePredictions = await fetchPredictionFromEngine()
			fetchPredictionFromEngine().then(updatedPrediction=>{
				isPredictionEngineBusy = false
			 	peoplePredictions = updatedPrediction
			})
			// isPredictionEngineBusy = false
			//usePredictions(peoplePredictions)
			
		}else{
			// Re-use the prediction from last time as the prediction engine
			// is lagging behind the animation loop
			// console.info("Display:Loop-reuse")
		}
		
		usePredictions(peoplePredictions)
		return peoplePredictions
	}

	/**
	 * Loop 2. On metronome timing events
	 * Use metronome timing events
	 * @param {Object} values 
	 * @returns 
	 */		
	const useTiming = values => {

		// console.log( clock.bpm, "PhotoSYNTH3D Clock", clock.divisionsElapsed, clock.totalDivisions, 'qn', clock.isQuarterNote, "start", clock.isAtStart, { clock, values })
		const { 
			divisionsElapsed,
			bar, bars, 
			barsElapsed, timePassed, 
			elapsed, expected, drift, level, intervals, lag
		} = values

		const isQuarterNote = clock.isQuarterNote
		const isHalfNote = clock.isHalfNote
		const isBar = clock.isAtStart

		// const isBarStart = divisionsElapsed===0
		// TODO: The timer is a good place to determine if the computer
		// 		 is struggling to keep up with the program so we can reduce
		// 		 the visual complexity of the ui and remove some predictions too
		// 		 in order to try and maintain decent performance
		
		if (recordRequested)
		{
			recordRequested = false
			startRecordingAudio()
		}
			
		if (recordCancelRequested)
		{
			recordCancelRequested = false
			stopRecordingAudio()
		}

		// If there is a attract mode supervisor
		// we update it every tick so that it can 
		// control this class automatically
		if (useAutomator && automator)
		{
			automator.tick(elapsed, clock )
		}
		
		// lag
		statistics.lag = lag
		statistics.drift = drift

		// The app has been running for over x amount of time
		// if (elapsed > TIME_BEFORE_REFRESH)
		// {
		// 	// so we may want to refresh if the time is appropriate?

		// }

		// nothing to play so we exit immediately!
		if (stateMachine.get("muted"))
		{
			return
		}

		// Play metronome!
		if ( stateMachine.get("metronome") && isBar )
		{
			// TODO: change timbre for first & last stroke
			const metronomeLength = 0.35
			// click for 3 then clack
			kit.clack(metronomeLength, bars % 4 === 0 ? 0.8 : 0.5 )
		}

		// console.log(barsElapsed, "timer", timer)

		// const notesPlayed = []
				
		// sing note and draw to canvas
		// chcek if quarternote
		if( stateMachine.get("quantise") && isHalfNote )
		{
			let shouldChangeToNextFilter = false
		
			const amountOfPeople = people.length
			for ( let i=0; i<amountOfPeople; ++i )
			{
				const person = getPerson(i)
				
				// this is a promise but we dont care how it resolves
				if (person.alive)
				{
					playPersonAudio( person )
				}else{
					stopPersonAudio( person )
				}
				// console.info("clock: person "+person.name+" alive", person.alive, person)

				// update game pads - events are caught elsewhere
				if (stateMachine.get("gamePad") && person.gamePad && person.gamePad.connected) 
				{
					person.gamePad.update()
				}
				
				// Change filter depending on the user's emoticon!
				if (stateMachine.get("disco") && person.emoticon === EMOJI.EMOJI_KISS)
				{
					shouldChangeToNextFilter = true
				}
							
					
				// use person 1's eyes to control other stuff too?
				// in this case the direction of the pan in disco mode
				if (i===0)
				{
					// stuff.eyeDirection
					cameraPan.x = person.eyeDirection ?? 0
				}

				// use last persons
				if (i===amountOfPeople-1)
				{
					cameraPan.y = person.pitch ?? 1
				}

				// save data to an array to record
				// personParameters.push(stuff)
			}
			shouldChangeToNextFilter && display.nextFilter()
		}
	
		// to add swing to the beats
		// easeOutQuart(divisionsElapsed%16 / 16)

		// play some accompanyment music on every note
		// (as we use 16 divisions for quarter notes)
		// FIXME: Just expand the patterns with longer gaps
		// a swing of one will offset every second beat
		//const swing = 1
		if ( stateMachine.get("backingTrack") && isQuarterNote)
		{
			// console.log("clock", {divisionsElapsed,
			// 	bar, bars, 
			// 	barsElapsed,})

			const slower = Math.floor( clock.BPM * 0.0005 ) + 1
			if ( divisionsElapsed % slower === 0 )
			{
				//console.log(slower,barsElapsed, clock.BPM * 0.001,  divisionsElapsed % slower )
				const kick = playNextPart( patterns.kick, kit.kick, kickTimbreOptions )
				const snare = playNextPart( patterns.snare, kit.snare, snareTimbreOptions )
				const hat = playNextPart( patterns.hat, kit.hat, hatTimbreOptions )
			}
			//console.error("backing|", {kick, snare, hat })
			// todo: also MIDI beats on channel 16?
		}

		// if (playing)
		// {
		// timePassed
		// }

		// Send MIDI clock
		if (isMIDIAvailable && webMidi)
		{
			// value=0] {number} The MIDI beat to cue to (integer between 0 and 16383).
			//midi.setSongPosition( clock.barProgress * 16383 , {})
			//console.log(midi)
			// const MIDIoutput = WebMidi.outputs[0]
			// SEND OUT Midi to every device
			WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.sendClock() )
		}

		// we can actually play a midi file here as an accompanying voice!
		if (midiPerformance)
		{
			/*
			const commands = midiPerformance.getNextCommands() || []
			commands.forEach( command => {
				
				console.log("MIDI Command",command.toString() )
			
				switch(command.type)
				{
					case COMMAND_NOTE_ON:
						// playTrack( audioContext, note, 0 )
						//samplePlayer.noteOn()
						break

					case COMMAND_NOTE_OFF:
						// playTrack( audioContext, note, 0, )
						//samplePlayer.noteOff()
						break
				}
			})
			*/
		}

		hasBeatJustPlayed = true
	}

	/**
	 * Watches for user activity and toggles the user-active class
	 */
	const watchForUserActivity = () => {
		const buttonVideo = document.getElementById("button-video")
		
		function onActive(){
			if ( stateMachine.get("autoHide"))
			{
				body.classList.toggle("user-active", true)
				body.classList.toggle("user-inactive", false)
			}
			isUserActive = true
			people.forEach( player => player.isUserActive = true)
			// console.info("user active autohide", stateMachine.get("autoHide"))
		}

		function onInactive(){
			if ( stateMachine.get("autoHide"))
			{
				body.classList.toggle("user-active", false)
				body.classList.toggle("user-inactive", true)
			}
			isUserActive = false
			people.forEach( player => player.isUserActive = false)
			// setFeedback("Goodbye!", 0, 'person' )
			// console.info("user inactive autohide", stateMachine.get("autoHide"))
		}

		observeInactivity( 
			buttonVideo,
			onActive,
			onInactive,
			4000, 
			true
		)
	}

	/**
	 * Wires up all of the individual parts of the app and returns a method
	 * to begin the actual application
	 * @param {Function} fetchPredictions Method to call when face moves
	 * @param {Object} settings App Settings Object
	 * @param {Function} progressCallback Method to progressivley call during setup procedure
	 * @returns {Function} start() method
	*/
	const setup = async (fetchPredictions, settings, progressCallback) => {

		const loadTotal = 9
		let loadIndex = 0

		if (!stateMachine.get("debug"))
		{
			doc.querySelector("label[for='select-display']").hidden = true
		}

		// DISPLAY --------------------------------------------------------------------------------

		let initialDisplay = DISPLAY_TYPES.DISPLAY_WEB_GL_3D

		progressCallback( 0, "Checking displays..." )

		const holographicDisplayQuantity = await howManyHolographicDisplaysAreConnected()
		if (holographicDisplayQuantity > 0)
		{
			initialDisplay = DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D
			setFeedback("PhotoSYNTH "+holographicDisplayQuantity+" Holographic Screens detected!", 0, 'display' )
			progressCallback(loadIndex++/loadTotal, "Holographic Display Discovered!")

			// show the 3D option to allow for holographic display selection
			const option = document.querySelector('option[value="DISPLAY_LOOKING_GLASS_3D"]')
			if (option){

				option.hidden = false
				option.selected = true
			}
		}else{
			progressCallback(loadIndex++/loadTotal, "Display Initisalising")
		}

		// console.info("PhotoSYNTH Screens available", {initialDisplay, settings} ) 

		// MUSICAL INSTRUMENTS --------------------------------------------------------------------------------
		const instrumentFactory = new InstrumentFactory(audioContext)
		try{
			
			instrumentFactory.loadList(instrumentListURIorObject)
			instrumentList = instrumentFactory.list
			progressCallback(loadIndex++/loadTotal, "Loaded Instrument List")
			console.info("PhotoSYNTH Instruments Available", {instrumentList, instrumentFactory, instrumentListURIorObject} )  
			
		}catch(error){

			progressCallback(loadIndex++/loadTotal, "Instrument List Not Found!")
			console.error("PhotoSYNTH Instruments Unavailable", error, {instrumentListURIorObject})	
		}
		
		// MOTION TRACKING --------------------------------------------------------------------------------

		fetchPredictionFromEngine = fetchPredictions
		
		body.classList.toggle("initialising", true)
		
		// VIDEO STREAM / CAMERA -----------------------------------------
		try{
			
			setFeedback("Setting things up...<br>This can take a while!")
			
			progressCallback(loadIndex++/loadTotal, "Looking for cameras")

			// VIDEO ----------------------------------------------
			if (video)
			{	
				// Camera -----------------------------------------
				setFeedback( "Attempting to locate a camera...<br>Please click accept if you are prompted", 0, 'camera')
				progressCallback(loadIndex/loadTotal,"Found cameras..." )

				const cameraFeedbackMessage = await setupCamera( video, status =>{
					progressCallback(loadIndex/loadTotal, status )
				})  

				setFeedback( cameraFeedbackMessage, 0, 'camera' )
				progressCallback(loadIndex/loadTotal, cameraFeedbackMessage)

				/*
				const {videoCameraDevices} = investigation
				camera = investigation.camera
				isCameraLoading = false

				const cameraFeedbackMessage = investigation.saved ? "Found saved camera" : videoCameraDevices.length > 1 ? "Located a Camera but you can change it in Settings > Camera" : "Located front facing camera"
				//const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
				// setFeedback( cameraFeedbackMessage )
		
				const onCameraSelected = async (selected) => {
					isCameraLoading = true
					camera = await loadCamera( video, selected.value, selected.label )
					isCameraLoading = false
					// if successful store for next time
					store.setItem('camera', {deviceId:selected.value})
					console.log( selected.value , "Camera selected",selected, camera)
					setToast( `Camera ${selected.label} changed`, 0 )
				}

				// check to see if there are multiple cameras and we want a selector
				if (videoCameraDevices.length > 1)
				{
					setupCameraForm(videoCameraDevices,onCameraSelected)
					// show / hide camera button
					main.classList.toggle("multiple-cameras", true)
				}

				// now ensure that we update the list when devices are added
				navigator.mediaDevices.ondevicechange = async (event) => {
					const videoCameraDevices = await fetchVideoCameras()
					console.info("New Camera Detected", {videoCameraDevices})
					setupCameraForm(videoCameraDevices, onCameraSelected)
					main.classList.toggle( "multiple-cameras", videoCameraDevices.length > 1 )
					setToast( `New cameras detected!`, 0 )
				}*/
				
				//setFeedback( "Camera connected", 0 )
				progressCallback(loadIndex++/loadTotal, "Camera connected")
			}
			
			// at this point the video dimensions are accurate
			// so we add the main style vars
			main.style.setProperty('--width', video.width )
			main.style.setProperty('--height', video.height )
			main.classList.toggle('landscape', video.width > video.height )
			main.classList.toggle('portrait', video.width < video.height )
			main.classList.toggle('square', video.width === video.height )
			
			progressCallback(loadIndex++/loadTotal)

		}catch(error){

			// NotAllowedError: Permission denied
			let errorReason
			let errorMessage

			switch(error)
			{
				case ERROR_NO_CAMERAS:
					errorMessage = `Could not find any video cameras on this device<br>
									<strong>${errorReason}</strong>`

					errorReason = String(error).replace("NotAllowedError: ",'')
					
					setFeedback(errorMessage, 0, 'camera')
					break

				default:
					errorMessage = `Camera could not be accessed<br>
									<strong>${errorReason}</strong>`

					errorReason = String(error).replace("NotAllowedError: ",'')
					
					setFeedback(errorMessage, 0, 'camera')
			}
						
			setToast( errorReason )

			progressCallback(loadIndex++/loadTotal, errorReason )
			isLoading = false

			ultimateFailure = true
			trackError && trackError('Camera Rejected or Not allowed')
			// FATAL ERROR
			return reject( errorReason )
		}
		
		// MIDI ---------------------------------------------------------------
		// FIXME: Hangs here on certain devices....
		if (capabilities.webMIDIAvailable)
		{
			// This occassionaly breaks for no reason that can be tracked
			try{
				// FIXME: use the midi manager
				webMidi = await WebMidi.enable({sysex:false, software:true })
				// Inputs
				WebMidi.inputs.forEach(input => console.log("MIDI INPUT", input.manufacturer, input.name))
				// Outputs
				WebMidi.outputs.forEach(output => console.log("MIDI OUTPUT", output.manufacturer, output.name))

			}catch(error){

				console.error("WebMidi is available but a connection cannot be established", error)
			}
		}

		// TIMING ----------------------------------------------------------------------
		try{
			// NB. at this point we have access to the user events
			// 		so can create things that depend on audio context
			clock = new AudioTimer( audioContext )
			clock.BPM = stateMachine.get('bpm') ?? 90

			console.info("AudioTimer ["+stateMachine.get('bpm')+" BPM] created @", clock.BPM,  clock )

			// connect the tempo interface
			setupTempoInterface(clock, null, null, v =>{
				// console.log("tempo changed for gui",v, clock )
				stateMachine.set( 'bpm',  clock.BPM )
				setFeedback( `Tempo set to ${Math.ceil(clock.BPM)} BPM`, 0, 'tempo' )
			})

		}catch(error){
			console.error('Error initialising audio clock', error)
		}
		
		// VOLUME --------------------------------------------------------------------------------
		try{
			audioChain = await setupAudio()
			
			// audio worklet tests!
			// NB. run only once per app to load  audio
			//await registerAudioWorklets( audioContext )
			
			// // Run this in instrument.worklet
			// const processor = new AudioWorkletNode(audioContext, "interface-processor")
			// // receive message
			// processor.port.onmessage = (event) => {
			// 	// Handling data from the processor.
			// 	console.log(event.data)
			// }

			// // send message
			// processor.port.postMessage('Hello!')
			// processor.connect( audioContext.destination )
			

			// console.error({instrumentDictionary})
			
			// // load a specific instrumentPack?
			// await loadInstrumentDataPack()
			// //console.log("Initiating audio", {newVolume,savedVolume, audio})
			
			// if (instrument)
			// {
			// 	setFeedback( "Audio Available...<br>Instrument "+instrument+" Sounds downloaded", 0 )
			// }else{
			// 	setFeedback( `Audio Available. Setting volume to ${getVolume() * 100}`, 0 )
			// }
			
			progressCallback(loadIndex++/loadTotal)

			// not neccessary if using Person
			// instrument = await loadInstrument( randomInstrument() )
			// const instrumentName = await loadRandomInstrument()
			// // now you can play any of the objects keys with
			// // playTrack( audioContext,  instrument[ INSTRUMENT_NAMES[0] ], 0)
			// //playTrack( audioContext, instrument.A0, 0)
			// setFeedback( instrumentName.name + " Samples available...<br>Instrument Sounds downloaded")
			
			kit = createDrumkit( audioContext, getPercussionNode() )
			patterns = kitSequence()

			// console.log("Streamin", {video, photo, camera} )
			progressCallback(loadIndex++/loadTotal, "Audio available...<br>Instrument Sounds ready" )

		}catch(error){

			ultimateFailure = true
			setFeedback("Something went wrong connecting to the Audio<br>"+error, 0, 'audio')
			return 
		}

		// setup the volume and turn up the amp
		const onVolumeChanged = vol => {
			setMasterVolume( vol )
		}

		const volume = (store.getItem('audio') ? parseFloat(store.getItem('audio').volume) : 1 ) || 1
		setVolume( volume )

		const {	
			setVisualVolumeLevel, 
			toggleMute 
		} = setupVolumeInterface( volume, false, onVolumeChanged ) 

		progressCallback(loadIndex/loadTotal, "Volume set to "+Math.ceil(volume*100)+"%")

		// const {startRecording, stopRecording} = record(stream)
		

		// AUDIO ------------------------------------------------	

		// Create a new sample player to handle sample sound playback external
		// to each Person. This is used for example to play orchestrated background MIDI
		samplePlayer = new SampleInstrument(audioContext, audioChain, {})


		// MIDI --------------------------------------------------------------

		// Load any previous performances...
		if (stateMachine.get("loadMIDIPerformance"))
		{
			progressCallback(loadIndex/loadTotal,"Loading MIDI Performance")
			try{
				midiPerformance = await loadMIDIFile( "./assets/audio/midi_nyan-cat.mid" )
				// console.error("MIDIFILE", midiPerformance)
				onMIDIPerformanceAvailable( midiPerformance )
			}catch(error){
				// console.error("MIDIFILE", error)
				setFeedback(error, 0, 'midi')
			}
		}
		
		// FIXME: ONLY Use webmidi?
		// This first tests for functions to exist
		if (stateMachine.get("midi") && midiManager.available)
		{
			// then we attempt to connect to it
			try{
				const MIDIConnectionClasses = [WebMIDIClass]
			
				// rather than enabling midi directly we show a button to enable it
				const hasMIDI = await setMIDIControls( midiManager, MIDIConnectionClasses, people, setFeedback )
				
				console.info("MIDIManager", {hasMIDI,midiManager})
			
				if (hasMIDI)
				{
					main.classList.add('midi')
					// setFeedback("MIDI available<br>And device(s) found", 0)
				}else{
					main.classList.add('midi','no-instrument')
					setToast("MIDI available<br>Connect a MIDI instrument <strong>and click the button</strong>", 0)
				}
				
			}catch(error){

				// no midi - don't show midi button
				console.log("no MIDI!", error)
				main.classList.add('no-midi')
				main.classList.add('midi-unavailable')
				setToast("MIDI unavailable, or no instrument connected<br>"+error, 0)
			}
			progressCallback(loadIndex++/loadTotal, "MIDI Located")

		}else{

			progressCallback(loadIndex++/loadTotal)
			main.classList.add('midi-unavailable')
			setToast("MIDI is not available in this browser,<br>It'll work better in Brave, Edge or Chrome", 0)
		}
	

		// PAW Integration
		handlePWADataTypes()

		// DOM UI ------------------------------------------------
		if (stateMachine.get("showPiano"))
		{
			// this draws a 2d keyboard on screen at the specified position and dimensions
			musicalKeyboard = new MusicalKeyboard( 500, 120, 8 )
		}
		
		// Add some scales on the side
		// FIXME: Do this per PERSON
		// FIRMEL canvasContext does not align
		const quantiserCanvas = document.createElement("canvas")
		const quantiserCanvasContext = quantiserCanvas.getContext("2d")
		quantiserCanvas.id="quantiser-canvas"
		quantiserCanvas.className = "quantiser-canvas"
		quanitiser = new Quanitiser( quantiserCanvasContext )


		// Add tooltips to buttons if set in options
		if (stateMachine.get("tooltips"))
		{
			// this just adds some visual onscreen tooltips to the buttons specified
			// addToolTips( controlPanel)
			// instead we can disable / enable
			toggleTooltips( stateMachine.get("tooltips") )
		}
		
		// remove loading flag as we now have all of our assets!
		// TODO: create and position the stave?
		// const stave = new Stave( canvasElement, 0, 0, true )
		// adds "video" or "image" to main
		main.classList.add( inputElement.nodeName.toLowerCase() )
		body.classList.toggle("initialising", false)
		


		/**
		 * BEGIN ---------------------------------------------------------
		 */
		const start = async() => {
			//console.log("PhotoSYNTH3D STARTING", {options: modelOptions, clock })
			// console.info("App running", {display, predictionLoop, clock})

			// Fetch the predictions in a predictable loop as fast as we need
			// NB. the display itself should return duplicate frame if a new frame
			// hasn't occurred yet
			// await fetchPrediction( automaticRepeat,usePredictions )
			clock.setCallback( useTiming )

			// VIDEO & DISPLAY ------------------------------------------------
			displayType = stateMachine.get('display') ?? initialDisplay ?? DISPLAY_MEDIA_VISION_2D // DISPLAY_WEB_GL_3D
			progressCallback(loadIndex++/loadTotal, "Loading display " + displayType)

			// REDRAW DOM / CANVAS / WEB GL -------------------------------
			// 'predictionLoop' here is a method passed into this function that is called
			// on every frame to update the visuals and audio of none quanitsed sounds
			switchDisplay( displayType, predictionLoop, false )

			progressCallback(loadIndex/loadTotal, "Loading Complete!") 

			// there is a background loop waiting for this to be set
			// so that we can show the next app parts  
			isLoading = false
			
			// Start audio clock metronome
			clock.startTimer()		

			return true
		}
	
		if (stateMachine.get("debug"))
		{
			console.info("PhotoSynth 3D - DEBUG")
			console.info("PhotoSynth Dependents Loaded", start, loadIndex, loadTotal)
		}else{
			console.info(
				"%c ",
				`line-height:44px;padding-block:22px;padding-left:44px;background-repeat:no-repeat;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' width='44' height='44' clip-rule='evenodd' viewBox='0 0 3018 2502'%3E%3Cdefs%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 636.628h3017.661v1865.214H.001z'%3E%3C/path%3E%3Cpath fill='%23000' fill-rule='nonzero' d='M3017.65 0H1975.12v636.629h288.113V348.516h754.417V0z'%3E%3C/path%3E%3Cpath fill='%23fff' fill-rule='nonzero' d='M1508.82 2035.531c-257.53 0-466.296-208.78-466.296-466.292 0-257.55 208.767-466.317 466.296-466.317 257.538 0 466.3 208.767 466.3 466.317 0 257.513-208.762 466.292-466.3 466.292m466.3-1398.905V976.15c-128.341-101.05-290.279-161.342-466.3-161.342-416.642 0-754.421 337.767-754.421 754.43 0 416.642 337.779 754.417 754.421 754.417 416.65 0 754.417-337.775 754.417-754.417V636.626H1975.12z'%3E%3C/path%3E%3C/svg%3E")`
			)
			// console.info("PhotoSynth 3D")
			console.info("PhotoSynth Dependents Loaded", start, loadIndex, loadTotal)
		}

		if (!start)
		{
			throw Error("Total failure")
		}
		
		return start
	} 

	/**
	 * Bind all gadgets and selectors to actions
	 * @param {Object} settings 
	 * @param {Function} progressCallback 
	 */
	const setupInterfaceUI = (settings, progressCallback) => {

		// you can toggle any checkbox like...
		// toggles.quantise.setAttribute('checked', value)

		// Connect up some latchedtoggles
		toggles.quantise = setToggle( "button-quantise", status =>{
			stateMachine.set( 'quantise', status )
			setFeedback("Quantise " + (stateMachine.get( 'quantise') ? 'Enabled' : 'Disabled'), 0, stateMachine.get( 'quantise') ? 'quantised' : 'unquantised'  )
		}, stateMachine.get( 'quantise') )
		
		// #button-settings
		toggles.settings = setToggle( "button-settings", status =>{ 
			stateMachine.set( 'showSettings', status )
			setFeedback("Settings " + (status ? 'enabled' : 'disabled'), 0 )
		}, stateMachine.get( 'showSettings') )
		
		/*
		toggles.midiMenu = setToggle( "button-midi-menu", status =>{ 
			// stateMachine.set( 'showSettings', status )
			setToast("MIDI Menu " + (status ? 'enabled' : 'disabled')  )
		}, stateMachine.get( 'showSettings') )
		*/

		// Connect up sone buttons?
		toggles.metronome = setToggle( "button-metronome", status =>{
			stateMachine.set( 'metronome', status )
			setFeedback("Metronome " + (status ? 'enabled' : 'disabled'), 0, status ? 'metronome' : 'silence'  )
		}, stateMachine.get( 'metronome') )


		toggles.backingTrack = setToggle( "button-percussion", status =>{
			// change drums!
			setRandomDrumPattern()
			stateMachine.set( 'backingTrack', status )
			setFeedback( status ? "Backing track starting" : "Ending Backing Track", 0, status ? 'beats' : 'silence' )
		}, stateMachine.get( 'backingTrack') )


		toggles.spectrogram = setToggle( "button-spectrogram", status =>{
			stateMachine.set( 'spectrogram', status )
			setFeedback("Spectrogram " + (status ? 'enabled' : 'disabled'), 0  )
		}, stateMachine.get( 'spectrogram') )

		toggles.speak = setToggle( "button-speak", status =>{
			kit.cowbell()
			stateMachine.set( 'speak', status )
			setFeedback("Speaking " + (status ? 'enabled' : 'disabled'), 0  )
		}, stateMachine.get( 'speak') )

		// Synch button
		// draw video onto canvas every frame (transparent doesn't have to be true then)
		toggles.synch = setToggle( "button-sync-video", status =>{
			// I inverted the state for UX
			stateMachine.set( 'synch', !status )
			setFeedback( status ? `Video Frame Synching enabled` : 'disabled Frame Synch', 0 ) 
		}, stateMachine.get( 'synch') )

		// Clear canvas between frames
		// NB. 	there are 2 modes - video frame copy 
		// 		transparent canvas with video beneath
		toggles.clear = setToggle( "button-clear", status =>{ 
			const flag = stateMachine.toggle( 'clear' )
			setFeedback( flag ? "Hiding video enabled" : 'Hiding video disabled', 0 ) 
		}, stateMachine.get( 'clear') )

		// toggle mute
		toggles.muted = setToggle( "button-mute", status =>{ 
			stateMachine.set( 'muted', status )
			setFeedback( status ? 'Volume Muted' : 'Unmuted', 0,  status ? 'muted' : 'unmuted' )
		}, stateMachine.get( 'muted') )

		// FIXME: This does not work after refresh
		// let discoPreviousState
		// MTV : Special disco mode!
		toggles.disco = setToggle( "button-disco", status =>{ 
			setDiscoMode(status )
			/*stateMachine.set( 'masks', status )
			if (status)
			{
				// ENABLE disco mode
				// stateMachine.set( 'clear', false )
				ui.clear = false
				
				// save previous state to go back to later...
				discoPreviousState = fetchPlayerOptions(['drawMask','drawNodes','drawMesh','meshOnSing'])
				
				//console.log(ui.masks,"MTV save old state", discoPreviousState)
				// setPlayerOption("drawMesh", ui.masks)
				setPlayerOptions( {drawMask:true, drawNodes:false, drawMesh:false, meshOnSing:true})
				
			}else{
				// stateMachine.set( 'clear', true )
				ui.clear = true
				// setPlayerOption("drawNodes", ui.masks)
				//setPlayerOptions( {drawNodes:true, drawMesh:false})
				setPlayerOptions( discoPreviousState )
				//console.log(ui.masks,"MTV load old state", discoPreviousState)
				discoPreviousState = null
			}*/
		}, stateMachine.get( 'disco') )

		// Overlays ----
		
			// toggleVideoVisiblity( !isVideoVisible() )

		// All person  overlays... should be dropdown?
		// Show / hide the face and stuff
		toggles.overlay = setToggle( "button-overlay", status => { 
			stateMachine.toggle( 'overlays' )
		}, stateMachine.get( 'overlays') )

		// Face meshes
		toggles.masks = setToggle( "button-meshes", status =>{ 
			const flag = stateMachine.toggle( 'masks' )
			setPlayerOption("drawMask", flag )
		}, stateMachine.get( 'masks') )

		// hide / show eye overlays
		// NB. this gets hidden in kid mode?
		toggles.eyes = setToggle( "button-eyes", status => {
			const flag = stateMachine.toggle( 'eyes' )
			setPlayerOption("drawEyes", flag )
			// setFeedback( flag ? 'Googly eyes' : 'Unmuted', 0,  status ? 'muted' : 'unmuted' )
		}, stateMachine.get( 'eyes') )

		// show / hide the text
		toggles.text = setToggle( "button-subtitles", status => {
			stateMachine.toggle( 'text' )
		} )

		toggles.automator = setToggle( "button-automate", status =>{
			stateMachine.toggle( 'automationMode' ) 
			setFeedback( status ? 'Demo mode with automation' : 'Freestyle mode', 0 )
		})
	
		toggles.advancedMode = setToggle( "button-toggle-advanced", status =>{
			stateMachine.toggle( 'advancedMode' ) 
			setFeedback( status ? 'Advanced' : 'Basic', 0 )
		})
	

		// TODO : Set some up with double functions if held
		// Recording bars by holding...
		// toggles.recordAudio = setToggle( "button-record-audio", 
		toggles.recordAudio = setPressureToggle( 
			"button-record-audio",
			tap =>{ 
				drawMousePressure( 1, stateMachine.get('mouseHoldDuration') )
				toggleRecording( false )
			},
			hold =>{ 
				drawMousePressure( 1, stateMachine.get('mouseHoldDuration') )
				toggleRecording( true )
			},
			holding => drawMousePressure( holding, stateMachine.get('mouseHoldDuration') ),
			false 
		)

		//console.error("toggles", toggles)
		buttons.takePhotograph = setButton( "button-photograph", event => {	
			// TODO: also copy to clipboard?
			// copyCanvasToClipboard()
			appendPhotographElement( display.canvas )
			setFeedback('Photograph taken!', 0 )
			kit.cowbell()
		} )
	
		// reset to factory defaults
		buttons.resetSettings = setButton( "button-reset", status =>{ 
			stateMachine.reset()
		})

		// Button video loads random instruments for all players at the same time
		buttons.video = setButton( "button-video", status => loadRandomInstrument() )
	
		// buttons.advancedMode = setButton( "button-advanced", status => stateMachine.toggle( 'advancedMode' ) )
		
		
		// change behviours for certain buttons to allow for holding
		// NB. this is *not* good for accessibility as it cannot be 
		// easily duplicated by the keyboard - hence why
		// there are special keyboard modifiers for performing
		// these actions solely with the keyboard. How to instruct the 
		// user about these additional actions is a challenge
		buttons.about = setPressureButton( "link-about", 
			tap => {
				if (kit){
					kit.cowbell()
				}
			},
			hold => {
				// Easter egg
			},
			percentHeld => {}
		)

		// Upload MIDI File! Secret functions
		//const uploadMIDIForm = document.getElementById("midi-file") 
		const uploadMIDIFileInput = document.getElementById("midi-upload-input") 

		buttons.uploadMIDI = setButton("button-midi-upload", click => {
			const file = uploadMIDIFileInput.files[0]
			userUploadMediaFile( file )
		}, 'click', true)
		
		uploadMIDIFileInput.addEventListener( "change", async (e) => {
			const file = uploadMIDIFileInput.files[0] 
			userUploadMediaFile( file )
			// await userUploadMediaFile( file )
		})

		// allow files to be dragged over the screen
		connectDropZone( userUploadMediaFile )

		// set the master tempo
		selects.tempo = connectSelect( 'select-tempo', option => {
			const tempo = parseInt( option.innerHTML )
			updateTempo(tempo)
			setBPM(tempo)
		} )

		// swap out the eyes for some custom ones
		selects.eyes = connectSelect( 'select-eyes', option => {
			const items = option.value.split(",")
			const eye = convertOptionToObject(items)
			
			setPlayerOptions({ 
				scleraRadius:eye.s,
				irisRadius:eye.i,
				pupilRadius:eye.p,
				eyeRatio:eye.a || 1
			})
		} )

		// set the master sound font
		selects.samples = connectSelect( 'select-samples', async (option) => {
			const instrumentPack = option.value
			setPlayerOptions({ instrumentPack })
			const instrument = await reloadInstrument()
			stateMachine.set( 'instrumentPack', instrumentPack )
			//console.log("Loaded sounds",{instrumentPack, instrument}, getPerson(0).options.instrumentPack )
		} )

		selects.palette = connectSelect( 'select-palette', option => {
			const items = option.value.split(",")
			const palette = convertOptionToObject(items)
			
			setPlayerOptions({
				saturation:palette.s,
				luminosity:palette.l,
			})
		})

		// connect the reverb selector to the reverb chooser
		selects.reverbs = connectReverbControls( async (option) => {
			if (option && option.value)
			{
				const url = option.value
				const reverb = await setReverb(url)
				setFeedback('Reverb loaded', 0 , 'reverb')
				//console.log(option.value, {url, reverb, option})
			}else{
				console.error(option, option.previousSibling )
			}
		})
		
		// allow display type to be changed on the hoof via toggle
		selects.displays = connectSelect( 'select-display', async(option) => {
			if (option && option.value)
			{
				try{
					const displayType = option.value
					display = await switchDisplay( displayType, predictionLoop )
					
				}catch(error){
					console.error("Display Issue! Could not initiate display", error)
				}
				
			}else{
				console.error("Display request ignored", option, option.previousSibling )
			}
		})
		
		// Track mouse coords on canvas for use with mouse cursor thingy
		watchMouseCoords( document.getElementById('control-panel'), coords =>{
			//console.log("Canvas Mouse",coords)
		} )
	}

	/**
	 * load : load the files required for this app
	 * @param {Object} settings Configuration object
	 * @param {Function} progressCallback optional method to call on load progress
	 * @returns {Promise<Boolean>} TensorFlow model load promise
	 */
	const load = async (settings, progressCallback) => {

		const loadTotal = 5
		let loadIndex = 0
		
		progressCallback(loadIndex++/loadTotal, "Loading Brains")

		// pick the body parts and return the method used to create them
		const loadModel = await loadMLModel(settings.model)

		progressCallback(loadIndex++/loadTotal, "Loaded Brains" )
				
		// set up the instrument selctor etc
		setupInterface( stateMachine )

		// recording results and controls
		setupRecordings()

		progressCallback(loadIndex++/loadTotal, "Connecting wires")

		// UI -------------------------------------------------------
		// now set up the front end based on this state
		setupInterfaceUI( settings, progressCallback )

		// add theme controls... also add to state if changing
		const theme = stateMachine.get("theme") ?? getThemeFromReferer(referer)
		setTheme(theme)
		setupThemeControls( document.getElementById('select-theme'), newTheme =>{
			// update state!
			stateMachine.set("theme", newTheme )
		} )


		// this takes any existing state from the url and updates our front end
		// so that any previously saved settings show as if the user is continuing
		// their project from before - same buttons selected etc
		stateMachine.refresh()


		// upodate the load progress
		progressCallback(loadIndex++/loadTotal, "Assembled!")
		
		// load in our instructions  & extras from our referer
		const instructionTools = await import('./models/instructions.js')
		
		progressCallback(loadIndex++/loadTotal, "Instructions Available")
		const instructions = await instructionTools.getInstructions( language, referer )
		
		// cache methods & quantities of data
		getInstruction = instructions.getInstruction
		getHelp = instructions.getHelp
		
		quantityInstructions = instructions.getQuantityOfInstructions()
		quantityHelp = instructions.getQuantityOfHelp()


		// Load tf model and wait
		// this gets returned then used an the update method
		const elementToAnalyse = inputElement

		return loadModel(elementToAnalyse, settings, progressCallback)
	}

	// We avoid setting feedback until part 2 of loading...
	//setFeedback("Initialising...<br> Please wait")
	loadProgressMediator(0, "Loading... Please wait")

	
	/**
	 * loadExtras : load uneccessary files used later in this app
	 */
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
			body.classList.add("sharing-enabled")

			// const dialogShare = document.getElementById("dialog-share")
			// dialogShare.showModal()
			// dialog.hidden = false


		}catch(error){
			// disable the share menu...
			body.classList.add("sharing-disabled")
		}
	}


	// loop until loaded...
	const loadingLoop = async () => {

		// console.log("loading", {isLoading, userLocated: isPersonLocatable, isCameraLoading})
		if ( isLoading )
		{ 
			requestAnimationFrame( loadingLoop ) 
		}else{

			if (ultimateFailure)
			{
				hideLoading()
				body.classList.add("failure")
				// LOAD CANCELLED FATAL ERROR
			}else{
				onLoaded()
			}
		}
	}

	/**
	 * looking for a face to figure out...
	 * wait for the user - show some visual cues via classes
	 * change this depending on whether a face is detected
	 * just wait until a user is found - this is subroutine that causes
	 * no music or SPECIAL effects but can be used to guide the users
	 */
	const lookForUser = () => {

		const SEARCHING_FOR_USERS_CLASS = "searching-for-user"
		const waitForUser = () => {
			if (!isPersonLocatable)
			{
				requestAnimationFrame( waitForUser ) 

			}else{

				// change this depending on whether a face is detected
				speak("Hello! Open your mouth to begin!")
				
				body.classList.toggle(SEARCHING_FOR_USERS_CLASS, false)
				
				return getPerson(0)
			}	
		}
		
		body.classList.toggle(SEARCHING_FOR_USERS_CLASS, true)
		waitForUser()
	}
	
	/**
	 * Loading COMPLETED
	 */
	const onLoaded = async () => {

		body.classList.toggle("loading", false)
		body.classList.toggle("loaded", true)
		main.setAttribute("aria-busy", false)

		// now create all the people we will need!
		for (let i=0; i< stateMachine.get("players"); ++i)
		{
			const person = getPerson(i)
			console.info(i, "Person created", person)
		}
		
		// as we are now "full screen" the positions of the tooltips needs
		// to be recaulated so we do them all here
		updateTooltipPositions()
		observeWeblink()
		notifyObserversThatWeblinkIsAvailable()
		
		// monitor keyboard events
		registerKeyboard()

		speak("I am looking for your face")
		// wait here until a user shows their face...
		const user = await lookForUser()

		// focus app?
		loadProgressMediator(1,"complete", true)
		
		// finish promising with some public method to access
		resolve( constructPublicClass( { 
			user,
			quantityOfActivePeople,

			stateMachine,
			getState:(key)=>stateMachine.get(key),
			setState:stateMachine.set,

			addEventListener,
			setRandomDrumPattern, toggleBackgroundPercussion, setRandomDrumTimbres,
			setPlayerOption, setPlayerOptions,
			getPerson, getPlayers, getQuantityOfPlayers,
			fetchPlayerOptions,setPlayerOption, setPlayerOptions,
			language, 
			isUserActive:()=>isUserActive,
			options:stateMachine.asObject, 
			...information,
			setAutomator,
			setDiscoMode,
		
			setBPM, setMasterVolume,
			changeDrumPattern,
			loadInstruments: loadInstrumentPreset,
			loadRandomInstrument, previousInstrument, nextInstrument,
			toggleRecording
		} ) )
	}

	// EVENTS =================================================================

	/**
	 * 
	 * @param {MIDITrack} midiTrack 
	 */
	 const onMIDIPerformanceAvailable = (midiTrack) => {
		const matchingCommands = midiTrack.getMatchingCommands(["noteOn","noteOff","programChange"]) 
		if (matchingCommands && matchingCommands.length)
		{
			savedPerformance = matchingCommands
			// console.log("onMIDIPerformanceAvailable", midiTrack, matchingCommands )
			// console.log("onMIDIPeconstrformanceAvailable", midiTrack.toString(), midiTrack.toString() )
		}

		const midiFile = createMIDIFileFromTrack( midiTrack, clock.BPM )
		saveMIDIFile( midiFile, "./local.mid")
	}


	// ---------------------------------------------------------

	/**
	 * get player quantity and mouse event in one click
	 * @param {Number} showHelpTextAfter 
	 * @returns 
	 */
	const showPlayerSelectionScreen = async ( showHelpTextAfter=60000 ) => {

		// preload completed and now we show the ui
		// for selecting regular or multi-face mode!
		let timeOut = setTimeout(()=>{
			setFeedback( "Please select how many players you want to play" )
			timeOut = setTimeout(()=>setFeedback( "by clicking either button" ), 15000 )
		}, showHelpTextAfter )

		// clear help fields
		setFeedback("",0,'hide')
		setToast("")

		hideLoading()

		// Show the player selection screen!
		const results = await showPlayerSelector(modelOptions, stateMachine)
		
		clearInterval( timeOut )
		setToast( "" )

		requestAnimationFrame( showLoading )
		
		return results
	}

	// ---------------------------------------------------------
	// BEGIN APP HERE!
	// ---------------------------------------------------------
	let havePlayersBeenSelected = false

	// console.log("PhotoSYNTH3D Waiting to select player...", {options} )

	// NB. To allow this to happen at the same time...
	// we show selection screen while stuff loads in background
	showPlayerSelectionScreen().then( results =>{ 
		havePlayersBeenSelected = true 
		const { advancedMode, automationMode, players } = results
		const quantityOfPlayers = parseInt(players) 
		//console.warn("Selection completed",{ players, advancedMode, automationMode } )
		
		useAutomator = results.automationMode ?? false

		stateMachine.set("players", quantityOfPlayers )
		stateMachine.set("advancedMode", results.advancedMode  ?? false )
		stateMachine.set("automationMode", automationMode )
	})

	//console.warn("Loading machine learning models with options", modelOptions)
	
	// now load dependencies and show progress at the SAME time
	const ML = load(modelOptions, (progress, message) => {

		//console.log("Interface:load -> onLoadProgress", {progress, message })

		loadProgressMediator(progress / 2, message)

	}).then( async fetchPrediction =>{ 
	
		loadProgressMediator(0.45, "Models available", true)

		// we can sneakily back ground load in some data
		// whilst the user hits the button!
		requestAnimationFrame( loadExtras )
		// body.classList.toggle("loading", false)
		
		console.info(
			"%c ",
			`line-height:44px;padding-block:22px;padding-left:44px;background-repeat:no-repeat;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 1024 1024'%3E%3Cpath d='M891.27 380.782H645.133v94.678c0 52.272-42.389 94.678-94.676 94.7-52.29 0-94.662-42.405-94.662-94.678 0-52.288 42.372-94.678 94.662-94.678h94.676V95.127l-.818-.268c-41.648-13.194-84.385-19.784-130.398-19.784C272.604 75.1 77 270.7 77 512s195.6 436.9 436.9 436.9c221.605 0 404.672-164.968 433.094-378.787H701.93l189.34-189.331z' stroke='hsl(30, 6%25, 14%25)' stroke-width='19' fill='hsl(22, 28%25, 87%25)'%3E%3C/path%3E%3C/svg%3E")`,
			"State created", {stateMachine}, "Interface:half loaded... waiting for user response"
		)	
		// console.info("State created", {stateMachine, ui}, "Interface:half loaded... waiting for user response" )

		loadProgressMediator(0.5, "Time to pick players!", false)

		// attempt to get player quantity and mouse event in one
		// wait here until havePlayersBeenSelected = true
		await ( new Promise( resolve =>{
			const wait = a => {
				//console.log("waiting for havePlayersBeenSelected", havePlayersBeenSelected)
				if (havePlayersBeenSelected)
				{
					// console.log( "Interface:Players selected"  )
					loadProgressMediator( 0.5, "Players Selected", false)
					resolve(true)
				} else{
					// TODO: Throw in some zzz animations
					requestAnimationFrame( wait )	
				} 
			}
			wait()
		}) ) 
		
		// now we can update some of the options in the ML model
		// as the models have loaded already at this point...
		modelOptions.maxFaces = modelOptions.numFaces = stateMachine.get('players')
		
		console.info("setFaceLandmarkerOptions", modelOptions )
		
		setFaceLandmarkerOptions( modelOptions )

		console.info("Players", stateMachine.get('players') )
		
		// reset the progress meter for loading the second half
		loadPercent = 0

		// immediatel update the UI
		loadProgressMediator( 0.5, stateMachine.get('players') + " players selected!", false)

		// we are loading asynchronously due to the requestFrames above
		// load settings from store here too?
		// set up some extra options from query strings
		// any custom overrides (shouldn't be needed : use query strings)
		const startApp = await setup( fetchPrediction, modelOptions, (progress,message) => {
			
			//console.log("Loading B Side", progress )
			loadProgressMediator(0.5 + progress/2, message, false)
		})
		
		console.info("Loaded ML model now updating with options", {startApp, modelOptions, stateMachine} )
		
		return startApp

	}).then( startPhotoSYNTH => {

		if (!startPhotoSYNTH)
		{
			throw new Error("Failed to load PhotoSynth Models")
		}

		//loadProgressMediator(1, "", true)

		// let's launch it after it has resolved...
		startPhotoSYNTH()

		// setup done!
		focusApp()

		// wait for stuff to load / be available
		loadingLoop()

		// watch for users getting uninterested or leave the browser
		// NB. this ONLY affects machines that have hover events
		// so not mobiles!
		if (capabilities.mouse)
		{
			watchForUserActivity()
		}

		// Exit & save all cookies!
		window.onbeforeunload = ()=>{

			// try and locally store any changes to the interface and settings
			const saveSession = Object.assign({}, information, {
				lastTime:Date.now(),
				count:(information.count??1)
			})
			// TODO: save ui settings in cookie too?
			store.setItem('info', saveSession)
			//store.setItem(person.name, {instrument})
	
			trackExit && trackExit()
			setToast("Goodbye!")
			setFeedback("<strong>I hope you had fun!</strong>", 0)
		}

		// document.addEventListener( "contextmenu", (e) => {
		//     console.log(e)
		// })

		// TODO: if this is a desktop?
		window.oncontextmenu = () => {
			// reset instructions
			counter = 0
			// restart counter?
			//return false     // cancel default menu
		}

		// URL has been updated internally? 
		// IF the user has only just begun to use the app, this popstate should be empty
		// so rather than go "back" we instead relaod the application to restart 
		// with the same state as before
		window.addEventListener('popstate', (event) => {
			if (!hasNavigationOccurred || window.location.hash )
			{
				return
			}
			
			// console.log("RELOAD UNLESS IS HASH!", event)
			// console.log("location: " + document.location, hasNavigationOccurred, ", state: " + JSON.stringify(event.state))
			window.location.reload()
		})

		// window.addEventListener('deviceorientation' , event => {
		// 	//console.log("device orientation", event)
		// })

		// OFFLINE / ONLINE 
		const updateOfflineStatus = (event) => {
			isOnline = navigator.onLine
		}
		window.addEventListener("online", updateOfflineStatus)
		window.addEventListener("offline", updateOfflineStatus)
		updateOfflineStatus()

		// Tab hide / reveal
		// window.addEventListener("pageshow", (event) => {
		// 	// tab revealed
		// 	console.log("pageshow", event)
		// })

		// window.addEventListener("pagehide", (event) => {
		// 	// tab hidden
		// 	console.log("pagehide", event)
		// })
	})
	.catch( error => {

		// show an on screen error message with the code
		reject(error)
		trackError && trackError('Esoteric interaction', error)
	})
		
	/**
	 * Factory method for creating PhotoSYNTH instances
	 * @param {Object} data - whatever
	 * @returns {PhotoSYNTH} class populated with public methods and events
	 */
	const constructPublicClass = (data) => {
		const app = new PhotoSYNTH(data)
		instance = app
		return instance
	}
})