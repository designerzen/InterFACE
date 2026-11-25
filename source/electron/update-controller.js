const stableVersion = value => {
	const match = typeof value === 'string' && value.match(/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\+[\w.-]+)?$/)
	return match ? match.slice(1, 4).map(Number) : null
}

export const isNewerRelease = (tag, current) => {
	const next = stableVersion(tag)
	const installed = stableVersion(current.split('-')[0])
	if (!next || !installed) return false
	for (let index = 0; index < 3; index++) {
		if (next[index] !== installed[index]) return next[index] > installed[index]
	}
	return current.includes('-')
}

// Keep consent ahead of checkForUpdates: Squirrel downloads immediately when it finds an update.
export const createUpdateController = ({ updater, getRelease, currentVersion, canInstall, ui, logger }) => {
	let busy = false
	let transferring = false
	let downloaded = false
	let stopped = false
	const finish = () => {
		transferring = false
		busy = false
		ui.closeProgress()
	}
	const reportError = async error => {
		logger.warn('PhotoSYNTH update failed', error)
		finish()
		if (!stopped) await ui.message('Update could not finish', 'Check your internet connection and try Help → Check for Updates again. You can continue using PhotoSYNTH.')
	}
	const offerRestart = async () => {
		if (await ui.confirm('Update ready', `The update is downloaded and ready. Restart PhotoSYNTH to install it. Save your work before restarting.`, 'Restart and install', 'Later') && !stopped) {
			updater.quitAndInstall()
		}
	}
	const onError = error => { void reportError(error).catch(error => logger.warn(error)) }
	const onAvailable = () => {
		if (!stopped) ui.showProgress('Downloading update', 'Downloading and preparing the update. This may take a few minutes.')
	}
	const onUnavailable = () => {
		finish()
		if (!stopped) void ui.message('Update not ready', 'The update package is not available for this installation yet. Please try again later.').catch(error => logger.warn(error))
	}
	const onDownloaded = () => {
		transferring = false
		downloaded = true
		// Retain the lock while the restart dialog is open.
		ui.closeProgress()
		if (!stopped) void offerRestart().catch(reportError).catch(error => logger.warn(error)).finally(() => { busy = false })
	}
	updater.on('error', onError)
	updater.on('update-available', onAvailable)
	updater.on('update-not-available', onUnavailable)
	updater.on('update-downloaded', onDownloaded)

	return {
		async check(manual = false) {
			if (stopped) return
			if (busy) {
				if (manual && transferring) ui.showProgress('Update in progress', 'Downloading and preparing the update. This may take a few minutes.')
				return
			}
			busy = true
			try {
				if (downloaded) {
					await offerRestart()
					return
				}
				if (manual) ui.showProgress('Checking for updates', 'Contacting GitHub for the latest PhotoSYNTH release…')
				let release
				try {
					release = await getRelease()
				} catch (error) {
					logger.info('Update check unavailable', error)
					ui.closeProgress()
					if (manual && !stopped) await ui.message('Could not check for updates', 'GitHub could not be reached. Check your internet connection and try again later.')
					return
				}
				ui.closeProgress()
				if (stopped) return
				if (release.draft || release.prerelease || !isNewerRelease(release.tag_name, currentVersion)) {
					if (manual) await ui.message('No newer release available', `You are running PhotoSYNTH ${currentVersion}.`)
					return
				}
				const releaseVersion = release.tag_name.replace(/^v/, '')
				if (!canInstall) {
					if (await ui.confirm('PhotoSYNTH update available', `PhotoSYNTH ${releaseVersion} is available (installed: ${currentVersion}). This platform requires installing the package from GitHub.`, 'Open downloads', 'Later') && !stopped) await ui.openDownloads()
					return
				}
				if (!await ui.confirm('PhotoSYNTH update available', `PhotoSYNTH ${releaseVersion} is available (installed: ${currentVersion}). Download and prepare the update now? You will be asked before restarting.`, 'Update now', 'Later') || stopped) return
				ui.showProgress('Preparing update', 'Connecting to the update service…')
				transferring = true
				updater.checkForUpdates()
				// Native updater events now own the lock and progress window.
				return
			} catch (error) {
				await reportError(error)
			} finally {
				if (!transferring) busy = false
			}
		},
		stop() {
			stopped = true
			ui.closeProgress()
			// Keep the error listener: a native download cannot be cancelled during shutdown.
		},
	}
}
