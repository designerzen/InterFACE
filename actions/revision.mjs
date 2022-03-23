// This loads the package.json and updates the 
// version number based on a number of parameters
import { readFileSync, writeFileSync } from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)

// But which sem version scheme to use???
const packageVerson = pkg.version
const DATE = Date.now()

// sem ver style set by YARN
// pkg.version = gitVerson
console.log( "\x1b[35m", "info Using version", pkg.version  )

// also save it into a js file as a constant
const fileVariant = `export const VERSION="${packageVerson}";\rexport const DATE=${DATE};`
const textVariant = `${packageVerson}`
const jsonVariant = JSON.stringify( { 
	version:packageVerson, 
	date:DATE,
	name:pkg.name,
	description:pkg.description,
	author:pkg.author,
	license:pkg.license,
	repository:pkg.repository,
	dependencies:pkg.dependencies
} )

// save to disk
// writeFileSync("./package.json", JSON.stringify(pkg, null, '\t') )

// For COMPILE time in JS
writeFileSync("./source/version.js", fileVariant)

// For COMPILE in PUG 
writeFileSync("./source/version.txt", textVariant)

// For CLIENTSIDE download
writeFileSync("./dist/info.json", jsonVariant)


console.log("Saved to package.json and to source/version.js, dist/info.json and source/version.txt" )

// now update the pug config :( as it cannot handle require :(
