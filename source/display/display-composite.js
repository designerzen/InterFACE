import AbstractDisplay from './display-abstract.js'
import { DISPLAY_COMPOSITE } from './display-types.js'
import { COMPOSITE_LAYOUTS, getCompositeViewports } from './composite-layout.js'

/** Layer or tile independent renderer canvases, using one animation loop. */
export default class DisplayComposite extends AbstractDisplay {
	name = DISPLAY_COMPOSITE
	transparentCanvas = true
	drawsFaceFeaturesOnCanvas = true
	displays = []
	ownedCanvases = new Set()
	destroyed = false
	get type(){ return DISPLAY_COMPOSITE }
	get firstDisplay(){ return this.displays[0] ?? null }
	get lastDisplay(){ return this.displays.at(-1) ?? null }
	get suppressMainOverlay(){ return this.displays.some(display => display.suppressMainOverlay) }
	get drawsSceneEmoticon(){ return this.displays.some(display => display.drawsSceneEmoticon) }
	get canvasContext(){ return this.outputContext ??= this.canvas.getContext('2d') }
	getParticleContext(){ return this.particleContext }
	get layout(){ return this.options.layout ?? 'layers' }
	get viewports(){ return getCompositeViewports(this.displays.length, this.width, this.height, this.layout) }

	constructor(canvas, width, height, options = {}){
		super(canvas, width, height, options)
		this.particleCanvas = document.createElement('canvas')
		this.particleCanvas.width = width
		this.particleCanvas.height = height
		this.particleContext = this.particleCanvas.getContext('2d')
		this.create(options).then(() => {
			this.available = !this.destroyed
			this.loadComplete('ready')
		}).catch(error => this.loadFailed(error))
	}

	async create(options){
		const { createDisplay, getCompositeDisplayTypes, getDefaultCompositeDisplays } = await import('./display-manager.js')
		if (this.destroyed) return
		const types = options.displays ?? getDefaultCompositeDisplays()
		if (!Array.isArray(types)) throw new TypeError('Composite displays must be an array')
		const allowed = getCompositeDisplayTypes()
		getCompositeViewports(0, this.width, this.height, this.layout)
		this.getChildContainer()
		try {
			for (const entry of types) {
				const type = typeof entry === 'string' ? entry : entry?.type
				if (!allowed.includes(type)) throw new Error(`Unsupported Composite child: ${type}`)
				const canvas = document.createElement('canvas')
				canvas.width = this.width
				canvas.height = this.height
				canvas.hidden = true
				canvas.setAttribute('aria-hidden', 'true')
				this.childContainer.append(canvas)
				this.ownedCanvases.add(canvas)
				const child = await createDisplay(canvas, type, {
					...options, ...entry?.options, displays: undefined,
					autoStart: false, resize: false, offscreen: false
				})
				if (this.destroyed) {
					await child.destroy()
					canvas.remove()
					return
				}
				await this.addDisplay(child)
			}
		} catch (error) {
			await this.disposeChildren()
			throw error
		}
	}

	getChildContainer(){
		if (!this.childContainer) {
			this.childContainer = document.createElement('div')
			this.childContainer.hidden = true
			this.canvas.after(this.childContainer)
		}
		return this.childContainer
	}

	async addDisplay(display){
		if (!display || display === this || display.type === DISPLAY_COMPOSITE) {
			throw new Error('Composite children must be independent displays')
		}
		if (this.displays.includes(display)) return display
		if (display.canvas === this.canvas || this.displays.some(child => child.canvas === display.canvas)) {
			throw new Error('Each Composite child needs its own canvas')
		}
		await display.loading
		if (this.destroyed) throw new Error('Composite has been destroyed')
		const container = this.getChildContainer()
		container.append(display.canvas)
		display.canvas.hidden = true
		this.ownedCanvases.add(display.canvas)
		for (const overlay of [display.faceFeatureOverlay, display.effectsCanvas]) if (overlay) container.append(overlay)
		display.resizeObserver?.disconnect()
		display.cancelAnimationLoop()
		this.displays.push(display)
		this.resizeChildren()
		return display
	}

