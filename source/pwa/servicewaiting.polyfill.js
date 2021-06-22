// Brilliant prolyfil by dfabulich
// https://github.com/w3c/ServiceWorker/issues/1222#issuecomment-351566460
if (!('waiting' in navigator.serviceWorker)) {
	navigator.serviceWorker.waiting = new Promise(function(resolve) {
		navigator.serviceWorker.ready.then(function(reg) {
			function awaitStateChange() {
				reg.installing.addEventListener('statechange', function() {
					if (this.state === 'installed') resolve(reg)
				})
			}
			if (reg.waiting) resolve(reg)
			if (reg.installing) awaitStateChange()
			reg.addEventListener('updatefound', awaitStateChange)
		})
	})
}
