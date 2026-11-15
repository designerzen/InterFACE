const { existsSync } = require('node:fs')
const { dirname, join, relative, isAbsolute } = require('node:path')
const { Resolver } = require('@parcel/plugin')

// Audiobus is linked from outside this project, so its dependencies resolve from its own
// node_modules, where Parcel finds neither our browser polyfills nor a build it can use for onnxruntime.
const POLYFILLS = {
	process: 'process/browser.js',
	buffer: 'buffer/index.js'
}

const isOutside = (file, root) =>
{
	const path = relative(root, file)
	return path.startsWith('..') || isAbsolute(path)
}

// Parcel builds module workers as classic scripts, where onnxruntime-web's ES module build
// (picked through its exports map) fails on import.meta, so those bundles get its classic build
const findClassicOnnxRuntime = from =>
{
	for (let folder = dirname(from); folder !== dirname(folder); folder = dirname(folder))
	{
		const filePath = join(folder, 'node_modules', 'onnxruntime-web', 'dist', 'ort.min.js')
		if (existsSync(filePath))
		{
			return filePath
		}
	}
}

module.exports = new Resolver({
	async resolve({ specifier, dependency, options })
	{
		const from = dependency.resolveFrom
		if (!from || !dependency.env.isBrowser() || !isOutside(from, options.projectRoot))
		{
			return null
		}
		if (POLYFILLS[specifier])
		{
			return { filePath: join(options.projectRoot, 'node_modules', POLYFILLS[specifier]) }
		}
		if (specifier === 'onnxruntime-web' && dependency.env.outputFormat !== 'esmodule')
		{
			const filePath = findClassicOnnxRuntime(from)
			return filePath ? { filePath } : null
		}
		return null
	}
})
