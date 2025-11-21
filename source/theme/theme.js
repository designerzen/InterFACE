const THEME_PREFIX = "theme-"
let theme = `${THEME_PREFIX}default`

export const getThemeName = t => t.indexOf(THEME_PREFIX) > -1 ? t : `${THEME_PREFIX}${t}`

export const setTheme = t => {
	const body = document.body
	body.classList.remove( theme )
	theme = getThemeName(t)
	body.classList.toggle( theme, true )
}

export const getThemeFromReferer = referer => {
	return referer ? getThemeName(referer) : theme
}

export const setupThemeControls = (themeSelector, callback) => {
	themeSelector.onchange = e => {
		const requestedTheme = themeSelector.value
		console.log("Changing theme to ", requestedTheme)
		setTheme( requestedTheme )
		callback && callback(requestedTheme)
	}	
}
