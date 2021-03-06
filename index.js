'use strict'

const { ipcRenderer } = require('electron')
const Column = require('./Column')
const Card = require('./Card')


// create and add new_board btn
// ipcMain in main.js recieves this
ipcRenderer.on('main_window_ready', (event) => {
    console.log("main window ready")
})

// create and add new_column btn
// ipcMain in main.js recieves this
document.getElementById('new_column').addEventListener('click', () => {
    document.getElementById("add_column").style.display = "block"
})

document.getElementById('save_column').addEventListener('click', () => {

    var form_elements = document.forms["column-inputs"].elements

    var col = new Column(form_elements[0].value, form_elements[1].value)
    
    form_elements[0].value = ''
    form_elements[1].value = ''

    ipcRenderer.send('save_column', col)

    addNewColumn(col)

    document.getElementById('add_column').style.display = "none"
})

document.getElementById('save_card').addEventListener('click', saveCardFunc)

function saveCardFunc() {
    console.log("save card!")

    var form_elements = document.forms["card-inputs"].elements
    var column_id = document.getElementById("add_card").title
    column_id = parseInt(column_id.substring(0, column_id.length-4))

    console.log("col_id", column_id)

    var card_data = new Card(form_elements[0].value, form_elements[1].value, form_elements[2].value, form_elements[3].value, column_id)

    form_elements[0].value = ''
    form_elements[1].value = ''
    form_elements[2].value = ''
    form_elements[3].value = ''

    ipcRenderer.send('save_card', card_data, column_id)

    addNewCard(card_data, column_id)

    document.getElementById('add_card').style.display = "none"
}

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

ipcRenderer.on('new_card', (event, column_id) => {
    document.getElementById("add_card").style.display = "block"
    document.getElementById("add_card").title = column_id
})

ipcRenderer.on('update_columns', (event, columns) => {
    // need to do stuff here
    updateColumnsHTML(columns)
})

ipcRenderer.on('card_info', (event, card) => {
    console.log(card)

    var form_elements = document.forms["card-inputs"].elements
    form_elements[0].value = card.name
    form_elements[1].value = card.details
    form_elements[2].value = card.category
    form_elements[3].value = card.due_date

    document.getElementById("add_card").title = card.column_id + "_" + card.create_date + "_btn"

    document.getElementById("add_card").style.display = "block"
})

ipcRenderer.on('update_timer', (event, card_id, timer_status, time_worked) => {
    const card_container = document.getElementById(card_id).getElementsByClassName("timer")[0]
    const orig_color = card_container.getElementsByClassName("time_spent")[0].parentNode.style.color
    card_container.getElementsByClassName("time_spent")[0].style.color = "#ff0000"
    var spent = time_worked
    if (timer_status === "ON") {
        card_container.getElementsByClassName("time_spent")[0].style.color = "#ff0000"
        var timerId = setInterval(function() {
            console.log(spent)
            card_container.getElementsByClassName("time_spent")[0].innerHTML = formatTime(spent)
            spent += 1
        }, 1000)
        card_container.id = timerId
    } else {
        clearInterval(card_container.id)
        card_container.getElementsByClassName("time_spent")[0].style.color = orig_color
    }
    
})

function updateTimerCardReloaded(card_id, timer_status, time_worked) {
    console.log(" card_id " + card_id)
    
    const card_container = document.getElementById(card_id).getElementsByClassName("timer")[0]
    const orig_color = card_container.getElementsByClassName("time_spent")[0].parentNode.style.color
    card_container.getElementsByClassName("time_spent")[0].style.color = "#ff0000"

    var spent = time_worked
    if (timer_status === "ON") {
        var timerId = setInterval(function() {
            console.log(spent)
            card_container.getElementsByClassName("time_spent")[0].innerHTML = formatTime(spent)
            spent += 1
        }, 1000)
        card_container.id = timerId
    } else {
        clearInterval(card_container.id)
        card_container.getElementsByClassName("time_spent")[0].style.color = orig_color
    }
    
}

function addNewColumn(column_data) {
    const column_container = document.getElementById('column_container')

    column_container.innerHTML += `<div class="column_list_element">
    <div class="column_header"><span class="column_name">${column_data.name}</span>
    <span class="add_card_btn" id="${column_data.create_date}_btn">+</span></div>
    <div class="card_list_container" id="${column_data.create_date}"></div>
    </div>`

    var w = document.getElementsByTagName("BODY")[0].style.width
    document.getElementsByTagName("BODY")[0].style.width = parseInt(w.substring(0, w.length-2)) + 500 + 'px'

    // update all eventlisteners bc DOM changed
    updateManualBtns()
}


