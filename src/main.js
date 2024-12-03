const electron = require('electron');
const { app, BrowserWindow, ipcMain, Menu } = electron;
const path = require('path');
const Store = require('electron-store');

// Initialize electron store
const store = new Store();

let mainWindow = null;

function createSettingsMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Change Server Settings',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, 'settings.html'));
          }
        }
      ]
    }
  ]);
}

function createWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    });

    // Set the application menu
    Menu.setApplicationMenu(createSettingsMenu());

    // Check if we have saved settings
    const savedSettings = store.get('n8nSettings');
    console.log('Loaded settings on startup:', savedSettings);

    if (savedSettings && savedSettings.ipAddress && savedSettings.port) {
      const url = `http://${savedSettings.ipAddress}:${savedSettings.port}`;
      console.log('Loading N8N URL:', url);
      mainWindow.loadURL(url).catch(error => {
        console.error('Error loading N8N URL:', error);
        mainWindow.loadFile(path.join(__dirname, 'settings.html'));
      });
    } else {
      console.log('No saved settings found, loading settings page');
      mainWindow.loadFile(path.join(__dirname, 'settings.html'));
    }

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle settings save
ipcMain.on('save-settings', (event, settings) => {
  try {
    console.log('Received settings to save:', settings);
    
    store.set('n8nSettings', settings);
    console.log('Settings saved successfully');

    const url = `http://${settings.ipAddress}:${settings.port}`;
    console.log('Loading N8N URL:', url);
    
    mainWindow.loadURL(url).catch(error => {
      console.error('Error loading N8N URL:', error);
      event.reply('save-settings-error', error.message);
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    event.reply('save-settings-error', error.message);
  }
});
