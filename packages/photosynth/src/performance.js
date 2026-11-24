import { getMusicalDetailsFromEmoji } from './models/emoji-to-music.js'
import {
	STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_SUSTAIN, STATE_INSTRUMENT_PITCH_BEND,
	STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_RELEASE
} from './people/person-states.js'

/** Musical decisions only. Events use normalized velocity and monotonic milliseconds. */
export const planPersonPerformance = (person, { chord = false, repeat = false, time = 0 } = {}) => {
	const events = []
	const base = {
		source: person.id ?? `person-${person.playerNumber ?? 0}`,
		performer: person.playerNumber ?? 0,
		channel: person.options?.channel ?? 1,
		time,
		velocity: person.noteVelocity
	}
	const add = (type, data = {}) => events.push({ ...base, type, ...data })
	const changed = chord && person.activeChordEmoticon !== undefined && person.activeChordEmoticon !== person.playingEmoticon
	const refresh = changed && [STATE_INSTRUMENT_SUSTAIN, STATE_INSTRUMENT_PITCH_BEND].includes(person.state)
	let notes = person.activeNotes.get(person.noteNumber) ?? []
	switch (refresh ? STATE_INSTRUMENT_ATTACK : person.state) {
		case STATE_INSTRUMENT_ATTACK: {
			if (chord) {
				const previousChord = person.activeNotes.get(person.lastNoteNumber) ?? Array.from(person.activeNotes.values()).at(-1) ?? []
				notes = getMusicalDetailsFromEmoji(person.noteNumber, person.playingEmoticon, true, { ...person.options, previousChord }).map(note => ({ ...note }))
				add('allNotesOff')
				add('chordOn', { notes })
				person.activeNotes.clear()
				person.activeChordEmoticon = person.playingEmoticon
			} else {
				if (person.lastNoteNumber >= 0) add('noteOff', { note: person.lastNoteNumber, velocity: 1, previous: true })
				notes = [person.noteNumber]
				add('noteOn', { note: person.noteNumber })
				person.activeNotes.clear()
			}
			person.activeNotes.set(person.noteNumber, notes)
			break
		}
		case STATE_INSTRUMENT_SUSTAIN:
		case STATE_INSTRUMENT_PITCH_BEND:
			if (notes.length && repeat && person.singing && person.noteVelocity > 0) {
				add(chord ? 'chordRetrigger' : 'retrigger', chord ? { notes } : { note: person.noteNumber })
			}
			break
		case STATE_INSTRUMENT_DECAY:
		case STATE_INSTRUMENT_RELEASE:
			break
		default:
			if (notes.length) {
				person.activeNotes.delete(person.noteNumber)
				add(chord ? 'chordOff' : 'noteOff', chord ? { notes } : { note: person.noteNumber })
			}
	}
	return { events, notes }
}

/** Expand grouped chord intent for hosts whose inputs accept individual notes. */
export const expandMusicEvent = event => {
	if (!['chordOn', 'chordOff', 'chordRetrigger'].includes(event.type)) return [event]
	const type = event.type === 'chordOff' ? 'noteOff' : event.type === 'chordRetrigger' ? 'retrigger' : 'noteOn'
	return event.notes.map(value => ({
		...event, type, notes: undefined,
		note: typeof value === 'number' ? value : value.noteNumber
	}))
}
