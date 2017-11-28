var fs = require('fs')
var log = require("./log")
var parse = require('./parse')

module.exports = function (fullPath, generatorConfig) {
    if (!fs.existsSync(fullPath)) {
        if (generatorConfig.allFilePaths.indexOf(fullPath) != -1) { generatorConfig.allFilePaths.splice(generatorConfig.allFilePaths.indexOf(fullPath), 1) }
        log.info(fullPath + ' was deleted or moved. Removing it from file cache')
        return
    }

    generatorConfig.fileCache[fullPath] = {}
    parse(fullPath, generatorConfig.fileCache[fullPath])
}