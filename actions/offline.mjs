import { createHash } from 'node:crypto'
import { readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { injectManifest } from 'workbox-build'

const projectRoot = resolve(import.meta.dirname, '..')
const outputRoot = resolve(projectRoot, 'releases', 'web')
const bundledWorker = resolve(outputRoot, 'service-worker.bundle.js')
const publishedWorker = resolve(outputRoot, 'service-worker.js')
const defaultInstrumentRoot = resolve(
	outputRoot,
	'assets',
	'audio',
	'OpenGM24',
	'acoustic_grand_piano-mp3',
)
const audioManifestPath = resolve(outputRoot, 'offline-audio.json')

const toOutputUrl = path => relative(outputRoot, path).split(sep).join('/')

const listFiles = async directory => {
	const files = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = resolve(directory, entry.name)
		if (entry.isDirectory()) files.push(...await listFiles(path))
		else if (entry.isFile()) files.push(path)
	}
	return files
}

const assertInsideOutput = path => {
	if (path !== outputRoot && !path.startsWith(`${outputRoot}${sep}`)) {
		throw new Error(`Refusing to operate outside ${outputRoot}: ${path}`)
	}
}

for (const path of [bundledWorker, publishedWorker, defaultInstrumentRoot, audioManifestPath]) {
	assertInsideOutput(path)
}

const audioFiles = []
for (const entry of await readdir(defaultInstrumentRoot, { withFileTypes: true })) {
	if (!entry.isFile() || !/\.(?:mp3|ogg|wav)$/i.test(entry.name)) continue

	const absolutePath = resolve(defaultInstrumentRoot, entry.name)
	const fileStats = await stat(absolutePath)
	audioFiles.push({
		url: toOutputUrl(absolutePath),
		bytes: fileStats.size,
	})
}

audioFiles.sort((a, b) => a.url.localeCompare(b.url))

if (audioFiles.length === 0) {
	throw new Error(`No default instrument audio found in ${defaultInstrumentRoot}`)
}

await writeFile(
	audioManifestPath,
	`${JSON.stringify({
		id: 'OpenGM24/acoustic_grand_piano-mp3',
		files: audioFiles,
		totalBytes: audioFiles.reduce((total, file) => total + file.bytes, 0),
	}, null, 2)}\n`,
	'utf8',
)

// Parcel puts lazy bundle URLs in the entry page's import map and in generated
// JS strings. Walk those references so linked demo/test pages are not installed.
const allOutputFiles = await listFiles(outputRoot)
const outputByUrl = new Map(allOutputFiles.map(path => [toOutputUrl(path), path]))
const installUrls = new Set(['index.html', 'manifest.webmanifest', 'offline-audio.json'])
const pendingUrls = [...installUrls]
const runtimeDirectoryPrefixes = [
	'@mediapipe/tasks-vision/wasm/',
	'@litertjs/',
]

// These loaders construct the selected WASM filename at runtime, so Parcel
// cannot expose the files as normal graph edges.
for (const url of outputByUrl.keys()) {
	if (!runtimeDirectoryPrefixes.some(prefix => url.startsWith(prefix))) continue
	if (!/\.(?:js|wasm)$/i.test(url)) continue
	installUrls.add(url)
	pendingUrls.push(url)
}
const textExtensions = /\.(?:html|js|css|json|webmanifest)$/i
const installableExtensions = /\.(?:js|css|json|webmanifest|wasm|task|ttf|woff2?|png|jpe?g|webp|svg|ico|glb|fbx|obj|zip)$/i

const addReference = (fromUrl, value) => {
	if (!value || /^(?:[a-z]+:|#|\/\/)/i.test(value)) return
	let decodedValue
	try {
		decodedValue = decodeURIComponent(value.split(/[?#]/, 1)[0])
	} catch {
		return
	}
	if (!installableExtensions.test(decodedValue)) return

	const candidate = toOutputUrl(resolve(outputRoot, dirname(fromUrl), decodedValue))
	if (!outputByUrl.has(candidate) || installUrls.has(candidate)) return
	installUrls.add(candidate)
	pendingUrls.push(candidate)
}

while (pendingUrls.length) {
	const url = pendingUrls.shift()
	if (!textExtensions.test(url)) continue
	const contents = await readFile(outputByUrl.get(url), 'utf8')
	for (const match of contents.matchAll(/["'`]([^"'`\r\n]+)["'`]/g)) {
		addReference(url, match[1])
	}
	for (const match of contents.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) {
		addReference(url, match[1])
	}
}

const additionalManifestEntries = []
let installSize = 0
for (const url of [...installUrls].sort()) {
	const contents = await readFile(outputByUrl.get(url))
	installSize += contents.byteLength
	additionalManifestEntries.push({
		url,
		revision: createHash('sha256').update(contents).digest('hex').slice(0, 16),
	})
}

const { count, size, warnings } = await injectManifest({
	swSrc: bundledWorker,
	swDest: publishedWorker,
	globDirectory: outputRoot,
	globPatterns: [],
	globIgnores: [
		'service-worker*.js',
		'**/*.map',
	],
	additionalManifestEntries,
	maximumFileSizeToCacheInBytes: 32 * 1024 * 1024,
})

await rm(bundledWorker)

for (const warning of warnings) console.warn(warning)
console.log(
	`Offline bundle ready: ${count} application files (${size || installSize} bytes) and ${audioFiles.length} default audio files.`,
)
