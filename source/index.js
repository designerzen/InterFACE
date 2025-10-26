
/**
 * This is the default root loader for the app
 * It is responsible for loading in as much data upfront as possible
 * before showing a UI from those external libs
 * http://localhost:909/?advancedMode=false&showSettings=false&showPiano=false&metronome=false&backingTrack=false&clear=false&synch=true&disco=false&overlays=true&masks=true&eyes=true&quantise=true&text=true&spectrogram=true&speak=true&debug=true&muted=false&duet=false&stereo=true&stereoPan=true&midiChannel=all&bpm=200&autoHide=false&loadMIDIPerformance=false&useGamePad=true&model=face&instrumentPack=FatBoy&instrumentPacks=FatBoy%2CFluidR3_GM%2CMusyngKite&photoSensitive=false&automationMode=false
 */
import { VERSION } from './version'
import { getReferer, getRefererHostname, forceSecure, getEditionFromURL } from './utils/location-handler'
import { setLoadProgress } from './dom/load-progress.js'
import { getBrowserLocales } from './locales/i18n.js'
import { getDomainDefaults, INSTRUMENT_OPTIONS } from './settings/options'
import { showChangelog, installOrUpdate, uninstall } from './pwa/installation.js'
import { showError } from './dom/errors'
import { addToolTips, setToast } from './dom/tooltips'
import { MOUSE_HELD, MOUSE_TAP, addMouseTapAndHoldEvents } from './hardware/mouse'
import Capabilities from './capabilities'
import { updateCapabalitiesTable } from './dom/compatability.js'
import { APPLICATION_EVENTS, createInterface } from './interface.js'

import WebMIDIClass from './audio/midi/midi-connection-webmidi.js'

// TESTING
// for custom path editions rather than on unique domains
// instead you can have over-rides both in the globalThis._synth space
// or else via a named route here
const DOMAIN = getEditionFromURL()[0]
const HOST = getRefererHostname()
const LTD = HOST.split('.').pop()

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === "development"
const body = document.documentElement
const debugMode = IS_DEVELOPMENT_MODE || new URLSearchParams(window.location.search).has("debug")

// if on http flip to https and exit
forceSecure(IS_DEVELOPMENT_MODE)

// start loading / updating..."loading",
// NB. see _base.pug for double of this - this is just in case
body.classList.toggle("loading", true)
body.classList.add(debugMode ? "debug" : LTD)
// add a special class to the app to frame it
body.classList.toggle("interface", true)

// This teaches us which kind of an app this is, can be,
// and what we can do with the tech installed in this device
const capabilities = new Capabilities()

const versionElement = document.getElementById("version")
const runningVersion = versionElement.innerText

// FIXME: show updates button
const showUpgradeDialog = () => {
	const updateButton = document.getElementById("button-update")
	const changes = showChangelog(document.getElementById("changelog"))
	document.getElementById("pwa").setAttribute("open", true)
	updateButton.setAttribute("hidden", false)
}

// set window.title if it has changed
const setTitle = title => {
	if (document.title !== title) {
		document.title = title
	}
}

const updateSummaryText = (returning = false) => {
	// TODO: Check state to see if this is a fresh session or a return then update the front end accordingly
	const summaries = document.querySelectorAll('p[aria-label="Summary"]')

	if (!summaries || summaries.length < 2) {
		console.info('No summary field p[aria-label="Summary"] present on DOM')
		return
	}
	// if (returning){ summaries[0].setAttribute("hidden",true); summaries[1].removeAttribute("hidden") }
	// p(aria-label="Summary" hidden).returning-client.

	// Show the returning user message and update as neccessary :)
	summaries[0].hidden = returning
	summaries[1].hidden = !returning
}

/**
 * Start loading the app and dependencies
 */
