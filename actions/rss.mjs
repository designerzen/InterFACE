import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { Feed } from 'feed'

const packageFile = readFileSync('./package.json')
const pkg = JSON.parse(packageFile)
const packageVersion = pkg.version

// Get git log with commit hashes and messages
const gitLog = execSync('git log --pretty=format:"%H|%s|%aI" --no-merges').toString().trim()
const commits = gitLog.split('\n').map(line => {
  const [hash, message, date] = line.split('|')
  return { hash: hash.substring(0, 7), message, date: new Date(date) }
})

// Create RSS feed
const feed = new Feed({
  title: `PhotoSYNTH InterFACE v${packageVersion}`,
  description: pkg.description,
  id: 'https://interface.place/',
  link: 'https://interface.place/',
  language: 'en',
  image: 'https://interface.place/favicon.ico',
  favicon: 'https://interface.place/favicon.ico',
  copyright: 'All rights reserved 2024, designerzen',
  generator: 'rss.mjs',
  feedLinks: {
    json: 'https://interface.place/feed.json',
    atom: 'https://interface.place/feed.xml',
    rss: 'https://interface.place/rss.xml'
  },
  author: {
    name: 'designerzen',
    email: 'zen@designerzen.com',
    link: 'https://designerzen.com'
  }
})

// Group commits by day and add to feed
const groupedByDay = {}
commits.forEach(commit => {
  const day = commit.date.toISOString().split('T')[0]
  if (!groupedByDay[day]) {
    groupedByDay[day] = []
  }
  groupedByDay[day].push(commit)
})

// Add items in reverse chronological order
Object.keys(groupedByDay).sort().reverse().forEach(day => {
  const dayCommits = groupedByDay[day]
  const content = dayCommits.map(c => `${c.hash} - ${c.message}`).join('\n')
  
  feed.addItem({
    title: `Commits from ${day}`,
    id: `https://interface.place/commits/${day}`,
    link: 'https://github.com/designerzen/interface/commits/main',
    description: `${dayCommits.length} commit(s)`,
    content: content,
    author: [{
      name: 'designerzen',
      email: 'zen@designerzen.com',
      link: 'https://designerzen.com'
    }],
    date: dayCommits[0].date
  })
})

feed.addCategory('Development')

// Write all feed formats
writeFileSync('./source/rss.xml', feed.rss2())
writeFileSync('./source/feed.xml', feed.atom1())
writeFileSync('./source/feed.json', feed.json1())