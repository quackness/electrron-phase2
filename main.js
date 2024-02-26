const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const ProgressBar = require('electron-progressbar');
const fluent = require('fluent-ffmpeg');
// const command = fluent();
const ffmpeg = require('ffmpeg-static-electron');
console.log(ffmpeg.path);
const ffprobe = require('ffprobe-static-electron');
console.log(ffprobe.path);
const path = require('node:path');

//tell fluent that we have static installs 
console.log(fluent)
console.log(ffmpeg)
fluent.setFfmpegPath(ffmpeg.path);
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
                //
                if (fileData.canceled) {
                  console.log("Canceled")
                  return
                } else {
                  // Extracting the file name from the path
                  const fileName = path.basename(fileData.filePath);
                  console.log("File name:", fileName);
                  console.log(originFile);
                  if (typeof originFile === "string") {
                    const progressBar = new ProgressBar({
                      indeterminate: false,
                      text: 'Preparing data...',
                      title: 'My progress...'
                    });
                    fluent(originFile).toFormat('avi')
                      .on('end', () => {
                        console.log("File converted!")
                        progressBar.close();
                      })
                      .on('error', (err) => {
                        console.error('Error:', err);
                        progressBar.close();
                      })
                      .on('progress', (data) => {
                        // console.log("progress")
                        console.log(data.percent)
                        // console.log(progressBar)
                        progressBar.detail = `Value ${progressBar.value} out of ${progressBar.getOptions().maxValue}...`;
                        progressBar.value = data.percent
                      })
                      .output(__dirname + `/${fileName}.avi`)
                      .run();
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
            click(event, parentWindow) {
              console.log(event)
              // console.log(event)
              let dialogOptions = {
                title: "File save",
                defaultPath: __dirname,
              };
              dialog.showSaveDialog(isMac ? null : parentWindow, dialogOptions).then((fileData) => {
                const fileName = path.basename(fileData.filePath);
                if (fileData.canceled) {
                  console.log("Canceled")
                  return
                } else {
                  console.log(originFile);
                  const progressBar = new ProgressBar({
                    indeterminate: false,
                    text: 'Preparing data...',
                    title: 'My progress...'
                  });
                  if (typeof originFile === "string") {
                    fluent(originFile).toFormat('mp4')
                      .on('end', () => {
                        console.log("File converted!")
                        progressBar.close();
                      })
                      .on('error', (err) => {
                        console.error('Error:', err);
                        progressBar.close();
                      })
                      .on('progress', (data) => {
                        // console.log("progress")
                        console.log(data.percent)
                        // console.log(progressBar)
                        progressBar.detail = `Value ${progressBar.value} out of ${progressBar.getOptions().maxValue}...`;
                        progressBar.value = data.percent
                      })
                      .output(__dirname + `/${fileName}.mp4`)
                      .run();
                  }
                }
              })
                .catch((err) => {
                  console.error(err);
                });
            },
            enabled: uploaded
          },
          {
            id: "webm",
            label: 'Convert to WEBM...',
            enabled: uploaded,
            click(event, parentWindow) {
              console.log(event)
              // console.log(event)
              let dialogOptions = {
                title: "File save",
                defaultPath: __dirname,
              };
              dialog.showSaveDialog(isMac ? null : parentWindow, dialogOptions).then((fileData) => {
                if (fileData.canceled) {
                  console.log("Canceled")
                  return
                } else {
                  const fileName = path.basename(fileData.filePath);
                  const progressBar = new ProgressBar({
                    indeterminate: false,
                    text: 'Preparing data...',
                    title: 'My progress...'
                  });
                  fluent(originFile).toFormat('webm')
                    .on('end', () => {
                      console.log("File converted!")
                      progressBar.close();
                    })
                    .on('error', (err) => {
                      console.error('Error:', err);
                      progressBar.close();
                    })
                    .on('progress', (data) => {
                      // console.log("progress")
                      // console.log(data)
                      // console.log(progressBar)
                      progressBar.value = data.percent
                    })
                    .output(__dirname + '/testing.webm')
                    .run();
                }
              })
                .catch((err) => {
                  console.error(err);
                });
            },
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
  });
});






//add option for mac to prevent the app from closing 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

