


import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	"appId": "photosynth.com.designerzen",
	"appName": "photosynth#interface",
	"bundledWebRuntime": false,
	"npmClient": "npm",
	"webDir": "dist",
	"backgroundColor":"#853628",
	"plugins": {
	  "SplashScreen": {
		"launchShowDuration": 0
	  }
	},
	"cordova": {},
	"server": {
	  "androidScheme": "https"
	}
}

export default config;