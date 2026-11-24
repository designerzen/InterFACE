export const PHOTOSYNTH_MUSIC = 'photosynth-music'
export const PHOTOSYNTH_FRAME = 'photosynth-frame'
export const PHOTOSYNTH_STATE = 'photosynth-state'
export const PHOTOSYNTH_ERROR = 'photosynth-error'
export const PHOTOSYNTH_CONFIGURATION = 'photosynth-configuration'

export const emit = (target, type, detail) => target.dispatchEvent(new CustomEvent(type, { detail }))

export const subscribe = (target, type, listener) => {
	const handler = event => listener(event.detail)
	target.addEventListener(type, handler)
	return () => target.removeEventListener(type, handler)
}
