import assert from 'node:assert/strict'
import {readFileSync, mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {spawn} from 'node:child_process'

const GENERAL_MIDI_INSTRUMENT_DATA = JSON.parse(readFileSync('source/audio/general-midi-instruments.json','utf8'))

// Real Chromium OfflineAudioContext convolution, with no application server.
// Optionally override the saved pre-change reverb source with the first argument.
const baseline = readFileSync(process.argv[2] ?? 'tests/fixtures/audio/reverb-baseline.js','utf8')
const current = readFileSync('source/audio/voice-engines/reverb.js','utf8')
const controls = readFileSync('source/audio/voice-engines/controls.js','utf8')
const executable = process.env.AUDIO_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = mkdtempSync(join(tmpdir(),'photosynth-audio-browser-'))
const browser = spawn(executable,['--headless=new','--no-first-run','--disable-extensions','--disable-background-networking',
	'--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']})
let socket
try {
	const endpoint = await new Promise((resolve,reject) => {
		const timeout = setTimeout(()=>reject(Error('Browser startup timed out')),20000)
		let output=''
		browser.on('error',reject)
		browser.on('exit',code=>reject(Error(`Browser exited: ${code}`)))
		browser.stderr.on('data',chunk=>{
			output+=chunk
			const match=output.match(/DevTools listening on (ws:\/\/[^\s]+)/)
			if (match) {clearTimeout(timeout);resolve(match[1])}
		})
	})
	socket = new WebSocket(endpoint)
	await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject})
	let id=0
	const pending=new Map()
	socket.onmessage=({data})=>{
		const message=JSON.parse(data), handler=pending.get(message.id)
		if (!handler) return
		pending.delete(message.id)
		message.error ? handler.reject(Error(JSON.stringify(message.error))) : handler.resolve(message.result)
	}
	const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
		const request=++id;pending.set(request,{resolve,reject})
		socket.send(JSON.stringify({id:request,method,params,sessionId}))
	})
	const {targetId}=await command('Target.createTarget',{url:'about:blank'})
	const {sessionId}=await command('Target.attachToTarget',{targetId,flatten:true})
	const result=await command('Runtime.evaluate',{
		expression:`(${async function(baseline,current,controls,data){
			const strip=source=>source.replace(/^import .*$/gm,'').replaceAll('export const ','const ')
			const watch=new Function(strip(controls)+'\nreturn watchVoiceControls')()
			const make=source=>new Function('GENERAL_MIDI_INSTRUMENT_DATA','watchVoiceControls',strip(source)+'\nreturn createVoiceReverb')(data,watch)
			const before=make(baseline),after=make(current)
			const render=async(create,count,capture=false)=>{
				const context=new OfflineAudioContext(2,48000*2,48000)
				let convolvers=0, seed=12345
				const originalConvolver=context.createConvolver.bind(context)
				context.createConvolver=()=>{convolvers++;return originalConvolver()}
				const random=Math.random
				Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
				const reverbs=[]
				try {
					for(let i=0;i<count;i++){
						const source=context.createBufferSource()
						source.buffer=context.createBuffer(1,24000,48000)
						const samples=source.buffer.getChannelData(0)
						for(let n=0;n<samples.length;n++)samples[n]=Math.sin(n*(0.01+i*0.003))*0.02
						const handle={volume:0.6,options:{voicePerson:{gainNode:{gain:{value:0.3+i*0.04}},trimNode:{gain:{value:0.8}},stereoNode:{pan:{value:(i%3-1)*0.5}}}}}
						const dry=context.createGain();dry.gain.value=0.6;dry.connect(context.destination)
						const reverb=create(context,source,dry,{wetDestination:context.destination,handle})
						await reverb.configure({reverbMode:'custom',reverbMix:0.3,reverbDuration:1.5,reverbDecay:2},0)
						reverbs.push(reverb);source.start()
					}
				}finally{Math.random=random}
				const start=performance.now(),buffer=await context.startRendering(),ms=performance.now()-start
				for(const reverb of reverbs)reverb.destroy()
				return {ms,convolvers,samples:capture?[buffer.getChannelData(0).slice(),buffer.getChannelData(1).slice()]:null}
			}
			const results=[]
			for(const count of [3,12]){
				const a=await render(before,count,true),b=await render(after,count,true)
				let maxError=0
				for(let ch=0;ch<2;ch++)for(let i=0;i<a.samples[ch].length;i++)maxError=Math.max(maxError,Math.abs(a.samples[ch][i]-b.samples[ch][i]))
				await render(before,count);await render(after,count)
				const oldTimes=[],newTimes=[]
				for(let repeat=0;repeat<9;repeat++){
					if(repeat%2){newTimes.push((await render(after,count)).ms);oldTimes.push((await render(before,count)).ms)}
					else{oldTimes.push((await render(before,count)).ms);newTimes.push((await render(after,count)).ms)}
				}
				const median=values=>values.sort((x,y)=>x-y)[4]
				results.push({count,beforeMs:median(oldTimes),afterMs:median(newTimes),beforeConvolvers:a.convolvers,afterConvolvers:b.convolvers,maxSampleError:maxError})
			}
			return {userAgent:navigator.userAgent,results}
		}})(${JSON.stringify(baseline)},${JSON.stringify(current)},${JSON.stringify(controls)},${JSON.stringify(GENERAL_MIDI_INSTRUMENT_DATA)})`,
		awaitPromise:true,returnByValue:true
	},sessionId)
	if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails))
	console.log(JSON.stringify(result.result.value))
	for(const row of result.result.value.results){
		assert.ok(row.maxSampleError<0.00001,'Reverb samples changed beyond floating-point tolerance')
		assert.equal(row.afterConvolvers,1)
		assert.ok(row.afterMs<=row.beforeMs*1.1,'Offline convolution median regressed by more than 10%')
	}
	await command('Browser.close')
} finally {
	socket?.close()
	browser.kill()
}
