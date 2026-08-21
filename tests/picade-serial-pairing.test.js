const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder ??= TextDecoder
global.TextEncoder ??= TextEncoder

let hasVisiblePicadeMaxGamepad
let requestPicadeSerialPortFromUserGesture

beforeAll(async () => {
	;({
		hasVisiblePicadeMaxGamepad,
		requestPicadeSerialPortFromUserGesture,
	} = await import('../source/hardware/gamepad/picade-serial-pairing.js'))
})

describe('picade serial pairing', () => {
	test('detects browser-visible Picade Max gamepads before requesting serial', () => {
		expect(hasVisiblePicadeMaxGamepad([
			{ connected: true, id: 'GamePad 2 (Vendor: 2e8a Product: 1098)' },
		])).toBe(true)
		expect(hasVisiblePicadeMaxGamepad([
			{ connected: true, id: 'GamePad 0 (Vendor: 045e Product: 02ea)' },
		])).toBe(false)
	})

	test('uses an already paired Picade serial port without opening the picker', async () => {
		const port = {
			getInfo: () => ({ usbVendorId: 0x2e8a, usbProductId: 0x1098 }),
		}
		const serial = {
			getPorts: jest.fn(async () => [port]),
			requestPort: jest.fn(),
		}

		await expect(requestPicadeSerialPortFromUserGesture(serial)).resolves.toEqual({
			status: 'paired',
			port,
		})
		expect(serial.requestPort).not.toHaveBeenCalled()
	})

	test('requests the Picade serial port with the Picade filters when not paired', async () => {
		const port = {
			getInfo: () => ({ usbVendorId: 0x2e8a, usbProductId: 0x1098 }),
		}
		const serial = {
			getPorts: jest.fn(async () => []),
			requestPort: jest.fn(async () => port),
		}

		await expect(requestPicadeSerialPortFromUserGesture(serial)).resolves.toEqual({
			status: 'selected',
			port,
		})
		expect(serial.requestPort).toHaveBeenCalledWith({
			filters: expect.arrayContaining([
				expect.objectContaining({ usbVendorId: 0x2e8a, usbProductId: 0x1098 }),
				expect.objectContaining({ usbVendorId: 0xcafe, usbProductId: 0x400d }),
			]),
		})
	})
})
