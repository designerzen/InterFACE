import {
	compressQueryString,
	mergeEncodedAndRawQueryParams,
	fromURLSafeBase64,
	toURLSafeBase64,
	uncompressQueryString
} from '../source/utils/state-encoding.js'

describe('state encoding', () => {
	test('round trips a query string through a compact url-safe payload', () => {
		const queryString = 'players=2&qr=true&theme=theme-mit&p-1-inputMode=1'
		const encoded = compressQueryString(queryString)

		expect(encoded).not.toContain('=')
		expect(encoded).not.toContain('+')
		expect(encoded).not.toContain('/')
		expect(uncompressQueryString(encoded)).toBe(queryString)
	})

	test('restores removed base64 padding when decoding', () => {
		const original = 'QUJDRA=='
		const safe = toURLSafeBase64(original)

		expect(safe).toBe('QUJDRA')
		expect(fromURLSafeBase64(safe)).toBe(original)
	})

	test('merges encoded and raw query params and lets raw values override encoded ones', () => {
		const encoded = compressQueryString('players=2&qr=true&theme=theme-mit')
		const merged = mergeEncodedAndRawQueryParams(
			{ players:1, qr:false, theme:'theme-default' },
			new URLSearchParams(`b=${encoded}&players=4&p-1-inputMode=1`),
			compressed => new URLSearchParams(uncompressQueryString(compressed)),
			value => value === 'true' ? true : /^[0-9]+$/.test(value) ? parseInt(value, 10) : value
		)

		expect(merged.players).toBe(4)
		expect(merged.qr).toBe(true)
		expect(merged.theme).toBe('theme-mit')
		expect(merged['p-1-inputMode']).toBe(1)
		expect(merged.b).toBeUndefined()
	})
})
