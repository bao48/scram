'use strict'

const { ipcRenderer } = require('electron')

// create and add new_column btn
// ipcMain in main.js recieves this
document.getElementById('new_column').addEventListener('click', () => {
    ipcRenderer.send('new_column')
})

// create and add new_board btn
// ipcMain in main.js recieves this
document.getElementById('new_card').addEventListener('click', () => {
    ipcRenderer.send('new_card')
})


document.getElementById('add_column').addEventListener('click', (e) => {
    var isClickInside = document.getElementById('col_overlay_inner_box').contains(e.target);
    if (!isClickInside) {
        document.getElementById('add_column').style.display = "none"
    }
})

document.getElementById('add_card').addEventListener('click', (e) => {
    var isClickInside = document.getElementById('card_overlay_inner_box').contains(e.target);
    if (!isClickInside) {
        document.getElementById('add_card').style.display = "none"
    }
})


ipcRenderer.on('new_column', (event) => {
    document.getElementById("add_column").style.display = "block";
})

ipcRenderer.on('new_card', (event) => {
    document.getElementById("add_card").style.display = "block";
})