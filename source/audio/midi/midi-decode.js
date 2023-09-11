/*//////////////////////////////////////////////////////////////////////////////

MIT Licence

Midi File
==============
Abstract    - decode a .midi file from an object in memory
Description - Buffers a .midi file into memory, parses the commands
Use         - Load( file.midi, onComplete ) and wait for the callback
Methods     -
Inspired by - https://github.com/gasman/jasmid/blob/master/stream.js#L2
References  - http://www.indiana.edu/~emusic/etext/MIDI/chapter3_MIDI3.shtml

Channel Voice
    Control the instrument's 16 voices (timbres, patches), plays notes, sends
    controller data, etc.

Channel Mode
    Define instrument's response to Voice messages, sent over instrument's
    'basic' channel

System Common
    Messages intended to all networked instruments and devices

System Real-Time
    Intended for all networked instruments and devices. Contain only status
    bytes and is used for syncronization of all devices. essentially a timing
    clock

System Exclusive
    Originally used for manufacturer-specific codes, such as editor/librarians,
    has been expanded to include MIDI Time Code, MIDI Sample Dump Standard and
    MIDI Machine Control

//////////////////////////////////////////////////////////////////////////////*/
import MIDIStream from './midi-stream'
import MIDICommand from './midi-command'
import MIDITrack from './midi-track'
import * as MIDICommands from './midi-commands'
import {convertMIDINoteNumberToName} from '../tuning/notes'

const TIME_CODE_BASED = "time-code-based" 
const METRIC_TIME = "metrical"

// some systems leave the last byte out
// to preserve memory but here we can
// re-add it if we want to :)
let lastEventTypeByte

/**
 * Take a 4 byte chunk out of the data set
 * @param {MidiStream} stream 
 * @returns {Object}
 */
const readChunk = (stream, size=4) => 
{
	const chunk = {}
	// Each midi event message is 4 bytes big...
	chunk.id = stream.read(size)
	chunk.length = stream.readInt32()
	chunk.data = stream.read(chunk.length)
	return chunk
}

/**
 * Get the amount of frames per second from the division
 * @param {Number} timeDivision 
 * @returns {Number}
 */
const getFramesPerSecond = timeDivision => {
    const bit8_15 = (timeDivision & 0xFF00) >> 8
    const flippedBit8_15 = bit8_15 ^ 0xFF
    return flippedBit8_15 + 1
}

/**
 * Convert Raw header data into readable object data
 * @param {MidiStream} stream 
 * @param {Object} options - defaults
 * @returns 
 */
const decodeHeader = ( stream, options={} ) =>
{
	const headerChunk = readChunk(stream)
	const headerType = headerChunk.id
	
	if (headerType !== 'MThd' && headerType !== 'MTrk' || headerChunk.length !== 6)
	{
		throw `.mid file could not be read - header chunk ${headerType} is not of type 'MThd'/'MTrk'.`
	}

	const headerStream = new MIDIStream(headerChunk.data)

	const formatType = headerStream.readInt16()
	const trackCount = headerStream.readInt16()
	const timeDivision = headerStream.readInt16()

	const isTimeCodeBased = timeDivision & 0x8000 
	const timeCodeType = isTimeCodeBased ? TIME_CODE_BASED : METRIC_TIME
	
	switch( headerType )
	{
		case "MThd":
			const division = {}
			if (timeCodeType === TIME_CODE_BASED) {
				division.ticksPerFrame = timeDivision & 0x00FF
				division.framesPerSecond = getFramesPerSecond(timeDivision)
			} else {
				division.ticksPerQuarterNote = timeDivision & 0x7FFF
			}
			return {
				formatType, trackCount, timeDivision, isTimeCodeBased, timeCodeType, division
			}
			
		case "MTrk":	
			return {
				formatType, trackCount, timeDivision, isTimeCodeBased, timeCodeType
			}
	}

}

/**
 * 
 * @param {MIDITrack} track 
 * @param {MidiStream} stream 
 * @returns 
 */
