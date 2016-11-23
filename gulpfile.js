/**
 * Require Dependencies
 */
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    newer = require("gulp-newer"),
    jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    browserSync = require('browser-sync').create();

/**
 * Input and Output folders
 */
var io = {
    src: "assets/",
    dest: "build/"
};

/**
 * CSS folders
 */
var css = {
    in: io.src + "css/*.scss",
    out: io.dest + "css/",
    watch: io.src + "css/**/*"
};

/**
 * JS folders
 */
var js = {
    in: io.src + "js/**/*",
    out: io.dest + "js/",
    watch: io.src + "js/**/*"
};

/**
 * Css Task
 */
gulp.task("sass", function () {
    return gulp.src(css.in)
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest(css.out))
        .pipe(browserSync.stream());
});

/**
 * JS Task
 */
gulp.task("js", function () {
    return gulp.src(js.in)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(js.out));
});


gulp.task("browserSync", function () {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    })

});

/**
 * Gulp default task
 */
gulp.task('default', ['sass', 'js'], function () {

    gulp.start('browserSync');

    //Watch the js folder
    gulp.watch(js.watch, ['js']);

    //Watch the css folder
    gulp.watch(css.watch, ['sass']);
});