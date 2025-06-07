import ProcessorInstrument from './instrument.processor.js'
import { convertMIDINoteNumberToFrequency, convertMIDINoteNumberToName, convertNoteNameToMIDINoteNumber} from '../tuning/notes.js'
import MOOG_PROCESSOR_URI from "worklet:../processors/moogff-processor.js"

const DEFAUT_OPTIONS = {
    id: "moog-processor",
    location:MOOG_PROCESSOR_URI
}

export default class MoogInstrument extends ProcessorInstrument {

    type = "worklet"

    instrument

    get volume() {
        return this.gainNode.gain.value
    }

    set volume(value) {
        this.gainNode.gain.value = value
    }
    
    get audioNode(){
        return this.gainNode
    }

    constructor(audioContext, options = {}) {
        super(audioContext, {...DEFAUT_OPTIONS, ...options})
        // this.title = `${options.name ?? shapeName(this.options.shape)} Wave Oscillator`
    }

    async create(){
        
        this.gainNode = this.context.createGain()
        this.gainNode.gain.value = 1

        // TODO Create AudioWorkletNode from Class

        await this.context.resume()
    
        await super.create()
        return true
    }
    
    async destroy(){
        return await super.destroy()
    }

    post( data ){
        if (this.instrument)
        {
            this.instrument.post(data)
            console.log('AudioWorkletProcessor post', data ) 
        }else{
            console.error('AudioWorkletProcessor post IGNORED - no port available yet', data ) 
        }
    }

    async noteOn(noteNumber, velocity = 1) {
		const pitch = convertMIDINoteNumberToFrequency(noteNumber)
		const output = super.noteOn(noteNumber, velocity)
		moogFFNode.parameters.get('frequency').setValueAtTime( pitch, this.now )
		return output
    }

    async noteOff(noteNumber, velocity = 0) {
        return super.noteOff(noteNumber, velocity)
    }

    aftertouch(noteNumber, pressure) {
         super.aftertouch(noteNumber, pressure)
    }

    pitchBend(pitch) {
        return super.pitchBend(pitch)
    }

    // to load a new sample we can also use the midi methods...
    async programChange(programNumber) {
        return super.programChange(programNumber)
    }

    clone(){
        return new MoogInstrument(this.audioContext, this.options)
    }
}
