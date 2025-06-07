/**
 * "MoogFF" - Moog VCF digital implementation.
 * 
 * As described in the paper entitled
 * "Preserving the Digital Structure of the Moog VCF"
 * by Federico Fontana appeared in the 
 * Proc. ICMC07, Copenhagen, 25-31 August 2007
 * 
 * Original Java code Copyright F. Fontana - August 2007
 * federico.fontana@univr.it
 * 
 * Ported to C++ for SuperCollider by Dan Stowell - August 2007
 * http://www.mcld.co.uk/
 * 
 * Adapted for AudioWorklet by @designerzen based on mohayonao's timbre.js
 * https://raw.githubusercontent.com/mohayonao/timbre.js/refs/heads/master/src/extras/MoogFF.js
 * 
 * @class MoogFFProcessor
 * @extends AudioWorkletProcessor
 */
import { convertMIDINoteNumberToName, convertNoteNameToMIDINoteNumber} from '../tuning/notes'

class MoogFFProcessor extends AudioWorkletProcessor {

    static get parameterDescriptors() {
        return [
            {
                name: 'frequency',
                defaultValue: 100,
                minValue: 20,
                maxValue: 20000,
                automationRate: 'a-rate'
            },
            {
                name: 'gain',
                defaultValue: 2,
                minValue: 0,
                maxValue: 4,
                automationRate: 'a-rate'
            }
        ]
    }

	name = "MoogFFProcessor"

	constructor() {	
        super()
		this.reset()
		this.port.onmessage = this.onmessage.bind(this)
		this.port.postMessage({ type: 'available' })
    }

	reset(){
		this.s1 = 0
        this.s2 = 0
        this.s3 = 0
        this.s4 = 0
        this.b0 = 0
        this.a1 = 0
        this.wcD = 0
        this.prevFreq = -1 // Initialize with a value that ensures the coefficients are calculated on the first run
	}

    process(inputs, outputs, parameters) {
        const input = inputs[0]
        const output = outputs[0]

        if (input.length === 0) {
            return true // No input, nothing to process
        }

        const inputChannel = input[0] // Assuming mono input for simplicity
        const outputChannel = output[0] // Assuming mono output for simplicity

        const frequency = parameters.frequency
        const gain = parameters.gain

        const sampleRate = this.sampleRate // AudioWorklet provides sampleRate
        const t = 1 / sampleRate

        let k = gain[0] // Get the current gain value
        k = (k > 4) ? 4 : (k < 0) ? 0 : k

        let s1 = this.s1, s2 = this.s2, s3 = this.s3, s4 = this.s4
        let b0 = this.b0, a1 = this.a1, wcD = this.wcD

        for (let i = 0; i < inputChannel.length; ++i) 
		{
            const freq = frequency.length === 1 ? frequency[0] : frequency[i]

            // Update filter coefficients, but only if freq changes
            if (this.prevFreq !== freq) {
                this.prevFreq = freq
                wcD = 2 * Math.tan(t * Math.PI * freq) * sampleRate
                if (wcD < 0) {
                    wcD = 0 // Protect against negative cutoff freq
                }
                const TwcD = t * wcD
                b0 = TwcD / (TwcD + 2)
                a1 = (TwcD - 2) / (TwcD + 2)
                this.b0 = b0
				this.a1 = a1
				this.wcD = wcD
            }

            // compute loop values
            let o = s4 + b0 * (s3 + b0 * (s2 + b0 * s1))
            const ins = inputChannel[i]
            let outs = (b0 * b0 * b0 * b0 * ins + o) / (1 + b0 * b0 * b0 * b0 * k)
            
            // Original code had `cell[i] = outs * 100;` which seems like a gain stage.
            // We'll apply it here, but it might need adjustment based on desired output level.
            outs = outs * 100
            let u = ins - k * outs

            // update 1st order filter states
            let past = u
            let future = b0 * past + s1
            s1 = b0 * past - a1 * future

            future = b0 * past + s2
            s2 = b0 * past - a1 * future

            past = future
            future = b0 * past + s3
            s3 = b0 * past - a1 * future

            s4 = b0 * future - a1 * outs

            // Clamp output to -1 to 1
            outputChannel[i] = Math.max(-1, Math.min(1, outs))
        }

        this.s1 = s1
		this.s2 = s2 
		this.s3 = s3 
		this.s4 = s4

		// Keep the processor alive
        return true 
    }
	
	/**
	 * Pass in the WAV data or URL to load via worklet 
	 * @param {Event} event 
	 */
	onmessage(event) {
		// Handling data from the node.
		// console.log("SampleAudioWorkletProcessor:MESSAGE:", {event}, this)
		switch (event.data.type) {

			case "noteOn":
				parameters.frequency.setValueAtTime(event.data.data.frequency, this.audioContext.currentTime)
				break
			
			case "noteOff":
				parameters.frequency.setValueAtTime(event.data.data.frequency, this.audioContext.currentTime)
				break

			// TODO: Send out after touch?
			case 'aftertouch':
				break

			// TODO: Send out pitch bend?
			case 'pitchBend':
				break
		}
	}
}

registerProcessor('moogff-processor', MoogFFProcessor)

/*
// In your main script (e.g., audio.js or where you manage your AudioContext)
const audioContext = new AudioContext();

async function setupMoogFFWorklet() {
    try {
        await audioContext.audioWorklet.addModule('source/audio/processors/moogff-worklet-processor.js');
        const moogFFNode = new AudioWorkletNode(audioContext, 'moogff-processor');

        // Connect parameters
        moogFFNode.parameters.get('frequency').setValueAtTime(500, audioContext.currentTime);
        moogFFNode.parameters.get('gain').setValueAtTime(3, audioContext.currentTime);

        // Connect the node in your audio graph
        // For example: sourceNode.connect(moogFFNode).connect(audioContext.destination);

        console.log('MoogFF AudioWorklet loaded and ready.');
        return moogFFNode;
    } catch (e) {
        console.error('Error loading MoogFF AudioWorklet:', e);
    }
}

// Call this function to set up the worklet
// setupMoogFFWorklet();

*/