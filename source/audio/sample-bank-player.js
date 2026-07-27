const INTERRUPT_ALL = 'all'
const INTERRUPT_SELF = 'self'

const normaliseBank = (bank, index) => {
	if (!bank || !Array.isArray(bank.samples)) {
		throw new TypeError('A sample bank requires a samples array')
	}

	return Object.freeze({
		...bank,
		id: String(bank.id ?? `bank-${index}`),
		label: bank.label ?? String(bank.id ?? `Bank ${index + 1}`),
		samples: Object.freeze(bank.samples.map(sample =>
			sample ? Object.freeze({ ...sample }) : null
		)),
	})
}

const stopSource = source => {
	if (!source) return false
	try {
		source.stop()
		return true
	} catch (error) {
		if (error?.name !== 'InvalidStateError') throw error
		return false
	}
}

/**
 * Create a cached, preset-based AudioBuffer sample player.
 *
 * A sample can specify `interrupt: "self"` to replace voices on its own pad,
 * `interrupt: true`/`"all"` to stop every voice, and `stopOnRelease: true`
 * to behave like a gated sound.
 */
export const createSampleBankPlayer = ({
	banks = [],
	initialBank,
	getContext,
	getDestination,
	beforePlay,
	load,
	play,
} = {}) => {
	if (typeof load !== 'function' || typeof play !== 'function') {
		throw new TypeError('Sample bank player requires load and play methods')
	}

	const presets = banks.map(normaliseBank)
	if (!presets.length) {
		throw new TypeError('At least one sample bank is required')
	}

	const bankLookup = new Map(presets.map((bank, index) => [bank.id, index]))
	const initialIndex = initialBank == null
		? 0
		: typeof initialBank === 'number'
			? initialBank
			: bankLookup.get(String(initialBank))

	let bankIndex = Number.isInteger(initialIndex) && initialIndex >= 0
		? initialIndex % presets.length
		: 0

	const buffers = new Map()
	const loading = new Map()
	const activeSources = new Map()
	const releasedWhileLoading = new Set()

	const getBank = () => presets[bankIndex]
	const getSample = index => getBank().samples[index] ?? null
	const getSampleKey = (bank, index) => `${bank.id}:${index}`

	const forgetSource = (index, source) => {
		const sources = activeSources.get(index)
		if (!sources) return
		sources.delete(source)
		if (!sources.size) activeSources.delete(index)
	}

	const stop = index => {
		const sources = activeSources.get(index)
		if (!sources) return false
		let stopped = false
		for (const source of Array.from(sources)) {
			stopped = stopSource(source) || stopped
		}
		activeSources.delete(index)
		return stopped
	}

	const stopAll = () => {
		let stopped = false
		for (const index of Array.from(activeSources.keys())) {
			stopped = stop(index) || stopped
		}
		return stopped
	}

	const loadSample = async (index, bank = getBank()) => {
		const sample = bank.samples[index]
		if (!sample?.src) return null

		const key = getSampleKey(bank, index)
		if (buffers.has(key)) return buffers.get(key)
		if (loading.has(key)) return loading.get(key)

		const context = getContext?.()
		if (!context) throw new Error('Audio context is not available')

		const promise = load(context, sample.src, {})
			.then(buffer => {
				buffers.set(key, buffer)
				return buffer
			})
			.finally(() => loading.delete(key))

		loading.set(key, promise)
		return promise
	}

	const loadBank = async (bankReference = getBank().id) => {
		const nextIndex = typeof bankReference === 'number'
			? bankReference
			: bankLookup.get(String(bankReference))
		const bank = presets[nextIndex]
		if (!bank) throw new RangeError(`Unknown sample bank: ${bankReference}`)
		await Promise.all(bank.samples.map((sample, index) =>
			sample?.src ? loadSample(index, bank) : null
		))
		return bank
	}

	const setBank = (bankReference, { stopActive = true } = {}) => {
		const nextIndex = typeof bankReference === 'number'
			? ((bankReference % presets.length) + presets.length) % presets.length
			: bankLookup.get(String(bankReference))
		if (!Number.isInteger(nextIndex)) {
			throw new RangeError(`Unknown sample bank: ${bankReference}`)
		}
		if (stopActive) stopAll()
		releasedWhileLoading.clear()
		bankIndex = nextIndex
		return getBank()
	}

	const previousBank = options => setBank(bankIndex - 1, options)
	const nextBank = options => setBank(bankIndex + 1, options)

	const trigger = async (index, overrides = {}) => {
		const bank = getBank()
		const sample = bank.samples[index]
		if (!sample?.src) return null

		const releaseKey = getSampleKey(bank, index)
		releasedWhileLoading.delete(releaseKey)

		if (sample.interrupt === true || sample.interrupt === INTERRUPT_ALL) {
			stopAll()
		} else if (sample.interrupt === INTERRUPT_SELF) {
			stop(index)
		}

		await beforePlay?.()
		const audioBuffer = await loadSample(index, bank)
		if (!audioBuffer || bank !== getBank()) return null
		if (sample.stopOnRelease && releasedWhileLoading.delete(releaseKey)) return null

		const context = getContext?.()
		const destination = getDestination?.()
		if (!context || !destination) throw new Error('Audio output is not available')

		const options = {
			loop: sample.loop ?? false,
			playbackRate: overrides.playbackRate ?? sample.playbackRate ?? 1,
		}
		let source
		source = play(context, audioBuffer, 0, destination, options, () => {
			forgetSource(index, source)
		})
		if (!activeSources.has(index)) activeSources.set(index, new Set())
		activeSources.get(index).add(source)
		return source
	}

	const release = index => {
		const bank = getBank()
		const sample = bank.samples[index]
		if (!sample?.stopOnRelease) return false
		releasedWhileLoading.add(getSampleKey(bank, index))
		return stop(index)
	}

	return Object.freeze({
		get bank() {
			return getBank()
		},
		get banks() {
			return presets.slice()
		},
		get activeCount() {
			let count = 0
			activeSources.forEach(sources => {
				count += sources.size
			})
			return count
		},
		getSample,
		loadBank,
		setBank,
		previousBank,
		nextBank,
		trigger,
		release,
		stop,
		stopAll,
	})
}
