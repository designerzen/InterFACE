/**
 * WAM Instrument! (we must also show the GUI!)
 */

import { initializeWamHost } from "@webaudiomodules/sdk"

let initialised = false

const create = async(audioContext) => {

	// load main plugin file
	const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
	const { default: pingPongDelayWAMPlugin } = await import("./audio/wam2/pingpongdelay/index.js")
	const { default: samplerWAMPlugin } = await import("./audio/wam2/sampler/index.js")
	
	const [hostGroupId] = await initializeWamHost(audioContext)

	// You can can optionally specify additional information such as the initial state 
	// Create a new instance of the plugin, equivalent to :
	// const wam = new WAM(audioCtx);
	// await wam.initialize(initialState);

	console.log("Creating WAM Instruments...", {hostGroupId, simpleWAMPlugin, pingPongDelayWAMPlugin}  )

	const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created simplePlugin Instrument", {simplePlugin} )

	// const pingPongDelayPlugin = await pingPongDelayWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// console.log("Created pingPongDelayPlugin Instrument", { pingPongDelayPlugin} )

	const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created samplerPlugin Instrument", {samplerPlugin} )

	
	// GUI -----------------------------------------------------
	// Now Locate the HTMLElement for controlling playback
	const player = document.querySelector('#player')

	// Tie the UI into the HTML
	const mediaElementSource = audioContext.createMediaElementSource(player)	
	console.log("Creating Media source", {mediaElementSource, player} )

	// Very simple function to connect the plugin audionode to the host
	const connectPlugin = (output) => {
		const masterGain = new GainNode(output)
		// grab the onscreen streaming media item
	
		// connect the source to simple plugin
		mediaElementSource.connect(simplePlugin.audioNode)
		// and the simple plugin to the ping pong delay
		// simplePlugin.audioNode.connect(pingPongDelayPlugin.audioNode)
		simplePlugin.audioNode.connect(masterGain)
		// now connect our final node to the audioContext output
		masterGain.connect(output.destination)

		// const simpleGainPluginAudioNode = simpleGainPluginInstance.getAudioNode()
		// mediaElementSource.connect(simpleGainPluginAudioNode);
		// simpleGainPluginAudioNode.connect(audioContext.destination);
		// pingPongDelayPlugin.audioNode.connect(output.destination)
	}

	// Very simple function to append the plugin root dom node to the host
	const mountPlugin = (domNode) => {
		mount.innerHtml = ''
		mount.appendChild(domNode)
	}

	// create a data object that contains the full state of the plugin
	const downloadState = async () => {
		let state = await pluginInstance.audioNode.getState()
		const blob = new Blob([JSON.stringify(state, undefined, 2)])
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = 'state.json'
		link.click()
	}

	// plugins AudioNodes are bypassed by default.
	// pingPongDelayPlugin.setState({ enabled: true })

	// instance.audioNode is the plugin WebAudio node (native, AudioWorklet or
	// Composite). It can then be connected to the WebAudio graph.

	// then create the GUI
	//- const pluginDomNode = await pingPongDelayPlugin.createGui()
	//- for example
	//- document.appendChild(pluginDomNode)

	connectPlugin( audioContext )

	// now watch for events from the media player on screen
	player.onplay = (event) => {
		event.preventDefault()
		// audio context must be resumed because browser restrictions
		audioContext.resume() 
		console.log("Playing back audio with fx", event, {player, mediaElementSource} )
	}

	// player.play()

	console.log("Creating WAM Plugin", {player, mediaElementSource} )
}


const init = async () => {

	if (initialised)
	{
		return
	}

	initialised = true
		
		
	// make the URL relative...
	//- let testURL = pluginURL.split("?")[0]
	//- testURL = testURL.replace("http://localhost:909/", "")
	//- const wamURL = new URL(testURL, import.meta.url)
	
	// Safari...
	const AudioContext = window.AudioContext || window.webkitAudioContext || false

	if (AudioContext)
	{
		const context = new AudioContext({ latencyHint: 'playback' })
		await create(context)
		//- console.log(import.meta, "plugin URL", {pluginURL, testURL, wamURL})
		console.log("Plugin created?")
	}else{

		console.error("No Audio Engine on this browser ;(")
	}
}




export default class WAM2Instrument extends Instrument{



}