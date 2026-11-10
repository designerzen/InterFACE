import { createDrumArranger } from '../source/timing/drum-arranger.js'
import { updtateDrumkitWithPerson } from '../source/audio/instrumentMediators/mediator.person-drumkit.js'

const make = (extra={}) => createDrumArranger({
	groove:'amen', seed:'expression', bpm:120, phraseBars:1,
	performanceControl:false, percussionColours:false, rapidPercussion:true,
	intent:{energy:0.5,density:0.5,tension:0,fillChance:0,rollChance:0,chaos:0},
	...extra
})
const phrase = arranger => Array.from({length:16}, () => arranger.next())
const eventCount = steps => steps.reduce((count, parts) => count + parts.events.length, 0)

describe('expression fill gestures', () => {
	const kit = () => ({updatePerson:jest.fn(),setMutedParts:jest.fn(),requestFill:jest.fn()})
	const express = (drumkit, happiness, playAudio=true) => updtateDrumkitWithPerson(
		drumkit, {noteVelocity:1,data:{happiness}}, playAudio
	)

	test('requires a release before a held or jittering expression can trigger again', () => {
		const drumkit = kit()
		for (const value of [0.8,0.9,0.69,0.75,0.56,0.9]) express(drumkit,value)
		expect(drumkit.requestFill).toHaveBeenCalledTimes(1)
		express(drumkit,0.5)
		express(drumkit,0.95)
		expect(drumkit.requestFill.mock.calls).toEqual([[0.8],[0.95]])
	})

	test('loudness alone does not request a fill and each performer rearms independently', () => {
		const first=kit(), second=kit()
		express(first,0)
		expect(first.requestFill).not.toHaveBeenCalled()
		express(first,0.9)
		express(second,0.85)
		expect(second.requestFill).toHaveBeenCalledWith(0.85)
		express(first,0.9,false)
		expect(first.requestFill).toHaveBeenCalledTimes(1)
	})
})

describe('phrase fill requests', () => {
	test('waits for the phrase ending and consumes a request exactly once', () => {
		const arranger=make()
		arranger.requestFill()
		const steps=phrase(arranger)
		expect(eventCount(steps.slice(0,8))).toBe(0)
		expect(eventCount(steps.slice(8))).toBeGreaterThan(0)
		expect(eventCount(phrase(arranger))).toBe(0)
	})

	test('a light pickup is shorter, sparser and quieter than a full fill', () => {
		const light=make(), full=make()
		light.requestFill(0.25)
		full.requestFill(1)
		const lightSteps=phrase(light), fullSteps=phrase(full)
		expect(eventCount(lightSteps.slice(0,14))).toBe(0)
		expect(eventCount(lightSteps)).toBeGreaterThan(0)
		expect(eventCount(lightSteps)).toBeLessThan(eventCount(fullSteps))
		const peak = steps => Math.max(...steps.flatMap(parts => parts.events.map(event => event.velocity)))
		expect(peak(lightSteps)).toBeLessThan(peak(fullSteps))
	})

	test('a late request ends at the boundary even when requested again during the fill', () => {
		const arranger=make()
		for (let step=0;step<14;step++) arranger.next()
		arranger.requestFill(0.5)
		expect(arranger.next().events.length).toBeGreaterThan(0)
		arranger.requestFill(1)
		arranger.next()
		expect(eventCount(phrase(arranger))).toBe(0)
	})

	test('ignores invalid strengths', () => {
		const arranger=make()
		for (const amount of [0,-1,NaN,Infinity]) arranger.requestFill(amount)
		expect(eventCount(phrase(arranger))).toBe(0)
	})

	test('a gesture replaces an automatic fill that has not started yet', () => {
		const arranger=make({intent:{energy:0.5,density:0.5,tension:0,fillChance:100,rollChance:0,chaos:0}})
		arranger.next()
		arranger.requestFill(0.25)
		const remaining=Array.from({length:15}, () => arranger.next())
		expect(eventCount(remaining.slice(0,13))).toBe(0)
		expect(eventCount(remaining.slice(13))).toBeGreaterThan(0)
	})
})

describe('independent performance dynamics', () => {
	test('an accent changes energy immediately while preserving density and fill settings', () => {
		const arranger=make({performanceControl:true})
		arranger.updatePerson({noteVelocity:0.4},0)
		const before=arranger.getIntent()
		arranger.updatePerson({noteVelocity:1},0.05)
		const after=arranger.getIntent()
		expect(after.energy).toBe(1)
		expect(after.density-before.density).toBeLessThan(0.02)
		expect(after.fillChance).toBe(before.fillChance)
		expect(after.rollChance).toBe(before.rollChance)
	})

	test('density builds with sustained activity independently of update frequency', () => {
		const densities=[0.05,0.25].map(interval => {
			const arranger=make({performanceControl:true})
			for(let tick=0;tick<=6/interval;tick++) arranger.updatePerson({noteVelocity:1},tick*interval)
			expect(arranger.getIntent().density).toBeGreaterThan(0.85)
			return arranger.getIntent().density
		})
		expect(densities[0]).toBeCloseTo(densities[1],8)
	})
})
