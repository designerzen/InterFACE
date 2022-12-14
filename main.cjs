// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const menu = require("./menu.cjs")

const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = process.argv[2] === '--enable-logging' || process.argv[2] === '--debug' || false
const isKiosk = process.argv[2] === '--kiosk' || !isDevelopment

let mainWindow

function quit(){

}

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		minWidth: 320,
		minHeight: 320,
		icon: path.join(__dirname, "source/assets/icons/icon.ico"),
		webPreferences: {
			kiosk: !isKiosk,
			frame: !isKiosk,
			preload: path.join(__dirname, 'preload.cjs')
		}
	})

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	//   mainWindow.loadURL(
	//     url.format({
	//       pathname: path.join(__dirname, "dist/app.html"),
	//       protocol: "file:",
	//       slashes: true
	//     })
	//   )
	//   mainWindow.loadFile( path.join(__dirname, "dist/app.html") )
	// and load the index.html of the app.?port=1337
	mainWindow.loadFile(path.join(__dirname, "dist/index.html"))

	// Open the DevTools.
	if (isDevelopment) {
		// Errors are thrown if the dev tools are opened
		// before the DOM is ready
		mainWindow.webContents.once("dom-ready", async () => {
			require("electron-debug")()
			// https://github.com/sindresorhus/electron-debug
			mainWindow.webContents.openDevTools()
		})
	}

	// this allows us to receive commands  from the web side of the app
	// via the preload service that exposes all these methods

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
		// append to existing file!
		if (SAVE_LOGS)
		{
			appendToLog(text)
		}
	})

	// TODO: Check if the entry exists and if so update it... 
	ipcMain.on('save-game', ( event, id, gameData ) => {
		// append to existing file if this.uniqueIDis the same!
		if (SAVE_LOGS)
		{
			saveGame(id, gameData)
		}
		console.log("Saved game data", gameData )
	})

	// TODO: Check if the entry exists and if so update it... 
	ipcMain.on('save-test', ( event, test, delay ) => {
		// append to existing file if this.uniqueIDis the same!
		if (SAVE_LOGS)
		{
			if (delay) 
			{
				test = `\tawait delay(${delay})\n${test}`
			}
			appentToTest(test)
		}
		console.log("Saved test data", test )
	})

	ipcMain.on("show-dialog", (event, message, type="info") => {
		dialog.showMessageBoxSync({ type, message })
	})

	ipcMain.on('save', (event, data, fileName) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		dialog.showSaveDialog({
			title: 'Select the File Path to save',
			defaultPath: path.join(__dirname, fileName),
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
			console.log(file.canceled);
			if (!file.canceled) {
				console.log(file.filePath.toString())
				// Creating and Writing to the sample.txt file
				fs.writeFile(file.filePath.toString(),
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

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Exit cleanly on request from parent process in development mode.
// Only do these things when in development
if (isDevelopment) {

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