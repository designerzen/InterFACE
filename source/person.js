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
	NAMES,
	IDENTIFIERS
} from './settings/options'

import { toKebabCase } from "./utils/utils.js"
import { rescale, lerp, clamp, range, rangeRounded, HALF_PI } from "./maths/maths.js"
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad, easeInQuad} from "./maths/easing.js"
import { now } from "./timing/timing.js"

// all the different instruments come through the instrument factory!
import MIDIInstrument from './audio/instruments/instrument.midi.js'

// default instruments
import { 
	INSTRUMENT_TYPE_SOUNDFONT,
	INSTRUMENT_TYPE_OSCILLATOR, 
	INSTRUMENT_TYPE_MIDI, 
	INSTRUMENT_TYPE_CHORD
} from './audio/instrument-list.js'

import InstrumentManager from './audio/instrument-manager.js'
// import INSTRUMENT_LIST from './assets/audio/instrument-list.json'

// Notes, scales and keys
import Arpeggio from './audio/arpeggio.js'
import { createKey, FIFTHS_SCALE_KEYS, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS } from './audio/tuning/keys.js'
import { MAJOR_CHORD_INTERVALS, MINOR_CHORD_INTERVALS } from './audio/tuning/chords.js'
import { 
	convertNoteNameToMIDINoteNumber, 
	getNoteText, getNoteName, getNoteSound, getFriendlyNoteName, 
	NOTES_ALPHABETICAL, 
	MIDI_NOTE_NUMBERS,
	GENERAL_MIDI_BY_NAME,
	getNoteSoundFromNumber,
	convertMIDINoteNumberToName
} from './audio/tuning/notes.js'
import { 
	getGeneralMIDIInstrumentFolders, getInstrumentTitle, 
	getRandomBasslinePresetIndex, getRandomBeatsPresetIndex, getRandomHarmonicLeadPresetIndex, getRandomLeadPresetIndex 
} from './audio/sound-font-instruments.js'
import { GENERAL_MIDI_INSTRUMENT_LIST } from "./audio/midi/general-midi.constants"

import { 
	convertHeadOrientationIntoNoteData, 
	convertHeadRollToOctaveAndPitchToScaleAndYawToPitch, 
	convertHeadRollToScaleAndPitchToOctaveAndYawToPitch 
} from './person.controls.js'

import { ParamaterRecorder } from './parameter-recorder.js'

// UI
import { addInteractivityToInstrumentPanel, createDraggablePanel, hideExistingInstruments, hidePersonalControlPanel, populateInstrumentPanel, showPersonalControlPanel } from "./dom/ui.panel-instruments.js"
import { drawMousePressure } from './dom/mouse-pressure.js'

// Models
import { recogniseEmojiFromFaceModel } from './models/emoji-detection.js'
import { EMOJI_CAT_KISSING, EMOJI_KISS, EMOJI_KISS_EYES_CLOSED, EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED, EMOJI_KISSING_WINK, EMOJI_MASK, EMOJI_NEUTRAL } from './models/emoji.js'

import { getMusicalDetailsFromEmoji } from './models/emoji-to-music.js'
import { createInstrumentFromData } from './audio/instrument-factory.js'

// States for the audio controlled by the face
export const STATE_INSTRUMENT_SILENT = "instrument-not-playing"
export const STATE_INSTRUMENT_ATTACK = "instrument-attack"
export const STATE_INSTRUMENT_SUSTAIN = "instrument-sustain"
export const STATE_INSTRUMENT_PITCH_BEND = "instrument-pitchbend"
export const STATE_INSTRUMENT_DECAY = "instrument-decay"
export const STATE_INSTRUMENT_RELEASE = "instrument-release"

// Dispatched events that each person creates
export const EVENT_INSTRUMENT_CHANGED = "instrument-changed"
export const EVENT_INSTRUMENT_LOADING = "instrument-loading"
export const EVENT_PERSON_BORN = "person-born"
export const EVENT_PERSON_DEAD = "person-dead"

// varieties of users (tie them into PlayerNumbers)
export const PERSON_TYPE_CHROMATIC = 0
export const PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS = 1
export const PERSON_TYPE_ARPEGGIO = 2
export const PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS = 3

/*
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
// equalpower 
const PANNING_MODEL = "HRTF"
// This can only be set to linear, inverse, or exponential
const PANNING_DISTANCE_MODEL = "linear"
const PANNING_MAX_DISTANCE = 10000
const PANNING_REF_DISTANCE = 1
// Then there's the roll-off factor (rolloffFactor) — how quickly does the volume reduce as the panner moves away from the listener. The default value is 1; let's make that a bit bigger to exaggerate our movements.
const PANNING_ROLL_OFF = 1 // 10
*/


/**
 * Pass in a person's index to get an instrument preset
 * for that specific layer of the music
 * @param {Number} personIndex 
 * @returns {Preset}
 */
export const getRandomPresetForPerson = (personIndex) => {
	switch(personIndex)
	{
		case 1:
			return getRandomHarmonicLeadPresetIndex()
		case 2:
			return getRandomBasslinePresetIndex()
		case 3:
			return getRandomLeadPresetIndex()
		default:
			return getRandomBeatsPresetIndex()
	}
}	 



const createHSLA = (hue, saturation, luminosity, alpha=1) => {
	return `hsla(${hue%360},${saturation}%,${luminosity}%,${1-alpha})`
}

export default class Person{

	id
	name = "unamed"

