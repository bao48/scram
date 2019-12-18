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
        console.log(this.columns)
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
        this.columns = [...this.columns, column_data]

        return this.saveColumns()
    }

    addCard(card_data, column_id) {
        // assume already in json-ish format
        // merge existing cards with new card
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].getID() == column_id) {
                this.columns[i].addCard(card_data)
            }
        }
        
        return this.saveColumns()
    }

    deleteColumn(column_data) {
        // filter out the non target columns
        this.columns = this.columns.filter(t => t != column_data)

        return this.saveColumns()
    }

    deleteCards(card_data) {
        // filter out the non target cards
        this.cards = this.cards.filter(t => t != card_data)

        return this.saveCards()
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
}

module.exports = DataStore