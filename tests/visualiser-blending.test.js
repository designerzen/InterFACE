jest.mock('stats-gl', () => jest.fn())
jest.mock('../source/display/display-abstract.js', () => class {})
jest.mock('../source/capabilities.js', () => ({ hasOffscreenCanvasCapability:() => false }))
jest.mock('../source/visual/2d.text.js', () => ({}))

import Display2D from '../source/display/display-canvas-2d.js'
import DisplayComposite from '../source/display/display-composite.js'
import { VISUALISER_MODES, getVisualiserMode, normaliseVisualiser } from '../source/visual/visualiser-modes.js'

const display = () => {
	const instance = Object.create(Display2D.prototype)
	const stack = []
	const context = {
		globalCompositeOperation:'source-over',
		globalAlpha:1,
		save(){ stack.push([this.globalCompositeOperation, this.globalAlpha]) },
		restore(){ [this.globalCompositeOperation, this.globalAlpha] = stack.pop() },
		drawImage:jest.fn(function(){ return this.globalCompositeOperation })
	}
	instance.canvas2DContext = context
	instance.filterIndex = 0
	return instance
}

test('screen blends the visualiser only, and the next video frame keeps source-over', () => {
	const instance = display()
	instance.setFilter(instance.nextFilterIndex)
	expect(instance.filter).toBe('screen')
	instance.drawElement({}, 0, 0, false, 800, 400, { filter:true })
	expect(instance.canvasContext.drawImage.mock.results[0].value).toBe('screen')
	expect(instance.canvasContext.globalCompositeOperation).toBe('source-over')
	instance.drawElement({}, 0, 0, false, 800, 400)
	expect(instance.canvasContext.drawImage.mock.results[1].value).toBe('source-over')
})

test('filter cycle reaches all enabled blend modes and wraps to normal', () => {
	const instance = display()
	const modes = []
	do {
		modes.push(instance.filter)
		instance.setFilter(instance.nextFilterIndex)
	} while (instance.filterIndex !== 0 && modes.length < 30)
	expect(instance.filterIndex).toBe(0)
	expect(modes).toEqual(expect.arrayContaining(['source-over', 'screen', 'multiply', 'overlay', 'soft-light', 'difference', 'exclusion', 'luminosity']))
	expect(new Set(modes).size).toBe(modes.length)
})

test('named Butterchurn options select their own blend regardless of the canvas filter', () => {
	const instance = display()
	instance.setFilter(2)
	const presets = VISUALISER_MODES.filter(mode => mode.renderer === 'butterchurn')
	expect(presets).toHaveLength(11)
	expect(getVisualiserMode('butterchurn-screen').label).toBe('Psychedelic Brass Rubbing')
	for (const mode of presets) {
		expect(normaliseVisualiser(mode.id)).toBe(mode.id)
		expect(mode.frequency || mode.time).toBeFalsy()
		expect(mode.opacity).toBe(0.5)
		instance.canvasContext.drawImage.mockImplementation(function(){
			expect(this.globalAlpha).toBe(0.5)
			return this.globalCompositeOperation
		})
		instance.drawElement({}, 0, 0, false, 800, 400, { blendMode:mode.blendMode, opacity:mode.opacity })
		expect(instance.canvasContext.drawImage.mock.results.at(-1).value).toBe(mode.blendMode)
		expect(instance.canvasContext.globalCompositeOperation).toBe('source-over')
		expect(instance.canvasContext.globalAlpha).toBe(1)
	}
})

test('composite forwards blending options and scales the layer into each viewport', () => {
	const instance = Object.create(DisplayComposite.prototype)
	const child = { drawElement:jest.fn() }
	Object.defineProperties(instance, {
		width:{ value:800 }, height:{ value:400 },
		viewports:{ value:[{ width:400, height:400 }] }
	})
	instance.displays = [child]
	const canvas = {}, options = { filter:true }
	instance.drawElement(canvas, 0, 0, false, 800, 400, options)
	expect(child.drawElement).toHaveBeenCalledWith(canvas, 0, 0, false, 400, 400, options)
})
