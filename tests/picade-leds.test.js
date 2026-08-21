import { TextDecoder, TextEncoder } from 'util'

const PREFIX = new TextEncoder().encode('multiverse:data')

let PicadeLeds
let PICADE_DEFAULT_FILTERS
let PICADE_MAX_BUTTON_FRAME_LEDS
let isPicadeSerialPort
let picadeColor

beforeAll(async () => {
	global.TextEncoder = TextEncoder
	global.TextDecoder = TextDecoder

	;({
		PICADE_DEFAULT_FILTERS,
		PICADE_MAX_BUTTON_FRAME_LEDS,
		PicadeLeds,
		isPicadeSerialPort,
		picadeColor,
	} = await import('../source/hardware/gamepad/picade-leds.js'))
})

describe('picade-leds', () => {
	test('setLed targets a specific button LED', () => {
		const picade = new PicadeLeds()

		picade.setLed(2, 3, '#112233')

		const packet = picade.getPacket()
		const payload = packet.slice(PREFIX.length)
		const ledOffset = ((2 * 4) + 3) * 4

		expect(payload).toHaveLength(PICADE_MAX_BUTTON_FRAME_LEDS * 4)
		expect(Array.from(payload.slice(ledOffset, ledOffset + 4))).toEqual([0x33, 0x22, 0x11, 31])
		expect(Array.from(payload.slice(0, ledOffset))).toEqual(new Array(ledOffset).fill(0))
	})

	test('fadeLed fades out when no second color is provided', () => {
		const picade = new PicadeLeds({ refreshRate: 2 })

		picade.fadeLed(1, 2, picadeColor('#204060', 10), null, { duration: 1 })

		picade.getPacket(0)
		const packet = picade.getPacket(1000)
		const payload = packet.slice(PREFIX.length)
		const ledOffset = ((1 * 4) + 2) * 4

		expect(Array.from(payload.slice(ledOffset, ledOffset + 4))).toEqual([0, 0, 0, 0])
	})

	test('includes all known Picade USB IDs in serial filters', () => {
		expect(PICADE_DEFAULT_FILTERS).toEqual(expect.arrayContaining([
			{ usbVendorId: 0x2e8a, usbProductId: 0x1098 },
			{ usbVendorId: 0xcafe, usbProductId: 0x400d },
		]))
	})

	test('matches paired Picade serial ports by USB metadata', () => {
		expect(isPicadeSerialPort({
			getInfo: () => ({ usbVendorId: 0xcafe, usbProductId: 0x400d }),
		})).toBe(true)
		expect(isPicadeSerialPort({
			getInfo: () => ({ usbVendorId: 0x045e, usbProductId: 0x02ea }),
		})).toBe(false)
	})

	test('connectPaired returns false without requesting serial permission', async () => {
		const requestPort = jest.fn()
		const previousNavigator = global.navigator
		Object.defineProperty(global, 'navigator', {
			configurable: true,
			value: {
				serial: {
					getPorts: jest.fn(async () => []),
					requestPort,
				},
			},
		})
		const picade = new PicadeLeds()

		await expect(picade.connectPaired()).resolves.toBe(false)
		expect(requestPort).not.toHaveBeenCalled()

		Object.defineProperty(global, 'navigator', {
			configurable: true,
			value: previousNavigator,
		})
	})
})
