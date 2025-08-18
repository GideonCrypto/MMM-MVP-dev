// electron/main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import net from 'net';
import { fileURLToPath } from 'url';

console.log('[DEBUG] Main process started');

process.on('uncaughtException', (err) => console.error('[UNCAUGHT]', err));
process.on('unhandledRejection', (reason) => console.error('[UNHANDLED]', reason));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isPackaged = app.isPackaged;

// -------------------------------------------------
// Утилита ожидания, что порт занят
function waitForPort(port, host = '127.0.0.1', timeout = 20000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      const sock = new net.Socket();
      sock
        .once('connect', () => { sock.destroy(); resolve(); })
        .once('error', () => {
          sock.destroy();
          if (Date.now() - startTime > timeout) reject(new Error(`Timeout: ${port}`));
          else setTimeout(check, 250);
        })
        .connect(port, host);
    };
    check();
  });
}

// -------------------------------------------------
// BACKEND
let backendProcess = null;

async function startBackend() {
  if (isPackaged) {
    // ⚡ В продакшне запускаем собранный бэкенд
    const backendRoot = path.join(process.resourcesPath, 'app', 'backend');
    const backendEntry = path.join(backendRoot, 'dist', 'src', 'main.js');

    backendProcess = spawn(process.execPath, [backendEntry], {
      cwd: backendRoot,
      env: { ...process.env, NODE_ENV: 'production', ELECTRON_RUN_AS_NODE: '1' },
      stdio: 'inherit'
    });

    backendProcess.on('exit', (code, sig) =>
      console.log('[BACKEND] exited', code, sig)
    );

    await waitForPort(3000);
    console.log('✅ Backend is running on :3000');
  } else {
    // ⚡ В дев-режиме backend запускается через concurrently
    console.log('[MAIN] Dev mode → backend запускается отдельно, пропускаем spawn');
    await waitForPort(3000);
  }
}

// -------------------------------------------------
// FRONTEND
async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // если есть preload
    }
  });

  if (isPackaged) {
    const frontendIndex = path.join(
      process.resourcesPath,
      'app',
      'frontend',
      'dist',
      'index.html'
    );
    console.log('[MAIN] Loading frontend (prod):', frontendIndex);
    await win.loadFile(frontendIndex);
  } else {
    const devUrl = 'http://localhost:5173';
    console.log('[MAIN] Loading frontend (dev):', devUrl);
    await win.loadURL(devUrl);
  }
}

// -------------------------------------------------
// APP
app.whenReady().then(async () => {
  try {
    await startBackend();
  } catch (err) {
    console.error('[MAIN] Backend failed:', err);
  }
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
