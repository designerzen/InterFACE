import PersonDirections from '../people/person-directions.js'

export default class DirectionsProgress {
	#participants = new Map()
	#active = []
	#visited = new Set()
	#round = 1

	setPeople(people) {
		this.#active = [...new Set(people.filter(Boolean))]
		for (const person of this.#active) {
			if (!this.#participants.has(person)) {
				this.#participants.set(person, person.directionsProgress ?? new PersonDirections())
			}
		}
	}

	getPersonProgress(person) {
		return this.#participants.get(person) ?? null
	}

	isActive(person) {
		return this.#active.includes(person)
	}

	getDirectionProgress(directionId) {
		const completedPeople = this.#active.filter(person => this.#participants.get(person).hasCompleted(directionId))
		const pendingPeople = this.#active.filter(person => !this.#participants.get(person).hasCompleted(directionId))
		return {directionId, completedPeople, pendingPeople, completed:completedPeople.length,
			total:this.#active.length, complete:this.#active.length > 0 && pendingPeople.length === 0}
	}

	next(directions) {
		const pending = directions.filter(direction => this.getDirectionProgress(direction.id).pendingPeople.length)
		if (!pending.length) return null
		let next = pending.find(direction => !this.#visited.has(direction.id))
		if (!next) {
			this.#visited.clear()
			this.#round++
			next = pending[0]
		}
		this.#visited.add(next.id)
		return next
	}

	getSnapshot(directions = []) {
		return {round:this.#round, directions:directions.map(direction => this.getDirectionProgress(direction.id))}
	}

	resetPerson(person) {
		this.#participants.get(person)?.reset()
	}

	reset() {
		for (const progress of this.#participants.values()) progress.reset()
		this.#visited.clear()
		this.#round = 1
	}
}
