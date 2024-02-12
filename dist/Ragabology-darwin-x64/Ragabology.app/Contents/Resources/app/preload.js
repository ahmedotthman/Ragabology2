const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app'),
    sendMessage: (channel, data) => {
        const validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receiveMessage: (channel, func) => {
        const validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    updateTitle: (title) => ipcRenderer.send('update-title', title),
    showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
    openExternal: async (url) => ipcRenderer.invoke('open-external', url),
});
