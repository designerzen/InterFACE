const buffers = new WeakMap()

// A shared four-second source avoids audible short-loop repetition without
// generating noise on each hit or keeping a copy for every percussion voice.
export const getPercussionNoiseBuffer = audioContext => {
	let buffer = buffers.get(audioContext)
	if (buffer) return buffer
	buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * 4), audioContext.sampleRate)
	const data = buffer.getChannelData(0)
	for (let index=0; index<data.length; index++) data[index] = Math.random() * 2 - 1
	buffers.set(audioContext, buffer)
	return buffer
}
