import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { DEFAULT_WHISTLE_OPTIONS } from './whistle-presets.js'
export * from './whistle-presets.js'

const noiseBuffers=new WeakMap()
const getNoise=context=>{let b=noiseBuffers.get(context);if(b)return b;b=context.createBuffer(1,context.sampleRate,context.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noiseBuffers.set(context,b);return b}

/** Two slightly detuned pipes and filtered breath noise. */
export const createWhistle=(context,output)=>{
	const pipe=context.createOscillator(),beat=context.createOscillator(),noise=context.createBufferSource()
	const pipeGain=context.createGain(),beatGain=context.createGain(),noiseGain=context.createGain(),filter=context.createBiquadFilter();let running=false
	pipe.type='sine';beat.type='sine';noise.buffer=getNoise(context);noise.loop=true;filter.type='bandpass'
	pipe.connect(pipeGain);beat.connect(beatGain);noise.connect(filter);filter.connect(noiseGain);pipeGain.connect(output);beatGain.connect(output);noiseGain.connect(output)
	const voice=(hitOptions=DEFAULT_WHISTLE_OPTIONS)=>{const o={...DEFAULT_WHISTLE_OPTIONS,...hitOptions};const time=Math.max(context.currentTime,o.triggerAt>0?o.triggerAt:context.currentTime+ZERO);const end=time+Math.max(.06,o.length),attack=Math.min(end,time+o.attack),peak=Math.max(ZERO,o.velocity*o.outputGain);if(!running){pipe.start(time);beat.start(time);noise.start(time);running=true}for(const [osc,ratio]of[[pipe,1],[beat,o.secondRatio]]){osc.frequency.cancelScheduledValues(time);osc.frequency.setValueAtTime(Math.max(80,o.startFrequency*ratio),time);osc.frequency.exponentialRampToValueAtTime(Math.max(80,o.endFrequency*ratio),end)}filter.frequency.setValueAtTime(o.breathFrequency,time);filter.Q.setValueAtTime(.7,time);for(const [gain,level]of[[pipeGain.gain,1],[beatGain.gain,.34],[noiseGain.gain,o.breathLevel]]){gain.cancelScheduledValues(time);gain.setValueAtTime(ZERO,time);gain.exponentialRampToValueAtTime(Math.max(ZERO,peak*level),attack);gain.exponentialRampToValueAtTime(Math.max(ZERO,peak*level*.72),Math.min(end,attack+o.decay));gain.exponentialRampToValueAtTime(ZERO,end)}return o}
	voice.cancel=()=>{const now=context.currentTime;for(const g of[pipeGain.gain,beatGain.gain,noiseGain.gain]){g.cancelScheduledValues(now);g.setValueAtTime(ZERO,now)}};voice.choke=(duration,at)=>chokeGains(context,[pipeGain.gain,beatGain.gain,noiseGain.gain],duration,at);return voice
}
