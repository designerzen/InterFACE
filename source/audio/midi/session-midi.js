import { SESSION_EVENT_TYPES, normaliseVelocity } from '../../storage/session-format.js'
const types = Object.fromEntries(Object.entries(SESSION_EVENT_TYPES).map(([k,v]) => [v,k]))
const integer = (v, min, max, label) => {
	if (!Number.isInteger(v) || v < min || v > max) throw new RangeError(`Invalid ${label}: ${v}`)
	return v
}
const u16 = n => [n >>> 8 & 255, n & 255]
const u32 = n => [n >>> 24, n >>> 16 & 255, n >>> 8 & 255, n & 255]
export const vlq = value => {
	integer(value, 0, 0x0fffffff, 'MIDI delta')
	const bytes = [value % 128]
	while ((value = Math.floor(value / 128)) > 0) bytes.unshift((value % 128) | 128)
	return bytes
}
const chunk = data => new Uint8Array([77,84,114,107, ...u32(data.length), ...data])
const timing = ({ bpm=120, ppq=480, tempoMap=[] } = {}) => {
	integer(ppq, 1, 32767, 'PPQ')
	const map = [{time:0,bpm}, ...tempoMap].sort((a,b) => a.time-b.time)
	for (const e of map) if (!Number.isFinite(e.time) || e.time < 0 || !Number.isFinite(e.bpm) || e.bpm <= 0 || 60000000/e.bpm > 0xffffff) throw new RangeError('Invalid tempo')
	const ticks = time => {
		if (!Number.isFinite(time) || time < 0) throw new RangeError('Invalid event time')
		let t=0, beat=0, current=map[0].bpm
		for (const e of map) {
			if (e.time > time) break
			beat += (e.time-t)*current/60000
			t=e.time; current=e.bpm
		}
		return Math.round((beat+(time-t)*current/60000)*ppq)
	}
	return {map,ticks}
}
export const midiHeader = (tracks, ppq=480) => new Uint8Array([77,84,104,100,0,0,0,6,0,1,...u16(integer(tracks,1,65535,'track count')),...u16(integer(ppq,1,32767,'PPQ'))])
export const tempoTrack = (options={}) => {
	const {map,ticks} = timing(options)
	const bytes=[]
	let previous=0
	for (const e of map) {
		const tick=ticks(e.time), tempo=Math.round(60000000/e.bpm)
		bytes.push(...vlq(tick-previous),255,81,3,...u32(tempo).slice(1)); previous=tick
	}
	bytes.push(0,255,47,0)
	return chunk(bytes)
}
export const encodeMIDITrack = (events, options={}) => {
	const {ticks} = timing(options)
	const name = Array.from(options.name ?? 'PhotoSYNTH', c => c.charCodeAt(0) < 128 ? c.charCodeAt(0) : 63)
	const bytes=[0,255,3,...vlq(name.length),...name]
	const ordered=events.map((e,i) => ({...e, type:types[e.type] ?? e.type, tick:ticks(e.time ?? 0), sequence:e.sequence ?? i}))
		.sort((a,b) => a.tick-b.tick || a.sequence-b.sequence)
	let previous=0
	const active=new Set()
	const emit = (tick, data) => { bytes.push(...vlq(tick-previous),...data); previous=tick }
	for (const e of ordered) {
		const channel=integer(e.channel ?? 0,0,15,'channel')
		if (e.type === 'noteOn' || e.type === 'noteOff') {
			const note=integer(e.note ?? e.noteNumber,0,127,'note')
			const velocity=normaliseVelocity(e.velocity,e.velocityUnit)
			const key=channel+':'+note
			const on=e.type==='noteOn' && velocity>0
			if (on && active.has(key)) emit(e.tick,[128|channel,note,0])
			emit(e.tick,[(on?144:128)|channel,note,velocity])
			if (on) active.add(key); else active.delete(key)
		} else if (e.type==='programChange') emit(e.tick,[192|channel,integer(e.program ?? e.value1 ?? 0,0,127,'program')])
		else if (e.type==='control') emit(e.tick,[176|channel,integer(e.controller ?? e.note ?? 0,0,127,'controller'),integer(e.value1 ?? e.value ?? 0,0,127,'control value')])
		else if (e.type==='pitchBend') {
			const bend=integer(e.value1 ?? e.value ?? 0,-8192,8191,'pitch bend')+8192
			emit(e.tick,[224|channel,bend&127,bend>>>7])
		}
	}
	const end=Math.max(previous,ticks(options.endTime ?? events.reduce((t,e)=>Math.max(t,e.time ?? 0),0)))
	for (const key of active) {
		const [channel,note]=key.split(':').map(Number)
		emit(end,[128|channel,note,0])
	}
	emit(end,[255,47,0])
	return chunk(bytes)
}
export const createMIDIFileFromEvents = (events, options={}) => {
	const groups=new Map()
	for (const e of events) {
		const track=e.track ?? e.trackId ?? 0
		if (!groups.has(track)) groups.set(track,[])
		groups.get(track).push(e)
	}
	if (!groups.size) groups.set(0,[])
	const parts=[midiHeader(groups.size+1,options.ppq),tempoTrack(options)]
	for (const [track,notes] of groups) parts.push(encodeMIDITrack(notes,{...options,name:options.trackNames?.[track] ?? `PhotoSYNTH ${track}`}))
	const result=new Uint8Array(parts.reduce((n,p)=>n+p.length,0))
	let at=0
	for (const p of parts) { result.set(p,at); at+=p.length }
	return result
}
