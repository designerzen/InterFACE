export const STORAGE_KEY = 'photosynth.accessibility.v1'
export const PRESETS_KEY = 'photosynth.accessibility.presets.v1'

// Values are allowlisted before they reach CSS or storage, including imported files.
export const typography = [
	['fontFamily', 'Font family', '--a11y-font-family', ['original', 'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New', 'monospace']],
	['fontWeight', 'Font weight', '--a11y-font-weight', ['original', 'normal', 'bold']],
	['fontStyle', 'Font style', '--a11y-font-style', ['original', 'normal', 'italic', 'oblique']],
	['fontVariant', 'Letter case style', '--a11y-font-variant', ['original', 'normal', 'small-caps']],
	['textTransform', 'Text case', '--a11y-text-transform', ['original', 'none', 'uppercase', 'lowercase', 'capitalize']],
	['letterSpacing', 'Letter spacing', '--a11y-letter-spacing', ['original', 'normal', '0.08em', '0.12em', '0.2em']],
	['wordSpacing', 'Word spacing', '--a11y-word-spacing', ['original', 'normal', '0.12em', '0.16em', '0.3em']],
	['lineSpacing', 'Line spacing', '--a11y-line-spacing', ['original', '1.5', '1.6', '1.8', '2']],
]
export const outlines = [
	['focusSize', 'Keyboard focus thickness', '--a11y-focus-size', ['3px', '2px', '4px', '5px', '6px']],
	['focusStyle', 'Keyboard focus style', '--a11y-focus-style', ['solid', 'dashed', 'dotted', 'double']],
	['borderSize', 'Control border thickness', '--a11y-border-size', ['2px', '1px', '3px', '4px']],
	['cornerRadius', 'Control corner radius', '--a11y-corner-radius', ['0.4rem', '0', '0.25rem', '0.75rem', '1rem']],
	['underlineStyle', 'Link underline style', '--a11y-underline-style', ['solid', 'dashed', 'dotted', 'double']],
	['underlineOffset', 'Link underline distance', '--a11y-underline-offset', ['0.2em', '0.1em', '0.3em', '0.4em']],
]
export const colours = [
	['pageBackground', 'Page background', 'Page', '--a11y-background', '#111827'],
	['pageText', 'Page text', 'Page', '--a11y-text', '#f3f4f6'],
	['surfaceBackground', 'Panel background', 'Page', '--a11y-surface', '#1f2937'],
	['linkColour', 'Links', 'Page', '--a11y-accent', '#a5c8ff'],
	['focusColour', 'Keyboard focus', 'Page', '--a11y-focus', '#a5c8ff'],
	['buttonBackground', 'Button background', 'Buttons', '--a11y-button-background', '#1f2937'],
	['buttonText', 'Button text', 'Buttons', '--a11y-button-text', '#f3f4f6'],
	['buttonBorder', 'Button border', 'Buttons', '--a11y-button-border', '#a5c8ff'],
	['menuBackground', 'Menu background', 'Menus', '--a11y-menu-background', '#1f2937'],
	['menuText', 'Menu text', 'Menus', '--a11y-menu-text', '#f3f4f6'],
	['menuBorder', 'Menu border', 'Menus', '--a11y-menu-border', '#a5c8ff'],
	['labelBackground', 'Label background', 'Labels', '--a11y-label-background', '#111827'],
	['labelText', 'Label text', 'Labels', '--a11y-label-text', '#f3f4f6'],
	['popupBackground', 'Dialog background', 'Dialogs', '--a11y-popup-background', '#111827'],
	['popupText', 'Dialog text', 'Dialogs', '--a11y-popup-text', '#f3f4f6'],
	['popupBorder', 'Dialog border', 'Dialogs', '--a11y-popup-border', '#a5c8ff'],
	['sliderTrack', 'Slider track', 'Sliders', '--a11y-slider-track', '#1f2937'],
	['sliderThumb', 'Slider thumb', 'Sliders', '--a11y-slider-thumb', '#a5c8ff'],
]

export const defaults = {
	theme: 'original', textSize: '100', motion: 'system', readableFont: false,
	textSpacing: false, largeTargets: false, underlineLinks: false, strongFocus: false,
	...Object.fromEntries(typography.map(([key]) => [key, 'original'])),
	...Object.fromEntries(outlines.map(([key, , , values]) => [key, values[0]])),
	...Object.fromEntries(colours.map(([key, , , , value]) => [key, value])),
}
export const choices = {
	theme: ['original', 'system', 'light', 'dark', 'contrast-dark', 'contrast-light', 'sepia', 'ocean', 'monochrome', 'custom'],
	textSize: ['100', '125', '150', '175', '200'], motion: ['system', 'reduce'],
	...Object.fromEntries([...typography, ...outlines].map(([key, , , values]) => [key, values])),
}
export const validPreference = (key, value) => Object.hasOwn(defaults, key) && (
	choices[key] ? choices[key].includes(value) : typeof defaults[key] === 'boolean' ? typeof value === 'boolean' : typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)
)
export const sanitisePreferences = (source, strict = false) => {
	if (!source || typeof source !== 'object' || Array.isArray(source)) {
		if (strict) throw new Error('Preferences must be an object.')
		return { ...defaults }
	}
	const result = { ...defaults }
	for (const [key, value] of Object.entries(source)) {
		if (validPreference(key, value)) result[key] = value
		else if (strict) throw new Error('The file contains an unsupported preference.')
	}
	return result
}
export const sanitisePresets = source => {
	if (!Array.isArray(source) || source.length > 20) throw new Error('Choose a file with up to 20 presets.')
	const names = new Set()
	return source.map(preset => {
		const name = typeof preset?.name === 'string' ? preset.name.trim() : ''
		if (!name || name.length > 60 || names.has(name)) throw new Error('Preset names must be unique and between 1 and 60 characters.')
		names.add(name)
		return { name, preferences: sanitisePreferences(preset.preferences, true) }
	})
}

export const quickPresets = [
	{ name: 'Original settings', preferences: { ...defaults } },
	{ name: 'High contrast', preferences: { ...defaults, theme: 'contrast-dark', strongFocus: true, underlineLinks: true } },
	{ name: 'Comfortable reading', preferences: { ...defaults, theme: 'sepia', textSize: '125', readableFont: true, textSpacing: true, underlineLinks: true } },
	{ name: 'Large controls', preferences: { ...defaults, textSize: '150', largeTargets: true, strongFocus: true } },
]

const luminance = hex => {
	const rgb = hex.slice(1).match(/../g).map(value => {
		const channel = parseInt(value, 16) / 255
		return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	})
	return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}
export const contrastRatio = (foreground, background) => {
	const first = luminance(foreground), second = luminance(background)
	return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
