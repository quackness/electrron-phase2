const { ipcRenderer } = require('electron');

//https://www.electronjs.org/docs/latest/tutorial/quick-start#access-nodejs-from-the-renderer-with-a-preload-script
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

ipcRenderer.on('video-selected', (event, path) => {
  console.log(path)
  // console.log(path.split('/').pop())
  const videoSrc = path;
  document.querySelector('#videoSource').src = videoSrc;
  document.querySelector(".js-player").load();
})


