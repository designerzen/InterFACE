import { createMouthCurveEditor } from './mouth-curve-editor.js'
import {
	MOUTH_DYNAMICS_PRESETS, MOUTH_CURVE_CUSTOM, DEFAULT_MOUTH_DYNAMICS,
	normaliseMouthDynamics, normaliseMouthGate, normaliseLipRange,
	getMouthDynamicsPresetId, formatLipSetting, parseMouthCurve
} from '../people/lip-sensitivity.js'

/**
 * Mouth dynamics panel: loudness curve, presets, note gate and opening range.
 * @param {Object} options
 * @param {Function} options.get read a saved global value
 * @param {Function} options.set save a global value
 * @param {Function} options.apply send a value to every player
 * @param {Function} options.getOpening current player position on the curve, 0–1
 */
export const setupMouthDynamicsInterface = ({get, set, apply, getOpening=() => null, document=globalThis.document}) => {
	const panel = document.getElementById('mouth-dynamics-settings')
	if (!panel) return null
	const folder = panel.closest('.folder-menu')
	const select = document.getElementById('select-mouth-dynamics')
	const status = document.getElementById('mouth-curve-status')
	// Reset returns to the last chosen preset rather than discarding it.
	let basePreset = DEFAULT_MOUTH_DYNAMICS

	for (const [value, label] of [...MOUTH_DYNAMICS_PRESETS.map(({id, label, description}) => [id, `${label} — ${description}`]), [MOUTH_CURVE_CUSTOM, 'Custom']]) {
		const option = document.createElement('option')
		option.value = value
		option.textContent = label
		if (value === MOUTH_CURVE_CUSTOM) option.disabled = true
		select.append(option)
	}

	const syncSelect = curve => {
		const id = getMouthDynamicsPresetId(curve)
		select.value = id
		if (id !== MOUTH_CURVE_CUSTOM) basePreset = id
	}
	const applyCurve = (points, save) => {
		const curve = normaliseMouthDynamics(points)
		apply('mouthDynamics', curve)
		syncSelect(curve)
		if (save) {
			set('mouthDynamics', curve)
			status.value = `${formatLipSetting('mouthDynamics', curve)} applied to all players.`
		}
		return curve
	}

	const initialCurve = normaliseMouthDynamics(get('mouthDynamics'))
	const editor = createMouthCurveEditor(document.getElementById('mouth-curve-editor'), {
		document,
		points:initialCurve,
		onInput:points => applyCurve(points, false),
		onChange:points => applyCurve(points, true)
	})
	applyCurve(initialCurve, false)

	select.addEventListener('change', () => {
		const preset = MOUTH_DYNAMICS_PRESETS.find(({id}) => id === select.value)
		if (!preset) return
		basePreset = preset.id
		editor.setPoints(preset.points)
		applyCurve(preset.points, true)
	})
	document.getElementById('mouth-curve-reset')?.addEventListener('click', () => {
		const points = parseMouthCurve(basePreset)
		editor.setPoints(points)
		applyCurve(points, true)
	})

	// Gate and range share one pattern: preview immediately, save on release.
	for (const [key, id, normalise, toPlayer] of [
		['mouthGate', 'mouth-gate', normaliseMouthGate, value => ({ mouthCutOff:value / 100, mouthSilence:value / 200 })],
		['lipRange', 'lip-range', normaliseLipRange, value => ({ lipRange:value })]
	]) {
		const input = document.getElementById(id)
		const output = document.getElementById(`${id}-output`)
		if (!input) continue
		const update = (value, save) => {
			const amount = normalise(value)
			input.value = amount
			const label = formatLipSetting(key, amount)
			if (output) output.value = label
			input.setAttribute('aria-valuetext', label)
			for (const [option, setting] of Object.entries(toPlayer(amount))) apply(option, setting)
			if (save) set(key, amount)
		}
		update(get(key), false)
		input.addEventListener('input', event => update(event.target.value, false))
		input.addEventListener('change', event => update(event.target.value, true))
	}

	for (const type of ['keydown', 'keyup']) panel.addEventListener(type, event => {
		if (event.target.matches('input,select') && !['Tab', 'Escape'].includes(event.key)) event.stopPropagation()
	})

	// Keep the drawer open while dragging handles; :focus-within alone
	// closes it when the pointer leaves a focused control.
	const close = () => {
		folder.classList.remove('open')
		folder.classList.add('mouth-dismissed')
		if (document.defaultView.location.hash === '#folder-mouth') document.defaultView.history.replaceState(null, '', document.defaultView.location.pathname + document.defaultView.location.search)
		if (!document.getElementById('control-panel')?.classList.contains('controls-list-open')) {
			(document.getElementById('button-settings') ?? document.getElementById('button-controls-list'))?.focus({preventScroll:true})
		}
	}
	// Follow the live mouth only while the panel is visible.
	let markerFrame
	const isOpen = () => !folder.classList.contains('mouth-dismissed') && (folder.matches('.open, .controls-list-folder-open, :focus-within') || document.defaultView.location.hash === '#folder-mouth')
	const trackMarker = () => {
		if (!isOpen()) {
			editor.setMarker(null)
			markerFrame = undefined
			return
		}
		editor.setMarker(getOpening())
		markerFrame = document.defaultView.requestAnimationFrame(trackMarker)
	}
	const startMarker = () => {
		if (markerFrame === undefined) markerFrame = document.defaultView.requestAnimationFrame(trackMarker)
	}
	const open = () => {
		folder.classList.remove('mouth-dismissed')
		folder.classList.add('open')
		startMarker()
	}
	folder.addEventListener('focusin', startMarker)
	folder.querySelector('.folder-link')?.addEventListener('click', open)
	panel.addEventListener('pointerdown', open, true)
	folder.querySelector('.folder-content > a[href="#control-panel"]')?.addEventListener('click', close)
	folder.addEventListener('keydown', event => {
		if (event.key === 'Escape' && !document.getElementById('control-panel')?.classList.contains('controls-list-open')) { event.preventDefault(); event.stopPropagation(); close() }
	})

	return { editor, setMarker:editor.setMarker }
}
