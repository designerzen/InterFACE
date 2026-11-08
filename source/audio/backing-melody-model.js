export const createBackingMelodyModel = checkpoint => {
	const worker = new Worker(new URL('./backing-melody.worker.js', import.meta.url))
	let nextId = 0, disposed = false
	const pending = new Map()
	const fail = error => {
		for (const request of pending.values()) { clearTimeout(request.timer); request.reject(error) }
		pending.clear()
	}
	worker.onmessage = ({data}) => {
		const request = pending.get(data.id)
		if (!request) return
		clearTimeout(request.timer); pending.delete(data.id)
		if (data.error) request.reject(new Error(data.error))
		else request.resolve(data.sequence)
	}
	worker.onerror = () => fail(new Error('The backing melody model could not run on this device.'))
	const request = (type, payload={}) => new Promise((resolve,reject) => {
		if (disposed) { reject(new Error('Backing melody stopped')); return }
		const id = ++nextId
		const timer = setTimeout(() => {
			pending.delete(id)
			reject(new Error('Backing melody timed out. Check your connection and try again.'))
		}, 60000)
		pending.set(id, {resolve,reject,timer})
		worker.postMessage({id,type,checkpoint,...payload})
	})
	return {
		initialize:() => request('initialize'),
		generate:(seed,chord) => request('generate', {seed,chord}),
		destroy:() => { disposed=true; worker.terminate(); fail(new Error('Backing melody stopped')) }
	}
}
