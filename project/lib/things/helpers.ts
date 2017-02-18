const fs = require('fs');
var stackTrace = require('stack-trace');
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
    var stack = stackTrace.get();
    var callSite = getCallSite(stack);
    var lineNumber = callSite.getLineNumber();
    var fileName = callSite.getFileName();

    if (!fileCache[fileName]) {
        fileCache[fileName] = fs.readFileSync(fileName, 'utf8').match(/^.*((\r\n|\n|\r)|$)/gm);
    }

    var nameLine = fileCache[fileName][lineNumber - 1];
    var name = nameLine.split('=')[0].trim();
    name = name.split('.')[1];

    return ToLower(name);
}

export function FileName() {
    var stack = stackTrace.get();
    var callSite = getCallSite(stack);
    var lineNumber = callSite.getLineNumber();
    var fileName = callSite.getFileName();

    return fileName;
}

function getCallSite(stackLines) {
    for (var i = 0; i < stackLines.length; i++) {
        var line = stackLines[i].getFileName();
        if (line.indexOf('declarations') != -1) return stackLines[i];
    }

    return "";
}
