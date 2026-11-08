import {observeInstrument,recordInstrumentRelease} from '../source/storage/observe-instrument.js'
import {setSessionEventRecorder,clearSessionEventRecorder} from '../source/storage/session-events.js'
import {recordMIDIOutput} from '../source/storage/session-midi-output.js'

let events
beforeEach(()=>{events=[];setSessionEventRecorder({record:e=>{events.push(e);return true}});events.length=0})
afterEach(()=>clearSessionEventRecorder())
const instrument=extra=>observeInstrument({id:'test-voice',title:'Test',type:'sample',noteOn:()=>true,noteOff:()=>true,allNotesOff:()=>true,destroy:()=>true,...extra})

test('records a managed voice once with its GM program and skips its renderer',async()=>{
	const renderer=instrument({options:{managedByVoiceEngine:true}})
	const voice=instrument({type:'engine',activePresetIndex:48,isMonophonic:false,noteOn:(note,velocity)=>renderer.noteOn(note,velocity)})
	await voice.noteOn(60,.7)
	expect(events.filter(event=>event.type==='noteOn')).toHaveLength(1)
	expect(events.find(event=>event.type==='programChange')?.value1).toBe(48)
})

test('records performed leaf notes, repeated attacks and natural endings',async()=>{
	const voice=instrument({retrigger:()=>true})
	await voice.noteOn(60,.2);await voice.retrigger(60,.4);recordInstrumentRelease(voice,60)
	expect(events.map(e=>[e.type,e.note,e.velocity])).toEqual([['noteOn',60,.2],['noteOff',60,0],['noteOn',60,.4],['noteOff',60,0]])
})
test('nested retrigger does not emit duplicate attacks',async()=>{
	const voice=instrument({retrigger(note,velocity){return this.noteOn(note,velocity)}})
	await voice.retrigger(62,.8);await voice.noteOff(62)
	expect(events.map(e=>e.type)).toEqual(['noteOn','noteOff'])
})
test('panic cancels pending observer note-ons',async()=>{
	let resolve
	const voice=instrument({noteOn:()=>new Promise(r=>resolve=r)})
	const pending=voice.noteOn(63,1);await voice.allNotesOff();resolve(true);await pending
	expect(events).toEqual([])
})
test('monophonic replacements release the previous pitch and rejected notes are absent',async()=>{
	const voice=instrument({isMonophonic:true})
	await voice.noteOn(60,.5);await voice.noteOn(62,.5);await voice.destroy()
	expect(events.map(e=>[e.type,e.note])).toEqual([['noteOn',60],['noteOff',60],['noteOn',62],['noteOff',62]])
	await instrument({noteOn:()=>false}).noteOn(64,1)
	expect(events).toHaveLength(4)
})
test('MIDI output retains channel, byte velocity and scheduled release',()=>{
	const output={id:'test-port',name:'Synth'}
	recordMIDIOutput(output,'playNote','C4',{channels:2,rawAttack:1,time:1000})
	recordMIDIOutput(output,'stopNote',60,{channels:2,time:1060})
	expect(events[0]).toMatchObject({source:'midi-output:test-port:1',channel:1,note:60,velocity:1,velocityUnit:'midi',performanceTime:1000})
	expect(events[1]).toMatchObject({type:'noteOff',performanceTime:1060})
})
