/**
 * CTRL to expose the menu or run in debug mode
 */
import { app, shell, Menu } from "electron"

const IS_MAC = process.platform === "darwin"
const template: any[] = []
const name = app.getName()

template.push({
	label: "Edit",
	submenu: [
		{ role: "undo" },
		{ role: "redo" },
		{ type: "separator" },
		{ role: "cut" },
		{ role: "copy" },
		{ role: "paste" },
		{ role: "selectAll" },
		{ type: "separator" },
		{
			label: "Reload",
			accelerator: "CmdOrCtrl+R",
			role: "reload"
		},
		{ role: "forceReload" },
		// FIXME: only if DEV MODE
		{ role: "toggleDevTools" },
	]
})

const menuView: any = {
	label: "View",
	submenu: [
		{ role: "resetZoom" },
		{ role: "zoomIn" },
		{ role: "zoomOut" },
		{ type: "separator" },
		{ role: "togglefullscreen" },
		{ role: "minimize" },
	]
}

if (IS_MAC) {
	menuView.submenu.push(
		{ type: "separator" },
		{ role: "zoom" }
	)
}

template.push(menuView)

template.push({
	role: "help",
	submenu: [
		{
			label: "Learn More",
			click: async () => {
				await shell.openExternal("https://github.com/designerzen/interface")
			},
		},
		{
			label: "Upgrade",
			click: async () => {
				await shell.openExternal("https://github.com/designerzen/interface/releases")
			}
		}
	]
})

// About & Quit
template.unshift({
	label: name,
	submenu: [
		{
			label: "About " + name,
			role: "about"
		},
		{
			label: "Quit",
			role: "quit",
			accelerator: "CmdOrCtrl+Q",
			click() { app.quit() }
		}
	]
})

// create menu for all platforms
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
