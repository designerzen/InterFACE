// TODO: load appropriate language...
import { QUICK_START, INSTRUCTIONS, INSTRUCTION_FOR_AUTOMATION } from '../locales/en_GB.js'
import { fetchJSON } from '../utils/fetch.js'

const normaliseGuide = (guide = []) => {
	const instructions = Array.isArray(guide) ? [...guide] : []

	while (instructions.length > 0 && instructions[instructions.length - 1] === '') {
		instructions.pop()
	}

	return instructions
}

const getIndexedInstruction = (guide, index) => {
	if (!guide.length) {
		return ''
	}

	return guide[index % guide.length]
}

const normaliseModeInstructions = modeInstructions => {
	if (Array.isArray(modeInstructions)) {
		return {
			default: normaliseGuide(modeInstructions),
			blocks: []
		}
	}

	if (!modeInstructions || typeof modeInstructions !== 'object') {
		return {
			default: [],
			blocks: []
		}
	}

	return {
		default: normaliseGuide(modeInstructions.default),
		blocks: Array.isArray(modeInstructions.blocks) ? modeInstructions.blocks : []
	}
}

const getModeInstructionsForElapsedTime = (modeInstructions, elapsedSeconds) => {
	const { default: defaultInstructions, blocks } = normaliseModeInstructions(modeInstructions)
	const activeBlock = blocks.find(block => {
		if (!block || typeof block !== 'object') {
			return false
		}

		const from = Number(block.from ?? 0)
		const duration = Number(block.for ?? 0)
		const to = from + duration

		return Number.isFinite(from) && Number.isFinite(duration) && elapsedSeconds >= from && elapsedSeconds < to
	})

	if (!activeBlock) {
		return defaultInstructions
	}

	const blockInstructions = normaliseGuide(activeBlock.instructions)
	return blockInstructions.length ? blockInstructions : defaultInstructions
}

const selectModeInstructions = (instructionsData, advancedMode) => {
	if (Array.isArray(instructionsData)) {
		return instructionsData
	}

	if (!instructionsData || typeof instructionsData !== 'object') {
		return []
	}

	const preferredMode = advancedMode ? 'advanced' : 'basic'
	const fallbackMode = advancedMode ? 'basic' : 'advanced'
	return instructionsData[preferredMode] ?? instructionsData[fallbackMode] ?? []
}

export const getInstructions = async (language = 'en', referer = '', options = {}) => {
	const { advancedMode = true } = options

	let quickStartModeInstructions = {
		default: normaliseGuide(QUICK_START),
		blocks: []
	}
	let instructionModeInstructions = {
		default: normaliseGuide(INSTRUCTIONS),
		blocks: []
	}
	let automationModeInstructions = {
		default: normaliseGuide(INSTRUCTION_FOR_AUTOMATION),
		blocks: []
	}

	try {
		if (referer.length) {
			const instructionLocation = `./locales/${language}/instructions${referer ? `-${referer}` : ''}.json`
			const instructionsData = await fetchJSON(instructionLocation)
			const modeInstructions = selectModeInstructions(instructionsData, advancedMode)
			const normalisedModeInstructions = normaliseModeInstructions(modeInstructions)

			if (normalisedModeInstructions.default.length || normalisedModeInstructions.blocks.length) {
				quickStartModeInstructions = normalisedModeInstructions
				instructionModeInstructions = normalisedModeInstructions
				automationModeInstructions = normalisedModeInstructions
			}
		}

		const startedAt = performance.now()
		const getElapsedSeconds = () => (performance.now() - startedAt) * 0.001
		let instructionCount = 0

		const getActiveGuide = modeInstructions =>
			getModeInstructionsForElapsedTime(modeInstructions, getElapsedSeconds())

		return {
			getHelp: index => getIndexedInstruction(getActiveGuide(quickStartModeInstructions), index),
			getInstruction: index => getIndexedInstruction(getActiveGuide(instructionModeInstructions), index),
			getNextInstruction: () => {
				instructionCount += 1
				return getIndexedInstruction(getActiveGuide(instructionModeInstructions), instructionCount)
			},
			getInstructionForAutomation: index =>
				getIndexedInstruction(getActiveGuide(automationModeInstructions), index),
			getQuantityOfHelp: () => Math.max(1, getActiveGuide(quickStartModeInstructions).length),
			getQuantityOfInstructions: () => Math.max(1, getActiveGuide(instructionModeInstructions).length)
		}
	} catch (error) {
		// backup plan for failed JS loads
		// getInstruction = getHelp = i => ''
	}
}
