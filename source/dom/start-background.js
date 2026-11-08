import { createProceduralBackground } from './procedural-background.js'

// Shared across the small loading entry and the main application bundle.
const key = Symbol.for('photosynth.procedural-background')
export const startBackground = () => {
	if (!globalThis[key]) {
		const root = document.documentElement
		if (!root.classList.contains('loaded') && !root.classList.contains('player-selection')) root.classList.add('loading')
		const background = createProceduralBackground()
		const dispose = background.dispose
		background.dispose = () => {
			dispose()
			if (globalThis[key] === background) delete globalThis[key]
		}
		globalThis[key] = background
	}
	return globalThis[key]
}

startBackground()
