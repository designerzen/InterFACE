
/**
 * Convert HSL to RGB
 * @param {Number} h - Hue (0-360)
 * @param {Number} s - Saturation (0-100)
 * @param {Number} l - Luminosity (0-100)
 * @returns {Object} RGB values
 */
export const hslToRgb = (h, s, l) => {
	
	h = h % 360
	s = s / 100
	l = l / 100

	const c = (1 - Math.abs(2 * l - 1)) * s
	const hp = h / 60
	const x = c * (1 - Math.abs((hp % 2) - 1))

	let r = 0, g = 0, b = 0

	if (hp < 1) { r = c; g = x; b = 0 }
	else if (hp < 2) { r = x; g = c; b = 0 }
	else if (hp < 3) { r = 0; g = c; b = x }
	else if (hp < 4) { r = 0; g = x; b = c }
	else if (hp < 5) { r = x; g = 0; b = c }
	else if (hp < 6) { r = c; g = 0; b = x }

	const m = l - c / 2

	return {
		r: Math.max(0, Math.min(1, r + m)),
		g: Math.max(0, Math.min(1, g + m)),
		b: Math.max(0, Math.min(1, b + m))
	}
}