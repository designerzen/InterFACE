/**
 * Worklet based Instrument!
 */
import Instrument from './instrument'
import {extractZip} from '../../utils/zip'

const WAM_FOLDER = "wam"

export default class YoshimiInstrument extends Instrument{

	static get name(){
		return "YoshimiInstrument"
	}

	name = YoshimiInstrument.name
	type = "yoshimi"

	yoshimi
	presets

	channel = 0
	bankIndex = 0
	instrumentIndex = 0

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}
	
	get audioNode(){
		return this.gainNode
	}

	constructor( audioContext, options ){
		
		super(audioContext, options)

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0.9 // this.currentVolume
		this.gainNode.connect(destinationNode)

		this.createEngine(audioContext)
	}

	/**
	 * All local idx files available for this instrument
	 * @returns {Array<String>} of Instrument Names
	 */
	getInstruments(){
		return this.presets.map( preset => {
			return preset.instruments
		}).flat()
	}

	/**
	 * 
	 * @param {*} noteNumber 
	 * @param {*} velocity 
	 * @returns 
	 */
	async noteOn(noteNumber, velocity=1){
		// do we need the channel number???
		if (this.available)
		{
			this.yoshimi.onMidi([0x90 + this.channel, noteNumber, velocity])	
		}
		return super.noteOn(noteNumber, velocity)
	}

	/**
	 * FIXME: Fade out the gate
	 * @param {*} noteNumber 
	 * @param {*} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=0){
		// this.yoshimi.onMidi([0x80, noteNumber, 100])
		if (this.available)
		{
			this.yoshimi.onMidi([0x80 + this.channel, noteNumber, velocity])
		}else{
			console.warn("Yoshimi could not be initialised", this )
		}
		return super.noteOff(noteNumber)
	}

	aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	pitchBend(pitch){
		if (this.available)
		{
			this.yoshimi.onMidi([0xe0 + this.channel, 0x007f & pitch, (0x3f80 & pitch) >> 7 ])
		}
		super.pitchBend(pitch)
	}

	// FIXME:
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		super.programChange( programNumber )
		// bank is the programNumber...
		const programs = this.getInstruments()
		const bank = programs[programNumber]
		const f = this.presets[this.instrumentIndex]

		return await this.loadPreset(f, bank)
	}

	// async loadRandomPreset(progressCallback){}
	// async loadPreviousPreset(progressCallback){}
	// async loadNextPreset(progressCallback){ }

	// ---------------------------------------

	/**
	 * Initialise this audio worklet
	 * @param {*} audioContext 
	 * @returns 
	 */
	async createEngine(audioContext, origin=`/${WAM_FOLDER}/`){

		//AWPF.origin = origin
		// AWPF.origin = "http://127.0.0.1:44102/dist/"
		// AWPF.origin = "https://webaudiomodules.org/demos/jariseon/yoshimi/"
		await WAM.YOSHIMI.importScripts(audioContext, origin)
		
		// create our worklet
		this.yoshimi = new WAM.YOSHIMI(audioContext)
		this.yoshimi.connect(this.gainNode)

		this.presets = await this.loadPresets()

		this.available = true
	}

	/**
	 * Load a set of pre-built instruments
	 * @returns 
	 */
	async loadPresets(){
		const resp = await fetch( `${WAM_FOLDER}/banks/root.json` )
		const json = await resp.text()
		const presets = JSON.parse(json)

		const bank = presets[this.bankIndex].name
		const instruments = presets[this.bankIndex].instruments
		const bankPath = await this.loadPreset(instruments[this.instrumentIndex], bank)

		console.log("presets", {presets, bank, bankPath})

		return presets
	}

	/**
	 * Load an instrument from an XIZ file
	 * @param {String} url 
	 * @param {String} type 
	 * @returns 
	 */
	async loadInstrumentData (url, type="bin") {
		const response = await fetch(url)
		const data = type === "bin" ? await response.arrayBuffer() : await response.text()
		console.log("Loading Instrument", {url, type, data})
		return data
	}

	/**
	 * Load an XML descriptor for this instrument and send
	 * it to the worklet to process
	 * @param {string} filename - filenames[x]
	 * @param {string} bank - name from object
	 */
	async loadPreset (filename, bank="") {
		const name = `${WAM_FOLDER}/banks/${bank}/${filename}`
		
		let xml
		try {
			// file may be gzipped...
			const data = await this.loadInstrumentData(name, "bin")
			const unzipped = await extractZip(data)
			// convert raw buffer into XML
			xml = new TextDecoder("utf-8").decode(unzipped)
			
		} catch(err) {

			xml  = await this.loadInstrumentData(name, "text")
		}

		// this.yoshimi.onMidi([0xb0 + this.channel, controller, 0x7f & target]);
		this.yoshimi.onMidi("set", "patch", xml)
		return name
	}


	/*
    async pitchbend(start, target, duration, steps) {
        const stepdiff = (target - start) / steps;
        let currentValue = start;
        for(let step = 0 ; step < steps; step++) {
            
            const rounded = Math.round(currentValue);
            this.yoshimi.sendMessage([0xe0 + this.channel, 0x007f & rounded, (0x3f80 & rounded) >> 7 ]);

            currentValue += stepdiff;
            
            await this.waitDuration( duration / steps);
        }
        this.yoshimi.sendMessage([0xe0 + this.channel, 0x007f & target, (0x3f80 & target) >> 7 ]);
    }

    async controlchange(controller, start, target, duration, steps) {
        const stepdiff = (target - start) / steps;
        let currentValue = start;
        for(let step = 0 ; step < steps; step++) {
            
            const rounded = Math.round(currentValue);
            this.yoshimi.sendMessage([0xb0 + this.channel, controller, rounded]);
            
            currentValue += stepdiff;
        
            await this.waitDuration( duration / steps);
        }
        this.yoshimi.sendMessage([0xb0 + this.channel, controller, 0x7f & target]);
    }

    */
}