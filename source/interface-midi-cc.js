import { WebMidi } from 'webmidi'
import { dispatchMIDIActivity } from './audio/midi/midi-echo-guard.js'
import { getPitchClassForKey, normaliseKeyName } from './audio/tuning/keys.js'
import { optionLabel } from './dom/option-label.js'

// App controls use channel 16 by default, independently of musical note routing.
export const MIDI_CC_CONTROLS = [
	[7, 'volume', 'mixer-master-volume', 'Master volume'],
	[8, 'percussionVolume', 'mixer-percussion-volume', 'Percussion volume'],
	[9, 'sampleVolume', 'mixer-sample-volume', 'Sample volume'],
	[11, 'trimVolume', 'mixer-trim-volume', 'Player trim'],
	[14, 'bpm', 'tempo-input-range', 'Tempo'],
	[15, 'swing', 'tempo-swing-range', 'Swing'],
	[16, 'headNoteRangeDegrees', 'head-note-range', 'Head note range'],
	[17, 'headVerticalRangeDegrees', 'head-vertical-range', 'Vertical head range'],
	[18, 'snareReverb', 'snare-reverb-range', 'Snare reverb'],
	[19, 'headVerticalOffsetDegrees', 'head-vertical-offset', 'Head neutral height'],
	[20, 'key', 'select-key', 'Musical key'],
	[21, 'keyScale', 'select-key-scale', 'Scale'],
	[22, 'arpRate', 'select-arp-rate', 'Arpeggio rate'],
	[23, 'percussionPattern', 'select-percussion-pattern', 'Percussion pattern'],
	[24, 'percussionSound', 'select-percussion-sound', 'Percussion sound'],
	[25, 'drumkit', 'select-percussion-preset', 'Drum kit'],
	[26, 'percussionPanning', 'select-percussion-panning', 'Percussion panning'],
	[27, 'beatViz', 'select-beat-viz', 'Beat display'],
	[28, 'visualiser', 'select-viz', 'Visualiser'],
	[29, 'eyes', 'select-eyes', 'Eye style'],
	[30, 'instrumentPack', 'select-samples', 'Instrument pack'],
	[31, 'display', 'select-display', 'Display mode'],
	[33, 'divisions', 'select-subdivisions', 'Face subdivisions'],
	[34, 'reverbSpace', 'select-impulse', 'Reverb space'],
	[35, 'hud', 'button-hud', 'Input device display'],
	[64, 'muted', 'button-mute', 'Mute'],
	[65, 'backingTrack', 'button-percussion', 'Backing percussion'],
	[66, 'metronome', 'button-metronome', 'Metronome'],
	[67, 'quantise', 'button-quantise', 'Quantise'],
	[68, 'rapidPercussion', 'button-rapid-percussion', 'Rapid percussion'],
	[69, 'performanceDrums', 'button-performance-drums', 'Performance drums'],
	[70, 'midiPercussion', 'button-midi-percussion', 'MIDI percussion'],
	[71, 'disco', 'button-disco', 'Disco'],
	[72, 'spectrogram', 'button-spectrogram', 'Audio visualisation'],
	[73, 'clear', 'button-clear', 'Hide video'],
	[74, 'overlays', 'button-overlay', 'Face overlays'],
	[75, 'masks', 'button-meshes', 'Face mesh'],
	[76, 'eyebrows', 'button-eyebrows', 'Eyebrows'],
	[77, 'lipStyle', 'select-lips', 'Lip style'],
	[78, 'text', 'button-subtitles', 'Subtitles'],
	[79, 'showOverlay', 'button-toggle-overlay', 'Overlay canvas'],
	[80, 'flood', 'button-flood', 'Fill screen'],
	[81, 'speak', 'button-speak', 'Spoken feedback'],
	[82, 'showPoints', 'button-points', 'Points'],
	[83, 'advancedMode', 'button-toggle-advanced', 'Expert mode'],
	[84, 'automationMode', 'button-automate', 'Automation'],
	[85, 'showSettings', 'button-settings', 'Settings'],
].map(([cc, key, id, label]) => ({ cc, key, id, label }))

const choices = element => Array.from(element.options).filter(option => !option.disabled && !option.parentElement.disabled)
const bounds = element => [Number(element.min || 0), Number(element.max || 1)]
const clamp = value => Math.max(0, Math.min(127, Math.round(value)))
const sessions = new WeakMap()

export const encodeMIDIControl = (element, value) => {
	if (element.type === 'checkbox') return value ? 127 : 0
	if (element.tagName === 'SELECT') {
		const options = choices(element)
		const index = options.findIndex(option => option.value === String(value))
		return index < 0 ? null : clamp(index * 127 / Math.max(1, options.length - 1))
	}
	const [min, max] = bounds(element)
	return Number.isFinite(Number(value)) && max > min ? clamp((Number(value) - min) * 127 / (max - min)) : null
}

