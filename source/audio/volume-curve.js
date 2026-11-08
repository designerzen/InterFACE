// Audio taper: a 60 dB exponential range, offset to reach true silence at zero.
// Keep stored values and audio APIs in linear gain; convert at the fader boundary.
export const faderToGain = position => {
	const value = Math.min(1, Math.max(0, Number(position)))
	return value === 0 || value === 1 ? value : Math.expm1(Math.LN10 * 3 * value) / 999
}
export const gainToFader = gain => Math.log1p(999 * Math.min(1, Math.max(0, Number(gain)))) / (Math.LN10 * 3)
