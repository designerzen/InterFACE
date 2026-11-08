import { recordSessionEvent } from './session-events.js'
import { GENERAL_MIDI_PERCUSSION_NOTES } from '../audio/midi/general-midi-percussion-output.js'

export const recordPercussion = (part, options, context, source='percussion') => {
	const resolved=part==='hat' ? (options.open ? 'hatOpen':'hatClosed') : part
	const note=GENERAL_MIDI_PERCUSSION_NOTES[resolved]
	const velocity=options.velocity ?? 1
	if (!Number.isInteger(note) || velocity<=0) return
	const performanceTime=performance.now()+Math.max(0,(options.triggerAt ?? context.currentTime)-context.currentTime)*1000
	const event={note,velocity,channel:9,source,name:'Percussion',performanceTime,transient:true}
	recordSessionEvent({...event,type:'noteOn'})
	// GM percussion is one-shot; a short MIDI gate does not truncate its decay.
	recordSessionEvent({...event,type:'noteOff',velocity:0,performanceTime:performanceTime+60})
}
