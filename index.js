'use strict'

const { ipcRenderer } = require('electron')


// create and add new_board btn
// ipcMain in main.js recieves this
document.getElementById('new_project').addEventListener('click', () => {
    ipcRenderer.send('new_project')
})

// create and add new_column btn
// ipcMain in main.js recieves this
document.getElementById('new_column').addEventListener('click', () => {
    ipcRenderer.send('new_column')
})


document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('overlay').style.display = "none"
})

ipcRenderer.on('new_project', (event) => {
    document.getElementById("overlay").style.display = "block";
})

ipcRenderer.on('new_column', (event) => {
    document.getElementById("overlay").style.display = "block";
})