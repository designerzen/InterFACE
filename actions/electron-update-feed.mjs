import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import updateFeed from './electron-update-feed-core.js'

const { createMacReleases, rewriteWindowsReleases } = updateFeed

const findFiles = async directory => {
	const files = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) files.push(...await findFiles(path))
		else if (entry.isFile()) files.push(path)
	}
	return files
}

export const prepareElectronUpdateFeed = async ({ assets, output, repository, tag, version, publishedAt }) => {
	const files = await findFiles(assets)
	const windowsManifest = files.find(path => basename(path) === 'RELEASES')
	const macZips = files.filter(path => path.toLowerCase().endsWith('.zip') && /darwin|macos/i.test(path))
	const macZip = macZips.find(path => /x64/i.test(path)) ?? macZips.find(path => !/arm64/i.test(path)) ?? macZips[0]
	const macArm64Zip = macZips.find(path => /arm64/i.test(path))

	if (!windowsManifest) throw new Error(`No Windows RELEASES manifest found below ${assets}`)
	if (!macZip) throw new Error(`No macOS ZIP found below ${assets}`)

	const windowsContents = rewriteWindowsReleases(
		await readFile(windowsManifest, 'utf8'),
		{ repository, tag },
	)
	await writeFile(windowsManifest, windowsContents, 'utf8')

	const macManifest = createMacReleases({
		repository,
		tag,
		version,
		filename: basename(macZip),
		publishedAt,
	})
	const macManifestSource = join(dirname(macZip), 'RELEASES.json')
	await writeFile(macManifestSource, `${JSON.stringify(macManifest, null, 2)}\n`, 'utf8')

	const windowsOutput = resolve(output, 'updates', 'win32', 'x64')
	const macOutput = resolve(output, 'updates', 'darwin', 'x64')
	await mkdir(windowsOutput, { recursive: true })
	await mkdir(macOutput, { recursive: true })
	await copyFile(windowsManifest, join(windowsOutput, 'RELEASES'))
	await copyFile(macManifestSource, join(macOutput, 'RELEASES.json'))

	if (macArm64Zip) {
		const macArm64Manifest = createMacReleases({
			repository,
			tag,
			version,
			filename: basename(macArm64Zip),
			publishedAt,
		})
		const macArm64Output = resolve(output, 'updates', 'darwin', 'arm64')
		await mkdir(macArm64Output, { recursive: true })
		await writeFile(join(macArm64Output, 'RELEASES.json'), `${JSON.stringify(macArm64Manifest, null, 2)}\n`, 'utf8')
	}

	return { windowsManifest, macManifestSource, macZip, macArm64Zip }
}

const parseArguments = arguments_ => {
	const values = {}
	for (let index = 0; index < arguments_.length; index += 2) {
		const name = arguments_[index]?.replace(/^--/, '')
		const value = arguments_[index + 1]
		if (!name || !value) throw new Error(`Invalid argument near ${arguments_[index] ?? '<end>'}`)
		values[name] = value
	}
	return values
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const options = parseArguments(process.argv.slice(2))
	for (const required of ['assets', 'output', 'repository', 'tag', 'version']) {
		if (!options[required]) throw new Error(`Missing --${required}`)
	}
	await prepareElectronUpdateFeed({
		...options,
		publishedAt: options.publishedAt ?? new Date().toISOString(),
	})
}
