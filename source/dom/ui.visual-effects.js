import { populateSelect } from './select.js'
import { AUDIO_VISUALISER_MODES, MTV_MODES, getVisualiserMode, normaliseVisualiser, normaliseMTVStrength } from '../visual/visualiser-modes.js'

export const setupVisualEffectsMenus = ({ state, setDiscoMode, stopButterchurn, spectrogramToggle, document = globalThis.document }) => {
	// Move previously saved Butterchurn choices out of the audio visualiser setting.
	const previousMode = getVisualiserMode(state.get('visualiser'))
	if (previousMode.renderer === 'butterchurn') {
		state.set('mtvEffect', previousMode.id)
		state.set('disco', !!state.get('spectrogram'))
		state.set('visualiser', 'vu')
	}
	const audio = populateSelect(document.getElementById('select-viz'), [
		...AUDIO_VISUALISER_MODES.map(mode => ({ value:mode.id, label:mode.label })),
		{ value:'off', label:'Off' }
	])
	const mtv = populateSelect(document.getElementById('select-mtv'), [
		{ value:'off', label:'Off' },
		{ value:'disco', label:'Classic MTV' },
		...MTV_MODES.map(mode => ({ value:mode.id, label:mode.label }))
	])
	const strength = document.getElementById('mtv-strength')
	const strengthValue = document.getElementById('mtv-strength-value')
	const syncStrength = () => {
		const percent = Math.round(normaliseMTVStrength(state.get('mtvStrength')) * 100)
		if (strength) {
			strength.value = String(percent)
			strength.setAttribute('aria-valuetext', `${percent}%`)
		}
		if (strengthValue) strengthValue.value = `${percent}%`
	}
	strength?.addEventListener('input', () => {
		state.set('mtvStrength', normaliseMTVStrength(Number(strength.value) / 100))
	})
	const sync = () => {
		if (spectrogramToggle) spectrogramToggle.checked = !!state.get('spectrogram')
		if (audio) audio.value = state.get('spectrogram') ? normaliseVisualiser(state.get('visualiser')) : 'off'
		const effect = state.get('mtvEffect')
		const isButterchurn = MTV_MODES.some(mode => mode.id === effect)
		if (mtv) {
			mtv.value = state.get('disco') ? (isButterchurn ? effect : 'disco') : 'off'
			mtv.parentElement.classList.toggle('checked', !!state.get('disco'))
		}
		const toggle = document.getElementById('button-disco')
		if (toggle) toggle.checked = !!state.get('disco')
		if (!state.get('disco') || !isButterchurn) stopButterchurn()
	}
	audio?.addEventListener('change', () => {
		const enabled = audio.value !== 'off'
		if (enabled) state.set('visualiser', normaliseVisualiser(audio.value))
		state.set('spectrogram', enabled)
	})
	mtv?.addEventListener('change', () => {
		const selected = mtv.value
		if (selected !== 'off') state.set('mtvEffect', selected)
		setDiscoMode(selected !== 'off')
	})
	state.addEventListener(key => {
		if (['spectrogram', 'visualiser', 'disco', 'mtvEffect'].includes(key)) sync()
		if (key === 'mtvStrength') syncStrength()
	})
	sync()
	syncStrength()
	return { audio, mtv, strength }
}
