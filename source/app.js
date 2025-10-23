/**
 * This is the Electron version of the PWA
 * It *doesn't* have a service-worker as everything
 * is local and we use Electron auto updater
 * it could use the Capacitor engine for the app
 */

import { VERSION } from './version.js'
// import { Capacitor } from '@capacitor/core'
import { setLoadProgress } from './dom/load-progress.js'
import { getBrowserLocales } from './locales/i18n.js'
import { getDomainDefaults, INSTRUMENT_OPTIONS } from './settings/options.js'
// import { createInterface } from './interface-app.js' 
import { createStore } from './utils/store.js' 
import { showError} from './dom/errors.js'

import Capabilities from './capabilities.js'
import Attractor from './attractor.js'

// import { addToolTips, setToast } from './dom/tooltips'
// import { MOUSE_HELD, MOUSE_TAP, addMouseTapAndHoldEvents } from './hardware/mouse'
import { addKeyboardEvents } from './interface-keyboard.js'
import { addGamePadEvents } from './interface-gamepad.js'

// If you have nodeIntegration enabled you can call this directly...
// import VirtualMIDIClass from './audio/midi/midi-connection-virtual.js'
// or if you care about security (at the expense of speed) then you can use
// the following bridge and expose the midi method in electron/preload.ts
// import VirtualMIDIClass from './audio/midi/midi-connection-electron-bridge.js'
import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'
	












// AUDIO 
import { recordAudio } from './audio/record/record.audio.js'

import { 
	getRecordableOutputNode,
	active, playing, 
	setupAudio,
	stopAudio,
	setReverb,
	updateByteFrequencyData, 
	updateByteTimeDomainData,
	bufferLength, dataArray, 
	getVolume, setVolume, getPercussionNode,
	getMasterMixdown
} from './audio/audio.js'

import { say, hasSpeech} from './audio/speech.js'

// DOM UI
import { setupFeedbackControls } from './dom/text.js'
import setupDialogs from './dom/ui.dialog.js'

import {
	controlPanel,
	updateTempo,
	isVideoVisible, toggleVideoVisiblity,  
	setupCameraForm, setupInterface,
	toggleVisibility,
	focusApp,
	buttonVideo
} from './dom/ui.js'
import { showPlayerSelector } from './dom/ui.player-selection.js'
import { setToast, toggleTooltips, updateTooltipPositions } from './dom/tooltips.js'
import { setupRecordings } from './dom/ui.recording.js'
import { connectSelect, connectReverbControls, connectReverbSelector } from './dom/select.js'
import { setToggle, setPressureToggle } from './dom/toggle.js'
import { setButton, setPressureButton, setupMIDIButton } from './dom/button.js'
import { appendPhotographElement } from './dom/photographs.js'
import { appendAudioElement} from './dom/audio-element.js'
import { connectDropZone } from './dom/drop-zone.js'
import { drawMousePressure } from './dom/mouse-pressure'
import { setupVolumeInterface } from './dom/ui.volume.js'
import { setMIDIControls, createMIDIButton } from './dom/ui.midi.js'
import { setupTempoInterface } from './dom/ui.tempo.js'
import { toggleFullScreen } from './dom/full-screen.js'
import { addToolTips, setToast, toggleTooltips, updateTooltipPositions } from './dom/tooltips.js'

import { Quanitiser } from './visual/quantise.js'

// SHARE
import { createQRCode, createSVGQRCodeFromURL } from './utils/barcodes.js'

// STATE
import { EVENT_STATE_CHANGE, createStateFromHost, createStateOptionsFromHost, setElementCheckState } from './utils/state.js'
import StateWithIO from './utils/state-io'

// MODELS
import { TAU } from "./maths/maths.js"
import { DEFAULT_TENSORFLOW_OPTIONS, MAX_CANVAS_WIDTH, getDomainDefaults } from './settings/options.js'
import { DEFAULT_PEOPLE_OPTIONS, NAMES, EYE_COLOURS, IDENTIFIERS } from './settings/options.people.js'
import { loadMLModels } from './models/load-models.js'
import { setFaceLandmarkerOptions } from './models/face-landmarks.js'


