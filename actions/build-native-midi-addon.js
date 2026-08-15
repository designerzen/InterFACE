'use strict'

const path = require('node:path')
const { spawnSync } = require('node:child_process')

const nativePackage = { win32:'@photosynth/windows-midi-services', darwin:'@photosynth/macos-coremidi' }[process.platform]
if (!nativePackage) process.exit(0)

const repositoryRoot = path.resolve(__dirname, '..')
const electronRebuild = path.join(repositoryRoot, 'node_modules/@electron/rebuild/lib/cli.js')
const result = spawnSync(process.execPath, [electronRebuild, '-f', '-o', nativePackage], {
	cwd:repositoryRoot,
	stdio:'inherit',
})
if (result.status !== 0) process.exit(result.status ?? 1)

require('./stage-native-midi-addon.js')
