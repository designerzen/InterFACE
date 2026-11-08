jest.mock('@chenglou/pretext', () => ({
	measureNaturalWidth:jest.fn(() => 0),
	prepareWithSegments:jest.fn(),
}))

import DisplayOverlay2d from '../source/display/display-overlay-2d.js'

const createContext = () => Object.fromEntries(
	['save', 'restore', 'translate', 'rotate', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'stroke', 'fill', 'clearRect']
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
