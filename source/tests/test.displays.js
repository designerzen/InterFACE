/**
 * Collection of detected/tracked faces, where each face is represented as a list of 468 face landmarks and each landmark is composed of x, y and z. x and y are normalized to [0.0, 1.0] by the image width and height respectively. z represents the landmark depth with the depth at center of the head being the origin, and the smaller the value the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.
 */

import Person from "../person.js"

import { 
	loadDisplayClass, 
	createDisplay, 
	changeDisplay 
} from "../display/display-manager.js"

import { DISPLAY_TYPES } from '../display/display-types.js'
import { howManyHolographicDisplaysAreConnected } from '../hardware/looking-glass-portrait.js'
import { now } from "../timing/timing.js"

import DATA_SOURCE from 'raw:/source/tests/test.face.json'

// JSON data from data_source
let DATA
let DATA_KEYS 

let count = 0
let display


const person = new Person( 0, {} )

// console.log("Person created", person)

const chooseRandomDisplay = () =>{
	const keys = Object.keys(DISPLAY_TYPES)
	const key = keys[ Math.floor( Math.random() * (keys.length-1) ) ]
	return DISPLAY_TYPES[ key ]
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
		display.drawText(0,0, count + ". Display:"+display.name)

		// required to update the actual GL
		display.render()

		count++
	}	
}

const registerDisplays = async (initialDisplay = DISPLAY_TYPES.DISPLAY_WEB_GL_3D) => {

	let canvas = document.querySelector('canvas')
	const buttonVideo = document.getElementById('button-video')
	
	// Sniff hardware connected to determine if we want XR

	// Looking Glass Portrait hardware :
	// firstly check to see how many holographic displays are connected and modify the default display 
	// if the hologrpahic display is available and has not been previously set
	let holographicDisplayQuantity 
	try{
		holographicDisplayQuantity = await howManyHolographicDisplaysAreConnected()
		if (holographicDisplayQuantity > 1)
		{
			initialDisplay = DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D
			document.body.classList.add("holographic")
		}else{
			console.info("No Looking Glass devices found")
		}	
	}catch(error){
		console.info("No Looking Glass devices connected")
	}
	
	// immediately set the video display to what was discovered / previously set as an option
	try{
		// display = await changeDisplay(canvas, initialDisplay, render)
		display = await createDisplay( canvas, initialDisplay )
		display.setAnimationLoop( render )		
	}catch(error){
		console.error("Display Error", error)
	}

	// Update the DOM UI
	const selectDisplay = document.getElementById('select-display')
	selectDisplay.addEventListener('change', async(e) => {
		const newDisplay = DISPLAY_TYPES[selectDisplay.value] 
		display = await changeDisplay( canvas, newDisplay, render )
		canvas = display.canvas
	})
	selectDisplay.value = initialDisplay

	buttonVideo.addEventListener("click", async(e) => {
		const newDisplayType = chooseRandomDisplay()
		console.log("Display change to", {canvas, newDisplayType})
		try{
			display = await changeDisplay( canvas, newDisplayType, render )
			canvas = display.canvas
			console.log("Display changed", {canvas, display})
		}catch(error){
			console.error("Display Error", error)
		}
	})
}

async function init(){

	// console.log("Loading face JSON data", DATA_SOURCE )
	const request = await fetch(DATA_SOURCE)
	const response = await request.json()
	// console.log("Loaded face JSON data", response )

	DATA = response
	DATA_KEYS = Object.keys( DATA )

	console.log("Person created", person, "with", {DATA, DATA_KEYS} )

	try{
		const o = await registerDisplays()
	}catch(error){
		console.error("Display error", error )
	}
}

window.addEventListener("DOMContentLoaded", init)