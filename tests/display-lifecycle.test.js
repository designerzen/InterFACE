jest.mock('../source/models/avatar.js', () => ({ subdivideKeypoints: points => points }))
jest.mock('../source/hardware/looking-glass-portrait.js', () => ({ howManyHolographicDisplaysAreConnected: jest.fn() }))
jest.mock('three', () => {
	class Scene { add(){} remove(){} }
	class Color {
		constructor(r, g, b){ this.setRGB(r, g, b) }
		setRGB(r, g, b){ Object.assign(this, { r, g, b }) }
	}
	class BufferGeometry {
		attributes = {}
		setAttribute(key, value){ this.attributes[key] = value }
		dispose(){}
	}
	class BufferAttribute { constructor(array){ this.array = array } }
	class PointsMaterial { constructor(options){ Object.assign(this, options) } dispose(){} }
	class Points { constructor(geometry, material){ Object.assign(this, { geometry, material }) } }
	return { Scene, Color, BufferGeometry, BufferAttribute, PointsMaterial, Points }
})
jest.mock('../source/display/display-manager.js', () => ({
	...jest.requireActual('../source/display/display-manager.js'),
	createDisplay: jest.fn()
}))
jest.mock('@babylonjs/core', () => {
	class Vector3 { constructor(x, y, z){ Object.assign(this, { x, y, z }) } }
	class Engine { setHardwareScalingLevel(){} setSize(){} dispose(){} }
	class Scene { constructor(){ this.render = jest.fn(); this.dispose = jest.fn() } }
	class Camera { constructor(name, position){ this.position = position } setTarget(){} }
	class Material { constructor(){ this.dispose = jest.fn(); this.emissiveColor = { set: jest.fn() } } }
	class Color3 { static FromHSV(){ return { set: jest.fn() } } }
	return {
		Engine, Scene, Vector3, FreeCamera: Camera, Camera: { ORTHOGRAPHIC_CAMERA: 1 },
		StandardMaterial: Material, Material: { MATERIAL_ALPHABLEND: 2 }, Color3,
		Color4: class {}, MeshBuilder: { CreateSphere: jest.fn(() => ({
			thinInstanceSetBuffer: jest.fn(), thinInstanceBufferUpdated: jest.fn(),
			thinInstanceRefreshBoundingInfo: jest.fn(),
			setEnabled: jest.fn(), dispose: jest.fn()
		})) }
	}
})

import DisplayComposite from '../source/display/display-composite.js'
import DisplayBabylon3D from '../source/display/display-babylon-3d.js'
import DisplayWebGPU from '../source/display/display-webgpu-direct.js'
import DisplayThree from '../source/display/display-three-webgpu-particle.js'
import { Scene } from 'three'
import { createDisplay } from '../source/display/display-manager.js'
import { getDisplayColourAlpha } from '../source/display/display-landmarks.js'
import { getCompositeViewports } from '../source/display/composite-layout.js'
import { howManyHolographicDisplaysAreConnected } from '../source/hardware/looking-glass-portrait.js'

const manager = jest.requireActual('../source/display/display-manager.js')
const canvas = () => {
	const element = document.createElement('canvas')
	document.body.append(element)
	return element
}
const context = element => ({ canvas: element, clearRect: jest.fn(), drawImage: jest.fn() })
const person = x => ({ data: { faceLandmarks: [{ x, y: .5, z: 0 }] }, options: {}, hue: 90 })

beforeEach(() => {
	document.body.innerHTML = ''
	jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function(type){
		if (type === 'webgl2') return null
		return this.context ??= context(this)
	})
	createDisplay.mockReset()
	howManyHolographicDisplaysAreConnected.mockReset().mockResolvedValue(0)
})
afterEach(() => jest.restoreAllMocks())

