'use strict'

const { ipcRenderer } = require('electron')
const Column = require('./Column')
const Card = require('./Card')


// create and add new_board btn
// ipcMain in main.js recieves this
ipcRenderer.on('main_window_ready', (event) => {
    updateManualBtns()
})

// create and add new_column btn
// ipcMain in main.js recieves this
document.getElementById('new_column').addEventListener('click', () => {
    ipcRenderer.send('new_column')
})

document.getElementById('save_column').addEventListener('click', () => {

    var form_elements = document.forms["column-inputs"].elements

    var col = new Column(form_elements[0].value, form_elements[1].value)
    
    form_elements[0].value = ''
    form_elements[1].value = ''

    ipcRenderer.send('save_column', col)
    document.getElementById('add_column').style.display = "none"
})

document.getElementById('save_card').addEventListener('click', () => {

    var form_elements = document.forms["card-inputs"].elements
    var column_id = document.getElementById("add_card").title
    column_id = parseInt(column_id.substring(0, column_id.length-4))

    console.log("colid", column_id)

    var card_data = new Card(form_elements[0].value, form_elements[1].value, form_elements[2].value, form_elements[3].value, column_id)

    form_elements[0].value = ''
    form_elements[1].value = ''
    form_elements[2].value = ''
    form_elements[3].value = ''

    ipcRenderer.send('save_card', card_data, column_id)
    document.getElementById('add_card').style.display = "none"
})

document.getElementById('add_column').addEventListener('click', (e) => {
    var isClickInside = document.getElementById('col_overlay_inner_box').contains(e.target)
    if (!isClickInside) {
        document.getElementById('add_column').style.display = "none"
    }
})

document.getElementById('add_card').addEventListener('click', (e) => {
    var isClickInside = document.getElementById('card_overlay_inner_box').contains(e.target)
    if (!isClickInside) {
        document.getElementById('add_card').style.display = "none"
    }
})

ipcRenderer.on('new_column', (event) => {
    document.getElementById("add_column").style.display = "block"
})

ipcRenderer.on('new_card', (event, column_id) => {
    document.getElementById("add_card").style.display = "block"
    document.getElementById("add_card").title = column_id
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

function updateColumnsHTML(columns) {
    // get columns
    const column_container = document.getElementById('column_container')

    // create html string
    const column_list_items = columns.reduce((html, column) => {

        var h = ''

        for (var i = 0; i < column.cards.length; i++) {
            h += `<div class="card_box" id="${column.cards[i].create_date}">
            <div class="card_name"><h4>${column.cards[i].name}</h4></div>
            <div class="card_detail">${column.cards[i].details}</div>
            <div class="card_cat">${column.cards[i].category}</div>
            <div class="card_due">${column.cards[i].due_date}</div>
            </div>`
        }

        html += `<div class="column_list_element" id="${column.create_date}">
                    <span class="column_name">${column.name}</span>
                    <span class="add_card_btn" id="${column.create_date}_btn">+</span>
                    <span class="del_card_btn" id="${column.create_date}_btn">-</span>
                    ${h}
                </div>`
        return html
    }, '')

    if (columns.length != 0) {
        document.getElementsByTagName("BODY")[0].style.width = columns.length * 315 + 'px'
    }

    // set list html to the todo list items
    column_container.innerHTML = column_list_items

    updateManualBtns()
}


function updateManualBtns() {
    var a_card_btn = document.getElementsByClassName('add_card_btn')
    var d_card_btn = document.getElementsByClassName('del_card_btn')
    for (var i = 0; i < a_card_btn.length; i++) {
        console.log(a_card_btn[i])
        console.log(a_card_btn[i].id)
        a_card_btn[i].addEventListener('click', (e) => {
            ipcRenderer.send('new_card', e.target.id)
        })
        d_card_btn[i].addEventListener('click', (e) => {
            // this needs to be finished
            console.log('del')
            ipcRenderer.send('del_card', e.target.id)
        })
    }
}