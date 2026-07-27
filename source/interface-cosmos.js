import { createSampleBankPlayer } from './audio/sample-bank-player.js'

const COSMOS_STATUS_ID = 'cosmos'

const MAGIC_SAMPLES = Object.freeze([
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

const MEME_SAMPLES = Object.freeze([
	null,
	['anime-wow', 'Anime Wow', 'anime-wow-sound-effect.mp3'],
	['applause', 'Applause', 'applause-4.mp3'],
	['rimshot', 'Ba Dum Tss', 'ba-dum-tss_87uziQL.mp3'],
	['air-horn', 'Air Horn', 'dragon-studio-air-horn-sound-effect-372453.mp3'],
	['thud', 'Dramatic Thud', 'dragon-studio-thud-sound-effect-405470.mp3'],
	['good', 'Good', 'freesound_community-good-6081.mp3'],
	['sad-trombone', 'Sad Trombone', 'freesound_community-wah-wah-sad-trombone-6347.mp3'],
	['pop', 'Pop', 'pop_7e9Is8L.mp3'],
	['roblox-death', 'Roblox Death', 'roblox-death-sound_1.mp3'],
])

const createMemeSamples = () =>
	MEME_SAMPLES.map(sample => sample && ({
		id: sample[0],
		label: sample[1],
		src: `./assets/audio/fx/meme/${sample[2]}`,
		interrupt: 'self',
	}))

const createMagicSamples = interrupt =>
	MAGIC_SAMPLES.map((filename, index) => ({
		id: `magic-${index}`,
		label: filename.replace(/\.[^.]+$/, '').replaceAll('-', ' '),
		src: `./assets/audio/fx/spells/${filename}`,
		interrupt,
	}))

const COIN_PLAYBACK_RATES = Object.freeze([0.5, 0.59, 0.67, 0.75, 0.84, 1, 1.19, 1.34, 1.5, 2])
const SHIFTED_NUMBER_FALLBACKS = Object.freeze({
	')': 0,
	'!': 1,
	'@': 2,
	'"': 2,
	'#': 3,
	'£': 3,
	'$': 4,
	'%': 5,
	'^': 6,
	'&': 7,
	'*': 8,
	'(': 9,
})

const DEFAULT_COSMOS_BANKS = Object.freeze([
	Object.freeze({
		id: 'meme',
		label: 'Popular Sounds',
		samples: createMemeSamples(),
	}),
	Object.freeze({
		id: 'magic',
		label: 'Magic',
		samples: createMagicSamples('self'),
	}),
	Object.freeze({
		id: 'magic-interrupt',
		label: 'Magic Monophonic',
		samples: createMagicSamples('all'),
	}),
	Object.freeze({
		id: 'coins',
		label: 'Coin Pitches',
		samples: COIN_PLAYBACK_RATES.map((playbackRate, index) => ({
			id: `coin-${index}`,
			label: `Coin ${index}`,
			src: './assets/audio/tracks/coin.wav',
			playbackRate,
			interrupt: 'self',
		})),
	}),
])

const getCosmosNumber = event => {
	const codeMatch = /^(?:Digit|Numpad)([0-9])$/.exec(event.code ?? '')
	if (codeMatch) return Number.parseInt(codeMatch[1], 10)
	if (/^[0-9]$/.test(event.key ?? '')) return Number.parseInt(event.key, 10)
	if (event.shiftKey && event.key in SHIFTED_NUMBER_FALLBACKS) {
		return SHIFTED_NUMBER_FALLBACKS[event.key]
	}
	return null
}

const isEditableEvent = event => {
	const path = event.composedPath?.() ?? [event.target]
	return path.some(element =>
		element?.matches?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')
	)
}

const runSwitchHook = (hook, index, event) => {
	if (typeof hook !== 'function') return
	try {
		Promise.resolve(hook(index, event)).catch(error => {
			console.error(`Cosmo switch ${index} hook failed`, error)
		})
	} catch (error) {
		console.error(`Cosmo switch ${index} hook failed`, error)
	}
}

const updateCosmosStatus = (application, player, detail, active = false) => {
	application.setInputStatus?.(COSMOS_STATUS_ID, {
		type: 'cosmos',
		label: 'Cosmo Switches',
		detail: detail ?? player.bank.label,
		connected: true,
		active,
		ttl: active ? 1200 : undefined,
	})
}

/**
 * Create the one keyboard-event entry point for all Cosmo HID switches.
 * The returned method reports whether it consumed the supplied event.
 */
export const createCosmosKeyboardHandler = (application, {
	banks = DEFAULT_COSMOS_BANKS,
	player,
	onSwitchDown,
	onSwitchUp,
} = {}) => {
	const samplePlayer = player ?? createSampleBankPlayer({
		banks,
		getContext: () => application.getAudioContext?.(),
		getDestination: () => application.getMasterMixdown?.(),
		beforePlay: () => application.resumeAudio?.(),
		load: application.loadAudioSample,
		play: application.playAudioSample,
	})
	const heldSwitches = new Set()

	application.cosmosSamplePlayer = samplePlayer
	updateCosmosStatus(application, samplePlayer)

	const selectAdjacentBank = direction => {
		const bank = direction < 0
			? samplePlayer.previousBank()
			: samplePlayer.nextBank()
		application.setFeedback?.(`Cosmo bank: ${bank.label}`, 0, 'cosmos')
		updateCosmosStatus(application, samplePlayer, bank.label, true)
		return true
	}

	return event => {
		if (event.type === 'blur') {
			for (const index of heldSwitches) {
				runSwitchHook(onSwitchUp, index, event)
				samplePlayer.release(index)
			}
			heldSwitches.clear()
			updateCosmosStatus(application, samplePlayer)
			return false
		}

		if (isEditableEvent(event)) return false

		if (
			event.type === 'keydown'
			&& event.ctrlKey
			&& (event.key === 'PageUp' || event.key === 'PageDown')
		) {
			if (event.repeat) return true
			return selectAdjacentBank(event.key === 'PageUp' ? -1 : 1)
		}

		const index = getCosmosNumber(event)
		if (index == null) return false

		if (event.type === 'keydown') {
			if (event.repeat || heldSwitches.has(index)) return true
			heldSwitches.add(index)
			runSwitchHook(onSwitchDown, index, event)
			const sample = samplePlayer.getSample(index)
			updateCosmosStatus(
				application,
				samplePlayer,
				`${samplePlayer.bank.label}: ${sample?.label ?? `Switch ${index}`}`,
				true,
			)
			samplePlayer.trigger(index).catch(error => {
				console.error(`Could not play Cosmo switch ${index}`, error)
				application.setFeedback?.(`Cosmo sound ${index} unavailable`, 0, 'cosmos')
			})
			return true
		}

		if (event.type === 'keyup' && heldSwitches.has(index)) {
			heldSwitches.delete(index)
			runSwitchHook(onSwitchUp, index, event)
			samplePlayer.release(index)
			updateCosmosStatus(application, samplePlayer)
			return true
		}

		return false
	}
}
