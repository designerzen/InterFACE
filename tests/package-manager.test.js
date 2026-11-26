/** @jest-environment node */
const { mkdtemp, writeFile, unlink, rmdir } = require('node:fs/promises')
const { tmpdir } = require('node:os')
const path = require('node:path')
const { runPnpm } = require('../actions/upgrade-soundfont.cjs')

test('the upgrade launcher executes native binaries instead of parsing them as JavaScript', async () => {
	const { stdout } = await runPnpm(process.execPath, ['--version'])
	expect(stdout.trim()).toBe(process.version)
})

test('the upgrade launcher runs JavaScript entrypoints and preserves arguments with spaces', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'photosynth-pnpm-'))
	const entry = path.join(directory, 'package manager.cjs')
	try {
		await writeFile(entry, 'process.stdout.write(JSON.stringify(process.argv.slice(2)))')
		const args = ['add', '-Dw', 'package with spaces']
		const { stdout } = await runPnpm(entry, args)
		expect(JSON.parse(stdout)).toEqual(args)
	} finally {
		await unlink(entry)
		await rmdir(directory)
	}
})
