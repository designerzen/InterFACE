jest.mock('../source/storage/session-recorder.js',()=>({recoverSessionManifests:jest.fn(),readSessionMedia:jest.fn(),readSessionOrphan:jest.fn()}))
jest.mock('../source/dom/download.js',()=>({downloadBlob:jest.fn()}))
import {setupSessionRecordingUI,formatRecordingTime} from '../source/dom/ui.session-recording.js'
import {recoverSessionManifests,readSessionMedia} from '../source/storage/session-recorder.js'
import {downloadBlob} from '../source/dom/download.js'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import pug from 'pug'

const settle=()=>new Promise(resolve=>setTimeout(resolve,0))
let ui
beforeEach(()=>{
	document.body.innerHTML=pug.render(readFileSync(resolve('source/partials/transport-panel.pug'),'utf8'))
	document.querySelector('.transport-session-controls').hidden=false
	document.getElementById('transport').hidden=false
	for(const dialog of document.querySelectorAll('dialog')){
		dialog.showModal=jest.fn(()=>{dialog.open=true})
		dialog.close=jest.fn(()=>{dialog.open=false})
	}
	localStorage.clear()
})
afterEach(()=>ui?.destroy())
test('seek controls retain descriptive labels and accessible seek amounts',()=>{
	for(const id of ['session-rewind','session-forward']){
		const button=document.getElementById(id)
		expect(button.textContent.trim()).toMatch(/^(Rewind|Forward)$/)
		expect(button.getAttribute('aria-label')).toMatch(/10 seconds/)
	}
})
const setup=async({recording=true,sessions=[{sessionId:'test-session',eventBytes:80,status:'recording',durationMs:12000,media:{audio:[],video:[]}}]}={})=>{
	const state={id:'test-session',recording,midi:true,busy:false,auto:true,bpm:120,durationMs:12000,hasNotes:false,
		replay:{id:null,playing:false,loading:false,positionMs:0,durationMs:30000}}
	const controller={state:()=>state,setAuto:jest.fn(async()=>{}),flush:jest.fn(async()=>{}),
		startMedia:jest.fn(async()=>{state.recording=true}),stopMedia:jest.fn(async()=>{state.recording=false}),
		exportMIDI:jest.fn(async()=>new Blob(['midi'])),exportMusicXML:jest.fn(async()=>new Blob(['score'])),exportDAWProject:jest.fn(async()=>new Blob(['project'])),loadReplay:jest.fn(async id=>{state.replay.id=id}),
		playReplay:jest.fn(async()=>{state.replay.playing=true}),pauseReplay:jest.fn(()=>{state.replay.playing=false}),
		seekReplay:jest.fn(async value=>{state.replay.positionMs=value}),
		stop:jest.fn(async()=>{state.recording=false;state.midi=false}),deleteSession:jest.fn(async()=>{})}
	recoverSessionManifests.mockResolvedValue(sessions)
	ui=setupSessionRecordingUI(controller,jest.fn())
	await settle()
	return {controller,state}
}

test('Save is hidden without data, and opens export options rather than downloading immediately',async()=>{
	const {state}=await setup({recording:false,sessions:[]})
	const save=document.getElementById('button-save-midi')
	expect(save.hidden).toBe(true)
	state.hasNotes=true;ui.update()
	expect(save.hidden).toBe(false)
	save.click();await settle()
	expect(document.getElementById('session-export-dialog').open).toBe(true)
	expect(downloadBlob).not.toHaveBeenCalled()
})

test('export remains independent of Stop and uses the chosen type and file name',async()=>{
	const {controller}=await setup()
	document.getElementById('button-save-midi').click();await settle()
	let finishExport;controller.exportMIDI.mockReturnValueOnce(new Promise(resolve=>{finishExport=resolve}))
	document.getElementById('session-export-name').value='My performance'
	document.getElementById('session-export-confirm').click()
	expect(document.getElementById('session-export-confirm').disabled).toBe(true)
	document.querySelector('[data-session-close="session-export-dialog"]').click()
	const record=document.getElementById('button-record-session')
	expect(record.disabled).toBe(false)
	record.click();record.click();await settle()
	expect(controller.stopMedia).toHaveBeenCalledTimes(1)
	expect(document.getElementById('session-capture-status').textContent).toBe('Record')
	const blob=new Blob(['midi']);finishExport(blob);await settle()
	expect(downloadBlob).toHaveBeenCalledWith(blob,'My performance.mid')
})

test('media export types are restricted to available recordings and take zero is selectable',async()=>{
	await setup({sessions:[{sessionId:'test-session',eventBytes:80,media:{audio:[{take:0,mimeType:'audio/webm'}],video:[]}}]})
	const type=document.getElementById('session-export-type')
	expect([...type.options].map(o=>o.value)).toEqual(['midi','dawproject','musicxml','audio'])
	type.value='audio';type.dispatchEvent(new Event('change'))
	expect(document.getElementById('session-export-take').value).toBe('0')
	const blob=new Blob(['audio'],{type:'audio/webm'});readSessionMedia.mockResolvedValue(blob)
	document.getElementById('session-export-confirm').click();await settle()
	expect(readSessionMedia).toHaveBeenCalledWith('test-session','audio',0)
	expect(downloadBlob).toHaveBeenCalledWith(blob,'photosynth.webm')
})

