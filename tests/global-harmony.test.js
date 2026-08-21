import { getChromaticIntervalsForEmoji, getDiatonicChordInKey, getMusicalDetailsFromEmoji, getPrimaryIntervalsForEmoji } from '../source/models/emoji-to-music.js'
import { getKeyScaleNotes, getPitchClassForKey, getScaleFormula, normaliseKeyName } from '../source/audio/tuning/keys.js'
import { HARMONY_MODE_FREE_RANGE, HARMONY_MODE_GLOBAL_KEY, PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS, PERSON_TYPE_DATA, PERSON_TYPE_HARP, PERSON_TYPE_HARP_CIRCLE_OF_FIFTHS, configurePersonByOperatingMode, normalisePersonOperatingMode } from '../source/people/person.presets.js'
import { POINTS_OVERRIDE_INHERIT, POINTS_OVERRIDE_OFF, POINTS_OVERRIDE_ON, resolvePointsEnabled } from '../source/settings/options.people.js'
import { CHROMATIC_SCALE, INTERVAL_LIBRARY, MAJOR_SCALE, NATURAL_MINOR_SCALE } from '../source/audio/tuning/scales.js'
import * as EMOJIS from '../source/models/emoji.js'
import { EMOJI_ANGRY, EMOJI_HEARTS, EMOJI_NEUTRAL, EMOJI_OPEN_MOUTH, EMOJI_SLEEPING } from '../source/models/emoji.js'
import { readFileSync } from 'fs'
import PersonalProgress from '../source/people/person-progress.js'
import { ACHIEVEMENT_MESSAGE_DURATION, getRecentAchievementLabel } from '../source/people/person-text.js'
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from '../source/people/person-states.js'

const noteNumbers = chord => chord.map(note => note.noteNumber)
const noteNames = chord => chord.map(note => note.noteName)

describe('global harmony helpers', () => {
	test('normalises numeric and named keys to pitch classes', () => {
		expect(normaliseKeyName(0)).toBe('C')
		expect(normaliseKeyName(10)).toBe('Bb')
		expect(normaliseKeyName('F#4')).toBe('F#')
		expect(getPitchClassForKey('Db')).toBe(1)
		expect(getPitchClassForKey('C#4')).toBe(1)
	})

	test('resolves scale formula names and arrays', () => {
		expect(getScaleFormula('MAJOR_SCALE')).toBe(MAJOR_SCALE)
		expect(getScaleFormula('NATURAL_MINOR_SCALE')).toBe(NATURAL_MINOR_SCALE)
		expect(getScaleFormula('CHROMATIC_SCALE')).toBe(CHROMATIC_SCALE)
		expect(getScaleFormula(MAJOR_SCALE)).toBe(MAJOR_SCALE)
	})

	test('creates playable notes for a shared major key', () => {
		expect(getKeyScaleNotes(0, 'MAJOR_SCALE')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
		expect(getKeyScaleNotes('G', 'MAJOR_SCALE')).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'Gb'])
		expect(getKeyScaleNotes('F#', 'MAJOR_SCALE')).toEqual(['Gb', 'Ab', 'Bb', 'B', 'Db', 'Eb', 'F'])
	})

	test('creates playable notes for a shared natural minor key', () => {
		expect(getKeyScaleNotes('A', 'NATURAL_MINOR_SCALE')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
		expect(getKeyScaleNotes('D', 'NATURAL_MINOR_SCALE')).toEqual(['D', 'E', 'F', 'G', 'A', 'Bb', 'C'])
	})

	test('creates all twelve playable notes for global chromatic mode', () => {
		expect(getKeyScaleNotes('C', 'CHROMATIC_SCALE')).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'])
		expect(getKeyScaleNotes('F#', 'CHROMATIC_SCALE')).toEqual(['Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F'])
	})
})

