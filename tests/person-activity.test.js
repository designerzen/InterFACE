import PersonActivity from '../source/people/person-activity.js'

const createPrediction = ({
	xMin = 0,
	yMin = 0,
	xMax = 100,
	yMax = 100,
	yaw = 0,
	pitch = 0,
	roll = 0,
	mouthRatio = 0,
	mouthPucker = 0,
	happiness = 0,
	eyebrowsRaisedBy = 0,
	leftEyebrowRaisedBy = 0,
	rightEyebrowRaisedBy = 0
} = {}) => ({
	box:{ xMin, yMin, xMax, yMax },
	yaw,
	pitch,
	roll,
	mouthRatio,
	mouthPucker,
	happiness,
	eyebrowsRaisedBy,
	leftEyebrowRaisedBy,
	rightEyebrowRaisedBy
})

describe('PersonActivity', () => {
	test('tracks current and session activity with movement component metrics', () => {
		const activity = new PersonActivity()

		activity.update(createPrediction(), 0)
		expect(activity.currentActivity).toBe(0)
		expect(activity.sessionActivity).toBe(0)
		expect(activity.sampleCount).toBe(1)

		activity.update(createPrediction({
			xMin:40,
			xMax:150,
			yMin:10,
			yMax:120,
			yaw:0.8,
			pitch:0.5,
			roll:0.4,
			mouthRatio:0.7,
			mouthPucker:0.6,
			happiness:0.8,
			eyebrowsRaisedBy:0.5
		}), 180)

		expect(activity.currentActivity).toBe(1)
		expect(activity.sessionActivity).toBe(1)
		expect(activity.currentPositionActivity).toBeGreaterThan(0)
		expect(activity.sessionPositionActivity).toBeGreaterThan(0)
		expect(activity.currentOrientationActivity).toBeGreaterThan(0)
		expect(activity.sessionOrientationActivity).toBeGreaterThan(0)
		expect(activity.currentScaleActivity).toBeGreaterThan(0)
		expect(activity.sessionScaleActivity).toBeGreaterThan(0)
		expect(activity.currentExpressionActivity).toBeGreaterThan(0)
		expect(activity.sessionExpressionActivity).toBeGreaterThan(0)
		expect(activity.peakActivity).toBe(1)
		expect(activity.activeDuration).toBe(180)
		expect(activity.activeRatio).toBe(1)
		expect(activity.positionTravelled).toBeGreaterThan(0)
		expect(activity.orientationTravelled).toBeGreaterThan(0)
		expect(activity.scaleTravelled).toBeGreaterThan(0)
		expect(activity.expressionTravelled).toBeGreaterThan(0)
	})

	test('accumulates session averages while current activity decays', () => {
		const activity = new PersonActivity()
		const movedPrediction = createPrediction({ xMin:40, xMax:140, yaw:0.8 })

		activity.update(createPrediction(), 0)
		activity.update(movedPrediction, 180)
		const movementActivity = activity.currentActivity
		activity.update(movedPrediction, 360)

		expect(activity.currentActivity).toBe(0)
		expect(activity.sessionActivity).toBeCloseTo(movementActivity * 0.5)
		expect(activity.sessionDuration).toBe(360)
		expect(activity.sampleCount).toBe(3)
	})

	test('reset clears every metric for a new session', () => {
		const activity = new PersonActivity()

		activity.update(createPrediction(), 0)
		activity.update(createPrediction({ xMin:30, xMax:140, yaw:0.5, happiness:0.8 }), 180)
		activity.reset()

		expect(activity.currentActivity).toBe(0)
		expect(activity.sessionActivity).toBe(0)
		expect(activity.peakActivity).toBe(0)
		expect(activity.activeDuration).toBe(0)
		expect(activity.activeRatio).toBe(0)
		expect(activity.sessionDuration).toBe(0)
		expect(activity.sampleCount).toBe(0)
		expect(activity.positionTravelled).toBe(0)
		expect(activity.lastSampleAt).toBe(-1)
		expect(activity.winks).toBe(0)
		expect(activity.blinks).toBe(0)
		expect(activity.notesPlayed).toBe(0)
		expect(activity.uniqueNotesPlayed).toBe(0)
		expect(activity.lowestNotePlayed).toBeNull()
		expect(activity.highestNotePlayed).toBeNull()
	})

	test('counts winks, blinks, mouth openings and expression changes', () => {
		const activity = new PersonActivity()

		activity.update(createPrediction(), 0)
		activity.update({ ...createPrediction(), leftEyeClosed:true }, 180)
		activity.update(createPrediction(), 360)
		activity.update({ ...createPrediction(), leftEyeClosed:true, rightEyeClosed:true }, 540)
		activity.update(createPrediction(), 720)
		activity.update({ ...createPrediction({ mouthRatio:0.8, happiness:0.7 }), isMouthOpen:true }, 900)

		expect(activity.leftWinks).toBe(1)
		expect(activity.rightWinks).toBe(0)
		expect(activity.winks).toBe(1)
		expect(activity.blinks).toBe(1)
		expect(activity.mouthOpenings).toBe(1)
		expect(activity.expressionChanges).toBeGreaterThan(0)
	})

	test('counts played and unique notes with their range', () => {
		const activity = new PersonActivity()

		activity.trackNote(60)
		activity.trackNote(64)
		activity.trackNote(60)
		activity.trackNote(undefined)

		expect(activity.notesPlayed).toBe(3)
		expect(activity.uniqueNotesPlayed).toBe(2)
		expect(activity.lowestNotePlayed).toBe(60)
		expect(activity.highestNotePlayed).toBe(64)
		expect(activity.noteRange).toBe(4)
	})

	test('describes its current session metrics', () => {
		const activity = new PersonActivity()

		expect(activity.toString()).toBe(
			'PersonActivity(current:0.000, session:0.000, peak:0.000, active:0.0%, winks:0, blinks:0, mouthOpenings:0, notesPlayed:0, uniqueNotes:0)'
		)
	})
})
