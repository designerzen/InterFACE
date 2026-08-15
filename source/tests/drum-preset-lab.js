import * as kickPresets from '../audio/synthesizers/kick-presets.js'
import * as snarePresets from '../audio/synthesizers/snare-presets.js'
import * as hihatPresets from '../audio/synthesizers/hihat-presets.js'
import * as clapPresets from '../audio/synthesizers/clap-presets.js'
import * as clackPresets from '../audio/synthesizers/clack-presets.js'
import * as cowbellPresets from '../audio/synthesizers/cowbell-presets.js'
import * as tomPresets from '../audio/synthesizers/tom-presets.js'
import * as handDrumPresets from '../audio/synthesizers/hand-drum-presets.js'
import * as shakerPresets from '../audio/synthesizers/shaker-presets.js'
import * as trianglePresets from '../audio/synthesizers/triangle-presets.js'
import * as jinglePresets from '../audio/synthesizers/jingle-presets.js'
import * as scrapePresets from '../audio/synthesizers/scrape-presets.js'
import * as frictionDrumPresets from '../audio/synthesizers/friction-drum-presets.js'
import * as whistlePresets from '../audio/synthesizers/whistle-presets.js'
import * as chimePresets from '../audio/synthesizers/chime-presets.js'
import * as electronicPercussionPresets from '../audio/synthesizers/electronic-percussion-presets.js'

const isPreset = ([exportName, value]) =>
	/^(DEFAULT|PRESET)_/.test(exportName)
	&& value != null
	&& !Array.isArray(value)
	&& typeof value === 'object'
	&& typeof value.name === 'string'

const isPresetValue = value =>
	value != null
	&& !Array.isArray(value)
	&& typeof value === 'object'
	&& typeof value.name === 'string'

export const collectPresetExports = (module, collection) => {
	const entries = Object.entries(module)
	const candidates = collection
		? collection.map(value => {
			const entry = entries.find(([, exportedValue]) => exportedValue === value)
			if (!entry || !isPresetValue(value)) return null
			return { exportName:entry[0], value }
		}).filter(Boolean)
		: entries.filter(isPreset).map(([exportName, value]) => ({ exportName, value }))
	const presets = new WeakSet()
	return candidates
		.filter(({ value }) => {
			if (presets.has(value)) return false
			presets.add(value)
			return true
		})
}

const instrument = (id, label, factory, load, module, importPath, collection) => Object.freeze({
	id,
	label,
	factory,
	load,
	importPath,
	presets:Object.freeze(collectPresetExports(module, collection)),
})

export const DRUM_LAB_INSTRUMENTS = Object.freeze([
	instrument('kick', 'Kick', 'createKick', () => import('../audio/synthesizers/kick.js'), kickPresets, './audio/synthesizers/kick.js', kickPresets.PRESETS_KICKS),
	instrument('snare', 'Snare', 'createSnare', () => import('../audio/synthesizers/snare.js'), snarePresets, './audio/synthesizers/snare.js', snarePresets.PRESET_SNARES),
	instrument('hihat', 'Hi-hat & Cymbals', 'createHihat', () => import('../audio/synthesizers/hihat.js'), hihatPresets, './audio/synthesizers/hihat.js', hihatPresets.PRESET_HIHATS),
	instrument('clap', 'Clap & Snap', 'createClap', () => import('../audio/synthesizers/clap.js'), clapPresets, './audio/synthesizers/clap.js', clapPresets.PRESET_CLAPS),
	instrument('clack', 'Clack, Sticks & Blocks', 'createClack', () => import('../audio/synthesizers/clack.js'), clackPresets, './audio/synthesizers/clack.js', clackPresets.PRESET_CLACKS),
	instrument('cowbell', 'Cowbell & Agogo', 'createCowbell', () => import('../audio/synthesizers/cowbell.js'), cowbellPresets, './audio/synthesizers/cowbell.js', cowbellPresets.PRESET_COWBELLS),
	instrument('tom', 'Tom, Timbale & Surdo', 'createTom', () => import('../audio/synthesizers/tom.js'), tomPresets, './audio/synthesizers/tom.js', tomPresets.PRESETS_TOMS),
	instrument('handDrum', 'Conga & Bongo', 'createHandDrum', () => import('../audio/synthesizers/hand-drum.js'), handDrumPresets, './audio/synthesizers/hand-drum.js', [handDrumPresets.DEFAULT_HAND_DRUM_OPTIONS, ...handDrumPresets.PRESET_CONGAS, ...handDrumPresets.PRESET_BONGOS]),
	instrument('shaker', 'Shaker, Maracas & Cabasa', 'createShaker', () => import('../audio/synthesizers/shaker.js'), shakerPresets, './audio/synthesizers/shaker.js', shakerPresets.PRESET_SHAKERS),
	instrument('triangle', 'Triangle', 'createTriangle', () => import('../audio/synthesizers/triangle.js'), trianglePresets, './audio/synthesizers/triangle.js', trianglePresets.PRESET_TRIANGLES),
	instrument('jingle', 'Tambourine & Chekere', 'createJingle', () => import('../audio/synthesizers/jingle.js'), jinglePresets, './audio/synthesizers/jingle.js', [jinglePresets.DEFAULT_JINGLE_OPTIONS, ...jinglePresets.PRESET_JINGLES]),
	instrument('scrape', 'Guiro & Quijada', 'createScrape', () => import('../audio/synthesizers/scrape.js'), scrapePresets, './audio/synthesizers/scrape.js', scrapePresets.PRESET_SCRAPES),
	instrument('frictionDrum', 'Cuica', 'createFrictionDrum', () => import('../audio/synthesizers/friction-drum.js'), frictionDrumPresets, './audio/synthesizers/friction-drum.js', frictionDrumPresets.PRESET_FRICTION_DRUMS),
	instrument('whistle', 'Whistle', 'createWhistle', () => import('../audio/synthesizers/whistle.js'), whistlePresets, './audio/synthesizers/whistle.js', [whistlePresets.DEFAULT_WHISTLE_OPTIONS, ...whistlePresets.PRESET_WHISTLES]),
	instrument('chime', 'Chimes', 'createChime', () => import('../audio/synthesizers/chime.js'), chimePresets, './audio/synthesizers/chime.js', [chimePresets.DEFAULT_CHIME_OPTIONS, ...chimePresets.PRESET_CHIMES]),
	instrument('electronicPercussion', 'Electronic Percussion', 'createElectronicPercussion', () => import('../audio/synthesizers/electronic-percussion.js'), electronicPercussionPresets, './audio/synthesizers/electronic-percussion.js', electronicPercussionPresets.PRESET_ELECTRONIC_PERCUSSION),
])

