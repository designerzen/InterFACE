const defaultCheckpoint = './magenta/checkpoints/chord_pitches_improv'
let model
let initialized
const initialize = location => initialized ??= (async () => {
	const checkpoint = new URL(location || defaultCheckpoint,self.location.href).href.replace(/\/$/,'')
	if (!/^(https?:|file:)/.test(checkpoint)) throw new Error('Unsupported model location')
	// Keep TFJS out of Parcel's shared vision/audio chunks. These pinned UMD
	// bundles have their own worker global and never modify the vision backend.
	importScripts(
		new URL('./magenta/tfjs-4.22.0.min.js',self.location.href).href,
		new URL('./magenta/music_rnn-1.23.1.js',self.location.href).href
	)
	await self.tf.setBackend('cpu')
	await self.tf.ready()
	const response = await fetch(`${checkpoint}/config.json`)
	if (!response.ok) throw new Error(location
		? `Model could not load (HTTP ${response.status}). Check the model location`
		: `Local backing model is missing (HTTP ${response.status}). Install its checkpoint with pnpm backing:model:install`)
	model = new self.music_rnn.MusicRNN(checkpoint,await response.json())
	await model.initialize()
})()
self.onmessage = async ({data}) => {
	try {
		await initialize(data.checkpoint)
		const sequence = data.type === 'generate'
			? await model.continueSequence(data.seed, 16, 0.8, [data.chord])
			: undefined
		self.postMessage({ id:data.id, sequence })
	} catch (error) {
		self.postMessage({ id:data.id, error:error.message ?? String(error) })
	}
}
