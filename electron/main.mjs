import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
        nodeIntegration: true,
    },
  })

  win.loadURL('http://localhost:5173')
}

// function openSwaggerWindow () {
//   const swaggerWin = new BrowserWindow({
//     width: 1000,
//     height: 800,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//       sandbox: true, // иногда помогает
//   }
// })

//   swaggerWin.loadURL('http://localhost:3000/api')
// }

app.whenReady().then(createWindow)
// app.whenReady().then(openSwaggerWindow)
