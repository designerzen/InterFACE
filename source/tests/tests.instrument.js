

import {Pane} from 'tweakpane'
import { active, playing, setupAudio } from '../audio/audio.js'
import { playNextPart, kitSequence } from '../timing/patterns.js'
import GamePad, { COMMANDS, GAME_PAD_CONNECTED, GAME_PAD_DISCONNECTED, GamePadManager } from '../hardware/gamepad.js'
import AudioTimer from '../timing/timer.audio.js' 
import {convertNoteNameToMIDINoteNumber, GENERAL_MIDI_NUMBERS_BY_NAME, MIDI_NOTE_NAMES, MIDI_NOTE_NUMBER_MAP, MIDI_NOTE_NUMBERS}  from '../audio/tuning/notes.js'

import {GENERAL_MIDI_INSTRUMENT_NAMES} from '../audio/midi/general-midi-instrument.constants.js'	 
import * as GENERAL_MIDI_INSTRUMENTS from '../audio/midi/general-midi-instrument.constants.js'	

import {addInteractivityToInstrumentPanel, createDraggablePanel, createInstrumentFormHTML, populateInstrumentPanel} from '../dom/ui.panel-instruments.js'
import { 
	getRandomBassPresetIndex, 
	getRandomBrassPresetIndex,
	getRandomChromaticPercussionPresetIndex, 
	getRandomEnsemblePresetIndex, 
	getRandomEthnicPresetIndex, 
	getRandomGuitarPresetIndex, 
	getRandomOrganPresetIndex, 
	getRandomPercussivePresetIndex, 
	getRandomPianoPresetIndex, 
	getRandomPipePresetIndex, 
	getRandomReedPresetIndex, 
	getRandomSFXPresetIndex, 
	getRandomStringsPresetIndex, 
	getRandomSynthFXPresetIndex, 
	getRandomSynthLeadPresetIndex, 
	getRandomSynthPadPresetIndex 
} from '../audio/sound-font-instruments.js'

import Person from '../person.js'
import { createInstrumentFromData, lazilyLoadInstrument } from '../audio/instrument-factory.js'
import { CHORD_INTERVALS_NAMES, CHORD_INTERVALS, createChordsForNoteNumber, createJazzChord, createMajorChord, createMinorChord, getAllChordsForNoteNumber, MODES } from '../audio/tuning/chords.js'
import SVGKeyboard from '../visual/2d.keyboard-svg.js'
import MoogInstrument from '../audio/instruments/instrument.moog.js'

import * as INSTRUMENT from '../audio/instrument-list.js'

const keyboards = []

let audioContext
let timer

let instrument 
let chordInstrument
let drumkitInstrument 

let mixer
let isMuted = false
let initialised = false

let svgKeyboard
const pianoMap = new Map()

let playScales = false
let scaleTypeIndex = 0
let modeTypeIndex = 0		// Major

const randomPiano = getRandomPianoPresetIndex()
const randomChromaticPercussive = getRandomChromaticPercussionPresetIndex()
const randomOrgan = getRandomOrganPresetIndex()
const randomGuitar = getRandomGuitarPresetIndex()
const randomBass = getRandomBassPresetIndex()
const randomString = getRandomStringsPresetIndex()
const randomEnsemble = getRandomEnsemblePresetIndex()
const randomBrass = getRandomBrassPresetIndex()
const randomReed = getRandomReedPresetIndex()
const randomPipe = getRandomPipePresetIndex()
const randomSynthLead = getRandomSynthLeadPresetIndex()
const randomSynthPad = getRandomSynthPadPresetIndex()
const randomSynthFX = getRandomSynthFXPresetIndex()
const randomEthnic = getRandomEthnicPresetIndex()
const randomPercussion = getRandomPercussivePresetIndex()
const randomSFX = getRandomSFXPresetIndex()

const pane = new Pane(new Pane({ title: "Config", expanded: true }))		
console.error( "GENERAL_MIDI_INSTRUMENT_NAMES", {GENERAL_MIDI_INSTRUMENT_NAMES, GENERAL_MIDI_INSTRUMENTS} )
console.error( "Random presets", {randomSFX, randomPercussion, randomEthnic, randomSynthLead, randomSynthPad, randomSynthFX, randomBass, randomBrass, randomString, randomPiano, randomEnsemble, randomGuitar, randomReed,randomPipe, randomOrgan,randomChromaticPercussive, randomOrgan} )


// ------