test('record options start capture, duration stays separate from replay, and pulse follows BPM',async()=>{
	const {controller,state}=await setup({recording:false})
	const record=document.getElementById('button-record-session')
	record.click();await settle()
	expect(document.getElementById('session-record-dialog').open).toBe(true)
	document.getElementById('session-record-video').checked=true
	document.getElementById('session-record-confirm').click();await settle()
	expect(controller.startMedia).toHaveBeenCalledWith({audio:true,video:true})
	expect(document.getElementById('session-capture-status').textContent).toBe('Recording')
	expect(record.title).toBe('Stop recording')
	expect(record.contains(document.getElementById('session-recording-duration'))).toBe(true)
	state.durationMs=65000;state.bpm=90;ui.update()
	expect(document.getElementById('session-recording-duration').textContent).toBe('01:05')
	expect(document.getElementById('session-recording-duration').getAttribute('datetime')).toBe('PT65S')
	expect(parseFloat(record.style.getPropertyValue('--record-beat-duration'))).toBeCloseTo(666.667)
	const animation={animationName:'session-record-pulse',currentTime:300};record.getAnimations=()=>[animation];ui.pulse()
	expect(animation.currentTime).toBe(0)
})

test('saved-note replay supports pause, rewind and fast forward',async()=>{
	const {controller,state}=await setup({recording:false})
	const replay=document.getElementById('session-replay')
	replay.click();await settle()
	expect(document.getElementById('session-replay-dialog').open).toBe(true)
	document.getElementById('session-replay-confirm').click();await settle()
	expect(controller.loadReplay).toHaveBeenCalledWith('test-session')
	expect(controller.playReplay).toHaveBeenCalledTimes(1)
	expect(replay.textContent).toBe('Pause replay')
	state.replay.positionMs=15000;ui.update()
	document.getElementById('session-rewind').click();await settle()
	expect(controller.seekReplay).toHaveBeenLastCalledWith(5000)
	document.getElementById('session-forward').click();await settle()
	expect(controller.seekReplay).toHaveBeenLastCalledWith(15000)
	replay.click();await settle()
	expect(controller.pauseReplay).toHaveBeenCalledTimes(1)
	expect(replay.textContent).toBe('Resume replay')
})
test('idle bar only shows controls that can act, and the timer only while recording',async()=>{
	const {state}=await setup({recording:false,sessions:[]})
	state.midi=false;ui.update()
	const shown=[...document.querySelectorAll('.transport-session-controls button')].filter(b=>!b.closest('[hidden]')).map(b=>b.id)
	expect(shown).toEqual(['button-record-session'])
	expect(document.getElementById('session-recording-duration').hidden).toBe(true)
	state.hasNotes=true;ui.update()
	expect(document.getElementById('session-replay').hidden).toBe(false)
	expect(document.getElementById('session-rewind').hidden).toBe(true)
	state.replay.id='test-session';state.recording=true;ui.update()
	expect(document.getElementById('session-rewind').hidden).toBe(false)
	expect(document.getElementById('session-recording-duration').hidden).toBe(false)
})

test('recordings manager deletion requires confirmation and hides actions once empty',async()=>{
	const {controller,state}=await setup({recording:false})
	state.midi=false;ui.update()
	document.getElementById('button-save-midi').click();await settle()
	expect(document.getElementById('session-export-dialog').open).toBe(true)
	document.getElementById('session-delete').click()
	expect(controller.deleteSession).not.toHaveBeenCalled()
	expect(document.getElementById('session-delete-confirmation').hidden).toBe(false)
	document.getElementById('session-delete-cancel').click()
	expect(controller.deleteSession).not.toHaveBeenCalled()
	document.getElementById('session-delete').click()
	recoverSessionManifests.mockResolvedValueOnce([])
	document.getElementById('session-delete-confirm').click();await settle()
	expect(controller.deleteSession).toHaveBeenCalledWith('test-session')
	expect(document.getElementById('session-library-empty').hidden).toBe(false)
	expect(document.getElementById('session-delete-section').hidden).toBe(true)
	expect(document.getElementById('session-export-section').hidden).toBe(true)
})

test('active recordings are protected and stopping automatic MIDI makes them deletable',async()=>{
	const {controller}=await setup()
	expect(document.getElementById('session-delete').hidden).toBe(true)
	expect(document.getElementById('session-active-warning').hidden).toBe(false)
	expect(document.getElementById('session-stop-all').hidden).toBe(false)
	document.getElementById('session-stop-all').click();await settle()
	expect(controller.setAuto).toHaveBeenLastCalledWith(false)
	expect(controller.stop).toHaveBeenCalledTimes(1)
	expect(document.getElementById('session-delete').hidden).toBe(false)
	expect(document.getElementById('session-active-warning').hidden).toBe(true)
})

