
import {publish} from 'gh-pages'
// This loads the package.json and updates the 
// version number based on a number of parameters
import { readFileSync, writeFileSync } from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)

// But which sem version scheme to use???
const packageVerson = pkg.version
const repositoryURL = pkg.repository.split("/")
// designerzen/MusicalFace.git
const repoName = repositoryURL.pop().replace(".git","")
const repoOwner = repositoryURL.pop()
const destinationURL = `https://${repoOwner}.github.io/${repoName}/`

// delete all none folders in dest/
console.log( "\x1b[33m", `Deploying ${repoName} - v${packageVerson}... please wait...` )
publish('dist',{dotfiles: true}, function(err) {

	if (err)
	{
		console.error("\x1b[31m", "Failed to deploy ${packageVerson}", err)
	}else{
		console.log("\x1b[32m", `Deployed version ${packageVerson} to ${destinationURL}`)	
	}

})