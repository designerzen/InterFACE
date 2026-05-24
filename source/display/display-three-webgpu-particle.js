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
import { getDisplayColourAlpha, getPredictionLandmarks } from "./display-landmarks.js"

import {
	Scene,
	OrthographicCamera,
	Vector3,
	Vector2,
	Color,
	AmbientLight,
	PointLight,
	BufferGeometry,
	BufferAttribute,
	Points,
	PointsMaterial,
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
import { subdivideKeypoints } from "../models/avatar.js"
import { applyWebGPUParticleMarch } from "./webgpu-particle-motion.js"

const DEFAULT_OPTIONS_DISPLAY_THREE_WEBGPU = {
	debug: false,
	stats: false,
	resize: true,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
	particleCount: 468, // MediaPipe face has 468 landmarks
	particleSize: 2,
	particleColour: { r: 1, g: 0.8, b: 0.6 },
	wireframe: false,
	showTrace: false,
	geometrySubdivisions: 0
}

/**
 * THREE.js WebGPU-powered particle display for mediapipe landmarks
 * Uses TLSL shaders for GPU-side particle animation and rendering
 */
export default class DisplayThreeWebGPUParticle extends AbstractDisplay {

	name = DISPLAY_THREE_WEBGPU_PARTICLE
	transparentCanvas = true

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

	constructor(canvas, initialWidth, initialHeight, options = DEFAULT_OPTIONS_DISPLAY_THREE_WEBGPU) {
		options = Object.assign({}, DEFAULT_OPTIONS_DISPLAY_THREE_WEBGPU, options)
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

		const probeCanvas = document.createElement("canvas")
		const canCreateWebGLContext = Boolean(
			probeCanvas.getContext("webgl2") ||
			probeCanvas.getContext("webgl") ||
			probeCanvas.getContext("experimental-webgl")
		)
		if (!WebGLRenderer || !canCreateWebGLContext) {
			throw new Error("Three WebGPU Particle display requires WebGLRenderer and a WebGL-capable canvas")
		}

		// Create WebGL renderer (WebGPU not available in three.js v0.183.2 ESM)
		this.renderer = new WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true,
			premultipliedAlpha: false
		})

		this.renderer.setPixelRatio(1)
		this.renderer.setSize(this.canvasWidth, this.canvasHeight, false)
		this.renderer.setClearColor(new Color(0x000000), 0)

		// No async init needed for WebGL renderer

		// Create scene
		this.scene = new Scene()

		// Create camera
		this.camera = new OrthographicCamera(
			0,
			this.canvasWidth,
			0,
			this.canvasHeight,
			-10000,
			10000
		)
		this.camera.position.set(0, 0, 100)
		this.camera.lookAt(0, 0, 0)

		// Add lighting
		const ambientLight = new AmbientLight(0xffffff, 0.8)
		this.scene.add(ambientLight)

		const pointLight = new PointLight(0xffffff, 1)
		pointLight.position.set(this.canvasWidth / 2, this.canvasHeight / 2, -this.canvasHeight / 2)
		this.scene.add(pointLight)

		// Create particle system
		this.createParticleSystem(options.particleCount)

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
		this.onResize(this.canvasWidth, this.canvasHeight)
	}

	onResize(width, height) {
		this.camera.left = 0
		this.camera.right = width
		this.camera.top = 0
		this.camera.bottom = height
		this.camera.updateProjectionMatrix()

		if (this.renderer) {
			this.renderer.setSize(width, height, false)
		}
	}

	/**
	 * Create GPU-accelerated particle system using WebGPU storage buffers
	 * @param {Number} particleCount - Number of particles
	 */
	createParticleSystem(particleCount) {

		this.instanceCount = particleCount

		this.particleGeometry = new BufferGeometry()

		const positionAttribute = new BufferAttribute(
			new Float32Array(particleCount * 3),
			3
		)
		this.particleGeometry.setAttribute('position', positionAttribute)

		this.positionBuffer = positionAttribute
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

		this.particleMesh = new Points(
			this.particleGeometry,
			this.particleMaterial
		)

		this.scene.add(this.particleMesh)
	}

	/**
	 * Create TSL-based particle material with WebGPU shaders
	 * Uses THREE.js Node Materials with WGSL backend
	 * @returns Material with TSL vertex and fragment shaders
	 */
	createTSLParticleMaterial() {

		const material = new PointsMaterial({
			color: new Color(
				this.options.particleColour.r,
				this.options.particleColour.g,
				this.options.particleColour.b
			),
			size: this.options.particleSize,
			transparent: true,
			sizeAttenuation: true
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

		if (landmarks.length !== this.instanceCount) {
			this.recreateParticleSystem(landmarks.length)
		}

		const positionData = this.positionBuffer.array

		for (let i = 0; i < Math.min(landmarks.length, this.instanceCount); i++) {

			const landmark = landmarks[i]

			positionData[i * 3] = landmark.x * this.canvasWidth
			positionData[i * 3 + 1] = landmark.y * this.canvasHeight
			positionData[i * 3 + 2] = (landmark.z || 0) * 100
		}

		applyWebGPUParticleMarch({
			positions:positionData,
			frame:this.count,
			options:this.options,
			dimensions:3
		})

		// Mark buffer as needing update
		this.positionBuffer.needsUpdate = true
	}

	recreateParticleSystem(particleCount) {
		if (this.particleMesh) {
			this.scene.remove(this.particleMesh)
			this.particleMesh.geometry.dispose()
			this.particleMesh.material.dispose()
		}
		this.createParticleSystem(particleCount)
	}

	/**
	 * Update particle colours from person data
	 * @param {Person} person - Person object
	 * @param {Number} hue - Hue value
	 * @param {Object} colours - Colour palette
	 */
	updateParticleColours(person, hue, colours = {}) {

		if (!this.colourBuffer) return

		const rgb = this.hslToRgb(hue, colours.s || 100, colours.l || 50)

		if (this.particleMaterial) {
			this.particleMaterial.color.setRGB(rgb.r, rgb.g, rgb.b)
			this.particleMaterial.opacity = getDisplayColourAlpha(colours)
		}
	}

	hslToRgb(h, s, l) {
		h = ((h % 360) + 360) % 360
		s = s / 100
		l = l / 100

		const c = (1 - Math.abs(2 * l - 1)) * s
		const hp = h / 60
		const x = c * (1 - Math.abs((hp % 2) - 1))

		let r = 0
		let g = 0
		let b = 0

		if (hp < 1) { r = c; g = x }
		else if (hp < 2) { r = x; g = c }
		else if (hp < 3) { g = c; b = x }
		else if (hp < 4) { g = x; b = c }
		else if (hp < 5) { r = x; b = c }
		else { r = c; b = x }

		const m = l - c / 2
		return {
			r: Math.max(0, Math.min(1, r + m)),
			g: Math.max(0, Math.min(1, g + m)),
			b: Math.max(0, Math.min(1, b + m))
		}
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

		const landmarks = getPredictionLandmarks(prediction)
		if (landmarks.length === 0) return
		const pointLandmarks = this.options.geometrySubdivisions > 0
			? subdivideKeypoints(landmarks, this.options.geometrySubdivisions)
			: landmarks

		this.updateParticlePositions(pointLandmarks)
		this.updateParticleColours(person, hue, colours)
	}

	/**
	 * Render the scene
	 */
	async render() {
		this.count++
		this.elapsedTime += 0.016

		if (this.renderer && !this.renderer.isDisposed) {
			this.renderer.render(this.scene, this.camera)
		}
		super.render()
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
