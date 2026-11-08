import { BACKING_SOURCE } from './backing-melody-sequence.js'

// Schedule synthesis on the audio clock. Timers only publish recording/visual
// events; they never determine when a note is heard.
export const createBackingMelodyPlayer = (context, destination, record) => {
	const bus = context.createGain(), voices = new Set(), timers = new Set(), held = new Set()
	bus.connect(destination)
	const emit = (type,note,time) => {
		const event = {type,note,velocity:type==='noteOn'?0.45:0,source:BACKING_SOURCE,name:'AI backing melody',performanceTime:performance.now()+(time-context.currentTime)*1000}
		const publish = () => {
			if (type==='noteOn') held.add(note); else held.delete(note)
			record(event)
		}
		const timer = setTimeout(() => { timers.delete(timer); publish() }, Math.max(0,(time-context.currentTime)*1000))
		timers.add(timer)
	}
	const stop = () => {
		for (const timer of timers) clearTimeout(timer)
		timers.clear()
		for (const voice of voices) { voice.osc.onended=null; try { voice.osc.stop() } catch {} voice.osc.disconnect(); voice.gain.disconnect() }
		voices.clear()
		for (const note of held) record({type:'noteOff',note,velocity:0,source:BACKING_SOURCE,performanceTime:performance.now()})
		held.clear()
	}
	return {
		setVolume:value => { bus.gain.value = Math.max(0,Math.min(1,Number(value)||0)) },
		play:(notes,at,bpm) => {
			const step = 60/bpm/4
			for (const note of notes) {
				const start = at+note.start*step, end = at+note.end*step
				if (start<context.currentTime-0.03) continue
				const onset = Math.max(context.currentTime,start)
				const osc=context.createOscillator(), gain=context.createGain(), voice={osc,gain}
				osc.type='triangle'; osc.frequency.value=440*2**((note.pitch-69)/12)
				gain.gain.setValueAtTime(0,onset)
				gain.gain.linearRampToValueAtTime(0.22,Math.min(end,onset+0.015))
				gain.gain.setTargetAtTime(0,end,0.025)
				osc.connect(gain); gain.connect(bus); voices.add(voice)
				osc.onended=()=>{voices.delete(voice);osc.disconnect();gain.disconnect()}
				osc.start(onset); osc.stop(end+0.15)
				emit('noteOn',note.pitch,onset); emit('noteOff',note.pitch,end)
			}
		},
		stop,
		destroy:() => { stop(); bus.disconnect() }
	}
}
