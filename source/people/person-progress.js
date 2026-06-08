import Achievements from "./person-achievements"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_SUSTAIN } from "./person-states.js"

const PLAYER_NOTE_EVENT_WINDOW = 5_000
const PLAYING_NOTE_STATES = new Set([
	STATE_INSTRUMENT_ATTACK,
	STATE_INSTRUMENT_PITCH_BEND,
	STATE_INSTRUMENT_SUSTAIN
])

/**
 * A way of tracking how somebodies interactions
 * went so that you can make charts and work out
 * if people are improving or getting worse
 * 
 * Melody variation
 * Melody Length
 * Emotions Experienced
 * Main emotion experienced
 * Emotional variety
 */
export default class PersonalProgress{

	#startAt = 0
	#engagedBefore = 0
	#isEngaged = false
	#achievements
	#expressions = new Set()
	#noteEvents = []
	#expressionEvents = []
	#uniqueNotes = new Set()
	#totalNotes = 0
	#lowestNoteNumber = Infinity
	#highestNoteNumber = -Infinity
	#highestNoteJump = 0
	#lastDirection = 0
	#directionStreak = 0
	#pitchBendEvents = 0
	#playerModeEntries = 0
	#singleNoteNumber = null
	#singleNoteStartedAt = 0
	#singleNoteDuration = 0

	// How long has this user been engaged with 
	get timeEngaged(){
		return this.getEngagedTime(this.getNow())
	}

	get quantityOfEmotions(){
		return this.#expressions.size
	}

	get achievementPoints(){
		return this.#achievements.score
	}

	// Quantity of points
	get score(){
		return this.quantityOfEmotions * this.timeEngaged
	}

	constructor(){
		this.#achievements = new Achievements()
		this.markStartTime()
	}

	getNow(){
		if (globalThis.performance?.now)
		{
			return globalThis.performance.now()
		}
		return Date.now()
	}

	getEngagedTime(now = this.getNow()){
		return this.#engagedBefore + (this.#isEngaged ? now - this.#startAt : 0)
	}

	getStats(now = this.getNow()){
		const recentNoteEvents = this.#noteEvents.filter(event => now - event.time <= 3_000)
		const recentExpressionEvents = this.#expressionEvents.filter(event => now - event.time <= 10_000)
		return {
			now,
			engagedTime:this.getEngagedTime(now),
			expressions:this.#expressions,
			expressionEvents:this.#expressionEvents,
			recentExpressionEvents,
			noteEvents:this.#noteEvents,
			recentNoteEvents,
			uniqueNotes:this.#uniqueNotes,
			totalNotes:this.#totalNotes,
			noteRange:this.#highestNoteNumber - this.#lowestNoteNumber,
			highestNoteJump:this.#highestNoteJump,
			lastDirection:this.#lastDirection,
			directionStreak:this.#directionStreak,
			pitchBendEvents:this.#pitchBendEvents,
			playerModeEntries:this.#playerModeEntries,
			singleNoteNumber:this.#singleNoteNumber,
			singleNoteDuration:this.#singleNoteDuration
		}
	}

	// When an emotion is experienced we check to see if
	// it has been experienced before
	experienceEmotion( emoticon ){
		const unlockedAchievements = this.trackExpression(emoticon)
		return unlockedAchievements.find(achievement => achievement.emoticon === emoticon) ?? false
	}

	trackExpression(emoticon, time = this.getNow()){
		this.#expressions.add(emoticon)
		this.#expressionEvents.push({emoticon, time})
		this.#expressionEvents = this.#expressionEvents.filter(event => time - event.time <= 10_000)
		return this.evaluateAchievements(time)
	}

	trackNote(noteNumber, state, time = this.getNow()){
		if (!Number.isFinite(noteNumber) || !PLAYING_NOTE_STATES.has(state))
		{
			this.#singleNoteNumber = null
			this.#singleNoteStartedAt = 0
			this.#singleNoteDuration = 0
			return []
		}

		const previousNoteNumber = this.#noteEvents[this.#noteEvents.length - 1]?.noteNumber
		const hasNoteChanged = previousNoteNumber !== noteNumber
		const isDuplicateFrame = !hasNoteChanged && this.#noteEvents[this.#noteEvents.length - 1]?.state === state
		if (!isDuplicateFrame)
		{
			this.#noteEvents.push({noteNumber, state, time})
			this.#uniqueNotes.add(noteNumber)
			this.#totalNotes++
			this.#lowestNoteNumber = Math.min(this.#lowestNoteNumber, noteNumber)
			this.#highestNoteNumber = Math.max(this.#highestNoteNumber, noteNumber)
			if (state === STATE_INSTRUMENT_PITCH_BEND)
			{
				this.#pitchBendEvents++
			}
			if (Number.isFinite(previousNoteNumber) && hasNoteChanged)
			{
				const jump = Math.abs(noteNumber - previousNoteNumber)
				const direction = Math.sign(noteNumber - previousNoteNumber)
				this.#highestNoteJump = Math.max(this.#highestNoteJump, jump)
				this.#directionStreak = direction === this.#lastDirection ? this.#directionStreak + 1 : 1
				this.#lastDirection = direction
			}
		}

		this.#noteEvents = this.#noteEvents.filter(event => time - event.time <= PLAYER_NOTE_EVENT_WINDOW)

		if (this.#singleNoteNumber !== noteNumber)
		{
			this.#singleNoteNumber = noteNumber
			this.#singleNoteStartedAt = time
			this.#singleNoteDuration = 0
		}else{
			this.#singleNoteDuration = time - this.#singleNoteStartedAt
		}

		return this.evaluateAchievements(time)
	}

	markStartTime(){
		this.#startAt = this.getNow()
	}

	startPlayerMode(now = this.getNow()){
		if (this.#isEngaged)
		{
			return []
		}
		this.#isEngaged = true
		this.#playerModeEntries++
		this.#startAt = now
		return this.evaluateAchievements(now)
	}

	stopPlayerMode(now = this.getNow()){
		if (!this.#isEngaged)
		{
			return []
		}
		this.#engagedBefore = this.getEngagedTime(now)
		this.#isEngaged = false
		return this.evaluateAchievements(now)
	}

	tick(now = this.getNow()){
		return this.evaluateAchievements(now)
	}

	evaluateAchievements(now = this.getNow()){
		return this.#achievements.evaluate(this.getStats(now))
	}

	// 
	reset(){
		this.markStartTime()
		this.#engagedBefore = 0
		this.#isEngaged = false
		this.#expressionEvents = []
		this.#expressions = new Set()
		this.#noteEvents = []
		this.#uniqueNotes = new Set()
		this.#totalNotes = 0
		this.#lowestNoteNumber = Infinity
		this.#highestNoteNumber = -Infinity
		this.#highestNoteJump = 0
		this.#lastDirection = 0
		this.#directionStreak = 0
		this.#pitchBendEvents = 0
		this.#playerModeEntries = 0
		this.#singleNoteNumber = null
		this.#singleNoteStartedAt = 0
		this.#singleNoteDuration = 0
		this.#achievements.reset()
	}
}
