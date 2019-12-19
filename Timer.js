class Timer {

    constructor(start, end, status) {
        this.start = start || new Date().getTime()
        this.end = end || ""

        this.status = (this.end === "") ? "ON": "OFF"

        this.diff = (this.status === "OFF") ? (this.end - this.start)/1000 : 0
    }

    stopTimer() {
        this.end = new Date().getTime()
        return this.updateStatusAndTime()
    }


    updateStatusAndTime() {
        this.status = (this.end === "") ? "ON": "OFF"
        this.diff = (this.status === "OFF") ? (this.end - this.start)/1000 : 0
        return this
    }

    createTimerFromDataStore(data) {
        this.start = data.start
        this.end = data.end
        this.status = data.status
        this.diff = data.diff
        return this
    }

}

module.exports = Timer