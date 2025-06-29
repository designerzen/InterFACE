/**
 * WAM 2 Instrument! 
 * (we must also show the GUI)
 */

import Instrument from './instrument.js'
import { initializeWamHost } from "@webaudiomodules/sdk"

export default class WAM2Instrument extends Instrument{

	static get name(){
		return "WAM2Instrument"
	}

	name = WAM2Instrument.name
	type = "web audio module 2"
	#title = "WebAudioModule2"

	initialised = false

	plugin

	// get isLoading(){
	// 	return this.available
	// }
	
	get volume(){
		return this.gainNode.gain.value
	}

	set volume( value ){
		this.gainNode.gain.value = value
		this.currentVolume = value
	}

	get audioNode(){
		return this.gainNode
	}

	/**
	 * Load in a WAM!
	 * TODO: Check to see if the WAM arrives in a zip
	 * @param {AudioContext} audioContext 
	 * @param {String} pluginURL 
	 * @param {Object} options 
	 */
	async loadWAM2(audioContext, pluginURL, options={} )
	{
		const [hostGroupId] = await initializeWamHost(audioContext)
		// const { default: WAMPlugin } = await import("/source/audio/wam2/simple/index.js")
		// const { default: WAMPlugin } = await import("./source/audio/wam2/sampler/index.js")
		const { default: WAMPlugin } = await import(pluginURL)
		const plugin = await WAMPlugin.createInstance(hostGroupId, audioContext, options )
			
		if (!plugin.audioNode || !plugin.audioNode.connect )
		{
			throw Error("No Output node set on this WAM! "+pluginURL)
		}

		// instance.audioNode is the plugin WebAudio node (native, AudioWorklet or
		// Composite). It can then be connected to the WebAudio graph.
		plugin.audioNode.connect(this.gainNode)

		// TODO: Fetch from plugin's descriptor file
		// we add a few extra sample places for the instruments
		this.polyphony = 1

		// save for use later!
		this.plugin = plugin

		console.error("Loaded WAM from", pluginURL, {options, plugin, WAMPlugin})
	}

	async create(){

		if (!this.options.pluginURL)
		{
			throw Error("WAM2 Instrument requires a WAM URL specified in the constructor options")
		}
		
		this.gainNode = this.context.createGain()
		this.volume = this.options.volume ?? 1

		const result = await this.loadWAM2(this.context, this.options.pluginURL, this.options )
				
		await super.create()
		console.info("WAM2Instrument.create() called", result, pluginURL, this )
		return true
	}
	
	async destroy(){
		return await super.destroy()
	}


	constructor( audioContext, options={} ){
		super(audioContext, options)
	}

	async noteOn(noteNumber, velocity=1){

		console.log("Instrument:noteOn",this.plugin, this )

		// this.plugin.noteOn(noteNumber, velocity)
		return super.noteOn(noteNumber, velocity)
	}

	// FIXME: Fade out the gate
	async noteOff(noteNumber, velocity=0){
		// this.volume = velocity
		console.log("note off", {noteNumber, velocity}, this.plugin )
		
		return super.noteOff(noteNumber)
	}

	async aftertouch( noteNumber, pressure ){
		await super.aftertouch( noteNumber, pressure )
	}
	
	async pitchBend(pitch){
		await super.pitchBend(pitch)
	}

	/**
	 * Program Change. 
	 * to load a new sample we can also use the midi methods...
	 * This message sent when the patch number changes. 
	 * @param {Number} programNumber - new program number.
	 */
	async programChange( programNumber )
	{
		return await super.programChange( programNumber )
		//return await this.loadInstrument( instrumentFolders[programNumber] )
	}

	/**
	 *  create a data object that contains the full state of the plugin
	 *  for loading in via setState at a future occassion!
	 * @returns {Blob}
	 */
	async getState () 
	{
		const state = await this.plugin.audioNode.getState()
		return JSON.stringify(state, undefined, 2)
		// return new Blob([JSON.stringify(state, undefined, 2)])
	}

	async setState(){
		// TODO: 
	}

	
	clone(){
		return new WAM2Instrument(this.audioContext, this.options)
	}

	/**
	 * force download...
	 */
	async downloadState()
	{
		const link = document.createElement('a')
		link.href = URL.createObjectURL( this.getState() )
		link.download = 'state.json'
		link.click()
		// Free up memory
		URL.revokeObjectURL(link.href)
	}
}