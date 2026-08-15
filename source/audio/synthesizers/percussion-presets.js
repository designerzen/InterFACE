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
	{ id:"bo-diddley-beat", group:"Classic Styles", title:"Bo Diddley Beat", groove:"bo-diddley", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat",congaMute:"808 Mute Conga",maracas:"808 Maracas"}, seed:"bo-diddley-beat", intent:{energy:0.56,density:0.58,tension:0.22,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
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
	{ id:"electro-funk", group:"Electronic", title:"Electro Funk", groove:"electro", kit:{kick:"Electro Kick",snare:"Electro Snare",hat:"808 Closed Hihat",congaLow:"808 Low Conga",congaHigh:"808 High Conga",maracas:"808 Maracas"}, seed:"electro-funk", intent:{energy:0.72,density:0.56,tension:0.48,fillChance:0.14,rollChance:0.12,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"samba-batucada", group:"Brazilian", title:"Samba Batucada", groove:"samba", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",congaMute:"727-style Mute High Conga",cabasa:"727-style Cabasa"}, seed:"samba-batucada", intent:{energy:0.76,density:0.82,tension:0.3,fillChance:0.16,rollChance:0.14,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"one-drop-reggae", group:"Jamaican", title:"One Drop Reggae", groove:"reggae", kit:{kick:"Pillow Kick",snare:"Rim Shot Snare",hat:"Dark Open Hihat"}, seed:"one-drop-reggae", intent:{energy:0.38,density:0.28,tension:0.2,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"jazz-swing", group:"Jazz", title:"Jazz Swing", groove:"jazz-swing", kit:{kick:"Pillow Kick",snare:"Brushed Snare",hat:"Ride-style Open Hihat"}, seed:"jazz-swing", intent:{energy:0.36,density:0.56,tension:0.18,fillChance:0.1,rollChance:0.08,chaos:0.06}, phraseBars:8, stepsPerBar:24 },
	{ id:"bossa-nova", group:"Jazz", title:"Bossa Nova", groove:"bossa-nova", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Lo-Fi Closed Hihat",congaLow:"727-style Low Conga",congaMute:"727-style Mute High Conga",cabasa:"Soft Seed Shaker"}, seed:"bossa-nova", intent:{energy:0.34,density:0.5,tension:0.16,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"studio-54-disco", group:"Classic Styles", title:"Studio 54 Disco", groove:"disco", kit:{kick:"909 Punchy Kick",snare:"Clap Snare Hybrid",hat:"Sizzle Open Hihat"}, seed:"studio-54-disco", intent:{energy:0.72,density:0.6,tension:0.34,fillChance:0.12,rollChance:0.08,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"motown-pocket", group:"Classic Styles", title:"Motown Pocket", groove:"motown", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"motown-pocket", intent:{energy:0.48,density:0.5,tension:0.2,fillChance:0.06,rollChance:0.04,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"afrobeat", group:"West African", title:"Afrobeat", groove:"afrobeat", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat",bongoLow:"727-style Low Bongo",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",maracas:"727-style Maracas"}, seed:"afrobeat", intent:{energy:0.62,density:0.74,tension:0.3,fillChance:0.1,rollChance:0.08,chaos:0.06}, phraseBars:8, stepsPerBar:16 },
	{ id:"salsa-mambo-727", group:"Cuban", title:"Salsa Mambo 727", groove:"salsa-mambo", kit:{kick:"707 Kick",snare:"707 Snare",hat:"707 Closed Hihat",bongoLow:"727-style Low Bongo",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",congaMute:"727-style Mute High Conga",maracas:"727-style Maracas"}, seed:"salsa-mambo-727", intent:{energy:0.7,density:0.76,tension:0.34,fillChance:0.1,rollChance:0.06,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"son-montuno", group:"Cuban", title:"Son Montuno", groove:"son-montuno", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat",bongoLow:"Warm Low Bongo",bongoHigh:"Bright High Bongo",congaLow:"727-style Low Conga",congaMute:"727-style Mute High Conga",maracas:"727-style Maracas"}, seed:"son-montuno", intent:{energy:0.54,density:0.66,tension:0.24,fillChance:0.06,rollChance:0.04,chaos:0.03}, phraseBars:8, stepsPerBar:16 },
	{ id:"cha-cha-727", group:"Cuban", title:"Cha-Cha 727", groove:"cha-cha", kit:{kick:"707 Kick",snare:"707 Snare",hat:"707 Closed Hihat",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaMute:"727-style Mute High Conga",triangleMute:"727-style Muted Triangle",triangleOpen:"727-style Open Triangle"}, seed:"cha-cha-727", intent:{energy:0.48,density:0.62,tension:0.2,fillChance:0.05,rollChance:0.03,chaos:0.02}, phraseBars:8, stepsPerBar:16 },
	{ id:"rumba-guaguanco", group:"Cuban", title:"Rumba Guaguancó", groove:"rumba-guaguanco", kit:{kick:"Pillow Kick",snare:"Rim Shot Snare",hat:"Lo-Fi Closed Hihat",bongoHigh:"Bright High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",congaMute:"727-style Mute High Conga"}, seed:"rumba-guaguanco", intent:{energy:0.58,density:0.72,tension:0.32,fillChance:0.08,rollChance:0.04,chaos:0.05}, phraseBars:8, stepsPerBar:16 },
	{ id:"cumbia-percussion", group:"Colombian", title:"Cumbia Percussion", groove:"cumbia", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",maracas:"727-style Maracas",triangleMute:"Muted Triangle",triangleOpen:"Open Triangle"}, seed:"cumbia-percussion", intent:{energy:0.5,density:0.64,tension:0.2,fillChance:0.06,rollChance:0.03,chaos:0.03}, phraseBars:8, stepsPerBar:16 },
	{ id:"latin-electro-808", group:"Electronic", title:"Latin Electro 808", groove:"latin-electro", kit:{kick:"808 Sub Kick",snare:"808 Snare",hat:"808 Closed Hihat",congaLow:"808 Low Conga",congaHigh:"808 High Conga",congaMute:"808 Mute Conga",maracas:"808 Maracas",triangleOpen:"Bright Small Triangle"}, seed:"latin-electro-808", intent:{energy:0.78,density:0.7,tension:0.58,fillChance:0.14,rollChance:0.1,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"727-latin-box", group:"Cuban", title:"727 Latin Box", groove:"727-latin-box", kit:{kick:"707 Kick",snare:"707 Snare",hat:"707 Closed Hihat",bongoLow:"727-style Low Bongo",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",cabasa:"727-style Cabasa",maracas:"727-style Maracas",triangleMute:"727-style Muted Triangle",triangleOpen:"727-style Open Triangle"}, seed:"727-latin-box", intent:{energy:0.66,density:0.8,tension:0.38,fillChance:0.1,rollChance:0.05,chaos:0.04}, phraseBars:8, stepsPerBar:16 },
	{ id:"percussion-colours", group:"Classic Styles", title:"Percussion Colours", groove:"percussion-colours", kit:{kick:"Vintage Acoustic Kick",snare:"Rim Shot Snare",hat:"Short Open Hihat",rimshot:"Rim Shot",crossStick:"Cross Stick",claves:"Clave",tambourine:"707-style Tambourine",chekere:"Chekere",cuicaOpen:"Open Cuica",cuicaMute:"Muted Cuica",whistleLong:"727-style Long Whistle",windChime:"Wind Chime",fingerSnap:"Finger Snap"}, seed:"percussion-colours", intent:{energy:0.48,density:0.72,tension:0.24,fillChance:0.08,rollChance:0.04,chaos:0.05}, phraseBars:8, stepsPerBar:16 },
	{ id:"electronic-percussion", group:"Electronic", title:"Electronic Percussion", groove:"electronic-percussion", kit:{kick:"Electro Kick",snare:"Electro Snare",hat:"Metallic Closed Hihat",syndrum:"Syndrum",laserTom:"Laser Tom",metalHit:"Metallic Hit"}, seed:"electronic-percussion", intent:{energy:0.76,density:0.58,tension:0.68,fillChance:0.16,rollChance:0.12,chaos:0.14}, phraseBars:4, stepsPerBar:16 },
	{ id:"trap", group:"Electronic", title:"Trap", groove:"trap", kit:{kick:"Trap Kick",snare:"Trap Snare",hat:"Trap Closed Hihat"}, seed:"trap", intent:{energy:0.72,density:0.48,tension:0.7,fillChance:0.16,rollChance:0.34,chaos:0.12}, phraseBars:4, stepsPerBar:16 },
	{ id:"chicago-footwork", group:"Electronic", title:"Chicago Footwork", groove:"footwork", kit:{kick:"Electro Kick",snare:"Tight Snare",hat:"Chattery Closed Hihat"}, seed:"chicago-footwork", intent:{energy:0.88,density:0.78,tension:0.78,fillChance:0.18,rollChance:0.3,chaos:0.14}, phraseBars:4, stepsPerBar:16 },
	{ id:"punk-rock", group:"Rock", title:"Punk Rock", groove:"punk-rock", kit:{kick:"Beefy Kick",snare:"Strong Snare",hat:"Short Open Hihat"}, seed:"punk-rock", intent:{energy:0.92,density:0.76,tension:0.62,fillChance:0.18,rollChance:0.14,chaos:0.08}, phraseBars:4, stepsPerBar:16 },
	{ id:"dusty-boom-bap", group:"Organic", title:"Dusty Boom Bap", kit:{kick:"Boom Bap Kick",snare:"Boom Bap Snare",hat:"Lo-Fi Closed Hihat"}, seed:"dusty-boom-bap", intent:{energy:0.46,density:0.48,tension:0.32,fillChance:0.14,rollChance:0.12,chaos:0.2}, phraseBars:4 },
	{ id:"acoustic-room", group:"Organic", title:"Acoustic Room", kit:{kick:"Vintage Acoustic Kick",snare:"Acoustic Snare",hat:"Short Open Hihat"}, seed:"acoustic-room", intent:{energy:0.4,density:0.34,tension:0.2,fillChance:0.12,rollChance:0.08,chaos:0.08}, phraseBars:8 },
	{ id:"brushes-and-dust", group:"Organic", title:"Brushes & Dust", kit:{kick:"Dusty Kick",snare:"Brushed Snare",hat:"Lo-Fi Open Hihat"}, seed:"brushes-and-dust", intent:{energy:0.24,density:0.26,tension:0.18,fillChance:0.08,rollChance:0.1,chaos:0.14}, phraseBars:8 },
	{ id:"industrial-core", group:"Heavy", title:"Industrial Core", kit:{kick:"Industrial Kick",snare:"Industrial Snare",hat:"Distorted Open Hihat"}, seed:"industrial-core", intent:{energy:0.96,density:0.7,tension:0.94,fillChance:0.34,rollChance:0.28,chaos:0.38}, phraseBars:4 },
	{ id:"hardstyle-impact", group:"Heavy", title:"Hardstyle Impact", kit:{kick:"Hardstyle Kick",snare:"Heavy Snare",hat:"Metallic Closed Hihat"}, seed:"hardstyle-impact", intent:{energy:0.98,density:0.76,tension:0.84,fillChance:0.3,rollChance:0.24,chaos:0.28}, phraseBars:4 }
]

// Sound-only machine kits. They deliberately live outside PERCUSSION_PRESETS,
// so choosing one changes timbre without replacing the selected arrangement.
export const PERCUSSION_MACHINE_PRESETS = [
	{ id:"korg-kr-55", group:"Korg", title:"Korg KR-55", soundOnly:true, kit:{kick:"Korg KR-55 Kick",snare:"Korg KR-55 Snare",hat:"Korg KR-55 Closed Hihat",cowbell:"Korg KR-55 Cowbell"}, intent:{energy:0.28,density:0.3,tension:0.18} },
	{ id:"roland-cr-78", group:"Roland", title:"Roland CR-78", soundOnly:true, kit:{kick:"CR-78 Kick",snare:"CR-78 Snare",hat:"CR-78 Closed Hihat",cowbell:"CR-78 Cowbell"}, intent:{energy:0.32,density:0.32,tension:0.2} },
	{ id:"boss-dr-55", group:"Boss", title:"Boss DR-55", soundOnly:true, kit:{kick:"Boss DR-55 Kick",snare:"Boss DR-55 Snare",hat:"Boss DR-55 Closed Hihat",cowbell:false}, intent:{energy:0.34,density:0.34,tension:0.24} },
	{ id:"roland-tr-606", group:"Roland", title:"Roland TR-606", soundOnly:true, kit:{kick:"606 Kick",snare:"606 Snare",hat:"606 Closed Hihat",cowbell:false}, intent:{energy:0.44,density:0.46,tension:0.34} },
	{ id:"roland-tr-505", group:"Roland", title:"Roland TR-505", soundOnly:true, kit:{kick:"505 Kick",snare:"505 Snare",hat:"505 Closed Hihat",cowbell:"505 Cowbell"}, intent:{energy:0.5,density:0.48,tension:0.38} },
	{ id:"casio-rz-1", group:"Casio", title:"Casio RZ-1", soundOnly:true, kit:{kick:"Casio RZ-1 Kick",snare:"Casio RZ-1 Snare",hat:"Casio RZ-1 Closed Hihat",cowbell:"Casio RZ-1 Cowbell"}, intent:{energy:0.56,density:0.5,tension:0.44} },
	{ id:"emu-sp-1200", group:"E-mu", title:"E-mu SP-1200", soundOnly:true, kit:{kick:"E-mu SP-1200 Kick",snare:"E-mu SP-1200 Snare",hat:"E-mu SP-1200 Closed Hihat",cowbell:"E-mu SP-1200 Cowbell"}, intent:{energy:0.58,density:0.5,tension:0.4} },
	{ id:"linndrum", group:"Linn", title:"LinnDrum", soundOnly:true, kit:{kick:"LinnDrum Kick",snare:"LinnDrum Snare",hat:"LinnDrum Closed Hihat",cowbell:"LinnDrum Cowbell"}, intent:{energy:0.6,density:0.5,tension:0.42} },
	{ id:"sequential-drumtraks", group:"Sequential", title:"Sequential DrumTraks", soundOnly:true, kit:{kick:"Sequential DrumTraks Kick",snare:"Sequential DrumTraks Snare",hat:"Sequential DrumTraks Closed Hihat",cowbell:"Sequential DrumTraks Cowbell"}, intent:{energy:0.61,density:0.52,tension:0.44} },
	{ id:"roland-tr-707", group:"Roland", title:"Roland TR-707", soundOnly:true, kit:{kick:"707 Kick",snare:"707 Snare",hat:"707 Closed Hihat",cowbell:"707 Cowbell"}, intent:{energy:0.62,density:0.54,tension:0.48} },
	{ id:"alesis-hr-16", group:"Alesis", title:"Alesis HR-16", soundOnly:true, kit:{kick:"Alesis HR-16 Kick",snare:"Alesis HR-16 Snare",hat:"Alesis HR-16 Closed Hihat",cowbell:"Alesis HR-16 Cowbell"}, intent:{energy:0.64,density:0.54,tension:0.48} },
	{ id:"korg-ddd-1", group:"Korg", title:"Korg DDD-1", soundOnly:true, kit:{kick:"Korg DDD-1 Kick",snare:"Korg DDD-1 Snare",hat:"Korg DDD-1 Closed Hihat",cowbell:"Korg DDD-1 Cowbell"}, intent:{energy:0.66,density:0.56,tension:0.5} },
	{ id:"oberheim-dmx", group:"Oberheim", title:"Oberheim DMX", soundOnly:true, kit:{kick:"Oberheim DMX Kick",snare:"Oberheim DMX Snare",hat:"Oberheim DMX Closed Hihat",cowbell:"Oberheim DMX Cowbell"}, intent:{energy:0.7,density:0.57,tension:0.52} },
	{ id:"roland-tr-707-727", group:"Roland", title:"Roland TR-707 + TR-727", soundOnly:true, kit:{kick:"707 Kick",snare:"707 Snare",hat:"707 Closed Hihat",cowbell:"707 Cowbell",rimshot:"Rim Shot",crash:"Crash-style Open Hihat",ride:"Ride-style Open Hihat",tambourine:"707-style Tambourine",bongoLow:"727-style Low Bongo",bongoHigh:"727-style High Bongo",congaLow:"727-style Low Conga",congaHigh:"727-style Open High Conga",congaMute:"727-style Mute High Conga",cabasa:"727-style Cabasa",maracas:"727-style Maracas",triangleMute:"727-style Muted Triangle",triangleOpen:"727-style Open Triangle",agogoHigh:"727-style High Agogo",agogoLow:"727-style Low Agogo",timbaleHigh:"727-style High Timbale",timbaleLow:"727-style Low Timbale",guiroShort:"Short Guiro",guiroLong:"Long Guiro",whistleShort:"727-style Short Whistle",whistleLong:"727-style Long Whistle",quijada:"727-style Quijada",starChime:"727-style Star Chime"}, intent:{energy:0.68,density:0.62,tension:0.48} },
	{ id:"roland-tr-808", group:"Roland", title:"Roland TR-808", soundOnly:true, kit:{kick:"808 Sub Kick",snare:"808 Snare",hat:"808 Closed Hihat",cowbell:"808 Cowbell",rimshot:"Rim Shot",claves:"Clave",crash:"Crash-style Open Hihat",congaLow:"808 Low Conga",congaHigh:"808 High Conga",congaMute:"808 Mute Conga",maracas:"808 Maracas"}, intent:{energy:0.72,density:0.58,tension:0.54} },
	{ id:"yamaha-rx5", group:"Yamaha", title:"Yamaha RX5", soundOnly:true, kit:{kick:"Yamaha RX5 Kick",snare:"Yamaha RX5 Snare",hat:"Yamaha RX5 Closed Hihat",cowbell:"Yamaha RX5 Cowbell"}, intent:{energy:0.74,density:0.6,tension:0.58} },
	{ id:"roland-tr-909", group:"Roland", title:"Roland TR-909", soundOnly:true, kit:{kick:"909 Punchy Kick",snare:"909 Snare",hat:"909 Closed Hihat",cowbell:false}, intent:{energy:0.82,density:0.66,tension:0.64} },
	{ id:"simmons-sds-v", group:"Simmons", title:"Simmons SDS-V", soundOnly:true, kit:{kick:"Simmons SDS-V Kick",snare:"Simmons SDS-V Snare",hat:"Simmons SDS-V Closed Hihat",cowbell:false,syndrum:"Simmons-style Tom",laserTom:"Laser Tom",metalHit:"Metallic Hit"}, intent:{energy:0.86,density:0.62,tension:0.7} },
]

const ALL_PERCUSSION_PRESETS = [...PERCUSSION_PRESETS, ...PERCUSSION_MACHINE_PRESETS]

const createPresetLookupKey = value => String(value ?? "")
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, "")

const PERCUSSION_PRESETS_BY_VALUE = new Map()
const PERCUSSION_PRESET_ALIASES = new Map()

for (const preset of ALL_PERCUSSION_PRESETS)
{
	PERCUSSION_PRESETS_BY_VALUE.set(preset.id, preset)
	PERCUSSION_PRESETS_BY_VALUE.set(preset.title, preset)
	PERCUSSION_PRESET_ALIASES.set(createPresetLookupKey(preset.id), preset)
	PERCUSSION_PRESET_ALIASES.set(createPresetLookupKey(preset.title), preset)
}

export const getPercussionPreset = value => {
	if (typeof value !== "string" || !value)
	{
		return null
	}

	return PERCUSSION_PRESETS_BY_VALUE.get(value) ??
		PERCUSSION_PRESET_ALIASES.get(createPresetLookupKey(value)) ??
		null
}

const SOUND_AGGRESSION_HINTS = Object.freeze({
	pillow:-0.32,
	ambient:-0.28,
	brushed:-0.24,
	ghost:-0.2,
	glass:-0.14,
	"lo-fi":-0.12,
	dark:-0.06,
	vintage:-0.04,
	short:-0.03,
	tight:0.03,
	breakbeat:0.08,
	jungle:0.12,
	electro:0.14,
	"big room":0.18,
	gated:0.2,
	beefy:0.22,
	heavy:0.26,
	rave:0.3,
	industrial:0.34,
	distorted:0.36,
	hardstyle:0.4,
})

export const getPercussionSoundAggression = preset => {
	const intent = preset?.intent ?? {}
	const kitName = Object.values(preset?.kit ?? {}).join(" ").toLowerCase()
	const timbreAdjustment = Object.entries(SOUND_AGGRESSION_HINTS).reduce((total, [hint, weight]) => {
		return kitName.includes(hint) ? total + weight : total
	}, 0)
	return (intent.energy ?? 0.5) * 0.55 +
		(intent.tension ?? 0.5) * 0.3 +
		(intent.density ?? 0.5) * 0.15 +
		timbreAdjustment
}

const PERCUSSION_SOUND_AGGRESSION = new Map(
	ALL_PERCUSSION_PRESETS.map(preset => [preset, getPercussionSoundAggression(preset)])
)

export const PERCUSSION_SOUND_PRESETS = ALL_PERCUSSION_PRESETS
	.slice()
	.sort((a, b) => PERCUSSION_SOUND_AGGRESSION.get(a) - PERCUSSION_SOUND_AGGRESSION.get(b))

const SOUND_GROUP_BY_STYLE = new Map([
	["Space", "Ambient & Space"],
	["Organic", "Acoustic & Organic"],
	["Jazz", "Acoustic & Organic"],
	["Rock", "Acoustic & Organic"],
	["Classic Styles", "Classic & Regional"],
	["Brazilian", "Classic & Regional"],
	["Jamaican", "Classic & Regional"],
	["West African", "Classic & Regional"],
	["Cuban", "Classic & Regional"],
	["Colombian", "Classic & Regional"],
	["Breaks", "Breaks & Hip-Hop"],
	["Classic Breaks", "Breaks & Hip-Hop"],
	["Electronic", "Electronic"],
	["Heavy", "Heavy & Experimental"],
])

export const PERCUSSION_SOUND_PRESET_GROUPS = [
	{ group:"Drum Machines", presets:[] },
	{ group:"Ambient & Space", presets:[] },
	{ group:"Acoustic & Organic", presets:[] },
	{ group:"Classic & Regional", presets:[] },
	{ group:"Breaks & Hip-Hop", presets:[] },
	{ group:"Electronic", presets:[] },
	{ group:"Heavy & Experimental", presets:[] },
	{ group:"Other", presets:[] },
]

const SOUND_PRESET_GROUPS_BY_NAME = new Map(
	PERCUSSION_SOUND_PRESET_GROUPS.map(group => [group.group, group])
)

for (const preset of PERCUSSION_SOUND_PRESETS)
{
	const groupName = preset.soundOnly ? "Drum Machines" : (SOUND_GROUP_BY_STYLE.get(preset.group) ?? "Other")
	SOUND_PRESET_GROUPS_BY_NAME.get(groupName).presets.push(preset)
}
