import { createDrumArranger } from '../source/timing/drum-arranger.js'
import { getDrumPartTime } from '../source/timing/drum-feel.js'
import { DRUM_GROOVES } from '../source/timing/drum-patterns.js'

const groove = () => ({
	kick:[240,0,0,210,0,0,0,70,0,0,0,0,0,210,0,0],
	snare:[0,0,0,0,230,0,60,0,0,0,0,55,230,0,0,65],
	hat:Array(16).fill(120), clap:Array(16).fill(0),
	stepsPerBar:16, meter:[4,4], feel:'breaks',
	feelOptions:{variation:0,ghost:false,phraseLift:0},
})
const make = (extra={}) => createDrumArranger({
	groove:groove(),seed:'phrase-feel',bpm:120,phraseBars:2,
	performanceControl:false,percussionColours:false,
	intent:{energy:0.5,density:0.5,tension:0,fillChance:0,rollChance:0,chaos:0},
	...extra,
})
const play = (arranger, count=32) => Array.from({length:count}, () => arranger.next())

describe('repeatable phrase articulation', () => {
	test('repeats the same hat accents and microtiming in each bar', () => {
		const steps=play(make())
		for(let step=0;step<16;step++) {
			expect(steps[step].hat).toBe(steps[step+16].hat)
			const first=getDrumPartTime(steps[step],'hat',0)
			expect(getDrumPartTime(steps[step+16],'hat',0)).toBe(first)
		}
		expect(steps[0].hat).toBeGreaterThan(steps[1].hat)
		expect(steps[2].hat).toBeGreaterThan(steps[3].hat)
		expect(getDrumPartTime(steps[1],'hat',0)).toBeGreaterThan(0)
		expect(getDrumPartTime(steps[4],'snare',0)).toBeCloseTo(0.004)
	})

	test('builds gently through a phrase and returns to the opening dynamic', () => {
		const authored=groove()
		authored.feelOptions.phraseLift=0.08
		const steps=play(make({groove:authored}),33)
		expect(steps[16].hat).toBeGreaterThan(steps[0].hat)
		expect(steps[32].hat).toBe(steps[0].hat)
	})

	test('blends the timing character with performance intensity', () => {
		const at = energy => {
			const arranger=make({performanceControl:true,performancePreset:'steady',intent:{energy,density:0.5,fillChance:0,rollChance:0}})
			arranger.next()
			return getDrumPartTime(arranger.next(),'hat',0)
		}
		expect(at(1)).toBeGreaterThan(at(0))
		expect(at(0)).toBeGreaterThan(0)
	})

	test('can retain exact authored timing and dynamics through feel overrides', () => {
		const authored=groove()
		authored.feelOptions={variation:0,ghost:false,phraseLift:0,accents:{},laneOffsets:{},delays:{}}
		const steps=play(make({groove:authored}))
		expect(steps[1].hat).toBe(120)
		expect(getDrumPartTime(steps[1],'hat',0)).toBe(0)
		expect(getDrumPartTime(steps[4],'snare',0)).toBe(0)
	})

	test.each([60,120,240])('keeps swung fill events before the following hat at %s BPM', bpm => {
		const arranger=make({groove:'uk-garage',bpm,phraseBars:1,rapidPercussion:true})
		arranger.requestFill()
		const steps=Array.from({length:17}, () => arranger.next({swing:0.45}))
		const duration=arranger.getStepDuration()
		for(let step=0;step<16;step++) {
			const at=getDrumPartTime(steps[step],'hat',step*duration)
			const next=getDrumPartTime(steps[step+1],'hat',(step+1)*duration)
			expect(next).toBeGreaterThan(at)
			for(const event of steps[step].events) expect(at+event.offset).toBeLessThan(next)
		}
	})
})

describe('groove identity during variation', () => {
	test('quiet variations shed weak ornaments while keeping accented syncopations and backbeats', () => {
		let quietHits=0, fullHits=0
		for(const seed of ['one','two','three','four']) {
			const quiet=make({seed,intent:{density:0.1,fillChance:0,rollChance:0}})
			const full=make({seed})
			const quietSteps=play(quiet), fullSteps=play(full)
			for(let step=0;step<32;step++) {
				for(const lane of ['kick','snare','hat']) {
					quietHits+=quietSteps[step][lane]>0 ? 1 : 0
					fullHits+=fullSteps[step][lane]>0 ? 1 : 0
				}
			}
			for(const step of [0,3,13,16,19,29]) expect(quietSteps[step].kick).toBe(fullSteps[step].kick)
			for(const step of [4,12,20,28]) expect(quietSteps[step].snare).toBe(fullSteps[step].snare)
		}
		expect(quietHits).toBeLessThan(fullHits)
	})

	test('fills preserve defining accents and colour changes replace only weak snare strokes', () => {
		const plain=make({phraseBars:4}), varied=make({phraseBars:4,percussionColours:true})
		varied.requestFill()
		const reference=play(plain,64), steps=play(varied,64)
		for(let step=0;step<64;step++) {
			if(groove().snare[step%16]>=180) expect(steps[step].snare).toBe(reference[step].snare)
			if(groove().kick[step%16]>=180) expect(steps[step].kick).toBe(reference[step].kick)
		}
		expect(steps.some(parts => parts.rimshot>0)).toBe(true)
	})

	test('explicit mutes still silence anchor hits', () => {
		const arranger=make()
		arranger.setMutedParts({kick:true,snare:true})
		const steps=play(arranger)
		expect(steps.every(parts => parts.kick===0 && parts.snare===0)).toBe(true)
	})

	test('protected timelines and source arrays survive sparse arrangements unchanged', () => {
		const authored=DRUM_GROOVES['son-clave-3-2']
		const original=JSON.stringify(authored)
		const arranger=make({groove:authored,intent:{density:0,fillChance:0,rollChance:0}})
		const steps=play(arranger,64)
		for(let step=0;step<steps.length;step++) {
			for(const lane of authored.protectedLanes) {
				if(authored[lane]) expect(steps[step][lane]>0).toBe(authored[lane][step%authored[lane].length]>0)
			}
		}
		expect(JSON.stringify(authored)).toBe(original)
	})
})
