import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { applyReleaseVersion, resolveReleaseVersion } from '../actions/electron-release-version.mjs'

const resolveVersion = (tags = [], options = {}) => resolveReleaseVersion({
	version: '0.61.7', ref: 'refs/heads/main', head: 'current', tags: new Map(tags), ...options,
})

test('first release uses the package version', () => {
	assert.deepEqual(resolveVersion(), { version: '0.61.7', tag: 'v0.61.7' })
})

test('a branch build advances past an existing release on another commit', () => {
	assert.deepEqual(resolveVersion([['v0.61.7', 'previous']]), { version: '0.61.8', tag: 'v0.61.8' })
})

test('manual builds advance even when package.json is several releases behind', () => {
	assert.equal(resolveVersion([['v0.61.7', 'old'], ['v0.61.9', 'previous']], { ref: 'refs/heads/fix' }).version, '0.61.10')
})

test('retrying the same commit reuses its latest release tag', () => {
	assert.equal(resolveVersion([['v0.61.7', 'old'], ['v0.61.8', 'current']]).version, '0.61.8')
})

test('a newer release takes precedence over an older tag on the same commit', () => {
	assert.equal(resolveVersion([['v0.61.7', 'current'], ['v0.61.8', 'newer']]).version, '0.61.9')
})

test('other release lines and prerelease tags do not change the patch version', () => {
	assert.equal(resolveVersion([['v0.60.99', 'old'], ['v0.62.1', 'new'], ['v0.61.99-beta', 'beta']]).version, '0.61.7')
})

test('tag builds keep their exact version even when newer releases exist', () => {
	assert.equal(resolveVersion([['v0.61.7', 'current'], ['v0.61.8', 'newer']], { ref: 'refs/tags/v0.61.7' }).version, '0.61.7')
})

test('automatically numbered releases can be rebuilt from their exact tag', () => {
	assert.deepEqual(resolveVersion([['v0.61.8', 'current'], ['v0.61.9', 'newer']], { ref: 'refs/tags/v0.61.8' }), {
		tag: 'v0.61.8', version: '0.61.8',
	})
})

test('tag builds reject tags outside the package release line or below its version', () => {
	for (const tag of ['v0.62.0', 'v0.61.6', 'v0.61.8-beta']) {
		assert.throws(() => resolveVersion([[tag, 'current']], { ref: `refs/tags/${tag}` }), /does not match/)
	}
})

test('tag builds reject a tag pointing at a different commit', () => {
	assert.throws(() => resolveVersion([['v0.61.7', 'old']], { ref: 'refs/tags/v0.61.7' }), /does not point/)
})

test('invalid and prerelease package versions fail validation', () => {
	for (const version of ['0.61.7-beta', 'banana', '01.61.7']) {
		assert.throws(() => resolveVersion([], { version }), /Expected a stable/)
	}
})

test('CLI resolves annotated tags, writes job outputs, and applies the version consistently', t => {
	const directory = mkdtempSync(join(tmpdir(), 'photosynth-release-'))
	t.after(() => rmSync(directory, { recursive: true, force: true }))
	const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim()
	git('init', '--quiet')
	git('config', 'user.name', 'Release test')
	git('config', 'user.email', 'release-test@example.invalid')
	const packageSource = '{\n\t"name": "PhotoSYNTH",\n\t"version": "0.61.7"\n}\n'
	writeFileSync(join(directory, 'package.json'), packageSource)
	mkdirSync(join(directory, 'source'))
	writeFileSync(join(directory, 'source/version.js'), 'export const VERSION="0.61.7";\nexport const DATE=123;\n')
	git('add', '.')
	git('commit', '--quiet', '-m', 'first release')
	git('tag', '-a', 'v0.61.7', '-m', 'release')
	const script = fileURLToPath(new URL('../actions/electron-release-version.mjs', import.meta.url))
	const output = join(directory, 'outputs')
	const run = (ref, ...args) => spawnSync(process.execPath, [script, ...args], {
		cwd: directory, encoding: 'utf8', env: { ...process.env, GITHUB_REF: ref, GITHUB_OUTPUT: output },
	})
	// Annotated tags must be compared with their commit, not their tag object.
	assert.equal(run('refs/tags/v0.61.7').status, 0)
	git('commit', '--quiet', '--allow-empty', '-m', 'installer fix')
	writeFileSync(output, '')
	const result = run('refs/heads/main')
	assert.equal(result.status, 0, result.stderr)
	assert.equal(readFileSync(output, 'utf8'), 'tag=v0.61.8\nversion=0.61.8\n')
	assert.equal(readFileSync(join(directory, 'package.json'), 'utf8'), packageSource)
	assert.equal(run('refs/heads/main', '--apply', '0.61.8').status, 0)
	assert.equal(readFileSync(join(directory, 'package.json'), 'utf8'), packageSource.replace('0.61.7', '0.61.8'))
	assert.equal(readFileSync(join(directory, 'source/version.js'), 'utf8'), 'export const VERSION="0.61.8";\nexport const DATE=123;\n')
	assert.deepEqual(git('tag', '--list').split('\n'), ['v0.61.7'])
	assert.equal(run('refs/tags/v0.61.7').status, 1)
	assert.throws(() => applyReleaseVersion('invalid', directory), /Expected a stable/)
})
