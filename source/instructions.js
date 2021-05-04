export const QUICK_START = [
	`Hello!`,
	`I'm looking for your pretty face`,
	`Look at me and open your mouth`,
	`Move your face close to the screen`,
	`Try and put it in the centre`,
	`I still cannot see you`,
	`Make sure you allowed the camera!`,
]
export const INSTRUCTIONS = [
	`Welcome to the <strong>interFACE</strong>`,
	`Smile at the screen to begin...`,
	`Tilt your head forwards and backwards to change octave`,
	`Roll your head left and right to change pitch`,
	`Then open you mouth to make it louder!`,
	`Change instruments by closing both eyes for 1 bar`,
	`or by tapping your face on screen`,
	`to select an instrument from a list`,
	`hold your finger on your face for one bar to see all instruments`,
	`Facing left plays the black keys`,
	`Facing right plays the white keys`,
	`Use your eyes to shape the sound`,
	`Connect a MIDI instrument and click the MIDI button`,
	`In order to play the MIDI instrument with your head`,
	`You can change tempo using the arrow keys`,
	`Or just type a 3 digit number to set a BPM`,
	`Or tap the Q key in rhythm a few times`,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	`Hotkeys<br>(* means beta feature)`,
	`Type any three numbers to set the tempo`,
	`eg. 090 for 90BPM`,
	`eg. 120 for 120BPM`,
	`Arrow Up - add more bars`,
	`Arrow Down - remove a bar`,
	`Arrow Left - previous instrument`,
	`Arrow Right - next instrument`,
	`A - 808`,
	`B - Backing Percussion`,
	`C - Clear`,
	`D - Closed Hat`,
	`E - Clack`,
	`G - `,
	`H - `,
	`J - `,
	`K - `,
	`M - Metronome toggle on or off`,
	`Q - Quiet mode (mute / unmute)`,
	`R - Record*`,
	`S - Snare`,
	`T - Hide Instrument Text`,
	`V - Toggle video on screen`,
	`W - Cowbell`,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	``,
	`OMG I can't believe you are still here!`,
	`Secret Keys are as follows`,
	`CAPS Lock - developer debug`,
	`TAB - show more info on screen`,
]

export const getHelp = index => QUICK_START[index%(QUICK_START.length-1)]
export const getInstruction = index => INSTRUCTIONS[index%(INSTRUCTIONS.length-1)]

// let instructionCount = 0
// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

let instructionCount = 0
export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-1)]