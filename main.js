// note that console.log in ipcMain should print to the actual console, not the dev tools console
// note that console.log in ipcRenderer should print to the dev tools console



'use strict'

const {app, ipcMain, BrowserWindow} = require('electron')
const path = require('path')


function main () {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    })
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html')

    // recieving start sent by index.js and sending it back to index.js
    ipcMain.on('new_project', (event, signal) => {
        mainWindow.send('new_project')
    })

    // recieving end sent by index.js and sending it back to index.js
    ipcMain.on('new_column', (event, signal) => {
        mainWindow.send('new_column')
    })
}

app.on('ready', main)

app.on('window-all-closed', function(){
    app.quit()
})
