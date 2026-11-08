import { EYEBROW_STYLES, eyebrowStyleOptions, getEyebrowStyle, eyebrowStyleIcon } from '../source/visual/eyebrow-styles.js'
import { EYEBROW_AUDIO_EFFECTS } from '../source/audio/effects/person-eyebrows.js'
import { drawEyebrows } from '../source/visual/2d.eyebrows.js'
import { drawFaceFeatures } from '../source/visual/2d.face-features.js'
import { exportPersonQueryOptions, getPersonQueryOptions } from '../source/people/person.query.js'
import { readFileSync } from 'fs'

test.each(EYEBROW_STYLES)('$label enables only its matching sound and eyebrow overlay', style => {
	const options = eyebrowStyleOptions(style.value)
	expect(getEyebrowStyle(options)).toBe(style.value)
	expect(options.drawEyebrows).toBe(style.value !== 'disabled')
	expect(EYEBROW_AUDIO_EFFECTS.filter(([key]) => options[key]).map(([key]) => key)).toEqual(style.effect ? [style.effect] : [])
	expect(eyebrowStyleIcon(style.value)).toContain('<svg')
})

test('changing or disabling the selection clears previous effects and persists per person', () => {
	const source = readFileSync('source/people/person.js', 'utf8')
	const start = source.indexOf('\tsetPanelOption(option, value){')
	const body = source.slice(start + '\tsetPanelOption(option, value){'.length, source.indexOf('\n\t}', start))
	const change = new Function('option', 'value', 'EVENT_PERSON_OPTIONS_CHANGED', body)
	const person = {
		options:eyebrowStyleOptions('echo'), playerNumber:0, dispatchPersonEvent:jest.fn(),
		setOptions(options){ Object.assign(this.options, eyebrowStyleOptions(options.eyebrowStyle)) }
	}
	for (const value of ['space', 'filter', 'disabled']) {
		change.call(person, 'eyebrowStyle', value, 'options-changed')
		expect(person.options).toEqual(eyebrowStyleOptions(value))
		expect(person.dispatchPersonEvent).toHaveBeenLastCalledWith('options-changed', {person, options:{eyebrowStyle:value}})
		const restored = getPersonQueryOptions(exportPersonQueryOptions(person), ['p-1'])
		expect(getEyebrowStyle(restored)).toBe(value)
	}
	expect(eyebrowStyleOptions('unknown')).toEqual(eyebrowStyleOptions('disabled'))
})

test('modern select includes HTML eyebrow previews and a selectedcontent trigger', () => {
	const previousCSS = globalThis.CSS
	globalThis.CSS = {supports:() => true}
	try {
		jest.isolateModules(() => {
			const { populateSelect } = require('../source/dom/select.js')
			const select = document.createElement('select')
			populateSelect(select, EYEBROW_STYLES.map(style => ({...style, icon:eyebrowStyleIcon(style.value), selected:style.value === 'filter'})))
			expect(select.querySelector('button > selectedcontent')).not.toBeNull()
			expect(select.querySelectorAll('option svg')).toHaveLength(EYEBROW_STYLES.length)
			expect(select.value).toBe('filter')
			expect(select.selectedOptions[0].textContent).toBe('Filter')
		})
	} finally { globalThis.CSS = previousCSS }
})

const context = () => ({canvas:{width:640, height:480}, save:jest.fn(), restore:jest.fn(), beginPath:jest.fn(),
	moveTo:jest.fn(), lineTo:jest.fn(), stroke:jest.fn()})

test('sound styles have distinct finite eyebrow geometry and layered trails', () => {
	const signatures = new Set()
	for (const {value} of EYEBROW_STYLES.filter(style => style.value !== 'disabled')) {
		const ctx = context()
		drawEyebrows(ctx, [{x:100, y:60}, {x:160, y:55}], true, {eyebrowStyle:value, eyebrowAmount:0.8})
		for (const args of [...ctx.moveTo.mock.calls, ...ctx.lineTo.mock.calls]) expect(args.every(Number.isFinite)).toBe(true)
		signatures.add(JSON.stringify([ctx.lineTo.mock.calls, ctx.stroke.mock.calls.length, ctx.lineWidth]))
		expect(ctx.stroke).toHaveBeenCalledTimes(['space', 'echo'].includes(value) ? 3 : 1)
	}
	expect(signatures.size).toBe(6)
})

test('disabled overrides stale draw flags while an effect always draws its matching eyebrows', () => {
	const ctx = context()
	const person = {options:{eyebrowStyle:'disabled', drawEyebrows:true}, data:{annotations:{
		leftEyebrow:[{x:100,y:60},{x:160,y:55}], rightEyebrow:[{x:200,y:55},{x:260,y:60}]
	}}}
	drawFaceFeatures(ctx, person)
	expect(ctx.stroke).not.toHaveBeenCalled()
	person.options = {eyebrowStyle:'echo', drawEyebrows:false}
	drawFaceFeatures(ctx, person)
	expect(ctx.stroke).toHaveBeenCalledTimes(6)
})
