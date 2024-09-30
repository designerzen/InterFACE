

// Modules to control application life and create native browser window
import path from 'node:path'
import url from 'node:url'
import { writeFile } from 'node:fs'
import windowStateKeeper from 'electron-window-state'
import electron from 'electron'
import { app, protocol, shell, BrowserWindow,  session, dialog, ipcMain, desktopCapturer } from 'electron'
import { autoUpdater } from "electron-updater"
import { nativeImage } from 'electron/common'
import log from 'electron-log'
import { electronApp, optimizer, is, platform } from '@electron-toolkit/utils'
import { isElectronDevMode } from './electron-utils.ts'
import './menu.ts'

import { destroyMIDI, registerMIDI } from './midi.ts'

// import LINUX_ICON from '../../resources/icon.png?asset'

const IS_DEVELOPMENT_MODE = is.dev || isElectronDevMode(electron)

// const ICON_WARNING_PATH = path.resolve()

export const isProduction = process.env.NODE_ENV === "production"
export const isDevelopment = !app.isPackaged && process.argv[2] === '--enable-logging' || process.argv[2] === '--debug' || IS_DEVELOPMENT_MODE

const isKiosk = process.argv[2] === '--kiosk' ?? false

// FIXME: this __dirname gets transcoded to a location once built
// remove first slash
const APP_ROOT = path.resolve( __dirname, isDevelopment ?  "../../dist-electron/electron/" : "../../app/dist-electron/electron/" )
//.substring(1)

// and ./electron/resources/preload.js for the test build
const PRELOADER_PATH = path.join(APP_ROOT, 'preload.js' )
const LINUX_ICON = path.join(APP_ROOT,`../main/icons/png/1024x1024.png`)

let mainWindow:BrowserWindow|null = null

const quit = () => {
	app.quit()
	process.exit(0)
}

// Prevent multiple instances
if (!app.requestSingleInstanceLock())
{
	quit()
}


//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log
// autoUpdater.logger.transports.file.level = 'info'


const showVirtualMIDIPortUnavailableError = ( message, title="Oh no!" ) => {
	// dialog.showMessageBoxSync({ 
	// 	icon:nativeImage.createFromPath( ICON_WARNING_PATH ),
	// 	type:"warning", 
	// 	title, 
	// 	message 
	// })
}

function recordWindow(){
	
	desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
		for (const source of sources) 
		{
			// find the window we want to record...
			if (mainWindow && source.name === 'Electron') 
			{
				mainWindow.webContents.send('SET_SOURCE', source.id)
				return
			}
		}
	})
}


function createWindow() {

	let interval

	const additionalArguments = [`--debug=${isDevelopment ? "true" : "false" }`]

	let mainWindowState = windowStateKeeper({
		defaultWidth: 1024,
		defaultHeight: 920
	})

	// log.info(`PhotoSynth ${APP_ROOT} starting [${mainWindowState.width}/${mainWindowState.height}] preloader:${PRELOADER_PATH} `, isDevelopment ? "in development" : "in production", additionalArguments )

	// Create the browser window.
	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 420,
		minHeight: 300,
		backgroundColor: '#e4dede', 

		// optional!
		kiosk:isKiosk,
		// frame:true,
		// autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon:LINUX_ICON } : {}),
	   
		webPreferences: {
			accessibleTitle:"PhotoSYNTH face controlled musical instrument",
			
			// webSecurity:false,
			// NB. contextIsolation: false now replaces nodeIntegration: true.

			// protect against prototype pollution
			// NB. LKG Portrait requires access to "process.NODE"
			// so this needs to be exposed via the contextIsolation else disable it
			// and enable nodeIntegration which is more dangerous
			contextIsolation: false,
			
			 // false is default value after Electron v5
			nodeIntegration: true,			// prevent node classes being available cross app
			nodeIntegrationInWorker: true,

			// pass arbitrary data to the preloader
			preload:PRELOADER_PATH,

			// additionalArguments,

			// backgroundThrottling:false,
			
			// autoplayPolicy string (optional) - 
			// Autoplay policy to apply to content in the window, can be 
			// no-user-gesture-required, user-gesture-required, document-user-activation-required. Defaults to no-user-gesture-required.
			autoplayPolicy: "no-user-gesture-required"
		}
	})
	
	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow)

	// open windows via interception
	mainWindow.webContents.setWindowOpenHandler((details) => {
		//shell.openExternal(details.url)
		switch(details.url){

			case 'about:blank':
				return {
					action: 'allow',
					overrideBrowserWindowOptions: {
						frame: true,
						fullscreenable: false,
						backgroundColor: 'black',
						// zoomFactor, nodeIntegration, preload, javascript, contextIsolation, and webviewTag.
						webPreferences: {
						// preload: 'my-child-window-preload-script.js'
						}
					}
				}

			// LKGP!
			default:
				return {
					action: 'allow',
					overrideBrowserWindowOptions: {
						frame: false,
						fullscreenable: true,
						backgroundColor: 'black',
						// zoomFactor, nodeIntegration, preload, javascript, contextIsolation, and webviewTag.
						webPreferences: {
							// preload: 'my-child-window-preload-script.js'
						}
					}
				}
		}
	})

	// MIDI Permissions - alow immediately if possible!
	mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
		if (permission === 'midi' || permission === 'midiSysex') 
		{
		  	callback(true)
		} else {
		  	callback(false)
		}
	})
	  
	mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
		if (permission === 'midi' || permission === 'midiSysex') 
		{
		  	return true
		}
		return false
	})

	// From https://github.com/electron/electron/pull/573
    // Allows for YouTube embeds
    // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    //     callback({responseHeaders: Object.fromEntries(Object.entries(details.responseHeaders).filter(header => !/x-frame-options/i.test(header[0])))})
    // })

	

	ipcMain.on("feedback", (event, state) => {
		console.log("FEEDBACK>",state)
		switch(state)
		{
			default:
				clearInterval(interval)
				showVirtualMIDIPortUnavailableError( "Virtual MIDI Port cannot be created - This feature is only available on Mac and Linux at this time due to Windows not having builtin support. You can download a program by Tobias if you want to pipe the MIDI output from the PhotoSYNTH into your software MIDI such as Ableton, Reaper or another DAW.", "Virtual MIDI Port cannot be created" )
		}
	})

	ipcMain.on("show-dialog", (event, message, type="info") => {
		showVirtualMIDIPortUnavailableError(  message )
	})
