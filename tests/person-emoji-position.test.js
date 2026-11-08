import { readFileSync } from 'node:fs'
import { easeInSine } from '../source/maths/easing.js'

const source = readFileSync('source/people/person.js', 'utf8').replace(/\r\n/g, '\n')
const start = source.indexOf('\tdrawEmojiText(')
const body = source.slice(source.indexOf('{', start) + 1, source.indexOf('\n\t}\n', start))
const drawEmojiText = new Function('display', 'textX', 'textY', 'pitch', 'yaw', 'roll', 'prediction', 'offsetY', 'easeInSine', 'HALF_PI', 'EMOJI_RADIUS', body)

describe('emoji and head-angle overlay top edge', () => {
	test.each([39, 57])('aligns the triangle controls to the rendered emoji at every stage size (offset %s)', offset => {
		const person = {
			options:{}, emoticon:'😀', emojiDetector:{},
			emojiControls:document.createElement('div'),
			getMouthParticleOrigin:jest.fn(() => ({x:0, y:0}))
		}
		for (const [width, height] of [[640, 480], [1280, 720]])
		{
			const display = {width, height, drawEmoticon:jest.fn()}
			for (const textY of [-200, 200])
			{
				for (const hovered of [false, true])
				{
					person.isUserSelectingMode = hovered
					drawEmojiText.call(person, display, width * .7, textY, 1, 1, 0, {}, offset, easeInSine, Math.PI / 2, 54)
					const [x, y] = display.drawEmoticon.mock.lastCall
					const value = name => Number(person.emojiControls.style.getPropertyValue(name))
					expect(value('--emoji-x') * width).toBeCloseTo(x)
					expect(value('--emoji-y') * height).toBeCloseTo(y - 15)
					expect(value('--emoji-width') * width).toBeCloseTo(150)
					expect(value('--emoji-height') * height).toBeCloseTo(54)
				}
			}
		}
	})

	test.each([39, 57])('sticks to the top together, including the octave indicator (offset %s)', offset => {
		const person = {
			options:{}, emoticon:'😀', emojiDetector:{},
			getMouthParticleOrigin:jest.fn(() => ({x:0, y:0}))
		}
		const display = {drawEmoticon:jest.fn(), drawOctaveIndicator:jest.fn()}
		const draw = textY => {
			drawEmojiText.call(person, display, 100, textY, 1, 1, 0, {}, offset, easeInSine, Math.PI / 2, 54)
			const y = display.drawEmoticon.mock.lastCall[1]
			expect(display.drawOctaveIndicator.mock.lastCall[1]).toBe(y)
			// Highest head-angle dot: centre offset -19, radius 54*.67, dot radius 4.
			expect(y - 19 - 54 * .67 - 4).toBeGreaterThanOrEqual(0)
			return y
		}
		expect(draw(-200)).toBe(draw(-100))
		expect(draw(200)).toBe(200 + offset)
	})

	test('stretches the octave indicator with the octave head range', () => {
		const height = octaveIndicatorScale => {
			const person = {
				options:{}, emoticon:'😀', emojiDetector:{}, octaveIndicatorScale,
				getMouthParticleOrigin:jest.fn(() => ({x:0, y:0}))
			}
			const display = {drawEmoticon:jest.fn(), drawOctaveIndicator:jest.fn()}
			drawEmojiText.call(person, display, 100, 200, 1, 1, 0, {}, 39, easeInSine, Math.PI / 2, 54)
			return display.drawOctaveIndicator.mock.lastCall[5]
		}
		expect(height(0.5)).toBeCloseTo(height(1) / 2)
		expect(height(4 / 3)).toBeGreaterThan(height(1))
	})

	test('moves the octave indicator up with a raised neutral height', () => {
		const y = octaveIndicatorOffset => {
			const person = {
				options:{}, emoticon:'😀', emojiDetector:{}, octaveIndicatorOffset,
				getMouthParticleOrigin:jest.fn(() => ({x:0, y:0}))
			}
			const display = {drawEmoticon:jest.fn(), drawOctaveIndicator:jest.fn()}
			drawEmojiText.call(person, display, 100, 200, 1, 1, 0, {}, 39, easeInSine, Math.PI / 2, 54)
			return display.drawOctaveIndicator.mock.lastCall[1] - display.drawEmoticon.mock.lastCall[1]
		}
		expect(y(0)).toBe(0)
		expect(y(1 / 9)).toBeLessThan(0)
		expect(y(-1 / 9)).toBeCloseTo(-y(1 / 9))
	})
})
