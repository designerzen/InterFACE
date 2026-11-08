const getUrl = (value, base) => {
	try {
		return new URL(value, base)
	} catch {
		return null
	}
}

export function getPicadeConfigurationQuery(currentSearch = '', referrer = '') {
	const query = new URLSearchParams()
	const referrerUrl = getUrl(referrer)
	referrerUrl?.searchParams.forEach((value, key) => {
		query.append(key, value)
	})
	new URLSearchParams(currentSearch).forEach((value, key) => {
		query.delete(key)
		query.append(key, value)
	})
	return query
}

export function getPicadeConfiguratorUrl(appUrl, configurHref) {
	const app = getUrl(appUrl)
	const configurator = getUrl(configurHref, app)
	if (!app || !configurator) return configurHref
	configurator.search = app.search
	configurator.hash = ''
	return configurator.href
}

export function getPicadeReturnUrl(appHref, configurationQuery, lightMapping) {
	const app = getUrl(appHref)
	if (!app) return null
	new URLSearchParams(configurationQuery).forEach((value, key) => {
		app.searchParams.set(key, value)
	})
	app.searchParams.set('lights', lightMapping)
	app.hash = ''
	return app.href
}

export function getPicadeConnectionFeedback(error) {
	const name = error?.name ?? ''
	const message = String(error?.message ?? error ?? '')
	if (name === 'NotFoundError' || /no port selected/i.test(message)) {
		return {
			state: 'cancelled',
			message: 'No Picade Plasma device was selected. Check that it is connected by USB, then try again or configure the light layout without connecting.',
		}
	}
	if (name === 'SecurityError') {
		return {
			state: 'error',
			message: 'The browser blocked access to the Picade Plasma device. Check this site’s serial-device permission, then try again.',
		}
	}
	return {
		state: 'error',
		message: 'PhotoSYNTH could not connect to the Picade Plasma lights. Check the USB connection and try again.',
	}
}