const decodeTracks = ( track, stream ) => 
{
	const quantity = track.header.trackCount
	for (let i = 0; i < quantity; i++)
	{
		const trackChunk = readChunk(stream)
		switch(trackChunk.id)
		{
			case "MTrk":
				break

			case "MThd":
				throw `Still working on MThd implementation... ${trackChunk.id}`

			default:
				throw `Unexpected chunk - expected MTrk, got ${trackChunk.id}`
		}
		
		const trackStream = new MIDIStream(trackChunk.data)
		while (!trackStream.eof())
		{
			const event = convertEventToCommand(trackStream)
			//tracks[i].push(event);
			track.addEvent(i,event)
		}

		// Now re-loop through all events and all 

		console.error("YO!", track )
	}
	return track
}

/**
 * 
 * @param {MidiStream} stream 
 * @returns {MIDICommand}
 */
const convertEventToCommand = (stream) => 
{
	const event = new MIDICommand()
	const time = stream.readVarInt()
	const eventTypeByte = stream.readInt8()

	event.deltaTime = time

	const isSystemEvent = (eventTypeByte & 0xf0) === 0xf0
	
	return isSystemEvent ? 
		decodeSystemEvent( stream, event, eventTypeByte) :
		decodeChannelEvent( stream, event, eventTypeByte)
}

/**
 * Control the instrument's 16 voices (timbres, patches),
 * plays notes, sends controller data, etc.
 * @param {MIDIStream} stream -
 * @param {MIDICommand} event -
 * @param {number} eventTypeByte - 
 * @returns {MIDICommand}
 */
const decodeChannelEvent = (stream, event, eventTypeByte ) =>
{
	let firstParameter

	if ((eventTypeByte & 0x80) === 0)
	{
		/* running status - 
		reuse lastEventTypeByte as the event type.
		this allows bytes to be saved if the command repeats
			eventTypeByte is actually the first parameter
		*/
		firstParameter = eventTypeByte
		eventTypeByte = lastEventTypeByte
	} else {
		firstParameter = stream.readInt8()
		lastEventTypeByte = eventTypeByte
	}

	const eventType = eventTypeByte >> 4
	
	event.channel = eventTypeByte & 0x0f
	event.type = MIDICommands.TYPE_CHANNEL
	//event.raw = `"type":${event.type},"channel":${event.channel}`

	switch (eventType)
	{
		// NOTE OFF
		case 0x08:
			event.subtype = MIDICommands.COMMAND_NOTE_OFF
			//'noteOff';
			event.noteNumber = firstParameter
			event.noteName = convertMIDINoteNumberToName(firstParameter)
			event.velocity = stream.readInt8()
			//event.raw += `"subtype":${event.subtype},"noteNumber":${firstParameter}`
			return event

		// NOTE ON
		case 0x09:
			event.noteNumber = firstParameter
			event.noteName = convertMIDINoteNumberToName(firstParameter)
			event.velocity = stream.readInt8()
			
			if (event.velocity === 0)
			{
				// SURPRISE! Disguised note off!
				event.subtype = MIDICommands.COMMAND_NOTE_OFF
			} else {
				event.subtype = MIDICommands.COMMAND_NOTE_ON;//'noteOn';
			}
			return event

		// AFTERTOUCH
		case 0x0a:
			event.subtype = MIDICommands.COMMAND_NOTE_AFTER_TOUCH;//'noteAftertouch';
			event.noteNumber = firstParameter
			event.noteName = convertMIDINoteNumberToName(firstParameter)
			event.amount = stream.readInt8()
			return event

		case 0x0b:
			event.subtype = MIDICommands.COMMAND_CONTROLLER;//'controller';
			event.controllerType = firstParameter
			event.value = stream.readInt8()
			return event

		// PROGRAM CHANGE
		case 0x0c:
			event.subtype = MIDICommands.COMMAND_PROGRAM_CHANGE;//'programChange';
			event.programNumber = firstParameter
			return event

		// AFTER TOUCH
		case 0x0d:
			event.subtype = MIDICommands.COMMAND_CHANNEL_AFTER_TOUCH;//'channelAftertouch';
			event.amount = firstParameter
			return event

		// PITCH BEND
		case 0x0e:
			event.subtype = MIDICommands.COMMAND_PITCH_BEND
			event.value = firstParameter + (stream.readInt8() << 7)

			return event;

		default:
			throw "Unrecognised MIDI event type: " + eventType;
			/*
			console.log("Unrecognised MIDI event type: " + eventType);
			stream.readInt8();
			event.subtype = 'unknown';
			return event;
			*/
	}
}


