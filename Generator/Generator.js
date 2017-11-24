var fs = require('fs')
var fse = require('fs-extra')
var fsWalk = require('fs-walk')
var path = require('path')
var nodeWatch = require('node-watch')
var Handlebars = require('handlebars')
var errors = require('prettified').errors

var helpers = {}
helpers.toLower = require('./Helpers/ToLower')
helpers.toUpper = require('./Helpers/ToUpper')
helpers.ifCond = require('./Helpers/IfCond')
helpers.len = require('./Helpers/Len')
helpers.global = require('./Helpers/Global')

// Require for side-effects
require('./extensions')

try {
  // Create rootDir depending on current environment - nexe or node
  var rootDir = ''
  if (__dirname == 'Generator' && process.argv[0]) rootDir = path.resolve(process.argv[0], '../')
  if (!rootDir) rootDir = path.resolve(__dirname)

  var config = JSON.parse(fse.readFileSync(path.resolve(rootDir, '../Config/Config.json'), 'utf8'))
  var localConfig = {}

  if (fse.existsSync(path.resolve(rootDir, '../Config/ConfigLocal.json'))) {
    localConfig = JSON.parse(fse.readFileSync(path.resolve(rootDir, '../Config/ConfigLocal.json'), 'utf8'))
  }

  var outputDirectory = config.outputDirectory
  var scanDirectory = config.scanDirectory
  var csprojDirectory = localConfig ? localConfig.csprojDirectory : ''

  if (!outputDirectory) console.error('[Config Error] Config "Config/Config.json" must have "outputDirectory" field. It should be set relative to "gentitas.js". Default is "../Assets/Generated"')
  if (!scanDirectory) console.error('[Config Error] Config "Config/Config.json" must have "scanDirectory" field. It should be set relative to "gentitas.js". Default is "../Assets"')

  if (!scanDirectory) scanDirectory = '../Assets'
  if (!outputDirectory) outputDirectory = '../' + scanDirectory + '/Generated'

  scanDirectory = path.join(rootDir, scanDirectory)
  outputDirectory = path.join(rootDir, outputDirectory)

  var outputSaveword = 'Generated'

  var templatesPath = path.join(rootDir, '../Templates')

  var files = config.files
  var fileLength = Object.keys(files).length
  var writingFile = 0

  var compiledTemplates = {}
  var allFilePaths = []
  var fileCache = {}
  var partialContextsCache = {}
  var generationConfig = {}

  var cachedConfig = {}

  compileTemplates(function () {
    var startTime = Date.now()

    fsWalk.walkSync(scanDirectory, function (basedir, filename, stat, next) {
      var extname = path.extname(filename)
      if (extname != '.cs' || (filename.toLowerCase().indexOf('.gentitas.cs') == -1)) return
      var fullPath = path.resolve(basedir, filename)
      if (allFilePaths.indexOf(fullPath) == -1) allFilePaths.push(fullPath)
      refreshFileCache(fullPath)
    })

    createGenerationConfig()
    generate(function () {
      pingAllCsprogFiles(function () { reportTime(startTime) })
    })

    // Watch gentitas files
    nodeWatch(scanDirectory, { recursive: true, filter: /\.(gentitas.cs|Gentitas.cs)$/ }, function (evt, inPath) {
      startTime = Date.now()
      var fullPath = path.resolve(inPath)
      if (allFilePaths.indexOf(fullPath) == -1) allFilePaths.push(fullPath)
      refreshFileCache(fullPath)
      createGenerationConfig()
      generate(function () {
        pingAllCsprogFiles(function () { reportTime(startTime) })
      })
    })

    // Watch templates
    nodeWatch(templatesPath, { recursive: true, filter: /\.hbs$/ }, function (evt, inPath) {
      var startTime = Date.now()
      compileTemplates(function () {
        for (var fullPath of allFilePaths) {
          refreshFileCache(fullPath)
        }
        createGenerationConfig()
        generate(function () {
          pingAllCsprogFiles(function () { reportTime(startTime) })
        })
      })
    })
  })

  function reportTime(ms) {
    var now = Date.now()
    var diff = now - ms
    seconds = Math.floor(diff * 1000) / 1000
    console.log('[Generated] Gentitas finished generation in ' + seconds + ' ms')
  }

  // Create file cache
  function refreshFileCache(fullPath) {
    if (!fs.existsSync(fullPath)) {
      if (allFilePaths.indexOf(fullPath) != -1) allFilePaths.splice(allFilePaths.indexOf(fullPath), 1)
      console.log('[Info] Removing ' + fullPath + ' from file cache')
      return
    }

    fileCache[fullPath] = {}
    parseFile(fullPath, fileCache[fullPath])
  }

  function createGenerationConfig() {
    generationConfig = {}
    partialContextsCache = {}

    for (var key in fileCache) {
      mergeObject(generationConfig, fileCache[key])
    }

    for (var namespace in generationConfig) {
      var namespaceConfig = generationConfig[namespace]

      if (namespaceConfig.contexts) {
        for (var contextName in namespaceConfig.contexts) {

          var context = namespaceConfig.contexts[contextName]

          if (context.settings.isPartial) partialContextsCache[context.namespace + '.' + contextName] = context
          if (context.indexes) {
            for (var indexName in context.indexes) {
              var index = context.indexes[indexName]
              if (!index.type) index.type = context.components[index.valueComponentName].type
            }
          }

          if (context.universalComponents) {
            if (!namespaceConfig.universalComponents) namespaceConfig.universalComponents = {}

            var universalConfig = namespaceConfig.universalComponents

            for (var componentName in context.universalComponents) {
              var component = context.universalComponents[componentName]

              if (universalConfig[component.name] && universalConfig[component.name].type != component.type) {
                var compType = component.type
                var ucompType = universalConfig[component.name].type

                if (!compType) compType = 'FLAG'
                if (!ucompType) ucompType = '[FLAG]'
                console.error(
                  `[Parsing Error] You have universal components with same name but different types
                ${component.name} - ${compType} (in ${namespace}.${component.contextName}) | ${ucompType} (in ${namespace}.${universalConfig[component.name].contextName})`
                )
              } else {
                universalConfig[component.name] = component
              }
            }
          }
        }
      }
    }

    for (var namespace in generationConfig) {
      var namespaceConfig = generationConfig[namespace]

      if (namespaceConfig.contexts) {
        for (var contextName in namespaceConfig.contexts) {
          var context = namespaceConfig.contexts[contextName]

          if (context.settings.isExtend) {
            var extendContextNames = context.settings.extendContextNames

            for (var extendContextName of extendContextNames) {
              var localNamespacePath = context.namespace + '.' + extendContextName
              var globalNamespacePath = extendContextName
              var partialContext

              if (partialContextsCache[localNamespacePath]) {
                partialContext = partialContextsCache[localNamespacePath]
              } else if (partialContextsCache[globalNamespacePath]) {
                partialContext = partialContextsCache[globalNamespacePath]
              } else {
                console.error('[Parsing Error] Can not find partial context to extend: ' + extendContextName)
              }

              if (partialContext) {
                for (var componentName in partialContext.components) {
                  var partialComponent = partialContext.components[componentName]

                  if (context.components[componentName] && context.components[componentName].ownerName != partialContext.namespace + '.' + partialContext.name) {
                    console.error('[Parsing Error] Can not extend context: ' + context.namespace + '.' + context.name + ' with ' + partialContext.namespace + '.' + partialContext.name + ' it already has component ' + componentName)
                  } else {
                    context.components[componentName] = Object.assign({}, partialComponent)
                    context.components[componentName].isFake = true
                    context.components[componentName].ownerName = partialContext.namespace + '.' + partialContext.name

                    if (!context.fakeComponents) context.fakeComponents = {}
                    context.fakeComponents[componentName] = context.components[componentName]

                    if (partialComponent.type) context.valueComponents[componentName] = context.components[componentName]
                    else context.flagComponents[componentName] = context.components[componentName]
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  function mergeObject(dest, source) {
    for (var key in source) {
      if (typeof source[key] === 'object' && typeof dest[key] === 'object') mergeObject(dest[key], source[key])
      else if (typeof source[key] === 'object') dest[key] = source[key]
      else dest[key] = source[key]
    }
  }

  function generate(callback) {
    var outputPath = path.resolve(outputDirectory)
    var lastDirectoryArr = outputPath.split(path.sep)
    var lastDirectory = lastDirectoryArr[lastDirectoryArr.length - 1]

    if (lastDirectory.toLowerCase().indexOf(outputSaveword.toLowerCase()) == -1) {
      console.log('[Generation Error] Output path must end with ' + outputSaveword + ' folder')
      return false
    }

    var startedTime = Date.now()

    fse.ensureDirSync(outputPath)
    cleanGenerateDir(outputPath, files) // ?

    writingFile = 0
    var pauseCounter = 0

    for (var key in files) {
      (function (key) {
        var template = compiledTemplates[files[key]]

        var outputFilePath = path.resolve(rootDir, outputPath, key)

        try {
          var outputContent = template(generationConfig)
        } catch (err) {
          err.fileName = key
          err.templateName = files[key]
          errors.print('[Gentitas Error] Data feeding to template error: ', err)
          return
        }

        var pause = 10
        pauseCounter++

        setTimeout(function () {
          writeTemplateToFile(outputFilePath, outputContent)
            .then(function () {
              writingFile++
              if (writingFile == fileLength) {
                if (callback) callback(Date.now() - startedTime)
              }
            })
        }, 10 + pause * pauseCounter);
      })(key)
    }
  }

  function compileTemplates(callback) {
    try {
      var partials = getPartials(config.partials)
      for (var key in partials) {
        Handlebars.registerPartial(key, partials[key])
      }

      for (var key in helpers) {
        Handlebars.registerHelper(key, helpers[key])
      }

      compiledTemplates = {}
      var templates = getTemplates(config.files)
      for (var key in templates) {
        var compiledTemplate = Handlebars.compile(templates[key], { noEscape: true })
        compiledTemplates[key] = compiledTemplate
      }
    } catch (err) {
      errors.print('[Gentitas Error] Template compilation error: ', err)
    }

    if (callback) callback()
  }

  function getPartials(partials) {
    if (partials == undefined) return {}
    var result = {}

    for (var key in partials) {
      result[key] = fs.readFileSync(partials[key], 'utf8')
    }

    return result
  }

  function getTemplates(templates) {
    if (templates == undefined) return {}
    var result = {}

    for (var key in templates) {
      result[templates[key]] = fs.readFileSync(path.join(rootDir, templates[key]), 'utf8')
    }

    return result
  }

  function writeTemplateToFile(outputPath, outputContent) {
    return new Promise(function (fulfill, reject) {
      fs.writeFile(outputPath, outputContent, { flag: 'w' }, function (err) {
        if (err) reject(err)
        else fulfill()
      })
    })
  }

  function cleanGenerateDir(outputPath, files) {
    var arr = outputPath.split('/')
    var allFiles = getAllFiles(outputPath, null, '.meta')
    var neededFiles = getFileListFromFileObject(outputPath, files)
    var filesToDelete = []

    for (var i = 0; i < allFiles.length; i++) {
      var currentFile = allFiles[i]
      if (neededFiles.indexOf(currentFile) == -1) filesToDelete.push(currentFile)
    }

    if (outputPath.toLowerCase().indexOf(outputSaveword.toLowerCase()) != -1) {
      for (var i = 0; i < filesToDelete.length; i++) {
        fs.unlinkSync(path.resolve(filesToDelete[i]))
      }
    } else {
      console.error("[Generation Error] Can not clean directory without '" + outputSaveword + "' part in it's name.", outputPath)
    }
  }

  function getAllFiles(dir, filelist, excepthEnding) {
    var allFiles = fs.readdirSync(dir)
    filelist = filelist || []

    allFiles.forEach(function (file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = getAllFiles(path.join(dir, file), filelist, excepthEnding)
      }
      else {
        if (excepthEnding) {
          if (file.indexOf(excepthEnding) == -1) {
            filelist.push(path.join(dir, file))
          }
        } else {
          filelist.push(path.join(dir, file))
        }
      }
    })
    return filelist
  }

  function getFileListFromFileObject(outputPath, allFiles) {
    var result = []

    for (var key in allFiles) {
      result.push("./" + path.join(outputPath, key))
    }

    return result
  }

  function pingAllCsprogFiles(callback) {
    if (csprojDirectory) {
      fs.readdirSync(path.resolve(rootDir, csprojDirectory)).forEach(filename => {
        if (filename.indexOf('.csproj') != -1) {
          pingcsproj(path.resolve(rootDir, csprojDirectory, filename))
        }
      })
    }
    callback()
  }

  function pingcsproj(filename) {
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

  function parseFile(fullPath, config) {
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

      if (line.has('{')) bracesOpened++
      if (line.has('}')) bracesOpened--

      if (collectMode) {
        if (line.has(collectMode)) collect(false, collectable, line)
        else collect(collectMode, collectable, line)
      } else {
        if (line.has('namespace')) collect('{', 'namespace', line)
        else if (line.has('context') && line.has('class')) collect('{', 'context', line)
        else if (line.has('component')) collect(';', 'component', line)
        else if (line.has('group')) collect(';', 'group', line)
        else if (line.has('index')) collect(';', 'index', line)
      }

      if (!collectMode) {
        var collectedString = collected.join(' ')

        if (collectable === 'namespace') {
          parseNamespace(collectedString)
        }
        if (collectable === 'context') {
          parseContext(collectedString)
        }

        if (collectable === 'component') parseComponent(collectedString)
        if (collectable === 'group') parseGroup(collectedString)
        if (collectable === 'index') parseIndex(collectedString)

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
      if (line.has(value)) collectMode = false
      else collectMode = value;
      collectable = collectableValue;
      collected.push(line)
    }

    function parseNamespace(line) {
      currentNamspaceIndex = bracesOpened
      currentNamspace = line.matchAndGet(/namespace\s([^\)]+)\s\{/).trim()
      currentRealNamspace = currentNamspace.split('.')
      currentRealNamspace.pop()
      currentRealNamspace = currentRealNamspace.join('.')

      if (!config[currentRealNamspace]) config[currentRealNamspace] = {}
      if (!config[currentRealNamspace].contexts) config[currentRealNamspace].contexts = {}
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

      if (!checkIfNameIsKeyword(name)) return

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
      if (isUniversal) configToPush.universalComponents[name] = component
      if (!type) configToPush.flagComponents[name] = component
      else configToPush.valueComponents[name] = component
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
          for (var i in all) all[i] = all[i].trim()
        }
        if (none) {
          none = none.split(',')
          for (var i in none) none[i] = none[i].trim()
        }
        if (any) {
          any = any.split(',')
          for (var i in any) any[i] = any[i].trim()
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
      if (isGroupSingle) configToPush.singleGroups[name] = group
      else configToPush.multiGroups[name] = group
    }

    function parseIndex(line) {
      var indexWholeData = line.matchAndGet(/var\s+([^\;]+)/)
      var name = indexWholeData.matchAndGet(/(.+)=/).trim()
      var indexData = indexWholeData.matchAndGet(/=(.+)/).trim()
      var indexDataComponents = indexData.matchAndGet(/Index(\s?.+(\)))/)
      indexDataComponents = indexDataComponents.matchAndGet(/\((.+)\)/)
      indexDataComponents = indexDataComponents.split(',')

      for (var i in indexDataComponents) indexDataComponents[i] = indexDataComponents[i].trim()

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
      console.error('[Parsing Error] You can not use reserved C# keyword as name for component, group or index: ' + name)
    }

    return true
  }
}
catch (e) {
  errors.print(e)
}