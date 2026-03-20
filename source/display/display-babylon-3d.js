/**
 * Babylon.js 3D Display for MediaPipe Face Landmarks
 * Visualizes face landmarks as particles in a 3D scene
 */

import AbstractDisplay from "./display-abstract.js"
import { DISPLAY_BABYLON_3D } from "./display-types.js"
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.displays.js"
import { Particle } from "../visual/3d.particles.js"

import * as BABYLON from '@babylonjs/core'

const DEFAULT_OPTIONS_DISPLAY_BABYLON = {
	debug: false,
	stats: false,
	resize: false,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	particleSize: 2,
	particleColour: { r: 1, g: 0.8, b: 0.6 },
	showMesh: false,
	wireframe: false
}

/**
 * Babylon.js based 3D display for MediaPipe face landmark visualization
 * Shows particles at correct positions corresponding to face landmarks
 */
export default class DisplayBabylon3D extends AbstractDisplay {

	name = DISPLAY_BABYLON_3D

	// Babylon.js core
	engine = null
	scene = null
	camera = null
	renderer = null

	// Particle system
	particles = []
	particleSystem = null
	tubeSystem = null

	// Video texture
	videoTexture = null
	videoMaterial = null

	// Event handlers (for cleanup)
	onWindowResizeHandler = null

	constructor(canvas, initialWidth, initialHeight, options = DEFAULT_OPTIONS_BABYLON) {
		options = Object.assign({}, DEFAULT_OPTIONS_BABYLON, options)
		super(canvas, initialWidth, initialHeight, options)

		this.create(canvas, options).then(e => {
			this.loadComplete("ready")
		}).catch(error => {
			console.error("ERROR loading Babylon 3D display", error)
			this.loadFailed(error)
		})
	}

	/**
	 * Initialize Babylon.js engine, scene, camera, and lighting
	 */
	async create(canvas, options) {

		// Create Babylon.js engine
		this.engine = new BABYLON.Engine(canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true
		})

		// Create scene
		this.scene = new BABYLON.Scene(this.engine)
		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
		this.scene.collisionsEnabled = true

