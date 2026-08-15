import { clamp } from '../maths/maths.js'

export const getPerformanceDrumStereoPan = (control, enabled=true) => {
	const snare = enabled && Number.isFinite(control) ? clamp(control, -1, 1) : 0
	return {
		snare,
		tom:snare === 0 ? 0 : snare * -1,
	}
}
