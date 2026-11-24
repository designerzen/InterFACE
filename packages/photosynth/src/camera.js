import { CAMERA_PRESETS } from './hardware/camera-presets.js'
export { detectCameras, filterVideoCameras, fetchVideoCameras, setupCamera, loadCamera, findBestCamera, ERROR_NO_CAMERAS } from './hardware/camera.js'

export class CameraSession {
	constructor({ mediaDevices, createVideo } = {}) {
		this.mediaDevices = mediaDevices ?? globalThis.navigator?.mediaDevices
		this.createVideo = createVideo ?? (() => document.createElement('video'))
		this.generation = 0
	}
	async devices() {
		return (await this.mediaDevices?.enumerateDevices() ?? []).filter(device => device.kind === 'videoinput')
	}
	async open({ deviceId, stream, video, constraints = {}, onEnded = () => {} } = {}) {
		this.close()
		const generation = this.generation
		const devices = deviceId ? await this.devices() : []
		if (generation !== this.generation) throw new DOMException('Camera cancelled', 'AbortError')
		const device = devices.find(value => value.deviceId === deviceId)
		const preset = CAMERA_PRESETS.find(value => value.deviceIds?.includes(deviceId) || (device && value.match.test(device.label)))
		const modes = preset?.videoModes ?? [preset?.video ?? {}]
		let selected = stream
		let failure
		if (!selected) {
			if (!this.mediaDevices?.getUserMedia) throw new Error('Camera access requires HTTPS or localhost and a supported browser')
			for (const mode of [...modes, {}]) {
				try {
					selected = await this.mediaDevices.getUserMedia({
						audio: false,
						video: { width: { ideal: 640 }, height: { ideal: 480 }, ...mode, ...constraints, ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' }) }
					})
					break
				} catch (error) {
					failure = error
					if (generation !== this.generation || ['NotAllowedError', 'SecurityError'].includes(error.name)) throw error
				}
			}
			if (!selected) throw failure
		}
		if (generation !== this.generation) {
			if (!stream) selected.getTracks().forEach(track => track.stop())
			throw new DOMException('Camera cancelled', 'AbortError')
		}
		this.stream = selected
		this.ownsStream = !stream
		this.video = video ?? this.createVideo()
		this.previousSource = this.video.srcObject
		this.previousMuted = this.video.muted
		this.previousPlaysInline = this.video.playsInline
		this.previousPaused = this.video.paused
		this.video.srcObject = selected
		this.video.muted = true
		this.video.playsInline = true
		this.listeners = new AbortController()
		for (const track of selected.getVideoTracks()) track.addEventListener('ended', onEnded, { signal: this.listeners.signal })
		try {
			await Promise.race([
				this.video.play(),
				new Promise((_, reject) => { this.cancelPlayback = () => reject(new DOMException('Camera cancelled', 'AbortError')) })
			])
			if (generation !== this.generation) throw new DOMException('Camera cancelled', 'AbortError')
			this.cancelPlayback = undefined
			return this.video
		} catch (error) {
			if (generation === this.generation) this.close()
			throw error
		}
	}
	close() {
		++this.generation
		this.cancelPlayback?.()
		this.cancelPlayback = undefined
		this.listeners?.abort()
		if (this.video && this.video.srcObject === this.stream) {
			if (this.previousSource !== this.stream || this.previousPaused !== false) this.video.pause()
			this.video.srcObject = this.previousSource ?? null
			this.video.muted = this.previousMuted
			this.video.playsInline = this.previousPlaysInline
			if (this.previousSource && this.previousPaused === false) void this.video.play().catch(() => {})
		}
		if (this.ownsStream) this.stream?.getTracks().forEach(track => track.stop())
		this.stream = this.video = undefined
	}
}
