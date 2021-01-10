// This loads the package.json and updates the 
// version number based on a number of parameters
import { readFileSync, writeFileSync } from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)

// But which sem version scheme to use???
const packageVerson = pkg.version
const gitVerson = "0.0.3"
const parcelVerson = "0.0.3"

// sem ver style set by YARN
// pkg.version = gitVerson
console.log("Version found", pkg.version  )

// also save i into a js file as a constant
const fileVariant = `export const VERSION="${packageVerson}"`

// save to disk
// writeFileSync("./package.json", JSON.stringify(pkg, null, '\t') )
writeFileSync("./source/version.js", fileVariant)

console.log("Saved to pakage.json and to source/version.js", packageVerson )
