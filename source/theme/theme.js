const THEME_PREFIX = "theme-"
let theme = `${THEME_PREFIX}default`

export const getThemeName = t => t.indexOf(THEME_PREFIX) > -1 ? t : `${THEME_PREFIX}${t}`

export const setTheme = t => {
	const body = document.body
	for (const cls of [...body.classList]) {
		if (cls.startsWith(THEME_PREFIX)) {
			body.classList.remove(cls)
		}
	}
	theme = getThemeName(t)
	body.classList.toggle( theme, true )
}

export const getThemeFromReferer = referer => {
	return referer ? getThemeName(referer) : theme
}

export const setupThemeControls = (themeSelector, callback) => {
	if (!themeSelector)
	{
		return null
	}

	themeSelector.onchange = e => {
		const requestedTheme = themeSelector.value
		console.log("Changing theme to ", requestedTheme)
		setTheme( requestedTheme )
		callback && callback(requestedTheme)
	}	
	return themeSelector
}
