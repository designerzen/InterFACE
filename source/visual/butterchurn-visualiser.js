const packageAPI = (module, method) => {
	// Parcel can return CommonJS exports directly; native ESM wraps them in default.
	let api = module
	while (api && typeof api[method] !== 'function') api = api.default
	if (!api) throw new Error(`Butterchurn package is missing ${method}`)
	return api
}

export const loadButterchurn = async () => {
	const [engine, presets] = await Promise.all([import('butterchurn'), import('butterchurn-presets')])
	return { engine:packageAPI(engine, 'createVisualizer'), presets:packageAPI(presets, 'getPresets') }
}

const DEFAULT_PRESET = 'Flexi, martin + geiss - dedicated to the sherwin maxawow'

// Keep WebGL separate from the display's existing 2D context.
export const createButterchurnVisualiser = ({ load = loadButterchurn, createCanvas = () => document.createElement('canvas'), onError = console.error } = {}) => {
	let canvas, visualiser, loading, connectedNode, collection, activePreset
	let failed = false, destroyed = false
	let width = 0, height = 0
	const stop = () => {
		if (connectedNode) visualiser.disconnectAudio(connectedNode)
		connectedNode = null
	}
	const fail = error => {
		stop()
		failed = true
		onError(error)
	}
	return {
		stop,
		destroy() {
			stop()
			destroyed = true
			canvas?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext()
			visualiser = canvas = collection = activePreset = null
		},
		render(audioContext, audioNode, nextWidth, nextHeight, presetName = DEFAULT_PRESET) {
			if (destroyed || failed || !audioContext || !audioNode || nextWidth <= 0 || nextHeight <= 0) return null
			if (!visualiser) {
				if (!loading) loading = load().then(({ engine, presets }) => {
					if (destroyed) return
					collection = presets.getPresets()
					if (!Object.keys(collection).length) throw new Error('Butterchurn has no presets available')
					canvas = createCanvas()
					width = canvas.width = nextWidth
					height = canvas.height = nextHeight
					visualiser = engine.createVisualizer(audioContext, canvas, { width, height })
					// The next active frame selects the latest preset and connects audio;
					// switching modes or switching away during loading is safe.
				}).catch(fail)
				return null
			}
			try {
				const preset = collection[presetName] ?? collection[DEFAULT_PRESET] ?? Object.values(collection)[0]
				if (activePreset !== preset) {
					visualiser.loadPreset(preset, activePreset ? 1 : 0)
					activePreset = preset
				}
				if (connectedNode !== audioNode) {
					stop()
					visualiser.connectAudio(audioNode)
					connectedNode = audioNode
				}
				if (width !== nextWidth || height !== nextHeight) {
					canvas.width = nextWidth
					canvas.height = nextHeight
					visualiser.setRendererSize(nextWidth, nextHeight)
					width = nextWidth
					height = nextHeight
				}
				visualiser.render()
				return canvas
			} catch (error) {
				fail(error)
				return null
			}
		}
	}
}
