var gulp = require("gulp");
var shell = require('gulp-shell');

gulp.task(
    "compile",
    function (cb) {
        console.log("START! compile.js");

        return gulp.src(".", {read: false})
            .pipe(shell([
                "tsc"
            ]))
            .on(
                "end",
                function () {
                    console.log("FINISH! compile.js");
                }

            ).on(
                "error",
                function () {
                    console.log("ERROR! compile.js");
                }
            )
    }
);


// // NOTE: gulp-typescript + sourcemaps - more or less workable
//
// var gulp = require("gulp");
// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");
// var merge2 = require('merge2');
// var sourcemaps = require('gulp-sourcemaps');
//
// console.log("tsProject.options: ");
// console.dir(tsProject.options);
// console.dir(" - ");
//
// gulp.task(
//     "compile",
//     function (cb) {
//         console.log("START! compile.js");
//
//         /*tsProject.src()
//         .pipe(ts(tsProject))
//         .js.pipe(gulp.dest("src"))
//         .on(
//             "finish",
//             function() {
//                 console.log("FINISH! compile.js");
//                 cb();
//             }
//         );*/
//
//         var tsResult = tsProject.src()
//             .pipe(ts(tsProject));
//
//         return merge2([
//             // tsResult.dts.pipe(gulp.dest("./src"))
//             // ,
//             tsResult.js.pipe(gulp.dest(""))
//         ]).on(
//             "queueDrain",
//             function() {
//
//                 console.log("FINISH! compile.js");
//
//                 /*return gulp.src("src/!**!/!*.js")
//                     .pipe(sourcemaps.init())
//                     .pipe(sourcemaps.write())
//                     .pipe(gulp.dest("src"))
//                     .on(
//                         "end",
//                         function() {
//                             console.log("FINISH! compile.js");
//                         }
//                     );*/
//
//                 /*gulp.src("src/!**!/!*.js")
//                     .pipe(sourcemaps.init({identityMap: true}))
//                     .pipe(sourcemaps.write(".", {includeContent: false, sourceRoot: "./src"}))
//                     .pipe(gulp.dest("src"))
//                     .on(
//                         "end",
//                         function () {
//                             console.log("FINISH! compile.js");
//                         }
//                     );*/
//
//                 // cb();
//             }
//         );
//     }
// );