export const decodeMIDIControl = (element, value) => {
	if (element.type === 'checkbox') return value >= 64
	if (element.tagName === 'SELECT') {
		const options = choices(element)
		return options[Math.round(value * (options.length - 1) / 127)]?.value
	}
	const [min, max] = bounds(element)
	const step = Number(element.step) || 0
	const scaled = min + value * (max - min) / 127
	return Math.min(max, Math.max(min, step ? min + Math.round((scaled - min) / step) * step : scaled))
}

export const setupMIDICC = ({ stateMachine, root = document }) => {
	sessions.get(stateMachine)?.()
	const inputs = new Map()
	const values = new Map()
	const recent = new Map()
	let applying = false
	let active = true
	const enabled = () => active && stateMachine.get('midi') && stateMachine.get('midiCC') !== false
	const channel = () => Math.max(1, Math.min(16, Number(stateMachine.get('midiCCChannel')) || 16))
	const read = (control, element) => {
		const value = stateMachine.get(control.key)
		if (control.key === 'key') {
			if (stateMachine.get('harmonyMode') === 'free-range') return 'free-range'
			if (choices(element).some(option => option.value === String(value))) return value
			return normaliseKeyName(getPitchClassForKey(value))
		}
		// Some selectors (such as eye style) publish only a boolean in app state.
		if (element.tagName === 'SELECT' && !choices(element).some(option => option.value === String(value))) return element.value
		return value ?? (element.type === 'checkbox' ? element.checked : element.value)
	}
	const publish = (control, value) => {
		if (!enabled() || applying || value === null || values.get(control.cc) === value) return
		values.set(control.cc, value)
		for (const output of WebMidi.outputs) {
			if (!output.sendControlChange) continue
			const options = { channels: [channel()] }
			// Record before sending: virtual ports can echo synchronously.
			recent.set(`${channel()}:${control.cc}:${value}`, performance.now())
			try {
				output.sendControlChange(control.cc, value, options)
				dispatchMIDIActivity({ direction: 'output', type: 'controlchange', controller: control.cc, value, port: output.name, source: 'app-controls' })
			} catch (error) {
				console.warn('MIDI CC output failed', output.name, error)
			}
		}
		for (const [key, at] of recent) if (performance.now() - at > 150) recent.delete(key)
	}
	const receive = event => {
		if (!enabled() || event.message?.channel !== channel()) return
		const cc = event.controller?.number ?? event.message?.dataBytes?.[0]
		const value = event.rawValue ?? event.message?.dataBytes?.[1]
		if (!Number.isInteger(value) || value < 0 || value > 127) return
		const at = recent.get(`${channel()}:${cc}:${value}`)
		if (at !== undefined && performance.now() - at <= 150) return
		const control = MIDI_CC_CONTROLS.find(control => control.cc === cc)
		const element = control && root.getElementById(control.id)
		if (!element || element.disabled) return
		const next = decodeMIDIControl(element, value)
		if (next === undefined) return
		const current = read(control, element)
		values.set(cc, encodeMIDIControl(element, next))
		if (String(current) === String(next)) return
		applying = true
		try {
			if (element.type === 'checkbox') {
				element.checked = Boolean(current)
				element.click()
			} else {
				element.value = next
				element.dispatchEvent(new Event('input', { bubbles: true }))
				element.dispatchEvent(new Event('change', { bubbles: true }))
			}
		} finally { applying = false }
	}
	const refreshInputs = () => {
		for (const [input, listener] of inputs) {
			if (!WebMidi.inputs.includes(input)) {
				input.removeListener('controlchange', listener)
				inputs.delete(input)
			}
		}
		for (const input of WebMidi.inputs) {
			if (inputs.has(input)) continue
			input.addListener('controlchange', receive)
			inputs.set(input, receive)
		}
	}
	const onState = key => {
		if (['midiCC', 'midiCCChannel', 'midiEyebrowMode', 'midiEyebrowCC'].includes(key)) syncSettings()
		if (key === 'key' || key === 'harmonyMode') {
			queueMicrotask(() => {
				const control = MIDI_CC_CONTROLS.find(control => control.key === 'key')
				const element = root.getElementById(control.id)
				if (element) publish(control, encodeMIDIControl(element, read(control, element)))
			})
			return
		}
		for (const control of MIDI_CC_CONTROLS) {
			if (key && key !== control.key) continue
			const element = root.getElementById(control.id)
			if (element) publish(control, encodeMIDIControl(element, read(control, element)))
		}
	}
	const onUI = event => {
		const control = MIDI_CC_CONTROLS.find(control => control.id === event.target.id)
		if (control) publish(control, encodeMIDIControl(event.target, event.target.type === 'checkbox' ? event.target.checked : event.target.value))
	}
	const enableInput = root.getElementById('midi-cc-enabled')
	const channelInput = root.getElementById('midi-cc-channel')
	const syncButton = root.getElementById('midi-cc-sync')
	const eyebrowMode = root.getElementById('midi-eyebrow-mode')
	const eyebrowCC = root.getElementById('midi-eyebrow-cc')
	const onSync = () => { values.clear(); onState() }
	const syncSettings = () => {
		if (enableInput) enableInput.checked = stateMachine.get('midiCC') !== false
		if (channelInput) channelInput.value = channel()
		if (eyebrowMode) eyebrowMode.value = stateMachine.get('midiEyebrowMode') === 'pitchbend' ? 'pitchbend' : 'cc'
		if (eyebrowCC) {
			eyebrowCC.value = stateMachine.get('midiEyebrowCC') ?? 74
			eyebrowCC.disabled = stateMachine.get('midiEyebrowMode') === 'pitchbend'
		}
		const referenceChannel = root.getElementById('midi-cc-reference-channel')
		if (referenceChannel) referenceChannel.textContent = channel()
	}
	const onEnabled = () => stateMachine.set('midiCC', enableInput.checked)
	const onEyebrowMode = () => stateMachine.set('midiEyebrowMode', eyebrowMode.value === 'pitchbend' ? 'pitchbend' : 'cc')
	const onEyebrowCC = () => {
		const next = Number(eyebrowCC.value)
		if (eyebrowCC.value !== '' && Number.isInteger(next) && next >= 0 && next < 120) stateMachine.set('midiEyebrowCC', next)
		else syncSettings()
	}
	const onChannel = () => {
		const next = Number(channelInput.value)
		if (Number.isInteger(next) && next >= 1 && next <= 16) {
			values.clear()
			stateMachine.set('midiCCChannel', next)
		} else syncSettings()
	}
	syncSettings()
	eyebrowMode?.addEventListener('change', onEyebrowMode)
	eyebrowCC?.addEventListener('change', onEyebrowCC)
	enableInput?.addEventListener('change', onEnabled)
	channelInput?.addEventListener('change', onChannel)
	syncButton?.addEventListener('click', onSync)
	const reference = root.getElementById('midi-cc-reference')
	const referenceDialog = root.getElementById('midi-cc-dialog')
	const referenceButton = root.getElementById('midi-cc-open')
	const renderReference = () => {
		if (!reference) return
		reference.replaceChildren()
		for (const control of MIDI_CC_CONTROLS) {
			const element = root.getElementById(control.id)
			let mapping = 'Control unavailable in this view'
			if (element?.type === 'checkbox') mapping = '0–63: Off · 64–127: On'
			else if (element?.tagName === 'SELECT') {
				const options = choices(element)
				mapping = options.map((option, index) => `${Math.round(index * 127 / Math.max(1, options.length - 1))}: ${option.label || optionLabel(option)}`).join(' · ') || 'No options available'
			} else if (element) {
				const [min, max] = bounds(element)
				mapping = `0–127 → ${min}–${max}`
			}
			const row = root.createElement('tr')
			for (const [index, value] of [control.cc, control.label, mapping].entries()) {
				const cell = root.createElement(index === 0 ? 'th' : 'td')
				if (index === 0) cell.scope = 'row'
				cell.textContent = value
				row.appendChild(cell)
			}
			reference.appendChild(row)
		}
	}
	const openReference = () => {
		renderReference()
		syncSettings()
		if (referenceDialog && !referenceDialog.open) referenceDialog.showModal()
	}
	renderReference()
	referenceButton?.addEventListener('click', openReference)
	stateMachine.addEventListener(onState)
	root.addEventListener('input', onUI)
	root.addEventListener('change', onUI)
	WebMidi.addListener('connected', refreshInputs)
	WebMidi.addListener('disconnected', refreshInputs)
	refreshInputs()
	const dispose = () => {
		active = false
		eyebrowMode?.removeEventListener('change', onEyebrowMode)
		eyebrowCC?.removeEventListener('change', onEyebrowCC)
		stateMachine.removeEventListener(onState)
		root.removeEventListener('input', onUI)
		root.removeEventListener('change', onUI)
		WebMidi.removeListener('connected', refreshInputs)
		WebMidi.removeListener('disconnected', refreshInputs)
		for (const [input, listener] of inputs) input.removeListener('controlchange', listener)
		enableInput?.removeEventListener('change', onEnabled)
		channelInput?.removeEventListener('change', onChannel)
		syncButton?.removeEventListener('click', onSync)
		referenceButton?.removeEventListener('click', openReference)
		sessions.delete(stateMachine)
	}
	sessions.set(stateMachine, dispose)
	return dispose
}
