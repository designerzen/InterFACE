import {readFileSync} from 'fs'
import {FMVoice} from '../source/audio/instruments/fm-engine.js'
import {FM_FACTORY_PRESETS} from '../source/audio/instruments/presets/dx7.js'

const source = readFileSync('source/audio/instruments/worklets/fm.worklet.js','utf8')
const fixture = () => {
	const clock = {time:0}
	const Processor = new Function('FMVoice','AudioWorkletProcessor','sampleRate','clock',source.replace(/^import .*$/gm,'').replace(/\bcurrentTime\b/g,'clock.time').replace(/registerProcessor\([^\n]+/,'return FMProcessor'))(FMVoice,class {port={}},48000,clock)
	const processor = new Processor(), outputs = Array.from({length:16},()=>[new Float32Array(128)])
	return {processor,clock,outputs,send:data=>processor.port.onmessage({data}),render:()=>processor.process([],outputs)}
}

test('scheduled notes retain their patch across program changes and equal timestamps stay ordered',() => {
	const {processor,send,render,clock} = fixture()
	send({type:'patch',part:0,patch:FM_FACTORY_PRESETS[0]})
	send({type:'on',part:0,note:60,velocity:1,time:1})
	send({type:'patch',part:0,patch:FM_FACTORY_PRESETS[80]})
	send({type:'on',part:0,note:64,velocity:1,time:0})
	send({type:'off',part:0,note:64,time:0})
	render()
	expect(processor.parts.get(0).voices.get(64).released).toBe(true)
	clock.time = 1
	render()
	expect(processor.parts.get(0).voices.get(60).patch).toBe(FM_FACTORY_PRESETS[0])
	expect(processor.parts.get(0).voices.get(64).patch).toBe(FM_FACTORY_PRESETS[80])
})

test('panic cancels only its own scheduled notes and preserves the cached patch',() => {
	const {processor,send,render,clock} = fixture()
	for (let part=0;part<2;part++) {
		send({type:'patch',part,patch:FM_FACTORY_PRESETS[0]})
		send({type:'on',part,note:60,velocity:1,time:2})
	}
	send({type:'panic',part:0})
	send({type:'on',part:0,note:64,velocity:1,time:0})
	render()
	expect(processor.parts.get(0).voices.has(64)).toBe(true)
	clock.time=2;render()
	expect(processor.parts.get(0).voices.has(60)).toBe(false)
	expect(processor.parts.get(1).voices.has(60)).toBe(true)
})

test('releasing and reusing a part cancels its old events and clears bend and patch',() => {
	const {processor,send,render,clock,outputs} = fixture()
	send({type:'patch',part:0,patch:FM_FACTORY_PRESETS[0]})
	send({type:'bend',part:0,value:12,time:0})
	send({type:'on',part:0,note:60,velocity:1,time:1})
	render()
	send({type:'releasePart',part:0})
	send({type:'patch',part:0,patch:FM_FACTORY_PRESETS[80]})
	send({type:'on',part:0,note:64,velocity:1,time:0})
	clock.time=1;render()
	expect(processor.parts.get(0).bend).toBe(0)
	expect([...processor.parts.get(0).voices.keys()]).toEqual([64])
	send({type:'destroy'})
	expect(render()).toBe(false)
	expect(outputs.every(channels=>channels[0].every(sample=>sample===0))).toBe(true)
})

test('a note starts at its exact sample offset inside a render quantum',() => {
	const {send,render,outputs,processor} = fixture()
	send({type:'patch',part:0,patch:FM_FACTORY_PRESETS[0]})
	send({type:'on',part:0,note:60,velocity:1,time:73/48000})
	render()
	expect(outputs[0][0].slice(0,73).every(sample=>sample===0)).toBe(true)
	expect(processor.parts.get(0).voices.get(60).age).toBe(55)
})
