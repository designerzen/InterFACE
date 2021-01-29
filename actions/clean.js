/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/

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
	  
	console.log("\x1b[31m", `Cleaned ${directory}.`)
})


console.log("\x1b[32m",`All Clean!`)