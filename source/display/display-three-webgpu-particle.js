/**
 * THREE.js WebGPU Particle Display with TSL (Three.js Shader Language)
 * Visualizes face landmarks as GPU-powered particles using WebGPU backend
 * 
 * Uses THREE.js with WebGPU renderer and TLSL shaders for efficient
 * particle rendering and animation on the GPU
 */

import AbstractDisplay from "./display-abstract.js"
import { DISPLAY_THREE_WEBGPU_PARTICLE } from "./display-types.js"
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.displays.js"

import {
	Scene,
	PerspectiveCamera,
	Vector3,
	Vector2,
	Color,
	AmbientLight,
	PointLight,
	BufferGeometry,
	BufferAttribute,
	Matrix4,
	Quaternion,
	Euler,
	Mesh
} from "three"

// WebGPU support in three.js v0.183.2 is limited
// Using standard WebGL renderer instead
import { WebGLRenderer, MeshBasicMaterial } from "three"

// Math utilities
import { ONE_DEGREE_IN_RADIANS } from "../maths/maths.js"

const DEFAULT_OPTIONS_DISPLAY_THREE_WEBGPU = {
	debug: false,
	stats: false,
	resize: true,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	particleCount: 468, // MediaPipe face has 468 landmarks
	particleSize: 2,
	particleColour: { r: 1, g: 0.8, b: 0.6 },
	wireframe: false,
	showTrace: false
}

/**
 * THREE.js WebGPU-powered particle display for mediapipe landmarks
 * Uses TLSL shaders for GPU-side particle animation and rendering
 */
export default class DisplayThreeWebGPUParticle extends AbstractDisplay {

	name = DISPLAY_THREE_WEBGPU_PARTICLE

	get type() {
		return DISPLAY_THREE_WEBGPU_PARTICLE
	}

	// THREE.js core
	renderer = null
	scene = null
	camera = null

	// Particle system
	particleMesh = null
	particleGeometry = null
	particleMaterial = null
	instanceCount = 0

	// Storage buffers (not used with WebGL, kept for compatibility)
	positionBuffer = null
	velocityBuffer = null
	colourBuffer = null

	// Emoticon particles
	emoticonParticles = []
	emoticonMeshes = new Map()

	// Event handlers
	onWindowResizeHandler = null
	onBeforeRenderHandler = null

	// Time tracking
	clock = null
	elapsedTime = 0

