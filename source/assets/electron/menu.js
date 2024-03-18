const { app, Menu } = require("electron");

const template = [
  {
    label: "Edit",
    submenu: [
      {
        label: "Reload",
        accelerator: "Cmd+R",
        role: "reload"
      }
    ]
  },
  {
    role: "window",
    submenu: [{ role: "minimize" }, { role: "close" }]
  }
];

if (process.platform === 'darwin') 
{ 
    template.push(...[{ 
      label: 'FromScratch', 
      submenu: [{ 
        label: 'Quit', 
        accelerator: 'CmdOrCtrl+Q', 
        click: function() { 
          app.quit()
        } 
      }] 
    }, { 
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

// pretty much using https://github.com/stefansl/image-shrinker/blob/master/menu/mainmenu.js

if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }]
    });
  
    // Window menu
    template[2].submenu = [{ role: "minimize" }, { role: "zoom" }];
  
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }