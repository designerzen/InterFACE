const SIZES = ['Bytes', 'KB', 'MB', 'GB']

// This was written before seeing a wonderful github repo that
// did this much better sooo.... 
// TODO: Implement this either from that lib, or improve this one
const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0)
	{
		return `0 ${SIZES[0]}`
	}
	const k = 1024
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed( Maths.abs(decimals) )) + ' ' + SIZES[i]
}

export const updater = async () => new Promise( (resolve,reject) => {
	
	let storageUsed = 0
	let reg

	// The actual install script!
	// NB. exported by wrapper
	const installUpdate = () => {
		reg.waiting.postMessage({ type: 'SKIP_WAITING' })
		window.location.reload()
	}

	// Use the window load event to keep the page load performant
	const checkUpdates = async () => {
			
		reg = await navigator.serviceWorker.register('service-worker.js')
		// reg = await navigator.serviceWorker.register(new URL('service-worker.js', import.meta.url))
		const worker = reg.installing
	
		if (worker && navigator.storage) 
		{
			const storageData = await navigator.storage.estimate()
			if (storageData) 
			{
				storageUsed = formatBytes(storageData.usage)
			}
		}

		reg.onupdatefound = async () => {

			const newWorker = reg.installing
			console.log("Update Found!", {reg, newWorker} )

			newWorker.onstatechange = async () => {
				
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
								storageUsed
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




// 
export const updateApp = async (sw='service-worker.js') => {
	try{
		const updates = await updater(sw)

		return {
			updater:updates.installUpdate,
			storageUsed:updates.storageUsed,
			updateAvailable:true
		}

	}catch(error){

		return false
	}
}
