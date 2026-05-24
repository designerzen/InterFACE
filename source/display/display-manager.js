/**
 * Load in different displays to use as the front end.
 * 
 * There are differernt displays depending on which library is used
 * and which hardware is available.
 * 
 * The WebXR version has an extra holographic mode too
 */


import { DISPLAY_TYPES } from './display-types.js'

const DEFAULT_DISPLAY_TYPE = DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D

const normalizeDisplayType = displayType => {
	if (DISPLAY_TYPES[displayType])
	{
		return DISPLAY_TYPES[displayType]
	}
	return displayType
}

const isDisplayRuntimeAvailable = displayType => {
	switch(displayType)
	{
		case DISPLAY_TYPES.DISPLAY_WEB_GL_3D:
		case DISPLAY_TYPES.DISPLAY_BABYLON_3D:
		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D:
		case DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE:
			return isWebGLAvailable()

		case DISPLAY_TYPES.DISPLAY_WEB_GPU_3D:
		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU:
		case DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL:
			return Boolean(navigator.gpu)

		default:
			return true
	}
}

const isWebGLAvailable = () => {
  const canvas = document.createElement('canvas')
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
 * Lazily loaded Display Classes
 */
const displayClassLoaders = {
	[DISPLAY_TYPES.DISPLAY_CANVAS_2D]: async () => {
		const { default:DisplayCanvas2D } = await import('./display-canvas-2d.js')
		return {default:DisplayCanvas2D}
	},

	[DISPLAY_TYPES.DISPLAY_MEDIA_PIPE_2D]: async () => {
		const { default:DisplayMediaPipe2D } = await import('./display-mediapipe-2d.js')
		return {default:DisplayMediaPipe2D}
	},

	[DISPLAY_TYPES.DISPLAY_COMPOSITE]: async () => {
		const { default:DisplayComposite } = await import('./display-composite.js')
		return {default:DisplayComposite}
	},

	[DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D]: async () => {
		const { default:DisplayMediaVision2D } = await import('./display-mediavision-2d.js')
		return {default:DisplayMediaVision2D}
	},

	[DISPLAY_TYPES.DISPLAY_WEB_GL_3D]: async () => {
		const { default:DisplayWebGL3D } = await import( './display-webgl-3d-direct.js')
		return {default:DisplayWebGL3D}
	},

	[DISPLAY_TYPES.DISPLAY_WEB_GPU_3D]: async () => {
		const { default:DisplayWebGPU } = await import('./display-webgpu-direct.js')
		return {default:DisplayWebGPU}
	},

	[DISPLAY_TYPES.DISPLAY_BABYLON_3D]: async () => {
		const { default:DisplayBabylon3D } = await import('./display-babylon-3d.js')
		return {default:DisplayBabylon3D}
	},

	[DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE]: async () => {
		const { default:DisplayThreeWebGPUParticle } = await import('./display-three-webgpu-particle.js')
		return {default:DisplayThreeWebGPUParticle}
	},

	[DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D]: async () => {
		const { default:DisplayLookingGlass3D, requiredXRSetupForLookingGlass } = await import( './display-looking-glass-3d.js')
		return {
			default:DisplayLookingGlass3D,
			before:requiredXRSetupForLookingGlass
		}
	},

	[DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU]: async () => {
		const { default:DisplayLookingGlassWebGPU, requiredXRSetupForLookingGlass } = await import('./display-looking-glass-webgpu.js')
		return {
			default:DisplayLookingGlassWebGPU,
			before:requiredXRSetupForLookingGlass
		}
	},

	[DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL]: async () => {
		const { default:DisplayLookingGlassWebGPUTSL, requiredXRSetupForLookingGlassWebGPU } = await import('./display-looking-glass-3d-webgpu-tsl.js')
		return {
			default:DisplayLookingGlassWebGPUTSL,
			before:requiredXRSetupForLookingGlassWebGPU
		}
	}
}

const displayClassPromises = new Map()

/**
 * Lazy load in a Display Class and its deps
 * @param {String} type 
 * @returns 
 */
export const loadDisplayClass = async( type ) => {
	
	try{
		const loader = displayClassLoaders[type]
		if (!loader)
		{
			throw Error("Display type "+type+" is not supported")
		}

		if (!displayClassPromises.has(type))
		{
			displayClassPromises.set(type, loader())
		}

		return await displayClassPromises.get(type)
	}
	catch( error ){
		console.error("Couldn't load Display Library", error)
		displayClassPromises.delete(type)
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
	const {default:DisplayClass, before} = await loadDisplayClass( displayType )
	const display = new DisplayClass(
		canvasElement,
		canvasElement.width,
		canvasElement.height,
		before ? {...options, lookingGlassWebXR:before } : options
	)

	await display.loading
	return display
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
	const width = canvasElement.canvasWidth ?? canvasElement.width ?? 640
	const height = canvasElement.canvasHeight ?? canvasElement.height ?? 480
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
	
	// replace in-place so display switching does not move the canvas in the DOM
	parent.replaceChild(newCanvasElement, canvasElement)

	console.info("DISPLAY:RestartCanvas", {canvasElement, newCanvasElement, parent})
	
	// kill to prevent side effects
	canvasElement = null

	return newCanvasElement
} 

/**
 * Get all available displays
 * @param {Boolean} hasHolographicDisplayConnected 
 * @returns 
 */
export const getAvailableDisplays = ( hasHolographicDisplayConnected=false ) => {
	// Default app displays are always offered; unsupported hardware displays are
	// filtered before startup if they are genuinely unavailable.
	const availableDisplays = [
		DISPLAY_TYPES.DISPLAY_COMPOSITE,
		DISPLAY_TYPES.DISPLAY_CANVAS_2D,
		DISPLAY_TYPES.DISPLAY_MEDIA_PIPE_2D,
		DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D,
		DISPLAY_TYPES.DISPLAY_WEB_GL_3D,
		DISPLAY_TYPES.DISPLAY_WEB_GPU_3D,
		DISPLAY_TYPES.DISPLAY_BABYLON_3D,
		DISPLAY_TYPES.DISPLAY_THREE_WEBGPU_PARTICLE
	]

	// hologrpahic displays are connected
	if (hasHolographicDisplayConnected)
	{
		availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D)
		navigator.gpu && availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_WEBGPU)
		navigator.gpu && availableDisplays.push(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL)
	}

	return availableDisplays
}

