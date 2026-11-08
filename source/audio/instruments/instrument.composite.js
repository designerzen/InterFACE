import Instrument from "./instrument.js"
import { getGeneralMIDIRepetitionRate } from "../general-midi-instruments.data.js"
import {
	GENERAL_MIDI_INSTRUMENT_LIST,
	GENERAL_MIDI_INSTRUMENTS,
	GENERAL_MIDI_INSTRUMENTS_FRIENDLY,
	SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS
} from "../midi/general-midi.constants.js"
import { INSTRUMENT_TYPE_SOUNDFONT } from "../instrument-list.js"
import { getGeneralMIDISynthPreset } from "./presets/presets-general-midi-synth.js"

export const INSTRUMENT_TYPE_COMPOSITE = "CompositeInstrument"

const resolveGeneralMIDIPreset = preset => {
	let program = Number.isInteger(preset) ? preset : -1
	if (program < 0 && typeof preset === "string")
	{
		const normalised = preset.toLowerCase()
		program = /^\d+$/.test(normalised) ? Number(normalised) :
			GENERAL_MIDI_INSTRUMENTS.findIndex(name => name.toLowerCase() === normalised)
		if (program < 0)
		{
			program = GENERAL_MIDI_INSTRUMENTS_FRIENDLY.findIndex(name => name.toLowerCase() === normalised)
		}
		if (program < 0)
		{
			program = SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS.indexOf(normalised.replace(/-mp3$/, ""))
		}
	}
	program = program >= 0 && program < GENERAL_MIDI_INSTRUMENTS.length ? program : 0
	return {
		program,
		name:GENERAL_MIDI_INSTRUMENTS[program],
		title:GENERAL_MIDI_INSTRUMENTS_FRIENDLY[program],
		location:SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS[program],
		family:GENERAL_MIDI_INSTRUMENT_LIST[program]?.family
	}
}

export default class CompositeInstrument extends Instrument{
	static get name(){
		return INSTRUMENT_TYPE_COMPOSITE
	}

	name = INSTRUMENT_TYPE_COMPOSITE
	type = "composite"
	activePresetProgram = 0
	instrumentFamily = GENERAL_MIDI_INSTRUMENT_LIST[0]?.family
	changePromise = Promise.resolve()

	get audioNode(){
		return this.outputNode
	}

	get activePreset(){
		return GENERAL_MIDI_INSTRUMENTS[this.activePresetProgram]
	}

	get activePresetIndex(){
		return this.activePresetProgram
	}

	get activeInstrument(){
		return this.instruments?.[0] ?? null
	}

	get backendType(){
		return this.activeInstrument?.constructor?.name ?? null
	}

	getNoteRepeatDuration(note){ return this.activeInstrument?.getNoteRepeatDuration?.(note) }

	get repetitionRate(){
		return getGeneralMIDIRepetitionRate(this.activePresetProgram, this.activeInstrument?.type === "sample")
	}

	get playbackMode(){
		return this.activeInstrument?.playbackMode ?? super.playbackMode
	}

	get reverbSettings(){
		return this.activeInstrument?.reverbSettings ?? super.reverbSettings
	}

	get lpfSettings(){
		return this.activeInstrument?.lpfSettings ?? super.lpfSettings
	}

	get compressorSettings(){
		return this.activeInstrument?.compressorSettings ?? super.compressorSettings
	}

	get volume(){
		return this.outputNode?.gain?.value ?? this.currentVolume
	}

	set volume(value){
		this.currentVolume = value
		if (this.outputNode)
		{
			this.outputNode.gain.value = value
		}
	}

	async create(){
		this.instruments = []
		this.registeredInstruments = new Map()
		this.outputNode = this.context.createGain()
		this.outputNode.gain.value = this.currentVolume
		return true
	}

	async destroyInstrument(instrument){
		if (!instrument)
		{
			return false
		}
		await instrument.allNotesOff?.()
		instrument.output?.disconnect()
		await instrument.destroy?.()
		return true
	}

	async destroy(){
		const instruments = [...new Set(this.registeredInstruments?.values() ?? [])]
		this.instruments = []
		this.registeredInstruments?.clear()
		await Promise.all(instruments.map(instrument => this.destroyInstrument(instrument)))
		this.outputNode?.disconnect()
		return await super.destroy()
	}

