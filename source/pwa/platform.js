
// Determine as much functionality as possible
export const isInWebAppiOS = "standalone" in navigator ? window.navigator.standalone === true : matchMedia("(display-mode: standalone)").matches


// handle iOS specifically
// this includes the regular iPad and the iPad pro but not macOS
export const isIOS =
	navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") ||
	(navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)


// is this an APK TWA android app?
export const isTWAAndroid = document.referrer.includes('android-app://')

// check to see if it is in the microsoft store pwas format
export const isMicrosoftStore = Array.isArray( navigator.userAgent.match(/MSAppHost/i) )


export const isFirefox = () => {
	
}