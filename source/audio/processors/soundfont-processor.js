import { convertMIDINoteNumberToName } from "../tuning/notes"
import SampleAudioWorkletProcessor, { AudioSample } from "./sample-processor"

const WORKLET_ID_SOUNDFONT = "soundfont-processor"

export default class SoundFontAudioWorkletProcessor extends SampleAudioWorkletProcessor {
	
	static get parameterDescriptors() {
		return [
			{
				name: "gain",
				defaultValue: 0.5,
				minValue: 0,
				maxValue: 1
			},
			{
				name: "pan",
				defaultValue: 0,
				minValue: -1,
				maxValue: 1
			},
			{
				name: "frequency",
				defaultValue: 440.0,
				minValue: 27.5,
				maxValue: 4186.009
			}
		]
	}

	samples = new Map()

	addFontSample( name, data ){
		for (let d in data)
		{
			switch (d)
			{
				case "meta":
					break
				default:
					this.addSample( d, data[d] )
			}
		}
	}

	addSample( id, data ){
		const sample = new AudioSample(data)
		this.samples.set( id, sample )
		console.info("Adding sample", {id, sample, data}, this)
	}

	getSample( id ){
		return isNaN(id) ?
				this.samples.get( id ) :
				this.samples.get( convertMIDINoteNumberToName(id) )
	}

	getLeftBuffer( id ){
		return this.getSample( id ).leftChannel
	}

	getRightBuffer( id ){
		return this.getSample( id ).rightChannel
	}

	// Pass in the WAV data or URL to load via worklet 
	onmessage(event) {
		// Handling data from the node.
		// console.log("SampleAudioWorkletProcessor:MESSAGE:", {event}, this)
		// loadSample(event.data)
		const type = event.data.type
		const contents = event.data.data
		switch (type) 
		{
			case 'available':
				console.log('[Processor:Available]')
				break

			case 'load':	
				// check if is an array of samples
				if (Array.isArray(contents))
				{	
					contents.forEach( sample => this.addFontSample( sample.meta.name, sample ) )
					console.info("SoundFontAudioWorkletProcessor:Group Loaded", {contents, event}, this )
				
				}else{
					// or just a single sample
					
					this.addFontSample( contents.meta.name, contents )
					console.info("SoundFontAudioWorkletProcessor:Single Loaded", {contents, event}, this )
				}

				return super.setSample( this.getSample("C4") )
		
			case 'noteOn':
				const key = convertMIDINoteNumberToName(event.data.noteNumber)
				const sample = this.getSample( key )
				if (sample)
				{
					this.setSample( sample )
					this.play()
					console.log("noteOn", event, {key, sample})
				}else{
					console.error("FAIL noteOn", event.data, {key, sample})
				}
				break

			case 'noteOff':
				if (this.sample)
				{
					this.pause(true)
				}
				break
	
			case 'programChange':
				break

			case 'aftertouch':
				break

			case 'pitchBend':
				break
		
			default:
				return super.onmessage(event)
		}
	}	
}

registerProcessor(WORKLET_ID_SOUNDFONT, SoundFontAudioWorkletProcessor)