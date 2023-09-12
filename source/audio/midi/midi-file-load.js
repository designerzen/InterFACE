// Midi File
// ==============
// Abstract    - Load a .midi file from a local server
// Description - Buffers a .midi file into memory, parse the commands
// Use         - Load( file.midi, onComplete ) and wait for the callback

import MIDIStream from './midi-stream'
import { decodeMIDI } from './midi-decode'
import { base64DecToArr } from '../../utils'

/**
 * Clean data
 * @param {String} data - raw data
 * @returns String of decoded MIDI data
 */
 const sanitizeResponse = ( data ) => {
	const chars = []
	for (let i = 0, quantity = data.length; i < quantity; ++i)
	{
		chars[i] = String.fromCharCode(data.charCodeAt(i) & 255)
	}
	return chars.join('')
}

/**
 * Convert an array of integers into a string of bytes
 * NB. & 255 is not neccessary
 * @param {Array} arrayBuffer 
 * @returns {String} String Bytes
 */
const arrayBufferToBytes = arrayBuffer => Array.prototype.map.call( arrayBuffer, ch => String.fromCharCode(ch) ).join('')

/**
 * ASCII to Bytes  bufferToBinaryString
 * WebWorker compatable atob.
 * NB. This is very costly - try and avoid
 * @returns 
 */
const asciiToBinary = ( ascii ) => {	
	return (typeof window == "object" && typeof document == "object" && window.document === document) ?
		atob : 
		arrayBufferToBytes( base64DecToArr(ascii) )
}

/**
 * load From Base64 String
 * @param {string} arr - UInt8Array
 * @param {Object} options -
 * @returns 
 */
const loadMIDIFromArray = async ( arr, options={}, progressCallback=null ) => new Promise( (resolve,reject) => {
	try{
		const data = arrayBufferToBytes( new Uint8Array(arr) )
		const stream = new MIDIStream( data )
		resolve( decodeMIDI(stream, options) )
	}catch(error){
		reject(error)
	}
})

/**
 * load From Base64 String
 * @param {string} file - Base64 string as raw bytes
 * @param {Object} options -
 * @returns 
 */
const loadMIDIFromBase64 = async ( file, options={}, progressCallback=null ) => new Promise( (resolve,reject) => {
	try{
		const encoded = file.split(',')[1]
		const data = asciiToBinary(encoded)
		const stream = new MIDIStream( data )
		resolve( decodeMIDI(stream, options) )
	}catch(error){
		reject(error)
	}
})

/**
 * loadMIDIFromFile
 * FIXME: Use fetch rather than XMLHttpRequest?
 * @param {string} url - url
 */
export const loadMIDIFromFile = (url, options={}, progressCallback=null) => new Promise( (resolve,reject) => {
    const fetch = new XMLHttpRequest()
    fetch.open("GET", url, true)
    fetch.responseType = "arraybuffer"
	fetch.onerror = error => reject(error)
	fetch.onreadystatechange = (e) => {
		/*
		0: request not initialized
		1: server connection established
		2: request received
		3: processing request
		4: request finished and response is ready
		*/
		if (fetch.readyState === 4 && fetch.status === 200)
		{
			const arrayBuffer = fetch.response
			if (arrayBuffer) {
			  const byteArray = new Uint8Array(arrayBuffer)
			  const midi = loadMIDIFromArray(byteArray, options, progressCallback )
			  resolve(midi)
			}
		}
	}
    // fetch.onload = () => {}
    fetch.send(null)
})

/**
 * Open a file from the client's local machine and load it
 * into memory
 * @param {File} file 
 * @param {Function} progressCallback 
 * @returns 
 */
export const loadRawFile = (file, progressCallback, base64=true) => new Promise( (resolve,reject) => {
	const fileReader = new FileReader()
	fileReader.onload = event => resolve(fileReader.result)
	fileReader.onprogress = event => progressCallback && progressCallback(event)
	fileReader.onerror = event => reject(fileReader.error)
	base64 ? 
		fileReader.readAsDataURL(file) :
		fileReader.readAsArrayBuffer(file)
})


/**
 * url can either be a file name as a string or 
 * it can be a base64 encoded midi file
 * @param {string} urlOrBlob - URL string or base64 encoded string
 * @returns {MIDITrack} MIDIStream instance
 */
export const fetchMIDIFileData = ( urlOrBlob, options={}, progressCallback=null ) => new Promise( async (resolve,reject) => {
	const isString = typeof urlOrBlob === "string"
	let midiFile

	if (isString)
	{
		const isBase64 = urlOrBlob.indexOf('base64,') === -1
		if (isBase64)
		{
			midiFile = await loadMIDIFromFile( urlOrBlob, options, progressCallback ) 
		}else{
			midiFile = await loadMIDIFromBase64( urlOrBlob, options, progressCallback )
		}
		// console.error("loadMIDIFile via BASE64",{urlOrBlob, midiFile})
		
	}else{

		midiFile = await loadMIDIFromArray( urlOrBlob, options, progressCallback )
		// console.error("loadMIDIFile via ArrayBuffer",{ urlOrBlob, midiFile})
	}
	resolve(midiFile)
})

/**
 * Load MIDI Performance from FILE / String / Local
 * @param {string} file 
 * @param {Object} options 
 * @param {Function} progressCallback 
 * @param {Function} useBase64 - false 
 * @returns {MIDITrack}
 */
export const fetchMIDIFileThroughClient = async (file, options, progressCallback, useBase64=false ) => {
	
	const rawFile = await loadRawFile( file, progressCallback, useBase64 )
	const midiTrack = await fetchMIDIFileData( rawFile, {
		...options,
		trackName:(file.name).split(".mid")[0].replace("_", " ")
	}, progressCallback )
	return midiTrack
}