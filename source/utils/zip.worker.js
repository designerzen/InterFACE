
import Zlib from './zlib.js'

const { deflate, unzip } = Zlib

self.onmessage = async ( e ) => {
	
	const {command="start", options={}, data } = e.data
   
	switch (command)  {

		default:
			const zipped = new Uint8Array(data)

			unzip(zipped, options, (error, buffer) => {

				if (error) 
				{
					console.error('An error occurred:', error)
					self.postMessage({error})

				}else{
					self.postMessage(buffer)
				}
			})	

	}
}
