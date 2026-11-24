import {MUSIC_FACTORY_PROFILES, getMusicFactoryProfile} from '../source/audio/music-factory-profiles.js'
import {createFactoryIdentity, combineFactoryPlayers, composeFactoryBar} from '../source/audio/music-factory-score.js'
import {createMusicFactory} from '../source/audio/music-factory.js'
import {DRUM_GROOVES} from '../source/timing/drum-patterns.js'
import {getPercussionPreset} from '../source/audio/synthesizers/percussion-presets.js'

const members = count => Array.from({length:count}, (_, id) => ({id, energy:0.5, tension:0.3, brightness:0.6, contour:0.5}))
const score = (profile, count=1, bar=0, extra={}) => {
	const people = members(count)
	return composeFactoryBar({profile, bar, root:2, seed:'test', ensemble:combineFactoryPlayers(people),
		identities:new Map(people.map(person => [person.id, createFactoryIdentity('test', person.id, 4)])), ...extra})
}

describe.each(MUSIC_FACTORY_PROFILES)('$title', profile => {
	test('has a valid existing percussion companion and matching metre', () => {
		if (!profile.drums) return
		expect(DRUM_GROOVES[profile.groove]).toBeDefined()
		expect(getPercussionPreset(profile.sound)).toBeDefined()
		const groove = DRUM_GROOVES[profile.groove]
		expect((groove.meter?.[0] ?? 4) * 4 / (groove.meter?.[1] ?? 4)).toBe(profile.beats)
	})
	test.each([1, 2, 3, 4])('%i players retain a complete bounded arrangement and every personal contribution', count => {
		for (let bar=0; bar<16; bar++) {
			const plan = score(profile, count, bar)
			expect(plan.events.some(event => event.role === 'bass')).toBe(true)
			expect(plan.events.some(event => event.role === 'harmony')).toBe(true)
			for (let id=0; id<count; id++) expect(plan.events.some(event => event.person === id)).toBe(true)
			expect(plan.events.length).toBeLessThan(42)
			for (const event of plan.events) {
				expect(Number.isFinite(event.step + event.pitch + event.length + event.velocity)).toBe(true)
				expect(event.step).toBeGreaterThanOrEqual(0)
				expect(event.step).toBeLessThan(profile.steps)
				expect(event.length).toBeGreaterThan(0)
				expect(event.pitch).toBeGreaterThanOrEqual(28)
				expect(event.pitch).toBeLessThanOrEqual(96)
			}
		}
	})
	test('queries reproduce the same score regardless of query order', () => {
		const expected = score(profile, 4, 6)
		score(profile, 4, 15); score(profile, 4, 0)
		expect(score(profile, 4, 6)).toEqual(expected)
	})
	test('each participant receives a foreground phrase within a rotation', () => {
		const leads = Array.from({length:4}, (_, phrase) => score(profile, 4, phrase * profile.phraseBars).lead)
		expect(new Set(leads)).toEqual(new Set([0, 1, 2, 3]))
	})
})

test('duplicating equal activity never multiplies group intensity', () => {
	const solo = combineFactoryPlayers(members(1))
	for (const count of [2,3,4]) {
		const group = combineFactoryPlayers(members(count))
		expect(group.energy).toBe(solo.energy)
		expect(group.pitchBend).toBe(solo.pitchBend)
	}
	const group = combineFactoryPlayers([{...members(1)[0], energy:0}, {...members(2)[1], energy:1}])
	 expect(group.energy).toBe(0.5)
	 expect(group.contrast).toBe(1)
})

const harness = (extra={}) => {
	let time = 0
	const player = {play:jest.fn(), stop:jest.fn(), express:jest.fn(), destroy:jest.fn()}
	const onMode = jest.fn(), onProfile = jest.fn(), onStatus = jest.fn()
	const controller = createMusicFactory({player, now:()=>time, onMode, onProfile, onStatus})
	const settings = {musicFactory:true, musicFactoryGenre:'synth-pop', musicFactorySeed:'saved-seed', players:4, bpm:112, key:'C', ...extra}
	controller.configure(settings)
	const observe = (id=0, patch={}) => controller.observe(id, {time, pitch:0.1, roll:0.2, mouthRatio:0.2, happiness:0.6, ...patch}, time)
	const tick = (at=0) => controller.tick({at, audioNow:at, bpm:112, lookahead:0.06})
	return {controller, player, settings, onMode, onProfile, onStatus, observe, tick, time:value=>{time=value}}
}

test('disabled mode never produces music or changes the musical profile', () => {
	const h=harness({musicFactory:false})
	h.observe(); h.tick()
	expect(h.player.play).not.toHaveBeenCalled()
	expect(h.onProfile).not.toHaveBeenCalled()
})

test('waits for fresh tracking; all four player inputs reach the ensemble', () => {
	const h=harness()
	h.tick(); expect(h.player.play).not.toHaveBeenCalled()
	for(let id=0;id<4;id++) h.observe(id)
	h.tick()
	expect(h.controller.getState().players).toEqual([0,1,2,3])
	expect(h.player.play).toHaveBeenCalled()
	expect(h.controller.percussion).toBe(true)
})

