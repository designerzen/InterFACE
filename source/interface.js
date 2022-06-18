// import {midiLikeEvents} from './timing/rhythm'
import { loadState, getState, setState, refreshState } from './state'
import { say, hasSpeech} from './audio/speech'
import { record } from './audio/recorder'
import { 
	getRecordableOutputNode,
	active, playing, 
	randomInstrument, 
	setupAudio,	audioContext, setReverb,
	updateByteFrequencyData, updateByteTimeDomainData,
	bufferLength,dataArray, 
	getVolume, setVolume } from './audio/audio'

import { loadInstrumentDataPack, getFolderNameForInstrument } from './audio/instruments'
import { createDrumkit } from './audio/synthesizers'
import { setupMIDI } from './audio/midi/midi-out'
import { createWaveform } from './audio/waveform'
import { loadMIDIFile, loadMIDIFileThroughClient } from './audio/midi/midi-file-load'
import { saveMIDIFile, createMIDIFileFromTrack} from './audio/midi/midi-file-create'
import { COMMAND_NOTE_ON, COMMAND_NOTE_OFF } from './audio/midi/midi-commands'

import {getMIDINoteNumberAsName} from './audio/notes'

// Different ways of playing sound!
import SampleInstrument from './audio/instrument.sample'
import MIDIInstrument from './audio/instrument.midi'
import OscillatorInstrument from './audio/instrument.oscillator'

// More input mechanisms
import GamePad from './hardware/gamepad'

// import {midiLikeEvents} from './timing/rhythm'
import { 
	tapTempo,
	getBars, setBars, getBar, 
	startTimer, stopTimer, now, 
	getBarProgress,
	convertBPMToPeriod,
	setTimeBetween, timePerBar, getBPM 
} from './timing/timing.js'

import { playNextPart, kitSequence } from './timing/patterns'
	
import {
	controlPanel,
	updateTempo,
	showPlayerSelector, 
	video,isVideoVisible,toggleVideoVisiblity,  
	setupCameraForm, setupInterface,
	toggleVisibility,
	focusApp
} from './dom/ui'

import {appendAudioElement} from './dom/audio-element'

import setupDialogs from './dom/dialog'
import { connectSelect, connectReverbControls, connectReverbSelector } from './dom/select'
import { setToggle } from './dom/toggle'
import { setButton, setupMIDIButton } from './dom/button'
import { addToolTips, setToast } from './dom/tooltips'
import { setFeedback } from './dom/text'
import { showError } from './dom/errors'
import { appendPhotographElement } from './dom/photographs'

import interact from './inactivity'

import { 
	drawElement,
	updateCanvasSize, copyCanvasToClipboard, 
	overdraw, clear, canvas
} from './visual/canvas'

import { setupImage, setNodeCount } from './visual/2d'
import { drawWaves, drawBars } from './visual/spectrograms'
import { drawQuantise, Quanitiser } from './visual/quantise'
import Stave from './visual/2d.stave'

import { 
	getLocationSettings, getShareLink, 
	forceSecure, addToHistory } from './location-handler'

import { findBestCamera, loadCamera } from './hardware/camera'
import { TAU } from "./maths/maths"

import Person, { EYE_COLOURS, EVENT_INSTRUMENT_CHANGED, EVENT_INSTRUMENT_LOADING } from './person'

import { NAMES, DEFAULT_TENSORFLOW_OPTIONS } from './settings'

import {
	convertOptionToObject,
	addMouseTapAndHoldEvents, 
	MOUSE_HELD, MOUSE_HOLDING, MOUSE_TAP
} from './utils'

// Lazily loaded in load() method
// import { getInstruction, getHelp } from './models/instructions'
// import { setupReporting, track, trackError, trackExit } from './reporting'

let instance = null

// TODO: Public class with public facing methods only
class PhotoSYNTH{
	constructor( publicMethods )
	{
		const keys = Object.keys(publicMethods)
		keys.forEach( key => {
			this[key] = publicMethods[key]
		})
		// console.log("PhotoSYNTH", this)
	}
	// toggleMute(){}
	// pause(){}
	// resume(){}
	// changePlayerInstrument( playerIndex ){}
}

/**
 * This is the actual app - I should probably refactor this but as 
 * a singleton I'm not sure a class is the right way to go!
 * @param {Object} defaultOptions - options to overwrite
 * @param {Function} store - state management
 * @param {Capabilities} capabilities - object to represent device specs
 * @param {?String} language - language code
 * @param {?Function} onLoadProgress - method to call on progress
 * @returns {PhotoSYNTH} Restricted access to properties and methods
 */
