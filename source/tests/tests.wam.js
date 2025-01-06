import 'audioworklet-polyfill'
import abcjs  from 'abcjs'

// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import * as THREE from "three/src/Three.js"
// import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

import {
	createInstruments, 
	getRandomInstrument, getInstrumentFamily,
	instrumentFolders, instrumentNames, loadInstrumentDataPack, 
	loadInstrumentFromSoundFontString, loadInstrumentFromSoundFontStringViaWorker, INSTRUMENT_PACKS, getNextSoundPackName, getGeneralMIDIInstrumentFolders, getGeneralMIDIInstrumentNames, getGeneralMIDIInstrumentFileFromName
} from '../audio/sound-font-instruments.js'

// this just uses Parcel to bundle the file locally
// and stores the URL that the file is available  in the plugin constant
//- import pluginURL from 'url:./audio/wam2/simple/index.js'

import { initializeWamHost } from "@webaudiomodules/sdk"

// import SimplePlugin from "../audio/wam2/simple/index.js"
// import simplePluginURI from "worklet:../audio/wam2/simple/index.js"
// import simplePluginURI from "url:./audio/wam2/simple/index.js"

// import samplerPluginURI from "url:./audio/wam2/sampler/index.js"
// import samplerPluginURI from "worklet:./audio/wam2/sampler/index.js"

// console.error("WAM:", simplePluginURI)

// import tinySynthWAMPlugin from "./audio/wam2-external/tinySynth/src/index.js"	
// import synthWAMPlugin from "./audio/wam2-external/synth101/src/index.tsx"	
// import exampleWAMPlugin from "url:./audio/wam2-external/WamExample/src/index.js"	

// Instruments with common interfaces
import WAMInstrument from "../audio/instruments/instrument.wam.js"
import WAM2Instrument from "../audio/instruments/instrument.wam2.js"
import SoundFontInstrument from "../audio/instruments/instrument.soundfont.js"

import SoundFont from '../audio/sound-font.js'
import { loadInstrumentFromSoundFont, convertArrayToBuffer } from "../audio/audio.js"
import { CMD_DECODE, CMD_LOAD_SOUNDFONT_PART, EVENT_DECODED } from "../audio/fetch.audio.worker.js"

import { loadMIDI, loadMIDIFile, loadMIDIFileThroughClient } from '../audio/midi/midi-file.js'

import { connectDropZone } from '../dom/drop-zone.js'

import {WebMidi} from "webmidi"

import MIDIInstrument from '../audio/instruments/instrument.midi.js'
import OscillatorInstrument from '../audio/instruments/instrument.oscillator.js'
import RecordInstrument from '../audio/instruments/instrument.record.js'

import { unzip } from '../utils/zlib.js'
import { extractZip } from '../utils/zip.js'
import { GENERAL_MIDI_FAMILIES, GENERAL_MIDI_FAMILY_DICTIONARY, GENERAL_MIDI_INSTRUMENT_FAMILIES, GENERAL_MIDI_INSTRUMENTS, GENERAL_MIDI_INSTRUMENT_FAMILY_IDS } from '../audio/midi/general-midi.constants.js'

import MIDI_FILE from "url:../assets/audio/midi_midi-sans-frontieres.mid"
import { convertMIDITrackToNotation } from '../audio/midi/midi-to-notation.js'

import { testLoadPresets } from './test.load-presets.js'
import { testSoundfontInstrument } from './test.soundfont-instrument.js'
import InstrumentFactory from '../audio/instrument-factory.js'

// 
import INSTRUMENT_DATA from "raw:../settings/instruments.json"
// import INSTRUMENT_DATA from "url:./settings/instruments.json"
const INSTRUMENT_LIST = INSTRUMENT_DATA
// const INSTRUMENT_LIST = new URL(
// 	'./settings/instruments.json',
// 	import.meta.url
// )


