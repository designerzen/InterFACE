// each person in the app has their own instrument and face
import { rescale, lerp, clamp } from "./maths/maths"
import { easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad} from "./maths/easing"
import { getBarProgress } from './timing/timing.js'

import SampleInstrument from './audio/instrument.sample'
import MIDIInstrument from './audio/instrument.midi'
import OscillatorInstrument from './audio/instrument.oscillator'

import { active, playing, loadInstrumentPack, randomInstrument } from './audio/audio'
import { convertNoteNameToMIDINoteNumber, getNoteText, getNoteName, getNoteSound, getFriendlyNoteName } from './audio/notes'
import { 
	INSTRUMENT_PACK_FM, INSTRUMENT_PACK_FATBOY,	INSTRUMENT_PACK_MUSYNGKITE,
	INSTRUMENT_PACKS, instrumentFolders, cleanTitle
} from './audio/instruments'

import { setupInstrumentForm } from './dom/ui'
import { ParamaterRecorder } from './parameter-recorder'

import { 
	drawShapeByIndexes,drawPart, 
	drawFace, drawPoints, drawBoundingBox, 
	drawText,drawParagraph, drawInstrument, drawFaceMesh
} from './visual/2d'

import { drawEye } from './visual/2d.eyes'
import { drawMouth } from './visual/2d.mouth'
import { DEFAULT_PERSON_OPTIONS } from './settings'


export const EVENT_INSTRUMENT_CHANGED = "instrumentchange"
export const EVENT_INSTRUMENT_LOADING = "instrumentloading"

const UPDATE_FACE_BUTTON_AFTER_FRAMES = 22

const DEFAULT_VOICE_OPTIONS = {
	yaw:0, pitch:0, roll:0,
	hue:90,
	lipPercentage:0,
	eyeDirection:0,
	octave:4,
	note:-1,
	noteName:'',
	volume:0,
	singing:false,
	mouthOpen:false,
	active:false
}

export const EYE_COLOURS = ['blue','green','brown','orange']
export default class Person{

	midiPlayer
	samplePlayer
	instrumentPointer = 0
	active = false

	// Head orientation
	yaw = 0
	pitch = 0
	roll = 0

	singing = false
	isMouthOpen = false
	isLeftEyeOpen = true
	isRightEyeOpen = true
	// if we are repeating our bars...
	isLooping = false
	// if we are watching the face perform without interaction
	isPlayingBack = false
	instrumentLoading = false

	constructor(name, audioContext, destinationNode, options={} ) {
		
		this.options = Object.assign({}, DEFAULT_PERSON_OPTIONS, options)
		this.name = name
		this.counter = 0
		this.instruments = []
		this.data = null
		this.audioContext = audioContext
		this.tracks = 0
		this.octave = 4

		this.midi = null
		this.midiActive = false
		this.midiChannel = "all"

		// HSL Colour scheme that can be overwritten
		this.setPalette(this.options)

		// probably not neccessary with reverb effect
		this.precision = Math.pow(10, parseInt(this.options.precision) )
		
		// allow us to record the performances (not the audio)
		// useful for showing recordings of a person
		this.parameterRecorder = new ParamaterRecorder( audioContext )
		this.isRecordingParameters = false
	
		this.mouseDownAt = -1
	
		this.leftEyeClosedAt = -1
		this.rightEyeClosedAt = -1
		this.lastNoteName = "A0"
		this.lastNoteSound = "-"

		this.debug = this.options.debug

		// this.range = 1 / ( 1 - this.options.mouthCutOff )
		this.mouthScale = rescale(this.options.mouthCutOff)

		// this controls the amplitude and connects to the mouth ui
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

		// 
		if (this.options.stereoPan)
		{
			this.stereoNode = audioContext.createStereoPanner()
			this.stereoNode.connect(this.gainNode)
			// this.stereoNode.connect(delayNode)
			this.outputNode = this.stereoNode
		}else{
			// FIXME: go directly into gain or through other fx first?
			this.outputNode = this.gainNode
		}

		// we need to feed this from every other node
		// delayNode.connect(feedbackNode)
		// feedbackNode.connect(delayNode)

		// we still want it to be gated by the voice!	
		// //delayNode.connect(destinationNode)
		// delayNode.connect(this.gainNode)
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
			// WORKS:
			this.gainNode.connect(destinationNode)
		}

