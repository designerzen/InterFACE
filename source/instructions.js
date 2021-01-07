export const QUICK_START = [
	`No faces found!`
]
export const INSTRUCTIONS = [
	`Welcome to the interFACE`,
	`Smile at the screen to begin...`,
	`Look at me and open your mouth`,
	`Tilt your head forwards and backwards to change octave`,
	`Roll your head left and right to change pitch`,
	`Then open you mouth to make it louder!`,
	`Change instruments by clicking your face`,
	`Use your eyes to shape the sound`,
	`Facing left plays the black keys`,
	`Facing right plays the white keys`,
	`Connect a MIDI instrument and click the MIDI button`,
	`To play the MIDI instrument with your head`,
	`Change tempo and quantize using the secret keys`,
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
	`Arrow Up - add more bars`,
	`Arrow Down - remove a bar`,
	`Arrow Left - previous instrument`,
	`Arrow Right - next instrument`,
	`A - 808`,
	`S - Snare`,
	`D - Closed Hat`,
	`Q - Clack`,
	`W - Cowbell`,
	`B - Play percussive accompanyment (alpha)`,
	`TAB - show more info on screen`,
]

export const getInstruction = index => INSTRUCTIONS[index%(INSTRUCTIONS.length-1)]

// let instructionCount = 0
// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

let instructionCount = 0
export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-1)]