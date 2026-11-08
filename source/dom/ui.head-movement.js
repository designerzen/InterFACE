import { debounce } from '../utils/utils.js'
import {
	normaliseHeadNoteRangeDegrees,
	normaliseHeadVerticalOffsetDegrees,
	normaliseHeadVerticalRangeDegrees
} from '../people/head-note-range.js'

const formatDegrees = value => `${value}°`
const formatOffset = value => value > 0 ? `+${value}°` : `${value}°`

export const HEAD_MOVEMENT_CONTROLS = [
	['headNoteRangeDegrees', 'head-note-range', normaliseHeadNoteRangeDegrees, formatDegrees, 'Head lean range'],
	['headVerticalRangeDegrees', 'head-vertical-range', normaliseHeadVerticalRangeDegrees, formatDegrees, 'Head nod range'],
	['headVerticalOffsetDegrees', 'head-vertical-offset', normaliseHeadVerticalOffsetDegrees, formatOffset, 'Head neutral height']
]

/**
 * Head movement panel: lean range, nod range and the neutral height.
 * @param {Object} options
 * @param {Function} options.get read a saved global value
 * @param {Function} options.set save a global value
 * @param {Function} options.apply send a value to every player
 * @param {Function} [options.onFeedback] announce a released value
 */
export const setupHeadMovementInterface = ({get, set, apply, onFeedback, document=globalThis.document}) => {
	const panel = document.getElementById('head-movement-settings')
	if (!panel) return null
	const folder = panel.closest('.folder-menu')

	// Each slider previews immediately and sends to players after a pause.
	for (const [key, id, normalise, format, label] of HEAD_MOVEMENT_CONTROLS) {
		const input = document.getElementById(id)
		const output = document.getElementById(`${id}-output`)
		if (!input) continue
		const preview = value => {
			const amount = normalise(value)
			input.value = amount
			const text = format(amount)
			if (output) output.value = text
			input.setAttribute('aria-valuetext', text)
			// Drives the animated face beside the slider
			panel.style.setProperty(`--${id}`, amount)
			return amount
		}
		const commit = value => {
			const amount = normalise(value)
			set(key, amount)
			apply(key, amount)
		}
		const commitLater = debounce(commit, 150)
		commit(preview(get(key)))
		input.addEventListener('input', event => commitLater(preview(event.target.value)))
		input.addEventListener('change', event => {
			const amount = preview(event.target.value)
			commitLater(amount)
			onFeedback?.(`${label} set to ${format(amount)}`)
		})
	}

	// The − and + buttons nudge a slider as though it had been dragged and released.
	for (const button of panel.querySelectorAll('button[data-head-target][data-head-step]')) button.addEventListener('click', () => {
		const input = document.getElementById(button.dataset.headTarget)
		if (!input) return
		input.value = Number(input.value) + Number(button.dataset.headStep)
		input.dispatchEvent(new Event('change'))
	})

	for (const type of ['keydown', 'keyup']) panel.addEventListener(type, event => {
		if (event.target.matches('input') && !['Tab', 'Escape'].includes(event.key)) event.stopPropagation()
	})

	if (!folder) return { panel }
	// Keep the drawer open while dragging; :focus-within alone
	// closes it when the pointer leaves a focused slider.
	const close = () => {
		folder.classList.remove('open')
		folder.classList.add('head-dismissed')
		if (document.defaultView.location.hash === '#folder-head') document.defaultView.history.replaceState(null, '', document.defaultView.location.pathname + document.defaultView.location.search)
		if (!document.getElementById('control-panel')?.classList.contains('controls-list-open')) {
			(document.getElementById('button-settings') ?? document.getElementById('button-controls-list'))?.focus({preventScroll:true})
		}
	}
	const open = () => {
		folder.classList.remove('head-dismissed')
		folder.classList.add('open')
	}
	folder.querySelector('.folder-link')?.addEventListener('click', open)
	panel.addEventListener('pointerdown', open, true)
	folder.querySelector('.folder-content > a[href="#control-panel"]')?.addEventListener('click', close)
	folder.addEventListener('keydown', event => {
		if (event.key === 'Escape' && !document.getElementById('control-panel')?.classList.contains('controls-list-open')) { event.preventDefault(); event.stopPropagation(); close() }
	})

	return { panel, open, close }
}
