const fs = require('fs')
const path = require('path')

const directory = 'dist'

console.log(`Cleaning ${directory}...`)

fs.readdir(directory, (err, files) => {
  if (err) throw err

  for (const file of files) 
  {
	  //"./",
	  const location = path.join(directory,file )
	  if (fs.statSync(location).isDirectory() )
	  {

	  }else{
		fs.unlink(location, err => {
			if (err) throw err
		})
	  }
   
  }
})

console.log(`Cleaned ${directory}.`)