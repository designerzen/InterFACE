import PersonActivity from '../source/people/person-activity.js'
import PersonalProgress from '../source/people/person-progress.js'

const createPrediction = ({
	xMin = 0,
	xMax = 100,
	yMin = 0,
	yMax = 100,
	leftEyeClosed = false,
	rightEyeClosed = false,
	yaw = 0,
	pitch = 0,
	roll = 0
} = {}) => ({
	box:{ xMin, xMax, yMin, yMax },
	leftEyeClosed,
	rightEyeClosed,
	yaw,
	pitch,
	roll
})

describe('Person activity achievements', () => {
	test('unlocks achievements from current PersonActivity metrics', () => {
		const activity = new PersonActivity()
		const progress = new PersonalProgress(activity)

		activity.update(createPrediction(), 0)
		activity.update(createPrediction({ leftEyeClosed:true }), 180)

		const winkAchievements = progress.tick(180)
		expect(winkAchievements.map(achievement => achievement.id)).toContain('activity:first-wink')

		activity.update(createPrediction({ xMin:100, xMax:200, yaw:1, pitch:1, roll:1 }), 360)

		const movementAchievements = progress.tick(360)
		expect(movementAchievements.map(achievement => achievement.id)).toContain('activity:peak')
		expect(progress.achievements.score).toBe(35)
	})

	test('does not unlock activity achievements without an activity tracker', () => {
		const progress = new PersonalProgress()

		expect(progress.tick(0).filter(achievement => achievement.type === 'activity')).toEqual([])
	})
})
