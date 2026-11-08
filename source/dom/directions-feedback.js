import {getDirectionPlayerLabel} from '../models/directions-session.js'

const escapeText = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const getDirectionFeedbackMessage = snapshot => {
	if (!snapshot || snapshot.phase === 'paused' || snapshot.phase === 'waiting') return ''
	if (snapshot.responses.length) {
		return snapshot.responses.map(response => {
			const points = response.points > 0 ? ` +${response.points} ${response.points === 1 ? 'point' : 'points'}!` : ''
			return `${getDirectionPlayerLabel(response.person)}: ${response.message || 'Well done!'}${points}`
		}).concat(snapshot.encouragement).join('\n')
	}
	if (snapshot.phase === 'retry' || snapshot.supporting) return snapshot.encouragement
	if (snapshot.phase === 'finished') return snapshot.direction?.message || snapshot.encouragement
	const pending = snapshot.direction?.progress?.pendingPeople ?? []
	const target = snapshot.direction?.progress?.completedPeople.length && pending.length
		? `${pending.map(getDirectionPlayerLabel).join(', ')}: ` : ''
	return target + (snapshot.direction?.message ?? '')
}

// Uses the existing feedback surface, including its styling, speech and expiry.
export const createDirectionsFeedback = (setFeedback, ownsFeedback) => ({
	render(snapshot) {
		const message = getDirectionFeedbackMessage(snapshot)
		if (!message || (setFeedback() && !ownsFeedback())) return false
		setFeedback(escapeText(message), 2, 'none', true, true)
		return true
	}
})
