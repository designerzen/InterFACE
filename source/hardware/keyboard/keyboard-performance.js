const KEYBOARD_ROWS = Object.freeze([
	Object.freeze({ id: 'numbers', label: 'Number row', keys: '1234567890' }),
	Object.freeze({ id: 'upper', label: 'Upper row', keys: 'qwertyuiop' }),
	Object.freeze({ id: 'home', label: 'Home row', keys: 'asdfghjkl' }),
	Object.freeze({ id: 'lower', label: 'Lower row', keys: 'zxcvbnm' }),
])

const codeForKey = key => /^[0-9]$/.test(key)
	? `Digit${key}`
	: `Key${key.toUpperCase()}`

export const KEYBOARD_PERFORMANCE_KEYS = Object.freeze(KEYBOARD_ROWS.flatMap((row, rowIndex) =>
	row.keys.split('').map((key, rowKeyIndex) => Object.freeze({
		code: codeForKey(key),
		key,
		label: key.toUpperCase(),
		row: row.id,
		rowLabel: row.label,
		rowIndex,
		rowKeyIndex,
	}))
))

const PERFORMANCE_KEY_BY_CODE = new Map(
	KEYBOARD_PERFORMANCE_KEYS.map((key, index) => [key.code, Object.freeze({ ...key, index })]),
)
const PERFORMANCE_KEY_BY_KEY = new Map(
	KEYBOARD_PERFORMANCE_KEYS.map((key, index) => [key.key, Object.freeze({ ...key, index })]),
)

export const getKeyboardPerformanceKey = event => {
	const normalisedCode = event.code?.replace(/^Numpad([0-9])$/, 'Digit$1')
	return PERFORMANCE_KEY_BY_CODE.get(normalisedCode)
		?? PERFORMANCE_KEY_BY_KEY.get(event.key?.toLowerCase?.())
		?? null
}

const NOTE_NAMES = Object.freeze(['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'])

export const getNoteName = noteNumber => {
	const note = ((noteNumber % 12) + 12) % 12
	return `${NOTE_NAMES[note]}${Math.floor(noteNumber / 12) - 1}`
}

export const getKeyboardNoteAssignment = (performanceKey, octaveOffset = 0) => {
	if (!performanceKey) return null
	const noteNumber = 48 + performanceKey.index + octaveOffset
	return Object.freeze({
		...performanceKey,
		noteNumber,
		noteName: getNoteName(noteNumber),
	})
}

// The letter rows repeat complementary diatonic progressions in C major. This
// keeps neighbouring and arbitrarily sequenced keys harmonically compatible.
const CHORD_PROGRESSIONS = Object.freeze({
	numbers: Object.freeze([0, 7, 9, 5, 0, 9, 5, 7, 2, 7]),
	upper: Object.freeze([0, 7, 9, 5, 0, 9, 5, 7, 2, 7]),
	home: Object.freeze([9, 5, 0, 7, 2, 9, 7, 4, 0]),
	lower: Object.freeze([5, 7, 4, 9, 2, 7, 0]),
})

const DIATONIC_CHORDS = Object.freeze({
	0: Object.freeze({ suffix: '', intervals: Object.freeze([0, 4, 7]), family: 'I' }),
	2: Object.freeze({ suffix: 'm', intervals: Object.freeze([0, 3, 7]), family: 'ii' }),
	4: Object.freeze({ suffix: 'm', intervals: Object.freeze([0, 3, 7]), family: 'iii' }),
	5: Object.freeze({ suffix: '', intervals: Object.freeze([0, 4, 7]), family: 'IV' }),
	7: Object.freeze({ suffix: '', intervals: Object.freeze([0, 4, 7]), family: 'V' }),
	9: Object.freeze({ suffix: 'm', intervals: Object.freeze([0, 3, 7]), family: 'vi' }),
})

