import { observeInteractivityThroughUserEvents } from '../source/utils/inactivity.js'

describe('page inactivity', () => {
	let cleanup, onActive, onInactive, control

	beforeEach(async () => {
		jest.useFakeTimers()
		document.body.innerHTML = '<button id="video"></button><input id="control">'
		control = document.getElementById('control')
		onActive = jest.fn()
		onInactive = jest.fn()
		cleanup = await observeInteractivityThroughUserEvents(
			document.getElementById('video'), onActive, onInactive, 1000
		)
	})

	afterEach(() => {
		cleanup()
		jest.useRealTimers()
	})

	test.each(['mousemove', 'pointermove', 'touchmove', 'keydown', 'wheel'])(
		'%s outside the video keeps the cursor visible, even when propagation is stopped', type => {
			control.addEventListener(type, event => event.stopPropagation())
			for (let i = 0; i < 5; i++) {
				jest.advanceTimersByTime(900)
				control.dispatchEvent(new Event(type, { bubbles: true }))
			}
			expect(onInactive).not.toHaveBeenCalled()
			jest.advanceTimersByTime(999)
			expect(onInactive).not.toHaveBeenCalled()
			jest.advanceTimersByTime(1)
			expect(onInactive).toHaveBeenCalledTimes(1)
		}
	)

	test('starts the inactivity timeout without requiring initial movement', () => {
		expect(onActive).toHaveBeenCalledTimes(1)
		jest.advanceTimersByTime(1000)
		expect(onInactive).toHaveBeenCalledTimes(1)
		control.dispatchEvent(new Event('pointermove', { bubbles: true }))
		expect(onActive).toHaveBeenCalledTimes(2)
		jest.advanceTimersByTime(999)
		expect(onInactive).toHaveBeenCalledTimes(1)
	})

	test('leaving the viewport waits for inactivity instead of hiding mid-movement', () => {
		jest.advanceTimersByTime(500)
		document.dispatchEvent(new MouseEvent('mouseleave', { clientX: 0, clientY: 0 }))
		expect(onInactive).not.toHaveBeenCalled()
		jest.advanceTimersByTime(500)
		expect(onInactive).toHaveBeenCalledTimes(1)
	})

	test('movement between video descendants does not cancel inactivity detection', () => {
		document.getElementById('video').dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
		jest.advanceTimersByTime(1000)
		expect(onInactive).toHaveBeenCalledTimes(1)
	})

	test('returning to the page restores visibility and restarts the timeout', () => {
		window.dispatchEvent(new Event('pagehide'))
		expect(onInactive).toHaveBeenCalledTimes(1)
		window.dispatchEvent(new Event('pageshow'))
		expect(onActive).toHaveBeenCalledTimes(2)
		jest.advanceTimersByTime(1000)
		expect(onInactive).toHaveBeenCalledTimes(2)
	})

	test('cleanup cancels the timer and removes activity listeners', () => {
		cleanup()
		onActive.mockClear()
		control.dispatchEvent(new Event('pointermove', { bubbles: true }))
		jest.advanceTimersByTime(2000)
		expect(onInactive).not.toHaveBeenCalled()
		expect(onActive).not.toHaveBeenCalled()
	})
})
