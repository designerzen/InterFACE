import { createDrumArranger } from '../source/timing/drum-arranger.js'
import { DRUM_GROOVES, AUXILIARY_DRUM_LANES, createCompositeDrumGroove } from '../source/timing/drum-patterns.js'
import { createDrumStepScheduler, getDrumPartTime, compileDrumFeel, getDrumGrid } from '../source/timing/drum-feel.js'
import { PERCUSSION_PRESETS } from '../source/audio/synthesizers/percussion-presets.js'

const lanes = ['kick','snare','hat','clap','cowbell',...AUXILIARY_DRUM_LANES]
const quietIntent = {energy:0.5,density:0.5,tension:0,fillChance:0,rollChance:0,chaos:0}
const make = (groove, extra={}) => createDrumArranger({groove,seed:'musical-timing',bpm:120,performanceControl:false,percussionColours:false,intent:quietIntent,...extra})
const hits = parts => lanes.reduce((sum,lane) => sum + (parts[lane] > 0 ? 1 : 0),0)

describe('musical drum grids', () => {
	test.each([['amen',16],['jazz-swing',24],['rachenitsa-7-8',14]])('trusts an explicit BPM on %s', (groove,steps) => {
		const arranger=make(groove)
		for(let step=0;step<steps*3;step++) arranger.next({bpm:120,triggerAt:1+step*arranger.getStepDuration()})
		expect(arranger.getBPM()).toBe(120)
	})
	test('estimates quarter-note tempo from a subdivision, including a zero origin', () => {
		const arranger=make('amen',{bpm:0})
		for(let step=0;step<32;step++)arranger.next({triggerAt:step*0.125})
		expect(arranger.getBPM()).toBeCloseTo(120)
	})
	test.each([['amen',2],['jazz-swing',2],['rachenitsa-7-8',1.75],['karsilama-9-8',2.25],['samai-thaqil',2.5],['tintal-16',8],['bulerias-12',3],['ewe-bell-12',3]])('%s retains the correct cycle duration', (groove,seconds) => {
		const arranger=make(groove)
		expect(arranger.getStepDuration()*arranger.getStepsPerBar()).toBeCloseTo(seconds)
	})
	test('keeps rapid events inside their step and below eight extra hats per bar', () => {
		const arranger=make('trap-sextuplets',{rapidPercussion:true})
		arranger.requestFill()
		for(let bar=0;bar<4;bar++) {
			let count=0
			for(let step=0;step<16;step++) {
				const parts=arranger.next({bpm:120})
				count+=parts.events.length
				for(const event of parts.events) {
					expect(event.offset).toBeGreaterThan(0)
					expect(event.offset).toBeLessThan(arranger.getStepDuration())
				}
			}
			expect(count).toBeLessThanOrEqual(8)
		}
	})
	test('aligns mixed straight and triplet grids by beat position', () => {
		const mixed=createCompositeDrumGroove([DRUM_GROOVES.amen,DRUM_GROOVES['jazz-swing']])
		expect(mixed.stepsPerBar).toBe(48)
		expect(mixed.kick.length).toBe(96)
		expect(mixed.snare[12]).toBe(255)
		expect(mixed.ride[12]).toBe(165)
		expect(make(mixed).getStepDuration()*48).toBeCloseTo(2)
	})
	test('contains fill hats inside the next swung hat boundary', () => {
		const arranger=make('garage-triplets',{rapidPercussion:true})
		arranger.requestFill()
		const steps=Array.from({length:33},(_,step)=>arranger.next({bpm:120,triggerAt:1+step*0.125,swing:0.45}))
		for(let step=0;step<32;step++) {
			for(const event of steps[step].events) {
				const eventAt=getDrumPartTime(steps[step],'hat',1+step*0.125)+event.offset
				const boundary=getDrumPartTime(steps[step+1],'hat',1+(step+1)*0.125)
				expect(eventAt).toBeLessThan(boundary)
			}
		}
	})
	test('preserves named timing metadata when combining patterns', () => {
		const mixed=createCompositeDrumGroove([DRUM_GROOVES['garage-triplets'],DRUM_GROOVES['jazz-swing']])
		expect(mixed.timing).toMatchObject({style:'triplet',every:12,phase:6})
	})
	test('keeps feel offsets intact when performance scales note velocities', () => {
		const arranger=make('uk-garage',{performanceControl:true})
		arranger.next({bpm:120})
		const parts=arranger.next({bpm:120,swing:0.1})
		expect(parts.quarterDuration).toBe(0.5)
		expect(getDrumPartTime(parts,'hat',1)).toBeGreaterThan(1)
	})
	test('does not apply a second swing to triplet-based patterns', () => {
		const arranger=make('purdie-shuffle')
		for(let step=0;step<24;step++)expect(arranger.next({bpm:120,swing:0.45}).swingOffset).toBe(0)
	})
})

