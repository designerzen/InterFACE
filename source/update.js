
const formatBytes = (bytes, decimals = 2) => {
	const SIZES = ['Bytes', 'KB', 'MB', 'GB'];
	
	if (bytes === 0)
	{
		return '0 '+SIZES[0];
	} 
	
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + SIZES[i];
}

export const updater = async (sw='service-worker.js') => new Promise( (resolve,reject) => {
	
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
			const newWorker = reg.installing;
			newWorker.onstatechange = async () => {
				if (newWorker.state === 'installed') 
				{
					if (navigator.serviceWorker) 
					{
						const registeredWorker = await navigator.serviceWorker.getRegistration();
						if (registeredWorker && registeredWorker.waiting) 
						{
							// show update icon!
							resolve(installUpdate);
						}
					}else{
						reject("No Service Worker");
					}
				}else{
					// not instaLLed
					reject("Not Installed");
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
		reject("Service Workers not allowed");
	}
})




// 
export const updateApp = async (sw='service-worker.js') => {
	try{
		const update = await updater(sw)
		return {
			updater:update,
			updateAvailable:true
		}

	}catch(error){

		// no updates or app not installed etc
		console.log(error)

		return false
	}
}
