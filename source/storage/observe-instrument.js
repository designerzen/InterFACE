import { recordSessionEvent } from './session-events.js'
const observed = new WeakSet()
const releases = new WeakMap()
export const recordInstrumentRelease=(instrument,note)=>releases.get(instrument)?.(note,performance.now())
export const observeInstrument = instrument => {
	if (instrument.options?.managedByVoiceEngine) return instrument
	if (observed.has(instrument) || ['chord','composite','midi','percussion','drumkit','recorder'].includes(instrument.type)) return instrument
	observed.add(instrument)
	const held = new Map()
	const versions = new Map()
	let generation=0
	const event = (type,note,velocity,performanceTime) => recordSessionEvent({type,note,velocity,performanceTime,source:instrument.id,name:instrument.title,person:instrument.options?.playerNumber})
	const release=(note,time)=>{
		if (!held.has(note)) return
		held.delete(note)
		event('noteOff',note,0,time)
	}
	releases.set(instrument,release)
	for (const method of ['noteOn','noteOff','retrigger','allNotesOff','allSoundOff','destroy','programChange']) {
		const original=instrument[method]
		if (typeof original!=='function') continue
		instrument[method]=function(...args) {
			if(['allNotesOff','allSoundOff','destroy'].includes(method))generation++
			const epoch=generation
			const time=performance.now(), note=args[0], velocity=args[1] ?? 1
			const version=(versions.get(note) ?? 0)+1
			if (method==='noteOn' || method==='noteOff') versions.set(note,version)
			const result=original.apply(this,args)
			const complete=value=>{
				if (value===false) return value
				if ((method==='noteOn' || method==='retrigger') && Number.isInteger(note) && note>=0 && note<128) {
					if(epoch!==generation)return value
					if (method==='noteOn' && versions.get(note)!==version) return value
					if (velocity<=0) { release(note,time); return value }
					if (instrument.isMonophonic) for(const n of [...held.keys()]) if(n!==note)release(n,time)
					if(method==='retrigger' && versions.get(note)!==version-1)return value
					if (method==='retrigger') release(note,time)
					if (!held.has(note)) {
						const program=instrument.name==='SoundFontInstrument' || instrument.type==='engine' ? instrument.activePresetIndex : undefined
						if (Number.isInteger(program) && program>=0 && program<128) recordSessionEvent({type:'programChange',value1:program,source:instrument.id,performanceTime:time})
						held.set(note,velocity); event('noteOn',note,velocity,time)
					}
				} else if (method==='noteOff') release(note,time)
				else if (['allNotesOff','allSoundOff','destroy'].includes(method)) for(const n of [...held.keys()]) release(n,time)
				else if (method==='programChange' && Number.isInteger(note) && note>=0 && note<128) recordSessionEvent({type:'programChange',value1:note,source:instrument.id,performanceTime:time})
				return value
			}
			return result?.then ? result.then(complete) : complete(result)
		}
	}
	return instrument
}