import Person, { 
	EVENT_INSTRUMENT_CHANGED, EVENT_INSTRUMENT_LOADING,
	STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_SUSTAIN,
	STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_RELEASE,
	getRandomPresetForPerson,
	EVENT_PERSON_DEAD, EVENT_PERSON_BORN,
	PERSON_TYPE_ARPEGGIO,
	PERSON_TYPE_SYMPATHETIC_SYNTH_CIRCLE_OF_FIFTHS,
	PERSON_TYPE_CHROMATIC,
	PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS,
	EVENT_EMOTION_CHANGED
 } from './person.js'


// TIMING
import {midiLikeEvents} from './timing/rhythm'
import { playNextPart, getKitSequence } from './timing/patterns.js'

// FADFDFDSFSFDSFSFDssdsvv
// import Timer from "./timing/timer.js"
// import AudioTimer from './timing/timer.audio.js'
import {
	CMD_START,CMD_STOP,CMD_UPDATE,
	EVENT_READY, EVENT_STARTING, EVENT_STOPPING, EVENT_TICK
} from './timing/timing.events.js'

import AUDIOCONTEXT_WORKER_URI from 'url:./timing/timing.audiocontext.worker.js'
// import AUDIOCONTEXT_WORKER_URI from './timing/timing.audiocontext.worker.js?worker&url'
// import AUDIOTIMER_WORKLET_URI from './timing/timing.audioworklet.js?worker&url'
// import AUDIOTIMER_PROCESSOR_URI from './timing/timing.audioworklet-processor.js?worker&url'
// import { createTimingProcessor } from './timing/timing.audioworklet.js'



// VIDEO 
import { canvasVideoRecorder, createVideo, encodeVideo } from './audio/record/record.video.js'

// SYNTHESIS

// Different ways of playing sound!
import { createDrumkit } from './audio/drum-kit.js'
import InstrumentFactory, { createInstrumentFromData } from './audio/instrument-factory.js'
import InstrumentManager from './audio/instrument-manager.js'

// TODO: Replace with instrumentFactory
// we use this to load in the chord instruments
import SampleInstrument from './audio/instruments/instrument.sample.js'
import OscillatorInstrument from './audio/instruments/instrument.oscillator.js'

import { getRandomHihatPreset, PRESET_HIHATS } from './audio/synthesizers/hihat.js'
import { getRandomSnarePreset, PRESET_SNARES } from './audio/synthesizers/snare.js'
import { getRandomKickPreset, getKickPresets } from './audio/synthesizers/kick.js'

// DISPLAYS
import { DISPLAY_TYPES } from './display/display-types.js'
import { 
loadDisplayClass, 
createDisplay, 
restartCanvas, 
changeDisplay  
} from './display/display-manager.js'
import VisualiserManager from './visual/visualiser/visualiser-manager.js'

// HARDWARE
import { watchMouseCoords  } from './hardware/mouse.js'
import { ERROR_NO_CAMERAS, fetchVideoCameras, findBestCamera, loadCamera } from './hardware/camera.js'
import { howManyHolographicDisplaysAreConnected } from './hardware/looking-glass-portrait.js'

// MIDI
import MIDIConnectionManager from './audio/midi/midi-connection-manager.js'
import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'
import { WebMidi } from 'webmidi'

// THEME
import { getThemeFromReferer, setTheme, setupThemeControls } from './theme/theme.js'
import { fetchBrandColor } from './settings/palette.js'

// CONTROLS
import { updateInstrumentWithPerson } from './audio/instrumentMediators/mediator.person-instrument.js'
import { getActiveMIDINotesForPerson, updateWebMIDIWithPerson } from './audio/instrumentMediators/mediator.person-webmidi.js'
import { setupReporting, track, trackError, trackExit } from './reporting'
import { getMusicalDetailsFromEmoji } from './models/emoji-to-music.js'
import { FIFTHS_SCALE_KEYS, JAZZ_MINOR_SCALE_KEYS, MAJOR_SCALE_KEYS, MINOR_SCALE_KEYS } from './audio/tuning/keys.js'
import { NOTES_BLACK, NOTES_WHITE } from './audio/tuning/notes.js'


