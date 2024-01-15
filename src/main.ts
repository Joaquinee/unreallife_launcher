import { app, BrowserWindow, ipcMain, autoUpdater } from "electron";
import path from "path";
import { createLogger, transports } from "winston"; // Utilisez le module de journalisation Winston
import { Notification as ElectronNotification } from "electron";
import { download } from "electron-dl"; // Importe la fonction download
import Winreg from "winreg";
import fs from "fs-extra";
import * as crypto from 'crypto';
import axios from "axios";



//Other
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const logger = createLogger({
  transports: [
    new transports.Console(), // Affiche les logs dans la console
    new transports.File({
      filename: path.join(app.getPath("userData"), "app.log"),
    }), // Enregistre les logs dans un fichier
  ],
});

const APP_VERSION = app.getVersion();
const AUTO_UPDATE_URL =
  "https://api.update.rocks/update/github.com/Joaquinee/unreallife_launcher/stable/" +
  process.platform +
  "/" +
  APP_VERSION;

const getLastestVersion = async (): Promise<void> => {
  const get = fetch(AUTO_UPDATE_URL);
  let res = (await get.then((res) => res.json())) ?? APP_VERSION;
  if (res.name != APP_VERSION) {
    console.log(res.name, APP_VERSION);
    checkVersion();
  } else {
    createWindow();
    logger.log("info", "Aucune mise à jour disponible.");
  }
};

const checkVersion = async (): Promise<void> => {
  windowLoader();
  logger.log("info", "Une version plus récente est disponible !");
  autoUpdater.setFeedURL({ url: AUTO_UPDATE_URL });
  try {
    autoUpdater.checkForUpdates();
  } catch (error) {
    logger.error("Erreur lors de la mise à jour :", error);
  }
};

async function sendVersion() {
  const version = app.getVersion();
  return version;
}
async function lastVersion() {
  const get = fetch(AUTO_UPDATE_URL);
  let res = (await get.then((res) => res.json())) ?? APP_VERSION;
  return res.name;
}

function createNotification({
  title = "",
  body = "",
}: {
  title?: string;
  body?: string;
  icon?: string;
  closeButtonText?: string;
}) {
  const icon = path.join(resourcesPath, "images", "icon.ico");
  const closeButtonText = "fermer";
  new ElectronNotification({ title, body, icon, closeButtonText }).show();
}

autoUpdater.on("error", (err) => {
  createWindow();
  createNotification({
    title: "Une erreur est survenue !",
    body: "Une nouvelle version est disponible, mais impossible de la télécharger.",
  });
  logger.error("Erreur lors de la mise à jour :", err);
});

autoUpdater.on("update-available", () => {
  logger.log("info", "Mise à jour disponible. Téléchargement en cours...");
  createNotification({
    title: "Une version plus récente est disponible !",
    body: "Téléchargement en cours...",
  });
});
autoUpdater.on("update-not-available", () => {
  logger.log("info", "Aucune mise à jour disponible.");
  createWindow();
});
autoUpdater.on("update-downloaded", () => {
  logger.log("info", "Mise à jour téléchargée. Redémarrage en cours...");
  createNotification({
    title: "Une version plus récentes est installée !",
    body: "Redémarrage en cours...",
  });
  autoUpdater.quitAndInstall();
  logger.log("info", "Application Prêtes.");
});

const resourcesPath = process.resourcesPath;

let mainWindow: BrowserWindow | null = null;
let loadWindow: BrowserWindow | null = null;

