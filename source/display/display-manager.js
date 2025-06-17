/**
 * Load in different displays to use as the front end.
 * 
 * There are differernt displays depending on which library is used
 * and which hardware is available.
 * 
 * The WebXR version has an extra holographic mode too
 */
// 
import DisplayLookingGlass3D, { createXRToggleButton } from './display-looking-glass-3d.js'

import {DISPLAY_TYPES} from './display-types.js'

let display = null

export const loadDisplayClass = async( type ) => {
	
	switch(type)
	{
		// FIXME: Face detection has dependency clash
		// case DISPLAY_CANVAS_2D: 
		// 	const {Display2D} = await import('./display-canvas-2d.js')
		// 	return Display2D
		case DISPLAY_TYPES.DISPLAY_MEDIA_PIPE_2D: 
			const { default:DisplayMediaPipe2D} = await import('./display-mediapipe-2d.js')
			return {default:DisplayMediaPipe2D}

		case DISPLAY_TYPES.DISPLAY_COMPOSITE: 
			const { default:DisplayComposite} = await import('./display-composite.js')
			return {default:DisplayComposite}

		case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D: 
			const { default:DisplayMediaVision2D} = await import('./display-mediavision-2d.js')
			return {default:DisplayMediaVision2D}

		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D: 
			const { default:DisplayWebGL3D } = await import( './display-webgl-3d.js')
			return {default:DisplayWebGL3D}

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D: 
			const { default:DisplayLookingGlass3D, requiredXRSetupForLookingGlass, createXRToggleButton } = await import( './display-looking-glass-3d.js')
			return {
				default:DisplayLookingGlass3D, 
				before:requiredXRSetupForLookingGlass
			}
	}
}

/**
 * Changes displays
 * @param {String} displayType 
 * @returns 
 */
export const createDisplay = async (canvasElement, displayType, options={} ) => {

	// set the canvas to the size of the video / image
	// display = new Display( webGLElement, inputElement.width, inputElement.height )
	console.warn("DISPLAY:Creating new",displayType,"on", canvasElement, {options}) 
		
	canvasElement.setAttribute( "data-display-type",displayType )
	switch(displayType)
	{
		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
			// NB. Make sure you set this to a WEB_GL context!
			const {default:DisplayWebGL3D} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_WEB_GL_3D )
			const displayWebGL3D = new DisplayWebGL3D( canvasElement, canvasElement.width, canvasElement.height, options )
			console.info("DISPLAY_WEB_GL_3D LOADING", displayWebGL3D)
			await displayWebGL3D.loading
			return displayWebGL3D

		case DISPLAY_TYPES.DISPLAY_COMPOSITE:
			// Allows mulltiple displays to be simultaneously powered!
			const {default:DisplayComposite} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_COMPOSITE )
			const displayComposite = new DisplayComposite( canvasElement, canvasElement.width, canvasElement.height, options )
			// display.addDisplay(displayMediaVision2D)
			// return await loadDisplay( DISPLAY_COMPOSITE )
			return displayComposite

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D:
			// Looking Glass Portrait hardware
			// const {default:DisplayLookingGlass3D, before} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D )
			const {default:DisplayLookingGlass3D, requiredXRSetupForLookingGlass:before } = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D )
			const displayLookingGlass3D = new DisplayLookingGlass3D( canvasElement, canvasElement.width, canvasElement.height, {...options, lookingGlassWebXR:before } )

			// const displayLookingGlass3D = new DisplayLookingGlass3D( canvasElement, canvasElement.width, canvasElement.height, {...options, lookingGlassWebXR:before} )
			await displayLookingGlass3D.loading
			return displayLookingGlass3D

		case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D:
		default:
			// Media Vision ML Model and Canvas 2Ds
			const {default:DisplayMediaVision2D} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D )
			const displayMediaVision2D = new DisplayMediaVision2D( canvasElement, canvasElement.width, canvasElement.height, options )
			await displayMediaVision2D.loading
			
			return displayMediaVision2D
	}
}

/**
 * delete and re-create the canvas element
 * @param {String} displayType 
 * @returns 
 */
export const restartCanvas = async( canvasElement, maxWidth=-1 ) => {
	// as a context once set can only be one of 2d or webgl
	const classNames = canvasElement.className
	const id = canvasElement.id
	const parent = canvasElement.parentNode
	const dataId = canvasElement.getAttribute("data-id") ?? 0
	// as we modify some in the displays themselves
	const width = 640 //canvasElement.clientWidth
	const height = 480 // canvasElement.clientHeight
	const aspectRatio = width / height

	if (!parent)
	{
		throw Error("Canvas provided is not yet a DOM member - please add before calling restartCanvas()")
	}

	const newCanvasElement = document.createElement('canvas')
	// clone all current canvas attribtes to the new canvas
	Array.from(canvasElement.attributes).forEach(attribute => {
		newCanvasElement.setAttribute( attribute.nodeName, attribute.nodeValue )
	})

	// replace some
	newCanvasElement.width = width // maxWidth > -1 ? Math.min(maxWidth, width) : width
	newCanvasElement.height = height // newCanvasElement.width / aspectRatio
	newCanvasElement.id = id
	newCanvasElement.className = classNames
	// newCanvasElement.setAttribute("width", parseInt(dataId) + 1 ) 
	// newCanvasElement.setAttribute("height", parseInt(dataId) + 1 ) 
	newCanvasElement.setAttribute("data-id", parseInt(dataId) + 1 ) 
	
	// re-append new canvas in old canvas location
	parent.appendChild(newCanvasElement)
	
	// remove existing canvas 
	canvasElement.remove()

	console.info("restartCanvas", {canvasElement, newCanvasElement, display, parent})
	
	// kill to prevent side effects
	canvasElement = null

	return newCanvasElement
} 


/**
 * delete and re-create the canvas element with the new
 * custom display
 * @param {String} displayType 
 * @returns 
 */
export const changeDisplay = async(canvasElement, displayType, renderLoop, options ) => {
	
	// display type may be a string or an object
	if (!canvasElement)
	{
		throw Error("No embedded canvas was provided")
	}
	
	if (!canvasElement.parentNode)
	{
		throw Error("No DOM canvas was provided - only orphan without parent")  
	}

	// invert if a key was provided...
	if (DISPLAY_TYPES[displayType])
	{
		displayType = DISPLAY_TYPES[displayType]
	}

	if ( !Object.values(DISPLAY_TYPES).includes(displayType) )
	{
		console.warn("Display test", displayType, DISPLAY_TYPES, DISPLAY_TYPES[displayType])
		throw Error("Display type "+displayType+" is not supported")
	}

	// as a context once set can only be one of 2d or webgl
	const newCanvasElement = await restartCanvas(canvasElement, -1)

	// async or load direct
	// display = await createEmbeddedDisplay(newCanvasElement, displayType)
	const display = await createDisplay(newCanvasElement, displayType, options)

	if (renderLoop)
	{
		display.setAnimationLoop(renderLoop)
	}

	console.info("createDisplay", { display, displayType, canvasElement, newCanvasElement, renderLoop })

	return display
}
