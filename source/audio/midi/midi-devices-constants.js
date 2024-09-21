/**
 * https://studiocode.dev/doc/midi-manufacturers/
 * Here we list all known devices with custom messages and 
 * links to important device information such as manual and
 * drivers as well as having a good known config for SYSEX
 */
import midi_name, * as midi_id from "midi-manufacturers"

// console.log(midi_id.FOCUSRITE_NOVATION);                // 00 20 29

// console.log(midi_name[midi_id.FOCUSRITE_NOVATION]);     // Focusrite/Novation

export const ROLAND_MANUFACTURER = "Roland Corp."
export const ROLAND_WEBSITE = "roland.com"
export const ROLAND_S1 = `S-1`
export const ROLAND_DIAGRAM = `/`

/**
 * Try and determine some more information about this device
 * @param {String} manufacturer eg. Roland Corp.
 * @param {String} device eg. S-1
 */
export const findMIDIDeviceDetails = ( manufacturer, device ) => {

	switch(manufacturer)
	{
		case ROLAND_MANUFACTURER:
			break
	}
}