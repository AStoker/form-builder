import gulp from 'gulp';
import to5 from 'gulp-babel';
import gulpIgnore from 'gulp-ignore';
import concat from 'gulp-concat';
import insert from 'gulp-insert';

import tools from 'aurelia-tools';
import through2 from 'through2';
let assign = Object.assign || require('object.assign');

import paths from '../paths';
import compilerOptions from '../babel-options';

import processCSS from './process-css';
import processMarkup from './process-markup';

let build = gulp.parallel(
    //buildIndex,
    buildAMD,
    processMarkup,
    processCSS,
);

function buildAMD() {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.amd())))
        .pipe(gulp.dest(paths.output + 'amd'));
}

function buildIndex() {
    let importsToAdd = [];//paths.importsToAdd.slice();

    let src = gulp.src(paths.files);

    if (paths.sort) {
        src = src.pipe(tools.sortFiles());
    }

    if (paths.ignore) {
        paths.ignore.forEach(function(filename) {
            src = src.pipe(gulpIgnore.exclude(filename));
        });
    }

    return src.pipe(through2.obj(function(file, enc, callback) {
            file.contents = new Buffer(tools.extractImports(file.contents.toString('utf8'), importsToAdd));
            this.push(file);
            return callback();
        }))
        .pipe(concat('form-builder.js'))
        .pipe(insert.transform(function(contents) {
            return tools.createImportBlock(importsToAdd) + contents;
        }))
        .pipe(gulp.dest(paths.output));
}

export { build as default };
