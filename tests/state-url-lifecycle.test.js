jest.mock('../source/settings/options.js', () => ({
	getDomainDefaults: jest.fn(() => ({})),
	getFactoryDefaults: jest.fn(),
}))

const StateWithIO = require('../source/utils/state-io.js').default
const { compressQueryString, decodeState, encodeState } = require('../source/utils/state-encoding.js')
const { createStateFromHost } = require('../source/utils/state.js')

const getEncoded = () => new URLSearchParams(window.location.search).get('s')

describe('state URL lifecycle', () => {
	let state
	let listeners

	beforeEach(() => {
		jest.useFakeTimers()
		window.history.replaceState(null, '', '/instrument')
		listeners = jest.spyOn(window, 'addEventListener')
		state = new StateWithIO(document.documentElement)
		state.controlUI = false
	})

	afterEach(() => {
		for (const [type, callback] of listeners.mock.calls) {
			window.removeEventListener(type, callback)
		}
		jest.useRealTimers()
		jest.restoreAllMocks()
		StateWithIO.instance = undefined
	})

	test('reads legacy compressed links with raw overrides and rewrites them compactly without adding history', () => {
		const encoded = compressQueryString('players=2&qr=true&theme=theme-mit')
		window.history.replaceState(null, '', `/instrument?b=${encoded}&players=4#folder-options`)
		const historyLength = window.history.length
		state.loadFromLocation({ players: 1, qr: false })

		expect(state.asObject).toEqual({ players: 4, qr: true, theme: 'theme-mit' })
		expect([...new URLSearchParams(window.location.search).keys()]).toEqual(['s'])
		expect(decodeState(getEncoded())).toMatchObject({ players: 4, qr: true, theme: 'theme-mit' })
		expect(window.location.hash).toBe('#folder-options')
		expect(window.history.length).toBe(historyLength)
	})

	test('reads readable links and keeps values with commas as strings', () => {
		window.history.replaceState(null, '', '/instrument?players=2&p-1=12,soundfont,-1&drumkit=808')
		state.loadFromLocation({ drumkit: '' })
		expect(state.get('players')).toBe(2)
		expect(state.get('p-1')).toBe('12,soundfont,-1')
		// raw values are parsed strictly, so a numeric looking name becomes a number
		expect(state.get('drumkit')).toBe(808)
	})

	test('restores the same state from its own link', () => {
		state.loadFromLocation({ players: 1, drumkit: '' })
		state.set('players', 3, null, false)
		state.set('drumkit', '808', null, false)
		state.set('p-2', '4,soundfont,-1,true', null, false)
		jest.runAllTimers()
		const expected = state.asObject

		const other = new StateWithIO(document.documentElement)
		other.controlUI = false
		other.loadFromLocation({ players: 1, drumkit: '' })
		expect(other.asObject).toMatchObject(expected)
		expect(other.get('drumkit')).toBe('808')
	})

	test('batches a burst of changes into one history entry', () => {
		state.loadFromLocation({ volume: 0.5 })
		const historyLength = window.history.length
		for (let i = 1; i <= 20; i++) {
			state.set('volume', i / 20, null, false)
			jest.advanceTimersByTime(50)
		}
		expect(window.history.length).toBe(historyLength)
		jest.advanceTimersByTime(state.locationUpdateDelay)
		expect(window.history.length).toBe(historyLength + 1)
		expect(decodeState(getEncoded()).volume).toBe(1)
	})

	test('flushes a pending change when leaving the page without adding history twice', () => {
		state.loadFromLocation({ players: 1 })
		const historyLength = window.history.length
		state.set('players', 4, null, false)
		window.dispatchEvent(new Event('pagehide'))
		expect(decodeState(getEncoded()).players).toBe(4)
		expect(window.history.length).toBe(historyLength + 1)
		jest.runAllTimers()
		expect(window.history.length).toBe(historyLength + 1)
	})

	test('keeps the open panel hash on every write', () => {
		window.history.replaceState(null, '', '/instrument#folder-volume')
		state.loadFromLocation({ players: 1 })
		state.set('players', 2, null, false)
		jest.runAllTimers()
		expect(window.location.hash).toBe('#folder-volume')
		expect(state.asURI.endsWith('#folder-volume')).toBe(true)
	})

	test('only compresses again when the state changes', () => {
		state.loadFromLocation({ players: 1 })
		const first = state.createEncodedString()
		expect(state.createEncodedString()).toBe(first)
		state.set('players', 2, null, false)
		expect(state.createEncodedString()).not.toBe(first)
	})

	test('notifies location listeners with each settled URL', () => {
		const seen = []
		state.addLocationListener(href => seen.push(href))
		state.loadFromLocation({ players: 1 })
		state.set('players', 2, null, false)
		jest.runAllTimers()
		expect(seen.at(-1)).toBe(window.location.href)
		expect(decodeState(new URL(seen.at(-1)).searchParams.get('s')).players).toBe(2)
	})

	test('falls back to defaults for a broken link', () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
		window.history.replaceState(null, '', `/instrument?s=${encodeState([['players', 3]]).slice(0, 4)}&qr=true`)
		state.loadFromLocation({ players: 1, qr: false })
		expect(state.asObject).toEqual({ players: 1, qr: true })
		window.history.replaceState(null, '', '/instrument?s=99.abc')
		state.loadFromLocation({ players: 1 })
		expect(state.get('players')).toBe(1)
		expect(warn).toHaveBeenCalled()
	})

	test('does not change the URL before loading or when history saving is disabled', () => {
		window.dispatchEvent(new Event('pagehide'))
		expect(window.location.search).toBe('')
		state.saveHistory = false
		state.loadFromLocation({ players: 2 })
		state.set('players', 3, null, false)
		jest.runAllTimers()
		window.dispatchEvent(new Event('pagehide'))
		expect(window.location.search).toBe('')
	})

	test('host initialization replaces the landing entry', () => {
		StateWithIO.instance = state
		const historyLength = window.history.length
		createStateFromHost(document.documentElement, { players: 2 }, StateWithIO)
		expect(decodeState(getEncoded()).players).toBe(2)
		expect(window.history.length).toBe(historyLength)
	})
})
