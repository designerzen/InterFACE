import { SpriteSheet } from '../source/visual/sprite-sheet.js'
import { EmojiDetector } from '../source/models/emoji-detection.js'
import { EMOJI_LEFT_WINK, MIRRORABLE_EMOJIS } from '../source/models/emoji.js'

test('opposite winks draw independently from cached normal and mirrored atlas regions', () => {
	const atlasContext = {
		save:jest.fn(), restore:jest.fn(), translate:jest.fn(), scale:jest.fn(),
		strokeText:jest.fn(), fillText:jest.fn(),
		measureText:() => ({ width:54, actualBoundingBoxLeft:0, actualBoundingBoxRight:54, actualBoundingBoxAscent:45, actualBoundingBoxDescent:9 })
	}
	const sprites = new SpriteSheet({ canvasFactory:(width, height) => ({ width, height, getContext:() => atlasContext }) })
	sprites.preloadMirroredEmojis(MIRRORABLE_EMOJIS)
	const variants = sprites.getEmojiVariants(EMOJI_LEFT_WINK)
	expect(variants.normal.x).not.toBe(variants.mirrored.x)
	expect(atlasContext.scale).toHaveBeenCalledWith(-1, 1)
	const rasterizedCount = atlasContext.fillText.mock.calls.length
	const target = { drawImage:jest.fn() }
	const detector = new EmojiDetector()
	for (const [index, rightEyeClosed] of [false, true, false].entries()) {
		const emoji = detector.detect({ leftEyeClosed:!rightEyeClosed, rightEyeClosed, time:index }, {}, index * 1000)
		expect(emoji).toBe(EMOJI_LEFT_WINK)
		expect(detector.isMirrored).toBe(rightEyeClosed)
		expect(sprites.draw(target, emoji, 100, 100, { mirrored:detector.isMirrored })).toBe(true)
		const region = rightEyeClosed ? variants.mirrored : variants.normal
		expect(target.drawImage.mock.lastCall.slice(0, 5)).toEqual([sprites.canvas, region.x, region.y, region.width, region.height])
	}
	expect(atlasContext.fillText).toHaveBeenCalledTimes(rasterizedCount)
})
