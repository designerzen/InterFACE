// TODO: load appropriate language...
import {QUICK_START, INSTRUCTIONS, INSTRUCTION_FOR_AUTOMATION} from '../locales/en_GB'

export const injectHelp = (index, ...data)=> QUICK_START.splice(index, 0, ...data)
export const injectInstructions= (index, ...data)=> INSTRUCTIONS.splice(index, 0, ...data)
export const injectInstructionsForAutomation= (index, ...data)=> INSTRUCTION_FOR_AUTOMATION.splice(index, 0, ...data)

export const getHelp = (index, language="en-GB") => QUICK_START[index%(QUICK_START.length-1)]
export const getInstruction = (index, language="en-GB") => INSTRUCTIONS[index%(INSTRUCTIONS.length-1)]
export const getInstructionForAutomation = (index, language="en-GB") => INSTRUCTION_FOR_AUTOMATION[index%(INSTRUCTIONS.length-1)]

// let instructionCount = 0
// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

let instructionCount = 0
export const getNextInstruction = (language="en-GB") => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-1)]