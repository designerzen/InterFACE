import { backingHarmony, createBackingSeed, constrainBacking, BACKING_SOURCE } from '../source/audio/backing-melody-sequence.js'
import { createBackingMelody } from '../source/audio/backing-melody.js'
import { createBackingMelodyPlayer } from '../source/audio/backing-melody-player.js'

const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve()}
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}}

test('seed selects a monophonic phrase and folds extreme notes into the model range',()=>{
	const seed=createBackingSeed([
		{pitch:12,start:0,end:500},{pitch:127,start:0,end:1000},{pitch:60,start:500,end:1500},{pitch:64,start:1000,end:4000},
		{pitch:70,start:3000,end:3500}
	],2000,120)
	expect(seed.totalQuantizedSteps).toBe(16)
	expect(seed.notes.map(n=>n.pitch)).toEqual([79,60,64])
	for(let i=0;i<seed.notes.length;i++){
		const note=seed.notes[i]
		expect(note.quantizedEndStep).toBeLessThanOrEqual(seed.notes[i+1]?.quantizedStartStep ?? 16)
		expect(note.quantizedEndStep).toBeGreaterThan(note.quantizedStartStep)
	}
})

test('harmony follows major, minor and diminished scales; output is bounded and in scale',()=>{
	expect(backingHarmony({key:'D',keyScale:'MAJOR_SCALE'}).chord).toBe('D')
	expect(backingHarmony({key:'A',keyScale:'NATURAL_MINOR_SCALE'}).chord).toBe('Am')
	expect(backingHarmony({key:'B',keyScale:'LOCRIAN_SCALE'}).chord).toBe('Bdim')
	const {pitches}=backingHarmony({key:'D'})
	const output=constrainBacking({notes:[{pitch:61,quantizedStartStep:0,quantizedEndStep:5},{pitch:99,quantizedStartStep:3,quantizedEndStep:30},{pitch:NaN,quantizedStartStep:8,quantizedEndStep:9}]},pitches)
	expect(output).toHaveLength(2)
	expect(output.every(n=>pitches.includes(n.pitch%12)&&n.pitch>=48&&n.pitch<=76)).toBe(true)
	expect(output[1]).toMatchObject({start:5,end:16})
})

const harness=()=>{
	let receive,time=2000
	const model={initialize:jest.fn(async()=>{}),generate:jest.fn(async()=>({notes:[{pitch:64,quantizedStartStep:0,quantizedEndStep:4}]})),destroy:jest.fn()}
	const player={setVolume:jest.fn(),play:jest.fn(),stop:jest.fn(),destroy:jest.fn()}
	const unsubscribe=jest.fn(), statuses=[]
	const loadModel=jest.fn(async()=>model)
	const controller=createBackingMelody({loadModel,player,subscribe:fn=>{receive=fn;return unsubscribe},acceptsInput:event=>event.person===0,onStatus:value=>statuses.push(value),now:()=>time})
	const settings={backingMelody:true,key:0,keyScale:'MAJOR_SCALE',bpm:120}
	const input=(extra={})=>receive({type:'noteOn',note:60,velocity:.5,source:'lead',person:0,performanceTime:1800,...extra})
	const tick=()=>controller.tick({isBar:true,at:3,bpm:120})
	return {controller,model,player,loadModel,settings,input,tick,statuses,unsubscribe,setTime:value=>{time=value}}
}

test('disabled does not load a model; enabled generates ahead and plays only at a bar boundary',async()=>{
	const h=harness()
	h.controller.configure({...h.settings,backingMelody:false});h.tick();await flush()
	expect(h.loadModel).not.toHaveBeenCalled()
	h.controller.configure(h.settings);await flush();h.input();h.tick();await flush()
	expect(h.model.generate).toHaveBeenCalledTimes(1)
	expect(h.player.play).not.toHaveBeenCalled()
	h.controller.tick({isBar:false,at:3,bpm:120})
	expect(h.player.play).not.toHaveBeenCalled()
	h.tick()
	expect(h.player.play).toHaveBeenCalledWith([{pitch:64,start:0,end:4}],3,120)
	h.controller.destroy();expect(h.unsubscribe).toHaveBeenCalled()
})

test('backing, MIDI echoes, percussion, and other performers never seed generation',async()=>{
	const h=harness();h.controller.configure(h.settings);await flush()
	for(const event of [{source:BACKING_SOURCE},{source:'midi-output:port:0'},{channel:9},{person:1},{transient:true}])h.input(event)
	h.tick();await flush();expect(h.model.generate).not.toHaveBeenCalled()
	h.controller.destroy()
})

