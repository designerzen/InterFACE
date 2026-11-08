import { waitForCamera } from '../source/hardware/wait-for-camera.js'

beforeEach(() => {
	jest.useFakeTimers()
	Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: new EventTarget() })
})

afterEach(() => jest.useRealTimers())

test('resumes startup on device connection and cleans up the retry timer', async () => {
	const stream = {}
	const connect = jest.fn()
		.mockRejectedValueOnce(new DOMException('Missing', 'NotFoundError'))
		.mockResolvedValue(stream)
	const onWaiting = jest.fn()
	const ready = waitForCamera(connect, onWaiting)
	await Promise.resolve()
	expect(onWaiting).toHaveBeenCalledWith(true)
	navigator.mediaDevices.dispatchEvent(new Event('devicechange'))
	await expect(ready).resolves.toBe(stream)
	expect(onWaiting).toHaveBeenLastCalledWith(false)
	expect(jest.getTimerCount()).toBe(0)
	navigator.mediaDevices.dispatchEvent(new Event('devicechange'))
	expect(connect).toHaveBeenCalledTimes(2)
})

test('keeps waiting across missing camera retries without needing devicechange', async () => {
	const connect = jest.fn()
		.mockRejectedValueOnce(new DOMException('Missing', 'NotFoundError'))
		.mockRejectedValueOnce(new DOMException('Missing', 'DevicesNotFoundError'))
		.mockResolvedValue('connected')
	const onWaiting = jest.fn()
	const ready = waitForCamera(connect, onWaiting)
	await jest.advanceTimersByTimeAsync(3000)
	await expect(ready).resolves.toBe('connected')
	expect(onWaiting.mock.calls).toEqual([[true], [false]])
})

test.each(['NotAllowedError', 'NotReadableError'])('propagates %s without retrying', async name => {
	const error = new DOMException('Camera error', name)
	const connect = jest.fn().mockRejectedValue(error)
	const onWaiting = jest.fn()
	await expect(waitForCamera(connect, onWaiting)).rejects.toBe(error)
	expect(onWaiting).not.toHaveBeenCalled()
	expect(jest.getTimerCount()).toBe(0)
})
