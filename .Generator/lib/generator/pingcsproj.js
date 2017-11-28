var fs = require('fs')
var path = require('path')
var log = require('./log')

module.exports = function (csprojdir, outputSaveword, callback) {
    if (csprojdir) {
        fs.readdirSync(path.resolve(csprojdir)).forEach(filename => {
            if (filename.indexOf('.csproj') != -1) {
                pingcsproj(path.resolve(csprojdir, filename), outputSaveword)
            }
        })
    }

    callback()
}

function pingcsproj(filename, outputSaveword) {
    var csprojFile = fs.readFileSync(filename, 'utf8')
    var csprojPath = filename

    var csprojLines = csprojFile.match(/[^\r\n]+/g)
    var csprojLinesOld = csprojFile.match(/[^\r\n]+/g)

    for (var i in csprojLines) {
        var line = csprojLines[i]
        
        if (line.indexOf(outputSaveword) !== -1 && line.indexOf('<!-- GentitasPing') === -1) {
            csprojLines[i] = '<!-- GentitasPing' + line + 'GentitasPing -->'
        }

        if (line.indexOf(outputSaveword) !== -1 && line.indexOf('<!-- GentitasPing') !== -1 &&
            line.indexOf(outputSaveword) !== -1 && line.indexOf('GentitasPing -->') !== -1) {
            csprojLinesOld[i] = csprojLinesOld[i].replace("<!-- GentitasPing", "")
            csprojLinesOld[i] = csprojLinesOld[i].replace("GentitasPing -->", "")
        }
    }

    var csprojFileUpdated = csprojLines.join('\n')
    var csprojFileOld = csprojLinesOld.join('\n')

    fs.writeFile(csprojPath, csprojFileUpdated, function () {
        setTimeout(function () {
            fs.writeFile(csprojPath, csprojFileOld, function () {

            })
        }, 2100);
    })
}