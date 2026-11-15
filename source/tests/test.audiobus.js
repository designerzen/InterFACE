import {
	getAvailableOutputFactories, createOutputById,
	RomplerOutput, ROMPLER_BASE_URL,
	FMOutput, MonotronOutput, WaveguideOutput, MultiOscillatorOutput, YoshimiOutput
} from "../audio/audiobus.js"

const CHORD = [60, 64, 67]

const ENGINES = {
	rompler: audioContext => new RomplerOutput({ audioContext, baseUrl:ROMPLER_BASE_URL }),
	fm: audioContext => new FMOutput({ audioContext }),
	monotron: audioContext => new MonotronOutput({ audioContext }),
	waveguide: audioContext => new WaveguideOutput({ audioContext }),
	oscillators: audioContext => new MultiOscillatorOutput({ audioContext }),
	yoshimi: audioContext => new YoshimiOutput({ audioContext })
}

const status = document.getElementById("audiobus-status")
const picker = document.getElementById("audiobus-factory")
const outputs = new Map()
let audioContext

const play = async (key, create) => {
	audioContext ??= new AudioContext()
	await audioContext.resume()
	if (!outputs.has(key))
	{
		const output = await create(audioContext)
		await output.connect?.()
		outputs.set(key, output)
	}
	const output = outputs.get(key)
	if (typeof output.noteOn !== "function")
	{
		status.textContent = `${output.name ?? key} does not play notes`
		return
	}
	status.textContent = `Playing ${output.name ?? key}`
	CHORD.forEach(note => output.noteOn(note, 100))
	setTimeout(() => CHORD.forEach(note => output.noteOff(note)), 1500)
}

const report = key => error => {
	status.textContent = `${key} failed: ${error.message}`
	console.error(error)
}

document.querySelectorAll("[data-engine]").forEach(button =>
	button.addEventListener("click", () => {
		const engine = button.dataset.engine
		play(engine, ENGINES[engine]).catch(report(engine))
	})
)

getAvailableOutputFactories().forEach(factory => picker.add(new Option(factory.name, factory.id)))

document.getElementById("audiobus-factory-play").addEventListener("click", () => {
	const id = picker.value
	play(`factory:${id}`, audioContext => createOutputById(id, { audioContext, baseUrl:ROMPLER_BASE_URL })).catch(report(id))
})
