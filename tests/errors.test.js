import { getCameraErrorCode, getErrorMessage } from '../source/dom/errors.js'

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
