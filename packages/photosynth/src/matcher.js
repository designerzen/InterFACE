const MAX_REASONABLE_FACE_JUMP = 0.18
const MIN_REASONABLE_FACE_OVERLAP = 0.05
const SINGLE_FACE_CONTINUITY_LIMIT = 0.42

export class PredictionMatcher {
	normaliseBoundingBox(box){
		if (!box)
		{
			return null
		}

		const left = Math.min(box.xMin, box.xMax)
		const right = Math.max(box.xMin, box.xMax)
		const top = Math.min(box.yMin, box.yMax)
		const bottom = Math.max(box.yMin, box.yMax)
		const width = right - left
		const height = bottom - top

		if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
		{
			return null
		}

		return {
			left,
			right,
			top,
			bottom,
			width,
			height,
			area:width * height,
			centerX:left + width * 0.5,
			centerY:top + height * 0.5
		}
	}

	getBoundingBoxOverlap(boxA, boxB){
		const left = Math.max(boxA.left, boxB.left)
		const right = Math.min(boxA.right, boxB.right)
		const top = Math.max(boxA.top, boxB.top)
		const bottom = Math.min(boxA.bottom, boxB.bottom)
		const width = Math.max(0, right - left)
		const height = Math.max(0, bottom - top)
		const intersection = width * height
		const union = boxA.area + boxB.area - intersection
		return union > 0 ? intersection / union : 0
	}

	getBoundingBoxMatchScore(predictionBox, personBox, person){
		const dx = predictionBox.centerX - personBox.centerX
		const dy = predictionBox.centerY - personBox.centerY
		const distanceSquared = dx * dx + dy * dy
		const distance = Math.sqrt(distanceSquared)
		const overlap = this.getBoundingBoxOverlap(predictionBox, personBox)
		const widthDelta = Math.abs(predictionBox.width - personBox.width)
		const heightDelta = Math.abs(predictionBox.height - personBox.height)
		const sizeDelta = widthDelta + heightDelta
		const lostPenalty = person?.deadForDuration > 0 ? 0.03 : 0

		if (overlap < MIN_REASONABLE_FACE_OVERLAP && distance > MAX_REASONABLE_FACE_JUMP)
		{
			return null
		}

		return {
			distance,
			overlap,
			score:distanceSquared + (1 - overlap) * 0.35 + sizeDelta * 0.2 + lostPenalty
		}
	}

	getClosestTrackedPersonIndex(predictionBox, normalisedPeople, activePeople, assignedPersonIndexes){
		let closestPersonIndex = -1
		let closestDistance = Number.MAX_VALUE

		normalisedPeople.forEach((personBox, personIndex) => {
			const person = activePeople[personIndex]
			if (!personBox || !person || assignedPersonIndexes.has(personIndex) || person.dead)
			{
				return
			}

			const dx = predictionBox.centerX - personBox.centerX
			const dy = predictionBox.centerY - personBox.centerY
			const distance = Math.sqrt(dx * dx + dy * dy)
			if (distance < closestDistance)
			{
				closestDistance = distance
				closestPersonIndex = personIndex
			}
		})

		return closestDistance <= SINGLE_FACE_CONTINUITY_LIMIT ? closestPersonIndex : -1
	}

	/**
	 * Match this frame's model predictions to stable Person slots.
	 * Model output order can change, so score every possible pair before assigning.
	 * @param {Array<Object>} predictions
	 * @param {Array<Person>} activePeople
	 * @returns {Array<{prediction:Object, predictionIndex:Number, person:Person, personIndex:Number}>}
	 */
	matchPredictionsToPeople(predictions=[], activePeople=[]){
		const matches = []
		const candidates = []
		const assignedPredictionIndexes = new Set()
		const assignedPersonIndexes = new Set()
		const normalisedPredictions = predictions.map(prediction => this.normaliseBoundingBox(prediction?.box))
		const normalisedPeople = activePeople.map(person => this.normaliseBoundingBox(person?.boundingBox))

		normalisedPredictions.forEach((predictionBox, predictionIndex) => {
			if (!predictionBox)
			{
				return
			}

			normalisedPeople.forEach((personBox, personIndex) => {
				const person = activePeople[personIndex]
				if (!personBox || !person)
				{
					return
				}

				const match = this.getBoundingBoxMatchScore(predictionBox, personBox, person)
				if (match)
				{
					candidates.push({
						...match,
						predictionIndex,
						personIndex
					})
				}
			})
		})

		candidates
			.sort((a,b) => a.score - b.score)
			.forEach(candidate => {
				if (assignedPredictionIndexes.has(candidate.predictionIndex) || assignedPersonIndexes.has(candidate.personIndex))
				{
					return
				}

				assignedPredictionIndexes.add(candidate.predictionIndex)
				assignedPersonIndexes.add(candidate.personIndex)
				matches.push({
					prediction:predictions[candidate.predictionIndex],
					predictionIndex:candidate.predictionIndex,
					person:activePeople[candidate.personIndex],
					personIndex:candidate.personIndex
				})
			})

		predictions.forEach((prediction, predictionIndex) => {
			if (!prediction || assignedPredictionIndexes.has(predictionIndex))
			{
				return
			}

			const predictionBox = normalisedPredictions[predictionIndex]
			const continuityPersonIndex = predictions.length === 1 && predictionBox ?
				this.getClosestTrackedPersonIndex(predictionBox, normalisedPeople, activePeople, assignedPersonIndexes) :
				-1

			const personIndex = continuityPersonIndex > -1 ? continuityPersonIndex : activePeople.findIndex((person, index) => {
				return person && !assignedPersonIndexes.has(index) && (!normalisedPeople[index] || person.dead)
			})

			if (personIndex < 0)
			{
				return
			}

			assignedPredictionIndexes.add(predictionIndex)
			assignedPersonIndexes.add(personIndex)
			matches.push({
				prediction,
				predictionIndex,
				person:activePeople[personIndex],
				personIndex
			})
		})

		return matches.sort((a,b) => a.predictionIndex - b.predictionIndex)
	}
}
