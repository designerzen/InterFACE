// One animation callback per audio context. Person AudioParams are also written
// directly by gesture/automation code, so sample them here rather than relying
// on setters that would miss those changes. Notify only when values change.
const contexts = new WeakMap()

export const watchVoiceControls = (context, handle, update) => {
	let registry = contexts.get(context)
	if (!registry) {
		registry = {groups:new Map(), frame:undefined}
		contexts.set(context, registry)
	}
	const person = handle.options?.voicePerson
	let group = registry.groups.get(person)
	if (!group) { group = new Set(); registry.groups.set(person, group) }
	let previousExpression, previousPan, destroyed = false
	const sample = (gain, pan, force=false) => {
		const expression = gain*(handle.volume ?? 1)
		if (!force && expression === previousExpression && pan === previousPan) return
		previousExpression = expression; previousPan = pan
		update(expression, pan)
	}
	const sync = (force=false) => {
		if (destroyed) return
		sample((person?.gainNode?.gain.value ?? 1)*(person?.trimNode?.gain.value ?? 1), person?.stereoNode?.pan.value ?? 0, force)
	}
	group.add(sample)
	const tick = () => {
		registry.frame = undefined
		for (const [person, subscriptions] of registry.groups) {
			const gain = (person?.gainNode?.gain.value ?? 1)*(person?.trimNode?.gain.value ?? 1)
			const pan = person?.stereoNode?.pan.value ?? 0
			for (const subscription of subscriptions) subscription(gain, pan)
		}
		schedule()
	}
	const schedule = () => {
		if (registry.frame === undefined && registry.groups.size && typeof requestAnimationFrame === 'function') registry.frame = requestAnimationFrame(tick)
	}
	sync(); schedule()
	return {
		sync,
		destroy(){
			if (destroyed) return
			destroyed = true
			group.delete(sample)
			if (!group.size) registry.groups.delete(person)
			if (!registry.groups.size && registry.frame !== undefined) { cancelAnimationFrame(registry.frame); registry.frame = undefined }
		}
	}
}
