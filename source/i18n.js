export const trimLocaleCode = locale => locale.split(/-|_/)[0]

export const getBrowserLocales = (options = {}) => {
	
	const defaultOptions = {
	  languageCodeOnly: false,
	  fallback:'en-GB'
	}

	const settings = Object.assign( {}, defaultOptions, options )
	const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages
  
	// we could assume english here but hey
	if (!browserLocales) 
	{
	  return settings.fallback ? [settings.fallback] : undefined
	}
  
	return browserLocales.map(locale => {
	  const trimmedLocale = locale.trim()
	  return settings.languageCodeOnly ? trimLocaleCode(trimmedLocale) : trimmedLocale
	})
  }

  // TODO: Load pot files