describe('global key controls', () => {
	const controlPanel = readFileSync('source/partials/control-panel.pug', 'utf8')
	const applicationOptions = readFileSync('source/settings/options.js', 'utf8')
	const personOptions = readFileSync('source/settings/options.people.js', 'utf8')
	const personPanel = readFileSync('source/dom/ui.panel-instruments.js', 'utf8')
	const personSource = readFileSync('source/people/person.js', 'utf8')
	const presetPage = readFileSync('source/presets.pug', 'utf8')

	test('uses free range harmony for application and person defaults', () => {
		expect(applicationOptions).toContain('harmonyMode:HARMONY_MODE_FREE_RANGE')
		expect(personOptions).toContain('harmonyMode:HARMONY_MODE_FREE_RANGE')
	})

	test('provides a global points toggle and per-person override', () => {
		expect(controlPanel).toContain('input#button-points')
		expect(personPanel).toContain('"showPointsOverride"')
		expect(personPanel).toContain('"Use global setting"')
	})

	test('keeps the mode, XP total, and transient encouragement on screen together', () => {
		expect(personSource).toContain('this.drawInstrumentText( display, textX, textY, title, style)')
		expect(personSource).toContain('`${formatAchievementPoints(this.achievementPoints)} XP`')
		expect(personSource).toContain('[recentAchievementLabel.title, recentAchievementLabel.style].filter(Boolean)')
	})

	test('provides a Bestival A natural minor MIDI preset', () => {
		const href = presetPage.match(/a\(href="([^"]+)"\) Bestival A minor/)?.[1]
		const preset = new URL(href, 'https://photosynth.app')

		expect(preset.pathname).toBe('/bestival')
		expect(preset.searchParams.get('harmonyMode')).toBe(HARMONY_MODE_GLOBAL_KEY)
		expect(preset.searchParams.get('key')).toBe('A')
		expect(preset.searchParams.get('keyScale')).toBe('NATURAL_MINOR_SCALE')
		expect(preset.searchParams.get('midiInput')).toBe('true')
		expect(preset.searchParams.get('midiOnboard')).toBe('true')
		expect(preset.searchParams.get('quantise')).toBe('true')
	})

	test('uses separate tonic and scale selectors', () => {
		expect(controlPanel).toContain('select#select-key(')
		expect(controlPanel).toContain('select#select-key-scale(')
		expect(controlPanel).not.toContain('C|MAJOR_SCALE')
	})

	test('offers free range plus all twelve pitch classes as tonics', () => {
		[
			'free-range',
			'C',
			'Db',
			'D',
			'Eb',
			'E',
			'F',
			'Gb',
			'G',
			'Ab',
			'A',
			'Bb',
			'B'
		].forEach(value => {
			expect(controlPanel).toContain(`option(value="${value}")`)
		})
	})

	test('offers every named scale variant', () => {
		Object.keys(INTERVAL_LIBRARY)
			.filter(scaleName => scaleName.endsWith('_SCALE'))
			.forEach(scaleName => {
				expect(controlPanel).toContain(`option(value="${scaleName}")`)
			})
	})
})

