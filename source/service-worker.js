import { VERSION } from './version'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { RangeRequestsPlugin } from 'workbox-range-requests'
import { registerRoute, setCatchHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

const CACHE_PREFIX = 'phs'
const CACHE_VERSION = `v${VERSION}`
const CORE_AUDIO_MANIFEST = 'offline-audio.json'
const CORE_AUDIO_CACHE = `${CACHE_PREFIX}-core-audio-${CACHE_VERSION}`
const RUNTIME_AUDIO_CACHE = `${CACHE_PREFIX}-runtime-audio-${CACHE_VERSION}`
const CORE_AUDIO_PATH = '/assets/audio/OpenGM24/acoustic_grand_piano-mp3/'
const OWNED_CACHE_PREFIXES = [`${CACHE_PREFIX}-`, 'static-media']
const AUDIO_FILE_PATTERN = /\.(?:aac|flac|m4a|mp3|oga|ogg|opus|wav|webm)(?:$|\?)/i
const MODEL_FILE_PATTERN = /\.(?:task|tflite|wasm)(?:$|\?)/i
const ONE_DAY = 60 * 60 * 24
let audioCachePromise = null

self.__WB_DISABLE_DEV_LOGS = process.env.NODE_ENV !== 'development'

setCacheNameDetails({
	prefix: CACHE_PREFIX,
	suffix: CACHE_VERSION,
	precache: 'installtime',
	runtime: 'runtime',
})

// Replaced with the production asset manifest by actions/offline.mjs.
// A failed download keeps the previous service worker active.
precacheAndRoute(self.__WB_MANIFEST, {
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
})
cleanupOutdatedCaches()
clientsClaim()

const broadcast = async message => {
	const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
	clients.forEach(client => client.postMessage(message))
}

const cacheCoreAudio = async () => {
	const manifestURL = new URL(CORE_AUDIO_MANIFEST, self.registration.scope)
	const response = (await matchPrecache(CORE_AUDIO_MANIFEST)) ||
		await fetch(manifestURL, { cache: 'no-cache' })
	if (!response.ok) throw new Error(`Unable to load ${manifestURL}: ${response.status}`)

	const manifest = await response.json()
	if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
		throw new Error('The core offline audio manifest is empty')
	}

	const cache = await caches.open(CORE_AUDIO_CACHE)
	const files = manifest.files.map(file => new URL(file.url, self.registration.scope))
	let completed = 0

	for (const url of files) {
		if (await cache.match(url)) completed++
	}
	await broadcast({
		type: 'OFFLINE_AUDIO_PROGRESS',
		completed,
		total: files.length,
		totalBytes: manifest.totalBytes,
	})

	// Store full 200 responses so RangeRequestsPlugin can serve offline seeks.
	for (let index = 0; index < files.length; index += 4) {
		await Promise.all(files.slice(index, index + 4).map(async url => {
			const request = new Request(url, { credentials: 'same-origin' })
			if (await cache.match(request)) return
			const audioResponse = await fetch(request)
			if (!audioResponse.ok || audioResponse.status !== 200) {
				throw new Error(`Unable to cache core audio ${url}: ${audioResponse.status}`)
			}
			await cache.put(request, audioResponse)
			completed++
			await broadcast({
				type: 'OFFLINE_AUDIO_PROGRESS',
				completed,
				total: files.length,
				totalBytes: manifest.totalBytes,
			})
		}))
	}

	await broadcast({
		type: 'OFFLINE_AUDIO_READY',
		completed,
		total: files.length,
		totalBytes: manifest.totalBytes,
	})
}

self.addEventListener('message', event => {
	if (event.data?.type === 'SKIP_WAITING') {
		event.waitUntil(self.skipWaiting())
	}
	if (event.data?.type === 'CACHE_OFFLINE_AUDIO') {
		if (!audioCachePromise) {
			audioCachePromise = cacheCoreAudio()
			.catch(error => broadcast({
				type: 'OFFLINE_AUDIO_ERROR',
				message: error.message,
			}))
			.finally(() => { audioCachePromise = null })
		}
		event.waitUntil(audioCachePromise)
	}
})

self.addEventListener('activate', event => {
	event.waitUntil((async () => {
		const cacheNames = await caches.keys()
		await Promise.all(cacheNames.map(cacheName => {
			const owned = OWNED_CACHE_PREFIXES.some(prefix => cacheName.startsWith(prefix))
			const current = cacheName.includes(CACHE_VERSION)
			return owned && !current ? caches.delete(cacheName) : Promise.resolve(false)
		}))
	})())
})

const pageStrategy = new NetworkFirst({
	cacheName: `${CACHE_PREFIX}-pages-${CACHE_VERSION}`,
	networkTimeoutSeconds: 3,
	plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
})

registerRoute(
	({ request }) => request.mode === 'navigate',
	async options => {
		try {
			return await pageStrategy.handle(options)
		} catch {
			return (await matchPrecache('index.html')) || Response.error()
		}
	},
)

registerRoute(
	({ request }) => ['script', 'style', 'worker'].includes(request.destination),
	new StaleWhileRevalidate({
		cacheName: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
		plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
	}),
)

registerRoute(
	({ url }) => url.pathname.includes(CORE_AUDIO_PATH),
	new CacheFirst({
		cacheName: CORE_AUDIO_CACHE,
		plugins: [
			new CacheableResponsePlugin({ statuses: [200] }),
			new RangeRequestsPlugin(),
		],
	}),
)

registerRoute(
	({ request, url }) =>
		request.destination === 'audio' ||
		request.destination === 'video' ||
		AUDIO_FILE_PATTERN.test(url.pathname),
	new CacheFirst({
		cacheName: RUNTIME_AUDIO_CACHE,
		plugins: [
			new CacheableResponsePlugin({ statuses: [200] }),
			new RangeRequestsPlugin(),
			new ExpirationPlugin({
				maxEntries: 512,
				maxAgeSeconds: ONE_DAY * 90,
				purgeOnQuotaError: true,
			}),
		],
	}),
)

registerRoute(
	({ url }) => MODEL_FILE_PATTERN.test(url.pathname),
	new CacheFirst({
		cacheName: `${CACHE_PREFIX}-models-${CACHE_VERSION}`,
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({
				maxEntries: 80,
				maxAgeSeconds: ONE_DAY * 90,
				purgeOnQuotaError: true,
			}),
		],
	}),
)

registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({
				maxEntries: 120,
				maxAgeSeconds: ONE_DAY * 30,
				purgeOnQuotaError: true,
			}),
		],
	}),
)

setCatchHandler(async ({ request }) => {
	if (request.destination === 'document') {
		return (await matchPrecache('index.html')) || Response.error()
	}
	return Response.error()
})
