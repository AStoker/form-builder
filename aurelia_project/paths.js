let appRoot = 'src/';
let outputRoot = 'dist/';

let paths = {
    root: appRoot,
    source: appRoot + '**/*.js',
    html: appRoot + '**/*.html',
    css: appRoot + '**/*.css',
    style: 'styles/**/*.css',
    output: outputRoot
};

paths.ignore = ['form-builder.js'];
paths.files = [
    paths.source
];


module.exports = paths;
