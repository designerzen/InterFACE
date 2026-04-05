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

	// How long has this user been engaged with 
	get timeEngaged(){
		return 0
	}

	// Quantity of points
	get score(){
		return 0
	}

	#achievements

	constructor(){
		this.#achievements = new Achievements()
	}

	experienceEmotion( emoticon ){
		return this.#achievements.unlock(emoticon)
	}

	// 
	reset(){
		this.#achievements.reset()
	}
}