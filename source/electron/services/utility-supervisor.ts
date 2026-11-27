import { MessageChannelMain, utilityProcess } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

export type UtilityServiceName = 'hardware' | 'storage' | 'ai' | 'network'

export interface UtilityServiceSpec {
	name: UtilityServiceName
	modulePath: string
	env?: Record<string, string>
	maxRestarts?: number
}

interface ManagedService {
	spec: UtilityServiceSpec
	child: Electron.UtilityProcess | null
	restarts: number
	stopping: boolean
	restartTimer: ReturnType<typeof setTimeout> | null
}

const DEFAULT_MAX_RESTARTS = 4

export class UtilitySupervisor {
	private services = new Map<UtilityServiceName, ManagedService>()
	private logger: Pick<Console, 'info' | 'warn' | 'error'>

	constructor(logger: Pick<Console, 'info' | 'warn' | 'error'> = console) {
		this.logger = logger
	}

	register(spec: UtilityServiceSpec) {
		if (this.services.has(spec.name)) {
			throw new Error(`Utility service "${spec.name}" is already registered`)
		}
		this.services.set(spec.name, {
			spec,
			child: null,
			restarts: 0,
			stopping: false,
			restartTimer: null,
		})
	}

	isAvailable(name: UtilityServiceName): boolean {
		const entry = this.services.get(name)
		if (!entry) return false
		return fs.existsSync(entry.spec.modulePath)
	}

	ensureStarted(name: UtilityServiceName): Electron.UtilityProcess | null {
		const entry = this.services.get(name)
		if (!entry) return null
		if (entry.child) return entry.child
		if (!fs.existsSync(entry.spec.modulePath)) {
			this.logger.warn(`[UtilitySupervisor] Module missing for "${name}": ${entry.spec.modulePath}`)
			return null
		}

		entry.stopping = false
		const child = utilityProcess.fork(entry.spec.modulePath, [], {
			serviceName: `photosynth-${name}`,
			env: {
				...process.env,
				...(entry.spec.env ?? {}),
			},
		})

		entry.child = child

		child.on('spawn', () => {
			entry.restarts = 0
			this.logger.info(`[UtilitySupervisor] Spawned "${name}" (${path.basename(entry.spec.modulePath)})`)
		})

		child.on('exit', code => {
			if (entry.child === child) entry.child = null
			if (entry.stopping || code === 0) return

			const limit = entry.spec.maxRestarts ?? DEFAULT_MAX_RESTARTS
			if (entry.restarts < limit) {
				entry.restarts += 1
				const delayMs = Math.min(5000, 300 * 2 ** (entry.restarts - 1))
				this.logger.warn(`[UtilitySupervisor] "${name}" exited with code ${code}; restarting in ${delayMs}ms (${entry.restarts}/${limit})`)
				entry.restartTimer = setTimeout(() => {
					entry.restartTimer = null
					if (!entry.stopping) this.ensureStarted(name)
				}, delayMs)
			} else {
				this.logger.error(`[UtilitySupervisor] "${name}" crashed repeatedly (code ${code}); leaving stopped`)
			}
		})

		return child
	}

	/**
	 * Creates a direct MessageChannelMain between a renderer WebContents and a
	 * managed utilityProcess, bypassing the main process event loop for hot paths.
	 */
	openChannel(
		name: UtilityServiceName,
		webContents: Electron.WebContents,
		channel: string,
		token: string,
	): boolean {
		if (webContents.isDestroyed()) return false
		const child = this.ensureStarted(name)
		if (!child) return false

		const { port1, port2 } = new MessageChannelMain()
		child.postMessage({ type: 'port', channel }, [port1])
		webContents.postMessage('electron:port', { service: name, channel, token }, [port2])
		return true
	}

	stop(name: UtilityServiceName) {
		const entry = this.services.get(name)
		if (!entry) return
		entry.stopping = true
		if (entry.restartTimer) {
			clearTimeout(entry.restartTimer)
			entry.restartTimer = null
		}
		if (entry.child) {
			try {
				entry.child.postMessage({ type: 'shutdown' })
			} catch {}
			try {
				entry.child.kill()
			} catch {}
			entry.child = null
		}
	}

	stopAll() {
		for (const name of this.services.keys()) {
			this.stop(name)
		}
	}
}