let chord
const noteOn = (note, velocity=1, id=0) => {
	
	// Chords!
	if (!isMuted && chordInstrument)
	{
		const allChords = getAllChordsForNoteNumber( note )
		const chordsInScale = allChords.get( scaleTypeIndex )
		const chordsInMode = chordsInScale.get(modeTypeIndex)
		
		chord = createChordsForNoteNumber( note, CHORD_INTERVALS[scaleTypeIndex], modeTypeIndex )
		// chord = chordsInMode
		
		console.warn("noteOn", note, {allChords, chord, chordsInScale, chordsInMode, scaleTypeIndex, modeTypeIndex})

		if (chord.length < 3 || !chord[0])
		{
			console.error("Chord not found - check scale and mode names", note, {chord, scaleTypeIndex, modeType: modeTypeIndex} ) 
			return
		}

		// chord = createMajorChord( MIDI_NOTE_NUMBERS, note, 0)
		// console.info("Chord", note, {chord,  scaleTypeIndex, modeType: modeTypeIndex} ) 

		// chord = createMinorChord( MIDI_NOTE_NUMBERS, note, 0)
		// console.info("Minor Chord", note, chord ) 
		
		// chord = createJazzChord( MIDI_NOTE_NUMBERS, note, 0)
		// console.info("Jazz Chord", note, chord ) 
		
		// show keys lit up
		keyboards.forEach( keyboard => 
			chord.forEach( note => 
				keyboard.setKeyAsActive(note.noteNumber) 
			) 
		)
		
		const command = [
			{noteNumber:chord[0].noteNumber, velocity},
			{noteNumber:chord[1].noteNumber, velocity},
			{noteNumber:chord[2].noteNumber, velocity}
		]
		// console.info("Setting keys on keyboards", chord)	
		// console.info("SVG Keys", {command} )
		return chordInstrument.chordOn(command) 
	}

	// single notes
	if (!isMuted && instrument){
		return instrument.noteOn(note, velocity, svgKeyboard)
	}else{
		console.error( isMuted ? "No instrument muted" : "No instrument loaded to play" )
	}

	// drumkit
	if (drumkitInstrument)
	{
		return drumkitInstrument.noteOn(note, velocity, svgKeyboard)
	}
	return false
}


const noteOff = (note, velocity, id=0) => {
	if (!isMuted && chordInstrument && chord)
	{
		// const chord = createMajorChord( MIDI_NOTE_NUMBERS, note, 0)
		//chord = createChordsForNoteNumber( note, scaleType, modeType )
		
		const t = chordInstrument.chordOff([
			{noteNumber:chord[0].noteNumber, velocity:1},
			{noteNumber:chord[1].noteNumber, velocity:1},
			{noteNumber:chord[2].noteNumber, velocity:1}
		]) 
			
		keyboards.forEach( keyboard => 
			chord.forEach( note => 
				keyboard.setKeyAsInactive(note.noteNumber) 
			) 
		)
	
		return t
	}else{
		console.info("chord missing?", {chord,chordInstrument})
	}
	
	// if (!isMuted && instrument)
	// {
	// 	return instrument.noteOff(note)
	// }

	if (drumkitInstrument)
	{
		return drumkitInstrument.noteOff(note)
	}
}


const getNextChord = (noteNumber, scale="major", mode="Dorian") => {

	// Create some scales to test with
	const notes = getAllChordsForNoteNumber(noteNumber)
	// for (const note of notes){
	// 	console.error("note", {note, notes})
	// }
	// notes.forEach((value, key, map) => {
	// 	console.log(key,"chord", value, value.get("Major"))
	// })

	const chordSequence = notes.get(scale).get(mode)

	console.info("Creating a scale to test with", {notes, chordSequence} )

	return chordSequence
}

// ON SCREEN KEYBOARD --------------------------------------------------------
const selectedNotes = MIDI_NOTE_NUMBER_MAP.slice( 45, 87 )
const shortSvgKeyboard = new SVGKeyboard( selectedNotes, noteOn, noteOff )
const shortSvgKeyboardElement = document.body.appendChild(shortSvgKeyboard.asElement)

const allNotes = MIDI_NOTE_NUMBER_MAP.slice( 0,-1 )
svgKeyboard = new SVGKeyboard( allNotes, noteOn, noteOff )
const svgKeyboardElement = document.body.appendChild(svgKeyboard.asElement)

