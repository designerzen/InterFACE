import { GENERAL_MIDI_INSTRUMENT_DATA } from '../general-midi-instruments.data.js'

const caches = new WeakMap()
const impulseFor = (context, settings) => {
	let cache = caches.get(context)
	if (!cache) { cache = new Map(); caches.set(context,cache) }
	const key = settings.url || `${settings.duration}:${settings.decay}`
	if (!cache.has(key)) {
		const pending = (async () => {
			if (settings.url) {
				const response = await fetch(settings.url)
				if (!response.ok) throw Error(`Could not load reverb: ${response.status}`)
				return context.decodeAudioData(await response.arrayBuffer())
			}
			const length = Math.max(1,Math.floor(context.sampleRate*settings.duration))
			const buffer = context.createBuffer(2,length,context.sampleRate)
			for (let channel=0;channel<2;channel++) {
				const data = buffer.getChannelData(channel)
				for (let i=0;i<length;i++) data[i] = (Math.random()*2-1)*Math.pow(1-i/length,settings.decay)
			}
			return buffer
		})()
		cache.set(key,pending)
		if (cache.size > 16) cache.delete(cache.keys().next().value)
		pending.catch(() => cache.delete(key))
	}
	return cache.get(key)
}

export const createVoiceReverb = (context, source, destination, {wetDestination=destination,handle}={}) => {
	if (!context.createConvolver) { source.connect(destination); return {configure:async () => {},destroy(){}} }
	const dry = context.createGain(), wet = context.createGain(), convolver = context.createConvolver()
	source.connect(dry); dry.connect(destination)
	// The dry path still follows the Person's effects. Feed the wet path with
	// expression before convolution and return it after the mouth gain.
	const expression = handle ? context.createGain() : null
	const pan = handle && context.createStereoPanner ? context.createStereoPanner() : null
	if (expression) { source.connect(expression); expression.connect(pan ?? convolver); if (pan) pan.connect(convolver) }
	else source.connect(convolver)
	convolver.connect(wet); wet.connect(wetDestination)
	wet.gain.value = 0
	let frame
	const sync = () => {
		if (!expression) return
		const person = handle.options?.voicePerson
		expression.gain.value = (person?.gainNode?.gain.value ?? 1)*(person?.trimNode?.gain.value ?? 1)*(handle.volume ?? 1)
		if (pan) pan.pan.value = person?.stereoNode?.pan.value ?? 0
		if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(sync)
	}
	sync()
	return {
		async configure(settings,program){
			const disabled = settings.reverbMode === 'off' || settings.reverbDisabledPrograms?.includes(program)
			const preset = settings.reverbMode === 'preset' ? GENERAL_MIDI_INSTRUMENT_DATA[program]?.reverb : null
			const mix = disabled ? 0 : preset?.mix ?? settings.reverbMix ?? 0.15
			const buffer = mix > 0 ? await impulseFor(context,{
				duration:preset?.duration ?? settings.reverbDuration ?? 1.5,
				decay:preset?.decay ?? settings.reverbDecay ?? 2,
				url:settings.reverbMode === 'custom' ? settings.reverbImpulse : ''
			}) : null
			if (convolver.buffer !== buffer) convolver.buffer = buffer
			dry.gain.setTargetAtTime(1-mix,context.currentTime,0.01)
			wet.gain.setTargetAtTime(mix,context.currentTime,0.01)
		},
		destroy(){
			if (frame !== undefined) cancelAnimationFrame(frame)
			source.disconnect(dry); source.disconnect(expression ?? convolver)
			expression?.disconnect(); pan?.disconnect(); dry.disconnect(); wet.disconnect(); convolver.disconnect()
		}
	}
}
