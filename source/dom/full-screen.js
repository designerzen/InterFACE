
export const canFullscreen = () => document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen

export const exitFullscreen = () => {
	if (document.exitFullscreen) 
	{
		document.exitFullscreen()
	}
	return false
}

export const goFullscreen = (callback) => {
	if ( canFullscreen() ) 
	{
		try{
			document.documentElement.requestFullscreen()
			return true
		}catch(error){
			return false
		}
	}
	return false
}

export const toggleFullScreen = () => {
	if (!document.fullscreenElement) 
	{
		return goFullscreen()
	} else {
		return exitFullscreen()
	}
}

export const setFullScreenButtonState = async (buttonElement) => {
	requestAnimationFrame(()=>{
		const isFullscreen = document.fullscreenElement !== null
		buttonElement.checked = isFullscreen
		buttonElement.classList.toggle("fs", isFullscreen )
		// TODO: update aria-label and announce
		buttonElement.setAttribute("aria-label", !isFullscreen ? 
			"Enter full screen mode" :
			"Exit full screen mode" 
		)

		return isFullscreen
	})
}