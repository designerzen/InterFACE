import Instrument from './instrument.js'
import { getGeneralMIDIRepetitionRate } from '../general-midi-instruments.data.js'
import { INSTRUMENT_TYPE_FM } from '../instrument-list.js'
import { FM_FACTORY_PRESETS, parseDX7Presets } from './presets/dx7.js'

const registrations = new WeakMap()
const renderers = new WeakMap()
const PARTS = 16
const register = context => {
	if (!registrations.has(context)) {
		const pending = context.audioWorklet.addModule(new URL('./worklets/fm.worklet.js', import.meta.url))
		registrations.set(context, pending)
		pending.catch(() => registrations.delete(context))
	}
	return registrations.get(context)
}

export default class FMInstrument extends Instrument {
	static get name(){ return INSTRUMENT_TYPE_FM }
	name = INSTRUMENT_TYPE_FM
	type = 'fm'
	polyphony = 16
	presetIndex = 0

	get audioNode(){ return this.gainNode }
	get activePreset(){ return this.presets[this.presetIndex].name }
	get activePresetIndex(){ return this.presetIndex }
	get isGeneralMIDIBank(){ return this.presets === FM_FACTORY_PRESETS }
	get repetitionRate(){ return this.isGeneralMIDIBank ? getGeneralMIDIRepetitionRate(this.presetIndex, false) : super.repetitionRate }
	get volume(){ return this.currentVolume }
	set volume(value){
		if (!Number.isFinite(value)) return
		super.volume = Math.max(0, Math.min(1, value))
		if (this.gainNode) this.gainNode.gain.setValueAtTime(this.currentVolume, this.currentTime)
	}

	async create(){
		await super.create()
		if (!this.context.audioWorklet) throw Error('FM synthesis requires AudioWorklet support and a secure connection.')
		this.presets = this.options.fmPresets ?? FM_FACTORY_PRESETS
		this.presetIndex = 0
		this.title = this.activePreset
		await register(this.context)
		let renderer = renderers.get(this.context)
		if (!renderer) {
			renderer = { node:new AudioWorkletNode(this.context, 'photosynth-fm', { numberOfInputs:0, numberOfOutputs:PARTS, outputChannelCount:Array(PARTS).fill(1) }), parts:new Set() }
			renderers.set(this.context, renderer)
		}
		this.part = Array.from({length:PARTS}, (_, index) => index).find(index => !renderer.parts.has(index))
		if (this.part === undefined) throw Error('The shared FM engine has no free instrument parts.')
		renderer.parts.add(this.part)
		this.renderer = renderer
		this.processor = renderer.node
		this.sentPatch = null
		try {
			this.gainNode = this.context.createGain()
			this.gainNode.gain.value = this.currentVolume
			this.processor.connect(this.gainNode, this.part, 0)
			this.connected = true
			if (this.options.dx7File) await this.loadDX7File(this.options.dx7File)
			await this.programChange(this.options.defaultPreset ?? 0)
		} catch (error) {
			await this.destroy()
			throw error
		}
		return true
	}

	post(type, data={}){ this.processor?.port.postMessage({ type, part:this.part, time:this.currentTime, ...data }) }
	syncPatch(){
		const patch = this.presets[this.presetIndex]
		if (this.processor && patch !== this.sentPatch) {
			this.post('patch', {patch})
			this.sentPatch = patch
		}
	}
	async noteOn(note, velocity=1){
		if (!Number.isInteger(note) || note < 0 || note > 127 || !Number.isFinite(velocity)) return false
		if (velocity <= 0) return this.noteOff(note)
		if (this.activeNotes.has(note)) return false
		super.noteOn(note, velocity)
		if (this.activeNotes.size > this.polyphony) this.activeNotes.delete(this.activeNotes.keys().next().value)
		this.syncPatch()
		this.post('on', { note, velocity:Math.min(1, velocity) })
		return true
	}
	async noteOff(note){
		this.post('off', { note })
		await super.noteOff(note)
		this.active = this.activeNotes.size > 0
		return true
	}
	pitchBend(value){
		if (Number.isFinite(value)) this.post('bend', { value:Math.max(-1, Math.min(1, value))*(this.options.pitchBendRange ?? 2) })
	}
	async allSoundOff(){
		this.post('panic')
		this.activeNotes.clear()
		this.active = false
	}
	async programChange(value){
		const namedIndex = typeof value === 'string' ? this.presets.findIndex(preset => preset.name === value) : -1
		const index = namedIndex >= 0 ? namedIndex : typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : -1
		if (!Number.isInteger(index) || !this.presets[index]) return false
		this.presetIndex = index
		this.title = this.activePreset
		this.syncPatch()
		return this
	}
	async getPresets(){ return this.presets.map(preset => preset.name) }
	async loadNextPreset(){ return this.programChange((this.presetIndex+1)%this.presets.length) }
	async loadPreviousPreset(){ return this.programChange((this.presetIndex+this.presets.length-1)%this.presets.length) }
	async loadRandomPreset(){ return this.programChange(Math.floor(Math.random()*this.presets.length)) }
	setDX7Presets(presets){
		this.presets = presets
		this.options = { ...this.options, fmPresets:presets, dx7File:undefined }
		this.presetIndex = 0
		this.title = this.activePreset
		this.syncPatch()
	}
	async loadDX7File(file){
		if (file?.size > 1024*1024) throw Error('DX7 files must be smaller than 1 MB.')
		const bytes = typeof file?.arrayBuffer === 'function' ? await file.arrayBuffer() : file
		const presets = parseDX7Presets(bytes)
		await this.allSoundOff()
		this.setDX7Presets(presets)
		return this.getPresets()
	}
	clone(){ return new FMInstrument(this.context, { ...this.options, fmPresets:this.presets, defaultPreset:this.presetIndex }) }
	async destroy(){
		if (this.destroyed || !this.renderer?.parts.has(this.part)) return super.destroy()
		this.destroyed = true
		await this.allSoundOff()
		this.post('releasePart')
		if (this.connected) this.processor?.disconnect(this.gainNode, this.part, 0)
		this.renderer.parts.delete(this.part)
		if (this.renderer.parts.size === 0) {
			this.processor.port.postMessage({type:'destroy'})
			this.processor.disconnect()
			this.processor.port.close()
			renderers.delete(this.context)
		}
		this.gainNode?.disconnect()
		return super.destroy()
	}
}
