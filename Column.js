
const Card = require('./Card')
const Timer = require('./Timer')


class Column {
    constructor(name, details, create_date, cards) {
        this.name = name || ''
        this.details = details || ''
        this.create_date = create_date || new Date().getTime()
        this.cards = cards || []
        this.num = 0
    }

    addCard(card) {
        this.cards.push(card)

        return this
    }

    getID () {
        return this.create_date
    }

    createColumnFromDataStore(data) {
        this.name = data.name
        this.details = data.details
        this.create_date = data.create_date
        this.cards = this.turnArrayIntoCards(data.cards)

        return this
    }

    turnArrayIntoCards(arr) {
        var new_arr = []
        for (var i = 0; i < arr.length; i++) {
            new_arr[i] = new Card().createCardFromDataStore(arr[i])
        }
        return new_arr
    }

    pop(card_id) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].create_date == card_id) {
                var card = this.cards.splice(i, 1)[0]
                return [this, card]
            }
        }
    }

    updateTimerStatus(card_id) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].create_date == card_id) {
                var [card, status, timeWorked] = this.cards[i].startOrEndTimer()
                this.cards[i] = card
                return [this, status, timeWorked]
            }
        }
    }
}

module.exports = Column