import { tapTempo } from './timing/tap-tempo.js'

import { observeOrientationChange } from './display/display-abstract.js'

// IO
import { observeInactivity } from './utils/inactivity.js'
import { notifyObserversThatWeblinkIsAvailable, observeWeblink } from './audio/instrumentMediators/mediator.weblink-instrument.js'




































const MIDI_CONNECTORS = [WebMIDIClass] // [VirtualMIDIClass, WebMIDIClass]

const body = document.documentElement
const debugMode = window.electron?.debug || false
// const isProductionBuild = !debugMode

// start loading / updating..."loading",
// NB. see _base.pug for double of this - this is just in case
body.classList.toggle( "loading", true )
body.classList.toggle( "debug", debugMode )
body.classList.add( "interface", "desktop" )

// This teaches us which kind of an app this is, can be,
// and what we can do with the tech installed in this device
const capabilities = new Capabilities()

const createInterface = () => {}
// TODO: 
// ESCAPE - no cameras found on system?
// ESCAPE - no GPU?
// remove loading stuff and quit
if (debugMode)
{
	console.log("Electron : Initialising debugMode", {capabilities, data:window.electron } )
}else{
	console.info("Electron : Initialising", {capabilities, data:window.electron } )
}

const start = async () => {

	setLoadProgress(0.5, " ")

	// we can also inject specific options through an object set
	// in a global space 
	const globalOptions = Object.assign( {}, globalThis._synth )
	const defaultOptions = getDomainDefaults() 
	
	// only overwrite objects with the same keys!
	const validOptionKeys = Object.keys(defaultOptions)
	Object.keys(globalOptions).forEach( key => validOptionKeys.indexOf(key) > -1 ? defaultOptions[key] = globalOptions[key] : null )

	const language = getBrowserLocales()[0]

	// console.log( "Global options" ,  { globalOptions, dominOptions, defaultOptions, validOptionKeys } )
	const store = createStore()

	try{
		const application = await createInterface( 
			defaultOptions, 
			store, 
			capabilities, 
			INSTRUMENT_OPTIONS.list,
			MIDI_CONNECTORS, 
			language, 
			(loadProgress, message, hideLoader=false) => {
			
			if (hideLoader)
			{
				setLoadProgress( loadProgress, "", true )

			} else if (loadProgress < 1) {

				// const rectifiedProgress = halfLoaded ? loadProgress * 0.5 : 0.5 + loadProgress * 0.5
				// console.log( "Interface: loaded", {rectifiedProgress} )
				setLoadProgress( loadProgress, message )
			}else{
				setLoadProgress(1, "Ready!", true)
			}
		})

		// This allows for remote control as well as allowing the
		// app to change parameters on it's own
		const automator = application.setAutomator( new Attractor(application) )
		
		// and create our input handlers 
		addKeyboardEvents(application)
		
		if ( application.getState("gamePad") )
		{
			addGamePadEvents( application )
		}


		// console.log("Attract mode!", {automator, application})
		console.info(`InterFACE Version ${VERSION} in ${language} used ${application.count} times, last time was ${Math.ceil(application.timeElapsedSinceLastPlay/1000)} seconds ago`, {application, defaultOptions } )	

		// Show hackers message to debuggers
		if (debugMode)
		{
			console.log(`InterFACE Desktop Version ${VERSION}} in ${language} used ${application.count} times, last time was ${Math.ceil(application.timeElapsedSinceLastPlay/1000)} seconds ago`, {application, defaultOptions } )	
			// console.log(`Loaded App ${VERSION} ${needsInstall ? "Installable" : needsUpdate ? "Update Available" : ""}` )	
		}

	}catch(error){

		// body.classList.add("failed")
		//uninstall()
		showError( error, "Oh no! Try a hard refresh (CTRL-SHIFT-R)", true )
		console.error("Ultimate failure - remove loading - add error class?")
	}
}

// add a special class to the app to frame it
start()
// body.classList.toggle( "loading", false )