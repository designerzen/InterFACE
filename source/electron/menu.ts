/**
 * CTRL to expost the menu or run in debug mode
 */
import { app, shell, Menu } from "electron"

const IS_MAC = process.platform === "darwin"
const template:MenuItem[] = []
const name = app.getName()

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

const menuView = {
	label: 'View',
    submenu: [
      { role: 'fullscreen' },
	  { role: "minimize" },
	]
}

// mac only menu
if (IS_MAC)
{
	menuView.submenu.push(
		{ type: 'separator' },
		{ role: "zoom" }
		//   { role: 'resetZoom' },
		 //   { role: 'zoomIn' },
		 //   { role: 'zoomOut' },
	)	
}

template.push( menuView )

template.push({
	role: 'Help',
	submenu: [
	{
		label: 'Learn More',
		click: async () => {
			await shell.openExternal('https://github.com/designerzen/interface')
		},
	},{
		label: 'Upgrade',
		click: async () => {
			await shell.openExternal('https://github.com/designerzen/interface/releases')
		}
	}]
})


// append apple specific menu item at start position
// pretty much using https://github.com/stefansl/image-shrinker/blob/master/menu/mainmenu.js
if (IS_MAC) 
{ 
    template.push(...[ { 
      label: 'Edit', 
      submenu: [{ 
        label: 'Undo', 
        accelerator: 'CmdOrCtrl+Z', 
        selector: 'undo:' 
      }, { 
        label: 'Redo', 
        accelerator: 'Shift+CmdOrCtrl+Z', 
        selector: 'redo:' 
      }, { 
        type: 'separator'
      }, { 
        label: 'Cut', 
        accelerator: 'CmdOrCtrl+X', 
        selector: 'cut:' 
      }, { 
        label: 'Copy', 
        accelerator: 'CmdOrCtrl+C', 
        selector: 'copy:'
      }, { 
        label: 'Paste', 
        accelerator: 'CmdOrCtrl+V', 
        selector: 'paste:' 
      }, { 
        label: 'Select All', 
        accelerator: 'CmdOrCtrl+A', 
        selector: 'selectAll:' 
      }] 
    }])
    
  
}


// About & Quit
template.unshift({
	label: name,
	submenu: [
		{
			label: 'About ' + name,
			role: 'about'
		}, 
		// { 
		// 	type: "separator" 
		// },
		{
			label: 'Quit',
			role: 'quit' ,
			accelerator: 'CmdOrCtrl+Q',
			click() { app.quit() }
		}
	]
})

// create menu for all platforms
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)