import InstrumentFactory from '../source/audio/instrument-factory.js'
import {normaliseEngineSettings} from '../source/audio/voice-engine-settings.js'
import {VOICE_ENGINE_TRIM_DB} from '../source/audio/voice-engine-levels.js'

// Measure every GM program on one engine: velocity 80, C3+C4+C5, loudest 100 ms
// over two seconds, so plucks and slow attacks are comparable. Returns dBFS and
// peak; a new trim is the existing trim plus (target - measured).
export async function measureEnginePrograms(engine, programs=Array.from({length:128},(_,program)=>program)) {
	const context = new AudioContext({sampleRate:48000})
	await context.resume()
	const url = URL.createObjectURL(new Blob([`
		registerProcessor('program-level-capture',class extends AudioWorkletProcessor {
			constructor(){super();this.remaining=0;this.port.onmessage=()=>{this.remaining=Math.round(sampleRate*2);this.squares=this.count=this.peak=this.loudest=0}}
			process(inputs){for(const value of inputs[0]?.[0]??new Float32Array(128)){if(this.remaining>0){this.squares+=value*value;this.peak=Math.max(this.peak,Math.abs(value));if(++this.count===4800){this.loudest=Math.max(this.loudest,this.squares/4800);this.squares=this.count=0}if(--this.remaining===0)this.port.postMessage({rms:Math.sqrt(this.loudest),peak:this.peak})}}return true}
		})`],{type:'application/javascript'}))
	await context.audioWorklet.addModule(url)
	URL.revokeObjectURL(url)
	const destination = context.createGain(), capture = new AudioWorkletNode(context,'program-level-capture'), mute = context.createGain()
	mute.gain.value=0
	destination.connect(capture).connect(mute).connect(context.destination)
	const factory = new InstrumentFactory(context,{voiceEngine:engine,destination,voiceEngineSettings:{[engine]:normaliseEngineSettings(engine,{reverbMode:'off'})}})
	const voice = await factory.createVoiceInstrument({defaultPreset:0,instrumentPack:'OpenGM24',preload:false,useWorkers:false})
	voice.output.connect(destination)
	const results = []
	try {
		for (const program of programs) {
			await voice.programChange(program)
			// Let Yoshimi's previous release tail clear before capturing.
			await new Promise(resolve => setTimeout(resolve,engine === 'yoshimi' ? 1000 : 50))
			const measured = new Promise(resolve => {capture.port.onmessage = event => resolve(event.data)})
			capture.port.postMessage('capture')
			await Promise.all([48,60,72].map(note => voice.noteOn(note,80/127)))
			const {rms,peak} = await measured
			results.push({program,db:Number((20*Math.log10(Math.max(rms,1e-7))).toFixed(2)),peak:Number(peak.toFixed(3))})
			await voice.allSoundOff()
			await new Promise(resolve => setTimeout(resolve,100))
		}
		return results
	} finally {await voice.destroy();await factory.voiceEngineHost.destroy();capture.disconnect();await context.close()}
}

// Reuse HarmonEasy's audio-smoke-entry.ts reference phrase and capture window:
// A3, MIDI velocity 80, warm the renderer, then capture 600 ms of real output.
export async function measureEngines(raw=false) {
	const context = new AudioContext({sampleRate:48000})
	await context.resume()
	const url = URL.createObjectURL(new Blob([`
		registerProcessor('engine-level-capture',class extends AudioWorkletProcessor {
			constructor(){super();this.port.onmessage=()=>{this.remaining=Math.round(sampleRate*0.6);this.squares=this.count=this.peak=0}}
			process(inputs){for(const value of inputs[0]?.[0]??[]){if(this.remaining>0){this.squares+=value*value;this.peak=Math.max(this.peak,Math.abs(value));this.count++;if(--this.remaining===0)this.port.postMessage({rms:Math.sqrt(this.squares/this.count),peak:this.peak})}}return true}
		})`],{type:'application/javascript'}))
	await context.audioWorklet.addModule(url)
	URL.revokeObjectURL(url)
	const destination = context.createGain(), capture = new AudioWorkletNode(context,'engine-level-capture'), mute = context.createGain()
	mute.gain.value=0
	destination.connect(capture).connect(mute).connect(context.destination)
	const results=[]
	try {
		for(const engine of ['native','fm','yoshimi','wam2','supersonic']) {
			console.log('Measuring',engine)
			const settings=normaliseEngineSettings(engine,{reverbMode:'off',...(raw?{outputGainDb:-VOICE_ENGINE_TRIM_DB[engine]}:{})})
			const factory=new InstrumentFactory(context,{voiceEngine:engine,destination,voiceEngineSettings:{[engine]:settings}})
			let voice
			try {
				voice=await factory.createVoiceInstrument({defaultPreset:0,instrumentPack:'OpenGM24',preload:false,useWorkers:false})
				voice.output.connect(destination)
				await voice.noteOn(57,80/127)
				await new Promise(resolve=>setTimeout(resolve,600))
				await voice.allSoundOff()
				await new Promise(resolve=>setTimeout(resolve,1200))
				const measured=new Promise(resolve=>{capture.port.onmessage=event=>resolve(event.data)})
				capture.port.postMessage('capture')
				await voice.noteOn(57,80/127)
				results.push({engine,...await measured})
				console.log('Result',JSON.stringify(results.at(-1)))
				await voice.allSoundOff()
				await new Promise(resolve=>setTimeout(resolve,1100))
			} finally {await voice?.destroy();await factory.voiceEngineHost.destroy()}
		}
		return results
	} finally {capture.disconnect();await context.close()}
}
