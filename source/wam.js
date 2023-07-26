
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "/node_modules/@lookingglass/webxr/dist/@lookingglass/webxr.mjs"
// import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import * as THREE from "three/src/Three.js"
// import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

// this just uses Parcel to bundle the file locally
// and stores the URL that the file is available  in the plugin constant
//- import pluginURL from 'url:./audio/wam2/simple/index.js'

import { initializeWamHost } from "@webaudiomodules/sdk"
import SimplePlugin from "./audio/wam2/simple/index.js"
// import WAM2Instrument from "./audio/instruments/instrument.wam2.js"

// import simplePluginURI from "url:./audio/wam2/simple/index.js"

// import simplePluginURI from "worklet:./audio/wam2/simple/index.js"
// console.error("WAM:", simplePluginURI)

// import samplerPluginURI from "url:./audio/wam2/sampler/index.js"
// import samplerPluginURI from "worklet:./audio/wam2/sampler/index.js"

// import synthWAMPlugin from "./audio/wam2-external/tinySynth/src/index.js"	
// import synthWAMPlugin from "./audio/wam2-external/synth101/src/index.tsx"	
// import synthWAMPlugin from "url:./audio/wam2-external/WamExample/src/index.js"	

import audioSample from 'url:/dist/assets/audio/Fatboy/bright_acoustic_piano-mp3/C3.mp3'
import workletUrl from "worklet:./audio/worklets/sampler.worklet.js"


// TESTING
// import createAppInterface from './interface-test.js'


let initialised = false
let currentPluginAudioNode

const createAudioProcessor = async(audioContext) => {

	try {
	
		await audioContext.audioWorklet.addModule(workletUrl)
	
	} catch (e) {
		console.error("Audio Processor failed", e)
		return null
	}


	return new AudioWorkletNode(audioContext, "sampler-processor")
}

