/** @jest-environment node */
import { EventEmitter } from 'node:events'
import { createUpdateController, isNewerRelease } from '../source/electron/update-controller.js'

const flush = () => new Promise(resolve => setImmediate(resolve))
const setup = (overrides = {}) => {
	const updater = new EventEmitter()
	updater.checkForUpdates = jest.fn()
	updater.quitAndInstall = jest.fn()
	const ui = {
		confirm: jest.fn().mockResolvedValue(true),
		message: jest.fn().mockResolvedValue(undefined),
		showProgress: jest.fn(),
		closeProgress: jest.fn(),
		openDownloads: jest.fn().mockResolvedValue(undefined),
	}
	const getRelease = jest.fn().mockResolvedValue({ tag_name: 'v0.62.0', draft: false, prerelease: false })
	const controller = createUpdateController({ updater, ui, getRelease, currentVersion: '0.61.5', canInstall: true, logger: { warn: jest.fn(), info: jest.fn() }, ...overrides })
	return { controller, updater, ui, getRelease }
}

describe('Electron update consent and lifecycle', () => {
	test.each([
		['v0.62.0', '0.61.5', true],
		['v0.61.10', '0.61.9', true],
		['v1.0.0', '0.99.99', true],
		['v0.61.5', '0.61.5', false],
		['v0.60.0', '0.61.5', false],
		['v0.61.5-beta.1', '0.61.4', false],
		['not-a-version', '0.61.5', false],
		['v0.61.5', '0.61.5-beta.1', true],
	])('compares %s to %s as %s', (tag, installed, expected) => {
		expect(isNewerRelease(tag, installed)).toBe(expected)
	})

	test('waits for consent before invoking the native downloader', async () => {
		const { controller, updater, ui } = setup()
		let answer
		ui.confirm.mockImplementationOnce(() => new Promise(resolve => { answer = resolve }))
		const checking = controller.check()
		await flush()
		expect(ui.confirm).toHaveBeenCalledWith('PhotoSYNTH update available', expect.stringContaining('0.62.0'), 'Update now', 'Later')
		expect(updater.checkForUpdates).not.toHaveBeenCalled()
		answer(true)
		await checking
		expect(updater.checkForUpdates).toHaveBeenCalledTimes(1)
		expect(ui.showProgress).toHaveBeenCalled()
	})

	test('Later never downloads or restarts', async () => {
		const { controller, updater, ui } = setup()
		ui.confirm.mockResolvedValue(false)
		await controller.check()
		expect(updater.checkForUpdates).not.toHaveBeenCalled()
		expect(updater.quitAndInstall).not.toHaveBeenCalled()
	})

	test('silently skips offline startup and allows a manual retry', async () => {
		const { controller, updater, getRelease, ui } = setup()
		getRelease.mockRejectedValueOnce(new Error('offline'))
		await controller.check()
		expect(ui.message).not.toHaveBeenCalled()
		expect(ui.confirm).not.toHaveBeenCalled()
		await controller.check(true)
		expect(updater.checkForUpdates).toHaveBeenCalledTimes(1)
	})

	test('explains a failed manual connectivity check', async () => {
		const { controller, getRelease, ui } = setup()
		getRelease.mockRejectedValue(new Error('HTTP 403'))
		await controller.check(true)
		expect(ui.message).toHaveBeenCalledWith('Could not check for updates', expect.any(String))
		expect(ui.closeProgress).toHaveBeenCalled()
	})

	test.each([
		{ tag_name: 'v0.61.5' },
		{ tag_name: 'v0.60.0' },
		{ tag_name: 'v1.0.0', draft: true },
		{ tag_name: 'v1.0.0', prerelease: true },
	])('does not prompt or download an ineligible release %j', async release => {
		const { controller, getRelease, ui, updater } = setup()
		getRelease.mockResolvedValue(release)
		await controller.check()
		expect(ui.confirm).not.toHaveBeenCalled()
		expect(updater.checkForUpdates).not.toHaveBeenCalled()
	})

	test('does not start overlapping checks while awaiting GitHub, consent, or download', async () => {
		const { controller, getRelease, updater } = setup()
		const first = controller.check()
		await controller.check()
		await first
		updater.emit('update-available')
		await controller.check(true)
		expect(getRelease).toHaveBeenCalledTimes(1)
		expect(updater.checkForUpdates).toHaveBeenCalledTimes(1)
	})

	test('asks before restarting after the download completes', async () => {
		const { controller, updater, ui } = setup()
		await controller.check()
		expect(updater.quitAndInstall).not.toHaveBeenCalled()
		updater.emit('update-downloaded')
		await flush()
		expect(ui.closeProgress).toHaveBeenCalled()
		expect(ui.confirm).toHaveBeenLastCalledWith('Update ready', expect.stringContaining('Save your work'), 'Restart and install', 'Later')
		expect(updater.quitAndInstall).toHaveBeenCalledTimes(1)
	})

	test('a deferred restart can be resumed from the menu without downloading again', async () => {
		const { controller, updater, ui, getRelease } = setup()
		ui.confirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false).mockResolvedValueOnce(true)
		await controller.check()
		updater.emit('update-downloaded')
		await flush()
		expect(updater.quitAndInstall).not.toHaveBeenCalled()
		await controller.check(true)
		expect(getRelease).toHaveBeenCalledTimes(1)
		expect(updater.checkForUpdates).toHaveBeenCalledTimes(1)
		expect(updater.quitAndInstall).toHaveBeenCalledTimes(1)
	})

	test('cleans up a failed native download and allows retry', async () => {
		const { controller, updater, ui } = setup()
		await controller.check()
		updater.emit('error', new Error('connection lost'))
		await flush()
		expect(ui.message).toHaveBeenCalledWith('Update could not finish', expect.any(String))
		expect(ui.closeProgress).toHaveBeenCalled()
		await controller.check(true)
		expect(updater.checkForUpdates).toHaveBeenCalledTimes(2)
	})

	test('handles synchronous native updater failures', async () => {
		const { controller, updater, ui } = setup()
		updater.checkForUpdates.mockImplementation(() => { throw new Error('not installed') })
		await controller.check()
		expect(ui.message).toHaveBeenCalledWith('Update could not finish', expect.any(String))
		expect(ui.closeProgress).toHaveBeenCalled()
	})

	test('explains when GitHub is newer but its platform feed is not yet ready', async () => {
		const { controller, updater, ui } = setup()
		await controller.check()
		updater.emit('update-not-available')
		await flush()
		expect(ui.message).toHaveBeenCalledWith('Update not ready', expect.any(String))
		expect(updater.quitAndInstall).not.toHaveBeenCalled()
	})

	test('offers downloads on platforms without a native installer', async () => {
		const { controller, updater, ui } = setup({ canInstall: false })
		await controller.check()
		expect(ui.openDownloads).toHaveBeenCalledTimes(1)
		expect(updater.checkForUpdates).not.toHaveBeenCalled()
	})

	test('does not prompt if the application quits during a GitHub request', async () => {
		const { controller, ui } = setup()
		const checking = controller.check()
		controller.stop()
		await checking
		expect(ui.confirm).not.toHaveBeenCalled()
	})
})
