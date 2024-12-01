const { app, BrowserWindow } = require('electron');

function createSplash() {
  const splash = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    transparent: true
  });

  // Load the splash HTML file
  splash.loadFile('backend/public/loading.html');

  // Close splash after 5 seconds or when backend is ready
  setTimeout(() => {
    splash.close();
    // Automatically open the frontend page in the default browser
    require('child_process').exec('start http://localhost:3000');
  }, 5000);
}

app.on('ready', createSplash);
