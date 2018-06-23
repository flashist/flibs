var gulp = require("gulp");
var requireDir = require("require-dir");
var shell = require('gulp-shell');
var runSequence = require('run-sequence');

var tasks = requireDir("./gulp/tasks");

gulp.task(
    'build',
    function(callback) {
        runSequence(
            "clean",
            // "generate-definitions",
            "copy-to-dist",
            "compile",

            callback
        );
    }
);

// Default
gulp.task("default", ["build"]);