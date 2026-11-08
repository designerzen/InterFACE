import * as expressions from './emoji.js'

const knownExpressions = new Set(Object.values(expressions).filter(value => typeof value === 'string'))
export const DRAFT_KEY = 'photosynth.guide.draft.v1'
export const ACTIVE_KEY = 'photosynth.guide.active.v1'
export const MODES = ['basic', 'advanced']

const clone = value => JSON.parse(JSON.stringify(value))
const text = value => typeof value === 'string' && value.trim().length > 0
const modeData = (value, kind) => {
	if (Array.isArray(value)) value = {default:value, blocks:[]}
	if (value != null && (typeof value !== 'object' || Array.isArray(value))) throw new Error('Guide modes must contain a default list and optional timed stages.')
	const mode = clone(value ?? {default:[], blocks:[]})
	mode.default ??= []
	mode.blocks ??= []
	if (!Array.isArray(mode.default) || !Array.isArray(mode.blocks)) throw new Error('Guide modes must contain lists of messages and stages.')
	if (kind === 'directions') mode.blocks.forEach(block => {
		if (!block || typeof block !== 'object') throw new Error('Each timed stage must be an object.')
		block.directions ??= block.instructions ?? []
		delete block.instructions
	})
	for (const stage of [{[kind]:mode.default}, ...mode.blocks]) {
		if (!stage || typeof stage !== 'object' || !Array.isArray(stage[kind])) throw new Error('Each stage must contain a list of messages.')
		if (stage[kind].some(item => kind === 'instructions' ? typeof item !== 'string' : !item || typeof item !== 'object' || Array.isArray(item))) throw new Error(`Invalid ${kind} in this file.`)
		if (kind === 'directions') stage[kind].forEach(item => {
				item.points ??= 0
			for (const field of ['id','title','message','hint','encouragement','congratulation','retryMessage']) {
				if (item[field] != null && typeof item[field] !== 'string') throw new Error(`Direction ${field} must be text.`)
			}
			if (item.expects?.emoji != null && (!Array.isArray(item.expects.emoji) || item.expects.emoji.some(entry => typeof entry !== 'string' && !text(entry?.emoji)))) throw new Error('Expressions must be a list of emojis.')
		})
	}
	return mode
}

export const normaliseGuideFile = (data, kind) => {
	if (!data || typeof data !== 'object') throw new Error('Choose a valid JSON guide.')
	const result = Array.isArray(data) ? {} : clone(data)
	for (const mode of MODES) result[mode] = modeData(Array.isArray(data) ? data : data[mode] ?? data[mode === 'basic' ? 'advanced' : 'basic'], kind)
	if (kind === 'instructions') {
		result.quickStart ??= []
		if (!Array.isArray(result.quickStart) || result.quickStart.some(line => typeof line !== 'string')) throw new Error('Quick start must contain text lines.')
	}
	return result
}

export const createGuideProject = () => ({
	version:1, name:'My guide',
	instructions:{basic:{default:[], blocks:[]}, advanced:{default:[], blocks:[]}, quickStart:[]},
	directions:{basic:{default:[], blocks:[]}, advanced:{default:[], blocks:[]}, complete:{message:'All directions complete!'}}
})

export const importGuideProject = (data, current = createGuideProject()) => {
	const project = clone(current)
	if (data?.instructions && data?.directions) {
		project.name = typeof data.name === 'string' ? data.name : project.name
		project.instructions = normaliseGuideFile(data.instructions, 'instructions')
		project.directions = normaliseGuideFile(data.directions, 'directions')
	} else {
		const mode = Array.isArray(data) ? data : data?.basic ?? data?.advanced
		const items = Array.isArray(mode) ? mode : mode?.default?.length ? mode.default : mode?.blocks?.flatMap(block => block.directions ?? block.instructions ?? []) ?? mode?.default
		if (!Array.isArray(items)) throw new Error('This file does not contain instructions or directions.')
		const kind = items.some(item => item && typeof item === 'object') || data?.groups || data?.complete ? 'directions' : 'instructions'
		project[kind] = normaliseGuideFile(data, kind)
	}
	return project
}

export const validateGuideProject = project => {
	const errors = []
	if (!text(project.name)) errors.push('Give your guide a name in step 1.')
	if (!Array.isArray(project.instructions?.quickStart) || project.instructions.quickStart.some(line => typeof line !== 'string')) errors.push('Quick start must contain text lines.')
	for (const kind of ['instructions', 'directions']) {
		for (const mode of MODES) {
			const value = project[kind]?.[mode]
			const label = `${mode} ${kind}`
			if (!value || !Array.isArray(value.default) || !Array.isArray(value.blocks)) {
				errors.push(`Invalid ${label}.`)
				continue
			}
			const ids = new Set()
			const stages = [{[kind]:value.default}, ...value.blocks]
			if (!stages.some(stage => stage[kind]?.length)) errors.push(`Add at least one item to ${label}.`)
			stages.forEach((stage, index) => {
				if (index && (!Number.isFinite(stage.from) || stage.from < 0 || !Number.isFinite(stage.for) || stage.for <= 0)) errors.push(`Set a start of 0 or more and a duration greater than 0 for ${label}, stage ${index}.`)
				if (!Array.isArray(stage[kind])) { errors.push(`Invalid items in ${label}.`); return }
				stage[kind].forEach((item, i) => {
					const at = `${label}, ${index ? `stage ${index}` : 'default'}, item ${i + 1}`
					if (kind === 'instructions') {
						if (typeof item !== 'string' || !item.trim()) errors.push(`Write a message for ${at}.`)
						return
					}
					if (!item || typeof item !== 'object') { errors.push(`Invalid direction in ${at}.`); return }
					if (!text(item.id) || ids.has(item.id)) errors.push(`Use a unique ID for ${at}.`)
					ids.add(item.id)
					if (!text(item.message)) errors.push(`Write a message for ${at}.`)
					if (!Number.isFinite(item.points) || item.points < 0) errors.push(`Points must be 0 or more for ${at}.`)
					const expects = item.expects
					const groups = [expects?.group ?? [], expects?.groups ?? []].flat()
					const entries = [...(Array.isArray(expects?.emoji) ? expects.emoji : []), ...groups.flatMap(group => project.directions.groups?.[group] ?? [])]
					if (expects?.type !== 'expression' || !entries.length) errors.push(`Choose an expression for ${at}.`)
					if (entries.some(entry => !knownExpressions.has(typeof entry === 'string' ? entry : entry?.emoji))) errors.push(`Use recognised PhotoSYNTH expressions for ${at}.`)
				})
			})
		}
	}
	return errors
}

export const readActiveGuide = () => {
	try {
		const data = JSON.parse(globalThis.localStorage?.getItem(ACTIVE_KEY) ?? 'null')
		return data && validateGuideProject(data).length === 0 ? data : null
	} catch { return null }
}
