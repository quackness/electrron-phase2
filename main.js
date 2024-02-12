const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('node:path');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 605,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
}


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

const isMac = process.platform === 'darwin'


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
                defaultPath: __dirname
              };
              dialog.showOpenDialog(isMac ? null : parentWindow, dialogOptions).then((fileInfo) => {
                console.log(fileInfo);
                if (fileInfo.canceled) {
                  console.log('Canceled');
                } else {
                  console.log(`User selected: ${fileInfo.filePaths[0]}`)
                }
              })
            }
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

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)




//add option for mac to prevent the app from closing 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})






//source: https://www.electronjs.org/docs/latest/tutorial/quick-start