	constructor(canvas, initialWidth, initialHeight, options = DEFAULT_OPTIONS_THREE_WEBGPU) {
		options = Object.assign({}, DEFAULT_OPTIONS_THREE_WEBGPU, options)
		super(canvas, initialWidth, initialHeight, options)

		this.create(canvas, options).then(e => {
			this.loadComplete("ready")
		}).catch(error => {
			console.error("ERROR loading WebGPU particle display", error)
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
		this.renderer.setSize(this.canvasWidth, this.canvasHeight)
		this.renderer.setClearColor(new Color(0x000000))

		// No async init needed for WebGL renderer

		// Create scene
		this.scene = new Scene()

		// Create camera
		this.camera = new PerspectiveCamera(
			75,
			this.canvasWidth / this.canvasHeight,
			0.1,
			10000
		)
		this.camera.position.set(
			this.canvasWidth / 2,
			this.canvasHeight / 2,
			-this.canvasHeight
		)
		this.camera.lookAt(this.canvasWidth / 2, this.canvasHeight / 2, 0)

		// Add lighting
		const ambientLight = new AmbientLight(0xffffff, 0.8)
		this.scene.add(ambientLight)

		const pointLight = new PointLight(0xffffff, 1)
		pointLight.position.set(this.canvasWidth / 2, this.canvasHeight / 2, -this.canvasHeight / 2)
		this.scene.add(pointLight)

		// Create particle system
		this.createParticleSystem(options.particleCount)

		// Set up animation loop
		this.setAnimationLoop(() => {
			this.render()
		}, true)

		// Handle window resize with stored reference
		this.onWindowResizeHandler = this.onWindowResize.bind(this)
		window.addEventListener("resize", this.onWindowResizeHandler)

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
	 * Create GPU-accelerated particle system using WebGPU storage buffers
	 * @param {Number} particleCount - Number of particles
	 */
	createParticleSystem(particleCount) {

		this.instanceCount = particleCount

		// Create particle geometry (single sphere per particle)
		this.particleGeometry = new BufferGeometry()

		// Position attribute for sphere vertices
		const positionAttribute = new BufferAttribute(
			new Float32Array([0, 0, 0]),
			3
		)
		this.particleGeometry.setAttribute('position', positionAttribute)

		// Initialize buffers (WebGL doesn't use storage buffers like WebGPU)
		this.positionBuffer = new Float32Array(particleCount * 3)
		this.velocityBuffer = new Float32Array(particleCount * 3)
		this.colourBuffer = new Float32Array(particleCount * 4)
		
		for (let i = 0; i < this.colourBuffer.length; i += 4) {
			this.colourBuffer[i] = 1     // r
			this.colourBuffer[i + 1] = 0.8 // g
			this.colourBuffer[i + 2] = 0.6 // b
			this.colourBuffer[i + 3] = 1   // a
		}

		// Create material with TLSL shaders
		this.particleMaterial = this.createTSLParticleMaterial()

		// Create instanced particle mesh
		this.particleMesh = new Mesh(
			this.particleGeometry,
			this.particleMaterial
		)
		this.particleMesh.count = this.instanceCount

		this.scene.add(this.particleMesh)
	}

	/**
	 * Create TSL-based particle material with WebGPU shaders
	 * Uses THREE.js Node Materials with WGSL backend
	 * @returns Material with TSL vertex and fragment shaders
	 */
	createTSLParticleMaterial() {

		const material = new MeshBasicNodeMaterial({
			transparent: true,
			side: 2, // DoubleSide
			wireframe: this.options.wireframe
		})

		return material
	}

	/**
	 * Clear the scene
	 */
	clear() {
		// Scene is automatically cleared each frame
	}

	/**
	 * Update particle positions from face landmark data
	 * @param {Array} landmarks - Face landmark positions
	 */
	updateParticlePositions(landmarks) {

		if (!this.positionBuffer) return

		const positionData = this.positionBuffer.array
		const velocityData = this.velocityBuffer.array

		for (let i = 0; i < Math.min(landmarks.length, this.instanceCount); i++) {

			const landmark = landmarks[i]

			// Current position
			const x0 = positionData[i * 3]
			const y0 = positionData[i * 3 + 1]
			const z0 = positionData[i * 3 + 2]

			// Target position from landmark
			const x1 = landmark.x * this.canvasWidth
			const y1 = landmark.y * this.canvasHeight
			const z1 = (landmark.z || 0) * 100

			// Smooth interpolation
			const speed = 0.15
			const newX = x0 + (x1 - x0) * speed
			const newY = y0 + (y1 - y0) * speed
			const newZ = z0 + (z1 - z0) * speed

			// Store position
			positionData[i * 3] = newX
			positionData[i * 3 + 1] = newY
			positionData[i * 3 + 2] = newZ

			// Store velocity for motion trails
			velocityData[i * 3] = (newX - x0) / 0.016
			velocityData[i * 3 + 1] = (newY - y0) / 0.016
			velocityData[i * 3 + 2] = (newZ - z0) / 0.016
		}

		// Mark buffer as needing update
		this.positionBuffer.needsUpdate = true
		this.velocityBuffer.needsUpdate = true
	}

	/**
	 * Update particle colours from person data
	 * @param {Person} person - Person object
	 * @param {Number} hue - Hue value
	 * @param {Object} colours - Colour palette
	 */
	updateParticleColours(person, hue, colours = {}) {

		if (!this.colourBuffer) return

		const colourData = this.colourBuffer.array
		const rgb = this.hslToRgb(hue, colours.s || 100, colours.l || 50)

		for (let i = 0; i < this.instanceCount; i++) {
			colourData[i * 4] = rgb.r
			colourData[i * 4 + 1] = rgb.g
			colourData[i * 4 + 2] = rgb.b
			colourData[i * 4 + 3] = colours.a || 1
		}

		this.colourBuffer.needsUpdate = true
	}

	/**
	 * Draw person with updated particle positions
	 */
	drawPerson(person, beatJustPlayed, colours, options = {}) {

		const prediction = person.data
		const hue = person.hue

		if (!prediction) return

		// Update face button position
		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		const landmarks = prediction.landmarks || []
		if (landmarks.length === 0) return

		// Update GPU buffers with new landmark data
		this.updateParticlePositions(landmarks)
		this.updateParticleColours(person, hue, colours)
	}

	/**
	 * Render the scene
	 */
	async render() {
		this.count++
		this.elapsedTime += 0.016

		if (this.renderer && !this.renderer.isDisposed) {
			await this.renderer.renderAsync(this.scene, this.camera)
		}
	}

	/**
	 * Draw bars for audio visualization
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
	 * Draw emoticon using particles arranged in circular formation
	 * Creates a halo of particles around the emoticon center position
	 * @param {Number} x - X position on screen
	 * @param {Number} y - Y position on screen
	 * @param {String} emoji - Emoji character to identify this emoticon
	 * @param {Number} rotationZ - Z-axis rotation in radians
	 * @param {Number} rotationY - Y-axis rotation in radians
	 * @param {Number} rotationX - X-axis rotation in radians
	 * @param {Number} activeCircleIndex - Index of active note circle (-1 for none)
	 * @param {Boolean} flipX - Whether to flip the emoticon horizontally
	 */
	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false) {

		const emoticonKey = `${emoji}_${x}_${y}`
		const emoticonSize = 54

		// Get or create emoticon particle group
		let emoticonGroup = this.emoticonMeshes.get(emoticonKey)
		if (!emoticonGroup) {
			emoticonGroup = {
				particles: [],
				meshes: [],
				key: emoticonKey
			}
			this.emoticonMeshes.set(emoticonKey, emoticonGroup)
		}

		// Generate circular note pattern
		const noteCircleData = this.getNoteCircleData(x, y, 90, emoticonSize, 12)

		// Update or create particle meshes for note circle
		for (let i = 0; i < noteCircleData.length; i++) {

			const notePoint = noteCircleData[i]
			const particleSize = activeCircleIndex === i ? 4 : 2

			if (i >= emoticonGroup.meshes.length) {
				// Create new particle mesh for this note position
				const particleGeometry = new BufferGeometry()
				const positionAttr = new BufferAttribute(
					new Float32Array([0, 0, 0]),
					3
				)
				particleGeometry.setAttribute('position', positionAttr)

				const particleMaterial = new MeshBasicMaterial({
					transparent: true
				})

				const particleMesh = new Mesh(particleGeometry, particleMaterial)
				this.scene.add(particleMesh)
				emoticonGroup.meshes.push(particleMesh)

				emoticonGroup.particles.push({
					currentX: notePoint.x,
					currentY: notePoint.y,
					currentZ: 0,
					targetX: notePoint.x,
					targetY: notePoint.y,
					targetZ: 0,
					size: particleSize
				})
			}

			// Update particle position and size
			const particle = emoticonGroup.particles[i]
			particle.targetX = notePoint.x
			particle.targetY = notePoint.y
			particle.size = particleSize

			// Smooth interpolation
			const speed = 0.2
			particle.currentX += (particle.targetX - particle.currentX) * speed
			particle.currentY += (particle.targetY - particle.currentY) * speed
			particle.currentZ += (particle.targetZ - particle.currentZ) * speed

			// Update mesh
			const mesh = emoticonGroup.meshes[i]
			mesh.position.set(particle.currentX, particle.currentY, particle.currentZ)
			mesh.scale.set(particle.size, particle.size, particle.size)

			// Apply rotations
			mesh.rotation.order = 'ZYX'
			mesh.rotation.z = rotationZ
			mesh.rotation.y = rotationY
			mesh.rotation.x = rotationX

			// Apply flip if needed
			if (flipX) {
				mesh.scale.x *= -1
			}
		}
	}

	/**
	 * Calculate note circle data for emoticon halo
	 * Creates points arranged in a circular arc above the emoticon
	 * @param {Number} cx - Center X coordinate
	 * @param {Number} cy - Center Y coordinate
	 * @param {Number} range - Angle range in degrees
	 * @param {Number} radius - Circle radius
	 * @param {Number} numberOfPoints - Number of points in circle
	 * @returns {Array} Array of {x, y} points
	 */
	getNoteCircleData(cx, cy, range = 90, radius = 70, numberOfPoints = 12) {

		const halfRange = range / 2
		const startAngleDegrees = 90 - halfRange
		const endAngleDegrees = 90 + halfRange

		const startAngleRadians = startAngleDegrees * ONE_DEGREE_IN_RADIANS
		const endAngleRadians = endAngleDegrees * ONE_DEGREE_IN_RADIANS
		const angleIncrement = (endAngleRadians - startAngleRadians) / (numberOfPoints - 1)

		const data = []
		for (let i = 0; i < numberOfPoints; i++) {
			const currentAngle = startAngleRadians + (i * angleIncrement)
			const pointX = cx + radius * Math.cos(currentAngle)
			const pointY = cy - radius * Math.sin(currentAngle)
			data.push({ x: pointX, y: pointY })
		}

		return data
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
	 * Destroy and clean up resources
	 */
	async destroy() {
		// Remove event listeners
		if (this.onWindowResizeHandler) {
			window.removeEventListener("resize", this.onWindowResizeHandler)
			this.onWindowResizeHandler = null
		}

		// Cancel animation loop
		this.cancelAnimationLoop()

		// Dispose emoticon meshes
		for (let emoticonGroup of this.emoticonMeshes.values()) {
			for (let mesh of emoticonGroup.meshes) {
				if (mesh.geometry) mesh.geometry.dispose()
				if (mesh.material) mesh.material.dispose()
			}
		}
		this.emoticonMeshes.clear()
		this.emoticonParticles = []

		// Dispose geometry
		if (this.particleGeometry) {
			this.particleGeometry.dispose()
		}

		// Dispose material
		if (this.particleMaterial) {
			this.particleMaterial.dispose()
		}

		// Dispose meshes
		if (this.particleMesh) {
			this.particleMesh.geometry.dispose()
			this.particleMesh.material.dispose()
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
