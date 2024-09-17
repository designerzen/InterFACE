import {Pane} from 'tweakpane'
import { active, playing, setupAudio } from '../audio/audio.js'
import { playNextPart, kitSequence } from '../timing/patterns.js'
import GamePad from '../hardware/gamepad.js'
import AudioTimer from '../timing/timer.audio.js' 
import {convertNoteNameToMIDINoteNumber, GENERAL_MIDI_NUMBERS_BY_NAME}  from '../audio/tuning/notes.js'

import DrumkitInstrument from '../audio/instruments/instrument.drumkit.js'
import SynthesizerInstrument, {OSCILLATOR_TYPES} from '../audio/instruments/instrument.synthesizer.js'

import {GENERAL_MIDI_INSTRUMENT_NAMES} from '../audio/midi/general-midi-instrument.constants.js'	 
import * as GENERAL_MIDI_INSTRUMENTS from '../audio/midi/general-midi-instrument.constants.js'	 
//- import * as GENERAL_MIDI_INSTRUMENTS from './audio/midi/general-midi-instrument.constants.js'	 

import {createDraggablePanel, createInstrumentFormHTML, populateInstrumentPanel} from '../dom/ui.panel-instruments.js'


const timer = new AudioTimer()
let audioContext
let instrument 
let drumkitInstrument 
let mixer
let isMuted = false

// ------

const pane = new Pane(new Pane({ title: "Config", expanded: true }))		
console.error( "GENERAL_MIDI_INSTRUMENT_NAMES", {GENERAL_MIDI_INSTRUMENT_NAMES, GENERAL_MIDI_INSTRUMENTS} )

// ------


const noteOn = (note, velocity=1) => {
	
	if (!isMuted && instrument)
	{
		return instrument.noteOn(note, velocity)
	}else{
		console.error("No instrument loaded to play notes on or is muted", instrument )
	}

	if (drumkitInstrument)
	{
		drumkitInstrument.noteOn(note, velocity)
	}
	return false
}


const noteOff = note => {
	
	if (!isMuted && instrument)
	{
		instrument.noteOff(note)
	}
	if (drumkitInstrument)
	{
		drumkitInstrument.noteOff(note)
	}
}


// connect to the onscreen keyboard
let isTouching = false
const buttonKeys = document.querySelectorAll(".piano-key")
buttonKeys.forEach( button => {

	let previousNote 
	let noteName 

	const onPianoInteractionStarting = (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		let pressure = 0
		if ((typeof(event.targetTouches) != 'undefined') && (event.targetTouches.length > 0) && (typeof(event.targetTouches[0].force) != 'undefined')) {
			pressure = event.targetTouches[0].force
		} else if (typeof(event.webkitForce) != 'undefined') {
			pressure = event.webkitForce
		} else if (typeof(event.pressure) != 'undefined') {
			pressure = event.pressure
		}

		noteName = button.getAttribute("data-attribute-note")
		// convert name into MIDI note number
		const note = convertNoteNameToMIDINoteNumber(noteName)

		console.info("REQUEST START", {note, noteName, GENERAL_MIDI_INSTRUMENTS})
		isTouching = true
		
		const starting = noteOn(note, pressure > 0 ? pressure : 1)
		previousNote = note

		starting & document.querySelector(`.indicator[data-attribute-note="${noteName}"]`)?.classList?.toggle("active", true)
	
		document.addEventListener("mouseleave", onInterationComplete, false)
		document.addEventListener("mouseup", onInterationComplete, false)
		
		document.addEventListener("touchend", onInterationComplete, false)
		document.addEventListener("touchcancel", onInterationComplete, false)
	}

	const onInterationComplete = (event) => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		isTouching = false

		document.removeEventListener("mouseleave", onInterationComplete)
		document.removeEventListener("mouseup", onInterationComplete)
		
		document.removeEventListener("touchend", onInterationComplete)
		document.removeEventListener("touchcancel", onInterationComplete)
		
		const note = convertNoteNameToMIDINoteNumber(noteName)

		console.info("REQUEST END", {previousNote,note})
		
		noteOff(previousNote)
		document.querySelector(`.indicator[data-attribute-note="${noteName}"]`)?.classList?.toggle("active", false)
	}

	button.addEventListener("touchstart", onPianoInteractionStarting, false) 
	button.addEventListener("mousedown", onPianoInteractionStarting , false)
	
	// if the user has finger down but they change keys...
	button.addEventListener("mouseenter", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}

		if (isTouching)
		{	
			noteName = button.getAttribute("data-attribute-note")

			const note = convertNoteNameToMIDINoteNumber(noteName)

			document.querySelector(`.indicator[data-attribute-note="${previousNote}"]`)?.classList?.toggle("active", false)
			document.querySelector(`.indicator[data-attribute-note="${noteName}"]`)?.classList?.toggle("active", true)
								
			console.info("REQUEST CHANGE", {note, noteName,GENERAL_MIDI_INSTRUMENTS})
			// pitch bend!
			noteOn(note)
			previousNote = note
		}else{
			console.warn("REQUEST CHANGE IGNORED")
		}
	})

	button.addEventListener("mouseleave", event => {
		if (event.preventDefault)
		{
			event.preventDefault()
		}
		// noteOff(previousNote)
		document.querySelector(`.indicator[data-attribute-note="${noteName}"]`)?.classList?.toggle("active", false)
	})

	// button.addEventListener("mouseup", event => {
	// 	console.error(button, event)
	// 	isTouching = false
	// })
})

