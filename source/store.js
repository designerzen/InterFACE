import {debounce} from './utils'

// little local storage wrapper for storing cached objects
export const createStore = (name="Plops") => {
	const storage = localStorage.getItem(name)
	const data = Object.assign({}, JSON.parse(storage) )
	const save = debounce( updates => {
		localStorage.setItem(name, JSON.stringify(updates) )
		// console.error("store",name,"saved>",updates, localStorage.getItem(name) )

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
			data[key] = Object.assign( {}, value, data[key] )
			// save to local
			save(data)
			return data
		},
	}
}

