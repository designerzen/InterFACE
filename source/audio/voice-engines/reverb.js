import { GENERAL_MIDI_INSTRUMENT_DATA } from '../general-midi-instruments.data.js'
import { getReverbImpulse } from '../effects/reverb-spaces.js'
import { watchVoiceControls } from './controls.js'
import { voiceEngineGain } from '../voice-engine-levels.js'

// Old returns fade out rather than being cut, so switching spaces never clicks
const RELEASE_FADE = 0.08
const RELEASE_DELAY = 300

const ramp = (param, value, context, time) => {
	param.cancelScheduledValues?.(context.currentTime)
	param.setTargetAtTime(value, context.currentTime, time)
}

// One convolver per (destination, impulse) shared by every voice. Each voice
// sets its own amount on its send, so CPU no longer grows with player count.
const pools = new WeakMap()
const acquireReturn = (context, destination, buffer) => {
	let entries = pools.get(context)
	if (!entries) { entries = new Set(); pools.set(context, entries) }
	let entry
	for (const candidate of entries) if (candidate.destination === destination && candidate.buffer === buffer) { entry = candidate; break }
	if (!entry) {
		const convolver = context.createConvolver(), wet = context.createGain()
		convolver.buffer = buffer
		wet.gain.value = 0
		convolver.connect(wet); wet.connect(destination)
		entry = {destination, buffer, convolver, wet, users:0, timer:null}
		entries.add(entry)
	}
	if (entry.timer) { clearTimeout(entry.timer); entry.timer = null }
	if (!entry.users++) ramp(entry.wet.gain, 1, context, 0.01)
	return {
		input:entry.convolver,
		release(){
			if (--entry.users) return
			// Mouth closure keeps the send connected at zero gain, so tails still
			// ring. Disposal/settings changes release unused DSP shortly after;
			// retaining old convolvers while sliders move can multiply CPU load.
			ramp(entry.wet.gain, 0, context, RELEASE_FADE / 3)
			entry.timer = setTimeout(() => {
				entry.timer = null
				if (entry.users) return
				entry.convolver.disconnect(); entry.wet.disconnect(); entries.delete(entry)
			}, RELEASE_DELAY)
		}
	}
}

/**
 * Impulse options for a program: presets pick a space and amount per
 * instrument family, custom mode uses the engine settings. The shared room
 * is a second, named space every player sends to on top of that.
 */
export const resolveVoiceReverb = (settings, program) => {
	const preset = settings.reverbMode === 'preset' ? GENERAL_MIDI_INSTRUMENT_DATA[program]?.reverb : null
	const disabled = settings.reverbMode === 'off' || settings.reverbDisabledPrograms?.includes(program)
	const mix = disabled ? 0 : preset?.mix ?? settings.reverbMix ?? 0.15
	const room = {mix:settings.roomMix ?? 0, impulse:{space:settings.roomSpace, tone:0, preDelay:0.02, fallback:true}}
	if (preset) return {mix, room, impulse:{space:preset.space, length:preset.space ? undefined : preset.duration, tone:0, preDelay:0.012, fallback:true}}
	return {mix, room, impulse:{space:settings.reverbSpace, length:settings.reverbLength, tone:settings.reverbTone, preDelay:settings.reverbPreDelay, fallback:settings.reverbMode === 'preset'}}
}

// Up to 50% the mix only adds reverb; beyond that the dry signal fades out
const dryLevel = mix => Math.min(1, 2 * (1 - mix))

export const createVoiceReverb = (context, source, destination, {wetDestination=destination,handle,engine,applyOutputGain=true}={}) => {
	if (!context.createConvolver) { source.connect(destination); return {configure:async () => {},sync(){},destroy(){ source.disconnect(destination) }} }
	const dry = context.createGain()
	source.connect(dry); dry.connect(destination)
	// The dry path still follows the Person's effects. Feed the wet path with
	// expression before convolution and return it after the mouth gain.
	// Each bus (instrument, room) then sets its own amount from that tap.
	let expression, pan, tap, controls, revision = 0, destroyed = false, level = 1
	const buses = {instrument:{send:null, current:null}, room:{send:null, current:null}}
	const ensureTap = () => {
		if (tap) return
		expression = context.createGain()
		pan = handle && context.createStereoPanner ? context.createStereoPanner() : null
		source.connect(expression)
		if (pan) expression.connect(pan)
		tap = pan ?? expression
		controls = handle ? watchVoiceControls(context, handle, (gain, position) => {
			if (expression.gain.value !== gain*level) expression.gain.value = gain*level
			if (pan && pan.pan.value !== position) pan.pan.value = position
		}) : null
	}
	const removeTap = () => {
		controls?.destroy(); controls = null
		if (expression) { source.disconnect(expression); expression.disconnect() }
		pan?.disconnect()
		expression = pan = tap = null
	}
	const route = (bus, buffer, amount) => {
		if (bus.current?.buffer !== buffer) {
			if (buffer) {
				ensureTap()
				if (!bus.send) { bus.send = context.createGain(); tap.connect(bus.send) }
			}
			const next = buffer ? acquireReturn(context, wetDestination, buffer) : null
			if (bus.current) { bus.send.disconnect(bus.current.input); bus.current.release() }
			bus.current = next ? {...next,buffer} : null
			if (bus.current) {
				bus.send.connect(bus.current.input)
			} else if (bus.send) { tap.disconnect(bus.send); bus.send.disconnect(); bus.send = null }
		}
		bus.send?.gain.setTargetAtTime(amount,context.currentTime,0.01)
	}
	return {
		sync(){ controls?.sync() },
		async configure(settings,program){
			const version = ++revision
			const nextLevel = applyOutputGain ? voiceEngineGain(engine,settings) : 1
			const {mix, impulse, room} = resolveVoiceReverb(settings, program)
			const [buffer, roomBuffer] = await Promise.all([
				mix > 0 ? getReverbImpulse(context, impulse) : null,
				room.mix > 0 ? getReverbImpulse(context, room.impulse) : null
			])
			if (destroyed || version !== revision) return
			level = nextLevel
			route(buses.instrument, buffer, mix)
			route(buses.room, roomBuffer, room.mix)
			if (!buses.instrument.send && !buses.room.send) removeTap()
			dry.gain.setTargetAtTime(dryLevel(mix)*level,context.currentTime,0.01)
			if (controls) controls.sync(true)
			else expression?.gain.setTargetAtTime(level,context.currentTime,0.01)
		},
		destroy(){
			if (destroyed) return
			destroyed = true; revision++
			source.disconnect(dry); dry.disconnect()
			for (const bus of Object.values(buses)) {
				bus.current?.release(); bus.current = null
				bus.send?.disconnect(); bus.send = null
			}
			removeTap()
		}
	}
}
