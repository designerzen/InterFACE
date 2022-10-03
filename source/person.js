/**
 * each person in the app has their own instrument and face
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
import { rescale, lerp, clamp, range, rangeRounded } from "./maths/maths"
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad} from "./maths/easing"

// all the different instruments!
import SampleInstrument from './audio/instruments/instrument.sample'
import MIDIInstrument from './audio/instruments/instrument.midi'
// import OscillatorInstrument from './audio/instruments/instrument.oscillator'
// import WaveGuideInstrument from "./audio/instruments/instrument.waveguide"
// import YoshimiInstrument from "./audio/instruments/instrument.yoshimi"

import { convertNoteNameToMIDINoteNumber, getNoteText, getNoteName, getNoteSound, getFriendlyNoteName } from './audio/notes'
import { instrumentFolders } from './audio/instruments'

import { setupInstrumentForm } from './dom/ui'
import { ParamaterRecorder } from './parameter-recorder'

import { 
	drawNodes,
	drawPart, drawPoints, 
	drawFace, drawFaceMesh,  drawBoundingBox, 
	drawText, drawParagraph, 
	drawInstrument
} from './visual/2d'

import { drawMousePressure } from './dom/mouse-pressure'
import { drawEye } from './visual/2d.eyes'
import { drawMouthFromSequence, drawLip, drawMouth } from './visual/2d.mouth'
import { 
	EYE_COLOURS,
	DEFAULT_PERSON_OPTIONS,
	DEFAULT_VOICE_OPTIONS
} from './settings'

// States for the audio controlled by the face
export const STATE_INSTRUMENT_SILENT = "instrument-not-playing"
export const STATE_INSTRUMENT_ATTACK = "instrument-attack"
export const STATE_INSTRUMENT_SUSTAIN = "instrument-sustain"
export const STATE_INSTRUMENT_PITCH_BEND = "instrument-pitchbend"
export const STATE_INSTRUMENT_DECAY = "instrument-decay"
export const STATE_INSTRUMENT_RELEASE = "instrument-release"

export const EVENT_INSTRUMENT_CHANGED = "instrument-changed"
export const EVENT_INSTRUMENT_LOADING = "instrument-loading"

// after how many frames do we set the DOM css vars
const UPDATE_FACE_BUTTON_AFTER_FRAMES = 24

// FIXME:
const FUDGE = 1.0// 1.3

export default class Person{

	// instances
	midiPlayer
	samplePlayer
	activeInstrument
	
	// States, default state is audio off
	state = STATE_INSTRUMENT_SILENT

	// Flags
	active = false
	singing = false
	isMouthOpen = false
	isLeftEyeOpen = true
	isRightEyeOpen = true

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
	
	// Head orientation
	yaw = 0
	pitch = 0
	roll = 0

	// internal person frame counter
	counter = 0

	tracks = 0
	octave = 4

	// real time colour settings
	hue = 0
	saturation = 50

	instrumentPointer = 0
	instrumentLoadedAt = -1

	mouseDownAt = -1
	leftEyeClosedAt = -1
	rightEyeClosedAt = -1

	instruments = []

	data = null
	midi = null

	lastNoteSound = "-"
	lastNoteName = "A0"
	lastNoteFriendlyName = "C-4"
	lastNoteNumber
	
	// default MIDI settings
	midiChannel = "all"

	/**
	 * Is the mouse button down?
	 * @returns {Boolean} Mouse button state
	 */
	get areEyesOpen(){
		return this.isLeftEyeOpen && this.isRightEyeOpen
	}

	/**
	 * Returns time in ms since the user moused down
	 * or else -1 if the mouse is not down at all 
	 */
	get mouseDownFor(){
		return this.isMouseDown ? 
			this.audioContext.currentTime - this.mouseDownAt :
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
	 * Fetch the ID of the form on the DOM that matches this Person
	 * @returns {String} ID name
	 */
	get controlsID (){
		return `${this.name}-controls`
	}

	/**
	 * Fetch the form controls on the DOM that matches this Person
	 * @returns {HTMLElement} Form element for this Person
	 */
	get controls (){
		return document.getElementById(this.controlsID)
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
		return this.instrumentPointer // instrumentFolders.indexOf(this.instrumentName)
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
	 */
	get now(){
		return this.audioContext.currentTime
	}

	/**
	 * get the time elapsed in milliseconds since
	 * the Person's instrument last changed
	 */
	get timeSinceInstrumentChanged(){
		return this.instrumentLoadedAt < 0 ? 
			0 : this.now - this.instrumentLoadedAt
	}

	constructor(name, audioContext, destinationNode, options={} ) {
		
		this.options = Object.assign({}, DEFAULT_PERSON_OPTIONS, options)
		this.name = name

		this.audioContext = audioContext
			
		// HSL Colour scheme that can be overwritten
		this.setPalette(this.options)

		// probably not neccessary with reverb effect
		this.precision = Math.pow(10, parseInt(this.options.precision) )
		
		// allow us to record the performances (not the audio)
		// useful for showing recordings of a person
		this.parameterRecorder = new ParamaterRecorder( audioContext )
		this.isRecordingParameters = false
	
		this.debug = this.options.debug

		// this.range = 1 / ( 1 - this.options.mouthCutOff )
		this.mouthScale = rescale(this.options.mouthCutOff)

		// this controls the amplitude and connects to the mouth ui
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

		// allow stereo pannning...
		// NB. This is actually quite a greedy method
		if (this.options.stereoPan)
		{
			
			this.stereoNode = audioContext.createStereoPanner()
			this.stereoNode.connect(this.gainNode)
			// this.stereoNode.connect(delayNode)
			this.outputNode = this.stereoNode
		}else{
			// TODO: go directly into gain or through other fx first?
			this.outputNode = this.gainNode
		}

		if (this.options.useDelay)
		{
			// DELAY : Feedback smooths out the audio
			const delayNode = audioContext.createDelay( this.options.delayLength )
			const feedbackNode = audioContext.createGain()
			delayNode.delayTime.value = this.options.delayTime
			feedbackNode.gain.value = this.options.feedback
			
			// connect gain to delay (delay feeds back)
			this.gainNode.connect(delayNode)
			// connect the delay node to the output
			delayNode.connect(destinationNode)
			// and back in tot he feedback?
			// delayNode.connect(destinationNode)

		}else{
			// direct to main mixer
			this.gainNode.connect(destinationNode)
		}

		// create a sample player, oscillator add all other instruments
		this.samplePlayer = this.addInstrument( new SampleInstrument(audioContext, this.gainNode, {}) )
		
		// this.addInstrument( new OscillatorInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new WaveGuideInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new YoshimiInstrument(audioContext, this.gainNode) )
		
		this.activeInstrument = this.samplePlayer

		// create our side bar and instrument selector for m
		this.setupForm()

		// fetch dom element
		this.button = document.getElementById(name)
		this.button.addEventListener( 'mousedown', event => {
			//console.log("mousedown:currentTime",  audioContext.currentTime )
			this.mouseDownAt = audioContext.currentTime
			drawMousePressure( 0, this.options.mouseHoldDuration )
			event.preventDefault()
		})

		// FACE has been pressed!
		this.button.addEventListener( 'mouseup', event => {
			// should this trigger something else depending on time?
			// const elapsed = this.mouseDownFor
			
			//console.log("mouseup:mouseDownFor", this.mouseDownAt, this.isMouseHeld )
			
			// if someone just keeps the finger on the screen...
			if (this.isMouseHeld)
			{
				this.loadRandomInstrument()
			}else{
				
			}

			// reset it
			// and reset
			this.mouseDownAt = -1
			drawMousePressure( 1, this.options.mouseHoldDuration )	
			
			event.preventDefault()
		})

		this.button.addEventListener( 'mouseover', event => {
			this.isMouseOver = true
		})
		this.button.addEventListener( 'mouseout', event => {
			this.isMouseOver = false
		})
		this.instrumentLoadedAt = this.now
		//console.log("Created new person", this, "connecting to", destinationNode )

	}
	
	/**
	 * 
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
		this.button.dispatchEvent(new CustomEvent( type, {
			detail: data
		}))
	}

	/**
	 * Set the palette for this Person
	 * @param {Object} options HSL colour model
	 */
	setPalette(options){
		this.saturation = options.saturation // && 100
		this.luminosity = options.luminosity //&& 100
		this.hueRange = options.hueRange //&& 360
		this.hue = options.hue ?? Math.random() * this.hueRange
		//console.log("Setting palette", this, {options, h:this.hue, s:this.saturation, l:this.luminosity, range:this.hueRange} )
	}

	/** 
	 * Update Person's Memory state
	 * Cache data for use in processing later
	 * @param {Object} prediction data model
	 */
	update(prediction){
		
		this.counter++

		// cache all data
		this.data = prediction
		
		// save all the parameters for recall later on...
		if (this.isRecordingParameters)
		{
			this.parameterRecorder.save(prediction)
		}

		// check to see if mouse if down
		if (this.isMouseHeld)
		{
			this.mouseDownAt = -1
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
	}

	/**
	 * Update visuals
	 * @param {Object} prediction data model
	 * @param {Boolean} showText show / hide the subtitles
	 * @param {Boolean} forceRefresh forces the redraw regardless of other settings
	 * @param {Boolean} beatJustPlayed has the metronome just ticked?
	 */
	draw(prediction, showText=true, forceRefresh=false, beatJustPlayed=false){
		
		if (!forceRefresh && !prediction && !this.prediction && !this.isPlayingBack)
		{
			// nothing to (re)draw so exit here
			return
		}
		
		if (!prediction || forceRefresh)
		{
			// refresh
			prediction = this.prediction
		}

		if (this.isPlayingBack)
		{
			// TODO:
			// overwrite prediction
		}

		//
		if (this.isMouseDown)
		{
			drawMousePressure( this.mouseHoldProgress, this.options.mouseHoldDuration )
		}


		const {annotations} = prediction
		const {
			faceOval, 
			lips,
			leftEye, leftEyebrow, leftIris, 
			rightEye, rightEyebrow, rightIris
		} = annotations

		const boundingBox = prediction.box

		// change colour while loading
		const hue = this.instrumentLoading ? 
						this.hue + 180 : 
						this.hue

		// can this just be a reference???
		const options = this.options
		
		const rightEyeClosedFor = this.isRightEyeOpen ? -1 : prediction.time - this.rightEyeClosedAt
		const leftEyeClosedFor = this.isLeftEyeOpen ? -1 : prediction.time - this.leftEyeClosedAt
		// this.areEyesOpen 

		// allows us to use the metronome to shape the colours
		const saturation = options.saturation
		const luminosity = options.luminosity + (beatJustPlayed ? 10 : 0)
		
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
		
		// change eye colours if closed...?
		// options.leftEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		// options.rightEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		
		options.leftEyeIris = `hsla(${(this.isLeftEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%,${options.luminosity}%, 1)`
		options.rightEyeIris = `hsla(${(this.isRightEyeOpen ? hue+90 : hue-90)%360},${options.saturation}%, ${options.luminosity}%, 1)`

		const colours = {
			h:hue,
			s:options.saturation, 
			l:options.luminosity,
			a:1
		}


		// NB. assumes screen has been previously cleared	
		// drawBox( prediction )
		//drawFace( prediction, options, this.singing, this.isMouthOpen, this.debug )
		if (options.drawMask)
		{
			// we go from nodes to mesh if mouth active...
			if (!options.drawNodes && !options.drawMesh && options.meshOnSing)
			{
				// this.isMouthOpen = true
				if (this.singing)
				{
					drawFaceMesh( prediction, colours, 0.5, this.instrumentLoading, this.isMouthOpen, this.debug )
				}else{
					// default mode is always blobs
					drawPoints( prediction, colours, 3, this.instrumentLoading, this.debug )
				}

			} else if (options.drawNodes) {

				// just blobs
				drawPoints( prediction, colours, 3, this.instrumentLoading, this.debug )
			
			} else if (options.drawMesh) {

				// just mesh
				drawFaceMesh( prediction, colours, 0.5, this.instrumentLoading, this.isMouthOpen, this.debug )
			}
		}

	
		// drawBoundingBox( boundingBox )

		//console.error("Bounding box", {boundingBox} )

		//const { height,width,xMax,xMin,yMax,yMin} = boundingBox

		// if this is mirrored using the option in the TF model...
		
			
		// we only want this every frame or so as this 
		// is altering the DOM
		if (this.counter%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		{
			// TODO: Profile which is faster...
			// this.button.style.setProperty(`--${this.name}-x`, bottomRight[0] )
			// this.button.style.setProperty(`--${this.name}-y`, topLeft[1] )
			// this.button.style.setProperty(`--${this.name}-w`, boxWidth )
			// this.button.style.setProperty(`--${this.name}-h`, boxHeight )			
			this.button.setAttribute( "style", `--${this.name}-x:${boundingBox.xMin};--${this.name}-y:${boundingBox.yMin};--${this.name}-w:${boundingBox.width};--${this.name}-h:${boundingBox.height};` );

			// ?
			// this.button.cssText = `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};`
		}

		 
		// now overlay the mouth
		if (options.drawMouth)
		{	
			const mouthColours = {
				h:hue,
				s:options.saturation, 
				l:options.luminosity,
				a:1
			}

			const mouthColoursClosed = {
				h:hue,
				s:options.saturation, 
				l:20,
				a:1
			}

			const lipColours = {
				h:90,
				s:50, 
				l:50,
				a:1
			}



			//drawLip( prediction.annotations.lips, {...colour, h:0}, lipPathOuter )
			// drawMouthFromSequence( prediction.annotations.lips, {...colour }, {...colour, a:0.5}, LIP_PATH_OUTER )

			// drawMouthFromSequence( prediction.annotations.lips, {...colour, h:0}, {...colour, h:0}, LIP_PATH_INNER )

			
			
			// // Top inner
			// drawLip(prediction.annotations.lips, {...colour, h:270}, 30, 40)




			// fake it till you make it
			// bottom outer lip first
			//drawLip(prediction.annotations.lips, {...colour, h:0}, 1, 9)
		
			//drawLip(prediction.annotations.lips, {...colour, h:0}, 10, 11)
			
			// top outer lip
			//drawLip(prediction.annotations.lips, {...colour, h:90}, 10, 19)

			//drawLip(prediction.annotations.lips, {...colour, h:0}, 10, 11)
			
			// drawMouth(prediction.annotations.lips, {...colour, h:90 }, 0, 9)
			// drawMouth(prediction.annotations.lips, {...colour, h:180 }, 0, 9)
			// drawMouth(prediction.annotations.lips, {...colour, h:270 }, 0, 9)


			// DEBUG
			// drawNodes( annotations.leftEyeSocket[0], annotations.leftEyeSocket[1] )
			// drawNodes( annotations.rightEyeSocket[0], annotations.rightEyeSocket[1] )
			// drawNodes( annotations.headVertical[0], annotations.headVertical[1] )

			// This overlays the mouth and the eyes
			if (this.isMouthOpen && this.singing)
			{
				// Inner
				drawLip( annotations.innerLip, lipColours, mouthColours )
			
				//drawLip(prediction.annotations.lips, {...mouthColours, h:0}, 1, 9)

				// drawMouth(prediction.annotations.lips, {...mouthColours, h:90 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:180 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:270 }, 0, 9)
				
			}else{

				// Outer
				drawLip( annotations.outerLip, lipColours, mouthColoursClosed )
		
				// mouth closed or not singing
				// drawLip(prediction.annotations.lips, mouthColoursClosed, 1, 9)
			}
		}

		// draw silhoette if the user is 
		// if you want it to flicker...
		// interacting&& this.counter%2 === 0)
	
		// we need to ignore eyes closed if the instrument is loading...
		const eyesClosedFor = this.instrumentLoading || this.isRightEyeOpen || this.isLeftEyeOpen ? -1 : Math.max(leftEyeClosedFor, rightEyeClosedFor)
		
		// eyes have been closed for X -period of time
		if (eyesClosedFor > options.eyeShutHolddDuration)
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

		}else if (options.drawEyes){

			const eyeOptions = {
				// colourful part of the eye
				iris:options.leftEyeIris, 
				// size of the colourful part
				irisRadius:options.irisRadius,
				// holes in the eyes
				pupil:'rgba(0,0,0,0.8)', 
				// size of the hole
				pupilRadius:options.pupilRadius,
				// big white bit of the eyed
				sclera:'white',
				// size of the white bit
				scleraRadius:options.scleraRadius,
				ratio:options.eyeRatio
			}

			// Draw the eyes over the face
			const eyeDirection = prediction.eyeDirection
			drawEye( annotations, true, this.isLeftEyeOpen, eyeDirection, eyeOptions)	
			eyeOptions.iris = options.rightEyeIris
			drawEye( annotations, false, this.isRightEyeOpen, eyeDirection, eyeOptions)

		}else if (options.drawEyebrows){
		
			// FIXME: draw some funky eyebrows!
			drawPart(leftEyebrow, 5)
			drawPart(rightEyebrow, 5)

			// console.log("EYES", {annotations} )

			// drawShapeByIndexes( annotations.rightEyeLower0, [0,2,8], 0.5, 'red', true, false, true )
			
			
			// drawPart( annotations.rightEyeLower0, 1, 'black', false, false, true )

		//	drawPart( annotations.leftEyeUpper1, 1, 'pink', true, false, false )

			// drawPart( annotations.leftEyeLower1, 1, 'yellow', true )
		//	drawPart( annotations.leftEyeLower2, 1, 'green', true, false, false )
			// drawPart( annotations.leftEyeLower3, 1, 'blue', true )
			// drawPart( annotations.leftEyeLower4, 1, 'orange', true )

			// drawPart( annotations.rightEyeLower1 )
			// drawPart( annotations.rightEyeLower2 )
			// drawPart( annotations.rightEyeLower3 )
			// drawPart( annotations.rightEyeLower4 )

			// console.log("EYES", {rightEyeClosedFor, leftEyeClosedFor, eyesClosedFor, time:prediction.time, rca:this.rightEyeClosedAt, lca:this.leftEyeClosedAt} )
			// if (this.isLeftEyeOpen)
			// {
			// 	drawEye( annotations.leftEyeIris, true, true, eyeOptions)	
			// }else{
			// 	// const leftEyeHeldShut = prediction.time - this.leftEyeClosedAt > options.eyeShutHolddDuration
			// 	drawEye(annotations.leftEyeIris, true, false, { irisRadius:options.eyeRadius} )	
			// }

			// if (this.isRightEyeOpen)
			// {
			// 	drawEye( annotations.rightEyeIris, false, true, {pupil:options.rightEyeIris, irisRadius:options.eyeRadius})
			// }else{
			// 	// const rightEyeHeldShut = prediction.time - this.rightEyeClosedAt > options.eyeShutHolddDuration
			// 	drawEye(annotations.rightEyeIris, false, false ? 'red' : 'green', { irisRadius:options.eyeRadius})
			// }

			// console.log("EYE OPEN", {
			// 	rightEyeClosedFor, 
			// 	leftEyeClosedFor, 
			// 	eyesClosedFor, 
			// 	ro:this.isRightEyeOpen,
			// 	lo:this.isLeftEyeOpen,
			// 	time:prediction.time, 
			// 	rca:this.rightEyeClosedAt, 
			// 	lca:this.leftEyeClosedAt
			// } )
			
		}else{
			// default fails
		}

		// TEXT ===================================================
		// everything here is for displaying the text
		if (!showText)
		{
			return
		}
	

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
					drawInstrument(boundingBox, this.instrumentTitle, 'Select')			
					
					// FIXME: Do we hide the face entirely???
					// drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,0.1)`, true, false, false)
					drawParagraph(boundingBox.xMax, boundingBox.yMin + 40, [`Press me`], '14px' )
			
					// draw our mouse expanding circles...
					// we use CSS and it is only hidden here?
				}else{

					drawInstrument(boundingBox, this.instrumentTitle, `${100-percentageRemaining}`)			
					drawPart( faceOval, 4, `hsla(${hue},50%,${percentageRemaining}%,${remaining})`, true)					
					drawParagraph(boundingBox.xMax, boundingBox.yMin + 40, [`Hold me to see all instruments`], '14px' )		
				}

			}else{
				
				// No mouse held
				drawInstrument(boundingBox, this.instrumentTitle, 'Hold to choose instrument')
				drawPart( faceOval, 4, 'hsla('+hue+',50%,50%,0.3)', true)
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
			drawInstrument(boundingBox, this.instrumentTitle, 'loading...')

		}else{

			// Main data flow
			const extra = this.lastNoteFriendlyName 
			const suffix = this.singing ? `| ♫ ${this.lastNoteSound}` : this.isMouthOpen ? `<` : `-`
			// const suffix = this.singing ? MUSICAL_NOTES[this.counter%(MUSICAL_NOTES.length-1)] : this.isMouthOpen ? `<` : ` ${this.lastNoteSound}`
			
			// eye:${prediction.eyeDirection}
			drawInstrument(boundingBox, this.instrumentTitle, `${extra} ${suffix}` )
			
			if (this.debug )
			{
				const paragraphs = [
					// `Pitch:${(prediction.pitch||0).toFixed(3)}`, 
					// `Roll:${(prediction.roll||0).toFixed(3)}`, 
					// `Yaw:${(prediction.yaw||0).toFixed(3)}`, 
					`Pitch:${(prediction.pitch||0).toFixed(3)} Roll:${(prediction.roll||0).toFixed(3)} Yaw:${(prediction.yaw||0).toFixed(3)}`,
					
					`Eyes: LEFT:${(prediction.leftEyeDirection||0).toFixed(3)} RIGHT:${(prediction.rightEyeDirection||0).toFixed(3)}`,
					
					`Gain:${(this.gainNode.gain.value||0).toFixed(2)}`, 
					
					`Happiness:${(prediction.happiness||0).toFixed(3)}`, 
					`Smirks left:${(prediction.leftSmirk||0).toFixed(3)} / right:${(prediction.rightSmirk||0).toFixed(3)}`, 
					
					`mouthOpen:${prediction.mouthOpen}`, 
					`mouthRange:${(prediction.mouthRange||0).toFixed(3)}`, 
					`mouthRatio:${(prediction.mouthRatio||0).toFixed(3)}`, 
					`mouthWidth:${(prediction.mouthWidth||0).toFixed(3)} & mouthHeight:${(prediction.mouthHeight||0).toFixed(3)}`, 
					
					`eyes direction:${(prediction.eyeDirection||0).toFixed(3)} left:${(prediction.leftEye||0).toFixed(3)} right:${(prediction.rightEye||0).toFixed(3)}`,
					`eyes open :${this.areEyesOpen} left:${!prediction.leftEyeClosed} right:${!prediction.rightEyeClosed}`,
					
					// `eye closed left:${prediction.leftEyeClosed} right:${prediction.rightEyeClosed}`,
					// `dims:${(prediction.mouthRatio||0).toFixed(2)}x${(prediction.mouthRange||0).toFixed(2)}`,
					'facing'+prediction.lookingRight ? 'left' : 'right'
				]

				drawParagraph(boundingBox.xMax, boundingBox.yMin + 40, paragraphs, '14px' )
				// drawText(boundingBox.topLeft[0], boundingBox.topLeft[1], extra )
			}
		}


	}

	/**
	 * Sing some songs
	 * state machine diagram :
	 * SILENT ATTACK SUSTAIN PITCH_BEND SUSTAIN DECAY RELEASE
	 * This is responsible for converting the Face Model into music
	 */
	sing(){

		// nothing to play
		if (!this.data )
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
		// should be triggered such as eye left / right

		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = prediction.mouthRatio
		
		// Controls minor / major
		const yaw = prediction.yaw
		
		// Octave control by up and down head
		// const pitchRaw = clamp(0.5 * (prediction.pitch + 1) * this.options.pitchSensitivity, 0, 1)
		// const pitch = (prediction.pitch + 1 ) / 2
		
		// -1 => +1 -> convert to 
		// ignore < -0.5 and > 0.5
		// we can exagerate a motion by amplyifying it's signal and clamping its output
		//const rollRaw = clamp((prediction.roll + 0.5) * this.options.rollSensitivity, 0, 1)
		
		// swap em arounnd!
		const pitch = this.options.swapControls ? prediction.roll : prediction.pitch
		const roll = this.options.swapControls ? prediction.pitch : prediction.roll

		// remap -1 -> +1 to 0 -> 1
		const rolled = (1 + roll) * 0.5 

		// Controls stereo pan
		const eyeDirection = prediction.eyeDirection

		// volume is an log of this
		const amp = clamp(lipPercentage * FUDGE, 0, 1 ) //- 0.1
		// const logAmp = options.ease(amp)
		
		// pitch goes from -1 -> +1 and we want to map to 1 -> 7
		// straight at screen to positive below and negative above
		const newOctave = rangeRounded( -pitch , -1, 1, 1, 7 )
		
		// FIXME: if we don't want the happy notes...
		const isMinor = prediction.isFacingRight

		// eg. A1 Ab1 C3 etc
		const noteName = getNoteName(rolled, newOctave, isMinor)
		// eg. Do Re Mi
		const noteSound = getNoteSound(rolled, isMinor)
		// MIDI Note Number 0-127
		const noteNumberForMIDI = convertNoteNameToMIDINoteNumber(noteName)
		
		const friendlyNoteName = getFriendlyNoteName( noteName ) 
		const hasNoteChanged = this.lastNoteName !== noteName

		// you want the scale to be from 0-1 but from 03-1
		let newVolume = amp
		let note = -1
		
	
		// cache for drawing getNoteText
		this.lastNoteName = noteName
		this.lastNoteSound = noteSound
		this.lastNoteNumber = noteNumberForMIDI
		this.lastNoteFriendlyName = friendlyNoteName
		this.octave = newOctave

		this.hue = roll * this.hueRange
		this.saturation = 100 * lipPercentage
		this.singing = amp >= options.mouthCutOff


		// console.log("Person", prediction.yaw , yaw)
		// // console.log("Person", {lipPercentage, yaw, pitch, amp, logAmp})
		if (this.options.stereoPan)
		{
			//FIXME:
			this.stereoNode.pan.value = eyeDirection
			//console.log("stereoNode", this.stereoNode.pan.value, eyeDirection )
			//this.stereoNode.pan.setValueAtTime(panControl.value, this.audioContext.currentTime);
		}
		
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
			
			// rescale for 0.3->1
			// newVolume = this.mouthScale( amp )
			// curve
			// newVolume = options.ease(newVolume)
			// smooth
			newVolume = Math.round( newVolume * this.precision ) / this.precision 
			
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
		
				if (this.isMIDIActive)
				{
					//this.midi.sendKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
					// this.midi.setPitchBend( eyeDirection )
				}else{
					this.midiActive = true
				}
				
				// Use eye direction as a modifier for the sound
				if (eyeDirection !== 0)
				{
					// Midi pitch bending with eyes!
					// Pitch bending eyes!
					//this.midi.setPitchBend( eyeDirection )
					this.midi.sendKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
				}
			}
			
			this.isMouthOpen = true
			
		}else if ( amp > options.mouthSilence && amp < options.mouthCutOff ){

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
			}
		
		}else{

			this.setState(STATE_INSTRUMENT_SILENT)

			// no instrument available or mouth totally closed
			newVolume = 0
			this.isMouthOpen = false
			this.active = false
			// no instruments in memory yet... play silence?
		}

		//&& this.midiActive If the user has stopped singing we need to stop the midi too!
		if (this.options.sendMIDI && this.hasMIDI)
		{
			this.midi.sendClock( )
			//this.midi.setSongPosition( getBarProgress() * 16383 )
				
			if (!this.singing)
			{
				this.midi.stopNote(noteName, {
					// The velocity at which to release the note (between `0` * and `1`). If the `rawValue` option is `true`, the value should be specified as an integer
					// between `0` and `127`. An invalid velocity value will silently trigger the default of `0.5`.
					release:0.2
				})

				// immediate mute, but doesn't block (sounds better)
				//this.midi.turnSoundOff()

				// fade out but prevents new notes...
				//this.midi.turnNotesOff()
				
				// prevent flooding the off bus
				this.midiActive = false

				//console.log(this.midi, "MIDI turnSoundOff", noteName, "Channel:"+this.midiChannel,{ channel:this.midiChannel, hasMIDI:this.hasMIDI, MIDIDeviceName:this.MIDIDeviceName} )
			}		
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
		
		this.gainNode.gain.value = newVolume

		this.yaw = yaw
		this.pitch = pitch
		this.roll = roll

		// TODO: Return all notes played
		return {
			played,
			yaw, pitch, roll, 
			hue:this.hue,
			lipPercentage,
			eyeDirection,
			octave:newOctave,
			friendlyNoteName,
			note,
			noteNumberForMIDI,
			noteName,
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
	 * @param {*} progressCallback - method to invoke on loading progress
	 * @returns instrument
	 */
	async loadSamples(method="loadRandomInstrument",progressCallback=null){
		this.instrumentLoadedAt = this.now
		this.instrument = await this.samplePlayer[method]( ({progress,instrumentName}) => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentName })
		} )
		this.setupForm()
		this.hideForm()
		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, { instrument:this.instrument, instrumentName:this.instrument.instrumentName })
		return this.instrument
	}

	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadRandomInstrument(progressCallback){
		return this.loadSamples("loadRandomInstrument", progressCallback)
	}

	/**
	 * Provide this Person with a the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousInstrument(progressCallback){
		return this.loadSamples("loadPreviousInstrument", progressCallback)
	}

	/**
	 * Provide this Person with a the subsequent instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextInstrument(progressCallback){
		return this.loadSamples("loadNextInstrument", progressCallback)
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async reloadInstrument(progressCallback){
		return this.loadSamples("reloadInstrument", progressCallback)
	}
	
	/**
	 * Load a specific instrument for this Person
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadInstrument(instrumentName, progressCallback){

		const generalMIDIInstrumentId = instrumentFolders.indexOf(instrumentName)
		if ( generalMIDIInstrumentId  < 0 )
		{
			throw Error("loadInstrument("+instrumentName+") failed")
		}
		this.instrumentPointer = generalMIDIInstrumentId

		const instrumentPack = this.options.instrumentPack
		//console.log(generalMIDIInstrumentId, "Person loading instrument "+instrumentName + '>' + instrumentPack + +" via sampleplayer", {instrumentFolders})
		this.instrument = await this.samplePlayer.loadInstrument(instrumentName, instrumentPack, progress => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentName })
		} )
		this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress:1, instrumentName })
		
		// you have to dispatch the event from an element!
		this.dispatchEvent(EVENT_INSTRUMENT_CHANGED, { instrument:this.instrument, instrumentName })
		return instrumentName
	}

	/**
	 * Inject an instrument to be used by this person
	 * @param {*} instrument 
	 */
	addInstrument( instrument ){
		this.instruments.push( instrument )
		// FIXME: Also connect for changes to instrument
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
		this.midiPlayer = new MIDIInstrument(midiDevice, channel)
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

	onInstrumentInput(event) {
		const id = event.target.id
		//console.error(id, "on inputted", event)
		this.hideForm()
		this.loadInstrument(id)
		event.preventDefault()
	}

	onLeftEyeOpen( timeClosedFor ){
		this.leftEyeClosedAt = -1
	}

	onLeftEyeClose( timeClosed ){
		this.leftEyeClosedAt = timeClosed
	}

	onRightEyeOpen( timeClosedFor ){
		this.rightEyeClosedAt = -1
	}

	onRightEyeClose( timeClosed ){
		this.rightEyeClosedAt = timeClosed
	}

	onEyesClosedForTimePeriod(){
		// 
		this.loadNextInstrument( instrumnetName => console.log("instrumnetName",instrumnetName ) )
	}

	onButtonHeld(){
		this.showForm()
		drawMousePressure( 1, this.options.mouseHoldDuration )
	}

	/**
	 * Create the instrument panel HTML for this user's instrument
	 * and other settings specific to this person
	 */
	setupForm(){

		// FIXME: Use ACTIVE instrument - don't assume it's samplePlayer
		const instruments = this.activeInstrument.getInstruments()
		// FIXME 
		this.controls.innerHTML = setupInstrumentForm( instruments, this.samplePlayer.instrumentPack )
		
		const inputs = this.controls.querySelectorAll('input')
		inputs.forEach( input => input.addEventListener('change', event => this.onInstrumentInput(event) ), false)

		const legend = this.controls.querySelector('legend')
		legend.addEventListener("click", event => {
			const details = this.controls.querySelectorAll('details')
			if (details.length)
			{
				const shouldOpen = !details[0].hasAttribute("open")
				details.forEach( detail => {
					shouldOpen ? detail.setAttribute("open", true) : detail.removeAttribute("open")
				})
			}
		})
	}

	/**
	 * This pops up the user side bar and populates it accordingly
	 */
	showForm(){

		// find active input field and focus
		const active = document.getElementById(this.instrumentName)
		if (active)
		{
			active.focus()
		}else{
			// send focus to form?
			this.controls.focus()
		}

		console.log("SHOW Form", {active})
		this.controls.classList.toggle("showing",true)
		document.documentElement.classList.toggle(`${this.name}-sidebar-showing`,true)
		this.isFormShowing = true
	}

	/**
	 * Hide this Person's form
	 */
	hideForm(){
		if (this.isFormShowing)
		{
			console.log("HIDE Form")
			this.isFormShowing = false
			//const inputs = this.controls.querySelectorAll('input')
			//inputs.forEach( input => input.removeEventListener('change',  this.onInstrumentInput))
			//this.controls.innerHTML = ''
			this.controls.classList.toggle("showing",false)
			document.documentElement.classList.toggle(`${this.name}-sidebar-showing`,false)
			// setTimeout( ()=> this.controls.classList.toggle("showing",false), 303 )	
		}
		
	}
}