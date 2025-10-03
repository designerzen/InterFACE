module.exports = {
	packagerConfig: {
		name: 'PhotoSYNTH',
		icon: '/icons',
		asar: true,
		osxSign: {},
		appCategoryType: 'public.app-category.audio-tools'
	},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				name: "photosynth"
			}
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: [
				"darwin"
			]
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					icon: '/icons/icon-512.webp'
				}
			}
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {}
		}
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
	]
};