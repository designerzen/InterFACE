/**
 * CTRL to expost the menu or run in debug mode
 */

// import { app, Menu } from "electron"
const { app, shell, Menu } = require("electron")
const IS_MAC = process.platform === "darwin"

const template = []

// append apple specific menu item at start position
if (IS_MAC) 
{
	template.push({
		label: app.getName(),
		submenu: [
			{ role: "about" }, 
			{ type: "separator" }, 
			{ role: "close" }
		]
	})
}else{

	template.push({
		label: 'File',
		submenu: [
			{ role: 'quit' }
		]
	})
}

template.push( { type: 'separator' })

template.push({
	label: "Edit",
	submenu: [
		{
			label: "Reload",
			accelerator: "Cmd+R",
			role: "reload"
		},
		{ role: 'forceReload' },

		// FIXME: only if DEV MODE
		{ role: 'toggleDevTools' },
	]
})

	

template.push( {
	label: 'View',
    submenu: [
    //   { role: 'resetZoom' },
    //   { role: 'zoomIn' },
    //   { role: 'zoomOut' },
    //   { type: 'separator' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'fullscreen' },
	  { role: "minimize" }
	]
})

template.push({
	role: 'Help',
	submenu: [
	{
		label: 'Learn More',
		click: async () => {
			await shell.openExternal('https://github.com/designerzen/interface')
		},
		label: 'Upgrade',
		click: async () => {
			await shell.openExternal('https://github.com/designerzen/interface/releases')
		}
	}]
})

// create menu for all platforms
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)