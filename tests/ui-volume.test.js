import { gainToFader } from '../source/audio/volume-curve.js'
import { setupVolumeInterface } from '../source/dom/ui.volume.js'

describe('volume slider', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div class="volume-icon">
				<a class="folder-link" href="#folder-volume">Volume</a>
			</div>
			<input id="mixer-master-volume" type="range" min="0" max="1" step="0.01">
			<output id="mixer-master-output"></output>
			<input id="mixer-percussion-volume" type="range" min="0" max="1" step="0.01">
			<output id="mixer-percussion-output"></output>
			<input id="mixer-sample-volume" type="range" min="0" max="1" step="0.01">
			<output id="mixer-sample-output"></output>
			<input id="mixer-trim-volume" type="range" min="0" max="1" step="0.01">
			<output id="mixer-trim-output"></output>
			<label>
				<input id="button-mute" type="checkbox">
			</label>
		`
        document.documentElement.classList.add('beginner')
	})

    afterEach(() => document.documentElement.classList.remove('beginner'))

	test('routes Shift to percussion, Control to Person trim, and Alt to samples', async () => {
		const onVolumeChanged = jest.fn()
		const onPercussionVolumeChanged = jest.fn()
		const onTrimVolumeChanged = jest.fn()
		const onSampleVolumeChanged = jest.fn()
		const controls = setupVolumeInterface(0.8, false, {
			onVolumeChanged,
			onPercussionVolumeChanged,
			onTrimVolumeChanged,
			onSampleVolumeChanged,
			currentPercussionVolume:0.2,
			currentTrimVolume:0.8,
			currentSampleVolume:0.2,
			trimVolumeScale:5
		})
		const slider = document.getElementById('mixer-master-volume')

		slider.value = gainToFader(0.6)
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }))
		slider.value = gainToFader(0.15)
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onVolumeChanged).toHaveBeenCalledWith(expect.closeTo(0.6, 12))
		expect(onPercussionVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onPercussionVolumeChanged).toHaveBeenCalledWith(expect.closeTo(0.15, 12))

		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }))
		expect(Number(slider.value)).toBeCloseTo(gainToFader(0.6), 12)
		expect(document.getElementById('mixer-master-output').innerText).toBe('60%')

		slider.focus()
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }))
		expect(Number(slider.value)).toBeCloseTo(gainToFader(0.8), 12)
		expect(document.getElementById('mixer-master-output').innerText).toBe('400%')
		slider.value = gainToFader(1)
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onTrimVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onTrimVolumeChanged).toHaveBeenCalledWith(expect.closeTo(1, 12))
		expect(document.getElementById('mixer-master-output').innerText).toBe('500%')
		expect(onVolumeChanged).toHaveBeenCalledTimes(1)
		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }))
		expect(Number(slider.value)).toBeCloseTo(gainToFader(0.6), 12)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt' }))
		expect(Number(slider.value)).toBeCloseTo(gainToFader(0.2), 12)
		slider.value = gainToFader(0.3)
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))
		expect(onSampleVolumeChanged).toHaveBeenCalledWith(expect.closeTo(0.3, 12))
		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt' }))
		expect(Number(slider.value)).toBeCloseTo(gainToFader(0.6), 12)
		expect(document.getElementById('mixer-master-output').innerText).toBe('60%')
		slider.value = gainToFader(0.4)
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onVolumeChanged).toHaveBeenCalledTimes(2)
		expect(onVolumeChanged).toHaveBeenLastCalledWith(expect.closeTo(0.4, 12))
		controls.destroy()
	})

	test('initialises and routes every advanced mixer channel', async () => {
        document.documentElement.classList.remove('beginner')
		const callbacks = {
			onVolumeChanged: jest.fn(),
			onPercussionVolumeChanged: jest.fn(),
			onSampleVolumeChanged: jest.fn(),
			onTrimVolumeChanged: jest.fn()
		}
		const controls = setupVolumeInterface(0.8, false, {
			...callbacks,
			currentPercussionVolume:0.4,
			currentSampleVolume:0.2,
			currentTrimVolume:0.25,
			trimVolumeScale:4
		})

		expect(document.getElementById('mixer-master-output').innerText).toBe('80%')
		expect(document.getElementById('mixer-percussion-output').innerText).toBe('40%')
		expect(document.getElementById('mixer-sample-output').innerText).toBe('20%')
		expect(document.getElementById('mixer-trim-output').innerText).toBe('100%')

		const changes = [
			['master', '0.7', callbacks.onVolumeChanged],
			['percussion', '0.3', callbacks.onPercussionVolumeChanged],
			['sample', '0.1', callbacks.onSampleVolumeChanged],
			['trim', '0.5', callbacks.onTrimVolumeChanged]
		]
		changes.forEach(([mode, value]) => {
			const input = document.getElementById(`mixer-${mode}-volume`)
			input.value = gainToFader(Number(value))
			input.dispatchEvent(new Event('input', { bubbles:true }))
		})
		await new Promise(resolve => requestAnimationFrame(resolve))

		changes.forEach(([, value, callback]) => expect(callback).toHaveBeenCalledWith(expect.closeTo(Number(value), 12)))
		expect(Number(document.getElementById('mixer-master-volume').value)).toBeCloseTo(gainToFader(0.7), 12)
		expect(document.getElementById('mixer-master-output').innerText).toBe('70%')
		expect(document.getElementById('mixer-trim-output').innerText).toBe('200%')

		controls.toggleMute(true)
		changes.forEach(([mode]) => {
			expect(document.getElementById(`mixer-${mode}-volume`).disabled).toBe(true)
		})
		controls.destroy()
	})
})
