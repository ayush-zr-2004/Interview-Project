const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
webPreferences: {
  nodeIntegration: true,
  contextIsolation: false,
}

  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(createWindow);

// IPC handler should be here, but NO document-related code!
ipcMain.handle('get-system-info', async () => {
  const osName = os.type() + ' ' + os.release();
  const cpus = os.cpus();
  // Get CPU model safely
  const cpuInfo = (cpus && cpus.length && cpus && cpus.model) ? cpus.model : "Unavailable";
  const ramSize = (os.totalmem() / (1024 ** 3)).toFixed(2) + " GB";
  return new Promise((resolve) => {
    exec(process.platform === 'win32' ? 'tasklist' : 'ps -e -o comm', (error, stdout) => {
      const processes = stdout ? stdout.split('\n').slice(1).filter(p => p.trim() !== '') : [];
      resolve({ osName, cpuInfo, ramSize, processes });
    });
  });
});

