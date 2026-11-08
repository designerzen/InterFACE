import assert from 'node:assert/strict'
import { test } from 'node:test'
import { build } from 'esbuild'
import { faderToGain, gainToFader } from '../source/audio/volume-curve.js'

test('audio taper reaches silence and unity and restores stored linear gains', () => {
	assert.equal(faderToGain(0), 0)
	assert.equal(faderToGain(1), 1)
	assert.ok(Math.abs(20 * Math.log10(faderToGain(0.5)) + 30.27) < 0.02)
	for (const gain of [0, 0.001, 0.01, 0.1, 0.25, 0.8, 1]) {
		assert.ok(Math.abs(faderToGain(gainToFader(gain)) - gain) < 1e-12)
	}
	let previous = 0
	for (let step = 1; step <= 100; step++) {
		const gain = faderToGain(step / 100)
		assert.ok(gain > previous)
		previous = gain
	}
})

const bundled = await build({ entryPoints: ['source/audio/effects/amplitude.js'], bundle: true, write: false, format: 'esm' })
const { createAmplitude } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`)

for (const fade of [false, true]) {
	test(`master accepts numeric zero and reports clamped gain (fade=${fade})`, async () => {
		const calls = []
		const gain = { value: 1, setValueAtTime(value) { this.value = value; calls.push(value) }, linearRampToValueAtTime(value) { calls.push(value) } }
		const amplitude = await createAmplitude({ currentTime: 0, createGain: () => ({ gain }) }, 0.8, fade)
		assert.equal(amplitude.volume(0), 0)
		assert.equal(calls.at(-1), 0)
		if (!fade) assert.equal(amplitude.volume(), 0)
		assert.equal(amplitude.volume(2), 1)
		assert.equal(calls.at(-1), 1)
		assert.equal(amplitude.volume(-1), 0)
		assert.equal(calls.at(-1), 0)
	})
}
