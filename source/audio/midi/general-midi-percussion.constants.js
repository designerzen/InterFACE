// General MIDI 2.0 : Percussion Channel 10 Drum sounds (overwrites the noteNumber)
//
//  On MIDI Channel 10, each MIDI Note number ("Key#") corresponds to a different drum sound, as shown below.
// GM-compatible instruments must have the sounds on the keys shown here.

import { GENERAL_MIDI_INSTRUMENT_NAMES } from "./general-midi-instrument.constants"

// FIXME: add the other drum sounds...
export const GENERAL_MIDI_PERCUSSION_FRIENDLY = GENERAL_MIDI_INSTRUMENT_NAMES

// Channel 10 is the "Drum channel" which has different instruments
export const GENERAL_MIDI_PERCUSSION_FAMILY_IDS = {
	0: "standard kit",
	8: "room kit",
   16: "power kit",
   24: "electronic kit",
   25: "tr-808 kit",
   32: "jazz kit",
   40: "brush kit",
   48: "orchestra kit",
   56: "sound fx kit",
}