export const getKeyboardChordAssignment = performanceKey => {
	if (!performanceKey) return null
	const progression = CHORD_PROGRESSIONS[performanceKey.row]
	if (!progression) return null
	const rootOffset = progression[performanceKey.rowKeyIndex % progression.length]
	const rootNoteNumber = 48 + rootOffset
	const chord = DIATONIC_CHORDS[rootOffset]
	return Object.freeze({
		...performanceKey,
		label: `${NOTE_NAMES[rootNoteNumber % 12]}${chord.suffix}`,
		family: chord.family,
		noteNumbers: Object.freeze(chord.intervals.map(interval => rootNoteNumber + interval)),
	})
}

const createDrum = (part, label, symbol, region, soundOptions = {}) => Object.freeze({
	part, label, symbol, region, soundOptions: Object.freeze(soundOptions),
})

const DRUM_ROWS = Object.freeze([
	Object.freeze([
		createDrum('sub-kick', 'Sub Kick', 'SUB', 'Kicks & drums', { velocity: 0.9 }),
		createDrum('kick', 'Kick', 'KICK', 'Kicks & drums'),
		createDrum('kick', 'Punch Kick', 'PUNCH', 'Kicks & drums', { length: 0.24, triStart: 170, triEnd: 48 }),
		createDrum('low-tom', 'Low Tom', 'TOM L', 'Kicks & drums'),
		createDrum('mid-tom', 'Mid Tom', 'TOM M', 'Kicks & drums'),
		createDrum('high-tom', 'High Tom', 'TOM H', 'Kicks & drums'),
		createDrum('snare', 'Snare', 'SNARE', 'Kicks & drums'),
		createDrum('rim', 'Rim', 'RIM', 'Kicks & drums'),
		createDrum('clap', 'Clap', 'CLAP', 'Kicks & drums'),
		createDrum('clack', 'Clack', 'CLACK', 'Kicks & drums'),
	]),
	Object.freeze([
		createDrum('hat', 'Closed Hat', 'HAT', 'Hats & cymbals', { open: false }),
		createDrum('hat', 'Open Hat', 'OPEN', 'Hats & cymbals', { open: true, length: 0.72 }),
		createDrum('shaker', 'Shaker', 'SHAKE', 'Hats & cymbals'),
		createDrum('ride', 'Ride', 'RIDE', 'Hats & cymbals'),
		createDrum('crash', 'Crash', 'CRASH', 'Hats & cymbals'),
		createDrum('hat', 'Short Hat', 'TICK', 'Hats & cymbals', { length: 0.035, decay: 0.012 }),
		createDrum('hat', 'Loose Hat', 'LOOSE', 'Hats & cymbals', { length: 0.34, decay: 0.12 }),
		createDrum('ride', 'Bright Ride', 'RIDE+', 'Hats & cymbals', { fundamental: 760, highpass: 2800 }),
		createDrum('crash', 'Dark Crash', 'CRASH−', 'Hats & cymbals', { fundamental: 220, lowpass: 7200 }),
		createDrum('cowbell', 'Cowbell', 'BELL', 'Hats & cymbals'),
	]),
	Object.freeze([
		createDrum('low-bongo', 'Low Bongo', 'BONGO L', 'Hand percussion'),
		createDrum('high-bongo', 'High Bongo', 'BONGO H', 'Hand percussion'),
		createDrum('low-conga', 'Low Conga', 'CONGA L', 'Hand percussion'),
		createDrum('high-conga', 'Open High Conga', 'CONGA H', 'Hand percussion'),
		createDrum('mute-conga', 'Muted High Conga', 'CONGA M', 'Hand percussion'),
		createDrum('cabasa', 'Cabasa', 'CABASA', 'Hand percussion'),
		createDrum('maracas', 'Maracas', 'MARACA', 'Hand percussion'),
		createDrum('mute-triangle', 'Muted Triangle', 'TRI M', 'Hand percussion'),
		createDrum('open-triangle', 'Open Triangle', 'TRI O', 'Hand percussion'),
	]),
	Object.freeze([
		createDrum('kick', 'Long Kick FX', 'KICK FX', 'Percussion FX', { length: 0.9, sineEnd: 24 }),
		createDrum('snare', 'Noise Snare FX', 'SN FX', 'Percussion FX', { decay: 0.22, highpassStart: 1800 }),
		createDrum('clap', 'Soft Clap', 'CLAP−', 'Percussion FX', { velocity: 0.55 }),
		createDrum('cowbell', 'Low Bell', 'BELL L', 'Percussion FX', { fundamental: 420 }),
		createDrum('clack', 'Wood Block', 'WOOD', 'Percussion FX', { velocity: 0.72 }),
		createDrum('shaker', 'Long Shaker', 'SHAKE+', 'Percussion FX', { length: 0.28, release: 0.16 }),
		createDrum('crash', 'Splash', 'SPLASH', 'Percussion FX', { length: 0.42, decay: 0.14 }),
	]),
])

