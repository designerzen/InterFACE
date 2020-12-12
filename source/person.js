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

const lipsRange = 40
const DEFAULT_OPTIONS = DEFAULT_COLOURS

export default class Person{

	constructor(name, audioContext, destinationNode, options={} ) {
		this.name = name
		this.counter = 0
		
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0
		this.gainNode.connect(destinationNode)

		this.button = document.getElementById(name)
		this.button.addEventListener( 'click', event => {
			this.loadInstrument( randomInstrument() )
			event.preventDefault()
		})
		console.log("Created new person", this, "connecting to", destinationNode )
		this.options = Object.assign({}, DEFAULT_COLOURS, options)
	}

	get instrumentName(){
		return this.instrument ? this.instrument.title : 'loading'
	}

	update(prediction){
		
		this.counter++

		if (!prediction)
		{
			return// nothing to refresh
		}

		// assumes screen has been previously cleared	
		// drawBox( prediction )
		drawPoints( prediction, this.options.dots )

		drawFace( prediction, this.options )
		// drawBoundingBox( prediction.boundingBox )

		// we only want this every frame or so
		if (this.counter%10===0)
		{
			const {bottomRight, topLeft} = prediction.boundingBox
			
			this.button.style.setProperty('--person-a-x', `calc(${topLeft[0]})` )
			this.button.style.setProperty('--person-a-y', topLeft[1] )
			this.button.style.setProperty('--person-a-w', bottomRight[0] - topLeft[0] )
			this.button.style.setProperty('--person-a-h', bottomRight[1] - topLeft[1] )

		}
	
		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = prediction.mouthRange / lipsRange
		
		const yaw = Math.abs(prediction.yaw)
		const pitch = prediction.pitch // Math.abs()

		// volume is an log of this
		const amp = clamp(lipPercentage, 0, 1 ) //- 0.1
		const logAmp = ease(amp)
			
		// !active && active is updated by playback state
		if (this.instrument && amp > 0.3)
		{
			// play a note from the collectionlogAmp
			const noteNumber = Math.floor( yaw * INSTRUMENT_NAMES.length )
			const note = this.instrument[ INSTRUMENT_NAMES[noteNumber] ]
			const track = playTrack( note, 0, this.gainNode )
			// send out some MIDI yum yum
			if (this.midiChannel)
			{
				this.midiChannel.playNote(note)
			}
			this.gainNode.gain.value = logAmp

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
	setMidi(midi){
		this.midi = midi
	}
}