keyboards.push( shortSvgKeyboard, svgKeyboard )
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

	// ensure that the instrument has actually loaded
	await newInstrument.loaded

	// destroy existing...
	
	// Ensure that the instrument has actually changed
	if (instrument === newInstrument)
	{
		// nothing to swap to!
		return false
	}

	// disconnect the output from the instument,
	// kill old instrument and ensure garbage collection
	// deals with the old instrument as soon as possible
	if (instrument)
	{
		instrument.output.disconnect()
		instrument.destroy()
	}
	

	// special case if a chord is loaded
	if (chordInstrument)
	{
		chordInstrument.setInstruments([
			newInstrument,
			newInstrument.clone(),
			newInstrument.clone()
		])
		
		// Already connected
		// chordInstrument.output.connect( mixer )

		await populateInstrumentPanel( controls, chordInstrument )

		addInteractivityToInstrumentPanel( controls, async (preset, event)=>{
			
			const t = await chordInstrument.programChange( preset )
			console.log("Preset selected", {event, preset, instrument, t})
		})
	
		return true
	}
	
	
	// cache new instrument
	instrument = newInstrument
	if (instrument.output)
	{
		instrument.output.connect( mixer )
	}else{
		// no AUDIO output to connect to (could be MIDI output for example)
	}
	 
	await populateInstrumentPanel( controls, newInstrument )
	addInteractivityToInstrumentPanel( controls, async (preset, event)=>{
		
		const t = chordInstrument ? 
			await chordInstrument.programChange( preset ) : 
			await instrument.programChange( preset )
		console.log("Preset selected", {chordInstrument, event, preset, instrument, t})
	})
	
	return true
}



const setup = async () => {

	if (initialised)
	{
		throw Error("Already initialised")
	}
	
	// Enable / Diable the scale playback
	const scalePlaybackToggle = document.querySelector("#toggle-playback-scale")
	scalePlaybackToggle.addEventListener("change", e => {
		playScales = e.target.checked
		console.error("scale playback toggle",{playScales}, e.target.checked )
	})

	const scaleSelect = document.querySelector("#select-scale")
	scaleSelect.addEventListener("change", e => {
		scaleTypeIndex = parseInt(e.target.value)
		console.error("scale select", scaleTypeIndex )
	})

	const modeSelect = document.querySelector("#select-mode")
	modeSelect.addEventListener("change", e => {
		modeTypeIndex = parseInt(e.target.value)
		console.error("mode select", modeTypeIndex )
	})



	const controlsForLeftSide = document.querySelector(".person-a-panel")
	const controlsForRightSide = document.querySelector(".person-b-panel") 
	const controlsForLowerLeftSide = document.querySelector(".person-c-panel") 
	const controlsForLowerRightSide = document.querySelector(".person-d-panel") 

	console.error("Controls for left side", {controlsForLeftSide, controlsForRightSide, controlsForLowerLeftSide, controlsForLowerRightSide} )

	// console.info("pianoKeys", pianoKeys)


	audioContext = new AudioContext()	
	timer = new AudioTimer( audioContext )
	
	mixer = audioContext.createGain()	
	mixer.connect( audioContext.destination )


	// Control Panels --------------------------------------------------------
	if (!controlsForLeftSide)
	{
		throw Error("Could not find the left side controls")
	}

	

	const person = new Person(0)
	
	//- const audio = await setupAudio()
	createDraggablePanel(person, controlsForLeftSide)
	// createDraggablePanel(person, controlsForRightSide, false)
	// createDraggablePanel(person, controlsForLowerLeftSide)
	// createDraggablePanel(person, controlsForLowerRightSide, false)

	// reveal all panels!
	controlsForLeftSide.hidden = false
	// controlsForRightSide.hidden = false
	// controlsForLowerLeftSide.hidden = false
	// controlsForLowerRightSide.hidden = false

	// load an instrument and populate the panels
	const DefaultInstrumentClass = await lazilyLoadInstrument( "OscillatorInstrument" )
	const defaultInstrument = new DefaultInstrumentClass(audioContext)
	const defaultPresets = await swapToInstrument( controlsForLeftSide, defaultInstrument )

	// test some chords!
	// we need to wait for loaded to resolve before we continue...
	chordInstrument = await createInstrumentFromData( audioContext, {type:"ChordInstrument"})
	// chordInstrument = new (await lazilyLoadInstrument( "ChordInstrument" ))(audioContext)
	chordInstrument.setInstruments([

		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"}),
		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"}),
		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"})
		// await lazilyLoadInstrument( "OscillatorInstrument" ),
		// await lazilyLoadInstrument( "OscillatorInstrument" ),
		// await lazilyLoadInstrument( "OscillatorInstrument" )
	])

	chordInstrument.output.connect( mixer )

	const loadInstrument = async (instrumentType) => {
		// TODO: create instrument from the factory
		const options = {
			type:instrumentType,
			// pluginURL:"plps.js"
		}
		// const InstrumentClass = await lazilyLoadInstrument( button.dataset.instrument )
		// const instrumentInstance = new InstrumentClass(audioContext, options)
		const instrumentInstance = await createInstrumentFromData( audioContext, options )
		// console.info( performance.now(), "Swapping Instrument Option", instrumentType, {  instrumentInstance }, instrumentInstance.toString() )
		const instrumentPresets = await swapToInstrument( controlsForLeftSide, instrumentInstance )
		// console.info( performance.now(), "Swapping Instrument Option", instrumentType, { instrumentPresets } )
		return instrumentInstance
	}

	// tie in the instrument list
	const instrumentSelector = document.querySelector("#instrument-selector")
	const instrumentOption = instrumentSelector.querySelectorAll("button") 
	instrumentOption.forEach( button => {
		// console.info("Adding Instrument Option", button, button.dataset.instrument )
		button.addEventListener("click", async(e) => {
			e.preventDefault()
			loadInstrument( button.dataset.instrument )
	 	} )
	})

	initialised = true

	return true
}

