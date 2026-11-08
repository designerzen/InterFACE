import { normaliseVoiceEngine, VOICE_ENGINE_OPTIONS } from './voice-engine-options.js'
import { normaliseEngineSettings, readEngineSettings, SHARED_ENGINE_SETTINGS } from './voice-engine-settings.js'

/** Session-owned renderer. Instruments own handles, never engine lifetime. */
export default class VoiceEngineHost {
	constructor(context, {engine='native', createBackend, settings}={}){
		this.context = context
		this.engine = normaliseVoiceEngine(engine)
		this.createBackend = createBackend
		this.handles = new Set()
		this.backend = null
		this.ready = Promise.resolve()
		this.change = Promise.resolve()
		this.switching = false
		this.pending = new Set()
		this.settings = readEngineSettings(settings)
	}
	/** Browsers may start contexts suspended, and a backend can own its own. */
	resume(){
		if (this.context.state === 'suspended') this.context.resume()?.catch?.(() => {})
		this.backend?.resume?.()
	}
	setSettings(changes){
		const previous = this.settingChange ?? Promise.resolve()
		const task = this.run(async backend => {
			await previous
			const engine = this.engine
			const next = normaliseEngineSettings(engine,{...this.settings[engine],...changes})
			try { await backend.configure?.(next) } catch(error) { await backend.configure?.(this.settings[engine]); throw error }
			this.settings[engine] = next
			// The shared room follows the session across engine switches
			const shared = Object.fromEntries(Object.entries(changes).filter(([key]) => SHARED_ENGINE_SETTINGS.includes(key)))
			if (Object.keys(shared).length) for (const other of Object.keys(this.settings)) {
				if (other !== engine) this.settings[other] = normaliseEngineSettings(other,{...this.settings[other],...shared})
			}
			return next
		})
		this.settingChange = task.catch(() => {})
		return task
	}
	run(operation){
		const task = this.ready.then(() => operation(this.backend))
		this.pending.add(task)
		task.then(() => this.pending.delete(task), () => this.pending.delete(task))
		return task
	}
	async ensure(){
		if (!this.starting) this.starting = this.createBackend(this.engine).then(async backend => {
			try { await backend.configure?.(this.settings[this.engine]) } catch(error) { await backend.destroy(); throw error }
			this.backend = backend
			return backend
		}).catch(error => { this.starting = null; throw error })
		return this.starting
	}
	async add(handle){
		await this.ready
		const backend = await this.ensure()
		this.handles.add(handle)
		try { await backend.attach(handle) } catch(error) { this.handles.delete(handle); await backend.detach?.(handle); throw error }
		await backend.settle?.()
	}
	async remove(handle){
		await this.ready.catch(() => {})
		if (this.handles.delete(handle)) await this.backend?.detach(handle)
	}
	async select(engine){
		if (!VOICE_ENGINE_OPTIONS.some(([id]) => id === engine)) throw new RangeError(`Unknown voice engine: ${engine}`)
		const pending = [...this.pending]
		const operation = this.change.then(async () => {
			await Promise.allSettled(pending)
			if (engine === this.engine) return this.engine
			const previous = this.engine
			this.switching = true
			const handles = [...this.handles]
			try {
				// Fade the old renderer before stopping voices. Handles retain their
				// user volume so a replacement or rollback can restore it exactly.
				const time = this.context.currentTime
				if (Number.isFinite(time)) {
					for (const handle of handles) {
						const gain = handle.output?.gain
						gain?.cancelScheduledValues(time)
						gain?.setValueAtTime(gain.value,time)
						gain?.linearRampToValueAtTime(0,time+0.025)
					}
					await this.backend?.fadeOut?.()
					await new Promise(resolve => setTimeout(resolve,30))
				}
				for (const handle of handles) {
					handle.rememberPatch(previous)
					await handle.allSoundOff()
				}
				await this.backend?.destroy()
				this.backend = null
				this.starting = null
				this.engine = engine
				try {
					const backend = await this.ensure()
					for (const handle of handles) { handle.restorePatch(engine); await backend.attach(handle) }
					await backend.settle?.()
				}catch(error){
					await this.backend?.destroy()
					this.backend = null
					this.starting = null
					this.engine = previous
					try {
						const backend = await this.ensure()
						for (const handle of handles) { handle.restorePatch(previous); await backend.attach(handle) }
					}catch(rollbackError){
						throw new AggregateError([error, rollbackError], 'The selected engine and recovery both failed. Restart audio to retry.')
					}
					throw error
				}
				return this.engine
			}finally{
				const time = this.context.currentTime
				if (Number.isFinite(time)) for (const handle of handles) {
					const gain = handle.output?.gain
					gain?.cancelScheduledValues(time)
					gain?.setValueAtTime(0,time)
					gain?.linearRampToValueAtTime(handle.volume,time+0.025)
				}
				this.switching = false
			}
		})
		this.change = operation.catch(() => {})
		this.ready = this.change
		return operation
	}
	async destroy(){
		await this.change
		await this.backend?.destroy()
		this.backend = null
		this.starting = null
		this.handles.clear()
	}
}
