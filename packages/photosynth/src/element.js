import { Photosynth } from './runtime.js'
import { PHOTOSYNTH_STATE, PHOTOSYNTH_ERROR, PHOTOSYNTH_CONFIGURATION, PHOTOSYNTH_MUSIC, PHOTOSYNTH_FRAME } from './events.js'
import { MOUTH_DYNAMICS_PRESETS } from './people/lip-sensitivity.js'
import { PERSON_TYPE_DATA } from './people/person.presets.js'
import { drawFaceFeatures } from './visual/2d.face-features.js'
import { LIP_STYLE_OPTIONS } from './visual/lip-styles.js'
import { EYEBROW_STYLES } from './visual/eyebrow-styles.js'

const controls = [
	['operatingMode', 'Playing mode', PERSON_TYPE_DATA.map((value, index) => [index, value.description])],
	['chord', 'Play expressive chords', 'checkbox'],
	['arpeggioRate', 'Arpeggio rate', ['auto', 'slow', 'medium', 'fast']],
	['muted', 'Mute performer', 'checkbox'],
	['instrumentGestures', 'Hold a wink to request another sound', 'checkbox'],
	['channel', 'MIDI channel', 'number', 1, 16, 1],
	['octaveLow', 'Lowest octave', 'number', 0, 8, 1],
	['octaveHigh', 'Highest octave', 'number', 0, 8, 1],
	['noteController', 'Note movement', ['roll', 'pitch', 'yaw']],
	['octaveController', 'Octave movement', ['pitch', 'roll', 'yaw']],
	['headNoteRangeDegrees', 'Head note range (degrees)', 'range', 20, 120, 1],
	['headVerticalRangeDegrees', 'Head octave range (degrees)', 'range', 20, 120, 1],
	['headVerticalOffsetDegrees', 'Head resting angle (degrees)', 'range', -30, 30, 1],
	['lipRange', 'Mouth travel', 'range', 0, 100, 1],
	['mouthCutOff', 'Mouth gate', 'range', 0, 0.4, 0.01],
	['mouthDynamics', 'Mouth dynamics', MOUTH_DYNAMICS_PRESETS.map(value => [value.id, value.label])],
	['maximumAmplitude', 'Maximum expression', 'range', 0, 1, 0.01],
	['harmonyMode', 'Harmony', [['free-range', 'Expressive'], ['global-key', 'Stay in key']]],
	['tonic', 'Key root', ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].map((value, index) => [index, value])],
	['keyScale', 'Scale', ['MAJOR_SCALE', 'NATURAL_MINOR_SCALE', 'PENTATONIC_MAJOR_SCALE', 'CHROMATIC_SCALE']],
	['pitchBend', 'Eyebrow pitch bend', 'checkbox'],
	['stereoPan', 'Eye-controlled pan', 'checkbox'],
	['handPinch', 'Hand pinch threshold', 'range', 0.05, 0.8, 0.01],
	['root', 'Lowest hand note', 'number', 0, 103, 1],
	['drawEyes', 'Draw expressive eyes', 'checkbox'],
	['eyebrowStyle', 'Eyebrow style', EYEBROW_STYLES.map(style => [style.value, style.label])],
	['lipStyle', 'Lip style', LIP_STYLE_OPTIONS],
	['photoSensitive', 'Reduce flashing effects', 'checkbox']
]

const style = `
:host{display:block;font:inherit;color:var(--photosynth-color,#edf2f7);background:var(--photosynth-background,#17212d);border-radius:12px;padding:16px;box-sizing:border-box}
*{box-sizing:border-box}button,select,input{font:inherit}button,select{min-height:44px;padding:8px;color:inherit;background:#263445;border:1px solid #718096;border-radius:6px}button{cursor:pointer}:focus-visible{outline:3px solid var(--photosynth-accent,#b8ee71);outline-offset:2px}
.toolbar,.settings{display:flex;flex-wrap:wrap;align-items:center;gap:12px}.stage{position:relative;aspect-ratio:4/3;background:#080d12;margin:12px 0;overflow:hidden;border-radius:8px}video,canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}video{transform:scaleX(-1)}canvas{pointer-events:none}label{display:grid;gap:4px;min-width:140px}input[type=range]{width:100%}.settings{align-items:start;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.settings label:has(input[type=checkbox]){display:flex;align-items:center;min-height:44px}output{font-variant-numeric:tabular-nums}p{line-height:1.5}.status{min-height:1.5em}.performers{white-space:pre-line}summary{cursor:pointer;padding:12px 0}h2{margin-top:0}
`

