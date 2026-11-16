/*

Audiobus outputs played through InterFACE's Instrument API

const piano = new AudiobusRomplerInstrument(audioContext)
await piano.loaded
piano.noteOn(60, 0.8)

*/

import Instrument from './instrument.js'
import { getGeneralMIDIRepetitionRate } from '../general-midi-instruments.data.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../midi/general-midi.constants.js'
import { INSTRUMENT_TYPE_AUDIOBUS_FM, INSTRUMENT_TYPE_AUDIOBUS_ROMPLER } from '../instrument-list.js'
import { FMOutput, RomplerOutput, ROMPLER_BASE_URL } from '../audiobus.js'
import { NOTE_ON, NOTE_OFF, PITCH_BEND } from 'audiobus/commands/commands.ts'
import { musicalCommand } from 'audiobus/io/event-clip.ts'
import { parseDX7Presets } from 'audiobus/instruments/fm/dx7.ts'

const PITCH_CENTRE = 8192

/**
 * Wraps one audiobus output, sending it MIDI-style commands on channel 1.
 * Velocity and pitch bend are converted from InterFACE's 0 to 1 and -1 to 1 ranges,
 * and scheduleAt times travel with each command so the output plays them on time.
 * General MIDI banks use InterFACE's program names so saved presets keep matching.
 */
export class AudiobusInstrument extends Instrument {
	polyphony = 16
	presetIndex = 0

	get audioNode(){ return this.gainNode }
	get presetNames(){ return [] }
	get activePreset(){ return this.presetNames[this.presetIndex] }
	get activePresetIndex(){ return this.presetIndex }
	get volume(){ return this.currentVolume }
	set volume(value){
		if (!Number.isFinite(value)) return
		super.volume = Math.max(0, Math.min(1, value))
		if (this.gainNode) this.gainNode.gain.setValueAtTime(this.currentVolume, this.currentTime)
	}

	/** Subclasses build their output and choose its preset */
	createOutput(options){ throw Error('Audiobus instruments must create an output') }
	selectPreset(index){}

	async create(){
		await super.create()
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = this.currentVolume
		// The output's own level stays at unity so volume is set in one place
		this.bus = this.createOutput({ audioContext:this.context, mixer:this.gainNode, volume:1, pitchBendRange:this.options.pitchBendRange ?? 2 })
		try {
			await this.bus.connect()
			await this.programChange(this.options.defaultPreset ?? 0)
		} catch (error) {
			await this.destroy()
			throw error
		}
		return true
	}

	send(type, fields){
		return this.bus?.sendCommand(musicalCommand({ type, channel:1, audioTime:this.currentTime, ...fields }))
	}
	async noteOn(note, velocity=1){
		if (!Number.isInteger(note) || note < 0 || note > 127 || !Number.isFinite(velocity)) return false
		if (velocity <= 0) return this.noteOff(note)
		if (this.activeNotes.has(note)) return false
		super.noteOn(note, velocity)
		// A MIDI velocity of 0 means release, so the quietest note is 1
		await this.send(NOTE_ON, { number:note, velocity:Math.max(1, Math.round(Math.min(1, velocity)*127)) })
		return true
	}
	async noteOff(note){
		await this.send(NOTE_OFF, { number:note, velocity:0 })
		await super.noteOff(note)
		this.active = this.activeNotes.size > 0
		return true
	}
	pitchBend(value){
		if (!Number.isFinite(value)) return
		const bend = Math.max(-1, Math.min(1, value))
		return this.send(PITCH_BEND, { value:Math.round(PITCH_CENTRE + bend*(PITCH_CENTRE-1)) })
	}
	async allSoundOff(){
		this.bus?.allNotesOff()
		this.activeNotes.clear()
		this.active = false
	}
	async programChange(value){
		const names = this.presetNames
		const namedIndex = typeof value === 'string' ? names.findIndex(name => name.toLowerCase() === value.toLowerCase()) : -1
		const index = namedIndex >= 0 ? namedIndex : typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : -1
		if (!Number.isInteger(index) || !names[index]) return false
		this.presetIndex = index
		this.title = this.activePreset
		this.selectPreset(index)
		return this
	}
	async getPresets(){ return this.presetNames }
	async loadNextPreset(){ return this.programChange((this.presetIndex+1)%this.presetNames.length) }
	async loadPreviousPreset(){ return this.programChange((this.presetIndex+this.presetNames.length-1)%this.presetNames.length) }
	async loadRandomPreset(){ return this.programChange(Math.floor(Math.random()*this.presetNames.length)) }
	clone(){ return new this.constructor(this.context, { ...this.options, defaultPreset:this.presetIndex }) }
	async destroy(){
		if (this.bus) {
			await this.allSoundOff()
			this.bus.destroy()
			this.bus = null
		}
		this.gainNode?.disconnect()
		return super.destroy()
	}
}

/** Audiobus's DX7-style FM engine, with its General MIDI bank or voices from a DX7 file */
export class AudiobusFMInstrument extends AudiobusInstrument {
	static get name(){ return INSTRUMENT_TYPE_AUDIOBUS_FM }
	name = INSTRUMENT_TYPE_AUDIOBUS_FM
	type = 'audiobus-fm'
	isGeneralMIDIBank = true

	get presetNames(){ return this.isGeneralMIDIBank ? GENERAL_MIDI_INSTRUMENTS : this.bus?.presets.map(preset => preset.name) ?? [] }
	get repetitionRate(){ return this.isGeneralMIDIBank ? getGeneralMIDIRepetitionRate(this.presetIndex, false) : super.repetitionRate }

	createOutput(options){ return new FMOutput(options) }
	selectPreset(index){ this.bus.loadPreset(index) }

	async create(){
		await super.create()
		if (this.options.dx7File) await this.loadDX7File(this.options.dx7File)
		return true
	}
	async loadDX7File(file){
		if (file?.size > 1024*1024) throw Error('DX7 files must be smaller than 1 MB.')
		const bytes = typeof file?.arrayBuffer === 'function' ? await file.arrayBuffer() : file
		const presets = parseDX7Presets(bytes)
		await this.allSoundOff()
		this.bus.setPresets(presets)
		this.isGeneralMIDIBank = false
		this.options = { ...this.options, dx7File:undefined, defaultPreset:0 }
		await this.programChange(0)
		return this.getPresets()
	}
}

/** Audiobus's General MIDI soundfont player, streaming InterFACE's OpenGM24 samples as notes need them */
export class AudiobusRomplerInstrument extends AudiobusInstrument {
	static get name(){ return INSTRUMENT_TYPE_AUDIOBUS_ROMPLER }
	name = INSTRUMENT_TYPE_AUDIOBUS_ROMPLER
	type = 'audiobus-rompler'

	get presetNames(){ return GENERAL_MIDI_INSTRUMENTS }
	get repetitionRate(){ return getGeneralMIDIRepetitionRate(this.presetIndex, true) }
	get isLoading(){ return super.isLoading || !!this.bus?.loading }

	createOutput(options){ return new RomplerOutput({ ...options, baseUrl:this.options.baseUrl ?? ROMPLER_BASE_URL }) }
	selectPreset(index){ this.bus.setPreset(index) }
}
