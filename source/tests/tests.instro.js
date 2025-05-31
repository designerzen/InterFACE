import TripleOscillatorInstrument from "../audio/instruments/instrument.triple-oscillator"
import OscillatorsInstrument from "../audio/instruments/instrument.oscillators"

document.addEventListener( "mousedown", async (e) => {
	const audioContext = new AudioContext()
	const triple = new TripleOscillatorInstrument( audioContext )
	
	const i = new OscillatorsInstrument( audioContext )

	const loop = () => {
		// console.error(i.oscillator)
		console.warn(triple.oscillator3)
		requestAnimationFrame(loop)
	}
	loop()

	// await triple.loaded
	// debugger

}, {once:true})