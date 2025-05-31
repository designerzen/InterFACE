

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

const timer = new AudioTimer()

let audioContext
let instrument 
let chordInstrument
let drumkitInstrument 
let mixer
let isMuted = false
let initialised = false

const pianoMap = new Map()

// ------

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


let playScales = false
let scaleTypeIndex = 0
let modeTypeIndex = 0		// Major


// ------

let chord
const noteOn = (note, velocity=1, keyboard) => {
	
	// Chords!
	if (!isMuted && chordInstrument)
	{
		const allChords = getAllChordsForNoteNumber( note )
		const chordsInScale = allChords.get( scaleTypeIndex )
		const chordsInMode = chordsInScale.get(modeTypeIndex)
		
		chord = createChordsForNoteNumber( note, CHORD_INTERVALS[scaleTypeIndex], modeTypeIndex )
		
		chord = chordsInMode
		
		console.warn("noteOn", note, {allChords, chord, chordsInScale, chordsInMode})

		if (chord.length < 3 || !chord[0])
		{
			console.error("Chord not found - check scale and mode names", note, {chord, scaleTypeIndex, modeType: modeTypeIndex} ) 
			return
		}

		// chord = createMajorChord( MIDI_NOTE_NUMBERS, note, 0)
		console.info("Chord", note, {chord,  scaleTypeIndex, modeType: modeTypeIndex} ) 

		// chord = createMinorChord( MIDI_NOTE_NUMBERS, note, 0)
		// console.info("Minor Chord", note, chord ) 
		
		// chord = createJazzChord( MIDI_NOTE_NUMBERS, note, 0)
		// console.info("Jazz Chord", note, chord ) 

		const key1 = pianoMap.get( chord[0].noteNumber )
		const key2 = pianoMap.get( chord[1].noteNumber )
		const key3 = pianoMap.get( chord[2].noteNumber )

		key1.classList.add("active")
		key2.classList.add("active")	
		key3.classList.add("active")

		const command = [
			{noteNumber:chord[0].noteNumber, velocity},
			{noteNumber:chord[1].noteNumber, velocity},
			{noteNumber:chord[2].noteNumber, velocity}
		]

		if (keyboard)
		{
			chord.forEach( note => keyboard.setKeyAsActive(note.noteNumber) )
			console.info("Setting keys on keyboard", chord)
		}
		
		console.info("SVG Keys", {key1,key2,key3,command} )

		return chordInstrument.chordOn(command) 
	}



	// single notes
	if (!isMuted && instrument){
		return instrument.noteOn(note, velocity)
	}else{
		console.error( isMuted ? "No instrument muted" : "No instrument loaded to play" )
	}

	// drumkit
	if (drumkitInstrument)
	{
		return drumkitInstrument.noteOn(note, velocity)
	}
	return false
}


const noteOff = (note, velocity, keyboard) => {
	if (!isMuted && chordInstrument && chord)
	{
		// const chord = createMajorChord( MIDI_NOTE_NUMBERS, note, 0)
		//chord = createChordsForNoteNumber( note, scaleType, modeType )
		
		const t = chordInstrument.chordOff([
			{noteNumber:chord[0].noteNumber, velocity:1},
			{noteNumber:chord[1].noteNumber, velocity:1},
			{noteNumber:chord[2].noteNumber, velocity:1}
		]) 
		
		const key1 = pianoMap.get( chord[0].noteNumber )
		const key2 = pianoMap.get( chord[1].noteNumber )
		const key3 = pianoMap.get( chord[2].noteNumber )

		key1.classList.remove("active")
		key2.classList.remove("active")	
		key3.classList.remove("active")

		
		if (keyboard)
		{
			chord.forEach( note => keyboard.setKeyAsInactive(note.noteNumber) )
			console.info("Setting keys on keyboard")
		}

		return t
	}else{
		console.info("chord missing?", {chord,chordInstrument})
	}
	
	if (!isMuted && instrument)
	{
		return instrument.noteOff(note)
	}

	if (drumkitInstrument)
	{
		return drumkitInstrument.noteOff(note)
	}
}

const getNextChord = (noteNumber, scale="major", mode="Major") => {

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

const allNotes = MIDI_NOTE_NUMBER_MAP.slice( 0,-1 )
const svgKeyboard = new SVGKeyboard( allNotes, noteOn, noteOff )
const svgKeyboardElement = document.body.appendChild(svgKeyboard.asElement)

const selectedNotes = MIDI_NOTE_NUMBER_MAP.slice( 45, 87 )
const svgKeyboardShort = new SVGKeyboard( selectedNotes, noteOn, noteOff )
const svgKeyboardShortElement = document.body.appendChild(svgKeyboardShort.asElement)

console.info("SVG Keyboard long", {svgKeyboard, svgKeyboardElement})
console.info("SVG Keyboard short", {svgKeyboardShort, svgKeboardShortElement: svgKeyboardShortElement})




// connect to the onscreen keyboard
let isTouching = false
const staticKeyboard = document.querySelector(".static-piano")
const buttonKeys = staticKeyboard.querySelectorAll(".piano-key")
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

		// console.info("REQUEST START", {note, noteName, GENERAL_MIDI_INSTRUMENTS})
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

		// console.info("REQUEST END", {previousNote,note})
		
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
								
			// console.info("REQUEST CHANGE", {note, noteName,GENERAL_MIDI_INSTRUMENTS})
			// pitch bend!
			noteOn(note)
			previousNote = note
		}else{
			// console.warn("REQUEST CHANGE IGNORED")
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

	// ensure that the instrument has actually loaded
	await newInstrument.loaded

	// special case if a chord is loaded
	if (chordInstrument)
	{
		chordInstrument.setInstruments([
			newInstrument,
			newInstrument.clone(),
			newInstrument.clone()
		])
			
		await populateInstrumentPanel( controls, newInstrument )
		addInteractivityToInstrumentPanel( controls, async (preset, event)=>{
			
			const t = await instrument.programChange( preset )
			console.log("Preset selected", {event, preset, instrument, t})
		})
		
		return true
	}
	
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

	// SVG Keys --------------------------------------------------------------
	const pianoKeys = document.querySelector(".piano-key-notes")
	
	// pianoKeys.children.forEach( key => {
	// pianoKeys.childNodes.forEach( key => {

	let p = 0
	for(let key=pianoKeys.firstChild; key!==null; key=key.nextSibling) {

		if (!key.dataset)
		{
			continue
		}
	
		const note = key.getAttribute("data-attribute-note")
		
		// const note = key.dataset.attributeNote
		pianoMap.set( note, key)

		// convert to midi number...
		const midiNumber = MIDI_NOTE_NAMES.indexOf(note)
		pianoMap.set( midiNumber, key)
		pianoMap.set( p, key)

		console.info("pianoKey", key.dataset,{ key, note, pianoMap} )

		p++
	}

	console.info("pianoKeys", pianoKeys)


	audioContext = new AudioContext()	
	
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



	/*
	chordInstrument.setInstruments([

		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"}),
		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"}),
		await createInstrumentFromData( audioContext, {type:"OscillatorInstrument"})
		// await lazilyLoadInstrument( "OscillatorInstrument" ),
		// await lazilyLoadInstrument( "OscillatorInstrument" ),
		// await lazilyLoadInstrument( "OscillatorInstrument" )
	])
	*/ 


	const loadInstrument = async (instrumentType) => {
		// TODO: create instrument from the factory
		const options = {
			type:instrumentType,
			pluginURL:"plps.js"
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
			loadInstrument( button.dataset.instrument )
			e.preventDefault()
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