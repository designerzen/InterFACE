// This loads the package.json and updates the 
// version number based on a number of parameters
import { readFileSync, writeFileSync } from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)

// But which sem version scheme to use???
const packageVerson = pkg.version

// sem ver style set by YARN
// pkg.version = gitVerson
console.log("Version found", pkg.version  )

// also save i into a js file as a constant
// const fileVariant = `module.export = { version:"${packageVerson}" }`
const fileVariant = `export const VERSION="${packageVerson}"`
const textVariant = `${packageVerson}`

// save to disk
// writeFileSync("./package.json", JSON.stringify(pkg, null, '\t') )
writeFileSync("./source/version.js", fileVariant)

// now 
writeFileSync("./source/version.txt", textVariant)

console.log("Saved to pakage.json and to source/version.js", packageVerson )

// now update the pug config :( as it cannot handle require :(
