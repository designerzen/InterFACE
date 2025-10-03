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
import { createInterface } from './interface.js' 
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