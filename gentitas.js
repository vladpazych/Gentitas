var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
var gulpWatch = require('gulp-watch');
var gulpClean = require('gulp-clean');
var fs = require('fs-extra');
var path = require('path');
var errors = require('prettified').errors;
var Promise = require('promise');
var Handlebars = require('handlebars');
var config = require('./gentitas.json');

var tsProject = gulpTypescript.createProject('tsconfig.json', {
    isolatedModules: true,
});

var compiledJSPath = '.compiled';
var declarationsPath = './project/declarations';
var compiledTemplates = {};
var safeKeyword = config.safeKeyword ? safeKeyword : "generated";
var modifierPath = "./" + path.join(compiledJSPath, config.modifier);
var mapPath = "./" + path.join(compiledJSPath, config.map);


gulp.task('compile templates', function (callback) {
    compileTemplates(callback);
});

gulp.task('generate files', function (callback) {
    generateFiles(callback).catch(function (err) {
        errors.print(err);
    });
});

gulp.task('clean scripts', function () {
    return gulp.src(compiledJSPath + '/**/*.js', { read: false })
        .pipe(gulpClean());
});

gulp.task('clean templates', function () {
    return gulp.src(compiledJSPath + '/**/*.hbs', { read: false })
        .pipe(gulpClean());
});

gulp.task('clean', gulp.parallel(['clean templates', 'clean scripts']));

gulp.task('move templates', function () {
    return gulp.src(config.watchTemplates, { base: '.' })
        .pipe(gulp.dest(compiledJSPath));
    // recompile templates and generate
});

gulp.task('compile', function () {
    return gulp.src(config.watchScripts, { base: '.' })
        .pipe(tsProject())
        .pipe(gulp.dest(compiledJSPath));
});

gulp.task('watch scripts', function () {
    return gulpWatch(config.watchScripts, gulp.series(['clean scripts', 'compile', 'generate files']));
});

gulp.task('watch templates', function () {
    return gulpWatch(config.watchTemplates, gulp.series(['clean templates', 'move templates', 'compile templates', 'generate files']));
});

gulp.task('default', gulp.series('clean', [gulp.parallel(['compile', 'move templates']), gulp.series(['compile templates', 'generate files']), gulp.parallel(['watch scripts', 'watch templates'])]));

function compileTemplates(callback) {
    try {
        var partials = getPartials(config.partials);
        for (var key in partials) {
            Handlebars.registerPartial(key, partials[key]);
        }

        var helpers = config.helpers;
        for (var key in helpers) {
            var helper = require("./" + path.join(compiledJSPath, helpers[key]));
            Handlebars.registerHelper(key, helper.default);
        }

        compiledTemplates = {};
        var templates = getTemplates(config.files)
        for (var key in templates) {
            var compiledTemplate = Handlebars.compile(templates[key], { noEscape: true });
            compiledTemplates[key] = compiledTemplate;
        }
    } catch (err) {
        errors.print(err);
    }

    if (callback) callback();
}

function generateFiles(callback) {
    clearCache();

    var requirePath = path.join(compiledJSPath, declarationsPath);
    var allFiles = getAllFiles(requirePath);

    requireForSideEffects(allFiles);

    var map = require(mapPath).default;
    var modifier = require(modifierPath).default;
    var generatedPath = config.generatedPath;
    var files = config.files;
    var fileLength = Object.keys(files).length;
    var writingFile = 0;

    return ensureDir(generatedPath)
        .then(cleanGenerateDir(generatedPath, files))
        .then(function () {
            if (callback) callback();
            for (var key in files) {
                (function (key) {
                    var outputPath = path.join(generatedPath, key);

                    if (!isPathSafe(outputPath)) {
                        throw "for safety reasons, output folder name should contain '" + safeKeyword + "' part.";
                    }

                    var template = compiledTemplates[files[key]];

                    try {
                        var outputContent = template(map);
                    } catch (err) {
                        err.fileName = key;
                        err.templateName = files[key];
                        throw err;
                    }

                    ensureDir(outputPath)
                        .then(writeTemplateToFile(outputPath, outputContent))
                        .then(function () {
                            writingFile++;
                            if (writingFile == fileLength) {
                                if (callback) callback();
                            }
                        });
                })(key);
            }
        });
}



// 
// Helpers
// 
function getPartials(partials) {
    if (partials == undefined) return {};
    var result = {};

    for (var key in partials) {
        result[key] = fs.readFileSync(path.join(compiledJSPath, partials[key]), 'utf8');
    }

    return result;
}

function getTemplates(templates) {
    if (templates == undefined) return {};
    var result = {};

    for (var key in templates) {
        result[templates[key]] = fs.readFileSync(path.join(compiledJSPath, templates[key]), 'utf8');
    }

    return result;
}

function getDirFromFile(str) {
    var arr = str.split('/');
    arr.pop();
    return arr.join('/');
}

function clearCache() {
    var keysToRemove = []
    for (var key in require.cache) {
        if (key.indexOf(compiledJSPath) != -1) keysToRemove.push(key);
    }

    for (var i in keysToRemove) {
        delete require.cache[keysToRemove[i]];
    }
}

function requireForSideEffects(files) {
    for (var i = 0; i < files.length; i++) {
        require(files[i]);
    }
}

function getAllFiles(dir, filelist, excepthEnding) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getAllFiles(path.join(dir, file), filelist, excepthEnding);
        }
        else {
            if (excepthEnding) {
                if (file.indexOf(excepthEnding) == -1) {
                    filelist.push("./" + path.join(dir, file));
                }
            } else {
                filelist.push("./" + path.join(dir, file));
            }
        }
    });
    return filelist;
}

function getFileListFromFileObject(outputPath, files) {
    var result = [];

    for (var key in files) {
        result.push("./" + path.join(outputPath, key));
    }

    return result;
}

function isPathSafe(path) {
    return path.toLowerCase().indexOf(safeKeyword) != -1;
}

function showError(str) {
    console.log("Generation error: " + str);
}

function showInfo(str) {
    console.log("Generation info: " + str);
}



//
// Promises
//
function cleanGenerateDir(outputPath, files) {
    return new Promise(function (fulfill, reject) {
        var arr = outputPath.split('/');
        var allFiles = getAllFiles(outputPath, null, '.meta');
        var neededFiles = getFileListFromFileObject(outputPath, files);
        var filesToDelete = [];

        for (var i = 0; i < allFiles.length; i++) {
            var currentFile = allFiles[i];
            if (neededFiles.indexOf(currentFile) == -1) filesToDelete.push(currentFile);
        }

        if (isPathSafe(outputPath)) {
            for (var i = 0; i < filesToDelete.length; i++) {
                fs.unlink(filesToDelete[i]);
            }

            fulfill();
        } else {
            reject();
            showError("can't clean directory without '" + safeKeyword + "' part in it's name.");
            console.log(outputPath);
        }
    });
}

function writeTemplateToFile(outputPath, outputContent) {
    return new Promise(function (fulfill, reject) {
        fs.writeFile(outputPath, outputContent, { flag: 'w' }, function (err) {
            if (err) reject(err);
            else fulfill();
        });
    });
}

function ensureDir(outputPath) {
    return new Promise(function (fulfill, reject) {
        fs.ensureDir(getDirFromFile(outputPath), function (err) {
            if (err) reject(err);
            else fulfill();
        });
    });
}