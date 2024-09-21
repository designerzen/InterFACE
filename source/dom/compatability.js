import { fetchPermissions, PERMISSION_GRANTED, PERMISSION_PROMPT, PERMISSION_UNAVAILABLE } from "../capabilities"
import { filterVideoCameras } from "../hardware/camera"

const UNAVAILABLE = "unavailable"
/**
 * Update the table of compatability and reveal it
 * if the user has a device that will not work 100%
 * then show a FATAL error message
 */
export const updateCapabalitiesTable = async (capabilities) => {
	
	const table = document.getElementById("compatability")
	
	const updateTable = (permissions, cameras) => {

		const CHECKING = "checking"
		const RESULT = "result"
		const NOT_AVAILABLE = "not-available"
		const AVAILABLE = "available"

		let fatal = false
	
		// CAMERA --------------------------------------------------------------------------
		
		// TODO: show holographic stuff too
		const tableCamera = document.querySelector(".capability-camera")
		const cameraAvailability = tableCamera.querySelector("td."+RESULT)
			
		if (!tableCamera || !cameraAvailability){
			
			fatal = true
			cameraAvailability.classList.toggle(UNAVAILABLE, true)
			cameraAvailability.classList.remove(CHECKING)
			document.body.classList.toggle("camera-unavailable", true)
			
		} else if ( permissions.get("camera") === PERMISSION_UNAVAILABLE ){
			
			// FATAL ERROR! No camera!
			fatal = true
			document.body.classList.toggle("camera-unavailable", true)
			// FIXME: instructions for how to enable permission
			cameraAvailability.textContent = `Camera may not be available`
			cameraAvailability.classList.toggle(UNAVAILABLE, true)
			
		} else if (
			capabilities.cameraAvailable &&
			cameras.length > 0 && 
			( permissions.get("camera") === PERMISSION_GRANTED || permissions.get("camera") === PERMISSION_PROMPT )
		){
			// TODO: Check for devices if permission has already been granted
			cameraAvailability.textContent = `${cameras.length} Available`
			cameraAvailability.classList.remove(NOT_AVAILABLE)
			cameraAvailability.classList.remove(CHECKING)
			cameraAvailability.classList.add(AVAILABLE)

		}else{
			// FATAL ERROR! No camera!
			fatal = true
			document.body.classList.toggle("camera-unavailable", true)
			cameraAvailability.textContent = `${cameras.length} Available`
			cameraAvailability.classList.toggle(UNAVAILABLE, true)
			console.warn("[FATAL] No camera available")
		}	
	
		// Web MIDI --------------------------------------------------------------------------
		const tableMIDI = document.querySelector(".capability-midi")
		if ( permissions.get("midi") === PERMISSION_UNAVAILABLE ){
			
			// FATAL ERROR! No camera!
			document.body.classList.toggle("midi-unavailable", true)
			// FIXME: instructions for how to enable permission
			cameraAvailability.textContent = `MIDI Permission was not granted`
			
		} else if (
			tableMIDI && 
			capabilities.webMIDIAvailable &&
			(  permissions.get("midi") === PERMISSION_GRANTED || permissions.get("midi") === PERMISSION_PROMPT )
		)
		{
			const MIDIAvailability = tableMIDI.querySelector( "td."+RESULT )
			MIDIAvailability.textContent = permissions.get("midi") === PERMISSION_PROMPT ? "Available, please grant permission when requested" : "Available"
			MIDIAvailability.classList.remove(NOT_AVAILABLE)
			MIDIAvailability.classList.remove(CHECKING)
			MIDIAvailability.classList.add(AVAILABLE)
			
		}else{
			// NONE FATAL ERROR! No MIDI - just hide MIDI stuff!!
			document.body.classList.toggle("midi-unavailable", true)
			console.info("[WARNING] MIDI is not available")
		}	
	
		// GPU --------------------------------------------------------------------------
		const tableGPU = document.querySelector(".capability-gpu")
		if (tableGPU && (capabilities.webGL || capabilities.webGPU))
		{
			const GPUAvailability = tableGPU.querySelector("td."+RESULT )
			GPUAvailability.textContent = "Available"
			GPUAvailability.classList.remove(NOT_AVAILABLE)
			GPUAvailability.classList.remove(CHECKING)
		}else{
			// NONE FATAL ERROR! No WEBGL so use canvas fallback
			body.classList.toggle("gpu-unavailable", true)
			console.info("[WARNING] No GPU available")
		}	

		// Speakers --------------------------------------------------------------------------
		const tableSpeakers = document.querySelector(".capability-speakers")
		if (tableSpeakers && (capabilities.webGL || capabilities.webGPU))
		{
			const speakersAvailability = tableSpeakers.querySelector("td."+RESULT )
			speakersAvailability.textContent = "Check you not muted"
			speakersAvailability.classList.remove(NOT_AVAILABLE)
			speakersAvailability.classList.toggle(AVAILABLE, true)
			speakersAvailability.classList.remove(CHECKING)
		}else{
			// NONE FATAL ERROR! No WEBGL so use canvas fallback
			document.body.classList.toggle("speakers-unavailable", true)
			console.info("[WARNING] No GPU available")
		}	

		// TODO: Microphone


		// Speakers class="capability-speakers"
		return fatal
	}
	
	const permissions = await fetchPermissions()
	let isFatalIssue = false
	
	// FIXME: should we request the camera if permission was already granted?
	// what is going on?
	const devices = await navigator.mediaDevices.enumerateDevices()
	const cameras = filterVideoCameras( devices )
	if (cameras.length === 0)
	{
		// FATAL ERROR! No camera!
		isFatalIssue = false
		console.error("Compatability table", table )
		console.error("Devices", {devices, cameras}) 
		console.error("Permissions", {isFatalIssue, permissions, capabilities}) 
	
	}else{
		isFatalIssue = updateTable(permissions, cameras)
		console.log("Compatability table", table )
		console.log("Devices", {devices, cameras}) 
		console.log("Permissions", {isFatalIssue, permissions, capabilities}) 
	}

	// now update the table based on permissions
	return isFatalIssue
}
