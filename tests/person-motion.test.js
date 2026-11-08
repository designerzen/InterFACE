import PersonMotion from '../source/people/person-motion.js'

const prediction = (values = {}) => ({
	box:{ xMin:0, xMax:100, yMin:0, yMax:100 },
	yaw:0, pitch:0, roll:0,
	...values
})
const immediate = { motionSmoothingMs:0, motionAccelerationSmoothingMs:0 }

describe('PersonMotion', () => {
	test('measures signed turning velocity and acceleration per second', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction(), 0)
		motion.update(prediction({ yaw:0.1 }), 100)
		expect(motion.yaw.velocity).toBeCloseTo(1)
		expect(motion.yaw.acceleration).toBe(0)
		motion.update(prediction({ yaw:0.3 }), 200)
		expect(motion.yaw.velocity).toBeCloseTo(2)
		expect(motion.yaw.acceleration).toBeCloseTo(10)
		expect(motion.yaw.extension).toBeCloseTo(0.3)
		expect(motion.yaw.travel).toBeCloseTo(0.3)
		expect(motion.rotationSpeed).toBeCloseTo(2)
	})

	test('retains an inertia tail after stopping and detects reversals through rest', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction(), 0)
		motion.update(prediction({ yaw:0.1 }), 100)
		const inertia = motion.yaw.inertia
		motion.update(prediction({ yaw:0.1 }), 200)
		expect(motion.yaw.speed).toBe(0)
		expect(motion.yaw.direction).toBe(0)
		expect(motion.yaw.inertia).toBeGreaterThan(0)
		expect(motion.yaw.inertia).toBeLessThan(inertia)
		motion.update(prediction({ yaw:0 }), 300)
		expect(motion.yaw.direction).toBe(-1)
		expect(motion.yaw.reversed).toBe(true)
		motion.update(prediction({ yaw:-0.1 }), 400)
		expect(motion.yaw.reversed).toBe(false)
	})

	test('normalizes translation and apparent depth independently of camera resolution and bound order', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction({ box:{ xMin:100, xMax:0, yMin:100, yMax:0 } }), 0)
		motion.update(prediction({ box:{ xMin:125, xMax:25, yMin:100, yMax:0 } }), 100)
		expect(motion.x.extension).toBeCloseTo(0.25)
		expect(motion.x.velocity).toBeCloseTo(2.5)
		expect(motion.translationSpeed).toBeCloseTo(2.5)
		motion.update(prediction({ box:{ xMin:-50, xMax:150, yMin:-50, yMax:150 } }), 200)
		expect(motion.scale.extension).toBeCloseTo(Math.log(2))
		expect(motion.scale.velocity).toBeGreaterThan(0)
	})

	test('calibrates extension against a comfortable pose without creating derivative spikes', () => {
		const motion = new PersonMotion(immediate)
		expect(motion.calibrate()).toBe(false)
		motion.update(prediction(), 0)
		const pose = prediction({ yaw:0.4, pitch:0.2, box:{ xMin:20, xMax:120, yMin:0, yMax:100 } })
		motion.update(pose, 100)
		expect(motion.calibrate()).toBe(true)
		motion.update(pose, 200)
		expect(motion.x.extension).toBe(0)
		expect(motion.yaw.extension).toBe(0)
		expect(motion.rotationSpeed).toBe(0)
		motion.update(prediction({ ...pose, yaw:0.5 }), 300)
		expect(motion.yaw.extension).toBeCloseTo(0.1)
	})

	test('does not count duplicate, sub-millisecond or out-of-order samples', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction({ time:1 }), 100)
		motion.update(prediction({ time:1, yaw:1 }), 150)
		motion.update(prediction({ time:2, yaw:1 }), 100.1)
		motion.update(prediction({ time:2, yaw:1 }), 90)
		expect(motion.sampleCount).toBe(1)
		motion.update(prediction({ time:2, yaw:0.1 }), 200)
		expect(motion.yaw.velocity).toBeCloseTo(1)
		expect(motion.sampleCount).toBe(2)
	})

	test('clears movement on loss and seeds reacquisition without a jump', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction(), 0)
		motion.update(prediction({ yaw:0.5 }), 100)
		motion.invalidate()
		expect(motion.tracked).toBe(false)
		expect(motion.yaw.inertia).toBe(0)
		motion.update(prediction({ yaw:-0.5 }), 200)
		expect(motion.yaw.velocity).toBe(0)
		expect(motion.yaw.reversed).toBe(false)
		expect(motion.yaw.travel).toBeCloseTo(0.5)
	})

	test('long gaps and stale frame repeats stop movement', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction({ time:0 }), 0)
		motion.update(prediction({ time:1, yaw:0.5 }), 100)
		motion.update(prediction({ time:1, yaw:0.5 }), 400)
		expect(motion.tracked).toBe(false)
		motion.update(prediction({ time:1, yaw:0.5 }), 450)
		expect(motion.tracked).toBe(false)
		motion.update(prediction({ time:2, yaw:-0.5 }), 500)
		expect(motion.yaw.speed).toBe(0)
		motion.update(prediction({ time:3, yaw:0.5 }), 1000)
		expect(motion.yaw.speed).toBe(0)
	})

	test.each([null, {}, prediction({ yaw:NaN }), prediction({ pitch:Infinity }),
		prediction({ box:{ xMin:0, xMax:0, yMin:0, yMax:0 } })])('rejects malformed or missing tracking: %p', input => {
		const motion = new PersonMotion()
		motion.update(prediction(), 0)
		motion.update(input, 100)
		expect(motion.tracked).toBe(false)
		expect(motion.rotationSpeed).toBe(0)
	})

	test('mirroring changes recalibrate the coordinate system', () => {
		const motion = new PersonMotion(immediate)
		motion.update(prediction({ flipped:true, yaw:0.4 }), 0)
		motion.update(prediction({ flipped:false, yaw:-0.4 }), 100)
		expect(motion.yaw.extension).toBe(0)
		expect(motion.yaw.velocity).toBe(0)
	})

	test('smoothing is consistent across tracking frame rates', () => {
		const run = interval => {
			const motion = new PersonMotion()
			for (let time = 0; time <= 200; time += interval) {
				motion.update(prediction({ yaw:time / 1000 }), time)
			}
			return motion.yaw.velocity
		}
		expect(run(20)).toBeCloseTo(run(40), 8)
	})

	test('reuses axis objects, and reset clears session statistics and calibration', () => {
		const motion = new PersonMotion(immediate)
		const yaw = motion.yaw
		motion.update(prediction(), 0)
		motion.update(prediction({ yaw:0.5 }), 100)
		motion.reset()
		expect(motion.yaw).toBe(yaw)
		expect(motion.sampleCount).toBe(0)
		expect(motion.rotationExtension).toBe(0)
		expect(yaw.travel).toBe(0)
		expect(yaw.peakSpeed).toBe(0)
		motion.update(prediction({ yaw:0.8 }), 200)
		expect(yaw.extension).toBe(0)
	})
})
