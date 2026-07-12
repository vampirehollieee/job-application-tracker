const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const RESUME_URL = 'https://resume-intake-v1-260710.mar227392.chatgpt.site/intake/form/';

function createWindow() {
  const logPath = path.join(app.getPath('userData'), 'launch.log');
  const log = (message) => fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 390,
    minHeight: 640,
    backgroundColor: '#f4f4f2',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url === RESUME_URL) shell.openExternal(url);
    return { action: 'deny' };
  });
  window.webContents.on('did-fail-load', (_event, code, description) => log(`did-fail-load ${code} ${description}`));

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => window.show()).catch((error) => log(`loadURL ${error.stack || error}`));
  } else {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    log(`loadFile ${indexPath} exists=${fs.existsSync(indexPath)}`);
    window.loadFile(indexPath).then(() => window.show()).catch((error) => log(`loadFile ${error.stack || error}`));
  }
}

app.whenReady().then(() => {
  ipcMain.handle('open-resume-intake', () => shell.openExternal(RESUME_URL));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
