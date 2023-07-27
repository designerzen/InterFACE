import { WebAudioModule } from '@webaudiomodules/sdk'
// import ParamMgrFactory from '@webaudiomodules/sdk-parammgr/'
import ParamMgrFactory from '@webaudiomodules/sdk-parammgr/src/ParamMgrFactory.js'
// import ParamMgrFactory from '@webaudiomodules/sdk-parammgr/src/ParamMgrFactory.js'
// import { ParamMgrFactory } from '@webaudiomodules/sdk-parammgr/src/index.js'

import { createSimpleEngine } from './simple.wam.js'

// _baseUrl = getBaseUrl(new URL('./descriptor.json', import.meta.url));
import descriptorJSONURL from 'url:./descriptor.json'
import descriptorJSON from './descriptor.json'

const NAME = "simple"

const getBaseUrl = relativeUrl => relativeUrl.substring(0, relativeUrl.lastIndexOf('/'));

export default class SimplePlugin extends WebAudioModule {

	// _baseURL = getBasetUrl(new URL('.', import.meta.url));

	// check to see if it running via import or not...
	_baseUrl = getBaseUrl(descriptorJSONURL)
	// _baseUrl = getBaseUrl(new URL('./', import.meta.url).href)
	_descriptorUrl = descriptorJSONURL // `${this._baseUrl}/wam2/${NAME}/descriptor.json`
	_descriptor = descriptorJSON
	_templateUrl = `${this._baseUrl}/wam2/${NAME}/template.html`

	/**
	 * Overide and intercept the descriptor file
	 * @param {Object} initialState 
	 * @returns 
	 */
	async initialize(initialState) {
		// we embed the JSON so no need to fetch JSON
		// await this._loadDescriptor()
		const templateRes = await fetch(this._templateUrl)
		this.templateHtmlStr = await templateRes.text()
		if (initialState){
			// populate state
		}
		return super.initialize(initialState)
	}

	/**
	 * The plugin redefines the async method createAudionode()
	 * that must return an <Audionode>
	 * @param {Object} options 
	 * @returns Audionode
	 */
	async createAudioNode(initialState) {
		// this.moduleId
		const node = createSimpleEngine( this.audioContext, this._descriptor, initialState)
		const internalParamsConfig = {
            gain: 1
		}

		// NB. REQUIRES internalID set in descriptor
		const paramMgrNode = await ParamMgrFactory.create(this, {internalParamsConfig})

		// node.setup(paramMgrNode)
		node.setup( paramMgrNode )
		// if (initialState){ 
		// 	node.setState(initialState)
		// }
		return node
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