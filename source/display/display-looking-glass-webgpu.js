/**
 * Looking Glass WebGPU Display
 *
 * WebGPU-backed Three.js point-cloud display for Looking Glass Portrait.
 */

import { LookingGlassWebXRPolyfill } from "@lookingglass/webxr/dist/bundle/webxr.js"

import {
	AdditiveBlending,
	AmbientLight,
	BufferGeometry,
	Color,
	DoubleSide,
	Float32BufferAttribute,
	Group,
	LineBasicMaterial,
	LineSegments,
	Mesh,
	MeshBasicMaterial,
	MeshLambertMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	PointLight,
	Points,
	PointsMaterial,
	ReinhardToneMapping,
	Scene,
	SRGBColorSpace,
	TextureLoader,
	WebGPURenderer
} from "three/src/Three.WebGPU.js"

import AbstractDisplay from "./display-abstract.js"
import { DISPLAY_LOOKING_GLASS_WEBGPU } from "./display-types.js"
import {
	DEFAULT_OPTIONS_DISPLAY_WEBGL,
	KEYPOINT_QUANTITY,
	UPDATE_FACE_BUTTON_AFTER_FRAMES
} from "../settings/options.displays.js"
import FACE_LANDMARKS_DATA from "../models/face-model-data.json"
import { arrangeFaceData, createFaceGeometryFromData } from "../models/avatar.js"
import { TAU } from "../maths/maths.js"
import {
	DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS,
	applyLookingGlassParticleMarch
} from "./looking-glass-particle-effects.js"
import {
	DEFAULT_WALL_OPTIONS,
	createWallDisplayOptions,
	createWalls,
	disposeWalls
} from "./walls.js"
import {
	DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES,
	disposeLookingGlassEmoticonParticles,
	updateLookingGlassEmoticonParticles
} from "./looking-glass-emoticon-particles.js"
import {
	centrePositionBuffer,
	getKeypointZoom,
	updateMouthNoteBursts
} from "./particle-coordinate-frame.js"
import {
	createLookingGlassXRToggleButton,
	destroyLookingGlassXRButtons,
	withLookingGlassXRCompatibility
} from "./looking-glass-xr.js"

import PARTICLE_URI from "url:../assets/particles/particle.png"

const LOOKING_GLASS_PORTRAIT_WIDTH = 480
const LOOKING_GLASS_PORTRAIT_HEIGHT = 720
const VIEW_CONE_ANGLE = TAU / 6
const VERTICAL_VIEW_CONE_ANGLE = TAU / 32
const TLC = 61 * 3
const BLC = 308 * 3

let openXRButton = null
let hasXRBeenPolyfilled = false
let lookingGlassWebXR = null

const DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU = {
	...DEFAULT_OPTIONS_DISPLAY_WEBGL,
	...DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS,
	...DEFAULT_WALL_OPTIONS,
	...createWallDisplayOptions(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT, {
		wallAttachToCamera: false,
		wallFrontZ: -1.35,
		wallHeight: 8.4,
		wallDepthMultiplier: 4.8,
		wallBackScale: 0.72
	}),
	...DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES,
	webgpuParticlePhysics: true,
	webgpuParticleGravity: 7.2,
	webgpuParticleArrivalSpring: 96,
	webgpuParticleArrivalDamping: 8.5,
	webgpuParticleArrivalKick: 12.5,
	webgpuParticleArrivalSpread: 1.15,
	webgpuParticleSettleDistance: 0.022,
	webgpuParticleSettleVelocity: 0.055,
	controls: "#shared-controls",
	fx: false,
	mouse: false,
	resize: false,
	updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
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

const getPredictionPoints = prediction => {
	return prediction?.keypoints ?? prediction?.faceLandmarks ?? prediction?.landmarks ?? []
}

export const requiredXRSetupForLookingGlass = () => {
	if (!hasXRBeenPolyfilled) {
		hasXRBeenPolyfilled = true
		lookingGlassWebXR = new LookingGlassWebXRPolyfill({
			tileHeight: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.tileHeight,
			numViews: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.numViews,
			depthiness: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.depthiness,
			targetX: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetX,
			targetY: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetY,
			targetZ: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetZ,
			targetDiam: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.targetDiam,
			fovy: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.fovy,
			inlineView: DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU.inlineView
		})
	}
	return lookingGlassWebXR
}

export const createXRToggleButton = (renderer, destination) => {
	destroyLookingGlassXRButtons(openXRButton, renderer)
	openXRButton = createLookingGlassXRToggleButton(renderer, destination)
	openXRButton.setAttribute("type", "button")
	return openXRButton
}

export default class DisplayLookingGlassWebGPU extends AbstractDisplay {
	name = DISPLAY_LOOKING_GLASS_WEBGPU

	get type() {
		return DISPLAY_LOOKING_GLASS_WEBGPU
	}

	get depth() {
		return 100
	}

	renderer = null
	scene = null
	camera = null
	particles = null
	particlesGroup = null
	texture = null
	mouseX = 0
	mouseY = 0
	windowHalfX = 0
	windowHalfY = 0
	isButtonFullSize = false
	isRendering = false
	walls = null
	lookingGlassEmoticonState = null
	faceWasDrawnThisFrame = false
	lastFaceZoom = 3.14
	lastFaceCenter = { x: 0, y: 0, z: 0 }
	particlePhysics = {
		mode: "falling",
		lastTime: 0,
		positions: null,
		velocities: null,
		targetPositions: null,
		targetScales: null,
		randoms: null,
		frictions: null
	}

	originalCanvasSize = {
		width: 0,
		height: 0
	}

	constructor(canvas, initialWidth = LOOKING_GLASS_PORTRAIT_WIDTH, initialHeight = LOOKING_GLASS_PORTRAIT_HEIGHT, options = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU) {
		options = { ...DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU, ...options }
		super(canvas, initialWidth, initialHeight, options)

		this.originalCanvasSize.width = initialWidth
		this.originalCanvasSize.height = initialHeight

		this.create(options.quantity, options).then(() => {
			this.loadComplete("ready")
		}).catch(error => {
			console.error("ERROR loading Looking Glass WebGPU display", error)
			this.loadFailed(error)
		})
	}

	setAnimationLoop(callback) {
		return this.renderer?.setAnimationLoop(callback)
	}

	cancelAnimationLoop() {
		this.renderer?.setAnimationLoop(null)
	}

	async create(keypointQuantity = KEYPOINT_QUANTITY * 3, options = {}) {
		if (!navigator.gpu) {
			throw new Error("WebGPU not supported in this browser")
		}

		if (options.lookingGlassWebXR) {
			this.lookingGlassWebXR = typeof options.lookingGlassWebXR === "function"
				? options.lookingGlassWebXR()
				: options.lookingGlassWebXR
		}

		const scene = new Scene()
		const ambientLight = new AmbientLight(options.lightColour, options.lightIntensity)
		scene.add(ambientLight)

		const renderer = await withLookingGlassXRCompatibility(async () => {
			const compatibleRenderer = new WebGPURenderer({
				canvas: this.canvas,
				antialias: options.antialias,
				alpha: options.alpha,
				forceWebGL: true
			})
			compatibleRenderer.setPixelRatio(window.devicePixelRatio)
			compatibleRenderer.setSize(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)
			compatibleRenderer.setClearColor(new Color(0x000000), 0)
			compatibleRenderer.outputColorSpace = SRGBColorSpace
			compatibleRenderer.toneMapping = ReinhardToneMapping
			compatibleRenderer.xr.enabled = true
			await compatibleRenderer.init()
			return compatibleRenderer
		})

		const camera = new PerspectiveCamera(50, LOOKING_GLASS_PORTRAIT_WIDTH / LOOKING_GLASS_PORTRAIT_HEIGHT)
		camera.lookAt(scene.position)
		const walls = createWalls({
			Group,
			Mesh,
			MeshBasicMaterial,
			MeshLambertMaterial,
			PlaneGeometry,
			PointLight,
			LineBasicMaterial,
			LineSegments,
			BufferGeometry,
			Float32BufferAttribute,
			DoubleSide
		}, options, camera)
		if (walls)
		{
			if (options.wallAttachToCamera)
			{
				camera.add(walls)
				scene.add(camera)
			}
			else
			{
				scene.add(walls)
			}
		}

		const { keypoints } = FACE_LANDMARKS_DATA["0"]
		const geometry = createFaceGeometryFromData(
			keypoints,
			keypointQuantity,
			1,
			options.geometrySubdivisions
		)
		centrePositionBuffer(geometry.attributes.position.array)
		const { particles, texture } = await this.createParticles(
			geometry,
			options.particeSize,
			options.colour,
			options.opacity
		)
		const particlesGroup = new Group()
		particlesGroup.add(particles)
		scene.add(particlesGroup)

		this.scene = scene
		this.renderer = renderer
		this.camera = camera
		this.ambientLight = ambientLight
		this.particles = particles
		this.particlesGroup = particlesGroup
		this.texture = texture
		this.walls = walls

		if (options.mouse) {
			this.mouseMoveProxy = this.onPointerMove.bind(this)
			document.body.addEventListener("pointermove", this.mouseMoveProxy)
		}

		const controls = this.options.controls
			? document.querySelector(this.options.controls)
			: document.body.appendChild(document.createElement("div"))

		createXRToggleButton(this.renderer, controls ?? document.body)

		this.available = true
		console.info("Looking Glass WebGPU Display START", options, { scene, renderer, camera })
		return true
	}

	async createParticles(geometry, size = 0.03, color = 0xefefef88, opacity = 1) {
		return new Promise((resolve, reject) => {
			const loader = new TextureLoader()
			loader.load(PARTICLE_URI, texture => {
				texture.colorSpace = SRGBColorSpace
				const particlesMaterial = new PointsMaterial({
					map: texture,
					color,
					size,
					blending: AdditiveBlending,
					sizeAttenuation: true,
					transparent: true,
					opacity,
					depthTest: true,
					vertexColors: Boolean(geometry.attributes.color)
				})
				resolve({
					particles: new Points(geometry, particlesMaterial),
					particlesMaterial,
					texture
				})
			}, undefined, error => {
				reject(new Error("Couldn't load particle texture " + error))
			})
		})
	}

	onGeometrySubdivisionsChanged(){
		if (!this.particles)
		{
			return
		}

		const { keypoints } = FACE_LANDMARKS_DATA["0"]
		const geometry = createFaceGeometryFromData(
			keypoints,
			this.options.quantity ?? KEYPOINT_QUANTITY * 3,
			1,
			this.options.geometrySubdivisions ?? 0
		)
		centrePositionBuffer(geometry.attributes.position.array)
		const previousGeometry = this.particles.geometry
		this.particles.geometry = geometry
		previousGeometry?.dispose()
		this.resetParticlePhysics()
	}

	arrangeParticles(data, scaleFactor = 1, centralise = false) {
		if (!this.particles) {
			return data
		}

		const keypoints = getPredictionPoints(data)
		if (!keypoints.length) {
			return data
		}

		const zoom = getKeypointZoom(keypoints, this.lastFaceZoom) * scaleFactor
		const positions = this.particles.geometry.attributes.position.array
		const scales = this.particles.geometry.attributes.scale.array
		const physics = this.ensureParticlePhysics()

		if (this.options.webgpuParticlePhysics === false || !physics)
		{
			arrangeFaceData(keypoints, positions, scales, zoom, this.options.geometrySubdivisions ?? 0)
			this.lastFaceCenter = centrePositionBuffer(positions)
			applyLookingGlassParticleMarch(this.particles.geometry, this.count, this.options)
		}
		else
		{
			arrangeFaceData(keypoints, physics.targetPositions, physics.targetScales, zoom, this.options.geometrySubdivisions ?? 0)
			this.lastFaceCenter = centrePositionBuffer(physics.targetPositions)
			this.updateParticlePhysicsWithFace()
		}
		this.lastFaceZoom = zoom

		if (centralise) {
			this.lastFaceCenter = centrePositionBuffer(positions)
		}
		this.particles.geometry.attributes.position.needsUpdate = true
		this.particles.geometry.attributes.scale.needsUpdate = true

		return data
	}

	ensureParticlePhysics() {
		if (!this.particles?.geometry?.attributes?.position)
		{
			return null
		}

		const positions = this.particles.geometry.attributes.position.array
		const particleCount = positions.length / 3
		const physics = this.particlePhysics

		if (physics.positions?.length === positions.length)
		{
			return physics
		}

		physics.mode = "falling"
		physics.lastTime = performance.now()
		physics.positions = new Float32Array(positions.length)
		physics.velocities = new Float32Array(positions.length)
		physics.targetPositions = new Float32Array(positions.length)
		physics.targetScales = new Float32Array(particleCount)
		physics.randoms = new Float32Array(particleCount)
		physics.frictions = new Float32Array(particleCount)
		physics.positions.set(positions)

		for (let i = 0; i < particleCount; i++)
		{
			physics.randoms[i] = Math.random()
			physics.frictions[i] = 0.82 + Math.random() * 0.14
			physics.velocities[i * 3] = (Math.random() - 0.5) * 0.4
			physics.velocities[i * 3 + 1] = -Math.random() * 0.5
			physics.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3
		}

		return physics
	}

	resetParticlePhysics() {
		this.particlePhysics = {
			mode: "falling",
			lastTime: performance.now(),
			positions: null,
			velocities: null,
			targetPositions: null,
			targetScales: null,
			randoms: null,
			frictions: null
		}
		this.lastFaceZoom = 3.14
		this.lastFaceCenter = { x: 0, y: 0, z: 0 }
	}

	getParticlePhysicsDelta() {
		const physics = this.ensureParticlePhysics()
		if (!physics)
		{
			return 1 / 60
		}

		const now = performance.now()
		const delta = physics.lastTime ? (now - physics.lastTime) / 1000 : 1 / 60
		physics.lastTime = now
		return Math.max(1 / 120, Math.min(delta, 1 / 20))
	}

	beginParticleArrival() {
		const physics = this.ensureParticlePhysics()
		if (!physics || !this.particles)
		{
			return
		}

		const positions = this.particles.geometry.attributes.position.array
		const particleCount = positions.length / 3
		const arrivalKick = this.options.webgpuParticleArrivalKick ?? 12.5
		const spread = this.options.webgpuParticleArrivalSpread ?? 1.15

		for (let i = 0; i < particleCount; i++)
		{
			const index = i * 3
			const random = physics.randoms[i] ?? Math.random()
			const side = random > 0.5 ? 1 : -1

			physics.positions[index] = Number.isFinite(positions[index]) ? positions[index] : physics.targetPositions[index]
			physics.positions[index + 1] = Math.max(positions[index + 1] || 0, spread + random * spread)
			physics.positions[index + 2] = (positions[index + 2] || 0) + (random - 0.5) * spread
			physics.velocities[index] = side * (0.7 + random * 1.8)
			physics.velocities[index + 1] = -arrivalKick * (0.7 + random * 0.6)
			physics.velocities[index + 2] = (random - 0.5) * 2.5
		}

		physics.mode = "arriving"
	}

	updateParticlePhysicsWithFace() {
		const physics = this.ensureParticlePhysics()
		if (!physics || !this.particles)
		{
			return
		}

		if (physics.mode !== "arriving" && physics.mode !== "settled")
		{
			this.beginParticleArrival()
		}

		const positions = this.particles.geometry.attributes.position.array
		const scales = this.particles.geometry.attributes.scale.array

		if (physics.mode === "settled")
		{
			positions.set(physics.targetPositions)
			scales.set(physics.targetScales)
			applyLookingGlassParticleMarch(this.particles.geometry, this.count, this.options)
			return
		}

		const delta = this.getParticlePhysicsDelta()
		const spring = this.options.webgpuParticleArrivalSpring ?? 96
		const damping = this.options.webgpuParticleArrivalDamping ?? 8.5
		const settleDistance = this.options.webgpuParticleSettleDistance ?? 0.022
		const settleVelocity = this.options.webgpuParticleSettleVelocity ?? 0.055
		const particleCount = positions.length / 3
		let unsettled = 0

		for (let i = 0; i < particleCount; i++)
		{
			const index = i * 3
			const random = physics.randoms[i] ?? 0
			const friction = physics.frictions?.[i] ?? 0.9
			const drag = Math.pow(friction, delta * 60)
			const particleDamping = damping * (0.75 + (1 - friction) * 2.2)
			let distanceSquared = 0
			let velocitySquared = 0

			for (let axis = 0; axis < 3; axis++)
			{
				const positionIndex = index + axis
				const target = physics.targetPositions[positionIndex]
				const offset = target - physics.positions[positionIndex]
				const axisSpring = spring * (axis === 1 ? 1.12 : 1)
				const overArc = axis === 1 ? Math.sin((this.count * 0.18) + random * TAU) * 0.055 * Math.max(0, offset) : 0
				const acceleration = (offset + overArc) * axisSpring - physics.velocities[positionIndex] * particleDamping

				physics.velocities[positionIndex] += acceleration * delta
				physics.velocities[positionIndex] *= drag
				physics.positions[positionIndex] += physics.velocities[positionIndex] * delta
				distanceSquared += offset * offset
				velocitySquared += physics.velocities[positionIndex] * physics.velocities[positionIndex]
				positions[positionIndex] = physics.positions[positionIndex]
			}

			scales[i] = physics.targetScales[i] * (1 + Math.min(1.5, Math.sqrt(velocitySquared) * 0.08))

			if (distanceSquared > settleDistance * settleDistance || velocitySquared > settleVelocity * settleVelocity)
			{
				unsettled++
			}
		}

		if (unsettled === 0)
		{
			physics.mode = "settled"
			positions.set(physics.targetPositions)
			scales.set(physics.targetScales)
			applyLookingGlassParticleMarch(this.particles.geometry, this.count, this.options)
		}
	}

	updateParticlePhysicsWithoutFace() {
		const physics = this.ensureParticlePhysics()
		if (!physics || !this.particles || this.options.webgpuParticlePhysics === false)
		{
			return
		}

		const positions = this.particles.geometry.attributes.position.array
		const scales = this.particles.geometry.attributes.scale.array
		const delta = this.getParticlePhysicsDelta()
		const gravity = this.options.webgpuParticleGravity ?? 7.2
		const particleCount = positions.length / 3

		if (physics.mode === "settled" || physics.mode === "arriving")
		{
			physics.positions.set(positions)
		}

		physics.mode = "falling"

		for (let i = 0; i < particleCount; i++)
		{
			const index = i * 3
			const random = physics.randoms[i] ?? 0
			const friction = physics.frictions?.[i] ?? 0.9
			const drag = Math.pow(friction, delta * 60)
			physics.velocities[index] += Math.sin((this.count * 0.045) + random * TAU) * delta * 0.35
			physics.velocities[index + 1] += gravity * delta
			physics.velocities[index + 2] += Math.cos((this.count * 0.04) + random * TAU) * delta * 0.28
			physics.velocities[index] *= drag
			physics.velocities[index + 1] *= drag
			physics.velocities[index + 2] *= drag

			physics.positions[index] += physics.velocities[index] * delta
			physics.positions[index + 1] += physics.velocities[index + 1] * delta
			physics.positions[index + 2] += physics.velocities[index + 2] * delta

			positions[index] = physics.positions[index]
			positions[index + 1] = physics.positions[index + 1]
			positions[index + 2] = physics.positions[index + 2]
			scales[i] = Math.max(0.25, scales[i] * 0.985)
		}

		this.particles.geometry.attributes.position.needsUpdate = true
		this.particles.geometry.attributes.scale.needsUpdate = true
	}

	drawPerson(person, beatJustPlayed, colours, options = DEFAULT_OPTIONS_DISPLAY_LOOKING_GLASS_WEBGPU) {
		if (this.available === false || !this.particles) {
			return
		}

		const prediction = person.data
		if (!prediction || !getPredictionPoints(prediction).length) {
			return
		}
		this.faceWasDrawnThisFrame = true

		if (this.count % this.options.updateFaceButtonAfter === 0) {
			this.movePersonButton(person, prediction)
		}

		const hue = Math.abs((person.hue ?? 0) / 360)
		this.particles.rotation.x = (this.mouseY * VERTICAL_VIEW_CONE_ANGLE) + Math.PI
		this.particles.rotation.y = -(this.mouseX * VIEW_CONE_ANGLE)
		this.arrangeParticles(prediction, 1)
		updateMouthNoteBursts({
			host:this,
			positions:this.particles.geometry.attributes.position.array,
			scales:this.particles.geometry.attributes.scale?.array,
			topLipIndex:TLC,
			bottomLipIndex:BLC,
			beatJustPlayed,
			count:this.count,
			distance:1.9
		})
		this.particles.geometry.attributes.position.needsUpdate = true
		this.particles.geometry.attributes.scale.needsUpdate = true

		if (this.particles.material) {
			const saturation = colours?.s ? colours.s / 100 : 0.6
			const lightness = colours?.l ? colours.l / 100 : prediction.isMouthOpen ? 0.9 : 0.6
			this.particles.material.color.setHSL(hue, saturation, lightness)
			this.particles.material.opacity = colours?.a ?? this.options.opacity
		}
		this.drawPersonEmoticonParticles(person)
	}

	drawPersonEmoticonParticles(person) {
		const prediction = person?.data
		if (!this.particles || !prediction || !person?.emoticon)
		{
			return
		}

		this.drawEmoticon(
			0,
			0,
			person.emoticon,
			((prediction.roll ?? 0) * Math.PI * 0.28) - (Math.PI * 0.5),
			0.8 + (1 - Math.abs(prediction.pitch ?? 0)) * 0.2,
			0.75 + (1 - Math.abs(prediction.yaw ?? 0)) * 0.25,
			person.noteIndex,
			person.quantityOfPlayableNotes,
			false
		)
	}

	movePersonButton(person, prediction) {
		if (!this.isButtonFullSize) {
			person.moveButton(0, 0, LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)
			this.isButtonFullSize = true
		}
	}

	async render() {
		if (!this.renderer || !this.scene || !this.camera || this.isRendering) {
			return
		}

		this.isRendering = true
		try {
			if (!this.faceWasDrawnThisFrame)
			{
				this.updateParticlePhysicsWithoutFace()
			}
			await this.renderer.renderAsync(this.scene, this.camera)
			this.count = (this.count + 1) % 1024
			super.render()
		} finally {
			this.faceWasDrawnThisFrame = false
			this.isRendering = false
		}
	}

	clear() {}
	async addFX() {}

	drawText() {}
	drawParagraph() {}
	drawEmoticon(x, y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false) {
		updateLookingGlassEmoticonParticles(this, {
			Group,
			BufferGeometry,
			Float32BufferAttribute,
			Points,
			PointsMaterial
		}, {
			emoji,
			rotationZ,
			rotationY,
			rotationX,
			activeCircleIndex,
			numberOfNotesInKey,
			flipX
		})
	}
	drawBars() {}
	drawVisualiser() {}
	drawInstrument() {}
	setFilter() {}
	nextFilter() {}
	resetFilter() {}
	postProcess() {}

	takePhotograph(type = "image/png") {
		return this.canvas.toDataURL(type)
	}

	onPointerMove(event) {
		if (!event || event.isPrimary === false) return
		this.mouseX = (event.clientX - this.windowHalfX) / this.windowHalfX
		this.mouseY = (event.clientY - this.windowHalfY) / this.windowHalfY
	}

	onResize() {
		this.windowHalfX = window.innerWidth * 0.5
		this.windowHalfY = window.innerHeight * 0.5
		this.renderer?.setSize(LOOKING_GLASS_PORTRAIT_WIDTH, LOOKING_GLASS_PORTRAIT_HEIGHT)
		if (this.camera) {
			this.camera.aspect = LOOKING_GLASS_PORTRAIT_WIDTH / LOOKING_GLASS_PORTRAIT_HEIGHT
			this.camera.updateProjectionMatrix()
		}
	}

	async destroy() {
		this.cancelAnimationLoop()

		if (this.mouseMoveProxy) {
			document.body.removeEventListener("pointermove", this.mouseMoveProxy)
		}

		await destroyLookingGlassXRButtons(openXRButton, this.renderer)
		openXRButton = null

		if (this.particles) {
			this.particlesGroup?.remove(this.particles)
			this.particles.geometry?.dispose?.()
			this.particles.material?.dispose?.()
		}
		if (this.particlesGroup) {
			this.scene?.remove(this.particlesGroup)
		}
		if (this.walls) {
			this.scene?.remove(this.walls)
			disposeWalls(this.walls)
		}
		disposeLookingGlassEmoticonParticles(this)

		this.texture?.dispose()
		this.renderer?.setSize(this.originalCanvasSize.width, this.originalCanvasSize.height)
		this.renderer?.dispose()
		this.scene?.clear()

		this.scene = null
		this.renderer = null
		this.camera = null
		this.particles = null
		this.particlesGroup = null
		this.texture = null
		this.walls = null
		this.available = false

		return super.destroy()
	}
}
