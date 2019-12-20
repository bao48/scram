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

    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html')

    mainWindow.once('ready-to-show', (event) => {
        mainWindow.show()
    })
    
    // initialize with columns
    // for some reaason does not work
    mainWindow.once('show', (event) => {
        mainWindow.webContents.send('update_columns', main_data.columns)
        mainWindow.webContents.send('main_window_ready')
    })


    // recieving new_card sent by index.js and sending it back to index.js
    ipcMain.on('new_card', (event, column_id) => {
        mainWindow.send('new_card', column_id)
    })

    // recieving save_column sent by index.js and sending it back to index.js
    ipcMain.on('save_column', (event, column_data) => {
        main_data.columns = main_data.addColumn(column_data).columns
    })

    // recieving save_card sent by index.js and sending it back to index.js
    ipcMain.on('save_card', (event, card_data, column_id) => {
        main_data.columns = main_data.addCard(card_data, column_id).columns
    })

    // recieving new_column sent by index.js and sending it back to index.js
    ipcMain.on('del_column', (event) => {
        mainWindow.send('new_column')
    })

    // recieving new_column sent by index.js and sending it back to index.js
    ipcMain.on('del_card', (event, card_id, column_id) => {
        main_data.columns = main_data.deleteCard(card_id, column_id).columns
    })
    
    ipcMain.on('transfer_card', (event, start_col_id, end_col_id, card_id) => {
        main_data.columns = main_data.transferCard(start_col_id, end_col_id, card_id).columns
    })

    ipcMain.on('timer', (event, card_id, column_id) => {
        var [data, timerStatus, timeWorked] = main_data.timer(card_id, column_id)
        main_data.columns = data.columns
        mainWindow.send('update_timer', card_id, timerStatus, timeWorked)
    })

    ipcMain.on('edit_card', (event, card_id, column_id) => {
        for(var i = 0; i < main_data.columns.length; i++) {
            console.log(main_data.columns[i])
            console.log(main_data.columns[i].cards)
            if (parseInt(main_data.columns[i].create_date) === parseInt(column_id)) {
                for (var j = 0; j < main_data.columns[i].cards.length; j++) {
                    console.log("create_date: " + main_data.columns[i].cards[j].create_date + " card_id: " + card_id + " match: " + (parseInt(main_data.columns[i].cards[j].create_date) === parseInt(card_id)))
                    if (parseInt(main_data.columns[i].cards[j].create_date) === parseInt(card_id)) {
                        mainWindow.send('card_info', main_data.columns[i].cards[j])
                        return
                    }
                }
            }
        }
        console.error("No matching columns found. Card id: " + card_id + " column_id: " + column_id )
    })

}

app.on('ready', main)

app.on('window-all-closed', function(){
    app.quit()
})
