/**
 ***************************************************************************
 * Mixd Front-end Framework - Gulp Setup
 ***************************************************************************
 *
 * This file sets up all the Gulp Tasks that are used for this framework.
 *
 * 
 * Sections
 * 
 * $. Setup: Require node packages
 * $. Setup: Create asset variables
 * $. Setup: Functions
 * $. Task: Compiling Styles
 * $. Task: Compiling Scripts
 * $. Task: Watch files for changes
 * $. Task: Default
 * 
 *
 */



/* $. Setup: Require node packages
\*----------------------------------------------------------------*/

var gulp         = require('gulp'),                // https://www.npmjs.com/package/gulp
    sass         = require('gulp-sass'),           // https://www.npmjs.com/package/gulp-sass
    sourcemaps   = require('gulp-sourcemaps'),     // https://www.npmjs.com/package/gulp-sourcemaps
    autoprefixer = require('gulp-autoprefixer'),   // https://www.npmjs.com/package/gulp-autoprefixer
    pixrem       = require('gulp-pixrem'),         // https://www.npmjs.com/package/gulp-pixrem
    concat       = require('gulp-concat');         // https://www.npmjs.com/package/gulp-concat
    uglify       = require('gulp-uglify'),         // https://www.npmjs.com/package/gulp-jshint
    livereload   = require('gulp-livereload'),     // https://www.npmjs.com/package/gulp-livereload
    plumber      = require('gulp-plumber'),        // https://www.npmjs.com/package/gulp-plumber
    notify       = require("gulp-notify");         // https://www.npmjs.com/package/gulp-notify



/* $. Setup: Create asset variables
\*----------------------------------------------------------------*/

var paths = {
    assets:     'assets/',
    css:        'assets/css/',
    scss:       'assets/scss/',
    js:         'assets/js/',
    img:        'assets/img/',
    grunticon:  'assets/grunticon/',
    bower:      'components/'
}



/* $. Setup: Functions
\*----------------------------------------------------------------*/

// On call, edit/change the 'notify' onError method
var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    this.emit('end');
};



/* $. Task: Compiling Styles
\*----------------------------------------------------------------*/

gulp.task('styles', function () {

    // Define source path
    gulp.src( [paths.scss] + '*.scss' )

        // Stop pipeline breaks onError
        .pipe(plumber({ errorHandler: onError }))

        // Start source maps module
        .pipe(sourcemaps.init())

        // Compile scss to css
        .pipe(sass({ outputStyle: 'compressed' }))

        // Prefix needed CSS based on http://caniuse.com
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }))

        // Pixel fallback for 'rem'
        .pipe(pixrem('1em'))

        // Create Source Maps
        .pipe(sourcemaps.write( './maps' ))

        // Define destination path
        .pipe(gulp.dest( [paths.css] + '' ))

        // Call livereload
        .pipe(livereload())

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Styles',
            onLast: true
        }));
});



/* $. Task: Compiling Scripts - Main
\*----------------------------------------------------------------*/

gulp.task('scripts', function() {

    // Define source path
    gulp.src([
        [paths.bower]     + 'jquery/dist/jquery.min.js',
        [paths.grunticon] + 'grunticon.loader.txt',
        [paths.js]        + 'main.js'
    ])

        // Stop pipeline breaks onError
        .pipe( plumber({ errorHandler: onError }) )

        // Merge files
        .pipe(concat('main.js'))

        // Uglify files
        .pipe( uglify() )

        // Define destination path
        .pipe( gulp.dest([paths.js] + 'min/') )

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Main',
            onLast: true
        }));
});



/* $. Task: Compiling Scripts - Head
\*----------------------------------------------------------------*/

gulp.task('scripts-head', function() {

    // Define source path
    gulp.src([
        [paths.js] + 'vendor/modernizr.js',
        [paths.js] + 'head.js'
    ])

        // Stop pipeline breaks onError
        .pipe( plumber({ errorHandler: onError }) )

        // Merge files
        .pipe(concat('head.js'))

        // Uglify files
        .pipe( uglify() )

        // Define destination path
        .pipe( gulp.dest([paths.js] + 'min/') )

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Head',
            onLast: true
        }));
});



/* $. Task: Watch files for changes
\*----------------------------------------------------------------*/

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch( [paths.scss] + '**/*.scss', ['styles']);
    gulp.watch( [paths.js] + '*.js', ['scripts'] );
});



/* $. Task: Default
\*----------------------------------------------------------------*/

gulp.task('default', function() {
    gulp.start('styles');
});
