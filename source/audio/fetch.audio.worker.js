import { base64Decode } from "../utils/base64.js"
import { NOTE_NAMES, NOTE_NAMES_POPULAR_FIRST } from "./tuning/notes.js"
import decode, {decoders} from 'audio-decode'
import { typedArrayToBuffer } from "../utils/base64.js"
import { rearrangeArrayBySnake } from "../utils/array-tools.js"
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
export const EVENT_DECODED_PART = "decode part complete"

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

const createTransferablePCMMessage = (audioData) => {
	const channelData = audioData?.channelData ?? []
	const sampleRate = audioData?.sampleRate
	if (!channelData.length || !sampleRate)
	{
		throw Error("Decoded audio data was missing channelData or sampleRate")
	}

	const transferList = []
	const transferredBuffers = new Set()
	const transferableChannels = channelData.map(channel => {
		if (!(channel instanceof Float32Array))
		{
			return new Float32Array(channel)
		}
		return channel
	})

	transferableChannels.forEach(channel => {
		if (!transferredBuffers.has(channel.buffer))
		{
			transferredBuffers.add(channel.buffer)
			transferList.push(channel.buffer)
		}
	})

	return {
		audio:{
			channelData:transferableChannels,
			sampleRate
		},
		transferList
	}
}

const getOrderedSoundFontParts = (options = {}) => {
	return rearrangeArrayBySnake(NOTE_NAMES_POPULAR_FIRST, options.startIndex)
}

const loadSoundFontPartsInBatches = async (parts, options, abortSignal, loadPart) => {
	const simultaneous = options.simultaneous ?? 12
	const total = parts.length || 1
	let nextIndex = 0
	let loadedQuantity = 0

	while (nextIndex < parts.length)
	{
		if (abortSignal.aborted) throw new DOMException('Aborted', 'AbortError')

		const batch = parts.slice(nextIndex, nextIndex + simultaneous)
		const batchStartIndex = nextIndex
		nextIndex += batch.length

		await Promise.all(batch.map(async (note, batchIndex) => {
			if (abortSignal.aborted) throw new DOMException('Aborted', 'AbortError')

			const index = batchStartIndex + batchIndex
			await loadPart(note, index, () => {
				loadedQuantity++
				return loadedQuantity / total
			})
		}))
	}

	return loadedQuantity
}

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
			const parts = getOrderedSoundFontParts(options)
			try {
				const loadedQuantity = await loadSoundFontPartsInBatches(parts, options, fetchSignal, async (note, index, getProgress) => {
					const partPath = `${e.data.path}/${note}.${options.format ?? "mp3"}`
					const partResponse = await fetch(partPath, { signal: fetchSignal })
					const partArrayBuffer = await partResponse.arrayBuffer()
					audioArrayBuffers[note] = partArrayBuffer
					postMessage({
						event: EVENT_DECODED_PART,
						audio: partArrayBuffer,
						part: note,
						index,
						progress: getProgress()
					})
					return partArrayBuffer
				})
				if (fetchSignal.aborted) return
				postMessage({ event:EVENT_DECODED, audio:audioArrayBuffers, decoded:loadedQuantity })
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
			// loop through all notes but in the special order	
			const parts = getOrderedSoundFontParts(options)
			try {
				const decodedQuantity = await loadSoundFontPartsInBatches(parts, options, decodeSignal, async (note, index, getProgress) => {
					const partPath = `${e.data.path}/${note}.${options.format ?? "mp3"}`
					const partResponse = await fetch(partPath, { signal: decodeSignal })
					const partArrayBuffer = await partResponse.arrayBuffer()
					if (decodeSignal.aborted) throw new DOMException('Aborted', 'AbortError')
					const partAudioBuffer = await decode(partArrayBuffer)
					if (decodeSignal.aborted) throw new DOMException('Aborted', 'AbortError')
					const { audio, transferList } = createTransferablePCMMessage(partAudioBuffer)
					postMessage({
						event: EVENT_DECODED_PART,
						audio,
						part: note,
						index,
						progress: getProgress()
					}, transferList)
					return note
				})
				if (decodeSignal.aborted) return
				postMessage({ event:EVENT_DECODED, decoded:decodedQuantity })
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
