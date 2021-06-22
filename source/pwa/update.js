// This class handles two things...
// Downloading the

const SIZES = ['Bytes', 'KB', 'MB', 'GB']

// This was written before seeing a wonderful github repo that
// did this much better sooo.... 
// TODO: Implement this either from that lib, or improve this one
const k = 1024
const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0)
	{
		return `0 ${SIZES[0]}`
	}
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed( Maths.abs(decimals) )) + ' ' + SIZES[i]
}

const appInfo = {
	storageUsed : 0
}

const watch = worker => {
	if (worker)
	{
		worker.onstatechange = async (event) => {

			console.log(worker, "onstatechange...",event)
		}
	}
}

export const addUpdateListener = () => new Promise( (resolve,reject) => {
	
	let newWorker
	if ('serviceWorker' in navigator) 
	{
		console.log("addUpdateListener:")
	  const reg = navigator.serviceWorker.getRegistration().then(reg => {
		console.log("addUpdateListener:", {reg})
		if (reg) 
		{
		  reg.addEventListener('updatefound', () => {
			newWorker = reg.installing
			newWorker.addEventListener('statechange', () => {
			 
				console.log("addUpdateListener:statechange", {reg})
				if (newWorker.state === 'installed' && navigator.serviceWorker.controller)
			  {
				console.log("addUpdateListener:", newWorker.state, navigator.serviceWorker.controller)
				resolve(true)
			  }
			})
		  })
  
		  if (reg.waiting && navigator.serviceWorker.controller) 
		  {
			console.log("addUpdateListener:", reg.waiting,  navigator.serviceWorker.controller )
			//newWorker = reg.waiting
			resolve(true)
		  }
		}
	  })

	  // timeout after a few seconds as clearly nowt updates

	}else{
		reject("Not available")
	}
})


////////////////////////////////////////////////////////////////
// Registers service worker if not registered...
// Checks versioning numbers and returns events if update avail
// or rejects with a message as to why
////////////////////////////////////////////////////////////////
const updater = async () => new Promise( (resolve,reject) => {
	
	let reg

	// The actual install / reload script!
	const installUpdate = () => {
		reg.waiting.postMessage({ type: 'SKIP_WAITING' })
		window.location.reload()
	}

	
	// Use the window load event to keep the page load performant
	const checkUpdates = async () => {

		console.log("Checking for updates...")
			
		reg = await navigator.serviceWorker.getRegistration()

		watch(reg.active)
		watch(reg.installing)
	
		if (reg) 
		{
			console.log("Registration", reg)
			console.log("Registration activated", reg.active )
			console.log("Registration installing", reg.installing )
			
			reg.addEventListener('updatefound', () => {
				console.log("updatefound", reg)
				newWorker = reg.installing
				newWorker.addEventListener('statechange', () => {
					if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
						// complete!
						resolve()
					}
				})
			})
	
			if (reg.waiting && navigator.serviceWorker.controller) {
				resolve(true)
				newWorker = reg.waiting
			}
		}
		







		// 
		// reg = await navigator.serviceWorker.register(new URL('service-worker.js', import.meta.url))
		console.log("Checking for available service workers", reg )
	
		const worker = reg.installing

		console.log("Checking for installed service worker", worker )
	
	
		if (reg.installing && navigator.storage) 
		{
			const storageData = await navigator.storage.estimate()
			if (storageData) 
			{
				appInfo.storageUsed = formatBytes(storageData.usage)
			}
			console.log("Checking for installed storage space", appInfo )
		}

		// check to see if there are any updates
		reg.onupdatefound = async () => {

			const newWorker = reg.installing
		
			newWorker.onstatechange = async () => {

				console.log("Checking for worker state changes", newWorker.state, newWorker )
				
				if (newWorker.state === 'installed') 
				{
					// navigator.serviceWorker.controller
					if (navigator.serviceWorker) 
					{
						const registeredWorker = await navigator.serviceWorker.getRegistration()
						if (registeredWorker && registeredWorker.waiting) 
						{
							// show update icon!
							resolve({
								installUpdate,
								appInfo
							})
						}
					}else{
						reject("No Service Worker")
					}
				}else{
					// not instaLLed
					reject("Not Installed")
				}
			}
		}
	}

	// Check that service workers are supported
	if ('serviceWorker' in navigator) 
	{
		// hook into load event if we haven't loaded yet
		if (document.readyState === 'complete')
		{
			checkUpdates()
		}else{
			window.addEventListener( 'load', checkUpdates,{once:true} )
		}

	}else{
		reject("Service Workers not allowed")
	} 
})




// Wrapper to update Application
export const updateApp = async () => await updater()
// export const updateApp = async () => {
	
// 	try{
// 		// using a constant as otherwise parcel doesnt copy it
// 		const updates = await updater()

// 		return updates	

// 	}catch(error){

// 		throw error
// 	}
// }
