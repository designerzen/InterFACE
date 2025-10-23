
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron"
// const { contextBridge, ipcRenderer } = require("electron")
// const isDevelopment = true

// Pass args from main.ts to this preloader
const arg = process.argv.filter(p => p.indexOf("--debug=") >= 0)[0]
const isDevelopment = arg ? 
	arg.substr(arg.indexOf("=") + 1) || false : 
	false


// Caveats
// navigator.mediaDevices.getUserMedia does not work on macOS for audio 
// capture due to a fundamental limitation whereby apps that want to access
// the system's audio require a signed kernel extension. 
// Chromium, and by extension Electron, does not provide this.

// It is possible to circumvent this limitation by capturing system audio
// with another macOS app like Soundflower and passing it through a virtual
// audio input device. This virtual device can then be queried with 
// navigator.mediaDevices.getUserMedia.

// To capture both audio and video from the entire desktop the constraints
// passed to navigator.mediaDevices.getUserMedia must include 
// chromeMediaSource: 'desktop', for both audio and video, but should not 
// include a chromeMediaSourceId constraint.
ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				mandatory: {
					chromeMediaSource: 'desktop'
				}
			},
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					// chromeMediaSourceId: sourceId,
					minWidth: 1280,
					maxWidth: 1280,
					minHeight: 720,
					maxHeight: 720
				}
			}
		})
		handleStream(stream)
	} catch (e) {
		handleError(e)
	}
})

function handleStream (stream) {
	const video = document.querySelector('video')
	video.srcObject = stream
	video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
	console.log(e)
}

// contextBridge.exposeInMainWorld('darkMode', {
//   toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
//   system: () => ipcRenderer.invoke('dark-mode:system')
// })

/*
// contextBridge
process.once("loaded", () => {
	contextBridge.exposeInMainWorld("electron", {
		debug:isDevelopment,
		// virtual midi sends back to main
		hasVirtualMidi: () => ipcRenderer.invoke( 'hasVirtualMidi' ),
		feedback: (state) => ipcRenderer.send("feedback", state),
		midi: (callback) => ipcRenderer.on('midi', (_event, deltaTime, message) => callback(deltaTime, message)),
		transport: (callback) => ipcRenderer.on('transport', (_event, value) => callback(value))
	} )
	// contextBridge.exposeInMainWorld("stepSequencer", {
})
*/

/**
 * window.electron.midi()
 * This is how any JS in the main thread chats to the rendered backend
 * if for example to communicate to the server or to call native methods

  contextBridge.exposeInMainWorld("electron", {
		midi: (callback) => ipcRenderer.on('midi', (_event, value) => callback(value)),
	  transport: (callback) => ipcRenderer.on("transport", callback),
  setRhythmDisplay: (callback) => ipcRenderer.on("update-rhythm", callback),
  setActiveTrack: (callback) => ipcRenderer.on("update-track", callback),
  setMelodyDisplay: (callback) => ipcRenderer.on("update-melody", callback)
	// showDialog: (title) => ipcRenderer.send('show-dialog', title),
	// setTitle: (title) => ipcRenderer.send('set-title', title),
	// debug:isDevelopment
	// send: (channel, data) => {
	//   // whitelist channels
	//   let validChannels = ["toMain", "showDialog"]
	//   if (validChannels.includes(channel)) {
	//     ipcRenderer.send(channel, data)
	//   }
	// },
	// receive: (channel, func) => {
	//   let validChannels = ["fromMain"]
	//   if (validChannels.includes(channel)) {
	//     // Deliberately strip event as it includes `sender`
	//     ipcRenderer.on(channel, (event, ...args) => func(...args))
	//   }
	// }
  })
}) */

function domReady(condition = ['complete', 'interactive']) {
	return new Promise((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve(true)
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true)
				}
			}, {once:true})
		}
	})
}

const safeDOM = {
	append(parent, child) {
		if (!Array.from(parent.children).find(e => e === child)) {
			return parent.appendChild(child)
		}
	},
	remove(parent, child) {
		if (Array.from(parent.children).find(e => e === child)) {
			return parent.removeChild(child)
		}
	},
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`
	const styleContent = `
  .app-loading-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
  }
      `
	const oStyle = document.createElement('style')
	const oDiv = document.createElement('div')

	oStyle.id = 'app-loading-style'
	oStyle.innerHTML = styleContent
	oDiv.className = 'app-loading-wrap'
	oDiv.innerHTML = `<div class="${className}"></div>`

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle)
			safeDOM.append(document.body, oDiv)
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle)
			safeDOM.remove(document.body, oDiv)
		},
	}
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
	ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)