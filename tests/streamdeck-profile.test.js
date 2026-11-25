/** @jest-environment node */

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const profileRoot = join(
	process.cwd(),
	'static',
	'PhotoSYNTH',
	'Profiles',
	'485CBCF2-1D0D-4E5E-99C2-C316CF7D1A1D.sdProfile',
)

const loadJson = async path => JSON.parse(await readFile(path, 'utf8'))

describe('generated Stream Deck XL profile', () => {
	test('paginates eight control groups with valid hotkeys and images', async () => {
		const rootManifest = await loadJson(join(profileRoot, 'manifest.json'))
		expect(rootManifest.Name).toBe('PhotoSYNTH — Stream Deck XL')
		expect(rootManifest.Pages.Pages).toHaveLength(12)
		const dedicatedFunctionKeys = new Set()
		const dedicatedQtKeys = new Set()
		const pageTitles = new Map()

		for (const pageId of rootManifest.Pages.Pages) {
			const pageRoot = join(profileRoot, 'Profiles', pageId.toUpperCase())
			const manifest = await loadJson(join(pageRoot, 'manifest.json'))
			const actions = manifest.Controllers[0].Actions
			expect(Object.keys(actions).length).toBeLessThanOrEqual(32)

			const hotkeys = Object.values(actions).filter(action => (
				action.UUID === 'com.elgato.streamdeck.system.hotkey'
			))
			const group = manifest.Name.replace(/ \d+\/\d+$/, '')
			pageTitles.set(group, [...(pageTitles.get(group) ?? []), ...hotkeys.map(action => action.States[0].Title)])
			expect(hotkeys.length).toBeGreaterThan(0)
			expect(hotkeys.length).toBeLessThanOrEqual(29)
			expect(Object.keys(actions)).toHaveLength(hotkeys.length + 3)
			for (const action of hotkeys) {
				const hotkey = action.Settings.Hotkeys[0]
				expect(hotkey.VKeyCode).toBeGreaterThan(-1)
				expect(hotkey.QTKeyCode).toBeGreaterThan(-1)
				if (hotkey.VKeyCode >= 124 && hotkey.VKeyCode <= 135) {
					dedicatedFunctionKeys.add(hotkey.VKeyCode)
					dedicatedQtKeys.add(hotkey.QTKeyCode)
					expect(hotkey.KeyModifiers).toBe(0)
				}
				expect(action.States[0].Image).toMatch(/^Images\/.+\.svg$/)
			}

			const imageFiles = await readdir(join(pageRoot, 'Images'))
			expect(imageFiles).toHaveLength(hotkeys.length)
		}
		expect(pageTitles.size).toBe(8)

		expect([...dedicatedFunctionKeys].sort((a, b) => a - b)).toEqual(
			Array.from({ length: 12 }, (_, index) => 124 + index),
		)
		expect([...dedicatedQtKeys].sort((a, b) => a - b)).toEqual(
			Array.from({ length: 12 }, (_, index) => 16777276 + index),
		)
		expect(pageTitles.get('Musical Keyboard')).toEqual(expect.arrayContaining([
			'Notes', '1 C3', '2 D3', '8 C4', '9 D4',
		]))
		expect(pageTitles.get('Chord Keyboard')).toEqual(expect.arrayContaining([
			'Chords', '1 C', 'Q B♭m', 'A A♭7',
		]))
		expect(pageTitles.get('Percussion Keyboard')).toEqual(expect.arrayContaining([
			'Percussion', '1 Sub Kick', 'Q Closed Hat', 'A Low Tom Soft',
		]))
		expect(pageTitles.get('Sample Keyboard')).toEqual(expect.arrayContaining([
			'Samples', '1 Anime Wow', 'Q Magic 1', 'A Coin Pitch 2',
		]))
	})
})
