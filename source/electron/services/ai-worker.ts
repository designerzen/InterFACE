import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'

const DEFAULT_CHECKPOINT = './magenta/checkpoints/chord_pitches_improv'

export interface BackingMelodyServiceOptions {
	staticRoot?: string
	loadRuntime?: (checkpoint: string) => Promise<{
		continueSequence: (seed: any, steps: number, temperature: number, chordProgression: string[]) => Promise<any>
	}>
}

const resolveCheckpointConfig = async (checkpoint: string, staticRoot: string) => {
	if (/^https?:\/\//i.test(checkpoint)) {
		const response = await fetch(`${checkpoint.replace(/\/$/, '')}/config.json`)
		if (!response.ok) {
			throw new Error(`Model could not load (HTTP ${response.status}). Check the model location`)
		}
		return {
			checkpointUrl: checkpoint.replace(/\/$/, ''),
			config: await response.json(),
		}
	}

	const cleaned = checkpoint.replace(/^\.?\//, '').replace(/\/$/, '')
	const localDir = path.resolve(staticRoot, cleaned)
	const configPath = path.join(localDir, 'config.json')
	if (!fs.existsSync(configPath)) {
		throw new Error('Local backing model is missing. Install its checkpoint with pnpm backing:model:install')
	}
	const config = JSON.parse(await fsp.readFile(configPath, 'utf8'))
	return {
		checkpointUrl: `file://${localDir.replace(/\\/g, '/')}`,
		config,
	}
}

const defaultLoadRuntime = async (checkpoint: string, staticRoot: string) => {
	const magentaDir = path.resolve(staticRoot, 'magenta')
	const tfBundle = path.join(magentaDir, 'tfjs-4.22.0.min.js')
	const rnnBundle = path.join(magentaDir, 'music_rnn-1.23.1.js')
	if (!fs.existsSync(tfBundle) || !fs.existsSync(rnnBundle)) {
		throw new Error('Local Magenta runtime bundles are missing. Install with pnpm backing:model:install')
	}

	const sandbox: Record<string, any> = {
		console,
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
		fetch: globalThis.fetch,
		URL,
		TextEncoder,
		TextDecoder,
		Uint8Array,
		Float32Array,
		Int32Array,
		ArrayBuffer,
		DataView,
		performance,
	}
	sandbox.self = sandbox
	sandbox.window = sandbox
	sandbox.globalThis = sandbox

	const context = vm.createContext(sandbox)
	vm.runInContext(await fsp.readFile(tfBundle, 'utf8'), context, { filename: tfBundle })
	vm.runInContext(await fsp.readFile(rnnBundle, 'utf8'), context, { filename: rnnBundle })

	await sandbox.tf.setBackend('cpu')
	await sandbox.tf.ready()

	const { checkpointUrl, config } = await resolveCheckpointConfig(checkpoint, staticRoot)
	const model = new sandbox.music_rnn.MusicRNN(checkpointUrl, config)
	await model.initialize()
	return model
}

export const createBackingMelodyService = (options: BackingMelodyServiceOptions = {}) => {
	const staticRoot = options.staticRoot
		?? process.env.PHOTOSYNTH_STATIC_DIR
		?? path.resolve(process.cwd(), 'static')

	let activeCheckpoint: string | null = null
	let modelPromise: Promise<any> | null = null

	const ensureModel = (checkpoint?: string) => {
		const target = (checkpoint || DEFAULT_CHECKPOINT).trim() || DEFAULT_CHECKPOINT
		if (modelPromise && activeCheckpoint === target) return modelPromise
		activeCheckpoint = target
		const loader = options.loadRuntime
			? () => options.loadRuntime!(target)
			: () => defaultLoadRuntime(target, staticRoot)
		modelPromise = loader().catch(error => {
			if (activeCheckpoint === target) modelPromise = null
			throw error
		})
		return modelPromise
	}

	return {
		async handle(message: { type?: string; checkpoint?: string; seed?: any; chord?: string }) {
			switch (message?.type) {
				case 'initialize':
					await ensureModel(message.checkpoint)
					return { ready: true }
				case 'generate': {
					const model = await ensureModel(message.checkpoint)
					const sequence = await model.continueSequence(message.seed, 16, 0.8, [message.chord])
					return { sequence }
				}
				case 'destroy':
					modelPromise = null
					activeCheckpoint = null
					return { destroyed: true }
				default:
					throw new Error(`Unknown AI command: ${String(message?.type)}`)
			}
		},
		destroy() {
			modelPromise = null
			activeCheckpoint = null
		},
	}
}

const attachPort = (port: Electron.MessagePortMain, service: ReturnType<typeof createBackingMelodyService>) => {
	port.on('message', async event => {
		const { id, ...rest } = event.data ?? {}
		try {
			const result = await service.handle(rest)
			port.postMessage({ id, ok: true, result })
		} catch (error: any) {
			port.postMessage({ id, ok: false, error: error?.message ?? String(error) })
		}
	})
	port.on('close', () => service.destroy())
	port.start()
}

if (process.parentPort) {
	const service = createBackingMelodyService()
	process.parentPort.on('message', event => {
		const { type } = event.data ?? {}
		if (type === 'port' && event.ports?.[0]) {
			attachPort(event.ports[0], service)
		} else if (type === 'shutdown') {
			service.destroy()
			process.exit(0)
		}
	})
}
