/**
 * Load in different displays to use as the front end.
 * 
 * There are differernt displays depending on which library is used
 * and which hardware is available.
 * 
 * The WebXR version has an extra holographic mode too
 */
// 
// import { howManyHolographicDisplaysAreConnected } from '../hardware/looking-glass-portrait.js'
import { DISPLAY_TYPES } from './display-types.js'

const isWebGLAvailable = () => {
  const canvas = document.createElement('canvas');
  try {
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch(e) {
    return false
  }
}


/**
 * Lazy load in a Display Class and its deps
 * @param {String} type 
 * @returns 
 */
export const loadDisplayClass = async( type ) => {
	
	try{
	switch(type)
	{
		// FIXME: Face detection has dependency clash
		// case DISPLAY_CANVAS_2D: 
		// 	const {Display2D} = await import('./display-canvas-2d.js')
		// 	return Display2D
		case DISPLAY_TYPES.DISPLAY_CANVAS_2D:
			const { default:DisplayCanvas2D} = await import('./display-canvas-2d.js')
			return {default:DisplayCanvas2D}

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
			const { default:DisplayWebGL3D } = await import( './display-webgl-3d-working.js')
			return {default:DisplayWebGL3D}

		case DISPLAY_TYPES.DISPLAY_WEB_GPU_3D:
			const { default:DisplayWebGPU } = await import('./display-webgpu-working.js')
			return {default:DisplayWebGPU}

		case DISPLAY_TYPES.DISPLAY_BABYLON_3D:
			const { default:DisplayBabylon3D } = await import('./display-babylon-3d.js')
			return {default:DisplayBabylon3D}

		case DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE:
			const { default:DisplayThreeWebGPUParticle } = await import('./display-three-webgpu-particle.js')
			return {default:DisplayThreeWebGPUParticle}

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D: 
			const { default:DisplayLookingGlass3D, requiredXRSetupForLookingGlass } = await import( './display-looking-glass-3d.js')
			return {
				default:DisplayLookingGlass3D, 
				before:requiredXRSetupForLookingGlass
			}

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU:
			const { default:DisplayLookingGlassWebGPU } = await import('./display-looking-glass-webgpu.js')
			return {default:DisplayLookingGlassWebGPU}

		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL:
			const { default:DisplayLookingGlassWebGPUTSL } = await import('./display-looking-glass-3d-webgpu-tsl.js')
			return {default:DisplayLookingGlassWebGPUTSL}
	}
	}catch( error ){
		console.error("Couldn't load Display Library", error)
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
	console.info("DISPLAY:Creating new",displayType,"on", canvasElement, {options}) 
		
	canvasElement.setAttribute( "data-display-type",displayType )
	switch(displayType)
	{
		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
			// NB. Make sure you set this to a WEB_GL context!
			const {default:DisplayWebGL3D} = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_WEB_GL_3D )
			const displayWebGL3D = new DisplayWebGL3D( canvasElement, canvasElement.width, canvasElement.height, options )
			// console.info("DISPLAY_WEB_GL_3D LOADING", displayWebGL3D)
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
			const {default:DisplayLookingGlass3D, before } = await loadDisplayClass( DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D )
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
	const width = canvasElement.canvasWidth ?? 640
	const height = canvasElement.canvasHeight ?? 480
	const aspectRatio = width / height

	if (!parent)
	{
		throw Error("Canvas provided is not yet a DOM member - please add before calling restartCanvas()")
	}

	const newCanvasElement = document.createElement('canvas')

	// DO NOT clone all current canvas attribtes to the new canvas
	// as this will likely break due to remnants from threejs and webXR
	// Array.from(canvasElement.attributes).forEach(attribute => {
	// 	newCanvasElement.setAttribute( attribute.nodeName, attribute.nodeValue )
	// })

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

	console.info("DISPLAY:restartCanvas", {canvasElement, newCanvasElement, parent})
	
	// kill to prevent side effects
	canvasElement = null

	return newCanvasElement
} 

export const getAvailableDisplays = ( hasHolographicDisplayConnected=false ) => {
	// Default always available display
	const availableDisplays = [
		DISPLAY_TYPES.DISPLAY_COMPOSITE,
		DISPLAY_TYPES.DISPLAY_CANVAS_2D,
		DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D
	]

	// if WebGL is available
	if (isWebGLAvailable())
	{
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_WEB_GL_3D)
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_BABYLON_3D)
	}

	// check for WebGPU
	if (navigator.gpu)
	{
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_WEB_GPU_3D)
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE)
	}

	// hologrpahic displays are connected
	if (hasHolographicDisplayConnected)
	{
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D)
		navigator.gpu && availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU)
	}

	return availableDisplays
}

/**
 * checks for certain devices to be connected 
 * screen sizes and capabilities and return displays
 * that are available for this device
 * 
 * @returns 
 */
export const getDisplaysInformation = async( previousDisplay, defaultDisplay= DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D ) => {
	
	// assume webGL 3D one if no previous one was provided
	let suggestedDisplay = previousDisplay ?? defaultDisplay
	let holographicDisplayQuantity = 0
	
	const available = []
	try{
		const {howManyHolographicDisplaysAreConnected } = await import( '../hardware/looking-glass-portrait.js' )
		holographicDisplayQuantity = await howManyHolographicDisplaysAreConnected()
		if (holographicDisplayQuantity > 0)
		{
			suggestedDisplay = DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D	
		}

	}catch(error){
		console.info("Holographic display not connected" , error)
	}
	
	return {
		suggested: suggestedDisplay,
		available: [...available, ...getAvailableDisplays(holographicDisplayQuantity > 0)]
	}
}




/**
 * delete and re-create the canvas element with the new
 * custom display
 * @param {String} displayType 
 * @returns 
 */
export const changeDisplay = async(canvasElement, displayType, renderLoop, options={} ) => {
	
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
		display.setAnimationLoop(renderLoop, options.autoStart ?? true )
	}

	console.info("DISPLAY:created", { display, displayType, canvasElement, newCanvasElement, renderLoop })

	return display
}


export default class DisplayManager{

	#display
	#canvas
	type

	get display(){
		return this.#display
	}

	constructor( canvasVideoElement, initialDisplayType ){
		this.#canvas = canvasVideoElement
		this.type = initialDisplayType
	}

	listAvailable(){
		return getAvailableDisplays()
	}

	async create( displayType, options={} ){
		return await createDisplay( this.#canvas, displayType, options )
	}

	async switchTo( displayType, renderLoop, options={}){

		// display type may be a string or an object
		if (!this.#canvas)
		{
			throw Error("No embedded canvas was provided")
		}
		
		if (!this.#canvas.parentNode)
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
		const newCanvasElement = await restartCanvas(this.#canvas, -1)

		// async or load direct
		// display = await createEmbeddedDisplay(newCanvasElement, displayType)
		const display = await createDisplay(newCanvasElement, displayType, options)

		if (renderLoop)
		{
			display.setAnimationLoop(renderLoop, options.autoStart ?? true )
		}

		console.info("DISPLAY:created", { display, displayType, newCanvasElement }, this )

		this.#display = display
		this.#canvas = newCanvasElement
		this.type = displayType

		return display
	}

	async restart(){
		return await restartCanvas( this.#canvas )
	}
}