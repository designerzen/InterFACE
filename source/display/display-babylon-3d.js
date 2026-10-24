import AbstractDisplay from './display-abstract.js'
import { DISPLAY_BABYLON_3D } from './display-types.js'
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from '../settings/options.displays.js'
import { subdivideKeypoints } from '../models/keypoint-subdivision.js'
import { getDisplayColourAlpha, getPredictionLandmarks } from './display-landmarks.js'
import { applyWebGPUParticleMarch } from './webgpu-particle-motion.js'
import * as BABYLON from '@babylonjs/core'

/** One thin-instance mesh per player, rather than one mesh per landmark. */
export default class DisplayBabylon3D extends AbstractDisplay {
	name = DISPLAY_BABYLON_3D
	transparentCanvas = true
	people = new Map()
	engine = null
	scene = null
	camera = null
	get type(){ return DISPLAY_BABYLON_3D }

	constructor(canvas, width, height, options = {}){
		super(canvas, width, height, {
			resize: true, updateFaceButtonAfter: UPDATE_FACE_BUTTON_AFTER_FRAMES,
			particleSize: 2, geometrySubdivisions: 0, ...options
		})
		this.create().then(() => this.loadComplete('ready')).catch(error => this.loadFailed(error))
	}
	async create(){
		this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, premultipliedAlpha: false })
		this.engine.setHardwareScalingLevel(1)
		this.scene = new BABYLON.Scene(this.engine)
		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)
		this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(this.width / 2, this.height / 2, -1000), this.scene)
		this.camera.setTarget(new BABYLON.Vector3(this.width / 2, this.height / 2, 0))
		this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
		this.camera.minZ = 0.1
		this.camera.maxZ = 10000
		this.onResize(this.width, this.height)
		this.onWindowResizeHandler = () => this.onResize(this.width, this.height)
		window.addEventListener('resize', this.onWindowResizeHandler)
		this.available = true
	}
	onResize(width, height){
		if (!this.camera) return
		this.camera.position.x = width / 2
		this.camera.position.y = height / 2
		this.camera.setTarget(new BABYLON.Vector3(width / 2, height / 2, 0))
		this.camera.orthoLeft = -width / 2
		this.camera.orthoRight = width / 2
		this.camera.orthoTop = height / 2
		this.camera.orthoBottom = -height / 2
		// The stage owns drawing-buffer dimensions; CSS may scale the canvas.
		this.engine.setSize(width, height)
	}
	createPerson(person, count){
		const mesh = BABYLON.MeshBuilder.CreateSphere('face-particles', { diameter: 1, segments: 4 }, this.scene)
		const material = new BABYLON.StandardMaterial('face-colour', this.scene)
		material.disableLighting = true
		material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND
		mesh.material = material
		mesh.alwaysSelectAsActiveMesh = true
		const matrices = new Float32Array(count * 16)
		for (let i = 0; i < count; i++) {
			for (const diagonal of [0, 5, 10, 15]) matrices[i * 16 + diagonal] = 1
		}
		mesh.thinInstanceSetBuffer('matrix', matrices, 16, false)
		const state = { mesh, material, matrices, positions: new Float32Array(count * 3), animated: new Float32Array(count * 3), seen: true, initialized: false }
		this.people.set(person, state)
		return state
	}
	drawPerson(person, beatJustPlayed, colours = {}, options = {}){
		if (!this.available) return
		const settings = { ...this.options, ...person.options, ...options }
		const landmarks = getPredictionLandmarks(person.data)
		if (!landmarks.length || settings.drawMask === false) return
		if (this.count % this.options.updateFaceButtonAfter === 0) this.movePersonButton(person, person.data)
		const points = settings.geometrySubdivisions > 0 ? subdivideKeypoints(landmarks, settings.geometrySubdivisions) : landmarks
		let state = this.people.get(person)
		if (state && state.matrices.length !== points.length * 16) {
			this.disposePerson(person)
			state = null
		}
		state ??= this.createPerson(person, points.length)
		state.seen = true
		state.mesh.setEnabled(true)
		const smoothing = state.initialized ? Math.min(1, Math.max(0.01, settings.particleSmoothing ?? 0.4)) : 1
		for (let i = 0; i < points.length; i++) {
			const p = i * 3
			state.positions[p] += (points[i].x * this.width - state.positions[p]) * smoothing
			state.positions[p + 1] += ((1 - points[i].y) * this.height - state.positions[p + 1]) * smoothing
			state.positions[p + 2] += ((points[i].z ?? 0) * 100 - state.positions[p + 2]) * smoothing
		}
		state.initialized = true
		const animated = state.animated
		animated.set(state.positions)
		applyWebGPUParticleMarch({ positions: animated, frame: this.count, options: settings, dimensions: 3 })
		const size = settings.particleSize ?? 2
		for (let i = 0; i < points.length; i++) {
			const m = i * 16, p = i * 3
			state.matrices[m] = size
			state.matrices[m + 5] = size
			state.matrices[m + 10] = size
			state.matrices[m + 15] = 1
			state.matrices[m + 12] = animated[p]
			state.matrices[m + 13] = animated[p + 1]
			state.matrices[m + 14] = animated[p + 2]
		}
		state.mesh.thinInstanceBufferUpdated('matrix')
		state.mesh.thinInstanceRefreshBoundingInfo()
		// Match the HSL palette used by the other renderers.
		const h = ((colours.h ?? person.hue ?? 0) % 360 + 360) % 360 / 360
		const s = (colours.s ?? 100) / 100, l = (colours.l ?? 50) / 100
		const channel = n => { const k = (n + h * 12) % 12; return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)) }
		state.material.emissiveColor.set(channel(0), channel(8), channel(4))
		state.material.alpha = getDisplayColourAlpha(colours, settings)
	}
	clear(){
		super.clear()
		for (const state of this.people.values()) state.mesh.setEnabled(false)
	}
	render(){
		for (const [person, state] of this.people) {
			if (!state.seen) this.disposePerson(person)
			else state.seen = false
		}
		this.scene?.render()
		this.count++
		super.render()
	}
	disposePerson(person){
		const state = this.people.get(person)
		state?.mesh.dispose()
		state?.material.dispose()
		this.people.delete(person)
	}
	takePhotograph(type = 'image/png'){ return this.canvas.toDataURL(type) }
	async destroy(){
		this.available = false
		if (this.onWindowResizeHandler) window.removeEventListener('resize', this.onWindowResizeHandler)
		for (const person of this.people.keys()) this.disposePerson(person)
		this.scene?.dispose()
		this.engine?.dispose()
		this.scene = this.engine = this.camera = null
		await super.destroy()
	}
}
