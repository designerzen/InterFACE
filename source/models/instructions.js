// TODO: load appropriate language...
import {QUICK_START, INSTRUCTIONS} from '../locales/en_GB'

export const getHelp = (index, language="en-GB") => QUICK_START[index%(QUICK_START.length-1)]
export const getInstruction = (index, language="en-GB") => INSTRUCTIONS[index%(INSTRUCTIONS.length-1)]

// let instructionCount = 0
// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

let instructionCount = 0
export const getNextInstruction = (language="en-GB") => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-1)]