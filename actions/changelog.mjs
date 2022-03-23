import Changelog from 'generate-changelog'
import {readFileSync, writeFileSync} from 'fs'
import showdown from 'showdown'

const {Converter} = showdown
const converter = new Converter()
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

		// changelog is in markdown so convert to html?
		const html = converter.makeHtml(changelog)

		writeFileSync('./CHANGELOG.md', changelog)
		writeFileSync('./source/changes.html', html )
		// writeFileSync('./source/changes.html', `<section>${html}</section>` )
	})