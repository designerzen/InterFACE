let PICADE_MAX_MANUFACTURER
let PICADE_MAX_PRODUCT_NAME
let getPicadeMaxGamepadInfo

beforeAll(async () => {
	;({
		PICADE_MAX_MANUFACTURER,
		PICADE_MAX_PRODUCT_NAME,
		getPicadeMaxGamepadInfo,
	} = await import('../source/hardware/gamepad/picade-max-interface.js'))
})

describe('picade-max-interface device identification', () => {
	test('identifies the Picade Max USB controller from the browser gamepad ID', () => {
		for (const { id, vendorId, productId } of [
			{
				id: 'GamePad 2 (Vendor: 2e8a Product: 1098)',
				vendorId: 0x2e8a,
				productId: 0x1098,
			},
			{
				id: 'GamePad 1 (Vendor: cafe Product: 400d)',
				vendorId: 0xcafe,
				productId: 0x400d,
			},
			{
				id: 'Picade Max Input VID 0xcafe PID 0x400d',
				vendorId: 0xcafe,
				productId: 0x400d,
			},
			{
				id: 'Picade Max Input vendorId: cafe productId: 400d',
				vendorId: 0xcafe,
				productId: 0x400d,
			},
		]) {
			const device = getPicadeMaxGamepadInfo({ id })

			expect(device).toMatchObject({
				vendorId,
				productId,
				manufacturer: PICADE_MAX_MANUFACTURER,
				productName: PICADE_MAX_PRODUCT_NAME,
			})
		}
	})

	test('does not identify unrelated USB gamepads as Picade Max controllers', () => {
		expect(getPicadeMaxGamepadInfo({
			id: 'GamePad 0 (Vendor: 045e Product: 02ea)',
		})).toBeNull()
	})

	test('identifies wrapped app GamePad objects from the browser gamepad metadata', () => {
		const device = getPicadeMaxGamepadInfo({
			gamepad: {
				id: 'GamePad 1 (Vendor: cafe Product: 400d)',
			},
		})

		expect(device).toMatchObject({
			vendorId: 0xcafe,
			productId: 0x400d,
			manufacturer: PICADE_MAX_MANUFACTURER,
			productName: PICADE_MAX_PRODUCT_NAME,
		})
	})
})
