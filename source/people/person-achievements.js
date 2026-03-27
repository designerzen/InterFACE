import achievementsData from './achievements.json'

/**
 * This is a way to unlock new activities
 * and essentially acts as a score or
 */
export default class Achievements{

	// you want to unlock all of these!
	locked = new Map()
	unlocked = []

	#score = 0

	get score(){
		return this.#score
	}

	constructor(){
		this.reset()
	}

	/**
	 * Unlock
	 */
	unlock( emoticon ){
		// find this achievement and unlock it
		const lockedAchievement = this.locked.get( emoticon )
		// unlock
		if (lockedAchievement)
		{
			// achivement unlockd!
			this.locked.delete( emoticon )
			this.unlocked.push( lockedAchievement )
			this.#score += lockedAchievement.score
			return lockedAchievement
		}
	
		return false
	}

	/**
	 *  Reset
	 */
	reset(){
		this.#score = 0
		this.unlocked = []
		this.locked = new Map()

		// loop through the achievement list
		Object.entries( achievementsData ).forEach( ([ emoticon, data ]) => {
			this.locked.set( emoticon, data )
		})
	}
}