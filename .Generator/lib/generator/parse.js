var fs = require('fs')
var log = require('./log')

module.exports = function (fullPath, config) {
    var lines = fs.readFileSync(fullPath, 'utf8')
    lines = lines.replace(/\/\/.+/gm, '')
    lines = lines.replace(/\/\*([\s\S]*?)\*\//gm, '')
    lines = lines.split('\n')

    var configToPush = config;
    var collected = []
    var collectMode = false
    var collectable = ''

    var currentNamspace = ''
    var currentRealNamspace = ''
    var currentNamspaceIndex = -1
    var currentContext = ''
    var currentContextIndex = -1
    var commentMode = false

    var bracesOpened = 0

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]

        if (line.has('{')) { bracesOpened++ }
        if (line.has('}')) { bracesOpened-- }

        if (collectMode) {
            if (line.has(collectMode)) { collect(false, collectable, line) }
            else { collect(collectMode, collectable, line) }
        } else {
            if (line.has('namespace')) { collect('{', 'namespace', line) }
            else if (line.has('context') && line.has('class')) { collect('{', 'context', line) }
            else if (line.has('component')) { collect(';', 'component', line) }
            else if (line.has('group')) { collect(';', 'group', line) }
            else if (line.has('index')) { collect(';', 'index', line) }
        }

        if (!collectMode) {
            var collectedString = collected.join(' ')

            if (collectable === 'namespace') {
                parseNamespace(collectedString)
            }
            if (collectable === 'context') {
                parseContext(collectedString)
            }

            if (collectable === 'component') { parseComponent(collectedString) }
            if (collectable === 'group') { parseGroup(collectedString) }
            if (collectable === 'index') { parseIndex(collectedString) }

            collectable = ''
            collected = []
        }

        if (bracesOpened == currentNamspaceIndex - 1) {
            currentNamspace = ''
            currentRealNamspace = ''
            currentNamspaceIndex = -1
        }

        if (bracesOpened == currentContextIndex - 1) {
            currentContext = ''
            currentContextIndex = -1
        }
    }

    function collect(value, collectableValue, line) {
        if (line.has(value)) { collectMode = false }
        else { collectMode = value; }
        collectable = collectableValue;
        collected.push(line)
    }

    function parseNamespace(line) {
        currentNamspaceIndex = bracesOpened
        currentNamspace = line.matchAndGet(/namespace\s([^\)]+)\s\{/).trim()
        currentRealNamspace = currentNamspace.split('.')
        currentRealNamspace.pop()
        currentRealNamspace = currentRealNamspace.join('.')

        if (!config[currentRealNamspace]) { config[currentRealNamspace] = {} }
        if (!config[currentRealNamspace].contexts) { config[currentRealNamspace].contexts = {} }
        configToPush = config[currentRealNamspace].contexts
    }

    function parseContext(line) {
        currentContextIndex = bracesOpened
        currentContext = line.matchAndGet(/class\s([^\)]+)\s\:/).trim()

        var settings = line.matchAndGet(/\:\s([^\)]+)\s\{/)

        // Partial functionality currently is not supported on framework side.
        var isPartial = settings.has('IPartial')
        var isExtend = settings.has('IExtend<')
        var isDisableObserver = settings.has('IDisableObserver')
        var extendContextNames = []
        var extendContextInterfaces = []

        if (isExtend) {
            extendContextNames = settings.matchAndGet(/IExtend<([^>)]+)/)
            extendContextNames = extendContextNames.split(',')
            for (var i in extendContextNames) {
                var name = extendContextNames[i]
                name = name.trim()
                name = name.split('.')
                name[name.length - 1] = 'I' + name[name.length - 1]
                name = name.join('.')
                extendContextInterfaces[i] = name
            }
        }

        if (!config[currentRealNamspace].contexts[currentContext]) config[currentRealNamspace].contexts[currentContext] = {
            name: currentContext,
            settings: { isPartial: isPartial, isExtend: isExtend, extendContextNames: extendContextNames, extendContextInterfaces: extendContextInterfaces, isDisableObserver: isDisableObserver },
            components: {}, flagComponents: {}, valueComponents: {}, universalComponents: {},
            groups: {}, singleGroups: {}, multiGroups: {},
            indexes: {},
            namespace: currentNamspace,
            realNamespace: currentRealNamspace
        }

        configToPush = config[currentRealNamspace].contexts[currentContext]
    }

    function parseComponent(line) {
        var componentWholeData = line.matchAndGet(/var\s+([^\;]+)/)
        var name = componentWholeData.matchAndGet(/(.+)=/).trim()
        var componentData = componentWholeData.matchAndGet(/=(.+)/).trim()
        var type = componentData.has('<') ? componentData.matchAndGet(/<(.+)>/).trim() : ''

        var isGroupSingle = componentData.has('.GroupSingle')
        var isGroup = !isGroupSingle && componentData.has('.Group')
        var isUniversal = componentData.has('.Universal')
        var isIndex = componentData.has('.Index')

        if (!checkIfNameIsKeyword(name)) { return }

        var component = {
            name: name,
            type: type,
            isGroupSingle: isGroupSingle,
            isGroup: isGroup,
            isUniversal: isUniversal,
            isIndex: isIndex,
            namespace: currentNamspace,
            realNamespace: currentRealNamspace,
            contextName: currentContext
        }

        if (isGroup || isGroupSingle) {
            var matcher = { all: [name] }

            var group = {
                name: name,
                type: type,
                isSingle: isGroupSingle,
                matcher: matcher,
                namespace: currentNamspace,
                realNamespace: currentRealNamspace
            }

            configToPush.groups[name] = group
            if (isGroupSingle) configToPush.singleGroups[name] = group
            else configToPush.multiGroups[name] = group
        }

        if (isIndex) {
            var index = {
                name: name,
                type: type,
                valueComponentName: name,
                flagComponentNames: [],
                namespace: currentNamspace,
                realNamespace: currentRealNamspace
            }

            configToPush.indexes[name] = index
        }

        configToPush.components[name] = component
        if (isUniversal) { configToPush.universalComponents[name] = component }
        if (!type) { configToPush.flagComponents[name] = component }
        else { configToPush.valueComponents[name] = component }
    }

    function parseGroup(line) {
        var groupWholeData = line.matchAndGet(/var\s+([^\;]+)/)
        var name = groupWholeData.matchAndGet(/(.+)=/).trim()
        var groupData = groupWholeData.matchAndGet(/=(.+)/).trim()
        var matcher = ''

        if (groupData) {
            matcher = groupData.matchAndGet(/Matcher(\s?.+(\)))/)
            matcher = matcher.substring(0, matcher.length - 1)
            matcher = matcher.split('.')
            matcher.splice(0, 1)

            var all, any, none

            for (var key of matcher) {
                if (key.toLowerCase().has('all')) all = key.matchAndGet(/.+\((.+)\)/)
                else if (key.toLowerCase().has('none')) none = key.matchAndGet(/.+\((.+)\)/)
                else if (key.toLowerCase().has('any')) any = key.matchAndGet(/.+\((.+)\)/)
            }

            if (all) {
                all = all.split(',')
                for (var i in all) { all[i] = all[i].trim() }
            }
            if (none) {
                none = none.split(',')
                for (var i in none) { none[i] = none[i].trim() }
            }
            if (any) {
                any = any.split(',')
                for (var i in any) { any[i] = any[i].trim() }
            }

            matcher = { all: all, none: none, any: any }
        }

        var isGroupSingle = groupData.has('.Single')

        var group = {
            name: name,
            isSingle: isGroupSingle,
            matcher: matcher,
            namespace: currentNamspace,
            realNamespace: currentRealNamspace
        }

        configToPush.groups[name] = group
        if (isGroupSingle) { configToPush.singleGroups[name] = group }
        else { configToPush.multiGroups[name] = group }
    }

    function parseIndex(line) {
        var indexWholeData = line.matchAndGet(/var\s+([^\;]+)/)
        var name = indexWholeData.matchAndGet(/(.+)=/).trim()
        var indexData = indexWholeData.matchAndGet(/=(.+)/).trim()
        var indexDataComponents = indexData.matchAndGet(/Index(\s?.+(\)))/)
        indexDataComponents = indexDataComponents.matchAndGet(/\((.+)\)/)
        indexDataComponents = indexDataComponents.split(',')

        for (var i in indexDataComponents) { indexDataComponents[i] = indexDataComponents[i].trim() }

        var valueComponentName = indexDataComponents.splice(0, 1)[0]
        var flagComponentNames = indexDataComponents
        var type = ''

        var index = {
            name: name,
            type: type,
            valueComponentName: valueComponentName,
            flagComponentNames: flagComponentNames,
            namespace: currentNamspace,
            realNamespace: currentRealNamspace
        }

        configToPush.indexes[name] = index
    }
}

function checkIfNameIsKeyword(name) {
    if (name.toLowerCase() == 'event') {
        showError()
        return false
    }

    function showError() {
        log.error('You can not use reserved C# keyword as a name for component, group or index: ' + name)
    }

    return true
}