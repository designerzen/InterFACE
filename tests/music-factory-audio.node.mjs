import assert from 'node:assert/strict'
import {readFileSync, mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {spawn} from 'node:child_process'

// Exercise the actual renderer on Chromium's audio engine without a server or camera.
const sources = ['profiles', 'score', 'player'].map(name => readFileSync(`source/audio/music-factory-${name}.js`, 'utf8'))
const profile = mkdtempSync(join(tmpdir(), 'photosynth-factory-audio-'))
const browser = spawn(process.env.AUDIO_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	['--headless=new', '--no-first-run', '--disable-extensions', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
	{windowsHide:true, stdio:['ignore', 'ignore', 'pipe']})
let socket
try {
	const endpoint = await new Promise((resolve, reject) => {
		const timeout = setTimeout(() => reject(Error('Audio test browser startup timed out')), 20000)
		let output = ''
		browser.on('error', reject)
		browser.on('exit', code => reject(Error(`Audio test browser exited: ${code}`)))
		browser.stderr.on('data', chunk => {
			output += chunk
			const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/)
			if (match) {clearTimeout(timeout);resolve(match[1])}
		})
	})
	socket = new WebSocket(endpoint)
	await new Promise((resolve, reject) => {socket.onopen=resolve;socket.onerror=reject})
	let serial=0
	const pending = new Map()
	socket.onmessage = ({data}) => {
		const message=JSON.parse(data), handler=pending.get(message.id)
		if (!handler) return
		pending.delete(message.id)
		message.error ? handler.reject(Error(JSON.stringify(message.error))) : handler.resolve(message.result)
	}
	const command = (method, params={}, sessionId) => new Promise((resolve, reject) => {
		const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,sessionId}))
	})
	const {targetId} = await command('Target.createTarget', {url:'about:blank'})
	const {sessionId} = await command('Target.attachToTarget', {targetId, flatten:true})
	const result = await command('Runtime.evaluate', {awaitPromise:true, returnByValue:true,
		expression:`(${async function(sources) {
			const load = (source, names) => new Function(source.replaceAll('export const ', 'const ') + '\nreturn {' + names + '}')()
			const {MUSIC_FACTORY_PROFILES} = load(sources[0], 'MUSIC_FACTORY_PROFILES')
			const {createFactoryIdentity, combineFactoryPlayers, composeFactoryBar} = load(sources[1], 'createFactoryIdentity,combineFactoryPlayers,composeFactoryBar')
			const {createMusicFactoryPlayer} = load(sources[2], 'createMusicFactoryPlayer')
			const results=[]
			for (const profile of MUSIC_FACTORY_PROFILES) for (const count of [1,2,3,4]) {
				const rate=24000, seconds=60/profile.bpm*profile.beats+1
				const context=new OfflineAudioContext(2, Math.ceil(rate*seconds), rate)
				const player=createMusicFactoryPlayer(context,context.destination,()=>{})
				const members=Array.from({length:count},(_,id)=>({id,energy:0.8,tension:0.5,brightness:0.8,contour:0.5}))
				const identities=new Map(members.map(member=>[member.id,createFactoryIdentity('audio',member.id,3)]))
				const plan=composeFactoryBar({profile,bar:0,root:0,seed:'audio',ensemble:combineFactoryPlayers(members),identities})
				player.express(members)
				const step=60/profile.bpm*profile.beats/profile.steps
				for(const event of plan.events)player.play(event,0.01+event.step*step,event.length*step)
				const buffer=await context.startRendering()
				let peak=0,energy=0,finite=true
				for(let channel=0;channel<2;channel++)for(const value of buffer.getChannelData(channel)) {
					finite &&= Number.isFinite(value);peak=Math.max(peak,Math.abs(value));energy+=value*value
				}
				player.destroy()
				results.push({genre:profile.id,count,peak,rms:Math.sqrt(energy/(buffer.length*2)),finite})
			}
			return results
		}})(${JSON.stringify(sources)})`}, sessionId)
	assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails))
	const results=result.result.value
	assert.equal(results.length,48)
	for(const render of results) {
		assert.ok(render.finite, `Non-finite audio: ${render.genre}/${render.count}`)
		assert.ok(render.rms>0.0001, `Silent audio: ${render.genre}/${render.count}`)
		assert.ok(render.peak<0.95, `Insufficient headroom: ${render.genre}/${render.count}: ${render.peak}`)
	}
	console.log(`Rendered ${results.length} genre/player combinations; finite, non-silent audio; maximum peak ${Math.max(...results.map(item=>item.peak)).toFixed(3)}.`)
} finally {
	socket?.close()
	browser.kill()
}
