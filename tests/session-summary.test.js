import { getVisitCount, isReturningUser, updateSummaryText } from '../source/dom/session-summary.js'

const renderSummaries = () => {
	document.body.innerHTML = `
		<p class="new-client" aria-label="summary">First visit</p>
		<p class="returning-client" aria-label="Summary" hidden>Welcome back</p>
	`
}

describe('session summary', () => {
	test('shows the first-visit summary for a new user', () => {
		renderSummaries()

		expect(updateSummaryText(false)).toBe(true)
		expect(document.querySelector('.new-client').hidden).toBe(false)
		expect(document.querySelector('.returning-client').hidden).toBe(true)
	})

	test('shows the returning summary when a previous session was saved', () => {
		renderSummaries()

		expect(updateSummaryText(true)).toBe(true)
		expect(document.querySelector('.new-client').hidden).toBe(true)
		expect(document.querySelector('.returning-client').hidden).toBe(false)
	})

	test('recognises a stored completed session', () => {
		const storage = {
			getItem: () => JSON.stringify({ meta: { count: 1 } }),
		}

		expect(isReturningUser(storage)).toBe(true)
	})

	test('returns the stored visit count for wallpaper selection', () => {
		const storage = {
			getItem: () => JSON.stringify({ meta: { count: 7 } }),
		}

		expect(getVisitCount(storage)).toBe(7)
	})

	test('treats missing or invalid storage as a first visit', () => {
		expect(isReturningUser({ getItem: () => null })).toBe(false)
		expect(isReturningUser({ getItem: () => '{invalid' })).toBe(false)
	})
})
