jest.mock('../source/settings/options.js', () => ({
	getDomainDefaults: jest.fn(() => ({})),
	getFactoryDefaults: jest.fn(),
}))

const StateWithIO = require('../source/utils/state-io.js').default
const { compressQueryString, uncompressQueryString } = require('../source/utils/state-encoding.js')
const { createStateFromHost } = require('../source/utils/state.js')

describe('state URL lifecycle', () => {
	let state
	let listeners

	beforeEach(() => {
		window.history.replaceState(null, '', '/instrument')
		listeners = jest.spyOn(window, 'addEventListener')
		state = new StateWithIO(document.documentElement)
		state.controlUI = false
	})

	afterEach(() => {
		for (const [type, callback] of listeners.mock.calls) {
			window.removeEventListener(type, callback)
		}
		jest.restoreAllMocks()
		StateWithIO.instance = undefined
	})

	test('expands compressed landing URLs with raw overrides without adding history', () => {
		const encoded = compressQueryString('players=2&qr=true&theme=theme-mit')
		window.history.replaceState(null, '', `/instrument?b=${encoded}&players=4#folder-options`)
		const historyLength = window.history.length
		state.loadFromLocation({ players: 1, qr: false })

		expect(state.asObject).toEqual({ players: 4, qr: true, theme: 'theme-mit' })
		expect(new URLSearchParams(window.location.search).has('b')).toBe(false)
		expect(new URLSearchParams(window.location.search).get('players')).toBe('4')
		expect(window.location.hash).toBe('#folder-options')
		expect(window.history.length).toBe(historyLength)
	})

	test('keeps normal edits readable and compresses the latest state only on exit', () => {
		window.history.replaceState(null, '', '/instrument?players=2&theme=日本語#folder-options')
		const compress = jest.spyOn(state, 'compressString')
		state.loadFromLocation({ qr: false })
		state.set('players', 3, null, false)
		state.updateLocation()
		expect(compress).not.toHaveBeenCalled()
		expect(new URLSearchParams(window.location.search).get('players')).toBe('3')
		const historyLength = window.history.length
		const expected = state.asObject

		window.dispatchEvent(new Event('pagehide'))

		const query = new URLSearchParams(window.location.search)
		expect([...query.keys()]).toEqual(['b'])
		expect(new URLSearchParams(uncompressQueryString(query.get('b'))).get('players')).toBe('3')
		expect(compress).toHaveBeenCalledTimes(1)
		expect(window.history.length).toBe(historyLength)
		expect(window.location.hash).toBe('#folder-options')
		expect(window.history.state).toEqual(expected)

		// A fresh load must restore the same state from the compressed URL.
		state.loadFromLocation({})
		expect(state.asObject).toEqual(expected)
		expect(new URLSearchParams(window.location.search).has('b')).toBe(false)
	})

	test('restores readable options when returning from the back/forward cache', () => {
		state.loadFromLocation({ players: 2 })
		const historyLength = window.history.length
		window.dispatchEvent(new Event('pagehide'))
		window.dispatchEvent(new Event('pageshow'))
		expect(window.location.search).toBe('?players=2')
		expect(window.history.length).toBe(historyLength)
		state.set('players', 4, null, false)
		expect(window.location.search).toBe('?players=4')
	})

	test('does not change the URL before loading or when history saving is disabled', () => {
		window.dispatchEvent(new Event('pagehide'))
		window.dispatchEvent(new Event('pageshow'))
		expect(window.location.search).toBe('')
		state.saveHistory = false
		state.loadFromLocation({ players: 2 })
		window.dispatchEvent(new Event('pagehide'))
		window.dispatchEvent(new Event('pageshow'))
		expect(window.location.search).toBe('')
	})

	test('host initialization replaces the landing entry', () => {
		StateWithIO.instance = state
		const historyLength = window.history.length
		createStateFromHost(document.documentElement, { players: 2 }, StateWithIO)
		expect(window.location.search).toBe('?players=2')
		expect(window.history.length).toBe(historyLength)
	})
})
