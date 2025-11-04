/**
 * Collection of detected/tracked faces, where each face is represented as a list of 468 face landmarks and each landmark is composed of x, y and z. x and y are normalized to [0.0, 1.0] by the image width and height respectively. z represents the landmark depth with the depth at center of the head being the origin, and the smaller the value the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.
 */

import Person from "../person.js"
import { loadDisplayClass, createDisplay, restartCanvas, changeDisplay, getDisplayAvailability  } from '../display/display-manager.js'
import { DISPLAY_TYPES, DISPLAY_IDS, DISPLAY_LOOKING_GLASS_3D } from '../display/display-types.js'
import { now } from "../timing/timing.js"

// import { AVATAR_DATA } from "../models/avatars.js"
import Avatar from "../models/avatar.js"

import DATA_SOURCE from 'raw:./test.face-stream.json'

// JSON data from data_source
// import DATA_SOURCE from 'raw:/source/tests/test.face.json'

let DATA
let DATA_KEYS 

let count = 0
let display
let displayType
let selectDisplay

let canvas = document.querySelector('canvas')

const person = new Person( 0, {} )

// console.log("Person created", person)

const chooseRandomDisplay = () =>{
	const keys = Object.keys(DISPLAY_TYPES)
	const key = keys[ Math.floor( Math.random() * (keys.length-1) ) ]
	return DISPLAY_TYPES[ key ]
} 

const chooseNextDisplay = () =>{
	const displayTypes = Object.values(DISPLAY_TYPES)

	const previousIndex = displayTypes.indexOf(displayType)
	const displayIndex = previousIndex === -1 ? 
		0 :
		(previousIndex + 1 ) % displayTypes.length

	console.info("Choosing next display", {displayType, previousIndex, displayIndex, keys: displayTypes})
	return displayTypes[displayIndex]
} 

/**
 * Draw stuff on display via the render loop
 */
const render = () => {
	
	if (display)
	{
		const key = DATA_KEYS[count % DATA_KEYS.length]
		const data = DATA[key]
		person.update(data, now() )

		display.clear()
		display.drawPerson(person, true)
		display.drawEmoticon(0,0,":-D")
		display.drawText(0,0, count + ". Display:"+display.name)

		// required to update the actual GL
		display.render()

		count++
	}	
}


/**
 * Register the displays with the canvas and update the DOM UI with
 * the specified display type
 * @param {String} initialDisplay 
 */
const registerDisplays = async (initialDisplay = DISPLAY_TYPES.DISPLAY_WEB_GL_3D) => {

	const result = document.getElementById('output')
	
	const buttonVideo = document.getElementById('button-video')
	canvas = document.querySelector('canvas')
	
	// Sniff hardware connected to determine if we want XR

	// Looking Glass Portrait hardware :
	// firstly check to see how many holographic displays are connected and modify the default display 
	// if the hologrpahic display is available and has not been previously set
	initialDisplay = await getDisplayAvailability()
	result.textContent = initialDisplay === DISPLAY_LOOKING_GLASS_3D ? 'Looking Glass Portrait' : "NO Looking Glass Portraits detected"
	
	// immediately set the video display to what was discovered / previously set as an option
	// try{
		display = await changeDisplay(canvas, initialDisplay, render)
		displayType = initialDisplay
		canvas = display.canvas
	// }catch(error){
	// 	console.error("Cannot change Display Error:", error) 
	// }

	// Update the DOM UI
	selectDisplay = document.getElementById('select-display')
	selectDisplay.addEventListener('change', async(e) => {
		displayType = selectDisplay.value
		// delete any existing display
		if (display){
			display.destroy()
		}
		display = await changeDisplay( canvas, displayType, render )
		canvas = display.canvas
		result.textContent = "Looking Glass Portrait detected " + displayType
	})
	selectDisplay.value = initialDisplay

	buttonVideo.addEventListener("click", async(e) => {
		const newDisplayType = chooseNextDisplay()
		// const newDisplayType = chooseRandomDisplay()
		console.log("Display CHANGE request from", canvas.getAttribute("data-display-type"), "to", {newDisplayType} )
		try{
			
			console.log("Display changing", newDisplayType, canvas.parentNode)
			// delete any existing display
			if (display){
				display.destroy()
			}
			display = await changeDisplay( canvas, newDisplayType, render )
			canvas = display.canvas
			displayType = newDisplayType
			selectDisplay.value = newDisplayType
			
			console.log("Display changed", {canvas, display}, canvas.parentNode)
			result.textContent = "Display updated " + newDisplayType

		}catch(error){
			console.error("Display Could not be swapped", error)
		}
	})
	console.info("Registering displays with canvas", canvas, canvas.parentElement)
}