const create = async(audioContext) => {

	// Create a wrapped WAM
	// const wam = new WAM2Instrument( audioContext, audioContext.destination, {wamURL:simplePluginURI} )
	// console.log("Creating wam", {wam, simplePluginURI} )

	// load main plugin file
	// const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
	const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
	// const { default: pingPongDelayWAMPlugin } = await import("./audio/wam2/pingpongdelay/index.js")
	const { default: samplerWAMPlugin } = await import("./audio/wam2/sampler/index.js")
	
	const [hostGroupId] = await initializeWamHost(audioContext)

	// You can can optionally specify additional information such as the initial state 
	// Create a new instance of the plugin, equivalent to :
	// const wam = new WAM(audioCtx);
	// await wam.initialize(initialState);

	console.log("Creating WAM Instruments...", {hostGroupId, simpleWAMPlugin}  )

	const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created simplePlugin Instrument", {simplePlugin} )

	// const pingPongDelayPlugin = await pingPongDelayWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// console.log("Created pingPongDelayPlugin Instrument", { pingPongDelayPlugin} )

	const samplerPlugin = await samplerWAMPlugin.createInstance(hostGroupId, audioContext, {})
	console.log("Created samplerPlugin Instrument", {samplerPlugin, audioSample} )
	
	const sample = await samplerPlugin.audioNode.loadAudio( audioSample )
	samplerPlugin.audioNode.play( sample )
	
	const sampleRaw = await samplerPlugin.audioNode.loadAudioArrayBuffer( audioSample )
	
	const cpu = await createAudioProcessor( audioContext )
	console.log("Created Audio Worklet", {cpu, audioSample, sample, sampleRaw} )

	if (!cpu){
		// now worklet availability :(
		console.error("FAILED Audio Worklet", {cpu} )
	}else{
		cpu.port.postMessage("load")
	}
	

	// GUI -----------------------------------------------------
	// Now Locate the HTMLElement for controlling playback
	const player = document.querySelector('#player')

	// Tie the UI into the HTML
	const mediaElementSource = audioContext.createMediaElementSource(player)	
	
	
	// Very simple function to connect the plugin audionode to the host
	const connectPlugin = (context, inputNode, plugin) => {
		
		const pluginNode = plugin.audioNode
		const masterGain = new GainNode(context)
		// grab the onscreen streaming media item
	
		// connect the source to plugin
		// const simpleGainPluginAudioNode = simplePlugin.getAudioNode()
		inputNode.connect(plugin.audioNode)

		// simpleGainPluginAudioNode.connect(audioContext.destination);
		pluginNode.connect(masterGain)
		// pingPongDelayPlugin.audioNode.connect(output.destination)

		// now connect our final node to the audioContext output
		masterGain.connect(context.destination)

		console.log("Creating Media source", {context, inputNode, plugin} )

		// return the audio node within the plugin
		return pluginNode
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

	//currentPluginAudioNode = connectPlugin( audioContext, mediaElementSource, simplePlugin )
	currentPluginAudioNode = connectPlugin( audioContext, mediaElementSource, samplerPlugin )

	// now watch for events from the media player on screen
	player.onplay = async (event) => {
		event.preventDefault()
		// audio context must be resumed because browser restrictions
		await audioContext.resume() 
		console.log("Playing back audio with fx", event, {player, mediaElementSource} )
	}

	const noteOn = ( noteNumber=74, velocity=100 ) => {

		//console.error("currentPluginAudioNode", currentPluginAudioNode )

		currentPluginAudioNode.noteOn(noteNumber, velocity )
		// currentPluginAudioNode.scheduleEvents({ 
		// 	type: 'wam-midi', 
		// 	time: audioContext.currentTime, 
		// 	data: { bytes: new Uint8Array([0x90, noteNumber, velocity]) } 
		// })
		currentPluginAudioNode.play( sample )
	}

	const noteOff = ( noteNumber=74, velocity=100 ) => {

		//console.error("currentPluginAudioNode", currentPluginAudioNode )

		currentPluginAudioNode.noteOff(noteNumber, velocity )

		// currentPluginAudioNode.scheduleEvents({ 
		// 	type: 'wam-midi', 
		// 	time: audioContext.currentTime + 0.25, 
		// 	data: { bytes: new Uint8Array([0x80, noteNumber, velocity]) } 
		// })
	}

	// player.play()

	console.log("Creating WAM Plugin", {player, currentPluginAudioNode, mediaElementSource} )

	// play the thing with different inputs!
	window.addEventListener("keydown", event => {
	
		const keyNumber = parseInt(event.key)
		const isNumber = !isNaN( keyNumber )
		const focussedElement = document.activeElement
		if (isNumber)
		{
			noteOn( keyNumber * 10 )
		}else{
			noteOn( (Math.random() * 100) >> 0 )
		}	
	})

	window.addEventListener("keyup", event => {
	
		const keyNumber = parseInt(event.key)
		const isNumber = !isNaN( keyNumber )
		const focussedElement = document.activeElement
		if (isNumber)
		{
			noteOff( keyNumber * 10 )
		}
	})
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

	/*
	const config = LookingGlassConfig
	config.tileHeight = 512
	config.numViews = 45
	config.targetY = 0
	config.targetZ = 0
	config.targetDiam = 3
	config.fovy = (14 * Math.PI) / 180
	new LookingGlassWebXRPolyfill()

	const scene = new THREE.Scene()

	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(2, 0.1, 0.1),
		new THREE.MeshStandardMaterial({ color: "red" })
	)

	scene.add(cube)

	scene.add(new THREE.AmbientLight(0xaaaaaa))
	const directionalLight = new THREE.DirectionalLight(0xffffff)
	directionalLight.position.set(3, 3, 3)
	scene.add(directionalLight)

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	document.body.append(renderer.domElement)
	renderer.xr.enabled = true

	const camera = new THREE.PerspectiveCamera()
	camera.position.z = 3

	renderer.setAnimationLoop(() => {
		cube.rotation.z += 0.01
		cube.rotation.x += 0.02
		renderer.render(scene, camera)
	});

	document.body.append(VRButton.createButton(renderer))

	function resize() {
		renderer.setSize(innerWidth, innerHeight)
		camera.aspect = innerWidth / innerHeight
		camera.updateProjectionMatrix()
	}
	resize()
	window.addEventListener("resize", resize)
	*/
}


const test = async () => {

	const audioContext = new AudioContext({ latencyHint: 'playback' })
	const [hostGroupId] = await initializeWamHost(audioContext)
	const { default: simpleWAMPlugin } = await import("worklet:./audio/wam2/simple/index.js")
	
	// const { default: simpleWAMPlugin } = await import("./audio/wam2/simple/index.js")
	// const [hostGroupId] = await initializeWamHost(audioContext)
	// const simplePlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// console.log("Created simplePlugin Instrument", {simplePlugin} )

	// We need to determine the correct transformer to use
	// as we do *not* want this to be transpiled and transpiling it is breaking it
	// bundle-text:
	// data-url:
	// url:	- causes file read error as uses file://

	// const { default: synthWAMPlugin } = await import("url:./audio/wam2-external/tinySynth/src/index.js")
	// const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
	const synthPlugin = await simpleWAMPlugin.createInstance(hostGroupId, audioContext, {})
	// const { default: synthWAMPlugin } = await import("./audio/wam2-external/synth101/src/index.tsx")
	// const synthPlugin = await synthWAMPlugin.createInstance(hostGroupId, audioContext, {})
}

// Required to start any kind of audio interaction & playback
document.addEventListener("click", init, {once:true})
// document.addEventListener("click", test, {once:true})