/**
 * 
 * @param {MIDIStream} stream 
 * @param {MIDICommand} event 
 * @param {number} eventTypeByte 
 * @returns {MIDICommand}
 */
const decodeSystemEvent = ( stream, event, eventTypeByte ) =>
{
	// system / meta event
	if (eventTypeByte === 0xff)
	{
		// meta event
		event.type =  MIDICommands.TYPE_META
		const subtypeByte = stream.readInt8()
		const length = stream.readVarInt()

		switch(subtypeByte)
		{
			case 0x00:
				event.subtype = 'sequenceNumber'
				if (length !== 2) { throw "Expected length for sequenceNumber event is 2, got " + length}
				event.sequenceNumber = stream.readInt16()
				return event

			case 0x01:
				event.subtype = 'text'
				event.text = stream.read(length)
				return event

			case 0x02:
				event.subtype = 'copyrightNotice'
				event.text = stream.read(length)
				return event

			case 0x03:
				event.subtype = 'trackName'
				event.text = stream.read(length)
				return event

			case 0x04:
				event.subtype = 'instrumentName'
				event.text = stream.read(length)
				return event;

			case 0x05:
				event.subtype = 'lyrics'
				event.text = stream.read(length)
				return event

			case 0x06:
				event.subtype = 'marker'
				event.text = stream.read(length)
				return event

			case 0x07:
				event.subtype = 'cuePoint'
				event.text = stream.read(length)
				return event

			case 0x20:
				event.subtype = 'midiChannelPrefix'
				if (length !== 1){ throw "Expected length for midiChannelPrefix event is 1, got " + length}
				event.channel = stream.readInt8()
				return event

			case 0x2f:
				event.subtype = 'endOfTrack'
				if (length !== 0) { throw "Expected length for endOfTrack event is 0, got " + length }
				return event

			case 0x51:
				event.subtype = 'setTempo'
				if (length !== 3) { throw "Expected length for setTempo event is 3, got " + length}
				event.microsecondsPerBeat = (
					(stream.readInt8() << 16)
					+ (stream.readInt8() << 8)
					+ stream.readInt8()
				)
				return event;

			case 0x54:
				event.subtype = 'smpteOffset'
				if (length !== 5) { throw "Expected length for smpteOffset event is 5, got " + length}
				const hourByte = stream.readInt8()

				// magic
				event.frameRate = {
					0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
				}[hourByte & 0x60]
				//console.error( event.frameRate )

				event.hour = hourByte & 0x1f
				event.min = stream.readInt8()
				event.sec = stream.readInt8()
				event.frame = stream.readInt8()
				event.subframe = stream.readInt8()
				return event

			case 0x58:
				event.subtype = 'timeSignature'
				if (length !== 4){ throw "Expected length for timeSignature event is 4, got " + length }
				event.numerator = stream.readInt8()
				event.denominator = Math.pow(2, stream.readInt8())
				event.metronome = stream.readInt8()
				event.thirtyseconds = stream.readInt8()
				return event

			case 0x59:
				event.subtype = 'keySignature'
				if (length !== 2){ throw "Expected length for keySignature event is 2, got " + length;}
				event.key = stream.readInt8(true)
				event.scale = stream.readInt8()
				return event;

			case 0x7f:
				event.subtype = 'sequencerSpecific'
				event.data = stream.read(length)
				return event;

			default:
				// console.log("Unrecognised meta event subtype: " + subtypeByte);
				event.subtype = 'unknown'
				event.data = stream.read(length)
				return event;
		}

	} else if (eventTypeByte === 0xf0) {

		event.type = MIDICommands.TYPE_SYSTEM_EXCLUSIVE
		const length = stream.readVarInt()
		event.data = stream.read(length)
		return event;

	} else if (eventTypeByte === 0xf7) {

		event.type = MIDICommands.TYPE_DIVIDED_SYSTEM_EXCLUSIVE
		const length = stream.readVarInt()
		event.data = stream.read(length)
		return event

	} else {
		throw "Unrecognised MIDI event type byte: " + eventTypeByte
	}
}

/**
 * Pass in a stream of raw data - get resolved data classes
 * @param {MidiStream} stream 
 * @returns {MIDITrack}
 */
export const decodeMIDI = ( stream, options={} ) =>
{
	const header = decodeHeader( stream)
	const track = new MIDITrack( header, options )
	return decodeTracks( track, stream )
}