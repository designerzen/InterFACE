/**
 * Checks to see if all of the things we need for
 * this to work are available such as camera, midi etc
 */

// import {testForMIDI} from './audio/midi/midi-out'
export const testForMIDI = () => navigator.requestMIDIAccess === undefined ? false : true

export const hasTouchEvents = () => {
	try{ document.createEvent("TouchEvent"); return true; }
	catch(e){ return false; }
}

export const hasFileHandler = () => 'launchQueue' in window && 'files' in LaunchParams.prototype

/**
 * Is this running inside a NODE environment (rather than browser?)
 * @returns Boolean
 */
export const isNode = () => {
	return !(typeof process !== 'undefined')
}

/**
 * Is this running inside ELECTRON (rather than Chrome for example)
 * @returns Boolean
 */
// https://github.com/electron/electron/issues/2288
export const isElectron = () => {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true
    }

    return false
}


export default class Capabilities {

	// required = {
	// 	camera:false
	// }

	// optional = {
	// 	midi:false
	// }

	fileHandlerAvailable = undefined
	webMIDIAvailable = undefined

	cameraAvailble = navigator.getUserMedia !== undefined
	pwaPossible = ("serviceWorker" in navigator)

	mouse = undefined
	touchScreen = undefined
	electron = undefined
	node = undefined
		
	/**
	 * returns {Boolean} is this machine capable of running this app?
	 */
	get willWork(){
		return this.cameraAvailble
	}

	constructor(){
		this.fileHandlerAvailable = hasFileHandler()
		this.touchScreen = hasTouchEvents()
		this.webMIDIAvailable = testForMIDI()
		this.mouse = !window.matchMedia( "(hover: none)" ).matches
		this.electron = isElectron()
		this.node = isNode()
	}
}