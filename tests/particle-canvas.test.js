jest.mock('@chenglou/pretext', () => ({
	measureNaturalWidth:jest.fn(() => 0),
	prepareWithSegments:jest.fn(),
}))

import DisplayOverlay2d from '../source/display/display-overlay-2d.js'

const createContext = () => Object.fromEntries(
	['save', 'restore', 'scale', 'translate', 'rotate', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'stroke', 'fill', 'clearRect']
		.map(name => [name, jest.fn()])
)

const createOverlay = () => {
	const overlay = Object.create(DisplayOverlay2d.prototype)
	Object.assign(overlay, {
		context:createContext(), noteParticles:[], dirtyRects:[],
		lastParticleFrameTime:0, pendingClear:false,
	})
	return overlay
}

test('queued particles draw on the face canvas without adding text-overlay dirty rectangles', () => {
	const overlay = createOverlay()
	const faces = createContext()
	overlay.clearDirty()
	overlay.drawNoteParticles(100, 100, 1, '#fff', { noteParticleGraphics:'stars' })
	overlay.flushFrame(faces)
	expect(faces.fill).toHaveBeenCalled()
	expect(overlay.context.fill).not.toHaveBeenCalled()
	expect(overlay.dirtyRects).toEqual([])

	// Existing particles keep animating even when no new notes are emitted.
	faces.fill.mockClear()
	overlay.clearDirty()
	overlay.flushFrame(faces)
	expect(faces.fill).toHaveBeenCalled()
	expect(faces.clearRect).not.toHaveBeenCalled()
})

test('an unavailable main context never redirects effects to the text overlay', () => {
	const overlay = createOverlay()
	overlay.clearDirty()
	overlay.drawNoteParticles(100, 100, 1, '#fff', { noteParticleGraphics:'stars' })
	overlay.flushFrame(null)
	expect(overlay.context.fill).not.toHaveBeenCalled()
	expect(overlay.dirtyRects).toEqual([])
})

test.each([
	[1280, 720, 640, 360],
	[720, 1280, 360, 640],
	[640, 480, 1562, 1438],
	[640, 480, 640, 480],
])('maps mouth particles from a %sx%s overlay into a %sx%s renderer', (width, height, targetWidth, targetHeight) => {
	const overlay = createOverlay()
	Object.assign(overlay, { canvasWidth:width, canvasHeight:height })
	const faces = createContext()
	faces.canvas = { width:targetWidth, height:targetHeight }
	const mouth = { x:width * .7, y:height * .8 }
	let scaleX = 1, scaleY = 1
	faces.scale.mockImplementation((x, y) => { scaleX *= x; scaleY *= y })
	faces.translate.mockImplementation((x, y) => {
		// Compare normalised positions: CSS stretches both canvases over the stage.
		expect(x * scaleX / targetWidth).toBeCloseTo(.7)
		expect(y * scaleY / targetHeight).toBeCloseTo(.8)
	})
	overlay.drawNoteParticleFrame = jest.fn((now, context) => {
		context.translate(mouth.x, mouth.y)
		return true
	})
	overlay.clearDirty()
	overlay.flushFrame(faces)
	expect(overlay.drawNoteParticleFrame).toHaveBeenCalled()
	if (width !== targetWidth || height !== targetHeight) {
		expect(faces.scale).toHaveBeenCalledWith(targetWidth / width, targetHeight / height)
		expect(faces.save).toHaveBeenCalledTimes(1)
		expect(faces.restore).toHaveBeenCalledTimes(1)
	} else {
		expect(faces.scale).not.toHaveBeenCalled()
	}
})

test('suspending the main overlay clears queued effects once and resumes cleanly', () => {
	const overlay = createOverlay()
	overlay.canvas = document.createElement('canvas')
	overlay.noteParticles = [{ x: 10, y: 20 }]
	overlay.frameCommands = [jest.fn()]
	overlay.setSuspended(true)
	expect(overlay.canvas.hidden).toBe(true)
	expect(overlay.noteParticles).toEqual([])
	expect(overlay.frameCommands).toEqual([])
	expect(overlay.context.clearRect).toHaveBeenCalledTimes(1)
	overlay.clearDirty()
	overlay.drawEmoticon(0, 0, '😀')
	overlay.drawNoteParticles(0, 0, 1, '#fff', {})
	overlay.drawBeatProgress(.5)
	overlay.flushFrame(createContext())
	expect(overlay.frameCommands).toEqual([])
	expect(overlay.noteParticles).toEqual([])
	expect(overlay.context.fill).not.toHaveBeenCalled()
	overlay.setSuspended(true)
	expect(overlay.context.clearRect).toHaveBeenCalledTimes(1)
	overlay.setSuspended(false)
	expect(overlay.canvas.hidden).toBe(false)
})
