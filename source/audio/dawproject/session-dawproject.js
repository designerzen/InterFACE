import {zipSync,strToU8} from 'fflate'
import {VERSION} from '../../version.js'

const xml=value=>String(value).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))

// Called in the storage worker; only one source track is read into memory at a time.
export const createSessionDAWProject=async(manifest,eventsFor,options={})=>{
	const tracks=new Set(),structure=[],lanes=[]
	let endTime=options.endTime ?? manifest.durationMs ?? 0
	for await(const event of eventsFor(manifest)){
		if(!Number.isFinite(event.time)||event.time<0)throw new Error('Invalid saved note timestamp')
		endTime=Math.max(endTime,event.time)
		if(event.type==='noteOn'&&event.velocity>0)tracks.add(event.track)
	}
	if(!Number.isFinite(endTime)||endTime<0)throw new Error('Invalid recording duration')
	for(const track of tracks){
		const events=[],held=new Map(),notes=[]
		for await(const event of eventsFor(manifest))if(event.track===track)events.push(event)
		events.sort((a,b)=>a.time-b.time||a.sequence-b.sequence)
		const finish=(event,time,release=0)=>{
			if(time<=event.time)return
			notes.push(`<Note time="${event.time/1000}" duration="${(time-event.time)/1000}" channel="${event.channel}" key="${event.note}" vel="${event.velocity/127}" rel="${release/127}"/>`)
		}
		for(const event of events){
			if(!['noteOn','noteOff'].includes(event.type))continue
			const key=`${event.channel}:${event.note}`,previous=held.get(key)
			if(previous){finish(previous,event.time,event.type==='noteOff'?event.velocity:0);held.delete(key)}
			if(event.type==='noteOn'&&event.velocity>0)held.set(key,event)
		}
		for(const event of held.values())finish(event,endTime)
		const name=xml(manifest.tracks?.[track]?.name ?? `Track ${track}`)
		structure.push(`<Track id="track${track}" name="${name}" contentType="notes" loaded="true"><Channel id="channel${track}" role="regular" audioChannels="2" destination="master"/></Track>`)
		lanes.push(`<Lanes track="track${track}"><Clips><Clip time="0" duration="${endTime/1000}" contentTimeUnit="seconds" playStart="0"><Notes timeUnit="seconds">${notes.join('')}</Notes></Clip></Clips></Lanes>`)
	}
	const tempoMap=[...new Map([{time:0,bpm:120},...(options.tempoMap ?? manifest.tempoMap ?? [])].map(t=>[t.time,t])).values()].sort((a,b)=>a.time-b.time)
	for(const tempo of tempoMap)if(!Number.isFinite(tempo.time)||tempo.time<0||!Number.isFinite(tempo.bpm)||tempo.bpm<=0)throw new Error('Invalid recorded tempo')
	const initialTempo=tempoMap.filter(t=>t.time===0).at(-1).bpm
	const automation=tempoMap.map(t=>`<RealPoint time="${t.time/1000}" value="${t.bpm}" interpolation="hold"/>`).join('')
	const project=`<?xml version="1.0" encoding="UTF-8"?><Project version="1.0"><Application name="PhotoSYNTH" version="${xml(VERSION)}"/><Transport><Tempo id="tempo" unit="bpm" value="${initialTempo}"/></Transport><Structure>${structure.join('')}<Track name="Master" contentType="audio"><Channel id="master" role="master" audioChannels="2"/></Track></Structure><Arrangement><Lanes timeUnit="seconds">${lanes.join('')}</Lanes><TempoAutomation timeUnit="seconds" unit="bpm"><Target parameter="tempo"/>${automation}</TempoAutomation></Arrangement></Project>`
	const metadata=`<?xml version="1.0" encoding="UTF-8"?><MetaData><Title>${xml(options.title ?? 'PhotoSYNTH recording')}</Title></MetaData>`
	return new Blob([zipSync({'project.xml':strToU8(project),'metadata.xml':strToU8(metadata)})],{type:'application/zip'})
}
