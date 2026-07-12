const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', Object.freeze({
  isDesktop: true,
  platform: process.platform,
  getAppVersion: () => process.versions.electron,
  openResumeIntake: () => ipcRenderer.invoke('open-resume-intake')
}));
