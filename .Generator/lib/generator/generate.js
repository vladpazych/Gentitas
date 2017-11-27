var fs = require('fs')
var fse = require('fs-extra')
var path = require('path')
var errors = require('prettified').errors
var writeFile = require('./writeFile')
var mergeObject = require('./mergeObject')
var getAllFiles = require('./getAllFiles')
var log = require('./log')
var pingcsproj = require('./pingcsproj')
var reportTime = require('./reportTime')
var templatesConfig = require('../../templates.json')

var OUTPUT_SAFE_WORD = 'Generated'

var partialContextsCache = {}
var generationConfig = {}

var cachedConfig = {}

var files = templatesConfig.files
var fileLength = Object.keys(files).length
var writingFile = 0


module.exports = function (generatorConfig, startTime) {
    // Fill generation config with data from parsed '.gentitas.cs' files
    createGenerationConfig(generatorConfig)
    generate(generatorConfig, function () {
        // Ping '.csproj' files to trigger text editor to reload solution,
        // to enable intellisense for newly generated classes
        pingcsproj(generatorConfig.rootProjectDir, OUTPUT_SAFE_WORD,  function () { reportTime(startTime) })
    })
}

function createGenerationConfig(generatorConfig) {
    generationConfig = {}
    partialContextsCache = {}

    for (var key in generatorConfig.fileCache) {
        mergeObject(generationConfig, generatorConfig.fileCache[key])
    }

    for (var namespace in generationConfig) {
        var namespaceConfig = generationConfig[namespace]

        if (namespaceConfig.contexts) {
            for (var contextName in namespaceConfig.contexts) {

                var context = namespaceConfig.contexts[contextName]

                if (context.settings.isPartial) { partialContextsCache[context.namespace + '.' + contextName] = context }
                if (context.indexes) {
                    for (var indexName in context.indexes) {
                        var index = context.indexes[indexName]
                        if (!index.type) { index.type = context.components[index.valueComponentName].type }
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

                            if (!compType) { compType = 'FLAG' }
                            if (!ucompType) { ucompType = '[FLAG]' }
                            log.error(`You have universal components with same name but different types \n${component.name} - ${compType} (in ${namespace}.${component.contextName}) | ${ucompType} (in ${namespace}.${universalConfig[component.name].contextName})`
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
                            log.error('Can not find partial context to extend: ' + extendContextName)
                        }

                        if (partialContext) {
                            for (var componentName in partialContext.components) {
                                var partialComponent = partialContext.components[componentName]

                                if (context.components[componentName] && context.components[componentName].ownerName != partialContext.namespace + '.' + partialContext.name) {
                                    log.error('Can not extend context: ' + context.namespace + '.' + context.name + ' with ' + partialContext.namespace + '.' + partialContext.name + ' it already has component ' + componentName)
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

function generate(generatorConfig, callback) {
    var outputPath = path.resolve(generatorConfig.outputDirectory)
    var lastDirectoryArr = outputPath.split(path.sep)
    var lastDirectory = lastDirectoryArr[lastDirectoryArr.length - 1]

    if (lastDirectory.toLowerCase().indexOf(OUTPUT_SAFE_WORD.toLowerCase()) == -1) {
        log.error('Output path must contain \'' + OUTPUT_SAFE_WORD + '\' folder')
        return false
    }

    var startedTime = Date.now()

    fse.ensureDirSync(outputPath)
    cleanGenerateDir(outputPath, files)

    writingFile = 0
    var pauseCounter = 0

    for (var key in files) {
        (function (key) {
            var template = generatorConfig.compiledTemplates[files[key]]

            var outputFilePath = path.resolve(generatorConfig.rootProjectDir, outputPath, key)

            try {
                var outputContent = template(generationConfig)
            } catch (err) {
                err.fileName = key
                err.templateName = files[key]
                errors.print('Generation Error', err)
                return
            }

            var pause = 10
            pauseCounter++

            setTimeout(function () {
                writeFile(outputFilePath, outputContent)
                    .then(function () {
                        writingFile++
                        if (writingFile == fileLength) {
                            if (callback) { callback(Date.now() - startedTime) }
                        }
                    })
            }, 10 + pause * pauseCounter);
        })(key)
    }
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

    if (outputPath.toLowerCase().indexOf(OUTPUT_SAFE_WORD.toLowerCase()) != -1) {
        for (var i = 0; i < filesToDelete.length; i++) {
            fs.unlinkSync(path.resolve(filesToDelete[i]))
        }
    } else {
        log.error("Can not clean directory without '" + OUTPUT_SAFE_WORD + "' part in it's name.", outputPath)
    }
}

function getFileListFromFileObject(outputPath, allFiles) {
    var result = []

    for (var key in allFiles) {
        result.push("./" + path.join(outputPath, key))
    }

    return result
}