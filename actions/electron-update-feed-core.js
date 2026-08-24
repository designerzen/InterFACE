const path = require('node:path')

const releaseAssetUrl = ({ repository, tag, filename }) =>
	`https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(filename)}`

const rewriteWindowsReleases = (contents, release) => contents
	.split(/\r?\n/)
	.map(line => {
		if (!line.trim()) return ''
		const match = line.match(/^(\S+)\s+(\S+)\s+(\d+(?:#.*)?)$/)
		if (!match) throw new Error(`Invalid Squirrel RELEASES entry: ${line}`)
		const [, sha, filename, size] = match
		const url = /^https?:\/\//i.test(filename)
			? filename
			: releaseAssetUrl({ ...release, filename: path.basename(filename) })
		return `${sha} ${url} ${size}`
	})
	.filter(Boolean)
	.join('\n') + '\n'

const createMacReleases = ({ repository, tag, version, filename, publishedAt }) => ({
	currentRelease: version,
	releases: [{
		version,
		updateTo: {
			version,
			url: releaseAssetUrl({ repository, tag, filename }),
			name: `PhotoSYNTH ${version}`,
			notes: `PhotoSYNTH ${version}`,
			pub_date: publishedAt,
		},
	}],
})

module.exports = { createMacReleases, releaseAssetUrl, rewriteWindowsReleases }
