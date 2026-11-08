const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder ??= TextDecoder
global.TextEncoder ??= TextEncoder

let getPicadeConfigurationQuery
let getPicadeConfiguratorUrl
let getPicadeReturnUrl
let getPicadeConnectionFeedback

beforeAll(async () => {
	;({
		getPicadeConfigurationQuery,
		getPicadeConfiguratorUrl,
		getPicadeReturnUrl,
		getPicadeConnectionFeedback,
	} = await import('../source/hardware/gamepad/picade-config-navigation.js'))
})

describe('Picade configurator navigation', () => {
	test('opens the configurator with all current app query options', () => {
		expect(getPicadeConfiguratorUrl(
			'https://photosynth.app/?theme=neon&lights=table#hardware',
			'https://photosynth.app/test.picade-plasma.html',
		)).toBe('https://photosynth.app/test.picade-plasma.html?theme=neon&lights=table')
	})

	test('uses referrer options and lets explicit configurator options override them', () => {
		const query = getPicadeConfigurationQuery('?lights=picade', 'https://photosynth.app/?theme=neon&lights=table')
		expect(query.get('theme')).toBe('neon')
		expect(query.get('lights')).toBe('picade')
	})

	test('always returns to the compiled index with options preserved and a safely encoded mapping', () => {
		expect(getPicadeReturnUrl(
			'https://photosynth.app/index.html',
			'?theme=neon&lights=table',
			'1a+1b,-,2x',
		)).toBe('https://photosynth.app/index.html?theme=neon&lights=1a%2B1b%2C-%2C2x')
	})

	test('keeps Parcel’s compiled app href without configuration options', () => {
		expect(getPicadeReturnUrl(
			'https://photosynth.app/index.html',
			'',
			'a,b,x,y',
		)).toBe('https://photosynth.app/index.html?lights=a%2Cb%2Cx%2Cy')
	})

	test('turns a dismissed serial picker into useful feedback', () => {
		expect(getPicadeConnectionFeedback(Object.assign(new Error("Failed to execute 'requestPort' on 'Serial': No port selected by the user."), {
			name: 'NotFoundError',
		}))).toEqual({
			state: 'cancelled',
			message: 'No Picade Plasma device was selected. Check that it is connected by USB, then try again or configure the light layout without connecting.',
		})
	})
})
