
import abcjs from "abcjs"


/**
 * X: 1
 * T: Cooley's
 * M: 4/4 
 * L: 1/8
 * K: Emin
 * |:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
 * EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
 * |:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
 * eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|
 */
export const convertMIDITrackToNotation = ( midiTrack, domID="notation" ) => {
	
	const visualOptions = { 

	}
	const header = [
		"X:1", 
		"T:" + (midiTrack.name || "My Song"),
		"T:interface.place",
		"K:D", 
		"M:4/4" 
	]
	const abcString = midiTrack.commands.map( (command, index) => {
		
		// each command gives us a noteNumber and a noteLength and a noteName
		console.log(command)

		// convert note number to 
		// command.noteNumber
		
		return ` ${command.key}${index%4===0?'|':''}${(index%16===0?"\n":"")}`
	})

	const notes = header.join("\n") + abcString.join("")
	const visualObj = abcjs.renderAbc( domID, notes, visualOptions)

}