import {
	PERCUSSION_PRESETS,
	PERCUSSION_MACHINE_PRESETS,
	PERCUSSION_SOUND_PRESETS,
	PERCUSSION_SOUND_PRESET_GROUPS,
	getPercussionPreset,
	getPercussionSoundAggression,
} from '../source/audio/synthesizers/percussion-presets.js'
import { PRESETS_KICKS } from '../source/audio/synthesizers/kick-presets.js'
import { PRESET_SNARES } from '../source/audio/synthesizers/snare-presets.js'
import {
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_CASIO_RZ1,
	CLOSED_HIHAT_OBERHEIM_DMX,
	PRESET_HIHATS,
	getHihatPair,
} from '../source/audio/synthesizers/hihat-presets.js'
import { PRESET_COWBELLS } from '../source/audio/synthesizers/cowbell-presets.js'
import { PRESET_BONGOS, PRESET_CONGAS } from '../source/audio/synthesizers/hand-drum-presets.js'
import { PRESET_SHAKERS } from '../source/audio/synthesizers/shaker-presets.js'
import { PRESET_TRIANGLES } from '../source/audio/synthesizers/triangle-presets.js'
import { DRUM_GROOVES } from '../source/timing/drum-patterns.js'

describe('percussion presets', () => {
	test('includes the space-themed drum kits', () => {
		expect(PERCUSSION_PRESETS.length).toBeGreaterThanOrEqual(19)
		expect(PERCUSSION_PRESETS.filter(preset => preset.group === 'Space').length).toBeGreaterThanOrEqual(7)
		expect(PERCUSSION_PRESETS.map(preset => preset.id)).toEqual(expect.arrayContaining([
			'lunar-drift', 'nebula', 'solar-flare', 'deep-space', 'moon-base', 'ion-storm', 'orbital-dawn'
		]))
	})

	test('finds presets by id or display name', () => {
		expect(getPercussionPreset('solar-flare')?.title).toBe('Solar Flare')
		expect(getPercussionPreset('Deep Space')?.id).toBe('deep-space')
		expect(getPercussionPreset('DEEP_space')?.id).toBe('deep-space')
		expect(getPercussionPreset('Roland TR-808')?.id).toBe('roland-tr-808')
		expect(getPercussionPreset('')).toBeNull()
		expect(getPercussionPreset(null)).toBeNull()
		expect(getPercussionPreset('unknown')).toBeNull()
	})

	test('uses exact, unique voice names for every kit reference', () => {
		const presetsByPart = {
			kick:PRESETS_KICKS,
			snare:PRESET_SNARES,
			hat:PRESET_HIHATS,
			cowbell:PRESET_COWBELLS,
			bongoLow:PRESET_BONGOS,
			bongoHigh:PRESET_BONGOS,
			congaLow:PRESET_CONGAS,
			congaHigh:PRESET_CONGAS,
			congaMute:PRESET_CONGAS,
			cabasa:PRESET_SHAKERS,
			maracas:PRESET_SHAKERS,
			triangleMute:PRESET_TRIANGLES,
			triangleOpen:PRESET_TRIANGLES,
		}

		for (const [part, presets] of Object.entries(presetsByPart))
		{
			const names = presets.map(preset => preset.name)
			expect(new Set(names).size).toBe(names.length)
			for (const percussionPreset of [...PERCUSSION_PRESETS, ...PERCUSSION_MACHINE_PRESETS])
			{
				if (percussionPreset.kit[part])
				{
					expect(names).toContain(percussionPreset.kit[part])
				}
			}
		}
	})

	test('includes named classic, electronic and regional grooves', () => {
		expect(PERCUSSION_PRESETS.map(preset => preset.id)).toEqual(expect.arrayContaining([
			'amen-break', 'think-break', 'funky-drummer', 'apache-break',
			'uk-garage', 'dubstep-half-time', 'breakstep', 'electro-funk',
			'samba-batucada', 'one-drop-reggae', 'jazz-swing', 'bossa-nova',
			'salsa-mambo-727', 'son-montuno', 'cha-cha-727', 'rumba-guaguanco',
			'cumbia-percussion', 'latin-electro-808', '727-latin-box'
		]))
		expect(PERCUSSION_PRESETS.filter(preset => preset.groove).length).toBeGreaterThanOrEqual(24)
	})

	test('every pattern collection references a defined groove', () => {
		for (const preset of PERCUSSION_PRESETS) {
			if (preset.groove) expect(DRUM_GROOVES[preset.groove]).toBeDefined()
		}
	})

	test('uses specific regional group names instead of a world catch-all', () => {
		expect(PERCUSSION_PRESETS.some(preset => preset.group === 'World')).toBe(false)
		expect(PERCUSSION_PRESETS.find(preset => preset.id === 'samba-batucada')?.group).toBe('Brazilian')
		expect(PERCUSSION_PRESETS.find(preset => preset.id === 'one-drop-reggae')?.group).toBe('Jamaican')
		expect(PERCUSSION_PRESETS.find(preset => preset.id === 'afrobeat')?.group).toBe('West African')
	})

	test('includes dedicated vintage machine sound kits', () => {
		expect(PERCUSSION_MACHINE_PRESETS.map(preset => preset.id)).toEqual(expect.arrayContaining([
			'roland-tr-909', 'roland-tr-808', 'roland-tr-707', 'roland-tr-606',
			'roland-tr-505', 'roland-cr-78', 'casio-rz-1', 'korg-ddd-1',
			'roland-tr-707-727',
			'korg-kr-55', 'linndrum', 'boss-dr-55', 'oberheim-dmx',
			'sequential-drumtraks', 'emu-sp-1200',
			'yamaha-rx5', 'alesis-hr-16', 'simmons-sds-v'
		]))
		expect(PERCUSSION_MACHINE_PRESETS.every(preset => preset.soundOnly)).toBe(true)
	})

	test('pairs machine closed and open hats by name rather than array position', () => {
		expect(getHihatPair(CLOSED_HIHAT_808).open.name).toBe('808 Open Hihat')
		expect(getHihatPair(CLOSED_HIHAT_CASIO_RZ1).open.name).toBe('Casio RZ-1 Open Hihat')
		expect(getHihatPair(CLOSED_HIHAT_OBERHEIM_DMX).open.name).toBe('Oberheim DMX Open Hihat')
	})

	test('includes the expanded breaks and style library', () => {
		expect(PERCUSSION_PRESETS.map(preset => preset.id)).toEqual(expect.arrayContaining([
			'hot-pants-break', 'impeach-president', 'synthetic-substitution',
			'soul-pride', 'cold-sweat', 'ashleys-roachclip',
			'studio-54-disco', 'motown-pocket', 'afrobeat',
			'trap', 'chicago-footwork', 'punk-rock'
		]))
	})

	test('includes soul, clave and shuffle classics', () => {
		expect(PERCUSSION_PRESETS.map(preset => preset.id)).toEqual(expect.arrayContaining([
			'back-to-life', 'bo-diddley-beat', 'purdie-shuffle',
			'mardi-gras-break', 'levee-break', 'simple-song-break',
			'handclapping-break', 'funky-mule'
		]))
		expect(PERCUSSION_PRESETS.filter(preset => preset.groove).length).toBeGreaterThanOrEqual(32)
	})

	test('orders sound presets from softest to most aggressive', () => {
		const aggression = PERCUSSION_SOUND_PRESETS.map(getPercussionSoundAggression)
		expect(aggression).toEqual(aggression.slice().sort((a, b) => a - b))

		const ids = PERCUSSION_SOUND_PRESETS.map(preset => preset.id)
		expect(ids.indexOf('lunar-drift')).toBeLessThan(ids.indexOf('industrial-core'))
		expect(ids.indexOf('brushes-and-dust')).toBeLessThan(ids.indexOf('hardstyle-impact'))
	})

	test('groups every sound preset once with drum machines in their own optgroup', () => {
		const groupsByName = new Map(PERCUSSION_SOUND_PRESET_GROUPS.map(group => [group.group, group.presets]))
		const groupedPresets = PERCUSSION_SOUND_PRESET_GROUPS.flatMap(group => group.presets)
		expect(groupsByName.get('Drum Machines')).toEqual(PERCUSSION_MACHINE_PRESETS.slice().sort(
			(a, b) => getPercussionSoundAggression(a) - getPercussionSoundAggression(b)
		))
		expect(groupedPresets).toHaveLength(PERCUSSION_SOUND_PRESETS.length)
		expect(new Set(groupedPresets).size).toBe(PERCUSSION_SOUND_PRESETS.length)

		for (const presets of groupsByName.values())
		{
			const aggression = presets.map(getPercussionSoundAggression)
			expect(aggression).toEqual(aggression.slice().sort((a, b) => a - b))
		}
	})
})
