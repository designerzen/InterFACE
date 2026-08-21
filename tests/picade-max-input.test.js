import { TextDecoder, TextEncoder } from 'util'

const PREFIX = new TextEncoder().encode('multiverse:data')

let COLOR_ORDER_BGR
let LedMatrix
let PICADE_MAX_BUTTON_FRAME_LEDS
let PlasmaButtons
let RGBl

beforeAll(async () => {
	global.TextEncoder = TextEncoder
	global.TextDecoder = TextDecoder

	;({
		COLOR_ORDER_BGR,
		LedMatrix,
		PICADE_MAX_BUTTON_FRAME_LEDS,
		PlasmaButtons,
		RGBl,
	} = await import('../source/hardware/gamepad/picade-max-input.js'))
})

describe('picade-max-input serialization', () => {
	test('button fade frames truncate interpolated channel values like pixel-multiverse', () => {
		const buttons = new PlasmaButtons(1, { refreshRate: 2 })

		buttons.setLedMode(0, 'fade', {
			colorFrom: RGBl(0, 0, 0, 0),
			colorTo: RGBl(1, 5, 7, 9),
			transitionTime: 1,
		})

		buttons.getPacket(0)
		const packet = buttons.getPacket(500)
		const payload = Array.from(packet.slice(PREFIX.length, PREFIX.length + 4))

		expect(Array.from(packet.slice(0, PREFIX.length))).toEqual(Array.from(PREFIX))
		expect(payload).toEqual([3, 2, 0, 4])
	})

	test('matrix packets use the same prefixed translated byte order as pixel-multiverse', () => {
		const matrix = new LedMatrix({ colorOrder: COLOR_ORDER_BGR })

		matrix.setPixel(0, 0, RGBl(10, 20, 30, 40))

		const packet = matrix.getPacket()
		const payload = Array.from(packet.slice(PREFIX.length, PREFIX.length + 4))

		expect(Array.from(packet.slice(0, PREFIX.length))).toEqual(Array.from(PREFIX))
		expect(payload).toEqual([30, 20, 10, 40])
	})

	test('button packets can be padded to the fixed Picade Max firmware frame size', () => {
		const buttons = new PlasmaButtons(4, {
			refreshRate: 20,
			packetLedCount: PICADE_MAX_BUTTON_FRAME_LEDS,
		})

		buttons.setAllLeds('normal', {
			colorTo: RGBl(10, 20, 30, 5),
		})

		const packet = buttons.getPacket()
		const payload = packet.slice(PREFIX.length)

		expect(payload).toHaveLength(PICADE_MAX_BUTTON_FRAME_LEDS * 4)
		expect(Array.from(payload.slice(0, 16))).toEqual([
			30, 20, 10, 5,
			30, 20, 10, 5,
			30, 20, 10, 5,
			30, 20, 10, 5,
		])
		expect(Array.from(payload.slice(16, 32))).toEqual(new Array(16).fill(0))
		expect(buttons.maxFrameRate).toBe(21)
	})

	test('rapid triggerLedFade calls overwrite previous flash state without timer backlog', () => {
		const buttons = new PlasmaButtons(1, { refreshRate: 10 })

		buttons.triggerLedFade(0, RGBl(63, 0, 0, 15), {
			holdTime: 0,
			fadeTime: 1,
			colorFrom: RGBl(0, 0, 0, 0),
		})
		buttons.getPacket(0)

		buttons.triggerLedFade(0, RGBl(0, 0, 63, 15), {
			holdTime: 0,
			fadeTime: 0.1,
			colorFrom: RGBl(0, 0, 0, 0),
		})

		const immediatePayload = Array.from(buttons.getPacket(100).slice(PREFIX.length, PREFIX.length + 4))
		expect(immediatePayload).toEqual([63, 0, 0, 15])

		const fadedPayload = Array.from(buttons.getPacket(200).slice(PREFIX.length, PREFIX.length + 4))
		expect(fadedPayload).toEqual([0, 0, 0, 0])
	})

	test('one-frame overlays preserve the underlying LED animation state', () => {
		const buttons = new PlasmaButtons(1)
		buttons.setLedMode(0, 'normal', { colorTo: RGBl(1, 2, 3, 4) })

		buttons.overrideLedFrame(0, RGBl(9, 8, 7, 6))
		const overlay = Array.from(buttons.getPacket().slice(PREFIX.length, PREFIX.length + 4))
		const resumed = Array.from(buttons.getPacket().slice(PREFIX.length, PREFIX.length + 4))

		expect(overlay).toEqual([7, 8, 9, 6])
		expect(resumed).toEqual([3, 2, 1, 4])
	})
})