test('a session identity freezes after its opening sample and survives expression and genre changes', () => {
	const h=harness()
	for(let i=0;i<15;i++) {h.time(i*50);h.observe()}
	const identity=h.controller.identities.get(0)
	for(let i=15;i<40;i++) {h.time(i*50);h.observe(0,{mouthRatio:0.9, happiness:0})}
	expect(h.controller.identities.get(0)).toBe(identity)
	h.controller.configure({...h.settings,musicFactoryGenre:'jazz'})
	expect(h.controller.identities.get(0)).toBe(identity)
	h.controller.configure({...h.settings,musicFactorySeed:'new-piece'})
	expect(h.controller.identities.size).toBe(0)
})

test('brief occlusion retains a player; departure removes stale control without reseeding others', () => {
	const h=harness(); h.observe(0); h.observe(1); h.tick()
	const identity=h.controller.identities.get(0)
	h.time(900); h.observe(0); h.tick(0.9)
	expect(h.controller.getState().players).toEqual([0,1])
	h.time(2100); h.observe(0); h.tick(2.1)
	expect(h.controller.getState().players).toEqual([0])
	expect(h.controller.identities.get(0)).toBe(identity)
})

test.each(['mute','disable','pause','stop','genre'])('%s cancels scheduled voices', action => {
	const h=harness();h.observe();h.tick();h.player.stop.mockClear()
	if(action==='mute')h.controller.configure({...h.settings,muted:true})
	if(action==='disable')h.controller.configure({...h.settings,musicFactory:false})
	if(action==='pause')h.controller.pause(true)
	if(action==='stop')h.controller.stop()
	if(action==='genre')h.controller.configure({...h.settings,musicFactoryGenre:'ambient'})
	expect(h.player.stop).toHaveBeenCalled()
	if(['mute','disable','pause'].includes(action)) {
		h.player.play.mockClear();h.tick(1);expect(h.player.play).not.toHaveBeenCalled()
	}
})

test('a stalled clock skips expired steps instead of replaying attacks', () => {
	const h=harness(); h.observe(); h.tick()
	h.player.play.mockClear(); h.time(200);h.observe()
	h.tick(30)
	expect(h.player.play.mock.calls.length).toBeLessThan(12)
	for(const [, at] of h.player.play.mock.calls)expect(at).toBeGreaterThanOrEqual(30)
})

test('finish reaches a finite tonic ending, silences percussion, and waits for a new piece', () => {
	const h=harness();h.observe();h.tick();h.controller.finish()
	for(let i=1;i<150;i++) {h.time(i*100);h.observe();h.tick(i/10)}
	expect(h.controller.getState().finished).toBe(true)
	expect(h.controller.percussion).toBe(false)
	expect(h.onStatus.mock.calls.some(([message])=>message.includes('ending'))).toBe(true)
})

test('genres produce distinct rhythmic and harmonic structures', () => {
	const plans=MUSIC_FACTORY_PROFILES.map(profile=>JSON.stringify(score(profile,2).events.map(({step,pitch,length})=>[step,pitch,length])))
	expect(new Set(plans).size).toBe(MUSIC_FACTORY_PROFILES.length)
	expect(getMusicFactoryProfile('waltz').beats).toBe(3)
	expect(getMusicFactoryProfile('cyclic').beats).toBe(3.5)
})

test('movement smoothing uses observation milliseconds even when the transport reports seconds', () => {
	const h=harness()
	h.controller.observe(0,{time:0,mouthRatio:0,pitch:0},0)
	for(let frame=1;frame<15;frame++) {
		h.time(frame*50)
		h.controller.observe(0,{time:frame,mouthRatio:0.5,pitch:0},frame/20)
	}
	h.tick()
	expect(h.controller.ensemble.energy).toBeGreaterThan(0.2)
})

test('a fresh piece waits for new observations and cannot replay a departed ensemble', () => {
	const h=harness();h.observe();h.tick()
	h.controller.configure({...h.settings,musicFactorySeed:'fresh'})
	h.player.play.mockClear();h.tick(1)
	expect(h.player.play).not.toHaveBeenCalled()
	expect(h.controller.ensemble.members).toHaveLength(0)
})

test('switching modes preserves a settled identity while requiring fresh tracking', () => {
	const h=harness()
	for(let frame=0;frame<15;frame++){h.time(frame*50);h.observe()}
	const identity=h.controller.identities.get(0)
	h.controller.configure({...h.settings,musicFactory:false})
	h.controller.configure(h.settings)
	h.player.play.mockClear();h.tick(1)
	expect(h.player.play).not.toHaveBeenCalled()
	for(let frame=15;frame<30;frame++){h.time(frame*50);h.observe(0,{mouthRatio:0,happiness:0})}
	expect(h.controller.identities.get(0)).toBe(identity)
})

test('existing performance drums control disables activity mapping without disabling the groove', () => {
	const h=harness({performanceDrums:false})
	const before=h.controller.drumArranger.getIntent()
	h.controller.drumArranger.updatePerson({noteVelocity:1,pitchBend:1},1)
	expect(h.controller.drumArranger.getIntent()).toEqual(before)
	h.controller.configure({...h.settings,performanceDrums:true})
	h.controller.drumArranger.updatePerson({noteVelocity:1,pitchBend:1},2)
	expect(h.controller.drumArranger.getIntent().energy).toBe(1)
})
