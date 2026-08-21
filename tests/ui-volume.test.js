import { setupVolumeInterface } from '../source/dom/ui.volume.js'

describe('volume slider', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div class="volume-icon">
				<a class="folder-link" href="#folder-volume">Volume</a>
			</div>
			<output id="volumeoutput"></output>
			<input id="volume-input-range" type="range" min="0" max="1" step="0.05">
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
	})

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
			currentTrimVolume:0.25,
			currentSampleVolume:0.2,
			trimVolumeScale:4
		})
		const slider = document.getElementById('volume-input-range')

		slider.value = '0.6'
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }))
		slider.value = '0.15'
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onVolumeChanged).toHaveBeenCalledWith('0.6')
		expect(onPercussionVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onPercussionVolumeChanged).toHaveBeenCalledWith('0.15')

		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }))
		expect(slider.value).toBe('0.6')
		expect(document.getElementById('volumeoutput').innerText).toBe('60%')

		slider.focus()
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }))
		expect(slider.value).toBe('0.25')
		expect(document.getElementById('volumeoutput').innerText).toBe('100%')
		slider.value = '1'
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onTrimVolumeChanged).toHaveBeenCalledTimes(1)
		expect(onTrimVolumeChanged).toHaveBeenCalledWith('1')
		expect(document.getElementById('volumeoutput').innerText).toBe('400%')
		expect(onVolumeChanged).toHaveBeenCalledTimes(1)
		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }))
		expect(slider.value).toBe('0.6')

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt' }))
		expect(slider.value).toBe('0.2')
		slider.value = '0.3'
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))
		expect(onSampleVolumeChanged).toHaveBeenCalledWith('0.3')
		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt' }))
		expect(slider.value).toBe('0.6')
		expect(document.getElementById('volumeoutput').innerText).toBe('60%')
		slider.value = '0.4'
		slider.dispatchEvent(new Event('input', { bubbles: true }))
		await new Promise(resolve => requestAnimationFrame(resolve))

		expect(onVolumeChanged).toHaveBeenCalledTimes(2)
		expect(onVolumeChanged).toHaveBeenLastCalledWith('0.4')
		controls.destroy()
	})

	test('initialises and routes every advanced mixer channel', async () => {
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
			input.value = value
			input.dispatchEvent(new Event('input', { bubbles:true }))
		})
		await new Promise(resolve => requestAnimationFrame(resolve))

		changes.forEach(([, value, callback]) => expect(callback).toHaveBeenCalledWith(value))
		expect(document.getElementById('volume-input-range').value).toBe('0.7')
		expect(document.getElementById('volumeoutput').innerText).toBe('70%')
		expect(document.getElementById('mixer-trim-output').innerText).toBe('200%')

		controls.toggleMute(true)
		changes.forEach(([mode]) => {
			expect(document.getElementById(`mixer-${mode}-volume`).disabled).toBe(true)
		})
		controls.destroy()
	})
})
