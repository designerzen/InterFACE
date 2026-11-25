import pug from 'pug'
import {showPlayerSelector} from '../source/dom/ui.player-selection.js'

beforeEach(() => {
	jest.useFakeTimers()
	document.documentElement.className = ''
	document.body.innerHTML = pug.renderFile('source/partials/onboarding.pug') +
		'<label for="button-music-factory">Music factory<input id="button-music-factory" type="checkbox"></label>'
})
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers() })

const state = values => {
	const entries = new Map(Object.entries({players:1, advancedMode:false, automationMode:false, musicFactory:false, ...values}))
	return {get:key => entries.get(key), set:(key, value) => entries.set(key, value)}
}

test.each([1, 2, 3, 4])('%i players can choose Music Factory independently of Simple/Expert mode', async count => {
	const settings = state({players:count})
	const selection = showPlayerSelector({maxFaces:4}, settings)
	const toggle = document.getElementById('toggle-music-factory')
	expect(toggle.classList.contains('switch')).toBe(true)
	expect(toggle.getAttribute('role')).toBe('switch')
	expect(toggle.closest('fieldset').id).toBe('complexity-selector')
	document.querySelector('label[for="toggle-music-factory"]').click()
	expect(settings.get('musicFactory')).toBe(true)
	expect(document.getElementById('button-music-factory').checked).toBe(true)
	expect(document.getElementById('music-factory-feedback').textContent).toContain('all players')
	expect(document.getElementById('toggle-advanced-mode').checked).toBe(false)
	document.getElementById('onboard').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}))
	jest.advanceTimersByTime(45)
	await expect(selection).resolves.toMatchObject({players:count, musicFactory:true, advancedMode:false})
})

test('restores Music Factory from saved settings and allows returning to Musical Instrument', async () => {
	const settings = state({musicFactory:true, advancedMode:true})
	const selection = showPlayerSelector({maxFaces:4}, settings)
	expect(document.getElementById('toggle-music-factory').checked).toBe(true)
	expect(document.getElementById('button-music-factory').checked).toBe(true)
	document.querySelector('label[for="toggle-music-factory"]').click()
	expect(settings.get('musicFactory')).toBe(false)
	expect(document.getElementById('button-music-factory').checked).toBe(false)
	expect(document.getElementById('music-factory-feedback').textContent).toContain('Musical instrument')
	document.getElementById('onboard').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}))
	jest.advanceTimersByTime(45)
	await expect(selection).resolves.toMatchObject({musicFactory:false, advancedMode:true})
})
