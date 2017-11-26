var log = require("./log")

module.exports = function (startTime) {
    var now = Date.now()
    var diff = now - startTime
    seconds = Math.floor(diff * 1000) / 1000
    log.success('Gentitas finished generation in ' + seconds + ' ms')
}