	playerNumber = -1
	createdAt = -1

	audioContext
	offlineAudioContext

	// instances
	midiPlayer
	chordPlayer
	
	// the :-) that represents this person!
	emoticon = EMOJI_NEUTRAL
	playingEmoticon = EMOJI_NEUTRAL
	lastEmoticon = EMOJI_NEUTRAL

	activeInstrument

	instruments = []
	
	instrumentPointer = 0
	instrumentLoadedAt = -1
	presetName
	presetTitle

	presetPanelConnection
	
	// default state is audio off
	state = STATE_INSTRUMENT_SILENT
	type = PERSON_TYPE_ARPEGGIO

	// Flags
	useArpeggio = false
	active = false
	singing = false

	isMouthOpen = false
	isLeftEyeOpen = true
	isRightEyeOpen = true

	// is the user moving around
	isUserActive = true

	// if we are repeating our bars...
	isLooping = false
	// if we are watching the face perform without interaction
	isPlayingBack = false
	// is the instrument panel selection form visibile
	isFormShowing = false
	// is the MIDI port active?
	isMIDIActive = false

	// istrument panel connected
	isInstrumentPanelInteractive = false

	// 
	isSelected = false
	
	// Head orientation
	yaw = 0
	pitch = 0
	roll = 0

	// bouding box
	box = null

	// we can use external inputs here and store the dispatcher here
	gamePad

	// internal person frame counter
	counter = 0
	tracks = 0
	octave = 4

	// MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS
	leftFacingKeys = FIFTHS_SCALE_KEYS
	rightFacingKeys = FIFTHS_SCALE_KEYS

	pitchBendValue = 1

	// all playiong
	activeNotes = new Map()

	// now playing
	note = -1
	noteName = "C4"
	noteSound = "-"
	noteNumber = -1
	noteFriendlyName = "C-4"
	noteVelocity = 0
	noteIndex = 0

	arpeggio

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
	delayNode
	eyeBrowsNode	// highpass filter
	noseNode		// compressor

	// these are the mechanisms to control the music
	// and can be set on a per user basis depending on their input needs
	// controlMode = convertHeadOrientationIntoNoteData
	// controlMode = convertHeadRollToScaleAndPitchToOctaveAndYawToPitch
	// controlMode = convertHeadRollToOctaveAndPitchToScaleAndYawToPitch
	controlMode = convertHeadOrientationIntoNoteData

	/**
	 * 
	 */
	get boundingBox(){
		return this.box
	}

	get x(){ return this.box ? this.box.xMin : -1 }
	get y(){ return this.box ? this.box.yMin : -1 }

	get centerX(){
		return this.box ? this.box.xMax - this.box.xMin : -1
	}

	get centerY(){
		return this.box ? this.box.yMax - this.box.yMin : -1
	}

	/**
	 * Does this user have an active instrument that can be played?
	 */
	get hasInstrument(){
		return this.activeInstrument //&& this.activeInstrument.isLoaded
	}

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

	get isKissing(){
		switch(this.emoticon)
		{
			case EMOJI_KISS:
			case EMOJI_KISSING_WINK:
			case EMOJI_CAT_KISSING:
			case EMOJI_KISS_EYES_CLOSED:
			case EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED:
				return true
			default:
				return false
		}
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
		return `.${this.id}-controls`
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
		return `.${this.id}-panel`
	}

	/**
	 * Fetch the form controls on the DOM that matches this Person
	 * @returns {HTMLElement} Form element for this Person
	 */
	get instrumentPanel (){
		return document.querySelector(this.panelID)
	}

