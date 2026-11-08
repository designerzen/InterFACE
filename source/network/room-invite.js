import { validRoomId, getRoomURL } from './room-url.js'

const MAX_BYTES = 32768
export const INVITE_LIFETIME_MS = 10 * 60 * 1000
export const PAIRING_PREFIX = '#pair='

export const validateBundle = (bundle, now = Date.now()) => {
	if (!bundle || bundle.version !== 1 || !['offer', 'answer'].includes(bundle.description?.type)
		|| typeof bundle.description.sdp !== 'string' || !bundle.description.sdp.startsWith('v=0')
		|| bundle.description.sdp.length > MAX_BYTES || !validRoomId(bundle.roomId)
		|| ![bundle.hostId, bundle.guestId, bundle.inviteId].every(validRoomId)
		|| bundle.hostId === bundle.guestId || !Number.isSafeInteger(bundle.expires)
		|| bundle.expires <= now || bundle.expires > now + INVITE_LIFETIME_MS + 60000) {
		throw new Error('Invalid or expired pairing link. Ask the host for a new invitation.')
	}
	return bundle
}

const readBounded = async stream => {
	const reader = stream.getReader(), chunks = []
	let length = 0
	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			length += value.length
			if (length > MAX_BYTES) { await reader.cancel(); throw new Error('Pairing data is too large') }
			chunks.push(value)
		}
	} finally { reader.releaseLock() }
	const bytes = new Uint8Array(length)
	let offset = 0
	for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
	return bytes
}

export const encodeBundle = async bundle => {
	validateBundle(bundle)
	const input = new TextEncoder().encode(JSON.stringify(bundle))
	if (input.length > MAX_BYTES) throw new Error('Pairing data is too large')
	const bytes = await readBounded(new Blob([input]).stream().pipeThrough(new CompressionStream('gzip')))
	return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export const decodeBundle = async input => {
	let token = String(input).trim()
	if (token.includes(PAIRING_PREFIX)) token = token.slice(token.indexOf(PAIRING_PREFIX) + PAIRING_PREFIX.length)
	if (!token || token.length > MAX_BYTES * 2 || !/^[\w-]+$/.test(token)) throw new Error('Paste a complete invitation or response link')
	try {
		const bytes = Uint8Array.from(atob(token.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0))
		const decoded = await readBounded(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')))
		return validateBundle(JSON.parse(new TextDecoder().decode(decoded)))
	} catch (error) { throw new Error(`Unable to read pairing link: ${error.message}`) }
}

export const getPairingURL = async (base, bundle) => {
	const url = getRoomURL(base, bundle.roomId)
	url.search = ''
	url.hash = `pair=${await encodeBundle(bundle)}`
	return url
}
