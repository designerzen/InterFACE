/**
 * Curated drum-kit presets.  These are deliberately combinations of the
 * existing kick, snare and hi-hat voices so a preset can be applied without
 * changing the synth engines themselves.
 */

export const PERCUSSION_PRESETS = [
	{
		id:"lunar-drift",
		group:"Space",
		title:"Lunar Drift",
		kit:{
			kick:"Ambient Kick",
			snare:"Ambient Snare",
			hat:"Shimmer Open Hihat"
		},
		seed:"lunar-drift",
		intent:{ energy:0.24, density:0.25, tension:0.38, fillChance:0.1, rollChance:0.08, chaos:0.12 },
		phraseBars:8
	},
	{
		id:"nebula",
		group:"Space",
		title:"Nebula",
		kit:{
			kick:"Sub Boomer",
			snare:"Cinematic Snare",
			hat:"Glass Closed Hihat"
		},
		seed:"nebula",
		intent:{ energy:0.48, density:0.34, tension:0.66, fillChance:0.16, rollChance:0.14, chaos:0.24 },
		phraseBars:8
	},
	{
		id:"solar-flare",
		group:"Space",
		title:"Solar Flare",
		kit:{
			kick:"Electro Kick",
			snare:"Electro Snare",
			hat:"Metallic Closed Hihat"
		},
		seed:"solar-flare",
		intent:{ energy:0.78, density:0.62, tension:0.72, fillChance:0.3, rollChance:0.22, chaos:0.18 },
		phraseBars:4
	},
	{
		id:"deep-space",
		group:"Space",
		title:"Deep Space",
		kit:{
			kick:"808 Sub Kick",
			snare:"Ghost Snare",
			hat:"Dark Open Hihat"
		},
		seed:"deep-space",
		intent:{ energy:0.2, density:0.2, tension:0.8, fillChance:0.08, rollChance:0.12, chaos:0.34, muteKick:true },
		phraseBars:8
	},
	{ id:"moon-base", group:"Space", title:"Moon Base", kit:{kick:"Ambient Kick",snare:"Ghost Snare",hat:"Glass Closed Hihat"}, seed:"moon-base", intent:{energy:0.3,density:0.28,tension:0.52,fillChance:0.12,rollChance:0.1,chaos:0.18}, phraseBars:8 },
	{ id:"ion-storm", group:"Space", title:"Ion Storm", kit:{kick:"Electro Kick",snare:"Industrial Snare",hat:"Metallic Closed Hihat"}, seed:"ion-storm", intent:{energy:0.82,density:0.58,tension:0.88,fillChance:0.28,rollChance:0.24,chaos:0.32}, phraseBars:4 },
	{ id:"orbital-dawn", group:"Space", title:"Orbital Dawn", kit:{kick:"Pillow Kick",snare:"Ambient Snare",hat:"Shimmer Open Hihat"}, seed:"orbital-dawn", intent:{energy:0.38,density:0.3,tension:0.3,fillChance:0.1,rollChance:0.06,chaos:0.1}, phraseBars:8 },
	{ id:"warehouse-909", group:"Electronic", title:"Warehouse 909", kit:{kick:"909 Punchy Kick",snare:"909 Snare",hat:"909 Closed Hihat"}, seed:"warehouse-909", intent:{energy:0.8,density:0.66,tension:0.62,fillChance:0.24,rollChance:0.2,chaos:0.14}, phraseBars:4 },
	{ id:"acid-machine", group:"Electronic", title:"Acid Machine", kit:{kick:"Acid Kick",snare:"Tech Snare",hat:"Techno Closed Hihat"}, seed:"acid-machine", intent:{energy:0.76,density:0.7,tension:0.76,fillChance:0.2,rollChance:0.18,chaos:0.22}, phraseBars:4 },
	{ id:"rave-engine", group:"Electronic", title:"Rave Engine", kit:{kick:"Rave Kick",snare:"Gated Reverb Snare",hat:"Sizzle Open Hihat"}, seed:"rave-engine", intent:{energy:0.94,density:0.82,tension:0.72,fillChance:0.34,rollChance:0.3,chaos:0.2}, phraseBars:4 },
	{ id:"nightdrive", group:"Electronic", title:"Nightdrive", kit:{kick:"Synthwave Kick",snare:"Big Room Snare",hat:"Dark Open Hihat"}, seed:"nightdrive", intent:{energy:0.62,density:0.48,tension:0.54,fillChance:0.16,rollChance:0.12,chaos:0.12}, phraseBars:8 },
	{ id:"jungle-break", group:"Breaks", title:"Jungle Break", kit:{kick:"Jungle Kick",snare:"Jungle Snare",hat:"Chattery Closed Hihat"}, seed:"jungle-break", intent:{energy:0.86,density:0.86,tension:0.68,fillChance:0.3,rollChance:0.38,chaos:0.3}, phraseBars:2 },
	{ id:"breakbeat-radio", group:"Breaks", title:"Breakbeat Radio", kit:{kick:"Breakbeat Kick",snare:"Breakbeat Snare",hat:"Tight Closed Hihat"}, seed:"breakbeat-radio", intent:{energy:0.7,density:0.72,tension:0.5,fillChance:0.24,rollChance:0.26,chaos:0.24}, phraseBars:4 },
	{ id:"liquid-dnb", group:"Breaks", title:"Liquid D&B", kit:{kick:"Drum & Bass Kick",snare:"Drum & Bass Snare",hat:"Ride-style Open Hihat"}, seed:"liquid-dnb", intent:{energy:0.74,density:0.78,tension:0.58,fillChance:0.22,rollChance:0.32,chaos:0.2}, phraseBars:4 },
	{ id:"amen-break", group:"Classic Breaks", title:"Amen Break", groove:"amen", kit:{kick:"Jungle Kick",snare:"Jungle Snare",hat:"Chattery Closed Hihat"}, seed:"amen-break", intent:{energy:0.88,density:0.78,tension:0.7,fillChance:0.18,rollChance:0.24,chaos:0.12}, phraseBars:2, stepsPerBar:16 },
	{ id:"think-break", group:"Classic Breaks", title:"Think Break", groove:"think", kit:{kick:"Breakbeat Kick",snare:"Tight Snare",hat:"Tight Closed Hihat"}, seed:"think-break", intent:{energy:0.72,density:0.68,tension:0.48,fillChance:0.12,rollChance:0.16,chaos:0.1}, phraseBars:4, stepsPerBar:16 },
	{ id:"funky-drummer", group:"Classic Breaks", title:"Funky Drummer", groove:"funky-drummer", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"funky-drummer", intent:{energy:0.58,density:0.64,tension:0.28,fillChance:0.08,rollChance:0.08,chaos:0.06}, phraseBars:4, stepsPerBar:16 },
	{ id:"apache-break", group:"Classic Breaks", title:"Apache Break", groove:"apache-break", kit:{kick:"Breakbeat Kick",snare:"Breakbeat Snare",hat:"Lo-Fi Closed Hihat"}, seed:"apache-break", intent:{energy:0.66,density:0.62,tension:0.42,fillChance:0.12,rollChance:0.12,chaos:0.1}, phraseBars:4, stepsPerBar:16 },
	{ id:"hot-pants-break", group:"Classic Breaks", title:"Hot Pants Break", groove:"hot-pants", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"hot-pants-break", intent:{energy:0.62,density:0.64,tension:0.3,fillChance:0.08,rollChance:0.08,chaos:0.06}, phraseBars:4, stepsPerBar:16 },
	{ id:"impeach-president", group:"Classic Breaks", title:"Impeach the President", groove:"impeach-president", kit:{kick:"Boom Bap Kick",snare:"Boom Bap Snare",hat:"Lo-Fi Closed Hihat"}, seed:"impeach-president", intent:{energy:0.54,density:0.48,tension:0.32,fillChance:0.06,rollChance:0.06,chaos:0.05}, phraseBars:4, stepsPerBar:16 },
	{ id:"synthetic-substitution", group:"Classic Breaks", title:"Synthetic Substitution", groove:"synthetic-substitution", kit:{kick:"Breakbeat Kick",snare:"Breakbeat Snare",hat:"Tight Closed Hihat"}, seed:"synthetic-substitution", intent:{energy:0.68,density:0.58,tension:0.46,fillChance:0.1,rollChance:0.1,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"soul-pride", group:"Classic Breaks", title:"Soul Pride", groove:"soul-pride", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"soul-pride", intent:{energy:0.64,density:0.7,tension:0.28,fillChance:0.08,rollChance:0.08,chaos:0.06}, phraseBars:4, stepsPerBar:16 },
	{ id:"cold-sweat", group:"Classic Breaks", title:"Cold Sweat", groove:"cold-sweat", kit:{kick:"Beefy Kick",snare:"Strong Snare",hat:"Tight Closed Hihat"}, seed:"cold-sweat", intent:{energy:0.7,density:0.68,tension:0.38,fillChance:0.1,rollChance:0.1,chaos:0.06}, phraseBars:4, stepsPerBar:16 },
	{ id:"ashleys-roachclip", group:"Classic Breaks", title:"Ashley's Roachclip", groove:"ashleys-roachclip", kit:{kick:"Boom Bap Kick",snare:"Boom Bap Snare",hat:"Lo-Fi Closed Hihat"}, seed:"ashleys-roachclip", intent:{energy:0.56,density:0.5,tension:0.3,fillChance:0.06,rollChance:0.06,chaos:0.05}, phraseBars:4, stepsPerBar:16 },
	{ id:"back-to-life", group:"Classic Breaks", title:"Soul II Soul – Back to Life", groove:"back-to-life", kit:{kick:"LinnDrum Kick",snare:"LinnDrum Snare",hat:"House Closed Hihat"}, seed:"back-to-life", intent:{energy:0.58,density:0.52,tension:0.34,fillChance:0.08,rollChance:0.08,chaos:0.05}, phraseBars:4, stepsPerBar:16 },
	{ id:"bo-diddley-beat", group:"Classic Styles", title:"Bo Diddley Beat", groove:"bo-diddley", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat"}, seed:"bo-diddley-beat", intent:{energy:0.56,density:0.58,tension:0.22,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"purdie-shuffle", group:"Classic Styles", title:"Purdie Shuffle", groove:"purdie-shuffle", kit:{kick:"Vintage Acoustic Kick",snare:"Ghost Snare",hat:"Ride-style Open Hihat"}, seed:"purdie-shuffle", intent:{energy:0.5,density:0.6,tension:0.24,fillChance:0.08,rollChance:0.08,chaos:0.05}, phraseBars:8, stepsPerBar:24 },
	{ id:"mardi-gras-break", group:"Classic Breaks", title:"Mardi Gras Break", groove:"mardi-gras", kit:{kick:"Breakbeat Kick",snare:"Breakbeat Snare",hat:"Short Open Hihat"}, seed:"mardi-gras-break", intent:{energy:0.68,density:0.7,tension:0.38,fillChance:0.12,rollChance:0.1,chaos:0.07}, phraseBars:4, stepsPerBar:16 },
	{ id:"levee-break", group:"Classic Breaks", title:"Levee Break", groove:"levee-break", kit:{kick:"Beefy Kick",snare:"Gated Reverb Snare",hat:"Dark Open Hihat"}, seed:"levee-break", intent:{energy:0.78,density:0.42,tension:0.5,fillChance:0.08,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"simple-song-break", group:"Classic Breaks", title:"Simple Song Break", groove:"simple-song", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Tight Closed Hihat"}, seed:"simple-song-break", intent:{energy:0.66,density:0.66,tension:0.3,fillChance:0.08,rollChance:0.08,chaos:0.05}, phraseBars:4, stepsPerBar:16 },
	{ id:"handclapping-break", group:"Classic Breaks", title:"Handclapping Break", groove:"handclapping-song", kit:{kick:"Breakbeat Kick",snare:"Clap Snare Hybrid",hat:"Lo-Fi Closed Hihat"}, seed:"handclapping-break", intent:{energy:0.64,density:0.6,tension:0.36,fillChance:0.1,rollChance:0.1,chaos:0.06}, phraseBars:4, stepsPerBar:16 },
	{ id:"funky-mule", group:"Classic Breaks", title:"Funky Mule", groove:"funky-mule", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"funky-mule", intent:{energy:0.62,density:0.7,tension:0.28,fillChance:0.08,rollChance:0.08,chaos:0.05}, phraseBars:4, stepsPerBar:16 },
	{ id:"uk-garage", group:"Electronic", title:"UK Garage", groove:"uk-garage", kit:{kick:"Deep House Kick",snare:"Tight Snare",hat:"House Closed Hihat"}, seed:"uk-garage", intent:{energy:0.68,density:0.58,tension:0.52,fillChance:0.14,rollChance:0.12,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"dubstep-half-time", group:"Electronic", title:"Dubstep Half-time", groove:"dubstep", kit:{kick:"808 Sub Kick",snare:"Heavy Snare",hat:"Dark Open Hihat"}, seed:"dubstep-half-time", intent:{energy:0.86,density:0.38,tension:0.86,fillChance:0.2,rollChance:0.18,chaos:0.14}, phraseBars:4, stepsPerBar:16 },
	{ id:"garage-triplets", group:"Electronic", title:"UK Garage Triplets", groove:"garage-triplets", kit:{kick:"Deep House Kick",snare:"Tight Snare",hat:"House Closed Hihat"}, seed:"garage-triplets", intent:{energy:0.72,density:0.68,tension:0.58,fillChance:0.18,rollChance:0.16,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"trap-sextuplets", group:"Electronic", title:"Trap Sextuplet Hats", groove:"trap-sextuplets", kit:{kick:"Trap Kick",snare:"Trap Snare",hat:"Trap Closed Hihat"}, seed:"trap-sextuplets", intent:{energy:0.78,density:0.7,tension:0.76,fillChance:0.2,rollChance:0.38,chaos:0.1}, phraseBars:4, stepsPerBar:16 },
	{ id:"jungle-32-fill", group:"Breaks", title:"Jungle 32nd Fills", groove:"jungle-32-fill", kit:{kick:"Jungle Kick",snare:"Jungle Snare",hat:"Chattery Closed Hihat"}, seed:"jungle-32-fill", intent:{energy:0.92,density:0.88,tension:0.78,fillChance:0.34,rollChance:0.4,chaos:0.18}, phraseBars:2, stepsPerBar:16 },
	{ id:"dubstep-triplet-roll", group:"Electronic", title:"Dubstep Triplet Roll", groove:"dubstep-triplet-roll", kit:{kick:"808 Sub Kick",snare:"Heavy Snare",hat:"Dark Closed Hihat"}, seed:"dubstep-triplet-roll", intent:{energy:0.9,density:0.52,tension:0.9,fillChance:0.3,rollChance:0.3,chaos:0.12}, phraseBars:4, stepsPerBar:16 },
	{ id:"breakstep", group:"Electronic", title:"Breakstep", groove:"breakstep", kit:{kick:"Electro Kick",snare:"Electro Snare",hat:"Metallic Closed Hihat"}, seed:"breakstep", intent:{energy:0.82,density:0.7,tension:0.72,fillChance:0.2,rollChance:0.22,chaos:0.16}, phraseBars:4, stepsPerBar:16 },
	{ id:"electro-funk", group:"Electronic", title:"Electro Funk", groove:"electro", kit:{kick:"Electro Kick",snare:"Electro Snare",hat:"808 Closed Hihat"}, seed:"electro-funk", intent:{energy:0.72,density:0.56,tension:0.48,fillChance:0.14,rollChance:0.12,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"samba-batucada", group:"World", title:"Samba Batucada", groove:"samba", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"samba-batucada", intent:{energy:0.76,density:0.82,tension:0.3,fillChance:0.16,rollChance:0.14,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"one-drop-reggae", group:"World", title:"One Drop Reggae", groove:"reggae", kit:{kick:"Pillow Kick",snare:"Rim Shot Snare",hat:"Dark Open Hihat"}, seed:"one-drop-reggae", intent:{energy:0.38,density:0.28,tension:0.2,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"jazz-swing", group:"Jazz", title:"Jazz Swing", groove:"jazz-swing", kit:{kick:"Pillow Kick",snare:"Brushed Snare",hat:"Ride-style Open Hihat"}, seed:"jazz-swing", intent:{energy:0.36,density:0.56,tension:0.18,fillChance:0.1,rollChance:0.08,chaos:0.06}, phraseBars:8, stepsPerBar:24 },
	{ id:"bossa-nova", group:"Jazz", title:"Bossa Nova", groove:"bossa-nova", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Lo-Fi Closed Hihat"}, seed:"bossa-nova", intent:{energy:0.34,density:0.5,tension:0.16,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"studio-54-disco", group:"Classic Styles", title:"Studio 54 Disco", groove:"disco", kit:{kick:"909 Punchy Kick",snare:"Clap Snare Hybrid",hat:"Sizzle Open Hihat"}, seed:"studio-54-disco", intent:{energy:0.72,density:0.6,tension:0.34,fillChance:0.12,rollChance:0.08,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"motown-pocket", group:"Classic Styles", title:"Motown Pocket", groove:"motown", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"motown-pocket", intent:{energy:0.48,density:0.5,tension:0.2,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"afrobeat", group:"World", title:"Afrobeat", groove:"afrobeat", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat"}, seed:"afrobeat", intent:{energy:0.62,density:0.74,tension:0.3,fillChance:0.1,rollChance:0.08,chaos:0.06}, phraseBars:8, stepsPerBar:16 },
	{ id:"trap", group:"Electronic", title:"Trap", groove:"trap", kit:{kick:"Trap Kick",snare:"Trap Snare",hat:"Trap Closed Hihat"}, seed:"trap", intent:{energy:0.72,density:0.48,tension:0.7,fillChance:0.16,rollChance:0.34,chaos:0.12}, phraseBars:4, stepsPerBar:16 },
	{ id:"chicago-footwork", group:"Electronic", title:"Chicago Footwork", groove:"footwork", kit:{kick:"Electro Kick",snare:"Tight Snare",hat:"Chattery Closed Hihat"}, seed:"chicago-footwork", intent:{energy:0.88,density:0.78,tension:0.78,fillChance:0.18,rollChance:0.3,chaos:0.14}, phraseBars:4, stepsPerBar:16 },
	{ id:"punk-rock", group:"Rock", title:"Punk Rock", groove:"punk-rock", kit:{kick:"Beefy Kick",snare:"Strong Snare",hat:"Short Open Hihat"}, seed:"punk-rock", intent:{energy:0.92,density:0.76,tension:0.62,fillChance:0.18,rollChance:0.14,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"dusty-boom-bap", group:"Organic", title:"Dusty Boom Bap", kit:{kick:"Boom Bap Kick",snare:"Boom Bap Snare",hat:"Lo-Fi Closed Hihat"}, seed:"dusty-boom-bap", intent:{energy:0.46,density:0.48,tension:0.32,fillChance:0.14,rollChance:0.12,chaos:0.2}, phraseBars:4 },
	{ id:"acoustic-room", group:"Organic", title:"Acoustic Room", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"acoustic-room", intent:{energy:0.4,density:0.34,tension:0.2,fillChance:0.12,rollChance:0.08,chaos:0.08}, phraseBars:8 },
	{ id:"brushes-and-dust", group:"Organic", title:"Brushes & Dust", kit:{kick:"Dusty Kick",snare:"Brushed Snare",hat:"Lo-Fi Open Hihat"}, seed:"brushes-and-dust", intent:{energy:0.24,density:0.26,tension:0.18,fillChance:0.08,rollChance:0.1,chaos:0.14}, phraseBars:8 },
	{ id:"industrial-core", group:"Heavy", title:"Industrial Core", kit:{kick:"Industrial Kick",snare:"Industrial Snare",hat:"Distorted Open Hihat"}, seed:"industrial-core", intent:{energy:0.96,density:0.7,tension:0.94,fillChance:0.34,rollChance:0.28,chaos:0.38}, phraseBars:4 },
	{ id:"hardstyle-impact", group:"Heavy", title:"Hardstyle Impact", kit:{kick:"Hardstyle Kick",snare:"Heavy Snare",hat:"Metallic Closed Hihat"}, seed:"hardstyle-impact", intent:{energy:0.98,density:0.76,tension:0.84,fillChance:0.3,rollChance:0.24,chaos:0.28}, phraseBars:4 }
]

const normalisePresetName = value => String(value ?? "")
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, "")

export const getPercussionPreset = value => {
	const presetName = normalisePresetName(value)
	if (!presetName)
	{
		return null
	}

	return PERCUSSION_PRESETS.find(preset => {
		return normalisePresetName(preset.id) === presetName ||
			normalisePresetName(preset.title) === presetName
	}) ?? null
}
