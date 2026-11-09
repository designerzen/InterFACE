import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const require = createRequire(import.meta.url)

test('production SVG optimization finishes for the masked wallpaper', { timeout: 10000 }, async () => {
  // Run separately so an optimizer loop can be killed instead of blocking tests.
  const { stdout } = await promisify(execFile)(process.execPath, ['-e', `
    const { optimizeSvg } = require(process.argv[1])
    const code = require('node:fs').readFileSync(process.argv[2])
    const result = optimizeSvg({ code, xml: true })
    process.stdout.write(Buffer.from(result.code))
  `, require.resolve('@parcel/rust'), fileURLToPath(new URL('../source/assets/logos/photosynth-wallpaper.svg', import.meta.url))], { timeout: 5000 })
  assert.match(stdout, /<svg\b/)
  assert.match(stdout, /<mask\b/)
})
