// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld('a3url', {
  getCompareData: async () => ipcRenderer.invoke('getCompareData'),
  dowloadMods: async (url: string) => ipcRenderer.invoke('dowloadMods', url),
  setNewClientjson: async () => ipcRenderer.invoke('setNewClientjson'),
  launcGame: async () => ipcRenderer.invoke('launcGame'),
  tfar: async () => ipcRenderer.invoke('tfar'),
  launchTs: async () => ipcRenderer.invoke('launchTs'),
  launchDiscord: async () => ipcRenderer.invoke('launchDiscord'),
})


contextBridge.exposeInMainWorld('ipcRenderer', {
  receive: (channel: string, func: (arg0: any) => any) => {
    let validChannels = ['download-progress', 'download-name', 'app-ready', 'isdownload', 'download-stop', 'getVersion'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event: any, ...args: any) => func(...args));
    }
  },
});