		// create a sample player
		this.samplePlayer = new SampleInstrument(audioContext, this.gainNode, {})
	
		// fetch dom element
		this.button = document.getElementById(name)
		this.button.addEventListener( 'mousedown', event => {

			this.mouseDownAt = audioContext.currentTime
			
			// test to see how long we are help down for?
			const waitPatiently = () => {

				const elapsed = this.mouseDownFor
				if ( elapsed < this.options.mouseHoldDuration )
				{
					// ignore?
					//console.log("mouseDownFor", elapsed )

					requestAnimationFrame( waitPatiently )
				}else if (this.isMouseDown){
					// FIXME
					this.mouseDownAt = -1
					this.showForm()
				}
			}
			waitPatiently()
			event.preventDefault()
		})

		// FACE has been pressed!
		this.button.addEventListener( 'mouseup', event => {
			// should this trigger something else depending on time?
			// const elapsed = this.mouseDownFor
			//console.log("mouseDownFor", elapsed )

		
			this.loadRandomInstrument()
			

			// and reset
			this.mouseDownAt = -1
			event.preventDefault()
		})

		this.button.addEventListener( 'mouseover', event => {
			this.isMouseOver = true
		})
		this.button.addEventListener( 'mouseout', event => {
			this.isMouseOver = false
		})
		// this.button.addEventListener( EVENT_INSTRUMENT_CHANGED, event => {
		// 	console.log("External event for instrument", event )
		// })
		//console.log("Created new person", this, "connecting to", destinationNode )
	}
	
	/**
	 * Is the mouse button down?
	 * @returns {Boolean} Mouse button state
	 */
	get areEyesOpen(){
		return this.isLeftEyeOpen && this.isRightEyeOpen
	}

	get mouseDownFor(){
		return this.audioContext.currentTime - this.mouseDownAt
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
		return this.options.mouseHoldDuration < this.mouseDownFor
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
	 * Fetch the instrument name eg.
	 * @returns {String} Instrument name
	 */
	get instrumentName(){
		return this.instrument ? this.instrument.name : 'loading'
	}	

	/**
	 * Fetch the instrument title eg. French Horn
	 * @returns {String} Instrument title
	 */
	get instrumentTitle(){
		return this.instrument ? this.instrument.title : 'loading'
	}

	/**
	 * Fetch the index in the instrument array of the current instrument
	 * FIXME: expensive... can we use instrumentPointer instead?
	 * @returns {Number} Instrument index
	 */
	get instrumentIndex(){
		// instrumentPointer ???
		return instrumentFolders.indexOf(this.instrumentName)
	}

	get instrumentLoading(){
		return this.instrument.isLoading
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
	 * Dispatch a custom event
	 * @param {*} type 
	 * @param {*} data 
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
		this.data = prediction
		
		// save all the parameters for recall later on...
		if (this.isRecordingParameters)
		{
			this.parameterRecorder.save(prediction)
		}
		
		// update any eye states
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

		
		let hue = this.hue

		if ( this.instrumentLoading )
		{
			hue += 120
		}

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
			// This overlays the mouth and the eyes
			if (this.isMouthOpen && this.singing)
			{
				drawMouth(prediction, mouthColours, this.debug)
			}else{
				// mouth closed or not singing
				drawMouth(prediction, mouthColoursClosed, this.debug)
			}
		}
	
		// drawBoundingBox( prediction.boundingBox )

		// if this is mirrored using the option in the TF model...
		const {bottomRight, topLeft} = prediction.boundingBox
		const boxWidth = Math.abs(bottomRight[0] - topLeft[0])
		const boxHeight = Math.abs(bottomRight[1] - topLeft[1])
			
		// we only want this every frame or so as this 
		// is altering the DOM
		if (this.counter%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		{
			// TODO: Profile which is faster...
			// this.button.style.setProperty(`--${this.name}-x`, bottomRight[0] )
			// this.button.style.setProperty(`--${this.name}-y`, topLeft[1] )
			// this.button.style.setProperty(`--${this.name}-w`, boxWidth )
			// this.button.style.setProperty(`--${this.name}-h`, boxHeight )			
			// ?
			this.button.setAttribute( "style", `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};` );

			// ?
			// this.button.cssText = `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};`
		}

		// draw silhoette if the user is 
		// if you want it to flicker...
		// interacting&& this.counter%2 === 0)
		const {annotations} = prediction
		const {silhouette} = annotations
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
				irisRadius:options.irisRadius,
				// holes in the eyes
				pupil:'rgba(0,0,0,0.8)', 
				pupilRadius:options.pupilRadius,
				// big white bit of the eyed
				sclera:'white',
				scleraRadius:options.scleraRadius,
				ratio:options.eyeRatio
			}

			const eyeDirection = clamp(prediction.eyeDirection , -1, 1 )  // (prediction.eyeDirection + 1)/ 2
			drawEye( annotations, true, this.isLeftEyeOpen, eyeDirection, eyeOptions)	
			eyeOptions.iris = options.rightEyeIris
			drawEye( annotations, false, this.isRightEyeOpen, eyeDirection, eyeOptions)

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
				const remaining = 1 - this.mouseDownFor / this.options.mouseHoldDuration
				const percentageRemaining = 100 - Math.ceil(remaining*100)
				
				if (this.isMouseHeld)
				{
					// user is holding mouse down on user...
					drawInstrument(prediction.boundingBox, this.instrumentTitle, 'Select')			
					drawPart( silhouette, 4, `hsla(${hue},50%,${percentageRemaining}%,0.3)`, true, false, false)
					drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, [`Press me`], '14px' )
				}else{
					
					drawInstrument(prediction.boundingBox, this.instrumentTitle, `${100-percentageRemaining}`)			
					drawPart( silhouette, 4, `hsla(${hue},50%,${percentageRemaining}%,${remaining})`, true)
					drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, [`Hold me to see all instruments`], '14px' )
				}

			}else{
				
				// No mouse held
				drawInstrument(prediction.boundingBox, this.instrumentTitle, 'Hold to choose instrument')
				drawPart( silhouette, 4, 'hsla('+hue+',50%,50%,0.3)', true)
				/*	
				const offsetX = topLeft[0]
				const offsetY = topLeft[1]
				const svgCoord = coord => `${boxWidth - (coord[0] - offsetX)} ${(coord[1] - offsetY)}`
				const svgPaths = silhouette.map( part => `L${svgCoord(part)}`)
				const circles = silhouette.map( part =>{
					const c = svgCoord(part)
					return `<circle cx="${c[0] - offsetX}" cy="${c[1]}" r="20" />`
				})
				// for outline...+ ` Z`
				const svgPath = `M${svgCoord(silhouette[0])} ` + svgPaths.join(" ")
				//  height="210" width="400"
				const silhoetteShape = 
				`<svg width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}">
					<path d="${svgPath}" />
					${circles.join('')}
				</svg>`
				//console.log("SVG",silhouette, silhoetteShape)
				this.button.innerHTML = silhoetteShape	
				*/

			}
		
		}else if (this.instrumentLoading){

			// Instrument loading...
			drawInstrument(prediction.boundingBox, this.instrumentTitle, 'loading...')

		}else{

			// Main flow
			const extra = this.debug ? ` ${getFriendlyNoteName( this.lastNoteName) }`  : ` ${getFriendlyNoteName(this.lastNoteName)}`
			const suffix = this.singing ? `| ♫ ${this.lastNoteSound}` : this.isMouthOpen ? `<` : `-`
			// const suffix = this.singing ? MUSICAL_NOTES[this.counter%(MUSICAL_NOTES.length-1)] : this.isMouthOpen ? `<` : ` ${this.lastNoteSound}`
			
			// eye:${prediction.eyeDirection}
			drawInstrument(prediction.boundingBox, this.instrumentTitle, `${extra} ${suffix}` )
			
			if (this.debug )
			{
				const paragraphs = [
					`Gain:${(this.gainNode.gain.value).toFixed(2)}`, 
					`Happiness:${(prediction.happiness).toFixed(3)}`, 
					`Smirks left:${(prediction.leftSmirk).toFixed(3)} / right:${(prediction.rightSmirk).toFixed(3)}`, 
					`mouthRange:${(prediction.mouthRange).toFixed(3)}`, 
					`mouthRatio:${(prediction.mouthRatio).toFixed(3)}`, 
					`mouthWidth:${(prediction.mouthWidth).toFixed(3)}`, 
					`mouthOpen:${(prediction.mouthOpen).toFixed(3)}`,
					`pitch:${(prediction.pitch).toFixed(3)} roll:${(prediction.roll).toFixed(3)} yaw:${(prediction.yaw).toFixed(3)}`,
					`eyes direction:${(prediction.eyeDirection).toFixed(3)} left:${(prediction.leftEye).toFixed(3)} right:${(prediction.rightEye).toFixed(3)}`,
					`eyes open :${this.areEyesOpen} left:${!prediction.leftEyeClosed} right:${!prediction.rightEyeClosed}`,
					`eye closed left:${prediction.leftEyeClosed} right:${prediction.rightEyeClosed}`,
					`dims:${(prediction.mouthWidth).toFixed(2)}x${(prediction.mouthRange).toFixed(2)}`,
					'facing'+prediction.lookingRight ? 'left' : 'right'
				]
				drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, paragraphs, '14px' )
				// drawText(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1], extra )
			}
		}
	}

	/**
	 * Sing some songs
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
		
		// you want the scale to be from 0-1 but from 03-1
		let newVolume
		let note = -1
		
		// do some checks on data to see if an event
		// should be triggered such as eye left / right

		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = prediction.mouthOpen
		
		// Controls minor / major
		const yaw = prediction.yaw
		
		// Octave control by up and down head
		const pitchRaw = clamp(0.5 * (prediction.pitch + 1) * this.options.pitchSensitivity, 0, 1)
		// const pitch = (prediction.pitch + 1 ) / 2
		
		// -1 => +1 -> convert to 
		// ignore < -0.5 and > 0.5
		// we can exagerate a motion by amplyifying it's signal and clamping its output
		const rollRaw = clamp((prediction.roll + 0.5) * this.options.rollSensitivity, 0, 1)
		
		// swap em arounnd!
		const pitch = this.options.swapControls ? rollRaw : pitchRaw
		const roll = this.options.swapControls ? pitchRaw : rollRaw

		// Controls stereo pan
		const eyeDirection = clamp(prediction.eyeDirection , -1, 1 )  // (prediction.eyeDirection + 1)/ 2

		// volume is an log of this
		const FUDGE = 1.3
		const amp = clamp(lipPercentage * FUDGE, 0, 1 ) //- 0.1
		// const logAmp = options.ease(amp)
		const newOctave = clamp( Math.round(pitch * 7) ,1,7)

		// FIXME: if we don't want the happy notes...
		// we can flip this on somehow?
		const isMinor = prediction.lookingRight

		// eg. A1 Ab1 C3 etc
		const noteName = getNoteName(roll, newOctave, isMinor)
		// eg. Do Re Mi
		const noteSound = getNoteSound(roll, isMinor)
		// MIDI Note Number 0-127
		const noteNumberForMIDI = convertNoteNameToMIDINoteNumber(noteName)
		
		// cache for drawing getNoteText
		this.lastNoteName = noteName
		this.lastNoteSound = noteSound
		this.hue = roll * this.hueRange
		this.saturation = 100 * lipPercentage
		this.singing = amp >= options.mouthCutOff

		// FIXME: octave needs to be up or down from existing?
		// FIXME: Shouldn't need clamp but pitch is over 1??
		this.octave = newOctave

		// console.log("Person", prediction.yaw , yaw)
		// // console.log("Person", {lipPercentage, yaw, pitch, amp, logAmp})
		if (this.options.stereoPan)
		{
			this.stereoNode.pan.value = eyeDirection
			//console.log("stereoNode", this.stereoNode.pan.value, eyeDirection )
			//this.stereoNode.pan.setValueAtTime(panControl.value, this.audioContext.currentTime);
		}
		
		// !active && active is updated by playback state
		if ( this.instrument && this.singing )
		{
			// here is where we need to do our majic
			// play a note from the collectionlogAmp
			note = this.instrument[ noteName ]
			if (note)
			{
				// TODO: add velocity logAmp
				// this.tracks++
				// const track = playTrack( note, 0, this.outputNode ).then( ()=>{
				// 	this.active = false
				// 	this.tracks--
				// 	//console.log("Sample completed playback... request tock", this.tracks )
				// })
				played.push(note)
				//console.log("note not found!", {noteName, roll, octave:this.octave, isMinor})
			}
			
			// rescale for 0.3->1
			newVolume = this.mouthScale( amp )
			// curve
			newVolume = options.ease(newVolume)
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
		
				if (this.midiActive)
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
			this.active = true
			
		}else if ( amp > options.mouthSilence && amp < options.mouthCutOff ){

			// dampen the sound to silence
			// this.gainNode.gain.value = 0
			//const destinationVolume  = 0 // logAmp
			
			// newVolume = this.gainNode.gain.value + (destinationVolume - this.gainNode.gain.value) * options.volumeRate
			newVolume = 0
			this.isMouthOpen = true

		}else{

			// no instrument available or mouth totally closed
			newVolume = 0
			this.isMouthOpen = false
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
		

// WebMidi.outputs[0].channels[1].stopNote("C3", {time: "+2500"});

// // Set polyphonic aftertouch : Send polyphonic aftertouch message to channel 8

// WebMidi.outputs[0].channels[8].setKeyAftertouch("B#3", 0.25);

// // Set pitch bend value : The value is between -1 and 1 (a value of 0 means no bend).

// WebMidi.outputs[0].channels[8].setPitchBend(-0.25);

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
			note,
			noteNumber:noteNumberForMIDI,
			noteName,
			volume:newVolume,
			singing:this.singing,
			mouthOpen: this.isMouthOpen,
			active:this.active
		}
	}

	// actual sing here!

	/**
	 * Load a sample using one of the prebuilt methods
	 * @param {String} method - name of the function to call
	 * @param {*} progressCallback - method to invoke on loading progress
	 * @returns instrument
	 */
	async loadSamples(method="loadRandomInstrument",progressCallback=null){
		this.instrument = await this.samplePlayer[method]( ({progress,instrumentName}) => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentName })
		} )
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
	}

	/**
	 * Set the MIDI channel to use for this Person
	 * @param {Function} midi MIDI implementation
	 * @param {String} channel MIDI CHannel to dispatch MIDI events to
	 */
	setMIDI(midi, channel="all"){
		this.midiChannel = channel
		this.midi = midi
		this.midiPlayer = new MIDIInstrument(midi, channel)
		this.instruments.push( this.midiPlayer )
		console.log("MIDI set for person", this, "Channel:"+channel, {midi,channel, hasMIDI:this.hasMIDI } )
	}

	// send a single midi command to all active instruments
	sendMIDI( methodName="noteOn", ...values ){
		this.instruments.forEach( instrument => {
			console.log("PLAY:", methodName, instrument, {values} )
			//instrument[methodName].apply( values )
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

	/**
	 * This pops up the user side bar and populates it accordingly
	 */
	showForm(){

		//console.log("showForm", this.controlsID, this.controls)
		this.controls.innerHTML = setupInstrumentForm( ()=> {})
		const inputs = this.controls.querySelectorAll('input')
		inputs.forEach( input => input.addEventListener('change', event => this.onInstrumentInput(event) ), false)
		
		// find active input field and focus
		const active = document.getElementById(this.instrumentName)
		if (active)
		{
			active.focus()
		}else{
			// send focus to form?
			this.controls.focus()
		}

		//console.log("Form", {active})
		this.controls.classList.toggle("showing",true)
	}

	/**
	 * Hide this Person's form
	 */
	hideForm(){
		//const inputs = this.controls.querySelectorAll('input')
		//inputs.forEach( input => input.removeEventListener('change',  this.onInstrumentInput))
		this.controls.innerHTML = ''
		setTimeout( ()=> this.controls.classList.toggle("showing",false), 303 )
	}
}