import { updateByteFrequencyData, updateByteTimeDomainData } from '../source/audio/audio-visual.js'
import { drawVisualiser, normaliseVisualiser } from '../source/visual/spectrograms.js'

test('frequency and full time-domain buffers are separate, reused and resized', () => {
	const analyser = {
		fftSize:256,
		get frequencyBinCount() { return this.fftSize / 2 },
		getByteFrequencyData: data => data.fill(64),
		getByteTimeDomainData: data => data.fill(128),
	}
	const frequency = updateByteFrequencyData(analyser, 2048)
	const time = updateByteTimeDomainData(analyser, 2048)
	expect(frequency).toHaveLength(1024)
	expect(time).toHaveLength(2048)
	expect(frequency[0]).toBe(64)
	expect(updateByteFrequencyData(analyser, 2048)).toBe(frequency)
	expect(updateByteTimeDomainData(analyser, 2048)).toBe(time)
	expect(updateByteFrequencyData(analyser)).toHaveLength(128)
})

test.each(['vu', 'spectrum', 'mirror', 'wave', 'radial', 'hybrid'])('%s draws finite geometry with bounded work and restores context', type => {
	const context = { canvas:{ width:1280, height:720 } }
	for (const name of ['save', 'restore', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fillRect']) context[name] = jest.fn()
	const frequency = new Uint8Array(1024).fill(180)
	const time = new Uint8Array(2048).fill(128)
	drawVisualiser(context, frequency, frequency.length, type, time)
	const calls = [...context.fillRect.mock.calls, ...context.moveTo.mock.calls, ...context.lineTo.mock.calls]
	expect(calls.length).toBeGreaterThan(0)
	expect(calls.length).toBeLessThanOrEqual(615)
	expect(calls.flat().every(Number.isFinite)).toBe(true)
	expect(context.restore).toHaveBeenCalledTimes(1)
	if (type === 'wave') expect(context.lineTo.mock.calls.every(([, y]) => y === 720 * 0.72)).toBe(true)
	context.canvas.width = 320
	context.canvas.height = 240
	expect(() => drawVisualiser(context, frequency, frequency.length, type, time)).not.toThrow()
})

test('unknown saved modes fall back to VU and empty data is safe', () => {
	expect(normaliseVisualiser('unknown')).toBe('vu')
	expect(normaliseVisualiser(undefined)).toBe('vu')
	expect(() => drawVisualiser({}, new Uint8Array(), 0)).not.toThrow()
})
