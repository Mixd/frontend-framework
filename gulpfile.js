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
 * $. Task: Styles
 * $. Task: Scripts
 * $. Task: Scripts Head
 * $. Task: Images
 * $. Task: Sprites
 * $. Task: Watch
 * $. Task: Default
 *
 */



/* $. Setup: Require node packages
\*----------------------------------------------------------------*/

var gulp         = require('gulp'),                // https://www.npmjs.com/package/gulp
    sass         = require('gulp-sass'),           // https://www.npmjs.com/package/gulp-sass
    sourcemaps   = require('gulp-sourcemaps'),     // https://www.npmjs.com/package/gulp-sourcemaps
    autoprefixer = require('gulp-autoprefixer'),   // https://www.npmjs.com/package/gulp-autoprefixer
    pixrem       = require('gulp-pixrem'),         // https://www.npmjs.com/package/gulp-pixrem
    uglify       = require('gulp-uglify'),         // https://www.npmjs.com/package/gulp-uglify
    concat       = require('gulp-concat'),         // https://www.npmjs.com/package/gulp-concat
    iconify      = require('gulp-iconify');        // https://www.npmjs.com/package/gulp-iconify
    livereload   = require('gulp-livereload'),     // https://www.npmjs.com/package/gulp-livereload
    imagemin     = require('gulp-imagemin'),       // https://www.npmjs.com/package/gulp-imagemin
    plumber      = require('gulp-plumber'),        // https://www.npmjs.com/package/gulp-plumber
    notify       = require("gulp-notify");         // https://www.npmjs.com/package/gulp-notify



/* $. Setup: Create asset variables
\*----------------------------------------------------------------*/

var paths = {
    src: {
        scss: 'assets/src/scss/',
        js: 'assets/src/js/',
        img: 'assets/src/img/',
        icons: 'assets/src/icons/'
    },
    dist: {
        css: 'assets/dist/css/',
        js: 'assets/dist/js/',
        img: 'assets/dist/img/',
        icons: 'assets/dist/icons'
    },
    bower: 'components/'
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



/* $. Task: Styles
\*----------------------------------------------------------------*/

gulp.task('styles', function () {

    // Define source path
    return gulp.src( [paths.src.scss] + '*.scss' )

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
        .pipe(gulp.dest( [paths.dist.css] + '' ))

        // Call livereload
        .pipe(livereload())

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Styles',
            onLast: true
        }));
});



/* $. Task: Scripts
\*----------------------------------------------------------------*/

gulp.task('scripts', function() {

    // Define source path
    return gulp.src([
        [paths.bower] + 'jquery/dist/jquery.min.js',
        [paths.src.js] + 'main.js'
    ])

        // Stop pipeline breaks onError
        .pipe( plumber({ errorHandler: onError }) )

        // Merge files
        .pipe(concat('main.js'))

        // Uglify files
        .pipe( uglify() )

        // Define destination path
        .pipe( gulp.dest([paths.dist.js] + '') )

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Main',
            onLast: true
        }));
});



/* $. Task: Scripts Head
\*----------------------------------------------------------------*/

gulp.task('scripts-head', function() {

    // Define source path
    return gulp.src([
        [paths.src.js] + 'vendor/modernizr.js',
        [paths.src.js] + 'head.js'
    ])

        // Stop pipeline breaks onError
        .pipe( plumber({ errorHandler: onError }) )

        // Merge files
        .pipe(concat('head.js'))

        // Uglify files
        .pipe( uglify() )

        // Define destination path
        .pipe( gulp.dest([paths.dist.js] + '') )

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Head',
            onLast: true
        }));
});



/* $. Task: Images
\*----------------------------------------------------------------*/

gulp.task('images', function () {

    // Define source path
    return gulp.src( [paths.src.img] + '**/*' )

        // Stop pipeline breaks onError
        .pipe( plumber({ errorHandler: onError }) )

        // Optimise image files - .png .jpg .jpeg .gif .svg
        .pipe(imagemin({
            svgoPlugins: [
                {
                    removeViewBox: false
                },
                {
                    removeUselessStrokeAndFill: false
                }
            ],
            progressive: true,
            optimizationLevel: 5,
            interlaced: true
        }))

        // Define destination path
        .pipe(gulp.dest( [paths.dist.img] + '' ))

        // Notify OS with message
        .pipe(notify({
            title: 'Task finished',
            message: 'Images',
            onLast: true
        }));
});



/* $. Task: Sprites
\*----------------------------------------------------------------*/

gulp.task('sprites', function () {
    iconify({
        src: [paths.src.icons] + '**/*.svg',
        styleTemplate: [paths.src.icons] + '/_icon_gen.scss.mustache',
        pngOutput: [paths.dist.icons] + '/png/',
        cssOutput:  [paths.dist.icons] + '',
        svgoOptions: {
            enabled: false
        }
    });
});



/* $. Task: Watch
\*----------------------------------------------------------------*/

gulp.task('watch', function () {

    // Start Livereload
    livereload.listen();

    // Watch .scss files for changes and run 'styles' task
    gulp.watch( [paths.src.scss] + '**/*.scss', ['styles']);

    // Watch main.js files for changes and run 'scripts' task
    gulp.watch( [paths.src.js] + 'main.js', ['scripts'] );

    // Watch head.js files for changes and run 'scripts-head' task
    gulp.watch( [paths.src.js] + 'head.js', ['scripts-head'] );
});



/* $. Task: Default
\*----------------------------------------------------------------*/

gulp.task('default', function() {
    return gulp.start('styles', 'scripts', 'scripts-head');
});
