const fs = require('fs')
const path = require('path')

const directory = 'dist'

console.log(`Cleaning ${directory}...`)
const WHITELIST = [
	"pwabuilder-sw.js",
	"manifest.json",
	"timing.requestframe.worker.js",
	"timing.setinterval.worker.js",
	"timing.settimeout.worker.js"

]

fs.readdir(directory, (err, files) => {
  if (err) throw err

  for (const file of files) 
  {
	  //"./",
	  const location = path.join(directory,file )
	  if (fs.statSync(location).isDirectory() )
	  {

	  }else{

		// check to see if it is whitelisted
		if (WHITELIST.indexOf(file) > -1)
		{
			// ignore
		}else{
			// DELETE
			fs.unlink(location, err => {
				if (err) throw err
			})	
		}
	
	  }
   
  }
})

console.log(`Cleaned ${directory}.`)