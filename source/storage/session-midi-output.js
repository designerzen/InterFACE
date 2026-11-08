import { recordSessionEvent } from './session-events.js'

const numberFor=note=>{
	if(typeof note==='number')return note
	if(typeof note==='object')return note?.number
	const match=/^([A-Ga-g])([#b]?)(-?\d+)$/.exec(note)
	if(!match)return NaN
	return (Number(match[3])+1)*12+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1].toUpperCase()]+(match[2]==='#'?1:match[2]==='b'?-1:0)
}
export const recordMIDIOutput = (output,method,note,options={}) => {
	if(!['playNote','stopNote','sendProgramChange','sendPitchBend'].includes(method))return
	const raw=options.channels ?? options.channel ?? output.number ?? 'all'
	const channels=raw==='all'?Array.from({length:16},(_,i)=>i+1):Array.isArray(raw)?raw:[raw]
	const now=performance.now()
	const time=typeof options.time==='string'&&options.time.startsWith('+')?now+Number(options.time.slice(1)):Number.isFinite(options.time)?options.time:now
	for(const midiChannel of channels) {
		const channel=midiChannel-1
		if(!Number.isInteger(channel)||channel<0||channel>15)continue
		const base={source:`midi-output:${output.id ?? output.name}:${channel}`,name:output.name ?? 'MIDI output',channel,performanceTime:time}
		if(method==='playNote'||method==='stopNote')for(const value of Array.isArray(note)?note:[note]) {
			const number=numberFor(value)
			if(!Number.isInteger(number)||number<0||number>127)continue
			const on=method==='playNote',rawVelocity=on?options.rawAttack:options.rawRelease
			const event={...base,type:on?'noteOn':'noteOff',note:number,velocity:rawVelocity ?? (on?(options.attack ?? 0.5):(options.release ?? 0)),velocityUnit:rawVelocity==null?'normalized':'midi'}
			recordSessionEvent(event)
			if(on&&Number.isFinite(options.duration)&&options.duration>=0)recordSessionEvent({...event,type:'noteOff',velocity:0,performanceTime:time+options.duration})
		}
		else if(method==='sendProgramChange')recordSessionEvent({...base,type:'programChange',value1:note-1})
		else if(method==='sendPitchBend')recordSessionEvent({...base,type:'pitchBend',value1:Math.round(Math.max(-1,Math.min(1,note))*(note<0?8192:8191))})
	}
}