/**
 * checks for certain devices to be connected 
 * screen sizes and capabilities and return displays
 * that are available for this device
 * 
 * @returns {Object} - suggested and available
 */
export const getDisplaysInformation = async( previousDisplay, defaultDisplay= DISPLAY_TYPES.DISPLAY_MEDIA_VISION_2D ) => {
	
	const requestedDisplay = normalizeDisplayType(previousDisplay)
	const fallbackDisplay = normalizeDisplayType(defaultDisplay) ?? DEFAULT_DISPLAY_TYPE
	let holographicDisplayQuantity = 0
	
	try{
		const {howManyHolographicDisplaysAreConnected } = await import( '../hardware/looking-glass-portrait.js' )
		holographicDisplayQuantity = await howManyHolographicDisplaysAreConnected()
	}catch(error){
		console.info("Holographic display not connected" , error)
	}

	const available = getAvailableDisplays(holographicDisplayQuantity > 0)
	const shouldPreferLookingGlass = holographicDisplayQuantity > 0 &&
		(!requestedDisplay || requestedDisplay === fallbackDisplay)
	const canUseRequestedDisplay = available.includes(requestedDisplay) && isDisplayRuntimeAvailable(requestedDisplay)
	const canUseFallbackDisplay = available.includes(fallbackDisplay) && isDisplayRuntimeAvailable(fallbackDisplay)
	const suggestedDisplay = shouldPreferLookingGlass && available.includes(DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D) ?
		DISPLAY_TYPES.DISPLAY_LOOKING_GLASS_3D :
		canUseRequestedDisplay ?
		requestedDisplay :
		canUseFallbackDisplay ?
			fallbackDisplay :
			available.find(isDisplayRuntimeAvailable) ?? available[0]
	
	return {
		suggested: suggestedDisplay,
		available,
		holographicDisplayQuantity
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
	displayType = normalizeDisplayType(displayType)

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

/**
 * 
 */
export default class DisplayManager{

	#display
	#canvas
	#type

	get display(){
		return this.#display
	}

	get type(){
		return this.#type
	}

	constructor( canvasVideoElement, initialDisplayType ){
		this.#canvas = canvasVideoElement
		this.#type = initialDisplayType
	}

	listAvailable(){
		return getAvailableDisplays()
	}

	async create( displayType, options={} ){
		return await createDisplay( this.#canvas, displayType, options )
	}

	/**
	 * Switch this canvas to this Display
	 */
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
		displayType = normalizeDisplayType(displayType)

		if ( !Object.values(DISPLAY_TYPES).includes(displayType) )
		{
			console.warn("Display test", displayType, DISPLAY_TYPES, DISPLAY_TYPES[displayType])
			throw Error("Display type "+displayType+" is not supported")
		}

		if (this.#display?.destroy)
		{
			await this.#display.destroy()
			this.#display = null
		}

		const previousCanvasElement = this.#canvas

		// as a context once set can only be one of 2d or webgl
		const newCanvasElement = await restartCanvas(previousCanvasElement, -1)
		this.#canvas = newCanvasElement

		// async or load direct
		// display = await createEmbeddedDisplay(newCanvasElement, displayType)
		let display
		try
		{
			display = await createDisplay(newCanvasElement, displayType, options)
		}
		catch(error)
		{
			console.error("DISPLAY:failed to create", displayType, error)
			this.#display = null
			this.#type = null
			throw error
		}

		if (renderLoop)
		{
			display.setAnimationLoop(renderLoop, options.autoStart ?? true )
		}

		console.info("DISPLAY:created", { display, displayType, newCanvasElement }, this )

		this.#display = display
		this.#type = displayType

		return display
	}

	async restart(){
		return await restartCanvas( this.#canvas )
	}

	setSize( width, height ){
		this.#display?.setSize( width, height )
	}
}
