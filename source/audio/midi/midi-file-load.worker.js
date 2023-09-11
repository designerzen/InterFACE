import {
	fetchMIDIFileData,
	fetchMIDIFileThroughClient
} from './midi-file-load'

// Capture public methods
self.onmessage = e => {
	console.error("MIDI:Worker",e)

    const data = e.data
    switch (data.command)
    {
        case "loadMIDIFile":
			fetchMIDIFileData(data.url, data.options).then( midi => {

				console.error("MIDI:Worker loaded", {url:data.url, midi})

				postMessage({ 
					event:data.command, 
					midi
				})
			})
            break

        case "loadMIDIFileThroughClient":
			fetchMIDIFileThroughClient(data.url, data.options ).then( midi => {
				console.error("MIDI:Worker loaded", {url:data.url, midi})
				postMessage({ 
					event:data.command, 
					midi
				})
			})
            break
    }
}