function addNewCard(card_data, column_id) {

    const card_container = document.getElementById(column_id)

    card_container.innerHTML += `<div class="card_box" draggable="true" id="${card_data.create_date}">
    <div class="card_name"><h4>${card_data.name}</h4></div>
    <div class="card_detail">${card_data.details}</div>
    <div class="card_cat">${card_data.category}</div>
    <div class="card_due">${card_data.due_date}</div>
    <span class="edit_card"><a>edit</a></span>\t
    <span class="remove_card"><a>remove</a></span>\t
    <span class="timer"><a>spent: <span class="time_spent">0</span></a></span>
    </div>`

    // update all eventlisteners bc DOM changed
    updateManualBtns()

}

function updateColumnsHTML(columns) {
    // get columns
    const column_container = document.getElementById('column_container')

    var timerStartNeeded = []

    // create html string
    const column_list_items = columns.reduce((html, column) => {

        var h = ''

        for (var i = 0; i < column.cards.length; i++) {
            h += `<div class="card_box" draggable="true" id="${column.cards[i].create_date}">
            <div class="card_name"><h4>${column.cards[i].name}</h4></div>
            <div class="card_detail">${column.cards[i].details}</div>
            <div class="card_cat">${column.cards[i].category}</div>
            <div class="card_due">${column.cards[i].due_date}</div>
            <span class="edit_card"><a>edit</a></span>\t
            <span class="remove_card"><a>remove</a></span>\t
            <span class="timer"><a>spent: <span class="time_spent">${formatTime(column.cards[i].timeWorked)}</span></a></span>
            </div>`
            console.log("timer length " + column.cards[i].timers.length)
            console.log("createdate " + column.cards[i].create_date)

            if (column.cards[i].timers.length > 0 && column.cards[i].timers[column.cards[i].timers.length-1].status === "ON") {
                timerStartNeeded.push([column.cards[i].create_date, column.cards[i].timers[column.cards[i].timers.length-1].status, column.cards[i].timeWorked])
            }
        }

        html += `<div class="column_list_element">
                    <div class="column_header"><span class="column_name">${column.name}</span>
                    <span class="add_card_btn" id="${column.create_date}_btn">+</span></div>
                    <div class="card_list_container" id="${column.create_date}">
                    ${h}
                    </div>
                </div>`
        return html
    }, '')

    if (columns.length !== 0) {
        document.getElementsByTagName("BODY")[0].style.width = columns.length * 315 + 20 + 'px'
    }

    // set list html to the todo list items
    column_container.innerHTML = column_list_items

    for (var i = 0; i < timerStartNeeded.length; i++) {
        updateTimerCardReloaded(timerStartNeeded[i][0], timerStartNeeded[i][1], timerStartNeeded[i][2])
    }

    updateManualBtns()
}

function formatTime(sec) {
    var min = Math.floor(sec / 60)

    if (min < 1) {
        return sec + "s"
    }
    sec %= 60
    
    var hr = Math.floor(min / 60)
    if (hr < 1) {
        return min + "m" + sec + "s"
    }
    min %= 60

    return hr + "h" + min + "m" + sec + "s"
}

function updateManualBtns() {

    // draggable function
    var col_boxes = document.getElementsByClassName("column_list_element")
    for (var i = 0; i < col_boxes.length; i++) {
        updateColumnDragEffect(col_boxes[i])
    }

    // draggable function continued
    var card_boxes = document.getElementsByClassName("card_box")
    for (var i = 0; i < card_boxes.length; i++) {
        updateCardDragEffect(card_boxes[i])
    }

    // add event listeners to + sign
    var a_card_btn = document.getElementsByClassName('add_card_btn')
    for (var i = 0; i < a_card_btn.length; i++) {
        updateAddCardBtnInColumn(a_card_btn[i])
    }

    // add event listeners to "remove" btn in card
    var d_card_btn = document.getElementsByClassName("remove_card")
    for (var i = 0; i < d_card_btn.length; i++) {
        updateRemoveCardBtnInCard(d_card_btn[i])
    }

    // add event listener to timer
    var card_timers = document.getElementsByClassName("timer") 
    for (var i = 0; i < card_timers.length; i++) {
        updateTimerBtnInCard(card_timers[i])
    }

    // add event listener to edit
    var card_edit = document.getElementsByClassName("edit_card")
    for (var i = 0; i < card_edit.length; i++) {
        updateEditBtnInCard(card_edit[i])
    }
}

