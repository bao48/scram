const Timer = require('./Timer')


class Card {
    constructor(name, details, category, due_date, column_id, create_date) {
        this.name = name || ""
        this.details = details || ""
        this.category = category || ""
        this.due_date = due_date || ""
        this.column_id = column_id || ""
        this.create_date = create_date || new Date().getTime()
        this.num = 0
        this.timers = []
        this.timeWorked = 0
    }


    createCardFromDataStore(data) {
        this.name = data.name
        this.details = data.details
        this.category = data.category
        this.due_date = data.due_date
        this.column_id = data.column_id 
        this.create_date = data.create_date
        this.num = data.num
        this.timers = this.turnArrayIntoTimers(data.timers)

        this.timeWorked = this.timers.length === 0 ? data.timeWorked : data.timeWorked + this.timers[this.timers.length - 1].diff
        return this
    }

    turnArrayIntoTimers(arr) {
        var new_arr = []
        for (var i = 0; i < arr.length; i++) {
            if (i + 1 == arr.length && arr[i].status === "ON") {
                arr[i].diff = (Math.floor(new Date().getTime()/1000)*1000 - arr[i].start)/1000
                console.log(arr[i])
            }
            new_arr.push(new Timer().createTimerFromDataStore(arr[i]))
        }
        return new_arr
    }

    startOrEndTimer() {
        var last_index = this.timers.length
        if (last_index == 0 || this.timers[last_index-1].status == "OFF") {
            return [this.addTimerToCard(), "ON", this.timeWorked]
        } else {
            var pdiff = this.timers[last_index-1].diff
            this.timers[last_index-1] = this.timers[last_index-1].stopTimer()
            this.timeWorked += this.timers[last_index-1].diff - pdiff
            return [this, "OFF", this.timeWorked]
        }
    }

    addTimerToCard() {
        var t = new Timer()
        this.timers.push(t)
        return this
    }
}

module.exports = Card