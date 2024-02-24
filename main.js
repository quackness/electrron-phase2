const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fluent = require('fluent-ffmpeg');
// const command = fluent();
const ffmpeg = require('ffmpeg-static-electron');
console.log(ffmpeg.path);
const ffprobe = require('ffprobe-static-electron');
console.log(ffprobe.path);
const path = require('node:path');

//tell fluent that we have static installs 
console.log(fluent)
fluent.setFfmpegPath(ffmpeg);
fluent.setFfprobePath(ffprobe.path)


let mainWindow;
let clickedAvi = false;
let originFile = '';
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
const videoFormats = ["avi", "mp4", "webm"];
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
                console.log("open dialog", fileInfo);
                if (fileInfo.canceled) {
                  console.log('Canceled');
                } else {
                  console.log(`User selected: ${fileInfo.filePaths[0]}`)
                  console.log("1", uploaded);
                  // uploaded = true;
                  //https://stackoverflow.com/questions/47756822/change-electrons-menu-items-status-dynamically
                  videoFormats.map((item) => { menu.getMenuItemById(item).enabled = true });
                  originFile = fileInfo.filePaths[0];
                  mainWindow.webContents.send('video-selected', originFile);
                  console.log("2", uploaded);
                  //fluent(fileInfo.filePaths[0]).format('avi').save(__dirname + '/test.avi');
                  // if (clickedAvi) {
                  //   console.log("clicked")
                  //   fluent(fileInfo.filePaths[0]).format('avi').save(__dirname + '/samp.avi');
                  // }
                }
              })
            }
          },
          { type: 'separator' },
          {
            id: "avi",
            label: 'Convert to AVI...',
            click(event, parentWindow) {
              console.log(event)
              // console.log(event)
              let dialogOptions = {
                title: "File save",
                defaultPath: __dirname,
              };
              dialog.showSaveDialog(isMac ? null : parentWindow, dialogOptions).then((fileData) => {
                console.log("file object from showsaveDialog", fileData)
                console.log("canceled?", fileData.canceled)
                console.log("originfile", originFile)
                // let test = file.path
                if (fileData.canceled) {
                  console.log("Canceled")
                  return
                } else {
                  console.log("Hello!")
                  // console.log(fluent)
                  console.log(originFile);
                  console.log(JSON.stringify(originFile));
                  originFile = JSON.stringify(originFile);
                  console.log("type of:", typeof originFile);
                  console.log("dirname", typeof __dirname)
                  if (typeof originFile === "string") {
                    fluent(originFile).toFormat('avi')
                      .on('error', function (err) {
                        console.log('An error occurred: ' + err.message);
                      })
                      .on('end', function () {
                        console.log('Processing finished !');
                      })
                      .saveToFile('/Users/karolinadubaj/nscc/cross-platform/assignment-2.1-quackness/testing.avi');
                  }
                }
              })
                .catch((err) => {
                  console.error(err);
                });
            },
            enabled: uploaded,
          },
          {
            id: "mp4",
            label: 'Convert to MP4...',
            enabled: uploaded
          },
          {
            id: "webm",
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

