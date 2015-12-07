/**
 ***************************************************************************
 * Mixd Front-end Framework - Gulp Setup
 ***************************************************************************
 *
 * This file sets up all the Gulp Tasks that are used for this framework.
 *
 * $. Required Packages
 * $. Variables
 * $. Functions
 * $. Styles
 * $. Scripts
 * $. Scripts Head
 * $. Images
 * $. Watch
 * $. Default
 *
 */



/* $. Required Packages
\*----------------------------------------------------------------*/

var gulp         = require('gulp'),                // https://www.npmjs.com/package/gulp
    $            = require('gulp-load-plugins')(), // https://www.npmjs.com/package/gulp-load-$
    autoprefixer = require('autoprefixer'),        // https://www.npmjs.com/package/gulp-autoprefixer
    del          = require('del');                 // https://www.npmjs.com/package/del



/* $. Variables
\*----------------------------------------------------------------*/

// Define base 'assets' directory
var assets = 'assets/';

// Define 'app/dist' directory based on 'assets' directory
var base = {
    app: assets + 'app/',
    dist: assets + 'dist/'
};

// Define paths based on 'app/dist' folders
var paths = {
    app: {
        scss: base.app + 'scss/',
        js: base.app + 'js/',
        icons: base.app + 'icons/'
    },
    dist: {
        css: base.dist + 'css/',
        js: base.dist + 'js/',
        img: base.dist + 'img/',
        icons: base.dist + 'icons'
    },
    bower: 'components/'
};



/* $. Functions
\*----------------------------------------------------------------*/

// On call, edit/change the 'notify' onError method
var onError = function( err ) {

    $.notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};



/* $. Styles
\*----------------------------------------------------------------*/

gulp.task('styles', function () {

    // Define source path
    return gulp.src( paths.app.scss + '*.scss' )

        // Stop pipeline breaks onError
        .pipe( $.plumber({ errorHandler: onError }) )

        // Start source maps module
        .pipe( $.sourcemaps.init() )

        // Compile scss to css
        .pipe( $.sass({ outputStyle: 'compressed' }) )

        // Prefix needed CSS based on http://caniuse.com
        .pipe(
            $.postcss([
                autoprefixer({
                    browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
                    cascade: false
                })
            ])
        )

        // Pixel fallback for 'rem'
        .pipe( $.pixrem('1em') )

        // Create Source Maps
        .pipe( $.sourcemaps.write( './maps' ) )

        // Define destination path
        .pipe( gulp.dest( paths.dist.css + '' ) )

        // Call livereload
        .pipe( $.livereload() )

        // Notify OS with message
        .pipe(
            $.notify({
                title: 'Task finished',
                message: 'Styles',
                onLast: true
            })
        );
});



/* $. Scripts
\*----------------------------------------------------------------*/

gulp.task('scripts', function () {

    // Define source path
    return gulp.src([
        paths.app.js + 'partials/icons-fallback.js',
        paths.app.js + 'main.js'
    ])

        // Stop pipeline breaks onError
        .pipe( $.plumber({ errorHandler: onError }) )

        // Merge files
        .pipe( $.concat('main.js') )

        // Uglify files
        .pipe( $.uglify() )

        // Define destination path
        .pipe( gulp.dest(paths.dist.js + '') )

        // Notify OS with message
        .pipe(
            $.notify({
                title: 'Task finished',
                message: 'Scripts - Main',
                onLast: true
            })
        );
});



/* $. Scripts Head
\*----------------------------------------------------------------*/

gulp.task('scripts-head', function () {

    // Define source path
    return gulp.src([
        paths.app.js + 'vendor/modernizr.js',
        paths.app.js + 'head.js'
    ])

        // Stop pipeline breaks onError
        .pipe( $.plumber({ errorHandler: onError }) )

        // Merge files
        .pipe( $.concat('head.js') )

        // Uglify files
        .pipe( $.uglify() )

        // Define destination path
        .pipe( gulp.dest(paths.dist.js + '') )

        // Notify OS with message
        .pipe(
            $.notify({
                title: 'Task finished',
                message: 'Scripts - Head',
                onLast: true
            })
        );
});



/* $. Images
\*----------------------------------------------------------------*/

gulp.task('images', function () {

    // Define source path
    return gulp.src( paths.dist.img + '**/*' )

        // Stop pipeline breaks onError
        .pipe( $.plumber({ errorHandler: onError }) )

        // Optimise image files - .png .jpg .jpeg .gif .svg
        .pipe( $.imageoptim.optimize() )

        // Define destination path
        .pipe( gulp.dest( paths.dist.img + '' ) )

        // Notify OS with message
        .pipe(
            $.notify({
                title: 'Task finished',
                message: 'Images',
                onLast: true
            })
        );
});



/* $. Clean
\*----------------------------------------------------------------*/

gulp.task('clean', function (cb) {
    del([
        paths.dist.css + '**/*',
        paths.dist.js + '**/*',
        paths.dist.icons + '**/*',
    ], cb);
});



/* $. Watch
\*----------------------------------------------------------------*/

gulp.task('watch', function () {

    // Start Livereload
    $.livereload.listen();

    // Run 'styles' task when scss files are changed/added/removed
    gulp.watch( paths.app.scss + '**/*.scss', ['styles'] );

    // Run 'scripts' when main.js is modified
    gulp.watch( paths.app.js + 'main.js', ['scripts'] );

    // Run 'scripts-head' when head.js is modified
    gulp.watch( paths.app.js + 'head.js', ['scripts-head'] );

    // Run 'sprites' when svg file is changed/added/removed
    gulp.watch( paths.app.icons + '**/*.svg', ['sprites'] );
});



/* $. Default
\*----------------------------------------------------------------*/

gulp.task('default', ['clean', 'scripts', 'scripts-head', 'styles', 'images']);
