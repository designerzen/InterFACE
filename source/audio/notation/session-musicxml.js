const DIVISIONS=960, BAR=DIVISIONS*4
const xml=value=>String(value).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))
const pitch=key=>{
	const steps=['C','C','D','D','E','F','F','G','G','A','A','B'],index=key%12
	return `<pitch><step>${steps[index]}</step>${[1,3,6,8,10].includes(index)?'<alter>1</alter>':''}<octave>${Math.floor(key/12)-1}</octave></pitch>`
}
const rest=(duration,voice)=>duration?`<note><rest/><duration>${duration}</duration><voice>${voice}</voice></note>`:''

// Performance timestamps are converted to quarter-note divisions using the recorded
// tempo map. Sessions do not record meter, so notation uses 4/4 measures.
export const createSessionMusicXML=async(manifest,eventsFor,options={})=>{
	const tempos=[...new Map([{time:0,bpm:120},...(options.tempoMap ?? manifest.tempoMap ?? [])].map(t=>[t.time,t])).values()].sort((a,b)=>a.time-b.time)
	for(const t of tempos)if(!Number.isFinite(t.time)||t.time<0||!Number.isFinite(t.bpm)||t.bpm<=0)throw new Error('Invalid recorded tempo')
	const tick=time=>{
		let beats=0,previous=0,bpm=tempos[0].bpm
		for(const t of tempos){if(t.time>time)break;beats+=(t.time-previous)*bpm/60000;previous=t.time;bpm=t.bpm}
		return Math.round((beats+(time-previous)*bpm/60000)*DIVISIONS)
	}
	const tracks=new Map(),parts=[],definitions=[]
	let endTime=options.endTime ?? manifest.durationMs ?? 0
	for await(const e of eventsFor(manifest)){
		if(!Number.isFinite(e.time)||e.time<0)throw new Error('Invalid saved note timestamp')
		endTime=Math.max(endTime,e.time)
		if(e.type==='noteOn'&&e.velocity>0)tracks.set(`${e.track}:${e.channel}`,{track:e.track,channel:e.channel})
	}
	if(!tracks.size)throw new Error('This recording contains no saved notes')
	if(!Number.isFinite(endTime)||endTime<0)throw new Error('Invalid recording duration')
	const measures=Math.max(1,Math.ceil(tick(endTime)/BAR))
	if(measures>100000)throw new Error('Recording is too long for MusicXML export')
	const tempoTicks=tempos.map(t=>({...t,tick:tick(t.time)}))
	for(const {track,channel} of tracks.values()){
		const events=[],held=new Map(),notes=[],voices=[]
		for await(const e of eventsFor(manifest))if(e.track===track&&e.channel===channel)events.push(e)
		events.sort((a,b)=>a.time-b.time||a.sequence-b.sequence)
		const finish=(e,time)=>{
			if(time<=e.time)return
			if(!Number.isInteger(e.note)||e.note<0||e.note>127)throw new Error('Invalid saved note pitch')
			const start=tick(e.time),end=Math.max(start+1,tick(time))
			notes.push({start,end,key:e.note,velocity:e.velocity})
		}
		for(const e of events){
			if(!['noteOn','noteOff'].includes(e.type))continue
			if(held.has(e.note)){finish(held.get(e.note),e.time);held.delete(e.note)}
			if(e.type==='noteOn'&&e.velocity>0)held.set(e.note,e)
		}
		for(const e of held.values())finish(e,endTime)
		notes.sort((a,b)=>a.start-b.start||a.key-b.key)
		for(const note of notes){
			let voice=voices.find(v=>v.at(-1).end<=note.start)
			if(!voice){voice=[];voices.push(voice)}
			voice.push(note)
		}
		if(!voices.length)voices.push([])
		const id=`P${parts.length+1}`,name=xml(manifest.tracks?.[track]?.name ?? `Track ${track}`)
		const program=manifest.tracks?.[track]?.program
		definitions.push(`<score-part id="${id}"><part-name>${name}</part-name><score-instrument id="${id}I"><instrument-name>${name}</instrument-name></score-instrument><midi-instrument id="${id}I"><midi-channel>${channel+1}</midi-channel>${Number.isInteger(program)&&program>=0&&program<128?`<midi-program>${program+1}</midi-program>`:''}</midi-instrument></score-part>`)
		const bars=[],indices=voices.map(()=>0)
		for(let bar=0;bar<measures;bar++){
			const start=bar*BAR,end=start+BAR,content=[]
			if(!bar)content.push(`<attributes><divisions>${DIVISIONS}</divisions><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>`)
			for(const t of tempoTicks)if(t.tick>=start&&t.tick<end)content.push(`<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${t.bpm}</per-minute></metronome></direction-type><offset sound="yes">${t.tick-start}</offset><sound tempo="${t.bpm}"/></direction>`)
			voices.forEach((voice,v)=>{
				if(v)content.push(`<backup><duration>${BAR}</duration></backup>`)
				let cursor=start
				while(indices[v]<voice.length){
					const note=voice[indices[v]]
					if(note.start>=end)break
					const from=Math.max(start,note.start),to=Math.min(end,note.end)
					content.push(rest(from-cursor,v+1))
					const ties=[...(note.start<start?['stop']:[]),...(note.end>end?['start']:[])]
					content.push(`<note dynamics="${note.velocity/127*100}">${pitch(note.key)}<duration>${to-from}</duration>${ties.map(t=>`<tie type="${t}"/>`).join('')}<voice>${v+1}</voice>${ties.length?`<notations>${ties.map(t=>`<tied type="${t}"/>`).join('')}</notations>`:''}</note>`)
					cursor=to
					if(note.end>end)break
					indices[v]++
				}
				content.push(rest(end-cursor,v+1))
			})
			bars.push(`<measure number="${bar+1}">${content.join('')}</measure>`)
		}
		parts.push(`<part id="${id}">${bars.join('')}</part>`)
	}
	return new Blob([`<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><work><work-title>${xml(options.title ?? 'PhotoSYNTH recording')}</work-title></work><identification><encoding><software>PhotoSYNTH</software></encoding></identification><part-list>${definitions.join('')}</part-list>${parts.join('')}</score-partwise>`],{type:'application/vnd.recordare.musicxml+xml'})
}
