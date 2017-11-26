module.exports = {
    info: function (message) { log("Info", message) },
    error: function (message) { log("Error", message) },
    success: function (message) { log("Success", message) }
}

function log(category, message) {
    console.log('[' + category + ']' + ' ' + message)
}