describe('regional rhythmic structures', () => {
	test('retains five-stroke clave direction over two bars', () => {
		const positions=name=>DRUM_GROOVES[name].claves.flatMap((v,i)=>v?[i]:[])
		expect(positions('son-clave-3-2')).toEqual([0,3,6,10,12])
		expect(positions('son-clave-2-3')).toEqual([2,4,8,11,14])
	})
	test.each([['rachenitsa-7-8',[0,4,8]],['karsilama-9-8',[0,4,8,12]],['bulerias-12',[0,3,6,8,10]]])('%s preserves its additive accents', (name,expected) => {
		const groove=DRUM_GROOVES[name]
		const feel=compileDrumFeel(groove,getDrumGrid(groove))
		expect(Array.from(feel.strong).flatMap((v,i)=>v?[i]:[])).toEqual(expected)
	})
	test('tintal keeps sam and a bass-free khali section at beat nine', () => {
		const groove=DRUM_GROOVES['tintal-16']
		expect(groove.congaLow[0]).toBeGreaterThan(groove.congaLow[8])
		expect(groove.congaLow.slice(16,24).every(v=>v===0)).toBe(true)
		expect(groove.congaMute[16]).toBeGreaterThan(0)
	})
	test('does not inject foreign instruments or notes into protected rests', () => {
		for(const name of ['reggae','ewe-bell-12','son-clave-3-2','samai-thaqil','tintal-16','bulerias-12']) {
			const groove=DRUM_GROOVES[name], arranger=make(name,{percussionColours:true,rapidPercussion:true,performanceControl:true})
			arranger.requestFill()
			for(let step=0;step<groove.kick.length*2;step++) {
				const parts=arranger.next({bpm:120})
				expect(parts.events).toHaveLength(0)
				for(const part of lanes) if(parts[part]>0) expect(groove[part]?.[step%groove[part].length]).toBeGreaterThan(0)
			}
		}
	})
	test('ghost variations relocate a weak stroke without increasing phrase hit counts', () => {
		const groove=DRUM_GROOVES['funky-drummer']
		const arranger=make('funky-drummer',{phraseBars:4,intent:{...quietIntent,chaos:1}})
		let played=0, original=0, moved=false
		for(let step=0;step<64;step++) {
			const parts=arranger.next({bpm:120})
			played+=hits(parts)
			for(const part of lanes) original+=groove[part]?.[step%groove[part].length]>0?1:0
			if(parts.snare>0&&!groove.snare[step%16])moved=true
		}
		expect(moved).toBe(true)
		expect(played).toBe(original)
	})
	test('all regional adaptations are selectable presets', () => {
		for(const id of ['son-clave-3-2','son-clave-2-3','ewe-bell-12','rachenitsa-7-8','karsilama-9-8','maqsum','samai-thaqil','tintal-16','bulerias-12'])
			expect(PERCUSSION_PRESETS.find(p=>p.id===id)?.groove).toBe(id)
	})
})

describe('existing clock scheduling and cache reuse', () => {
	test('schedules sixteen straight steps in two seconds using existing 24 PPQN ticks', () => {
		const arranger=make('amen'), scheduler=createDrumStepScheduler(), times=[]
		for(let tick=0;tick<96;tick++) {
			const tickAt=tick*0.5/24
			for(const time of scheduler.advance({arranger,tickAt,bpm:120,now:tickAt,lookahead:0.1})) {
				times.push(time);arranger.next({bpm:120,triggerAt:time})
			}
		}
		expect(times).toHaveLength(16)
		expect(times[15]-times[0]).toBeCloseTo(15*0.125)
	})
	test('skips overdue steps without a catch-up burst and preserves phase', () => {
		const arranger=make('amen'), scheduler=createDrumStepScheduler()
		const first=scheduler.advance({arranger,tickAt:0,bpm:120,now:0,lookahead:0.1})
		arranger.next({triggerAt:first[0],bpm:120})
		const after=[...scheduler.advance({arranger,tickAt:2,bpm:120,now:2,lookahead:0.1})]
		expect(after.length).toBeLessThanOrEqual(1)
		expect(arranger.getStep()).toBe(15)
		expect(after[0]).toBeCloseTo(2.1)
	})
	test('keeps the next step continuous across a live tempo change', () => {
		const arranger=make('amen'), scheduler=createDrumStepScheduler()
		scheduler.advance({arranger,tickAt:0,bpm:120,now:0,lookahead:0.1})
		scheduler.advance({arranger,tickAt:0.05,bpm:60,now:0.05,lookahead:0.1})
		const next=[...scheduler.advance({arranger,tickAt:0.2,bpm:60,now:0.2,lookahead:0.1})]
		expect(next).toHaveLength(1)
		expect(next[0]).toBeCloseTo(0.3)
	})
	test('reuses the beat-display array within a bar and replaces it at a boundary', () => {
		const arranger=make('amen')
		arranger.next({bpm:120})
		const first=arranger.getBeatSequence()
		for(let step=1;step<16;step++) {
			arranger.setMutedParts({kick:false,snare:false,hat:false,clap:false})
			arranger.next({bpm:120});expect(arranger.getBeatSequence()).toBe(first)
		}
		arranger.next({bpm:120})
		expect(arranger.getBeatSequence()).not.toBe(first)
	})
})