const start = async () => {

	setLoadProgress(0.5, " ")

	// if we have a specific referer, we can change the options accordingly
	// allow different domains to show different styles / options / configs
	// current domains that point this way include :
	// interface.place
	// interface.lol	<- defaults to simple 'kid' mode
	// interface.band	<- defaults to duet mode
	// const referer = getReferer()

	
	// we can also inject specific options through an object set
	// in a global space in the DOM script for custom html options
	const globalOptions = Object.assign({}, globalThis._synth)
	// then we fetch the defaults for this domain if specified
	const domainOptions = getDomainDefaults(HOST)
	// now combine both data sets
	const defaultOptions = { ...domainOptions }
	// only overwrite objects with the same keys!
	const validOptionKeys = Object.keys(defaultOptions)
	// favour global options over domain options
	Object.keys(globalOptions).forEach(key => validOptionKeys.indexOf(key) > -1 ? defaultOptions[key] = globalOptions[key] : null)


	console.info( "Options:", {globalOptions, domainOptions, defaultOptions, validOptionKeys })

	// determine the language to use
	const languages = getBrowserLocales()

	// we only want the first part before any hyphens
	// NB. we *only* have en right now so show that
	const language = (languages[languages.length - 1]).split('-')[0]

	// and the start time for metrics
	let startLoadTime = Date.now()
	let failed = false

	const loadInterfaceAndAssembleApplication = async () => {

		// import { createStore} from './store'
		const { createStore } = await import('./utils/store')

		// This is tweaking out on CloudFlare.
		// I don't know why it is not working, but it might be path related?
		// if (!WebMIDIClass)
		// {
		// 	WebMIDIClass = await import('./audio/midi/midi-connection-webmidi.js').default
		// }
		// const {createInterface:create} = await import( "./interface.js")
		// const testMIDI = (await import( "./audio/instruments/instrument.midi.js")).default

		const store = createStore()
		const title = document.title

		const application = await createInterface(
			defaultOptions,
			store,
			capabilities,
			/* You can pass in an object or a string! */
			INSTRUMENT_OPTIONS.list,
			[WebMIDIClass],
			language,
			(loadProgress, message, hideLoader = false) => {

				// console.info("Loading...", loadProgress, message)
				if (failed) {
					// already failed so why show more loading?
					console.error("FATAL : Failed to load", { loadProgress, message, hideLoader })
					throw Error("Failed to load due to an unexpected error")
				}

				if (loadProgress !== 0.5) {
					// reset the timer during the half time show
					startLoadTime = Date.now()
				}

				// const elapsed = Date.now() - startLoadTime
				// console.info("Loading ", elapsed)
				// if (elapsed > LOAD_TIMEOUT)
				// {
				// 	failed = true
				// 	setLoadProgress( 
				// 		0, 
				// 		"Oh no!",
				// 		true
				// 	)
				// 	showError( "Couldn't load everything", "Occasssionally I fall apart and require a refresh! Sorry!" )
				// }
				// else 

				if (hideLoader) {
					setLoadProgress(
						loadProgress,
						"",
						true
					)
					setTitle(title)

				} else if (loadProgress < 1) {

					// const rectifiedProgress = halfLoaded ? loadProgress * 0.5 : 0.5 + loadProgress * 0.5
					// console.log( "Interface: loaded", {rectifiedProgress} )
					setLoadProgress(
						loadProgress,
						message
					)
					setTitle(`${title} - ${Math.ceil(loadProgress * 100)} %`)

				} else {

					setLoadProgress(1, "Ready!", true)
					setTitle(title)
				}
			}
		)

		const onAvailable = async () => {
			// console.log("Attract mode!", {automator, application})
			// Load in in automation
			const Attractor = (await import('./attractor')).default

			// This allows for remote control as well as allowing the
			// app to change parameters on it's own
			const automator = application.setAutomator(new Attractor(application))

			// load in our controllers
			const { addKeyboardEvents } = (await import('./interface-keyboard.js'))

			// and create our input handlers 
			addKeyboardEvents(application)

			// Watch CONTROLLERS
			const { addGamePadEvents } = (await import('./interface-gamepad.js'))
			if (application.getState("gamePad")) {
				addGamePadEvents(application)
			}

			// Watch for External SYNCHING 
			// COMMS --------------------------------------------------------------

			/*
			// if we have synching
			// if we want to load in the realtime synch engine
			const {monitorBroadCastChannel} = await import("./interface-channel.js")

			if (monitorBroadCastChannel)
			{
				// allow the clock to be controlled externally
				// ensure clock exists before calling this
				const broadCast = monitorBroadCastChannel( application )
			}
			*/
		}

		// User has been located and application has begun!
		onAvailable()

		/*
		// watch for user events and things that the user changes
		// and pass that into the automator to modify behaviour
		application.addListener(APPLICATION_EVENTS.LOADING, e => {
			// console.info("Index is loading app", e )
			// setLoadProgress(
			// 	loadProgress,
			// 	"",
			// 	true
			// )
			if (e){
				console.error("dispatchCustomEvent", APPLICATION_EVENTS.LOADING, "Events", e)
			}
		})

		application.addListener(APPLICATION_EVENTS.PARKED, e => {
			console.error( "dispatchCustomEvent", APPLICATION_EVENTS.PARKED, "Events", e)
		})

		application.addListener(APPLICATION_EVENTS.LOADED, e => {
			console.error("dispatchCustomEvent Adding game and key events")
			// console.info("Index has completed loading app", {e, application} )
		})
		*/

		const loadTime = Date.now() - startLoadTime
		// console.info("Loading internally", loadTime)

		// TODO: This will call the app from external URLs
		// without reloading the page

		// NB. Set launch to focus-existing in manifest
		// If the PWA has caused this page to load we can intercept the request here
		if ("launchQueue" in window) {
			window.launchQueue.setConsumer((launchParams) => {
				if (launchParams.targetURL) {
					const params = new URL(launchParams.targetURL).searchParams
					// const track = params.get("track")
					// queryString = params
					// application
				}
			})
		}


		// let installation = null
		// // at any point we can now trigger the installation
		// if (installation)
		// {
		// 	try{
		// 		const destination = document.getElementById("shared-controls")
		// 		const needsInstall = await installation( destination )		

		// 		canBeInstalled = needsInstall

		// 	}catch(error){

		// 		body.classList.add("installation-unavailable")
		// 		console.error("Install/Update issue", error)
		// 	}

		// }else{
		// 	// console.log("Loaded Webpage")
		// }

		// const Attractor = await import('./attractor.js')
		// For automatic stuff...
		// const attractMode = new Attractor( application )

		const secondsAgo = Math.ceil((application.timeElapsedSinceLastPlay ?? Date.now()) / 1000)

		// Show hackers message to debuggers
		if (debugMode) {

			console.info(`InterFACE Version ${VERSION} [${runningVersion}] from ${getReferer()} in ${language} used ${application.count} times, loaded in ${(loadTime / 1000).toFixed(2)} seconds, last time was ${secondsAgo} seconds ago`)
			console.info({ application, store, title, defaultOptions, globalOptions, domainOptions, referer: getReferer(), capabilities, DOMAIN, HOST, LTD })
			// console.log(`Loaded App ${VERSION} ${needsInstall ? "Installable" : needsUpdate ? "Update Available" : ""}` )	
			// console.info("Initialising", runningVersion, { capabilities, DOMAIN, HOST, LTD })
		}
		
		return application
	}

	// console.log( "Global options" ,  { globalOptions, dominOptions, defaultOptions, validOptionKeys } )

	// Lazy load the main interface code
	// import('./interface.js').then( loadInterfaceAndAssembleApplication )

	// if not lazily loaded here...
	// console.info("Loading Interface")

	// Load all parts and setup
	const app = await loadInterfaceAndAssembleApplication()

	// await Promise.all([app])
	// await app

	console.info("Loaded Interface", { app })
}