test('Composite layers independent canvases, forwards drawing and resizes, and disposes every child', async () => {
	const children = []
	createDisplay.mockImplementation(async element => {
		const child = {
			canvas: element, cancelAnimationLoop: jest.fn(), setSize: jest.fn(),
			drawPerson: jest.fn(), drawVisualiser: jest.fn(), render: jest.fn(),
			setGeometrySubdivisions: jest.fn(), destroy: jest.fn(async () => {})
		}
		children.push(child)
		return child
	})
	const display = new DisplayComposite(canvas(), 640, 480, { displays: ['DisplayCanvas2D', 'DisplayMediaVision2D'] })
	await display.loading
	expect(new Set(children.map(child => child.canvas)).size).toBe(2)
	expect(display.childContainer.hidden).toBe(true)
	display.drawPerson('player', true, {})
	display.drawVisualiser('audio', 1, 'vu')
	display.setGeometrySubdivisions(2)
	display.setSize(320, 240)
	display.render()
	for (const child of children) {
		expect(child.drawPerson).toHaveBeenCalledWith('player', true, {})
		expect(child.drawVisualiser).toHaveBeenCalledWith('audio', 1, 'vu')
		expect(child.setSize).toHaveBeenLastCalledWith(320, 240)
		expect(child.setGeometrySubdivisions).toHaveBeenCalledWith(2, 'manual')
	}
	expect(display.canvasContext.drawImage.mock.calls.map(call => call[0])).toEqual([...children.map(child => child.canvas), display.particleCanvas])
	await display.destroy()
	for (const child of children) expect(child.destroy).toHaveBeenCalledTimes(1)
	expect(document.querySelectorAll('canvas')).toHaveLength(1)
})

test('empty Composite remains usable and rejects recursive or shared-canvas children', async () => {
	const display = new DisplayComposite(canvas(), 640, 480, { displays: [] })
	await display.loading
	expect(display.width).toBe(640)
	expect(display.firstDisplay).toBeNull()
	display.clear()
	display.render()
	await expect(display.addDisplay(display)).rejects.toThrow()
	await expect(display.addDisplay({ canvas: display.canvas })).rejects.toThrow()
	await display.destroy()
})

test('Composite cleans earlier children and canvases when a later child fails', async () => {
	const destroy = jest.fn(async () => {})
	createDisplay.mockImplementationOnce(async element => ({ canvas: element, cancelAnimationLoop(){}, setSize(){}, destroy }))
	createDisplay.mockRejectedValueOnce(new Error('GPU startup failed'))
	const display = new DisplayComposite(canvas(), 640, 480, { displays: ['DisplayCanvas2D', 'DisplayMediaVision2D'] })
	await expect(display.loading).rejects.toThrow('GPU startup failed')
	expect(destroy).toHaveBeenCalledTimes(1)
	expect(document.querySelectorAll('canvas')).toHaveLength(1)
	await display.destroy()
})

test('display availability excludes missing GPU backends and duplicate compatibility presets', () => {
	Object.defineProperty(navigator, 'gpu', { value: undefined, configurable: true })
	const available = manager.getAvailableDisplays(true)
	expect(available).toContain('DisplayComposite')
	expect(available).not.toContain('DisplayWebGPU3D')
	expect(available).not.toContain('DisplayWebGL3D')
	expect(available).not.toContain('DisplayMediaPipe2D')
	expect(available).not.toContain('DisplayLookingGlass3DWebGPUTSL')
	expect(available).not.toContain('DisplayLookingGlass3D')
})

test('saved Looking Glass IDs all resolve to the single Portrait renderer', () => {
	for (const type of ['DisplayLookingGlass3D', 'DisplayLookingGlass3DWebGPUTSL', 'DisplayLookingGlassWebGPU', 'DISPLAY_LOOKING_GLASS_3D']) {
		expect(manager.normalizeDisplayType(type)).toBe('DisplayLookingGlassWebGPU')
	}
})

test.each([1, 2])('discovery of %i Portraits takes priority over any saved renderer', async count => {
	HTMLCanvasElement.prototype.getContext.mockImplementation(type => type === 'webgl2' ? { getExtension: () => null } : null)
	howManyHolographicDisplaysAreConnected.mockResolvedValue(count)
	for (const previous of ['DisplayCanvas2D', 'DisplayBabylon3D', 'DisplayComposite', 'DisplayLookingGlass3D']) {
		const result = await manager.getDisplaysInformation(previous)
		expect(result.holographicDisplayQuantity).toBe(count)
		expect(result.suggested).toBe('DisplayLookingGlassWebGPU')
		expect(result.available).toContain('DisplayLookingGlassWebGPU')
	}
})

