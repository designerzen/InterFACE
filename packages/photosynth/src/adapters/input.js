import { Photosynth } from '../runtime.js'
import { expandMusicEvent } from '../performance.js'
import { PHOTOSYNTH_CONFIGURATION, PHOTOSYNTH_STATE } from '../events.js'

/** Translate SDK units to the command fields used by HarmonEASY's audiobus inputs. */
export const toInputCommandFields = (event, inputId) => {
	const time = event.time / 1000
	const bend = Math.round(8192 + Math.max(-1, Math.min(1, event.value ?? 0)) * ((event.value ?? 0) < 0 ? 8192 : 8191))
	return {
		type: event.type === 'retrigger' ? 'noteOn' : event.type,
		number: event.note ?? event.controller ?? 0,
		channel: event.channel,
		velocity: Math.round(Math.max(0, Math.min(1, event.velocity ?? 0)) * 127),
		value: event.type === 'pitchBend' ? bend : Math.round(Math.max(0, Math.min(1, event.value ?? 0)) * 127),
		pitchBend: event.type === 'pitchBend' ? bend : 0,
		startAt: time, time,
		from: event.source, inputId,
		text: `PhotoSYNTH performer ${event.performer + 1}`
	}
}

/**
 * Inject AbstractInput and musicalCommand from the host. Neither becomes an SDK dependency.
 * The returned class implements HarmonEASY's connect/disconnect/createGui lifecycle.
 */
export const createPhotosynthInputClass = ({ AbstractInput, musicalCommand }) => class InputPhotosynth extends AbstractInput {
	requiresConnectionControl = true
	constructor(options = {}) {
		super({ now: () => performance.now() / 1000, ...options })
		this.runtime = options.runtime ?? new Photosynth({ now: () => this.now * 1000, ...options.photosynth })
		this.ownsRuntime = !options.runtime
		this.held = new Map()
		this.controls = new Map()
		this.guiGeneration = 0
		this.unlisten = this.runtime.onMusic(event => this.receive(event))
		this.onState = event => {
			if (event.detail === 'running') this.setAsConnected()
			else if (event.detail !== 'loading') { this.release(); this.setAsDisconnected() }
		}
		this.onConfiguration = () => {
			this.options.configuration = this.runtime.exportConfiguration()
			this.dispatchEvent(new Event('configurationChanged'))
		}
		this.runtime.addEventListener(PHOTOSYNTH_STATE, this.onState)
		this.runtime.addEventListener(PHOTOSYNTH_CONFIGURATION, this.onConfiguration)
		if (options.configuration) this.runtime.restoreConfiguration(options.configuration)
		if (this.runtime.state === 'running') this.setAsConnected()
	}
	get name() { return 'PhotoSYNTH' }
	get description() { return 'Camera, face and hand motion as musical input' }
	hasMidiInput() { return true }
	startClock() { this.clockPlaying = true }
	updateTime(now) {
		if (!this.runtime.options.externalClock || !this.clockPlaying || !this.isConnected || !Number.isFinite(now)) return
		const bpm = this.options.getBpm?.()
		if (Number.isFinite(bpm) && bpm > 0) this.runtime.options.bpm = bpm
		this.runtime.tick(now * 1000)
	}
	stopClock() { this.clockPlaying = false; this.runtime.release() }
	send(event) { this.dispatch(musicalCommand(toInputCommandFields(event, this.uuid)), { performer: event.performer, source: event.source }) }
	receive(event) {
		if (event.type === 'instrumentRequest' || event.type === 'parameterChange') {
			this.dispatchEvent(new CustomEvent(event.type, { detail: event }))
			return
		}
		if (event.type === 'allNotesOff') { this.release(event.source, false, event.time); return }
		for (const value of expandMusicEvent(event)) {
			const key = `${value.source}:${value.channel}:${value.note}`
			if (value.type === 'noteOff') {
				if (!this.held.delete(key)) continue
			} else if (value.type === 'noteOn' || value.type === 'retrigger') {
				if (this.held.has(key)) this.send({ ...this.held.get(key), type: 'noteOff', time: value.time, velocity: 0 })
				this.held.set(key, value)
			} else if (['pitchBend', 'controlChange'].includes(value.type)) {
				this.controls.set(`${value.source}:${value.channel}:${value.type}:${value.controller ?? ''}`, value)
			} else continue
			this.send(value)
		}
	}
	release(source, resetControls = true, time = this.runtime.now()) {
		for (const [key, event] of this.held) {
			if (source && event.source !== source) continue
			this.send({ ...event, type: 'noteOff', velocity: 0, time })
			this.held.delete(key)
		}
		if (!resetControls) return
		for (const [key, event] of this.controls) {
			if (source && event.source !== source) continue
			const value = event.type === 'controlChange' && event.controller === 10 ? 0.5 : 0
			this.send({ ...event, value, time })
			this.controls.delete(key)
		}
	}
	async connect() {
		if (this.destroyed) throw new Error('PhotoSYNTH input was destroyed')
		await this.runtime.start(this.options.camera)
		if (this.runtime.state === 'running') this.setAsConnected()
	}
	async disconnect() { this.runtime.stop(); this.release(); this.setAsDisconnected() }
	createGui() {
		if (this.gui) return Promise.resolve(this.gui)
		if (this.pendingGui) return this.pendingGui
		const pending = this.buildGui(this.guiGeneration).finally(() => { if (this.pendingGui === pending) this.pendingGui = undefined })
		this.pendingGui = pending
		return pending
	}
	async buildGui(generation) {
		const { definePhotosynthElement } = await import('../element.js')
		if (this.destroyed || generation !== this.guiGeneration) throw new DOMException('PhotoSYNTH GUI was closed', 'AbortError')
		definePhotosynthElement()
		this.gui = document.createElement('photosynth-input')
		this.gui.runtime = this.runtime
		return this.gui
	}
	async destroyGui() { ++this.guiGeneration; this.pendingGui = undefined; this.gui?.remove(); this.gui = undefined }
	destroy() {
		if (this.destroyed) return
		this.destroyed = true
		this.runtime.stop()
		this.release()
		this.unlisten()
		this.runtime.removeEventListener(PHOTOSYNTH_STATE, this.onState)
		this.runtime.removeEventListener(PHOTOSYNTH_CONFIGURATION, this.onConfiguration)
		if (this.ownsRuntime) this.runtime.dispose()
		void this.destroyGui()
		this.setAsDisconnected()
	}
}
