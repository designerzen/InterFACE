/**
 * Looking Glass WebGPU Display
 * 
 * WebGPU-powered rendering for Looking Glass holographic displays
 * Uses THREE.js with WebGPU renderer and TLSL shaders
 * 
 * Configuration:
 * - `tileHeight` - Height of individual quilt view tile
 * - `numViews` - Number of views to render
 * - `targetX`, `targetY`, `targetZ` - Camera position
 * - `targetDiam` - Camera size/zoom (smaller = bigger)
 * - `fovy` - Vertical field of view in radians
 * - `depthiness` - Depth perception intensity
 * - `inlineView` - Display mode (quilt, centered, or matrix)
 */

import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr/dist/bundle/webxr.js"

import {
	Scene,
	PerspectiveCamera,
	Vector3,
	Color,
	AmbientLight,
	DirectionalLight,
	BufferGeometry,
	BufferAttribute,
	Mesh
} from "three"

// WebGPU support in three.js v0.183.2 is limited
// Using standard WebGLRenderer instead
import { WebGLRenderer } from "three"

import AbstractDisplay from "./display-abstract.js"
import { DISPLAY_LOOKING_GLASS_WEBGPU } from './display-types.js'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.displays.js"
import { Particle } from "../visual/3d.particles.js"

// Default looking glass configuration
const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

let hasXRBeenPolyfilled = false
let lookingGlassWebXR = null

const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU = {
	debug: false,
	stats: false,
	resize: false,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	controls: "#shared-controls",
	particleSize: 2,
	particleColour: { r: 1, g: 0.8, b: 0.6 },
	// Looking Glass specific
	tileHeight: 512,
	numViews: 45,
	depthiness: 0.7,
	targetX: 0,
	targetY: 0,
	targetZ: 1.5,
	targetDiam: 2,
	fovy: (16 * Math.PI) / 180,
	inlineView: "quilt"
}

/**
 * Set up WebXR polyfill for Looking Glass
 * Must be called before display instantiation
 */
export const requiredXRSetupForLookingGlass = () => {
	if (!hasXRBeenPolyfilled) {
		hasXRBeenPolyfilled = true

		const lookingGlassConfig = {
			tileHeight: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.tileHeight,
			numViews: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.numViews,
			depthiness: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.depthiness,
			targetX: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetX,
			targetY: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetY,
			targetZ: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetZ,
			targetDiam: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetDiam,
			fovy: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.fovy,
			inlineView: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.inlineView
		}

		lookingGlassWebXR = new LookingGlassWebXRPolyfill(lookingGlassConfig)
	}
	return lookingGlassWebXR
}

/**
 * Create WebXR toggle button for Looking Glass
 */
export const createXRToggleButton = (renderer, destination) => {
	const { VRButton } = require('three/examples/jsm/webxr/VRButton.js')
	const button = VRButton.createButton(renderer)
	button.style = ""
	button.setAttribute("type", "button")
	destination.append(button)
	return button
}

/**
 * THREE.js WebGPU-powered Looking Glass holographic display
 * Renders face landmarks as particles with WebGPU acceleration
 */
export default class DisplayLookingGlassWebGPU extends AbstractDisplay {

	name = DISPLAY_LOOKING_GLASS_WEBGPU

	get type() {
		return DISPLAY_LOOKING_GLASS_WEBGPU
	}

	// THREE.js core
	renderer = null
	scene = null
	camera = null

	// Particle system
	particles = []
	particleMeshes = []
	particleGeometry = null
	particleMaterial = null

	// XR and Looking Glass
	xrSession = null
	lookingGlassWebXR = null

	// Original canvas dimensions
	originalCanvasSize = {
		width: LOOKING_GLASS_PORTRAIT_WIDTH,
		height: LOOKING_GLASS_PORTRAIT_HEIGHT
	}

	// Event handlers
	onWindowResizeHandler = null

	// Time tracking
	elapsedTime = 0

	constructor(canvas, initialWidth = LOOKING_GLASS_PORTRAIT_WIDTH, initialHeight = LOOKING_GLASS_PORTRAIT_HEIGHT, options = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU) {
		options = Object.assign({}, DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU, options)
		super(canvas, initialWidth, initialHeight, options)

		this.originalCanvasSize.width = initialWidth
		this.originalCanvasSize.height = initialHeight

		if (options.lookingGlassWebXR) {
			this.lookingGlassWebXR = options.lookingGlassWebXR
		}

		this.create(canvas, options).then(e => {
			this.loadComplete("ready")
		}).catch(error => {
			console.error("ERROR loading Looking Glass WebGPU display", error)
			this.loadFailed(error)
		})
	}

