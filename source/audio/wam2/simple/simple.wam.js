// import CompositeAudioNode from '@webaudiomodules/sdk/'
import { CompositeAudioNode, ParamMgrNode } from '@webaudiomodules/sdk-parammgr'

export default class SimpleExample extends CompositeAudioNode {
	
	/**
	 * @type {ParamMgrNode}
	 */
	_wamNode = undefined

	isEnabled = true


	get paramMgr() {
		return this._wamNode
	}

	constructor(context, options) {
		super(context, options)
		this.createNodes()
	}

	noteOn(){
		console.error("NOTE ON", arguments )

	}

	noteOff(){
		console.error("NOTE OFF", arguments )

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
	setup(wamNode) {

		// FIXME:
		wamNode.addEventListener('wam-midi', (e) => this.processMIDIEvents([{event: e.detail.data.bytes, time: 0}]))

		this._wamNode = wamNode
		this.connectNodes()
		this._output = this.outputNode
		
		console.log('simple.wam CONSTRUCTOR SETUP', {wamNode, thiswamNode:this._wamNode })
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
		this.channelMerger = this.context.createChannelMerger(2)
	}

	connectNodes() {

		super.connect(this.wetGainNode)
		super.connect(this.dryGainNode)

		this.wetGainNode.gain.value = 0.5
		this.wetGainNode.connect(this.delayNode)
		this.delayNode.delayTime.value = 0.05
		this.delayNode.connect(this.feedbackGainNode)
		this.feedbackGainNode.gain.value = 0.6
		this.feedbackGainNode.connect(this.delayNode)
		
		//this.wetGainNode.connect(this.delayNode)
		this.feedbackGainNode.connect(this.wetGainNode)
		this.wetGainNode.connect(this.outputNode)
		// this.dryGainNode.connect(this.outputNode)

		// this.audioNode.connect(audioContext.destination)
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

export const createSimpleEngine = (audioContext, descriptor, options) => new SimpleExample(audioContext, options)