import test from 'node:test'
import assert from 'node:assert/strict'
import { createVisualiserNotes } from '../source/visual/visualiser-notes.js'
import { VISUALISER_MODES, getVisualiserMode } from '../source/visual/visualiser-modes.js'
import { drawVisualiser } from '../source/visual/spectrograms.js'
import { sampleVisualiserAudio } from '../source/audio/audio-visual.js'
import { observeSessionEvents, recordSessionEvent } from '../source/storage/session-events.js'
import { observeInstrument, recordInstrumentRelease } from '../source/storage/observe-instrument.js'

const context = (width = 800, height = 400) => {
	const calls = []
	const ctx = { canvas:{ width, height }, calls }
	for (const name of ['save', 'restore', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fill', 'fillRect']) {
		ctx[name] = (...args) => calls.push([name, ...args])
	}
	return ctx
}
const noteEvent = (type, note, performanceTime, extra = {}) => ({ type, note, performanceTime, source:'piano', velocity:1, ...extra })

test('only requested analyser domains are read, recording still captures frequency, and mode switches reuse buffers', () => {
	let freqReads = 0, timeReads = 0
	const analyser = {
		fftSize:2048,
		get frequencyBinCount() { return this.fftSize / 2 },
		getByteFrequencyData(data) { freqReads++; data.fill(200) },
		getByteTimeDomainData(data) { timeReads++; data.fill(128) },
	}
	const vu = sampleVisualiserAudio(analyser, getVisualiserMode('vu')).frequency
	const frame = sampleVisualiserAudio(analyser, getVisualiserMode('wave'))
	assert.equal(frame.frequency, null)
	assert.equal(frame.time.length, 2048)
	assert.deepEqual([freqReads, timeReads], [1, 1])
	sampleVisualiserAudio(analyser, getVisualiserMode('notes-horizontal'))
	assert.deepEqual([freqReads, timeReads], [1, 1])
	assert.equal(sampleVisualiserAudio(analyser, getVisualiserMode('vu')).frequency, vu)
	assert.equal(sampleVisualiserAudio(analyser, getVisualiserMode('wave'), true).frequency.length, 1024)
	assert.deepEqual([freqReads, timeReads], [3, 2])
})

test('note streams work without recording and unsubscribe cleanly', () => {
	const notes = createVisualiserNotes()
	const unsubscribe = observeSessionEvents(event => notes.record(event))
	recordSessionEvent(noteEvent('noteOn', 60, 100))
	recordSessionEvent(noteEvent('noteOff', 60, 200))
	assert.equal(notes.update(150).strengths[60], 1)
	assert.equal(notes.update(800).strengths[60], 0)
	unsubscribe()
	recordSessionEvent(noteEvent('noteOn', 62, 300))
	assert.equal(notes.update(400).count, 1)
	recordSessionEvent(noteEvent('noteOff', 62, 400))
})

test('actual instrument observation forwards attacks, natural endings and panic releases', () => {
	const notes = createVisualiserNotes()
	const unsubscribe = observeSessionEvents(event => notes.record(event))
	try {
		const voice = observeInstrument({ id:'visual-test', type:'sample', noteOn:() => true, allNotesOff:() => true })
		voice.noteOn(60, 0.8)
		voice.noteOn(64, 0.6)
		assert.ok(notes.update().strengths[60] > 0)
		recordInstrumentRelease(voice, 60)
		voice.allNotesOff()
		assert.equal(notes.update(performance.now() + 600).energy, 0)
		assert.equal(notes.update().count, 2)
	} finally { unsubscribe() }
})

test('polyphony, retriggers, scheduled release, raw velocity and bounded history', () => {
	const notes = createVisualiserNotes(4)
	notes.record(noteEvent('noteOn', 60, 100, { velocity:64, velocityUnit:'midi' }))
	notes.record(noteEvent('noteOn', 60, 110, { source:'second' }))
	notes.record(noteEvent('noteOff', 60, 400))
	assert.equal(notes.update(200).strengths[60], 1)
	notes.record(noteEvent('noteOff', 60, 300, { source:'second' }))
	assert.equal(notes.update(1000).strengths[60], 0)
	notes.record(noteEvent('noteOn', 60, 1100))
	notes.record(noteEvent('noteOn', 60, 1200))
	assert.equal(notes.update(1200).history[2].end, 1200)
	for (let i = 0; i < 100; i++) notes.record(noteEvent('noteOn', i % 128, 2000 + i))
	assert.equal(notes.update(2200).history.length, 4)
	assert.equal(notes.update(2200).count, 4)
	notes.clear()
	assert.equal(notes.update(2300).count, 0)
})

test('scrolling notes encode pitch and duration in both orientations independent of frame cadence', () => {
	const notes = createVisualiserNotes()
	notes.record(noteEvent('noteOn', 60, 1000))
	notes.record(noteEvent('noteOff', 60, 3000))
	const horizontal = context()
	drawVisualiser(horizontal, null, 0, 'notes-horizontal', null, notes.update(3500))
	assert.deepEqual(horizontal.calls.filter(c => c[0] === 'fillRect').at(-1), ['fillRect', 50, 187.5, 200, 2.625])
	const vertical = context()
	drawVisualiser(vertical, null, 0, 'notes-vertical', null, notes.update(3500))
	assert.deepEqual(vertical.calls.filter(c => c[0] === 'fillRect').at(-1), ['fillRect', 375, 275, 5.75, 100])
	const later = context()
	drawVisualiser(later, null, 0, 'notes-horizontal', null, notes.update(4500))
	assert.equal(later.calls.filter(c => c[0] === 'fillRect').at(-1)[1], 150)
	const expired = context()
	drawVisualiser(expired, null, 0, 'notes-horizontal', null, notes.update(12000))
	assert.equal(expired.calls.filter(c => c[0] === 'fillRect').length, 11) // octave guides only
})

test('future notes are hidden and sustained notes stay visible past the history window', () => {
	const notes = createVisualiserNotes()
	notes.record(noteEvent('noteOn', 127, 1000))
	assert.equal(notes.update(500).energy, 0)
	const ctx = context()
	drawVisualiser(ctx, null, 0, 'notes-horizontal', null, notes.update(20000))
	assert.deepEqual(ctx.calls.filter(c => c[0] === 'fillRect').at(-1), ['fillRect', 0, 396.875, 800, 2.625])
})

test('waveform envelope retains a one-sample transient', () => {
	const samples = new Uint8Array(2048).fill(128)
	samples[3] = 255
	const ctx = context()
	drawVisualiser(ctx, null, 0, 'envelope', samples)
	assert.ok(ctx.calls.some(c => c[0] === 'moveTo' && c[2] < 100))
})

for (const mode of VISUALISER_MODES) test(`${mode.id}: bounded finite drawing, silence, resize and context isolation`, () => {
	const notes = createVisualiserNotes()
	notes.record(noteEvent('noteOn', 64, 0))
	const ctx = context()
	const frequency = mode.frequency ? new Uint8Array(mode.fftSize / 2).fill(180) : null
	const time = mode.time ? Uint8Array.from({ length:2048 }, (_, i) => 128 + Math.round(100 * Math.sin(i * 0.1))) : null
	drawVisualiser(ctx, frequency, frequency?.length ?? 0, mode.id, time, notes.update(1000))
	assert.equal(ctx.calls[0][0], 'save')
	assert.equal(ctx.calls.at(-1)[0], 'restore')
	assert.ok(ctx.calls.length <= 620)
	assert.ok(ctx.calls.every(call => call.slice(1).every(Number.isFinite)))
	ctx.canvas.width = 1
	ctx.canvas.height = 1
	frequency?.fill(0)
	time?.fill(128)
	drawVisualiser(ctx, frequency, frequency?.length ?? 0, mode.id, time, notes.update(1100))
	assert.ok(ctx.calls.every(call => call.slice(1).every(Number.isFinite)))
})
