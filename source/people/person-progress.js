import Achievements from "./person-achievements"

/**
 * A way of tracking how somebodies interactions
 * went so that you can make charts and work out
 * if people are improving or getting worse
 * 
 * Melody variation
 * Melody Length
 * Emotions Experienced
 * Main emotion experienced
 * Emotional variety
 */
export default class PersonalProgress{

	#startAt = 0
	#achievements

	// How long has this user been engaged with 
	get timeEngaged(){
		return this.getNow() - this.#startAt
	}

	get quantityOfEmotions(){
		return this.#achievements.score
	}

	// Quantity of points
	get score(){
		return this.quantityOfEmotions * this.timeEngaged
	}

	constructor(){
		this.#achievements = new Achievements()
		this.markStartTime()
	}

	getNow(){
		return performance.now ?? Date.now()
	}

	// When an emotion is experienced we check to see if
	// it has been experienced before
	experienceEmotion( emoticon ){
		return this.#achievements.unlock(emoticon)
	}

	markStartTime(){
		this.#startAt = this.getNow()
	}

	// 
	reset(){
		this.markStartTime()
		this.#achievements.reset()
	}
}