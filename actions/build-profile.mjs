import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { zipSync } from 'fflate'
import { NOTE_FEEDBACK_COLOURS } from '../source/settings/palette.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const controlBarIconsRoot = join(projectRoot, 'source', 'assets', 'icons')
const profileTargets = Object.freeze([
	{
		key: 'xl',
		name: 'PhotoSYNTH — Stream Deck XL',
		outputRoot: join(projectRoot, 'static', 'PhotoSYNTH'),
		archivePath: join(projectRoot, 'static', 'PhotoSYNTH.streamDeckProfile'),
		profileId: '485CBCF2-1D0D-4E5E-99C2-C316CF7D1A1D',
		defaultProfileId: 'D6B45F35-C5A8-4ED5-8108-75D626225E84',
		deviceModel: '20GAT9901',
		deviceUuid: 'd8d6453a-1bf6-4a95-ab39-8ad70177a72c',
		columns: 8,
		rows: 4,
	},
	{
		key: 'standard',
		name: 'PhotoSYNTH — Stream Deck',
		outputRoot: join(projectRoot, 'static', 'PhotoSYNTH-Stream-Deck'),
		archivePath: join(projectRoot, 'static', 'PhotoSYNTH-Stream-Deck.streamDeckProfile'),
		profileId: 'E48337B1-793A-45E1-9F25-3AD942F1A3C8',
		defaultProfileId: '056C55EB-CFB8-4F79-A9F1-1D70ADDBB888',
		deviceModel: '20GAA9902',
		deviceUuid: '55ee4fd3-2f18-44f8-a9e2-b095c75f43c1',
		columns: 5,
		rows: 3,
	},
])

const pageIds = Object.freeze({
	home: 'DB46784D-474F-4B3C-A1BB-9FB25D8CCE13',
	players: '6B19584D-66C6-4C13-9B25-56E168A99467',
	visuals: '1133A94E-3F72-4A57-8A99-3CE0A705C727',
	notes: '63AFD86E-4218-4F14-B6B8-13C597A23B0B',
	chords: 'A5E4A9C1-42D7-4BE5-985A-A1D8824F3349',
	percussion: '29D46B46-17E4-46AA-9B84-8D1120AF0984',
	samples: 'E49AE621-9E86-45E5-9D68-75C4B35C68A0',
	sound: 'D777560A-8FC7-4E63-854B-712B324B8DB4',
})

const palette = Object.freeze({
	mode: '#8157e6',
	instrument: '#ef3f75',
	player: '#2ca9d6',
	timing: '#f29c38',
	visual: '#38b87c',
	performance: '#5078e8',
	chord: '#9b5de5',
	'percussion-low': '#ff5a36',
	'percussion-cymbal': '#f2c94c',
	'percussion-tom': '#38bdf8',
	sample: '#d45eb5',
	sound: '#d45eb5',
	system: '#6f7b8d',
})

const keyCodes = code => {
	if (/^Key[A-Z]$/.test(code)) {
		const value = code.charCodeAt(3)
		return { native: value, qt: value, virtual: value }
	}
	if (/^Digit[0-9]$/.test(code)) {
		const value = code.charCodeAt(5)
		return { native: value, qt: value, virtual: value }
	}
	const functionKey = /^F(1[3-9]|2[0-4])$/.exec(code)
	if (functionKey) {
		const number = Number.parseInt(functionKey[1], 10)
		return {
			native: 111 + number,
			qt: 16777263 + number,
			virtual: 111 + number,
		}
	}
	throw new Error(`Unsupported generated hotkey code: ${code}`)
}

const primary = (code, title, category, symbol, icon) => ({
	type: 'hotkey', code, title, category, symbol,
	icon,
	modifiers: { ctrl: true, alt: true, shift: true },
})
const player = (code, title, symbol, icon) => ({
	type: 'hotkey', code, title, category: 'player', symbol,
	icon,
	modifiers: { ctrl: true, alt: true, shift: false },
})
const plain = (code, title, category = 'performance', symbol = title, icon) => ({
	type: 'hotkey', code, title, category, symbol,
	icon,
	modifiers: { ctrl: false, alt: false, shift: false },
})

