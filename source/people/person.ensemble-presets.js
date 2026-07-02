export const ENSEMBLE_INSTRUMENT_PRESETS = [
	{
		id:"four-choirs",
		title:"4 Choirs",
		voicings:{
			1:["choir_aahs"],
			2:["choir_aahs", "voice_oohs"],
			3:["choir_aahs", "voice_oohs", "synth_choir"],
			4:["choir_aahs", "voice_oohs", "synth_choir", "choir_aahs"]
		}
	},
	{
		id:"all-strings",
		title:"All Strings",
		voicings:{
			1:["cello"],
			2:["violin", "cello"],
			3:["violin", "viola", "cello"],
			4:["violin", "viola", "cello", "contrabass"]
		}
	},
	{
		id:"synth-pop",
		title:"Synth Pop",
		voicings:{
			1:["lead_2_sawtooth"],
			2:["synth_bass_1", "lead_2_sawtooth"],
			3:["synth_bass_1", "synth_strings_1", "lead_2_sawtooth"],
			4:["synth_bass_1", "synth_strings_1", "lead_2_sawtooth", "electric_piano_1"]
		}
	},
	{
		id:"brass-band",
		title:"Brass Band",
		voicings:{
			1:["trumpet"],
			2:["trumpet", "tuba"],
			3:["trumpet", "french_horn", "tuba"],
			4:["trumpet", "trombone", "french_horn", "tuba"]
		}
	},
	{
		id:"dream-pads",
		title:"Dream Pads",
		voicings:{
			1:["pad_2_warm"],
			2:["pad_2_warm", "pad_7_halo"],
			3:["pad_2_warm", "pad_4_choir", "pad_7_halo"],
			4:["pad_2_warm", "pad_4_choir", "synth_strings_2", "pad_7_halo"]
		}
	},
	{
		id:"orchestra",
		title:"Orchestra",
		voicings:{
			1:["violin"],
			2:["flute", "cello"],
			3:["flute", "violin", "cello"],
			4:["flute", "violin", "cello", "french_horn"]
		}
	},
	{
		id:"rock-band",
		title:"Rock Band",
		voicings:{
			1:["overdriven_guitar"],
			2:["electric_bass_pick", "overdriven_guitar"],
			3:["electric_bass_pick", "overdriven_guitar", "rock_organ"],
			4:["electric_bass_pick", "overdriven_guitar", "rock_organ", "distortion_guitar"]
		}
	},
	{
		id:"ambient",
		title:"Ambient",
		voicings:{
			1:["pad_2_warm"],
			2:["pad_2_warm", "fx_2_soundtrack"],
			3:["pad_2_warm", "fx_2_soundtrack", "pad_7_halo"],
			4:["pad_2_warm", "fx_2_soundtrack", "pad_7_halo", "fx_4_atmosphere"]
		}
	},
	{
		id:"samba",
		title:"Samba",
		voicings:{
			1:["steel_drums"],
			2:["steel_drums", "acoustic_bass"],
			3:["steel_drums", "acoustic_bass", "agogo"],
			4:["steel_drums", "acoustic_bass", "agogo", "acoustic_guitar_nylon"]
		}
	},
	{
		id:"techno",
		title:"Techno",
		voicings:{
			1:["synth_bass_2"],
			2:["synth_bass_2", "lead_1_square"],
			3:["synth_bass_2", "lead_1_square", "pad_3_polysynth"],
			4:["synth_bass_2", "lead_1_square", "pad_3_polysynth", "synth_drum"]
		}
	},
	{
		id:"jungle",
		title:"Jungle",
		voicings:{
			1:["synth_bass_1"],
			2:["synth_bass_1", "lead_4_chiff"],
			3:["synth_bass_1", "lead_4_chiff", "melodic_tom"],
			4:["synth_bass_1", "lead_4_chiff", "melodic_tom", "reverse_cymbal"]
		}
	},
	{
		id:"sound-fx",
		title:"Sound FX",
		voicings:{
			1:["fx_4_atmosphere"],
			2:["fx_4_atmosphere", "fx_7_echoes"],
			3:["fx_4_atmosphere", "fx_7_echoes", "seashore"],
			4:["fx_4_atmosphere", "fx_7_echoes", "seashore", "helicopter"]
		}
	},
	{
		id:"funk",
		title:"Funk",
		voicings:{
			1:["slap_bass_1"],
			2:["slap_bass_1", "electric_piano_1"],
			3:["slap_bass_1", "electric_piano_1", "electric_guitar_clean"],
			4:["slap_bass_1", "electric_piano_1", "electric_guitar_clean", "brass_section"]
		}
	},
	{
		id:"folk",
		title:"Folk",
		voicings:{
			1:["acoustic_guitar_steel"],
			2:["acoustic_guitar_steel", "fiddle"],
			3:["acoustic_guitar_steel", "fiddle", "harmonica"],
			4:["acoustic_guitar_steel", "fiddle", "harmonica", "acoustic_bass"]
		}
	},
	{
		id:"music-box",
		title:"Music Box",
		voicings:{
			1:["music_box"],
			2:["music_box", "celesta"],
			3:["music_box", "celesta", "glockenspiel"],
			4:["music_box", "celesta", "glockenspiel", "vibraphone"]
		}
	}
]
