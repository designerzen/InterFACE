import { getDefaultVoicePatch, getSynthVariants } from './voice-patches.js'
import { FM_FACTORY_PRESETS } from './instruments/presets/dx7.js'
import { createVoiceReverb } from './voice-engines/reverb.js'
import { getGeneralMIDIRepetitionRate } from './general-midi-instruments.data.js'
import { voiceProgramGain } from './voice-engine-levels.js'

export const createVoiceBackend = async (id, context, createNative, destination) => {
	if (id === 'yoshimi' || id === 'wam2') {
		const { createMidiVoiceBackend } = await import('./voice-engines/midi.js')
		return createMidiVoiceBackend(id, context, destination)
	}
	if (id === 'supersonic') {
		const { createSuperSonicBackend } = await import('./voice-engines/supersonic.js')
		return createSuperSonicBackend(context, FM_FACTORY_PRESETS, destination)
	}
	const voices = new Map()
	let settings = {}
	const reverbs = new Map()
	// Native SoundFonts ship at uneven levels; FM trims inside its own renderer.
	const levels = new Map()
	const configureVoice = voice => {
		if (FM) { voice.options.pitchBendRange = settings.pitchBendRange; return }
		// App reverb now wraps every dry Native voice, including synths.
		// Disable the older SoundFont-only convolver to avoid two reverbs.
		for (const instrument of voice.registeredInstruments?.values() ?? []) instrument.setEngineReverb?.({reverbMode:'off'})
	}
	const FM = id === 'fm' ? (await import('./instruments/instrument.fm.js')).default : null
	const backend = {
		repetitionRate(handle){ return FM ? getGeneralMIDIRepetitionRate(handle.program, false) : voices.get(handle)?.repetitionRate },
		getNoteRepeatDuration(handle, note){ return voices.get(handle)?.getNoteRepeatDuration?.(note) },
		async configure(next){
			for (const [handle,reverb] of reverbs) await reverb.configure(next,handle.program)
			settings = next
			for (const voice of voices.values()) configureVoice(voice)
		},
		async attach(handle){
			const options = {...handle.options, defaultPreset:handle.program, managedByVoiceEngine:true}
			const voice = FM ? new FM(context, {...options, fmPresets:FM_FACTORY_PRESETS}) : await createNative(options)
			voices.set(handle, voice)
			await voice.loaded
			if (FM) voice.factoryPresets = voice.presets
			let source = voice.output
			if (!FM) { source = context.createGain(); voice.output.connect(source); levels.set(handle,source) }
			reverbs.set(handle,createVoiceReverb(context,source,handle.output,{wetDestination:destination ?? handle.output,handle:destination ? handle : undefined,engine:id}))
			await backend.program(handle)
		},
		async detach(handle){
			const voice = voices.get(handle)
			if (!voice) return
			voices.delete(handle)
			await voice.allSoundOff?.()
			await voice.allNotesOff?.()
			reverbs.get(handle)?.destroy(); reverbs.delete(handle)
			levels.get(handle)?.disconnect(); levels.delete(handle)
			await voice.destroy()
		},
		patches(program, handle){ return FM ? [...getSynthVariants(program), ...(handle?.options.fmImportedPresets ?? []).map((preset,index) => ({id:`dx7:${index}`,title:`DX7: ${preset.name}`}))] : [getDefaultVoicePatch(program)] },
		async program(handle){
			const voice = voices.get(handle)
			await reverbs.get(handle)?.configure(settings,handle.program)
			if (FM) voice.presets = voice.factoryPresets
			if (FM && handle.patch.startsWith('dx7:')) {
				const index = Number(handle.patch.slice(4))
				const presets = handle.options.fmImportedPresets
				if (!presets?.[index]) throw Error('The imported DX7 patch is unavailable.')
				voice.setDX7Presets(presets)
				await voice.programChange(index)
				return
			}
			await voice.loadPreset(handle.program)
			const level = levels.get(handle)
			if (level) level.gain.value = voiceProgramGain(id,handle.program)
			configureVoice(voice)
			if (FM && handle.patch !== 'gm') {
				const original = voice.presets[handle.program]
				const factor = handle.patch === 'soft' ? 0.7 : 1.2
				voice.presets = voice.presets.slice()
				voice.presets[handle.program] = {...original, gain:(original.gain ?? 1) * (handle.patch === 'soft' ? 0.85 : 0.95),
					operators:original.operators.map((operator, index) => index % 2 ? {...operator,gain:operator.gain*factor} : operator)}
			}
			voice.syncPatch?.()
		},
		sync(handle){ reverbs.get(handle)?.sync() },
		noteOn(handle, note, velocity){ const voice = voices.get(handle); reverbs.get(handle)?.sync(); voice.scheduleAt(handle.currentTime); return voice.noteOn(note, velocity) },
		async retrigger(handle, note, velocity){
			const voice = voices.get(handle)
			if (!voice) return false
			voice.scheduleAt(handle.currentTime)
			if (voice.retrigger) return voice.retrigger(note, velocity)
			await voice.noteOff(note)
			return voice.noteOn(note, velocity)
		},
		noteOff(handle, note){ const voice = voices.get(handle); voice?.scheduleAt(handle.currentTime); return voice?.noteOff(note) },
		panic(handle){ const voice = voices.get(handle); return voice?.allSoundOff?.() ?? voice?.allNotesOff?.() },
		bend(handle, value){ voices.get(handle)?.pitchBend(value) },
		pressure(handle, note, value){ voices.get(handle)?.aftertouch(note, value) },
		async destroy(){ for (const handle of [...voices.keys()]) await backend.detach(handle) }
	}
	return backend
}
