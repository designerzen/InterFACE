import assert from 'node:assert/strict'
import { readFile, readdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { upgradeSoundfont } from '../actions/upgrade-soundfont.cjs'

test('upgrade resolves main and installs an immutable package revision', async () => {
	const revision = 'a'.repeat(40)
	const calls = []
	assert.equal(await upgradeSoundfont({ pnpm: '/pnpm.cjs', run: async (...args) => {
		calls.push(args)
		return { stdout: calls.length === 1 ? `${revision}\trefs/heads/main\n` : '' }
	} }), revision)
	assert.deepEqual(calls[0][1].slice(0, 2), ['ls-remote', '--exit-code'])
	assert.deepEqual(calls[1][1], ['/pnpm.cjs', 'add', '-Dw', `open-gm@github:designerzen/Open-GeneralMIDI-SoundFont#${revision}`])
})

test('an invalid revision or unavailable upstream cannot change the package pin', async () => {
	let calls = 0
	await assert.rejects(upgradeSoundfont({ pnpm: '/pnpm.cjs', run: async () => {
		calls++
		return { stdout: 'invalid' }
	} }), /Invalid OpenGM/)
	assert.equal(calls, 1)
	await assert.rejects(upgradeSoundfont({ pnpm: '/pnpm.cjs', run: async () => { throw new Error('offline') } }), /offline/)
})

test('installed package supplies every preset and Parcel publishes its samples, descriptor and license', async () => {
	const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)))
	assert.match(packageJson.devDependencies['open-gm'], /#[a-f0-9]{40}$/)
	const configs = packageJson.staticFiles.filter(entry => entry.staticPath.includes('/open-gm/'))
	assert.deepEqual(configs.map(entry => entry.staticOutPath), ['assets/audio/OpenGM24/', 'assets/audio/', 'assets/audio/OpenGM24/'])
	const presets = JSON.parse(await readFile(new URL('../node_modules/open-gm/OpenGM24.json', import.meta.url)))
	assert.equal(presets.length, 128)
	for (const preset of presets) {
		const samples = await readdir(new URL(`../node_modules/open-gm/OpenGM24/${preset}-mp3/`, import.meta.url))
		assert.ok(samples.some(name => name.endsWith('.mp3')), preset)
	}
	assert.ok((await readFile(new URL('../node_modules/open-gm/LICENSE.txt', import.meta.url))).length)
	const temporary = await mkdtemp(path.join(os.tmpdir(), 'photosynth-opengm-'))
	try {
		const manifest = path.join(temporary, 'package.json')
		await writeFile(manifest, JSON.stringify({ staticFiles: configs }))
		const reporter = createRequire(import.meta.url)('parcel-reporter-static-files-copy').default
		const output = path.join(temporary, 'build')
		await reporter[Symbol.for('parcel-plugin-config')].report({
			event: { type: 'buildSuccess', bundleGraph: { getBundles: () => [{ target: { distDir: output } }] } },
			options: { env: { npm_package_json: manifest } }
		})
		assert.deepEqual(JSON.parse(await readFile(path.join(output, 'assets/audio/OpenGM24.json'))), presets)
		assert.deepEqual(await readFile(path.join(output, 'assets/audio/OpenGM24/LICENSE.txt')), await readFile(new URL('../node_modules/open-gm/LICENSE.txt', import.meta.url)))
		for (const preset of presets) {
			assert.deepEqual(await readdir(path.join(output, `assets/audio/OpenGM24/${preset}-mp3`)), await readdir(new URL(`../node_modules/open-gm/OpenGM24/${preset}-mp3/`, import.meta.url)))
		}
	} finally {
		const relative = path.relative(os.tmpdir(), temporary)
		if (relative.startsWith('..') || path.isAbsolute(relative) || !relative.startsWith('photosynth-opengm-')) throw new Error('Unexpected test cleanup directory')
		await rm(temporary, { recursive: true, force: true })
	}
})
