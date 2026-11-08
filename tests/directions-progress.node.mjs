import test from 'node:test'
import assert from 'node:assert/strict'
import PersonDirections from '../source/people/person-directions.js'
import DirectionsProgress from '../source/models/directions-progress.js'
import {createDirections} from '../source/models/directions.js'

const data = {basic:[
	{id:'smile', message:'Smile', expects:{type:'expression', emoji:['smile']}, points:5},
	{id:'kiss', message:'Kiss', expects:{type:'expression', emoji:['kiss']}, points:10},
	{id:'wink', message:'Wink', expects:{type:'expression', emoji:['wink']}}
]}
const person = () => ({directionsProgress:new PersonDirections()})
const controller = options => createDirections(data, {advancedMode:false, now:() => 10, ...options})

test('personal completion is idempotent, inspectable and resettable', () => {
	const progress = new PersonDirections()
	assert.equal(progress.complete('smile', {emoji:'smile', time:12}), true)
	assert.equal(progress.complete('smile'), false)
	const snapshot = progress.getSnapshot()
	snapshot[0].directionId = 'changed'
	progress.getCompletedDirectionIds().clear()
	assert.equal(progress.hasCompleted('smile'), true)
	assert.deepEqual(progress.getSnapshot()[0], {directionId:'smile', emoji:'smile', time:12, prompted:true, points:0})
	progress.observeExpression('smile')
	progress.reset()
	assert.deepEqual(progress.getSnapshot(), [])
	assert.deepEqual(progress.getExperiencedExpressions(), [])
})

test('partial completion revisits only after other directions have had a turn', () => {
	const a = person(), b = person(), directions = controller()
	assert.equal(directions.getNextDirection([a,b]).id, 'smile')
	assert.equal(directions.completeExpression('smile', a).points, 5)
	assert.equal(directions.completeExpression('smile', a), null)
	assert.equal(directions.getCurrentDirection().className, 'direction direction-partial')
	assert.deepEqual(directions.getCurrentDirection().progress.pendingPeople, [b])
	assert.deepEqual(directions.getCurrentDirection().progress.completedPeople, [a])
	assert.equal(directions.getNextDirection([a,b]).id, 'kiss')
	assert.equal(directions.getNextDirection([a,b]).id, 'wink')
	assert.equal(directions.getNextDirection([a,b]).id, 'smile')
	assert.equal(directions.getProgress().round, 2)
	assert.notEqual(directions.completeExpression('smile', b), null)
	assert.ok(directions.getCurrentDirection().className.includes('direction-completed'))
	for (let i=0; i<6; i++) assert.notEqual(directions.getNextDirection([a,b]).id, 'smile')
})

test('offscreen actions count as observed but do not award prompt rewards', () => {
	const a = person(), directions = controller()
	directions.getNextDirection([a])
	assert.equal(directions.completeExpression('kiss', a), null)
	assert.deepEqual(a.directionsProgress.getSnapshot(), [
		{directionId:'kiss', emoji:'kiss', time:10, prompted:false, points:0}
	])
	assert.equal(directions.getNextDirection([a]).id, 'wink')
})

test('absent participants keep history and newcomers have independent progress', () => {
	const a = person(), b = person(), c = person(), directions = controller()
	directions.getNextDirection([a,b])
	directions.completeExpression('smile', a)
	directions.getNextDirection([a])
	assert.equal(directions.progress.getDirectionProgress('smile').complete, true)
	directions.getNextDirection([a,b,c])
	assert.deepEqual(directions.progress.getDirectionProgress('smile').pendingPeople, [b,c])
	assert.equal(directions.getNextDirection([]), null)
})

test('reset one person preserves others; reset all includes absent participants and rounds', () => {
	const a = person(), b = person(), directions = controller()
	directions.getNextDirection([a,b])
	directions.completeExpression('smile', a)
	directions.completeExpression('smile', b)
	directions.resetPerson(a)
	assert.equal(a.directionsProgress.hasCompleted('smile'), false)
	assert.equal(b.directionsProgress.hasCompleted('smile'), true)
	directions.getNextDirection([a])
	directions.reset()
	assert.equal(b.directionsProgress.hasCompleted('smile'), false)
	assert.equal(directions.getProgress().round, 1)
	assert.equal(directions.getCurrentDirection(), null)
	assert.equal(directions.getNextDirection([a,b]).id, 'smile')
})

test('a replacement controller shares progress across mode or language loading', () => {
	const a = person(), progress = new DirectionsProgress(), first = controller({progress})
	first.getNextDirection([a])
	first.completeExpression('smile', a)
	const replacement = controller({progress})
	assert.equal(replacement.getNextDirection([a]).id, 'kiss')
})

test('one expression can retire overlapping actions without awarding multiple rewards', () => {
	const a = person()
	const directions = createDirections({basic:[...data.basic,
		{id:'another-smile', message:'Smile again', expects:{type:'expression', emoji:['smile']}}
	]}, {advancedMode:false})
	directions.getNextDirection([a])
	assert.equal(directions.completeExpression('smile', a).directionId, 'smile')
	assert.equal(a.directionsProgress.hasCompleted('another-smile'), true)
})

test('exhaustion preserves completions and explicit reset starts a fresh challenge', () => {
	const a = person(), directions = controller()
	for (const emoji of ['smile', 'kiss', 'wink']) {
		assert.equal(directions.getNextDirection([a]).id, emoji)
		assert.ok(directions.completeExpression(emoji, a))
	}
	assert.equal(directions.getNextDirection([a]).complete, true)
	assert.equal(directions.getNextDirection([a]), null)
	assert.equal(directions.getCompletedDirectionIds().size, 3)
	directions.reset()
	assert.equal(directions.getNextDirection([a]).id, 'smile')
})
