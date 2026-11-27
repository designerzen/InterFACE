import { getCameraErrorCode, getErrorMessage, showError, showErrorCode } from '../source/dom/errors.js'

describe('translatable error messages', () => {
	test.each([
		['NotAllowedError', 'camera-permission-denied'],
		['SecurityError', 'camera-permission-denied'],
		['NotFoundError', 'camera-not-found'],
		['NotReadableError', 'camera-in-use'],
		['UnknownError', 'camera-unavailable'],
	])('maps %s to %s', (name, expected) => {
		expect(getCameraErrorCode({ name })).toBe(expected)
	})

	test('keeps user-facing problems and solutions as plain translatable text', () => {
		const message = getErrorMessage('camera-permission-denied')
		expect(message.problem).toBeTruthy()
		expect(message.solution).toBeTruthy()
		expect(`${message.problem}${message.solution}`).not.toMatch(/<[^>]+>/)
	})
})

describe('error dialog camera help', () => {
	beforeEach(() => {
		document.body.innerHTML = `<dialog id="errors"><form>
			<h5 id="error-title"></h5><p id="error-message"></p><p id="error-solution"></p>
			<details id="error-help"><summary id="error-help-label"></summary><p id="error-help-text"></p></details>
			<details id="error-technical"><summary id="error-details-label"></summary><p id="error-details"></p></details>
			<audio></audio>
			<menu><button class="reload-app"><span id="error-primary-label"></span></button>
			<button class="camera-help"><span id="error-secondary-label"></span></button></menu>
			<button class="close"></button>
		</form></dialog>`
	})

	const isCameraHelpHidden = () => document.getElementById('error-help').hidden && document.querySelector('.camera-help').hidden

	test('hides camera help for problems that are not caused by the camera', () => {
		showError('PhotoSYNTH could not start', 'Reload the page to try again.', true, 'NotAllowedError: Permission to use Web MIDI API was not granted.')
		expect(isCameraHelpHidden()).toBe(true)
	})

	test('shows camera help for camera errors', () => {
		showErrorCode('camera-permission-denied')
		expect(document.getElementById('error-help').hidden).toBe(false)
		expect(document.querySelector('.camera-help').hidden).toBe(false)
	})

	test('treats camera-not-found as non-fatal and mentions uploading a video or image', () => {
		const dialog = document.getElementById('errors')
		const message = getErrorMessage('camera-not-found')
		expect(message.solution).toMatch(/video or image/i)

		showErrorCode('camera-not-found', { fatal: true })
		expect(document.documentElement.classList.contains('fatal')).toBe(false)
		expect(dialog.classList.contains('fatal')).toBe(false)
		expect(dialog.querySelector('button.close').hidden).toBe(false)
	})

	test('keeps error alert audio present, respects mute/reduced-motion, and stops on dialog close', () => {
		const dialog = document.getElementById('errors')
		const audio = dialog.querySelector('audio')
		audio.play = jest.fn(() => Promise.resolve())
		audio.pause = jest.fn()

		// Muted audio should not auto-play
		audio.muted = true
		showError('Test error', 'Test solution', true)
		expect(audio.play).not.toHaveBeenCalled()

		// Unmuted audio plays gently and stops when dialog closes
		audio.muted = false
		showError('Test error', 'Test solution', true)
		expect(audio.volume).toBeLessThanOrEqual(0.5)
		expect(audio.play).toHaveBeenCalledTimes(1)

		dialog.dispatchEvent(new Event('close'))
		expect(audio.pause).toHaveBeenCalled()
		expect(audio.currentTime).toBe(0)
	})
})
