/**
 * Load in different displays to use as the front end.
 * 
 * There are differernt displays depending on which library is used
 * and which hardware is available.
 * 
 * The WebXR version has an extra holographic mode too
 */

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
			const { default:DisplayLookingGlass3D, requiredXRSetupForLookingGlass } = await import( './display-looking-glass-3d.js')
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
export const createDisplay = async (canvasElement, displayType) => {

	// set the canvas to the size of the video / image
	// display = new Display( webGLElement, inputElement.width, inputElement.height )
	
	switch(displayType)
	{
		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
			// NB. Make sure you set this to a WEB_GL context!
			const {default:DisplayWebGL3D} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_WEB_GL_3D )
			const displayWebGL3D = new DisplayWebGL3D( canvasElement, canvasElement.width, canvasElement.height )
			await displayWebGL3D.loading
			return displayWebGL3D

		case DISPLAY_TYPES.DISPLAY_COMPOSITE:
			// Allows mulltiple displays to be simultaneously powered!
			const {default:DisplayComposite} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_COMPOSITE )
			const displayComposite = new DisplayComposite( canvasElement, canvasElement.width, canvasElement.height )
			// display.addDisplay(displayMediaVision2D)
			// return await loadDisplay( DISPLAY_COMPOSITE )
			return displayComposite

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D:
			// Looking Glass Portrait hardware
			const {default:DisplayLookingGlass3D, before} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D )
		
			// TODO: Sniff hardware connected to determine if we want XR?
			const lookingGlassWebXR = before()
			const displayLookingGlass3D = new DisplayLookingGlass3D( canvasElement, canvasElement.width, canvasElement.height, {lookingGlassWebXR} )
			await displayLookingGlass3D.loading
			return displayLookingGlass3D

		case DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D:
		default:
			// Media Videion ML Model and Canvas 2D
			const {default:DisplayMediaVision2D} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D )
			const displayMediaVision2D = new DisplayMediaVision2D( canvasElement, canvasElement.width, canvasElement.height )
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
	const width = canvasElement.clientWidth
	const height = canvasElement.clientHeight
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
	newCanvasElement.width = maxWidth > -1 ? Math.min(maxWidth, width) : width
	newCanvasElement.height = newCanvasElement.width / aspectRatio
	newCanvasElement.id = id
	newCanvasElement.className = classNames
	newCanvasElement.setAttribute("data-id", parseInt(dataId) + 1 ) 

	// remove existing canvas 
	canvasElement.remove()
	
	// re-append new canvas in old canvas location
	parent.appendChild(newCanvasElement)
	return newCanvasElement
} 


/**
 * delete and re-create the canvas element with the new
 * custom display
 * @param {String} displayType 
 * @returns 
 */
export const changeDisplay = async(canvasElement, displayType, renderLoop ) => {
	
	if (!canvasElement)
	{
		throw Error("No embedded canvas was provided")
	}
	
	if (!canvasElement.parentNode)
	{
		throw Error("No DOM canvas was provided - only orphan")  
	}

	// delete any existing connection
	if (display)
	{
		console.warn("Swapping Display", display.id, "for", displayType)
		display.destroy()
		display = null
	}else{
		console.warn("Iniitislising Display", displayType)
	}

	// as a context once set can only be one of 2d or webgl
	const newCanvasElement = await restartCanvas(canvasElement, 720)

	
	// async or load direct
	// display = await createEmbeddedDisplay(newCanvasElement, displayType)
	display = await createDisplay(newCanvasElement, displayType)

	if (renderLoop)
	{
		display.setAnimationLoop(renderLoop)
	}

	console.info("createDisplay",displayType, { canvasElement, newCanvasElement, display})

	return display
}