const modes = [
	plain('F13', 'Commands', 'mode', 'CMD', 'settings-24px.svg'),
	plain('F14', 'Notes', 'mode', '♪', 'music_note-24px.svg'),
	plain('F15', 'Notes High', 'mode', '♪+', 'music_note-24px.svg'),
	plain('F16', 'Chords', 'mode', '♬', 'piano-24px.svg'),
	plain('F17', 'Percussion', 'mode', 'DRM', 'auto_fix_high-24px.svg'),
	plain('F18', 'Samples', 'mode', 'SMP', 'audiotrack-24px.svg'),
]

const instruments = {
	previous: plain('F19', 'Previous\nInstrument', 'instrument', '◀', 'arrow_back.svg'),
	next: plain('F21', 'Next\nInstrument', 'instrument', '▶', 'forward_black_24dp.svg'),
	random: plain('F20', 'Random\nInstrument', 'instrument', '◆', 'casino.svg'),
}

const common = {
	drumPattern: primary('KeyD', 'Random Drum\nPattern', 'sound', 'PAT', 'grid_on-24px.svg'),
	drumSounds: primary('KeyE', 'Random Drum\nSounds', 'sound', 'SND', 'music_note-24px.svg'),
	backing: plain('F22', 'Backing\nBeat', 'timing', 'BEAT', 'auto_fix_high-24px.svg'),
	quantise: plain('F23', 'Quantise', 'timing', 'Q', 'grid_on-24px.svg'),
	metronome: primary('KeyH', 'Metronome', 'timing', 'MET', 'hourglass_empty-24px.svg'),
	fullscreen: primary('KeyI', 'Fullscreen', 'system', '⛶', 'fullscreen-24px.svg'),
	disco: primary('KeyJ', 'MTV Mode', 'visual', 'MTV', 'blur_on-24px.svg'),
	spectrogram: primary('KeyK', 'V.U. Display', 'visual', 'VU', 'graphic_eq_black_24dp.svg'),
	photosensitive: primary('KeyL', 'Safe Visuals', 'visual', 'SAFE'),
	clear: primary('KeyM', 'Clear Video', 'visual', 'CLR', 'videocam_off-24px.svg'),
	overlay: primary('KeyN', 'AR Overlay', 'visual', 'AR', 'visibility-24px.svg'),
	faces: primary('KeyO', 'Face\nOverlays', 'visual', 'FACE', 'face_retouching_off-24px.svg'),
	eyes: primary('KeyP', 'Eye\nOverlays', 'visual', 'EYE', 'motion_photos_off-24px.svg'),
	brows: primary('KeyQ', 'Eyebrow\nOverlays', 'visual', 'BROW', 'gesture.svg'),
	lips: primary('KeyR', 'Lip\nOverlays', 'visual', 'LIPS', 'mood.svg'),
	subtitles: primary('KeyS', 'Subtitles', 'visual', 'TXT', 'speaker_notes-24px.svg'),
	speech: primary('KeyT', 'Speech', 'system', 'VOICE', 'voice_over_off_black_24dp.svg'),
	hud: primary('KeyU', 'Input HUD', 'system', 'HUD', 'sensors_off-24px.svg'),
	automation: primary('KeyV', 'Automation', 'system', 'AUTO', 'autorenew_black_24dp.svg'),
	advanced: primary('KeyW', 'Advanced\nControls', 'system', 'ADV', 'equalizer.svg'),
	octaveDown: primary('KeyX', 'Number Octave\nDown', 'mode', 'OCT−', 'down_arrow_black_24dp.svg'),
	octaveUp: primary('KeyY', 'Number Octave\nUp', 'mode', 'OCT+', 'up_arrow_black_24dp.svg'),
	reverb: primary('KeyZ', 'Random\nReverb', 'sound', 'REV', 'extension-24px.svg'),
	cosmosPrevious: primary('Digit6', 'Previous COSMO\nBank', 'sound', 'BANK−'),
	cosmosNext: primary('Digit7', 'Next COSMO\nBank', 'sound', 'BANK+'),
	tempoDown: primary('Digit8', 'Tempo Down', 'timing', 'BPM−', 'down_arrow_black_24dp.svg'),
	tempoUp: primary('Digit9', 'Tempo Up', 'timing', 'BPM+', 'up_arrow_black_24dp.svg'),
	tapTempo: plain('F24', 'Tap Tempo', 'timing', 'TAP', 'fingerprint-24px.svg'),
	videoFrame: player('KeyA', 'Video Frame\nCopy', 'FRAME', 'camera_enhance-24px.svg'),
	videoOutput: player('KeyB', 'Video Output', 'VIDEO', 'videocam-24px.svg'),
	record: player('KeyC', 'Record Audio', 'REC', 'voicemail-24px.svg'),
	nodesDown: player('KeyD', 'Fewer Visual\nNodes', 'NODE−', 'down_arrow_black_24dp.svg'),
	nodesUp: player('KeyF', 'More Visual\nNodes', 'NODE+', 'up_arrow_black_24dp.svg'),
}