	addInstrument(type, instrument){
		if (!type || !instrument?.output)
		{
			throw Error("CompositeInstrument requires a type and an instrument instance with an output")
		}
		this.registeredInstruments.set(type, instrument)
		return instrument
	}

	applySynthOptions(instrument, preset){
		instrument.options = { ...instrument.options, ...preset.options }
		if (preset.options.shape !== undefined)
		{
			if ("shapes" in instrument)
			{
				instrument.shapes = preset.options.shape
			}else if ("shape" in instrument){
				instrument.shape = preset.options.shape
			}
		}
		return instrument
	}

	async applyPreset(preset){
		const descriptor = resolveGeneralMIDIPreset(preset)
		const synthPreset = getGeneralMIDISynthPreset(descriptor.program)
		const backendType = synthPreset?.type ?? INSTRUMENT_TYPE_SOUNDFONT
		const backend = this.registeredInstruments.get(backendType)
		if (!backend)
		{
			throw Error(`CompositeInstrument has no registered ${backendType} instance`)
		}

		if (backendType === INSTRUMENT_TYPE_SOUNDFONT)
		{
			await backend.loadPreset(descriptor.location, this.options.instrumentPack, {}, this.options.progressCallback)
		}else{
			this.applySynthOptions(backend, synthPreset)
			if (backendType.endsWith("SynthesizerInstrument"))
			{
			const presets = await backend.getPresets()
			if (presets.includes(descriptor.name))
			{
				await backend.loadPreset(descriptor.name)
			}
			}
		}

		if (backend !== this.activeInstrument)
		{
			const previousInstrument = this.activeInstrument
			await previousInstrument?.allNotesOff?.()
			previousInstrument?.output?.disconnect()
			backend.output.connect(this.outputNode)
			this.instruments = [backend]
		}

		this.activePresetProgram = descriptor.program
		this.instrumentFamily = descriptor.family
		this.title = descriptor.title
		return this
	}

	programChange(programNumber){
		const change = this.changePromise.then(
			() => this.applyPreset(programNumber),
			() => this.applyPreset(programNumber)
		)
		this.changePromise = change.catch(() => {})
		return change
	}

	async loadPreset(programNumber){
		return this.programChange(programNumber)
	}

	async noteOn(noteNumber, velocity=1){
		if (!this.activeInstrument)
		{
			return false
		}
		const started = await this.activeInstrument.noteOn(noteNumber, velocity)
		await super.noteOn(noteNumber, velocity)
		return started
	}

	async retrigger(noteNumber, velocity=1){
		if (!this.activeInstrument)
		{
			return false
		}
		if (this.activeInstrument.retrigger)
		{
			return this.activeInstrument.retrigger(noteNumber, velocity)
		}
		await this.activeInstrument.noteOff(noteNumber, velocity)
		return this.activeInstrument.noteOn(noteNumber, velocity)
	}

	async noteOff(noteNumber, velocity=0){
		await this.activeInstrument?.noteOff(noteNumber, velocity)
		return super.noteOff(noteNumber, velocity)
	}

	async aftertouch(noteNumber, pressure){
		return this.activeInstrument?.aftertouch(noteNumber, pressure)
	}

	async pitchBend(pitch){
		return this.activeInstrument?.pitchBend(pitch)
	}

	async allNotesOff(){
		await this.activeInstrument?.allNotesOff?.()
		this.activeNotes.clear()
		this.active = false
		return true
	}

	async allSoundOff(){
		return this.allNotesOff()
	}

	async getPresets(){
		return [...GENERAL_MIDI_INSTRUMENTS]
	}

	async getInstruments(){
		return this.instruments ?? []
	}

	async loadRandomPreset(){
		return this.loadPreset(Math.floor(Math.random() * GENERAL_MIDI_INSTRUMENTS.length))
	}

	async loadPreviousPreset(){
		return this.loadPreset((this.activePresetProgram - 1 + GENERAL_MIDI_INSTRUMENTS.length) % GENERAL_MIDI_INSTRUMENTS.length)
	}

	async loadNextPreset(){
		return this.loadPreset((this.activePresetProgram + 1) % GENERAL_MIDI_INSTRUMENTS.length)
	}

	async reloadPreset(){
		return this.loadPreset(this.activePresetProgram)
	}

	clone(){
		return new CompositeInstrument(this.audioContext, this.options)
	}
}

export { resolveGeneralMIDIPreset }
