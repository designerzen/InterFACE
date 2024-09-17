
/**
 * Update the table of compatability and reveal it
 * if the user has a device that will not work 100%
 * then show a FATAL error message
 */
export const updateCapabalitiesTable = async () => {
	
	const table = document.getElementById("compatability")
	
	const updateTable = (permissions) => {

		const CHECKING = "checking"
		const NOT_AVAILABLE = "not-available"
		const AVAILABLE = "available"

		let fatal = false
		// remove .not-available as appropriate
	
		// TODO: show holographic stuff too
		if (
			permissions.camera === PERMISSION_GRANTED || 
			permissions.camera === PERMISSION_PROMPT || 
			capabilities.cameraAvailable 
		){
			const tableCamera = document.querySelector(".capability-camera")
			const cameraAvailability = tableCamera.querySelector("td."+CHECKING)
			cameraAvailability.textContent = "Available"
			cameraAvailability.classList.remove(NOT_AVAILABLE)
			cameraAvailability.classList.remove(CHECKING)
			cameraAvailability.classList.add(AVAILABLE)
		}else{
			// FATAL ERROR! No camera!
			fatal = true
			body.classList.toggle("camera-unavailable", true)
		}	
	
		// Web MIDI!
		if (capabilities.webMIDIAvailable)
		{
			const tableMIDI = document.querySelector(".capability-midi")
			const MIDIAvailability = tableMIDI.querySelector( "td."+CHECKING )
			MIDIAvailability.textContent = "Available"
			MIDIAvailability.classList.remove(NOT_AVAILABLE)
			MIDIAvailability.classList.remove(CHECKING)
			MIDIAvailability.classList.add(AVAILABLE)
			
		}else{
			// NONE FATAL ERROR! No MIDI - just hide MIDI stuff!!
			body.classList.toggle("midi-unavailable", true)
		}	
	
		// GPU 
		if (capabilities.webGL || capabilities.webGPU)
		{
			const tableGPU = document.querySelector(".capability-gpu")
			const GPUAvailability = tableGPU.querySelector("td."+CHECKING )
			GPUAvailability.textContent = "Available"
			GPUAvailability.classList.remove(NOT_AVAILABLE)
		}else{
			// NONE FATAL ERROR! No WEBGL so use canvas fallback
			body.classList.toggle("gpu-unavailable", true)
		}	

		return fatal
	}
	
	const permissions = await fetchPermissions()
	const isFatalIssue =updateTable(permissions)
	
	console.log("Compatability table")
	console.log("Permissions", {isFatalIssue, permissions, capabilities}) 

	// FIXME: should we request the camera if permission was already granted?
	// what is going on?
	const devices = await navigator.mediaDevices.enumerateDevices()
	if (devices.length === 0)
	{
		// FATAL ERROR! No camera!

	}else{
		updateTable(devices)
	}
		
	console.log("Compatability table", table )
	console.log("Devices", {devices}) 
}