const players = [0, 1, 2, 3].map(index => ({
	select: player(`Digit${index + 1}`, `Select Player ${index + 1}`, `P${index + 1}`, 'person-24px.svg'),
	type: player(`Digit${index + 5}`, `Player ${index + 1}\nType`, `P${index + 1} TYPE`, 'mode.svg'),
	preset: player(['KeyQ', 'KeyW', 'KeyE', 'KeyR'][index], `Player ${index + 1}\nPreset`, `P${index + 1} ◆`, 'casino.svg'),
}))

const pads = Object.fromEntries('0123456789'.split('').map(number => [
	number,
	plain(`Digit${number}`, `Pad ${number}`, 'performance', number),
]))

const performanceKeyCodes = [
	...'1234567890'.split('').map(number => `Digit${number}`),
	...'QWERTYUIOP'.split('').map(letter => `Key${letter}`),
	...'ASDFGHJKL'.split('').map(letter => `Key${letter}`),
	...'ZXCVBNM'.split('').map(letter => `Key${letter}`),
]
const performanceKeyLabels = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
const musicalNoteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
const midiNoteName = noteNumber => (
	`${musicalNoteNames[noteNumber % 12]}${Math.floor(noteNumber / 12) - 1}`
)
const noteFeedbackColour = noteName => {
	const noteLetter = noteName.charAt(0).toUpperCase()
	const colour = NOTE_FEEDBACK_COLOURS[noteLetter]
	if (!colour) throw new Error(`Missing PhotoSYNTH note colour for ${noteName}`)
	return `hsl(${colour.h}, ${colour.s}%, ${colour.l}%)`
}
const keyboardNotes = performanceKeyCodes.map((code, index) => {
	const noteName = midiNoteName(48 + index)
	return {
		...plain(code, `${performanceKeyLabels[index]}\n${noteName}`, 'performance', noteName),
		colour: noteFeedbackColour(noteName),
	}
})
const chordFamilies = [
	{ end: 10, suffix: '', category: 'chord' },
	{ end: 20, suffix: 'm', category: 'chord' },
	{ end: 29, suffix: '7', category: 'chord' },
	{ end: 36, suffix: 'sus2', category: 'chord' },
]
const keyboardChords = performanceKeyCodes.map((code, index) => {
	const family = chordFamilies.find(item => index < item.end)
	const chordName = `${musicalNoteNames[(48 + index) % 12]}${family.suffix}`
	return plain(code, `${performanceKeyLabels[index]}\n${chordName}`, family.category, chordName)
})
const drumLabels = [
	['Sub Kick', 'SUB', 'percussion-low'], ['Kick', 'KICK', 'percussion-low'],
	['Punch Kick', 'PUNCH', 'percussion-low'], ['Low Tom', 'TOM L', 'percussion-low'],
	['Mid Tom', 'TOM M', 'percussion-low'], ['High Tom', 'TOM H', 'percussion-low'],
	['Snare', 'SNARE', 'percussion-low'], ['Rim', 'RIM', 'percussion-low'],
	['Clap', 'CLAP', 'percussion-low'], ['Clack', 'CLACK', 'percussion-low'],
	['Closed Hat', 'HAT', 'percussion-cymbal'], ['Open Hat', 'OPEN', 'percussion-cymbal'],
	['Shaker', 'SHAKE', 'percussion-cymbal'], ['Ride', 'RIDE', 'percussion-cymbal'],
	['Crash', 'CRASH', 'percussion-cymbal'], ['Short Hat', 'TICK', 'percussion-cymbal'],
	['Loose Hat', 'LOOSE', 'percussion-cymbal'], ['Bright Ride', 'RIDE+', 'percussion-cymbal'],
	['Dark Crash', 'CRASH−', 'percussion-cymbal'], ['Cowbell', 'BELL', 'percussion-cymbal'],
	['Low Tom Soft', 'LT SOFT', 'percussion-tom'], ['Low Tom Hard', 'LT HARD', 'percussion-tom'],
	['Mid Tom Soft', 'MT SOFT', 'percussion-tom'], ['Mid Tom Hard', 'MT HARD', 'percussion-tom'],
	['High Tom Soft', 'HT SOFT', 'percussion-tom'], ['High Tom Hard', 'HT HARD', 'percussion-tom'],
	['Soft Snare', 'SN SOFT', 'percussion-tom'], ['Hard Snare', 'SN HARD', 'percussion-tom'],
	['Dry Rim', 'DRY RIM', 'percussion-tom'], ['Long Kick FX', 'KICK FX', 'percussion-low'],
	['Noise Snare FX', 'SN FX', 'percussion-low'], ['Soft Clap', 'CLAP−', 'percussion-low'],
	['Low Bell', 'BELL L', 'percussion-cymbal'], ['Wood Block', 'WOOD', 'percussion-low'],
	['Long Shaker', 'SHAKE+', 'percussion-cymbal'], ['Splash', 'SPLASH', 'percussion-cymbal'],
]
const keyboardDrums = performanceKeyCodes.map((code, index) => {
	const [label, symbol, category] = drumLabels[index]
	return plain(code, `${performanceKeyLabels[index]}\n${label}`, category, symbol)
})
const sampleLabels = [
	['Anime Wow', 'WOW'], ['Applause', 'CLAP'], ['Ba Dum Tss', 'TSS'], ['Air Horn', 'HORN'],
	['Dramatic Thud', 'THUD'], ['Good', 'GOOD'], ['Sad Trombone', 'SAD'], ['Pop', 'POP'],
	['Roblox Death', 'OOF'], ['Coin Low', 'COIN'],
	...Array.from({ length: 10 }, (_, index) => [`Magic ${index + 1}`, `MAG ${index + 1}`]),
	...Array.from({ length: 9 }, (_, index) => [`Coin Pitch ${index + 2}`, `COIN ${index + 2}`]),
	...Array.from({ length: 7 }, (_, index) => [`Magic Cut ${index + 1}`, `CUT ${index + 1}`]),
]
const keyboardSamples = performanceKeyCodes.map((code, index) => {
	const [label, symbol] = sampleLabels[index]
	return plain(code, `${performanceKeyLabels[index]}\n${label}`, 'sample', symbol)
})

