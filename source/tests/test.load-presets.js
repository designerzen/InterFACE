export const testLoadPresets = async () => {

	const soundFontModel = new SoundFont( offlineAudioContext )

	// need to simplify
	const soundFontModels = await soundFontModel.loadDescriptor( packName, "assets/audio/" )
	
	// get's all preset options for us to load in later on!
	// const soundFontPresets = soundFontModel.presets
	const soundFontPreset = soundFontModel.presets[0] //.title

	// you can load presets in a range of different ways :
	let options = {
		// URI of the sound font
		// soundfont : instrumentURI,
		// try and use a seperate thread for loading and decoding the data
		usingWorker : false,
		// load as a single string and convert to individual files
		// NB. this uses less network but more decoding time
		loadAsOne : false,
		// as a collection of elements in an object rather than array { A0: }
		asArray : false,
		// use offline worker if available (may be faster?)
		offlineAudioContext:null
	}
		
	// 1. Local files [mp3, ogg] served on the *same server*
	const preset1 =  await soundFontModel.loadPreset( soundFontPreset, {...options} )

	// 2. Local files as base64 encoded data in JS files
	const preset2 =  await soundFontModel.loadPreset( soundFontPreset, {...options, loadAsOne : true} )
		
	// 3. Remote audio files [mp3, ogg] served on different domain
	const preset3 =  await soundFontModel.loadPreset( soundFontPreset, {...options} )
		
	// 4. Remote base64 
	const preset4 =  await soundFontModel.loadPreset( soundFontPreset, {...options, loadAsOne : true} )


	
	// const preset =  await soundFontModel.loadPreset( soundFontPreset, {} )
	// const preset =  await soundFontModel.loadPreset( soundFontPreset, {} )

	// const all = await soundFontModel.loadPreset()
	// const all = await soundFontModel.loadAllPresets()

	console.log("SoundFont", {soundFontModel, soundFontModels, preset} )
	console.log("Presets", {preset1, preset2, preset3, preset4} )

		
	options = { ...options, usingWorker : false }


	// 1. Local files [mp3, ogg] served on the *same server*
	const preset5 =  await soundFontModel.loadPreset( soundFontPreset, {...options} )

	// 2. Local files as base64 encoded data in JS files
	const preset6 =  await soundFontModel.loadPreset( soundFontPreset, {...options, loadAsOne : true} )
		
	// 3. Remote audio files [mp3, ogg] served on different domain
	const preset7 =  await soundFontModel.loadPreset( soundFontPreset, {...options} )
		
	// 4. Remote base64 
	const preset8 =  await soundFontModel.loadPreset( soundFontPreset, {...options, loadAsOne : true} )
	console.log("Presets", {preset5, preset6, preset7, preset8} )
		
}