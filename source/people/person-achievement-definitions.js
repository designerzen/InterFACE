import expressionAchievements from "./achievements.json"

const createExpressionAchievement = ([emoticon, achievement]) => ({
	id: `expression:${emoticon}`,
	type: "expression",
	emoticon,
	...achievement,
	test: stats => stats.expressions.has(emoticon)
})

export const EXPRESSION_ACHIEVEMENTS = Object.entries(expressionAchievements).map(createExpressionAchievement)

export const REWARD_ACHIEVEMENTS = [
	{
		id: "engaged:1-minute",
		type: "engagement",
		title: "Warmed Up",
		description: "Stay active in Player mode for 1 minute",
		message: "You are in the groove!",
		score: 20,
		test: stats => stats.engagedTime >= 60_000
	},
	{
		id: "engaged:3-minutes",
		type: "engagement",
		title: "Locked In",
		description: "Stay active in Player mode for 3 minutes",
		message: "Now it is becoming a performance.",
		score: 45,
		test: stats => stats.engagedTime >= 180_000
	},
	{
		id: "engaged:5-minutes",
		type: "engagement",
		title: "Stage Presence",
		description: "Stay active in Player mode for 5 minutes",
		message: "You owned the stage for five minutes.",
		score: 75,
		test: stats => stats.engagedTime >= 300_000
	},
	{
		id: "engaged:10-minutes",
		type: "engagement",
		title: "Marathon Performer",
		description: "Stay active in Player mode for 10 minutes",
		message: "That is a proper set.",
		score: 150,
		test: stats => stats.engagedTime >= 600_000
	},
	{
		id: "engaged:return-player",
		type: "engagement",
		title: "Encore",
		description: "Return to Player mode after leaving it",
		message: "Back on stage. The crowd noticed.",
		score: 25,
		test: stats => stats.playerModeEntries >= 2
	},
	{
		id: "expressions:3",
		type: "expression-count",
		title: "Face Explorer",
		description: "Unlock 3 different expressions",
		message: "Three faces, one fearless performer.",
		score: 25,
		test: stats => stats.expressions.size >= 3
	},
	{
		id: "expressions:5",
		type: "expression-count",
		title: "Mood Ring",
		description: "Unlock 5 different expressions",
		message: "Your face is becoming an instrument.",
		score: 50,
		test: stats => stats.expressions.size >= 5
	},
	{
		id: "expressions:10",
		type: "expression-count",
		title: "Expression Collector",
		description: "Unlock 10 different expressions",
		message: "A whole gallery of feelings.",
		score: 100,
		test: stats => stats.expressions.size >= 10
	},
	{
		id: "expressions:burst-4",
		type: "expression-count",
		title: "Mask Juggler",
		description: "Make 4 different expressions within 10 seconds",
		message: "A costume change for every beat.",
		score: 65,
		test: stats => new Set(stats.recentExpressionEvents.map(event => event.emoticon)).size >= 4
	},
	{
		id: "note:first",
		type: "note",
		title: "First Sound",
		description: "Play your first note in Player mode",
		message: "And so the song begins.",
		score: 10,
		test: stats => stats.noteEvents.length >= 1
	},
	{
		id: "note:variety-5",
		type: "note",
		title: "Scale Scout",
		description: "Play 5 different notes",
		message: "You are exploring the keyboard.",
		score: 35,
		test: stats => stats.uniqueNotes.size >= 5
	},
	{
		id: "note:variety-8",
		type: "note",
		title: "Keyboard Tourist",
		description: "Play 8 different notes",
		message: "You are visiting every neighbourhood.",
		score: 70,
		test: stats => stats.uniqueNotes.size >= 8
	},
	{
		id: "note:total-25",
		type: "note",
		title: "Spark Plug",
		description: "Play 25 notes",
		message: "The engine is properly running now.",
		score: 60,
		test: stats => stats.totalNotes >= 25
	},
	{
		id: "note:total-100",
		type: "note",
		title: "Hundred Note Hero",
		description: "Play 100 notes",
		message: "That is not noodling. That is lore.",
		score: 180,
		test: stats => stats.totalNotes >= 100
	},
	{
		id: "note:fast-5",
		type: "note",
		title: "Quick Fingers",
		description: "Play 5 notes within 3 seconds",
		message: "That was a burst of energy!",
		score: 40,
		test: stats => stats.recentNoteEvents.length >= 5
	},
	{
		id: "note:fast-10",
		type: "note",
		title: "Rapid Fire",
		description: "Play 10 notes within 5 seconds",
		message: "Your timing is on fire.",
		score: 80,
		test: stats => stats.noteEvents.filter(event => stats.now - event.time <= 5_000).length >= 10
	},
	{
		id: "note:run-up-4",
		type: "note",
		title: "Staircase Sprint",
		description: "Play 4 rising notes in a row",
		message: "Up, up, and away.",
		score: 55,
		test: stats => stats.lastDirection > 0 && stats.directionStreak >= 3
	},
	{
		id: "note:run-down-4",
		type: "note",
		title: "Bass Basement",
		description: "Play 4 falling notes in a row",
		message: "Down where the floorboards shake.",
		score: 55,
		test: stats => stats.lastDirection < 0 && stats.directionStreak >= 3
	},
	{
		id: "note:range-octave",
		type: "note",
		title: "Octave Tourist",
		description: "Cover an octave of pitch range",
		message: "You stretched the map.",
		score: 75,
		test: stats => stats.noteRange >= 12
	},
	{
		id: "note:leap-octave",
		type: "note",
		title: "Rocket Jump",
		description: "Leap an octave or more between notes",
		message: "Gravity briefly gave up.",
		score: 90,
		test: stats => stats.highestNoteJump >= 12
	},
	{
		id: "note:pitch-bend-3",
		type: "note",
		title: "Rubber Note",
		description: "Use pitch bend 3 times",
		message: "The notes are learning yoga.",
		score: 45,
		test: stats => stats.pitchBendEvents >= 3
	},
	{
		id: "note:single-3-seconds",
		type: "note",
		title: "One Note Wonder",
		description: "Hold one note for 3 seconds",
		message: "Sometimes one note is enough.",
		score: 35,
		test: stats => stats.singleNoteDuration >= 3_000
	},
	{
		id: "note:single-6-seconds",
		type: "note",
		title: "Drone Master",
		description: "Hold one note for 6 seconds",
		message: "Hypnotic. Steady. Powerful.",
		score: 70,
		test: stats => stats.singleNoteDuration >= 6_000
	}
]

export const ACHIEVEMENT_DEFINITIONS = [
	...EXPRESSION_ACHIEVEMENTS,
	...REWARD_ACHIEVEMENTS
]
