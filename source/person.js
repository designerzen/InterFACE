/**
 * each person in the app has their own instrument and face
 * and each has a unique input mechanism based on the options 
 * specified.
 * 
 * By default the yaw and picth control the 
 * This can be set to the eyes left and right for 
 * 
 * 
  DADSHR :
  Delay | Attack | Decay | Sustain | Release
  +----------------------------------------+
  |               XXX                      |
  |              XX XX                     |
  |             XX   XX                    |
  |            XX     XXX                  |
  |           XX        XXXXXXXXXXX        |
  |          XX                   XX       |
  |         XX                     XXX     |  Amplitude
  |        XX                        XX    |
  |       XX                          XX   |
  |      XX                            X   |
  |     XX                             XX  |
  |    XX                               XX |
  |   XX                                 XX|
  |XXX                                    XX
  XX---------------------------------------X
  Start                    |HOLD| Stop
 * 
 *  */ 
  
import { 
	EYE_COLOURS,
	DEFAULT_PERSON_OPTIONS,
	DEFAULT_PEOPLE_OPTIONS,
	DEFAULT_VOICE_OPTIONS,
	NAMES
} from './settings/options'

import { rescale, lerp, clamp, range, rangeRounded } from "./maths/maths"
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad} from "./maths/easing"

// all the different instruments!

// Any instruments you may want to load later on!
// import simplePluginURI from "url:./audio/wam2/simple/index.js"
// import samplerPluginURI from "url:./audio/wam2/sampler/index.js"

// import WAM2Instrument from './audio/instruments/instrument.wam2'
// import SampleInstrument from './audio/instruments/instrument.sample'
// import SoundFontInstrument from './audio/instruments/instrument.soundfont'
// import MIDIInstrument from './audio/instruments/instrument-midi'
import MIDIInstrument from './audio/instruments/instrument.midi.js'

// import OscillatorInstrument from './audio/instruments/instrument.oscillator'
// import WaveGuideInstrument from "./audio/instruments/instrument.waveguide"
// import YoshimiInstrument from "./audio/instruments/instrument.yoshimi"
import InstrumentFactory, { 
	INSTRUMENT_TYPE_SOUNDFONT,
	INSTRUMENT_TYPE_OSCILLATOR, 
	INSTRUMENT_TYPE_MIDI 
} from './audio/instrument-factory.js'

import InstrumentManager from './audio/instrument-manager.js'
import INSTRUMENT_LIST from './assets/audio/instrument-list.json'

import { convertNoteNameToMIDINoteNumber, getNoteText, getNoteName, getNoteSound, getFriendlyNoteName } from './audio/tuning/notes'
import { getGeneralMIDIInstrumentFolders, getInstrumentTitle, getRandomBasslinePresetIndex, getRandomBeatsPresetIndex, getRandomHarmonicLeadPresetIndex, getRandomLeadPresetIndex } from './audio/sound-font-instruments'
import { ParamaterRecorder } from './parameter-recorder'
import { addInteractivityToInstrumentPanel, createDraggablePanel, hideExistingInstruments, hidePersonalControlPanel, populateInstrumentPanel, showPersonalControlPanel } from "./dom/ui.panel-instruments.js"
import { drawMousePressure } from './dom/mouse-pressure'

import { GENERAL_MIDI_INSTRUMENT_LIST } from "./audio/midi/general-midi.constants"
import { now } from "./timing/timing.js"
import { toKebabCase } from "./utils/utils.js"
import { recogniseEmoji } from './models/emoji-detection.js'
import { EMOJI_NEUTRAL } from './models/emoji.js'

// States for the audio controlled by the face
export const STATE_INSTRUMENT_SILENT = "instrument-not-playing"
export const STATE_INSTRUMENT_ATTACK = "instrument-attack"
export const STATE_INSTRUMENT_SUSTAIN = "instrument-sustain"
export const STATE_INSTRUMENT_PITCH_BEND = "instrument-pitchbend"
export const STATE_INSTRUMENT_DECAY = "instrument-decay"
export const STATE_INSTRUMENT_RELEASE = "instrument-release"

export const EVENT_INSTRUMENT_CHANGED = "instrument-changed"
export const EVENT_INSTRUMENT_LOADING = "instrument-loading"


// FIXME:
const FUDGE = 1.0// 1.3

/**
 * Default head control input mechanism
 * Where looking left and right sets the Scale
 * Where looking up and down sets the octave
 * Rolling the head left sets the pitch
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
const convertHeadOrientationIntoNoteData = (prediction, options) => {

	const octaveNumber = prediction[options.octaveController] 
	const noteNumber = prediction[options.noteController] 
	
	// remap -1 -> +1 to 0 -> 1
	const noteFloat = (1 + noteNumber) * 0.5 

	// pitch goes from -1 -> +1 and we want to map to 1 -> 7
	// straight at screen to positive below and negative above
	const newOctave = rangeRounded( octaveNumber , -1, 1, 1, 7 )

	// simple way of selecting the black notes
	const isMinor = prediction[options.minorController ]

	
	// console.info(noteNumber, noteFloat, "-> ? ", octaveNumber, "->", newOctave, {isMinor} )

	// eg. A1 Ab1 C3 etc
	const noteName = getNoteName(noteFloat, newOctave, isMinor)
	// eg. Do Re Mi
	const noteSound = getNoteSound(noteFloat, isMinor)	
	
	const afterTouch = 0
	const pitchBend = 0

	return {
		octaveNumber,
		noteNumber,
		noteName,
		noteSound,
		noteFloat,
		newOctave,
		afterTouch,
		pitchBend,
		isMinor
	}
}

// /**
//  * Default head control input mechanism
//  * Where looking left and right sets the Scale
//  * Where looking up and down sets the octave
//  * Rolling the head left sets the pitch
//  * @param {Object} prediction 
//  * @param {Object} options 
//  * @returns 
//  */
// const convertHeadRollToPitchAndPitchToOctaveAndYawToScale = (prediction, options) => {

// 	const octaveNumber = prediction[options.octaveController] 
// 	const noteNumber = prediction[options.noteController] 
	
// 	// remap -1 -> +1 to 0 -> 1
// 	const noteFloat = (1 + noteNumber) * 0.5 

// 	// pitch goes from -1 -> +1 and we want to map to 1 -> 7
// 	// straight at screen to positive below and negative above
// 	const newOctave = rangeRounded( -octaveNumber , -1, 1, 1, 7 )

// 	// simple way of selecting the black notes
// 	const isMinor = prediction[options.minorController ]

// 	// eg. A1 Ab1 C3 etc
// 	const noteName = getNoteName(noteFloat, newOctave, isMinor)
// 	// eg. Do Re Mi
// 	const noteSound = getNoteSound(noteFloat, isMinor)	
	
// 	const afterTouch = 0
// 	const pitchBend = 0

// 	return {
// 		octaveNumber,
// 		noteNumber,
// 		noteName,
// 		noteSound,
// 		noteFloat,
// 		newOctave,
// 		afterTouch,
// 		pitchBend,
// 		isMinor
// 	}
// }