describe('person operating modes', () => {
	test('normalises invalid or out-of-range operating mode values', () => {
		expect(normalisePersonOperatingMode(0)).toBe(0)
		expect(normalisePersonOperatingMode(PERSON_TYPE_DATA.length)).toBe(0)
		expect(normalisePersonOperatingMode(-1)).toBe(PERSON_TYPE_DATA.length - 1)
		expect(normalisePersonOperatingMode('2')).toBe(2)
		expect(normalisePersonOperatingMode(Number.NaN)).toBe(0)
	})

	test('configures a valid mode after wrapping stale values', () => {
		const person = {
			options:{ harmonyMode:HARMONY_MODE_FREE_RANGE },
			activeInstrument:{ arpeggiate:false }
		}

		configurePersonByOperatingMode(person, -1)

		expect(person.userMode).toBe(PERSON_TYPE_DATA.length - 1)
		expect(person.leftFacingKeys).toBe(PERSON_TYPE_DATA[PERSON_TYPE_DATA.length - 1].leftFacingKeys)
		expect(person.rightFacingKeys).toBe(PERSON_TYPE_DATA[PERSON_TYPE_DATA.length - 1].rightFacingKeys)
		expect(person.activeInstrument.arpeggiate).toBe(PERSON_TYPE_DATA[PERSON_TYPE_DATA.length - 1].arpeggiate)
	})

	test('keeps points out of the per-person musical mode cycle', () => {
		expect(PERSON_TYPE_DATA.map(mode => mode.name)).not.toContain('PTS')
		expect(PERSON_TYPE_DATA.every(mode => !mode.isPlayer)).toBe(true)
	})

	test('places harp configurations directly after both regular arpeggio modes', () => {
		expect(PERSON_TYPE_HARP).toBe(PERSON_TYPE_ARPEGGIO_CIRCLE_OF_FIFTHS + 1)
		expect(PERSON_TYPE_HARP_CIRCLE_OF_FIFTHS).toBe(PERSON_TYPE_HARP + 1)
		expect(PERSON_TYPE_DATA.map(mode => mode.name)).toEqual(['〇', '12', 'ARP', '⯂', 'HARP', 'H◯'])

		const person = {
			options:{ harmonyMode:HARMONY_MODE_FREE_RANGE },
			activeInstrument:{ performanceMode:'chord' }
		}
		configurePersonByOperatingMode(person, PERSON_TYPE_HARP)
		expect(person.activeInstrument.performanceMode).toBe('harp')
		expect(person.options.noteSequence).toBe('chromatic')
		configurePersonByOperatingMode(person, PERSON_TYPE_HARP_CIRCLE_OF_FIFTHS)
		expect(person.activeInstrument.performanceMode).toBe('harp')
		expect(person.options.noteSequence).toBe('circle-of-fifths')
		expect(PERSON_TYPE_DATA[PERSON_TYPE_HARP].noteSequence).toBe('chromatic')
		expect(PERSON_TYPE_DATA[PERSON_TYPE_HARP_CIRCLE_OF_FIFTHS].noteSequence).toBe('circle-of-fifths')
	})

	test('resolves per-person point overrides against the global setting', () => {
		expect(resolvePointsEnabled(true, POINTS_OVERRIDE_INHERIT)).toBe(true)
		expect(resolvePointsEnabled(false, POINTS_OVERRIDE_INHERIT)).toBe(false)
		expect(resolvePointsEnabled(false, POINTS_OVERRIDE_ON)).toBe(true)
		expect(resolvePointsEnabled(true, POINTS_OVERRIDE_OFF)).toBe(false)
	})

	test('formats encouragement for the full achievement display window', () => {
		const recentAchievement = {
			emoticon:EMOJI_NEUTRAL,
			achievement:{ title:'Face Explorer', message:'Three faces, one fearless performer.', score:25 }
		}

		expect(getRecentAchievementLabel(recentAchievement, 100, 100)).toEqual({
			title:'+25 Face Explorer',
			style:'Three faces, one fearless performer.'
		})
		expect(getRecentAchievementLabel(recentAchievement, 100, 100 + ACHIEVEMENT_MESSAGE_DURATION - 1)).not.toBeNull()
		expect(getRecentAchievementLabel(recentAchievement, 100, 100 + ACHIEVEMENT_MESSAGE_DURATION)).toBeNull()
	})

	test('tracks achievement points once for each unlocked expression', () => {
		const progress = new PersonalProgress()

		const firstUnlock = progress.experienceEmotion(EMOJI_NEUTRAL)
		const duplicateUnlock = progress.experienceEmotion(EMOJI_NEUTRAL)
		const secondUnlock = progress.experienceEmotion(EMOJI_OPEN_MOUTH)

		expect(firstUnlock.score).toBe(5)
		expect(duplicateUnlock).toBe(false)
		expect(secondUnlock.score).toBe(7)
		expect(progress.achievementPoints).toBe(12)
	})

	test('keeps achievement points across session resets', () => {
		const progress = new PersonalProgress()

		progress.experienceEmotion(EMOJI_NEUTRAL)
		progress.resetSession()
		const duplicateUnlock = progress.experienceEmotion(EMOJI_NEUTRAL)

		expect(duplicateUnlock).toBe(false)
		expect(progress.achievementPoints).toBe(5)
	})

	test('adds points for every played note event', () => {
		const progress = new PersonalProgress()

		progress.trackNote(60, STATE_INSTRUMENT_SILENT, 0)
		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 100)
		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 200)
		progress.trackNote(62, STATE_INSTRUMENT_ATTACK, 300)

		expect(progress.achievementPoints).toBe(12)
	})

	test('unlocks reward achievements for expression milestones', () => {
		const progress = new PersonalProgress()

		progress.trackExpression(EMOJI_NEUTRAL)
		progress.trackExpression(EMOJI_OPEN_MOUTH)
		const unlocked = progress.trackExpression(EMOJI_ANGRY)

		expect(unlocked.map(achievement => achievement.title)).toContain('Face Explorer')
		expect(progress.achievementPoints).toBe(43)
	})

	test('unlocks engagement achievements while player mode is active', () => {
		let now = 0
		const progress = new PersonalProgress()
		progress.getNow = () => now
		progress.reset()

		progress.startPlayerMode(0)
		now = 60_000
		const unlocked = progress.tick(now)

		expect(unlocked.map(achievement => achievement.title)).toContain('Warmed Up')
		expect(progress.achievementPoints).toBe(20)
	})

	test('unlocks fast note and note variety rewards from playing states only', () => {
		const progress = new PersonalProgress()

		progress.trackNote(60, STATE_INSTRUMENT_SILENT, 0)
		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 100)
		progress.trackNote(64, STATE_INSTRUMENT_ATTACK, 300)
		progress.trackNote(62, STATE_INSTRUMENT_ATTACK, 500)
		progress.trackNote(67, STATE_INSTRUMENT_ATTACK, 700)
		const unlocked = progress.trackNote(65, STATE_INSTRUMENT_ATTACK, 900)

		expect(unlocked.map(achievement => achievement.title)).toEqual(
			expect.arrayContaining(['Scale Scout', 'Quick Fingers'])
		)
		expect(progress.achievementPoints).toBe(90)
	})

	test('unlocks single note rewards for sustained playing', () => {
		const progress = new PersonalProgress()

		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 0)
		const firstHold = progress.trackNote(60, STATE_INSTRUMENT_SUSTAIN, 3_000)
		const secondHold = progress.trackNote(60, STATE_INSTRUMENT_SUSTAIN, 6_000)

		expect(firstHold.map(achievement => achievement.title)).toContain('One Note Wonder')
		expect(secondHold.map(achievement => achievement.title)).toContain('Drone Master')
		expect(progress.achievementPoints).toBe(117)
	})

	test('unlocks playful expression burst achievements', () => {
		const progress = new PersonalProgress()

		progress.trackExpression(EMOJI_NEUTRAL, 0)
		progress.trackExpression(EMOJI_OPEN_MOUTH, 1_000)
		progress.trackExpression(EMOJI_ANGRY, 2_000)
		const unlocked = progress.trackExpression(EMOJI_SLEEPING, 3_000)

		expect(unlocked.map(achievement => achievement.title)).toContain('Mask Juggler')
	})

	test('unlocks run, range, and octave leap note achievements', () => {
		const progress = new PersonalProgress()

		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 0)
		progress.trackNote(62, STATE_INSTRUMENT_ATTACK, 100)
		progress.trackNote(64, STATE_INSTRUMENT_ATTACK, 200)
		const runUnlocks = progress.trackNote(65, STATE_INSTRUMENT_ATTACK, 300)
		const leapUnlocks = progress.trackNote(77, STATE_INSTRUMENT_ATTACK, 400)

		expect(runUnlocks.map(achievement => achievement.title)).toContain('Staircase Sprint')
		expect(leapUnlocks.map(achievement => achievement.title)).toEqual(
			expect.arrayContaining(['Octave Tourist', 'Rocket Jump'])
		)
	})

	test('unlocks pitch bend achievements', () => {
		const progress = new PersonalProgress()

		progress.trackNote(60, STATE_INSTRUMENT_ATTACK, 0)
		progress.trackNote(61, STATE_INSTRUMENT_PITCH_BEND, 100)
		progress.trackNote(62, STATE_INSTRUMENT_PITCH_BEND, 200)
		const unlocked = progress.trackNote(63, STATE_INSTRUMENT_PITCH_BEND, 300)

		expect(unlocked.map(achievement => achievement.title)).toContain('Rubber Note')
	})
})

