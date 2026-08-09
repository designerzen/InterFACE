import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { zipSync } from 'fflate'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const outputRoot = join(projectRoot, 'static', 'PhotoSYNTH')
const archivePath = join(projectRoot, 'static', 'PhotoSYNTH.streamDeckProfile')
const profileId = '485CBCF2-1D0D-4E5E-99C2-C316CF7D1A1D'
const defaultProfileId = 'D6B45F35-C5A8-4ED5-8108-75D626225E84'

const pageIds = Object.freeze({
	home: 'DB46784D-474F-4B3C-A1BB-9FB25D8CCE13',
	players: '6B19584D-66C6-4C13-9B25-56E168A99467',
	visuals: '1133A94E-3F72-4A57-8A99-3CE0A705C727',
	performance: '63AFD86E-4218-4F14-B6B8-13C597A23B0B',
	sound: 'D777560A-8FC7-4E63-854B-712B324B8DB4',
})

const palette = Object.freeze({
	mode: '#8157e6',
	instrument: '#ef3f75',
	player: '#2ca9d6',
	timing: '#f29c38',
	visual: '#38b87c',
	performance: '#5078e8',
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

const primary = (code, title, category, symbol) => ({
	type: 'hotkey', code, title, category, symbol,
	modifiers: { ctrl: true, alt: true, shift: true },
})
const player = (code, title, symbol) => ({
	type: 'hotkey', code, title, category: 'player', symbol,
	modifiers: { ctrl: true, alt: true, shift: false },
})
const plain = (code, title, category = 'performance', symbol = title) => ({
	type: 'hotkey', code, title, category, symbol,
	modifiers: { ctrl: false, alt: false, shift: false },
})

const modes = [
	plain('F13', 'Commands', 'mode', 'CMD'),
	plain('F14', 'Notes', 'mode', '♪'),
	plain('F15', 'Notes High', 'mode', '♪+'),
	plain('F16', 'Chords', 'mode', '♬'),
	plain('F17', 'Percussion', 'mode', 'DRM'),
]

const instruments = {
	previous: plain('F18', 'Previous\nInstrument', 'instrument', '◀'),
	next: plain('F20', 'Next\nInstrument', 'instrument', '▶'),
	random: plain('F19', 'Random\nInstrument', 'instrument', '◆'),
}

const common = {
	drumPattern: primary('KeyD', 'Random Drum\nPattern', 'sound', 'PAT'),
	drumSounds: primary('KeyE', 'Random Drum\nSounds', 'sound', 'SND'),
	backing: plain('F21', 'Backing\nBeat', 'timing', 'BEAT'),
	quantise: plain('F22', 'Quantise', 'timing', 'Q'),
	metronome: plain('F23', 'Metronome', 'timing', 'MET'),
	fullscreen: primary('KeyI', 'Fullscreen', 'system', '⛶'),
	disco: primary('KeyJ', 'MTV Mode', 'visual', 'MTV'),
	spectrogram: primary('KeyK', 'V.U. Display', 'visual', 'VU'),
	photosensitive: primary('KeyL', 'Safe Visuals', 'visual', 'SAFE'),
	clear: primary('KeyM', 'Clear Video', 'visual', 'CLR'),
	overlay: primary('KeyN', 'AR Overlay', 'visual', 'AR'),
	faces: primary('KeyO', 'Face\nOverlays', 'visual', 'FACE'),
	eyes: primary('KeyP', 'Eye\nOverlays', 'visual', 'EYE'),
	brows: primary('KeyQ', 'Eyebrow\nOverlays', 'visual', 'BROW'),
	lips: primary('KeyR', 'Lip\nOverlays', 'visual', 'LIPS'),
	subtitles: primary('KeyS', 'Subtitles', 'visual', 'TXT'),
	speech: primary('KeyT', 'Speech', 'system', 'VOICE'),
	hud: primary('KeyU', 'Input HUD', 'system', 'HUD'),
	automation: primary('KeyV', 'Automation', 'system', 'AUTO'),
	advanced: primary('KeyW', 'Advanced\nControls', 'system', 'ADV'),
	octaveDown: primary('KeyX', 'Number Octave\nDown', 'mode', 'OCT−'),
	octaveUp: primary('KeyY', 'Number Octave\nUp', 'mode', 'OCT+'),
	reverb: primary('KeyZ', 'Random\nReverb', 'sound', 'REV'),
	cosmosPrevious: primary('Digit6', 'Previous COSMO\nBank', 'sound', 'BANK−'),
	cosmosNext: primary('Digit7', 'Next COSMO\nBank', 'sound', 'BANK+'),
	tempoDown: primary('Digit8', 'Tempo Down', 'timing', 'BPM−'),
	tempoUp: primary('Digit9', 'Tempo Up', 'timing', 'BPM+'),
	tapTempo: plain('F24', 'Tap Tempo', 'timing', 'TAP'),
	videoFrame: player('KeyA', 'Video Frame\nCopy', 'FRAME'),
	videoOutput: player('KeyB', 'Video Output', 'VIDEO'),
	record: player('KeyC', 'Record Audio', 'REC'),
	nodesDown: player('KeyD', 'Fewer Visual\nNodes', 'NODE−'),
	nodesUp: player('KeyF', 'More Visual\nNodes', 'NODE+'),
}

const players = [0, 1, 2, 3].map(index => ({
	select: player(`Digit${index + 1}`, `Select Player ${index + 1}`, `P${index + 1}`),
	type: player(`Digit${index + 5}`, `Player ${index + 1}\nType`, `P${index + 1} TYPE`),
	preset: player(['KeyQ', 'KeyW', 'KeyE', 'KeyR'][index], `Player ${index + 1}\nPreset`, `P${index + 1} ◆`),
}))

const pads = Object.fromEntries('0123456789'.split('').map(number => [
	number,
	plain(`Digit${number}`, `Pad ${number}`, 'performance', number),
]))

const notes = Object.fromEntries('zsxdcvgbhnjmqwertyui'.split('').map(letter => [
	letter,
	plain(`Key${letter.toUpperCase()}`, `Note ${letter.toUpperCase()}`, 'performance', letter.toUpperCase()),
]))

const pageDefinitions = [
	{
		id: pageIds.home,
		name: 'Home',
		actions: [
			...modes, instruments.previous, instruments.random, instruments.next,
			...players.map(item => item.select), ...players.map(item => item.preset),
			common.backing, common.quantise, common.metronome, common.tapTempo,
			common.tempoDown, common.tempoUp, common.drumPattern, common.drumSounds,
			common.fullscreen, common.disco, common.spectrogram, common.subtitles, common.speech,
		],
	},
	{
		id: pageIds.players,
		name: 'Players',
		actions: [
			...players.map(item => item.select), ...players.map(item => item.type),
			...players.map(item => item.preset), instruments.previous, instruments.random, instruments.next, common.reverb,
			...modes, common.octaveDown, common.octaveUp, common.fullscreen,
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
		id: pageIds.performance,
		name: 'Performance',
		actions: [
			...modes, common.octaveDown, common.octaveUp, instruments.random,
			pads['1'], pads['2'], pads['3'], pads['4'], pads['5'], pads['6'], pads['7'], pads['8'],
			pads['9'], pads['0'], notes.z, notes.s, notes.x, notes.d, notes.c, notes.v,
			notes.g, notes.b, notes.h, notes.n, notes.j,
		],
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

const createIcon = async (path, action) => {
	const accent = palette[action.category] ?? palette.system
	const titleLines = action.title.split('\n').slice(0, 2)
	const title = titleLines.map((line, index) => (
		`<text x="72" y="${108 + index * 17}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${titleLines.length > 1 ? 14 : 16}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
	)).join('')
	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
			<rect width="144" height="144" rx="18" fill="#11141b"/>
			<rect x="5" y="5" width="134" height="134" rx="15" fill="#171c26" stroke="${accent}" stroke-width="4"/>
			<rect x="14" y="14" width="116" height="7" rx="3.5" fill="${accent}"/>
			<circle cx="72" cy="59" r="31" fill="${accent}" opacity="0.18"/>
			<text x="72" y="69" text-anchor="middle" font-family="Arial, sans-serif" font-size="${String(action.symbol).length > 4 ? 20 : 29}" font-weight="800" fill="${accent}">${escapeXml(action.symbol)}</text>
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

const coordinateForActionIndex = index => {
	if (index < 24) return `${index % 8},${Math.floor(index / 8)}`
	return `${index - 21},3`
}

const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, '\t')}\n`)

const buildPage = async page => {
	if (page.actions.length !== 29) {
		throw new Error(`${page.name} must define exactly 29 controls; received ${page.actions.length}`)
	}
	const pageRoot = join(outputRoot, 'Profiles', `${profileId}.sdProfile`, 'Profiles', page.id)
	const imagesRoot = join(pageRoot, 'Images')
	await mkdir(imagesRoot, { recursive: true })

	const actions = {
		'0,3': makeNavigationAction('previous', 'Previous Page', page.id),
		'1,3': makeNavigationAction('next', 'Next Page', page.id),
		'2,3': makeIndicatorAction(page.id),
	}
	for (const [index, action] of page.actions.entries()) {
		const coordinate = coordinateForActionIndex(index)
		const image = iconFilename(page.name, index, action)
		await createIcon(join(imagesRoot, image), action)
		actions[coordinate] = makeHotkeyAction(action, image)
	}
	if (Object.keys(actions).length !== 32) throw new Error(`${page.name} does not fill the XL canvas`)

	await writeJson(join(pageRoot, 'manifest.json'), {
		Controllers: [{ Actions: actions, Type: 'Keypad' }],
		Icon: '',
		Name: page.name,
	})
}

const collectFiles = async (root, files = {}) => {
	for (const entry of await readdir(root, { withFileTypes: true })) {
		const path = join(root, entry.name)
		if (entry.isDirectory()) {
			await collectFiles(path, files)
		}else{
			files[relative(outputRoot, path).replaceAll('\\', '/')] = new Uint8Array(await readFile(path))
		}
	}
	return files
}

const build = async () => {
	if (resolve(outputRoot) !== resolve(projectRoot, 'static', 'PhotoSYNTH')) {
		throw new Error(`Refusing to replace unexpected profile path: ${outputRoot}`)
	}
	await rm(outputRoot, { recursive: true, force: true })
	await mkdir(outputRoot, { recursive: true })

	await writeJson(join(outputRoot, 'package.json'), {
		AppVersion: '7.4.2.22730',
		DeviceModel: '20GAT9901',
		DeviceSettings: null,
		FormatVersion: 1,
		OSType: 'Windows',
		OSVersion: '10.0.26200',
		RequiredPlugins: ['com.elgato.streamdeck.system.hotkey'],
	})

	const profileRoot = join(outputRoot, 'Profiles', `${profileId}.sdProfile`)
	await mkdir(join(profileRoot, 'Profiles', defaultProfileId), { recursive: true })
	await writeJson(join(profileRoot, 'manifest.json'), {
		Device: { Model: '20GAT9901', UUID: 'd8d6453a-1bf6-4a95-ab39-8ad70177a72c' },
		Name: 'PhotoSYNTH',
		Pages: {
			Current: '00000000-0000-0000-0000-000000000000',
			Default: defaultProfileId.toLowerCase(),
			Pages: pageDefinitions.map(page => page.id.toLowerCase()),
		},
		Version: '3.0',
	})
	await writeJson(join(profileRoot, 'Profiles', defaultProfileId, 'manifest.json'), {
		Controllers: [{ Actions: null, Type: 'Keypad' }], Icon: '', Name: '',
	})

	for (const page of pageDefinitions) await buildPage(page)

	const files = await collectFiles(outputRoot)
	await writeFile(archivePath, Buffer.from(zipSync(files, {
		level: 9,
		mtime: new Date('2026-01-01T00:00:00Z'),
	})))
	console.info(`Built ${pageDefinitions.length} pages, ${pageDefinitions.length * 29} hotkeys and ${Object.keys(files).length} files`)
}

await build()
