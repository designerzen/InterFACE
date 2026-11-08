import {recoverSessionManifests,readSessionMedia,readSessionOrphan} from '../storage/session-recorder.js'
import {downloadBlob} from './download.js'

export const formatRecordingTime=value=>{
	const milliseconds=Number(value)
	const seconds=Math.floor(Math.max(0,Number.isFinite(milliseconds)?milliseconds:0)/1000)
	const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds/60)%60
	return (hours?String(hours).padStart(2,'0')+':':'')+String(minutes).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')
}
const hasNotes=session=>(session.eventBytes ?? session.committedEventBytes ?? 16)>16&&!session.eventError
const hasData=session=>hasNotes(session)||['audio','video'].some(kind=>session.media?.[kind]?.length)||session.orphans?.length
const extensionFor=blob=>blob.type.includes('mp4')?'mp4':blob.type.includes('ogg')?'ogg':'webm'
const formatBytes=value=>value>=1048576?(value/1048576).toFixed(1)+' MB':Math.ceil((value||0)/1024)+' KB'

export const setupSessionRecordingUI=(controller,reportError,doc=document,statusAPI)=>{
	const get=id=>doc.getElementById(id),button=get('button-record-session'),save=get('button-save-midi')
	const auto=get('session-auto-midi'),audio=get('session-record-audio'),video=get('session-record-video')
	const library=get('session-library'),replayLibrary=get('session-replay-library'),type=get('session-export-type'),take=get('session-export-take')
	const replay=get('session-replay'),rewind=get('session-rewind'),forward=get('session-forward'),position=get('session-replay-position')
	const recordConfirm=get('session-record-confirm'),exportConfirm=get('session-export-confirm'),replayConfirm=get('session-replay-confirm')
	let sessions=[],working=false,exporting=false,exportLoading=false,replayBusy=false,errorMessage='',refreshGeneration=0,replayGeneration=0,destroyed=false
	let hudStateKey=''
	let pendingDelete=[]
	const activeSession=id=>{const state=controller.state();return state.id===id&&(state.recording||state.midi)}
	const write=(node,value)=>{
		const description=node.querySelector(':scope > .gadget-description')
		const caption=description?[...node.childNodes].filter(child=>child!==description).map(child=>child.textContent).join(''):node.textContent
		if(caption!==value){
			if(description)node.replaceChildren(doc.createTextNode(value),description)
			else node.textContent=value
		}
	}
	const selected=()=>sessions.find(s=>s.sessionId===library.value)
	const show=id=>{const dialog=get(id);if(!dialog.open)dialog.showModal()}
	const close=id=>{const dialog=get(id);if(dialog.open)dialog.close()}
	const isVisible=node=>!node.closest('[hidden]')&&(node.checkVisibility?.({visibilityProperty:true})??true)
	const update=(state=controller.state())=>{
		if(destroyed)return
		const hudDetail=state.recording?`Recording · ${formatRecordingTime(state.durationMs)}`:
			state.midi?`MIDI recording · ${formatRecordingTime(state.durationMs)}`:''
		if(hudStateKey!==hudDetail){
			hudStateKey=hudDetail
			if(!hudDetail)statusAPI?.clearDeviceStatus('session-recording')
			else statusAPI?.setDeviceStatus('session-recording',{
				type:'recording',label:'Session recording',detail:hudDetail,connected:true,
				tooltipDetails:[{label:'Capturing',value:state.recording?'Media and MIDI notes':'MIDI notes'}],
			})
		}
		const playback=state.replay ?? {},hasSaved=sessions.some(hasData)
		const active=activeSession(library.value)
		// Controls that cannot act are hidden; disabled only covers brief busy moments.
		const deletingBlocked=working||exporting||exportLoading||replayBusy||!!playback.loading||!!state.busy
		const inactive=sessions.filter(s=>!activeSession(s.sessionId)).length
		get('session-library-picker').hidden=!sessions.length
		get('session-export-section').hidden=!sessions.length||!type.options.length
		get('session-delete-section').hidden=!sessions.length
		get('session-delete').hidden=!library.value||active
		get('session-delete').disabled=deletingBlocked
		get('session-delete-all').hidden=inactive<(active?1:2)
		get('session-delete-all').disabled=deletingBlocked
		get('session-delete-confirm').disabled=deletingBlocked||!pendingDelete.length||pendingDelete.some(activeSession)
		get('session-active-warning').hidden=!active
		get('session-stop-all').hidden=!state.recording&&!state.midi
		get('session-stop-all').disabled=working||!!state.busy
		get('session-refresh').hidden=!errorMessage
		get('session-error-manage').disabled=working
		get('session-error-retry').hidden=!!state.recording
		get('session-error-retry').disabled=working||!!state.busy
		write(get('session-capture-status'),state.recording?'Recording':'Record')
		button.title=state.recording?'Stop recording':''
		button.setAttribute('aria-pressed',String(state.recording))
		button.setAttribute('aria-haspopup',state.recording?'false':'dialog')
		button.disabled=!!state.busy||working||(replayBusy&&!state.recording)
		const beat=String(60000/Math.max(1,state.bpm||120))+'ms'
		if(button.style.getPropertyValue('--record-beat-duration')!==beat)button.style.setProperty('--record-beat-duration',beat)
		auto.disabled=!!state.busy||working
		audio.disabled=video.disabled=!!state.busy||!!state.recording||working
		recordConfirm.disabled=working||!!state.busy||(!audio.checked&&!video.checked)
		save.hidden=!hasSaved&&!state.hasNotes&&!state.hasMedia
		save.disabled=working||replayBusy
		exportConfirm.disabled=working||exportLoading||exporting||!library.value||!type.value||(!['midi','dawproject','musicxml'].includes(type.value)&&!take.value)
		write(exportConfirm,exporting?'Exporting…':'Export')
		replay.hidden=!sessions.some(hasNotes)&&!state.hasNotes&&!playback.id
		replay.disabled=working||replayBusy||!!playback.loading
		write(replay,playback.playing?'Pause replay':playback.id&&playback.positionMs<playback.durationMs?'Resume replay':'Replay saved notes')
		replay.setAttribute('aria-pressed',String(!!playback.playing))
		replay.setAttribute('aria-haspopup',playback.id&&playback.positionMs<playback.durationMs?'false':'dialog')
		replayConfirm.disabled=replayBusy||!replayLibrary.value
		rewind.hidden=forward.hidden=!playback.id
		rewind.disabled=forward.disabled=working||!!playback.loading||replayBusy
		get('session-replay-choose').disabled=working||replayBusy
		get('session-replay-progress').hidden=!playback.id||!isVisible(button)
		if(isVisible(position)){
			position.max=String(playback.durationMs||0)
			if(doc.activeElement!==position)position.value=String(playback.positionMs||0)
			write(get('session-replay-time'),formatRecordingTime(playback.positionMs)+' / '+formatRecordingTime(playback.durationMs))
		}
		const time=get('session-recording-duration')
		time.hidden=!state.recording
		if(isVisible(time)){
			const seconds=Math.floor(Math.max(0,state.durationMs||0)/1000)
			write(time,formatRecordingTime(state.durationMs));time.setAttribute('datetime','PT'+seconds+'S')
		}
		const status=get('session-recording-status')
		write(status,errorMessage||(playback.playing?'Replaying saved notes':state.recording?'Recording media · MIDI active':state.midi?'MIDI session active':'Recording paused'))
		get('session-recording-error').hidden=!errorMessage
		for(const node of doc.querySelectorAll('[data-session-error]'))write(node,errorMessage)
	}
	const fail=error=>{
		const message=error?.message||String(error)
		errorMessage=/queue is full|cannot keep up/i.test(message)?'Recording stopped because storage writes could not keep up. Saved data is still available. Wait a moment, then record again. Manage recordings to export or delete saved takes.':
			/quota|disk full|storage.*full/i.test(message)?'Recording storage is full. Export recordings you want to keep, then delete recordings to free space and record again.':message
		reportError(error);update()
	}
	const run=operation=>async()=>{
		if(working)return
		working=true;errorMessage='';update()
		try{await operation()}catch(error){fail(error)}finally{working=false;update()}
	}
	const populate=(select,values,preferred)=>{
		select.replaceChildren()
		for(const [value,label] of values){const option=doc.createElement('option');option.value=String(value);option.textContent=label;select.append(option)}
		if(values.some(([value])=>String(value)===preferred))select.value=preferred
	}
	const updateTakes=()=>{
		const session=selected(),kind=type.value,old=take.value
		const values=kind==='orphan'?(session?.orphans ?? []).map(name=>[name,name]):
			[...new Set((session?.media?.[kind] ?? []).map(entry=>entry.take ?? 0))].map(index=>[String(index),'Take '+(index+1)])
		populate(take,values,old)
		take.hidden=['midi','dawproject','musicxml'].includes(kind);doc.querySelector('label[for="session-export-take"]').hidden=take.hidden
		update()
	}
	const updateTypes=()=>{
		const session=selected(),values=[]
		pendingDelete=[];get('session-delete-confirmation').hidden=true
		get('session-library-empty').hidden=!!sessions.length
		write(get('session-library-details'),session?formatRecordingTime(session.durationMs)+' · '+formatBytes(session.storageBytes)+' · '+(hasNotes(session)?'MIDI notes':'No MIDI notes')+(session.media?.audio?.length?' · Audio':'')+(session.media?.video?.length?' · Video':''):'')
		if(session&&hasNotes(session))values.push(['midi','MIDI notes (.mid)'],['dawproject','DAWproject notes (.dawproject)'],['musicxml','MusicXML score (.musicxml)'])
		for(const kind of ['audio','video'])if(session?.media?.[kind]?.length)values.push([kind,kind==='audio'?'Recorded audio (original format)':'Recorded video (original format)'])
		if(session?.orphans?.length)values.push(['orphan','Recover unindexed media chunk'])
		populate(type,values,type.value)
		write(get('session-media-library'),(session?.warnings ?? []).join(' '))
		updateTakes()
	}
	const refresh=async preferred=>{
		const generation=++refreshGeneration
		await controller.flush?.()
		const scanned=await recoverSessionManifests()
		if(destroyed||generation!==refreshGeneration)return
		sessions=scanned.sort((a,b)=>(b.startedAt ?? 0)-(a.startedAt ?? 0))
		const label=s=>(s.startedAt?new Date(s.startedAt).toLocaleString():s.sessionId)+' · '+formatRecordingTime(s.durationMs)
		populate(library,sessions.map(s=>[s.sessionId,label(s)+' · '+formatBytes(s.storageBytes)]),preferred||library.value||controller.state().id)
		populate(replayLibrary,sessions.filter(hasNotes).map(s=>[s.sessionId,label(s)]),replayLibrary.value||controller.state().id)
		updateTypes()
		let estimate
		try{estimate=await navigator.storage?.estimate?.()}catch{}
		if(destroyed||generation!==refreshGeneration)return
		const meter=get('session-storage-meter')
		meter.hidden=!estimate?.quota
		if(estimate?.quota){meter.value=Math.min(1,estimate.usage/estimate.quota);meter.optimum=0;meter.high=.9;meter.low=.75}
		write(get('session-storage-status'),
			sessions.length+(sessions.length===1?' recording · ':' recordings · ')+formatBytes(sessions.reduce((total,s)=>total+(s.storageBytes||0),0))+
			(estimate?.quota?' · '+formatBytes(Math.max(0,estimate.quota-estimate.usage))+' free':''))
	}
	button.addEventListener('click',run(async()=>{
		if(controller.state().recording){await controller.stopMedia();await refresh(controller.state().id)}
		else show('session-record-dialog')
	}))
	recordConfirm.addEventListener('click',run(async()=>{
		await controller.startMedia({audio:audio.checked,video:video.checked})
		close('session-record-dialog');await refresh()
	}))
	const refreshExport=async()=>{
		exportLoading=true
		get('session-export-loading').hidden=false
		get('session-export-menu').hidden=true
		get('session-export-menu').setAttribute('aria-busy','true')
		show('session-export-dialog');update()
		try{await refresh()}finally{
			exportLoading=false
			get('session-export-loading').hidden=true
			get('session-export-menu').hidden=false
			get('session-export-menu').setAttribute('aria-busy','false')
			update()
		}
	}
	save.addEventListener('click',run(refreshExport))
	get('session-error-manage').addEventListener('click',async()=>{
		try{await refreshExport()}catch(error){fail(error)}
	})
	get('session-error-dismiss').addEventListener('click',()=>{errorMessage='';update()})
	get('session-error-retry').addEventListener('click',()=>{errorMessage='';show('session-record-dialog');update()})
	get('session-stop-all').addEventListener('click',run(async()=>{
		auto.checked=false
		try{localStorage.setItem('photosynth.autoMidiRecording','false')}catch{}
		await controller.setAuto(false);await controller.stop();await refresh()
	}))
	const confirmDeletion=ids=>{
		pendingDelete=ids
		const session=sessions.find(s=>s.sessionId===ids[0])
		const name=session?.startedAt?new Date(session.startedAt).toLocaleString():ids[0]
		write(get('session-delete-description'),ids.length===1?'Delete recording “'+name+'”?':'Delete '+ids.length+' inactive recordings?')
		get('session-delete-confirmation').hidden=false;update()
		get('session-delete-cancel').focus()
	}
	get('session-delete').addEventListener('click',()=>confirmDeletion([library.value]))
	get('session-delete-all').addEventListener('click',()=>confirmDeletion(sessions.filter(s=>!activeSession(s.sessionId)).map(s=>s.sessionId)))
	get('session-delete-cancel').addEventListener('click',()=>{pendingDelete=[];get('session-delete-confirmation').hidden=true;(get('session-delete').hidden?get('session-delete-all'):get('session-delete')).focus()})
	get('session-delete-confirm').addEventListener('click',run(async()=>{
		const ids=[...pendingDelete]
		try{
			for(const id of ids)await controller.deleteSession(id)
			write(get('session-library-notice'),ids.length===1?'Recording deleted. Storage freed.':ids.length+' recordings deleted. Storage freed.')
		}finally{await refresh();library.focus()}
	}))
	exportConfirm.addEventListener('click',async()=>{
		if(exporting||exportConfirm.disabled)return
		const id=library.value,kind=type.value,chosenTake=take.value
		const name=(get('session-export-name').value.trim()||'photosynth').replace(/[<>:"/\\|?*\x00-\x1f]/g,'-')
		exporting=true;errorMessage='';update()
		try{
			const blob=kind==='midi'?await controller.exportMIDI(id):kind==='dawproject'?await controller.exportDAWProject(id,{title:name}):kind==='musicxml'?await controller.exportMusicXML(id,{title:name}):kind==='orphan'?await readSessionOrphan(chosenTake):await readSessionMedia(id,kind,Number(chosenTake))
			downloadBlob(blob,name+'.'+(kind==='midi'?'mid':kind==='dawproject'?'dawproject':kind==='musicxml'?'musicxml':kind==='orphan'?'bin':extensionFor(blob)))
		}catch(error){fail(error)}finally{exporting=false;update()}
	})
	replay.addEventListener('click',async()=>{
		if(replayBusy)return
		const state=controller.state().replay ?? {}
		if(state.playing){controller.pauseReplay();update();return}
		replayBusy=true;errorMessage='';update()
		try{
			if(state.id&&state.positionMs<state.durationMs)await controller.playReplay()
			else{await refresh();show('session-replay-dialog')}
		}catch(error){fail(error)}finally{replayBusy=false;update()}
	})
	replayConfirm.addEventListener('click',async()=>{
		if(replayBusy)return
		const generation=++replayGeneration
		replayBusy=true;errorMessage='';update()
		try{await controller.loadReplay(replayLibrary.value);if(generation!==replayGeneration)return;await controller.playReplay();if(generation===replayGeneration)close('session-replay-dialog')}
		catch(error){if(generation===replayGeneration)fail(error)}finally{if(generation===replayGeneration){replayBusy=false;update()}}
	})
	get('session-replay-choose').addEventListener('click',run(async()=>{
		controller.pauseReplay();await refresh();show('session-replay-dialog')
	}))
	const seek=async value=>{try{await controller.seekReplay(value)}catch(error){fail(error)}update()}
	rewind.addEventListener('click',()=>seek((controller.state().replay?.positionMs||0)-10000))
	forward.addEventListener('click',()=>seek((controller.state().replay?.positionMs||0)+10000))
	position.addEventListener('change',()=>seek(Number(position.value)))
	auto.addEventListener('change',run(async()=>{
		try{localStorage.setItem('photosynth.autoMidiRecording',String(auto.checked))}catch{}
		await controller.setAuto(auto.checked);await refresh()
	}))
	for(const node of [audio,video,replayLibrary])node.addEventListener('change',()=>update())
	library.addEventListener('change',updateTypes);type.addEventListener('change',updateTakes);take.addEventListener('change',()=>update())
	get('session-refresh').addEventListener('click',run(refreshExport))
	const cancelReplay=()=>{replayGeneration++;controller.pauseReplay();replayBusy=false;update()}
	for(const node of doc.querySelectorAll('[data-session-close]'))node.addEventListener('click',()=>{
		if(node.dataset.sessionClose==='session-replay-dialog')cancelReplay()
		if(!working||node.dataset.sessionClose==='session-export-dialog')close(node.dataset.sessionClose)
	})
	for(const dialog of doc.querySelectorAll('.session-dialog'))dialog.addEventListener('cancel',event=>{
		if(dialog.id==='session-replay-dialog')cancelReplay()
		if(working&&dialog.id!=='session-export-dialog')event.preventDefault()
	})
	try{auto.checked=localStorage.getItem('photosynth.autoMidiRecording')!=='false'}catch{}
	run(async()=>{try{await controller.setAuto(auto.checked)}finally{await refresh()}})()
	const timer=setInterval(()=>update(),250)
	const onPageHide=()=>controller.pauseReplay?.()
	const destroy=()=>{destroyed=true;clearInterval(timer);statusAPI?.clearDeviceStatus('session-recording');controller.pauseReplay?.();window.removeEventListener('pagehide',onPageHide)}
	window.addEventListener('pagehide',onPageHide)
	return {update,fail,destroy,pulse:()=>{if(controller.state().recording)for(const animation of button.getAnimations?.() ?? [])if(animation.animationName==='session-record-pulse')animation.currentTime=0}}
}