	get faceButton(){
		return document.getElementById(this.id)
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
	 * is a sample based instrument loading still?
	 * @returns {Boolean} are samples loading
	 */
	get instrumentLoading(){
		return this.activeInstrument ? this.activeInstrument.isLoading : true
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
	 * Is this person alive or dead
	 */
	get alive(){
		return this.createdAt > -1
	}

	/**
	 * How many milliseconds has this person been "dead"
	 */
	get aliveForDuration(){
		return this.createdAt > -1 ? 
			this.now - this.createdAt :
			0
	}

	/**
	 * Is this person alive or dead?
	 */
	get dead(){
		return this.createdAt < 0
	}

	/**
	 * How long does dying take?
	 */
	get dying(){
		return this.deadForDuration < this.options.timeToDie
	}

	/**
	 * How much longer will this person be alive
	 * @return {Number}
	 */
	get percentageDead(){
		
		const percentage = this.deadForDuration / this.options.timeToDie
		// clamp to 0->1
		return percentage < 0 ? 0 : percentage > 1 ? 1 : percentage 
	}

	/**
	 * How many milliseconds has this person been "dead"
	 * @return {Number}
	 */
	get deadForDuration(){
		if (this.createdAt === -1)
		{
			return -1
		}
		if (this.createdAt > -1)
		{
			return 0
		}
		return this.now + this.createdAt
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
			this.defaultHue + (90+this.counter % this.hueRange) : 
			this.defaultHue
	}

	/**
	 * Get's the hue but as a colour
	 */
	get hsl(){
		return `hsl(${this.hue},${this.saturation}%,${this.luminosity}%)`
	}
	
	/**
	 * Get's the hue but as an opacity based colour
	 * Selected person is always brighter and more saturated
	 */
	get hsla(){
		const opacity = this.isSelected ? 1 : 0.4-this.percentageDead*0.5
		const saturation = this.isSelected ? 100 : this.saturation
		return `hsla(${this.hue},${saturation}%,${this.luminosity}%,${opacity})`
	}

	/**
	 * Is the user's side panel on the left or right?
	 * Users A and C go left, B and D go right
	 */
	get isLeftSidePanel(){
		// 0 and 2 are left side
		return this.playerNumber%2 === 0
	}
	
	/**
	 * The current preset instrument name
	 */
	get currentPreset(){
		return this.presetName 
	}
	
	/**
	 * @return {String}
	 */
	get currentPresetTitle(){
		return this.presetTitle ?? (this.activeInstrument ? this.activeInstrument.activePreset : 'Unloaded' )
	}

	/**
	 * 
	 * @param {Number} index 
	 * @param {Object} options 
	 * @param {Boolean} saveData 
	 */
	constructor( index, options={}, saveData=undefined ) {
		
		this.options = Object.assign({  }, DEFAULT_PERSON_OPTIONS, options)
		// ensure that the name is all lower case and kebabed
		this.id = IDENTIFIERS[index]
		// this.id = toKebabCase( IDENTIFIERS[index] ?? "person-" + index )
		this.name = NAMES[index]

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
				
				// force scope
				this.onFaceTouchStart = this.onFaceTouchStart.bind(this)
				this.onFaceTouchEnd = this.onFaceTouchEnd.bind(this)

				// Face button events
				this.button.addEventListener( 'pointerdown', this.onFaceTouchStart )

				this.button.addEventListener( 'pointerenter', event => {
					this.isMouseOver = true
				})

				this.button.addEventListener( 'pointerleave', event => {
					this.isMouseOver = false
				})

				this.button.addEventListener( 'pointercancel', event => {
					this.isMouseOver = false
				})

				this.instrumentLoadedAt = this.now
			// })
		}else{
			// console.warn(`Created Person "${name}" but could not find associated markup #${name}`)
			throw Error(`Created Person "${name}" but could not find associated markup #${name}`)
		}

		if (this.options.debug){
			console.info("Person "+this.name+" options", this.options)
		}

		//console.log("Created new person", this, "connecting to", destinationNode )
	}

	/**
	 * Proxy for the button events
	 */
	addListener(){
		return this.button.addEventListener(...arguments)
	}

	/**
	 * After a user has left the active area, we must
	 * reset all the states back to their correct 
	 * start values
	 */
	reset(){
		this.isUserActive = true
		this.isMouthOpen = false
		this.isLeftEyeOpen = true
		this.isRightEyeOpen = true
		this.singing = false
		this.active = false
		this.state = STATE_INSTRUMENT_SILENT

		this.yaw = 0
		this.pitch = 0
		this.roll = 0

		this.leftEyeClosedAt = -1
		this.rightEyeClosedAt = -1
		this.eyesClosed = false
		this.emoticon = EMOJI_NEUTRAL
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
	 * @param {Object} data
	 * @param {String} prefix
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
			this.id+'-'

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
			this.id+'-'

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
		return `Person(${this.id})`
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
	 * Person was created then left, so kill it
	 */
	setAsLost(){
		// only kill if not already dead?
		if (this.createdAt < -1)
		{
			// return if actually dead or just dying!
			return this.percentageDead === 1
		}
	
		this.createdAt = -this.now
		// return if actually dead or just dying!

		// console.info("Person lost", this)
		this.active = false
		this.setState(STATE_INSTRUMENT_SILENT)
		this.onLost()
		return false
	}

	// --- GUI --------------------------------------------------------------

	/** 
	 * Update Person's Memory state
	 * Cache data for use in processing later
	 * @param {Object} prediction data model
	 */
	update(prediction, timeNow, forceRefresh=false){
		
		const boundingBox = prediction.box
		
		this.counter++
		this.box = prediction.box

		// resurrect the dead
		if (this.createdAt === -1)
		{
			this.createdAt = timeNow
			this.onBirthed()
		}
		else if (this.percentageDead  === 1)
		{
			// if a user is lost, then we slowly kill them until they are dead
			console.info("dead", this.deadForDuration, this.createdAt )
			this.onDead()

		}else if (this.deadForDuration  > 0){
			
			// console.info(this.percentageDead, "dying", this.deadForDuration, this.createdAt )
		}
		
		// reuse old prediction aka refresh
		if (!prediction || forceRefresh)
		{
			prediction = this.data
		}

		// cache all data
		this.data = prediction
		this.lastTimeActive = timeNow

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

	
		this.eyeDirection = prediction.eyeDirection

		// stereo eye panning
		if (this.options.stereoPan && this.stereoNode)
		{
			// -1 -> +1
			this.stereoNode.pan.value = prediction[this.options.stereoController] * -1
		}

		if (this.options.pitchBend && this.pitchBendValue && this.activeInstrument)
		{
			this.activeInstrument.pitchBend( this.pitchBendValue )
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
			
		// durations that things have been closed for
		const rightEyeClosedFor = this.isRightEyeOpen ? -1 : prediction.time - this.rightEyeClosedAt
		const leftEyeClosedFor = this.isLeftEyeOpen ? -1 : prediction.time - this.leftEyeClosedAt
		const eyesClosedFor = this.instrumentLoading || this.isRightEyeOpen || this.isLeftEyeOpen ? -1 : Math.min(leftEyeClosedFor, rightEyeClosedFor)

		// update any eye states
		// FIXME: Smooth these out either here or directly in model
		if (this.isLeftEyeOpen === prediction.leftEyeClosed)
		{
			// eye state changed
			this.isLeftEyeOpen = !prediction.leftEyeClosed
			if (prediction.leftEyeClosed)
			{
				this.leftEyeClosedAt = prediction.time 
				this.onLeftEyeClose( prediction.time )
			}else{
				this.leftEyeClosedAt = -1
				this.onLeftEyeOpen( leftEyeClosedFor )
			}
		}

		if (this.isRightEyeOpen === prediction.rightEyeClosed)
		{
			// eye state changed
			this.isRightEyeOpen = !prediction.rightEyeClosed
			if (prediction.rightEyeClosed)
			{		
				this.rightEyeClosedAt = prediction.time
				this.onRightEyeClose( prediction.time )
				
			}else{

				this.rightEyeClosedAt = -1
				this.onRightEyeOpen( rightEyeClosedFor )
			}
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
			// console.info("closed eyes!", {leftEyeClosedFor, rightEyeClosedFor, eyesClosedFor })
		}else if(leftEyeClosedFor > -1 || rightEyeClosedFor > -1){
			// console.info(prediction.time, "one closed eyes", this.isLeftEyeOpen, leftEyeClosedFor,this.isRightEyeOpen, rightEyeClosedFor, eyesClosedFor ) 
		}else{
			//console.info(prediction.time)
		}

		

		// const emoji = recogniseEmoji(this)
		// options.mouthCutOff
		this.emoticon = recogniseEmojiFromFaceModel(prediction, this.options)
		// console.info("Emoticon", this.emoticon, {prediction})
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
		// const col = 
		// options.dots = hue
		// options.face = `hsla(${hue},${sl},0.8)`
		options.mouth = createHSLA(hue+30, saturation, luminosity, 1-this.percentageDead ) 
		// options.mouth = `hsla(${(hue+30)%360},${sl},0.8)`
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
			// this.button.style.setProperty(`--${this.id}-x`, bottomRight[0] )
			// this.button.style.setProperty(`--${this.id}-y`, topLeft[1] )
			// this.button.style.setProperty(`--${this.id}-w`, boxWidth )
			// this.button.style.setProperty(`--${this.id}-h`, boxHeight )			
			this.button.setAttribute( "style", `--${this.id}-x:${x};--${this.id}-y:${y};--${this.id}-w:${width};--${this.id}-h:${height};` );
			// this.button.cssText = `--${this.id}-x:${bottomRight[0]};--${this.id}-y:${topLeft[1]};--${this.id}-w:${boxWidth};--${this.id}-h:${boxHeight};`		
	}	}

	/**
	 * Draw some text onto the screen - used to show text above users and to
	 * show debug code in realtime
	 * 
	 * @param {Object} prediction 
	 * @param {AbstractDisplay} display 
	 */
	drawText(prediction, display, showBackground=true ){

		const boundingBox = prediction.box

		const xMin = display.width - (boundingBox.xMin * display.width)
		const yMin = boundingBox.yMin * display.height

		const xMax = display.width - (boundingBox.xMax * display.width) 
		const yMax = (boundingBox.yMax * display.height) 
		
		const boxHeight = yMax - yMin
		const boxWidth = xMax - xMin
		const thirdHeadHeight = boxHeight * 0.333
		const thirdHeadWidth = boxWidth * 0.333
		const halfHeadWidth = boxWidth * 0.333

		const instrumentTitle = this.instrumentTitle // this.currentPresetTitle ?? this.presetTitle ?? this.instrumentTitle ?? this.activeInstrument.toString() 
		
		// as this should never be negative, we can use this to offset the text
		const textX = xMin + halfHeadWidth - 9
		const textY = Math.max(0, yMin - thirdHeadHeight - 22)

	
		// draw a background for the text
		if (showBackground)
		{
		// 	display.drawRectangle( textX, textY - 25, boxWidth, 40, 4, "rgba(28, 75, 85, 0.13)", "rgba(255,255,255,0.5)" )
		}


		// Draw Bounding Box
		// display.drawRectangle( xMin, yMin, boxWidth, boxHeight, 4, "rgba(255,0,0,0.5)", "rgba(255,255,255,0.5)" )

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
					display.drawInstrument( xMin, yMin - 25, this.context, instrumentTitle, 'Select')			
					
					// FIXME: Do we hide the face entirely???
					// drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,0.1)`, true, false, false)
					display.drawParagraph( xMax, yMax + 15, [`Press me`], 9 )
			
					// draw our mouse expanding circles...
					// we use CSS and it is only hidden here?
				}else{

					display.drawInstrument( xMin, yMin - 25 , instrumentTitle, `${100-percentageRemaining}`)			
					//drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,${remaining})`, true)					
					display.drawParagraph( xMax, yMax + 15, [`Hold me to see all instruments`, `Tap to select a random one`], 11 )
				}

			}else{
				
				// No mouse held
				display.drawInstrument( textX, textY, instrumentTitle, "", 14)
				display.drawParagraph(textX - 66, textY + 22, ['        PRESS & HOLD', 'to choose instrument'], 12 )		
				// display.drawParagraph( xMax, textY + 40, [`Tap to select a random one`], '9px' )		
				// display.drawInstrument(textX, textY + 24, "Press & Hold", "", '28px' )
				// display.drawInstrument(textX - 10, textY + 24, "to choose instrument", "", '28px' )
			
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
			display.drawInstrument(textX, textY, instrumentTitle, 'Loading...', 9 )

		}else{

			// Main data flow
			const playsChords = this.activeInstrument ? this.activeInstrument.playsChords : false
			const arpeggiated = this.activeInstrument ? this.activeInstrument.arpeggiate : false
			let extra = ""
			if (playsChords && !arpeggiated)
			{
				const chord =this.activeInstrument.notes.keys()
				chord.forEach( (noteName, i) => {
					extra += convertMIDINoteNumberToName(noteName) + " "
				})
			}else{
  				extra = this.noteFriendlyName 
			}

			let style = ""
			switch (this.type)
			{
				case PERSON_TYPE_ARPEGGIO:
					style = "𝆃"
					break

				case PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS:
					style = "〇"
					break

				case PERSON_TYPE_CHROMATIC:
					style = "12"
					break
						
				case PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS:
				default:
					style = "⬠"
					break
			}

			const suffix = this.singing ? 
				`${this.name} ${style} ♫ ${this.noteSound}` : 
				this.isMouthOpen 
					? `${this.name} <` : `${this.name}` 
					
			// const suffix = this.singing ? MUSICAL_NOTES[this.counter%(MUSICAL_NOTES.length-1)] : this.isMouthOpen ? `<` : ` ${this.lastNoteSound}`
			const bend = this.pitchBendValue && this.pitchBendValue !== 1 ? " / ↝ "+(Math.ceil(this.pitchBendValue* 100) - 100) : ""
			const emojiRotationZ = (prediction.roll * Math.PI * 0.28) - HALF_PI
			
			// wecan skip this if it looks too ugly
			const pitch = 1 - Math.abs(prediction.pitch)
			const yaw = 1 - Math.abs(prediction.yaw) 

			// we want something floating around the 1.0 area
			const emojiRotationY = 0.8 + pitch * 0.2 
			const emojiRotationX = 0.75 + easeInSine(yaw) * 0.25	// up and down
			
			// console.info("emojiRotationX", emojiRotationX, "emojiRotationY: ",emojiRotationY) 

			const instrumentText = suffix ? `${extra} ${suffix}${bend}` : extra

			display.drawInstrument(textX, textY - 50, instrumentTitle, this.isSelected ? `*` : "", 10 )			
			// display.drawInstrument(textX, textY + 26, `${this.emoticon} ${extra} ${suffix}${bend}`, "", '28px' )
			
			display.drawText(textX, textY - 30, instrumentText, 18 )
			
			// Left Side Note
			// display.drawText(textX + 42, textY, this.lastNoteFriendlyName, 24, "left" )
			// Right Side Octave?
			// display.drawText(textX + 25, textY, this.octave, 24 )

			//  5 * -prediction.pitch
			
			// draw emoticon but we move it up and down when it looks up and down too
			display.drawEmoticon( textX, textY + 39 , this.emoticon, emojiRotationZ, emojiRotationY, emojiRotationX, this.noteIndex, false )
			
			if (this.debug )
			{
				let paragraphs
				 
				if (!this.activeInstrument)
				{
					paragraphs = [
						`Instrument:UNLOADED`,
						`Preset: ${this.currentPresetTitle} (${this.currentPreset})`,
						`MIDI: ${this.hasMIDI ? this.MIDIDeviceName : 'not connected'}`,
						`State: ${this.state}`,
						`Mouse down for ${this.mouseDownFor.toFixed(2)}ms`
					]

				}else{
					
					paragraphs = [
						this.playingEmoticon,
						`${this.activeInstrument.toString()}`,

						`Note [${this.lastNoteNumber}] ${this.lastNoteName} - ${this.lastNoteSound} (${this.lastNoteFriendlyName}) Octave ${this.octave}`,

						`PitchBend : ${this.pitchBendValue.toFixed(2)} ${this.useArpeggio ? 'ARPEGGIO' : ''} ${this.isSinging ? 'SINGING' : ''}`,
						`Hue:${this.defaultHue}`, 
						// `Pitch:${(prediction.pitch||0).toFixed(3)}`, 
						// `Roll:${(prediction.roll||0).toFixed(3)}`, 
						// `Yaw:${(prediction.yaw||0).toFixed(3)}`, 
						`Pitch:${(prediction.pitch||0).toFixed(3)} Roll:${(prediction.roll||0).toFixed(3)} Yaw:${(prediction.yaw||0).toFixed(3)}`,
						
						`Eyes: LEFT:${(prediction.leftEyeDirection||0).toFixed(3)} RIGHT:${(prediction.rightEyeDirection||0).toFixed(3)}`,
						
						`State: ${this.state} / Singing : ${this.singing}`,
						
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
						`facing ${prediction.lookingRight ? 'left' : 'right'}`
					]
				}

				display.drawParagraph( xMax, yMin + 40, paragraphs, 9 )
				// drawText(boundingBox.topLeft[0], boundingBox.topLeft[1], extra )
			}
		}
	}