describe('diatonic global-key chord generation', () => {
	test('keeps D minor inside C major instead of making D major', () => {
		const chord = getDiatonicChordInKey(62, 0, 'MAJOR_SCALE')
		expect(noteNumbers(chord)).toEqual([62, 65, 69])
		expect(noteNames(chord)).toEqual(['D4', 'F4', 'A4'])
	})

	test('uses the selected key signature for the same played note', () => {
		const cMajorChord = getDiatonicChordInKey(62, 0, 'MAJOR_SCALE')
		const gMajorChord = getDiatonicChordInKey(62, 7, 'MAJOR_SCALE')

		expect(noteNames(cMajorChord)).toEqual(['D4', 'F4', 'A4'])
		expect(noteNames(gMajorChord)).toEqual(['D4', 'Gb4', 'A4'])
	})

	test('builds the expected i chord in A natural minor', () => {
		const chord = getDiatonicChordInKey(69, 'A', 'NATURAL_MINOR_SCALE')
		expect(noteNames(chord)).toEqual(['A4', 'C5', 'E5'])
	})

	test('snaps non-diatonic roots to the nearest scale degree before stacking thirds', () => {
		const chord = getDiatonicChordInKey(61, 0, 'MAJOR_SCALE')
		expect(noteNames(chord)).toEqual(['C4', 'E4', 'G4'])
	})

	test('quantizes a chromatic emotional profile when it contains an unavailable note', () => {
		const chord = getMusicalDetailsFromEmoji(72, EMOJI_OPEN_MOUTH, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:'F',
			keyScale:'MAJOR_SCALE'
		})

		expect(noteNames(chord)).toEqual(['C5', 'E5', 'G5'])
		expect(noteNames(chord)).not.toContain('Eb5')
	})

	test('keeps every chord tone inside the selected global scale', () => {
		const fMajorPitchClasses = new Set([5, 7, 9, 10, 0, 2, 4])
		const chord = getMusicalDetailsFromEmoji(72, EMOJI_OPEN_MOUTH, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:'F',
			keyScale:'MAJOR_SCALE'
		})

		expect(chord.every(note => fMajorPitchClasses.has(note.noteNumber % 12))).toBe(true)
	})

	test('global chromatic mode allows all pitch classes and uses chromatic emotion intervals', () => {
		const chord = getMusicalDetailsFromEmoji(60, EMOJI_NEUTRAL, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:'C',
			keyScale:'CHROMATIC_SCALE'
		})

		expect(getChromaticIntervalsForEmoji(EMOJI_NEUTRAL)).toEqual([0, 4, 7])
		expect(noteNames(chord)).toEqual(['C4', 'E4', 'G4'])
	})
})

