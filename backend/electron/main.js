import { app, BrowserWindow, globalShortcut, shell } from 'electron';
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
// waitForPort
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
// find packaged DB helper
function findPackagedDbCandidates() {
  const candidates = [];
  candidates.push(path.join(process.resourcesPath, 'app', 'backend', 'prisma', 'dev.db'));
  candidates.push(path.join(process.resourcesPath, 'backend', 'prisma', 'dev.db'));
  candidates.push(path.join(process.resourcesPath, 'prisma', 'dev.db'));
  candidates.push(path.join(process.resourcesPath, 'dev.db'));
  return candidates;
}

// -------------------------------------------------
// BACKEND
let backendProcess = null;
let mainWindow = null;

async function startBackend() {
  if (isPackaged) {
    // prod
    const backendRoot = path.join(process.resourcesPath, 'app', 'backend');
    const backendEntry = path.join(backendRoot, 'dist/src', 'main.js');

    const candidates = findPackagedDbCandidates();
    let packagedDb = null;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        packagedDb = c;
        break;
      }
    }

    const userDbPath = path.join(app.getPath('userData'), 'dev.db');
    try {
      if (packagedDb && !fs.existsSync(userDbPath)) {
        fs.mkdirSync(path.dirname(userDbPath), { recursive: true });
        fs.copyFileSync(packagedDb, userDbPath);
        console.log('[MAIN] Copied packaged DB to userData:', userDbPath);
      }
    } catch (err) {
      console.warn('[MAIN] DB copy failed:', err);
    }

    const databaseUrl = `file:${userDbPath.replace(/\\/g, '/')}`;
    const bundledNode = path.join(process.resourcesPath, 'node.exe');
    const nodeBinary = fs.existsSync(bundledNode) ? bundledNode : process.execPath;
    const nodeArgs = [backendEntry];

    console.log('[MAIN] Spawning backend with', nodeBinary, nodeArgs.join(' '));

    backendProcess = spawn(nodeBinary, nodeArgs, {
      cwd: backendRoot,
      env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: databaseUrl, ELECTRON_RUN_AS_NODE: '1' },
      stdio: 'inherit',
      windowsHide: true
    });

    backendProcess.on('exit', (code, sig) => {
      console.log('[BACKEND] exited', code, sig);
    });

    try {
      await waitForPort(3000);
      console.log('✅ Backend is running on :3000');

      if (mainWindow && !mainWindow.isDestroyed()) {
        const frontendIndex = path.join(process.resourcesPath, 'app', 'frontend', 'dist', 'index.html')
        await mainWindow.loadFile(frontendIndex, { hash: '/' }) // open Dashboard ("/")
        console.log('[MAIN] Frontend loaded after backend start')
      }
    } catch (err) {
      console.warn('[MAIN] waitForPort timeout or error:', err);
    }
  } else {
    // DEV
    try {
      await waitForPort(3000);
      console.log('✅ Backend dev is reachable on :3000');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.reload();
      }
    } catch (err) {
      console.warn('[MAIN] waitForPort dev timeout or error:', err);
    }
  }
}

// -------------------------------------------------
// FRONTEND
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "img", "icon-256x256.ico"),
    webPreferences: {
      contextIsolation: true,
      preload: fs.existsSync(path.join(__dirname, 'preload.js')) ? path.join(__dirname, 'preload.js') : undefined
    }
  });

  mainWindow.removeMenu();

  // external links open in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (/^https?:\/\//i.test(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (!isPackaged) {
    // DEV: load Vite
    await mainWindow.loadURL('http://localhost:5173/#/');
  }

  return mainWindow;
}

// -------------------------------------------------
// APP
app.whenReady().then(async () => {
  if (process.platform === 'win32') {
    try {
      app.setAppUserModelId('com.example.moneymonitor');
    } catch (e) {
      console.warn('[MAIN] setAppUserModelId failed', e);
    }
  }

  await createWindow();

  // DevTools hotkeys
  globalShortcut.register('Control+Shift+I', () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });
  globalShortcut.register('F12', () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });

  // back run
  startBackend().catch((err) => {
    console.error('[MAIN] Backend failed to start:', err);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
});

app.on('before-quit', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch (e) {
      console.warn('[MAIN] Failed to kill backendProcess', e);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
