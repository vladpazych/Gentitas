var fs = require('fs')

module.exports = function (outputPath, outputContent) {
    return new Promise(function (fulfill, reject) {
        fs.writeFile(outputPath, outputContent, { flag: 'w' }, function (err) {
            if (err) { reject(err) }
            else { fulfill() }
        })
    })
}