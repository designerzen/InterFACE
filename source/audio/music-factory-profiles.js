// Degrees are zero-based. Genre rules own both the musical skeleton and its surface.
const major = [0, 2, 4, 5, 7, 9, 11]
const minor = [0, 2, 3, 5, 7, 8, 10]
const profile = (id, title, rules) => Object.freeze({
	id, title, scale:major, bpm:108, beats:4, steps:16, phraseBars:4,
	progression:[0, 3, 4, 0], contrast:[5, 3, 1, 4], chordSize:3,
	bass:[0, 8], harmony:[0], lead:[0, 4, 6, 10, 12], gate:0.7,
	form:['statement', 'develop', 'contrast', 'return'], swing:0,
	drums:true, performance:'steady', groove:'synth-pop', sound:'synth-pop',
	leadTone:'reed', bassTone:'round', harmonyTone:'soft', program:81,
	...rules
})

export const MUSIC_FACTORY_PROFILES = Object.freeze([
	profile('synth-pop', 'Synth-pop', {bpm:112, progression:[0, 4, 5, 3], contrast:[5, 3, 0, 4], performance:'auto', leadTone:'bright'}),
	profile('house', 'House / techno', {bpm:124, scale:minor, groove:'disco-house', sound:'disco-house', progression:[0, 0, 5, 3], bass:[0, 3, 6, 8, 11, 14], harmony:[2, 6, 10, 14], lead:[0, 3, 6, 10, 14], performance:'auto', leadTone:'pulse', harmonyTone:'pluck', program:80}),
	profile('funk', 'Funk', {bpm:102, groove:'funky-drummer', sound:'funk', scale:[0, 2, 3, 5, 7, 9, 10], progression:[0, 0, 3, 0], bass:[0, 3, 7, 8, 11, 14], harmony:[2, 7, 10, 15], lead:[1, 4, 7, 10, 14], chordSize:4, harmonyTone:'pluck', bassTone:'pluck', program:4}),
	profile('jazz', 'Jazz', {bpm:116, groove:'jazz-swing', sound:'jazz', progression:[1, 4, 0, 5], contrast:[3, 6, 2, 4], bass:[0, 4, 8, 12], harmony:[2, 9], lead:[0, 3, 6, 8, 11, 14], chordSize:4, swing:0.18, leadTone:'reed', harmonyTone:'keys', program:65}),
	profile('blues', 'Blues shuffle', {bpm:88, beats:6, steps:12, groove:'blues-shuffle', sound:'blues', progression:[0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], contrast:[0, 3, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], phraseBars:12, bass:[0, 3, 6, 9], harmony:[0, 6], lead:[0, 2, 3, 5, 6, 8, 9, 11], blues:true, leadTone:'pluck', harmonyTone:'keys', program:26}),
	profile('reggae', 'Reggae / dub', {bpm:76, groove:'reggae', sound:'reggae-dub', progression:[0, 3, 0, 4], bass:[0, 6, 8, 11], harmony:[2, 6, 10, 14], lead:[0, 6, 10, 14], gate:0.5, harmonyTone:'pluck', program:16}),
	profile('hip-hop', 'Hip-hop', {bpm:86, groove:'hip-hop', sound:'hip-hop', scale:minor, progression:[0, 0, 3, 4], bass:[0, 7, 10], harmony:[0, 10], lead:[0, 3, 7, 10, 14], swing:0.12, leadTone:'keys', harmonyTone:'keys', program:4}),
	profile('drum-and-bass', 'Drum & bass', {bpm:170, groove:'drum-and-bass', sound:'drum-and-bass', scale:minor, progression:[0, 0, 5, 3], bass:[0, 6, 10, 14], harmony:[0], lead:[0, 6, 8, 14], performance:'auto', leadTone:'bright', bassTone:'pulse', program:81}),
	profile('ambient', 'Ambient', {bpm:66, drums:false, sound:'lunar-drift', progression:[0, 0, 3, 3, 5, 5, 0, 0], contrast:[3, 3, 5, 5], phraseBars:8, bass:[0], harmony:[0], lead:[0, 8], gate:1.8, leadTone:'soft', harmonyTone:'soft', program:89}),
	profile('classical', 'Piano variations', {bpm:96, drums:false, progression:[0, 3, 1, 4, 0, 5, 4, 0], contrast:[5, 2, 3, 4], bass:[0, 8], harmony:[2, 6, 10, 14], lead:[0, 2, 4, 6, 8, 10, 12, 14], leadTone:'keys', harmonyTone:'keys', bassTone:'keys', program:0}),
	profile('waltz', 'Waltz', {bpm:100, beats:3, steps:12, drums:false, progression:[0, 3, 4, 0], bass:[0], harmony:[4, 8], lead:[0, 3, 6, 8, 10], leadTone:'keys', harmonyTone:'keys', program:0}),
	profile('cyclic', 'Asymmetric / interlocking', {bpm:108, beats:3.5, steps:14, groove:'rachenitsa-7-8', sound:'balkan-dance-inspired', scale:[0, 2, 3, 6, 7, 8, 10], progression:[0, 0, 3, 0], contrast:[3, 3, 0, 0], bass:[0, 4, 8], harmony:[0, 8], lead:[0, 2, 4, 6, 8, 10, 12], leadTone:'pluck', harmonyTone:'pluck', program:10})
])

export const getMusicFactoryProfile = id => MUSIC_FACTORY_PROFILES.find(item => item.id === id) ?? MUSIC_FACTORY_PROFILES[0]

export const musicFactoryGenreForPreset = preset => {
	const id = preset?.style ?? preset?.id ?? ''
	if (MUSIC_FACTORY_PROFILES.some(item => item.id === id)) return id
	if (/jazz|bossa|ragtime/.test(id)) return 'jazz'
	if (/blues/.test(id)) return 'blues'
	if (/reggae|dub/.test(id)) return 'reggae'
	if (/jungle|break|drum-and-bass/.test(id)) return 'drum-and-bass'
	if (/hip-hop|trap/.test(id)) return 'hip-hop'
	if (/ambient|dream|space|underwater/.test(id)) return 'ambient'
	if (/classical|piano|baroque|orchestra|medieval/.test(id)) return 'classical'
	if (/techno|house|disco/.test(id)) return 'house'
	if (/funk|afrobeat|highlife/.test(id)) return 'funk'
	if (/balkan|turkish|flamenco/.test(id)) return 'cyclic'
	return 'synth-pop'
}
