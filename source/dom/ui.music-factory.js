import {createMusicFactory} from '../audio/music-factory.js'
import {createMusicFactoryPlayer} from '../audio/music-factory-player.js'
import {MUSIC_FACTORY_PROFILES, musicFactoryGenreForPreset} from '../audio/music-factory-profiles.js'
import {recordSessionEvent} from '../storage/session-events.js'

export const setupMusicFactory = ({context, destination, stateMachine, onMode, onProfile, document=globalThis.document, window=globalThis.window}) => {
	const toggle = document.getElementById('button-music-factory')
	const controls = document.getElementById('music-factory-controls')
	const genre = document.getElementById('music-factory-genre')
	const status = document.getElementById('music-factory-status')
	const finish = document.getElementById('music-factory-finish')
	const fresh = document.getElementById('music-factory-new')
	const abort = new AbortController()
	let transportPaused = false
	const controller = createMusicFactory({
		player:createMusicFactoryPlayer(context, destination, recordSessionEvent),
		onMode:enabled => {
			if (toggle) toggle.checked = enabled
			if (controls) controls.hidden = !enabled
			toggle?.parentElement.classList.toggle('checked', enabled)
			onMode?.(enabled)
		},
		onProfile,
		onStatus:message => { if (status) status.textContent = message }
	})
	const settings = () => Object.fromEntries(['musicFactory', 'musicFactoryGenre', 'musicFactorySeed', 'players', 'key', 'bpm', 'muted', 'performanceDrums', 'rapidPercussion'].map(key => [key, stateMachine.get(key)]))
	const newSeed = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
	const configure = () => {
		if (stateMachine.get('musicFactory') && !stateMachine.get('musicFactorySeed')) stateMachine.set('musicFactorySeed', newSeed())
		controller.configure(settings())
		if (genre) genre.value = controller.profile.id
	}
	if (genre) {
		for (const profile of MUSIC_FACTORY_PROFILES) {
			const option = document.createElement('option')
			option.value = profile.id; option.textContent = profile.title; genre.append(option)
		}
		genre.addEventListener('change', () => { stateMachine.set('musicFactoryGenre', genre.value); configure() }, {signal:abort.signal})
	}
	toggle?.addEventListener('change', () => {
		stateMachine.set('musicFactory', toggle.checked)
		if (toggle.checked && context.state === 'suspended') context.resume().catch(() => {})
		configure()
	}, {signal:abort.signal})
	finish?.addEventListener('click', () => controller.finish(), {signal:abort.signal})
	fresh?.addEventListener('click', () => { stateMachine.set('musicFactorySeed', newSeed()); configure() }, {signal:abort.signal})
	document.getElementById('timer-toggle')?.addEventListener('change', event => {
		transportPaused = !event.currentTarget.checked
		controller.pause(transportPaused || document.hidden)
	}, {signal:abort.signal})
	document.addEventListener('visibilitychange', () => controller.pause(document.hidden || transportPaused), {signal:abort.signal})
	window.addEventListener('pagehide', event => { if (event.persisted) controller.pause(true); else api.destroy() }, {signal:abort.signal})
	window.addEventListener('pageshow', () => controller.pause(document.hidden || transportPaused), {signal:abort.signal})
	configure()
	if (toggle) toggle.checked = controller.enabled
	if (controls) controls.hidden = !controller.enabled
	const api = {
		get enabled() { return controller.enabled },
		get percussion() { return controller.percussion },
		get drumArranger() { return controller.drumArranger },
		get ensemble() { return controller.ensemble },
		observe:(...args) => controller.observe(...args),
		tick:tick => { configure(); controller.tick(tick) },
		selectPreset(preset) {
			stateMachine.set('musicFactoryGenre', musicFactoryGenreForPreset(preset)); configure()
		},
		pause:value => { transportPaused = value; controller.pause(value || document.hidden) },
		stop:() => controller.stop(),
		destroy:() => { abort.abort(); controller.destroy() }
	}
	return api
}
