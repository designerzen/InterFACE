/** @jest-environment node */
import { createVoiceSynthDef } from '../source/audio/voice-engines/synthdef.js'
import { FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'

// Read the binary as a server does: validate finite constants and graph wiring,
// including the control/audio rate boundary that otherwise yields near-silence.
const readDefinition = bytes => {
	const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength)
	let offset=0
	const u8=()=>view.getUint8(offset++)
	const i16=()=>{const value=view.getInt16(offset);offset+=2;return value}
	const i32=()=>{const value=view.getInt32(offset);offset+=4;return value}
	const f32=()=>{const value=view.getFloat32(offset);offset+=4;return value}
	const string=()=>{const length=u8();const value=new TextDecoder().decode(bytes.subarray(offset,offset+length));offset+=length;return value}
	expect(i32()).toBe(0x53436766);expect(i32()).toBe(2);expect(i16()).toBe(1)
	string()
	const constants=Array.from({length:i32()},f32)
	constants.forEach(value=>expect(Number.isFinite(value)).toBe(true))
	Array.from({length:i32()},f32)
	for(let count=i32();count>0;count--){string();i32()}
	const nodes=[]
	for(let count=i32();count>0;count--){
		const type=string(),rate=u8(),inputs=i32(),outputs=i32();i16()
		const sources=Array.from({length:inputs},()=>[i32(),i32()])
		const rates=Array.from({length:outputs},u8)
		for(const [source,output] of sources){
			if(source===-1) expect(output).toBeLessThan(constants.length)
			else {expect(source).toBeLessThan(nodes.length);expect(output).toBeLessThan(nodes[source].rates.length)}
		}
		if(type==='SinOsc') {
			const [source,output]=sources[0]
			expect(source===-1?0:nodes[source].rates[output]).toBeLessThanOrEqual(1)
		}
		nodes.push({type,rate,rates})
	}
	expect(i16()).toBe(0)
	expect(offset).toBe(bytes.length)
	expect(nodes.at(-1).type).toBe('Out')
}

test.each(Array.from({length:128},(_,program)=>program))('GM program %i produces a valid gated server graph',program=>{
	readDefinition(createVoiceSynthDef(`photosynth-gm-${program}`,FM_FACTORY_PRESETS[program]))
})
