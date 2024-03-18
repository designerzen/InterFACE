/**
 * This simply deletes files from the build folder that make the package
 * grow over the 20,000 Cloudflare limit for CF Pages.
 * 
 * It mainly just deletes a sound font and specifies the
 * instrument to load
 */

import {existsSync,readdir,statSync,unlink} from 'fs'
import * as path from 'path'

// check dirs exist
const DELETE = [ 'dist/assets/audio/FluidR3_GM' ]
const directories = DIRS.filter( (dir,index,data)=> existsSync(dir) )

console.log(`Found ${directories.length} folders`, directories )

// Files to delete!
const BLACKLIST = [
	"fluid.json"
]

const deleteFile = async (location) => {
	unlink(location, err => {
	
		if (err) {
			throw err
		}
		return true
	})	
}

const deleteDir = async (dir) => {
	fs.rmdir(dir, { recursive: true }, err => {
		if (err) {
		  throw err
		}
		console.log(`${dir} deleted`)
		return true
	})
}

directories.forEach( directory => {

	console.log(`Cleaning ${directory}...`)

	readdir(directory, (err, files) => {
		if (err) throw err
	  
		for (const file of files) 
		{
			const location = path.join( directory,file )
			if (statSync(location).isDirectory() )
			{
				// leave directories?
			}else{
	  
			  // check to see if it is whitelisted
			  if ( BLACKLIST.indexOf(file) > -1)
			  {
				  // DELETE
				  unlink(location, err => {
					  if (err) throw err
				  })	
				  // fs.rm(path, { recursive: true, force: true })
			  }
		  
			}
		}
	  })
	  
	console.log("\x1b[31m", `Cleaned ${directory}.`)
})


console.log("\x1b[32m",`All Clean!`)