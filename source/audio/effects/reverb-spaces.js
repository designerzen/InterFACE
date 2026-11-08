// Curated reverb spaces plus impulse preparation shared by every voice engine.
// Impulses are cached per context so voices using one space share one buffer,
// which lets them share one convolver too.

const ACOUSTICS = './assets/audio/acoustics/'

export const SYNTHETIC_SPACE = 'synthetic'
export const MAX_REVERB_LENGTH = 6

// length is each space's natural decay in seconds; sampled spaces can only be trimmed
export const REVERB_SPACES = Object.freeze([
	{id:SYNTHETIC_SPACE, label:'Synthetic room', length:1.8},
	{id:'small-room', label:'Small room', file:'Voxengo/small_drum_room.wav', length:0.8},
	{id:'drum-room', label:'Drum room', file:'Voxengo/nice_drum_room.wav', length:1.1},
	{id:'studio', label:'Studio', file:'Voxengo/ruby_room.wav', length:1.3},
	{id:'salon', label:'Salon', file:'Voxengo/french_18th_century_salon.wav', length:2},
	{id:'hall', label:'Opera hall', file:'Voxengo/scala_milan_opera_hall.wav', length:2},
	{id:'large-hall', label:'Large hall', file:'Voxengo/large_wide_echo_hall.wav', length:4},
	{id:'church', label:'Church', file:'Voxengo/st_nicolaes_church.wav', length:MAX_REVERB_LENGTH},
	{id:'plate-bright', label:'Bright plate', file:'EMT140-Plate/emt_140_bright_2.wav', length:2.9},
	{id:'plate', label:'Plate', file:'EMT140-Plate/emt_140_medium_2.wav', length:2.9},
	{id:'plate-dark', label:'Dark plate', file:'EMT140-Plate/emt_140_dark_2.wav', length:2.9},
	{id:'cave', label:'Cave', file:'Voxengo/small_prehistoric_cave.wav', length:1.1},
	{id:'garage', label:'Parking garage', file:'Voxengo/parking_garage.wav', length:3.7},
	{id:'star', label:'On a star', file:'Voxengo/on_a_star.wav', length:3.5}
].map(space => Object.freeze(space.file ? {...space, url:`${ACOUSTICS}${space.file}`} : space)))

// Cabinet simulations and sub-200ms clips are not rooms
export const isReverbImpulseFile = url => !/direct_cabinet|deep_space/i.test(url)

/**
 * Resolve a space id or impulse file URL
 * @param {String} value
 * @returns {Object} {id, label, url, length}
 */
