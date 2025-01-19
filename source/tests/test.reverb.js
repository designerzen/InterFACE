import AudioTimer from '../timing/timer.audio.js' 
import MIDIConnectionManager from '../audio/midi/midi-connection-manager.js'
import WebMIDIClass from '../audio/midi/midi-connection-webmidi.js'
import EnvelopeNode from '../audio/nodes/envelope-node.js'
import DualOscillatorInstrument from "../audio/instruments/instrument.dual-oscillator"
import OscillatorInstrument from "../audio/instruments/instrument.oscillator"
import MonotronInstrument from "../audio/instruments/instrument.monotron"
import { createCustomReverb, createReverb } from "../audio/effects/reverb"
import { encodeAudioBufferIntoWav } from "../audio/record/wave"

import { 
	getRecordableOutputNode,
	active, playing, 
	setupAudio,	audioContext,
	getVolume, setVolume, getPercussionNode 
} from '../audio/audio.js'

import {Pane} from 'tweakpane'
import { noteNumberToFrequency } from '../audio/tuning/frequencies.js'
import { drawWaveform, filterData, normalizeData } from '../visual/2d.waveform.js'

const start = async () => {
	
	const audioContext = new AudioContext()

	const customReverbOptions = {
		// seconds
		duration:0.5, 

		gain : 0.8,
		// as ratios except sustain which is a level
		attack:0.001, 
		decay:0.1, 
		sustain:0.8,
		release:0.5,

		// booleans
		normalize : true,
		reverse:false,
		stereo:false,
		
		// noise:'white' 
		// noise:'pink'  
		noise:'white' 
	}

	const encodeOptions = {
        sampleRate:audioContext.sampleRate,
        stereo:false,
        sampleSize:16
    }
	
	const MIDIConnectionClasses = [WebMIDIClass]
	const midiManager = new MIDIConnectionManager()
	const timer = new AudioTimer()
	
	
	//- const volume = 0.8
	//- const {	setVisualVolumeLevel, toggleMute } = setupVolumeInterface( volume, false, function onVolumeChanged(vol){
	//- 	console.info("Setting volume to ",vol)
	//- 	setVolume( vol )
	//- } )
	
	// const instrument = new MIDIInstrument( audioContext )
	// TODO: load in any settings from localstorage
	//- setupTempoInterface(timer, midiManager, MIDIConnectionClasses)
	//- setupInterface( options )

	// this just adds some visual onscreen tooltips to the buttons specified
	//- const controlPanel = document.getElementById("control-panel")
	//- addToolTips( controlPanel )
	
	// hook unto the audio controls...
	const audio = await setupAudio()
	const mixer = audioContext.createGain()
	const envelope = new EnvelopeNode(audioContext)
	
	// const instrument = new OscillatorInstrument( audioContext )
	// const instrument = new DualOscillatorInstrument( audioContext )
	const instrument = new MonotronInstrument( audioContext )
	//- instrument.volume = 0.1
	
	// const reverb = await createReverb(audioContext, 0.9, true, "./assets/audio/acoustics/sony_walkman_fx_403_mega_bass_+_tube.irs")
	// const reverb = await createReverb(audioContext, 0.5, true, "./assets/audio/acoustics/sony_walkman_fx_403_mega_bass.wav")
	// const reverb = await createReverb(audioContext, 0.1, true, "./assets/audio/acoustics/concert-crowd.ogg")
	// const reverb = await createReverb(audioContext, 0.1, true, "./assets/audio/acoustics/ir-hall.mp3")
	const reverb = await createCustomReverb(audioContext, customReverbOptions )
	//const reverbWaveData = reverb.audioBuffer
	const reverbWaveData = filterData( reverb.audioBuffer, 320)
	// const reverbWaveData = normalizeData(filterData( reverb.audioBuffer, 320))

	// connect audio parts
	instrument.output.connect( envelope )
	envelope.connect( mixer )
	mixer.connect( reverb.node )
	reverb.node.connect( audioContext.destination  )
	
	// immediately draw the waveform
	const waveformCanvas = document.getElementById("reverb-canvas")
	const waveformContext = waveformCanvas.getContext("2d")
	drawWaveform( waveformContext, reverbWaveData )

	const noteOn = ( note=null ) => {
		// const frequency = note && !isNaN(note) ? 
		// 	note : 
		// 	noteNumberToFrequency( 32 + Math.floor(Math.random() * 32) )
		const frequency = note && !isNaN(note) ? 
			note : 
			64 + Math.floor(Math.random() * 32)
		instrument.noteOn( frequency )
		envelope.on()
	}

	const noteOff = () => {
		instrument.noteOff()
		envelope.off()
	}

	const createNewReverb = async () => {
		console.info("creating new reverb")
		const audioBuffer = await reverb.setOptions(customReverbOptions)
		const reverbWaveData = normalizeData(filterData(audioBuffer, 480))
		drawWaveform( waveformContext, reverbWaveData )
		// add audio node to the body
    	const blob = encodeAudioBufferIntoWav(audioBuffer, encodeOptions)
    	// force download...
    	// downloadBlobOnClient( blob )
    	// draw to canvas
		const audio = document.createElement("audio")
		audio.src = URL.createObjectURL(blob)
		audio.setAttribute("controls", "")
		document.body.appendChild( audio )
	}

	window.addEventListener( "keydown", e => {
		const isNumber = !isNaN( parseInt(event.key) )
		const focussedElement = document.activeElement
		noteOn(parseInt(event.key))
	})
	window.addEventListener( "keyup", e => {
		noteOff()
	})

	const downloadReverbButton = document.getElementById("button-download-reverb")
	downloadReverbButton.addEventListener( "click", async (event) => {
		const blob = encodeAudioBufferIntoWav(reverb.audioBuffer, encodeOptions)
		// force download...
		downloadBlobOnClient( blob )
	})

	const testReverbButton = document.getElementById("button-test-reverb")
	testReverbButton.addEventListener( "mousedown", async (event) => {
		noteOn()
	})
	testReverbButton.addEventListener( "mouseup", async (event) => {
		noteOff()
	})

	//----------------------------------------------------------------------------------------
	// Controls for tweaking the reverb paramters
	const pane = new Pane(new Pane({ title: "Config", expanded: true }))
	
	const reverbConfig = pane.addFolder({ title: 'Reverb' })
	reverbConfig.addBinding(customReverbOptions, 'duration', { min: 0.01, max: 10 })
	reverbConfig.addBinding(customReverbOptions, 'gain', { min: 0.01, max: 2 })
	reverbConfig.addBinding(customReverbOptions, 'attack', { min: 0.01, max: 1 })
	reverbConfig.addBinding(customReverbOptions, 'decay', { min: 0.01, max: 1 })
	reverbConfig.addBinding(customReverbOptions, 'sustain', { min: 0.01, max: 1 })

	reverbConfig.addBinding(customReverbOptions, 'noise', { options: {
		white: 'white',
		pink: 'pink',
		brown: 'brown'
	}})

	reverbConfig.addBinding(customReverbOptions, 'normalize')
	reverbConfig.addBinding(customReverbOptions, 'reverse')
	reverbConfig.addBinding(customReverbOptions, 'stereo')

	reverbConfig.addButton({title:'Update Reverb'}).on('click', async ( e )=> {	
		// disable buttton until...
		await createNewReverb()
	})
}
document.addEventListener( "DOMContentLoaded", e => start() )