import fs from 'node:fs'
import path from 'node:path'
import { getNoteFeedbackColour } from '../source/settings/palette.js'

const readSource = relativePath => fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')

describe('active note marker', () => {
	it('provides a distinct pitch colour for each natural note', () => {
		const colours = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(getNoteFeedbackColour)
		expect(colours.every(Boolean)).toBe(true)
		expect(new Set(colours.map(colour => colour.h)).size).toBe(7)
	})

	it('passes the current pitch colour into emoticon rendering', () => {
		const personSource = readSource('source/people/person.js')
		expect(personSource).toContain('this.headNoteRangeDegrees, this.hsl')
	})

	it('draws a coloured centre inside the selected 2D dot', () => {
		for (const sourcePath of [
			'source/display/display-canvas-2d.js',
			'source/display/display-overlay-2d.js'
		]) {
			const source = readSource(sourcePath)
			expect(source).toContain('activeCircle.radius = 4')
			expect(source).toContain('activeCircle.x, activeCircle.y, 2.25, 0, activeNoteColour')
		}
	})

	it('includes the pitch colour in particle marker rendering and caching', () => {
		const lookingGlassSource = readSource('source/display/looking-glass-emoticon-particles.js')
		const webGpuSource = readSource('source/display/display-three-webgpu-particle.js')
		expect(lookingGlassSource).toContain('context.fillStyle = activeNoteColour')
		expect(lookingGlassSource).toContain('${noteRangeDegrees}:${activeNoteColour}')
		expect(webGpuSource).toContain('material.color.set(activeNoteColour)')
	})
})
