import { getReferer, getRefererHostname, forceSecure } from './location-handler'
import { setLoadProgress, getLoadProgress } from './dom/load-progress'
import { VERSION } from './version'
import { getBrowserLocales } from './i18n'
import { getDomainDefaults } from './settings'
import { showChangelog, installOrUpdate, uninstall } from './pwa/pwa'
import { createStore} from './store'
import { showReloadButton as createReloadButton } from './dom/button'
import { setToast } from './dom/tooltips'
import { MOUSE_HELD, MOUSE_TAP, addMouseTapAndHoldEvents} from './utils'
import Capabilities from './capabilities'
import Attractor from './attractor'

const LTD = getRefererHostname().split('.').pop()
const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === "development"
const body = document.documentElement
const debugMode = IS_DEVELOPMENT_MODE || new URLSearchParams(window.location.search).has("debug") 

// if on http flip to https and exit
forceSecure(IS_DEVELOPMENT_MODE)

const capabilities = new Capabilities()
// TODO: 
// ESCAPE - no cameras found on system?
// ESCAPE - no GPU?

// start loading / updating...
body.classList.add("loading", IS_DEVELOPMENT_MODE ? "debug" : LTD )

// FIXME: show updates button
const showUpgradeDialog = () => {	
	const updateButton = document.getElementById("button-update")
	const changes = showChangelog( document.getElementById("changelog") )
	document.getElementById("pwa").setAttribute("open", true)
	updateButton.setAttribute("hidden", false)
}

const start = () => {

	// if we have a specific referer, we can change the options accordingly
	// allow different domains to show different styles / options / configs
	// current domains that point this way include :
	// interface.place
	// interface.lol	<- defaults to simple 'kid' mode
	// interface.band	<- defaults to duet mode
	// const referer = getReferer()
	const defaultOptions = getDomainDefaults( LTD ) 
	const language = getBrowserLocales()[0]
	const store = createStore()

	import('./interface.js').then( async ({createInterface}) => {

		let halfLoaded = false
		const title = document.title
		try{
			const application = await createInterface( defaultOptions, store, capabilities, language, (loadProgress, message) => {
				if (loadProgress === 1)
				{
					if (!halfLoaded)
					{
						halfLoaded = true
						setLoadProgress(0.99, " ")
					}else{
						setLoadProgress(1, "Ready!")
					}
					document.title = title	
				}else{
					setLoadProgress( loadProgress, message )
					document.title = title + " - " + Math.ceil(loadProgress * 100) +  "%"
				}
			})
		
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
	
			// For automatic stuff...
			// const attractMode = new Attractor( application )
	
			// Show hackers message to debuggers
			if (application.debug)
			{
				console.log(`InterFACE Version ${VERSION} from ${getReferer()} in ${language} used ${application.count} times, last time was ${Math.ceil(application.timeElapsedSinceLastPlay/1000)} seconds ago`, {application} )	
				// console.log(`Loaded App ${VERSION} ${needsInstall ? "Installable" : needsUpdate ? "Update Available" : ""}` )	
			}

		}catch(error){

			// body.classList.add("failed")
			//uninstall()
			showError( error, "Oh no!" )
			console.error("Ultimate failure - remove loading - add error class?")
		}
	})
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

// PWA Install / Update / Load from cache
// needs to be run early on ideally and in a seperate thread
// loads in the relevant data to determine if the app needs to be 
// updated if installed or installed if uninstalled
const versionElement = document.getElementById("version")
const runningVersion = versionElement.innerText

installOrUpdate(debugMode, runningVersion).then( state => {

	// this is the amount of time to run before we "check" for things
	// const TIME_BEFORE_REFRESH = 24 * 60 * 60 * 1000
	if (debugMode){

		console.info( "PWA", state.log, {state} )
	}

	// add custom classes to elements so that we can 
	// show a bit more useful feedback about the status of the web app
	// and whether it is installed / has updates available etc...
	// TODO: Add an update button!?
	
	// previousVersion, currentVersion,
	// isInstallable, isFirstRun, isRunningAsApp, install:(), updatesAvailable, updating, updated, update:()

	// add some useful classes to <body> element for styling
	body.classList.toggle( "updates-available", state.hasUpdates )
	body.classList.toggle( "first-run", state.isFirstRun )
	body.classList.toggle( "installable", state.isInstallable )
	body.classList.toggle( "installed", state.isRunningAsApp )
	
	if (state.isInstallable)
	{
		// hook into button and show...
		const installButton = document.getElementById("button-install")
		installButton.addEventListener("click", async (event) => {
			
			const installed = await state.install(installButton)
			console.log( "installed", installed.success, {installed} )
			setToast( installed.success ? "Installed to HomeScreen" : "You can always install again in the future" )
		} )

		installButton.hidden = false

	}else if(state.updatesAvailable){

		showUpgradeDialog()
	}

	//setToast( canBeInstalled ? "You can install this as an app...<br>Click install when prompted!" : "" )
	
}).catch ( error =>{ 

	console.error("PWA",error) 
	
}).finally( p => {

	start()

}).catch( error =>{

	// uninstall() ?
	console.error("FATAL ERROR ;(", error)
})



const versionButton = document.getElementById( "version" )
addMouseTapAndHoldEvents( versionButton )
versionButton.addEventListener( MOUSE_TAP, event => {
	// allow pass through to github
} )

versionButton.addEventListener( MOUSE_HELD, event => {
	// Show dialog for upgrade?
	showUpgradeDialog()
} )
