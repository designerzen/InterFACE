import { parseMouthCurve, evaluateMouthCurve, MAX_MOUTH_CURVE_POINTS, MOUTH_CURVE_MIN_GAP } from '../people/lip-sensitivity.js'

const SVG = 'http://www.w3.org/2000/svg'
const WIDTH = 320
const HEIGHT = 200
const PAD = 14
const SAMPLES = 64
const KEY_STEP = 1
const KEY_STEP_LARGE = 10

const toX = x => PAD + x / 100 * (WIDTH - PAD * 2)
const toY = y => HEIGHT - PAD - y / 100 * (HEIGHT - PAD * 2)
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const round = value => Math.round(value * 10) / 10

/**
 * Editable loudness curve: handles map mouth opening (x) to loudness (y).
 * The end handles are fixed so the gate stays silent and full travel is loud.
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {Function} options.onInput called while a handle moves
 * @param {Function} options.onChange called once an edit is finished
 */
export const createMouthCurveEditor = (container, {points, onInput=()=>{}, onChange=()=>{}, document=globalThis.document}={}) => {
	const create = (name, attributes={}, parent) => {
		const element = document.createElementNS(SVG, name)
		for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value)
		parent?.append(element)
		return element
	}
	let curve = parseMouthCurve(points) ?? [[0, 0], [100, 100]]
	let drag = null

	const svg = create('svg', { viewBox:`0 0 ${WIDTH} ${HEIGHT}`, class:'mouth-curve', role:'group', 'aria-label':'Mouth loudness curve' })
	const grid = create('g', { class:'mouth-curve-grid', 'aria-hidden':'true' }, svg)
	for (const step of [0, 25, 50, 75, 100]) {
		create('line', { x1:toX(step), x2:toX(step), y1:toY(0), y2:toY(100) }, grid)
		create('line', { x1:toX(0), x2:toX(100), y1:toY(step), y2:toY(step) }, grid)
	}
	const labels = create('g', { class:'mouth-curve-labels', 'aria-hidden':'true' }, svg)
	for (const [text, x, y, anchor] of [['Closed', toX(0) + 4, toY(0) - 4, 'start'], ['Open', toX(100) - 4, toY(0) - 4, 'end'], ['Loud', toX(0) + 4, toY(100) + 12, 'start']]) {
		create('text', { x, y, 'text-anchor':anchor }, labels).textContent = text
	}
	const area = create('path', { class:'mouth-curve-area', 'aria-hidden':'true' }, svg)
	const line = create('path', { class:'mouth-curve-line', 'aria-hidden':'true' }, svg)
	const marker = create('circle', { class:'mouth-curve-marker', r:5, visibility:'hidden', 'aria-hidden':'true' }, svg)
	const handles = create('g', { class:'mouth-curve-handles' }, svg)
	container.append(svg)

	const isFixed = index => index === 0 || index === curve.length - 1
	const describe = ([x, y]) => `Opening ${Math.round(x)}%, loudness ${Math.round(y)}%`

	const render = () => {
		const path = Array.from({ length:SAMPLES + 1 }, (_, i) => {
			const t = i / SAMPLES
			return `${i ? 'L' : 'M'}${toX(t * 100).toFixed(2)} ${toY(evaluateMouthCurve(curve, t) * 100).toFixed(2)}`
		}).join(' ')
		line.setAttribute('d', path)
		area.setAttribute('d', `${path} L${toX(100)} ${toY(0)} L${toX(0)} ${toY(0)} Z`)
		// Reuse handles while dragging so pointer and double-click targets survive.
		if (handles.children.length !== curve.length) {
			const focusedIndex = [...handles.children].indexOf(document.activeElement)
			handles.replaceChildren(...curve.map((_, index) => create('circle', { 'data-index':index })))
			handles.children[focusedIndex]?.focus({ preventScroll:true })
		}
		curve.forEach((point, index) => {
			const handle = handles.children[index]
			const fixed = isFixed(index)
			handle.setAttribute('class', `mouth-curve-handle${fixed ? ' fixed' : ''}`)
			handle.setAttribute('cx', toX(point[0]))
			handle.setAttribute('cy', toY(point[1]))
			handle.setAttribute('r', fixed ? 5 : 9)
			if (fixed) {
				handle.setAttribute('aria-hidden', 'true')
				return
			}
			handle.setAttribute('tabindex', '0')
			handle.setAttribute('role', 'slider')
			handle.setAttribute('aria-label', `Curve handle ${index}`)
			handle.setAttribute('aria-valuemin', '0')
			handle.setAttribute('aria-valuemax', '100')
			handle.setAttribute('aria-valuenow', String(Math.round(point[1])))
			handle.setAttribute('aria-valuetext', describe(point))
		})
	}

	const getPoints = () => curve.map(point => [...point])
	const setPoints = value => {
		curve = parseMouthCurve(value) ?? curve
		render()
	}

	const pointerToCurve = event => {
		const rect = svg.getBoundingClientRect()
		const x = ((event.clientX - rect.left) / (rect.width || 1) * WIDTH - PAD) / (WIDTH - PAD * 2) * 100
		const y = (HEIGHT - PAD - (event.clientY - rect.top) / (rect.height || 1) * HEIGHT) / (HEIGHT - PAD * 2) * 100
		return [x, y]
	}
	// Keep handles between their neighbours so the curve never folds back.
	const movePoint = (index, x, y) => {
		const min = curve[index - 1][0] + MOUTH_CURVE_MIN_GAP
		const max = curve[index + 1][0] - MOUTH_CURVE_MIN_GAP
		curve[index] = [round(clamp(x, min, max)), round(clamp(y, 0, 100))]
		render()
		onInput(getPoints())
	}
	const addPoint = ([x, y]) => {
		if (curve.length >= MAX_MOUTH_CURVE_POINTS) return -1
		const index = curve.findIndex(point => point[0] > x)
		if (index <= 0 || x - curve[index - 1][0] < MOUTH_CURVE_MIN_GAP || curve[index][0] - x < MOUTH_CURVE_MIN_GAP) return -1
		curve.splice(index, 0, [round(x), round(clamp(y, 0, 100))])
		render()
		return index
	}
	const removePoint = index => {
		if (isFixed(index)) return
		curve.splice(index, 1)
		render()
		onInput(getPoints())
		onChange(getPoints())
		handles.children[Math.min(index, curve.length - 2)]?.focus({ preventScroll:true })
	}

	svg.addEventListener('pointerdown', event => {
		if (event.button !== 0) return
		const isHandle = event.target.classList.contains('mouth-curve-handle')
		const index = isHandle ? Number(event.target.dataset.index) : addPoint(pointerToCurve(event))
		if (!(index >= 0) || isFixed(index)) return
		event.preventDefault()
		drag = { index, pointerId:event.pointerId, changed:!isHandle }
		svg.setPointerCapture?.(event.pointerId)
		handles.children[index]?.focus({ preventScroll:true })
		if (!isHandle) onInput(getPoints())
	})
	svg.addEventListener('pointermove', event => {
		if (drag?.pointerId !== event.pointerId) return
		drag.changed = true
		movePoint(drag.index, ...pointerToCurve(event))
	})
	const endDrag = event => {
		if (drag?.pointerId !== event.pointerId) return
		const { changed } = drag
		drag = null
		if (changed) onChange(getPoints())
	}
	svg.addEventListener('pointerup', endDrag)
	svg.addEventListener('pointercancel', endDrag)
	svg.addEventListener('dblclick', event => {
		const index = Number(event.target.dataset?.index)
		if (index >= 0) removePoint(index)
	})
	svg.addEventListener('keydown', event => {
		const index = Number(event.target.dataset?.index)
		if (!(index >= 0) || isFixed(index)) return
		const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP
		const [x, y] = curve[index]
		const moves = { ArrowLeft:[-step, 0], ArrowRight:[step, 0], ArrowUp:[0, step], ArrowDown:[0, -step], PageUp:[0, KEY_STEP_LARGE], PageDown:[0, -KEY_STEP_LARGE] }
		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault()
			removePoint(index)
		} else if (moves[event.key]) {
			event.preventDefault()
			movePoint(index, x + moves[event.key][0], y + moves[event.key][1])
			onChange(getPoints())
		} else return
		// Stop global keyboard shortcuts from playing while the curve is edited.
		event.stopPropagation()
	})

	/**
	 * Show where a player currently sits on the curve
	 * @param {Number|null} opening 0–1, or null to hide
	 */
	const setMarker = opening => {
		if (!Number.isFinite(opening) || opening <= 0) {
			marker.setAttribute('visibility', 'hidden')
			return
		}
		const t = clamp(opening, 0, 1)
		marker.setAttribute('cx', toX(t * 100))
		marker.setAttribute('cy', toY(evaluateMouthCurve(curve, t) * 100))
		marker.setAttribute('visibility', 'visible')
	}

	render()
	return { element:svg, getPoints, setPoints, setMarker }
}