const pageDefinitions = [
	{
		id: pageIds.home,
		name: 'Home',
		actions: [
			...modes, instruments.previous, instruments.random, instruments.next,
			...players.map(item => item.select), ...players.map(item => item.preset),
			common.backing, common.quantise, common.metronome, common.tapTempo,
			common.tempoDown, common.tempoUp, common.drumPattern, common.drumSounds,
			common.fullscreen, common.disco, common.spectrogram, common.subtitles,
		],
	},
	{
		id: pageIds.players,
		name: 'Players',
		actions: [
			...players.map(item => item.select), ...players.map(item => item.type),
			...players.map(item => item.preset), instruments.previous, instruments.random, instruments.next, common.reverb,
			...modes, common.octaveDown, common.octaveUp,
			common.drumPattern, common.drumSounds, common.backing, common.quantise, common.metronome,
		],
	},
	{
		id: pageIds.visuals,
		name: 'Visuals',
		actions: [
			common.disco, common.spectrogram, common.clear, common.overlay,
			common.faces, common.eyes, common.brows, common.lips,
			common.subtitles, common.speech, common.hud, common.automation,
			common.advanced, common.fullscreen, common.photosensitive, instruments.random,
			common.videoFrame, common.videoOutput, common.record, common.nodesDown,
			common.nodesUp, common.reverb, common.drumPattern, common.drumSounds,
			common.backing, common.quantise, common.metronome, common.tapTempo, common.fullscreen,
		],
	},
	{
		id: pageIds.notes,
		name: 'Musical Keyboard',
		actions: [modes[1], ...keyboardNotes],
	},
	{
		id: pageIds.chords,
		name: 'Chord Keyboard',
		actions: [modes[3], ...keyboardChords],
	},
	{
		id: pageIds.percussion,
		name: 'Percussion Keyboard',
		actions: [modes[4], ...keyboardDrums],
	},
	{
		id: pageIds.samples,
		name: 'Sample Keyboard',
		actions: [modes[5], ...keyboardSamples],
	},
	{
		id: pageIds.sound,
		name: 'Sound and Tempo',
		actions: [
			modes[0], common.cosmosPrevious, common.cosmosNext,
			pads['0'], pads['1'], pads['2'], pads['3'], pads['4'],
			pads['5'], pads['6'], pads['7'], pads['8'], pads['9'],
			instruments.previous, instruments.random, instruments.next,
			common.drumPattern, common.drumSounds, common.backing, common.quantise,
			common.metronome, common.tapTempo, common.tempoDown, common.tempoUp,
			common.reverb, common.speech, common.fullscreen, instruments.random, common.hud,
		],
	},
]