test('startup waits for discovery and excludes Portrait output when none are found', async () => {
	let resolveProbe
	howManyHolographicDisplaysAreConnected.mockReturnValue(new Promise(resolve => { resolveProbe = resolve }))
	let finished = false
	const discovery = manager.getDisplaysInformation('DisplayCanvas2D').then(result => { finished = true; return result })
	await Promise.resolve()
	expect(finished).toBe(false)
	resolveProbe(0)
	const result = await discovery
	expect(result.suggested).toBe('DisplayCanvas2D')
	expect(result.available).not.toContain('DisplayLookingGlassWebGPU')
})

test('unavailable discovery service retains the normal display fallback', async () => {
	howManyHolographicDisplaysAreConnected.mockRejectedValue(new Error('Service unavailable'))
	const result = await manager.getDisplaysInformation('DisplayLookingGlassWebGPU')
	expect(result.holographicDisplayQuantity).toBe(0)
	expect(result.suggested).toBe('DisplayMediaVision2D')
})

test('startup reuses early discovery rather than probing the service again', async () => {
	HTMLCanvasElement.prototype.getContext.mockImplementation(type => type === 'webgl2' ? { getExtension: () => null } : null)
	const result = await manager.getDisplaysInformation('DisplayCanvas2D', undefined, { holographicDisplayQuantity: 1 })
	expect(howManyHolographicDisplaysAreConnected).not.toHaveBeenCalled()
	expect(result.suggested).toBe('DisplayLookingGlassWebGPU')
	const absent = await manager.getDisplaysInformation('DisplayCanvas2D', undefined, { holographicDisplayQuantity: 0 })
	expect(howManyHolographicDisplaysAreConnected).not.toHaveBeenCalled()
	expect(absent.suggested).toBe('DisplayCanvas2D')
})

test('Looking Glass compatibility renderer requires WebGL2 rather than navigator.gpu', () => {
	HTMLCanvasElement.prototype.getContext.mockImplementation(type => type === 'webgl2' ? { getExtension: () => null } : null)
	expect(manager.getAvailableDisplays(true)).toContain('DisplayLookingGlassWebGPU')
	expect(manager.getAvailableDisplays()).toContain('DisplayBabylon3D')
})

test('Babylon batches landmarks into a mesh per player and disposes missing players', async () => {
	const display = new DisplayBabylon3D(canvas(), 640, 480, { resize: false, updateFaceButtonAfter: Infinity })
	await display.loading
	display.count = 1
	const first = person(.2), second = person(.8)
	display.drawPerson(first, false, { h: 90, a: .4 })
	display.drawPerson(second, false, { h: 220 })
	const a = display.people.get(first), b = display.people.get(second)
	expect(a.mesh).not.toBe(b.mesh)
	expect(a.matrices[12]).toBeCloseTo(128)
	expect(b.matrices[12]).toBeCloseTo(512)
	expect(a.material.alpha).toBe(.4)
	display.render()
	display.drawPerson(second, false, { h: 220 })
	display.render()
	expect(a.mesh.dispose).toHaveBeenCalledTimes(1)
	expect(display.people.size).toBe(1)
	await display.destroy()
	expect(b.mesh.dispose).toHaveBeenCalledTimes(1)
})

test('Three particles keep independent geometry and colour for each player', () => {
	const display = Object.create(DisplayThree.prototype)
	Object.assign(display, { canvasWidth: 640, canvasHeight: 480, count: 1, people: new Map(), scene: new Scene(), options: { particleColour: { r: 1, g: 1, b: 1 }, particleSize: 2, updateFaceButtonAfter: Infinity } })
	const a = person(.2), b = person(.8)
	display.drawPerson(a, false, { h: 0 })
	display.drawPerson(b, false, { h: 180 })
	expect(display.people.get(a).positionBuffer.array[0]).toBeCloseTo(128)
	expect(display.people.get(b).positionBuffer.array[0]).toBeCloseTo(512)
	expect(display.people.get(a).particleMaterial.color).not.toEqual(display.people.get(b).particleMaterial.color)
})

