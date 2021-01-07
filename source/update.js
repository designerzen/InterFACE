import {setToast, setFeedback} from './ui'

// import '../node_modules/@pwabuilder/pwainstall/src/pwa-install.ts'
// import '@pwabuilder/pwaupdate'

const updater = async () => new Promise( (resolve,reject)  => {
	
	let storageUsed = 0
	let reg

	const formatBytes = (bytes, decimals = 2) => {
		if (bytes === 0)
		{
			return '0 Bytes';
		} 
	  
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	  
		const i = Math.floor(Math.log(bytes) / Math.log(k));
	  
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	const installUpdate = () => {
		reg.waiting.postMessage({ type: 'SKIP_WAITING' });
		window.location.reload();
	}
	
	// Check that service workers are supported
	if ('serviceWorker' in navigator) 
	{
		// Use the window load event to keep the page load performant
		window.addEventListener('load', async () => {
			
			reg = await navigator.serviceWorker.register('service-worker.js');
			const worker = reg.installing;
		
			if (worker && navigator.storage) 
			{
				const storageData = await navigator.storage.estimate();
				if (storageData) 
				{
					storageUsed = formatBytes(storageData.usage);
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

		})
	}else{
		reject("Service Workers not allowed");
	}
})

// 
const updateShit = async () => {
	try{
		const updateApp = await updater();

		// wait around
		setToast("An Update is available! Press update to install it");
			
		// reveal update button?
		const button = document.createElement('button')
		button.classList.add("update-available")
		button.innerHTML = "Update to new version"
		// on button press...
		button.addEventListener('click', ()=>updateApp(), {once:true} )
		document.documentElement.appendChild(button)

	}catch(error){
		// no updates
	}
}


updateShit()