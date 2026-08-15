'use strict'

const path = require('node:path')
const { spawnSync } = require('node:child_process')

if (process.platform !== 'darwin') process.exit(0)

const packageRoot = path.resolve(__dirname, '..')
const nodeGyp = require.resolve('node-gyp/bin/node-gyp.js', { paths:[packageRoot] })
const result = spawnSync(process.execPath, [nodeGyp, 'rebuild'], { cwd:packageRoot, stdio:'inherit' })
process.exit(result.status ?? 1)