console.log( {
	GENERAL_MIDI_INSTRUMENTS,
	GENERAL_MIDI_INSTRUMENT_FAMILIES,
	GENERAL_MIDI_FAMILIES,
	GENERAL_MIDI_FAMILY_DICTIONARY,
	GENERAL_MIDI_INSTRUMENT_FAMILY_IDS 
} )


// import MIDI_FILE from "url:./assets/audio/midi_nyan-cat.mid"

// Worklets
// import workletURIForWAM from "worklet:./audio/instruments/worklets/sampler.worklet.js"
// import {WORKLET_SAMPLER} from "./audio/instruments/worklets/sampler.worklet.js"

// Data to feed to the instruments
// import audioSample from 'url:/dist/assets/audio/Fatboy/bright_acoustic_piano-mp3/C3.mp3'

// Safari...
const AudioContext = window.AudioContext || window.webkitAudioContext || false



// TESTING
// import createAppInterface from './interface-test.js'

let initialised = false
let currentPluginAudioNode

// const createAudioProcessor = async(audioContext, workletURI, name) => {

// 	try {
	
// 		await audioContext.audioWorklet.addModule(workletURI)
	
// 	} catch (e) {
// 		console.error("Audio Processor failed", e)
// 		return null
// 	}

// 	return new AudioWorkletNode( audioContext, name )
// }

