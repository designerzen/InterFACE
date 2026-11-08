import Instrument from './instrument.js'
import { GENERAL_MIDI_INSTRUMENT_DATA, getGeneralMIDIRepetitionRate } from '../general-midi-instruments.data.js'
import { resolveVoiceProgram } from '../voice-patches.js'

export default class EngineInstrument extends Instrument {
	get audioNode(){ return this.gainNode }
	get activePreset(){ return GENERAL_MIDI_INSTRUMENT_DATA[this.program].name }
	get activePresetIndex(){ return this.program }
	get instrumentName(){ return this.activePreset }
	get repetitionRate(){
		return this.host?.backend?.repetitionRate?.(this) ?? getGeneralMIDIRepetitionRate(this.program, false)
	}
	getNoteRepeatDuration(note){ return this.host?.backend?.getNoteRepeatDuration?.(this, note) }
	get playbackMode(){ return GENERAL_MIDI_INSTRUMENT_DATA[this.program].playbackMode }
	get reverbSettings(){ return GENERAL_MIDI_INSTRUMENT_DATA[this.program].reverb }
	get lpfSettings(){ return GENERAL_MIDI_INSTRUMENT_DATA[this.program].lpf }
	get compressorSettings(){ return GENERAL_MIDI_INSTRUMENT_DATA[this.program].compressor }
	get volume(){ return this.currentVolume }
	set volume(value){
		this.currentVolume = value
		if (this.gainNode) this.gainNode.gain.value = value
		this.host?.backend?.sync?.(this)
	}
	async create(){
		this.name = 'EngineInstrument'
		this.type = 'engine'
		this.host = this.options.voiceEngineHost
		this.program = resolveVoiceProgram(this.options.defaultPreset ?? 0)
		this.patch = 'gm'
		this.patchMemory = new Map()
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = this.currentVolume
		this.title = GENERAL_MIDI_INSTRUMENT_DATA[this.program].title
		this.changePromise = Promise.resolve()
		await this.host.add(this)
		return true
	}
	rememberPatch(engine){ this.patchMemory.set(`${engine}:${this.program}`, this.patch) }
	restorePatch(engine){ this.patch = this.patchMemory.get(`${engine}:${this.program}`) ?? 'gm' }
	async getPresets(){ return GENERAL_MIDI_INSTRUMENT_DATA.map(instrument => instrument.name) }
	async getPatches(){ await this.host.ready; return this.host.backend.patches(this.program, this) }
	programChange(value){
		const operation = this.changePromise.then(() => this.host.run(async backend => {
			const program = resolveVoiceProgram(value)
			this.rememberPatch(this.host.engine)
			await this.allSoundOff()
			const oldProgram = this.program, oldPatch = this.patch
			this.program = program
			this.restorePatch(this.host.engine)
			try { await backend.program(this) } catch(error) { this.program = oldProgram; this.patch = oldPatch; throw error }
			this.title = GENERAL_MIDI_INSTRUMENT_DATA[program].title
			return this
		}))
		this.changePromise = operation.catch(() => {})
		return operation
	}
	loadPreset(value){ return this.programChange(value) }
	loadPatch(id){
		const operation = this.changePromise.then(() => this.host.run(async backend => {
			const patches = await backend.patches(this.program, this)
			if (!patches.some(patch => patch.id === id)) throw new RangeError('Unknown patch')
			await this.allSoundOff()
			const previous = this.patch
			this.patch = id
			try { await backend.program(this) } catch(error) { this.patch = previous; throw error }
			this.rememberPatch(this.host.engine)
			return this
		}))
		this.changePromise = operation.catch(() => {})
		return operation
	}
	async noteOn(note, velocity=1){
		if (!Number.isInteger(note) || note < 0 || note > 127 || !Number.isFinite(velocity)) return false
		if (this.host.switching || !this.available) return false
		if (velocity <= 0) return this.noteOff(note)
		if (this.activeNotes.has(note)) return false
		// Only samples resume the context themselves; every voice needs a running one.
		this.host.resume?.()
		super.noteOn(note, velocity)
		await this.host.backend.noteOn(this, note, Math.min(1, velocity))
		return true
	}
	async noteOff(note){
		const released = this.host.switching ? undefined : this.host.backend?.noteOff(this, note)
		// Free the note before yielding: callers replay a held chord without
		// awaiting this, and the replayed note must not look already active.
		const stopped = super.noteOff(note)
		await released
		return stopped
	}
	async retrigger(note, velocity=1){
		if (!Number.isInteger(note) || note < 0 || note > 127 || !Number.isFinite(velocity)) return false
		if (this.host.switching || !this.available) return false
		if (velocity <= 0) return this.noteOff(note)
		if (!this.activeNotes.has(note)) return this.noteOn(note, velocity)
		if (this.host.backend.retrigger) return this.host.backend.retrigger(this, note, Math.min(1, velocity))
		await this.noteOff(note)
		return this.noteOn(note, velocity)
	}
	async allSoundOff(){
		await this.host?.backend?.panic(this)
		this.activeNotes.clear()
		this.active = false
	}
	allNotesOff(){ return super.allNotesOff() }
	pitchBend(value){ if (!this.host.switching) this.host.backend?.bend?.(this, value) }
	aftertouch(note, pressure){ if (!this.host.switching) this.host.backend?.pressure?.(this, note, pressure) }
	loadNextPreset(){ return this.programChange((this.program + 1) % 128) }
	loadPreviousPreset(){ return this.programChange((this.program + 127) % 128) }
	loadRandomPreset(){ return this.programChange(Math.floor(Math.random()*128)) }
	reloadPreset(){ return this.programChange(this.program) }
	clone(){ return new EngineInstrument(this.context, {...this.options, defaultPreset:this.program}) }
	async destroy(){ await this.host.remove(this); this.gainNode.disconnect(); return super.destroy() }
}
