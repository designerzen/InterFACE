const { readFileSync } = require('fs')

const indexSource = readFileSync('source/index.js', 'utf8')
const installationSource = readFileSync('source/pwa/installation.js', 'utf8')

test.each(['pwa', 'pwaPossible'])('starts the app while %s updates are pending', async capability => {
	const pending = new Promise(() => {})
	const checkPWAUpdates = jest.fn(() => pending)
	const start = jest.fn(() => Promise.resolve('ready'))
	const handler = indexSource.match(/const checkPlatformUpdates = (async \(query\) => \{[\s\S]*?\n\})/)[1]
	const bootstrap = new Function('capabilities', 'checkPWAUpdates', 'start', `return (${handler})`)(
		{ [capability]: true }, checkPWAUpdates, start,
	)

	const started = bootstrap()
	expect(start).toHaveBeenCalledTimes(1)
	expect(checkPWAUpdates).toHaveBeenCalledTimes(1)
	await expect(started).resolves.toBe('ready')
})

test.each(['pending', 'failed'])('returns registration when its update check is %s', async state => {
	const error = new Error('Network unavailable')
	const registration = {
		update: jest.fn(() => state === 'pending' ? new Promise(() => {}) : Promise.reject(error)),
	}
	const register = jest.fn(() => Promise.resolve(registration))
	const watchForUpdate = jest.fn()
	const warn = jest.fn()
	const handler = installationSource.match(/const registerServiceWorker = (async \(\) => \{[\s\S]*?\n\})/)[1]
	const registerServiceWorker = new Function('navigator', 'watchForUpdate', 'console', `
		const isSupportingBrowser = true;
		const SERVICE_WORKER_ENABLED = true;
		const SERVICE_WORKER_URL = '/service-worker.js';
		let activeRegistration;
		return (${handler});
	` )({ serviceWorker: { register } }, watchForUpdate, { warn })

	await expect(registerServiceWorker()).resolves.toBe(registration)
	expect(watchForUpdate).toHaveBeenCalledWith(registration)
	expect(registration.update).toHaveBeenCalledTimes(1)
	if (state === 'failed') expect(warn).toHaveBeenCalledWith(expect.any(String), error)
})
