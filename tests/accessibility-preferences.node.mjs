import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaults, sanitisePreferences, sanitisePresets, contrastRatio } from '../source/accessibility/preferences.js'

test('existing preferences survive schema expansion and corrupt values fall back', () => {
	const result = sanitisePreferences({ theme: 'sepia', readableFont: true, textSize: '200', pageText: 'red', fontFamily: 'url(bad)' })
	assert.equal(result.theme, 'sepia')
	assert.equal(result.readableFont, true)
	assert.equal(result.textSize, '200')
	assert.equal(result.pageText, defaults.pageText)
	assert.equal(result.fontFamily, 'original')
	assert.deepEqual(sanitisePreferences(null), defaults)
})

test('imports reject unsafe CSS, unsupported values and malformed preset libraries', () => {
	for (const source of [{ pageText: 'url(bad)' }, { strongFocus: 'false' }, { theme: 'missing' }, { unknown: true }, []]) assert.throws(() => sanitisePreferences(source, true))
	assert.throws(() => sanitisePresets([{ name: '__proto__', preferences: {} }, { name: '__proto__', preferences: {} }]))
	assert.throws(() => sanitisePresets(Array.from({ length: 21 }, (_, index) => ({ name: String(index), preferences: {} }))))
	assert.deepEqual(sanitisePresets([{ name: ' Reading ', preferences: { theme: 'light' } }])[0], { name: 'Reading', preferences: { ...defaults, theme: 'light' } })
})

test('contrast uses sRGB luminance and retains unrounded ratios for threshold comparisons', () => {
	assert.equal(contrastRatio('#000000', '#ffffff'), 21)
	assert.equal(contrastRatio('#ffffff', '#ffffff'), 1)
	assert.ok(contrastRatio('#777777', '#ffffff') < 4.5)
	assert.ok(contrastRatio('#767676', '#ffffff') > 4.5)
	assert.equal(contrastRatio('#102b36', '#edfaff'), contrastRatio('#edfaff', '#102b36'))
})
