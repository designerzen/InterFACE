import { initializeWamHost } from '@webaudiomodules/sdk'
import { VOICE_ENGINE_PARTS } from '../voice-engine-options.js'
import { getDefaultVoicePatch, getYoshimiPatches } from '../voice-patches.js'
import { importVoiceModule } from './import-module.js'
import { createVoiceReverb } from './reverb.js'
import { normaliseEngineSettings } from '../voice-engine-settings.js'
import { watchVoiceControls } from './controls.js'
import { voiceEngineGain, voiceProgramGain } from '../voice-engine-levels.js'

const registrations = new WeakMap()
const byte = value => Math.max(0, Math.min(127, Math.round(value)))
// Measured on a sustained patch: Yoshimi's CC7 is logarithmic at 0.315 dB per step
// and its CC11 is linear. Convert CC7 so a chord voice at 1/5 volume drops 14 dB
// like other engines rather than 32 dB.
const yoshimiVolume = gain => gain > 0 ? byte(127+63.5*Math.log10(gain)) : 0
// Yoshimi glides part volume for about 100 ms after every CC7, starting from its
// default level on a fresh part, so a note played sooner comes out up to 20 dB off.
const YOSHIMI_VOLUME_GLIDE = 0.2
const asset = path => new URL(path, document.baseURI).href
const fetchOK = async url => { const response = await fetch(url); if (!response.ok) throw Error(`Unable to load ${url}: ${response.status}`); return response }

