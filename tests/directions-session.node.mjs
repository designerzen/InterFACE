import test from 'node:test'
import assert from 'node:assert/strict'
import {createDirections} from '../source/models/directions.js'
import DirectionsSession from '../source/models/directions-session.js'
import PersonDirections from '../source/people/person-directions.js'

const setup = () => {
	let time = 0
	const now = () => time
	const data = {basic:['smile', 'kiss', 'wink'].map((id, i) => ({id, message:id,
		points:(i + 1) * 5, congratulation:`Great ${id}!`, expects:{type:'expression', emoji:[id]}}))}
	const engine = createDirections(data, {now, advancedMode:false})
	const session = new DirectionsSession(engine, {now})
	const a = {playerNumber:0, directionsProgress:new PersonDirections()}
	const b = {playerNumber:1, directionsProgress:new PersonDirections()}
	const tick = (ms = 0, people = [a,b], options) => {time += ms; return session.update(people, options)}
	return {a,b,session,engine,tick}
}

test('prompt persists, support appears, timeout defers without awarding completion', () => {
	const {a,session,tick} = setup()
	assert.equal(tick().direction.id, 'smile')
	assert.equal(tick(6999).direction.id, 'smile')
	assert.match(tick(1).encouragement, /holding the expression/)
	assert.equal(tick(11000).phase, 'retry')
	assert.match(session.getSnapshot().encouragement, /No rush/)
	assert.equal(a.directionsProgress.hasCompleted('smile'), false)
	assert.equal(tick(3000).direction.id, 'kiss')
})

test('responses receive points once, keep all congratulations, then revisit outstanding people', () => {
	const {a,b,session,tick} = setup()
	tick()
	assert.equal(session.respond('smile', a).points, 5)
	assert.equal(session.respond('smile', a), null)
	assert.equal(session.getSnapshot().players[0].score, 5)
	assert.match(session.getSnapshot().encouragement, /Player 2/)
	assert.equal(tick(3499).direction.id, 'smile')
	assert.equal(tick(1).direction.id, 'kiss')
	session.skip(); tick(3000)
	session.skip()
	assert.equal(tick(3000).direction.id, 'smile')
	assert.equal(session.getSnapshot().players[0].answered, true)
	assert.ok(session.respond('smile', b))
	assert.match(session.getSnapshot().encouragement, /Great teamwork/)
})

test('simultaneous responses are independently awarded and retained in feedback', () => {
	const {a,b,session,tick} = setup()
	tick()
	session.respond('smile', a)
	session.respond('smile', b)
	assert.equal(session.getSnapshot().responses.length, 2)
	assert.deepEqual(session.getSnapshot().players.map(player => player.score), [5,5])
	assert.equal(tick(3500).direction.id, 'kiss')
})

test('more time and skip support the player without marking success', () => {
	const {a,session,tick} = setup()
	tick(); tick(15000)
	session.moreTime()
	assert.match(session.getSnapshot().encouragement, /Take your time/)
	assert.equal(tick(6000).phase, 'prompt')
	session.skip()
	assert.equal(session.getSnapshot().phase, 'retry')
	assert.equal(a.directionsProgress.score, 0)
	session.moreTime()
	assert.equal(session.getSnapshot().phase, 'prompt')
})

test('paused and missing participants cannot respond; hidden time does not exhaust prompts', () => {
	const {a,b,session,tick} = setup()
	tick(); tick(2000)
	assert.equal(tick(0, [], {}).phase, 'paused')
	assert.equal(session.respond('smile', a), null)
	tick(60000, [])
	assert.equal(tick(0).phase, 'prompt')
	assert.equal(tick(1000).direction.id, 'smile')
	tick(0, [a])
	assert.equal(session.respond('smile', b), null)
	assert.equal(tick(4000, [a]).players.length, 1)
	tick(0, [a], {paused:true})
	assert.equal(session.respond('smile', a), null)
})

test('new challenge and replacement players reset their challenge scores', () => {
	const {a,b,session,tick} = setup()
	tick(); session.respond('smile', a); session.respond('smile', b)
	session.resetPerson(a); tick()
	assert.deepEqual(session.getSnapshot().players.map(player => player.score), [0,5])
	assert.equal(session.getSnapshot().direction.id, 'kiss')
	session.reset(); tick()
	assert.equal(session.getSnapshot().round, 1)
	assert.equal(session.getSnapshot().direction.id, 'smile')
	assert.deepEqual(session.getSnapshot().players.map(player => player.score), [0,0])
})

test('finished session congratulates, preserves totals and resumes for a newcomer', () => {
	const {a,b,session,tick} = setup()
	tick(0, [a])
	for (const emoji of ['smile', 'kiss', 'wink']) {
		session.respond(emoji, a)
		tick(3500, [a])
	}
	assert.equal(session.getSnapshot().phase, 'finished')
	assert.equal(session.getSnapshot().players[0].score, 30)
	assert.match(session.getSnapshot().encouragement, /Wonderful/)
	assert.equal(tick(30000, [a]).phase, 'finished')
	assert.equal(tick(0, [a,b]).phase, 'prompt')
	assert.equal(a.directionsProgress.score, 30)
})

test('visibility pause excludes a long gap with no animation frames', () => {
	const {session,tick} = setup()
	tick(); tick(3000)
	session.pause()
	const state = tick(60000)
	assert.equal(state.phase, 'prompt')
	assert.equal(state.direction.id, 'smile')
	assert.equal(session.elapsed, 3000)
})
