let recorder = null
const listeners = new Set()

// Live consumers receive notes even when session recording is stopped.
export const observeSessionEvents = listener => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}
const held = new Map()
const programs = new Map()

export const setSessionEventRecorder = value => {
	recorder = value
	if (value) {
		const sources=new Set([...held.values()].map(event=>event.source))
		for(const source of sources)if(programs.has(source))value.record({...programs.get(source),time:0})
		for (const event of held.values()) value.record({ ...event, time:0 })
	}
	return recorder
}

export const clearSessionEventRecorder = value => {
	if (!value || recorder === value) recorder = null
}

export const recordSessionEvent = event => {
	for (const listener of listeners) listener(event)
	if(event.type==='programChange')programs.set(event.source,event)
	if (!event.transient) {
		const key = `${event.source}:${event.channel ?? 0}:${event.note}`
		if (event.type === 'noteOn' && event.velocity > 0) held.set(key, event)
		if (event.type === 'noteOff' || (event.type === 'noteOn' && event.velocity === 0)) held.delete(key)
	}
	return recorder?.record(event) ?? false
}

export const getSessionEventRecorder = () => recorder
