// Shared pixel offsets keep every layer moving together without changing tile geometry.
export const createBackgroundMotion = () => {
	let targetX = 24, targetY = 18, velocityX = 24, velocityY = 18
	let x = 0, y = 0
	return {
		point(clientX, clientY, width, height) {
			const speed = position => {
				const distance = Math.min(1, Math.max(-1, position))
				return Math.sign(distance) * Math.pow(Math.max(0, (Math.abs(distance) - 0.08) / 0.92), 1.5) * 150
			}
			targetX = speed(clientX / Math.max(1, width) * 2 - 1)
			targetY = speed(clientY / Math.max(1, height) * 2 - 1)
		},
		reset() { targetX = 24; targetY = 18 },
		step(milliseconds) {
			const seconds = Math.min(0.1, Math.max(0, milliseconds / 1000))
			const ease = 1 - Math.exp(-seconds * 5)
			velocityX += (targetX - velocityX) * ease
			velocityY += (targetY - velocityY) * ease
			x += velocityX * seconds
			y += velocityY * seconds
			return { x, y }
		}
	}
}
