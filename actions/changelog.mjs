import Changelog from 'generate-changelog'
import {readFileSync, writeFileSync, appendFileSync} from 'node:fs'
import showdown from 'showdown'
import { Feed } from "feed"
import { parse } from 'node-html-parser'



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
		const asHTML = `<section>${html}</section>` 

		// convert to object
		const root = parse(html)
		const changeTitleElement = root.querySelector('h4')
		const changeTitle = changeTitleElement.textContent
		const changeDateText = changeTitle.match(/\((.*)\)/).pop()
		const changeDate = new Date(changeDateText)
		const changeDescriptionElements = root.querySelectorAll('h5')
		
		const change = {
			title: changeTitle,
			description:"",
			id: "https://interface.place",
			link: "",
			content: "",
			author: [
			  {
				name: "zen",
				email: "zen@designerzen.com",
				link: "https://designerzen.com"
			  }
			],
			date: changeDate,
			image: "http://interface.place/favicon.ico"
		}

		changeDescriptionElements.forEach(element => {
			const changeListElements = element.nextElementSibling
			change.description += `${element.textContent} / `
			change.content += `${changeListElements.textContent}\n`
		})

		// wrtite out as markdown
		writeFileSync('./CHANGELOG.md', changelog)

		// convert to html and save as webpage
		// writeFileSync('./source/changes.html', html )

		writeFileSync('./source/changes.html', html )
		writeFileSync('./source/changelog.html', asHTML, { flag: "a+" } )
		// appendFileSync( './source/changes.html', asHTML )  

		// convert to rss feeds
		const feed = new Feed({
			title: `PhotoSYNTH InterFACE v${packageVerson}`,
			description: "News feed and release updates",
			id: "http://example.com/",
			link: "http://interface.place/",
			language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
			image: "http://example.com/image.png",
			favicon: "http://example.com/favicon.ico",
			copyright: "All rights reserved 2024, designerzen",
			//updated: new Date(), // optional, default = today
			generator: "awesome", // optional, default = 'Feed for Node.js'
			feedLinks: {
			  json: "https://interface.place/feed.json",
			  atom: "https://interface.place/feed.xml"
			},
			author: {
			  name: "zen",
			  email: "zenon@designerzen.com",
			  link: "https://designerzen.com"
			}
		  })
		  feed.addItem(change)

		  /*
		  // 
		//   posts.forEach(post => {
			feed.addItem({
			  title: post.title,
			  id: post.url,
			  link: post.url,
			  description: post.description,
			  content: html,
			  author: [
				{
				  name: "Jane Doe",
				  email: "janedoe@example.com",
				  link: "https://example.com/janedoe"
				}
			  ],
			  date: post.date,
			  image: post.image
			})
		//   })
		  */
		  feed.addCategory("VR")
		  
		  writeFileSync('./source/rss.xml', feed.rss2() )
		  writeFileSync('./source/feed.xml', feed.atom1() )
		  writeFileSync('./source/feed.json', feed.json1() )

		// writeFileSync('./source/changes.html', `<section>${html}</section>` )
	})