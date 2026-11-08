export const getDirectionPlayerLabel = person => `Player ${(person.playerNumber ?? 0) + 1}`

// Owns the response window; rendering and generic feedback timers never advance a round.
export default class DirectionsSession {
	constructor(engine, {now = () => performance.now(), responseMs = 18000, supportMs = 7000,
		acknowledgeMs = 3500, retryMs = 3000, absenceMs = 3000} = {}) {
		Object.assign(this, {engine, now, responseMs, supportMs, acknowledgeMs, retryMs, absenceMs})
		this.seen = new Map()
		this.visiblePeople = []
		this.lastTick = now()
		this.clearPrompt()
	}

	clearPrompt() {
		this.direction = null
		this.phase = 'waiting'
		this.elapsed = 0
		this.acknowledgingFor = 0
		this.responses = []
		this.message = ''
	}

	setEngine(engine) {
		this.engine = engine
		this.clearPrompt()
	}

	pause() {
		this.paused = true
		this.lastTick = this.now()
	}

	update(people, {paused = false} = {}) {
		const time = this.now()
		const delta = Math.max(0, time - this.lastTick)
		this.lastTick = time
		this.visiblePeople = [...new Set(people)]
		for (const person of people) this.seen.set(person, time)
		const participants = [...this.seen].filter(([,seenAt]) => time - seenAt <= this.absenceMs).map(([person]) => person)
		this.engine.setPeople(participants)
		const wasPaused = this.paused
		this.paused = paused || !people.length
		if (this.paused) return this.getSnapshot()
		if (!wasPaused) {
			this.elapsed += delta
			if (this.responses.length || this.phase === 'retry') this.acknowledgingFor += delta
		}
		if (this.phase === 'waiting' || (this.phase === 'finished' && this.hasPending())) {
			this.advance(participants)
		} else if (this.phase === 'retry') {
			if (this.acknowledgingFor >= this.retryMs) this.advance(participants)
		} else if (this.phase === 'prompt') {
			const complete = this.engine.getCurrentDirection()?.progress.complete
			if ((this.responses.length && this.acknowledgingFor >= this.acknowledgeMs) || (complete && !this.responses.length)) {
				this.advance(participants)
			} else if (!this.responses.length && this.elapsed >= this.responseMs) {
				this.skip()
			}
		}
		return this.getSnapshot()
	}

	hasPending() {
		return this.engine.getProgress().directions.some(direction => direction.pendingPeople.length)
	}

	advance(people) {
		this.clearPrompt()
		this.direction = this.engine.getNextDirection(people)
		this.phase = this.direction && !this.direction.complete ? 'prompt' : 'finished'
	}

	respond(emoji, person) {
		if (this.paused || !this.visiblePeople.includes(person)) return null
		if (this.phase !== 'prompt') {
			this.engine.observeExpression(emoji, person)
			return null
		}
		const completion = this.engine.completeExpression(emoji, person)
		if (completion) {
			if (!this.responses.length) this.acknowledgingFor = 0
			this.responses.push(completion)
		}
		return completion
	}

	skip() {
		if (this.phase !== 'prompt' || this.paused) return
		this.phase = 'retry'
		this.acknowledgingFor = 0
		this.message = this.direction?.retryMessage || "No rush. Let's try something else — we'll come back to this one."
	}

	moreTime() {
		if (!['prompt', 'retry'].includes(this.phase)) return
		this.phase = 'prompt'
		this.elapsed = 0
		this.responses = []
		this.acknowledgingFor = 0
		this.message = 'Take your time. Try a comfortable movement, or try again on a later turn.'
	}

	resetPerson(person) {
		this.engine.resetPerson(person)
		this.clearPrompt()
		this.lastTick = this.now()
	}

	reset() {
		this.engine.reset()
		this.clearPrompt()
		this.lastTick = this.now()
	}

	getSnapshot() {
		const progress = this.engine.getProgress()
		const direction = this.phase === 'prompt' || this.phase === 'retry' ? this.engine.getCurrentDirection() : this.direction
		const pending = direction?.progress?.pendingPeople ?? []
		const participants = [...this.seen.keys()].filter(person => this.engine.progress.isActive(person))
		let encouragement = this.message || direction?.encouragement || 'Give it a go. Everyone can join in at their own pace.'
		if (!this.message && pending.length && direction?.progress?.completedPeople.length) {
			encouragement = `${pending.map(getDirectionPlayerLabel).join(', ')}: this invitation is for you. Anyone who has already done it can keep making music.`
		}
		if (this.responses.length) encouragement = pending.length
			? `${pending.map(getDirectionPlayerLabel).join(', ')}: you can still join in. Your turn will come around again.`
			: 'Everyone got it! Great teamwork.'
		else if (this.elapsed >= this.supportMs && this.phase === 'prompt') encouragement = direction?.hint ||
			'Try holding the expression for a moment. Small movements count. We can come back to this on another turn.'
		if (this.paused) encouragement = this.visiblePeople.length
			? 'Challenge paused. Continue when you are ready.'
			: 'Challenge paused. Come back into view when you are ready.'
		if (this.phase === 'finished' && !this.paused) encouragement = 'Wonderful exploring! Keep making music, or start a new challenge.'
		return {phase:this.paused ? 'paused' : this.phase, round:progress.round, direction,
			supporting:this.elapsed >= this.supportMs, encouragement, responses:[...this.responses], players:participants.map(person => {
				const personal = this.engine.progress.getPersonProgress(person)
				return {person, label:getDirectionPlayerLabel(person), score:personal.score,
					completed:progress.directions.filter(item => personal.hasCompleted(item.directionId)).length,
					total:progress.directions.length, answered:direction?.id ? personal.hasCompleted(direction.id) : false,
					present:this.visiblePeople.includes(person)}
			})}
	}
}