const escapeXml = value => String(value)
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')

const iconFilename = (pageName, index, action) => {
	const hash = createHash('sha1')
		.update(`${pageName}:${index}:${action.title}:${action.code}`)
		.digest('hex')
		.slice(0, 18)
		.toUpperCase()
	return `${hash}.svg`
}

const controlBarIconCache = new Map()

const embedControlBarIcon = async (filename, accent) => {
	let source = controlBarIconCache.get(filename)
	if (!source) {
		source = await readFile(join(controlBarIconsRoot, filename), 'utf8')
		controlBarIconCache.set(filename, source)
	}
	const match = source.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/)
	if (!match) throw new Error(`Invalid control-bar SVG: ${filename}`)
	const viewBox = /viewBox="([^"]+)"/.exec(match[1])?.[1] ?? '0 0 24 24'
	const content = match[2]
		.replaceAll('#000000', accent)
		.replaceAll('#000', accent)
	return `<svg x="43" y="27" width="58" height="58" viewBox="${escapeXml(viewBox)}" fill="${accent}">${content}</svg>`
}

const createIcon = async (path, action) => {
	const accent = action.colour ?? palette[action.category] ?? palette.system
	const titleLines = action.title.split('\n').slice(0, 2)
	const title = titleLines.map((line, index) => (
		`<text x="72" y="${108 + index * 17}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${titleLines.length > 1 ? 14 : 16}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
	)).join('')
	const graphic = action.icon
		? await embedControlBarIcon(action.icon, accent)
		: `<circle cx="72" cy="59" r="31" fill="${accent}" opacity="0.18"/><text x="72" y="69" text-anchor="middle" font-family="Arial, sans-serif" font-size="${String(action.symbol).length > 4 ? 20 : 29}" font-weight="800" fill="${accent}">${escapeXml(action.symbol)}</text>`
	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
			<rect width="144" height="144" rx="18" fill="#11141b"/>
			<rect x="5" y="5" width="134" height="134" rx="15" fill="#171c26" stroke="${accent}" stroke-width="4"/>
			<rect x="14" y="14" width="116" height="7" rx="3.5" fill="${accent}"/>
			${graphic}
			${title}
		</svg>`
	await writeFile(path, svg)
}

const fillerHotkey = () => ({
	KeyCmd: false,
	KeyCtrl: false,
	KeyModifiers: 0,
	KeyOption: false,
	KeyShift: false,
	NativeCode: 146,
	QTKeyCode: 33554431,
	VKeyCode: -1,
})

const stableUuid = seed => {
	const hash = createHash('sha1').update(seed).digest('hex')
	return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

const makeHotkeyAction = (action, image) => {
	const modifiers = action.modifiers
	const codes = keyCodes(action.code)
	return {
		ActionID: stableUuid(`photosynth:hotkey:${image}`),
		LinkedTitle: false,
		Name: 'Hotkey',
		Plugin: {
			Name: 'Activate a Key Command',
			UUID: 'com.elgato.streamdeck.system.hotkey',
			Version: '1.0',
		},
		Resources: null,
		Settings: {
			Coalesce: true,
			Hotkeys: [
				{
					KeyCmd: false,
					KeyCtrl: modifiers.ctrl,
					KeyModifiers: (modifiers.shift ? 1 : 0) + (modifiers.ctrl ? 2 : 0) + (modifiers.alt ? 4 : 0),
					KeyOption: modifiers.alt,
					KeyShift: modifiers.shift,
					NativeCode: codes.native,
					QTKeyCode: codes.qt,
					VKeyCode: codes.virtual,
				},
				fillerHotkey(), fillerHotkey(), fillerHotkey(),
			],
		},
		State: 0,
		States: [{
			FontFamily: 'Arial',
			FontSize: 9,
			FontStyle: 'Bold',
			FontUnderline: false,
			Image: `Images/${image}`,
			OutlineThickness: 2,
			ShowTitle: false,
			Title: action.title.replaceAll('\n', ' '),
			TitleAlignment: 'bottom',
			TitleColor: '#ffffff',
		}],
		UUID: 'com.elgato.streamdeck.system.hotkey',
	}
}

const makeNavigationAction = (type, name, pageId) => ({
	ActionID: stableUuid(`photosynth:${pageId}:${type}`),
	LinkedTitle: true,
	Name: name,
	Settings: {},
	State: 0,
	States: [{}],
	UUID: `com.elgato.streamdeck.page.${type}`,
})

const makeIndicatorAction = pageId => ({
	ActionID: stableUuid(`photosynth:${pageId}:indicator`),
	LinkedTitle: true,
	Name: 'Page Indicator',
	Settings: {},
	State: 0,
	States: [{
		FontFamily: 'Arial',
		FontSize: 20,
		FontStyle: 'Bold',
		FontUnderline: false,
		OutlineThickness: 2,
		ShowTitle: true,
		TitleAlignment: 'middle',
		TitleColor: '#ffffff',
	}],
	UUID: 'com.elgato.streamdeck.page.indicator',
})

const controlsPerPage = target => target.columns * target.rows - 3

const coordinateForActionIndex = (index, target) => {
	const lastRow = target.rows - 1
	const controlsAboveNavigation = target.columns * lastRow
	if (index < controlsAboveNavigation) {
		return `${index % target.columns},${Math.floor(index / target.columns)}`
	}
	return `${index - controlsAboveNavigation + 3},${lastRow}`
}

const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, '\t')}\n`)

const buildPage = async (page, target) => {
	if (page.actions.length > controlsPerPage(target)) {
		throw new Error(`${page.name} exceeds the ${target.columns}x${target.rows} canvas`)
	}
	const pageRoot = join(target.outputRoot, 'Profiles', `${target.profileId}.sdProfile`, 'Profiles', page.id)
	const imagesRoot = join(pageRoot, 'Images')
	await mkdir(imagesRoot, { recursive: true })

	const navigationRow = target.rows - 1
	const actions = {
		[`0,${navigationRow}`]: makeNavigationAction('previous', 'Previous Page', page.id),
		[`1,${navigationRow}`]: makeNavigationAction('next', 'Next Page', page.id),
		[`2,${navigationRow}`]: makeIndicatorAction(page.id),
	}
	for (const [index, action] of page.actions.entries()) {
		const coordinate = coordinateForActionIndex(index, target)
		const image = iconFilename(page.name, index, action)
		await createIcon(join(imagesRoot, image), action)
		actions[coordinate] = makeHotkeyAction(action, image)
	}

	await writeJson(join(pageRoot, 'manifest.json'), {
		Controllers: [{ Actions: actions, Type: 'Keypad' }],
		Icon: '',
		Name: page.name,
	})
}

const collectFiles = async (root, outputRoot, files = {}) => {
	for (const entry of await readdir(root, { withFileTypes: true })) {
		const path = join(root, entry.name)
		if (entry.isDirectory()) {
			await collectFiles(path, outputRoot, files)
		}else{
			files[relative(outputRoot, path).replaceAll('\\', '/')] = new Uint8Array(await readFile(path))
		}
	}
	return files
}

const pagesForTarget = target => {
	const pageSize = controlsPerPage(target)
	return pageDefinitions.flatMap(page => {
		if (page.actions.length <= pageSize) return page
		const pageCount = Math.ceil(page.actions.length / pageSize)
		return Array.from({ length: pageCount }, (_, index) => ({
			id: stableUuid(`photosynth:${target.key}:${page.id}:${index}`).toUpperCase(),
			name: `${page.name} ${index + 1}/${pageCount}`,
			actions: page.actions.slice(index * pageSize, (index + 1) * pageSize),
		}))
	})
}

const buildTarget = async target => {
	const expectedRoot = resolve(projectRoot, 'static', target.key === 'xl' ? 'PhotoSYNTH' : 'PhotoSYNTH-Stream-Deck')
	if (resolve(target.outputRoot) !== expectedRoot) {
		throw new Error(`Refusing to replace unexpected profile path: ${target.outputRoot}`)
	}
	await rm(target.outputRoot, { recursive: true, force: true })
	await mkdir(target.outputRoot, { recursive: true })

	await writeJson(join(target.outputRoot, 'package.json'), {
		AppVersion: '7.4.2.22730',
		DeviceModel: target.deviceModel,
		DeviceSettings: null,
		FormatVersion: 1,
		OSType: 'Windows',
		OSVersion: '10.0.26200',
		RequiredPlugins: ['com.elgato.streamdeck.system.hotkey'],
	})

	const pages = pagesForTarget(target)
	const profileRoot = join(target.outputRoot, 'Profiles', `${target.profileId}.sdProfile`)
	await mkdir(join(profileRoot, 'Profiles', target.defaultProfileId), { recursive: true })
	await writeJson(join(profileRoot, 'manifest.json'), {
		Device: { Model: target.deviceModel, UUID: target.deviceUuid },
		Name: target.name,
		Pages: {
			Current: '00000000-0000-0000-0000-000000000000',
			Default: target.defaultProfileId.toLowerCase(),
			Pages: pages.map(page => page.id.toLowerCase()),
		},
		Version: '3.0',
	})
	await writeJson(join(profileRoot, 'Profiles', target.defaultProfileId, 'manifest.json'), {
		Controllers: [{ Actions: null, Type: 'Keypad' }], Icon: '', Name: '',
	})

	for (const page of pages) await buildPage(page, target)

	const files = await collectFiles(target.outputRoot, target.outputRoot)
	await writeFile(target.archivePath, Buffer.from(zipSync(files, {
		level: 9,
		mtime: new Date('2026-01-01T00:00:00Z'),
	})))
	console.info(`Built ${target.name}: ${pages.length} pages, ${pages.reduce((total, page) => total + page.actions.length, 0)} hotkeys and ${Object.keys(files).length} files`)
}

for (const target of profileTargets) await buildTarget(target)