document.addEventListener( "mousedown", async (e) => {

	// repeat but ignore if already setup
	if (!initialised){
		await setup()
	}

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

	/**
	 * Start monitoring for global gamepad input
	 * but ignore them until we are ready
	 */
	const watchGamePads = () => {
		const gamepadHeld = new Map()
		const gamePadManager = new GamePadManager()
		// enums
		let gamePadMode = 0
		const gamePadModes = ["beats", "vfx", "instruments"] 
		gamePadManager.addEventListener( (button, value, gamePad, heldFor ) => {
			
			switch(button)
			{
				// ignore caching these
				case GAME_PAD_CONNECTED:
				case GAME_PAD_DISCONNECTED:
				case COMMANDS.LEFT_STICK_Y: 
				case COMMANDS.LEFT_STICK_X: 
				case COMMANDS.RIGHT_STICK_Y: 
				case COMMANDS.RIGHT_STICK_X:
				// case COMMANDS.UP: 
				// case COMMANDS.DOWN: 
				// case COMMANDS.LEFT: 
				// case COMMANDS.RIGHT: 
					break
			
				default: 
					if (value)
					{
						gamepadHeld.set(button, value)
					}else{
						gamepadHeld.delete(button)
					}
			}
			
			switch(button)
			{
				case GAME_PAD_CONNECTED:
					console.info("Gamepad connected", button, value, gamePad )
					break

				case GAME_PAD_DISCONNECTED:
					console.info("Gamepad disconnected", button, value, gamePad )
					break

				// open sidebar
				case COMMANDS.START: 
				
					console.info("Gamepad start", value, { gamePad, gamepadHeld } )
					break
				
				case COMMANDS.SELECT: 
					
					console.info("Gamepad select", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				case COMMANDS.A: 
					console.info("Gamepad A", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				case COMMANDS.B: 
					console.info("Gamepad B", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				case COMMANDS.X: 
					console.info("Gamepad X", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				case COMMANDS.Y: 
					console.info("Gamepad Y", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				// If we are in a certain mode...
				// adapt 
				case COMMANDS.LB: 
					console.info("Gamepad LB", value, { gamePad, gamepadHeld, heldFor } )
					break
				
				case COMMANDS.LB: 
					console.info("Gamepad LB", value, { gamePad, gamepadHeld, heldFor } )
					break

				case COMMANDS.RB: 
					console.info("Gamepad RB", value, { gamePad, gamepadHeld, heldFor } )
					break

				case COMMANDS.LT: 
					console.info("Gamepad LT", value, { gamePad, gamepadHeld, heldFor } )
					break

				case COMMANDS.RT: 
					console.info("Gamepad RT", value, { gamePad, gamepadHeld, heldFor } )
					break

				default:
					console.info("Gamepad", { gamePadManager, button, value, gamePad, heldFor } )
			}
		})
	}

	// Only notes between 45 and 92 sound good!

	let chordIndex = 0
	const velocity = 127
	timer.setCallback( ( timeData )=>{
		// console.info("tick", timeData)
		// timeData.bar +
		if (playScales && timeData.divisionsElapsed === 0)
		{
			chordIndex = chordIndex % MIDI_NOTE_NUMBERS.length
			const chordSequence = getNextChord( chordIndex++, scaleTypeIndex, modeTypeIndex )
			// chordIndex = (chordIndex + 1)%chordSequence.length
			// const chordNote = chordSequence[chordIndex]
			
			// we only care about division 1?
			//- timer.isAtStart && advanceDrumSequence()
			//- timer.isQuarterNote && advanceDrumSequence()		
			const command = [
				{noteNumber:chordSequence[0].noteNumber, velocity},
				{noteNumber:chordSequence[1].noteNumber, velocity},
				{noteNumber:chordSequence[2].noteNumber, velocity}
			]

			console.log(chordIndex, "fetching next part of the scale", {chordSequence, values: timeData, command})
			
			chordInstrument.chordOn(command) 
		}
		
	})


	timer.bpm = 80
	timer.startTimer()

	watchGamePads()
	addSettings()
	
}, {once:true})