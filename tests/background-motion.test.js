import { createBackgroundMotion } from '../source/display/background-motion.js'

const move = (x, y) => {
	const motion = createBackgroundMotion()
	motion.point(x, y, 1000, 1000)
	let result
	for (let i = 0; i < 120; i++) result = motion.step(1000 / 60)
	return { motion, result }
}

test('pointer position steers all four directions and edges scroll faster', () => {
	expect(move(0, 500).result.x).toBeLessThan(-80)
	expect(move(1000, 500).result.x).toBeGreaterThan(80)
	expect(move(500, 0).result.y).toBeLessThan(-80)
	expect(move(500, 1000).result.y).toBeGreaterThan(80)
	expect(move(1000, 500).result.x).toBeGreaterThan(move(750, 500).result.x)
})

test('centre settles to a stop and leaving resumes the gentle default drift', () => {
	const { motion, result } = move(500, 500)
	const settled = motion.step(1000 / 60)
	expect(Math.abs(settled.x - result.x)).toBeLessThan(0.01)
	motion.reset()
	let resumed
	for (let i = 0; i < 120; i++) resumed = motion.step(1000 / 60)
	expect(resumed.x - settled.x).toBeGreaterThan(15)
	expect(resumed.y - settled.y).toBeGreaterThan(12)
})
