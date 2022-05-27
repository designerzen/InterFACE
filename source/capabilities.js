/**
 * Checks to see if all of the things we need for
 * this to work are available such as camera, midi etc
 */
import {testForMIDI} from './audio/midi-out'
const hasTouchEvents = () => {
	try{ document.createEvent("TouchEvent"); return true; }
	catch(e){ return false; }
}
export default class Capabilities {

	// required = {
	// 	camera:false
	// }

	// optional = {
	// 	midi:false
	// }

	cameraAvailble = navigator.getUserMedia !== undefined
	webMIDIAvailable = false

	touchScreen = hasTouchEvents()
	mouse = !window.matchMedia( "(hover: none)" ).matches

	/**
	 * returns {Boolean} is this machine capable of running this app?
	 */
	get willWork(){
		return this.cameraAvailble
	}

	constructor(){
		this.webMIDIAvailable = testForMIDI()
	}
}