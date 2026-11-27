import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

export const resolveReleaseVersion = ({ version, ref = '', head, tags }) => {
	if (!stableVersion.test(version)) throw new Error(`Expected a stable package version, got ${version}`)
	const [major, minor, patch] = version.split('.').map(Number)
	if (ref.startsWith('refs/tags/')) {
		const tag = ref.slice(10)
		const tagVersion = tag.slice(1)
		const [tagMajor, tagMinor, tagPatch] = tagVersion.split('.').map(Number)
		// Automatic releases can have a newer patch than the committed package.
		if (!tag.startsWith('v') || !stableVersion.test(tagVersion) || tagMajor !== major || tagMinor !== minor || tagPatch < patch) {
			throw new Error(`Tag ${tag} does not match package release line ${version}`)
		}
		if (tags.get(tag) !== head) throw new Error(`Tag ${tag} does not point to the checked out commit`)
		return { tag, version: tagVersion }
	}

	let latestPatch = patch
	for (const tag of tags.keys()) {
		const candidate = tag.slice(1)
		if (!tag.startsWith('v') || !stableVersion.test(candidate)) continue
		const [tagMajor, tagMinor, tagPatch] = candidate.split('.').map(Number)
		if (tagMajor === major && tagMinor === minor) latestPatch = Math.max(latestPatch, tagPatch)
	}
	const latestTag = `v${major}.${minor}.${latestPatch}`
	if (tags.has(latestTag) && tags.get(latestTag) !== head) latestPatch += 1
	const releaseVersion = `${major}.${minor}.${latestPatch}`
	return { tag: `v${releaseVersion}`, version: releaseVersion }
}

export const applyReleaseVersion = (version, directory = '.') => {
	if (!stableVersion.test(version)) throw new Error(`Expected a stable release version, got ${version}`)
	const packagePath = resolve(directory, 'package.json')
	const sourceVersionPath = resolve(directory, 'source/version.js')
	const source = readFileSync(packagePath, 'utf8')
	const sourceVersion = readFileSync(sourceVersionPath, 'utf8')
	const pkg = JSON.parse(source)
	// Preserve package formatting when applying the release version in CI.
	writeFileSync(packagePath, source.replace(/("version"\s*:\s*")[^"]+(")/, (_, prefix, suffix) => `${prefix}${version}${suffix}`))
	writeFileSync(sourceVersionPath, sourceVersion.replace(/(export const VERSION\s*=\s*")[^"]+(")/, (_, prefix, suffix) => `${prefix}${version}${suffix}`))
	console.log(`Building ${pkg.name} ${version} (package version ${pkg.version})`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	try {
		if (process.argv[2] === '--apply') {
			applyReleaseVersion(process.argv[3])
		} else {
			const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
			const tags = new Map(git('for-each-ref', '--format=%(refname:strip=2) %(objectname) %(*objectname)', 'refs/tags')
				.split('\n').filter(Boolean).map(line => {
					const [tag, object, peeled] = line.trim().split(' ')
					return [tag, peeled || object]
				}))
			const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
			const release = resolveReleaseVersion({ version, ref: process.env.GITHUB_REF, head: git('rev-parse', 'HEAD'), tags })
			if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tag=${release.tag}\nversion=${release.version}\n`)
			console.log(`Publishing ${release.tag} from ${git('rev-parse', 'HEAD')} (package version ${version})`)
		}
	} catch (error) {
		console.error(`::error::${error.message}`)
		process.exitCode = 1
	}
}
