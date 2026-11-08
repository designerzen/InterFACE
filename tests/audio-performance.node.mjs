import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { FMVoice } from '../source/audio/instruments/fm-engine.js'
import { FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'

// Optional override for the saved pre-change processor. Run both versions in the
// same process, alternating their order, to reduce clock/JIT/thermal bias.
const current = readFileSync('source/audio/instruments/worklets/fm.worklet.js', 'utf8')
const baseline = readFileSync(process.argv[2] ?? 'tests/fixtures/audio/fm-baseline.js', 'utf8')
export const processorFor = source => {
	const clock = {time:0}
	const Processor = new Function('FMVoice', 'AudioWorkletProcessor', 'sampleRate', 'clock', source
		.replace(/^import .*$/gm, '')
		.replace(/\bcurrentTime\b/g, 'clock.time')
		.replace(/registerProcessor\([^\n]+/, 'return FMProcessor'))(FMVoice, class {port = {}}, 48000, clock)
	return {processor:new Processor(), clock}
}
const run = (source, mode, capture=false) => {
	const {processor, clock} = processorFor(source)
	const outputs = Array.from({length:16}, () => [new Float32Array(128)])
	const chunks = []
	const start = performance.now()
	const send = data => processor.port.onmessage({data})
	for (let part=0;part<(mode === 'idle' ? 0 : 12);part++) {
		const patch = FM_FACTORY_PRESETS[part*7]
		// The new protocol caches a patch per part. The old protocol sends it
		// on every note; both render exactly the same scheduled note sequence.
		const cached = source.includes("data.type === 'patch'")
		if (cached) send({type:'patch',part,patch,time:0})
		for (let n=0;n<4;n++) send({type:'on',part,note:48+n*4,velocity:0.65,time:n*0.017,...(cached ? {} : {patch})})
		for (let n=0;n<4;n++) send({type:'off',part,note:48+n*4,time:0.45+n*0.01})
		if (mode === 'queue') for (let n=0;n<500;n++) send({type:'bend',part,value:n%3-1,time:0.002*n})
	}
	for (let block=0;block<(mode === 'idle' ? 12000 : 375);block++) {
		clock.time = block*128/48000
		processor.process([],outputs)
		if (capture && (mode !== 'idle' || block < 4)) chunks.push(...outputs.map(channels => channels[0].slice()))
	}
	return {ms:performance.now()-start,chunks}
}
for (const mode of ['idle','voices','queue']) {
	const before = run(baseline,mode,true), after = run(current,mode,true)
	assert.deepEqual(after.chunks,before.chunks,`${mode}: audio samples changed`)
	for (let warm=0;warm<3;warm++) {run(baseline,mode);run(current,mode)}
	const a=[], b=[]
	for (let repeat=0;repeat<9;repeat++) {
		if (repeat%2) {b.push(run(current,mode).ms);a.push(run(baseline,mode).ms)}
		else {a.push(run(baseline,mode).ms);b.push(run(current,mode).ms)}
	}
	const median = values => values.sort((x,y)=>x-y)[Math.floor(values.length/2)]
	const beforeMs=median(a), afterMs=median(b)
	console.log(JSON.stringify({mode,beforeMs,afterMs,ratio:afterMs/beforeMs,identicalSamples:true}))
	assert.ok(afterMs <= beforeMs*1.1,`${mode}: median runtime regressed by more than 10%`)
}
