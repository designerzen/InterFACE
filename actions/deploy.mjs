// This loads the package.json and updates the 
// version number based on a number of parameters
import { readFileSync, writeFileSync } from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)

// But which sem version scheme to use???
const packageVerson = pkg.version
const repositoryURL = pkg.repository.split("/")
const repoName = repositoryURL.pop().replace(".git","")
const repoOwner = repositoryURL.pop()
const destinationURL = `https://${repoOwner}.github.io/${repoName}/`

// delete all none folders in dest/
console.log( "\x1b[33m", `Deploying ${repoName} - v${packageVerson}... please wait...` )
console.log( "\x1b[33m", `Depending on the size of this commit, it could take a long time` )

// deploy to Github by pushing to master branch on origin
// deploy to Cloudflare by pushing to master branch on origin

