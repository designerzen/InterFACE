import Achievements from '../source/people/person-achievements.js'

describe('Achievements', () => {
	test('describes the score and achievement counts', () => {
		const achievements = new Achievements()

		expect(achievements.toString()).toBe(
			`Achievements(score:0, unlocked:0, locked:${achievements.locked.size})`
		)

		const achievementId = achievements.locked.keys().next().value
		const achievement = achievements.unlock(achievementId)

		expect(achievements.toString()).toBe(
			`Achievements(score:${achievement.score}, unlocked:1, locked:${achievements.locked.size})`
		)
	})
})
