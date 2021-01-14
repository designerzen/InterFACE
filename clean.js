import {readdir,statSync,unlink} from 'fs'
import * as path from 'path'

// const directory = 'dist'

const directories = ['dist','app']

const WHITELIST = [
	// "manifest.webmanifest",
	// "service-worker.js",
	"timing.requestframe.worker.js",
	// "timing.setinterval.worker.js",
	// "timing.settimeout.worker.js",
	"browserconfig.xml",
	"favicon.ico"
	// "safari-pinned-tab.svg"
]

directories.forEach( directory => {

	console.log(`Cleaning ${directory}...`)

	readdir(directory, (err, files) => {
		if (err) throw err
	  
		for (const file of files) 
		{
			const location = path.join( directory,file )
			if (statSync(location).isDirectory() )
			{
	  
			}else{
	  
			  // check to see if it is whitelisted
			  if (WHITELIST.indexOf(file) > -1)
			  {
				  // ignore
			  }else{
				  // DELETE
				  unlink(location, err => {
					  if (err) throw err
				  })	
			  }
		  
			}
		}
	  })
	  
	console.log(`Cleaned ${directory}.`)
})


console.log(`All Clean!`)