// import Zlib from 'zlibjs'
import { deflate, unzip } from './zlib'

import ZIP_WORKER_URI from 'url:./zip.worker.js'

export const extractZip = (data, useWorker=false ) => new Promise( (resolve, reject) => {
	
	if (useWorker)
	{
		// , import.meta.url
		const worker = new Worker( new URL(ZIP_WORKER_URI), {type: 'module'} )

		worker.onmessage = message => {
			//console.log("zippy", message)
			resolve(message.data)
			worker.terminate()
			worker = null
		}

		worker.onerror = error => reject(error)

		worker.postMessage({data})

	}else{

		const zipped = new Uint8Array(data)		
		unzip(zipped, {}, (err, buffer) => {

			if (err) 
			{
				console.error('An error occurred:', err)
				reject(err)

			}else{
				resolve(buffer)
			}
		})	
	}
} )


/**
 * TODO: Pass in some data to create a zip file...
 * @param {*} data 
export const createZip = data => {

}
 */