export const createMidiVoiceBackend = async (id, context, destination) => {
	let node, plugin, banks = [], stop, silentSource
	if (id === 'yoshimi') {
		let pending = registrations.get(context)
		if (!pending) {
			pending = (async () => {
				const [wasm, js] = await Promise.all([
					fetchOK(asset('wam/multipart/yoshimi.wasm')).then(response => response.arrayBuffer()),
					fetchOK(asset('wam/multipart/yoshimi.js')).then(response => response.text())
				])
				await context.audioWorklet.addModule(asset('wam/libs/wam-processor.js'))
				await context.audioWorklet.addModule(asset('wam/multipart/yoshimi-awp.js'))
				return {wasm, js}
			})()
			registrations.set(context, pending)
			pending.catch(() => registrations.delete(context))
		}
		const processorOptions = await pending
		banks = await fetchOK(asset('wam/banks/root.json')).then(response => response.json())
		node = new AudioWorkletNode(context, 'photosynth-yoshimi', {numberOfInputs:0, numberOfOutputs:1, outputChannelCount:[2], processorOptions})
		stop = () => { node.port.postMessage({type:'dispose'}); node.disconnect(); node.port.close() }
	}else{
		const [group] = await initializeWamHost(context)
		const {default:Plugin} = await importVoiceModule(asset('wam2/tinysynth/src/index.js'))
		plugin = await Plugin.createInstance(group, context)
		node = plugin.audioNode
		if (!node?.scheduleEvents) { await node?.destroy?.(); throw Error('TinySynth does not expose WAM MIDI events.') }
		stop = async () => { node.disconnect(); await node.destroy?.() }
		if (node.numberOfInputs > 0) {
			silentSource = context.createConstantSource()
			silentSource.offset.value = 0
			silentSource.connect(node)
			silentSource.start()
		}
	}
	// This legacy renderer exports a stereo mix. Person expression and pan are
	// applied to its MIDI parts before summing, never to copies of the shared mix.
	const mix = context.createGain()
	if (id === 'yoshimi') mix.gain.value = voiceEngineGain(id,normaliseEngineSettings(id))
	if (id === 'yoshimi') node.connect(mix)
	// Yoshimi applies mouth expression inside its shared renderer. Convolution
	// after that stereo output lets its extra tail survive a closed mouth.
	const sharedReverb = id === 'yoshimi' ? createVoiceReverb(context,mix,destination,{applyOutputGain:false}) : null
	const reverbs = new Map()
	let settings = {}
	const parts = new Map(), patches = new Map(), controls = new Map(), channelOutputs = new Map(), reverbSends = new Map(), watchers = new Map(), sounding = new Map()
	let glideUntil = 0
	if (id === 'wam2' && node.synth.rev) {
		// Keep TinySynth's own wet return while routing each dry part through
		// its Person, alongside the app's post-expression wet return.
		node.synth.rev.disconnect()
		node.synth.rev.connect(mix)
		mix.connect(destination)
	}
	const send = (handle, bytes) => {
		const part = parts.get(handle)
		if (part === undefined) return
		const data = [bytes[0] | part, ...bytes.slice(1)]
		if (id === 'yoshimi') node.port.postMessage({type:'midi', data, time:handle.currentTime})
		else node.scheduleEvents({type:'wam-midi', time:handle.currentTime, data:{bytes:data}})
	}
	const cc = (handle, controller, value) => send(handle, [0xb0, controller, byte(value)])
	const backend = {
		async configure(next){
			await sharedReverb?.configure(next.reverbMode === 'preset' ? {...next,reverbMix:0.05,reverbSpace:'synthetic',reverbLength:0.8,reverbTone:0,reverbPreDelay:0.01} : next)
			for (const [handle,reverb] of reverbs) await reverb.configure(next,handle.program)
			if (id === 'wam2') {
				node.synth.setQuality(next.quality)
				// TinySynth's internal wet return bypasses the per-part app reverb.
				mix.gain.setTargetAtTime?.(voiceEngineGain(id,next),context.currentTime,0.01)
			}
			// Boost the audio after MIDI expression, beyond CC7's 127 ceiling.
			if (id === 'yoshimi') mix.gain.setTargetAtTime(voiceEngineGain(id,normaliseEngineSettings(id,next)),context.currentTime,0.01)
			settings = next
		},
		sharedMix:id === 'yoshimi',
		fadeOut(){ mix.gain.cancelScheduledValues(context.currentTime); mix.gain.setValueAtTime(mix.gain.value,context.currentTime); mix.gain.linearRampToValueAtTime(0,context.currentTime+0.025) },
		async attach(handle){
			// Channel 10 is reserved for GM drums in TinySynth; percussion lives elsewhere.
			const part = Array.from({length:VOICE_ENGINE_PARTS}, (_, index) => index).find(index => (id !== 'wam2' || index !== 9) && ![...parts.values()].includes(index))
			if (part === undefined) throw Error('No free MIDI parts in the shared engine.')
			parts.set(handle, part)
			cc(handle,121,0)
			send(handle,[0xe0,0,64])
			if (id === 'wam2') {
				const output = node.synth?.chpan?.[part] ?? node.synth?.chvol?.[part]
				if (!output) throw Error('TinySynth does not expose independent channel outputs.')
				output.disconnect()
				reverbs.set(handle,createVoiceReverb(context,output,handle.output,{wetDestination:destination,handle,engine:id}))
				channelOutputs.set(handle,output)
				if (node.synth.rev) {
					const send = context.createGain()
					output.connect(send); send.connect(node.synth.out)
					reverbSends.set(handle,send)
				}
			}
			watchers.set(handle,watchVoiceControls(context,handle,(expression,pan) => updateControls(handle,expression,pan)))
			// The host settles once after attaching every part.
			await backend.program(handle,false)
			backend.sync(handle)
		},
		async detach(handle){
			backend.panic(handle)
			watchers.get(handle)?.destroy(); watchers.delete(handle)
			reverbs.get(handle)?.destroy(); reverbs.delete(handle)
			const output = channelOutputs.get(handle)
			output?.disconnect()
			output?.connect(node.synth.out)
			channelOutputs.delete(handle)
			reverbSends.get(handle)?.disconnect()
			reverbSends.delete(handle)
			parts.delete(handle); controls.delete(handle); sounding.delete(handle)
		},
		patches(program){ return id === 'yoshimi' ? [getDefaultVoicePatch(program), ...getYoshimiPatches(banks, program)] : [getDefaultVoicePatch(program)] },
		// Wait on the audio clock, giving up if the context is suspended.
		async settle(){
			const deadline = performance.now()+500
			while (context.currentTime < glideUntil && context.state === 'running' && performance.now() < deadline) await new Promise(resolve => setTimeout(resolve,20))
		},
		async program(handle, settle=true){
			await reverbs.get(handle)?.configure(settings,handle.program)
			if (id === 'yoshimi') {
				const choices = getYoshimiPatches(banks, handle.program)
				const patch = handle.patch === 'gm' ? choices[0] : choices.find(patch => patch.id === handle.patch)
				if (!patch) throw Error('No matching Yoshimi patch is available.')
				if (!patches.has(patch.id)) {
					const pending = (async () => {
						const bytes = new Uint8Array(await fetchOK(asset(`wam/banks/${patch.id}`)).then(response => response.arrayBuffer()))
						return bytes[0] === 0x1f && bytes[1] === 0x8b ? new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text() : new TextDecoder().decode(bytes)
					})()
					patches.set(patch.id, pending)
					pending.catch(() => patches.delete(patch.id))
				}
				const xml = await patches.get(patch.id)
				node.port.postMessage({type:'msg', verb:'set', prop:`patch${parts.get(handle)}`, data:xml})
			}else send(handle, [0xc0, handle.program])
			controls.delete(handle)
			backend.sync(handle)
			if (settle) await backend.settle()
		},
		noteOn(handle, note, velocity){
			backend.sync(handle)
			if (id === 'yoshimi') { if (!sounding.has(handle)) sounding.set(handle,new Set()); sounding.get(handle).add(note) }
			send(handle, [0x90, note, byte(velocity*127)])
		},
		noteOff(handle, note){ sounding.get(handle)?.delete(note); send(handle, [0x80, note, 0]) },
		panic(handle){
			if (id !== 'yoshimi') { cc(handle, 64, 0); cc(handle, 123, 0); cc(handle, 120, 0); return }
			// Yoshimi ignores CC120 for held notes and applies CC123 late enough to
			// release the next chord too. CC120 would also purge this part's queued
			// note-offs in our worklet, leaving them stuck, so release in order instead.
			cc(handle, 64, 0)
			for (const note of sounding.get(handle) ?? []) send(handle, [0x80, note, 0])
			sounding.delete(handle)
		},
		bend(handle, value){ const bend = Math.max(0, Math.min(16383, Math.round(8192+value*8191))); send(handle, [0xe0, bend&127, bend>>7]) },
		pressure(handle, note, value){ send(handle, Number.isInteger(note) ? [0xa0, note, byte(value*127)] : [0xd0,byte(value*127)]) },
		sync(handle){ watchers.get(handle)?.sync(true); reverbs.get(handle)?.sync() },
		async destroy(){
			for (const watcher of watchers.values()) watcher.destroy()
			watchers.clear()
			sharedReverb?.destroy()
			for (const reverb of reverbs.values()) reverb.destroy()
			reverbs.clear()
			for (const handle of parts.keys()) backend.panic(handle)
			parts.clear()
			for (const output of channelOutputs.values()) output.disconnect()
			channelOutputs.clear()
			for (const send of reverbSends.values()) send.disconnect()
			reverbSends.clear()
			node.synth?.rev?.disconnect()
			if (id === 'wam2') { node.synth?.lfo?.stop(); node.synth?.out?.disconnect(); node.synth?.comp?.disconnect() }
			silentSource?.stop()
			silentSource?.disconnect()
			await stop()
			mix.disconnect()
		}
	}
	const updateControls = (handle, expression, pan) => {
		const reverbSend = reverbSends.get(handle)
		if (reverbSend && reverbSend.gain.value !== expression) reverbSend.gain.value = expression
		// TinySynth's CC7 gain is quadratic; 67 keeps its GM reference level
		// near the FM/SuperSonic bank rather than jumping several dB louder.
		// The table only describes the default patch chosen for each GM program.
		const level = handle.patch === 'gm' ? voiceProgramGain(id,handle.program) : 1
		// Trimming a loud patch must not eat the mouth's range: voice and program
		// level use CC7 while the Person's expression moves CC11 independently.
		const voice = handle.volume ?? 1
		const values = id === 'wam2' ? [67,64] : [yoshimiVolume(voice*level), byte((pan+1)*63.5), byte(voice > 0 ? expression/voice*127 : 0)]
		const previous = controls.get(handle)
		if (!previous || values[0] !== previous[0]) {
			cc(handle, 7, values[0])
			if (id === 'yoshimi') glideUntil = Math.max(glideUntil, context.currentTime+YOSHIMI_VOLUME_GLIDE)
		}
		if (!previous || values[1] !== previous[1]) cc(handle, 10, values[1])
		if (values[2] !== undefined && (!previous || values[2] !== previous[2])) cc(handle, 11, values[2])
		controls.set(handle, values)
	}
	return backend
}
