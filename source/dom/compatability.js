import { fetchPermissions, PERMISSION_GRANTED, PERMISSION_PROMPT, PERMISSION_UNAVAILABLE } from "../capabilities"
import { filterVideoCameras } from "../hardware/camera"

/**
 * Update the table of compatability and reveal it
 * if the user has a device that will not work 100%
 * then show a FATAL error message
 */
export const updateCapabalitiesTable = async (capabilities) => {
	
	const table = document.getElementById("compatability")
	
	const CHECKING = "checking"
	const RESULT = "result"
	const NOT_AVAILABLE = "not-available"
	const AVAILABLE = "available"
	const UNKNOWN = "unknown"

	const updateTable = (permissions, cameras) => {
		
		let fatal = false
	
		// BROWSER
		const tableBrowser = document.querySelector(".capability-browser")
		const browserFeedback = tableBrowser.querySelector("td."+RESULT)
			
		// check browser
		const userAgent = navigator.userAgent
		let browser = "Unknown"
		let showUpgrade = false
		if (userAgent.includes('Firefox/')) {
			browser = "Firefox"
			showUpgrade = true
		} else if (userAgent.includes('Edg/')) {
			browser = "Edge"
		} else if (userAgent.includes('Chrome/')) {
			browser = "Chrome"
		} else if (userAgent.includes('Safari/')) {
			browser = "Safari"
			showUpgrade = true
		}

		if (tableBrowser){
			const browsserAvailability = tableBrowser.querySelector("td."+RESULT )
			const browsserNameElement = tableBrowser.querySelector(".browser-name" )
			browsserNameElement.textContent = `(${browser})`
			browsserAvailability.classList.remove(NOT_AVAILABLE)
			browsserAvailability.classList.toggle(AVAILABLE, true)
			browsserAvailability.classList.remove(CHECKING)
			switch (browser)
			{
				case "Firefox":
					browsserAvailability.textContent = "Slower Graphics"
					break
				case "Safari":
					browsserAvailability.textContent = "No MIDI supported"
					break
				default:
					browsserAvailability.textContent = `Available`
			}
			if ( showUpgrade )
			{
				const alternateBrowsers = document.getElementById("alternate-browsers")
				if (!alternateBrowsers)
				{
					throw Error("No alternate browser list found")
				}
				alternateBrowsers.hidden = false
				alternateBrowsers.open = true
			}
		}

		// CAMERA --------------------------------------------------------------------------
		
		// TODO: show holographic stuff too
		const tableCamera = document.querySelector(".capability-camera")
		const cameraAvailability = tableCamera.querySelector("td."+RESULT)
			
		if (!tableCamera || !cameraAvailability){
			
			//fatal = true
			cameraAvailability.classList.toggle(NOT_AVAILABLE, true)
			cameraAvailability.classList.remove(CHECKING)
			document.body.classList.toggle("camera-unavailable", true)
			
		} else if ( permissions.get("camera") === PERMISSION_UNAVAILABLE ){
			
			// FATAL ERROR! No camera!
			fatal = true
			document.body.classList.toggle("camera-unavailable", true)
			// FIXME: instructions for how to enable permission
			cameraAvailability.textContent = `Camera permission required!`
			cameraAvailability.classList.toggle(NOT_AVAILABLE, true)
			
		} else if (capabilities.cameraAvailable && cameras.length > 0  ){
			
			// SUCCESS!
			// permissions.get("camera") === PERMISSION_GRANTED
			// permissions.get("camera") === PERMISSION_PROMPT
			cameraAvailability.classList.remove(NOT_AVAILABLE)
			cameraAvailability.classList.remove(CHECKING)
			cameraAvailability.classList.add(AVAILABLE)
			
			// TODO: Check for devices if permission has already been granted
			cameraAvailability.textContent = permissions.get("camera") === PERMISSION_PROMPT ?
				`Camera Available but requires permission` :  
				`${cameras.length} Available`
			
			permissions.get("camera") === PERMISSION_GRANTED || permissions.get("camera") === PERMISSION_PROMPT

		}else{
			// FATAL ERROR! No camera!
			fatal = true
			document.body.classList.toggle("camera-unavailable", true)
			cameraAvailability.textContent = `${cameras.length} Connected`
			cameraAvailability.classList.toggle(NOT_AVAILABLE, true)
			console.warn("[FATAL] No camera available")
		}	
	
		// Web MIDI --------------------------------------------------------------------------
		const tableMIDI = document.querySelector(".capability-midi")
		const MIDIAvailability = tableMIDI.querySelector( "td."+RESULT )
		if ( browser !== "Safari" && permissions.get("midi") === PERMISSION_UNAVAILABLE ){
			
			// FATAL ERROR! No camera!
			document.body.classList.toggle("midi-unavailable", true)
			// FIXME: instructions for how to enable permission
			MIDIAvailability.textContent = `MIDI Permission was not granted`
			
		} else if (
			tableMIDI && 
			capabilities.webMIDIAvailable &&
			(  permissions.get("midi") === PERMISSION_GRANTED || permissions.get("midi") === PERMISSION_PROMPT )
		)
		{
			MIDIAvailability.textContent = permissions.get("midi") === PERMISSION_PROMPT ? "Available, please grant permission when requested" : "Available"
			MIDIAvailability.classList.remove(NOT_AVAILABLE)
			MIDIAvailability.classList.remove(CHECKING)
			MIDIAvailability.classList.add(AVAILABLE)
			
		}else if ( browser !== "Safari" ){
			// NONE FATAL ERROR! No MIDI - just hide MIDI stuff!!
			document.body.classList.toggle("midi-unavailable", true)
			MIDIAvailability.textContent = "Unavailable in Safari"
			MIDIAvailability.classList.remove(CHECKING)
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
			GPUAvailability.classList.add(AVAILABLE)
			
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
			speakersAvailability.textContent = "Check volume"
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
	
	try{
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
			// console.log("Compatability table", table )
			// console.log("Devices", {devices, cameras}) 
			// console.log("Permissions", {isFatalIssue, permissions, capabilities}) 
		}
		// console.info( )
	
		// now update the table based on permissions
		return isFatalIssue

	}catch(error){

		console.info("Compat Table Error", error )
		// remove all "checking" messages...
		const checkingElements = document.querySelectorAll(CHECKING)
		checkingElements.forEach( checkingElement => {
			checkingElement.classList.remove(CHECKING) 
			checkingElement.classList.toggle(UNKNOWN, true)
		})
		
		return null
	}
}
