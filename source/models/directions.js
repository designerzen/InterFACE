import { fetchJSON } from '../utils/fetch.js'

const normaliseEmojiEntry = (entry, fallbackPoints = 0, fallbackCongratulation = '') => {
	if (typeof entry === 'string') {
		return {
			emoji:entry,
			points:fallbackPoints,
			congratulation:fallbackCongratulation
		}
	}

	if (!entry || typeof entry !== 'object' || typeof entry.emoji !== 'string') {
		return null
	}

	const points = Number(entry.points ?? fallbackPoints)
	return {
		emoji:entry.emoji,
		points:Number.isFinite(points) ? points : fallbackPoints,
		congratulation:entry.congratulation ?? fallbackCongratulation
	}
}

const normaliseEmojiEntries = (entries, fallbackPoints = 0, fallbackCongratulation = '') => {
	const list = Array.isArray(entries) ? entries : [entries]
	return list
		.map(entry => normaliseEmojiEntry(entry, fallbackPoints, fallbackCongratulation))
		.filter(Boolean)
}

const mergeEmojiEntries = entries => {
	const byEmoji = new Map()

	entries.forEach(entry => {
		const existing = byEmoji.get(entry.emoji)
		if (!existing || entry.points > existing.points) {
			byEmoji.set(entry.emoji, entry)
		}
	})

	return Array.from(byEmoji.values())
}

const getGroupEntries = (groups, groupNames = [], fallbackPoints = 0, fallbackCongratulation = '') => {
	const names = Array.isArray(groupNames) ? groupNames : [groupNames]
	return names.flatMap(groupName => {
		if (typeof groupName !== 'string') {
			return []
		}

		return normaliseEmojiEntries(groups[groupName] ?? [], fallbackPoints, fallbackCongratulation)
	})
}

const getFeedbackClass = data => {
	if (!data || typeof data !== 'object') {
		return null
	}

	return data.className ?? data.cssClass ?? data.class ?? (data.icon ? `direction direction-${data.icon}` : null)
}

const normaliseDirection = (direction, groups = {}) => {
	if (!direction || typeof direction !== 'object' || !direction.id || !direction.message) {
		return null
	}

	const expects = direction.expects ?? {}
	const points = Number(direction.points ?? 0)
	const fallbackPoints = Number.isFinite(points) ? points : 0
	const fallbackCongratulation = direction.congratulation ?? ''
	const entries = mergeEmojiEntries([
		...normaliseEmojiEntries(expects.emoji ?? [], fallbackPoints, fallbackCongratulation),
		...getGroupEntries(groups, expects.group ?? [], fallbackPoints, fallbackCongratulation),
		...getGroupEntries(groups, expects.groups ?? [], fallbackPoints, fallbackCongratulation)
	])

	if (expects.type !== 'expression' || entries.length === 0) {
		return null
	}

	return {
		...direction,
		className:getFeedbackClass(direction),
		expects:{
			...expects,
			type:'expression'
		},
		expectedEmojis:new Set(entries.map(entry => entry.emoji)),
		emojiRewards:new Map(entries.map(entry => [entry.emoji, entry]))
	}
}

const normaliseDirections = (directions = [], groups = {}) => {
	return (Array.isArray(directions) ? directions : [])
		.map(direction => normaliseDirection(direction, groups))
		.filter(Boolean)
}

const normaliseModeDirections = (modeDirections, groups = {}) => {
	if (Array.isArray(modeDirections)) {
		return {
			default:normaliseDirections(modeDirections, groups),
			blocks:[],
			complete:null
		}
	}

	if (!modeDirections || typeof modeDirections !== 'object') {
		return {
			default:[],
			blocks:[],
			complete:null
		}
	}

	return {
		default:normaliseDirections(modeDirections.default, groups),
		blocks:Array.isArray(modeDirections.blocks) ? modeDirections.blocks.map(block => ({
			...block,
			directions:normaliseDirections(block.directions ?? block.instructions, groups)
		})) : [],
		complete:modeDirections.complete ?? null
	}
}

const selectModeDirections = (directionsData, advancedMode) => {
	if (Array.isArray(directionsData)) {
		return directionsData
	}

	if (!directionsData || typeof directionsData !== 'object') {
		return []
	}

	const preferredMode = advancedMode ? 'advanced' : 'basic'
	const fallbackMode = advancedMode ? 'basic' : 'advanced'
	return directionsData[preferredMode] ?? directionsData[fallbackMode] ?? []
}

const getModeDirectionsForElapsedTime = (modeDirections, elapsedSeconds) => {
	const activeBlock = modeDirections.blocks.find(block => {
		if (!block || typeof block !== 'object') {
			return false
		}

		const from = Number(block.from ?? 0)
		const duration = Number(block.for ?? 0)
		return Number.isFinite(from) && Number.isFinite(duration) && elapsedSeconds >= from && elapsedSeconds < from + duration
	})

	return activeBlock?.directions?.length ? activeBlock.directions : modeDirections.default
}

