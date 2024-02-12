import { app, BrowserWindow, dialog, ipcMain, shell, Notification } from 'electron';
import { exec } from 'child_process';

import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';

let win;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchRecordingSoftwareList() {
    try {
        const response = await axios.get('https://www.tq-box.com/public/recording-software-list.json');
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log('Recording software list retrieved successfully.');
            return response.data.map(name => name.toLowerCase());
        } else {
            throw new Error('Failed to fetch list: Response format invalid or not an array.');
        }
    } catch (error) {
        console.error('Failed to fetch recording software list:', error);
        return [];
    }
}

async function createWindow() {
    // Removed the isElevated check for macOS compatibility.
    const preloadPath = path.join(__dirname, 'preload.js');
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: preloadPath
        },
        icon: path.join(__dirname, 'build/app_icon.png') // Adjusted the icon format for macOS compatibility
    });

    win.loadURL('https://ragaboloy.tq-box.com/login/');
    win.webContents.on('devtools-opened', () => { win.webContents.closeDevTools(); });
    win.on('page-title-updated', evt => { evt.preventDefault(); });
    const recordingSoftwareList = await fetchRecordingSoftwareList();
    setInterval(() => checkForRecordingSoftware(recordingSoftwareList), 30000);
}

async function checkForRecordingSoftware(recordingSoftwareList) {
    exec('ps ax', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        let detected = false;
        recordingSoftwareList.forEach(software => {
            if (stdout.toLowerCase().includes(software)) {
                detected = true;
                console.log(`Recording software detected: ${software}`);
                // Changed to immediate app quit with notification
                dialog.showMessageBox(win, {
                    type: 'warning',
                    title: 'Recording Software Detected',
                    message: 'Recording software detected. The application will now close.',
                    buttons: ['OK']
                }).then(() => {
                    app.quit();
                });
                return; // Exit the loop and function early upon detection
            }
        });
    });
}

ipcMain.on('close-app', () => { app.quit(); });
ipcMain.on('update-title', (event, title) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.setTitle(title);
});
ipcMain.on('show-notification', (event, { title, body }) => {
    new Notification({ title, body }).show();
});
ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url);
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { app.quit(); });
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
