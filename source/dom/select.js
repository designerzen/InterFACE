import {updateTempo} from './ui'

export const connectSelect = async (element,callback) => {
	const select = typeof element === "string" ? document.getElementById(element) : element
	
	if (!select){
		throw Error("No element found with that spec")
	}
	select.addEventListener( 'change', event=>{
		//const selection = select.options.selectedIndex
		// const option = select.childNodes[selection]
		const option = select.options[select.selectedIndex || select.options.selectedIndex] 
		callback && callback (option)
		event.preventDefault()
	})

	return select
}

export const connectPaletteSelector = (callback) => connectSelect('select-palette', callback )
export const connectReverbSelector = (callback) => connectSelect('select-impulse', callback )

export const connectTempoControls = (callback) => {
	connectSelect('select-tempo', (option)=>{
		const tempo = parseInt( option.innerHTML )
		updateTempo(tempo)
		callback && callback (tempo)
	} )
}


import {loadImpulseJSON, DIRS, REVERB_PATHS} from '../audio/effects/reverb'

const path = './assets/audio/acoustics/'	

// Connect the options comand to the JSON files
export const connectReverbControls = (callback) => {

	const ID = 'select-impulse'
	const dirs = DIRS// REVERB_PATHS
	// inject
	const options = document.getElementById( ID )	
	// TODO: dir should flip depending on the item prefix
	if (options)
	{				
		const createOptionValues = (items, directory) => items.map( item => {
			item = item.trim()
			const filePath = item
			const fileName = item.substring( item.lastIndexOf("/") + 1 )
			const name = fileName.substring(0, fileName.lastIndexOf('.'))
			//const option = `<option value="verb">reverbing</option>` 
			const option = `<option value="${filePath}">${name}</option>` 
			return option
		}).join('\n')
	
		const maapped = dirs.map( async (dir) => {
			const json = await loadImpulseJSON(dir)
			const option = createOptionValues( json, dir)
			return `<optgroup>${dir}</optgroup>${option}`
		})

		Promise.all(maapped).then( optionData => {
			options.innerHTML = optionData.join('')
		})
	
	}else{
		console.error("Injecting impulse FAILED to ", {options, impulseList})
	}

	return connectSelect( ID, (option)=> callback && callback(option) )
}
