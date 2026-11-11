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

describe('versioned state links', () => {
	const {
		STATE_BASELINE_V1
	} = require('../source/utils/state-baseline.v1.js')
	const {
		createStateDelta,
		decodeState,
		encodeState,
		parseQueryValue,
		serialiseStateValue
	} = require('../source/utils/state-encoding.js')

	// Links from released builds must always decode the same way.
	// Never change these: add new ones when the format changes.
	const GOLDEN_V1 = {
		'1.AzVdDY0MQB1AIA10SjFw7iclDdiCA7KB7Q7UMShDlEZHXmp-HgA': {
			...STATE_BASELINE_V1,
			theme:'theme-neon',
			bpm:120,
			'p-1':'12,soundfont,-1',
			'p-1-inputMode':1
		}
	}

	test('only encodes values that differ from the baseline, in key order', () => {
		const delta = createStateDelta(Object.entries({
			...STATE_BASELINE_V1,
			theme:'theme-neon',
			bpm:120,
			'p-1-hue':10
		}))
		expect(delta).toBe('bpm=120&p-1-hue=10&theme=theme-neon')
		expect(createStateDelta(Object.entries(STATE_BASELINE_V1))).toBe('')
	})

	test('round trips state and restores the baseline for omitted values', () => {
		const encoded = encodeState(Object.entries({ theme:'theme-neon', bpm:120, drumkit:'808', masks:false, 'p-1':'12,soundfont,-1', 'p-1-inputMode':1 }))
		expect(encoded).toMatch(/^1\.[A-Za-z0-9_-]+$/)
		expect(decodeState(encoded)).toEqual({
			...STATE_BASELINE_V1,
			theme:'theme-neon',
			bpm:120,
			drumkit:'808',
			masks:false,
			'p-1':'12,soundfont,-1',
			'p-1-inputMode':1
		})
	})

	test('trims floating point noise', () => {
		expect(serialiseStateValue(0.1 + 0.2)).toBe('0.3')
		expect(serialiseStateValue(120)).toBe('120')
		expect(parseQueryValue('12,soundfont')).toBe('12,soundfont')
		expect(parseQueryValue('-0.5')).toBe(-0.5)
		expect(parseQueryValue('yes')).toBe(true)
	})

	test('is much shorter than the readable query', () => {
		const state = { ...STATE_BASELINE_V1, players:4, theme:'theme-neon', bpm:128, masks:false, voiceEngine:'fm' }
		for (let player = 1; player <= 4; player++) {
			state[`p-${player}`] = `${player * 3},soundfont,-1,true,amplitude-music,inherit,,,,`
			state[`p-${player}-noteSequence`] = 'circle-of-fifths'
			state[`p-${player}-octaveLow`] = 3
		}
		const readable = new URLSearchParams(Object.entries(state).map(([key, value]) => [key, String(value)])).toString()
		const encoded = encodeState(Object.entries(state))
		expect(encoded.length).toBeLessThan(readable.length / 10)
	})

	test('reads a single setting from readable, versioned and legacy links', () => {
		const { getLocationParam } = require('../source/utils/state-encoding.js')
		const encoded = encodeState(Object.entries({ room:'abcdef', backgroundEffect:'plasma', photoSensitive:true }))
		expect(getLocationParam('room', `?s=${encoded}`)).toBe('abcdef')
		expect(getLocationParam('photoSensitive', `?s=${encoded}`)).toBe('true')
		expect(getLocationParam('backgroundEffect', `?s=${encoded}&backgroundEffect=waves`)).toBe('waves')
		expect(getLocationParam('missing', `?s=${encoded}`)).toBeNull()
		expect(getLocationParam('room', `?b=${compressQueryString('room=legacy1')}`)).toBe('legacy1')
		expect(getLocationParam('room', '?players=2')).toBeNull()
	})

	test('decodes golden links from released builds', () => {
		for (const [link, expected] of Object.entries(GOLDEN_V1)) {
			expect(decodeState(link)).toEqual(expected)
		}
	})
})