export const clonePreset = preset => structuredClone(preset)

const PITCH_SCALARS = Object.freeze({
	kick:Object.freeze(['triStart', 'triEnd', 'sineStart', 'sineApex', 'sineSustain', 'sineEnd']),
	snare:Object.freeze(['bandpassStart', 'bandpassEnd', 'triStart', 'triEnd', 'highpassStart', 'highpassEnd', 'crackFrequency', 'crackEnd']),
	hihat:Object.freeze(['fundamental']),
	clap:Object.freeze(['highpass', 'bandpass', 'frequencyStart', 'frequencyEnd']),
	clack:Object.freeze(['bandpass', 'highpass']),
	cowbell:Object.freeze(['bandpass']),
	tom:Object.freeze(['triStart', 'triEnd', 'sineStart', 'sineApex', 'sineSustain', 'sineEnd']),
	handDrum:Object.freeze(['frequency', 'noiseFrequency']),
	shaker:Object.freeze(['bandpass', 'highpass']),
	triangle:Object.freeze(['frequency']),
	jingle:Object.freeze(['bandpass', 'highpass']),
	scrape:Object.freeze(['bandpass', 'highpass', 'bodyFrequency']),
	frictionDrum:Object.freeze(['startFrequency', 'endFrequency', 'noiseFrequency']),
	whistle:Object.freeze(['startFrequency', 'endFrequency', 'breathFrequency']),
	chime:Object.freeze(['frequency', 'highpass']),
	electronicPercussion:Object.freeze(['startFrequency', 'endFrequency', 'noiseFrequency']),
})

const PITCH_ARRAYS = Object.freeze({
	clack:Object.freeze(['ratios']),
	cowbell:Object.freeze(['ratios']),
	jingle:Object.freeze(['frequencies']),
})

const scaleFrequency = (value, ratio) => Math.min(18000, Math.max(20, value * ratio))

export const getPitchedPresetOptions = (instrumentId, preset, noteNumber, rootNoteNumber=60) => {
	const pitched = clonePreset(preset)
	const ratio = 2 ** ((noteNumber - rootNoteNumber) / 12)
	for (const property of PITCH_SCALARS[instrumentId] ?? []) {
		if (Number.isFinite(pitched[property])) pitched[property] = scaleFrequency(pitched[property], ratio)
	}
	for (const property of PITCH_ARRAYS[instrumentId] ?? []) {
		if (Array.isArray(pitched[property])) {
			pitched[property] = pitched[property].map(value => Number.isFinite(value)
				? scaleFrequency(value, ratio)
				: value)
		}
	}
	return pitched
}

export const getNumericRange = (property, presets, value) => {
	const values = presets.map(preset => preset[property]).filter(Number.isFinite)
	const observedMin = values.length ? Math.min(...values) : value
	const observedMax = values.length ? Math.max(...values) : value
	const positive = observedMin >= 0 && value >= 0
	const min = positive ? 0 : Math.min(observedMin * 1.5, value * 1.5)
	const naturalMax = Math.max(observedMax, Math.abs(value), 0.01)
	const max = naturalMax * (naturalMax < 2 ? 2 : 1.5)
	const span = Math.max(0.001, max - min)
	const step = span <= 0.02 ? 0.0001 : span <= 2 ? 0.001 : span <= 20 ? 0.01 : span <= 200 ? 0.1 : 1
	return { min, max, step }
}

const constantName = name => `CUSTOM_${String(name || 'DRUM_PRESET')
	.toUpperCase()
	.replace(/[^A-Z0-9]+/g, '_')
	.replace(/^_|_$/g, '')}`

export const createPresetCode = (instrument, options) => {
	const factory = instrument.factory
	const constant = constantName(options.name)
	const serialized = JSON.stringify(options, null, '\t')
	return `import { ${factory} } from '${instrument.importPath}'\n\nexport const ${constant} = ${serialized}\n\nconst voice = ${factory}(audioContext, output)\nvoice(${constant})`
}
