'use strict'

import { app, protocol, BrowserWindow, session } from 'electron'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import windowStateKeeper from 'electron-window-state'

import path from 'node:path'

const isDevelopment = !app.isPackaged && process.env.NODE_ENV !== 'production'

const icon = "/main/assets/png/512x512.png"

let mainWindow

if (!app.requestSingleInstanceLock())
{
  app.quit()
  process.exit(0)
}


app.whenReady().then(() => {

  // We cannot require the screen module until the app is ready.
  // const { screen } = require('electron')

  // Create a window that fills the screen's available work area.
  // const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height } = primaryDisplay.workAreaSize
 // Load the previous state with fallback to defaults
 let mainWindowState = windowStateKeeper({
    defaultWidth: 1920,
    defaultHeight: 1080
  })

  mainWindow = new BrowserWindow({
    // width: APP_WIDTH,
    // height: APP_HEIGHT ,
    // minHeight: APP_HEIGHT,
    alwaysOnTop:!isDevelopment,
    // width, height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: !isDevelopment,
	icon,
    backgroundColor: '#002b36', 
	webPreferences: {
		autoplayPolicy:"no-user-gesture-required",
		backgroundThrottling:false,
		contextIsolation: false,
		nodeIntegration: true,  
		nodeIntegrationInWorker:true,
		webSecurity:true,
		preload:  './preloader.js' 
	  }
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)

  // mainWindow.loadURL('http://localhost:8080')

  // const displays = screen.getAllDisplays()
  // const externalDisplay = displays.find((display) => {
  //   return display.bounds.x !== 0 || display.bounds.y !== 0
  // })

  // if (externalDisplay) {
  //   win = new BrowserWindow({
  //     x: externalDisplay.bounds.x + 0,
  //     y: externalDisplay.bounds.y + 0,
  //     height: 1920,
  //     width: 2160,
  //     frame: false,
  //     slashes: true,
  //   })
  //   // win.loadURL('http://localhost:8080/fishTank')
  // }

  if (isDevelopment)
  {
    mainWindow.webContents.openDevTools()

    mainWindow.loadURL('http://localhost:1234/')

  } else {

    mainWindow.webContents.openDevTools()

    mainWindow.loadFile(path.join(__dirname, '../../index.html'))

    //mainWindow.loadFile('../../dist/index.html')
    // Load your file
    // mainWindow.loadFile('dist/electron-renderer/index.html')
    // mainWindow.loadFile(path.join(process.env.DIST, 'index.html'))
    //  mainWindow.loadURL(`file://${__dirname}/index.html`)
  }

  // mainWindow.setMinimumSize(APP_WIDTH,APP_HEIGHT)
//   mainWindow.maximize()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  mainWindow = null
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0)
// })

// CHOOSE one of the following options for Auto updates

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function()  {
    // console.log("Fish tank ready!", icon )
  /*
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
  */
  // autoUpdater.checkForUpdatesAndNotify()
})

