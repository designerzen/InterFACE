import {VERSION, DATE} from '../version'

const releaseDate = new Date(DATE)
const dateOptions = {
	hour12 : true,
	hour:  "numeric",
	minute:  "numeric",
 }
export const formattedDate = `${releaseDate.getDate()}/${releaseDate.getMonth()+1}/${releaseDate.getFullYear()} ${ releaseDate.toLocaleTimeString("en-GB",dateOptions) }`
