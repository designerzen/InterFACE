// A small, gated SynthDef bank. Explicit gates give held notes and early note-off
// consistent behaviour instead of guessing Sonic Pi's duration-only envelopes.
export const createVoiceSynthDef = (name, waveform) => {
	const bytes = [], constants = [], ugens = []
	const u8 = value => bytes.push(value & 255)
	const i16 = value => { u8(value >> 8); u8(value) }
	const i32 = value => { u8(value >> 24); u8(value >> 16); u8(value >> 8); u8(value) }
	const f32 = value => { const buffer = new ArrayBuffer(4); new DataView(buffer).setFloat32(0, value); bytes.push(...new Uint8Array(buffer)) }
	const string = value => { const encoded = new TextEncoder().encode(value); u8(encoded.length); bytes.push(...encoded) }
	const constant = value => { let index = constants.indexOf(value); if (index < 0) { index = constants.length; constants.push(value) } return [-1, index] }
	const add = (type, rate, inputs, outputs=[rate], special=0) => { const index = ugens.length; ugens.push({type, rate, inputs, outputs, special}); return [index, 0] }
	const controls = ['freq','amp','gate','out','cutoff','attack','release']
	add('Control', 1, [], controls.map(() => 1))
	const control = index => [0, index]
	let signal
	if (typeof waveform === 'object') {
		const patch = waveform
		const multiply = (a,b) => add('BinaryOpUGen',2,[a,b],[2],2)
		const sum = (a,b) => add('BinaryOpUGen',2,[a,b],[2],0)
		const envelope = (env, gain) => add('EnvGen',2,[control(2),constant(gain),constant(0),constant(1),constant(0),
			constant(0),constant(3),constant(2),constant(-99),constant(1),constant(env.attack),constant(5),constant(-4),
			constant(env.sustain),constant(env.decay),constant(5),constant(-4),constant(0),constant(env.release),constant(5),constant(-4)])
		for (let index=0; index<6; index+=2) {
			const carrier = patch.operators[index], modulator = patch.operators[index+1]
			const frequency = operator => add('BinaryOpUGen',1,[control(0),constant(operator.ratio*2**((operator.detune ?? 0)/1200))],[1],2)
			const modulation = multiply(add('SinOsc',2,[frequency(modulator),constant(0)]),envelope(modulator.envelope,modulator.gain*12))
			const tone = multiply(add('SinOsc',2,[frequency(carrier),modulation]),envelope(carrier.envelope,carrier.gain))
			signal = signal ? sum(signal,tone) : tone
		}
		if (patch.noise) {
			let noise = add('PinkNoise',2,[])
			noise = add('LPF',2,[noise,constant(patch.noise.high)])
			noise = add('HPF',2,[noise,constant(patch.noise.low)])
			signal = sum(signal,multiply(noise,envelope(patch.noise.envelope,patch.noise.gain)))
		}
	}else if (waveform === 'noise') signal = add('PinkNoise', 2, [])
	else if (waveform === 'pulse') signal = add('Pulse', 2, [control(0), constant(0.5)])
	else if (waveform === 'saw') signal = add('Saw', 2, [control(0)])
	else if (waveform === 'triangle') signal = add('LFTri', 2, [control(0),constant(0)])
	else signal = add('SinOsc', 2, [control(0),constant(0)])
	signal = add('LPF', 2, [signal, control(4)])
	const envelope = add('EnvGen', 2, [control(2), control(1), constant(0), constant(1), constant(2),
		constant(0), constant(3), constant(2), constant(-99),
		constant(1), control(5), constant(5), constant(-4),
		constant(0.7), constant(0.15), constant(5), constant(-4),
		constant(0), control(6), constant(5), constant(-4)])
	signal = add('BinaryOpUGen', 2, [signal, envelope], [2], 2)
	add('Out', 2, [control(3),signal,signal], [])
	bytes.push(83,67,103,102); i32(2); i16(1); string(name)
	i32(constants.length); constants.forEach(f32)
	i32(controls.length); [440,0.18,1,0,5000,0.01,0.2].forEach(f32)
	i32(controls.length); controls.forEach((name, index) => { string(name); i32(index) })
	i32(ugens.length)
	for (const ugen of ugens) {
		string(ugen.type); u8(ugen.rate); i32(ugen.inputs.length); i32(ugen.outputs.length); i16(ugen.special)
		for (const input of ugen.inputs) { i32(input[0]); i32(input[1]) }
		ugen.outputs.forEach(u8)
	}
	i16(0)
	return new Uint8Array(bytes)
}
