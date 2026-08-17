const SPACE = ""

export const ACHIEVEMENT_MESSAGE_DURATION = 3500

export const getRecentAchievementLabel = (
	recentAchievement,
	recentAchievementAt,
	now,
	duration=ACHIEVEMENT_MESSAGE_DURATION
) => {
	const hasRecentAchievement = recentAchievement && now - recentAchievementAt < duration
	if (!hasRecentAchievement)
	{
		return null
	}

	const { achievement, emoticon } = recentAchievement
	return {
		title:`+${achievement.score} ${achievement.title}`,
		style:achievement.message ?? emoticon ?? ""
	}
}

export const PERSON_TEXT_SWITCH_INSTRUMENT = [
						SPACE + '     SWITCH',
						SPACE + 'INSTRUMENT',
						SPACE + 'TAP  : RANDOM',
						SPACE + 'HOLD : SHOW ALL'
					]


export const PERSON_TEXT_ = [
						SPACE + '     SWITCH',
						SPACE + 'INSTRUMENT',
						SPACE + 'TAP  : RANDOM',
						SPACE + 'HOLD : SHOW ALL'
					]

export const PERSON_TEXT_CHANGE_INSTRUMENT = [
					SPACE + '  CHANGE',
					SPACE + 'INSTRUMENT',
					SPACE + 'TAP  : RANDOM',
					SPACE + 'HOLD : CHOOSE'
				]