	async removeDisplay(display){
		const index = this.displays.indexOf(display)
		if (index < 0) return false
		this.displays.splice(index, 1)
		try { await display.destroy() }
		finally {
			display.canvas.remove()
			this.ownedCanvases.delete(display.canvas)
			this.resizeChildren()
		}
		return true
	}

	forward(method, args){
		for (const child of this.displays) child[method]?.(...args)
	}
	clear(){
		this.canvasContext.clearRect(0, 0, this.width, this.height)
		this.forward('clear', [])
	}
	clearFaceFeatures(){
		this.particleContext?.clearRect(0, 0, this.width, this.height)
		this.forward('clearFaceFeatures', [])
	}
	drawPerson(...args){ this.forward('drawPerson', args) }
	setBeatTiming(...args){ this.forward('setBeatTiming', args) }
	emitNoteParticles(...args){ this.forward('emitNoteParticles', args) }
	drawFaceFeatures(...args){ this.forward('drawFaceFeatures', args) }
	drawElement(element, x = 0, y = 0, flip = true, width = this.width, height = this.height, options = {}){
		this.viewports.forEach((viewport, index) => {
			const sx = viewport.width / this.width, sy = viewport.height / this.height
			this.displays[index].drawElement(element, x * sx, y * sy, flip, width * sx, height * sy, options)
		})
	}
	drawBars(...args){ this.forward('drawBars', args) }
	drawVisualiser(...args){ this.forward('drawVisualiser', args) }
	drawInstrument(...args){ this.forward('drawInstrument', args) }
	drawText(...args){ this.forward('drawText', args) }
	drawParagraph(...args){ this.forward('drawParagraph', args) }
	drawEmoticon(...args){ this.forward('drawEmoticon', args) }
	drawOctaveIndicator(...args){ this.forward('drawOctaveIndicator', args) }
	setFilter(...args){ this.forward('setFilter', args) }
	nextFilter(){ this.forward('nextFilter', []) }
	resetFilter(){ this.forward('resetFilter', []) }
	postProcess(...args){ this.forward('postProcess', args) }
	onResize(width, height){
		if (this.particleCanvas) { this.particleCanvas.width = width; this.particleCanvas.height = height }
		this.resizeChildren()
	}
	setLayout(layout){
		if (!Object.hasOwn(COMPOSITE_LAYOUTS, layout)) throw new Error(`Unknown Composite layout: ${layout}`)
		this.options.layout = layout
		this.resizeChildren()
	}
	resizeChildren(){
		this.viewports.forEach((viewport, index) => {
			this.displays[index].setSize(Math.max(1, viewport.width), Math.max(1, viewport.height))
		})
	}
	onGeometrySubdivisionsChanged(value, previous, reason){ this.forward('setGeometrySubdivisions', [value, reason]) }

	render(){
		if (this.destroyed) return
		const context = this.canvasContext
		context.clearRect(0, 0, this.width, this.height)
		const viewports = this.viewports
		for (const [index, child] of this.displays.entries()) {
			const { x, y, width, height } = viewports[index]
			if (!width || !height) continue
			child.render()
			if (child.effectsCanvas && !child.effectsCanvas.hidden) context.drawImage(child.effectsCanvas, x, y, width, height)
			context.drawImage(child.canvas, x, y, width, height)
			if (child.faceFeatureOverlay && !child.faceFeatureOverlay.hidden) context.drawImage(child.faceFeatureOverlay, x, y, width, height)
		}
		context.drawImage(this.particleCanvas, 0, 0, this.width, this.height)
		this.count++
		super.render()
	}
	takePhotograph(type = 'image/png'){
		return this.canvas.toDataURL(type)
	}
	async disposeChildren(){
		const results = await Promise.allSettled(this.displays.splice(0).map(child => Promise.resolve().then(() => child.destroy())))
		for (const canvas of this.ownedCanvases) canvas.remove()
		this.ownedCanvases.clear()
		this.childContainer?.remove()
		const failure = results.find(result => result.status === 'rejected')
		if (failure) throw failure.reason
	}
	async destroy(){
		if (this.destroyed) return
		this.destroyed = true
		this.available = false
		try { await this.disposeChildren() }
		finally { await super.destroy() }
	}
}