const windowLoader = () => {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: false,
    center: true,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(resourcesPath, "images", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    loadWindow.loadFile("./src/html/load.html");
  } else {
    loadWindow.loadFile(path.join(__dirname, `load.html`));
  }
};

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    title: "UnrealLife Launcher",
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    center: true,
    icon: path.join(resourcesPath, "images", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  
    const downloadFileNew = async (
      window: BrowserWindow,
      url: string,
      savePath: string
    ): Promise<void> => {
      await download(mainWindow, url, {
        directory: path.dirname(savePath),
        filename: path.basename(savePath),
        overwrite: true,
        errorMessage: "Erreur lors du téléchargement du fichier.",
      });
    };

    const fileUrl = "http://188.165.200.136/mods/list.json";
    const fileName = "listServer.json";
    const downloadDirectory = path.join(app.getPath("userData"), fileName); // Chemin du répertoire de téléchargement dans le répertoire de l'application
    await downloadFileNew(mainWindow, fileUrl, downloadDirectory);

    
  setupIpcHandlers();

  //registre Arma path install and cerate folder @A3URL
  const registryKey = new Winreg({
    hive: Winreg.HKLM,
    key: "\\SOFTWARE\\WOW6432Node\\bohemia interactive\\arma 3",
  });

  const getRegistryValue = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      registryKey.get("main", (err, item) => {
        if (err) {
          reject(
            new Error(
              `Erreur lors de la récupération de la valeur du registre : ${err.message}`
            )
          );
        } else {
          resolve(item?.value || null);
        }
      });
    });
  };

  const checkIfFolderExists = async (folderPath: string): Promise<boolean> => {
    try {
      const stats = await fs.promises.stat(folderPath);
      return stats.isDirectory();
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
  };
  const createFolderIfNotExists = async (folderPath: string): Promise<void> => {
    if (!(await checkIfFolderExists(folderPath))) {
      await fs.promises.mkdir(folderPath);
    }
  };
  const downloadFile = async (
    window: BrowserWindow,
    url: string,
    savePath: string
  ): Promise<void> => {
    await download(mainWindow, url, {
      directory: path.dirname(savePath),
      filename: path.basename(savePath),
      overwrite: true,
      onProgress(progress) {
        window.webContents.send("downloadProgress", progress.percent);
      },
      errorMessage: "Erreur lors du téléchargement du fichier.",
    });
  };

  (async () => {
    try {
      const registryValue = await getRegistryValue();
      if (registryValue) {
        const a3urlPath = path.join(registryValue, "@A3URL");
        const modsPath = path.join(a3urlPath, "addons");
        await createFolderIfNotExists(a3urlPath);
        await createFolderIfNotExists(modsPath);

        const logoUrl = "http://188.165.200.136/mods/logo.paa";
        const logoSavePath = path.join(a3urlPath, "logo.paa");
        await downloadFile(mainWindow, logoUrl, logoSavePath);

        
        const modUrl = "http://188.165.200.136/mods/mod.cpp";
        const modSavePath = path.join(a3urlPath, "mod.cpp");
        await downloadFile(mainWindow, modUrl, modSavePath);

        console.log(
          "Les fichiers logo.paa et mod.cpp ont été téléchargés avec succès."
        );
      } else {
        console.log("La valeur du registre est null ou undefined.");
      }
    } catch (error) {
      console.error(error.message);
    }
    
    //Addons base
    interface AddonInfo {
      name: string;
      hash: string;
      size: number;
    }
  
    const calculateFileHash = async (filePath: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
    
        stream.on('data', data => {
          hash.update(data);
        });
    
        stream.on('end', () => {
          const fileHash = hash.digest('hex');
          resolve(fileHash);
        });
    
        stream.on('error', error => {
          reject(error);
        });
      });
    };
    
    const getAddonsList = async (addonsPath: string): Promise<AddonInfo[]> => {
      try {
        const files = await fs.promises.readdir(addonsPath);
        const addonsInfo: AddonInfo[] = [];
    
        for (const fileName of files) {
          const filePath = path.join(addonsPath, fileName);
          const fileStat = await fs.promises.stat(filePath);
          const fileHash = await calculateFileHash(filePath);
    
          const addon: AddonInfo = {
            name: fileName,
            hash: fileHash,
            size: fileStat.size,
          };
    
          addonsInfo.push(addon);
        }
    
        return addonsInfo;
      } catch (error) {
        throw new Error(`Erreur lors de la lecture du dossier addons : ${error.message}`);
      }
    };
  
    const name = await getRegistryValue()
    const a3urlPath = path.join(name, "@A3URL");
    const modsPath = path.join(a3urlPath, "addons");
    const addonsPath = modsPath; // Remplace cela par le vrai chemin
    
   
    const outputPath = path.join(app.getPath("userData"), 'listClient.json');
    const addonsList = await getAddonsList(addonsPath);

    console.log('Mods local : ' + addonsList.length);
    await fs.promises.writeFile(outputPath, JSON.stringify(addonsList, null, 2));
    mainWindow.webContents.send('app-ready', true);
    console.log(`Liste des addons sauvegardée avec succès : ${outputPath}`);
  })();


  
  

};
const setupIpcHandlers = async () => {
  if (!mainWindow || !loadWindow) {
    ipcMain.handle("getVersion", async () => {
      return sendVersion();
    });
    ipcMain.handle("setNewClientjson", async () => {

      const clientFilePath = path.join(app.getPath('userData'), 'listClient.json');
      const serverFilePath = path.join(app.getPath('userData'), 'listServer.json');

      try {

        await fs.remove(clientFilePath);

        // Copie listServer.json avec le nouveau nom listClient.json
        await fs.copy(serverFilePath, clientFilePath);
    
        console.log('Fichier copié avec succès.');
      } catch (error) {
        console.error(error.message);
      }
    

    })
    ipcMain.handle("getLastestVersion", async () => {
      return lastVersion();
    });
    ipcMain.handle("getCompareData", async () => {
      const loadServerData =  () => {
        const filePath = path.join(app.getPath('userData'), 'listServer.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      };
      const loadClientData = () => {
        const filePath = path.join(app.getPath('userData'), 'listClient.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      };
     


      console.log('Mods serveur : ' + loadServerData().length, 'Mods local : ' + loadClientData().length);
      const deleteFilesNotInServer = async () => {
        const serverData = loadServerData();
        const clientData = loadClientData();
    
        const filesToDelete = clientData.filter((clientFile: { name: any; }) => {
          return !serverData.some((serverFile: { name: any; }) => serverFile.name === clientFile.name);
        });
    
        filesToDelete.forEach(async (fileToDelete: { name: string; }) => {

          const registryKey = new Winreg({
            hive: Winreg.HKLM,
            key: "\\SOFTWARE\\WOW6432Node\\bohemia interactive\\arma 3",
          });
        
          const getRegistryValue = (): Promise<any> => {
            return new Promise((resolve, reject) => {
              registryKey.get("main", (err, item) => {
                if (err) {
                  reject(
                    new Error(
                      `Erreur lors de la récupération de la valeur du registre : ${err.message}`
                    )
                  );
                } else {
                  resolve(item?.value || null);
                }
              });
            });
          };
          
          const registryValue = await getRegistryValue();
            if (registryValue) {
            const a3urlPath = path.join(registryValue, "@A3URL");
            const modsPath = path.join(a3urlPath, "addons");

          try {
              fs.unlinkSync(modsPath + '/' + fileToDelete.name);
              const index = clientData.findIndex((addon: any) => addon.name === fileToDelete.name);
              clientData.splice(index, 1);
              const outputPath = path.join(app.getPath("userData"), 'listClient.json');
              await fs.promises.writeFile(outputPath, JSON.stringify(clientData, null, 2));
              console.log(`Le fichier ${fileToDelete.name} a été supprimé avec succès.`);
          } catch (err) {
              console.error(`Erreur lors de la suppression du fichier ${fileToDelete.name}:`, err);
          }
              
        }
      });
       
      };
    
      const compareData = async  (serverData: any, clientData: any) => {
        const addonsToUpdate: any[] = [];
      
        for (const serverAddon of serverData) {
          const clientAddon = clientData.find((addon: any) => addon.name === serverAddon.name);
      
          if (!clientAddon || clientAddon.hash !== serverAddon.hash || clientAddon.size !== serverAddon.size) {
            addonsToUpdate.push(serverAddon);
          }
        }
      
        return addonsToUpdate;
      };
      const serverData = loadServerData();
      const clientData = loadClientData();
      const addonsToUpdate = await compareData(serverData, clientData);
      await deleteFilesNotInServer()
      return addonsToUpdate;
     
    });
      ipcMain.handle('dowloadMods', async (event, name) => {
        let url = "http://188.165.200.136/mods/" + name;

        const registryKey = new Winreg({
          hive: Winreg.HKLM,
          key: "\\SOFTWARE\\WOW6432Node\\bohemia interactive\\arma 3",
        });
      
        const getRegistryValue = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            registryKey.get("main", (err, item) => {
              if (err) {
                reject(
                  new Error(
                    `Erreur lors de la récupération de la valeur du registre : ${err.message}`
                  )
                );
              } else {
                resolve(item?.value || null);
              }
            });
          });
        };
        
        const registryValue = await getRegistryValue();
        if (registryValue) {
        const a3urlPath = path.join(registryValue, "@A3URL");
        const modsPath = path.join(a3urlPath, "addons");

        
        
        const downloadFile = async (url: string, name: string) => {
          return new Promise((resolve, reject) => {
            download(mainWindow, url, {
              directory: modsPath,
              filename: name,
              overwrite: true,
              onProgress(progress) {
                mainWindow.webContents.send('download-progress', progress.percent);

              },
              onStarted(dl) { 
                mainWindow.webContents.send('download-name', dl.getFilename());
              },
              errorMessage: 'Erreur lors du téléchargement du fichier.',
            })
              .then(dl => {
                //console.log('Fichier téléchargé :', dl.getSavePath());
                resolve(dl);
              })
              .catch(error => {
                console.error('Erreur lors du téléchargement du fichier :', error);
                reject(error);
              });
          });
        };

        await downloadFile(url, name)

      }
        
      
    });
    
  }
};




// Fonction pour charger les données du serveur



// Fonction pour comparer les données du serveur et du client






app.on("ready", getLastestVersion);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
process.on("unhandledRejection", (reason, _promise) => {
  console.error("Unhandled Promise Rejection:", reason, _promise);
});
