const splitSong = require('./splitSong')
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

let win

createWindow = () => {
    win = new BrowserWindow({width: 600, height: 750})
    let filePath
    let dirPath
    let songList

    win.webContents.on('will-navigate', e => e.preventDefault())

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    ipcMain.on('main', (event, file_path) => {
        dirPath = file_path.split('.')[0]
        filePath = file_path
    })

    ipcMain.on('split', (event, song_list) => {
        if (filePath) {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath)
                // console.log('made dir');
            }
            const splits = splitSong.songInfo(song_list)

            splitSong.split(filePath, splits, dirPath, res => {
                win.webContents.send('result', res)
            })
        }
    })

    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
})