/**
 * Default head control input mechanism
 * Where looking left and right sets the pitch
 * Where looking up and down sets the octave
 * Rolling the head left sets the scale
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
const HEAD_ROLL_TO_SCALE_AND_PITCH_TO_OCTAVE_AND_YAW_TO_PITCH = {
	noteController:'pitch',		// up down
	octaveController:'pitch',	// lean tilt
	gateController:'mouth',
	pitchbendController:'eyebrowsRaisedBy',
	aftertouchController:'rightSmirk',
	minorController:'isFacingRight'
}
const convertHeadRollToScaleAndPitchToOctaveAndYawToPitch = (prediction) => {
	return convertHeadOrientationIntoNoteData = (prediction, HEAD_ROLL_TO_SCALE_AND_PITCH_TO_OCTAVE_AND_YAW_TO_PITCH) 
}

/**
 * Default head control input mechanism
 * Where looking left and right sets the pitch
 * Where looking up and down sets the scale
 * Rolling the head left sets the octave
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
const HEAD_ROLL_TO_OCTAVE_AND_PITCH_TO_SCALE_AND_YAW_TO_PITCH = {
	noteController:'yaw',		// up down
	octaveController:'roll',	// lean tilt
	gateController:'mouth',
	pitchbendController:'eyebrowsRaisedBy',
	aftertouchController:'leftSmirk',
	minorController:'isFacingRight' // 'eyebrowsRaisedBy',
}
const convertHeadRollToOctaveAndPitchToScaleAndYawToPitch = (prediction) => {
	return convertHeadOrientationIntoNoteData = (prediction, HEAD_ROLL_TO_OCTAVE_AND_PITCH_TO_SCALE_AND_YAW_TO_PITCH) 
}


export default class Person{

	playerNumber = -1

	audioContext
	offlineAudioContext

	// instances
	midiPlayer
	samplePlayer
	
	// the :-) that represents this person!
	emoticon = EMOJI_NEUTRAL

	activeInstrument
	instruments = []
	instrumentPointer = 0
	instrumentLoadedAt = -1
	presetName
	presetTitle
	
	// default state is audio off
	state = STATE_INSTRUMENT_SILENT
		
	// Flags
	active = false
	singing = false
	isMouthOpen = false
	isLeftEyeOpen = true
	isRightEyeOpen = true

	// 
	isUserActive = true

	// if we are repeating our bars...
	isLooping = false
	// if we are watching the face perform without interaction
	isPlayingBack = false
	// is the instrument panel selection form visibile
	isFormShowing = false
	// is a sample based instrument loading still?
	instrumentLoading = false
	// is the MIDI port active?
	isMIDIActive = false

	// istrument panel connected
	isInstrumentPanelInteractive = false
	
	// Head orientation
	yaw = 0
	pitch = 0
	roll = 0

	// we can use external inputs here and store the dispatcher here
	gamePad

	// internal person frame counter
	counter = 0

	tracks = 0

	octave = 4

	// now playing
	note = -1
	noteName = "C4"
	noteSound = "-"
	noteNumber = -1
	noteFriendlyName = "C-4"
	noteVelocity = 0

	// last played
	lastNote = -1
	lastNoteName = "C4"
	lastNoteFriendlyName = "C-4"
	lastNoteSound = "-"
	lastNoteNumber

	lastTimeActive = -1
	
	// real time colour settings
	defaultHue = 0
	saturation = 50
	luminosity = 50
	hueRange = 360

	mouseDownAt = -1
	mouseHeldAt = -1
	inputCoordinates = { x:0, y:0 }

	leftEyeClosedAt = -1
	rightEyeClosedAt = -1
	eyesClosed = false

	data = null
	midi = null

	// default MIDI settings
	midiChannel = "all"

	// where to hook into the 
	outputNode

	// optional fx
	stereoNode
	eyeBrowsNode	// highpass filter
	noseNode		// compressor

	// this is the mechanism to control the music
	// and can be set on a per user basis
	controlMode = convertHeadOrientationIntoNoteData

	/**
	 *  @returns {Boolean} user comp occurring
	 */
	get isActive(){
		return this.active
	}

	/**
	 *  @returns {Boolean} is the mouth open beyond threshold / playback happening
	 */
	get isSinging(){
		return this.singing
	}

	/**
	 * Are the user's eyes both open?
	 * @returns {Boolean} are both eyes open
	 */
	get areEyesOpen(){
		return this.isLeftEyeOpen && this.isRightEyeOpen
	}

	/**
	 * Are the user's eyes both closed?
	 * @returns {Boolean} are both eyes closed?
	 */
	get areEyesClosed(){
		return this.eyesClosed
	}

	/**
	 * Returns time in ms since the user moused down
	 * or else -1 if the mouse is not down at all 
	 */
	get mouseDownFor(){
		return this.isMouseDown ? 
			this.now - this.mouseDownAt :
			-1
	}
		
	/**
	 * Is the mouse button down?
	 * @returns {Boolean} Mouse button state
	 */
	get isMouseDown(){
		return this.mouseDownAt > -1
	}

	/**
	 * Checks to see if the user is pressing their face
	 * @returns {Boolean} has this Person got a finger depressed on their face?
	 */
	get isMouseHeld(){
		//console.log("isMouseHld", this.mouseDownFor, this.options.mouseHoldDuration )
		return this.mouseDownFor > this.options.mouseHoldDuration
	}

	/**
	 * Checks to see if the user is pressing their face
	 * @returns {Number} 0-1 how long the user has proportionally held their finger
	 */
	get mouseHoldProgress(){
		return this.mouseDownFor / this.options.mouseHoldDuration
	}

	/**
	 * Fetch the class of the form on the DOM that matches this Person
	 * @returns {String} ID name
	 */
	get controlsID (){
		return `.${this.name}-controls`
	}

	/**
	 * Fetch the form controls on the DOM that matches this Person
	 * @returns {HTMLElement} Form element for this Person
	 */
	get controls (){
		return document.querySelector(this.controlsID)
	}

	/**
	 * Fetch the class of the form on the DOM that matches this Person
	 * @returns {String} ID name
	 */
	get panelID (){
		return `.${this.name}-panel`
	}

	/**
	 * Fetch the form controls on the DOM that matches this Person
	 * @returns {HTMLElement} Form element for this Person
	 */
	get instrumentPanel (){
		return document.querySelector(this.panelID)
	}

	get faceButton(){
		return document.getElementById(this.name)
	}

	/**
	 * Fetch the instrument name eg. french-horn
	 * @returns {String} Instrument name
	 */
	get instrumentName(){
		return this.activeInstrument ? this.activeInstrument.name : 'loading'
	}	

	/**
	 * Fetch the instrument title eg. French Horn
	 * @returns {String} Instrument title
	 */
	get instrumentTitle(){
		return this.activeInstrument ? this.activeInstrument.title : 'loading'
	}

	/**
	 * Fetch the index in the instrument array of the current instrument
	 * @returns {Number} Instrument index
	 */
	get instrumentIndex(){
		return this.instrumentPointer // getGeneralMIDIInstrumentFolders().indexOf(this.instrumentName)
	}

	/**
	 * Is the instrument currently loading
	 * @returns {Boolean} are samples loading
	 */
	get instrumentLoading(){
		return this.activeInstrument.isLoading
	}

	/**
	 * Fetch the instrument title eg. French Horn
	 * @returns {Boolean} does this machine have MIDI set up?
	 */
	get hasMIDI(){
		return this.midi !== null && this.midiChannel && this.midiChannel.length > 0
	}

	/**
	 * Fetch the MIDI device name if one is connected
	 * @returns {String} MIDI Device name
	 */
	get MIDIDeviceName(){
		return this.midi ? this.midi.name : 'unknown'
	}

	/**
	 * Return a time based library of face movements since recording began
	 * @returns {Array<String>} time based library of face movements
	 */
	get history(){
		return this.parameterRecorder.recording
	}

	/**
	 * get the current time in milliseconds
	 * this.audioContext this.audioContext.currentTime :
	 */
	get now(){
		return now()
	}

	/**
	 * get the time elapsed in milliseconds since
	 * the Person's instrument last changed
	 */
	get timeSinceInstrumentChanged(){
		return this.instrumentLoadedAt < 0 ? 
			0 : this.now - this.instrumentLoadedAt
	}

	/**
	 * Gets the HUE (0-100) set for this user or any variation
	 * due to implicit state alterations such as during loading
	 */
	get hue(){
		return this.instrumentLoading ? 
			this.defaultHue + (90+counter % this.hueRange) : 
			this.defaultHue
	}

	/**
	 * Get's the hue but as a colour
	 */
	get hsl(){
		return `hsl(${this.hue},${this.saturation}%,${this.luminosity}%)`
	}
	
	/**
	 * Get's the hue but as a colour
	 */
	get hsla(){
		return `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,0.5)`
	}

	/**
	 * Is the user's side panel on the left or right?
	 * Users A and C go left, B and D go right
	 */
	get isLeftSidePanel(){
		// 0 and 2 are left side
		return this.playerNumber%2 === 0
	}
	
	get currentPreset(){
		return this.presetName 
	}
	
	get currentPresetTitle(){
		return this.presetTitle ?? this.activeInstrument.activePreset
	}

	constructor( index, options={}, saveData=undefined ) {
		
		this.options = Object.assign({}, DEFAULT_PERSON_OPTIONS, options)
		// ensure that the name is all lower case and kebabed
		this.name = toKebabCase( NAMES[index])

		this.playerNumber = index

		if (saveData)
		{
			this.importData(saveData)	
		}

		// HSL Colour scheme that can be overwritten
		this.setPalette(this.options)

		// probably not neccessary with reverb effect
		this.precision = Math.pow( 10, parseInt(this.options.precision) )
		
		// allow us to record the performances (not the audio)
		// useful for showing recordings of a person
		this.parameterRecorder = new ParamaterRecorder()
		this.isRecordingParameters = options.recordData ?? false
	
		this.debug = this.options.debug

		// this.range = 1 / ( 1 - this.options.mouthCutOff )
		this.mouthScale = rescale(this.options.mouthCutOff,  0.99 )

		// fetch face button dom element and cache
		this.button = this.faceButton

		if (this.button)
		{
			// make sure it is visible!
			this.button.hidden = false
			// Create our side bar and instrument selector for m
			//this.setupForm().then(()=>{
				
				this.button.addEventListener( 'mousedown', e =>{ 
					//console.log("mouse down")
					this.onFaceTouchStart(e) 
					document.addEventListener('mouseup', e => this.onFaceTouchEnd(e), {once:true})
				})

				// this.button.addEventListener( 'mouseup', e => {
				// 	console.log("mouse up")
				// 	this.onFaceTouchEnd(e) 
				// })

				this.button.addEventListener( 'touchstart', e =>{ 
					//console.log("touch start")
					this.onFaceTouchStart(e) 
					document.addEventListener('touchend', e => this.onFaceTouchEnd(e), {once:true})
				})

				// this.button.addEventListener( 'touchend', e => {
				// 	console.log("touch end")
				// 	this.onFaceTouchEnd(e) 
				// })

				this.button.addEventListener( 'mouseover', event => {
					this.isMouseOver = true
				})

				this.button.addEventListener( 'mouseout', event => {
					this.isMouseOver = false
				})

				this.instrumentLoadedAt = this.now
			// })
		}else{
			// console.warn(`Created Person "${name}" but could not find associated markup #${name}`)
			throw Error(`Created Person "${name}" but could not find associated markup #${name}`)
		}

		//console.log("Created new person", this, "connecting to", destinationNode )
	}

	/**
	 * TODO:
	 * Destroy this person - disconnect audio chain
	 * free up associated memory
	 */
	destroy(){

		// kill instrument and disconnect from graph
	}
	
	/**
	 * 
	 * @returns {Object}
	 */
	importData( data, prefix='' ){

		// convert data.... can be string or object
		if (typeof data === 'string')
		{
			data = JSON.parse(data)
		}
		
		prefix = prefix.length > 0 ? 
			prefix+'-' : 
			this.name+'-'

		// defaultInstrument:INSTRUMENT_TYPE_SAMPLE,
		this.options.defaultInstrument = data[prefix+'instrument']
		// which instrument preset to load?
		this.options.defaultPreset = data[prefix+'preset' ]

		this.options.saturation = data[prefix+'sat' ]
		this.options.luminosity = data[prefix+'lum' ]
		this.options.hueRange = data[prefix+'range' ]
		this.options.defaultHue = data[prefix+'hue' ]
	}

	/**
	 * Save this person as something that can be put in the state
	 * @returns {String}
	 */
	exportData(prefix='', asURL=false){

		prefix = prefix.length > 0 ? 
			prefix+'-' : 
			this.name+'-'

		const data = {
			// defaultInstrument:INSTRUMENT_TYPE_SAMPLE,
			[prefix+'instrument']:this.options.defaultInstrument, 
			// FIXME: GET THIS FROM THE ACTIVE INSTRUMENT!
			// which instrument preset to load?
			[prefix+'preset']:this.activeInstrument.instrumentIndex ?? this.options.defaultPreset,
			
			[prefix+'sat'] : this.saturation,
			[prefix+'lum'] : this.luminosity,
			[prefix+'range'] : this.hueRange,
			[prefix+'hue'] : this.hue,
		}

		return asURL ?  new URLSearchParams(data)  : data
	}

	/**
	 * String representation of this Person
	 */
	toString(){
		return `Person(${this.name})`
	}

	/**
	 * Set the internal State for this Person from the constants above
	 * @param {String} state - which state the Person is in
	 */
	setState(state){
		// console.log(state)
		// Vocal state machine ASDR
		this.state = state
	}
	
	/**
	 * Dispatch a custom event
	 * @param {String} type 
	 * @param {Object} data 
	 */
	dispatchEvent(type, data = {}){
		this.button.dispatchEvent(new CustomEvent( type, {detail: data}))
	}

	/**
	 * Set the palette for this Person
	 * @param {Object} options HSL colour model
	 */
	setPalette(options){
		this.saturation = options.saturation // && 100
		this.luminosity = options.luminosity //&& 100
		this.hueRange = options.hueRange //&& 360
		this.defaultHue = options.hue ?? Math.random() * this.hueRange
		//console.log("Setting palette", this, {options, h:this.hue, s:this.saturation, l:this.luminosity, range:this.hueRange} )
	}

	/** 
	 * Update Person's Memory state
	 * Cache data for use in processing later
	 * @param {Object} prediction data model
	 */
	update(prediction, forceRefresh=false){
		
		this.counter++
		
		// reuse old prediction aka refresh
		if (!prediction || forceRefresh)
		{
			prediction = this.data
		}

		// cache all data
		this.data = prediction
		this.lastTimeActive = now()

		// save all the parameters for recall later on...
		if (this.isRecordingParameters)
		{
			this.parameterRecorder.add(prediction)
		}
		
		// If we are playing back an old session, we overwrite
		// this data with the existing session data
		if (this.isPlayingBack)
		{
			// TODO:
			// overwrite prediction
		}


		const rightEyeClosedFor = this.isRightEyeOpen ? -1 : prediction.time - this.rightEyeClosedAt
		const leftEyeClosedFor = this.isLeftEyeOpen ? -1 : prediction.time - this.leftEyeClosedAt
		const eyesClosedFor = this.instrumentLoading || this.isRightEyeOpen || this.isLeftEyeOpen ? -1 : Math.max(leftEyeClosedFor, rightEyeClosedFor)

		this.eyeDirection = prediction.eyeDirection

		// stereo eye panning
		if (this.options.stereoPan && this.stereoNode)
		{
			// -1 -> +1
			this.stereoNode.pan.value = prediction[this.options.stereoController] // * -1
		}
		

		// TODO:
		// when the left eyebrow is down and the right is up
		// if (browDownLeft - browDownRight > 0.5){
	
		// 	o-O
		// 	const isLeftEyebrowDownAndRightEyebrowUp = browDownLeft < browDownRight
		// 	O-o
		// 	const isRightEyebrowDownAndLeftEyebrowUp = browDownLeft > browDownRight
	
		// }else{
		//}

		// eyebrows controls
		if (this.options.drawEyebrows && this.delayNode)
		{
			// as low pass filter
			// this.eyeBrowsNode.frequency.value = 1000 + prediction.leftEyebrowRaisedBy * 1000 // (1000, audioCtx.currentTime);
			// this.eyeBrowsNode.gain.value = 2 + prediction.rightEyebrowRaisedBy * 20 //(25, audioCtx.currentTime);
			// this.eyeBrowsNode.Q.value = prediction.eyebrowsRaisedBy * 5
						
			// this.eyeBrowNode.threshold.value = prediction.eyebrowsRaisedBy * -100


			// this.eyeBrowNode.knee.value = prediction.eyebrowsRaisedBy * 40
			// console.log( this.eyeBrowNode.gain.value, this.eyeBrowNode.frequency.value )

			// As delay and feedback
			this.feedbackNode.gain.value = clamp(prediction.eyebrowsRaisedBy, 0, 0.3)
			this.delayNode.delayTime.value = clamp(prediction.leftEyebrowRaisedBy, 0, 0.3)
			// console.info("Delay via prediction", {prediction, gain:this.feedbackNode.gain.value , time:this.delayNode.delayTime.value})
		
		}else if (this.delayNode){

			// As delay and feedback that are static
			this.feedbackNode.gain.value = 0.3 // (30% feedback)
			this.delayNode.delayTime.value = 0.2 // (40% delay)
			// console.info("Delay", prediction)
		}

		
		// EVENTS DISPATCH ---------------------------------------

		// check to see if mouse if down
		if (this.mouseHeldAt === -1 && this.isMouseHeld)
		{
			this.onButtonHeld()
		}

		// update any eye states
		// FIXME: Smooth these out either here or directly in model
		if (this.isLeftEyeOpen !== !prediction.leftEyeClosed)
		{
			if (prediction.leftEyeClosed)
			{
				this.onLeftEyeClose( prediction.time )
			}else{
				// open eye
				this.onLeftEyeOpen( prediction.time - this.leftEyeClosedAt )
			}
			// eye state changed
			this.isLeftEyeOpen = !prediction.leftEyeClosed
		}

		if (this.isRightEyeOpen !== !prediction.rightEyeClosed)
		{
			if (prediction.rightEyeClosed)
			{
				this.onRightEyeClose( prediction.time )
				
			}else{
				this.onRightEyeOpen( prediction.time - this.rightEyeClosedAt )
			}
			// eye state changed
			this.isRightEyeOpen = !prediction.rightEyeClosed
		}
		
		// eyes have been closed for X -period of time
		if (eyesClosedFor > this.options.eyeShutHolddDuration)
		{
			// both eyes are closed for X amount of time...
			// console.log("EYES SHUT", {
			// 	rightEyeClosedFor, 
			// 	leftEyeClosedFor, 
			// 	eyesClosedFor, 
			// 	ro:this.isRightEyeOpen,
			// 	lo:this.isLeftEyeOpen,
			// 	time:prediction.time, 
			// 	rca:this.rightEyeClosedAt, 
			// 	lca:this.leftEyeClosedAt
			// } )

			// update to reset counter
			this.leftEyeClosedAt = prediction.time
			this.rightEyeClosedAt = prediction.time

			this.onEyesClosedForTimePeriod()
		}

		// const emoji = recogniseEmoji(this)
		// options.mouthCutOff
		this.emoticon = recogniseEmoji(prediction, this.options)
		// this.emoticon !== EMOJI_NEUTRAL && console.info(this.emoticon, prediction) 
	}

	/**
	 * Update visuals
	 * @param {Object} prediction data model
	 * @param {Boolean} forceRefresh forces the redraw regardless of other settings
	 * @param {Boolean} beatJustPlayed has the metronome just ticked?
	 */
	draw(prediction, forceRefresh=false, beatJustPlayed=false){
		
		if (!forceRefresh && !prediction && !this.prediction && !this.isPlayingBack)
		{
			// nothing to (re)draw so exit here
			return this.options
		}
	
		// change colour while loading
		const hue = this.hue

		// can this just be a reference???
		const options = this.options
		
		// const rightEyeClosedFor = this.isRightEyeOpen ? -1 : prediction.time - this.rightEyeClosedAt
		// const leftEyeClosedFor = this.isLeftEyeOpen ? -1 : prediction.time - this.leftEyeClosedAt
		// this.areEyesOpen 

		// allows us to use the metronome to shape the colours
		const saturation = options.saturation

		// Extra luminosity on beat just played
		const luminosity = options.luminosity + (beatJustPlayed ? 33 : 0)
		
		// update colours...
		const sl = `${saturation}%, ${luminosity}%`
		// options.dots = hue
		// options.face = `hsla(${hue},${sl},0.8)`
		options.mouth = `hsla(${(hue+30)%360},${sl},0.8)`
		options.mouthClosed = `hsla(${(hue+30)%360},${sl},0.9)`
		options.lipsUpperInner = `hsla(${(hue+50)%360},${sl},1)`
		options.lipsLowerInner = `hsla(${(hue+50)%360},${sl},1)`
		options.midwayBetweenEyes = `hsla(${(hue+270)%360},${sl},1)`
		options.leftEyeLower0 = `hsla(${(hue+300)%360},${sl},0.8)`
		options.rightEyeLower0 = `hsla(${(hue+300)%360},${sl},0.8)`
		options.pupil = "rgba(0,0,0,0.8)"
		// change eye colours if closed...?
		// options.leftEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		// options.rightEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		
		options.leftEyeIris = `hsla(${(this.isLeftEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%,${options.luminosity}%, 1)`
		options.rightEyeIris = `hsla(${(this.isRightEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%, ${options.luminosity}%, 1)`
		options.leftEyebrow = `hsla(${(this.isLeftEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%,${options.luminosity}%, 1)`
		options.rightEyebrow = `hsla(${(this.isRightEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%, ${options.luminosity}%, 1)`

		return options
	}

	moveButton(x,y,width,height){
		if (this.isUserActive)
		{
			// TODO: Profile which is faster...
			// this.button.style.setProperty(`--${this.name}-x`, bottomRight[0] )
			// this.button.style.setProperty(`--${this.name}-y`, topLeft[1] )
			// this.button.style.setProperty(`--${this.name}-w`, boxWidth )
			// this.button.style.setProperty(`--${this.name}-h`, boxHeight )			
			

			
			this.button.setAttribute( "style", `--${this.name}-x:${x};--${this.name}-y:${y};--${this.name}-w:${width};--${this.name}-h:${height};` );
			// this.button.cssText = `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};`		
	}	}

	/**
	 * Draw some text onto the screen - used to show text above users and to
	 * show debug code in realtime
	 * 
	 * @param {Object} prediction 
	 * @param {AbstractDisplay} display 
	 */
	drawText(prediction, display){

		const boundingBox = prediction.box

		const xMin = display.width - (boundingBox.xMin * display.width)
		const yMin = boundingBox.yMin * display.height

		const xMax = display.width - (boundingBox.xMax * display.width) 
		const yMax = (boundingBox.yMax * display.height) 
		
		const boxHeight = yMax - yMin
		const boxWidth = xMax - xMin
		const thirdHeadHeight = boxHeight * 0.333
		const thirdHeadWidth = boxWidth * 0.333

		const instrumentTitle = this.presetTitle ?? this.instrumentTitle

		// console.log({xMin, xMax, yMin, yMax })

		// Mouse interactions via DOM buttons
		if ( this.isMouseOver || this.instrumentLoading ){

			// draw silhoette directly on the canvas or
			// SVG shape in the button for hitarea?
			// user is interacting...
			if (this.isMouseDown && !this.instrumentLoading)
			{
				// user is holding mouse down on user...
				const remaining = 1 - this.mouseHoldProgress
				const percentageRemaining = 100 - Math.ceil(remaining*100)
				
				
				//console.error("this.isMouseHeld",this.isMouseHeld,{remaining,percentageRemaining} )
				if (this.isMouseHeld)
				{	
					// user is holding mouse down on user...
					display.drawInstrument( xMin, yMin, this.context, instrumentTitle, 'Select')			
					
					// FIXME: Do we hide the face entirely???
					// drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,0.1)`, true, false, false)
					display.drawParagraph( xMax, yMax + 40, [`Press me`], '14px' )
			
					// draw our mouse expanding circles...
					// we use CSS and it is only hidden here?
				}else{

					display.drawInstrument( xMin, yMin , instrumentTitle, `${100-percentageRemaining}`)			
					//drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,${remaining})`, true)					
					display.drawParagraph( xMax, yMax + 40, [`Hold me to see all instruments`], '14px' )		
				}

			}else{
				
				// No mouse held
				display.drawInstrument( xMin, yMin , instrumentTitle, 'Hold to choose instrument')
				//drawPart( faceOval, 4, `hsla(${hue},50%,50%,0.3)`, true)
				/*	
				const offsetX = topLeft[0]
				const offsetY = topLeft[1]
				const svgCoord = coord => `${boxWidth - (coord[0] - offsetX)} ${(coord[1] - offsetY)}`
				const svgPaths = faceOval.map( part => `L${svgCoord(part)}`)
				const circles = faceOval.map( part =>{
					const c = svgCoord(part)
					return `<circle cx="${c[0] - offsetX}" cy="${c[1]}" r="20" />`
				})
				// for outline...+ ` Z`
				const svgPath = `M${svgCoord(faceOval[0])} ` + svgPaths.join(" ")
				//  height="210" width="400"
				const silhoetteShape = 
				`<svg width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}">
					<path d="${svgPath}" />
					${circles.join('')}
				</svg>`
				//console.log("SVG",faceOval, silhoetteShape)
				this.button.innerHTML = silhoetteShape	
				*/
			}
		
		}else if (this.instrumentLoading){

			// Instrument loading...
			display.drawInstrument(xMin, yMin , instrumentTitle, 'loading...')

		}else{

			// Main data flow
			const extra = this.lastNoteFriendlyName 
			const suffix = this.singing ? `| ♫ ${this.lastNoteSound}` : this.isMouthOpen ? `<` : `-`
			// const suffix = this.singing ? MUSICAL_NOTES[this.counter%(MUSICAL_NOTES.length-1)] : this.isMouthOpen ? `<` : ` ${this.lastNoteSound}`
			
			// eye:${prediction.eyeDirection} 
			const textX = xMin + thirdHeadWidth
			const textY = yMin - thirdHeadHeight
			display.drawInstrument(textX, textY, instrumentTitle, "", '14px' )
			display.drawInstrument(textX, textY + 24, `${this.emoticon} ${extra} ${suffix}`, "", '28px' )
			
			if (this.debug )
			{
				const paragraphs = [
					`Hue:${this.defaultHue}`, 
					// `Pitch:${(prediction.pitch||0).toFixed(3)}`, 
					// `Roll:${(prediction.roll||0).toFixed(3)}`, 
					// `Yaw:${(prediction.yaw||0).toFixed(3)}`, 
					`Pitch:${(prediction.pitch||0).toFixed(3)} Roll:${(prediction.roll||0).toFixed(3)} Yaw:${(prediction.yaw||0).toFixed(3)}`,
					
					`Eyes: LEFT:${(prediction.leftEyeDirection||0).toFixed(3)} RIGHT:${(prediction.rightEyeDirection||0).toFixed(3)}`,
					
					`Gain:${(this.gainNode.gain.value||0).toFixed(2)}`, 
					
					`Happiness:${(prediction.happiness||0).toFixed(3)}`, 
					`Smirks left:${(prediction.leftSmirk||0).toFixed(3)} / right:${(prediction.rightSmirk||0).toFixed(3)}`, 
					
					`mouthOpen:${prediction.isMouthOpen} Singing:${this.singing} shape ${prediction.mouthShape}`, 
					`mouthRangeVertical:${(prediction.mouthRangeVertical||0).toFixed(3)} / mouthRatio:${(prediction.mouthRatio||0).toFixed(3)}`, 
					`mouthRangeHorizontal:${(prediction.mouthRangeHorizontal||0).toFixed(3)} / mouthRatio:${(prediction.mouthRatio||0).toFixed(3)}`, 
					`mouthWidth:${(prediction.mouthWidth||0).toFixed(3)} & mouthHeight:${(prediction.mouthHeight||0).toFixed(3)}`, 
					
					// `noseSneerLeft:${prediction.noseSneerLeft.toFixed(3)} noseSneerRight:${prediction.noseSneerRight.toFixed(3)}`,

					`eyes direction:${(prediction.eyeDirection||0).toFixed(3)} left:${(prediction.leftEye||0).toFixed(3)} right:${(prediction.rightEye||0).toFixed(3)}`,
					`eyes open :${this.areEyesOpen} left:${!prediction.leftEyeClosed} right:${!prediction.rightEyeClosed}`,
					
					// `eye closed left:${prediction.leftEyeClosed} right:${prediction.rightEyeClosed}`,
					// `dims:${(prediction.mouthRatio||0).toFixed(2)}x${(prediction.mouthRange||0).toFixed(2)}`,
					`facing ${prediction.lookingRight ? 'left' : 'right'}`,

					`note [${this.lastNoteNumber}] ${this.lastNoteName} - ${this.lastNoteSound} (${this.lastNoteFriendlyName}) Octave ${this.octave}`
				]

				display.drawParagraph( xMax, yMin + 40, paragraphs, '14px' )
				// drawText(boundingBox.topLeft[0], boundingBox.topLeft[1], extra )
			}
		}
	}

	/**
	 * Sing some songs
	 * state machine diagram :
	 * SILENT ATTACK SUSTAIN PITCH_BEND SUSTAIN DECAY RELEASE
	 * This is responsible for converting the Face Model into 
	 * a musical model that we than pass to our Audio Factory
	 * Triggered on every metronome strike
	 */
	sing(){

		// nothing to play?
		if ( !this.data )
		{
			return DEFAULT_VOICE_OPTIONS
		}

		// only change the note if not active?
		// if (active)
		// {
		// 	// return
		// }

		const played = []
		const prediction = this.data
		const options = this.options
		
		// do some checks on data to see if an event
		// should be triggered via eye left / right

		// Controls stereo pan
		const eyeDirection = prediction.eyesHorizontal

		// Controls minor / major
		const yaw = prediction.yaw
		
		// Octave control by up and down head
		// const pitchRaw = clamp(0.5 * (prediction.pitch + 1) * this.options.pitchSensitivity, 0, 1)
		// const pitch = (prediction.pitch + 1 ) / 2
		
		// -1 => +1 -> convert to 
		// ignore < -0.5 and > 0.5
		// we can exagerate a motion by amplyifying it's signal and clamping its output
		//const rollRaw = clamp((prediction.roll + 0.5) * this.options.rollSensitivity, 0, 1)
		
		const {
			octaveNumber, newOctave,
			noteNumber, noteName, noteSound, noteFloat,
			afterTouch, pitchBend,
			isMinor
		} = this.controlMode(prediction, this.options)
		
/*
		// swap em arounnd!??
		const octaveNumber = this.options.swapControls ? prediction.roll : prediction.pitch
		const noteNumber = this.options.swapControls ? prediction.pitch : prediction.roll
		
		// remap -1 -> +1 to 0 -> 1
		const noteFloat = (1 + noteNumber) * 0.5 
	
		// pitch goes from -1 -> +1 and we want to map to 1 -> 7
		// straight at screen to positive below and negative above
		const newOctave = rangeRounded( -octaveNumber , -1, 1, 1, 7 )
		

		// FIXME: if we don't want the happy notes...
		const isMinor = prediction.isFacingRight



		// eg. A1 Ab1 C3 etc
		const noteName = getNoteName(noteFloat, newOctave, isMinor)
		// eg. Do Re Mi
		const noteSound = getNoteSound(noteFloat, isMinor)
		

		const afterTouch = 0
		const pitchBend = 0



*/
		
		const hasNoteChanged = this.lastNoteName !== noteName
			
		// MIDI Note Number 0-127
		const noteNumberForMIDI = convertNoteNameToMIDINoteNumber(noteName)
	
		const friendlyNoteName = getFriendlyNoteName( noteName ) 
	
		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = Math.max(prediction.mouthRatio , prediction.happiness ) 
				
		// volume is an log of this
		const amp = clamp( easeInSine(lipPercentage), 0, 1 ) //- 0.1
		
		// you want the scale to be from 0-1 but from 03-1
		let newVolume = amp
		let note = -1
		
		// cache existing 
		this.lastNote = this.note
		this.lastNoteName = this.noteName
		this.lastNoteSound = this.noteSound 
		this.lastNoteNumber = this.noteNumber 
		this.lastNoteFriendlyName = this.noteFriendlyName
		
		// save new
		this.note = noteNumber
		this.noteName = noteName
		this.noteSound = noteSound
		this.noteNumber = noteNumberForMIDI
		this.noteFriendlyName = friendlyNoteName
		
		this.octave = newOctave

		this.defaultHue = noteNumber * this.hueRange
		
		this.saturation = 100 * lipPercentage
		// console.log("lipPercentage", lipPercentage, "amp", amp, "logAmp", logAmp, "cutOff",  options.mouthCutOff, "prediction", prediction)
		this.singing = amp >= options.mouthCutOff

		// console.log("Person", prediction.yaw , yaw)
		// console.log("singing",this.singing, {amp,cut: options.mouthCutOff,logAmp}, this)
		// console.log("Person", {lipPercentage, yaw, pitch, amp, logAmp})

		// MOUTH GATE ==========================

		// If we have an instrument and singing is enabled
		if ( this.instrument && this.singing )
		{
			// here is where we need to do our majic
			// play a note from the collection
			note = this.instrument[ noteName ]
			if (note)
			{
				played.push(note)
			}else{
				//console.log("note not found!", {noteName, roll, octave:this.octave, isMinor})
			}

			if (!this.active)
			{
				// fresh note playing
				this.active = true
				this.setState(STATE_INSTRUMENT_ATTACK)

			}else{
				
				// already playing so we continue the note
				// or if it has changed pitch, re-attack
				this.setState( hasNoteChanged ? 
					STATE_INSTRUMENT_ATTACK : 
					STATE_INSTRUMENT_SUSTAIN
				)
			}
			
			// curve
			// newVolume = options.ease( newVolume )
			// smooth (removes some clicks)
			// newVolume = Math.round( newVolume * this.precision ) / this.precision 
			// rescale for 0.3->1
			// newVolume = this.mouthScale( newVolume )
			// always prevent gain going over 1
			// increase in volume?
			// newVolume *= 0.33
			
			// newVolume = Math.round( newVolume * options.precision * 10 ) / (options.precision * 10) 
			// newVolume = parseFloat( newVolume.toFixed( options.precision)) 
			
			// send out some MIDI yum yum noteName && 
			// if (this.hasMIDI && !this.active)
			if (this.options.sendMIDI && this.hasMIDI)
			{
				// https://github.com/djipco/webmidi/blob/develop/src/Output.js
				//console.log("MIDI",amp, noteNumber, INSTRUMENT_NAMES.length, noteName, this.midiChannel)
				const midiOptions = { 
					//attack:newVolume // amp
				}

				// if all is specified - leave the channel option empty
				if (this.midiChannel !== "all")
				{
					midiOptions.channel = this.midiChannel
				}

				// https://webmidijs.org/api/classes/Output#playNote
				this.midi.playNote( noteName, midiOptions )
				//console.log(this.midi, "MIDI noteOn", noteName, "Channel:"+this.midiChannel, { newVolume, midiOptions, channel:this.midiChannel, hasMIDI:this.hasMIDI} )
	
				console.info("MIDI note on", noteName, midiOptions )
		

				if (this.isMIDIActive)
				{
					//this.midi.sendKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
					// this.midi.setPitchBend( eyeDirection )
				}else{
					this.midiActive = true
				}
				
				// // Use eye direction as a modifier for the sound
				// if (eyeDirection !== 0)
				// {
				// 	// Midi pitch bending with eyes!
				// 	// Pitch bending eyes!
				// 	//this.midi.setPitchBend( eyeDirection )
				// 	this.midi.sendKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
				// }
			}
			
			this.isMouthOpen = true
			
		}else if ( amp > options.mouthSilence && amp < options.mouthCutOff ){

			// SINGING! 
			// dampen the sound to silence
			// this.gainNode.gain.value = 0
			//const destinationVolume  = 0 // logAmp
			
			// newVolume = this.gainNode.gain.value + (destinationVolume - this.gainNode.gain.value) * options.volumeRate
			newVolume = 0
			this.isMouthOpen = true
			if (this.active)
			{
				// already playing so release it
				this.active = false
				this.setState(STATE_INSTRUMENT_DECAY)
				
			}else{

				this.setState(STATE_INSTRUMENT_RELEASE)
				// this.setState(STATE_INSTRUMENT_ATTACK)
				// this.setState(STATE_INSTRUMENT_DECAY)
				
				//&& this.midiActive If the user has stopped singing we need to stop the midi too!
				if (this.options.sendMIDI && this.hasMIDI)
				{
					// this.midi.sendClock( )
					//this.midi.setSongPosition( getBarProgress() * 16383 )
						
					if (!this.singing)
					{
						this.midi.stopNote(noteName, {
							// The velocity at which to release the note (between `0` * and `1`). If the `rawValue` option is `true`, the value should be specified as an integer
							// between `0` and `127`. An invalid velocity value will silently trigger the default of `0.5`.
							release:0.2
						})

						console.info("MIDI note off", noteName)
		
						// immediate mute, but doesn't block (sounds better)
						//this.midi.turnSoundOff()
		
						// fade out but prevents new notes...
						//this.midi.turnNotesOff()
						
						// prevent flooding the off bus
						this.midiActive = false
		
						//console.log(this.midi, "MIDI turnSoundOff", noteName, "Channel:"+this.midiChannel,{ channel:this.midiChannel, hasMIDI:this.hasMIDI, MIDIDeviceName:this.MIDIDeviceName} )
					}		
				}
			}
		
		}else{

			this.setState(STATE_INSTRUMENT_SILENT)

			// no instrument available or mouth totally closed
			newVolume = 0
			this.isMouthOpen = false
			this.active = false
			// no instruments in memory yet... play silence?
		}


		//console.log("Singing", {newOctave, newVolume, amp,isMinor, noteName, friendlyNoteName, noteSound, noteNumberForMIDI, lipPercentage, pitch, roll, rolled, eyeDirection, hasNoteChanged })


		
		// smooth this down
		// try and smooth the volume if it is fading out...
		// if ( this.gainNode.gain.value > newVolume)
		// {
		// 	// volume decrease fades
			//this.gainNode.gain.value = this.gainNode.gain.value + (newVolume - this.gainNode.gain.value) * options.volumeRate
		
		// }else{

		// 	this.gainNode.gain.value = this.gainNode.gain.value + (newVolume - this.gainNode.gain.value) * 0.9
		// 	// volume in direct
		// 	// this.gainNode.gain.value = newVolume
		// }
		// this.gainNode.gain.value = newVolume
		//console.log("Gain", this.gainNode.gain.value, "newVolume", newVolume, "Precision", this.precision )
		
		this.noteVelocity = newVolume
		this.gainNode.gain.value = newVolume

		this.yaw = yaw
		this.pitch = octaveNumber
		this.roll = noteNumber


		// TODO: Return all notes played
		return {
			played,
			yaw, 
			pitch: octaveNumber, 
			roll: noteNumber, 
			hue:this.defaultHue,

			lipPercentage,
			eyeDirection,

			octaveNumber,
			noteNumber,
			octave:newOctave,
			friendlyNoteName,
			note,
			noteNumberForMIDI,
			noteName,
			
			afterTouch,
			pitchBend,

			volume:newVolume,

			singing:this.singing,
			mouthOpen: this.isMouthOpen,
			active:this.active,
			state:this.state
		}
	}

	/**
	 * Load a sample using one of the prebuilt methods
	 * @param {String} method - name of the function to call
	 * @param {Function} progressCallback - method to invoke on loading progress
	 * @returns instrument
	 */
	async loadPresetByMethod(method="loadRandomPreset",progressCallback=null){
		
		// NB. IMMEDIATELY set this to prevent multiple calls
		this.instrumentLoadedAt = this.now

		if (method==="loadRandomPreset")
		{
			// const presets = await this.activeInstrument.getPresets()
			switch(this.playerNumber)
			{
				case 1:
					this.instrument = await this.loadPreset( getRandomHarmonicLeadPresetIndex(), null, progressCallback )
					break
				case 2:
					this.instrument = await this.loadPreset( getRandomBasslinePresetIndex(), null, progressCallback )
					break
				case 3:
					this.instrument = await this.loadPreset( getRandomBeatsPresetIndex(), null, progressCallback )
					break
				default:
					this.instrument = await this.loadPreset( getRandomLeadPresetIndex(), null, progressCallback )
			}
		}else{
				
			// this has lost it's scope...
			this.instrument = await this.activeInstrument[method]( ({progress,instrumentName}) => {
				progressCallback && progressCallback( progress )
				this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentName })
			} )
			
		}

		// preset loaded!

		// console.error(">>>>>>>>>>> Instrument loaded", { instrument:this.instrument })

		// FIXME: If automatic demo mode enabled, this will auto hide...
		this.hideForm()

		// this will repopulate the panel with correct data
		this.setupForm()
		// await this.setupForm()

		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, { instrument:this.instrument, instrumentName:this.instrument.instrumentName })
		return this.instrument
	}

	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadRandomPreset(progressCallback){
		return this.loadPresetByMethod("loadRandomPreset", progressCallback)
	}

	/**
	 * Provide this Person with a the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousPreset(progressCallback){
		return this.loadPresetByMethod("loadPreviousPreset", progressCallback)
	}

	/**
	 * Provide this Person with a the subsequent instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextPreset(progressCallback){
		return this.loadPresetByMethod("loadNextPreset", progressCallback)
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async reloadPreset(progressCallback){
		return this.loadPresetByMethod("reloadPreset", progressCallback)
	}
	
	/**
	 * Load a specific patch for this Person's active instrument
	 * TODO: Add loading events
	 * @param {String} presetName Name of the standard instrument to load
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreset(presetName, presetTitle, progressCallback){

		// const presets = this.samplePlayer.instrumentNames

		if (Number.isInteger(presetName))
		{
			const allPresets = await this.samplePlayer.getPresets()
			presetName = allPresets[presetName]
		}
		
		// always remove the suffixes?
		const instrumentNameRefined = presetName.replace("-mp3", "")

		if (!presetTitle)
		{
			presetTitle = getInstrumentTitle(presetName)
		}

		

		// console.log("Loading instrument",instrumentName, presets)

		// ensure that the instrument is accissilbe
		//const generalMIDIInstrumentId = presets.indexOf(instrumentNameRefined)
		// if ( generalMIDIInstrumentId  < 0 )
		// {
		// 	throw Error("Person.loadInstrument("+instrumentName+") failed")
		// }

		const instrumentPack = this.options.instrumentPack
		//console.log(generalMIDIInstrumentId, "Person loading instrument "+instrumentName + '>' + instrumentPack + +" via sampleplayer")
		
		const instrument = await this.samplePlayer.loadPreset(instrumentNameRefined, instrumentPack, progress => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentNameRefined })
		} )

		// just an index as to which out of all instrument data is this one
		this.instrumentPointer = this.samplePlayer.instrumentIndex
		
		this.presetTitle = presetTitle
		this.presetName = presetName

		// this will repopulate the panel with correct data
		await this.setupForm()

		this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress:1, instrumentNameRefined })
		
		// you have to dispatch the event from an element!
		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, { instrument:this.instrument, instrumentNameRefined })
		
		return instrument
	}

	/**
	 * Create the Audio wiring for this person with these options
	 * this also includes any filters and effect nodes that the
	 * other facial features can 
	 * @param {AudioContext} audioContext 
	 */
	async setupAudio(audioContext, destinationNode, offlineAudioContext=null, presetIndex=0 ){

		if (!audioContext)
		{
			throw Error("Audio Context was not provided")
		}

		if (!destinationNode)
		{
			throw Error("Destination GainNode was not provided")
		}

		this.audioContext = audioContext
		this.offlineAudioContext = offlineAudioContext
		
		// this controls the amplitude and connects to the mouth ui
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

		this.outputNode = this.gainNode

		if (this.options.drawEyebrows)
		{
			//FIXME:
			// this.eyeBrowsNode = audioContext.createBiquadFilter()
			// // TODO: Set up as a high pass filter
			// this.outputNode.connect(this.eyeBrowsNode)
			// this.outputNode = this.eyeBrowsNode

			const delayNode = audioContext.createDelay( this.options.delayLength )
			const feedbackNode = audioContext.createGain()
			delayNode.delayTime.value = 0.1
			feedbackNode.gain.value = 0.5
			// connect gain to delay (delay feeds back)
			feedbackNode.connect(delayNode)
			// connect the delay node to the output
			delayNode.connect( feedbackNode )
			// delayNode.connect( this.outputNode )


			this.eyeBrowsNode = delayNode
			this.delayNode = delayNode
			this.feedbackNode = feedbackNode

			// TODO: Set up as a high pass filter
			// for now as delay
			this.outputNode.connect(delayNode)
			this.outputNode = delayNode

			// this.eyeBrowNode = audioContext.createDynamicsCompressor()
			// this.eyeBrowNode.threshold.value = -100
			// this.eyeBrowNode.knee.value = 40
			// this.eyeBrowNode.ratio.value = 12
			// this.eyeBrowNode.attack.value = 0
			// this.eyeBrowNode.release.value = 0.25
			// this.eyeBrowNode.connect(this.eyeBrowsNode)

			// this.outputNode.connect(this.eyeBrowNode)
			
			// this.outputNode = this.eyeBrowNode
			//this.stereoNode.pan.setValueAtTime(panControl.value, this.audioContext.currentTime);
		}

		// allow stereo pannning...
		// NB. This is actually quite a greedy method
		if (this.options.stereoPan)
		{
			this.stereoNode = audioContext.createStereoPanner()
			this.outputNode.connect(this.stereoNode)
			// this.stereoNode.connect(this.outputNode)
			// this.stereoNode.connect(delayNode)
			this.outputNode = this.stereoNode

			//console.log("stereoNode", this.stereoNode.pan.value )
		}

		if (this.options.drawNose)
		{
			this.noseNode = audioContext.createDynamicsCompressor()
			// this.noseNode.threshold.value = -100
			// this.noseNode.knee.value = 40
			// this.noseNode.ratio.value = 12
			// this.noseNode.attack.value = 0
			// this.noseNode.release.value = 0.25
			this.outputNode.connect(this.noseNode)
			this.outputNode = this.noseNode
		}

		if (this.options.drawEyebrows)
		{
			this.eyeBrowsNode = audioContext.createDynamicsCompressor()
			// this.noseNode.threshold.value = -100
			// this.noseNode.knee.value = 40
			// this.noseNode.ratio.value = 12
			// this.noseNode.attack.value = 0
			// this.noseNode.release.value = 0.25
			this.outputNode.connect(this.eyeBrowsNode)
			this.outputNode = this.eyeBrowsNode
		}

		if (this.options.useDelay)
		{
			// DELAY : Feedback smooths out the audio
			const delayNode = audioContext.createDelay( this.options.delayLength )
			const feedbackNode = audioContext.createGain()
			delayNode.delayTime.value = this.options.delayTime
			feedbackNode.gain.value = this.options.feedback
			
			// connect gain to delay (delay feeds back)
			feedbackNode.connect(delayNode)
			// connect the delay node to the output
			delayNode.connect( feedbackNode )
			delayNode.connect( this.outputNode )
			// and back in tot he feedback?
			// delayNode.connect(destinationNode)
			this.outputNode = delayNode
		}


		// now connect this directly to the main mixer
		this.outputNode.connect(destinationNode)

		// TODO: 
		const samplePlayerOptions = {
			...this.options,
			offlineAudioContext,
			defaultPreset:presetIndex ?? this.options.defaultPreset ?? 0,
			defaultInstrument:this.options.defaultInstrument
		}

		const instrumentFactory = new InstrumentFactory(audioContext)
		await instrumentFactory.loadList( INSTRUMENT_LIST )

		//- instrumentFactory.loadInstrumentByName()
		//- const rompler = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_SOUNDFONT )
		const soundFontInstrument = await instrumentFactory.loadInstrumentByType( this.options.defaultInstrument ?? INSTRUMENT_TYPE_SOUNDFONT, samplePlayerOptions, 0 )	
		// const midiInstrument = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_MIDI )

		// create a sample player, oscillator add all other instruments
		this.samplePlayer = this.setMainInstrument( this.addInstrument( soundFontInstrument ))
	
		// console.warn(samplePlayerOptions.defaultPreset, "Person created with active instrument", this.activeInstrument, {options:this.options, samplePlayerOptions} )
		// this.samplePlayer = this.setMainInstrument( this.addInstrument( new SoundFontInstrument(audioContext, samplePlayerOptions) ) )
		// this.addInstrument( new OscillatorInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new WaveGuideInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new YoshimiInstrument(audioContext, this.gainNode) )
	}

	/**
	 * Inject an instrument to be used by this person
	 * @param {Instrument} instrument 
	 */
	addInstrument( instrument ){

		this.instruments.push( instrument )
		// FIXME: Also connect for changes to instrument
		return instrument
	}

	/**
	 * Add instrument to pool and set as master
	 * @param {Instrument} instrument 
	 */
	setMainInstrument( instrument ){

		// disconnect any existing
		if (this.activeInstrument)
		{
			this.activeInstrument.audioNode.disconnect(this.gainNode)
		}

		// directly to fader
		instrument.audioNode.connect(this.gainNode)
		
		// save for later reference
		this.activeInstrument = instrument

		return instrument
	}

	/**
	 * Set the MIDI channel to use for this Person
	 * @param {Function} midiDevice MIDI implementation
	 * @param {String} channel MIDI CHannel to dispatch MIDI events to
	 */
	setMIDI(midiDevice, channel="all"){
		this.midiChannel = channel
		this.midi = midiDevice
		this.midiPlayer = new MIDIInstrument(this.audioContext, midiDevice, channel)
		this.addInstrument( this.midiPlayer )
		//console.log("MIDI set for person", this, "Channel:"+channel, {midi,channel, hasMIDI:this.hasMIDI } )
	}

	/**
	 * send a single midi command to all active instruments
	 * @param {String} methodName - method to call on the instrument
	 * @param  {...any} values 
	 */
	sendMIDI( methodName="noteOn", ...values ){
		this.instruments.forEach( instrument => {
			// console.log("PLAY:", methodName, instrument, {values} )
			//instrument[methodName].apply( null, values )
		})
	}

	/**
	 * Touch BEGIN
	 * stores coordinates of the system in order for gestures
	 * @param {Event} event 
	 */
	onFaceTouchStart(event){
		// console.log("mousedown:currentTime",  audioContext.currentTime )
		event.preventDefault()

		this.mouseDownAt = this.now
		this.inputCoordinates.x = event.clientX
		this.inputCoordinates.y = event.clientY
		
		// start mouse pressure animation
		// drawMousePressure( 0, this.options.mouseHoldDuration )
	}

	/**
	 * Touch END
	 * @param {Event} event 
	 */
	onFaceTouchEnd(event){
			
		event.preventDefault()
		
		document.removeEventListener('touchend', this.onFaceTouchEnd )
		document.removeEventListener('mouseup', this.onFaceTouchEnd )

		// Gestures -----
		// if someone just keeps the finger on the screen...
		if (this.isMouseHeld)
		{	
			// should this trigger something else depending on time?
			// const elapsed = this.mouseDownFor
		
			// long press so show the form cept it shouls already be visible
			// this is called in update() via onButtonHeld()
			// this.showForm()

		}else{

			const xTravel = event.clientX - this.inputCoordinates.x
			const yTravel = event.clientY - this.inputCoordinates.y
			
			if (Math.abs(xTravel) > this.options.mouseGestureDistance)
			{
				//console.log("Swipe ", xTravel < 0 ? 'l' : 'r', xTravel)
				xTravel < 0 ? 
					this.loadPreviousPreset() : 
					this.loadNextPreset()

			}else if (Math.abs(yTravel) > this.options.mouseGestureDistance){

				//console.log("Swipe down", yTravel < 0 ? 'u' : 'd', yTravel )

			}else{

				// Quick tap so don't show the form, instead change instrument directly
				this.loadRandomPreset()
			}
		}

		// reset it
		this.mouseDownAt = -1
		this.mouseHeldAt = -1

		// drawMousePressure( 1, this.options.mouseHoldDuration )	
	}

	onButtonHeld(){
		this.mouseHeldAt = this.now
		// drawMousePressure( 1, this.options.mouseHoldDuration )
		this.showForm()
	}

	onInstrumentInput(event) {
		event.preventDefault()
		const id = event.target.id
		const value = event.target.value
		const title = event.target.textContent
		this.hideForm()
		// FIXME: load the instrument first?
		this.loadPreset(value, title ?? id)
	}

	onLeftEyeOpen( timeClosedFor ){
		// console.error( "onLeftEyeOpen", {timeClosedFor} ) 
		this.leftEyeClosedAt = -1
	}

	onLeftEyeClose( timeClosed ){
		// console.error( "onLeftEyeClose", {timeClosed} ) 
		this.leftEyeClosedAt = timeClosed
	}

	onRightEyeOpen( timeClosedFor ){
		// console.error( "onRightEyeOpen", {timeClosedFor} ) 
		
		this.rightEyeClosedAt = -1
	}

	onRightEyeClose( timeClosed ){
		// console.error( "onRightEyeClose", {timeClosed}  ) 
		
		this.rightEyeClosedAt = timeClosed
	}

	onEyesClosedForTimePeriod(){
		// console.error( "onEyesClosedForTimePeriod" ) 
		this.eyesClosed = true
		// Eyes closed for X amount of time...
		this.loadNextPreset( instrumentName => console.log("instrumentName",instrumentName ) )
	}

	/**
	 * Create the instrument panel HTML for this user's instrument
	 * Using ACTIVE instrument - don't assume it's samplePlayer
	 * and other settings specific to this person. Needs to be done per person
	 */
	async setupForm(){

		// hideExistingInstruments(this.instrumentPanel)

		if ( !this.instrumentPanel )
		{
			throw Error("Instrument panel was not registered so no instument list can be determined")
		}
		
		if ( !this.activeInstrument )
		{
			throw Error("Active Instrument was not registered so no presets can be determined")
		}
		
		if (!this.controls)
		{
			throw Error("The instrument panel is missing the required menu element")
		}
		
		// fill the sidebar with the presets from this instrument
		const presets = await populateInstrumentPanel(this.instrumentPanel, this.activeInstrument, this.name )
			
		// stupid event callback forgets scope!
		addInteractivityToInstrumentPanel( this.controls, e => this.onInstrumentInput(e) ) 

		// console.error("ADded interactivity to sidebar", this.toString(), {presets,inputs}, this.controls )

		// if the panel is not interactive yet
		// lazily instantiate the connection
		if (!this.isInstrumentPanelInteractive)
		{
			// add some extra UX improvements for the sliding panel
			createDraggablePanel(this, this.instrumentPanel, this.isLeftSidePanel)
			this.instrumentPanel.hidden = false
			this.isInstrumentPanelInteractive = true
		}

		return true
	}

	/**
	 * This pops up the user side bar control panel
	 */
	showForm(){
		if (!this.isFormShowing)
		{
			this.isFormShowing = showPersonalControlPanel( this.name, this.instrumentPanel, this.instrumentName )
		}else{
			console.error("was told to open form that is already open")
		}
	}

	/**
	 * Hide this Person's control panel form
	 */
	hideForm(){
		// console.error( "sidebar hiding...", this.name, "closing side bar", this.name, this.instrumentPanel )
		this.isFormShowing = hidePersonalControlPanel( this.name, this.instrumentPanel )
	}

	/**
	 * Hide / Show the Person's control panel form
	 */
	toggleForm(){
		if (this.isFormShowing)
		{
			this.hideForm()
		}else{
			this.showForm()
		}
	}

}