/**
 * Handle the recordings panel that shows screenshots, videos and audio samples
 * 
 * @param {String} toggleRecordingsSelector 
 * @param {String} visibilityClass 
 */
export const setupRecordings = (toggleRecordingsSelector="toggle-recordings", visibilityClass="hide") => {	
	const panelRecordings = document.querySelector(".recordings")
	// hide / show ther ecordings panel
	let recordingsVisible = panelRecordings.classList.contains(visibilityClass) 
	const buttonToggleRecordings = document.getElementById(toggleRecordingsSelector)
	buttonToggleRecordings.addEventListener('click', e => {
		console.error("recordings", {panelRecordings  } )
		recordingsVisible = !recordingsVisible
		panelRecordings.classList.toggle( visibilityClass, recordingsVisible)
	}, false)
}