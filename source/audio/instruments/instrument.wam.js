/**
 * WAM Instrument! (we must also show the GUI!)
 */

import { initializeWamHost } from "@webaudiomodules/sdk"
import { injectJavascript } from '../../utils/utils.js'
import Instrument from "./instrument.js"

export default class WAMInstrument extends Instrument {

	static get name(){
		return "WAMInstrument"
	}

	name = WAMInstrument.name
	workletsRegistered = false

	type = "web audio module 1"
	get title(){
		return "WebAudioModule"
	}

	initialised = false

	plugin

	audioWorkletNode

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
		this.currentVolume = value
	}

	get audioNode() {
		return this.gainNode
	}

	/**
	 * Registers the script to load in a WAM
	 * @param {AudioContext} audioContext 
	 * @param {String} pluginURL 
	 * @param {Object} options 
	 */
	async loadWAM(audioContext, pluginURL, options = {}) {
		if (this.workletsRegistered) {
			return true
		}

		// check to see if it already has beeen registered
		try {

			await audioContext.resume()
			// await audioContext.audioWorklet.addModule( new URL('./instruments/instrument-audio-worklet.js', import.meta.url))

			// is this even a good location to load this??
			// await injectJavascript("wam/libs/wam-controller.js")
			await injectJavascript(pluginURL)

			this.workletsRegistered = true

		} catch (e) {
			console.error("createAudioProcessor", e)
			return false
		}

		return true
	}

	/**
	 * Create the WAM container
	 * @returns {Boolean} has been created
	 */
	async create(){	
		
		// main controllable output
		this.gainNode = this.context.createGain()
		this.volume = this.options.volume || 1

		// "wam/yoshimi.js"
		const result = await this.loadWAM(this.context, this.options.wamURL, this.options)
		
		await super.create()
		console.error("WAM loaded!", result)
		//this.audioWorkletNode = new AudioWorkletNode(this.context, "sampler-processor")

		return true
	}

	async destroy(){
		super.destroy()
	}

	constructor(audioContext, options = {}) {
		super(audioContext, options)
	}

	async noteOn(noteNumber, velocity = 1) {

		// const audioBuffer = this.instrument[convertMIDINoteNumberToName(noteNumber)]
		// if(audioBuffer)
		// {
		// 	await this.play(audioBuffer, velocity)
		// }
		console.log("Instrument:noteOn", this.plugin, this)

		// this.plugin.noteOn(noteNumber, velocity)
		return super.noteOn(noteNumber, velocity)
	}


	async noteOff(noteNumber, velocity = 0) {
		// this.volume = velocity
		console.log("note off", { noteNumber, velocity }, this.plugin)

		return super.noteOff(noteNumber)
	}

	async aftertouch(noteNumber, pressure) {
		await super.aftertouch(noteNumber, pressure)
	}

	async pitchBend(pitch) {
		await super.pitchBend(pitch)
	}

	/**
	 * Program Change. 
	 * to load a new sample we can also use the midi methods...
	 * This message sent when the patch number changes. 
	 * @param {Number} programNumber - new program number.
	 */
	async programChange(programNumber) {
		return await super.programChange(programNumber)
		//return await this.loadInstrument( instrumentFolders[programNumber] )
	}

	/**
	 *  create a data object that contains the full state of the plugin
	 *  for loading in via setState at a future occassion!
	 * @returns {Blob}
	 */
	async getState() {
		const state = await this.plugin.audioNode.getState()
		return new Blob([JSON.stringify(state, undefined, 2)])
	}

	async setState() {
		// TODO: 
	}
	
	clone(){
		return new WAMInstrument(this.audioContext, this.options)
	}
}