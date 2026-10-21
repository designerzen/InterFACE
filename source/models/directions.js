import { fetchJSON } from '../utils/fetch.js'
import { readActiveGuide } from './guide-editor.js'
import DirectionsProgress from './directions-progress.js'

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
		points:Number.isFinite(points) ? Math.max(0, points) : fallbackPoints,
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
	let startedAt = now()
	const progress = options.progress ?? new DirectionsProgress()
	const anonymousPerson = {}
	let currentDirection = null
	let completionShown = false
	const getActiveDirections = () => getModeDirectionsForElapsedTime(modeDirections, (now() - startedAt) * 0.001)
	const allDirections = [...modeDirections.default, ...modeDirections.blocks.flatMap(block => block.directions)]
	const getCurrentDirection = () => {
		if (!currentDirection) return null
		const status = progress.getDirectionProgress(currentDirection.id)
		return {...currentDirection, progress:status,
			className:`${currentDirection.className ?? 'direction'}${status.completed ? status.complete ? ' direction-completed' : ' direction-partial' : ''}`}
	}
	const observe = (emoji, person) => {
		const personal = progress.getPersonProgress(person)
		if (!personal) return
		personal.observeExpression(emoji)
		for (const direction of allDirections) {
			if (direction.expectedEmojis.has(emoji)) {
				personal.complete(direction.id, {emoji, time:now(), prompted:false})
			}
		}
	}
	const setPeople = people => {
		progress.setPeople(people)
		for (const person of people) {
			for (const emoji of progress.getPersonProgress(person)?.getExperiencedExpressions() ?? []) observe(emoji, person)
		}
	}

	return {
		progress,
		setPeople,
		observeExpression:observe,
		getCurrentDirection,
		getNextDirection:(people = [anonymousPerson]) => {
			setPeople(people)
			const activeDirections = getActiveDirections()
			currentDirection = progress.next(activeDirections)
			if (currentDirection) {
				completionShown = false
				return getCurrentDirection()
			}
			if (!people.length || !activeDirections.length || completionShown) return null
			completionShown = true
			const complete = modeDirections.complete ?? directionsData?.complete
			return {id:'directions-complete', message:getCompletionMessage(complete) ?? 'All directions complete!',
				className:getFeedbackClass(complete), complete:true}
		},
		completeExpression:(emoji, person = anonymousPerson) => {
			const personal = progress.getPersonProgress(person)
			if (!personal || !progress.isActive(person)) return null
			const direction = currentDirection
			const reward = direction?.emojiRewards.get(emoji)
			const completed = reward && personal.complete(direction.id, {emoji, time:now(), points:reward.points})
			observe(emoji, person)
			if (!completed) return null
			return {directionId:direction.id, title:direction.title ?? direction.message, emoji,
				points:reward.points, message:reward.congratulation || direction.congratulation || '', person,
				progress:progress.getDirectionProgress(direction.id)}
		},
		getQuantityOfDirections:() => Math.max(1, getActiveDirections().length),
		getCompletedDirectionIds:() => new Set(allDirections.filter(direction => progress.getDirectionProgress(direction.id).complete).map(direction => direction.id)),
		getProgress:() => progress.getSnapshot(getActiveDirections()),
		resetPerson:person => {
			progress.resetPerson(person)
			completionShown = false
		},
		reset:() => {
			progress.reset()
			currentDirection = null
			completionShown = false
			startedAt = now()
		}
	}
}

export const getDirections = async (language = 'en', referer = '', options = {}) => {
	const customGuide = readActiveGuide()
	if (customGuide) return createDirections(customGuide.directions, options)
	const languages = [...new Set([language, 'en'])]
	const locations = [
		...(referer ? languages.map(locale => `./locales/${locale}/directions-${referer}.json`) : []),
		...languages.map(locale => `./locales/${locale}/directions.json`)
	]
	for (const location of locations) {
		const data = await fetchJSON(location)
		const mode = normaliseModeDirections(selectModeDirections(data, options.advancedMode ?? true), data?.groups ?? {})
		if (data && (mode.default.length || mode.blocks.some(block => block.directions.length))) {
			return createDirections(data, options)
		}
	}
	return null
}
