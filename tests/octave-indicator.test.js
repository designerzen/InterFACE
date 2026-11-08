import { createOctaveLineData, drawOctaveLines } from '../source/display/octave-indicator.js'

describe('octave indicator', () => {
	test('places every octave high-to-low and widens the active line', () => {
		const lines = createOctaveLineData(100, 50, 4, 2, 6)

		expect(lines.map(line => line.value)).toEqual([6, 5, 4, 3, 2])
		expect(lines.map(line => line.y)).toEqual([25, 37.5, 50, 62.5, 75])
		expect(lines[0].x).toBeCloseTo(100)
		expect(lines[2].x).toBeCloseTo(108)
		expect(lines[4].x).toBeCloseTo(100)
		expect(lines.filter(line => line.active)).toHaveLength(1)
		expect(lines.find(line => line.active).length).toBeGreaterThan(lines.find(line => !line.active).length)
	})

	test('supports reversed ranges and clamps the active octave', () => {
		const lines = createOctaveLineData(0, 0, 9, 6, 2)

		expect(lines.map(line => line.value)).toEqual([6, 5, 4, 3, 2])
		expect(lines[0].active).toBe(true)
	})

	test.each([[2, 6], [1, 7], [3, 4]])('insets the head height by 2px at each end for octave range %s to %s', (low, high) => {
		const lines = createOctaveLineData(100, 50, 4, low, high, {height:48})
		expect(lines[0].y).toBe(28)
		expect(lines[lines.length - 1].y).toBe(72)
		for (let index = 1; index < lines.length; index++) {
			expect(lines[index].y - lines[index - 1].y).toBeCloseTo(44 / (high - low))
		}
	})

	test('a smaller height only tightens the spacing, staying centred with the same widths', () => {
		const full = createOctaveLineData(100, 50, 4, 2, 6, {height:54})
		const tight = createOctaveLineData(100, 50, 4, 2, 6, {height:24})
		const centre = lines => (lines[0].y + lines[lines.length - 1].y) / 2
		expect(centre(tight)).toBeCloseTo(centre(full))
		expect(tight[1].y - tight[0].y).toBeLessThan(full[1].y - full[0].y)
		expect(tight.map(line => line.length)).toEqual(full.map(line => line.length))
		expect(tight.map(line => line.x)).toEqual(full.map(line => line.x))
	})

	test('centres a single octave without invalid spacing', () => {
		const lines = createOctaveLineData(100, 50, 4, 4, 4)
		expect(lines).toHaveLength(1)
		expect(lines[0].y).toBe(50)
	})

	test('draws every octave white while retaining active line emphasis', () => {
		const strokes = []
		const context = {
			save:jest.fn(), restore:jest.fn(), beginPath:jest.fn(), moveTo:jest.fn(), lineTo:jest.fn(),
			stroke() { strokes.push({colour:this.strokeStyle, width:this.lineWidth}) }
		}
		drawOctaveLines(context, createOctaveLineData(0, 0, 4, 2, 6))
		expect(strokes.every(stroke => stroke.colour === '#fff')).toBe(true)
		expect(strokes[2].width).toBeGreaterThan(strokes[0].width)
	})

})