// import {installer} from './install'
// import {update}  from './update.js'
// const test = async ()=>{
// 	const {installer} = await import('./install.js')
// 	const {update} = await import('./update.js')
// 	const destination = document.getElementById("shared-controls")
// 	const install = await installer(true)
// 	const needsInstall = await install( destination )		
// 	const needsUpdate = await update()
// }
// test()

const checkPWAUpdates = () => {

	body.classList.toggle("pwa", true)

	// PWA Install / Update / Load from cache
	// needs to be run early on ideally and in a seperate thread
	// loads in the relevant data to determine if the app needs to be 
	// updated if installed or installed if uninstalled

	return installOrUpdate(debugMode, runningVersion).then( PWAState => {

		// this is the amount of time to run before we "check" for things
		// const TIME_BEFORE_REFRESH = 24 * 60 * 60 * 1000
		if (debugMode) {
			console.log("TEST : Fetched install status", { state:  PWAState, debugMode, runningVersion })
			console.info("PWA",  PWAState.log, { state:  PWAState })
		}

		// add custom classes to elements so that we can 
		// show a bit more useful feedback about the status of the web app
		// and whether it is installed / has updates available etc...
		// TODO: Add an update button!?

		// previousVersion, currentVersion,
		// isInstallable, isFirstRun, isRunningAsApp, install:(), updatesAvailable, updating, updated, update:()

		// add some useful classes to <body> element for styling
		body.classList.toggle("updates-available",  PWAState.hasUpdates)
		body.classList.toggle("first-run",  PWAState.isFirstRun)
		body.classList.toggle("installable",  PWAState.isInstallable)
		body.classList.toggle("installed",  PWAState.isRunningAsApp)

		// if already installed this wont show the install button
		if ( PWAState.isInstallable) {
			// hook into button and show...
			const installButtons = document.querySelectorAll(".button-install")
			installButtons.forEach(installButton => {
				installButton.addEventListener("click", async (event) => {
					const installed = await  PWAState.install(installButton)
					console.log("installed", installed.success, { installed })
					setToast(installed.success ? "Installed to HomeScreen" : "You can always install again in the future")
				})

				// find associated label if it exists...
				const installButtonLabel = document.querySelectorAll(`label[for="${installButton.id}"]`)
				installButtonLabel.hidden = false
				installButton.hidden = false
			})

		} else if ( PWAState.updatesAvailable) {

			showUpgradeDialog()
		}

		//setToast( canBeInstalled ? "You can install this as an app...<br>Click install when prompted!" : "" )

	}).catch(error => {

		body.classList.add("failed")
		console.error("Interface:PWA", error)
	})
}

