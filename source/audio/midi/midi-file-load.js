// Midi File
// ==============
// Abstract    - Load a .midi file from a local server
// Description - Buffers a .midi file into memory, parse the commands
// Use         - Load( file.midi, onComplete ) and wait for the callback
import MIDIStream from './midi-stream'
import {decodeMIDI} from './midi-decode'

const fromCharCode = String.fromCharCode

/**
 * 
 * @param {String} data - raw data
 * @returns String of decoded MIDI data
 */
 const convertResponse = ( data ) => {
	const chars = []
	const quantity = data.length
	for (let i = 0; i < quantity; ++i)
	{
		chars[i] = fromCharCode(data.charCodeAt(i) & 255)
	}
	return chars.join('')
}

/**
 * load From Base64 String
 * @param {string} file - Base64 string as raw bytes
 * @param {Object} options -
 * @returns 
 */
const loadMIDIFromBase64 = async ( file, options={} ) => new Promise( (resolve,reject) => {
	try{
		const data = window.atob(file.split(',')[1])
		const stream = new MIDIStream( data )
		resolve( decodeMIDI(stream, options) )
	}catch(error){
		reject(error)
	}
})

/**
 * loadMIDIFromFile
 * @param {string} url - url
 */
const loadMIDIFromFile = async ( url, options={} ) => new Promise( (resolve,reject) => {
	const fetch = new XMLHttpRequest()
	fetch.open('GET', url, true)
	fetch.overrideMimeType('text/plain; charset=x-user-defined')
	fetch.onreadystatechange = (e) => {
		/*
		0: request not initialized
		1: server connection established
		2: request received
		3: processing request
		4: request finished and response is ready
		*/
		if (fetch.readyState === 4)
		{
			if (fetch.status === 200)
			{
				const data = convertResponse( fetch.responseText || '' )
				const stream = new MIDIStream( data )
				//console.log("stream found", { data,stream} )
				resolve( decodeMIDI(stream, options) )
			} else {
				reject('Unable to load MIDI file')
			}
		}
	}
	fetch.send()
})


const loadRawFile = (file, progressCallback) => new Promise( (resolve,reject) => {
	const fileReader = new FileReader()
	fileReader.onload = event => {
		resolve(fileReader.result)
	}
	fileReader.onprogress = event => {
		progressCallback && progressCallback(event)
	}
	fileReader.onerror = event => {
		reject(fileReader.error)
	}
	fileReader.readAsDataURL(file)
})


/**
 * url can either be a file name as a string or 
 * it can be a base64 encoded midi file
 * @param {string} url - or base64 encoded file
 * @returns {MIDITrack} MIDIStream instance
 */
export const loadMIDIFile = async ( url, options={} ) => {
	const isFile = url.indexOf('base64,') === -1
	return isFile ? await loadMIDIFromFile( url, options ) : await loadMIDIFromBase64( url, options )
}

/**
 * 
 * @param {*} file 
 * @param {*} progressCallback 
 * @returns {MIDITrack}
 */
export const loadMIDIFileThroughClient = async (file, options, progressCallback) => {
	const rawFile = await loadRawFile( file, progressCallback )
	const midiTrack = await loadMIDIFile( rawFile, {
		trackName:(file.name).split(".mid")[0].replace("_", " ")
	} )
	return midiTrack
}