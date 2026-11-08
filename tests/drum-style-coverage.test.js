import { DRUM_STYLES, STYLE_DRUM_GROOVES } from '../source/timing/drum-styles.js'
import { DRUM_GROOVES, AUXILIARY_DRUM_LANES } from '../source/timing/drum-patterns.js'
import { createDrumArranger } from '../source/timing/drum-arranger.js'
import { compileDrumFeel, getDrumGrid, getDrumPartTime, createDrumStepScheduler } from '../source/timing/drum-feel.js'
import { PERCUSSION_PRESETS, getPercussionPreset } from '../source/audio/synthesizers/percussion-presets.js'

const requested = [
	'Jazz','Blues','Classical piano','Baroque counterpoint','Romantic piano','Ragtime',
	'Funk','Reggae/dub','Disco/house','Synth-pop','Synthwave','Bossa nova','Drum & bass',
	'Afrobeat','Highlife','Soukous','Mbalax','Ethio-jazz','Amapiano','Gnawa-inspired',
	'Raï-inspired','Arabic maqam-inspired','Turkish folk-inspired','Persian classical-inspired',
	'Indian raga-inspired','Qawwali-inspired','Gamelan-inspired','Japanese koto-inspired',
	'Chinese guzheng-inspired','Korean folk-inspired','Irish jig-inspired','Flamenco-inspired',
	'Klezmer-inspired','Balkan dance-inspired','Tango','Argentine tango','Samba','Salsa',
	'Cumbia','Merengue','Calypso','Soca','Bluegrass','Rock','Hip-hop','Trap',
]
const lanes = ['kick','snare','hat','clap',...AUXILIARY_DRUM_LANES]
const make = (groove, bpm=120) => createDrumArranger({groove,bpm,seed:'style-coverage',phraseBars:4,performanceControl:false})

describe('requested style coverage', () => {
	test.each(requested)('%s resolves to a selectable timed arrangement', title => {
		const preset = getPercussionPreset(title)
		expect(preset).toBeDefined()
		expect(PERCUSSION_PRESETS).toContain(preset)
		const groove = DRUM_GROOVES[preset.groove]
		expect(groove).toBeDefined()
		expect(preset.stepsPerBar).toBe(groove.stepsPerBar)
		expect(preset.description).toEqual(expect.any(String))
	})
	test('covers every requested label and keeps saved preset IDs unique', () => {
		expect(DRUM_STYLES.map(style => style.title)).toEqual(requested)
		expect(new Set(PERCUSSION_PRESETS.map(preset => preset.id)).size).toBe(PERCUSSION_PRESETS.length)
	})
	test.each(Object.keys(STYLE_DRUM_GROOVES))('%s stays sparse, aligned and preserves authored rests during fills', name => {
		const groove = DRUM_GROOVES[name], grid = getDrumGrid(groove)
		const count = lanes.reduce((total,part) => total + (groove[part]?.filter(Boolean).length ?? 0),0)
		expect(count).toBeGreaterThan(0)
		expect(count / (groove.kick.length / grid.stepsPerBeat)).toBeLessThanOrEqual(8)
		expect(grid.stepsPerBeat).toBeLessThanOrEqual(4)
		const arranger = createDrumArranger({groove:name,bpm:120,seed:name,rapidPercussion:true,percussionColours:true})
		arranger.requestFill()
		for (let step=0;step<groove.kick.length*5;step++) {
			const parts=arranger.next({bpm:120})
			expect(parts.events).toHaveLength(0)
			for (const part of lanes) if(parts[part]>0) expect(groove[part]?.[step%groove[part].length]).toBeGreaterThan(0)
		}
	})
	test.each([72,173])('all styles complete their cycles at %s BPM on the existing clock', bpm => {
		for (const style of DRUM_STYLES) {
			const groove=DRUM_GROOVES[style.groove], arranger=make(style.groove,bpm)
			const scheduler=createDrumStepScheduler(), duration=arranger.getStepDuration()
			const cycle=duration*groove.kick.length, times=[]
			for(let tick=0;tick*(60/bpm/24)<cycle-1e-8;tick++) {
				const tickAt=tick*60/bpm/24
				for(const time of scheduler.advance({arranger,tickAt,bpm,now:tickAt,lookahead:0.05})) {
					times.push(time);arranger.next({bpm,triggerAt:time})
				}
			}
			expect(times).toHaveLength(groove.kick.length)
			expect(times[times.length-1]-times[0]+duration).toBeCloseTo(cycle)
		}
	})
})

describe('distinct timing structures', () => {
	test.each([
		['blues-shuffle',[12,8],[0,3,6,9]], ['romantic-piano',[3,4],[0,4,8]],
		['irish-jig-inspired',[6,8],[0,3]], ['korean-folk-inspired',[12,8],[0,3,6,9]],
		['tango',[2,4],[0,3,4,6]], ['argentine-tango',[4,4],[0,3,6]],
	])('%s retains its meter and grouping', (name,meter,strong) => {
		const groove=DRUM_GROOVES[name]
		expect(groove.meter).toEqual(meter)
		expect(Array.from(compileDrumFeel(groove,getDrumGrid(groove)).strong).flatMap((v,i) => v?[i]:[])).toEqual(strong)
	})
	test('romantic phrase breathing moves all voices together, without changing the cycle or event order', () => {
		const arranger=make('romantic-piano'), duration=arranger.getStepDuration(), times=[]
		for(let step=0;step<25;step++) {
			const parts=arranger.next({bpm:120})
			const base=step*duration, at=getDrumPartTime(parts,'kick',base)
			expect(getDrumPartTime(parts,'triangleMute',base)).toBe(at)
			expect(at-base).toBeGreaterThanOrEqual(0)
			expect(at-base).toBeLessThan(0.05)
			times.push(at)
		}
		expect(times[8]).toBeGreaterThan(8*duration)
		expect(times[12]).toBe(12*duration)
		expect(times[24]).toBe(24*duration)
		for(let i=1;i<times.length;i++) expect(times[i]).toBeGreaterThan(times[i-1])
	})
	test('Korean cycle emphasizes one and nine; Kaharwa leaves a lighter fifth beat', () => {
		const korean=DRUM_GROOVES['korean-folk-inspired']
		expect(korean.congaLow[0]).toBeGreaterThan(korean.congaLow[6])
		expect(korean.congaLow[8]).toBeGreaterThan(korean.congaLow[6])
		expect(DRUM_GROOVES['qawwali-inspired'].congaLow[4]).toBe(0)
	})
	test('the gamelan companion marks the cycle ending with its low gong proxy', () => {
		expect(DRUM_GROOVES['gamelan-inspired'].tomFloorLow.flatMap((v,i) => v?[i]:[])).toEqual([15])
	})
	test('timing runs without adding timers', () => {
		const timeout=jest.spyOn(global,'setTimeout'), interval=jest.spyOn(global,'setInterval')
		try {
			for(const style of DRUM_STYLES) {
				const arranger=make(style.groove)
				for(let step=0;step<arranger.getStepsPerBar()*2;step++)arranger.next({bpm:120})
			}
			expect(timeout).not.toHaveBeenCalled()
			expect(interval).not.toHaveBeenCalled()
		} finally {timeout.mockRestore();interval.mockRestore()}
	})
})
