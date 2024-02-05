const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 605,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
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
          { label: 'Load...' }
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






// const template = [
//   {
//     label: app.name,
//     submenu: [
//       { role: 'about' },
//       { type: 'separator' },
//       { role: 'services' },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideOthers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' }
//     ]
//   },
//   {
//     label: 'View',
//     submenu: [
//       {
//         label: 'Watch Video',
//         click: async () => {
//           const { shell } = require('electron')
//           await shell.openExternal('https://electronjs.org')
//         }
//       },
//       {
//         label: 'About us',
//         click: async () => {
//           const { shell } = require('electron')
//           await shell.openExternal('https://karolinaredden.000webhostapp.com/')
//         }
//       },
//       {
//         label: 'Start the camera'
//       }
//     ]
//   },
//   {
//     label: 'Window',
//     submenu: [
//       { role: 'minimize' },
//       { role: 'zoom' },
//     ]
//   },
//   {
//     label: 'Help',
//     submenu: [
//       {
//         label: 'Contact us',

//       },
//     ]
//   }
// ];

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)



//add option for mac to prevent the app from closing 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})






//source: https://www.electronjs.org/docs/latest/tutorial/quick-start