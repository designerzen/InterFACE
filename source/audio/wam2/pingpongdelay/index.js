// Double role for WebAudioModule :
// 1 - Factory for providing the DSP/WebAudio node and GUI
// 2 - This makes the instance of the current class an Observable
//     (state in WebAudioModule, initialized with the default values of
//      the params variable below...)
import { WebAudioModule } from '@webaudiomodules/sdk'
import { ParamMgrFactory } from '@webaudiomodules/sdk-parammgr'
import PingPongDelayNode from './pingpongdelay.wam.js'
// import { createElement } from './Gui/index.js';

import descriptorJSONURL from 'url:./descriptor.json'
import descriptorJSON from './descriptor.json'

const NAME = "pingpongdelay"

const getBaseUrl = relativeUrl => relativeUrl.substring(0, relativeUrl.lastIndexOf('/'))

/**
 * Definition of a new plugin
 *
 * @class PingPongDelayPlugin
 * @extends {WebAudioModule<PingPongDelayNode>}
 */
export default class PingPongDelayPlugin extends WebAudioModule {
	// _baseURL = getBasetUrl(new URL('.', import.meta.url));
	_baseUrl = getBaseUrl(descriptorJSONURL)
	_descriptorUrl = `${this._baseURL}/descriptor.json`
	_descriptor = descriptorJSON

	async _loadDescriptor() {
		if (!this._descriptor)
		{
			const url = this._descriptorUrl
			if (!url) {throw new TypeError('Descriptor not found')}
			const response = await fetch(url)
			const descriptor = await response.json()
			Object.assign(this._descriptor, descriptor)
		}		
	}

	async initialize(state) {
		await this._loadDescriptor()
		return super.initialize(state)
	}

	async createAudioNode(initialState) {
		const pingPongDelayNode = new PingPongDelayNode(this.audioContext)
		console.error("WAM2 :pingPongDelayNodecreated!", this.audioContext, this )
		
		const paramsConfig = {
			feedback: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0.5,
			},
			time: {
				defaultValue: 0.5,
			},
			mix: {
				defaultValue: 0.5,
			},
			enabled: {
				defaultValue: 1,
			},
		}

		const internalParamsConfig = {
			delayLeftTime: pingPongDelayNode.delayNodeLeft.delayTime,
			delayRightTime: pingPongDelayNode.delayNodeRight.delayTime,
			dryGain: pingPongDelayNode.dryGainNode.gain,
			wetGain: pingPongDelayNode.wetGainNode.gain,
			feedback: pingPongDelayNode.feedbackGainNode.gain,
			enabled: { onChange: (value) => { pingPongDelayNode.status = !!value; } },
		}

		const paramsMapping = {
			time: {
				delayLeftTime: {},
				delayRightTime: {},
			},
			mix: {
				dryGain: {
					sourceRange: [0.5, 1],
					targetRange: [1, 0],
				},
				wetGain: {
					sourceRange: [0, 0.5],
					targetRange: [0, 1],
				},
			},
		}

		const optionsIn = { internalParamsConfig, paramsConfig, paramsMapping }
		console.error("WAM2 :pingPongDelayNode:optionsIn",optionsIn )
		
		
		const paramMgrNode = await ParamMgrFactory.create(this, optionsIn)
		pingPongDelayNode.setup(paramMgrNode)
		if (initialState){ 
			pingPongDelayNode.setState(initialState)
		}
		return pingPongDelayNode
	}

	// createGui() {
	// 	return createElement(this);
	// }
}