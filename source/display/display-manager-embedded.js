
import { loadDisplayClass, createDisplay } from "./display-manager.js"
import Person from "../person.js"

import DisplayCanvas2D from './display-canvas-2d.js'
import DisplayWebGL3D from './display-webgl-3d.js'
import DisplayLookingGlass3D, { requiredXRSetupForLookingGlass } from './display-looking-glass-3d.js'
import DisplayComposite from './display-composite.js'
import DisplayMediaVision2D from './display-mediavision-2d.js'

import { restartCanvas } from './display-manager.js'
import { howManyHolographicDisplaysAreConnected } from '../hardware/looking-glass-portrait.js'
import { DISPLAY_TYPES } from "./display-types.js"


const INITIAL_DISPLAY = DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D // DISPLAY_WEB_GL_3D


/**
 * Use loadDisplay to avoid useless coad load
 * @param {CanvasElement} canvasElement 
 * @param {String} displayType 
 * @returns 
 */
export const createEmbeddedDisplay = async(canvasElement, displayType) => {

	console.info("createDisplay",{ canvasElement, displayType})

	switch(displayType)
	{
		case DISPLAY_TYPES.DISPLAY_CANVAS_2D:
			const displayCanvas2D = new DisplayCanvas2D( canvasElement, canvasElement.width, canvasElement.height )
			await displayCanvas2D.loading
			return displayCanvas2D

		case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D:
			const displayMediaVision2D = new DisplayMediaVision2D( canvasElement, canvasElement.width, canvasElement.height )
			await displayMediaVision2D.loading
			return displayMediaVision2D

		case DISPLAY_TYPES.DISPLAY_COMPOSITE:
			// Allows mulltiple displays to be simultaneously powered!
			// const DisplayComposite = await loadDisplayClass( DISPLAY_COMPOSITE )
			const displayComposite = new DisplayComposite( canvasElement, canvasElement.width, canvasElement.height )
			await displayComposite.loading
			// display.addDisplay(displayLookingGlass3D)
			// display.addDisplay(displayMediaVision2D)
			// display.addDisplay(displayWebGL3D)
			return displayComposite

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D:
			requiredXRSetupForLookingGlass()		
			const displayLookingGlass3D = new DisplayLookingGlass3D( canvasElement, canvasElement.width, canvasElement.height )
			await displayLookingGlass3D.loading
			return displayLookingGlass3D

		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
		default:
			// NB. Make sure you set this to a WEB_GL context!
			// const DisplayWebGL3D = await loadDisplay( DISPLAY_WEB_GL_3D )
			const displayWebGL3D = new DisplayWebGL3D( canvasElement, canvasElement.width, canvasElement.height )
			await displayWebGL3D.loading
			return displayWebGL3D
	}
}
