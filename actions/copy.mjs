/**
 * Copy files to dist/ and dist-electron/ from static/
 * 
 * NB. There is already a Parcel Plugin that handles
 * copying from static/ to dist/ so this is more for server
 * specific stuff such as downloading API data, copying
 * files from 
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, lstatSync, copyFileSync } from 'node:fs'
import * as path from 'path'

const copyFolderSync = (from, to) => {

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
			// Refresh installed assets after dependency upgrades. A failed copy must
			// fail the task so Turborepo cannot cache an incomplete asset directory.
			const source = path.join(from, element)
			const destination = path.join(to, element)
			if (existsSync(destination) && readFileSync(source).equals(readFileSync(destination))) return
			copyFileSync(source, destination)
			console.info("Copied ", from, to, element )
			
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

// POSE IS 26MB! Larger than the cloudflare limit of 25MB!
// copyFolderSync('./node_modules/@mediapipe/pose/', './static/@mediapipe/pose/') 

copyFolderSync('./node_modules/@mediapipe/tasks-vision/', './static/@mediapipe/tasks-vision/')
// copyFolderSync('./node_modules/@mediapipe/', './static/@mediapipe/', true ) 
// copyFolderSync('./node_modules/@mediapipe/', './static/@mediapipe/', true ) 

// WebGPU tasks
copyFolderSync('./node_modules/@litertjs/core/wasm/', './static/@litertjs/'  ) 

// Keep QR scanning local, including when the app is installed offline.
copyFolderSync('./node_modules/zxing-wasm/dist/reader/', './static/zxing/')

// handled by static-copy-plugin
// copyFolderSync('./static/', './dist/') 
// copyFolderSync('./static/', './dist-electron/main/')
