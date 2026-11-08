import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createDirections, getDirections} from '../source/models/directions.js'
import {getInstructions} from '../source/models/instructions.js'
import DirectionsSession from '../source/models/directions-session.js'
import * as emojis from '../source/models/emoji.js'

const data = JSON.parse(await readFile(new URL('../static/locales/en/directions.json', import.meta.url), 'utf8'))
const instructions = JSON.parse(await readFile(new URL('../static/locales/en/instructions.json', import.meta.url), 'utf8'))

const mockFiles = (t, files) => {
	const calls = []
	t.mock.method(globalThis, 'fetch', async url => {
		calls.push(url)
		return {ok:true, headers:{get:() => 'application/json'}, json:async () => files[url] ?? null}
	})
	return calls
}

test('the normal app loads directions without an event referer', async t => {
	const calls = mockFiles(t, {'./locales/en/directions.json':data})
	const engine = await getDirections()
	assert.deepEqual(calls, ['./locales/en/directions.json'])
	assert.equal(engine.getQuantityOfDirections(), 9)
})

test('a missing event set falls back to default English directions', async t => {
	const calls = mockFiles(t, {'./locales/en/directions.json':data})
	assert.ok(await getDirections('fr', 'unknown-event'))
	assert.deepEqual(calls, ['./locales/fr/directions-unknown-event.json', './locales/en/directions-unknown-event.json',
		'./locales/fr/directions.json', './locales/en/directions.json'])
})

test('an existing themed set takes precedence over defaults', async t => {
	const theme = {...data, advanced:{default:[{...data.advanced.default[0], id:'theme'}]}}
	const calls = mockFiles(t, {'./locales/en/directions-emf.json':theme, './locales/en/directions.json':data})
	const engine = await getDirections('en', 'emf')
	assert.equal(engine.getNextDirection().id, 'theme')
	assert.equal(calls.length, 1)
})

test('default directions provide useful copy, rewards and recognised expression targets', () => {
	const known = new Set(Object.values(emojis).filter(value => typeof value === 'string'))
	for (const mode of ['basic', 'advanced']) {
		const directions = data[mode].default
		assert.equal(new Set(directions.map(direction => direction.id)).size, directions.length)
		for (const direction of directions) {
			for (const field of ['title','message','hint','encouragement','congratulation','retryMessage']) assert.ok(direction[field]?.trim().length, `${direction.id} needs ${field}`)
			assert.ok(direction.points > 0)
			for (const emoji of direction.expects.emoji) assert.ok(known.has(emoji), `Unknown expression: ${emoji}`)
		}
	}
})

test('both default modes retire completed actions per person across later rounds and mode reloads', () => {
	for (const advancedMode of [false,true]) {
		const engine = createDirections(data, {advancedMode})
		const a = {}, b = {}
		const seen = new Set()
		const total = engine.getQuantityOfDirections()
		for (let i=0; i<total; i++) {
			const direction = engine.getNextDirection([a,b])
			assert.ok(!seen.has(direction.id))
			seen.add(direction.id)
			assert.ok(engine.completeExpression([...direction.expectedEmojis][0], a))
		}
		for (let i=0; i<total; i++) {
			const direction = engine.getNextDirection([a,b])
			assert.deepEqual(direction.progress.pendingPeople, [b])
			assert.deepEqual(direction.progress.completedPeople, [a])
			assert.ok(engine.completeExpression([...direction.expectedEmojis][0], b))
		}
		assert.equal(engine.getNextDirection([a,b]).complete, true)
		assert.equal(engine.getNextDirection([a,b]), null)
		const reloaded = createDirections(data, {advancedMode, progress:engine.progress})
		assert.equal(reloaded.getNextDirection([a,b]).complete, true)
		assert.equal(reloaded.getCompletedDirectionIds().size, total)
	}
})

test('authored encouragement, hints and retry messages reach the session', () => {
	let time = 0
	const now = () => time
	const session = new DirectionsSession(createDirections(data, {advancedMode:false, now}), {now})
	const people = [{playerNumber:0}]
	let state = session.update(people)
	assert.equal(state.encouragement, data.basic.default[0].encouragement)
	time = 7000
	state = session.update(people)
	assert.equal(state.encouragement, data.basic.default[0].hint)
	session.skip()
	assert.equal(session.getSnapshot().encouragement, data.basic.default[0].retryMessage)
})

test('default help introduces personal achievements and retains musical instruction', async t => {
	mockFiles(t, {'./locales/en/instructions.json':instructions})
	const guide = await getInstructions('en', '', {advancedMode:false})
	assert.equal(guide.getHelp(0), instructions.quickStart[0])
	for (const mode of ['basic','advanced']) {
		const text = instructions[mode].default.join(' ')
		for (const phrase of ['challenge points', 'once per player', 'Unfinished invitations', 'Each player explores', 'DRUM PERFORMANCE MODE']) assert.ok(text.includes(phrase))
	}
})
