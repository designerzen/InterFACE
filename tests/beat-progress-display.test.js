jest.mock('@chenglou/pretext', () => ({
	measureNaturalWidth:jest.fn(() => 0),
	prepareWithSegments:jest.fn(),
}))

import DisplayOverlay2d from '../source/display/display-overlay-2d.js'

const createContext = () => ({
	save:jest.fn(),
	restore:jest.fn(),
	fillRect:jest.fn(),
	beginPath:jest.fn(),
	moveTo:jest.fn(),
	lineTo:jest.fn(),
	translate:jest.fn(),
	rotate:jest.fn(),
	closePath:jest.fn(),
	arc:jest.fn(),
	fill:jest.fn(),
	stroke:jest.fn(),
	fillText:jest.fn(),
	ellipse:jest.fn(),
	clearRect:jest.fn(),
	drawImage:jest.fn(),
	setTransform:jest.fn(),
})

const createDisplay = () => {
	const display = Object.create(DisplayOverlay2d.prototype)
	display.context = createContext()
	display.canvasWidth = 1280
	display.canvasHeight = 720
	display.dirtyRects = []
	display.batchingFrame = false
	display.renderingBatch = false
	return display
}

describe('percussion beat progress display', () => {
	test('draws the detailed mode as one labelled row of 16 dots per instrument', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:16 }, (_, step) => ({
			kick:step % 4 === 0 ? 255 : 0,
			snare:step % 8 === 4 ? 220 : 0,
		}))

		display.drawBeatProgress(0.25, sequence, { mode:'grid', lanes:['kick', 'snare'] })

		expect(display.context.fillText).toHaveBeenCalledTimes(2)
		expect(display.context.arc).toHaveBeenCalledTimes(32)
		expect(display.context.fillRect).not.toHaveBeenCalled()
	})

	test('rotates the sequence around a fixed twelve oclock playhead, including wraparound', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:16 }, () => ({ kick:255 }))
		const positions = []
		for (const progress of [0, 0.25, 0.99, 1]) {
			display.context.arc.mockClear()
			display.drawBeatProgress(progress, sequence, { mode:'clock', lanes:['kick'] })
			const [ring, firstDot, ...rest] = display.context.arc.mock.calls
			const playingDot = rest.at(-1)
			expect(playingDot[0]).toBeCloseTo(ring[0])
			expect(playingDot[1]).toBeCloseTo(ring[1] - ring[2])
			positions.push(firstDot)
		}
		expect(positions[1][0]).toBeLessThan(positions[0][0])
		expect(positions[3]).toEqual(positions[0])
		expect(display.context.fillText.mock.calls.map(([text]) => text)).toEqual(
			Array.from({ length:4 }, () => Array.from({ length:12 }, (_, hour) => String(hour + 1))).flat()
		)
	})

	test('draws multiple bars as unlabelled instrument columns at the top right', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:32 }, (_, step) => ({
			kick:step % 4 === 0 ? 255 : 0,
			snare:step % 8 === 4 ? 220 : 0,
		}))

		display.drawBeatProgress(0.375, sequence, { mode:'vertical', lanes:['kick', 'snare'] })

		expect(display.context.fillText).not.toHaveBeenCalled()
		expect(display.context.rotate).not.toHaveBeenCalled()
		expect(display.context.arc).toHaveBeenCalledTimes(64)
		expect(display.context.fillRect).not.toHaveBeenCalled()
	})

	test('keeps the existing summary mode available', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:16 }, () => ({ kick:255 }))

		display.drawBeatProgress(0.25, sequence, { mode:'summary' })

		expect(display.context.fillText).not.toHaveBeenCalled()
		expect(display.context.arc).toHaveBeenCalled()
	})

	test('draws nothing when beat visualization is disabled', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:16 }, () => ({ kick:255 }))

		display.drawBeatProgress(0.25, sequence, { mode:'disabled' })

		expect(display.context.arc).not.toHaveBeenCalled()
		expect(display.context.fillText).not.toHaveBeenCalled()
		expect(display.dirtyRects).toEqual([])
	})

	test('radiates velocity-sized instrument rings from one central point', () => {
		const display = createDisplay()
		const sequence = Array.from({ length:16 }, (_, step) => step === 0
			? { kick:255, snare:64 }
			: { kick:0, snare:0 })

		display.drawBeatProgress(0.025, sequence, { mode:'ripples', lanes:['kick', 'snare'] })

		const radii = display.context.arc.mock.calls.map(call => call[2])
		expect(radii).toHaveLength(3)
		expect(radii[0]).toBeGreaterThan(radii[1])
		expect(radii[2]).toBeCloseTo(2.2)
		expect(display.context.fill).toHaveBeenCalledTimes(1)
	})

	test('reuses a static grid layer while only redrawing the current column', () => {
		const display = createDisplay()
		const staticContext = createContext()
		display.canvas = {}
		display.beatStaticLayer = {
			canvas:{ width:1, height:1 },
			context:staticContext,
		}
		const sequence = Array.from({ length:16 }, (_, step) => ({
			kick:step % 4 === 0 ? 255 : 0,
			snare:step % 8 === 4 ? 220 : 0,
		}))
		const lanes = ['kick', 'snare']

		display.drawBeatProgress(0.25, sequence, { mode:'grid', lanes })
		const cachedArcCount = staticContext.arc.mock.calls.length
		display.drawBeatProgress(0.26, sequence, { mode:'grid', lanes })

		expect(cachedArcCount).toBe(30)
		expect(staticContext.arc).toHaveBeenCalledTimes(cachedArcCount)
		expect(display.context.arc).toHaveBeenCalledTimes(4)
		expect(display.context.drawImage).toHaveBeenCalledTimes(2)
	})

	test('queues traditional notation into the same overlay canvas and tracks its dirty bounds', () => {
		const display = createDisplay()
		display.prepareDraw = jest.fn()
		display.markDirty = jest.fn()
		display.queueFrameCommand = DisplayOverlay2d.prototype.queueFrameCommand
		display.drawNotation = DisplayOverlay2d.prototype.drawNotation

		display.drawNotation(320, 180, [60, 64, 67], 4, 28)

		expect(display.prepareDraw).toHaveBeenCalled()
		expect(display.context.fillText).toHaveBeenCalled()
		expect(display.context.ellipse).toHaveBeenCalledTimes(3)
		expect(display.markDirty).toHaveBeenCalledTimes(1)
	})
})
