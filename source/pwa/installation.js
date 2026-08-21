import { VERSION } from '../version.js'
import { isInWebAppiOS, isIOS, isTWAAndroid, isMicrosoftStore, isFirefox } from './platform.js'

const SERVICE_WORKER_URL = '/service-worker.js'
const DISPLAY_MODES = ['fullscreen', 'standalone', 'minimal-ui', 'window-controls-overlay']
const INSTALLED_VERSION_KEY = 'photosynth'

let deferredPrompt = null
let activeRegistration = null

const requestOfflineAudio = registration => {
	registration?.active?.postMessage({ type: 'CACHE_OFFLINE_AUDIO' })
}

const isInWebAppChrome = DISPLAY_MODES.some(mode =>
	window.matchMedia(`(display-mode: ${mode})`).matches,
)
const isRunningAsApp = isInWebAppiOS || isInWebAppChrome || isTWAAndroid || isMicrosoftStore

export const isSupportingBrowser = 'serviceWorker' in navigator

const dispatch = (name, detail = {}) => {
	window.dispatchEvent(new CustomEvent(name, { detail }))
}

navigator.serviceWorker?.addEventListener('message', event => {
	if (event.data?.type === 'OFFLINE_AUDIO_PROGRESS') {
		dispatch('photosynth:offline-progress', event.data)
	}
	if (event.data?.type === 'OFFLINE_AUDIO_READY') {
		dispatch('photosynth:offline-ready', event.data)
	}
	if (event.data?.type === 'OFFLINE_AUDIO_ERROR') {
		dispatch('photosynth:offline-error', event.data)
	}
})

window.addEventListener('online', () => requestOfflineAudio(activeRegistration))

window.addEventListener('beforeinstallprompt', event => {
	event.preventDefault()
	deferredPrompt = event
	dispatch('photosynth:install-available', { prompt: event })
})

window.addEventListener('appinstalled', () => {
	deferredPrompt = null
	dispatch('photosynth:installed')
})

const watchForUpdate = registration => {
	const announceWaitingWorker = worker => {
		if (!worker || worker.state !== 'installed' || !navigator.serviceWorker.controller) return
		dispatch('photosynth:update-ready', { registration, worker })
	}

	if (registration.waiting) announceWaitingWorker(registration.waiting)

	registration.addEventListener('updatefound', () => {
		const worker = registration.installing
		if (!worker) return
		worker.addEventListener('statechange', () => announceWaitingWorker(worker))
	})

	navigator.serviceWorker.ready.then(readyRegistration => {
		dispatch('photosynth:offline-shell-ready', { registration: readyRegistration })
		requestOfflineAudio(readyRegistration)
	})
}

const registerServiceWorker = async () => {
	if (!isSupportingBrowser) return null

	const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
		type: 'module',
		updateViaCache: 'none',
	})

	activeRegistration = registration
	watchForUpdate(registration)
	await registration.update()
	return registration
}

const showInstallPrompt = async button => {
	if (!deferredPrompt) {
		return { success: false, log: 'The browser install prompt is not currently available' }
	}

	button.disabled = true
	const prompt = deferredPrompt
	await prompt.prompt()
	const choice = await prompt.userChoice
	const success = choice.outcome === 'accepted'

	if (success) {
		deferredPrompt = null
		button.hidden = true
		if (navigator.storage?.persist) await navigator.storage.persist()
	} else {
		button.disabled = false
	}

	return {
		success,
		log: success ? 'PhotoSYNTH was installed' : 'Installation was dismissed',
	}
}

const activateWaitingWorker = async registration => {
	let waitingWorker = registration?.waiting

	if (!waitingWorker) {
		await registration?.update()
		waitingWorker = registration?.waiting
	}

	if (!waitingWorker) return false

	await new Promise(resolve => {
		let changed = false
		const onControllerChange = () => {
			if (changed) return
			changed = true
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
			resolve()
		}
		navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
		waitingWorker.postMessage({ type: 'SKIP_WAITING' })
	})

	window.location.reload()
	return true
}

export const uninstall = async () => {
	if ('serviceWorker' in navigator) {
		const registrations = await navigator.serviceWorker.getRegistrations()
		await Promise.all(registrations.map(registration => registration.unregister()))
	}

	if ('caches' in window) {
		const cacheNames = await caches.keys()
		await Promise.all(cacheNames
		.filter(cacheName => cacheName.startsWith('phs-') || cacheName === 'static-media')
		.map(cacheName => caches.delete(cacheName)))
	}

	localStorage.removeItem(INSTALLED_VERSION_KEY)
	window.location.reload()
}

export const showChangelog = async domElement => {
	const { fetchChangesAsText } = await import('./changes.js')
	const changes = await fetchChangesAsText('changelog')
	if (domElement) domElement.innerHTML = changes
	return changes
}

export const installOrUpdate = async (debug = false) => {
	const isFirstRun = isSupportingBrowser && navigator.serviceWorker.controller === null
	const registration = await registerServiceWorker()
	const updatesAvailable = Boolean(registration?.waiting && navigator.serviceWorker.controller)
	const previousVersion = localStorage.getItem(INSTALLED_VERSION_KEY)

	localStorage.setItem(INSTALLED_VERSION_KEY, VERSION)

	const state = {
		log: [
			`Service worker ${registration ? 'registered' : 'unavailable'}`,
			`Application version ${VERSION}`,
		],
		online: navigator.onLine,
		offline: !navigator.onLine,
		previousVersion,
		currentVersion: VERSION,
		isInstallable: Boolean(deferredPrompt),
		isFirstRun,
		isRunningAsApp,
		isInstalled: isRunningAsApp,
		hasUpdates: updatesAvailable,
		updatesAvailable,
		updating: Boolean(registration?.installing),
		updated: false,
		newVersionAvailable: updatesAvailable,
		prompt: deferredPrompt,
		install: button => showInstallPrompt(button),
		update: () => activateWaitingWorker(activeRegistration || registration),
		ios: isIOS,
		android: isTWAAndroid,
		microsoft: isMicrosoftStore,
		firefox: isFirefox(),
		pwa: isRunningAsApp,
		displayMode: DISPLAY_MODES.filter(mode => window.matchMedia(`(display-mode: ${mode})`).matches),
	}

	if (debug) console.info('PWA state', state)
	return state
}
