import test from 'node:test'
import assert from 'node:assert/strict'
import { Photosynth } from '../src/index.js'
import { createPhotosynthInputClass, toInputCommandFields } from '../src/adapters/input.js'

class AbstractInput extends EventTarget {
	constructor(options) { super(); this.options = options; this.commands = []; this.uuid = 'input-test' }
	get now() { return this.options.now() }
	setAsConnected() { this.isConnected = true }
	setAsDisconnected() { this.isConnected = false }
	dispatch(command, origin) { this.commands.push({ command, origin }) }
}
const Input = createPhotosynthInputClass({ AbstractInput, musicalCommand: fields => ({ ...fields, id: 'test-command' }) })
const face = { box: { xMin: 0.1, xMax: 0.3, yMin: 0.1, yMax: 0.4 }, roll: 0, pitch: 0, yaw: 0, mouthRatio: 0.8, happiness: 0.8 }

test('adapter emits audiobus command fields in seconds with MIDI value ranges', () => {
	const command = toInputCommandFields({ type: 'noteOn', source: 'person-2', performer: 2, channel: 3, note: 60, velocity: 0.5, time: 2500 }, 'input-1')
	assert.equal(command.time, 2.5)
	assert.equal(command.startAt, 2.5)
	assert.equal(command.velocity, 64)
	assert.equal(command.inputId, 'input-1')
	assert.equal(command.from, 'person-2')
	assert.equal(command.number, 60)
	for (const [value, expected] of [[-1, 0], [0, 8192], [1, 16383]]) {
		assert.equal(toInputCommandFields({ type: 'pitchBend', time: 0, value }, '').pitchBend, expected)
	}
})

test('adapter flattens chords, preserves provenance, and releases notes on disconnect', async () => {
	const runtime = new Photosynth({ maxPerformers: 1, now: () => 2500 })
	const input = new Input({ runtime })
	runtime.process([face], 2000)
	const ons = input.commands.filter(value => value.command.type === 'noteOn')
	assert(ons.length >= 3)
	assert(ons.every(({ command, origin }) => command.from === 'person-0' && command.time === 2 && origin.performer === 0))
	await input.disconnect()
	const offs = input.commands.filter(value => value.command.type === 'noteOff')
	assert.equal(offs.length, ons.length)
	assert.equal(input.held.size, 0)
	const count = input.commands.length
	input.destroy()
	runtime.process([face], 3000)
	assert.equal(input.commands.length, count)
	assert.equal(runtime.state, 'idle')
	runtime.dispose()
})

test('changing a channel releases the previous channel before saving configuration', () => {
	const runtime = new Photosynth({ maxPerformers: 1 })
	const input = new Input({ runtime })
	let configurations = 0
	input.addEventListener('configurationChanged', () => configurations++)
	runtime.process([face], 1000)
	runtime.configure(0, { channel: 5 })
	const offs = input.commands.filter(value => value.command.type === 'noteOff')
	assert(offs.length > 0 && offs.every(value => value.command.channel === 1))
	assert.equal(input.options.configuration.performers[0].channel, 5)
	assert.equal(configurations, 1)
	input.destroy()
	runtime.dispose()
})

test('retrigger releases its voice before sending a new note-on', () => {
	const runtime = new Photosynth({ maxPerformers: 1 })
	const input = new Input({ runtime })
	const base = { source: 'person-0', performer: 0, channel: 1, note: 60, velocity: 0.7, time: 1000 }
	input.receive({ ...base, type: 'noteOn' })
	input.receive({ ...base, type: 'retrigger', time: 1100 })
	assert.deepEqual(input.commands.map(value => value.command.type), ['noteOn', 'noteOff', 'noteOn'])
	input.destroy()
	runtime.dispose()
})

test('chord replacement preserves expression and uses the event timestamp for releases', () => {
	const runtime = new Photosynth({ maxPerformers: 1, now: () => 9000 })
	const input = new Input({ runtime })
	const base = { source: 'person-0', performer: 0, channel: 1, time: 1000 }
	input.receive({ ...base, type: 'noteOn', note: 60, velocity: 0.7 })
	input.receive({ ...base, type: 'controlChange', controller: 11, value: 0.7 })
	input.receive({ ...base, type: 'allNotesOff', time: 1100 })
	assert.equal(input.commands.at(-1).command.type, 'noteOff')
	assert.equal(input.commands.at(-1).command.time, 1.1)
	assert.equal(input.controls.size, 1)
	assert.equal(input.commands.filter(value => value.command.type === 'controlChange').length, 1)
	input.destroy()
	runtime.dispose()
})

test('arpeggios produce timed individual notes and cancel their gates on stop', () => {
	const runtime = new Photosynth({ maxPerformers: 1, bpm: 120, performer: { operatingMode: 2, arpeggioRate: 'fast' }, now: () => 1800 })
	const input = new Input({ runtime })
	runtime.process([face], 1000)
	assert.equal(input.commands.filter(value => value.command.type === 'noteOn').length, 1)
	runtime.tick(1400)
	assert.equal(input.commands.filter(value => value.command.type === 'noteOff').length, 1)
	runtime.tick(1500)
	assert.equal(input.commands.filter(value => value.command.type === 'noteOn').length, 2)
	input.stopClock()
	assert.equal(input.held.size, 0)
	const count = input.commands.length
	runtime.tick(3000)
	assert.equal(input.commands.length, count)
	input.destroy()
	runtime.dispose()
})

test('external clock arpeggios obey the host transport', () => {
	const runtime = new Photosynth({ maxPerformers: 1, externalClock: true, performer: { operatingMode: 2 } })
	const input = new Input({ runtime })
	input.setAsConnected()
	runtime.process([face], 1000)
	assert(!input.commands.some(value => value.command.type === 'noteOn'))
	input.updateTime(1)
	assert(!input.commands.some(value => value.command.type === 'noteOn'))
	input.startClock()
	input.updateTime(1)
	assert(input.commands.some(value => value.command.type === 'noteOn'))
	input.stopClock()
	const count = input.commands.length
	input.updateTime(2)
	assert.equal(input.commands.length, count)
	input.destroy()
	runtime.dispose()
})
