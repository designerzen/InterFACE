import { CompositeAudioNode } from '@webaudiomodules/sdk-parammgr'

/**
 * @typedef {"feedback" | "time" | "mix" | "enabled"} Params
 * @typedef {"feedback" | "delayLeftTime" | "delayRightTime"
 * | "dryGain" | "wetGain" | "enabled"} InternalParams
 */
export default class PingPongDelayNode extends CompositeAudioNode {
	/**
	 * @type {ParamMgrNode<Params, InternalParams>}
	 */
	_wamNode = undefined
	
	isEnabled = true

	get paramMgr() {
		return this._wamNode
	}

	// plugin is an instance of he class that exends WebAudioModule
	// this instance is he plugin as an Observable
	// options is an extra container that could be ussed to indicate
	// the number of inputs and outputs...
	constructor(audioContext, options) {
		super(audioContext, options)
		this.createNodes()
		
		console.log('CONSTRUCTOR CompositeAudioNode')
	}

	/*  #########  Personnal code for the web audio graph  #########   */
	createNodes() {
		this._input = this.context.createGain()
		super.connect(this._input)
		this._output = this.context.createGain()
		this.delayNodeLeft = this.context.createDelay()
		this.delayNodeRight = this.context.createDelay()
		this.dryGainNode = this.context.createGain()
		this.wetGainNode = this.context.createGain()
		this.feedbackGainNode = this.context.createGain()
		this.channelMerger = this.context.createChannelMerger(2)
	}

	connectNodes() {
		// dry mix
		this._input.connect(this.dryGainNode)
		// dry mix out
		this.dryGainNode.connect(this._output)

		// the feedback loop
		this.delayNodeLeft.connect(this.channelMerger, 0, 0)
		this.delayNodeRight.connect(this.channelMerger, 0, 1)

		this.feedbackGainNode.connect(this.delayNodeLeft)
		this.delayNodeRight.connect(this.feedbackGainNode)

		this.delayNodeLeft.connect(this.delayNodeRight)

		// wet mix
		this._input.connect(this.feedbackGainNode)

		// wet out
		this.channelMerger.connect(this.wetGainNode)
		this.wetGainNode.connect(this._output)
	}

	/**
	 * @param {ParamMgrNode<Params, InternalParams>} wamNode
	 */
	setup(wamNode) {
		this._wamNode = wamNode
		this.connectNodes()
		
		console.log('CONSTRUCTOR SETUP')
	}


	set status(_sig) {
		if (this.isEnabled === _sig){ return}
		this.isEnabled = _sig
		if (_sig) 
		{
			this._input.disconnect(this._output)
			this._input.connect(this.feedbackGainNode)
			this._input.connect(this.dryGainNode)
		} else {
			this._input.disconnect(this.feedbackGainNode)
			this._input.disconnect(this.dryGainNode)
			this._input.connect(this._output)
		}
	}
}