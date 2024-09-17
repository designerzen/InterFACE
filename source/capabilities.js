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

export const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

export const hasFileHandler = () => 'launchQueue' in window && 'files' in LaunchParams.prototype

export const hasOffscreenCanvasCapability = () => 'OffscreenCanvas' in window

export const hasWebGL2Capability = () => 'WebGL2RenderingContext' in window

export const hasWebGPUCapability = () => !!navigator.gpu

export const isPopoverSupported = () => HTMLElement.prototype.hasOwnProperty("popover")

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

	cameraAvailable = undefined
	pwaPossible = undefined

	mouse = undefined
	touchScreen = undefined
	electron = undefined
	node = undefined
	popover = undefined

	webGL = undefined
	webGPU = undefined
		
	/**
	 * returns {Boolean} is this machine capable of running this app?
	 */
	get willWork(){
		return this.cameraAvailable
	}

	constructor(){
		this.cameraAvailable = navigator.getUserMedia !== undefined 
		this.pwaPossible = ("serviceWorker" in navigator)

		this.fileHandlerAvailable = hasFileHandler()
		this.touchScreen = isTouchDevice() && hasTouchEvents()
		this.mouse = !window.matchMedia( "(hover: none)" ).matches
		this.electron = isElectron()
		this.node = isNode()
		this.webMIDIAvailable = testForMIDI()
		this.virtualMIDIAvailable = isElectron() && isNode()

		this.popover = isPopoverSupported()

		this.webGL = hasWebGL2Capability()
		this.webGPU = hasWebGPUCapability()
	}
}

// Array of permissions
const PERMISSIONS = [
	"accelerometer",
	"accessibility-events",
	"ambient-light-sensor",
	"background-sync",
	"camera",
	"clipboard-read",
	"clipboard-write",
	"geolocation",
	"gyroscope",
	"local-fonts",
	"magnetometer",
	"microphone",
	"midi",
	"notifications",
	"payment-handler",
	"persistent-storage",
	"push",
	"screen-wake-lock",
	"storage-access",
	"top-level-storage-access",
	"window-management",
]

export const PERMISSION_PROMPT = "prompt"
export const PERMISSION_GRANTED = "granted"
export const PERMISSION_UNAVAILABLE = "unavailable"

export const fetchPermissions = async ( permissions=PERMISSIONS ) => {
	
	// Iterate through the permissions and log the result
	async function processPermissions() {
		const output = new Map()
		for (const permission of permissions) 
		{
			try {
				const result = await navigator.permissions.query({ name: permission });
				// console.info( "permission", {result} )
				output.set( permission, result.state )
			} catch (error) {
				// console.info( "permission DENIED!", error )
				output.set( permission, PERMISSION_UNAVAILABLE )
			}
			// granted
			// 
			// if (result.indexOf("granted") >= 0)
			// {
			// 	// trim out "granted"
			// 	output.set( result.replace(": granted",""), PERMISSION_GRANTED )
			// }else if (result.indexOf("prompt") >= 0){
			// 	// trim out prompt
			// 	output.set( result.replace(": prompt",""), PERMISSION_PROMPT )
			// }else{
			// 	// (not supported) rejected!
			// 	console.info("Permission "+result)
			// 	output.set( result.replace(" (not supported)",""), PERMISSION_UNAVAILABLE )
			// }
		}
		return output
	}
	
	return await processPermissions()
}