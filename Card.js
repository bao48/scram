class Card {
    constructor(name, details, category, due_date, column_id, create_date) {
        this.name = name || ""
        this.details = details || ""
        this.category = category || ""
        this.due_date = due_date || ""
        this.column_id = column_id || ""
        this.create_date = create_date || new Date().getTime()
    }


    createCardFromDataStore(data) {
        this.name = data.name
        this.details = data.details
        this.category = data.category
        this.due_date = data.due_date
        this.column_id = data.column_id 
        this.create_date = data.create_date

        return this
    }
}

module.exports = Card