const { app, BrowserWindow } = require('electron');
const path = require('path');

// Import and start the backend server
const expressApp = require('./backend/server');
const SERVER_PORT = 3002;

// Start the Express server
expressApp.listen(SERVER_PORT, () => {
    console.log(`Backend server is running on port ${SERVER_PORT}`);
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional
        },
    });

    // Load the React frontend in production mode
    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
