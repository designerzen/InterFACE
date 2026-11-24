import { Photosynth, type MusicEvent, type PhotosynthConfiguration } from '../src/index.js'
import { definePhotosynthElement } from '../src/element.js'
import { CameraSession } from '../src/camera.js'
import { MediaPipeTracker } from '../src/tracking.js'
import { createPhotosynthInputClass } from '../src/adapters/input.js'

const sdk = new Photosynth({ maxPerformers: 2, performer: { channel: 2, operatingMode: 2 } })
sdk.onMusic((event: MusicEvent) => { event.time.toFixed(); event.notes?.map(note => typeof note === 'number' ? note : note.noteNumber) })
sdk.onFrame(frame => frame.performers.map(person => person.prediction?.pitch))
const configuration: PhotosynthConfiguration = sdk.exportConfiguration()
sdk.restoreConfiguration(configuration)
sdk.configure(0, { octaveLow: 3, octaveHigh: 5, mouthDynamics: 'gentle' })
sdk.process([{ box: { xMin: 0, xMax: 1, yMin: 0, yMax: 1 }, mouthRatio: 0.5 }], 1000)
const camera = new CameraSession({ mediaDevices: navigator.mediaDevices })
camera.open({ stream: new MediaStream() })
new MediaPipeTracker({ wasmPath: '/local/wasm', delegate: 'CPU' })
definePhotosynthElement()
document.createElement('photosynth-input').runtime = sdk

class Host extends EventTarget {
  readonly uuid = 'host-input'
  readonly now = 1
  constructor(public options: Record<string, any> = {}) { super() }
  dispatch(_command: object, _origin?: object) {}
  setAsConnected() {}
  setAsDisconnected() {}
}
const Input = createPhotosynthInputClass({ AbstractInput: Host, musicalCommand: fields => ({ id: 'command', ...fields }) })
const input = new Input({ photosynth: { maxPerformers: 2, externalClock: true }, now: () => 10 })
input.createGui()
input.updateTime(12)
input.disconnect()
input.destroy()
