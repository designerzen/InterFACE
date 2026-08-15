/**
 * Electron renderer bootstrap. The application itself is shared with the web
 * build through interface.js; only desktop capabilities are composed here.
 */
import { VERSION } from './version.js'
import { setLoadProgress } from './dom/load-progress.js'
import { getBrowserLocales } from './locales/i18n.js'
import { getDomainDefaults, INSTRUMENT_OPTIONS } from './settings/options.js'
import { createStore } from './utils/store.js'
import { showError } from './dom/errors.js'
import { addKeyboardEvents } from './interface-keyboard.js'
import { addGamePadEvents } from './interface-gamepad.js'
import { addPicadeMaxEvents } from './interface-picade-max.js'
import Capabilities from './capabilities.js'
import Attractor from './attractor.js'
import {
	createInterface,
	getElectronMIDIConnectionClasses,
} from './interface-electron.js'

const body = document.documentElement
const electronRuntime = globalThis.electron
const debugMode = electronRuntime?.runtime?.debug ?? false

body.classList.toggle('loading', true)
body.classList.toggle('debug', debugMode)
body.classList.add('interface', 'desktop')

const applyGlobalOptions = defaults => {
	const options = { ...defaults }
	const globalOptions = globalThis._synth ?? {}

	for (const key of Object.keys(globalOptions)) {
		if (Object.hasOwn(options, key)) options[key] = globalOptions[key]
	}

	return options
}

const reportLoadProgress = (progress, message, hideLoader = false) => {
	if (hideLoader) {
		setLoadProgress(progress, '', true)
	} else if (progress < 1) {
		setLoadProgress(progress, message)
	} else {
		setLoadProgress(1, 'Ready!', true)
	}
}

const start = async () => {
	setLoadProgress(0.5, ' ')

	const capabilities = new Capabilities()
	const options = applyGlobalOptions(getDomainDefaults())
	const language = (getBrowserLocales()[0] ?? 'en').split('-')[0]

	const application = await createInterface(
		options,
		createStore(),
		capabilities,
		INSTRUMENT_OPTIONS.list,
		getElectronMIDIConnectionClasses(),
		language,
		reportLoadProgress,
	)

	application.setAutomator(new Attractor(application))
	addKeyboardEvents(application)

	if (application.getState('gamePad')) {
		addPicadeMaxEvents(application)
		addGamePadEvents(application)
	}

	console.info(`PhotoSYNTH Desktop ${VERSION} ready`, {
		application,
		nativeMIDI: electronRuntime?.midi?.available ?? false,
	})
}

start().catch(error => {
	body.classList.add('failed')
	setLoadProgress(1, '', true)
	showError(error, 'PhotoSYNTH Desktop could not start', true)
	console.error('PhotoSYNTH Desktop startup failed', error)
})
