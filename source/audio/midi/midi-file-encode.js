import { toVarLenBytes, toBytes } from '../../utils.js'
import * as MIDICommands from './midi-commands'

const HEADER_CHUNK_TYPE = [0x4d, 0x54, 0x68, 0x64] // MThd
const HEADER_CHUNK_LENGTH = [0x00, 0x00, 0x00, 0x06]
const HEADER_CHUNK_FORMAT0 = [0x00, 0x00]
const HEADER_CHUNK_FORMAT1 = [0x00, 0x01]
const TRACK_CHUNK_TYPE = [0x4d, 0x54, 0x72, 0x6b] // MTrk

const MESSAGE_NOTEON_PREFIX = 0x90
const MESSAGE_NOTEOFF_PREFIX = 0x80
const MESSAGE_PROGRAMCHANGE_PREFIX = 0xc0

const META_EVENT_PREFIX = 0xff
const META_EVENT_END = 0x2f
const META_EVENT_TIMESIG = 0x58
const META_EVENT_TEMPO = 0x51
const META_TIMESIG_CC = 0x18 // 24 MIDI clocks per quarter note
const META_TIMESIG_BB = 0x08 // 8 1/32nds per quarter note (quarternote per quarternote)
const DEFAULT_CHANNEL = 0
const DEFAULT_VELOCITY = 64
const DEFAULT_TICKSPERBEAT = 96
const DEFAULT_TEMPO = 60
const DEFAULT_NUMERATOR = 4
const DEFAULT_DENOMINATOR = 4
const DEFAULT_OCTAVE = 5 // default note octave
const DEFAULT_constIATION = 1 // default instrument constiation
const MAX_CHANNEL = 15
const MAX_NOTE = 127
const MAX_VELOCITY = 127
const MAX_TICKSPERBEAT = 65535
const DATAURI_PREFIX = 'data:audio/midibase64,'

// https://github.com/pulzed/MIDIFileWriter.js/blob/master/src/midifilewriter.js
const convertMIDICommandToBytes = (command) => {
	switch( command.subtype)
	{
		case MIDICommands.COMMAND_NOTE_ON:
		case MIDICommands.COMMAND_NOTE_OFF:
			const noteBytes = toconstLenBytes(time)
			const noteStatus = channel | (type ? MESSAGE_NOTEOFF_PREFIX : MESSAGE_NOTEON_PREFIX)
			noteBytes.push(noteStatus, note, velocity)
			return noteBytes
			
		case MIDICommands.TYPE_META:
			data = data || []
			const time = 0
			const metaBytes = toVarLenBytes(time)
			metaBytes.push(META_EVENT_PREFIX, type)
			metaBytes = metaBytes.concat(toVarLenBytes(data.length))
			metaBytes = metaBytes.concat(data)
			return metaBytes

		case MIDICommands.COMMAND_PROGRAM_CHANGE : 
			const programBytes = toVarLenBytes(time)
			const programStatus = channel | MESSAGE_PROGRAMCHANGE_PREFIX
			programBytes.push(programStatus, program)
			return programBytes
	}
}

const getBytes = function() {
	return new Uint8Array(buildFile())
}
const getBase64 = function() {
	return toBase64(this.getBytes())
}
const getDataURI = function() {
	return DATAURI_PREFIX + this.getBase64()
}

const getHeader = ( MIDITrack, ticksPerBeat=DEFAULT_TICKSPERBEAT ) => {
	const commandQuantity = MIDITrack.commands.length
	const noneZeroCommand = (commandQuantity > 1) ? commandQuantity + 1 : commandQuantity
	const bytes = HEADER_CHUNK_TYPE
	bytes = bytes.concat(HEADER_CHUNK_LENGTH)
	bytes = bytes.concat((commandQuantity > 1) ? HEADER_CHUNK_FORMAT1 : HEADER_CHUNK_FORMAT0)
	bytes = bytes.concat(toBytes(noneZeroCommand, 2))
	bytes = bytes.concat(toBytes(ticksPerBeat, 2))
	return bytes
}

const createMIDIFile = (MIDITrack, properties) =>{
	
	const tpb = (properties && properties.ticksPerBeat && properties.ticksPerBeat > 0 && properties.ticksPerBeat <= MAX_TICKSPERBEAT)
		? properties.ticksPerBeat
		: DEFAULT_TICKSPERBEAT

	const tempo = (properties && properties.tempo && properties.tempo > 0)
		? properties.tempo
		: DEFAULT_TEMPO

	const timeSig = (properties && properties.timeSignature instanceof Array && properties.timeSignature.length === 2)
		? [properties.timeSignature[0], properties.timeSignature[1]]
		: [DEFAULT_NUMERATOR, DEFAULT_DENOMINATOR]


	function buildFile(MIDITrack) {

		const n_tracks = trackList.length
		const bytes = getHeader( MIDITrack, tpb )

		// create time signature and tempo meta events
		const metaEvents = getTimeSigAndTempoMeta()
		
		// format 1 MIDI, add a meta track with time signature and tempo data
		if (n_tracks > 1) 
		{
			var metaTrack = new MIDITrack()
			// add meta track bytes
			bytes = bytes.concat(metaTrack.getBytes(metaEvents))
		}

		// add track data
		for (var i = 0; i < n_tracks; i++) 
		{
			var track = trackList[i]
			var trackBytes = (n_tracks === 1 && i === 0)
				? track.getBytes(metaEvents) // format 0 MIDI, add time signature and tempo data
				: track.getBytes()
			bytes = bytes.concat(trackBytes)
		}
		return bytes;
	}


}