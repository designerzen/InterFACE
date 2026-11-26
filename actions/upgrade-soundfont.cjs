const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const path = require('node:path')

const exec = promisify(execFile)
const repository = 'https://github.com/designerzen/Open-GeneralMIDI-SoundFont.git'

// PNPM can expose either a JavaScript entrypoint or its standalone executable.
const runPnpm = (pnpm, args, options, run = exec) => {
	const javascript = /\.[cm]?js$/i.test(pnpm)
	return run(javascript ? process.execPath : pnpm, javascript ? [pnpm, ...args] : args, options)
}

const upgradeSoundfont = async ({ run = exec, pnpm = process.env.npm_execpath } = {}) => {
	if (!pnpm) throw new Error('Run this command through pnpm run soundfont:upgrade')
	const { stdout } = await run('git', ['ls-remote', '--exit-code', repository, 'refs/heads/main'])
	const revision = stdout.trim().split(/\s+/)[0]
	if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid OpenGM upstream revision')
	// Pin the revision in both the manifest and lockfile, then install all dependencies.
	await runPnpm(pnpm, ['add', '-Dw', `open-gm@github:designerzen/Open-GeneralMIDI-SoundFont#${revision}`], {
		cwd: path.resolve(__dirname, '..'), maxBuffer: 16 * 1024 * 1024
	}, run).then(({ stdout, stderr }) => {
		if (stdout) process.stdout.write(stdout)
		if (stderr) process.stderr.write(stderr)
	})
	return revision
}

module.exports = { upgradeSoundfont, runPnpm }
if (require.main === module) upgradeSoundfont().then(revision => {
	console.log(`OpenGM package pinned to ${revision}`)
}).catch(error => {
	console.error(`OpenGM upgrade failed: ${error.message}`)
	process.exitCode = 1
})
