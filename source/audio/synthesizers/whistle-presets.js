export const DEFAULT_WHISTLE_OPTIONS = Object.freeze({
	name:"Short Whistle", velocity:1, length:0.2, attack:0.018, decay:0.06,
	startFrequency:1750, endFrequency:2050, secondRatio:1.006, breathLevel:0.08,
	breathFrequency:5200, outputGain:0.24, triggerAt:0,
})
const preset=(name,options)=>Object.freeze({...DEFAULT_WHISTLE_OPTIONS,name,...options})
export const PRESET_727_SHORT_WHISTLE=preset("727-style Short Whistle",{length:0.18,startFrequency:1680,endFrequency:1980,outputGain:0.22})
export const PRESET_727_LONG_WHISTLE=preset("727-style Long Whistle",{length:0.68,attack:0.025,decay:0.16,startFrequency:1450,endFrequency:1810,breathLevel:0.11,outputGain:0.2})
export const PRESET_BIRD_WHISTLE=preset("Bird Whistle",{length:0.32,startFrequency:2200,endFrequency:3150,secondRatio:1.012,outputGain:0.18})
export const PRESET_WHISTLES=Object.freeze([PRESET_727_SHORT_WHISTLE,PRESET_727_LONG_WHISTLE,PRESET_BIRD_WHISTLE])
