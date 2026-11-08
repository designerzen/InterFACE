import { importVoiceModule } from './import-module.js'
import { createVoiceSynthDef } from './synthdef.js'
import { getSynthVariants } from '../voice-patches.js'
import { VOICE_ENGINE_AUDIO_LOCKED, VOICE_ENGINE_PARTS } from '../voice-engine-options.js'
import { createVoiceReverb } from './reverb.js'
import { voiceProgramGain } from '../voice-engine-levels.js'

export const createSuperSonicBackend = async (context, presets, destination) => {
	const base = new URL('supersonic/', document.baseURI).href
	const {SuperSonic, osc} = await importVoiceModule(`${base}dist/supersonic.js`)
	// SuperSonic 0.81 owns context shutdown. A dedicated context protects the
	// session/percussion context; stereo streams preserve separate Person paths.
	const renderContext = new AudioContext({latencyHint:'interactive'})
	// sonic.init() never settles while the browser blocks audio, which would stall
	// app loading. Report that instead so the caller can retry after a gesture.
	await Promise.race([renderContext.resume(), new Promise(resolve => setTimeout(resolve,500))])
	if (renderContext.state === 'suspended') {
		await renderContext.close()
		throw Object.assign(Error('SuperSonic needs permission to play audio.'), {code:VOICE_ENGINE_AUDIO_LOCKED})
	}
	const sonic = new SuperSonic({audioContext:renderContext, autoConnect:false, mode:'postMessage',
		baseURL:`${base}dist/`, coreBaseURL:`${base}core/`, wasmBaseURL:`${base}core/wasm/`,
		scsynthOptions:{numOutputBusChannels:VOICE_ENGINE_PARTS*2, numInputBusChannels:0, maxNodes:1024}})
	const parts = new Map()
	let pitchBendRange = 2
	let settings = {}
	sonic.on('in', message => { if (message[0] === '/fail') console.warn('SuperSonic voice command failed:', ...message.slice(1)) })
	let splitter
	try {
		await sonic.init()
		await renderContext.resume()
		for (let program=0; program<128; program++) sonic.send('/d_recv', createVoiceSynthDef(`photosynth-gm-${program}`,presets[program]))
		await sonic.sync()
		splitter = renderContext.createChannelSplitter(VOICE_ENGINE_PARTS*2)
		sonic.node.connect(splitter)
	}catch(error){ await sonic.destroy(); if (renderContext.state !== 'closed') await renderContext.close(); throw error }
	const programAmp = handle => 0.14*(presets[handle.program].gain ?? 1)*voiceProgramGain('supersonic',handle.program)
	const send = (handle, address, ...args) => {
		const delay = Math.max(0, handle.currentTime-context.currentTime)
		if (delay > 0) sonic.sendOSC(osc.encodeBundle(osc.ntpNow()+delay, [[address,...args]]))
		else sonic.send(address,...args)
	}
	const backend = {
		resume(){ if (renderContext.state === 'suspended') renderContext.resume().catch(() => {}) },
		diagnostics(){ return {heldNotes:[...parts.values()].map(part => [...part.notes.keys()]),synths:sonic.getRawTree().nodes.filter(node => !node.isGroup && node.defName.startsWith('photosynth-gm-')).length} },
		async configure(next){
			for (const [handle,part] of parts) await part.reverb.configure(next,handle.program)
			settings = next; pitchBendRange = next.pitchBendRange
		},
		async attach(handle){
			const slot = Array.from({length:VOICE_ENGINE_PARTS}, (_, index) => index).find(index => ![...parts.values()].some(part => part.slot === index))
			if (slot === undefined) throw Error('No free SuperSonic instrument parts.')
			const merger = renderContext.createChannelMerger(2)
			splitter.connect(merger,slot*2,0); splitter.connect(merger,slot*2+1,1)
			const stream = renderContext.createMediaStreamDestination()
			merger.connect(stream)
			const source = context.createMediaStreamSource(stream.stream)
			const reverb = createVoiceReverb(context,source,handle.output,{wetDestination:destination ?? handle.output,handle:destination ? handle : undefined,engine:'supersonic'})
			const group = sonic.nextNodeId()
			sonic.send('/g_new',group,0,0)
			parts.set(handle,{slot,merger,stream,source,group,reverb,notes:new Map(),bend:0})
			await reverb.configure(settings,handle.program)
		},
		async detach(handle){
			const part = parts.get(handle)
			if (!part) return
			backend.panic(handle)
			part.reverb.destroy()
			sonic.send('/n_free',part.group)
			splitter.disconnect(part.merger,part.slot*2,0); splitter.disconnect(part.merger,part.slot*2+1,1)
			part.merger.disconnect(); part.source.disconnect(); part.stream.disconnect()
			part.stream.stream.getTracks().forEach(track => track.stop())
			parts.delete(handle)
		},
		patches: getSynthVariants,
		sync(handle){ parts.get(handle)?.reverb.sync() },
		async program(handle){ await parts.get(handle)?.reverb.configure(settings,handle.program) },
		noteOn(handle, note, velocity){
			const part = parts.get(handle)
			part.reverb.sync()
			// Replacing a tracked node without releasing it leaves an unreachable
			// held synth. Keep one held node per MIDI note in each instrument part.
			if (part.notes.has(note)) backend.noteOff(handle,note)
			const id = sonic.nextNodeId()
			const patch = presets[handle.program]
			const release = Math.max(...patch.operators.map(operator => operator.envelope.release),0.1)
			const cutoff = Math.min(renderContext.sampleRate*0.45, handle.patch === 'soft' ? 1800 : handle.patch === 'bright' ? 10000 : 4500)
			part.notes.set(note,id)
			send(handle,'/s_new',`photosynth-gm-${handle.program}`,id,0,part.group,'freq',440*2**((note-69+part.bend)/12),
				'amp',Math.min(1,velocity)*programAmp(handle),'out',part.slot*2,'cutoff',cutoff,'attack',0.001,'release',release)
		},
		noteOff(handle,note){ const part = parts.get(handle), id = part?.notes.get(note); if (id !== undefined) { send(handle,'/n_set',id,'gate',0); part.notes.delete(note) } },
		panic(handle){
			const part = parts.get(handle)
			if (!part) return
			sonic.send('/n_free',part.group)
			part.group = sonic.nextNodeId()
			sonic.send('/g_new',part.group,0,0)
			part.notes.clear()
		},
		bend(handle,value){ const part = parts.get(handle); if (!part) return; part.bend = value*pitchBendRange; for (const [note,id] of part.notes) send(handle,'/n_set',id,'freq',440*2**((note-69+part.bend)/12)) },
		pressure(handle,note,value){
			const notes=parts.get(handle)?.notes
			const ids=Number.isInteger(note)?[notes?.get(note)]:[...(notes?.values()??[])]
			for(const id of ids) if(id!==undefined) send(handle,'/n_set',id,'amp',Math.max(0,Math.min(1,value))*programAmp(handle))
		},
		async destroy(){ for (const handle of [...parts.keys()]) await backend.detach(handle); splitter.disconnect(); await sonic.destroy(); if (renderContext.state !== 'closed') await renderContext.close() }
	}
	return backend
}