const loadAvatar = async ( avatarModel ) => {
	const avatar = new Avatar()
	const faceModel = await avatar.loadModel( avatarModel )
	console.log("Avatar created", avatar, "with face", faceModel, "with", avatarModel  )
}

async function init(){

	const request = await fetch(DATA_SOURCE)
	const response = await request.json()
	DATA = response
	DATA_KEYS = Object.keys( DATA )

	console.info("Display Loaded JSON Data", DATA_KEYS )

	canvas = document.querySelector('canvas')
	
	console.log("Person created", person, "with", {DATA, DATA_KEYS} )
	
	// console.log("\nAvatar Racoon loading", AVATAR_DATA.racoon, "----------------------" )
	// const model = await loadAvatar( AVATAR_DATA.racoon )


	/*
	// test the Avatar loader
	console.log("\nAvatar Cyborg loading", AVATAR_DATA.cyborg, "----------------------" )
	await loadAvatar( AVATAR_DATA.cyborg )
	

	console.log("\nAvatar Face loading", AVATAR_DATA.face, "----------------------" )
	await loadAvatar( AVATAR_DATA.face )

	console.log("\nAvatar Albert loading", AVATAR_DATA.albert, "----------------------" )
	await loadAvatar( AVATAR_DATA.albert )

	console.log("\nAvatar Sam loading", AVATAR_DATA.sam, "----------------------" )
	await loadAvatar( AVATAR_DATA.sam )

	console.log("\nAvatar Sushi loading", AVATAR_DATA.sushi, "----------------------" )
	await loadAvatar( AVATAR_DATA.sushi )

	console.log("\nAvatar Droid loading", AVATAR_DATA.droid, "----------------------" )
	await loadAvatar( AVATAR_DATA.droid )

	console.log("\nAvatar Twist loading", AVATAR_DATA.twist, "----------------------" )
	await loadAvatar( AVATAR_DATA.twist )
	*/

	// swap canvases numerous times...
	// display = await changeDisplay( canvas, DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D, render )
	// canvas = display.canvas
	// console.error("DISPLAY_LOOKING_GLASS_3D", display, canvas.parentElement)

	// // TEST : Looking Glass Portrait
	// display = await changeDisplay( canvas, DISPLAY_TYPES.DISPLAY_WEB_GL_3D, render )
	// canvas = display.canvas
	// console.error("DISPLAY_WEB_GL_3D", display, canvas.parentElement)


	/*
	
	displayType = DISPLAY_IDS[counter++%DISPLAY_IDS.length]
	// console.info("ChangeDisplays", displayType, canvas, canvas.parentNode )
	display = await changeDisplay( canvas, displayType, render )
	canvas = display.canvas

	
	displayType = DISPLAY_IDS[counter++%DISPLAY_IDS.length]
	// console.info("ChangeDisplays", displayType, canvas, canvas.parentNode )
	display = await changeDisplay( canvas, displayType, render )
	canvas = display.canvas

	displayType = DISPLAY_IDS[counter++%DISPLAY_IDS.length]
	// console.info("ChangeDisplays", displayType, canvas, canvas.parentNode )
	display = await changeDisplay( canvas, displayType, render )
	canvas = display.canvas

	// displayType = DISPLAY_IDS[counter++%DISPLAY_IDS.length]
	// // console.info("ChangeDisplays", displayType, canvas, canvas.parentNode )
	// display = await changeDisplay( canvas, displayType, render )
	// canvas = display.canvas
	*/

	try{
		const o = await registerDisplays()
	}catch(error){
		console.error("Display error", error )
	}
}

window.addEventListener("DOMContentLoaded", init)