	// --- AUDIO --------------------------------------------------------------

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
		// const rollRaw = clamp((prediction.roll + 0.5) * this.options.rollSensitivity, 0, 1)
		
		const noteData = this.controlMode(prediction, this.options)
		const { afterTouch, pitchBend, isMinor } = noteData
		let { octaveNumber, newOctave, noteNumber} = noteData

		// to convert the note into circle of fifths...
		const hasNoteChanged = this.lastNote !== noteNumber
		// const hasNoteChanged = this.lastNoteName !== noteName
	
		// remap -1 -> +1 to 0 -> 1
		let noteFloat = (1 + noteNumber) * 0.5 
				

		// eg. A1 Ab1 C3 etc
		// if we want a circle-of-fifths style we can use the scales here
		let noteName = getNoteName(noteFloat, newOctave, isMinor, this.leftFacingKeys, this.rightFacingKeys )

		// MIDI Note Number 0-127
		let noteNumberForMIDI = convertNoteNameToMIDINoteNumber(noteName)
		
		// eg. Do Re Mi
		// let noteSound = getNoteSound(noteFloat, isMinor)	
		let noteSound = getNoteSoundFromNumber(noteNumberForMIDI)	
		
		// convert that one note into a chord
		const chords = getMusicalDetailsFromEmoji(noteNumberForMIDI, this.emoticon)
		// const chord = chords.get("major").get(0)

