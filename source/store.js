import {debounce} from './utils'

/**
 * little local storage wrapper for storing cached objects
 * @param {String} name Unique name for the store cache
 * @returns {Array<Function>} Store controls
 */
export const createStore = (name="InterFACE") => {
	const storage = localStorage.getItem(name)
	const data = Object.assign({}, JSON.parse(storage) )
	const save = debounce( updates => {
		const encoded = JSON.stringify(updates)
		localStorage.setItem(name, encoded )
		
	}, 20 )
	
// console.error("store",name,"created", {data, storage})

	return {
		save,
		has:key =>{
			return data[key] ? true : false
		},
		removeItem:key =>{
			delete data[key] 
		},
		getItem:key =>{
			return data[key] 
		},
		setItem:(key,value)=>{
			data[key] = Object.assign( {}, data[key], value )
			// save to local
			save(data)
			
			return data
		},
	}
}