export class PhotosynthElement extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.innerHTML = `<style>${style}</style>
<section aria-label="PhotoSYNTH musical input"><h2>PhotoSYNTH</h2>
<p>Open your mouth or smile to play. Tilt your head to choose notes and look up or down to change octave. Connect this input to your app’s sound output.</p>
<div class="toolbar"><label>Camera<select id="camera"><option value="">Default camera</option></select></label><label>Tracking<select id="mode"><option value="face">Faces</option><option value="hands">Hands</option></select></label><button id="start" type="button">Start camera</button><button id="stop" type="button" disabled>Stop</button></div>
<div class="stage"><video muted playsinline aria-label="Mirrored camera preview"></video><canvas aria-hidden="true"></canvas></div>
<p class="status" role="status">Camera is off.</p><output class="performers" aria-label="Performers"></output>
<details><summary>Performance settings</summary><div class="toolbar"><label>Performer<select id="performer"></select></label><button id="calibrate" type="button">Set resting pose</button><label><input id="points" type="checkbox" checked>Show tracking points</label></div><div class="settings"></div></details></section>`
		this.inputs = new Map()
		const doc = this.ownerDocument
		for (const [key, title, type, min, max, step] of controls) {
			const label = doc.createElement('label')
			label.append(doc.createTextNode(title))
			const input = doc.createElement(Array.isArray(type) ? 'select' : 'input')
			if (Array.isArray(type)) {
				for (const entry of type) {
					const [value, text] = Array.isArray(entry) ? entry : [entry, entry]
					const option = doc.createElement('option')
					option.value = value
					option.textContent = text
					input.append(option)
				}
			} else {
				input.type = type
				if (min !== undefined) Object.assign(input, { min, max, step })
			}
			input.dataset.key = key
			label.append(input)
			this.query('.settings').append(label)
			this.inputs.set(key, input)
		}
	}
	query(selector) { return this.shadowRoot.querySelector(selector) }
	get runtime() {
		if (!this.engine) { this.engine = new Photosynth(); this.ownsEngine = true }
		return this.engine
	}
	set runtime(value) {
		if (this.engine === value) return
		this.unbind()
		if (this.ownsEngine) this.engine?.dispose()
		this.engine = value
		this.ownsEngine = false
		if (this.isConnected) this.bind()
	}
	connectedCallback() { this.bind() }
	disconnectedCallback() {
		this.unbind()
		if (this.ownsEngine) this.engine?.stop()
	}
	bind() {
		this.unbind()
		const runtime = this.runtime
		this.query('video').style.transform = runtime.options.mirrored === false ? 'none' : 'scaleX(-1)'
		this.listeners = new AbortController()
		const signal = this.listeners.signal
		const on = (element, type, handler) => element.addEventListener(type, handler, { signal })
		on(this.query('#start'), 'click', () => { void this.start().catch(error => this.showError(error)) })
		on(this.query('#stop'), 'click', () => this.stop())
		on(this.query('#performer'), 'change', () => this.syncSettings())
		on(this.query('#calibrate'), 'click', () => { this.query('.status').textContent = runtime.calibrate(this.selected) ? 'Resting pose saved.' : 'Move into view before setting your resting pose.' })
		on(this.query('#camera'), 'change', () => { if (runtime.state === 'running') { runtime.stop(); void this.start().catch(error => this.showError(error)) } })
		on(this.query('#mode'), 'change', () => {
			const mode = this.query('#mode').value
			const running = runtime.state === 'running'
			runtime.stop()
			runtime.options.mode = mode
			runtime.performers.forEach((_, index) => runtime.configure(index, { mode }))
			if (running) void this.start().catch(error => this.showError(error))
		})
		for (const [key, input] of this.inputs) on(input, 'change', () => {
			const previous = runtime.performers[this.selected].options[key]
			const value = input.type === 'checkbox' ? input.checked : typeof previous === 'number' ? Number(input.value) : input.value
			try { runtime.configure(this.selected, { [key]: value }); this.syncSettings() }
			catch (error) { this.showError(error); this.syncSettings() }
		})
		on(runtime, PHOTOSYNTH_STATE, event => this.updateState(event.detail))
		on(runtime, PHOTOSYNTH_ERROR, event => this.showError(event.detail))
		on(runtime, PHOTOSYNTH_CONFIGURATION, () => this.syncSettings())
		for (const type of [PHOTOSYNTH_MUSIC, PHOTOSYNTH_FRAME, PHOTOSYNTH_STATE, PHOTOSYNTH_ERROR, PHOTOSYNTH_CONFIGURATION]) {
			on(runtime, type, event => this.dispatchEvent(new CustomEvent(type, { detail: event.detail, bubbles: true, composed: true })))
		}
		this.stopFrames = runtime.onFrame(frame => this.draw(frame))
		this.query('#performer').replaceChildren(...runtime.performers.map((_, index) => {
			const option = this.ownerDocument.createElement('option'); option.value = index; option.textContent = `Performer ${index + 1}`; return option
		}))
		this.query('#mode').value = runtime.options.mode ?? 'face'
		this.syncSettings()
		this.updateState(runtime.state)
		void this.refreshCameras().catch(error => this.showError(error))
	}
	unbind() {
		this.listeners?.abort(); this.stopFrames?.(); this.stopFrames = undefined
		const video = this.query('video')
		if (video !== this.engine?.video) { video.pause(); video.srcObject = null }
	}
	get selected() { return Number(this.query('#performer').value) || 0 }
	syncSettings() {
		const options = this.runtime.performers[this.selected].options
		for (const [key, input] of this.inputs) {
			if (input.type === 'checkbox') input.checked = Boolean(options[key])
			else input.value = options[key]
		}
	}
	async refreshCameras() {
		const generation = this.listeners
		const devices = await this.runtime.camera.devices()
		if (generation !== this.listeners || generation?.signal.aborted) return
		const select = this.query('#camera')
		const selected = select.value
		select.replaceChildren()
		for (const device of [{ deviceId: '', label: 'Default camera' }, ...devices]) {
			const option = this.ownerDocument.createElement('option'); option.value = device.deviceId; option.textContent = device.label || `Camera ${select.options.length}`; select.append(option)
		}
		select.value = selected
	}
	async start() {
		await this.runtime.start({ video: this.query('video'), deviceId: this.query('#camera').value || undefined })
		await this.refreshCameras()
	}
	stop() { this.runtime.stop() }
	showError(error) { this.query('.status').textContent = error?.message ?? String(error) }
	updateState(state) {
		const video = this.query('video')
		if (state === 'running' && video !== this.runtime.video && this.runtime.camera.stream) {
			video.srcObject = this.runtime.camera.stream
			void video.play().catch(error => this.showError(error))
		} else if (state !== 'running' && video !== this.runtime.video) { video.pause(); video.srcObject = null }
		this.query('#start').disabled = ['loading', 'running', 'disposed'].includes(state)
		this.query('#stop').disabled = !['loading', 'running'].includes(state)
		this.query('.status').textContent = ({ idle: 'Camera is off.', loading: 'Opening camera and loading tracking…', running: 'Camera is running. Musical events are sent to your app.', error: 'Camera or tracking failed. Start again to retry.', disposed: 'Input has been closed.' })[state]
		if (state !== 'running') {
			this.query('.performers').textContent = ''
			const canvas = this.query('canvas')
			canvas.width = canvas.width
		}
	}
	draw(frame) {
		this.query('.performers').textContent = frame.performers.filter(person => person.tracked).map(person => `Performer ${person.index + 1}: ${person.emoji ?? ''} ${person.velocity > 0 ? `note ${person.note}` : 'rest'}`).join('\n') || 'Move into view to play.'
		const canvas = this.query('canvas'), video = this.query('video')
		canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480
		const context = canvas.getContext('2d')
		if (!context) return
		context.clearRect(0, 0, canvas.width, canvas.height)
		for (const person of frame.performers) if (person.prediction && this.runtime.options.mode !== 'hands') {
			drawFaceFeatures(context, {
				data: person.prediction, options: this.runtime.performers[person.index].options,
				singing: person.velocity > 0, hue: person.note * 30,
				isLeftEyeOpen: !person.prediction.leftEyeClosed, isRightEyeOpen: !person.prediction.rightEyeClosed
			})
		}
		if (!this.query('#points').checked) return
		context.fillStyle = '#b8ee71'
		for (const prediction of frame.predictions) for (const point of prediction.keypoints ?? []) {
			context.beginPath(); context.arc(point.x * canvas.width, point.y * canvas.height, 1.5, 0, Math.PI * 2); context.fill()
		}
	}
}

export const definePhotosynthElement = (registry = customElements) => {
	if (!registry.get('photosynth-input')) registry.define('photosynth-input', PhotosynthElement)
}
