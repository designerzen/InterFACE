
export const canFullscreen = () => document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen

export const exitFullscreen = () => {
	document.exitFullscreen()
}

export const goFullscreen = (callback) => {

	if ( canFullscreen() ) 
	{
		document.documentElement.requestFullscreen()
	}
	// leave full screen... 
}

export const toggleFullScreen = () => {
	if (!document.fullscreenElement) 
	{
		goFullscreen()
		return true

	} else {

	  if (document.exitFullscreen) 
	  {
		exitFullscreen()
	  }

	  return false
	}
}