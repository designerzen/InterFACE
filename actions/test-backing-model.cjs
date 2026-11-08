// Exercise the shipped browser bundle against PhotoSYNTH's installed TFJS.
const {readFileSync}=require('node:fs')
const {resolve}=require('node:path')
const {fileURLToPath,pathToFileURL}=require('node:url')
const vm=require('node:vm')
const assert=require('node:assert/strict')
const tf=require('@tensorflow/tfjs')

;(async () => {
	await tf.setBackend('cpu')
	const nativeFetch=globalThis.fetch
	// TFJS also uses the global fetch implementation for weight shards.
	globalThis.fetch=async (input,options) => {
		const url=new URL(typeof input==='string'?input:input.url ?? input.href)
		return url.protocol==='file:'?new Response(readFileSync(fileURLToPath(url))):nativeFetch(input,options)
	}
	const scope={tf,fetch:globalThis.fetch,performance,console,setTimeout,clearTimeout}
	scope.self=scope
	vm.runInNewContext(readFileSync(resolve(__dirname,'../static/magenta/music_rnn-1.23.1.js'),'utf8'),scope)
	const input=process.argv[2]
	const checkpoint=input && /^https?:\/\//.test(input)?input.replace(/\/$/,''):pathToFileURL(resolve(input || resolve(__dirname,'../static/magenta/checkpoints/chord_pitches_improv'))).href
	const response=await fetch(`${checkpoint}/config.json`)
	if (!response.ok) throw new Error(`Checkpoint download failed: HTTP ${response.status}`)
	const model=new scope.music_rnn.MusicRNN(checkpoint,await response.json())
	try {
		await model.initialize()
		const start=performance.now()
		const seed={notes:[{pitch:60,quantizedStartStep:0,quantizedEndStep:4},{pitch:64,quantizedStartStep:4,quantizedEndStep:8},{pitch:67,quantizedStartStep:8,quantizedEndStep:12}],quantizationInfo:{stepsPerQuarter:4},totalQuantizedSteps:16}
		const result=await model.continueSequence(seed,16,0.8,['C'])
		assert.equal(result.totalQuantizedSteps,16)
		assert.ok(result.notes.every(note => Number.isInteger(note.pitch) && note.quantizedEndStep<=16))
		console.log(JSON.stringify({tfjs:tf.version.tfjs,notes:result.notes.length,generationMs:Math.round(performance.now()-start)}))
	} finally { model.dispose() }
})().catch(error => {console.error(error);process.exitCode=1})
