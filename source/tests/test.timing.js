// 
import AudioTimer from '../timing/timer.audio.js' 
import MIDIConnectionManager from '../audio/midi/midi-connection-manager.js'
import WebMIDIClass from '../audio/midi/midi-connection-webmidi.js'
import MIDIInstrument from '../audio/instruments/instrument.midi.js'
import { setupTempoInterface } from '../dom/ui.tempo.js'

const start = () => {
	const audioContext = new AudioContext()

	const MIDIConnectionClasses = [WebMIDIClass]
	const midiManager = new MIDIConnectionManager()
	const timer = new AudioTimer( audioContext )
	
	console.log("Start")
	// const instrument = new MIDIInstrument( audioContext )

	// TODO: load in any settings from localstorage
	setupTempoInterface(timer, midiManager, MIDIConnectionClasses)
}

document.addEventListener("mousedown", start, {once:true} )