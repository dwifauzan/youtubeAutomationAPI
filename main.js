// main.js
const { app, BrowserWindow } = require('electron');
const electronServe = require('electron-serve');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'out');
const outIndex = path.join(outDir, 'index.html');

let loadURL;
if (fs.existsSync(outIndex)) {
  // create serve loader only if the static export exists
  loadURL = serveFactory({ directory: 'out' });
} else {
  loadURL = null;
}

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  try {
    if (process.env.NODE_ENV === 'development') {
      await mainWindow.loadURL('http://localhost:3000'); // dev server
    } else {
      if (loadURL) {
        await loadURL(mainWindow); // serve static 'out' build
      } else if (fs.existsSync(path.join(__dirname, 'index.html'))) {
        // fallback to a bundled index.html if you have one at app root
        await mainWindow.loadFile(path.join(__dirname, 'index.html'));
      } else {
        throw new Error(
          "Static build not found. Create the 'out' folder (next export) or run the app in development."
        );
      }
    }
  } catch (err) {
    console.error('Failed to load app UI:', err);
    // optional: show a dialog or quit
    app.quit();
  }
}

app.whenReady().then(createWindow).catch(err => {
  console.error('Error during app startup:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});