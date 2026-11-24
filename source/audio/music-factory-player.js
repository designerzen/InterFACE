// Synthesis is scheduled on the audio clock; timers only publish the performed trace.
export const createMusicFactoryPlayer = (context, destination, record) => {
	const output = context.createGain()
	output.gain.value = 0.48
	output.connect(destination)
	const voices = new Set(), addresses = new Map(), strips = new Map()
	let generation = 0, destroyed = false
	const stripFor = person => {
		const key = person ?? 'ensemble'
		if (!strips.has(key)) {
			const gain = context.createGain(), filter = context.createBiquadFilter(), pan = context.createStereoPanner()
			filter.type = 'lowpass'; filter.frequency.value = 4500
			gain.connect(filter); filter.connect(pan); pan.connect(output)
			strips.set(key, {gain, filter, pan})
		}
		return strips.get(key)
	}
	const timerAt = (time, callback) => {
		const token = generation
		return setTimeout(() => { if (generation === token && !destroyed) callback() }, Math.max(0, (time - context.currentTime) * 1000))
	}
	const publish = (voice, type, at) => record({type, note:voice.event.pitch,
		velocity:type === 'noteOn' ? voice.event.velocity : 0, source:voice.source,
		name:voice.event.person == null ? `Music Factory ${voice.event.role}` : `Music Factory Player ${voice.event.person + 1}`,
		person:voice.event.person ?? undefined, program:voice.event.program,
		performanceTime:performance.now() + (at - context.currentTime) * 1000})
	const release = (voice, at=context.currentTime) => {
		clearTimeout(voice.offTimer)
		voice.gain.gain.cancelScheduledValues(at)
		voice.gain.gain.setTargetAtTime(0, at, 0.015)
		voice.osc.stop(at + 0.08)
		voice.end = at
		voice.offTimer = timerAt(at, () => {
			if (voice.started) publish(voice, 'noteOff', at)
			voice.started = false
		})
	}
	const stop = () => {
		generation++
		for (const voice of voices) {
			clearTimeout(voice.onTimer); clearTimeout(voice.offTimer)
			if (voice.started) publish(voice, 'noteOff', context.currentTime)
			voice.osc.onended = null
			try { voice.osc.stop() } catch {}
			voice.osc.disconnect(); voice.gain.disconnect()
		}
		voices.clear(); addresses.clear()
	}
	return {
		express(members) {
			if (destroyed) return
			const active = new Set(members.map(member => member.id))
			for (const [key, strip] of strips) {
				if (key !== 'ensemble' && !active.has(key)) strip.gain.gain.setTargetAtTime(0, context.currentTime, 0.12)
			}
			for (const member of members) {
				const strip = stripFor(member.id)
				strip.gain.gain.setTargetAtTime(0.65 + member.energy * 0.35, context.currentTime, 0.04)
				strip.filter.frequency.setTargetAtTime(900 + member.brightness * 5500, context.currentTime, 0.06)
				strip.pan.pan.setTargetAtTime(Math.max(-0.6, Math.min(0.6, member.pan ?? 0)), context.currentTime, 0.08)
			}
		},
		play(event, at, duration) {
			if (destroyed || !Number.isInteger(event.pitch) || event.pitch < 0 || event.pitch > 127 || !Number.isFinite(event.velocity) ||
				!Number.isFinite(at) || !Number.isFinite(duration) || duration <= 0 || at < context.currentTime - 0.03) return
			at = Math.max(context.currentTime, at)
			const source = `music-factory:${event.role}:${event.person ?? 'ensemble'}`
			const address = `${source}:${event.pitch}`
			const old = addresses.get(address)
			if (old && old.end > at) release(old, at)
			const osc = context.createOscillator(), gain = context.createGain()
			const voice = {event, source, osc, gain, end:at + duration, started:false}
			const tone = event.tone ?? 'soft'
			osc.type = tone === 'pulse' ? 'square' : tone === 'bright' || tone === 'reed' ? 'sawtooth' : tone === 'keys' || tone === 'pluck' ? 'triangle' : 'sine'
			osc.frequency.setValueAtTime(440 * 2 ** ((event.pitch - 69) / 12), at)
			const attack = tone === 'soft' ? Math.min(0.22, duration * 0.3) : 0.008
			const level = event.velocity * (event.role === 'bass' ? 0.2 : event.role === 'harmony' ? 0.1 : 0.16)
			gain.gain.setValueAtTime(0, at)
			gain.gain.linearRampToValueAtTime(level, at + attack)
			if (tone === 'keys' || tone === 'pluck') gain.gain.setTargetAtTime(level * 0.15, at + attack, Math.max(0.04, duration * 0.25))
			gain.gain.setTargetAtTime(0, voice.end, tone === 'soft' ? 0.12 : 0.025)
			osc.connect(gain); gain.connect(stripFor(event.person).gain)
			voices.add(voice); addresses.set(address, voice)
			voice.onTimer = timerAt(at, () => {
				voice.started = true
				publish(voice, 'programChange', at)
				publish(voice, 'noteOn', at)
			})
			voice.offTimer = timerAt(voice.end, () => { if (voice.started) publish(voice, 'noteOff', voice.end); voice.started = false })
			osc.onended = () => {
				voices.delete(voice)
				if (addresses.get(address) === voice) addresses.delete(address)
				osc.disconnect(); gain.disconnect()
			}
			osc.start(at); osc.stop(voice.end + 0.6)
		},
		stop,
		destroy() {
			if (destroyed) return
			stop()
			destroyed = true
			for (const {gain, filter, pan} of strips.values()) { gain.disconnect(); filter.disconnect(); pan.disconnect() }
			strips.clear(); output.disconnect()
		}
	}
}
