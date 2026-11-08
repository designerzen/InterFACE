const ACTIVITY_METRICS = [
	'currentActivity', 'sessionActivity', 'peakActivity', 'activeDuration', 'activeRatio',
	'sessionDuration', 'sampleCount', 'currentPositionActivity', 'sessionPositionActivity',
	'currentOrientationActivity', 'sessionOrientationActivity', 'currentScaleActivity',
	'sessionScaleActivity', 'currentExpressionActivity', 'sessionExpressionActivity',
	'positionTravelled', 'orientationTravelled', 'scaleTravelled', 'expressionTravelled',
	'winks', 'leftWinks', 'rightWinks', 'blinks', 'mouthOpenings', 'expressionChanges',
	'notesPlayed', 'uniqueNotesPlayed', 'lowestNotePlayed', 'highestNotePlayed', 'noteRange'
]

const finite = value => Number.isFinite(value) ? value : 0

// Copy public values: activity uses private fields, and progress contains Sets.
export const createPersonReport = (person, date = new Date()) => {
	const progress = person.personalProgress
	const stats = progress?.getStats() ?? {}
	const activity = person.activity
	const unlocked = progress?.achievements?.unlocked ?? []
	const engagedTime = finite(stats.engagedTime)
	return {
		schemaVersion:1,
		exportedAt:date.toISOString(),
		player:{ id:person.id, name:person.displayName || `Player ${(person.playerNumber ?? 0) + 1}` },
		scope:'Current player session; points and achievements may include earlier sessions in this app run.',
		units:{ durations:'milliseconds', activity:'normalised 0–1', notes:'MIDI note numbers', noteRange:'semitones', travel:'accumulated normalised movement' },
		activity:Object.fromEntries(ACTIVITY_METRICS.map(key => [key,
			['lowestNotePlayed', 'highestNotePlayed'].includes(key) ? (activity?.[key] ?? null) : finite(activity?.[key])
		])),
		progress:{
			engagedTime, totalNotes:finite(stats.totalNotes), uniqueNotes:Array.from(stats.uniqueNotes ?? []),
			noteRange:finite(stats.noteRange), highestNoteJump:finite(stats.highestNoteJump),
			lastDirection:finite(stats.lastDirection), directionStreak:finite(stats.directionStreak),
			pitchBendEvents:finite(stats.pitchBendEvents), playerModeEntries:finite(stats.playerModeEntries),
			singleNoteNumber:stats.singleNoteNumber ?? null, singleNoteDuration:finite(stats.singleNoteDuration),
			expressions:Array.from(stats.expressions ?? []), achievementPoints:finite(progress?.achievementPoints)
		},
		analysis:{
			noteEventsPerMinute:engagedTime > 0 ? finite(stats.totalNotes) * 60_000 / engagedTime : null,
			expressionVariety:stats.expressions?.size ?? 0,
			unlockedAchievements:unlocked.length
		},
		achievements:unlocked.map(({id, title, description, type, score}) => ({id, title, description, type, score}))
	}
}

export const personReportRows = report => {
	const rows = []
	const visit = (value, path) => {
		if (value !== null && typeof value === 'object' && !Array.isArray(value))
			Object.entries(value).forEach(([key, child]) => visit(child, path ? `${path}.${key}` : key))
		else rows.push([path, Array.isArray(value) ? JSON.stringify(value) : value])
	}
	visit(report, '')
	return rows
}

export const personReportCSV = report => {
	const cell = value => {
		const text = String(value ?? '')
		// Quoting alone does not stop spreadsheet formula execution in player names.
		return `"${(typeof value === 'string' && /^[\s]*[=+@-]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`
	}
	return '\uFEFF' + [['metric', 'value'], ...personReportRows(report)].map(row => row.map(cell).join(',')).join('\r\n')
}
