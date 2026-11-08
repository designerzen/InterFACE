import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'
import { FMVoice } from '../source/audio/instruments/fm-engine.js'

// Render the real synthesis code for auditioning without a browser or audio device.
const directory = resolve(process.argv[2] ?? 'test-results/fm-gm-audio')
await mkdir(directory,{recursive:true})
const sampleRate = 24000
const seconds = 3
const frames = seconds*sampleRate
const encodeWAV = samples => {
	const bytes = Buffer.alloc(44+samples.length*2)
	bytes.write('RIFF',0); bytes.writeUInt32LE(bytes.length-8,4); bytes.write('WAVEfmt ',8)
	bytes.writeUInt32LE(16,16); bytes.writeUInt16LE(1,20); bytes.writeUInt16LE(1,22)
	bytes.writeUInt32LE(sampleRate,24); bytes.writeUInt32LE(sampleRate*2,28)
	bytes.writeUInt16LE(2,32); bytes.writeUInt16LE(16,34)
	bytes.write('data',36); bytes.writeUInt32LE(samples.length*2,40)
	for (let i=0; i<samples.length; i++) bytes.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2)
	return bytes
}
const highlights = new Set([0,4,10,16,24,33,40,52,56,65,73,80,89,104,114,122,124,127])
const preview = []
const metrics = []
for (const patch of FM_FACTORY_PRESETS) {
	const note = patch.program >= 32 && patch.program < 40 ? 48 : 60
	const voice = new FMVoice(patch,note,0.85,sampleRate)
	const samples = new Float32Array(frames)
	let sum = 0, peak = 0
	for (let i=0; i<frames; i++) {
		if (i === sampleRate*2) voice.release()
		// A short end fade prevents truncating long pad tails in the audition file.
		const fade = Math.min(1,(frames-1-i)/(sampleRate*0.08))
		const value = voice.next()*fade
		if (!Number.isFinite(value)) throw Error(`Non-finite audio: ${patch.name}`)
		samples[i] = value
		sum += value*value; peak = Math.max(peak,Math.abs(value))
	}
	const name = `${String(patch.program+1).padStart(3,'0')}-${patch.name.replace(/[^a-z0-9]+/gi,'-')}.wav`
	await writeFile(resolve(directory,name),encodeWAV(samples))
	metrics.push({program:patch.program,name:patch.name,peak,rms:Math.sqrt(sum/frames),file:name})
	if (highlights.has(patch.program)) preview.push(samples)
}
const samples = new Float32Array(preview.length*frames)
preview.forEach((clip,i) => samples.set(clip,i*frames))
await writeFile(resolve(directory,'fm-gm-highlights.wav'),encodeWAV(samples))
await writeFile(resolve(directory,'metrics.json'),JSON.stringify(metrics,null,2))
console.log(`Rendered ${metrics.length} presets and a ${preview.length*seconds}-second highlights reel to ${directory}`)
console.log(`Peak range: ${Math.min(...metrics.map(p => p.peak)).toFixed(4)}–${Math.max(...metrics.map(p => p.peak)).toFixed(4)}`)
