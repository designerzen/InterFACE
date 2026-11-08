import { setupVolumeInterface } from '../source/dom/ui.volume.js'
import { faderToGain } from '../source/audio/volume-curve.js'
import { readFileSync } from 'fs'

const volumePanelMarkup = readFileSync('source/partials/volume-panel.pug', 'utf8')
const volumePanelStyles = readFileSync('source/assets/styles/sections/panel-volume.scss', 'utf8')

const range = (id, value) => `<input id="${id}" type="range" min="0" max="1" step="0.01" value="${value}">`
const buttons = (id, name) => `
	<button type="button" class="volume-step-button" data-volume-target="${id}" data-volume-direction="decrease" aria-label="Decrease ${name} volume">−</button>
	<button type="button" class="volume-step-button" data-volume-target="${id}" data-volume-direction="increase" aria-label="Increase ${name} volume">+</button>
`

describe('Volume range step controls', () => {
	let volumeInterface

    test('shares one master range between simple volume and the advanced mixer', () => {
        expect(volumePanelMarkup).not.toContain('volume-input-range')
        expect(volumePanelMarkup).not.toContain('fieldset#volume-panel')
        expect(volumePanelMarkup).toContain('fieldset.mixer-channel.mixer-channel-master')
        expect(volumePanelMarkup.match(/input#mixer-master-volume\.vertical/g)).toHaveLength(1)
        expect(volumePanelStyles).toContain('.beginner #mixer-panel > .mixer-channel:not(.mixer-channel-master)')
        expect(volumePanelStyles).toContain('.beginner #mixer-panel > .mixer-channel-master')
    })

	beforeEach(() => {
		document.body.innerHTML = `
			<div><a class="folder-link" href="#folder-volume">Volume</a></div>
			<label>Mute<input id="button-mute" type="checkbox"></label>
			<input id="button-toggle-advanced" type="checkbox">
			<button id="button-volume-mixer-mode" type="button" aria-controls="mixer-panel" aria-expanded="false"><span></span></button>

			${range('mixer-master-volume', 0.5)}
			${buttons('mixer-master-volume', 'master')}
			<output id="mixer-master-output"></output>
			${range('mixer-percussion-volume', 0.2)}
			${buttons('mixer-percussion-volume', 'percussion')}
			<output id="mixer-percussion-output"></output>
			${range('mixer-sample-volume', 0.3)}
			${buttons('mixer-sample-volume', 'sample')}
			<output id="mixer-sample-output"></output>
			${range('mixer-trim-volume', 0.1)}
			${buttons('mixer-trim-volume', 'person trim')}
			<output id="mixer-trim-output"></output>
		`
		window.requestAnimationFrame = callback => callback()
		document.documentElement.classList.add('beginner')
		const advancedModeToggle = document.getElementById('button-toggle-advanced')
		advancedModeToggle.addEventListener('click', () => {
			document.documentElement.classList.toggle('beginner', !advancedModeToggle.checked)
		})
	})

	afterEach(() => {
		volumeInterface?.destroy()
		document.documentElement.classList.remove('beginner')
	})

	test('expands and collapses through the existing advanced-mode toggle', () => {
		volumeInterface = setupVolumeInterface(0.5)

		const modeButton = document.getElementById('button-volume-mixer-mode')
		const advancedModeToggle = document.getElementById('button-toggle-advanced')

		modeButton.click()
		expect(advancedModeToggle.checked).toBe(true)
		expect(document.documentElement.classList.contains('beginner')).toBe(false)
		expect(modeButton.getAttribute('aria-expanded')).toBe('true')
		expect(modeButton.getAttribute('aria-label')).toBe('Collapse to simple volume')

		modeButton.click()
		expect(advancedModeToggle.checked).toBe(false)
		expect(document.documentElement.classList.contains('beginner')).toBe(true)
		expect(modeButton.getAttribute('aria-expanded')).toBe('false')
		expect(modeButton.getAttribute('aria-label')).toBe('Expand to full mixer')
	})

	test('increments and decrements the compact volume slider through its UI update path', () => {
		const onVolumeChanged = jest.fn()
		volumeInterface = setupVolumeInterface(0.5, false, { onVolumeChanged })
		const master = document.getElementById('mixer-master-volume')
		master.value = '0.5'
		master.dispatchEvent(new Event('input'))

		document.querySelector('[data-volume-target="mixer-master-volume"][data-volume-direction="increase"]').click()
		expect(document.getElementById('mixer-master-volume').value).toBe('0.51')
		expect(document.getElementById('mixer-master-output').innerText).toBe(`${Math.round(faderToGain(0.51) * 100)}%`)
		expect(onVolumeChanged).toHaveBeenLastCalledWith(expect.closeTo(faderToGain(0.51), 12))

		document.querySelector('[data-volume-target="mixer-master-volume"][data-volume-direction="decrease"]').click()
		expect(document.getElementById('mixer-master-volume').value).toBe('0.5')
		expect(document.getElementById('mixer-master-output').innerText).toBe(`${Math.round(faderToGain(0.5) * 100)}%`)
	})

	test('updates the selected mixer channel and disables controls at limits or while muted', () => {
		const onTrimVolumeChanged = jest.fn()
		volumeInterface = setupVolumeInterface(0.5, false, {
			currentPercussionVolume:0.2,
			currentSampleVolume:0.3,
			currentTrimVolume:0.1,
			onTrimVolumeChanged,
			trimVolumeScale:4
		})

		const trim = document.getElementById('mixer-trim-volume')
		trim.value = '0.1'
		trim.dispatchEvent(new Event('input'))
		document.querySelector('[data-volume-target="mixer-trim-volume"][data-volume-direction="increase"]').click()
		expect(document.getElementById('mixer-trim-output').innerText).toBe(`${Math.round(faderToGain(0.11) * 400)}%`)
		expect(onTrimVolumeChanged).toHaveBeenCalledWith(expect.closeTo(faderToGain(0.11), 12))

		const master = document.getElementById('mixer-master-volume')
		master.value = '1'
		master.dispatchEvent(new Event('input'))
		expect(document.querySelector('[data-volume-target="mixer-master-volume"][data-volume-direction="increase"]').disabled).toBe(true)

		document.getElementById('button-mute').click()
		expect(document.querySelectorAll('.volume-step-button:disabled')).toHaveLength(8)
	})
})
