// note that console.log in ipcMain should print to the actual console, not the dev tools console
// note that console.log in ipcRenderer should print to the dev tools console



'use strict'

const {app, ipcMain, BrowserWindow} = require('electron')
const path = require('path')

const DataStore = require('./DataStore')

const main_data = new DataStore({ name: 'MainDataStore'})

function main () {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
    })

    mainWindow.once('ready-to-show', (event) => {
        mainWindow.show()
    })
    
    // initialize with columns
    // for some reaason does not work
    mainWindow.once('show', (event) => {
        mainWindow.webContents.send('update_columns', main_data.columns)
    })

    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html')

    // recieving new_column sent by index.js and sending it back to index.js
    ipcMain.on('new_column', (event) => {
        mainWindow.send('new_column')
    })

    // recieving new_card sent by index.js and sending it back to index.js
    ipcMain.on('new_card', (event) => {
        mainWindow.send('new_card')
    })

    // recieving save_column sent by index.js and sending it back to index.js
    ipcMain.on('save_column', (event, column_data) => {
        const updatedColumns = main_data.addColumn(column_data).columns
        mainWindow.send('update_columns', updatedColumns)
    })

    // recieving save_card sent by index.js and sending it back to index.js
    ipcMain.on('save_card', (event, signal) => {
        mainWindow.send('update_card')
    })
}

app.on('ready', main)

app.on('window-all-closed', function(){
    app.quit()
})
