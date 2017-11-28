var fs = require('fs')
var path = require('path')

module.exports = function getAllFiles (directory, filelist, excepthEnding) {
    var allFiles = fs.readdirSync(directory)
    filelist = filelist || []

    allFiles.forEach(function (file) {
        if (fs.statSync(path.join(directory, file)).isDirectory()) {
            filelist = getAllFiles(path.join(directory, file), filelist, excepthEnding)
        }
        else {
            if (excepthEnding) {
                if (file.indexOf(excepthEnding) == -1) {
                    filelist.push(path.join(directory, file))
                }
            } else {
                filelist.push(path.join(directory, file))
            }
        }
    })

    return filelist
}