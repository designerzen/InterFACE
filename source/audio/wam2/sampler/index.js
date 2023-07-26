import { WebAudioModule } from '@webaudiomodules/sdk'
import { ParamMgrFactory } from '@webaudiomodules/sdk-parammgr'
import Sampler from './sampler.wam.js'

import descriptorJSONURL from 'url:./descriptor.json'
import descriptorJSON from './descriptor.json'
// import templateURL from 'url:./template.html'

const NAME = "sampler"


const getBaseUrl = relativeUrl => relativeUrl.substring(0, relativeUrl.lastIndexOf('/'));


export default class SamplerPlugin extends WebAudioModule {
	
	_baseUrl = getBaseUrl(descriptorJSONURL)
	_descriptorUrl = descriptorJSONURL // `${this._baseUrl}/wam2/${NAME}/descriptor.json`
	_descriptor = descriptorJSON
	// _templateUrl = templateURL
	/**
	 * Overide and intercept the descriptor file
	 * @param {Object} initialState 
	 * @returns 
	 */
	async initialize(initialState) {
		// we embed the JSON so no need to fetch JSON
		// await this._loadDescriptor()
		// const templateRes = await fetch(this._templateUrl)
		// this.templateHtmlStr = await templateRes.text()
		if (initialState){
			// populate state
		}
		return super.initialize(initialState)
	}

	// The plugin redefines the async method createAudionode()
	// that must return an <Audionode>
	async createAudioNode(options) {
		// const gainNode = new GainNode(this.audioContext, options)
		// createSamplerEngine
		const sampler = new Sampler(this.audioContext, options)
		const internalParamsConfig = {
            gain: 1
		}
		const paramMgrNode = await ParamMgrFactory.create(this, {
			internalParamsConfig
		})
		
		sampler.setup( paramMgrNode )

		return sampler
	}
	
	/**
	 * Make a front end available to all apps
	 * this should be a combination of parameters
	 * that align with the parameters of the synthesizzer
	 * 
	 * @returns HTMLElement
	 */
	async createGui() {
		// return createElement(this)
	}

	/**
	 * 
	 * @returns 
	
	async setState(){
		return super.setState()
	}

	async getState(){
		return super.getState()
	}
 */
}