// updating all the btns
function updateColumnDragEffect(elem) {
    elem.ondragover = (event) => {
        event.preventDefault()
    }

    elem.ondrop = (event) => {
        event.preventDefault()

        var data = event.dataTransfer.getData("text")
        console.log("dataaaaa")
        console.log(data)

        var child = document.getElementById(data)
        var child_parent = document.getElementById(data).parentNode

        console.log("child " + child.id)
        console.log("child_parent " + child_parent.id)
        console.log("child_parent " + child_parent.parentNode.id)

        var newtarget = event.target
        console.log(event)
        console.log(newtarget)

        while (newtarget.className !== "card_list_container") {
            // if dropped in the box, will need child nodes
            if (newtarget.className === 'column_list_element') {
                newtarget = newtarget.childNodes[3]
            } else {
                newtarget = newtarget.parentNode
            }
        }

        // check if user actually moved box to another column
        if (child_parent.id != newtarget.id) {
            document.getElementById(data).remove()
            newtarget.appendChild(child)
            ipcRenderer.send('transfer_card', child_parent.id, newtarget .id, data)
        }
    }
}

function updateCardDragEffect(elem) {
    elem.ondragstart = (event) => {
        event.dataTransfer.setData("text", event.target.id)
        console.log(event.target.id)
    }
}

function updateAddCardBtnInColumn(elem) {
    elem.addEventListener('click', (e) => {
        console.log("new card")
        ipcRenderer.send('new_card', e.target.id)
    })
}

function updateRemoveCardBtnInCard(elem) {
    elem.addEventListener('click', (e) => {
        // card id          e.target.parentNode.parentNode.id
        // column id        e.target.parentNode.parentNode.parentNode.id
        var node = e.target
        while (!node.id || !node.parentNode.id || node.id.length !== node.parentNode.id.length) {
            node = node.parentNode
        }
        ipcRenderer.send('del_card', node.id, node.parentNode.id)
        document.getElementById(node.id).remove() 
    })
}

function updateTimerBtnInCard(elem) {
    elem.addEventListener('click', (e) => {
        // start id         e.target.id
        // card id          e.target.parentNode.parentNode.id
        // column id        e.target.parentNode.parentNode.parentNode.id

        var node = e.target
        while (!node.id || !node.parentNode.id || node.id.length !== node.parentNode.id.length) {
            node = node.parentNode
        }
        ipcRenderer.send('timer', node.id, node.parentNode.id)
    })
}

function updateEditBtnInCard(elem) {
    elem.addEventListener('click', (e) => {
        var node = e.target
        while (!node.id || !node.parentNode.id || node.id.length !== node.parentNode.id.length) {
            node = node.parentNode
        }
        ipcRenderer.send('edit_card', node.id, node.parentNode.id)

        document.getElementById("save_card").removeEventListener('click', saveCardFunc)

        document.getElementById("save_card").id = "save_edit_card"

        document.getElementById("save_edit_card").addEventListener('click', () => {
            var form_elements = document.forms["card-inputs"].elements

            console.log("form elements")

            console.log(form_elements)


            var ids = document.getElementById("add_card").title
            ids = ids.substring(0, ids.length-4)
            var column_id = parseInt(ids.substring(0, parseInt(ids.length/2)))
            var card_id = parseInt(ids.substring(parseInt(ids.length/2)+1, ids.length))
        
            console.log("col_id", column_id)
        
            var card_data = new Card(form_elements[0].value, form_elements[1].value, form_elements[2].value, form_elements[3].value, column_id, card_id)
            console.log(card_data)

            form_elements[0].value = ''
            form_elements[1].value = ''
            form_elements[2].value = ''
            form_elements[3].value = ''
        

            ipcRenderer.send('edit_card_file', card_data)
        
            editOldCard(card_data)
        
            document.getElementById('add_card').style.display = "none"
        })
    })
}

function editOldCard(card_data) {
    console.log(card_data)
    var card_container = document.getElementById(card_data.create_date)
    console.log(card_container.innerHTML)

    card_container.innerHTML = `
    <div class="card_name"><h4>${card_data.name}</h4></div>
    <div class="card_detail">${card_data.details}</div>
    <div class="card_cat">${card_data.category}</div>
    <div class="card_due">${card_data.due_date}</div>
    <span class="edit_card"><a>edit</a></span>\t
    <span class="remove_card"><a>remove</a></span>\t
    <span class="timer"><a>spent: <span class="time_spent">0</span></a></span>`
}