export const KEYBOARD_PERCUSSION_ASSIGNMENTS = Object.freeze(DRUM_ROWS.flat())

const EXPANDED_DRUM_ROWS = Object.freeze([
	Object.freeze([
		createDrum('rimshot', 'Rimshot', 'RIMSHOT', 'Sticks & blocks'),
		createDrum('crossStick', 'Cross Stick', 'CROSS', 'Sticks & blocks'),
		createDrum('claves', 'Claves', 'CLAVES', 'Sticks & blocks'),
		createDrum('woodblockHigh', 'High Woodblock', 'WOOD H', 'Sticks & blocks'),
		createDrum('woodblockLow', 'Low Woodblock', 'WOOD L', 'Sticks & blocks'),
		createDrum('castanets', 'Castanets', 'CAST', 'Sticks & blocks'),
		createDrum('fingerSnap', 'Finger Snap', 'SNAP', 'Sticks & blocks'),
		createDrum('tambourine', 'Tambourine', 'TAMB', 'Shaken percussion'),
		createDrum('chekere', 'Chekere', 'CHEK', 'Shaken percussion'),
		createDrum('quijada', 'Quijada', 'QUIJ', 'Shaken percussion'),
	]),
	Object.freeze([
		createDrum('crash', 'Crash Cymbal', 'CRASH', 'Cymbals & bells'),
		createDrum('ride', 'Ride Cymbal', 'RIDE', 'Cymbals & bells'),
		createDrum('splash', 'Splash Cymbal', 'SPLASH', 'Cymbals & bells'),
		createDrum('china', 'China Cymbal', 'CHINA', 'Cymbals & bells'),
		createDrum('agogoHigh', 'High Agogo', 'AGOGO H', 'Cymbals & bells'),
		createDrum('agogoLow', 'Low Agogo', 'AGOGO L', 'Cymbals & bells'),
		createDrum('starChime', 'Star Chime', 'STAR', 'Cymbals & bells'),
		createDrum('windChime', 'Wind Chime', 'WIND', 'Cymbals & bells'),
		createDrum('metalHit', 'Metallic Hit', 'METAL', 'Cymbals & bells'),
		createDrum('whistleShort', 'Short Whistle', 'WHIST S', 'Cymbals & bells'),
	]),
	Object.freeze([
		createDrum('timbaleHigh', 'High Timbale', 'TIMB H', 'Latin drums'),
		createDrum('timbaleLow', 'Low Timbale', 'TIMB L', 'Latin drums'),
		createDrum('guiroShort', 'Short Guiro', 'GUIRO S', 'Latin drums'),
		createDrum('guiroLong', 'Long Guiro', 'GUIRO L', 'Latin drums'),
		createDrum('cuicaMute', 'Muted Cuica', 'CUICA M', 'Latin drums'),
		createDrum('cuicaOpen', 'Open Cuica', 'CUICA O', 'Latin drums'),
		createDrum('surdoMute', 'Muted Surdo', 'SURDO M', 'Latin drums'),
		createDrum('surdoOpen', 'Open Surdo', 'SURDO O', 'Latin drums'),
		createDrum('whistleLong', 'Long Whistle', 'WHIST L', 'Latin drums'),
	]),
	Object.freeze([
		createDrum('syndrum', 'Syndrum', 'SYNDRUM', 'Electronic percussion'),
		createDrum('laserTom', 'Laser Tom', 'LASER', 'Electronic percussion'),
		createDrum('hatPedal', 'Pedal Hi-hat', 'PEDAL', 'GM percussion'),
		createDrum('rideBell', 'Ride Bell', 'RIDE B', 'GM percussion'),
		createDrum('crash2', 'Crash Cymbal 2', 'CRASH 2', 'GM percussion'),
		createDrum('vibraslap', 'Vibraslap', 'VSLAP', 'GM percussion'),
		createDrum('jingleBell', 'Jingle Bell', 'JINGLE', 'GM percussion'),
	]),
])