describe('emoji harmony mode selection', () => {
	test('defines an expressive interval profile for every exported emoji', () => {
		Object.entries(EMOJIS)
			.filter(([name, value]) => name.startsWith('EMOJI_') && typeof value === 'string')
			.forEach(([name, emoji]) => {
				const profile = getPrimaryIntervalsForEmoji(emoji)
				expect(Array.isArray(profile)).toBe(true)
				expect(profile.length).toBeGreaterThan(0)
				expect(profile[0]).toBe(0)
			})
	})

	test('uses distinct chromatic interval profiles for different emotional characters', () => {
		expect(getPrimaryIntervalsForEmoji(EMOJI_NEUTRAL)).toEqual([0, 4, 7])
		expect(getPrimaryIntervalsForEmoji(EMOJI_HEARTS)).toEqual([0, 4, 7, 9, 14])
		expect(getPrimaryIntervalsForEmoji(EMOJI_SLEEPING)).toEqual([0, 7, 12])
		expect(getPrimaryIntervalsForEmoji(EMOJI_ANGRY)).toEqual([0, 3, 6])
	})

	test('global-key mode returns diatonic chords in the shared key', () => {
		const chord = getMusicalDetailsFromEmoji(62, EMOJI_NEUTRAL, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:0,
			keyScale:'MAJOR_SCALE'
		})

		expect(noteNames(chord)).toEqual(['D4', 'F4', 'A4'])
	})

	test('global-key mode lets sad emoticons choose a minor triad colour', () => {
		const chord = getMusicalDetailsFromEmoji(69, EMOJI_OPEN_MOUTH, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:'A',
			keyScale:'NATURAL_MINOR_SCALE'
		})

		expect(noteNames(chord)).toEqual(['A4', 'C5', 'E5'])
	})

	test('global-key mode lets angry emoticons choose a tense colour inside the key', () => {
		const chord = getMusicalDetailsFromEmoji(71, EMOJI_ANGRY, true, {
			harmonyMode:HARMONY_MODE_GLOBAL_KEY,
			tonic:0,
			keyScale:'MAJOR_SCALE'
		})

		expect(noteNames(chord)).toEqual(['B4', 'D5', 'F5'])
	})

	test('free range mode preserves note-as-root behaviour', () => {
		const chord = getMusicalDetailsFromEmoji(62, EMOJI_NEUTRAL, true, {
			harmonyMode:HARMONY_MODE_FREE_RANGE,
			tonic:0,
			keyScale:'MAJOR_SCALE'
		})

		expect(noteNames(chord)).toEqual(['D4', 'Gb4', 'A4'])
	})
})
