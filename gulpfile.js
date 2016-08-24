var gulp = require("gulp"),
    requireDir = require("require-dir"),
    tasks = requireDir("./gulp/tasks"),
    runSequence = require("run-sequence");

gulp.task(
    "build",
    function(cb) {
        runSequence(
            "test",
            "generate-definitions",
            "compile",
            cb
        );
    }
);