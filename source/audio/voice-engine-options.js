export const VOICE_ENGINE_OPTIONS = Object.freeze([
	['native', 'Native (Composite)'],
	['fm', 'FM (DX7)'],
	['yoshimi', 'Yoshimi (WAM)'],
	['wam2', 'TinySynth (WAM2)'],
	['supersonic', 'SuperSonic (SuperCollider)']
])

export const normaliseVoiceEngine = value => VOICE_ENGINE_OPTIONS.some(([id]) => id === value) ? value : 'native'
export const VOICE_ENGINE_PARTS = 16

// Thrown when a backend cannot start until the page is allowed to play audio.
export const VOICE_ENGINE_AUDIO_LOCKED = 'voice-engine-audio-locked'

// Every chord voice holds a part in the shared renderer. TinySynth reserves
// channel 10 for GM drums, so its 15 parts must fit every Person on any engine.
export const getVoicesPerPerson = (players=1, maximum=VOICE_ENGINE_PARTS) =>
	Math.max(1, Math.min(maximum, Math.floor((VOICE_ENGINE_PARTS-1)/Math.max(1,players))))
