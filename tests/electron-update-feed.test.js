/** @jest-environment node */

import { createMacReleases, releaseAssetUrl, rewriteWindowsReleases } from '../actions/electron-update-feed-core.js'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

describe('Electron static update feed', () => {
	const release = { repository: 'designerzen/InterFACE', tag: 'v1.2.3' }

	test('points new Windows packages at immutable GitHub Release assets', () => {
		const previousUrl = 'https://github.com/designerzen/InterFACE/releases/download/v1.2.2/photosynth-1.2.2-full.nupkg'
		const input = [
			`oldsha ${previousUrl} 900`,
			'newsha photosynth-1.2.3-delta.nupkg 100',
			'fullsha photosynth-1.2.3-full.nupkg 1000',
		].join('\n')

		const output = rewriteWindowsReleases(input, release)

		expect(output).toContain(`oldsha ${previousUrl} 900`)
		expect(output).toContain('newsha https://github.com/designerzen/InterFACE/releases/download/v1.2.3/photosynth-1.2.3-delta.nupkg 100')
		expect(output).toContain('fullsha https://github.com/designerzen/InterFACE/releases/download/v1.2.3/photosynth-1.2.3-full.nupkg 1000')
	})

	test('creates a macOS static feed targeting the release ZIP', () => {
		const feed = createMacReleases({
			...release,
			version: '1.2.3',
			filename: 'PhotoSYNTH-darwin-x64-1.2.3.zip',
			publishedAt: '2026-08-22T12:00:00.000Z',
		})

		expect(feed.currentRelease).toBe('1.2.3')
		expect(feed.releases[0].updateTo.url).toBe(
			releaseAssetUrl({ ...release, filename: 'PhotoSYNTH-darwin-x64-1.2.3.zip' }),
		)
	})

	test('rejects malformed Windows feed entries', () => {
		expect(() => rewriteWindowsReleases('not a release line', release)).toThrow('Invalid Squirrel RELEASES entry')
	})

	test('stages platform manifests from Forge output', async () => {
		const root = await mkdtemp(join(tmpdir(), 'photosynth-update-feed-'))
		const assets = join(root, 'assets')
		const squirrel = join(assets, 'squirrel.windows', 'x64')
		const mac = join(assets, 'zip', 'darwin', 'x64')
		const output = join(root, 'output')
		await mkdir(squirrel, { recursive: true })
		await mkdir(mac, { recursive: true })
		await writeFile(join(squirrel, 'RELEASES'), 'sha photosynth-1.2.3-full.nupkg 1000\n')
		await writeFile(join(mac, 'PhotoSYNTH-darwin-x64-1.2.3.zip'), 'fixture')

		try {
			await execFileAsync(process.execPath, [
				join(process.cwd(), 'actions', 'electron-update-feed.mjs'),
				'--assets', assets,
				'--output', output,
				'--repository', release.repository,
				'--tag', release.tag,
				'--version', '1.2.3',
				'--publishedAt', '2026-08-22T12:00:00.000Z',
			])

			const windows = await readFile(join(output, 'updates', 'win32', 'x64', 'RELEASES'), 'utf8')
			const darwin = JSON.parse(await readFile(join(output, 'updates', 'darwin', 'x64', 'RELEASES.json'), 'utf8'))
			expect(windows).toContain('/releases/download/v1.2.3/photosynth-1.2.3-full.nupkg')
			expect(darwin.currentRelease).toBe('1.2.3')
		} finally {
			await rm(root, { recursive: true, force: true })
		}
	})
})
