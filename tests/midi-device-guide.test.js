import { offerMIDIDeviceGuides } from '../source/dom/ui.midi-device-guide.js'
import { getMIDIDeviceIntegration, INTEGRATION_NOTES, INTEGRATION_MONITOR, setMIDIDeviceIntegration } from '../source/audio/midi/midi-device-integration.js'
import { setToast } from '../source/dom/tooltips.js'

jest.mock('../source/dom/tooltips.js', () => ({ setToast: jest.fn() }))

// The device catalogue is a static file; these tests run without it
globalThis.fetch ??= jest.fn(() => Promise.reject(new Error('offline')))

const people = [
	{ name: 'Ada', playerNumber: 0 },
	{ name: 'Grace', playerNumber: 1 },
]

const submit = (dialog, value) => {
	const button = dialog.querySelector(`button[value="${value}"]`)
	const event = new Event('submit', { cancelable: true })
	Object.defineProperty(event, 'submitter', { value: button })
	dialog.querySelector('form').dispatchEvent(event)
}

afterEach(() => {
	document.body.innerHTML = ''
	localStorage.clear()
})

test('guides a new input and saves who it augments', async () => {
	const input = { id: 'strum-in', name: 'Guide Strum', manufacturer: 'Arcana' }
	await offerMIDIDeviceGuides([input], [], people)

	const dialog = document.querySelector('dialog.midi-device-guide')
	expect(dialog.hasAttribute('open')).toBe(true)
	expect(dialog.querySelector('h2').textContent).toBe('Guide Strum connected')
	expect(dialog.querySelector('[name="midi-guide-mode"]:checked').value).toBe(INTEGRATION_NOTES)

	dialog.querySelector('[name="midi-guide-person"][value="1"]').checked = true
	submit(dialog, 'save')

	expect(getMIDIDeviceIntegration(input)).toEqual({ mode: INTEGRATION_NOTES, people: [1], echoes: true, configured: true })
	expect(setToast).toHaveBeenCalledWith('Guide Strum connected · Play its notes · Grace')
})

test('asks whether a device that can be sent notes echoes them back', async () => {
	const input = { id: 'echo-in', name: 'Echo Keys', manufacturer: 'Acme' }
	const output = { id: 'echo-out', name: 'Echo Keys', manufacturer: 'Acme' }
	await offerMIDIDeviceGuides([input], [output], people)

	const dialog = document.querySelector('dialog.midi-device-guide')
	const echo = dialog.querySelector('[name="midi-guide-echo"]')
	expect(echo.checked).toBe(true)
	echo.checked = false
	submit(dialog, 'save')

	expect(getMIDIDeviceIntegration(input).echoes).toBe(false)
})

test('does not ask about echo for a device PhotoSYNTH cannot send to', async () => {
	await offerMIDIDeviceGuides([{ id: 'solo-in', name: 'Solo Pads', manufacturer: 'Acme' }], [], people)
	expect(document.querySelector('[name="midi-guide-echo"]')).toBeNull()
})

test('announces a device that is already set up instead of interrupting', async () => {
	const input = { id: 'known-in', name: 'Known Keys', manufacturer: 'Acme' }
	setMIDIDeviceIntegration(input, { mode: INTEGRATION_MONITOR })
	await offerMIDIDeviceGuides([input], [], people)

	expect(document.querySelector('dialog.midi-device-guide')).toBeNull()
	expect(setToast).toHaveBeenCalledWith('Known Keys connected · Monitor only')
})

test('escapes device names in announcements', async () => {
	const input = { id: 'evil-in', name: '<img src=x onerror=alert(1)>', manufacturer: 'Acme' }
	setMIDIDeviceIntegration(input, { mode: INTEGRATION_MONITOR })
	await offerMIDIDeviceGuides([input], [], people)

	expect(setToast).toHaveBeenCalledWith('&lt;img src=x onerror=alert(1)&gt; connected · Monitor only')
})

test('skips a queued guide for a device unplugged while another guide is open', async () => {
	const first = { id: 'first-in', name: 'First Keys', manufacturer: 'Acme' }
	const second = { id: 'second-in', name: 'Second Pads', manufacturer: 'Acme' }
	await offerMIDIDeviceGuides([first, second], [], people)
	const dialog = document.querySelector('dialog.midi-device-guide')
	expect(dialog.querySelector('h2').textContent).toBe('First Keys connected')

	await offerMIDIDeviceGuides([first], [], people)
	dialog.removeAttribute('open')
	dialog.dispatchEvent(new Event('close'))
	await new Promise(resolve => setTimeout(resolve))

	expect(dialog.querySelector('h2').textContent).toBe('First Keys connected')
})

test('keeps identical devices on Windows apart', () => {
	setMIDIDeviceIntegration({ name: 'MPK mini 3', manufacturer: 'Akai' }, { mode: INTEGRATION_NOTES, people: [0] })
	expect(getMIDIDeviceIntegration({ name: '2- MPK mini 3', manufacturer: 'Akai' }).configured).toBe(false)
})
