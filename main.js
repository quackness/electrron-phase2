const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('node:path');
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 605,
    resizable: false,
    webPreferences: {
      // preload: path.join(__dirname, 'renderer.js')
      nodeIntegration: true, // default is false
      contextIsolation: false // default is true
    }
  })

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  // const contents = mainWindow.webContents
  // console.log("Content", contents)
}

const isMac = process.platform === 'darwin'

let uploaded = false;
const arr = ["1", "2", "3"];
const template = [
  ...(isMac
    ? [{
      label: app.name,
    }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Video',
        submenu: [
          {
            label: 'Load...',
            click(event, parentWindow) {
              let dialogOptions = {
                title: "File dialog",
                defaultPath: __dirname,
                filters: [{ name: 'Video file', extensions: ['.mp4', '.avi', '.mov', '.wmv'] }]
              };
              dialog.showOpenDialog(isMac ? null : parentWindow, dialogOptions).then((fileInfo) => {
                console.log(fileInfo);
                if (fileInfo.canceled) {
                  console.log('Canceled');
                } else {
                  console.log(`User selected: ${fileInfo.filePaths[0]}`)
                  console.log("1", uploaded);
                  // uploaded = true;
                  //https://stackoverflow.com/questions/47756822/change-electrons-menu-items-status-dynamically
                  arr.map((item) => { menu.getMenuItemById(item).enabled = true });
                  mainWindow.webContents.send('video-selected', fileInfo.filePaths[0]);
                  console.log("2", uploaded);
                }
              })
            }
          },
          { type: 'separator' },
          {
            id: "1",
            label: 'Convert to AVI...',
            enabled: uploaded,
          },
          {
            id: "2",
            label: 'Convert to MP4...',
            enabled: uploaded,
          },
          {
            id: "3",
            label: 'Convert to WEBM...',
            enabled: uploaded,
          }

        ]
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      { role: 'toggleDevTools' },
    ]
  }];
console.log("2???", uploaded);
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});



//add option for mac to prevent the app from closing 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


