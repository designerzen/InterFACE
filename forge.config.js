const path = require('node:path')
const packageMetadata = require('./package.json')

const iconBase = path.resolve(__dirname, 'static/icons')

module.exports = {
	outDir: path.resolve(__dirname, 'releases'),
	packagerConfig: {
		name: 'PhotoSYNTH',
		executableName: 'PhotoSYNTH',
		appBundleId: 'com.designerzen.photosynth',
		appCategoryType: 'public.app-category.music',
		appCopyright: `Copyright ${new Date().getFullYear()} designerzen`,
		appVersion: packageMetadata.version,
		buildVersion: packageMetadata.version,
		asar: true,
		icon: process.platform === 'win32'
			? path.join(iconBase, 'win/icon.ico')
			: path.join(iconBase, 'mac/icon.icns'),
		ignore: pathName => {
			if (!pathName) return false
			return !/^\/(dist-electron(?:\/|$)|package\.json$|LICENSE(?:S)?\.md$)/.test(pathName)
		},
	},
	rebuildConfig: {
		force: true,
	},
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
	],
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'photosynth',
				setupExe: `PhotoSYNTH-${packageMetadata.version}-Windows-Setup.exe`,
				setupIcon: path.join(iconBase, 'win/icon.ico'),
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					name: 'photosynth',
					productName: 'PhotoSYNTH',
					genericName: 'Accessible musical instrument',
					categories: ['Audio', 'Music'],
				},
			},
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: { owner: 'designerzen', name: 'InterFACE' },
				draft: true,
				prerelease: false,
				generateReleaseNotes: true,
			},
		},
	],
}
