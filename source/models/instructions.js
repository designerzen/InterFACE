// TODO: load appropriate language...
import { QUICK_START, INSTRUCTIONS, INSTRUCTION_FOR_AUTOMATION } from '../locales/en_GB.js'
import { fetchJSON } from '../utils/fetch.js'

const getIndexedInstruction = (guide, index) => guide[index % (guide.length - 1)]

const selectCustomInstructionsForMode = (instructionsData, advancedMode) => {
	if (Array.isArray(instructionsData)) {
		return instructionsData
	}

	if (!instructionsData || typeof instructionsData !== 'object') {
		return []
	}

	const preferredMode = advancedMode ? 'advanced' : 'basic'
	const fallbackMode = advancedMode ? 'basic' : 'advanced'
	const selectedInstructions = instructionsData[preferredMode] ?? instructionsData[fallbackMode] ?? []

	return Array.isArray(selectedInstructions) ? selectedInstructions : []
}

// export const getNextInstruction = () => INSTRUCTIONS[(instructionCount+1)%(INSTRUCTIONS.length-2)]

export const getInstructions = async (language = 'en', referer = '', options = {}) => {
	const { advancedMode = true } = options

	const quickStartGuide = [...QUICK_START]
	const instructionsGuide = [...INSTRUCTIONS]
	const automationInstructionsGuide = [...INSTRUCTION_FOR_AUTOMATION]

	try {
		// Attempt to Lazy load
		// Load in our instruction tool kit
		if (referer.length) {
			const instructionLocation = `./locales/${language}/instructions${referer ? `-${referer}` : ''}.json`
			const instructionsData = await fetchJSON(instructionLocation)
			const customInstructions = selectCustomInstructionsForMode(instructionsData, advancedMode)

			if (customInstructions.length) {
				quickStartGuide.unshift(...customInstructions)
				instructionsGuide.unshift(...customInstructions)
				automationInstructionsGuide.unshift(...customInstructions)
			}
		}

		let instructionCount = 0

		return {
			getHelp: index => getIndexedInstruction(quickStartGuide, index),
			getInstruction: index => getIndexedInstruction(instructionsGuide, index),
			getNextInstruction: () => {
				instructionCount += 1
				return getIndexedInstruction(instructionsGuide, instructionCount)
			},
			getInstructionForAutomation: index => getIndexedInstruction(automationInstructionsGuide, index),
			getQuantityOfHelp: () => quickStartGuide.length - 1,
			getQuantityOfInstructions: () => instructionsGuide.length - 1
		}
	} catch (error) {
		// backup plan for failed JS loads
		// getInstruction = getHelp = i => ''
	}
}
