class Timer {

    constructor(start, end, status) {
        // start and end times are in ms
        // diff is in s
        this.start = start || Math.floor(new Date().getTime()/1000)*1000
        this.end = end || ""

        this.status = (this.end === "") ? "ON": "OFF"

        this.diff = (this.status === "OFF") ? (this.end - this.start)/1000 :  (Math.floor(new Date().getTime()/1000)*1000 - this.start)/1000
    }

    stopTimer() {
        this.end = Math.floor(new Date().getTime()/1000)*1000
        return this.updateStatusAndTime()
    }


    updateStatusAndTime() {
        this.status = (this.end === "") ? "ON": "OFF"
        this.diff = (this.status === "OFF") ? (this.end - this.start)/1000 : (Math.floor(new Date().getTime()/1000)*1000 - this.start)/1000
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