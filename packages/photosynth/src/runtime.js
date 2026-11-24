import { Performer } from './performer.js'
import { PredictionMatcher } from './matcher.js'
import { CameraSession } from './camera.js'
import { MediaPipeTracker } from './tracking.js'
import { EventSequencer } from './sequencer.js'
import { emit, subscribe, PHOTOSYNTH_MUSIC, PHOTOSYNTH_FRAME, PHOTOSYNTH_STATE, PHOTOSYNTH_ERROR, PHOTOSYNTH_CONFIGURATION } from './events.js'

export class Photosynth extends EventTarget {
	state = 'idle'
	performers = []
	generation = 0
	constructor(options = {}) {
		super()
		this.options = { maxPerformers: 4, framesPerSecond: 20, trackingTimeoutMs: 400, bpm: 120, pauseWhenHidden: true, ...options }
		for (const key of ['maxPerformers', 'framesPerSecond', 'trackingTimeoutMs', 'bpm']) {
			if (!Number.isFinite(this.options[key]) || this.options[key] <= 0) throw new RangeError(`${key} must be positive`)
		}
		if (!Number.isInteger(this.options.maxPerformers) || this.options.maxPerformers > 16) throw new RangeError('maxPerformers must be 1–16')
		this.now = options.now ?? (() => performance.now())
		this.requestFrame = options.requestFrame ?? (callback => requestAnimationFrame(callback))
		this.cancelFrame = options.cancelFrame ?? (id => cancelAnimationFrame(id))
		this.camera = options.camera ?? new CameraSession(options)
		this.visibilityDocument = options.visibilityDocument ?? globalThis.document
		this.matcher = new PredictionMatcher()
		this.sequencer = new EventSequencer()
		for (let index = 0; index < this.options.maxPerformers; index++) {
			this.performers.push(new Performer(index, { mode: options.mode ?? 'face', ...options.performer, ...options.performers?.[index] }))
		}
	}
	onMusic(listener) { return subscribe(this, PHOTOSYNTH_MUSIC, listener) }
	onFrame(listener) { return subscribe(this, PHOTOSYNTH_FRAME, listener) }
	setState(state) { this.state = state; emit(this, PHOTOSYNTH_STATE, state) }
	dispatchMusic(events) { for (const event of events) emit(this, PHOTOSYNTH_MUSIC, event) }
	/** Can be used without a camera or DOM, including recorded tracking input. */
	process(predictions, time = this.now(), { repeat = false } = {}) {
		if (this.state === 'disposed') throw new Error('Photosynth is disposed')
		if (!Array.isArray(predictions) || !Number.isFinite(time)) throw new TypeError('Expected predictions and monotonic milliseconds')
		const matches = this.matcher.matchPredictionsToPeople(predictions, this.performers)
		const present = new Set()
		const events = []
		for (const { prediction, person } of matches) {
			present.add(person)
			person.boundingBox = prediction.box
			person.dead = false
			events.push(...this.sequencer.accept(person.update(prediction, time, { repeat, bpm: this.options.bpm }), person, this.options.bpm))
		}
		for (const person of this.performers) {
			if (!present.has(person)) {
				events.push(...this.sequencer.release(person.id, time))
				events.push(...person.reset(time))
				person.dead = true
			}
		}
		if (!this.options.externalClock) events.push(...this.sequencer.tick(time, this.options.bpm))
		this.dispatchMusic(events)
		emit(this, PHOTOSYNTH_FRAME, { time, predictions, performers: this.performers.map(person => ({
			id: person.id, index: person.playerNumber, tracked: present.has(person), prediction: person.data,
			note: person.noteNumber, velocity: person.noteVelocity, emoji: person.playingEmoticon,
			mouthCurvePosition: person.mouthCurvePosition
		})) })
		return events
	}
	configure(index, options) {
		const person = this.performers[index]
		if (!person) throw new RangeError('Unknown performer')
		// Validate before releasing notes or changing the live configuration.
		const candidate = new Performer(index, { ...person.options, ...options })
		this.dispatchMusic([...this.sequencer.release(person.id, this.now()), ...person.reset(this.now())])
		person.configure(candidate.options)
		emit(this, PHOTOSYNTH_CONFIGURATION, this.exportConfiguration())
	}
	exportConfiguration() { return { version: 1, performers: this.performers.map(person => ({ ...person.options })) } }
	restoreConfiguration(config) {
		if (config?.version !== 1 || !Array.isArray(config.performers) || config.performers.length !== this.performers.length) throw new Error('Unsupported PhotoSYNTH configuration')
		const candidates = config.performers.map((options, index) => new Performer(index, options))
		candidates.forEach((person, index) => this.configure(index, person.options))
	}
	calibrate(index = 0) {
		const person = this.performers[index]
		if (!person?.data) return false
		person.motion.calibrate()
		// Centre the octave range on the user's comfortable head pose.
		this.configure(index, { headVerticalOffsetDegrees: Math.max(-30, Math.min(30, (person.data.pitch ?? 0) * 45)) })
		return true
	}
	start(options = {}) {
		if (this.state === 'disposed') return Promise.reject(new Error('Photosynth is disposed'))
		if (this.pending) return this.pending
		if (this.state === 'running') return Promise.resolve()
		const generation = ++this.generation
		this.setState('loading')
		const pending = this.open(options, generation).finally(() => { if (this.pending === pending) this.pending = undefined })
		this.pending = pending
		return pending
	}
	async open(options, generation) {
		try {
			const tracker = this.options.createTracker?.() ?? new MediaPipeTracker(this.options)
			this.tracker = tracker
			this.video = await this.camera.open({ ...options, onEnded: () => this.stop() })
			if (generation !== this.generation) return
			await tracker.load()
			if (generation !== this.generation) return
			this.lastResult = this.now()
			this.lastFrame = -Infinity
			this.lastVideoTime = -1
			this.busy = false
			this.lifecycle = new AbortController()
			if (this.options.pauseWhenHidden) this.visibilityDocument?.addEventListener('visibilitychange', () => {
				if (this.visibilityDocument.hidden) this.release()
			}, { signal: this.lifecycle.signal })
			globalThis.addEventListener?.('pagehide', () => this.stop(), { signal: this.lifecycle.signal })
			this.setState('running')
			this.schedule(generation)
		} catch (error) {
			if (generation !== this.generation) return
			this.stop()
			this.setState('error')
			emit(this, PHOTOSYNTH_ERROR, error)
			throw error
		}
	}
	schedule(generation) {
		this.frameId = this.requestFrame(() => {
			if (generation !== this.generation) return
			const time = this.now()
			if (this.options.pauseWhenHidden && this.visibilityDocument?.hidden) {
				this.release(time)
				this.schedule(generation)
				return
			}
			if (time - this.lastResult > this.options.trackingTimeoutMs) this.release(time)
			if (!this.options.externalClock) this.tick(time)
			if (!this.busy && this.video?.readyState >= 2 && this.video.currentTime !== this.lastVideoTime && time - this.lastFrame >= 1000 / this.options.framesPerSecond) {
				this.busy = true
				this.lastFrame = time
				this.lastVideoTime = this.video.currentTime
				const tracker = this.tracker, video = this.video
				Promise.resolve().then(() => generation === this.generation ? tracker.detect(video, time) : []).then(predictions => {
					if (generation !== this.generation || time < this.now() - this.options.trackingTimeoutMs) return
					if (this.options.pauseWhenHidden && this.visibilityDocument?.hidden) return
					this.lastResult = this.now()
					this.process(predictions, time)
				}).catch(error => {
					if (generation !== this.generation) return
					this.stop()
					this.setState('error')
					emit(this, PHOTOSYNTH_ERROR, error)
				}).finally(() => { if (generation === this.generation) this.busy = false })
			}
			if (generation === this.generation) this.schedule(generation)
		})
	}
	tick(time = this.now()) {
		if (!Number.isFinite(time)) throw new RangeError('Clock time must be finite milliseconds')
		this.dispatchMusic(this.sequencer.tick(time, this.options.bpm))
	}
	release(time = this.now()) { this.dispatchMusic([...this.sequencer.reset(time), ...this.performers.flatMap(person => person.reset(time))]) }
	stop() {
		if (this.state === 'disposed') return
		++this.generation
		this.pending = undefined
		if (this.frameId !== undefined) this.cancelFrame(this.frameId)
		this.frameId = undefined
		this.lifecycle?.abort()
		this.camera.close()
		this.tracker?.close()
		this.tracker = undefined
		this.video = undefined
		this.release()
		this.setState('idle')
	}
	dispose() { this.stop(); this.setState('disposed') }
}
