
const doc = document

let loadMeter = 0
const LOAD_MESSAGES = ["Please wait", "Loading.","Loading..","Loading...","Still Loading!", "Almost done!"]
const progressMessage = doc.getElementById("progress-bar")
const progressBar = doc.querySelector('progress')

export const setLoadProgress = (progress, message) => {
	loadMeter = progress
	progressBar.style.setProperty("--progress", parseInt(progress) )
	progressBar.setAttribute("value", parseInt(progress) )
	if (message && message.length)
	{
		
	}else{
		// get prescripted from list...
		message = LOAD_MESSAGES[ Math.ceil(progress * (LOAD_MESSAGES.length-1)) ]	
	}
	//console.log("load", {progress, message} , Math.ceil(progress * LOAD_MESSAGES.length), LOAD_MESSAGES)
	
	if (progressMessage.innerHTML !== message)
	{
		// only change label text not the input field too?
		progressMessage.innerHTML = message
	}
}

export const getLoadProgress = () => loadMeter
