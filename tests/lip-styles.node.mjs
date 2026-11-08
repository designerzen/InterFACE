import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { drawLipOverlay, getLipPaint, getLipStyle, LIP_STYLE_OPTIONS } from '../source/visual/lip-styles.js'

const createContext = () => ({
	canvas:{ width:640, height:480 },
	...Object.fromEntries(['save', 'restore', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'fill', 'stroke'].map(name => [name, mock.fn()]))
})
const createPerson = () => ({
	hue:120,
	singing:false,
	data:{ faceLandmarks:Array.from({ length:478 }, (_, index) => ({ x:0.3 + index / 2000, y:0.4 + index / 3000 })) }
})

test('lipstick is disabled by default, with compatibility for legacy enabled overlays', () => {
	assert.equal(getLipStyle({}), 'disabled')
	assert.equal(getLipStyle({ drawMouth:true }), 'music')
	assert.equal(getLipPaint(createPerson(), { lipStyle:'disabled' }), null)
	const context = createContext()
	assert.equal(drawLipOverlay(context, createPerson(), {}), false)
	assert.equal(context.fill.mock.callCount(), 0)
})

test('draws filled lip tissue from current model landmarks even without annotations or singing', () => {
	const context = createContext()
	assert.equal(drawLipOverlay(context, createPerson(), { lipStyle:'red' }, { a:0 }), true)
	assert.equal(context.closePath.mock.callCount(), 2)
	assert.deepEqual(context.fill.mock.calls[0].arguments, ['evenodd'])
	assert.ok(context.moveTo.mock.calls[0].arguments[0] > 1)
	assert.equal(context.fillStyle, 'hsla(350,90%,50%,0.9)')
	assert.equal(context.restore.mock.callCount(), 1)
})

test('supports pixel coordinates from the older model without scaling them again', () => {
	const context = createContext()
	const person = { data:{ annotations:{ outerLip:[{ x:10, y:20 }, { x:30, y:20 }, { x:20, y:30 }] } } }
	assert.equal(drawLipOverlay(context, person, { lipStyle:'pink' }), true)
	assert.deepEqual(context.moveTo.mock.calls[0].arguments, [10, 20])
	person.data.annotations.outerLip[1].x = NaN
	assert.equal(drawLipOverlay(context, person, { lipStyle:'pink' }), false)
})

test('solid colours stay steady while note and pulse styles respond to the player', () => {
	const person = createPerson()
	assert.deepEqual(getLipPaint(person, { lipStyle:'gold' }, { h:10 }, false, 100), getLipPaint(person, { lipStyle:'gold' }, { h:200 }, true, 200))
	assert.notEqual(getLipPaint(person, { lipStyle:'music' }, { h:10 }).fill, getLipPaint(person, { lipStyle:'music' }, { h:200 }).fill)
	const quiet = getLipPaint(person, { lipStyle:'pulse' }).fill
	person.singing = true
	person.data.mouthRatio = 1
	assert.notEqual(getLipPaint(person, { lipStyle:'pulse' }).fill, quiet)
})

test('beat flashes last long enough to see, decay, and change colour on each beat', () => {
	const person = createPerson()
	const options = { lipStyle:'beat-rainbow' }
	assert.match(getLipPaint(person, options, {}, false, 100).fill, /,0\)$/)
	const onBeat = getLipPaint(person, options, {}, true, 100).fill
	assert.equal(onBeat, 'hsla(55,90%,70%,0.95)')
	assert.equal(getLipPaint(person, options, {}, false, 210).fill, 'hsla(55,90%,60%,0.475)')
	assert.match(getLipPaint(person, options, {}, false, 400).fill, /,0\)$/)
	assert.equal(getLipPaint(person, options, {}, true, 600).fill, 'hsla(110,90%,70%,0.95)')
})

test('photosensitive mode keeps beat styles steady', () => {
	const person = createPerson()
	const options = { lipStyle:'beat-rainbow', photoSensitive:true }
	assert.deepEqual(getLipPaint(person, options, {}, true, 100), getLipPaint(person, options, {}, false, 500))
})

test('global selector offers the same styles as player controls, with Disabled selected', () => {
	const pug = readFileSync('source/partials/control-panel.pug', 'utf8')
	const lipSelect = pug.slice(pug.indexOf('select#select-lips'), pug.indexOf('for="select-eyes"'))
	for (const [style] of LIP_STYLE_OPTIONS) assert.ok(lipSelect.includes(`value="${style}"`))
	assert.ok(lipSelect.includes('option(value="disabled" selected)'))
})
