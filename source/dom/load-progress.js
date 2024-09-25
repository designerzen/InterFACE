
const doc = document

let loadDestination = 0
let loadMeter = -1
let loadMessageIndex = 0
let loadStartedAt = -1

const LOAD_MESSAGES = [
	"Please wait, this can take<br>up to 6 minutes to load!", 
	"Lots of data is required so this can take a long time", 
	"Still Loading! Still may take a few minutes yet!", 
	"Almost done! Just hang on in there!"
]

const BE_PATIENT_MESSAGES = [
	"Loading.",
	"Loading..",
	"Loading..."
]

// give each message one second to display
const TOTAL_LOAD_DURATION = LOAD_MESSAGES.length * 1000

const progressMessage = doc.querySelector('label[for="progress-bar"]')
const progressBar = doc.querySelector('progress')

let requestFrame 
let currentMessage = ''
let messageChangedAt = Date.now()

const getLoaderMessage = (timeAsProgress) => {
	return LOAD_MESSAGES[ Math.floor(timeAsProgress * (LOAD_MESSAGES.length-1)) ] || BE_PATIENT_MESSAGES[0]
}

export const setLoadProgress = (progress, message, complete=false) => {

	const percentage = progress * 100
	const rounded = parseInt(percentage)
	const hasProgressed = loadMeter !== rounded
	const RATE = 1
	const now = Date.now()

	let text = ''

	// we should store the time
	if (loadMeter < 0){
		loadStartedAt = now
	}

	const timeElapsed = now - loadStartedAt
	const timeAsProgress = timeElapsed / TOTAL_LOAD_DURATION

	if (hasProgressed)
	{
		// animate this...
		loadMeter = loadMeter < rounded ? 
						loadMeter + RATE:
						loadMeter > rounded ? 
							loadMeter - RATE:
							loadMeter
	}else{
		// complete so dont repeat
		//loadMeter = rounded
	}
	
	cancelAnimationFrame( requestFrame )
	
	const timeSinceTextChanged = now - messageChangedAt
	const progressAsPercent = loadMeter * 0.01

	progressBar.parentNode.style.setProperty("--progress", progressAsPercent )
	progressBar.setAttribute("value", progressAsPercent )

	if (complete && !hasProgressed)
	{
		progressBar.parentNode.setAttribute("data-loaded", true )
	}else{
		progressBar.parentNode.setAttribute("data-loaded", false )
	}

	// check to see if the message has changed
	if (rounded === 0 ) {

		text = LOAD_MESSAGES[ 0 ]	

	} else if (message && message.length && currentMessage !== message && timeSinceTextChanged < 900 ) {
		
		// use message but break lines?
		// append percentage
		text = message
		messageChangedAt = now
		// console.log(timeSinceTextChanged, "Setting load message", {currentMessage, message} )

	}else if (rounded === 100){

		text = LOAD_MESSAGES[ LOAD_MESSAGES.length - 1 ]	

	}else{

		// get prescripted from list...
		text = getLoaderMessage(timeAsProgress)
		messageChangedAt = now
	}

	if (!text){

	}

	// console.log("loading", {timeSinceTextChanged, timeAsProgress, loadMeter, percentage, rounded, progress, message, text} )
	
	text += "<span class='load-percent'>" + (rounded === 50 ? '' : rounded + '%') + "</span>"
	
	// text += BE_PATIENT_MESSAGES[loadMessageIndex++%(BE_PATIENT_MESSAGES.length-1)]	
	
	if (progressMessage.innerHTML !== text)
	{
	// 	// only change label text not the input field too?
	// 	progressMessage.innerHTML = text

	// }else if (hasProgressed){

		// add an extra message if it hasn't actually progressed?
		progressMessage.innerHTML = text
		currentMessage = text
	}



	if (hasProgressed)
	{
		requestFrame = requestAnimationFrame( ()=>{
			setLoadProgress(progress, message, complete)
		})
	}
}

export const getLoadProgress = () => loadMeter
