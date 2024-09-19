/**
 * Copy files to dist/ and dist-electron/ from static/
 * 
 * NB. There is already a Parcel Plugin that handles
 * copying from static/ to dist/ so this is more for server
 * specific stuff such as downloading API data, copying
 * files from 
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, lstatSync, copyFileSync, constants } from 'node:fs'
import * as path from 'path'

const copyFolderSync = (from, to, overwrite=false ) => {

	if (existsSync(to))
	{ 
		console.log("Copying Folder directly", from, "to", to )
	}else{
		console.log("Creating destination Folder first", to )
		mkdirSync( to,  { recursive: true } )   
	}

	readdirSync(from).forEach(element => {
		if (lstatSync(path.join(from, element)).isFile()) {

			// FILES!

			// ensure that the destination folders are craeted

			//console.log("Copying File...", path.join(from, element), path.join(to, element) )
			try{
				copyFileSync(path.join(from, element), path.join(to, element), overwrite ? constants.COPYFILE_FICLONE_FORCE : constants.COPYFILE_EXCL)
				console.info("Copied ", from, to, element )
			}catch(error){
				console.info("Skipped ", from, element )
			}
			
		} else {
			copyFolderSync(path.join(from, element), path.join(to, element))
		}
	})
}
  
// copy Tensflow static wasm files and WAM files from node_modules into
// the public/ folder... this is because there is no way to specify the hash name
// in the google library - only the domain to load from!

// No longer has WASM backend due to conflicts
// copyFolderSync('./node_modules/@tensorflow/tfjs-backend-wasm/dist', './static/tf') 

copyFolderSync('./node_modules/@mediapipe/face_mesh/', './static/@mediapipe/face_mesh/') 
// copyFolderSync('./node_modules/@mediapipe/pose/', './static/@mediapipe/pose/') 
copyFolderSync('./node_modules/@mediapipe/tasks-vision/wasm/', './static/@mediapipe/tasks-vision/wasm/') 
// copyFolderSync('./node_modules/@mediapipe/', './static/@mediapipe/', true ) 
// copyFolderSync('./node_modules/@mediapipe/', './static/@mediapipe/', true ) 

// handled by static-copy-plugin
// copyFolderSync('./static/', './dist/') 
// copyFolderSync('./static/', './dist-electron/main/') 