test('WebGPU preserves previous players in a frame and clears the next frame', () => {
	const passes = []
	const display = Object.create(DisplayWebGPU.prototype)
	Object.assign(display, {
		available: true, count: 0, canvasWidth: 640, canvasHeight: 480, options: { dotSize: 2 },
		paint: { view: {}, clear: jest.fn(), present: jest.fn(), feedback: jest.fn() },
		pipeline: {}, uniformBuffer: {}, bindGroup: {}, vertexBuffer: {}, vertexBufferSize: 1024,
		context: { getCurrentTexture: () => ({ createView: () => ({}) }) },
		device: { queue: { writeBuffer(){}, submit(){} }, createCommandEncoder: () => ({
			beginRenderPass(desc){
				passes.push(desc.colorAttachments[0].loadOp)
				return { setPipeline(){}, setBindGroup(){}, setVertexBuffer(){}, draw(){}, end(){} }
			}, finish(){}
		}) }
	})
	display.drawLandmarks(new Float32Array([10, 10]), '#ffffffff')
	display.drawLandmarks(new Float32Array([20, 20]), '#ffffffff')
	display.render()
	display.drawLandmarks(new Float32Array([30, 30]), '#ffffffff')
	expect(passes).toEqual(['load', 'load', 'load'])
	expect(display.paint.clear).toHaveBeenCalledTimes(2)
	display.render()
	display.postProcess({ offsetX: 12, offsetY: -4 })
	display.drawLandmarks(new Float32Array([40, 40]), '#ffffffff')
	display.render()
	expect(display.paint.feedback).toHaveBeenCalledWith(12, -4)
	expect(display.paint.clear).toHaveBeenCalledTimes(2)
	expect(display.paint.present).toHaveBeenCalledTimes(3)
	display.clear()
	expect(display.paint.clear).toHaveBeenCalledTimes(3)
})

test('canvas alpha configuration does not override player opacity', () => {
	expect(getDisplayColourAlpha({ a: .3 }, { alpha: true })).toBe(.3)
	expect(getDisplayColourAlpha({}, { alpha: .5 })).toBe(.5)
	expect(getDisplayColourAlpha({ a: 4 })).toBe(1)
})

test('destroying Composite during initialization never leaves late child canvases', async () => {
	const display = new DisplayComposite(canvas(), 640, 480, { displays: ['DisplayCanvas2D'] })
	await display.destroy()
	await display.loading
	expect(display.available).toBe(false)
	expect(document.querySelectorAll('canvas')).toHaveLength(1)
	expect(createDisplay).not.toHaveBeenCalled()
})

test('WebGPU rebuilds its resources after device loss and releases the replacement on destroy', async () => {
	let lose
	const lost = new Promise(resolve => { lose = resolve })
	const first = { lost, destroy: jest.fn() }
	const second = { lost: new Promise(() => {}), destroy: jest.fn() }
	const requestDevice = jest.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(second)
	Object.defineProperty(navigator, 'gpu', { configurable: true, value: {
		requestAdapter: async () => ({ requestDevice }), getPreferredCanvasFormat: () => 'bgra8unorm'
	} })
	const display = Object.create(DisplayWebGPU.prototype)
	Object.assign(display, {
		options: {}, createPipelines: jest.fn(), createSharedBuffers: jest.fn(),
		context: { configure: jest.fn(), unconfigure: jest.fn() }
	})
	await display.init()
	const oldPaint = { destroy: jest.fn() }
	display.paint = oldPaint
	lose({ reason: 'unknown' })
	await Promise.resolve()
	await display.recovering
	expect(display.device).toBe(second)
	expect(display.createPipelines).toHaveBeenCalledTimes(2)
	expect(display.available).toBe(true)
	expect(oldPaint.destroy).toHaveBeenCalledTimes(1)
	expect(display.paint).toBeNull()
	await display.destroy()
	expect(second.destroy).toHaveBeenCalledTimes(1)
})