		// for the next note  0 -> 2 : 0.5 -> 1.5
		this.pitchBendValue = 1 + ((pitchBend-1) * 0.5)
	
		// save position on the keyboard for visual purposes ONLY
		this.noteIndex = Math.round(noteFloat * 12)

		// console.info( "noteData", {noteFloat, noteSou nd, noteName, octaveNumber, newOctave, noteNumber, afterTouch, pitchBend, isMinor, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS, hasNoteChanged }, this.pitchBendValue )
		
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
*/
		
		
		// Set the root node in the arpeggio and reset the position...
		if (this.useArpeggio && hasNoteChanged)
		{
			// update the arpeggio
			// this.arpeggio.tonic = noteNumber
			const forumla = isMinor ? MINOR_CHORD_INTERVALS : MAJOR_CHORD_INTERVALS
			const mode = 0

			this.arpeggio.setAllParameters( noteNumberForMIDI, forumla, mode )

			//console.info("useArpeggio", this.arpeggio.sequence, {noteNumberForMIDI, forumla, mode, noteName}, this.lastNote , noteNumber )

			// const noteName = getNoteName(noteFloat, newOctave, isMinor, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS)
			// // eg. Do Re Mi
			// const noteSound = getNoteSound(noteFloat, isMinor)	
			// // remap -1 -> +1 to 0 -> 1
			// const noteFloat = (1 + noteNumber) * 0.5 
	
			// noteNumber, noteName, noteSound, noteFloat,
		}else if (this.useArpeggio){

			// note hasn't changed so let's get the next arpeggio note...
			// noteNumber = 
			noteNumberForMIDI = this.arpeggio.next()
			//console.info("Arpeggio",  this.arpeggio.sequence, noteNumberForMIDI )
		}
		
