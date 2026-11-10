// Shared immutable requirements: only sample the analyser domains a view uses.
export const VISUALISER_MODES = Object.freeze([
	{ id:'vu', label:'VU', frequency:true, fftSize:256 },
	{ id:'spectrum', label:'Spectrum', frequency:true },
	{ id:'mirror', label:'Mirror', frequency:true },
	{ id:'wave', label:'Waveform', time:true },
	{ id:'radial', label:'Radial', frequency:true },
	{ id:'hybrid', label:'Spectrum + Wave', frequency:true, time:true },
	{ id:'curve', label:'Spectrum Contour', frequency:true },
	{ id:'peaks', label:'Peak Hold', frequency:true },
	{ id:'envelope', label:'Waveform Envelope', time:true },
	{ id:'wave-ring', label:'Wave Ring', time:true },
	{ id:'phase', label:'Phase Scope', time:true },
	{ id:'orbit', label:'Harmonic Orbit', frequency:true, time:true },
	{ id:'lattice', label:'Spectral Mosaic', frequency:true },
	{ id:'butterchurn', label:'Butterchurn', renderer:'butterchurn', blendMode:'source-over', preset:"Flexi, martin + geiss - dedicated to the sherwin maxawow" },
	{ id:'butterchurn-screen', label:'Psychedelic Brass Rubbing', renderer:'butterchurn', blendMode:'screen', preset:"Flexi - smashing fractals [acid etching mix]" },
	{ id:'butterchurn-lighter', label:'Neon Soup', renderer:'butterchurn', blendMode:'lighter', preset:"flexi + fishbrain - neon mindblob grafitti" },
	{ id:'butterchurn-multiply', label:'Stained Glass Marmalade', renderer:'butterchurn', blendMode:'multiply', preset:"Eo.S. + Zylot - skylight (Stained Glass Majesty mix)" },
	{ id:'butterchurn-overlay', label:'Kaleidoscope Sandwich', renderer:'butterchurn', blendMode:'overlay', preset:"Phat+fiShbRaiN+Eo.S_Mandala_Chasers_remix" },
	{ id:'butterchurn-soft-light', label:'Velvet Aurora', renderer:'butterchurn', blendMode:'soft-light', preset:"martin - angel flight" },
	{ id:'butterchurn-hard-light', label:'Electric Picnic', renderer:'butterchurn', blendMode:'hard-light', preset:"Eo.S. - glowsticks v2 05 and proton lights (+Krash′s beat code) _Phat_remix02b" },
	{ id:'butterchurn-difference', label:'Inside-Out Disco', renderer:'butterchurn', blendMode:'difference', preset:"martin - disco mix 4" },
	{ id:'butterchurn-exclusion', label:'Cosmic Sherbet', renderer:'butterchurn', blendMode:'exclusion', preset:"TonyMilkdrop - Magellan's Nebula [Flexi - you enter first + multiverse]" },
	{ id:'butterchurn-color', label:'Technicolour Tea Party', renderer:'butterchurn', blendMode:'color', preset:"Zylot - Paint Spill (Music Reactive Paint Mix)" },
	{ id:'butterchurn-luminosity', label:'Moonlight Etching', renderer:'butterchurn', blendMode:'luminosity', preset:"Geiss - Spiral Artifact" },
	{ id:'notes-horizontal', label:'Notes → Horizontal' },
	{ id:'notes-vertical', label:'Notes ↑ Vertical' },
].map(mode => Object.freeze({ fftSize:2048, ...(mode.renderer === 'butterchurn' ? { opacity:0.5 } : {}), ...mode })))

export const AUDIO_VISUALISER_MODES = Object.freeze(VISUALISER_MODES.filter(mode => mode.renderer !== 'butterchurn'))
export const MTV_MODES = Object.freeze(VISUALISER_MODES.filter(mode => mode.renderer === 'butterchurn'))

export const getMTVMode = (enabled, type) => enabled ? MTV_MODES.find(mode => mode.id === type) ?? null : null

export const normaliseMTVStrength = value => {
	const strength = value === null || value === undefined || value === '' ? 0.5 : Number(value)
	return Number.isFinite(strength) ? Math.max(0, Math.min(1, strength)) : 0.5
}

const modes = new Map(VISUALISER_MODES.map(mode => [mode.id, mode]))
export const getVisualiserMode = type => modes.get(type) ?? VISUALISER_MODES[0]
export const normaliseVisualiser = type => getVisualiserMode(type).id