test.each(['disable','mute','key','stop'])('%s invalidates pending generation and silences backing',async action=>{
	const h=harness(), pending=deferred()
	h.model.generate.mockReturnValue(pending.promise)
	h.controller.configure(h.settings);await flush();h.input();h.tick()
	if(action==='stop')h.controller.stop()
	else h.controller.configure({...h.settings,...({disable:{backingMelody:false},mute:{muted:true},key:{key:2}}[action])})
	pending.resolve({notes:[{pitch:64,quantizedStartStep:0,quantizedEndStep:4}]});await flush();h.tick()
	expect(h.player.play).not.toHaveBeenCalled()
	expect(h.player.stop).toHaveBeenCalled()
	h.controller.destroy()
})

test('changing harmony while loading does not strand model initialization',async()=>{
	const h=harness(), pending=deferred();h.model.initialize.mockReturnValue(pending.promise)
	h.controller.configure(h.settings);await flush()
	h.controller.configure({...h.settings,key:2})
	pending.resolve();await flush();h.input();h.tick();await flush()
	expect(h.model.generate).toHaveBeenCalled()
	h.controller.destroy()
})

test('disabling during loading destroys a late model without initializing it',async()=>{
	const h=harness(), pending=deferred();h.loadModel.mockReturnValue(pending.promise)
	h.controller.configure(h.settings);await flush()
	h.controller.configure({...h.settings,backingMelody:false})
	pending.resolve(h.model);await flush();h.input();h.tick()
	expect(h.model.initialize).not.toHaveBeenCalled()
	expect(h.model.destroy).toHaveBeenCalled()
	expect(h.model.generate).not.toHaveBeenCalled()
	h.controller.destroy()
})

test('only one phrase request can run at a time',async()=>{
	const h=harness(), pending=deferred();h.model.generate.mockReturnValue(pending.promise)
	h.controller.configure(h.settings);await flush();h.input();h.tick();h.tick();h.tick()
	expect(h.model.generate).toHaveBeenCalledTimes(1)
	pending.resolve({notes:[]});await flush();h.controller.destroy()
})

test('model failure is reported without automatic retry loops; toggle retries',async()=>{
	const h=harness();h.model.initialize.mockRejectedValueOnce(new Error('download failed'))
	h.controller.configure(h.settings);await flush()
	expect(h.statuses.at(-1)).toMatch(/unavailable.*download failed/)
	h.controller.configure(h.settings);h.tick();await flush();expect(h.loadModel).toHaveBeenCalledTimes(1)
	h.controller.configure({...h.settings,backingMelody:false});h.controller.configure(h.settings);await flush()
	expect(h.loadModel).toHaveBeenCalledTimes(2)
	h.controller.destroy()
})

test('input inactivity clears the prepared backing phrase',async()=>{
	const h=harness();h.controller.configure(h.settings);await flush();h.input();h.tick();await flush()
	h.setTime(10000);h.tick();expect(h.player.play).not.toHaveBeenCalled();h.controller.destroy()
})

test('audio is scheduled in advance and stop cancels future notes and releases recorded notes',()=>{
	jest.useFakeTimers()
	const param=()=>({value:0,setValueAtTime:jest.fn(),linearRampToValueAtTime:jest.fn(),setTargetAtTime:jest.fn()})
	const oscs=[]
	const context={currentTime:1,createGain:()=>({gain:param(),connect:jest.fn(),disconnect:jest.fn()}),createOscillator:()=>{const osc={frequency:param(),connect:jest.fn(),disconnect:jest.fn(),start:jest.fn(),stop:jest.fn()};oscs.push(osc);return osc}}
	const record=jest.fn(), player=createBackingMelodyPlayer(context,{},record)
	player.play([{pitch:60,start:0,end:4}],2,120)
	expect(oscs[0].start).toHaveBeenCalledWith(2)
	expect(record).not.toHaveBeenCalled()
	player.stop();jest.runAllTimers();expect(record).not.toHaveBeenCalled()
	player.play([{pitch:60,start:0,end:4}],1,120);jest.advanceTimersByTime(0)
	expect(record).toHaveBeenLastCalledWith(expect.objectContaining({type:'noteOn',source:BACKING_SOURCE}))
	player.stop();expect(record).toHaveBeenLastCalledWith(expect.objectContaining({type:'noteOff',note:60}))
	player.destroy();jest.useRealTimers()
})
