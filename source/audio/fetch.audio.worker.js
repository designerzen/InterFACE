import { base64Decode } from "../utils/base64.js"
import { NOTE_NAMES, NOTE_NAMES_POPULAR_FIRST } from "./tuning/notes.js"
import decode, {decoders} from 'audio-decode'
import { typedArrayToBuffer } from "../utils/base64.js"
/**
 * Fetch an audio sample / wave / mp3 / ogg from the server...
 * Try and decode as much as we can in threads...
 * 
 */
export const CMD_DECODE = "command-decode"
export const CMD_FETCH_SOUNDFONT_PART = "command-fetch-soundfont"
export const CMD_LOAD_SOUNDFONT = "command-load-soundfont"
export const CMD_LOAD_SOUNDFONT_AUDIO_DATA = "command-load-soundfont-part"
export const CMD_CANCEL = "command-cancel"


export const EVENT_DECODED = "decode complete"

// const DEFAULT_SOUNDFONT_HOST = " https://gleitz.github.io/midi-js-soundfonts/"
const DEFAULT_SOUNDFONT_HOST = " https://paulrosen.github.io/midi-js-soundfonts/"

// https://paulrosen.github.io/midi-js-soundfonts/abcjs/
const DEFAULT_SOUNDFONT_STRING_OPTIONS = {
	soundfont: "MusyngKite",
	uri: DEFAULT_SOUNDFONT_HOST,
	suffix: ".js",
	url: (uri, soundfont, instrumentNameAndFormat, suffix = '.js') => `${uri}${soundfont}/${instrumentNameAndFormat}${suffix}`
}


/**
 * Allows us to load in instruments saved as base64 without having to execute
 * any code through eval - we simply download the javascript text and grep out
 * anything base64 encoded and then pass that out as an ArrayBuffer
 * @param {String} instrumentNameAndFormat 
 * @param {Object} options 
 * @returns {Object}+
 */
export const fetchSoundFontAudioDataFromString = async (instrumentNameAndFormat, options = {}) => {

	options = { ...DEFAULT_SOUNDFONT_STRING_OPTIONS, ...options }
	const signal = options.signal

	const url = options.url(options.uri, options.soundfont, instrumentNameAndFormat, options.suffix)

	const request = await fetch(url, signal ? { signal } : undefined)
	const response = await request.text()

	let begin = response.indexOf('MIDI.Soundfont.')
	if (begin < 0) {
		throw Error('Mangled MIDI.js Soundfont format ;(')
	}

	begin = response.indexOf('=', begin) + 2
	const end = response.lastIndexOf(',')
	const source = JSON.parse(response.slice(begin, end) + '}')

	// console.log("loadSoundFontFromString", {response,source,end})
	const buffers = {}

	Object.keys(source).map(async (key) => {
		const i = source[key].indexOf(',')
		const encoded = source[key]
		const encodedSlice = encoded.slice(i + 1)
		buffers[key] = base64Decode(encodedSlice)
	})

	return buffers
}

// ------------------------------------------------

const fetchSoundFontAudioDataPartFromFile = async (path) => {
	const response = await fetch(path)
	const arrayBuffer = await response.arrayBuffer()
	return arrayBuffer
}


let currentAbortController = null

self.onmessage = async (e) => {

	//console.log("worker fetch audio", e)

	const { command, instrumentNameAndFormat, options } = e.data

	switch (command) {

		// Load in a JS file that contains the mp3s but as code
		// this is the slowest way to load in audio in realtime
		// but least strain on the server and option to go fully
		// remote with the data set
		case CMD_DECODE: {
			currentAbortController = new AbortController()
			const decodeSignal = currentAbortController.signal
			try {
				const audioData = await fetchSoundFontAudioDataFromString(instrumentNameAndFormat, { ...options, asBuffer: true, signal: decodeSignal })
				const audioBuffers = Object.keys(audioData).map(d => typedArrayToBuffer(audioData[d]))
				postMessage({ event: EVENT_DECODED, audio: audioBuffers })
			} catch (error) {
				if (error.name === 'AbortError') return
				throw error
			} finally {
				currentAbortController = null
			}
			break
		}

		// Load in the instruments
		case CMD_FETCH_SOUNDFONT_PART: {
			currentAbortController = new AbortController()
			const fetchSignal = currentAbortController.signal
			const audioArrayBuffers = {}
			// loop through all notes but in the special order	
			const filePromises = NOTE_NAMES_POPULAR_FIRST.map( async(note, index) => {
				if (fetchSignal.aborted) return
				const partPath = `${e.data.path}/${note}.${options.format ?? "mp3"}`
				const partResponse = await fetch(partPath, { signal: fetchSignal })
				const partArrayBuffer = await partResponse.arrayBuffer()
				audioArrayBuffers[note] = partArrayBuffer
				return partArrayBuffer
			})
			try {
				await Promise.all(filePromises)
				if (fetchSignal.aborted) return
				postMessage({ event:EVENT_DECODED, audio:audioArrayBuffers })
			} catch (error) {
				if (error.name === 'AbortError') return
				throw error
			} finally {
				currentAbortController = null
			}
			break
		}

		// Load in the instruments & parse their buffers
		// NB. OfflineAudioContext NOT available in workers so we use audio-decode library
		case CMD_LOAD_SOUNDFONT_AUDIO_DATA: {
			currentAbortController = new AbortController()
			const decodeSignal = currentAbortController.signal
			const audioArrayBuffers = {}
			// loop through all notes but in the special order	
			const audioBufferPromises = NOTE_NAMES_POPULAR_FIRST.map( async(note, index) => {
				if (decodeSignal.aborted) throw new DOMException('Aborted', 'AbortError')
				const partPath = `${e.data.path}/${note}.${options.format ?? "mp3"}`
				const partResponse = await fetch(partPath, { signal: decodeSignal })
				const partArrayBuffer = await partResponse.arrayBuffer()
				if (decodeSignal.aborted) throw new DOMException('Aborted', 'AbortError')
				const partAudioBuffer = await decode(partArrayBuffer)
				if (decodeSignal.aborted) throw new DOMException('Aborted', 'AbortError')
				audioArrayBuffers[note] = partAudioBuffer
				return partAudioBuffer
			})
			try {
				await Promise.all(audioBufferPromises)
				if (decodeSignal.aborted) return
				postMessage({ event:EVENT_DECODED, audio:audioArrayBuffers })
			} catch (error) {
				if (error.name === 'AbortError') return
				throw error
			} finally {
				currentAbortController = null
			}
			break
		}

		// Load in the instruments
		case CMD_LOAD_SOUNDFONT: {
			// const response = await fetch(path)
			// const arrayBuffer = await response.arrayBuffer()
			// postMessage({ event:EVENT_DECODED, audio:arrayBuffer  })
			break
		}
		case CMD_CANCEL: {
			if (currentAbortController)
			{
				currentAbortController.abort()
				currentAbortController = null
			}
			break
		}
	}
}
