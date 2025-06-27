// TODO: load appropriate language...
import {QUICK_START, INSTRUCTIONS, INSTRUCTION_FOR_AUTOMATION} from '../locales/en_GB.js'
import { fetchJSON } from '../utils/fetch.js'

const QUICK_START_GUIDE = [...QUICK_START]
const INSTRUCTIONS_GUIDE = [...INSTRUCTIONS]
const AUTOMATION_INSTRUCTIONS_GUIDE = [...INSTRUCTION_FOR_AUTOMATION]

export const injectHelp = (index, ...data)=> QUICK_START_GUIDE.splice(index, 0, ...data)
export const injectInstructions= (index, ...data)=> INSTRUCTIONS_GUIDE.splice(index, 0, ...data)
export const injectInstructionsForAutomation= (index, ...data)=> AUTOMATION_INSTRUCTIONS_GUIDE.splice(index, 0, ...data)

export const getHelp = (index, language="en-GB") => QUICK_START_GUIDE[index%(QUICK_START_GUIDE.length-1)]
export const getInstruction = (index, language="en-GB") => INSTRUCTIONS_GUIDE[index%(INSTRUCTIONS_GUIDE.length-1)]
export const getInstructionForAutomation = (index, language="en-GB") => AUTOMATION_INSTRUCTIONS_GUIDE[index%(AUTOMATION_INSTRUCTIONS_GUIDE.length-1)]

let instructionCount = 0
export const getNextInstruction = (language="en-GB") => INSTRUCTIONS_GUIDE[(instructionCount+1)%(INSTRUCTIONS_GUIDE.length-1)]

// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

export const getInstructions = async (language="en", referer="") => {
	
	// TODO: Load in appropriate language
	
	try{
		// Attempt to Lazy load
		// Load in our instruction tool kit
		if (referer.length)
		{
			const instructionLocation = `./locales/${language}/instructions` + (referer ? `-${referer}` : "")+".json"
			const instructionsData = await fetchJSON(instructionLocation)
			
			// save to local space
			// if automated, we show different instructions!
			injectHelp(0, ...instructionsData )
			injectInstructions(0, ...instructionsData)
			injectInstructionsForAutomation(0, ...instructionsData)

			// console.error("CUSTOM Instructions Loaded", instructionsData)
		}

		return {
			getHelp,
			getInstruction,
			getNextInstruction,
			getInstructionForAutomation,
			getQuantityOfHelp:() => QUICK_START_GUIDE.length - 1,
			getQuantityOfInstructions:() => INSTRUCTIONS_GUIDE.length - 1
		}

	}catch(error){
				
		// backup plan for failed JS loads
		// getInstruction = getHelp = i => ''
	}
}