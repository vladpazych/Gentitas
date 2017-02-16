const fs = require('fs');
import toUpper from '../helpers/toUpper';
import toLower from '../helpers/toLower';

// 
// Name
// 
var fileCache = {}

export function ToUpper(value: string) {
    return toUpper(value);
}

export function ToLower(value: string) {
    return toLower(value);
}

export function Name() {
    var stack = new Error().stack;
    var stackLines = stack.match(/[^\r\n]+/g);
    var fileLine = getDataFileLine(stackLines);
    var fileNameAndLine = fileLine.split('(')
    fileNameAndLine = fileNameAndLine[fileNameAndLine.length - 1]
    fileNameAndLine = fileNameAndLine.split(':');
    var lineNumber = parseInt(fileNameAndLine[1]);
    var fileName = fileNameAndLine[0];

    if (!fileCache[fileName]) {
        fileCache[fileName] = fs.readFileSync(fileName, 'utf8').match(/^.*((\r\n|\n|\r)|$)/gm);
    }

    var nameLine = fileCache[fileName][lineNumber - 1];
    var name = nameLine.split('=')[0].trim();
    name = name.split('.')[1];

    return ToLower(name);
}

export function FileName() {
    var stack = new Error().stack;
    var stackLines = stack.match(/[^\r\n]+/g);
    var fileLine = getDataFileLine(stackLines);
    var fileNameAndLine = fileLine.split('(')
    fileNameAndLine = fileNameAndLine[fileNameAndLine.length - 1]
    fileNameAndLine = fileNameAndLine.split(':');
    var lineNumber = parseInt(fileNameAndLine[1]);
    var fileName = fileNameAndLine[0];
    fileName = fileName.split('/');
    fileName = fileName.slice(fileName.length - 1);
    fileName = fileName[0].split('.');
    fileName = fileName[0]

    return fileName;
}

function getDataFileLine(stackLines) {
    for (var i = 0; i < stackLines.length; i++) {
        var line = stackLines[i];
        if (line.indexOf('declarations') != -1) return line;
    }

    return "";
}