const create = async(audioContext, offlineAudioContext) => {
	
	// 
	let packName = INSTRUMENT_PACKS[0]
	const soundFontOptions = {
		pack:packName
	}

	// main output fader
	const masterGain = new GainNode(audioContext)
	
	// connect our master fade node to the audioContext output
	// and we add all instruments to this masterGain which acts like 
	// a one channel mixer
	masterGain.connect(audioContext.destination)

	// Load in out instruments!
	const factory = new InstrumentFactory(audioContext)
	const list = await factory.loadList(INSTRUMENT_LIST)
	const instruments = await factory.loadInstruments()

	const instrumentOscillator = await factory.loadInstrumentByType("oscillator")
	//const instrumentOscillator = new OscillatorInstrument( audioContext )
	
	const instrumentSoundFont = await factory.loadInstrumentByType("soundfont", soundFontOptions)
	

	// 02085107104 
	// sir ludwig utsman
	// e20 1as
	// ultrasound 
	// 11th 5:15

	console.error("Factory", {
		instruments,
		INSTRUMENT_LIST,
		factory, list,
		instrumentOscillator, instrumentSoundFont
	 })

	return





	// const instruments = createInstruments()

	let instrumentName = getRandomInstrument() 

	// allows us to replay these commands later on...
	const instrumentNoteRecorder = new RecordInstrument(audioContext)

	// then when we want to replay...
	// convertCommandsToTrack( midiRecorder.recording )

	// const packData = await loadInstrumentDataPack()
	
	// const instrumentAudioBuffers = await Promise.all(
	// 	loadInstrumentParts( audioContext, instrumentName, packName )
	// )
	
	// const instrumentStringSamples = await loadSoundFontFromString( instrumentName, {soundfont:packName} )
	// let instrumentAudioBuffers = await loadSoundFontFromStringViaWorker( audioContext, instrumentName, {soundfont:packName}, (percent)=>console.log(percent) )
	// console.error("Pack instrumentStringData", {instrumentStringSamples} )
	
	//await registerAudioWorklets( audioContext )
	
	// these are UInts so we need to co
	// const audioBuffer = await convertArrayToBuffer( audioContext , buffers[0] )
	// const audioBuffer = instrumentAudioBuffers[0]
	
	// load all audio buffers in the scale


	// console.log("load data via worker...", {workerLoadedAudioBuffers, instrumentAudioBuffers} )

	// const zipURL = `https://gleitz.github.io/midi-js-soundfonts/${packName}/acoustic_guitar_steel-ogg.js.gz`
	// const response = await fetch(zipURL)
	// const zippedData = await response.arrayBuffer()
	// const unzippedData = await extractZip(zippedData, true)
	// this is still just a string of numbers...
	// console.error(zipURL, {zippedData, unzippedData} )

	/*
	const soundFontModel = new SoundFont( offlineAudioContext )
	const soundFontModels = await soundFontModel.loadDescriptor( packName, "assets/audio/" )
	// const all = await soundFontModel.loadAllPresets()

	console.log("SFModel", {soundFontModel,soundFontModels})
	
	const options = {
		// URI of the sound font
		soundfont : packName,
		// try and use a seperate thread for loading and decoding the data
		usingWorker : false,
		// load as a single string and convert to individual files
		loadAsOne : false
	}
	
	const piano = await soundFontModel.loadPreset( soundFontModels[0].name, options )

	const pianoFromString = await soundFontModel.loadPreset( soundFontModels[0].name, { ...options, loadAsOne : true } )

	const presets = [piano, pianoFromString ]//await soundFontModel.loadAllPresets( options )
	
	// const description = await soundFontModel.loadPreset( soundFontModels[0].location )
	console.log("SFModel", {piano, pianoFromString, presets, audioContext, offlineAudioContext})

*/

	// await soundFont.loadFont(packName, p => console.log(p) )

	// console.error("soundFontModel", {soundFontModel, description: piano})

	// console.error("Pack data", { instrumentSamples: instrumentAudioBuffers, instruments, instrumentFamily, instrumentFolders, instrumentNames, instrument: instrumentName} )
	// console.error("Pack data", {instrumentStringSamples, instrumentSamples, packData, instruments, instrumentFamily, instrumentFolders, instrumentNames, instrument: instrumentName} )



	// Create a wrapped WAM
	// const wam = new WAMInstrument( audioContext, {wamURL:"./audio/wam2/simple/index.js"})
	// const wam2 = new WAM2Instrument( audioContext, {wamURL:simplePluginURI} )

	// ------------------------------------------------------------------------


	// you can provide pack data directly instead of pack name
	const soundFont = new SoundFontInstrument( audioContext, soundFontOptions )
	soundFont.audioNode.connect(masterGain)

	console.log("SoundFont", {soundFont} )
	
	// load in a sound font - this can be either a fully qualified url
	// a relative uri or the name of the pack
	// await soundFont.loadFont( packName, p => console.log(p) )
	
	// fetch the available presets from the instrument...
	const availablePresets = await soundFont.getPresets()
	
	console.log("SoundFont presets", {availablePresets} )

try{
	const preset = await soundFont.loadPreset( availablePresets[0], packName, p => console.log(p) )
	// await soundFont.loadPreset( soundFont.instrumentFolders[0], packName, p => console.log(p) )

	// soundFont.loadRandomPreset()
	// soundFont.noteOn( 99, 0.5 )

	console.log("SoundFont preset", {soundFont, preset} )	

}catch(error){
	
	console.log("SoundFont error", {error} )	
}


	// ------------------------------------------------------------------------

	// WebMidi.addListener( "noteon")
	const midiController = await WebMidi.enable()
	const midiDevice = midiController.outputs[0]
	if (midiDevice)
	{
		const midiInstrument = new MIDIInstrument( audioContext, midiDevice )
		console.error("midiController" , {midiController,midiDevice, midiInstrument} )
		// midiInstrument has no audio outputs so we dont connect it to the mixer
	}
	

	// ------------------------------------------------------------------------

	// const instrumentOscillator = new OscillatorInstrument( audioContext )
	
	// RAW WAM PLugins - not using the WAM2 instrument...

	

	// set which instruments to send midi data to...
	const NSTRUMENTS = [
		instrumentOscillator,
		instrumentNoteRecorder,
		soundFont
	]


	/*
	const [hostGroupId] = await initializeWamHost(audioContext)

	// load main plugin file
	// const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
	const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
	const { default: pingPongDelayWAMPlugin } = await import("./audio/wam2/pingpongdelay/index.js")
	const { default: samplerWAMPlugin } = await import("./audio/wam2/sampler/index.js")
	

	// You can can optionally specify additional information such as the initial state 
	// Create a new instance of the plugin, equivalent to :
	// const wam = new WAM(audioCtx);
	// await wam.initialize(initialState);

	// console.log("Creating WAM Instruments...", {hostGroupId, simpleWAMPlugin}  )

	const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created simplePlugin Instrument", {simplePlugin} )

	// const pingPongDelayPlugin = await pingPongDelayWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// console.log("Created pingPongDelayPlugin Instrument", { pingPongDelayPlugin} )

	const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created samplerPlugin Instrument", {samplerPlugin} )
	
	// should we handle this externally or internalluy?
	// const audioBufferSample = await samplerPlugin.audioNode.loadAudio( instrumentAudioBuffers[0] )
	// samplerPlugin.audioNode.play( sample )
	
	// const sampleRaw = await samplerPlugin.audioNode.loadAudioArrayBuffer( audioBuffer )


	// console.log("Created sampleRaw", {sampleRaw, audioBuffer} )
	*/

	/*
	const cpu = await createAudioProcessor( audioContext, workletURIForWAM, WORKLET_SAMPLER )
	console.log("Created Audio Worklet", {cpu, audioSample, sample, sampleRaw} )

	if (!cpu){
		// now worklet availability :(
		console.error("FAILED Audio Worklet", {cpu} )
	}else{
		cpu.port.postMessage("load")
	}
	*/
	
	// Very simple function to connect the plugin audionode to the host
	const connectPlugin = (context, inputNode, plugin) => {
		
		// const pluginNode = plugin.audioNode
		// grab the onscreen streaming media item
	
		// connect the source to plugin
		// const simpleGainPluginAudioNode = simplePlugin.getAudioNode()
		inputNode.connect(plugin.audioNode)

		// simpleGainPluginAudioNode.connect(audioContext.destination);
		//plugin.outputNode.connect(masterGain)
		// for wam...
		plugin.audioNode.connect(masterGain)

		// pingPongDelayPlugin.audioNode.connect(output.destination)
		console.log("Creating Media source", {context, inputNode, plugin} )

		// return the audio node within the plugin
		return plugin.audioNode
	}

	// Very simple function to append the plugin root dom node to the host
	const mountPlugin = (domNode) => {
		mount.innerHtml = ''
		mount.appendChild(domNode)
	}

	// create a data object that contains the full state of the plugin
	const downloadState = async () => {
		let state = await pluginInstance.audioNode.getState()
		const blob = new Blob([JSON.stringify(state, undefined, 2)])
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = 'state.json'
		link.click()
	}

	/**
	 * Load in some MIDI! 
	 * Also loads in the required instruments to play this 
	 * track from the programChange requests
	 * 
	 * update visuals on success innit
	 * 
	 * @param {mixed} fileData 
	 * @param {Function} onProgress 
	 * @returns 
	 */
	const loadMIDIData = async ( fileData, soundFontName, onProgress ) => {
		try{
			
			const options = {
				useWorker:false
			}
			
			const midiFile = await loadMIDI(fileData, options, p => onProgress && onProgress( p/10 ) )
			
			// now load the instruments specified in the midi files...
			const instruments = midiFile.instruments
			const quantityOfInstruments = instruments.length
			
			// const gm = getGeneralMIDIInstrumentNames()

			const samples = instruments.map( async (instrument, index) => {
				const percent =  index / quantityOfInstruments 
				const instrumentTitle = getGeneralMIDIInstrumentFileFromName( instrument )
				
				if (instrumentTitle)
				{
					const audioBuffers = await soundFontModel.loadPreset( instrumentTitle, options )
	
					// const audioBuffers = await loadInstrumentFromSoundFont(  audioContext, instrumentTitle, soundFontName, onProgress )
		
					if (!instrumentName)
					{
						instrumentName = instrumentTitle
					}

					//const samples = await changeInstrument( instrumentName, p => onProgress( percent + p/10 ) )
					console.log( Math.round(percent * 100), "MDI File instrument", {instrument, audioBuffers, instrumentTitle, instrumentName} )	

					return audioBuffers

				}else{
					console.error("No instrument with "+instrumentTitle+" name located - probably not part of GM standard")
				}
			})

			console.log( "MIDI loaded" , {midiFile, instruments, samples} )	
			
			return midiFile
		}catch(error){

			throw error
		}
	}

	
	// GUI -----------------------------------------------------
	// Now Locate the HTMLElement for controlling playback
	const player = document.querySelector('#player')

	// Tie the UI into the HTML
	const mediaElementSource = audioContext.createMediaElementSource(player)	
	
	// 
	const CLASS_MIDI_FILE_BUTTON = "midi-file"
	const CLASS_MIDI_SOUNDFONT_BUTTON = "soundfont-preset"
	const CLASS_MIDI_SOUNDFONT_PACK_BUTTON = "soundfont-pack"
	const CLASS_MIDI_COMMAND_BUTTON = "midi-command"

	const uiMidiOutput = document.getElementById("midi-track-output")
	
	
	const sheetMusicID = "sheet-music"
	const sheetMusicElement = document.getElementById(sheetMusicID)	
	const drawMIDIDataToUI = ()=>{ 
		
		//uiMidiOutput.innerText = midiFile.toString()
		const midiAsJSON = midiFile.toJSON()
		uiMidiOutput.innerHTML = midiFile.commands.map( (command, index) => `<button type="button" class="${CLASS_MIDI_COMMAND_BUTTON} ${command.subtype} ${command.type}" data-midi-command="${index}">${JSON.stringify( command.toJSON(), null, 3)}</button>` ).join("")
	
		//  now connect up
		const uiMidiCommandButtons = document.querySelectorAll(`.${CLASS_MIDI_COMMAND_BUTTON}`)
		uiMidiCommandButtons.forEach( button =>{
			button.addEventListener( "click", async(event) => {
				// Perform MIDI Command
				const id = parseInt( button.getAttribute("data-midi-command") )
				const command = midiFile.commands[ id ]
				console.error("midibutton", {button, event, id, command} )
				soundFont.doCommand(command)
				event.preventDefault()
			})
		})	

		sheetMusicElement.innerHTML = ""
		convertMIDITrackToNotation( midiFile, sheetMusicID )
			
		// make interative
		const notes = sheetMusicElement.querySelectorAll(`[data-name="note"]` )

		notes.forEach( (note,i) => {
			
			const command = midiFile.noteOnCommands[i]
			const keyNumber = command.noteNumber
			note.onmousedown = event => {

				console.error("note on", event, {command,keyNumber})
				noteOn( keyNumber )

				document.addEventListener("mouseup", function(){
					console.error("note off", event, keyNumber)
					noteOff( keyNumber )
				}, {once:true})
			}
		})

		// and add our sheet music
		// abcjs.renderAbc("sheet-music", "X:1\nK:D\nDD AA|BBA2|\n")
	}

	// load our MIDI file
	let midiFile = await loadMIDIData( MIDI_FILE, packName )
	// let midiFile = await loadMIDIFile( MIDI_FILE )
	
	drawMIDIDataToUI()

	// Connect up the buttons!
	const uiSoundfontButtons = document.querySelectorAll(`.${CLASS_MIDI_SOUNDFONT_BUTTON}`)
	uiSoundfontButtons.forEach( button =>{
		button.addEventListener( "click", async(event) => {
			// Change PRESET
			const preset = button.getAttribute("data-preset")
			soundFont.loadPreset( preset ) 
			event.preventDefault()
			
		})
	})

	const uiSoundfontPackButtons = document.querySelectorAll(`.${CLASS_MIDI_SOUNDFONT_PACK_BUTTON}`)
	uiSoundfontPackButtons.forEach( button =>{
		button.addEventListener( "click", async(event) => {
			// Change Soundfont
			const font = button.getAttribute("data-soundfont")
			await soundFont.loadFont( font ) 	
			event.preventDefault()
			debugger
		})
	})

	const uiMidiFileButtons = document.querySelectorAll(`.${CLASS_MIDI_FILE_BUTTON}`)
	uiMidiFileButtons.forEach( button => {
		button.addEventListener( "click", async(event) => {
			// Load MIDI File
			const location = button.getAttribute("data-file-location")
			midiFile = await loadMIDIData( location, packName )
			// midiFile = await loadMIDIFile( location )
			drawMIDIDataToUI()

			event.preventDefault()
			debugger
		})
	})

	// plugins AudioNodes are bypassed by default.
	// pingPongDelayPlugin.setState({ enabled: true })

	// instance.audioNode is the plugin WebAudio node (native, AudioWorklet or
	// Composite). It can then be connected to the WebAudio graph.

	// then create the GUI
	//- const pluginDomNode = await pingPongDelayPlugin.createGui()
	//- for example
	//- document.appendChild(pluginDomNode)

	// currentPluginAudioNode = connectPlugin( audioContext, mediaElementSource, simplePlugin )
	
	// connectPlugin( audioContext, mediaElementSource, soundFont )
	// currentPluginAudioNode = soundFont
	//currentPluginAudioNode = connectPlugin( audioContext, mediaElementSource, samplerPlugin )

	// now watch for events from the media player on screen
	player.onplay = async (event) => {
		event.preventDefault()
		// audio context must be resumed because browser restrictions
		await audioContext.resume() 
		console.log("Playing back audio with fx", event, {player, mediaElementSource} )
	}

	/**
	 * 
	 * @param {*} noteNumber 
	 * @param {*} velocity 
	 */
	const noteOn = ( noteNumber=74, velocity=0.5 ) => {
		// currentPluginAudioNode.noteOn(noteNumber, velocity )

		// soundFont.noteOn(noteNumber, velocity )

		// currentPluginAudioNode.scheduleEvents({ 
		// 	type: 'wam-midi', 
		// 	time: audioContext.currentTime, 
		// 	data: { bytes: new Uint8Array([0x90, noteNumber, velocity]) } 
		// })
		for (let i=0; i<NSTRUMENTS.length; ++i)
		{
			const instrument = NSTRUMENTS[i]
			instrument && instrument.noteOn && instrument.noteOn( noteNumber, velocity )
			console.info("noteOn", noteNumber, velocity, {instrument} )
		}
		
		//currentPluginAudioNode.play && currentPluginAudioNode.play( audioBuffer )
		// currentPluginAudioNode && currentPluginAudioNode.play && currentPluginAudioNode.play( instrumentAudioBuffers[noteNumber%instrumentAudioBuffers.length] )
		// currentPluginAudioNode.noteOn && currentPluginAudioNode.noteOn( noteNumber )
		
		// oscillator && oscillator.noteOn && oscillator.noteOn( noteNumber, velocity )
		// // 
		// midiRecorder && midiRecorder.noteOn && midiRecorder.noteOn( noteNumber, velocity )
		// soundFont && soundFont.noteOn && soundFont.noteOn( noteNumber, velocity )	
	}

	/**
	 * 
	 * @param {*} noteNumber 
	 * @param {*} velocity 
	 */
	const noteOff = ( noteNumber=74, velocity=0.5 ) => {

		// console.error("currentPluginAudioNode", currentPluginAudioNode )

		// midiRecorder && midiRecorder.noteOff && midiRecorder.noteOff(noteNumber, velocity )
		// soundFont && soundFont.noteOff && soundFont.noteOff(noteNumber, velocity )
		// // currentPluginAudioNode.noteOff && currentPluginAudioNode.noteOff(noteNumber, velocity )

		console.error("noteOff:command", noteNumber, velocity, {midiRecorder: instrumentNoteRecorder}  )
		
		// soundFont.noteOff(noteNumber, velocity )

		// currentPluginAudioNode.scheduleEvents({ 
		// 	type: 'wam-midi', 
		// 	time: audioContext.currentTime + 0.25, 
		// 	data: { bytes: new Uint8Array([0x80, noteNumber, velocity]) } 
		// })
	
		for (let i=0; i<NSTRUMENTS.length; ++i)
		{
			const instrument = NSTRUMENTS[i]
			instrument && instrument.noteOff && instrument.noteOff( noteNumber, velocity )
		}
	}


	// Next / Previous / Random
	const changeInstrument = async (instrument, onProgress=undefined ) =>{
		// ensure we are using the instrument file name
		const instrumentLocation = getGeneralMIDIInstrumentFileFromName(instrument)
		
		const audioBuffers = await loadInstrumentFromSoundFont( audioContext, instrumentLocation, {soundfont:packName, useWorker:false },  onProgress )
		// const audioBuffers = await loadInstrumentFromSoundFontStringViaWorker( audioContext, instrument, {soundfont:packName}, onProgress )
		console.warn("Changing Instrument to ", {instrument, instrumentLocation}, {instrumentAudioBuffers} )
		instrumentName = instrument
		return audioBuffers
	}

	const changeSoundFont = async (onProgress) => {
		packName = getNextSoundPackName(packName)
		console.log("Changing Pack to ", packName )
		return await soundFont.loadFont( packName, {}, onProgress )	
	}

	// player.play()

	console.log("Creating WAM Plugin", {player, currentPluginAudioNode, mediaElementSource} )

	const onUserUploadMediaFile = async (file) => {
		
		console.error("onUserUploadMediaFile", file)
		if (file)
		{
			// Load a MIDI file
			switch (file.type)
			{
				case "application/json":
					console.log("Instrument Pack loading is not supported at this time")
					break

				case "audio/mid":
					console.log("MIDI File loading...")
					midiFile = await loadMIDIData( file, packName )
					//midiFile = await loadMIDIFileThroughClient( file )
					return midiFile

				default:
					console.log("Dropped file", {file} , "Ignoring as not sure how to interpret it")
			}
			return null
		}
	}

	connectDropZone( onUserUploadMediaFile )

	// Upload MIDI File! Secret functions
	//const uploadMIDIForm = document.getElementById("midi-file") 
	const uploadMIDIFileInput = document.getElementById("midi-upload") 
	// const uploadMIDIButton = document.getElementById("button-midi-upload") 

	// uploadMIDIButton.addEventListener( 'click', event => {
	// 	const file = uploadMIDIFileInput.files[0]
	// 	onUserUploadMediaFile( file )
	// }, true)
	
	uploadMIDIFileInput.addEventListener( "change", event => {
		const file = uploadMIDIFileInput.files[0] 
		onUserUploadMediaFile( file )
	})

	// Keyboard ------------------------------------------------------
	const keysPressed = new Map()
	const audioPlaying = new Map()

	// play the thing with different inputs!
	window.addEventListener("keydown", async(event) => {
	
		console.log("key down",event.key)

		// first check to see if this key is already down
		// (this can occur with multiple keyboards inc onscreen)
		const isPressed = keysPressed.has( event.key )
		
		if (isPressed)
		{
			return
		}

		keysPressed.set( event.key, performance.now() )

		switch(event.key)
		{
			// change instrument pack...	
			case " ":
				await changeSoundFont()
				break

			// change instrument aka patch
			case "Enter":
				const randomInstrument = getRandomInstrument()
				try{
					instrumentAudioBuffers = await changeInstrument( randomInstrument )
					
				}catch(error){
					console.error(error)
				}
				break

			// play note from midi or from numbered key
			default:
				// const focussedElement = document.activeElement
				const keyNumber = parseInt(event.key)
				const velocity = parseInt(event.velocity) || 255
				const isNumber = !isNaN( keyNumber )
				let noteNumber
				if (isNumber)
				{
					noteNumber = (keyNumber * 10)>>0
					
				}else{
					const command = midiFile.getNextNoteOnCommand()
					console.error("noteOn:command", command, midiFile.toJSON() )
					noteNumber = command.noteNumber
				}	
				noteOn( noteNumber, velocity / 255 )		
				audioPlaying.set( event.key, noteNumber )		
		}
	})

	window.addEventListener("keyup", event => {
		// const focussedElement = document.activeElement
		const whenPressed = keysPressed.get( event.key )
		const noteNumber = audioPlaying.get( event.key )
		const timeHeld = performance.now() - whenPressed

		if (noteNumber)
		{
			// if we still want the note to play but a little quieter...
			noteOff(noteNumber, 0.05 )
			audioPlaying.delete( event.key )
			console.log("note off", {event, whenPressed,timeHeld, noteNumber } )		
		
		}
		keysPressed.delete( event.key )
	})
}



