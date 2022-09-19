// import Zlib from 'zlibjs'
import { deflate, unzip } from './zlib'

export const extractZip = (data) => new Promise( (resolve, reject) => {
	
	const zipped = new Uint8Array(data)
	unzip(zipped, (err, buffer) => {

		if (err) 
		{
		  	console.error('An error occurred:', err)
			reject(err)

		}else{

			const xml = new TextDecoder("utf-8").decode(buffer)
			resolve(xml)
		}
	})
} )

/**
 * TODO: Pass in some data to create a zip file...
 * @param {*} data 
 */
export const createZip = data => {

}