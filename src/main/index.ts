import { app, BrowserWindow } from "electron";
import { join } from "path";

function createWindow(): BrowserWindow {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			contextIsolation: true,
			sandbox: true
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(
		join(__dirname, "renderer_mount.html")
	);

	// Prevent the window from navigating to somewhere unintentionally.
	// If you are using routing within your app, customise the event handler
	// below to ensure that the window only visits whitelisted locations.

	mainWindow.webContents.on("will-navigate", (event, url) => {
		event.preventDefault();
	});

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
