// Create build folder
// Create boilerplate configs
// Pack all to zeip

// nexe ./Generator/Generator.js -o ../Assets/Gentitas/Generator/gentitas

var gulp = require('gulp4')
var path = require('path')
var fs = require('fs')
var fse = require('fs-extra')
var gulpClean = require('gulp-clean')
var gulpZip = require('gulp-zip')
var nexe = require('nexe')

var package = require('./package.json')
var config = require('./Config/Config.json')
var configLocal = require('./Config/ConfigLocal.json')

var buildDirectory = './Build'
var assetsDirectory = '../Assets'
var buildZipDirectory = buildDirectory + 'Zip'
var buildFrameworkDirectory = path.join(buildDirectory, 'Framework')
var buildGeneratorDirectory = path.join(buildDirectory, 'Generator')
process.env.PROJECT_ROOT = path.resolve(__dirname)

gulp.task('clean build directory', function (callback) {
  if (!fse.existsSync(buildDirectory)) {
    callback()
  } else {
    return gulp.src(buildDirectory)
      .pipe(gulpClean())
  }
})

gulp.task('clean build zip directory', function (callback) {
  if (!fse.existsSync(buildZipDirectory)) {
    callback()
  } else {
    return gulp.src(buildZipDirectory)
      .pipe(gulpClean())
  }
})

gulp.task('clean test directory', function (callback) {
  if (!fse.existsSync(path.resolve(assetsDirectory, 'Gentitas/Generator'))) {
    callback()
  } else {
    return gulp.src(path.resolve(assetsDirectory, 'Gentitas/Generator'))
      .pipe(gulpClean({ force: true }))
  }
})

gulp.task('move templates', function () {
  return gulp.src('./Templates/**.hbs')
    .pipe(gulp.dest(path.join(buildFrameworkDirectory, 'Templates')))
})

gulp.task('move editor code', function () {
  return gulp.src('./Editor/**.*')
    .pipe(gulp.dest(path.join(buildFrameworkDirectory, 'Editor')))
    .pipe(gulp.dest(path.join(assetsDirectory, 'Gentitas', 'Editor')))
})

gulp.task('move scripts code', function () {
  return gulp.src('./Scripts/**.*')
    .pipe(gulp.dest(path.join(buildFrameworkDirectory, 'Scripts')))
    .pipe(gulp.dest(path.join(assetsDirectory, 'Gentitas', 'Scripts')))
})

gulp.task('create configs', function (callback) {
  var newConfig = JSON.parse(JSON.stringify(config))
  var newConfigLocal = JSON.parse(JSON.stringify(configLocal))

  newConfig.outputDirectory = '../../Generated'
  newConfig.scanDirectory = '../../'
  newConfigLocal.csprojDirectory = '../../../'

  fse.ensureDirSync(path.join('./', 'Build'))
  fse.ensureDirSync(path.join('./', 'BuildZip'))
  fse.ensureDirSync(path.join(buildFrameworkDirectory, 'Config'))
  fse.writeFileSync(path.join(buildFrameworkDirectory, 'Config/Config.json'), JSON.stringify(newConfig, null, '\t'))
  fse.writeFileSync(path.join(buildFrameworkDirectory, 'Config/ConfigLocal.json'), JSON.stringify(newConfigLocal, null, '\t'))

  fse.ensureDirSync(path.join(buildFrameworkDirectory, 'Version'))
  fse.writeFileSync(path.join(buildFrameworkDirectory, 'Version/Version.txt'), package.version)

  callback()
})

gulp.task('zip framework', function () {
  return gulp.src(buildFrameworkDirectory + '/**/*')
    .pipe(gulpZip('Gentitas.zip'))
    .pipe(gulp.dest(buildZipDirectory))
})

gulp.task('build generator', function (callback) {
  fse.ensureDirSync(path.resolve(buildGeneratorDirectory))

  nexe.compile({
    input: path.resolve('./Generator/Generator.js'),
    output: path.resolve(buildGeneratorDirectory, 'Generator')
  }).then(function () {
    callback()
  }).catch(function () {
    console.error('Generator compilation failed')
    callback()
  })
})

gulp.task('zip generator', function () {
  return gulp.src(buildGeneratorDirectory + '/**/*')
    .pipe(gulpZip('Generator.zip'))
    .pipe(gulp.dest(buildZipDirectory))
})

gulp.task('move generator to test folder', function () {
  return gulp.src(buildGeneratorDirectory + '/**/*')
    .pipe(gulp.dest(path.resolve(assetsDirectory, 'Gentitas/Generator')))
})

gulp.task('move remainings to test folder', function () {
  return gulp.src([buildFrameworkDirectory + '/Config/**/*', buildFrameworkDirectory + '/Version/**/*', buildFrameworkDirectory + '/Templates/**/*'], { base: buildFrameworkDirectory })
    .pipe(gulp.dest(path.resolve(assetsDirectory, 'Gentitas')))
})

// 
// Usable Tasks:
// 
gulp.task('build-gentitas-release', gulp.series(
  [
    gulp.parallel(['clean build zip directory', 'clean build directory', 'clean test directory']),
    gulp.parallel(['move templates', 'move scripts code', 'move editor code', 'create configs', 'build generator']),
    gulp.parallel(['zip framework', 'zip generator'])
  ]))

gulp.task('build-gentitas-release-into-project', gulp.series(
  [
    'build-gentitas-release',
    gulp.parallel(['move generator to test folder', 'move remainings to test folder'])
  ]))

gulp.task('build-generator', gulp.series(
  [
    gulp.parallel(['build generator']),
    gulp.parallel(['move generator to test folder'])
  ]))