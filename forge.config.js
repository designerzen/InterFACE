// import { readFileSync, writeFileSync } from 'fs'

// const packageFile = readFileSync('./package.json')
// const pkg = JSON.parse(packageFile)
const pkg = {
	name:"PhotoSYNTH",
	version:"0.0.1"
}

/*
export default class ParcelPlugin extends PluginBase {
	getHooks() {
		return {
			prePackage: [this.prePackage]
		}
	}

	prePackage() {
		console.log('running prePackage hook')
	}

	// appPath?: string;
	// args?: (string | number)[];
	// dir?: string;
	// enableLogging?: boolean;
	// inspect?: boolean;
	// inspectBrk?: boolean;
	// interactive?: boolean;
	// runAsNode?: boolean;
	async startLogic(opts) {

		return null
	}
}
*/

module.exports = {

	// https://electron.github.io/packager/main/interfaces/Options.html
	packagerConfig: {
		name: pkg.name,
		// The source directory
		dir: 'dist-electron/',
		sourcedir: 'dist-electron/',
		extraResource:[
			"source/assets/splash/"
		],
		icon: 'icons',
		asar: true,
		appCopyright:"Copyright 2025 designerzen",
		appVersion:pkg.version,
		executableName:"PhotoSYNTH",
		osxSign: {},
		appCategoryType: 'public.app-category.audio-tools',
		out:"release"
	},

	plugins: [
		// {
		// 	name: '@electron-forge/plugin-electronegativity',
		// 	config: {
		// 		isSarif: true
		// 	}
		// }
	],
	makers: [
		{
			name: "@electron-forge/maker-zip",
			platforms: [
				"darwin"
			]
		},
		// {
		// 	name: "@electron-forge/maker-squirrel",
		// 	config: {
		// 		name: "photosynth"
		// 	}
		// },
		// {
		// 	name: '@electron-forge/maker-deb',
		// 	config: {
		// 		options: {
		// 			icon: '/icons/icon-512.webp'
		// 		}
		// 	}
		// },
		// {
		// 	name: "@electron-forge/maker-rpm",
		// 	config: {}
		// }
		//  {
		// name: `@electron-forge/maker-dmg`,
		// config: {
		// 	format: 'ULFO'
		// }
		// }
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'designerzen',
					name: 'InterFACE'
				},
				draft: true,
				prerelease: false,
				generateReleaseNotes: true
			}
		}
	],
	outDir: 'dist-electron/'
}