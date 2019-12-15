'use strict'

const Store = require('electron-store')

class DataStore extends Store {
    constructor (settings) {
        // same as in new Store(settings)
        // to get object's parent
        super(settings)

        // initialize with todos or empty array
        this.columns = this.get("columns") || []
        this.cards = this.get("cards") || []
    }

    saveColumns() {
        // saves columns to json file
        this.set("columns", this.columns)

        // method chaining
        return this
    }

    saveCards() {
        // saves cards to json file
        this.set("cards", this.cards)

        // method chaining
        return this
    }

    addColumn(column_data) {
        // assume already in json-ish format
        // merge existing columns with new column
        this.columns = [...this.columns, column_data]

        return this.saveColumns()
    }

    addCards(card_data) {
        // assume already in json-ish format
        // merge existing cards with new card
        this.cards = [...this.cards, card_data]
        
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
}

module.exports = DataStore