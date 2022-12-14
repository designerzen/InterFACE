// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

/**
 * This is how any JS in the main thread chats to the rendered backend
 * if for example to communicate to the server or to call native methods
 */
process.once("loaded", () => {

  contextBridge.exposeInMainWorld("electron", {

	showDialog: (title) => ipcRenderer.send('show-dialog', title),
	setTitle: (title) => ipcRenderer.send('set-title', title),

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
})

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  
  for (const type of ['chrome', 'node', 'electron']) {
    //replaceText(`${type}-version`, process.versions[type])
  }
})