export const getReverbSpace = value => {
	const space = REVERB_SPACES.find(space => space.id === value || space.url === value)
	if (space) return space
	if (typeof value === 'string' && /\.(wav|mp3|ogg|flac)$/i.test(value)) {
		return {id:value, label:value.substring(value.lastIndexOf('/')+1), url:value, length:4}
	}
	return REVERB_SPACES[0]
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

// Deterministic noise keeps cached impulses identical between sessions
const createRandom = seed => () => {
	seed = seed + 0x6D2B79F5 | 0
	let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
	t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
	return ((t ^ t >>> 14) >>> 0) / 4294967296 * 2 - 1
}

const onePole = (frequency, sampleRate) => Math.exp(-2 * Math.PI * Math.min(frequency, sampleRate * 0.45) / sampleRate)

/**
 * Generated room: exponential decay (RT60), sparse early reflections,
 * a soft onset and highs that die faster than lows.
 * @param {BaseAudioContext} context
 * @param {Object} options length (RT60 seconds), tone (-1 dark to 1 bright), preDelay (seconds)
 * @returns {AudioBuffer}
 */
export const generateRoomImpulse = (context, {length=1.8, tone=0, preDelay=0.012}={}) => {
	const rate = context.sampleRate
	const rt60 = clamp(length, 0.1, MAX_REVERB_LENGTH)
	const offset = Math.round(clamp(preDelay, 0, 0.2) * rate)
	const tail = Math.max(1, Math.ceil(rt60 * 1.1 * rate))
	const buffer = context.createBuffer(2, offset + tail, rate)
	// bigger rooms spread their reflections and build up more slowly
	const size = clamp(rt60 / 3, 0.1, 1)
	const onset = (0.004 + 0.03 * size) * rate
	const decayRate = 6.9078 / (rt60 * rate)
	const startCutoff = clamp(9000 * 2 ** (tone * 1.2), 1500, 20000)
	const endCutoff = clamp(startCutoff / (5 - tone * 2), 300, startCutoff)
	const fadeLength = Math.ceil(tail * 0.08)
	for (let channel=0; channel<2; channel++) {
		const data = buffer.getChannelData(channel)
		const random = createRandom(0x9e3779b9 * (channel + 1) + Math.round(rt60 * 1000))
		let filtered = 0, pole = 0
		for (let i=0; i<tail; i++) {
			// the damping glide is slow, so update the filter once per block
			if (!(i & 63)) pole = onePole(startCutoff * (endCutoff / startCutoff) ** (i / tail), rate)
			filtered = (1 - pole) * random() + pole * filtered
			const build = i < onset ? (i / onset) ** 2 : 1
			const fade = i > tail - fadeLength ? 0.5 + 0.5 * Math.cos(Math.PI * (i - tail + fadeLength) / fadeLength) : 1
			data[offset + i] = filtered * Math.exp(-decayRate * i) * build * fade * 2
		}
		// early reflections arrive as distinct, decaying echoes, loud enough
		// to stand clear of the diffuse tail that is still building up
		const taps = 8
		for (let tap=0; tap<taps; tap++) {
			const time = (0.003 + (tap + 0.5 + random() * 0.4) / taps * 0.07 * size) * rate
			const index = Math.min(tail - 1, Math.round(time))
			data[offset + index] += (random() < 0 ? -6 : 6) * Math.exp(-decayRate * index) * (1 - tap / taps * 0.5)
		}
	}
	return buffer
}

/**
 * Prepare a decoded impulse file: stereo, pre-delayed, trimmed with a fade
 * so long rooms can be shortened without clicks, then tone shaped.
 * @param {BaseAudioContext} context
 * @param {AudioBuffer} source decodeAudioData output (already at the context rate)
 * @param {Object} options length, tone, preDelay
 * @returns {AudioBuffer}
 */
export const shapeImpulse = (context, source, {length=MAX_REVERB_LENGTH, tone=0, preDelay=0}={}) => {
	const rate = context.sampleRate
	const offset = Math.round(clamp(preDelay, 0, 0.2) * rate)
	const available = source.length
	const trimmed = Math.max(1, Math.min(available, Math.round(clamp(length, 0.1, MAX_REVERB_LENGTH) * rate)))
	const fadeLength = trimmed < available ? Math.min(trimmed, Math.round(Math.max(0.05 * rate, trimmed * 0.3))) : Math.min(trimmed, Math.round(0.01 * rate))
	const buffer = context.createBuffer(2, offset + trimmed, rate)
	const darkPole = tone < 0 ? onePole(16000 * 2 ** (tone * 3.5), rate) : 0
	const brightPole = tone > 0 ? onePole(2500, rate) : 0
	for (let channel=0; channel<2; channel++) {
		const input = source.getChannelData(Math.min(channel, source.numberOfChannels - 1))
		const data = buffer.getChannelData(channel)
		let low = 0
		for (let i=0; i<trimmed; i++) {
			let sample = input[i]
			if (darkPole) sample = low = (1 - darkPole) * sample + darkPole * low
			else if (brightPole) {
				low = (1 - brightPole) * sample + brightPole * low
				sample += (sample - low) * tone * 1.5
			}
			const fadeIndex = i - (trimmed - fadeLength)
			data[offset + i] = fadeIndex > 0 ? sample * (0.5 + 0.5 * Math.cos(Math.PI * fadeIndex / fadeLength)) : sample
		}
	}
	return buffer
}

const decoded = new WeakMap()
const prepared = new WeakMap()
const cacheFor = (store, context) => {
	let cache = store.get(context)
	if (!cache) { cache = new Map(); store.set(context, cache) }
	return cache
}

const remember = (cache, key, pending, limit) => {
	cache.set(key, pending)
	if (cache.size > limit) cache.delete(cache.keys().next().value)
	pending.catch(() => { if (cache.get(key) === pending) cache.delete(key) })
	return pending
}

const decodeImpulse = (context, url) => {
	const cache = cacheFor(decoded, context)
	if (cache.has(url)) return cache.get(url)
	return remember(cache, url, (async () => {
		const response = await fetch(url)
		if (!response.ok) throw Error(`Could not load reverb: ${response.status}`)
		return context.decodeAudioData(await response.arrayBuffer())
	})(), 8)
}

/**
 * Shared impulse for a space; identical options return the same buffer
 * @param {BaseAudioContext} context
 * @param {Object} options space (id or url), length, tone, preDelay, fallback (use synthetic if a file fails)
 * @returns {Promise<AudioBuffer>}
 */
export const getReverbImpulse = (context, {space=SYNTHETIC_SPACE, length, tone=0, preDelay=0.012, fallback=false}={}) => {
	const resolved = getReverbSpace(space)
	length = clamp(Number(length ?? resolved.length) || resolved.length, 0.1, MAX_REVERB_LENGTH)
	const cache = cacheFor(prepared, context)
	const key = `${resolved.url ?? resolved.id}|${length}|${tone}|${preDelay}`
	if (cache.has(key)) return cache.get(key)
	return remember(cache, key, (async () => {
		if (!resolved.url) return generateRoomImpulse(context, {length, tone, preDelay})
		try {
			return shapeImpulse(context, await decodeImpulse(context, resolved.url), {length, tone, preDelay})
		} catch (error) {
			if (!fallback) throw error
			console.warn('Reverb impulse unavailable, using a synthetic room', resolved.url, error)
			return generateRoomImpulse(context, {length:Math.min(length, 2.5), tone, preDelay})
		}
	})(), 8)
}
