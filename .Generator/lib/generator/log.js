module.exports = {
    info: function (message) { log("Info", message) },
    warning: function (message) { log("Warning", message) },
    error: function (message) { log("Error", message) },
    success: function (message) { log("Success", message) }
}

function log(category, message) {
    console.log('[' + category + ']' + ' ' + message)
}