// A lightweight note preview. It never calls live instruments or sends MIDI,
// so replayed notes cannot feed back into the automatic MIDI recorder.
export const createSessionNotePlayer=({getContext,onChange=()=>{},onError=()=>{}})=>{
	let reader,id=null,context,bus,timer,generation=0,playing=false,loading=false,prepared=null
	let position=0,duration=0,origin=0,audioOrigin=0,events=[],index=0,loadedUntil=0,prefetch=false
	const voices=new Set(),held=new Map()
	const key=e=>`${e.track}:${e.channel}:${e.note}`
	const current=()=>playing?Math.min(duration,origin+(context.currentTime-audioOrigin)*1000):position
	const state=()=>({id,playing,loading,positionMs:current(),durationMs:duration})
	const notify=()=>onChange(state())
	const silence=()=>{
		for(const voice of voices){try{voice.osc.stop()}catch{};voice.osc.disconnect();voice.gain.disconnect()}
		voices.clear();held.clear();bus?.disconnect();bus=null
	}
	const pause=()=>{
		position=current();generation++;playing=false;loading=false;prefetch=false;clearInterval(timer);silence();notify()
	}
	const release=(voice,at)=>{
		if(!voice)return
		voice.gain.gain.setTargetAtTime(0,at,0.005)
		voice.osc.stop(at+0.03)
	}
	const perform=(event,at)=>{
		const noteKey=key(event),old=held.get(noteKey)
		if(event.type==='noteOff'||event.velocity===0){release(old,at);held.delete(noteKey);return}
		if(!Number.isInteger(event.note)||event.note>127||event.note<0)return
		release(old,at)
		// Bound preview polyphony, including release tails.
		if(voices.size>=96){const voice=voices.values().next().value;voice.osc.stop();voice.osc.disconnect();voice.gain.disconnect();voices.delete(voice)}
		const osc=context.createOscillator(),gain=context.createGain(),voice={osc,gain}
		osc.type=event.channel===9?'sine':'triangle'
		osc.frequency.setValueAtTime(440*2**((event.note-69)/12),at)
		gain.gain.setValueAtTime(Math.min(127,event.velocity)/127*0.12,at)
		osc.connect(gain);gain.connect(bus);voices.add(voice);held.set(noteKey,voice)
		osc.onended=()=>{voices.delete(voice);if(held.get(noteKey)===voice)held.delete(noteKey);osc.disconnect();gain.disconnect()}
		osc.start(at)
		if(event.channel===9)release(voice,at+0.12)
	}
	const fail=error=>{pause();onError(error)}
	const play=async()=>{
		if(!reader)throw new Error('Choose a saved note recording')
		if(playing||loading)return
		if(position>=duration)position=0
		const token=++generation;loading=true;notify()
		try{
			context=getContext();if(!context)throw new Error('Audio is not ready')
			await context.resume()
			const window=position===0&&prepared?prepared:await reader(position,position+30000)
			prepared=null
			if(token!==generation)return
			if(!window.noteCount)throw new Error('This recording contains no saved notes')
			duration=window.durationMs;events=window.events;index=0;loadedUntil=position+30000
			bus=context.createGain();bus.gain.value=0.7;bus.connect(context.destination)
			origin=position;audioOrigin=context.currentTime
			for(const event of window.held)perform(event,audioOrigin)
			loading=false;playing=true;notify()
			const tick=()=>{
				if(token!==generation)return
				const now=current()
				if(now>=duration){pause();position=duration;notify();return}
				if(now>=loadedUntil){pause();position=loadedUntil;play().catch(fail);return}
				while(index<events.length&&events[index].time<=now+100){const event=events[index++];perform(event,Math.max(context.currentTime,audioOrigin+(event.time-origin)/1000))}
				if(!prefetch&&loadedUntil<duration&&now>=loadedUntil-5000){
					prefetch=true;const from=loadedUntil
					reader(from,from+30000).then(next=>{
						if(token!==generation)return
						events=events.slice(index).concat(next.events);index=0;loadedUntil=from+30000;prefetch=false
					}).catch(error=>{if(token===generation)fail(error)})
				}
			}
			timer=setInterval(()=>{try{tick()}catch(error){fail(error)}},50);tick()
		}catch(error){if(token===generation){pause();throw error}}
	}
	return {
		state,pause,play,
		load:async(nextReader,nextId)=>{
			pause();prepared=null;reader=nextReader;id=nextId;position=0;duration=0;loading=true;const token=generation;notify()
			try{const window=await reader(0,30000);if(token!==generation)return;if(!window.noteCount)throw new Error('This recording contains no saved notes');prepared=window;duration=window.durationMs;loading=false;notify()}
			catch(error){if(token===generation){loading=false;reader=null;id=null;notify();throw error}}
		},
		seek:async value=>{const resume=playing||loading;pause();position=Math.max(0,Math.min(duration,Number(value)||0));notify();if(resume&&position<duration)await play()},
		destroy:()=>{pause();reader=null;id=null;prepared=null}
	}
}
