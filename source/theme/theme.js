
let theme = "theme-default"

export const setTheme = t => {
	const body = document.body
	body.classList.remove( theme )
	theme = t 
	body.classList.toggle( theme, true )
}

export const setupThemeControls = (themeSelector, callback) => {
	themeSelector.onchange = e => {
		const requestedTheme = themeSelector.value
		console.log("Changing theme to ", requestedTheme)
		setTheme( requestedTheme )
		callback && callback(requestedTheme)
	}	
}
