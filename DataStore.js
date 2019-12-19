'use strict'

const Store = require('electron-store')
const Column = require('./Column')
const Card = require('./Card')

class DataStore extends Store {
    constructor (settings) {
        // same as in new Store(settings)
        // to get object's parent
        super(settings)

        // initialize with todos or empty array
        
        this.columns = this.get("columns") || []
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i] = new Column().createColumnFromDataStore(this.columns[i])
        }
    }

    saveColumns() {
        // saves columns to json file
        this.set("columns", this.columns)

        // method chainings
        return this
    }

    addColumn(column_data) {
        // assume already in json-ish format
        // merge existing columns with new column
        var col = new Column().createColumnFromDataStore(column_data)
        this.columns = [...this.columns, col]
        return this.saveColumns()
    }

    addCard(card_data, column_id) {
        // assume already in json-ish format
        // merge existing cards with new card
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].getID() == column_id) {
                var card = new Card().createCardFromDataStore(card_data)
                this.columns[i].addCard(card)
            }
        }
        console.log(this.columns)
        return this.saveColumns()
    }

    deleteColumn(column_data) {
        // filter out the non target columns
        this.columns = this.columns.filter(t => t != column_data)

        return this.saveColumns()
    }

    deleteCard(card_id, column_id) {
        // filter out the non target cards
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].create_date == column_id) {
                if (this.columns[i].cards.length == 1) {
                    this.columns[i].cards = []
                    return this.saveColumns()
                } else {
                    var [revised_col, card] = this.columns[i].pop(card_id)
                    this.columns[i] = revised_col
                    return this.saveColumns()
                }
            }
        }
    }

    transferCard(start_col_id, end_col_id, card_id) {
        var end_index
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].create_date == end_col_id) {
                end_index = i
            }

            if (this.columns[i].create_date == start_col_id) {
                var [revised_col, card] = this.columns[i].pop(card_id)
                this.columns[i] = revised_col
            }
        }
        this.columns[end_index] = this.columns[end_index].addCard(card)
        return this.saveColumns()
    }

    timer(card_id, column_id) {
        // filter out the non target cards
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].create_date == column_id) {
                var [col, timerStatus, timeWorked] = this.columns[i].updateTimerStatus(card_id)
                this.columns[i] = col
                return [this.saveColumns(), timerStatus, timeWorked]
            }
        }

    }

}

module.exports = DataStore