test('bulk deletion excludes the active recording and waits for explicit confirmation',async()=>{
	const {controller}=await setup({sessions:[{sessionId:'test-session',eventBytes:80},{sessionId:'older',eventBytes:80}]})
	document.getElementById('session-delete-all').click()
	expect(document.getElementById('session-delete-description').textContent).toContain('older')
	expect(controller.deleteSession).not.toHaveBeenCalled()
	document.getElementById('session-delete-confirm').click();await settle()
	expect(controller.deleteSession.mock.calls).toEqual([['older']])
})

test('storage errors explain recovery and can be managed, dismissed or retried',async()=>{
	await setup({recording:false})
	ui.fail(Error('Recording storage queue is full'))
	expect(document.getElementById('session-recording-status').textContent).toContain('storage writes could not keep up')
	expect(document.getElementById('session-recording-error').hidden).toBe(false)
	document.getElementById('session-error-manage').click();await settle()
	expect(document.getElementById('session-export-dialog').open).toBe(true)
	document.getElementById('session-error-dismiss').click()
	expect(document.getElementById('session-recording-error').hidden).toBe(true)
	ui.fail(Error('QuotaExceededError'))
	expect(document.getElementById('session-recording-status').textContent).toContain('delete recordings to free space')
	document.getElementById('session-error-retry').click()
	expect(document.getElementById('session-record-dialog').open).toBe(true)
})

test('formats hours and invalid times safely',()=>{
	expect(formatRecordingTime(3661000)).toBe('01:01:01')
	expect(formatRecordingTime(-1)).toBe('00:00')
	expect(formatRecordingTime(Infinity)).toBe('00:00')
})

test('cancelling a pending replay cannot start playback later',async()=>{
	const {controller}=await setup({recording:false})
	document.getElementById('session-replay').click();await settle()
	let finishLoad;controller.loadReplay.mockReturnValueOnce(new Promise(resolve=>{finishLoad=resolve}))
	document.getElementById('session-replay-confirm').click()
	document.querySelector('[data-session-close="session-replay-dialog"]').click()
	expect(document.getElementById('session-replay-dialog').open).toBe(false)
	finishLoad();await settle()
	expect(controller.playReplay).not.toHaveBeenCalled()
	expect(controller.pauseReplay).toHaveBeenCalledTimes(1)
})


test('export opens immediately while the library is loading and replaces the loading state',async()=>{
	await setup()
	let finish;recoverSessionManifests.mockReturnValueOnce(new Promise(resolve=>{finish=resolve}))
	const save=document.getElementById('button-save-midi')
	expect(save.textContent).toBe('Recordings')
	save.click()
	expect(document.getElementById('session-export-dialog').open).toBe(true)
	expect(document.getElementById('session-export-loading').hidden).toBe(false)
	expect(document.getElementById('session-export-menu').hidden).toBe(true)
	expect(document.getElementById('session-export-confirm').disabled).toBe(true)
	document.querySelector('[data-session-close="session-export-dialog"]').click()
	expect(document.getElementById('session-export-dialog').open).toBe(false)
	await settle();finish([]);await settle()
	expect(document.getElementById('session-export-dialog').open).toBe(false)
	expect(document.getElementById('session-export-loading').hidden).toBe(true)
	expect(document.getElementById('session-export-menu').hidden).toBe(false)
})

test('failed export preparation clears the spinner and permits retry',async()=>{
	await setup()
	recoverSessionManifests.mockRejectedValueOnce(new Error('Storage unavailable'))
	document.getElementById('button-save-midi').click();await settle()
	expect(document.getElementById('session-export-loading').hidden).toBe(true)
	expect(document.querySelector('#session-export-dialog [data-session-error]').textContent).toBe('Storage unavailable')
	expect(document.getElementById('session-refresh').hidden).toBe(false)
	expect(document.getElementById('session-refresh').disabled).toBe(false)
})

test('DAWproject exports notes without requiring a media take',async()=>{
	const {controller}=await setup()
	const type=document.getElementById('session-export-type')
	type.value='dawproject';type.dispatchEvent(new Event('change'))
	expect(document.getElementById('session-export-take').hidden).toBe(true)
	expect(document.getElementById('session-export-confirm').disabled).toBe(false)
	document.getElementById('session-export-confirm').click();await settle()
	expect(controller.exportDAWProject).toHaveBeenCalledWith('test-session',{title:'photosynth'})
	expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob),'photosynth.dawproject')
})

test('MusicXML exports notes without requiring a media take',async()=>{
	const {controller}=await setup()
	const type=document.getElementById('session-export-type')
	type.value='musicxml';type.dispatchEvent(new Event('change'))
	expect(document.getElementById('session-export-take').hidden).toBe(true)
	expect(document.getElementById('session-export-confirm').disabled).toBe(false)
	document.getElementById('session-export-confirm').click();await settle()
	expect(controller.exportMusicXML).toHaveBeenCalledWith('test-session',{title:'photosynth'})
	expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob),'photosynth.musicxml')
})
