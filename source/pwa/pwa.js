// checkForUpdates()
// await checkForUpdates() => { currentVersion:0.0.1, newVersion:0.0.2, updateAvailable:true } 

// Fix some issues with early browsers
// import './servicewaiting.polyfill'

import { VERSION } from '../version'
// import serviceWorkerPath from "url:../service-worker.js"

// console.error({serviceWorkerPath, manifestPath})

// ? made CloudFlare barf up the ServiceWorker so meh!
const URL_SEPERATOR = "#"

const NAME = "ploppypantspwaispoo"

let deferredPrompt

// flags
const PWA_TYPES = [ "standalone", "fullscreen",  "minimal-ui" ]

// Determine as much functionality as possible
const isInWebAppiOS = "standalone" in navigator ? window.navigator.standalone === true : matchMedia("(display-mode: standalone)").matches
// as there are other modes that are active as pwa such as fullscreen
const displayMode = PWA_TYPES.filter( displayMode => window.matchMedia( `(display-mode:${displayMode})` ).matches )
const isInWebAppChrome = PWA_TYPES.includes( displayMode )

// const isInWebAppChrome = ["fullscreen", "standalone", "minimal-ui"].some( displayMode => window.matchMedia( `(display-mode:${displayMode})` ).matches )
// const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches

// handle iOS specifically
// this includes the regular iPad and the iPad pro but not macOS
const isIOS =
	navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") ||
	(navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)

// is this an APK TWA android app?
const isTWAAndroid = document.referrer.includes('android-app://')
// check to see if it is in the microsoft store pwas format
const isMicrosoftStore = Array.isArray( navigator.userAgent.match(/MSAppHost/i) )

// if this is the first ever run or if this is the cache has been cleared...
const isFirstRun = navigator.serviceWorker.controller === null
// Is the user online or offline?
const isOnline = navigator.onLine 

// 1. Check WebBrowser to see if PWA mode is available (not all browsers have it!)
// 		check for beforeinstallprompt support
// 		- if available then continue
export const isSupportingBrowser = window.hasOwnProperty("BeforeInstallPromptEvent")

// 2. Check if the app was JUST installed (previously before refresh)
// was installed on the last refresh
// - if so then quit
const wasJustInstalled = new URLSearchParams(window.location.search).installing || false

// 3. Check to see if the app has already been installed!
//		- if it has continue to UPDATE step
//		- if it has not, continue to INSTALL step
// is this runnning as an App on the device? PWA / TWA / MSStore 
const isRunningAsApp = isInWebAppiOS || isInWebAppChrome || isTWAAndroid || isMicrosoftStore || false

// 4. If Installed check for updates





const platform = {
	ios:isIOS,
	android:isTWAAndroid,
	microsoft:isMicrosoftStore,
	pwa:isRunningAsApp,
	offline:!isOnline,
	displayMode
}



// The process goes like this...

// FIXME: show change log if just installed and silently exit!
const setJustBeenInstalled = (cookieSecret=NAME) =>{
	// checks a few things... query string for "installing=true"
	const urlParams = new URLSearchParams(window.location.search)
	urlParams.installing = true

	localStorage.setItem(cookieSecret,{
		installing:true,
		version:VERSION
	})
}



// INSTALL PATH
// - set localstorage flag for version and for date installed as well as if it has JUST been installed (gets cleared after first refresh)


// UPDATE PATH

let installed
// TODO: Lazy load from install
const showInstallPrompt = (installButton, prompt) => new Promise( async (resolve,reject)=>{

	if (!prompt)
	{
		return reject()
	}

	window.addEventListener("appinstalled", evt => {
		
		//console.log("appinstalled fired", evt)
		resolve({
			success:true,
			log:"Your PWA has been installed"
		})

	}, {once:true})

	// show the actual prompt
	prompt.prompt()
	
	// disable the install button to prevent repress
	installButton.disabled = true
	
	// wait for the user to click a button...
	const choiceResult = await prompt.userChoice
	
	// user clicked...
	if (choiceResult.outcome === "accepted") 
	{
		const urlParams = new URLSearchParams(window.location.search)
		urlParams.installing = true
		// set?

		installed = true
		installButton.hidden = true
		//prompt = null

		// this should trigger the above event!
		
	} else {

		installButton.disabled = false
		installed = false
		resolve({
			success:false,
			log:"User chose to not install"
		})
		//reject("User chose to not install")
	}
})