// ------


const addSettings = () => {
	pane.addBinding(timer, 'bpm', { min: 1, max: 999 })
	//- pane.addBinding(instrument.noiseGainNode, 'value', { min: 0, max: 1 }) 
	//- pane.addBinding(instrument.delayNode.delayTime, 'value', { min: 0, max: 1 }) 
	//- pane.addBinding(instrument.lowpass.frequency, 'value', { min: 0, max: 1 }) 
	//- pane.addBinding(instrument.bandpass.frequency, 'value', { min: 0, max: 1 }) 
	//- pane.addBinding(instrument.bandpass.frequency, 'Q', { min: 0, max: 1 }) 
	//- pane.addBinding(instrument.highpass.frequency, 'value', { min: 0, max: 1 }) 
	pane.addButton({title:'Change Oscillator A'}).on('click', e => instrument.oscillatorAType = OSCILLATOR_TYPES[(Math.random() * OSCILLATOR_TYPES.length) | 0] )
	pane.addButton({title:'Change Oscillator B'}).on('click', e => instrument.oscillatorBType = OSCILLATOR_TYPES[(Math.random() * OSCILLATOR_TYPES.length) | 0])
	//- pane.addButton({title:'Change Break'}).on('click', e => setRandomDrumPattern() )
}

// TODO: Add other players too
const swapToInstrument = async (controls, newInstrument) => {
	instrument = newInstrument
	instrument.output.connect( mixer )
	return await populateInstrumentPanel( controls, newInstrument )
}

const setup = async () => {
	
	const controlsForLeftSide = document.querySelector(".person-a-panel")
	const controlsForRightSide = document.querySelector(".person-b-panel") 
	const controlsForLowerLeftSide = document.querySelector(".person-c-panel") 
	const controlsForLowerRightSide = document.querySelector(".person-d-panel") 

	audioContext = new AudioContext()	
	
	drumkitInstrument = new DrumkitInstrument(audioContext) 
	
	mixer = audioContext.createGain()	
	mixer.connect( audioContext.destination )

	//- const audio = await setupAudio()
	createDraggablePanel(controlsForLeftSide)
	createDraggablePanel(controlsForRightSide, false)
	createDraggablePanel(controlsForLowerLeftSide)
	createDraggablePanel(controlsForLowerRightSide, false)

	// reveal all panels!
	controlsForLeftSide.hidden = false
	controlsForRightSide.hidden = false
	controlsForLowerLeftSide.hidden = false
	controlsForLowerRightSide.hidden = false

	// load instrument and populate the panels
	await swapToInstrument( controlsForLeftSide, new SynthesizerInstrument(audioContext) )
	
	debugger
	
	return true
}

document.addEventListener( "mousedown", async (e) => {

	await setup()

	// 
	window.addEventListener('keydown', async (event)=>{
		const isNumber = !isNaN( parseInt(event.key) )
		const focussedElement = document.activeElement

		if (isNumber){
			
		}else{
			switch(event.key)
			{
				case 'a':

					break
				case 'q':
				
					break
				case 'c':
				
					break
				case 'd':
				
					break
				case 'e':
				
					break
				case 's':
				
					break
				case 'w':
				
					break
				case 'r':
				
					break
				default: 
				
			}
		}
	})

	const pad = new GamePad()
	pad.on( press => {

	})

	timer.setCallback( ( values )=>{
		
		// we only care about division 1?
		//- timer.isAtStart && advanceDrumSequence()
		//- timer.isQuarterNote && advanceDrumSequence()
	})
	timer.bpm = 120
	//- timer.startTimer()

	addSettings()
	
}, {once:true})