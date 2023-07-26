// import CompositeAudioNode from '@webaudiomodules/sdk/'
import { CompositeAudioNode, ParamMgrNode } from '@webaudiomodules/sdk-parammgr'

export class MIDI {
	static NOTE_ON = 0x90;
	static NOTE_OFF = 0x80;
	static CC = 0xB0;
}

export default class SamplerPlugin extends CompositeAudioNode {
	
	/**
	 * @type {ParamMgrNode}
	 */
	_wamNode = undefined

	isEnabled = true

	pack = undefined

	audioBuffers = new Map()
	samples = new Map()

	get paramMgr() {
		return this._wamNode
	}

	set status(value) {

		// nothing to update
		if (this.isEnabled === value)
		{ 
			return
		}

		this.isEnabled = value

		if (this.isEnabled) {
			console.log('BYPASS MODE OFF FX RUNNING');
			this.wetGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5)
			this.dryGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5)
			// this.delayNode.gain.linearRampToValueAtTime(1200, this.context.currentTime + 0.5)
		} else {
			console.log('BYPASS MODE ON');
			this.wetGainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5)
			this.dryGainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.5)
			// this.delayNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5)
		}
	}

	constructor(context, options) {
		super(context, options)
		this.createNodes()
	}

	// // The plugin redefines the async method createAudionode()
	// // that must return an <Audionode>
	// async createAudioNode(options) {
	// 	return this.wetGainNode
	// }

	/**
	 * Mandatory
	 * @param {ParamMgrNode} wamNode
	 */		
	setup(paramMgr) {

        paramMgr.addEventListener('wam-midi', (e) => this.processMIDIEvents([{event: e.detail.data.bytes, time: 0}]))

		this._wamNode = paramMgr
		this.connectNodes()
		this._output = this.outputNode
		console.log('sampler.wam CONSTRUCTOR SETUP', { thiswamNode:this._wamNode })
	}

	/**
	 * 
	 * @param {ScheduledMIDIEvent[]} midiEvents - ScheduledMIDIEvents
	 */
	processMIDIEvents(midiEvents) {
		midiEvents.forEach (message => {
            if (message.event[0] == MIDI.NOTE_ON) 
			{
                const midiNote = message.event[1]
                const velocity = message.event[2]
                if (velocity)
				{
					this.noteOn(midiNote, message.time)

				} else {
					
					this.noteOff(midiNote, message.time)
				}

            } else if (message.event[0] == MIDI.NOTE_OFF) {

                const midiNote = message.event[1]
                this.noteOff(midiNote, message.time)
            }
		});
    }

	async noteOn(noteNumber, velocity=1){
		console.log("SAMPLER : NOTE ON", {noteNumber, velocity}, this)
	}

	// FIXME: Fade out the gate
	async noteOff(noteNumber, velocity=0){
		// this.volume = velocity
		console.log("note off", {noteNumber, velocity}, this )
	}

	/**
	 * mandatory, will create default input and output
	 */
	createNodes() {
		this.outputNode = this.context.createGain()
		this.dryGainNode = this.context.createGain()
		this.wetGainNode = this.context.createGain()
		this.delayNode = this.context.createDelay( 0.05 )
		this.feedbackGainNode = this.context.createGain()
	}

	connectNodes() {

		super.connect(this.wetGainNode)
		super.connect(this.dryGainNode)

		this.wetGainNode.gain.value = 0.5
		this.wetGainNode.connect(this.delayNode)

		this.delayNode.delayTime.value = 0.05
		this.delayNode.connect(this.feedbackGainNode)

		this.feedbackGainNode.gain.value = 0.6
		// this.feedbackGainNode.connect(this.delayNode)
		this.feedbackGainNode.connect(this.wetGainNode)

		this.wetGainNode.connect(this.outputNode)
		this.dryGainNode.connect(this.outputNode)
	}

	/**
	 * We cache all audioBuffer data for re-use later or until
	 * we flushData()
	 * 
	 * @param {String} path - to audio file mp3/wav/ogg etc
	 * @param {Boolean} ignoreExisting - forget cache and reload fresh
	 * @returns 
	 */
	async loadAudio(path, ignoreExisting=false ){

		const existing = this.audioBuffers.get(path)
		
		if (!ignoreExisting && existing !== undefined )
		{
			return existing
		}

		const arrayBuffer = await this.loadAudioArrayBuffer( path )
		const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
		
		this.audioBuffers.set( path, audioBuffer )

		return audioBuffer
	}
	
	async loadAudioArrayBuffer(path ){
		const response = await fetch(path)
		return await response.arrayBuffer()
	}

	fetchAudioBuffer( audioBuffer, ignoreExisting=true ){
		
		const existing = this.samples.get(audioBuffer)

		if (!ignoreExisting && existing !== undefined )
		{
			existing.stop()
			return existing
		}

		// FIXME: Re-use one buffer source per sample?
		const trackSource = this.context.createBufferSource()
		
		const disconnect = (error) => {
			trackSource.disconnect()
			trackSource = null
			active = false
			return error ? false : true
		}	

		// trackSource.onended = disconnect
		// trackSource.onerror = disconnect
		trackSource.connect( this.wetGainNode )

		trackSource.buffer = audioBuffer
		
		this.samples.set( audioBuffer, trackSource )

		return trackSource
	}

	// play( await loadAudio(path) , 50 )
	async play(audioBuffer, offset=0, velocity=128, options={ loop:false } ){

		// FIXME: Re-use one buffer source per sample?
		let trackSource = this.fetchAudioBuffer( audioBuffer )
		
		trackSource.loop = options.loop || false

		if (this.context.state === 'suspended') 
		{
			await this.context.resume()
		}
		
		if (offset == 0) 
		{
			trackSource.start( 0 )
		//offset = context.currentTime
		} else {
			trackSource.start(0, this.context.currentTime - offset)
		}
	}
	
/*
	// MANDATORY : redefine these methods
	// eslint-disable-next-line class-methods-use-this
	getParamValue(name) {
		return this._wamNode.getParamValue(name)
	}

	setParamValue(name, value) {
		return this._wamNode.setParamValue(name, value)
	}

	getParamsValues() {
		return this._wamNode.getParamsValues()
	}

	setParamsValues(values) {
		return this._wamNode.setParamsValues(values)
	}
	*/
} 

export const createSamplerEngine = (audioContext, descriptor, options) => new SamplerPlugin(audioContext, options)