		// now fetch the other data...
		const noteObject = GENERAL_MIDI_BY_NAME.get(noteNumberForMIDI)
		const friendlyNoteName = getFriendlyNoteName( noteName ) 
	
		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = Math.max(prediction.mouthRatio , prediction.happiness ) 
				
		// volume is an log of this
		const amp = clamp( easeInSine(lipPercentage), 0, 1 ) * (1 - this.percentageDead ) //- 0.1
		
		// console.info( "Sing emotion",this.emoticon, { chords, noteName, noteSound, pitchBend, 
		// 	octaveNumber, newOctave,
		// 	noteNumber,
		// 	noteName,
		// 	noteSound,
		// 	noteNumberForMIDI,
		// 	friendlyNoteName, noteObject
		// })

		
		// you want the scale to be from 0-1 but from 03-1
		let newVolume = amp
		let note = -1
		
		// cache existing 
		this.lastNote = this.note
		this.lastNoteName = this.noteName
		this.lastNoteSound = this.noteSound 
		this.lastNoteNumber = this.noteNumber 
		this.lastNoteFriendlyName = this.noteFriendlyName
		this.lastEmoticon = this.playingEmoticon

		// save new
		this.note = noteNumber
		this.noteName = noteName
		this.noteSound = noteSound
		this.noteNumber = noteNumberForMIDI
		this.noteFriendlyName = friendlyNoteName
		this.playingEmoticon = this.emoticon

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
		if ( this.activeInstrument && this.singing )
		{
			// here is where we need to do our majic
			// play a note from the collection
			note = this.activeInstrument[ noteName ]
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
	
				// console.info("MIDI note on", noteName, midiOptions )
		

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

						// console.info("MIDI note off", noteName)
		
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
			this.pitchBendValue = 1
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

	async setupInstrumnentForm(presetTitle,presetName,details ){

		// just an index as to which out of all instrument data is this one
		this.instrumentPointer = this.activeInstrument.instrumentIndex
		
		// overwrite the instrument info
		this.presetTitle = presetTitle
		this.presetName = presetName

		// console.error("setupInstrumnentForm", presetTitle, presetName, details )
		
		// FIXME: If automatic demo mode enabled, this will auto hide...
		this.hideForm()

		// this will repopulate the panel with correct data
		await this.setupForm()

		// you have to dispatch the event from an element!
		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, details )
		
	}