// Force uninstall (if pushed out a dodgy version for example)
export const uninstall = () => {
	navigator.serviceWorker.getRegistrations()
		.then( registrations => { 
			for(let registration of registrations) 
			{ 
				registration.unregister()
				.then(()=>self.clients.matchAll())
				.then(clients => { 
					clients.forEach(client => { 
						if (client.url && "navigate" in client){ 
							client.navigate(client.url)
						} 
					})
				})
			}
		})
}

export const showChangelog = async ( domElement ) =>{
	const {injectChangeLog, fetchChangesAsText} = await import('./changes.js')
	const changes = await fetchChangesAsText('changelog')
	injectChangeLog( domElement )
	return changes
}

let isInstallable = false
let updating = false
let updatesAvailable = false
let updated = false
let newVersionAvailable = false

// versioning
const currentVersion = VERSION
let previousVersion

// progressive web app variant
// this simply loads and installs the service worker
export const installOrUpdate = async(debug=false, currentlyRunningVersion='' ) => {

	let log = []
	let output = {}

	// 1. Check browser allows PWAs
	if (!isSupportingBrowser)
	{
		throw Error("Browser does not support PWA installation")
		//return false
	}

	// 2. check to see if it is already installed and running as a PWA
	if (isRunningAsApp)
	{
		log.push(`PWA ${VERSION} Installed, checking for updates`, {deferredPrompt, isFirstRun, isInWebAppiOS, isInWebAppChrome } )

	}else{

		// check to see if the service worker is running...
		if (isFirstRun)
		{
			// totally clean setup
			log.push(`PWA ${VERSION} AVAILABLE WWW / PWA`, {deferredPrompt, isFirstRun, first:navigator.serviceWorker.controller } )
		}else if (wasJustInstalled){
			// recently installed
			log.push(`PWA ${VERSION} was JUST installed` )
		}else{
			// check to see if the service worker is running...
			log.push(`WWW ${VERSION}`, {deferredPrompt, isFirstRun, first:navigator.serviceWorker.controller } )
		}
	}


	const registration = await navigator.serviceWorker.getRegistration()
	console.log("Checking for installed service worker", registration )
	

	// ===================================================
	// INSTALLATION OF SERVICE WORKER MEANS IT WAS JUST INSTALLED 
	// check if installing...
	if (registration && registration.installing)
	{
		// if the feature exists, we can work out how heavy the app is
		if (navigator.storage)
		{
			const storageData = await navigator.storage.estimate()
			console.log("Checking for installed storage space", storageData )
		}
	}

	// FIXME: Check if we are installing the app!


	// INSTALL UPDATES ===================================================
	// Updates - the app does not need to be installed to have updates!
	// updates simply means that the service-worker has changed since last time
	// and that there are new assets that need to be cached and downloaded.
	// 1. Check to see if it is installed as a service worker
	if (registration)
	{
		// if there is an active SW it means that this isn't the first
		// time that the app has run and that there maybe updates to this
		// service worker that will be noticed when the new service worker
		// is registered below...
		const activeWorker = registration.active
		const previousServiceWorkerURL = new URL(activeWorker.scriptURL)
		
		previousVersion = previousServiceWorkerURL.search.split("=")[1] || currentlyRunningVersion
		newVersionAvailable = previousVersion !== VERSION
		
		// "installing" - the install event has fired, but not yet complete
		// "installed"  - install complete
		// "activating" - the activate event has fired, but not yet complete
		// "activated"  - fully active
		// "redundant"  - discarded. Either failed install, or it's been
		//                replaced by a newer version
		const activatedState = activeWorker.state

		log.push("PREVIOUS SW URL", `${previousServiceWorkerURL}` )
		log.push("EXPECTED VERSION", `${VERSION}` )
		log.push("SW Reg v", `${previousVersion} -> ${currentVersion}`, {updatesAvailable, previousVersion, registration, activatedState, activeWorker, previousServiceWorkerURL } )
		log.push(`SW State ${activatedState}` )
			
		// As in our service worker we have the self.skipWaiting() command set up
		// the update should automatically install in the background 
		// FOR USE AFTER RELOAD - for the time being the previous Service-Worker is used
		registration.addEventListener('updatefound', async () => {

			const installingWorker = registration.installing
			
			// check this version installed and the updated version????
			log.push("Update found", {registration, installWorker: installingWorker, activeWorker, previousServiceWorkerURL } )
			updating = true

			// show "install update" buton?
			//log.push( {changes,waiting: installWorker.waiting, controller: navigator.serviceWorker.controller  } )
			
			// if there is already a service-worker registered and running as the controller...
			// as well as a worker "waiting" to be installed... resolve immediately?
			if (installingWorker && installingWorker.waiting && navigator.serviceWorker.controller) 
			{
				// FIXME: 
				//newWorker = reg.waiting
				log.push( "sanity check", {installWorker: installingWorker, nav:navigator.serviceWorker.controller} )
			}

			if (installingWorker)
			{
				installingWorker.addEventListener('statechange', () => {

					switch (installingWorker.state) {
						case 'installed':
							if (navigator.serviceWorker.controller) {
								// New Service-Worker has replaced the old one!
								// new update available!
								updatesAvailable = true
							
							} else {

								// no update available
								updatesAvailable = false
								log.push("update", installingWorker.state, {registration, installWorker: installingWorker} )
							}
							log.push("update installed expected truth", navigator.serviceWorker.controller, {registration, installWorker: installingWorker} )
							break
					}

					if (installingWorker.state === 'installed') 
					{
						
						// FIXME: unregister old one???
	
						// TODO: Auto reload???
						
						
					}else{
						
					}
				})
			}
			

			
			// if (navigator.storage) 
			// {
			// 	const storageData = await navigator.storage.estimate()
			// }

		}, {once:true})

	}else{
		// no service worker installed yet?
		log.push("PWA NO service worker registered" )
	}

	//log.push("PWA registering service worker..." )

	// as there is no previously one registered, we 

	// This "installs" the app into the local app cache but does
	// not create the icon on the homescreen or desktop
	// NB. By appending the Version as an GET var we can specify which version this matches
	const hashedSWURL = `../service-worker.js#v=${VERSION}`
	let serviceWorker = await navigator.serviceWorker.register(hashedSWURL)
	log.push("Service worker with #",hashedSWURL, serviceWorker)

	if (!serviceWorker)
	{
		const querySWURL = `../service-worker.js?v=${VERSION}`
		serviceWorker = await navigator.serviceWorker.register(querySWURL)		
		log.push("Service worker with ?",querySWURL, serviceWorker)
	}

	// annoying really but we leave this in just for parcel to force copy it
	if (!serviceWorker)
	{
		serviceWorker = await navigator.serviceWorker.register( new URL('../service-worker.js', import.meta.url) , {type: 'module'} )	
		// serviceWorker = await navigator.serviceWorker.register("../service-worker.js")	
		log.push("Service worker falling back to default :*(", serviceWorker)
			
	}
	
	// at this point, if the service worker is a different version,
	// the update method above begins

	if (isFirstRun)
	{
		log.push("PWA FRESH service worker registering", {serviceWorker} )

	}else{
		log.push("PWA registering service worker", {serviceWorker} )
	}

	// INSTALLABLE!
	// app is running as a PWA so we don't have to show the install button ever! 
	// if not installed we can also show an install button
	if (!isRunningAsApp)
	{
		// get install stuff prepared...
		// check if prompt is available else wait...
		if (!deferredPrompt)
		{
			// if this is not installable it will hang forever here
			deferredPrompt = await interceptPrompt()
			isInstallable = true
			log.push("Waiting prompts", deferredPrompt )
		}

		// this could be simplified?
		// const shouldShowInstall = () => relatedApps.length < 1 && (deferredPrompt ?? isIOS) && (deferredPrompt && ("standalone" in navigator && navigator.standalone === false) || (installed === false))
	}

	output = {

		log,

		online: isOnline,
		offline:!isOnline,

		previousVersion, currentVersion,
		
		isInstallable, isFirstRun, isRunningAsApp, 
	
		// 
		hasUpdates: updatesAvailable && !isFirstRun,

		// FIXME
		isInstalled:isRunningAsApp,

		// Show the installer if not installed?
		// NB. THIS MUST BE TIES INTO A USER INTERACTION
		install:(button)=> showInstallPrompt( button, deferredPrompt ),

		prompt:deferredPrompt,

		updatesAvailable, updating, updated, 
		newVersionAvailable,


		// requestAddToHomescreen 
		// The actual update / reload script for if user wants new version now!
		update:()=>{
			registration.waiting.postMessage({ type: 'SKIP_WAITING' })
			window.location.reload()
		},
		...platform
	}

	// // Updates are available so change the setup
	// if (updatesAvailable)
	// {
	// 	const changes = await showChangelog()
	// 	output.changes = changes
	// }
	
	// first thing first, load in our PWA utilities and manifestand changelog and stuff...
	
	//try{
			
		// const {isAppInstalled, installer} = await import('./install.js')
		// const isInstalled = isAppInstalled()
		// installation = await installer(true)

		// console.log("PWA test 1", {isInstalled,installation,log,debug})
		
		// console.log("PWA test 2", {installation})
	
		// Update checks
		// const {updateApp, addUpdateListener} = await import('./update.js')

		// console.log("PWA test loaded update apps", {updateApp, addUpdateListener})
		
		// // now check for any updates!
		// addUpdateListener()


		// may as well disrupt the load if an update is available!
		// as we reload the thing anyways!
		// const {updater, updateAvailable} = await updateApp()
		// const updates = await updateApp()

		// console.log("PWA test 4", {updates})
	
		// console.log("PWA test 5", {updateApp})

		// if (updateAvailable)
		// {
		// 	// allow user to update!
		// 	// showUpdateButton(document.getElementById("shared-controls"), updater) 
		// 	// setToast("An Update is available! Press update to install it" )
			
		// }else{

		// 	// FIXME: show changelog???
		// 	const {injectChangeLog, fetchChangesAsText} = await import('./changes.js')
		// 	// fetchChangesAsText('changelog')
		// 	log += fetchChangesAsText()
		// }

		// console.log("installer", { updateAvailable,updater, updateAvailable, installer, installation})
	
	// }catch(error){

	// 	console.error("PWA", error)
	// }

	if (debug)
	{
		
	}

	return output
}


// Prevent the install app popup appearing
const interceptPrompt = () => new Promise( (resolve,reject) => {
	
	if (!isSupportingBrowser)
	{
		return reject("Unsupported Browser")
	}

	if (deferredPrompt)
	{
		return resolve( deferredPrompt )
	}

	// Intercept install prompt catch install prompt and prevent it showing immediately
	// you can run deferredPrompt.prompt() to start it again
	window.addEventListener("beforeinstallprompt", event => {
			
		event.preventDefault() 
		resolve( event )

	}, {once:true})		
})

// No need to watch if already installed
if (!isRunningAsApp)
{
	interceptPrompt().then( prompt => deferredPrompt = prompt )
}

