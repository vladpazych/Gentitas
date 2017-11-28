var fs = require('fs')
var fse = require('fs-extra')
var fsWalk = require('fs-walk')
var path = require('path')
var nodeWatch = require('node-watch')
var errors = require('prettified').errors
var propertiesReader = require('properties-reader')

var generator = require('./lib/generator')

// 
// Require Extensions
// 
require('./lib/extensions/string')

// 
// Set Constants
// 
var USER_PROPERTIES_FILENAME = 'User.properties'
var ENTITAS_PROPERTIES_FILENAME = 'Entitas.properties'
var ENABLE_PING_CSPROJ = "Entitas.Gentitas.EnablePingCSProj";
var OUTPUT_PATH_FOLDER_PATH_KEY = "Entitas.Gentitas.OutputPath";

//
// Resolve Directories
// 
var rootGeneratorDir = path.resolve(__dirname)
var rootProjectDir = getRootProjectDirectory(rootGeneratorDir)

fse.ensureFileSync(path.resolve(rootProjectDir, ENTITAS_PROPERTIES_FILENAME))
fse.ensureFileSync(path.resolve(rootProjectDir, USER_PROPERTIES_FILENAME))

var properties = propertiesReader(path.resolve(rootProjectDir, ENTITAS_PROPERTIES_FILENAME))
var userProperties = propertiesReader(path.resolve(rootProjectDir, USER_PROPERTIES_FILENAME))

if (!properties || !userProperties) { throw 'Properties not found. Can\'t generate without properties. [' + path.resolve(rootProjectDir) + ']' }

var outputDirectoryFromProperties = properties.get(OUTPUT_PATH_FOLDER_PATH_KEY)
var pingcsprojFromProperties = userProperties.get(ENABLE_PING_CSPROJ) == 'True'

if (!outputDirectoryFromProperties) {
    outputDirectoryFromProperties = "Assets/Generated"
    generator.log.warning(OUTPUT_PATH_FOLDER_PATH_KEY + ' not set in Entitas.properties. Using default: ' + outputDirectoryFromProperties)
}

if (pingcsprojFromProperties == false) {
    pingcsprojFromProperties = "True"
    generator.log.warning(ENABLE_PING_CSPROJ + ' not set in Entitas.properties. Using default: ' + pingcsprojFromProperties)
}

var outputDirectory = path.join(rootProjectDir, outputDirectoryFromProperties)
var scanDirectory = rootProjectDir
var csprojDirectory = rootProjectDir
var pingcsproj = pingcsprojFromProperties

generator.log.info('Will generate into ' + outputDirectory)
generator.log.info('Will look for \'.gentitas.cs\' in ' + scanDirectory)
if (pingcsproj) generator.log.info('Will ping \'.csproj\' files after each generation')

// 
// Declaring Generation Cache
// 
var generatorConfig = {
    outputDirectory: outputDirectory,
    rootProjectDir: rootProjectDir,
    rootGeneratorDir: rootGeneratorDir,
    compiledTemplates: {},
    fileCache: {},
    allFilePaths: []
}

// 
// Starting Generation Process
// 
try {
    generator.compileTemplates(generatorConfig, function () {
        var startTime = Date.now()

        // Walking through all files inside of a 'Assets' folder and parse '.gentitas.cs' files
        fsWalk.walkSync(scanDirectory, function (basedir, filename, stat, next) {
            var extname = path.extname(filename)

            if (extname != '.cs' || (filename.toLowerCase().indexOf('.gentitas.cs') == -1)) { return }

            var fullPath = path.resolve(basedir, filename)
            // If file was not previously discovered - save it's path for later use
            if (generatorConfig.allFilePaths.indexOf(fullPath) == -1) { generatorConfig.allFilePaths.push(fullPath) }

            generator.refreshFileCache(fullPath, generatorConfig)
        })

        generator.generate(generatorConfig, startTime)

        // Watch 'gentitas.cs' files for change to regenerate
        nodeWatch(scanDirectory, { recursive: true, filter: /\.(gentitas.cs|Gentitas.cs)$/ }, function (evt, inPath) {
            startTime = Date.now()

            var fullPath = path.resolve(inPath)

            // If file was not previously discovered - save it's path for later use
            if (generatorConfig.allFilePaths.indexOf(fullPath) == -1) { generatorConfig.allFilePaths.push(fullPath) }

            generator.refreshFileCache(fullPath, generatorConfig)
            generator.generate(generatorConfig, startTime)
        })

        // Watch folder with '.hbs' templates for change to regenerate
        nodeWatch(path.resolve('./templates'), { recursive: true, filter: /\.hbs$/ }, function (evt, inPath) {
            var startTime = Date.now()

            generator.compileTemplates(generatorConfig, function () {
                // For all files, previosly discovered - refresh file cache
                for (var fullPath of generatorConfig.allFilePaths) {
                    generator.refreshFileCache(fullPath, generatorConfig)
                }

                generator.generate(generatorConfig, startTime)
            })
        })
    })
}
catch (e) {
    errors.print('Generation Process Error', e)
}

// 
// Helpers
// 
function getRootProjectDirectory(pathString) {
    var pathArr = pathString.split(path.sep)
    var indexOfAssetsFolder = pathArr.indexOf('Assets')
    pathArr = pathArr.splice(0, indexOfAssetsFolder)
    return pathArr.join(path.sep)
}