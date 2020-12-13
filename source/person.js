// each person in the app has their own instrument and face

import { 
	active, playing, 
	FOLDERS,
	loadInstrument, INSTRUMENT_NAMES, randomInstrument, 
	playTrack, playAudio, stopAudio, 
	bufferLength,dataArray, 
	setupAudio, 
	setShape, setFrequency, setAmplitude, 
	record } from './audio'
	
import { easeInSine, easeOutSine , easeInCubic, lerp,clamp, TAU} from "./maths"
import { DEFAULT_COLOURS, clear,drawFace, drawPoints, drawPart, drawEye, drawMouth,drawBoundingBox, canvas, canvasContext,drawWaves, drawBars} from './visual'

// options
const ease = easeInCubic // easeInSine

export const LIPS_RANGE = 40
const DEFAULT_OPTIONS = DEFAULT_COLOURS

export default class Person{

	constructor(name, audioContext, destinationNode, options={} ) {
		this.name = name
		this.counter = 0
		this.data = null
		this.audioContext = audioContext

		this.stereoNode =  audioContext.createStereoPanner()

		const delayNode = audioContext.createDelay(100)
		const feedbackNode = audioContext.createGain()
		delayNode.delayTime.value = 0.54
		feedbackNode.gain.value = 0.2


		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

			

		this.stereoNode.connect(this.gainNode)
		this.stereoNode.connect(delayNode)

		delayNode.connect(feedbackNode)
		feedbackNode.connect(delayNode)
		//delayNode.connect(destinationNode)
		 delayNode.connect(this.gainNode)


		this.gainNode.connect(destinationNode)

		this.button = document.getElementById(name)
		this.button.addEventListener( 'click', event => {
			this.loadInstrument( randomInstrument() )
			event.preventDefault()
		})
		this.button.addEventListener( 'mouseover', event => {
			this.isMouseOver = true
		})
		this.button.addEventListener( 'mouseout', event => {
			this.isMouseOver = false
		})
		console.log("Created new person", this, "connecting to", destinationNode )
		this.options = Object.assign({}, DEFAULT_COLOURS, options)
	}

	get instrumentName(){
		return this.instrument ? this.instrument.title : 'loading'
	}

	update(prediction){
		
		this.counter++
		this.data = prediction
	}

	draw(prediction){
		
		if (!prediction && !this.prediction)
		{
			// nothing to refresh so exit here
			return
		}else if (!prediction){
			// refresh
			prediction = this.prediction
		}

		// NB. assumes screen has been previously cleared	
		// drawBox( prediction )
		drawPoints( prediction, this.options.dots )
		drawFace( prediction, this.options )
		// drawBoundingBox( prediction.boundingBox )

		const {bottomRight, topLeft} = prediction.boundingBox
		const boxWidth = bottomRight[0] - topLeft[0]
		const boxHeight = bottomRight[1] - topLeft[1]
			
		// we only want this every frame or so as this 
		// is altering the DOM
		if (this.counter%10===0)
		{
			this.button.style.setProperty('--person-a-x', `${topLeft[0]}` )
			this.button.style.setProperty('--person-a-y', topLeft[1] )
			this.button.style.setProperty('--person-a-w', boxWidth )
			this.button.style.setProperty('--person-a-h', boxHeight )			
		}

		// draw silhoette if the user is interacting
		if (this.isMouseOver && this.counter%2 === 0)
		{	
			const {silhouette} = prediction.annotations
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
		}
	}
	
	sing(){

		if (!this.data)
		{
			return
		}
		const prediction = this.data

		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = clamp( prediction.mouthRange / LIPS_RANGE, 0 , 1 )
		const yaw = prediction.yaw
		const pitch = prediction.pitch // Math.abs()

		// volume is an log of this
		const amp = clamp(lipPercentage, 0, 1 ) //- 0.1
		const logAmp = ease(amp)

		// console.log("Person", prediction.yaw , yaw)
		// // console.log("Person", {lipPercentage, yaw, pitch, amp, logAmp})

		this.stereoNode.pan.value = clamp(yaw, -1, 1 ) 
		//this.stereoNode.pan.setValueAtTime(panControl.value, this.audioContext.currentTime);
			
		// !active && active is updated by playback state
		if (this.instrument && amp > 0.3)
		{
			this.gainNode.gain.value = logAmp

			// only change the note if not active?
			if (active)
			{

			}

			// play a note from the collectionlogAmp
			const noteNumber = Math.floor( lipPercentage * (INSTRUMENT_NAMES.length-1) )
			const noteName = INSTRUMENT_NAMES[noteNumber]
			const note = this.instrument[ noteName ]
			
			// TODO: add velocity logAmp
			const track = playTrack( note, 0, this.stereoNode )
		
			// send out some MIDI yum yum noteName && 
			if (this.midi && this.midiChannel)
			{
				// duration: 2000,
				//console.log("MIDI",amp, noteNumber, INSTRUMENT_NAMES.length, noteName, this.midiChannel)
				this.midi.playNote(noteName, this.midiChannel, { velocity:amp})
			}
			
		}else{
			this.gainNode.gain.value = 0
		}	

		return {
			yaw, pitch,
			lipPercentage
		}
	}

	async loadInstrument(instrumentName){
		this.instrument = await loadInstrument( instrumentName )
	}

	setMIDI(midi, channel="all"){
		this.midiChannel = channel
		this.midi = midi
	}
}