	/**
	 * Load a sample using one of the prebuilt methods
	 * @param {String} method - name of the function to call
	 * @param {Function} progressCallback - method to invoke on loading progress
	 * @returns instrument
	 */
	async loadPresetByMethod(method="loadRandomPreset", progressCallback=null){
		
		// NB. IMMEDIATELY set this to prevent multiple calls
		this.instrumentLoadedAt = this.now

		if (method==="loadRandomPreset")
		{
			const randomPresetName = getRandomPresetForPerson(this.playerNumber)
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress:0, instrumentName:randomPresetName })
			this.activeInstrument = await this.loadPreset( randomPresetName,  null, progressCallback )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress:1, instrumentName:randomPresetName })
			
			// console.info("Person "+this.playerNumber+" instrument changed", this.activeInstrument )
		}else{
				
			// this has lost it's scope...
			this.activeInstrument = await this.activeInstrument[method]( ({progress,instrumentName}) => {
				progressCallback && progressCallback( progress )
				this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentName })
			} )
			
		}

		// preset loaded!

		//console.error(">>> Instrument", method,{ instrument:this.activeInstrument })

		// FIXME: If automatic demo mode enabled, this will auto hide...
		this.hideForm()

		// this will repopulate the panel with correct data
		await this.setupForm()
		// await this.setupForm()

		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, { instrument:this.activeInstrument, instrumentName:this.activeInstrument.instrumentName })
		return this.activeInstrument
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
	 * @param {String} presetName Name of the standard instrument to load
	 * @param {String} presetTitle Title of the standard instrument to load
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreset(presetName, presetTitle, progressCallback){

		// const presets = this.samplePlayer.instrumentNames

		if (!this.activeInstrument)
		{
		   throw Error("Person.loadPreset("+presetName+") failed, no active instrument")  
		}

		if (Number.isInteger(presetName))
		{
			const allPresets = await this.activeInstrument.getPresets()
			presetName = allPresets[presetName]
		}
		
		// always remove the suffixes?
		const instrumentNameRefined = presetName.replace("-mp3", "")

		// if there is no title set, it can mean that either :
		// a. this preset is NOT one of the instruments
		// b. the preset is passed in as a number
		if (!presetTitle)
		{
			presetTitle = getInstrumentTitle(presetName) ?? presetName
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
		
		const details = { instrumentName:instrumentNameRefined, instrumentPack }

		const instrument = await this.activeInstrument.loadPreset(instrumentNameRefined, instrumentPack, progress => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, {...details, progress})
		} )

		await this.setupInstrumnentForm(presetTitle, presetName, details)
		return this.activeInstrument
	}

	/**
	 * Create the Audio wiring for this person with these options
	 * this also includes any filters and effect nodes that the
	 * other facial features can 
	 * @param {AudioContext} audioContext 
	 */
	async setupAudio(audioContext, destinationNode, instrumentManager, offlineAudioContext=null, presetIndex=0 ){

		if (!audioContext)
		{
			throw Error("Audio Context was not provided")
		}

		if (!destinationNode)
		{
			throw Error("Destination GainNode was not provided")
		}

		const instrumentFactory = instrumentManager.factory
		if (!instrumentFactory)
		{
			throw Error("An InstrumentFactory instance was not provided")
		}

		this.audioContext = audioContext
		this.offlineAudioContext = offlineAudioContext
		
		// this controls the amplitude and connects to the mouth ui
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

		// so you set the root note every time and
		// it returns the chord notes following the forumla
		// bound by the MIDI_NOTE_NUMBERS which 
		this.arpeggio = new Arpeggio( MIDI_NOTE_NUMBERS, MAJOR_CHORD_INTERVALS, 0 )

		// this is where all this user's audio is routed
		this.outputNode = this.gainNode

		if (this.options.drawEyebrows)
		{
			//FIXME:
			// this.eyeBrowsNode = audioContext.createBiquadFilter()
			// // TODO: Set up as a high pass filter
			// this.outputNode.connect(this.eyeBrowsNode)
			// this.outputNode = this.eyeBrowsNode

			// this.eyeBrowsNode = delayNode
			// this.delayNode = delayNode
			// this.feedbackNode = feedbackNode

			// TODO: Set up as a high pass filter

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
		
		if (this.options.useDelay)
		{
			// DELAY : Feedback smooths out the audio
			const delayNode = audioContext.createDelay( this.options.delayLength )
			const feedbackNode = audioContext.createGain()
			delayNode.delayTime.value = this.options.delayTime
			feedbackNode.gain.value = this.options.feedback
			
			this.outputNode.connect(feedbackNode)
			// connect gain to delay (delay feeds back)
			feedbackNode.connect(delayNode)
			// connect the delay node to the output
			delayNode.connect( feedbackNode )
			delayNode.connect( this.outputNode )
			// and back in tot he feedback?
			// delayNode.connect(destinationNode)
			this.delayNode = delayNode
			this.outputNode = delayNode
		}

		// allow stereo pannning...
		// NB. This is actually quite a greedy method
		if (this.options.stereoPan)
		{
			this.stereoNode = audioContext.createStereoPanner()
			this.outputNode.connect(this.stereoNode)
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

		// now connect this directly to the main mixer
		this.outputNode.connect(destinationNode)

		// defaultInstrument:INSTRUMENT_TYPE_OSCILLATOR
		const defaultInstrumentType = this.options.defaultInstrument ?? INSTRUMENT_TYPE_OSCILLATOR
		
		const defaultInstrumentOptions = {
			...this.options,
			preload:false,
			offlineAudioContext,
			defaultPreset:presetIndex ?? this.options.defaultPreset ?? 0,
			defaultInstrument:defaultInstrumentType
		}		

		// create a sample player, oscillator add all other instruments		
		// Add as manny instruments as you like
		//- instrumentFactory.loadInstrumentByName()
		//- const rompler = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_SOUNDFONT )
		const defaultInstrument = await instrumentFactory.loadInstrumentByType( defaultInstrumentOptions.defaultInstrument, defaultInstrumentOptions, 0 )	
		// const defaultInstrument = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_OSCILLATOR, defaultInstrumentOptions, 0 )	
		// const defaultInstrument = await instrumentFactory.loadInstrumentByType( this.options.defaultInstrument ?? INSTRUMENT_TYPE_OSCILLATOR, defaultInstrumentOptions, 0 )	
		const chordInstrument = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_CHORD, defaultInstrumentOptions, 0 )	
		// const midiInstrument = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_MIDI )
		// const defaultInstrument = await createInstrumentFromData( audioContext, {type:INSTRUMENT.TYPE_OSCILLATOR})
		// const chordInstrument = await createInstrumentFromData( audioContext, {type:INSTRUMENT.TYPE_CHORD})

		// wait for instrument data to be avaiable
		await defaultInstrument.loaded
		await chordInstrument.loaded

	
		// console.warn(samplePlayerOptions.defaultPreset, "Person created with active instrument", this.activeInstrument, {options:this.options, samplePlayerOptions} )
		// this.samplePlayer = this.setMainInstrument( this.addInstrument( new SoundFontInstrument(audioContext, samplePlayerOptions) ) )
		// this.addInstrument( new OscillatorInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new WaveGuideInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new YoshimiInstrument(audioContext, this.gainNode) )

		// this.samplePlayer = this.setMainInstrument( this.addInstrument( defaultInstrument ))
		this.setMainInstrument( this.addInstrument( chordInstrument ))
		// this.setMainInstrument( this.addInstrument( defaultInstrument ))
		
		// load an instrument into the chordPlayer
		chordInstrument.setInstrument( defaultInstrument )
		
		// console.error("Person created with active instrument", this.activeInstrument, {defaultInstrument}, {options:this.options, defaultInstrumentOptions} )	

		// load the default preset
		const defaultPreset = await this.loadPreset( defaultInstrumentOptions.defaultPreset )
		return this.playerNumber
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
		this.activeInstrument = this.addInstrument( instrument )

		// console.warn("Person setMainInstrument", this.activeInstrument, {instrument} )

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

	// --- EVENTS --------------------------------------------------------------


	/**
	 * Called when this Person is created
	 * and a prediction has been made abiout the user
	 */
	onBirthed(){
		this.reset()
		// console.info("Person Birthed", this)
		this.dispatchEvent(EVENT_PERSON_BORN, { person:this })
	}


	onLost(){
		// console.info("Person Lost at "+this.deadForDuration )
		//this.dispatchEvent(EVENT_PERSON_DEAD, { person:this })
	}

	/**
	 * Person has finally died - change preset?
	 */
	onDead(){
		// console.info("Person Killed at "+this.deadForDuration )
		this.createdAt = -1
		this.isUserActive = false
		this.dispatchEvent(EVENT_PERSON_DEAD, { person:this })
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

		document.addEventListener('pointerup',this.onFaceTouchEnd, {once:true})
		document.addEventListener('pointercancel', this.onFaceTouchEnd, {once:true})
		
		// start mouse pressure animation
		// drawMousePressure( 0, this.options.mouseHoldDuration )
	}

	/**
	 * Touch END
	 * @param {Event} event 
	 */
	onFaceTouchEnd(event){
			
		event.preventDefault()
		
		// just in case there are reemnants
		document.removeEventListener('pointerup', this.onFaceTouchEnd )
		document.removeEventListener('pointercancel', this.onFaceTouchEnd )
		
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
		const instrument = event.target.value
		const title = event.target.textContent
		this.hideForm()
		// FIXME: load the instrument first?
		this.loadPreset(instrument, title ?? id)
	}

	onLeftEyeOpen( timeClosedFor ){
		// console.error( "onLeftEyeOpen", {timeClosedFor} ) 
		
	}

	onLeftEyeClose( timeClosed ){
		// console.error( "onLeftEyeClose", {timeClosed} ) 
		
	}

	onRightEyeOpen( timeClosedFor ){
		// console.error( "onRightEyeOpen", {timeClosedFor} ) 
		
		
	}

	onRightEyeClose( timeClosed ){
		// console.error( "onRightEyeClose", {timeClosed}  ) 
		
	}

	onEyesClosedForTimePeriod(){
		// console.error( "onEyesClosedForTimePeriod" ) 
		this.eyesClosed = true
	// Eyes closed for X amount of time...
		// this.loadNextPreset( instrumentName => console.log("onEyesClosedForTimePeriod:instrumentName",instrumentName ) )
	}

	// --- FORM --------------------------------------------------------------

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
		
		// destroy any existing forms
		if (this.presetPanelConnection)
		{
			this.presetPanelConnection()
			this.presetPanelConnection = null
		}

		// fill the sidebar with the presets from this instrument
		const presets = await populateInstrumentPanel( this.instrumentPanel, this.activeInstrument, this.id )
			
		// stupid event callback forgets scope!
		this.presetPanelConnection = addInteractivityToInstrumentPanel( this.controls, event => this.onInstrumentInput(event) )

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
			this.isFormShowing = showPersonalControlPanel( this.id, this.instrumentPanel, this.instrumentName )
		}else{
			console.error("was told to open form that is already open")
		}
	}

	/**
	 * Hide this Person's control panel form
	 */
	hideForm(){
		// console.error( "sidebar hiding...", this.id, "closing side bar", this.id, this.instrumentPanel )
		this.isFormShowing = hidePersonalControlPanel( this.id, this.instrumentPanel )
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