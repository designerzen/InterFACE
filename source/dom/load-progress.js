
const doc = document

let loadMeter = 0
let loadMessageIndex = 0

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

const progressMessage = doc.querySelector('label[for="progress-bar"]')
const progressBar = doc.querySelector('progress')

export const setLoadProgress = (progress, message) => {

	const rounded = parseInt(progress)
	const percentage = rounded * 100
	const hasProgressed = loadMeter !== rounded
	if (hasProgressed)
	{
		loadMeter = rounded
	}
	
	progressBar.style.setProperty("--progress", loadMeter )
	progressBar.setAttribute("value", loadMeter )

	if (rounded === 0 ){

		message = LOAD_MESSAGES[ 0 ]	

	} else if (message && message.length) {
		// use message but break lines?
		// append percentage
		message += " " + percentage + "%"
	}else{
		// get prescripted from list...
		message = LOAD_MESSAGES[ Math.ceil(progress * (LOAD_MESSAGES.length-1)) ]	
		message += " " + percentage + "%"
	}
	//console.log("load", {progress, message} , Math.ceil(progress * LOAD_MESSAGES.length), LOAD_MESSAGES)
	
	if (progressMessage.innerHTML !== message)
	{
		// only change label text not the input field too?
		progressMessage.innerHTML = message

	}else if (hasProgressed){

		// add an extra message if it hasn't actually progressed?
		progressMessage.innerHTML = message + " " + BE_PATIENT_MESSAGES[loadMessageIndex++%BE_PATIENT_MESSAGES.length-1]	
	}
}

export const getLoadProgress = () => loadMeter
