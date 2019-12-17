'use strict'

const { ipcRenderer } = require('electron')


// create and add new_board btn
// ipcMain in main.js recieves this
ipcRenderer.on('main_window_ready', (event) => {
    var card_btn = document.getElementsByClassName('add_card_btn')
    for (var i = 0; i < card_btn.length; i++) {
        card_btn[i].addEventListener('click', () => {
            ipcRenderer.send('new_card')
        })
    }
})

// create and add new_column btn
// ipcMain in main.js recieves this
document.getElementById('new_column').addEventListener('click', () => {
    ipcRenderer.send('new_column')
})

document.getElementById('save_column').addEventListener('click', () => {

    var form_elements = document.forms["column-inputs"].elements
    
    var column_data = {
        name: form_elements[0].value,
        details: form_elements[1].value,
        create_date: new Date().getTime(),

    }
    form_elements[0].value = ''
    form_elements[1].value = ''

    ipcRenderer.send('save_column', column_data)
    document.getElementById('add_column').style.display = "none"
})

document.getElementById('save_card').addEventListener('click', () => {

    var form_elements = document.forms["card-inputs"].elements
    
    var card_data = {
        name: form_elements[0].value,
        details: form_elements[1].value,
        details: form_elements[2].value,
        due_date: form_elements[3].value,
        create_date: new Date().getTime(),
    }
    form_elements[0].value = ''
    form_elements[1].value = ''
    form_elements[2].value = ''
    form_elements[3].value = ''

    ipcRenderer.send('save_card', card_data)
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
    updateColumnsHTML(columns)
})

ipcRenderer.on('update_cards', (event, columns) => {
    // need to do stuff here
    updateCardsHTML(columns)
})

function updateColumnsHTML(columns) {


    // get columns
    const column_container = document.getElementById('column_container')

    // create html string
    const column_list_items = columns.reduce((html, column) => {
        html += `<div class="column_list_element" id="${column.create_date}">${column.column_name}
                <span class="add_card_btn" id="${column.create_date}_btn">+</span>
                </div>`
        return html
    }, '')

    document.getElementsByTagName("BODY")[0].style.width = columns.length * 310 + 'px'


    // set list html to the todo list items
    column_container.innerHTML = column_list_items
}


function updateCardsHTML(cards) {
    console.log(':)')
}