export const KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS = Object.freeze(EXPANDED_DRUM_ROWS.flat())
export const KEYBOARD_PERCUSSION_LAYERS = Object.freeze([
	KEYBOARD_PERCUSSION_ASSIGNMENTS,
	KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS,
])

export const getKeyboardPercussionAssignment = (performanceKey, shifted=false) => {
	if (!performanceKey) return null
	return (shifted ? KEYBOARD_PERCUSSION_SHIFT_ASSIGNMENTS : KEYBOARD_PERCUSSION_ASSIGNMENTS)[performanceKey.index] ?? null
}

const meme = (id, label, filename, symbol = label) => Object.freeze({
	id, label, symbol, src: `./assets/audio/fx/meme/${filename}`, interrupt: 'self',
})
const magic = (filename, index, interrupt = 'self') => Object.freeze({
	id: `magic-${index}-${interrupt}`,
	label: filename.replace(/\.[^.]+$/, '').replaceAll('-', ' '),
	symbol: `MAG ${index + 1}`,
	src: `./assets/audio/fx/spells/${filename}`,
	interrupt,
})
const coin = (index, playbackRate) => Object.freeze({
	id: `coin-${index}`,
	label: `Coin pitch ${index + 1}`,
	symbol: `COIN ${index + 1}`,
	src: './assets/audio/tracks/coin.wav',
	playbackRate,
	interrupt: 'self',
})

const MAGIC_FILES = Object.freeze([
	'enchanted-spell-casting-229208.mp3',
	'magic-mallet-6262.mp3',
	'magic-sparkle-190030.mp3',
	'magic-spell-cast-sound-effect-224173.mp3',
	'magical-sound-effect-7137.mp3',
	'magical-twinkle-242245.mp3',
	'particles-143023.mp3',
	'shine-magic-sound-4-sounds-190258.mp3',
	'spookymagic-7050.mp3',
	'whoosh-fire-cast-243100.mp3',
])

export const KEYBOARD_SAMPLE_ASSIGNMENTS = Object.freeze([
	meme('anime-wow', 'Anime Wow', 'anime-wow-sound-effect.mp3', 'WOW'),
	meme('applause', 'Applause', 'applause-4.mp3', 'CLAP'),
	meme('rimshot', 'Ba Dum Tss', 'ba-dum-tss_87uziQL.mp3', 'TSS'),
	meme('air-horn', 'Air Horn', 'dragon-studio-air-horn-sound-effect-372453.mp3', 'HORN'),
	meme('thud', 'Dramatic Thud', 'dragon-studio-thud-sound-effect-405470.mp3', 'THUD'),
	meme('good', 'Good', 'freesound_community-good-6081.mp3', 'GOOD'),
	meme('sad-trombone', 'Sad Trombone', 'freesound_community-wah-wah-sad-trombone-6347.mp3', 'SAD'),
	meme('pop', 'Pop', 'pop_7e9Is8L.mp3', 'POP'),
	meme('roblox-death', 'Roblox Death', 'roblox-death-sound_1.mp3', 'OOF'),
	coin(0, 0.5),
	...MAGIC_FILES.map((filename, index) => magic(filename, index)),
	...Object.freeze([0.5, 0.59, 0.67, 0.75, 0.84, 1, 1.19, 1.34, 1.5])
		.map((playbackRate, index) => coin(index + 1, playbackRate)),
	...MAGIC_FILES.slice(0, 7).map((filename, index) => magic(filename, index, 'all')),
])