test('WebGPU releases paint textures on resize and keeps them for unchanged dimensions', () => {
	const display = Object.create(DisplayWebGPU.prototype)
	const paint = { width: 640, height: 480, destroy: jest.fn() }
	Object.assign(display, { paint, device: {}, canvas: {}, frameStarted: true })
	display.onResize(640, 480)
	expect(paint.destroy).not.toHaveBeenCalled()
	display.onResize(320, 240)
	expect(paint.destroy).toHaveBeenCalledTimes(1)
	expect(display.paint).toBeNull()
	expect(display.frameStarted).toBe(false)
	expect(display.canvas).toEqual({ width: 320, height: 240 })
})

test('Composite waits for an added child and owns its canvas until removal', async () => {
	const display = new DisplayComposite(canvas(), 640, 480, { displays: [] })
	await display.loading
	let ready
	const child = { canvas: canvas(), loading: new Promise(resolve => { ready = resolve }),
		cancelAnimationLoop: jest.fn(), setSize: jest.fn(), destroy: jest.fn(async () => {}) }
	const adding = display.addDisplay(child)
	expect(display.displays).toHaveLength(0)
	ready()
	await adding
	expect(child.canvas.parentNode).toBe(display.childContainer)
	expect(child.canvas.hidden).toBe(true)
	await display.removeDisplay(child)
	expect(child.destroy).toHaveBeenCalledTimes(1)
	expect(child.canvas.isConnected).toBe(false)
	expect(display.displays).toHaveLength(0)
	await display.destroy()
})

test('four Composite displays each render into one quarter of a grid and reflow when resized', async () => {
	const children = []
	createDisplay.mockImplementation(async element => {
		const child = { canvas: element, cancelAnimationLoop(){}, setSize: jest.fn(), render(){}, drawElement: jest.fn(), destroy: async () => {} }
		children.push(child)
		return child
	})
	const display = new DisplayComposite(canvas(), 640, 480, { layout: 'grid', displays: Array(4).fill('DisplayCanvas2D') })
	await display.loading
	display.render()
	expect(display.canvasContext.drawImage.mock.calls.slice(0, 4).map(call => call.slice(1))).toEqual([
		[0, 0, 320, 240], [320, 0, 320, 240], [0, 240, 320, 240], [320, 240, 320, 240]
	])
	for (const child of children) expect(child.setSize).toHaveBeenLastCalledWith(320, 240)
	display.drawElement('video', 0, 0, true, 640, 480)
	for (const child of children) expect(child.drawElement).toHaveBeenCalledWith('video', 0, 0, true, 320, 240)
	display.setSize(800, 600)
	for (const child of children) expect(child.setSize).toHaveBeenLastCalledWith(400, 300)
	display.setLayout('layers')
	for (const child of children) expect(child.setSize).toHaveBeenLastCalledWith(800, 600)
	expect(createDisplay).toHaveBeenCalledTimes(4)
	await display.removeDisplay(children[3])
	display.setLayout('row')
	expect(display.viewports).toHaveLength(3)
	expect(display.viewports.at(-1).x + display.viewports.at(-1).width).toBe(800)
	await display.destroy()
})

test('Composite splits cover odd dimensions without gaps or overlapping neighbours', () => {
	const tiles = getCompositeViewports(4, 641, 481, 'grid')
	expect(tiles.reduce((area, tile) => area + tile.width * tile.height, 0)).toBe(641 * 481)
	expect(tiles[0].x + tiles[0].width).toBe(tiles[1].x)
	expect(tiles[0].y + tiles[0].height).toBe(tiles[2].y)
	expect(getCompositeViewports(2, 640, 480, 'row')).toEqual([
		{ x: 0, y: 0, width: 320, height: 480 }, { x: 320, y: 0, width: 320, height: 480 }
	])
	expect(getCompositeViewports(2, 640, 480, 'column')).toEqual([
		{ x: 0, y: 0, width: 640, height: 240 }, { x: 0, y: 240, width: 640, height: 240 }
	])
	expect(() => getCompositeViewports(4, 640, 480, 'unknown')).toThrow()
})
