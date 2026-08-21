import { rm } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const releasesRoot = resolve(projectRoot, 'releases')
const webOutput = resolve(releasesRoot, 'web')

if (!webOutput.startsWith(`${releasesRoot}${sep}`)) {
	throw new Error(`Refusing to clean unexpected path: ${webOutput}`)
}

await rm(webOutput, { recursive: true, force: true })
console.log(`Cleaned generated web output: ${webOutput}`)
