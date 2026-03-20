import TripleOscillatorInstrument from "../audio/instruments/instrument.triple-oscillator.js"
import OscillatorInstrument from "../audio/instruments/instrument.oscillator.js"

document.addEventListener( "mousedown", async (e) => {
	const audioContext = new AudioContext()
	const triple = new TripleOscillatorInstrument( audioContext )
	
	const i = new OscillatorInstrument( audioContext )

	const loop = () => {
		// console.error(i.oscillator)
		console.warn(triple.oscillator3)
		requestAnimationFrame(loop)
	}
	loop()

	// await triple.loaded
	// debugger

}, {once:true})