import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { DEFAULT_FRICTION_DRUM_OPTIONS } from './friction-drum-presets.js'
export * from './friction-drum-presets.js'

const noiseBuffers = new WeakMap()
const getNoise = context => {
	let buffer=noiseBuffers.get(context); if (buffer) return buffer
	buffer=context.createBuffer(1, context.sampleRate, context.sampleRate)
	const data=buffer.getChannelData(0); for(let i=0;i<data.length;i++) data[i]=Math.random()*2-1
	noiseBuffers.set(context, buffer); return buffer
}

/** Pitch-sliding membrane plus stick friction for open and muted cuicas. */
export const createFrictionDrum = (context, output) => {
	const body=context.createOscillator(), overtone=context.createOscillator(), noise=context.createBufferSource()
	const bodyGain=context.createGain(), overtoneGain=context.createGain(), noiseGain=context.createGain(), filter=context.createBiquadFilter()
	let running=false
	body.type='sine'; overtone.type='triangle'; noise.buffer=getNoise(context); noise.loop=true; filter.type='bandpass'
	body.connect(bodyGain); overtone.connect(overtoneGain); noise.connect(filter); filter.connect(noiseGain)
	bodyGain.connect(output); overtoneGain.connect(output); noiseGain.connect(output)
	const voice=(hitOptions=DEFAULT_FRICTION_DRUM_OPTIONS) => {
		const options={...DEFAULT_FRICTION_DRUM_OPTIONS,...hitOptions}
		const time=Math.max(context.currentTime, options.triggerAt>0?options.triggerAt:context.currentTime+ZERO)
		const endAt=time+Math.max(0.05,options.length), attackAt=Math.min(endAt,time+options.attack), peak=Math.max(ZERO,options.velocity*options.outputGain)
		if(!running){body.start(time);overtone.start(time);noise.start(time);running=true}
		body.frequency.cancelScheduledValues(time); body.frequency.setValueAtTime(Math.max(30,options.startFrequency),time); body.frequency.exponentialRampToValueAtTime(Math.max(30,options.endFrequency),endAt)
		overtone.frequency.cancelScheduledValues(time); overtone.frequency.setValueAtTime(Math.max(40,options.startFrequency*options.overtoneRatio),time); overtone.frequency.exponentialRampToValueAtTime(Math.max(40,options.endFrequency*options.overtoneRatio),endAt)
		filter.frequency.setValueAtTime(Math.max(100,options.noiseFrequency),time); filter.Q.setValueAtTime(2.4,time)
		for(const [gain,level] of [[bodyGain.gain,1],[overtoneGain.gain,options.overtoneLevel]]){gain.cancelScheduledValues(time);gain.setValueAtTime(ZERO,time);gain.exponentialRampToValueAtTime(Math.max(ZERO,peak*level),attackAt);gain.exponentialRampToValueAtTime(ZERO,endAt)}
		noiseGain.gain.cancelScheduledValues(time);noiseGain.gain.setValueAtTime(peak*options.noiseLevel,time);noiseGain.gain.exponentialRampToValueAtTime(ZERO,Math.min(endAt,time+0.045))
		return options
	}
	voice.cancel=()=>{const now=context.currentTime;for(const gain of [bodyGain.gain,overtoneGain.gain,noiseGain.gain]){gain.cancelScheduledValues(now);gain.setValueAtTime(ZERO,now)}}
	voice.choke=(duration,at)=>chokeGains(context,[bodyGain.gain,overtoneGain.gain,noiseGain.gain],duration,at)
	return voice
}
