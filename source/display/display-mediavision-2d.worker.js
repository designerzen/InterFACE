import { drawEye } from "../visual/2d.eyes"
// import { drawFace } from "../visual/2d.face"

let drawingUtils
let canvas 
let canvasContext

// const drawPerson = ( person, beatJustPlayed, colours ) => {

// }

const drawSingleEye = ( person, beatJustPlayed, colours ) => {
	drawEye( canvasContext, person, beatJustPlayed, colours )
}

// postMessage({event:EVENT_STARTING, time:0})

self.onmessage = e => {

    const data = e.data

	switch(data.command){

		case "initialise":
			canvas = data.canvas
			canvasContext = data.canvasContext
			drawingUtils = new DrawingUtils(canvasContext)
			break

		case "drawPerson":
			//drawFace( canvasContext, data.person, data.beatJustPlayed, data.colours, drawingUtils )
			break

		case "drawEye":
			drawSingleEye( canvasContext, data.eyeData, data.pupilData, data.isEyeOpen, data.eyeDirection, data.eyeOptions)
			break
	}
}