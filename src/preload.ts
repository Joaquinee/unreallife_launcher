// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld('a3url', {
  getVersion: async () => ipcRenderer.invoke('getVersion'),
  getLastestVersion: async () => ipcRenderer.invoke('getLastestVersion'),
  getCompareData: async () => ipcRenderer.invoke('getCompareData'),
  dowloadMods: async (url: string) => ipcRenderer.invoke('dowloadMods', url),
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  receive: (channel: string, func: (arg0: any) => any) => {
    let validChannels = ['download-progress', 'download-name'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
    }
  },
});