export default class PersonDirections {
	#completed = new Map()
	#expressions = new Set()

	hasCompleted(directionId) {
		return this.#completed.has(directionId)
	}

	observeExpression(emoji) {
		this.#expressions.add(emoji)
	}

	getExperiencedExpressions() {
		return [...this.#expressions]
	}

	complete(directionId, {emoji = null, time = performance.now(), prompted = true, points = 0} = {}) {
		if (!directionId || this.hasCompleted(directionId)) return false
		const score = Number(points)
		this.#completed.set(directionId, {directionId, emoji, time, prompted, points:Number.isFinite(score) ? Math.max(0, score) : 0})
		return true
	}

	get score() {
		return this.getSnapshot().reduce((total, completion) => total + completion.points, 0)
	}

	getCompletedDirectionIds() {
		return new Set(this.#completed.keys())
	}

	getSnapshot() {
		return [...this.#completed.values()].map(completion => ({...completion}))
	}

	reset() {
		this.#completed.clear()
		this.#expressions.clear()
	}
}
