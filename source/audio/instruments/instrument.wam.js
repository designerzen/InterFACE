/**
 * WAM Instrument! (we must also show the GUI!)
 */

import { initializeWamHost } from "@webaudiomodules/sdk"

import { injectJavascript } from '../../utils'
import Instrument from "./instrument"

export default class WAMInstrument extends Instrument {

	workletsRegistered = false

	type = "web audio module 1"
	name = "WAM"
	title = "WebAudioModule"

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

	constructor(audioContext, options = {}) {
		super(audioContext, options)

		// main controllable output
		this.gainNode = audioContext.createGain()
		this.volume = options.volume || 1

		// "wam/yoshimi.js"
		this.loadWAM(audioContext, options.wamURL, options).then(result => {

			console.error("WAM loaded!", result)
			//this.audioWorkletNode = new AudioWorkletNode(audioContext, "sampler-processor")
			this.available = true
		})
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
}