export const createInterface = ( 

	defaultOptions, 
	store, 
	capabilities,
	language = "en-GB",
	onLoadProgress

) => new Promise( (resolve,reject) => {

	// Enforce Singleton and return Class with public methods only
	if (instance)
	{
		return resolve(instance)
	}

	const doc = document
	const body = doc.documentElement
	const main = doc.querySelector("main")
	const image = doc.querySelector("img")
	const buttonRecordAudio = doc.getElementById("button-record-audio")

	// lazy loaded imports
	let getInstruction, getHelp
	let setupReporting, track, trackError, trackExit

	const toggles = {}
	const selects = {}

	const information = Object.assign({
		lastTime:-1,
		count:0
	}, store.getItem('info'))

	// Fix dialogs and bind them with events
	setupDialogs()
	
	// state management
	let ui = loadState( defaultOptions, main )

	// Record stuff
	const { isRecordingAvailable, isRecording, startRecording, stopRecording, encodeRecording, downloadRecording } = record()

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
	let gamePad

	// samples and synths
	let kit
	let patterns
	let recorder

	// load MIDI Track model midi track  / save midi track
	let midiPerformance
	let samplePlayer
	let midiPlayer
	let savedPerformance
	let waveforms = []

	// As each sample is 2403 ms long, we should try and do it 
	// as a factor of that, so perhaps bars would be better than BPM?
	let isLoading = true
	let beatJustPlayed = false
	let ultimateFailure = false
	let midiAvailable = false
	let cameraLoading = true
	let noFacesFound = false
	let userLocated = false
	// if the user leaves the tab
	let userActive = false

	// TODO:
	let cookieConsent = false

	// This allows us to determine how long the app has been running for?
	let counter = 0
	
	// performance indicators
	const statistics = {
		lag:0, 
		drift:0
	}

	// for disco mode!
	const cameraPan = {x:1,y:1}


	/**
	 *  Vocal mode uses speech synthesis to talk the toSay string
	 * @param {String} toSay Audio phrase to repeat
	 */
	const speak = toSay => {
		if ( ui.speak && hasSpeech() ) 
		{
			say(toSay,true)
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

	/**
	 * This sets the master volume below the compressor
	 * @param {Number} volume 
	 * @returns volume
	 */
	const setMasterVolume = volume => {
		const r = setVolume(volume)
		store.setItem('audio', { volume:r })
		setToast(`Volume ${Math.ceil(r * 100)}%`,0)
		return r
	}

	/**
	 *  This sets the rate of the master clock that gets transported 
	 *  through the app in order to perform time based actions
	 * @param {Number} bpm Beats per minute
	 * @returns {Number} New Tempo
	 */
	const setTempo = (tempo) => {
		setTimeBetween( tempo )
		const bpm = getBPM()
		setToast( `Tempo : Period set at ${Math.ceil(tempo)} ms between bars / ${Math.ceil(bpm)}BPM` )
		store.setItem('tempo', { period:tempo, bpm })
		return tempo
	}

	/**
	 *  Set the speed of this track by how many ticks per minute
	 *  60,000 / BPM = one beat in milliseconds
	 * @param {Number} bpm Beats per minute
	 * @returns {Number} New Tempo
	 */
	const setBPM = (bpm) => setTempo( 60000 / bpm  )

	/**
	 * Instruments : Load for all people!
	 * @param {String} method Name of method to call on Person
	 * @param {Function} callback Method to run once instruments have loaded
	 * @returns {Function} instrument name (raw)
	 */
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

	
	/**
	 * Instantiate a Person Class and connect it up accordingly
	 * @param {String} name Player's name
	 * @param {String} eyeColour Player's eye colour
	 * @param {?Number} personIndex -  Player number
	 * @returns {Person} Person fully wired
	 */
	const createPerson = (name,eyeColour, personIndex=0) => {

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
		const person = new Person( name, audioContext, audio, options ) 
		//person.addInstrument( new SampleInstrument(audioContext, audio, {}))

		// see if there is a stored name for the instrument...
		// FIXME: Look also in the midiPerformance for the first instrument
		const instrument = getFolderNameForInstrument( midiPerformance ? midiPerformance.instruments[0] : null || savedOptions.instrument || randomInstrument() )
		//console.error("Person created", {instrument}, {person})

		// the instrument has changed / loaded so show some feedback
		person.button.addEventListener( EVENT_INSTRUMENT_CHANGED, ({detail}) => {
			// save it for next time
			const cache = store.setItem(name, {instrument:detail.instrumentName })
			//console.log("External event for ",{ person, detail , cache})
			setToast( `${person.instrumentTitle} Ready!`.toUpperCase() ) 
		})


		const markInstrumnetProgress = (progress,instrumentName) =>{ 
			const percent = Math.ceil(progress*100)
			//setFeedback( `${instrumentName} ${Math.ceil(progress*100)} Loading` )
			if (percent < 99){
				setToast( `${instrumentName} ${percent}% Loading...` )
			}else{
				setToast( `${person.instrumentTitle} Loaded!` )
			}
		}

		person.button.addEventListener( EVENT_INSTRUMENT_LOADING, ({detail}) => {
			const { progress, instrumentName } = detail
			markInstrumnetProgress( progress, instrumentName )
		})

		person.loadInstrument( instrument )

		//console.error(name, {instrument, person, savedOptions})
		
		// see if there are any gamepads connected - let's go te whole hog!
		gamePad = new GamePad( personIndex )
		gamePad.addEventListener( "start", event =>{

		} )
		
		gamePad.addEventListener( "left", event =>{
			// previous instrument
		} )

		gamePad.addEventListener( "right", event =>{
			// next instrument
		} )

		// if (midi && midi.outputs && midi.outputs.length > 0) 
		// {
		// 	person.setMIDI( midi.outputs[0] )
		// }
		return person
	}

	/**
	 * Create / Fetch a user (we cache every new user)
	 * @param {Number} index Person's at index
	 * @returns {Function} Player Class 
	 */
	const getPerson = (index) => {
		
		if (people[index] == undefined)
		{
			const person = createPerson( NAMES[index] , EYE_COLOURS[index], index )
			people.push( person )
			return person
		} else{
			return people[index]
		}
	}

	/**
	 * Set all existing player's options to the selected values 
	 * (change the default for any new players created)
	 * @param {Number} option Variable to set
	 * @param {Number} value Value to set the variable to
	 */
	const setPlayerOption = (option, value) => {
		people.forEach( player => {
			player.options[option] = value
		})
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
	}

	// MIDI ////////////////////////////////////////////////////////////////

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

	/**
	 * TODO:
	 */
	const disableMIDI = () => {
		// midiButton.setText()
	}

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
					console.log("Instrument Pack loading is not supported at this time")
					break

				case "audio/mid":
					const midiFile = await loadMIDIFileThroughClient( file )
					midiPerformance = midiFile
					onMIDIPerformanceAvailable(midiFile)
					return midiFile

				default:
					console.log("Dropped file", {file} , "Ignoring...")
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
			
			//console.info(ui.midiChannel, person.hasMIDI ? `Replacing` : `Enabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, midiDevices, personIndex, midiChannel}, midi.outputs[midiChannel])
		}else{
			console.error("No matching MIDI Instrument", ui.midiChannel, person.hasMIDI ? `Enabling` : `Disabling` , `MIDI #${midiChannel} for ${person.name}` ,{ui, port, portIndex: midiChannel}, midi.outputs[midiChannel])
		}
		return port
	}

	/**
	 * Show that MIDI confg and hardware are available / unavailable
	 * @param {Array} outputs - MIDI Devices we want to use
	 */
	const updateMIDIStatus = (outputs)=>{
		const quantity = outputs.length
		if (quantity>0)
		{
			const midiDevices = outputs.map(midiInstrument => midiInstrument.name || "MIDI Instrument" )
			let feedback = `MIDI : <br>${midiDevices.join( "<br>" )}`
			switch(quantity)
			{
				// FIXME: 2 instruments have been connected,
				// we should send one to each instrument presumably?
				case 2:
					people.forEach( (person,i) => connectMIDIForPerson(i, outputs, ui.midiChannel) )
					break;

				default:
					// w00t
					// console.error("MIDI devices",midiInstrument, midiInstrumentName, outputs)
							
					// use this to fill the peoples
					people.forEach( (person,i) => connectMIDIForPerson(i, outputs, ui.midiChannel) )
					
					//midiButton.setText("Click to disable")
			}

			main.classList.toggle('midi-no-devices', false)
			main.classList.toggle('midi-connected', true)
			main.classList.toggle(`midi-devices-${quantity}`, true)
			main.classList.remove(`midi-unavailable`)

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

		midiAvailable = outputs.length > 0
	}

	/**
	 * Update the GUI to show that MIDI instrument is available
	 * NB. MIDI will require a user interaction to initiate
	 * @returns {Boolean} if MIDI is available
	 */
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

	// INTERACTIONS ///////////////////////////////////////////

	/**
	 *  Add Keyboard listeners and tie in commands
	 */
	const registerKeyboard = () => {
		let numberSequence = ""

		window.addEventListener('keydown', async (event)=>{

			const isNumber = !isNaN( parseInt(event.key) )
			const focussedElement = document.activeElement
			if (focussedElement && focussedElement !== document.documentElement ){
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
								event.key === 'ArrowRight' ||
								event.key === 'ArrowUp' ? 
									audio.playbackRate + 0.1 :
									event.key === 'ArrowLeft' ||
									event.key === 'ArrowDown' ? 
										audio.playbackRate - 0.1 :
										0.2 + Math.random() * 3

							audio.playbackRate = rate
							return

						}else{
							
						}
						break

					case "DIALOG":

						break
				}

				// we should quit here?
			}

			
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

				case 'QuestionMark':
				case '?':
					// read out last bit of help?
					speak(document.getElementById('toast').innerText, true)
					break

				case 'A':
				case 'J':
					previousInstrument()
					break

				case 'D':
				case 'L':
					nextInstrument() 
					break
	
				// Arrows set timing
				case 'ArrowLeft':
					setBPM( getBPM() - 10 )
					break

				case 'ArrowRight':
					setBPM( getBPM() + 10 )
					break

				case 'ArrowUp':
					let b = getBars() + 1
					let bars = setBars( b )
					setTimeBetween( timePerBar() )
					setToast(`Bars : ${bars} / BPM : ${getBPM()}`)
					break

				// change amount of bars
				case 'ArrowDown':
					let ub = getBars() - 1
					let ubars = setBars( ub )
					setTimeBetween( timePerBar() )
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
					setState("backingTrack", !ui.backingTrack, toggles )
					setToast( ui.backingTrack ? "Backing track starting" : "Ending Backing Track" )
					break
			
				case 'c':
					setState("clear", !ui.clear, toggles )
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
					setState("speak", !ui.speak, toggles )
					setToast( ui.speak ? `Reading out instructions` : `Staying quiet` )
					break
			
				case 'm':
					setState("metronome", !ui.metronome, toggles )
					setToast( ui.metronome ? `Quantised enabled` : `Quantise disabled` )
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
					setState("muted", !ui.muted, toggles )
					break
			
				case 'r':
					toggleRecording()
					break

				case 's':
					kit.snare()
					break

				case 't':
					setState("text", !ui.text, toggles )
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
					// or if it is a media key?
					if (!isNumber)
					{
						// loadRandomInstrument()
						// speak("Loading random instruments",true)	
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
					setBPM(tempo)
					// reset
					numberSequence = ''
				}

			}else{

				numberSequence = ''
			}

			// we run this when we want to ???
			addToHistory(ui, event.key)
			// console.log("key", ui, event)
		})
	}

	/**
	 * play Audio for a Person using their current face status
	 * @param {Person} person 
	 * @returns {Object} of metadata
	 */
	const playPersonAudio = ( person ) => {
		// yaw, pitch, lipPercentage, eyeDirection
		const stuff = person.sing()
		let noteName = stuff.noteName
		let noteNumber = stuff.noteNumber
		let note = stuff.note
		let noteVelocity = stuff.volume

		if (!person.instrument || !person.instrument[ noteName ]){
			// probably still loading!
			return stuff
		}

		// we can have some fun here and inercept the output
		// and replace them with MIDI performance commands :P
		if (midiPerformance && person.singing)
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
	
		const personalSamplePlayer = person.samplePlayer

		// FIXME: Don't play the audio directly in Person
		// but instead extract it and pass it to the audioBus
		// stuff.played is an array of notes
		// update the stave with X amount of notes
		// stave.draw(stuff)
		// update the stave with X amount of notes
		if (person.singing)
		{
			personalSamplePlayer && personalSamplePlayer.noteOnByName( noteName, noteVelocity )
			//midiPlayer && midiPlayer.noteOn( noteNumber, noteVelocity )
			// person.midiPlayer && person.midiPlayer.noteOn( noteNumber, noteVelocity )
			//console.log("Person wants to sing", {note, noteNumber, noteName, track, samplePlayer})
			// stave.noteOn( person.lastNoteName, person.name )

			//person.sendMIDI( "noteOn", noteNumber, noteVelocity )
		}else{
			personalSamplePlayer && personalSamplePlayer.noteOff( noteNumber )
			//midiPlayer && midiPlayer.noteOff( noteNumber )
			//person.midiPlayer && person.midiPlayer.noteOff( noteNumber )
			//console.log("Person silenced", {note, noteNumber, noteName, track, samplePlayer})
			// stave.noteOff( person.name )
			//person.sendMIDI( "noteOff", noteNumber )
		}
		return stuff
	}

	/**
	 * Toggle Start / Stop of the Recording
	 */
	const toggleRecording = () => {
		if (isRecording())
		{
			setToast( `Recording Ended - now encoding` )			
			stopRecordingAudio()
		}else{
			setToast("Recording START")
			startRecordingAudio()
		}
	}

	// allows us to record the stream!
	const startRecordingAudio = () => {
		if (!isRecordingAvailable())
		{
			// not supported on this browser
			return
		}
		const recordingNode = audioContext.createMediaStreamDestination()
		
		// pipe in some data from the MASTER BUS gain node
		const masterOutput = getRecordableOutputNode()
		
		masterOutput.connect(recordingNode)
		
		// empty waveform collector
		waveforms = []
		
		buttonRecordAudio.parentElement.classList.toggle("recording", true)
		startRecording(recordingNode.stream).then( recorderInstance => {
			recorder = recorderInstance 
			buttonRecordAudio.classList.toggle("progress", true)
		})
	}

	const stopRecordingAudio = () => {
		buttonRecordAudio.parentElement.classList.toggle("cancelling", true)
		
		stopRecording().then(recording=>{
			buttonRecordAudio.parentElement.classList.remove("recording","progress","cancelling")
	


			// get user's instrument names...tempo etc...
			const person = getPerson(0)

			const fileName = person.instrumentName || `audio-download`



			let svg
			if (waveforms && waveforms.length)
			{
				// process the waveforms
				let lastNonZero = 0
				let datum
				const compacted = waveforms.map( freqByteData=> {
					
					const waveformDataCompacted = []
					for (let idx = 0; idx < 255; idx += 1) {
						datum = Math.floor(freqByteData[idx]) - (Math.floor(freqByteData[idx]) % 5)

						if (datum !== 0) {
							lastNonZero = idx
						}

						waveformDataCompacted[idx] = datum
					}
					return waveformDataCompacted
				})

				const f = compacted.flat(1)
				svg = createWaveform( f, lastNonZero )	
				// console.log( f, {compacted, waveforms, waveformData} )
				// console.log(svg)
			}

			
			// first thing we do before encoding is add it to our output window
			// along with our photos
			appendAudioElement( recording, fileName, downloadType => {
					
				console.log("Download", downloadType, {recording})
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
	 * Wires up all of the individual parts of the app
	 * @param {Function} update Method to call when face moves
	 * @param {Object} settings App Settings Object
	 * @param {Function} progressCallback Method to progressivley call during setup procedure
	*/
	const setup = async (update, settings, progressCallback) => {

		const loadTotal = 7
		let loadIndex = 0

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

		body.classList.toggle("initialising", true)

		try{
			
			setFeedback("Setting things up...<br>This can take a while!")
			progressCallback(loadIndex++/loadTotal, "Setting things up...")

			if (document.querySelector("img"))
			{
				setFeedback( "Image downloaded...<br> Please wait")
				photo = await setupImage(document.querySelector("img"))
			}
			
			progressCallback(loadIndex++/loadTotal, "Looking for cameras")

			// wait for video or image to be loaded!
			if (video)
			{
				setFeedback( "Attempting to locate a camera...<br>Please click accept if you are prompted")
			
				progressCallback(loadIndex/loadTotal,"Looking for cameras..." )
						
				const investigation = await findBestCamera(store, video, status => {
					progressCallback(loadIndex/loadTotal, status)
				})

				const {videoCameraDevices} = investigation
				camera = investigation.camera
				cameraLoading = false

				const cameraFeedbackMessage = investigation.saved ? "Found saved camera" : videoCameraDevices.length > 1 ? "Located a Camera but you can change it in Settings > Camera" : "Located front facing camera"
				//const deviceId = store.has('camera') ? store.getItem('camera').deviceId : undefined
				// setFeedback( cameraFeedbackMessage )

				progressCallback(loadIndex/loadTotal, cameraFeedbackMessage )

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
			
			updateCanvasSize(video.width, video.height)
			progressCallback(loadIndex++/loadTotal)

		}catch(error){
			// NotAllowedError: Permission denied
			const errorReason = String(error).replace("NotAllowedError: ",'')
			const errorMessage = 
			`Camera could not be accessed<br>
			<strong>${errorReason}</strong>`
			
			setFeedback(errorMessage, 0)
			setToast( errorReason )
			progressCallback(loadIndex++/loadTotal, errorReason )
			isLoading = false
			ultimateFailure = true
			trackError('Camera Rejected or Not allowed')
			// FATAL ERROR
			return reject( errorReason )
		}

		// Load any previous performances...
		if (ui.loadMIDIPerformance)
		{
			progressCallback(loadIndex/loadTotal,"Loading MIDI Performance")
			try{
				midiPerformance = await loadMIDIFile( "./assets/audio/midi_nyan-cat.mid" )
				onMIDIPerformanceAvailable( midiPerformance )
			}catch(error){
				setFeedback(error, 0)
			}
		}
	
		try{
			const savedVolume = store.getItem('audio')
			const newVolume = savedVolume ? savedVolume.volume : 1
			audio = await setupAudio()
			
			// load a specific instrumentPack?
			await loadInstrumentDataPack()
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
			progressCallback(loadIndex++/loadTotal, "Audio available...<br>Instrument Sounds ready" )

		}catch(error){

			ultimateFailure = true
			setFeedback("Something went wrong with the Audio<br>"+error, 0)
			return 
		}

		// This first tests for functions to exist
		if (capabilities.webMIDIAvailable)
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
		
		// FIXME: set the input element to either the image or the video
		// hide the other or just set the class?

		// set the canvas to the size of the video / image
		canvas.width = inputElement.width
		canvas.height = inputElement.height

		// Create a new sample player to handle sound playback
		samplePlayer = new SampleInstrument(audioContext, audio, {})
		
		// Add some scales on the side
		quanitiser = new Quanitiser()

		// this just adds some visual onscreen tooltips to the buttons specified
		addToolTips( controlPanel)

		// turn up the amp
		const volume = store.getItem('audio') ? parseFloat(store.getItem('audio').volume) : 1
		setVolume( volume > 0 ? volume : 1 )

		// load scripts once eveything has completed...
		// setTimeout( ()=>{
		// }, 0 )

		// ----------------------------------------------------------------------------------


		// after a period of inactivity...
		//setFeedback("Everything is ready to "+ (inputElement === video? "record" : "read"))
		
		progressCallback(loadIndex++/loadTotal)

		// remove loading flag as we now have all of our assets!
		// TODO: create and position the stave?
		// const stave = new Stave( canvas, 0, 0, true )
		main.classList.add( inputElement.nodeName.toLowerCase() )
		body.classList.toggle("initialising", false)
		


		// update( inputElement === video, (predictions)=>{

		// 	//console.log(inputElement === video, "Predictions found ",predictions)
		// })
		// console.log(inputElement === video, "Waiting on predicions")
		// return
		// LOOP ---------------------------------------

		// Ensure that the video element is always being fed data
		const shouldUpdate = () => !cameraLoading
		
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
				const barColour = `hsl(${getPerson(0).hue },50%,50%)`
				//drawQuantise( beatJustPlayed, getBar(), getBars(), barColour)
				quanitiser.draw( beatJustPlayed, getBar(), getBars(), barColour )
			}
			
			if (ui.spectrogram)
			{
				// updateByteTimeDomainData()
				// drawWaves( dataArray, bufferLength )
				
				updateByteFrequencyData()
				drawBars( dataArray, bufferLength )

				if (recorder)
				{
					waveforms.push(dataArray)
				}
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

					// first update the person - this allows us to sing at will
					person.update(prediction)

					// then redraw them
					// const { yaw, pitch, lipPercentage } = 
					
					// prediction, showText=true, forceRefresh=false
					person.draw(prediction, ui.text, false, beatJustPlayed)
					
					// then whenever you fancy it,
					if (!ui.quantise && !ui.muted)
					{	
						// unless quantize is turned off
						// we can "sing" in realtime
						const stuff = playPersonAudio( person )
					
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
					tickerTape += `<br>PITCH:${prediction.pitch} ROLL:${prediction.roll} YAW:${prediction.yaw} MOUTH:${Math.ceil(100*prediction.mouthRange)}%`
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

			// this simply forces refresh of the stave notes
			// stave.update( counter )


			if (beatJustPlayed)
			{
				beatJustPlayed = false
			}
			
			//console.log(counter, "update", {predictions, tickerTape, userLocated, cameraLoading} )

		}, shouldUpdate )


		// Metronome
		timer = startTimer( ( values )=>{
		

			const { 
				divisionsElapsed,
				bar, bars, 
				barsElapsed, timePassed, 
				elapsed, expected, drift, level, intervals, lag} = values
			

			const isBar = divisionsElapsed % 4 === 0
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

			// Play metronome!
			if ( ui.metronome && bars && isBar )
			{
				// TODO: change timbre for first & last stroke
				const metronomeLength = 0.09
				// click for 3 then clack
				kit.clack(metronomeLength, bars % 4 === 0 ? 0.2 : 0.1 )
			}

			// console.log(barsElapsed, "timer", timer)

			// const notesPlayed = []
		
			// sing note and draw to canvas
			if( ui.quantise )
			{
				// TODO: Modify the sound!
				if (ui.useGamePad && gamePad && gamePad.connected) 
				{
					gamePad.update()
				}

				for (let i=0, l=people.length; i<l; ++i )
				{
					const person = getPerson(i)
					const stuff = playPersonAudio( person )
	
					// use person 1's eyes to control other stuff too?
					// in this case the direction of the pan in disco mode
					if (i===0)
					{
						// stuff.eyeDirection
						cameraPan.x = stuff.eyeDirection
						cameraPan.y = stuff.pitch
					}

					// save data to an array to record
					// personParameters.push(stuff)
				}
			}


			// play some accompanyment music on every note
			// (as we use 16 divisions for quarter notes)
			// FIXME: Just expland the patterns with longer gaps
			if (ui.backingTrack && isBar)
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
							// playTrack( note, 0, audioContext )
							//samplePlayer.noteOn()
							break

						case COMMAND_NOTE_OFF:
							// playTrack( note, 0, audioContext )
							//samplePlayer.noteOff()
							break
					}
				})
				*/
			}

			beatJustPlayed = true

		}, convertBPMToPeriod( getState('bpm') ) )
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
		
		// TODO: test of loading external scripts sequentially...
		progressCallback(loadIndex++/loadTotal, "Loading Brains")

		// pick the body parts...
		let loadModel
		switch (settings.model)
		{
			case "body":
				const {loadBodyModel} = await import('./models/body')
				loadModel = loadBodyModel
				progressCallback(loadIndex++/loadTotal, "Loaded Body Brain" )
				break

			// Face
			default:
				const {loadFaceModel} = await import('./models/face')
				loadModel = loadFaceModel
				progressCallback(loadIndex++/loadTotal, "Loaded Face Brain" )
		}

		// set up the instrument selctor etc
		setupInterface( ui )

		progressCallback(loadIndex++/loadTotal, "Connecting wires")

	


		// you can toggle any checkbox like...
		// toggles.quantise.setAttribute('checked', value)

		// Connect up sone buttons?
		toggles.quantise = setToggle( "button-quantise", status =>{
			setState( 'quantise', status )
			setToast("Quantise " + (ui.quantise ? 'enabled' : 'disabled')  )
		}, ui.quantise)

		toggles.recordAudio = setToggle( "button-record-audio", status =>{
			// setState( 'recording', status )
			// setToast("Quantise " + (ui.quantise ? 'enabled' : 'disabled')  )
			const isRecording = toggleRecording()

		}, false )

		// #button-settings
		toggles.settings = setToggle( "button-settings", status =>{ 
			setState( 'showSettings', status )
			setToast("Settings " + (status ? 'enabled' : 'disabled')  )
		}, ui.showSettings )

		// Connect up sone buttons?
		toggles.metronome = setToggle( "button-metronome", status =>{
			setState( 'metronome', status )
			setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
		}, ui.metronome )

		toggles.backingTrack = setToggle( "button-percussion", status =>{
			setState( 'backingTrack', status )
			setToast( ui.backingTrack ? "Backing track starting" : "Ending Backing Track" )
		}, ui.backingTrack )

		toggles.spectrogram = setToggle( "button-spectrogram", status =>{
			setState( 'spectrogram', status )
			setToast("Spectrogram " + (ui.spectrogram ? 'enabled' : 'disabled')  )
		}, ui.spectrogram )

		toggles.speak = setToggle( "button-speak", status =>{
			setState( 'speak', status )
			setToast("Speaking " + (ui.speak ? 'enabled' : 'disabled')  )
		}, ui.speak )

		// Synch button
		toggles.transparent = setToggle( "button-transparent", status =>{
			// I inverted the state for UX
			setState( 'transparent', !status )
			setToast("Video Synch " + (ui.spectrogram ? 'enabled' : 'disabled')  )
		}, ui.transparent )

		// Clear canvas between frames
		toggles.clear = setToggle( "button-clear", status =>{ 
			setState( 'clear', status )
		}, ui.clear )

		// toggle mute
		toggles.muted = setToggle( "button-mute", status =>{ 
			setState( 'muted', !ui.muted )
			setToast(ui.muted  ? 'Volume Muted' : 'Unmuted' )
		}, ui.muted )

		let discoPreviousState
		// MTV : Special disco mode!
		toggles.disco = setToggle( "button-disco", status =>{ 
			setState( 'masks', status )
			if (status)
			{
				// ENABLE disco mode
				// setState( 'clear', false )
				ui.clear = false
				
				// save previous state to go back to later...
				discoPreviousState = fetchPlayerOptions(['drawMask','drawNodes','drawMesh','meshOnSing'])
				
				//console.log(ui.masks,"MTV save old state", discoPreviousState)
				// setPlayerOption("drawMesh", ui.masks)
				setPlayerOptions( {drawMask:true, drawNodes:false, drawMesh:false, meshOnSing:true})
				
				setToast('Disco mode enabled!' )
			}else{
				// setState( 'clear', true )
				ui.clear = true
				// setPlayerOption("drawNodes", ui.masks)
				//setPlayerOptions( {drawNodes:true, drawMesh:false})
				setPlayerOptions( discoPreviousState )
				//console.log(ui.masks,"MTV load old state", discoPreviousState)
				discoPreviousState = null
				setToast('Disco mode disabled!' )
			}
		}, ui.masks )

		// Overlays ----
		// Face overlays... should be dropdown?
		toggles.masks = setToggle( "button-meshes", status =>{ 
			setState( 'masks', !ui.masks )
			setPlayerOption("drawMask", ui.masks)
		}, ui.masks )

		// hide / show eye overlays
		// NB. this gets hidden in kid mode?
		toggles.eyes = setToggle( "button-eyes", status => {
			setState( 'eyes', !ui.eyes )
			setPlayerOption("drawEyes", ui.eyes)
		}, ui.eyes )

		// Show / hide the canvas element
		toggles.overlay = setToggle( "button-overlay", status => { 
			toggleVideoVisiblity( !isVideoVisible() )
		} )
		
		// show / hide the text
		toggles.text = setToggle( "button-subtitles", status => {
			setState( 'text', !ui.text )
		} )

		//console.error("toggles", toggles)

		setButton( "button-photograph", event => {	
			// TODO: also copy to clipboard?
			// copyCanvasToClipboard()
			appendPhotographElement()
			setToast('Photograph taken!' )
			kit.cowbell()
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
		selects.tempo = connectSelect( 'select-tempo', option => {
			const tempo = parseInt( option.innerHTML )
			updateTempo(tempo)
			setBPM(tempo)
		} )

		selects.eyes = connectSelect( 'select-eyes', option => {
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
		selects.samples = connectSelect( 'select-samples', async (option) => {
			const instrumentPack = option.value
			setPlayerOptions({ instrumentPack })
			const instrument = await reloadInstrument()
			setState( 'instrumentPack', instrumentPack )
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
			// console.log("Logo tapped")/
			if (kit){
				kit.cowbell()
			}
		} )

		logoButton.addEventListener( MOUSE_HELD, event => {
			// console.log("Logo held")
			// Easter egg
		} )


		// Upload MIDI File! Secret functions
		const uploadMIDIForm = document.getElementById("midi-file") 
		const uploadMIDIButton = document.getElementById("button-midi-upload") 
		const uploadMIDIFileInput = document.getElementById("midi-upload") 
		
		uploadMIDIButton.addEventListener( "click", event => {
			event.preventDefault()
			const file = uploadMIDIFileInput.files[0]
			userUploadMediaFile( file )
		})
		
		uploadMIDIFileInput.addEventListener( "change", async (e) => {
			const file = uploadMIDIFileInput.files[0] 
			await userUploadMediaFile( file )
		})
	
		const dropAreas = [ body ]
		const evs = ['dragenter', 'dragover', 'dragleave', 'drop']
		dropAreas.forEach( dropArea => {
			evs.forEach(eventName => {
				dropArea.addEventListener(eventName, async (event) => {
					event.preventDefault()
					event.stopPropagation()
					switch (event.type)
					{
						case 'dragenter':
						case 'dragover':
							body.classList.toggle('dragging', true)
							break
		
						case 'dragleave':
						case 'drop':
							body.classList.toggle('dragging', false)
							break
					}

					if (event.type === "drop")
					{
						const dataTransfer = event.originalEvent ? event.originalEvent.dataTransfer : event.dataTransfer
						const file = dataTransfer.files[0]
						await userUploadMediaFile( file )
					}

				}, false)
			})
		})
	
		

		try{
			// Attempt to Lazy load
			// Load in our instruction tool kit
			const instructionTools = await import('./models/instructions')

			// save to local space
			getInstruction = instructionTools.getInstruction
			getHelp = instructionTools.getHelp
			progressCallback(loadIndex++/loadTotal, "Instructions Found")
		
		}catch(error){
			// backup plan for failed JS loads
			getInstruction = getHelp = i => ''
			progressCallback(loadIndex++/loadTotal, "Instructions failed to load")
		}

		try {
				
			// create our reporter for analytics
			const analyticTools = await import('./reporting')
			setupReporting = analyticTools.setupReporting
			track = analyticTools.track
			trackError = analyticTools.trackError
			trackExit = analyticTools.trackExit
			reporter = setupReporting("InterFACE")

			progressCallback(loadIndex++/loadTotal, "Reporter assigned")
			
		} catch (error) {

			progressCallback(loadIndex++/loadTotal, "Reporting blocked")
		}
		
		
		// this takes any existing state from the url and updates our front end
		// so that any previously saved settings show as if the user is continuing
		// their project from before - same buttons selected etc
		refreshState()

		// upodate the load progress
		progressCallback(loadIndex++/loadTotal, "Assembled!")
		
		// Load tf model and wait
		// this gets returned then used an the update method
		return loadModel(inputElement, settings)
	}

	// We avoid setting feedback until part 2 of loading...
	//setFeedback("Initialising...<br> Please wait")
	onLoadProgress && onLoadProgress(0, "Loading... Please wait")

	let extrasLoaded = false

	/**
	 * loadExtras : load uneccessary files used later in this app
	 */
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
	}


	const onLoaded = async () => {

		// just wait until a user is found
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
		
		// wait here until a user shows their face...
		const user = await lookForUser()

		// focus app?
		onLoadProgress && onLoadProgress(1,"complete")
		
		// finish promising with some public method to access
		resolve( constructPublicClass( { 
			user,
			language, 
			...ui, 
			...information,
			setBPM, loadInstruments, 
			loadRandomInstrument, 
			previousInstrument, nextInstrument
		} ) )
	}

	/**
	 * 
	 * @param {MIDITrack} midiTrack 
	 */
	const onMIDIPerformanceAvailable = (midiTrack) => {
		const matchingCommands = midiTrack.getMatchingCommands(["noteOn","noteOff","programChange"]) 
		if (matchingCommands && matchingCommands.length)
		{
			savedPerformance = matchingCommands
			console.log("onMIDIPerformanceAvailable", midiTrack, matchingCommands )
		}

		const midiFile = createMIDIFileFromTrack(midiTrack)
		saveMIDIFile( midiFile, "./local.mid")
	}

	// loop until loaded...
	const loadingLoop = async () => {

		//console.log("loading", {isLoading, userLocated, cameraLoading})
		if ( isLoading )
		{ 
			requestAnimationFrame( loadingLoop ) 
		}else{

			if (ultimateFailure)
			{
				body.classList.add("failure")
				body.classList.remove("loading")
				// LOAD CANCELLED FATAL ERROR
			}else{
				onLoaded()
			}
		}
	}


	// ---------------------------------------------------------
	const options = Object.assign( {}, DEFAULT_TENSORFLOW_OPTIONS, { maxFaces:ui.duet ? 2 : 1 } )

	// FIXME: Do we instantly show the user quantity screen
	// and load all background elements and scripts

	// now load dependencies and show progress
	load(options, (progress, message) => {
		
		//console.log("Loading A Side", progress )
		onLoadProgress && onLoadProgress(progress, message)

	}).then( async update =>{ 

		// Hide 
		setFeedback("")
		setToast("")

		// FIXME: Maybe only show if people dont do anything?
		
		// hide the loading screen but dont sdt it to loaded just yet
		body.classList.toggle("loading", false)

		// we can sneakily back ground load in some data
		// whilst the user hits the button!
		requestAnimationFrame( loadExtras )
		
		let timeOut = setTimeout(()=>{
			setToast( "Please select how many players you want to play" )
			timeOut = setTimeout(()=>setToast( "by clicking either button" ), 15000 )
		}, 60000 )

		// load completed and now we show the ui
		// for selecting regular or multi-face mode!
		try{
			
			const {players,advancedMode} = await showPlayerSelector(options)
			setState("duet", players > 1	)
			setState("advancedMode", advancedMode )
			//console.log("Duet", multiPlayer, ui.duet )

		}catch(error){
			console.error("player selection failed", error)
		}

		// continue loading...
		clearInterval( timeOut )
		body.classList.toggle("loading", true)
		setToast( "" )

		// load settings from store here too?
		// set up some extra options from query strings
		// any custom overrides (shouldn't be needed : use query strings)
		return setup( update, options, (progress,message) => {
			
			// console.log("Loading B Side", progress )
			onLoadProgress && onLoadProgress(progress, message)
		})

	}).then( data => {

		// setup done!
		focusApp()
	})
	.catch( error => {

		// show an on screen error message with the codes...
		showError(error, "Try hard refresh")
	})

	// wait for stuff to load / be available
	loadingLoop()

	// watch for users getting uninterested or leave the browser
	// NB. this ONLY affects machines that have hover events
	// so not mobiles!
	if (capabilities.mouse)
	{
		interact( 
			document.getElementById("button-video"),
			function onActive(){
				ui.autoHide && body.classList.toggle("user-active", true)
				ui.autoHide && body.classList.toggle("user-inactive", false)
				userActive = true
			}, 
			function onInactive(){
				ui.autoHide && body.classList.toggle("user-active", false)
				ui.autoHide && body.classList.toggle("user-inactive", true)
				userActive = false
			}
		)
	}

	// Exit & save all cookies!
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