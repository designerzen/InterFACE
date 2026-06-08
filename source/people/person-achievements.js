import { ACHIEVEMENT_DEFINITIONS } from "./person-achievement-definitions.js"

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
	unlock( id ){
		const lockedAchievement = this.locked.get( id )
		if (lockedAchievement)
		{
			this.locked.delete( id )
			this.unlocked.push( lockedAchievement )
			this.#score += lockedAchievement.score
			return lockedAchievement
		}
	
		return false
	}

	evaluate(stats){
		const unlockedAchievements = []

		this.locked.forEach((achievement, id) => {
			if (achievement.test(stats))
			{
				unlockedAchievements.push(this.unlock(id))
			}
		})

		return unlockedAchievements.filter(Boolean)
	}

	/**
	 *  Reset
	 */
	reset(){
		this.#score = 0
		this.unlocked = []
		this.locked = new Map()

		ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
			this.locked.set(achievement.id, achievement)
		})
	}
}
