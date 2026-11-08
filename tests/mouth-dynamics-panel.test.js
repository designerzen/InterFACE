/** @jest-environment jsdom */
import { setupMouthDynamicsInterface } from '../source/dom/ui.mouth-dynamics.js'
import { normaliseMouthDynamics, parseMouthCurve } from '../source/people/lip-sensitivity.js'

const setup = (saved={}) => {
	document.body.innerHTML = `<div id="control-panel"><div class="folder-menu"><a class="folder-link" href="#folder-mouth">Mouth</a><menu class="folder-content" id="folder-mouth">
		<fieldset id="mouth-dynamics-settings"><select id="select-mouth-dynamics"></select><figure id="mouth-curve-editor"></figure>
		<button id="mouth-curve-reset" type="button"></button><output id="mouth-curve-status"></output>
		<input id="mouth-gate" type="range" min="0" max="40"><output id="mouth-gate-output"></output>
		<input id="lip-range" type="range" min="0" max="100"><output id="lip-range-output"></output></fieldset>
		<a class="folder-return" href="#control-panel">Return</a></menu></div></div>`
	const state = { ...saved }
	const players = {}
	const ui = setupMouthDynamicsInterface({ get:key => state[key], set:(key, value) => { state[key] = value }, apply:(key, value) => { players[key] = value } })
	return { ui, state, players, select:document.getElementById('select-mouth-dynamics') }
}
const handles = () => [...document.querySelectorAll('.mouth-curve-handle:not(.fixed)')]

test('restores a saved curve, applies it to players and shows the preset', () => {
	const { players, select } = setup({ mouthDynamics:'whisper', mouthGate:10, lipRange:40 })
	expect(select.value).toBe('whisper')
	expect(players.mouthDynamics).toBe(normaliseMouthDynamics('whisper'))
	expect(players.mouthCutOff).toBeCloseTo(0.1)
	expect(players.mouthSilence).toBeCloseTo(0.05)
	expect(players.lipRange).toBe(40)
	expect(handles()).toHaveLength(3)
})

test('choosing a preset redraws handles and saves it', () => {
	const { state, select } = setup()
	select.value = 'linear'
	select.dispatchEvent(new Event('change'))
	expect(state.mouthDynamics).toBe(normaliseMouthDynamics('linear'))
	expect(handles()).toHaveLength(0)
})

test('keyboard edits make a custom curve, Delete removes a handle and reset restores the preset', () => {
	const { state, players, select } = setup({ mouthDynamics:'gentle' })
	const [first] = handles()
	first.focus()
	first.dispatchEvent(new KeyboardEvent('keydown', { key:'ArrowDown', shiftKey:true, bubbles:true }))
	expect(parseMouthCurve(state.mouthDynamics)[1]).toEqual([25, 0])
	expect(players.mouthDynamics).toBe(state.mouthDynamics)
	expect(select.value).toBe('custom')
	// Handles cannot pass their neighbours.
	for (let i = 0; i < 10; i++) first.dispatchEvent(new KeyboardEvent('keydown', { key:'ArrowRight', shiftKey:true, bubbles:true }))
	expect(parseMouthCurve(state.mouthDynamics)[1][0]).toBe(48)
	handles()[0].dispatchEvent(new KeyboardEvent('keydown', { key:'Delete', bubbles:true }))
	expect(parseMouthCurve(state.mouthDynamics)).toHaveLength(4)
	document.getElementById('mouth-curve-reset').click()
	expect(state.mouthDynamics).toBe(normaliseMouthDynamics('gentle'))
	expect(select.value).toBe('gentle')
})

test('gate slider previews while dragging and saves on release', () => {
	const { state, players } = setup()
	const gate = document.getElementById('mouth-gate')
	gate.value = '20'
	gate.dispatchEvent(new Event('input'))
	expect(players.mouthCutOff).toBeCloseTo(0.2)
	expect(state.mouthGate).toBeUndefined()
	gate.dispatchEvent(new Event('change'))
	expect(state.mouthGate).toBe(20)
	expect(document.getElementById('mouth-gate-output').value).toBe('20%')
})