		// Create camera
		this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(
			this.canvasWidth / 2,
			this.canvasHeight / 2,
			-this.canvasHeight
		))
		this.camera.attachControl(canvas, true)
		this.camera.angularSensibility = 1000
		this.camera.inertia = 0.7
		this.camera.speed = 0

		// Add lighting
		const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0))
		ambientLight.intensity = 0.8

		const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(
			this.canvasWidth / 2,
			this.canvasHeight / 2,
			-this.canvasHeight / 2
		))
		pointLight.intensity = 0.6
		pointLight.range = 5000

		// Initialize particle array
		this.particles = []

		// Set up animation loop
		this.setAnimationLoop(() => {
			this.render()
		}, true)

		// Handle window resize with stored reference for cleanup
		this.onWindowResizeHandler = this.onWindowResize.bind(this)
		window.addEventListener("resize", this.onWindowResizeHandler)

		this.available = true
		return true
	}

	/**
	 * Handle window resize
	 */
	onWindowResize() {
		if (this.engine) {
			this.engine.resize()
		}
	}

	/**
	 * Clear the scene
	 */
	clear() {
		// Scene is automatically cleared each frame
		// This method exists for interface compatibility
	}

	/**
	 * Render the scene
	 */
	render() {
		this.count++

		// Update particles
		for (let particle of this.particles) {
			particle.update(0.016) // Approximate delta time for 60fps
		}

		// Render the scene
		if (this.engine && !this.engine.isDisposed) {
			this.engine.runRenderLoop(() => {
				this.scene.render()
			})
		}
	}

	/**
	 * Draw a person's face landmarks as particles
	 * @param {Person} person - Person object with face landmark data
	 * @param {Boolean} beatJustPlayed - Whether a beat just played
	 * @param {Object} colours - Colour palette
	 * @param {Object} options - Display options
	 */
	drawPerson(person, beatJustPlayed, colours, options = {}) {

		const prediction = person.data
		const hue = person.hue

		if (!prediction) {
			return
		}

		// Update face button position periodically
		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		// Get face landmarks from prediction
		const landmarks = prediction.landmarks || []

		if (landmarks.length === 0) {
			return
		}

		// Initialize particles if needed
		if (this.particles.length === 0) {
			this.createParticleSystem(landmarks.length, options)
		}

		// Update particle positions based on landmarks
		this.updateParticlePositions(landmarks, person, options)

		// Update particle colors
		this.updateParticleColours(person, hue, colours, options)
	}

	/**
	 * Create particle system for landmarks
	 * @param {Number} particleCount - Number of particles to create
	 * @param {Object} options - Display options
	 */
	createParticleSystem(particleCount, options = {}) {

		const particleSize = options.particleSize || this.options.particleSize
		const particleColour = options.particleColour || this.options.particleColour

		// Create a material for particles
		const particleMaterial = new BABYLON.StandardMaterial("particleMaterial", this.scene)
		particleMaterial.emissiveColor = new BABYLON.Color3(
			particleColour.r,
			particleColour.g,
			particleColour.b
		)
		particleMaterial.backFaceCulling = false

		// Create particles using spheres
		for (let i = 0; i < particleCount; i++) {

			const particleMesh = BABYLON.MeshBuilder.CreateSphere(
				`landmark_${i}`,
				{ diameter: particleSize },
				this.scene
			)
			particleMesh.material = particleMaterial
			particleMesh.position = new BABYLON.Vector3(0, 0, 0)

			// Create particle wrapper for animation
			const particle = new Particle(0, 0, 0, 0.15)
			particle.mesh = particleMesh
			this.particles.push(particle)
		}
	}

	/**
	 * Update particle positions based on face landmarks
	 * @param {Array} landmarks - Array of landmark coordinates
	 * @param {Person} person - Person object
	 * @param {Object} options - Display options
	 */
	updateParticlePositions(landmarks, person, options = {}) {

		for (let i = 0; i < Math.min(landmarks.length, this.particles.length); i++) {

			const landmark = landmarks[i]
			const particle = this.particles[i]

			if (!particle.mesh) {
				continue
			}

			// Convert 2D screen coordinates to 3D scene coordinates
			let x = landmark.x * this.canvasWidth
			let y = landmark.y * this.canvasHeight
			
			// Handle optional depth from landmark (for 3D coordinates)
			let z = 0
			if (landmark.z !== undefined) {
				z = landmark.z * 100 // Scale depth appropriately
			}

			// Set target position for smooth animation
			particle.setPosition(x, y, z)

			// Update mesh position
			if (particle.mesh) {
				particle.mesh.position.x = particle.x
				particle.mesh.position.y = particle.y
				particle.mesh.position.z = particle.z
			}
		}
	}

	/**
	 * Update particle colours based on person data
	 * @param {Person} person - Person object
	 * @param {Number} hue - Hue value for colouring
	 * @param {Object} colours - Colour palette
	 * @param {Object} options - Display options
	 */
	updateParticleColours(person, hue, colours = {}, options = {}) {

		const saturation = options.saturation || colours.s || 100
		const luminosity = options.luminosity || colours.l || 50
		const alpha = options.alpha || colours.a || 1

		for (let particle of this.particles) {

			if (!particle.mesh || !particle.mesh.material) {
				continue
			}

			// Convert HSL to RGB for Babylon
			const rgb = this.hslToRgb(hue, saturation, luminosity)

			particle.mesh.material.emissiveColor = new BABYLON.Color3(
				rgb.r,
				rgb.g,
				rgb.b
			)

			// Set alpha
			particle.mesh.material.alpha = alpha
		}
	}

	/**
	 * Convert HSL color to RGB
	 * @param {Number} h - Hue (0-360)
	 * @param {Number} s - Saturation (0-100)
	 * @param {Number} l - Luminosity (0-100)
	 * @returns {Object} RGB object with r, g, b values (0-1)
	 */
	hslToRgb(h, s, l) {

		h = h % 360
		s = s / 100
		l = l / 100

		const c = (1 - Math.abs(2 * l - 1)) * s
		const hp = h / 60
		const x = c * (1 - Math.abs((hp % 2) - 1))

		let r = 0, g = 0, b = 0

		if (hp < 1) {
			r = c; g = x; b = 0
		} else if (hp < 2) {
			r = x; g = c; b = 0
		} else if (hp < 3) {
			r = 0; g = c; b = x
		} else if (hp < 4) {
			r = 0; g = x; b = c
		} else if (hp < 5) {
			r = x; g = 0; b = c
		} else if (hp < 6) {
			r = c; g = 0; b = x
		}

		const m = l - c / 2

		return {
			r: Math.max(0, Math.min(1, r + m)),
			g: Math.max(0, Math.min(1, g + m)),
			b: Math.max(0, Math.min(1, b + m))
		}
	}

	/**
	 * Draw bars for audio visualisation
	 * @param {TypedArray} dataArray - FFT data
	 * @param {Number} bufferLength - Buffer length
	 */
	drawBars(dataArray, bufferLength) {
		// To be implemented if needed
	}

	/**
	 * Draw visualiser for audio data
	 * @param {TypedArray} dataArray - FFT data
	 * @param {Number} bufferLength - Buffer length
	 * @param {String} type - Visualiser type
	 */
	drawVisualiser(dataArray, bufferLength, type) {
		// To be implemented if needed
	}

	/**
	 * Draw instrument information
	 */
	drawInstrument(boundingBox, instrumentName, extra) {
		// To be implemented if needed
	}

	/**
	 * Draw text on screen
	 */
	drawText(x, y, text, size, align, font, invertColours) {
		// To be implemented if needed
	}

	/**
	 * Draw paragraph text
	 */
	drawParagraph(x, y, paragraph, size, lineHeight, invertColours) {
		// To be implemented if needed
	}

	/**
	 * Draw emoticon
	 */
	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1) {
		// To be implemented if needed
	}

	/**
	 * Set filter for post-processing
	 */
	setFilter(filterIndex) {
		// To be implemented if needed
	}

	/**
	 * Next filter for post-processing
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
	 * Post-process the scene
	 */
	postProcess(options) {
		// To be implemented if needed
	}

	/**
	 * Take a screenshot
	 */
	takePhotograph(type = "image/png") {
		if (this.engine) {
			return BABYLON.Tools.CreateScreenshot(this.engine, this.camera, 512)
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

		// Dispose all particle meshes
		if (this.particles) {
			for (let particle of this.particles) {
				if (particle.mesh) {
					particle.mesh.dispose()
				}
			}
			this.particles = []
		}

		// Dispose scene and engine
		if (this.scene) {
			this.scene.dispose()
		}

		if (this.engine) {
			this.engine.dispose()
		}

		return super.destroy()
	}
}
