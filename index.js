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

document.getElementById('save_column').addEventListener('click', () => {

    var form_elements = document.forms["column-inputs"].elements

    var name1 = form_elements[0].id
    var name2 = form_elements[1].id
    
    var column_data = {
        column_name: form_elements[0].value,
        column_details: form_elements[1].value,
    }
    form_elements[0].value = ''
    form_elements[1].value = ''

    ipcRenderer.send('save_column', column_data)
    document.getElementById('add_column').style.display = "none"
})

document.getElementById('save_card').addEventListener('click', () => {
    ipcRenderer.send('save_card')
    document.getElementById('add_card').style.display = "none"
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


ipcRenderer.on('update-board', (event, columns, cards) => {
    // need to do stuff here
    console.log('update board!')

    updateColumnsHTML(columns)
})

ipcRenderer.on('update_columns', (event, columns) => {
    // need to do stuff here
    console.log('update board!')
    updateColumnsHTML(columns)
})

function updateColumnsHTML(columns) {
    // get columns
    const column_container = document.getElementById('column_container')

    // create html string
    const column_list_items = columns.reduce((html, column) => {
        console.log(column)
        html += `<div class="column_list_element">${column.column_name}</div>`
        return html
    }, '')
    console.log(column_list_items)

    // set list html to the todo list items
    column_container.innerHTML = column_list_items
}