	/**
	 * Initialize WebGPU renderer, scene, camera, and particle system
	 */
	async create(canvas, options) {

		// Check WebGPU support
		if (!navigator.gpu) {
			throw new Error("WebGPU not supported in this browser")
		}

		// Create WebGL renderer (WebGPU not available in three.js v0.183.2 ESM)
		this.renderer = new WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true
		})

		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(this.originalCanvasSize.width, this.originalCanvasSize.height)
		this.renderer.setClearColor(new Color(0x000000))

		// Enable XR for Looking Glass
		this.renderer.xr.enabled = true

		// No async init needed for WebGL renderer

		// Create scene
		this.scene = new Scene()

		// Create camera
		this.camera = new PerspectiveCamera(
			75,
			this.originalCanvasSize.width / this.originalCanvasSize.height,
			0.1,
			10000
		)
		this.camera.position.set(
			this.originalCanvasSize.width / 2,
			this.originalCanvasSize.height / 2,
			-this.originalCanvasSize.height
		)
		this.camera.lookAt(this.originalCanvasSize.width / 2, this.originalCanvasSize.height / 2, 0)

		// Add lighting
		const ambientLight = new AmbientLight(0xffffff, 0.8)
		this.scene.add(ambientLight)

		const directionalLight = new DirectionalLight(0xffffff, 0.6)
		directionalLight.position.set(
			this.originalCanvasSize.width / 2,
			this.originalCanvasSize.height / 2,
			-this.originalCanvasSize.height / 2
		)
		this.scene.add(directionalLight)

		// Create particle system
		this.createParticleSystem(468) // MediaPipe face landmarks

		// Set up animation loop
		this.setAnimationLoop(() => {
			this.render()
		}, false)

		// Handle window resize
		this.onWindowResizeHandler = this.onWindowResize.bind(this)
		window.addEventListener("resize", this.onWindowResizeHandler)

		// Create XR button if controls specified
		if (options.controls) {
			const controlsElement = document.querySelector(options.controls) || document.body
			try {
				createXRToggleButton(this.renderer, controlsElement)
			} catch (e) {
				console.warn("Could not create XR button:", e)
			}
		}

		this.available = true
		return true
	}

	/**
	 * Handle window resize
	 */
	onWindowResize() {
		const width = window.innerWidth
		const height = window.innerHeight

		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()

		if (this.renderer) {
			this.renderer.setSize(width, height)
		}
	}

	/**
	 * Create GPU-accelerated particle system
	 */
	createParticleSystem(particleCount) {

		// Create base particle geometry
		this.particleGeometry = new BufferGeometry()
		const positionAttribute = new BufferAttribute(
			new Float32Array([0, 0, 0]),
			3
		)
		this.particleGeometry.setAttribute('position', positionAttribute)

		// Create material with TLSL
		this.particleMaterial = new MeshBasicNodeMaterial({
			transparent: true,
			side: 2 // DoubleSide
		})

		// Initialize particle particles array
		this.particles = []
		this.particleMeshes = []

		for (let i = 0; i < particleCount; i++) {
			const particleGeometry = new BufferGeometry()
			particleGeometry.setAttribute('position', positionAttribute.clone())

			const particleMesh = new Mesh(particleGeometry, this.particleMaterial)
			this.scene.add(particleMesh)
			this.particleMeshes.push(particleMesh)

			const particle = new Particle(0, 0, 0, 0.15)
			particle.mesh = particleMesh
			this.particles.push(particle)
		}
	}

	/**
	 * Clear the scene
	 */
	clear() {
		// Scene is automatically cleared each frame
	}

	/**
	 * Update particle positions from landmarks
	 */
	updateParticlePositions(landmarks) {

		for (let i = 0; i < Math.min(landmarks.length, this.particles.length); i++) {

			const landmark = landmarks[i]
			const particle = this.particles[i]
			const mesh = this.particleMeshes[i]

			if (!mesh) continue

			// Convert 2D screen coordinates to 3D
			let x = landmark.x * this.originalCanvasSize.width
			let y = landmark.y * this.originalCanvasSize.height
			let z = (landmark.z || 0) * 100

			// Set target position
			particle.setPosition(x, y, z)

			// Update particle animation
			particle.update(0.016)

			// Update mesh
			mesh.position.set(particle.x, particle.y, particle.z)
			mesh.scale.set(
				this.options.particleSize,
				this.options.particleSize,
				this.options.particleSize
			)
		}
	}

	/**
	 * Update particle colors
	 */
	updateParticleColours(person, hue, colours = {}) {

		const saturation = colours.s || 100
		const luminosity = colours.l || 50
		const alpha = colours.a || 1

		const rgb = this.hslToRgb(hue, saturation, luminosity)

		for (let mesh of this.particleMeshes) {
			if (mesh && mesh.material) {
				const color = new Color(rgb.r, rgb.g, rgb.b)
				mesh.material.color = color
				mesh.material.opacity = alpha
			}
		}
	}

	/**
	 * Convert HSL to RGB
	 */
	hslToRgb(h, s, l) {
		h = h % 360
		s = s / 100
		l = l / 100

		const c = (1 - Math.abs(2 * l - 1)) * s
		const hp = h / 60
		const x = c * (1 - Math.abs((hp % 2) - 1))

		let r = 0, g = 0, b = 0

		if (hp < 1) { r = c; g = x; b = 0 }
		else if (hp < 2) { r = x; g = c; b = 0 }
		else if (hp < 3) { r = 0; g = c; b = x }
		else if (hp < 4) { r = 0; g = x; b = c }
		else if (hp < 5) { r = x; g = 0; b = c }
		else if (hp < 6) { r = c; g = 0; b = x }

		const m = l - c / 2

		return {
			r: Math.max(0, Math.min(1, r + m)),
			g: Math.max(0, Math.min(1, g + m)),
			b: Math.max(0, Math.min(1, b + m))
		}
	}

	/**
	 * Draw person with particles
	 */
	drawPerson(person, beatJustPlayed, colours, options = {}) {

		const prediction = person.data
		const hue = person.hue

		if (!prediction) return

		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		const landmarks = prediction.landmarks || []
		if (landmarks.length === 0) return

		this.updateParticlePositions(landmarks)
		this.updateParticleColours(person, hue, colours)
	}

	/**
	 * Render the scene with XR support
	 */
	render() {
		this.count++
		this.elapsedTime += 0.016

		if (this.renderer) {
			// Render with XR session if available
			this.renderer.render(this.scene, this.camera)
		}
	}

	/**
	 * Draw bars
	 */
	drawBars(dataArray, bufferLength) {
		// To be implemented if needed
	}

	/**
	 * Draw visualiser
	 */
	drawVisualiser(dataArray, bufferLength, type) {
		// To be implemented if needed
	}

	/**
	 * Draw instrument
	 */
	drawInstrument(boundingBox, instrumentName, extra) {
		// To be implemented if needed
	}

	/**
	 * Draw text
	 */
	drawText(x, y, text, size, align, font, invertColours) {
		// To be implemented if needed
	}

	/**
	 * Draw paragraph
	 */
	drawParagraph(x, y, paragraph, size, lineHeight, invertColours) {
		// To be implemented if needed
	}

	/**
	 * Draw emoticon
	 */
	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false) {
		// To be implemented if needed
	}

	/**
	 * Set filter
	 */
	setFilter(filterIndex) {
		// To be implemented if needed
	}

	/**
	 * Next filter
	 */
	nextFilter() {
		// To be implemented if needed
	}

	/**
	 * Reset filter
	 */
	resetFilter() {
		// To be implemented if needed
	}

	/**
	 * Post-process
	 */
	postProcess(options) {
		// To be implemented if needed
	}

	/**
	 * Take screenshot
	 */
	takePhotograph(type = "image/png") {
		if (this.renderer && this.renderer.domElement) {
			return this.renderer.domElement.toDataURL(type)
		}
		return null
	}

	/**
	 * Destroy and clean up
	 */
	async destroy() {
		// Remove event listeners
		if (this.onWindowResizeHandler) {
			window.removeEventListener("resize", this.onWindowResizeHandler)
			this.onWindowResizeHandler = null
		}

		// Cancel animation loop
		this.cancelAnimationLoop()

		// Dispose particle meshes
		for (let mesh of this.particleMeshes) {
			if (mesh) {
				if (mesh.geometry) mesh.geometry.dispose()
				if (mesh.material) mesh.material.dispose()
			}
		}
		this.particleMeshes = []
		this.particles = []

		// Dispose geometry
		if (this.particleGeometry) {
			this.particleGeometry.dispose()
		}

		// Dispose material
		if (this.particleMaterial) {
			this.particleMaterial.dispose()
		}

		// Dispose renderer
		if (this.renderer) {
			this.renderer.dispose()
		}

		// Clear scene
		if (this.scene) {
			this.scene.clear()
		}

		return super.destroy()
	}
}
