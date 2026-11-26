import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getInstructions } from '../source/models/instructions.js'

const instructionsPath = join(process.cwd(), 'static', 'locales', 'en', 'instructions.json')

describe('default instructions', () => {
	let instructionsData

	beforeAll(async () => {
		instructionsData = JSON.parse(await readFile(instructionsPath, 'utf8'))
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('teach drum performance mode in both interface modes', () => {
		for (const mode of ['basic', 'advanced']) {
			const guide = instructionsData[mode].default.join(' ')
			expect(guide).toContain('Turn on Beats')
			expect(guide).toContain('Drum Pattern')
			expect(guide).toContain('Turn on Performance')
			expect(guide).toContain('Turn Performance off')
		}
		const advanced = instructionsData.advanced.default.join(' ')
		expect(advanced).toContain('Crescendo Build')
		expect(advanced).toContain('Snare Roll Build')
	})

	test('loads the JSON guide for the normal app while preserving quick start help', async () => {
		global.fetch = jest.fn(async () => ({
			headers:{ get:() => 'application/json' },
			json:async () => instructionsData,
			ok:true,
		}))

		const instructions = await getInstructions('en', '', { advancedMode:true })

		expect(global.fetch).toHaveBeenCalledWith('./locales/en/instructions.json', {})
		const drumInstruction = instructionsData.advanced.default.find(line => line.includes('Turn on Beats'))
		expect(drumInstruction).toBeDefined()
		expect(instructions.getInstruction(instructionsData.advanced.default.indexOf(drumInstruction))).toBe(drumInstruction)
		expect(instructions.getHelp(0)).toBe(instructionsData.quickStart[0])
		expect(instructions.getQuantityOfInstructions()).toBe(instructionsData.advanced.default.length)
	})
})
