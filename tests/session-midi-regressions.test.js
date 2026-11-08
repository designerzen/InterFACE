import {createMIDIFileFromEvents,vlq} from '../source/audio/midi/session-midi.js'
import {encodeSessionEvents,decodeSessionEvents} from '../source/storage/session-format.js'

const parse=bytes=>{
	const result=[];let at=14
	const number=()=>{let value=0,b;do{b=bytes[at++];value=value*128+(b&127)}while(b&128);return value}
	while(at<bytes.length){
		at+=4;const size=new DataView(bytes.buffer,bytes.byteOffset+at,4).getUint32(0);at+=4
		const end=at+size,track=[];let tick=0
		while(at<end){tick+=number();const status=bytes[at++];if(status===255){const type=bytes[at++],length=number();track.push({tick,status,type,data:Array.from(bytes.slice(at,at+length))});at+=length}else{const length=(status&240)===192||(status&240)===208?1:2;track.push({tick,status,data:Array.from(bytes.slice(at,at+length))});at+=length}}
		result.push(track)
	}
	return result
}
test('binary round trip preserves MIDI program, CC, pitch bend and velocity byte one',()=>{
	const events=decodeSessionEvents(encodeSessionEvents([
		{type:'programChange',program:40,time:0},
		{type:'control',controller:64,value:127,time:0},
		{type:'pitchBend',value1:2048,time:0},
		{type:'noteOn',note:60,velocity:1,velocityUnit:'midi',time:0},
		{type:'noteOff',note:60,time:500}]))
	const track=parse(createMIDIFileFromEvents(events))[1]
	expect(track.filter(e=>e.status!==255)).toEqual([
		{tick:0,status:192,data:[40]}, {tick:0,status:176,data:[64,127]}, {tick:0,status:224,data:[0,80]},
		{tick:0,status:144,data:[60,1]}, {tick:480,status:128,data:[60,0]}])
})
test('dangling notes close together at session end and tempo changes preserve wall time',()=>{
	const tracks=parse(createMIDIFileFromEvents([{type:'noteOn',note:60,velocity:1,time:0},{type:'noteOn',note:64,velocity:1,time:0}],{endTime:1500,tempoMap:[{time:500,bpm:60}]}))
	expect(tracks[1].filter(e=>e.status===128).map(e=>e.tick)).toEqual([960,960])
})
test('same-tick note ordering is retained and invalid huge deltas fail promptly',()=>{
	const notes=parse(createMIDIFileFromEvents([{type:'noteOn',note:60,velocity:1,time:0},{type:'noteOff',note:60,time:0}]))[1].filter(e=>e.status!==255)
	expect(notes.map(e=>e.status)).toEqual([144,128])
	expect(()=>vlq(0x10000000)).toThrow('MIDI delta')
	expect(()=>createMIDIFileFromEvents([{type:'noteOn',note:60,velocity:NaN}])).toThrow('velocity')
})
