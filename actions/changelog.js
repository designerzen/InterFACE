import Changelog from 'generate-changelog'
import {readFileSync, writeFileSync} from 'fs'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)
const packageVerson = pkg.version

if ( process.argv.indexOf('--total') > -1 ){
    // change behaviour
}

Changelog.generate({ 
		patch: true, 
		allowUnknown:true,
		// minor : true,
		// major : true,
		repoUrl: 'https://github.com/designerzen/interface' 
	})
	.then( (changelog) => {
		writeFileSync('./CHANGELOG.md', changelog)
	})