const getPeopleExpressions = people => {
	return new Set((people ?? []).flatMap(person => person?.getExperiencedExpressions?.() ?? []))
}

const getCompletionMessage = completionData => {
	if (typeof completionData === 'string') {
		return completionData
	}

	if (completionData && typeof completionData === 'object') {
		return completionData.message ?? null
	}

	return null
}

export const createDirections = (directionsData, options = {}) => {
	const {
		advancedMode = true,
		now = () => performance.now()
	} = options
	const groups = directionsData?.groups ?? {}
	const selectedDirections = selectModeDirections(directionsData, advancedMode)
	const modeDirections = normaliseModeDirections(selectedDirections, groups)
	const startedAt = now()
	const completedDirectionIds = new Set()
	const defaultCompletion = directionsData?.complete ?? null
	let directionIndex = 0
	let currentDirection = null
	let completionMessageShownFor = null

	const getElapsedSeconds = () => (now() - startedAt) * 0.001
	const getActiveDirections = () => getModeDirectionsForElapsedTime(modeDirections, getElapsedSeconds())
	const resetDirectionCycle = () => {
		completedDirectionIds.clear()
		currentDirection = null
		directionIndex = 0
	}
	const isDirectionCompletedByPeople = (direction, people) => {
		const expressions = getPeopleExpressions(people)
		return Array.from(direction.expectedEmojis).some(emoji => expressions.has(emoji))
	}

	const isDirectionAvailable = (direction, people) =>
		!completedDirectionIds.has(direction.id) && !isDirectionCompletedByPeople(direction, people)

	const getCompletionSignature = (activeDirections, people) => {
		const expressions = Array.from(getPeopleExpressions(people)).sort().join(',')
		const directionIds = activeDirections.map(direction => direction.id).sort().join(',')
		return `${directionIds}|${expressions}`
	}

	const getCompletedMessageDirection = (activeDirections, people) => {
		if (activeDirections.length === 0) {
			return null
		}

		const completionMessage = getCompletionMessage(modeDirections.complete) ?? getCompletionMessage(defaultCompletion)
		const completionClassName = getFeedbackClass(modeDirections.complete) ?? getFeedbackClass(defaultCompletion)
		if (!completionMessage) {
			return null
		}

		const hasCompletedAllDirections = activeDirections.every(direction =>
			completedDirectionIds.has(direction.id) || isDirectionCompletedByPeople(direction, people)
		)
		if (!hasCompletedAllDirections) {
			return null
		}

		const completionSignature = getCompletionSignature(activeDirections, people)
		if (completionSignature === completionMessageShownFor) {
			return null
		}

		completionMessageShownFor = completionSignature
		resetDirectionCycle()
		return {
			id:'directions-complete',
			message:completionMessage,
			className:completionClassName,
			complete:true
		}
	}

	const createCompletion = (direction, emoji, person) => {
		const reward = direction.emojiRewards.get(emoji)
		if (!reward) {
			return null
		}

		completedDirectionIds.add(direction.id)
		return {
			directionId:direction.id,
			title:direction.title ?? direction.message,
			emoji,
			points:reward.points,
			message:reward.congratulation || direction.congratulation || '',
			person
		}
	}

	return {
		getNextDirection:(people = []) => {
			const activeDirections = getActiveDirections()
			const availableDirections = activeDirections.filter(direction => isDirectionAvailable(direction, people))
			if (availableDirections.length === 0) {
				currentDirection = null
				return getCompletedMessageDirection(activeDirections, people)
			}

			currentDirection = availableDirections[directionIndex % availableDirections.length]
			directionIndex += 1
			return currentDirection
		},
		completeExpression:(emoji, person = null) => {
			if (currentDirection && !completedDirectionIds.has(currentDirection.id) && currentDirection.expectedEmojis.has(emoji)) {
				return createCompletion(currentDirection, emoji, person)
			}

			const direction = getActiveDirections().find(candidate =>
				!completedDirectionIds.has(candidate.id) && candidate.expectedEmojis.has(emoji)
			)
			return direction ? createCompletion(direction, emoji, person) : null
		},
		getQuantityOfDirections:() => Math.max(1, getActiveDirections().length),
		getCompletedDirectionIds:() => new Set(completedDirectionIds),
		reset:resetDirectionCycle
	}
}

export const getDirections = async (language = 'en', referer = '', options = {}) => {
	if (!referer.length) {
		return null
	}

	const directionsLocation = `./locales/${language}/directions-${referer}.json`
	const directionsData = await fetchJSON(directionsLocation)
	return directionsData ? createDirections(directionsData, options) : null
}