/**
 * DEPENDING ON HOW THIS APP IS RUNNING...
 * If it is a node based electron app, we want to hide the PWA stuff
 * otherwise it is super confusing, so we do a simple sniff and divert
 * 
 * Check for app / web pwa updates
 */
const checkPlatformUpdates = async (query) => {

	if (capabilities.electron) {
		// TODO: ELECTRON update...

	} else if (capabilities.pwa) {
		// we are running this as a PWA!
		await checkPWAUpdates()

	} else if (capabilities.pwaPossible) {
		// potential for it to be a webapp
		await checkPWAUpdates()

	} else {
		// probably just a website that doesn't have 
		// service workers enabled probably for security
	}
	return start(query)
}

// Click and hold on the version for more info
const createVersionButton = () => {
	const versionButton = document.getElementById("version")
	addMouseTapAndHoldEvents(versionButton)
	versionButton.addEventListener(MOUSE_TAP, event => {
		// allow pass through to github
	})

	versionButton.addEventListener(MOUSE_HELD, event => {
		// Show dialog for upgrade?
		showUpgradeDialog()
		event.preventDefault()
	})
}

// START HERE ------------------------------------------------------
// if ('serviceWorker' in navigator && 'SyncManager' in window) {
	
// 	// Register your service worker:?
// 	// navigator.serviceWorker.register('/sw.js');

// } else {
// 	// serviceworker/sync not supported
// }

// we hang out here until the service worker has comfirmed that everything is ready
checkPlatformUpdates().finally(() => {
	// APP STARTING>
})

document.addEventListener("DOMContentLoaded", async (e) => {

	updateSummaryText()

	// allow the version button to link to secret places
	createVersionButton()

	// global tooltips!
	addToolTips(document.querySelector("main"))

	const table = document.getElementById("compatibility")
	if (!table) {
		console.warn("Missing '#compatability' table in DOM")
		// throw Error("Missing '#compatability' table in DOM")
	}

	// update the table as soon as it is available
	const isFatalIssue = await updateCapabalitiesTable(table, capabilities)

	// if we have all the hardware we need to continue...
	if (isFatalIssue) {
		// nowhere to go from here :(
		// TODO: 
		// ESCAPE - no cameras found on system?
		// ESCAPE - no GPU?
		// remove loading stuff and quit

		// FIXME: improve message to user
		const requirementsTable = document.getElementById("requirements-test")
		requirementsTable.scrollIntoView()
		requirementsTable.focus()
		console.warn("Essential hardware missing")

		// showError("Fatal issue with hardware detected", "Could not find all the hardware required to operate. Please review the requirements chart", false)

	} else {
		//console.info("All hardware requirements met")
	}

}, { once: true })

// Hot Module Reloading
if (module.hot) {
	module.hot.dispose(function (data) {
		// module is about to be replaced.
		// You can save data that should be accessible to the new asset in `data`
		data.updated = Date.now()
	})

	module.hot.accept(function (getParents) {
		// module or one of its dependencies was just updated.
		// data stored in `dispose` is available in `module.hot.data`
		let { updated } = module.hot.data
	})
}