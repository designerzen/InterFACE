/** @jest-environment jsdom */
import { setupHeadMovementInterface } from '../source/dom/ui.head-movement.js'

const setup = (saved={}) => {
	document.body.innerHTML = `<div id="control-panel"><div class="folder-menu"><a class="folder-link" href="#folder-head">Head</a><menu class="folder-content" id="folder-head">
		<fieldset id="head-movement-settings">
		<input id="head-note-range" type="range" min="20" max="120"><output id="head-note-range-output"></output>
		<input id="head-vertical-range" type="range" min="20" max="120"><output id="head-vertical-range-output"></output>
		<input id="head-vertical-offset" type="range" min="-30" max="30"><output id="head-vertical-offset-output"></output>
		<button type="button" data-head-target="head-vertical-range" data-head-step="5">+</button></fieldset>
		<a class="folder-return" href="#control-panel">Return</a></menu></div></div>`
	const state = { ...saved }
	const players = {}
	const messages = []
	const ui = setupHeadMovementInterface({ get:key => state[key], set:(key, value) => { state[key] = value }, apply:(key, value) => { players[key] = value }, onFeedback:message => messages.push(message) })
	return { ui, state, players, messages }
}

test('restores saved head settings and applies them to players', () => {
	const { players } = setup({ headNoteRangeDegrees:60, headVerticalRangeDegrees:45, headVerticalOffsetDegrees:-5 })
	expect(players).toEqual({ headNoteRangeDegrees:60, headVerticalRangeDegrees:45, headVerticalOffsetDegrees:-5 })
	expect(document.getElementById('head-vertical-offset-output').value).toBe('-5°')
})

test('defaults the neutral height above level', () => {
	const { players } = setup()
	expect(players.headVerticalOffsetDegrees).toBe(10)
	expect(document.getElementById('head-vertical-offset-output').value).toBe('+10°')
})

test('releasing a slider saves after the debounce and announces it', () => {
	jest.useFakeTimers()
	const { state, messages } = setup()
	const offset = document.getElementById('head-vertical-offset')
	offset.value = '20'
	offset.dispatchEvent(new Event('change'))
	expect(document.getElementById('head-vertical-offset-output').value).toBe('+20°')
	jest.advanceTimersByTime(200)
	expect(state.headVerticalOffsetDegrees).toBe(20)
	expect(messages.at(-1)).toBe('Head neutral height set to +20°')
	jest.useRealTimers()
})

test('closing the folder marks it dismissed', () => {
	setup()
	const folder = document.querySelector('.folder-menu')
	folder.querySelector('.folder-link').click()
	expect(folder.classList.contains('open')).toBe(true)
	folder.querySelector('.folder-return').click()
	expect(folder.classList.contains('head-dismissed')).toBe(true)
})

test('step buttons nudge a slider and update the face preview', () => {
	jest.useFakeTimers()
	const { state, messages } = setup({ headVerticalRangeDegrees:45 })
	const panel = document.getElementById('head-movement-settings')
	expect(panel.style.getPropertyValue('--head-vertical-range')).toBe('45')
	panel.querySelector('button[data-head-step]').click()
	expect(document.getElementById('head-vertical-range-output').value).toBe('50°')
	expect(panel.style.getPropertyValue('--head-vertical-range')).toBe('50')
	jest.advanceTimersByTime(200)
	expect(state.headVerticalRangeDegrees).toBe(50)
	expect(messages.at(-1)).toBe('Head nod range set to 50°')
	jest.useRealTimers()
})
