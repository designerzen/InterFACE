/**
 * Looking Glass Portrait Display with WebGPU and TSL
 * 
 * Holographic 3D display using Looking Glass Portrait hardware with WebXR
 * Uses WebGPU renderer with Three.js Shading Language (TSL)
 * 
 * Configuration:
 * - `tileHeight` - defines the height of the individual quilt view
 * - `numViews` - defines the number of views to be rendered
 * - `targetX`, `targetY`, `targetZ` - defines the position of the camera
 * - `targetDiam` - defines the size/zoom of the camera
 * - `fovy` - defines the vertical FOV of the camera (in radians)
 * - `depthiness` - modifies the view frustum depth perception
 * - `inlineView` - changes how the canvas is displayed (quilt/centered/matrix)
 */

import { LookingGlassWebXRPolyfill } from "@lookingglass/webxr/dist/bundle/webxr.js"

import * as THREE from "three"
// WebGPU support in three.js v0.183.2 is limited - using WebGL renderer instead
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

import DisplayWebGPU3D from "./display-webgpu-3d.js"
import { DISPLAY_LOOKING_GLASS_3D } from './display-types.js'
import { DEFAULT_OPTIONS_DISPLAY_WEBGL } from "../settings/options.displays.js"

// Settings
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

let openXRButton = null
let connectHardwareButtons = false

export const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL = {
	...DEFAULT_OPTIONS_DISPLAY_WEBGL,
	controls: "#shared-controls"
}

export const createXRToggleButton = (renderer, destination) => {
	if (openXRButton) {
		destination.append(openXRButton)
		return openXRButton
	}
	// adapt VRButton styles
	openXRButton = VRButton.createButton(renderer)
	openXRButton.style = ""
	openXRButton.setAttribute("type", "button")
	destination.append(openXRButton)
	return openXRButton
}

let hasXRBeenPolyfilled = false
let lookingGlassWebXR = null

/**
 * Setup required for Looking Glass WebXR polyfill
 * Must be called before instantiation of the class
 */
export const requiredXRSetupForLookingGlassWebGPU = () => {
	
	if (!hasXRBeenPolyfilled) {
		// only ever run this once!
		hasXRBeenPolyfilled = true

		const lookingGlassConfig = {
			// defines the height of the individual quilt view
			tileHeight: 512,
			// number of views to be rendered
			numViews: 45,
			// modifies the view frustum to increase or decrease the perceived depth
			depthiness: 0.7,
			// defines the position of the camera on the axis
			targetX: 0,
			targetY: 0,
			// matches the camera position in the WebGL version
			targetZ: 1.5,
			// defines the size of the camera, smaller numbers mean bigger models
			targetDiam: 2,
			// defines the vertical FOV of the camera (in radians)
			fovy: (16 * Math.PI) / 180,
			// changes how the original canvas on the main web page is displayed
			inlineView: "quilt",
		}

		lookingGlassWebXR = new LookingGlassWebXRPolyfill(lookingGlassConfig)
	}
	return lookingGlassWebXR
}

/**
 * Three.js Based Looking Glass 3D Display with WebGPU and TSL
 * Extends DisplayWebGPU3D (the WebGPU backend)
 */
export default class DisplayLookingGlass3DWebGPUTSL extends DisplayWebGPU3D {

	name = DISPLAY_LOOKING_GLASS_3D

	get type() {
		return DISPLAY_LOOKING_GLASS_3D_WEBGPU_TSL
	}

	isButtonFullSize = false

	lookingGlassWebXR = null

	controls = null

	originalCanvasSize = {
		width: 0, 
		height: 0
	}

	constructor(canvas, initialWidth = LOOKING_GLASS_PORTRAIT_WIDTH, initialHeight = LOOKING_GLASS_PORTRAIT_HEIGHT, options = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL) {
		options = { ...DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL, ...options }
	
		super(canvas, initialWidth, initialHeight, options)
		
		if (options.lookingGlassWebXR) {
			this.lookingGlassWebXR = options.lookingGlassWebXR
		}
		
		// save original dimensions for Looking Glass Portrait
		this.originalCanvasSize.width = initialWidth
		this.originalCanvasSize.height = initialHeight
	}

	addSideButtonControls() {
		// Hardware button controls (if needed in future)
	}

	removeSideButtonControls() {
		// Hardware button cleanup (if needed in future)
	}

	async create(keypointQuantity = 478, options = {}) {

		await super.create(keypointQuantity, options)

		// Necessary for VR button and for headsets
		this.renderer.xr.enabled = true
		this.renderer.setSize(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)

		// Create VR button in the specified controls element
		const controls = this.options.controls 
			? document.querySelector(this.options.controls) 
			: document.body.appendChild(document.createElement("div"))
		
		// Immediately create the VR Button as the Looking Glass will override it
		createXRToggleButton(this.renderer, controls)

		console.info("Adding XR button to", this.options, controls, DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU_TSL)

		if (connectHardwareButtons) {
			this.addSideButtonControls()
		}
		
		this.available = true

		return true
	}

	/**
	 * Cleanup and destroy the display
	 */
	async destroy() {
		if (this.controls) {
			this.removeSideButtonControls()		
		}
		if (openXRButton) {
			openXRButton.parentNode.removeChild(openXRButton)
		}

		// Reset canvas size
		this.renderer.setSize(this.originalCanvasSize.width, this.originalCanvasSize.height)

		return await super.destroy()
	}
	
	/**
	 * We cannot use selective bloom in XR mode
	 * LookingGlassXRDevice.isFeatureSupported: feature not understood: layers 
	 * The optional feature 'layers' is not supported
	 */
	async addFX() {}
	 
	/**
	 * Make the button the same size as the Looking Glass screen
	 */
	movePersonButton(person, prediction) {
		if (!this.isButtonFullSize) {
			// Resize to Looking Glass Portrait dimensions
			person.moveButton(0, 0, LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)
			this.isButtonFullSize = true
		}
	}

	arrangeParticles(data, scaleFactor = 1, centralise = true) {
		return super.arrangeParticles(data, scaleFactor, centralise)
	}
}
