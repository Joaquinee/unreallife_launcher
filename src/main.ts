import { app, BrowserWindow, ipcMain, autoUpdater } from 'electron';
import path from 'path';
import { createLogger, transports } from 'winston'; // Utilisez le module de journalisation Winston
import { Notification as ElectronNotification } from 'electron';




// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const logger = createLogger({
  transports: [
    new transports.Console(), // Affiche les logs dans la console
    new transports.File({ filename: path.join(app.getPath('userData'), 'app.log') }) // Enregistre les logs dans un fichier
  ]
});

const APP_VERSION = app.getVersion();
const AUTO_UPDATE_URL = 'https://api.update.rocks/update/github.com/Joaquinee/unreallife_launcher/stable/' + process.platform + '/' + APP_VERSION

const getLastestVersion = async (): Promise<void> => {
  const get = fetch(AUTO_UPDATE_URL)
  let res = await get.then((res) => res.json()) ?? APP_VERSION;
  if (res.name != APP_VERSION) {
    console.log(res.name, APP_VERSION)
    checkVersion()
  } else {
    createWindow()
    logger.log('info','Aucune mise à jour disponible.');

  }
  return
}

const checkVersion = async (): Promise<void> => {
    windowLoader()
    logger.log('info', 'Une version plus récente est disponible !');
    try {
      autoUpdater.setFeedURL({url: AUTO_UPDATE_URL}); 
      autoUpdater.checkForUpdates();
    } catch (error) {
     
      logger.error('Erreur lors de la mise à jour :', error);
    }
}

async function sendVersion() {
  const version = app.getVersion();
  return version
}

function createNotification({ title = '', body = ''}: { title?: string, body?: string, icon?: string, closeButtonText?: string}) {
  const icon = path.join(resourcesPath, 'images', 'icon.ico');
  const closeButtonText = "fermer"
  new ElectronNotification({ title, body, icon, closeButtonText }).show();
}

autoUpdater.on('error', (err) => {
  createWindow()
  createNotification({ title: 'Une erreur est survenue !', body: 'Une nouvelle version est disponible, mais impossible de la télécharger.' })
  logger.error('Erreur lors de la mise à jour :', err);
});

autoUpdater.on('update-available', () => {
  logger.log('info', 'Mise à jour disponible. Téléchargement en cours...');
  createNotification({ title: 'Une version plus récente est disponible !', body: 'Téléchargement en cours...' })
});
autoUpdater.on('update-not-available', () => {
  logger.log('info', 'Aucune mise à jour disponible.');
  createWindow()
});
autoUpdater.on('update-downloaded', () => {
  logger.log('info', 'Mise à jour téléchargée. Redémarrage en cours...');
  createNotification({ title: 'Une version plus récentes est installée !', body: 'Redémarrage en cours...' })
  autoUpdater.quitAndInstall();
  logger.log('info', 'Application Prêtes.');
});

const resourcesPath = process.resourcesPath;


let mainWindow: BrowserWindow | null = null;
let loadWindow: BrowserWindow | null = null;

const windowLoader = () => {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: false,
    title: 'UnrealLife Launcher Updater',
    center: true,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(resourcesPath, 'images', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
 
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    loadWindow.loadFile('./src/html/load.html');
    
  } else {
    loadWindow.loadFile(path.join(__dirname, `load.html`));
  }
 
}

const createWindow = () => {
  // Create the browser window.
  mainWindow  = new BrowserWindow({
    width: 800,
    title: 'UnrealLife Launcher',
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    center: true,
    icon: path.join(resourcesPath, 'images', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach'});
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  setupIpcHandlers()
};




const setupIpcHandlers = async () => {
    if (!mainWindow || !loadWindow) {
    ipcMain.handle('getVersion', async () => {
      return sendVersion();
    });
  }
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', getLastestVersion);




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
process.on('unhandledRejection', (reason, _promise) => {
  console.error('Unhandled Promise Rejection:', reason, _promise);
  // Vous pouvez ajouter des actions supplémentaires ici, par exemple enregistrer l'erreur, fermer l'application, etc.
});