/*
	// Extra app goodies
	ipcMain.on("show-dialog", (event, message, type="info") => {
		dialog.showMessageBoxSync({ type, message })
	})

	// send a file to be saved locally!	
	ipcMain.on('save', (event, data, fileName) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		dialog.showSaveDialog({
			title: 'Select the File Path to save',
			defaultPath: path.join(APP_ROOT, fileName),
			buttonLabel: 'Save',
			// Restricting the user to only Text Files.
			filters: [
				{
					name: 'Text Files',
					extensions: ['txt', 'docx']
				},],
			properties: []
		}).then(file => {
			// Stating whether dialog operation was cancelled or not.
			console.log(file.canceled)
			if (!file.canceled) {
				console.log(file.filePath.toString())
				// Creating and Writing to the sample.txt file

				writeFile(file.filePath.toString(),
					data,
					function (err) {
						if (err) throw err
						console.log('Saved!?')
					}
				)
			}
		}).catch(err => {
			console.log(err)
		})
	})

*/
	// output.sendMessage([176,22,1])

	mainWindow.on('ready-to-show', () => { 
		mainWindow.show()
		mainWindow.focus({ focusVisible: false })
	})

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {

		clearInterval(interval)

		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
		destroyMIDI()
	})

	// Open the DevTools.
	if (isDevelopment) 
	{	
		//   mainWindow.loadURL(
		//     url.format({
		//       pathname: path.join(APP_ROOT, "dist/app.html"),
		//       protocol: "file:",
		//       slashes: true
		//     })
		//   )

		// mainWindow.loadFile( `../main/app.html` )
		mainWindow.loadURL( `http://localhost:303/app.html` )

		// Errors are thrown if the dev tools are opened
		// before the DOM is ready
		mainWindow.webContents.once("dom-ready", async () => {
			
			mainWindow.webContents.openDevTools()
		})

	}else{
		
		// mainWindow.loadFile( path.join(APP_ROOT, "dist/app.html") )
		// and load the index.html of the app.?port=1337 #v${app.getVersion()}
		// mainWindow.loadFile( `dist-electron/main/app.html` )
		// mainWindow.loadFile( `${path.resolve(APP_ROOT,"../main/app.html")}` )
		mainWindow.loadFile( `../main/app.html` )
		// mainWindow.loadURL(`file://${APP_ROOT}/version.html#v${app.getVersion()}`);
		// mainWindow.loadFile(path.join(APP_ROOT, "dist-electron/main/app.html"))

		mainWindow.webContents.once("dom-ready", async () => {
			
			// https://github.com/sindresorhus/electron-debug
			mainWindow.webContents.openDevTools()
		})
	}

	registerMIDI( mainWindow, ipcMain )

	// this allows us to receive commands  from the web side of the app
	// via the preload service that exposes all these methods
/*
	// change the page title (not visible in kiosk mode!)
	ipcMain.on('set-title', (event, title) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.setTitle(title)
	})

	// save some data to an "error" / analytics log to help fix
	// problems where we don't know what is causing them and cannot
	// replicate the issues
	ipcMain.on('log', ( event, text ) => {
	
	})

	*/
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron')

	if (mainWindow === null) 
	{
		createWindow()
	}

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0)
		{
			createWindow()
		} else{
			console.error("Not opening a browser window as one already open")
		}
	})
})


app.on('web-contents-created', function(event,contents) {
	
	console.log('web-contents-created', event, contents)
	const anyContents = contents // as any
	anyContents.on('new-window', function(){
		console.log('new-window', event, contents)
	
	})
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// Exit cleanly on request from parent process in development mode.
// Only do these things when in development
if (isDevelopment) {

	  // Reload
	//   try {
	// 	(await import("electron-reloader"))(module)
	//   } catch (_) { }

	  
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				quit()
			}
		})

	} else {

		process.on("SIGTERM", () => {
			quit()
		})
	}
}

//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//   sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.');
// })
// autoUpdater.on('error', (err) => {
//   sendStatusToWindow('Error in auto-updater. ' + err);
// })
// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// })
// autoUpdater.on('update-downloaded', (info) => {
//   sendStatusToWindow('Update downloaded');
// });
