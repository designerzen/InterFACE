import {getMusicFactoryProfile} from './music-factory-profiles.js'
import {clampFactory as clamp, factoryHash, createFactoryIdentity, combineFactoryPlayers, composeFactoryBar} from './music-factory-score.js'
import {createDrumArranger} from '../timing/drum-arranger.js'
import {getPitchClassForKey} from './tuning/keys.js'

export const createMusicFactory = ({player, now=()=>performance.now(), onStatus=()=>{}, onMode=()=>{}, onProfile=()=>{}}) => {
	const slots = new Map(), identities = new Map(), frozenIdentities = new Set()
	let settings = {}, enabled = false, profile = getMusicFactoryProfile(), arranger
	let seed = '', nextAt = null, lastDuration = null, step = 0, plan, planBar = -1
	let ensemble = combineFactoryPlayers([]), lastEnsemble = ensemble, lastPresent = null
	let ending = false, finished = false, endingBar = null, paused = false, status = ''
	const report = message => { if (message !== status) { status = message; onStatus(message) } }
	const reset = () => {
		player.stop(); nextAt = null; lastDuration = null; plan = null; planBar = -1
		ending = false; endingBar = null; step = 0
	}
	const setProfile = id => {
		profile = getMusicFactoryProfile(id)
		reset(); finished = false
		arranger = createDrumArranger({seed:`${seed}:${profile.id}`, groove:profile.groove,
			bpm:settings.bpm ?? profile.bpm, performanceControl:settings.performanceDrums !== false, performancePreset:profile.performance,
			rapidPercussion:settings.rapidPercussion === true,
			intent:{energy:0.4, density:0.4, fillChance:0.12, rollChance:0.06, chaos:0.04}})
		onProfile(profile)
	}
	const activeEnsemble = () => {
		const time = now()
		const members = [...slots.values()].filter(slot => slot.id < Math.max(1, Math.min(4, settings.players ?? 1)) && time - slot.lastSeen < 1800)
			.sort((a,b) => a.id - b.id).map(slot => ({...slot, energy:slot.energy * clamp(1 - Math.max(0, time - slot.lastSeen - 500) / 1800)}))
		ensemble = combineFactoryPlayers(members)
		if (members.length) { lastEnsemble = ensemble; lastPresent = time }
		return ensemble
	}
	return {
		get enabled() { return enabled },
		get profile() { return profile },
		get drumArranger() { return arranger },
		get percussion() { return enabled && !paused && !finished && profile.drums && (ensemble.members.length > 0 || ending) },
		get ensemble() { return ensemble },
		get identities() { return identities },
		configure(next) {
			const wasEnabled = enabled, oldGenre = settings.musicFactoryGenre, oldSeed = seed
			const oldPerformance = settings.performanceDrums, oldRapid = settings.rapidPercussion
			settings = {...next}
			enabled = settings.musicFactory === true
			seed = String(settings.musicFactorySeed ?? 'photosynth')
			if (oldSeed !== seed) {
				identities.clear(); frozenIdentities.clear(); slots.clear()
				ensemble = combineFactoryPlayers([]); lastEnsemble = ensemble; lastPresent = null
			}
			if (wasEnabled !== enabled) {
				reset(); finished = false; lastPresent = null
				if (enabled) slots.clear()
				onMode(enabled)
			}
			if (enabled && (!wasEnabled || oldGenre !== settings.musicFactoryGenre || oldSeed !== seed)) setProfile(settings.musicFactoryGenre)
			if (oldPerformance !== settings.performanceDrums) arranger?.setPerformanceControl(settings.performanceDrums !== false)
			if (oldRapid !== settings.rapidPercussion) arranger?.setRapidPercussion(settings.rapidPercussion === true)
			if (!enabled) report('Musical instrument — play notes directly')
			if (settings.muted) reset()
		},
		observe(id, prediction, time, person={}) {
			if (!enabled || id < 0 || id > 3 || !prediction || !Number.isFinite(time)) return
			const old = slots.get(id)
			if (old?.frame === prediction.time && prediction.time != null) return
			const observedAt = now()
			const elapsed = old ? Math.max(0, Math.min(0.25, (observedAt - old.time) / 1000)) : 0.1
			const motion = person.motion
			const activity = clamp(person.currentActivity ?? person.activity?.currentActivity ?? 0)
			const movement = motion?.tracked ? clamp((motion.translationSpeed + motion.rotationSpeed) * 0.3) :
				old && elapsed > 0 ? clamp((Math.abs((prediction.roll ?? 0) - old.roll) + Math.abs((prediction.pitch ?? 0) - old.pitch)) / elapsed * 0.2) : 0
			const mouth = clamp((prediction.mouthRatio ?? 0) * 3)
			const brightness = clamp(prediction.happiness ?? prediction.mouthSmile ?? 0.4)
			const target = clamp(activity * 0.4 + movement * 0.35 + mouth * 0.25)
			const alpha = 1 - Math.exp(-elapsed / 0.18)
			const energy = old ? old.energy + (target - old.energy) * alpha : target
			const slot = {id, energy, brightness, tension:clamp(Math.abs(person.pitchBendValue != null ? person.pitchBendValue - 1 : prediction.eyebrowsRaisedBy ?? prediction.yaw ?? 0)),
				contour:clamp((prediction.pitch ?? 0) + 0.5), pan:clamp(prediction.roll ?? 0, -0.6, 0.6),
				roll:prediction.roll ?? 0, pitch:prediction.pitch ?? 0, lastSeen:observedAt, time:observedAt, frame:prediction.time,
				samples:(old?.samples ?? 0) + 1, signature:(old?.signature ?? 0) + mouth + brightness + movement}
			slots.set(id, slot)
			// Freeze a coarse session signature after several frames; later expressions never reseed it.
			if (!identities.has(id) || (!frozenIdentities.has(id) && slot.samples === 12)) {
				identities.set(id, createFactoryIdentity(seed, id, Math.round(slot.signature / slot.samples * 8)))
				if (slot.samples === 12) frozenIdentities.add(id)
			}
			if (finished && old && now() - old.lastSeen > 1800) { finished = false; reset() }
		},
		tick({at, bpm, audioNow, lookahead=0.06}) {
			if (!enabled || paused || settings.muted || !Number.isFinite(at) || !(bpm > 0) || !Number.isFinite(audioNow)) return
			const current = activeEnsemble()
			player.express(current.members)
			if (!current.members.length && lastPresent == null) { report(`${profile.title} — waiting for players`); return }
			if (!current.members.length && now() - lastPresent > 3000 && !ending) ending = true
			if (finished) return
			const duration = 60 / bpm * profile.beats / profile.steps
			const horizon = at + Math.max(0, Math.min(0.15, lookahead))
			if (nextAt == null) nextAt = Math.max(audioNow + 0.005, horizon)
			if (lastDuration && lastDuration !== duration) nextAt = horizon + Math.max(0, nextAt - horizon) * duration / lastDuration
			lastDuration = duration
			if (nextAt < audioNow - 0.03) {
				const missed = Math.ceil((audioNow + 0.005 - nextAt) / duration)
				step += missed; nextAt += missed * duration
			}
			let budget = 32
			while (nextAt <= horizon + 1e-6 && budget-- > 0) {
				const bar = Math.floor(step / profile.steps), local = step % profile.steps
				if (bar !== planBar) {
					if (endingBar != null && bar > endingBar) {
						finished = true; reset(); finished = true
						report(`${profile.title} — finished. Choose New piece to begin again.`); return
					}
					if (ending) endingBar = bar
					plan = composeFactoryBar({profile, bar, root:getPitchClassForKey(settings.key ?? 0),
						ensemble:current.members.length ? current : lastEnsemble, identities, seed, ending})
					planBar = bar
					const who = plan.lead == null ? '' : ` · Player ${plan.lead + 1} leads`
					report(`${profile.title} · ${plan.section} · ${current.members.length} player${current.members.length === 1 ? '' : 's'}${who}`)
				}
				for (const event of plan.events) if (Math.floor(event.step) === local) player.play(event, nextAt + (event.step - local) * duration, event.length * duration)
				step++; nextAt += duration
			}
		},
		finish() { if (enabled && lastPresent != null) ending = true },
		pause(value) { paused = value; if (paused) reset() },
		stop:reset,
		destroy() { enabled = false; paused = true; reset(); player.destroy(); slots.clear(); identities.clear(); frozenIdentities.clear() },
		getState:() => ({enabled, genre:profile.id, seed:factoryHash(seed), step, section:plan?.section, players:ensemble.members.map(member => member.id), finished})
	}
}
