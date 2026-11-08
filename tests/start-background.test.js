jest.mock('../source/dom/procedural-background.js', () => ({
	createProceduralBackground: jest.fn(() => ({ dispose: jest.fn() }))
}))

test('early startup and main entry share one renderer, and disposal permits restart', async () => {
	delete globalThis[Symbol.for('photosynth.procedural-background')]
	document.documentElement.className = ''
	const { startBackground } = await import('../source/dom/start-background.js')
	const { createProceduralBackground } = await import('../source/dom/procedural-background.js')
	const first = startBackground()
	expect(startBackground()).toBe(first)
	expect(createProceduralBackground).toHaveBeenCalledTimes(1)
	expect(document.documentElement.classList.contains('loading')).toBe(true)
	first.dispose()
	const second = startBackground()
	expect(second).not.toBe(first)
	expect(createProceduralBackground).toHaveBeenCalledTimes(2)
	second.dispose()
})
