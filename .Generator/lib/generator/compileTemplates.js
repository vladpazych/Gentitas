var fs = require('fs')
var path = require('path')
var Handlebars = require('handlebars')
var errors = require('prettified').errors
var config = require('../../templates.json')
var parse = require('./parse')

var helpers = {}
helpers.toLower = require('./helpers/toLower')
helpers.toUpper = require('./helpers/toUpper')
helpers.ifCond = require('./helpers/ifCond')
helpers.len = require('./helpers/len')
helpers.global = require('./helpers/global')

var templatesDirectory = path.resolve(__dirname)

module.exports = function compileTemplates(generatorConfig, callback) {
    try {
        var partials = getPartials(config.partials)

        for (var key in partials) {
            Handlebars.registerPartial(key, partials[key])
        }

        for (var key in helpers) {
            Handlebars.registerHelper(key, helpers[key])
        }

        generatorConfig.compiledTemplates = {}

        var templates = getTemplates(config.files)

        for (var key in templates) {
            var compiledTemplate = Handlebars.compile(templates[key], { noEscape: true })
            generatorConfig.compiledTemplates[key] = compiledTemplate
        }
    } catch (err) {
        errors.print('Template Compilation Error', err)
    }

    if (callback) { callback() }
}

function getPartials(partials) {
    if (partials == undefined) { return {} }
    var result = {}

    for (var key in partials) {
        result[key] = fs.readFileSync(partials[key], 'utf8')
    }

    return result
}

function getTemplates(templates) {
    if (templates == undefined) { return {} }
    var result = {}

    for (var key in templates) {
        result[templates[key]] = fs.readFileSync(path.join(templatesDirectory, '../../',templates[key]), 'utf8')
    }

    return result
}