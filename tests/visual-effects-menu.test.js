import { setupVisualEffectsMenus } from '../source/dom/ui.visual-effects.js'
import { MTV_MODES, getMTVMode, normaliseMTVStrength } from '../source/visual/visualiser-modes.js'
import pug from 'pug'

const fixture = (saved = {}) => {
	document.body.innerHTML = '<label><select id="select-viz"></select></label><label><select id="select-mtv"></select></label><input id="button-disco" type="checkbox"><input id="mtv-strength" type="range" min="0" max="100"><output id="mtv-strength-value"></output>'
	const values = { visualiser:'vu', spectrogram:true, disco:false, mtvEffect:'disco', ...saved }
	const listeners = []
	const state = {
		get:key => values[key],
		set(key, value){ values[key] = value; listeners.forEach(listener => listener(key)) },
		addEventListener:listener => listeners.push(listener)
	}
	const stopButterchurn = jest.fn()
	const menus = setupVisualEffectsMenus({ state, setDiscoMode:enabled => state.set('disco', enabled), stopButterchurn })
	const select = (control, value) => { control.value = value; control.dispatchEvent(new Event('change')) }
	return { ...menus, state, select, stopButterchurn }
}

test('all named effects live in MTV and are absent from the VU menu', () => {
	const { audio, mtv } = fixture()
	for (const mode of MTV_MODES) {
		expect(Array.from(mtv.options).find(option => option.value === mode.id)?.textContent).toContain(mode.label)
		expect(Array.from(audio.options).some(option => option.value === mode.id)).toBe(false)
	}
})

test('control panel provides a visible MTV selector and retains the device toggle', () => {
	document.body.innerHTML = pug.renderFile('source/partials/control-panel.pug')
	expect(document.querySelector('label[for="select-mtv"] select#select-mtv')).not.toBe(null)
	expect(document.getElementById('select-mtv').closest('[hidden]')).toBe(null)
	expect(document.getElementById('button-disco').closest('[hidden]')).not.toBe(null)
	expect(document.getElementById('mtv-strength').value).toBe('50')
	const strength = document.getElementById('mtv-strength')
	expect(strength.closest('#shared-controls')).toBe(null)
	expect(strength.closest('#settings .settings-folder .control-settings')).not.toBe(null)
	expect(strength.closest('label').className).toBe('control-settings-field')
	expect(document.querySelector('#settings a[href="#folder-mtv"]')).not.toBe(null)
})

test('strength updates immediately, restores saved values, and persists across effect changes', () => {
	const { strength, mtv, state, select } = fixture({ mtvStrength:0.72 })
	expect(strength.value).toBe('72')
	for (const percent of [0, 50, 100]) {
		strength.value = String(percent)
		strength.dispatchEvent(new Event('input'))
		expect(state.get('mtvStrength')).toBe(percent / 100)
		expect(document.getElementById('mtv-strength-value').value).toBe(`${percent}%`)
		expect(strength.getAttribute('aria-valuetext')).toBe(`${percent}%`)
	}
	select(mtv, 'butterchurn-screen')
	select(mtv, 'butterchurn-color')
	expect(state.get('mtvStrength')).toBe(1)
	state.set('mtvStrength', 0.3)
	expect(strength.value).toBe('30')
})

test('strength defaults to 50% and clamps stored settings without losing zero', () => {
	expect(fixture().strength.value).toBe('50')
	for (const [value, expected] of [[0, 0], [1, 1], [-1, 0], [2, 1], ['0.6', 0.6], [null, 0.5], ['invalid', 0.5]]) {
		expect(normaliseMTVStrength(value)).toBe(expected)
	}
})

test('MTV and VU selections run independently, and switching MTV off stops Butterchurn', () => {
	const { audio, mtv, state, select, stopButterchurn } = fixture()
	select(mtv, 'butterchurn-screen')
	expect(getMTVMode(state.get('disco'), state.get('mtvEffect')).id).toBe('butterchurn-screen')
	expect(audio.value).toBe('vu')
	select(audio, 'off')
	expect(mtv.value).toBe('butterchurn-screen')
	select(audio, 'wave')
	select(mtv, 'off')
	expect(stopButterchurn).toHaveBeenCalled()
	expect(audio.value).toBe('wave')
	expect(getMTVMode(state.get('disco'), state.get('mtvEffect'))).toBe(null)
	state.set('disco', true)
	expect(mtv.value).toBe('butterchurn-screen')
	expect(document.getElementById('button-disco').checked).toBe(true)
})

test('saved effects migrate into MTV while classic disco and disabled effects remain supported', () => {
	let menus = fixture({ visualiser:'butterchurn-soft-light' })
	expect(menus.mtv.value).toBe('butterchurn-soft-light')
	expect(menus.audio.value).toBe('vu')
	menus = fixture({ disco:true })
	expect(menus.mtv.value).toBe('disco')
	expect(getMTVMode(true, 'disco')).toBe(null)
	menus = fixture({ visualiser:'butterchurn-screen', spectrogram:false })
	expect(menus.mtv.value).toBe('off')
	expect(menus.audio.value).toBe('off')
})
