const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  reloadApp: () => ipcRenderer.invoke('reload-app')
});