const init = async () => {

	if (initialised)
	{
		return
	}

	initialised = true
		
	// make the URL relative...
	//- let testURL = pluginURL.split("?")[0]
	//- testURL = testURL.replace("http://localhost:909/", "")
	//- const wamURL = new URL(testURL, import.meta.url)
	
	if (AudioContext)
	{
		const onlineAudioContext = new AudioContext({ latencyHint: 'playback' })
		const offlineAudioContext = 'OfflineAudioContext' in window ? new OfflineAudioContext(2, 44100 * 40, 44100) : null
 
		console.log("Audio Engines created", {onlineAudioContext, offlineAudioContext} )
		const instruments = await create(onlineAudioContext, offlineAudioContext)
		
		console.log("Instruments Engine", {instruments} )
		
		// console.log(import.meta, "plugin URL", {pluginURL, testURL, wamURL})
	}else{
		console.error("No Audio Engine on this browser ;(")
	}

	/*
	const config = LookingGlassConfig
	config.tileHeight = 512
	config.numViews = 45
	config.targetY = 0
	config.targetZ = 0
	config.targetDiam = 3
	config.fovy = (14 * Math.PI) / 180
	new LookingGlassWebXRPolyfill()

	const scene = new THREE.Scene()

	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(2, 0.1, 0.1),
		new THREE.MeshStandardMaterial({ color: "red" })
	)

	scene.add(cube)

	scene.add(new THREE.AmbientLight(0xaaaaaa))
	const directionalLight = new THREE.DirectionalLight(0xffffff)
	directionalLight.position.set(3, 3, 3)
	scene.add(directionalLight)

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	document.body.append(renderer.domElement)
	renderer.xr.enabled = true

	const camera = new THREE.PerspectiveCamera()
	camera.position.z = 3

	renderer.setAnimationLoop(() => {
		cube.rotation.z += 0.01
		cube.rotation.x += 0.02
		renderer.render(scene, camera)
	});

	document.body.append(VRButton.createButton(renderer))

	function resize() {
		renderer.setSize(innerWidth, innerHeight)
		camera.aspect = innerWidth / innerHeight
		camera.updateProjectionMatrix()
	}
	resize()
	window.addEventListener("resize", resize)
	*/
}


const test = async () => {

	const audioContext = new AudioContext({ latencyHint: 'playback' })
	const [hostGroupId] = await initializeWamHost(audioContext)
	const { default: simpleWAMPlugin } = await import("worklet:../audio/wam2/simple/index.js")
	
	// const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
	// const [hostGroupId] = await initializeWamHost(audioContext)
	// const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// console.log("Created simplePlugin Instrument", {simplePlugin} )

	// We need to determine the correct transformer to use
	// as we do *not* want this to be transpiled and transpiling it is breaking it
	// bundle-text:
	// data-url:
	// url:	- causes file read error as uses file://

	// const { default: synthWAMPlugin } = await import("url:./audio/wam2-external/tinySynth/src/index.js")
	// const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
	const synthPlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
	// const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
}

// Required to start any kind of audio interaction & playback
document.addEventListener("click", init, {once:true})
// document.addEventListener("click", test, {once:true})