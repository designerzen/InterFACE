import { INSTRUMENT_DATA_PACK_OPEN_SF, INSTRUMENT_PACK_OPEN_SF } from "../../../settings/options.instruments"
import SoundFont from "../../sound-font"
import SampleAudioWorkletNode from "./sampler.worklet"

export const WORKLET_ID_SOUNDFONT = "soundfont-processor"

const DEFAULT_OPTIONS = {
	// numberOfInputs: 1,
	// numberOfOutputs: 1,
	// outputChannelCount: [2],
	// parameterData: {
	// 	gain: 0.5,
	// 	pan: 0,
	// 	frequency: 440.0,
	// }
}

export default class SoundFontAudioWorkletNode extends SampleAudioWorkletNode {

	soundfont 
	
	constructor(context, options=DEFAULT_OPTIONS) {
		super(context, WORKLET_ID_SOUNDFONT, options)
		this.soundfont = new SoundFont( context )
	}

	createTransferableBufferDataArray(buffers){
		
		return buffers.map( element => {
			const output = {meta:{}}
			for (let e in element)
			{
				if (!element.hasOwnProperty(e)){
					continue
				}
				switch(e)
				{
					case "name":
					case "title":
					case "family":
						output.meta[e] = element[e]
						break

					default:
						output[e] = this.createTransferableBufferData(element[e])
				}
			}

			return output
		})
	}

	async loadFont(path='./assets/audio/'){

		const fontDescriptor = {
			descriptor: INSTRUMENT_PACK_OPEN_SF, 
			descriptorPath:path,
			preset:1 
		}

		// load in a sound font - this can be either a fully qualified url
		// a relative uri or the name of the pack
		// const fontData = await this.soundfont.loadFont( this.instrumentPack, './audio/', p => onProgress && onProgress( p / 2 ) )
		console.log("loadFont", fontDescriptor )
		const fontData = await this.soundfont.load( fontDescriptor, ( p,i,l ) => this.onLoadProgress( p,i,l ) ) 
		console.log("loadedFont", fontData )
		// const buffers = await this.soundfont.loadAllPresets()
		const presetNames = fontData[0].folder
		console.log("presetNames", presetNames )
		const buffers = await this.soundfont.loadPresets( presetNames, {},( p,i,l ) => this.onLoadProgress( p,i,l ) )
		console.log("loadedbuffers", {buffers} )

		const data = this.createTransferableBufferDataArray(buffers)
		console.log("createTransferableBufferDataArray", data[0] )
		this.post({type:"load", data:data[0] })

		return buffers
	}

	async loadPreset( presetName, options={ }, onProgressCallback=null ){
		return await this.soundfont.loadPreset( presetName, options, onProgressCallback )
	}

	onLoadProgress( progress, position, length ){
		console.log("SoundFont:onLoadProgress", progress, {position, length} )
	}
}
