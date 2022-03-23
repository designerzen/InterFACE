import {readFileSync, writeFileSync} from 'fs'

const RSS = require('rss');

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)
const repositoryURL = pkg.repository.split("/")
const repoName = repositoryURL.pop().replace(".git","")
const repoOwner = repositoryURL.pop()
const serverURL = `https://${repoOwner}.github.io/${repoName}/`
//  'May 20, 2012 04:00:00 GMT'
const pubDate = Date.now() 

/* lets create an rss feed */
const feed = new RSS({
    title: pkg.name,
    description: pkg.description,
    feed_url: `${serverURL}rss.xml`,
    site_url: `${serverURL}`,
    image_url: `${serverURL}assets/icons/android-chrome-512x512.png`,
    docs: `${serverURL}docs.html`,
    managingEditor: pkg.author,
    webMaster: pkg.author,
    copyright: pkg.license,
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate:pubDate,
    ttl: '60',
    custom_namespaces: {
      'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    custom_elements: [
      {'itunes:subtitle': 'A show about everything'},
      {'itunes:author': 'John Doe'},
      {'itunes:summary': 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store'},
      {'itunes:owner': [
        {'itunes:name': 'John Doe'},
        {'itunes:email': 'john.doe@example.com'}
      ]},
      {'itunes:image': {
        _attr: {
          href: 'http://example.com/podcasts/everything/AllAboutEverything.jpg'
        }
      }},
      {'itunes:category': [
        {_attr: {
          text: 'Technology'
        }},
        {'itunes:category': {
          _attr: {
            text: 'Gadgets'
          }
        }}
      ]}
    ]
})
 
// split by \### 0.52.0 (2021-06-22)\

// loop over data and add to feed
feed.item({

    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    // guid: '1123', // optional - defaults to url
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: Date.now(), // any format that js Date can parse.
	// lat: 33.417974, //optional latitude field for GeoRSS
    // long: -111.933231, //optional longitude field for GeoRSS
    
	enclosure: {
		url:'...', 
		file:'path-to-file'
	}, 
		// optional enclosure
    custom_elements: [
      {'itunes:author': 'John Doe'},
      {'itunes:subtitle': 'A short primer on table spices'},
      {'itunes:image': {
        _attr: {
          href: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg'
        }
      }},
      {'itunes:duration': '7:04'}
    ]
})
 
// cache the xml to send to clients
const xml = feed.xml()
writeFileSync('./source/rss.xml', xml)