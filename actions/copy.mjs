/**
 * Copy all files from public to dist/
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, lstatSync, copyFileSync} from 'fs'
import * as path from 'path'

const copyFolderSync = (from, to) => {

	console.log("Copying Folder", from, "to", to )
	if (existsSync(to))
	{ 
	
	}else{
		console.log("Creating destination Folder", to )
		mkdirSync(to)   
	}
	
	readdirSync(from).forEach(element => {
		if (lstatSync(path.join(from, element)).isFile()) {
			//console.log("Copying File...", path.join(from, element), path.join(to, element) )
			copyFileSync(path.join(from, element), path.join(to, element))
		} else {
			copyFolderSync(path.join(from, element), path.join(to, element))
		}
	})
}
  
copyFolderSync('./public', './dist') 