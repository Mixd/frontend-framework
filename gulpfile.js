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
 * $. Setup: Required Packages
 * $. Setup: Variables
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



/* $. Setup: Required Packages
\*----------------------------------------------------------------*/

var gulp         = require('gulp'),                // https://www.npmjs.com/package/gulp
    sass         = require('gulp-sass'),           // https://www.npmjs.com/package/gulp-sass
    sourcemaps   = require('gulp-sourcemaps'),     // https://www.npmjs.com/package/gulp-sourcemaps
    autoprefixer = require('gulp-autoprefixer'),   // https://www.npmjs.com/package/gulp-autoprefixer
    pixrem       = require('gulp-pixrem'),         // https://www.npmjs.com/package/gulp-pixrem
    uglify       = require('gulp-uglify'),         // https://www.npmjs.com/package/gulp-uglify
    concat       = require('gulp-concat'),         // https://www.npmjs.com/package/gulp-concat
    livereload   = require('gulp-livereload'),     // https://www.npmjs.com/package/gulp-livereload
    imagemin     = require('gulp-imagemin'),       // https://www.npmjs.com/package/gulp-imagemin
    svgsymbols   = require('gulp-svg-symbols'),    // https://www.npmjs.com/package/gulp-svg-symbols
    plumber      = require('gulp-plumber'),        // https://www.npmjs.com/package/gulp-plumber
    notify       = require("gulp-notify");         // https://www.npmjs.com/package/gulp-notify



/* $. Setup: Variables
\*----------------------------------------------------------------*/

/**
 * Define base 'assets' directory
 */
var assets = 'assets/';

/**
 * Define 'app/dist' directory based on 'assets' directory
 */
var base = {
    app: [assets] + 'app/',
    dist: [assets] + 'dist/'
};

/**
 * Define paths based on 'app/dist' folders
 */
var paths = {
    app: {
        scss: [base.app] + '/scss/',
        js: [base.app] + '/js/',
        img: [base.app] + '/img/',
        icons: [base.app] + '/icons/'
    },
    dist: {
        css: [base.dist] + '/css/',
        js: [base.dist] + '/js/',
        img: [base.dist] + '/img/',
        icons: [base.dist] + '/icons'
    },
    bower: 'components/'
};



/* $. Setup: Functions
\*----------------------------------------------------------------*/

/**
 * On call, edit/change the 'notify' onError method
 */
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

    /**
     * Define source path
     */
    return gulp.src( [paths.app.scss] + '*.scss' )

        /**
         * Stop pipeline breaks onError
         */
        .pipe(plumber({ errorHandler: onError }))

        /**
         * Start source maps module
         */
        .pipe(sourcemaps.init())

        /**
         * Compile scss to css
         */
        .pipe(sass({ outputStyle: 'compressed' }))

        /**
         * Prefix needed CSS based on http://caniuse.com
         */
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }))

        /**
         * Pixel fallback for 'rem'
         */
        .pipe(pixrem('1em'))

        /**
         * Create Source Maps
         */
        .pipe(sourcemaps.write( './maps' ))

        /**
         * Define destination path
         */
        .pipe(gulp.dest( [paths.dist.css] + '' ))

        /**
         * Call livereload
         */
        .pipe(livereload())

        /**
         * Notify OS with message
         */
        .pipe(notify({
            title: 'Task finished',
            message: 'Styles',
            onLast: true
        }));
});



/* $. Task: Scripts
\*----------------------------------------------------------------*/

gulp.task('scripts', function() {

    /**
     * Define source path
     */
    return gulp.src([
        [paths.bower] + 'jquery/dist/jquery.min.js',
        [paths.app.js] + 'main.js'
    ])

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plumber({ errorHandler: onError }) )

        /**
         * Merge files
         */
        .pipe(concat('main.js'))

        /**
         * Uglify files
         */
        .pipe( uglify() )

        /**
         * Define destination path
         */
        .pipe( gulp.dest([paths.dist.js] + '') )

        /**
         * Notify OS with message
         */
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Main',
            onLast: true
        }));
});



/* $. Task: Scripts Head
\*----------------------------------------------------------------*/

gulp.task('scripts-head', function() {

    /**
     * Define source path
     */
    return gulp.src([
        [paths.app.js] + 'vendor/modernizr.js',
        [paths.app.js] + 'head.js'
    ])

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plumber({ errorHandler: onError }) )

        /**
         * Merge files
         */
        .pipe(concat('head.js'))

        /**
         * Uglify files
         */
        .pipe( uglify() )

        // Define destination path
        .pipe( gulp.dest([paths.dist.js] + '') )

        /**
         * Notify OS with message
         */
        .pipe(notify({
            title: 'Task finished',
            message: 'Scripts - Head',
            onLast: true
        }));
});



/* $. Task: Images
\*----------------------------------------------------------------*/

gulp.task('images', function () {

    /**
     * Define source path
     */
    return gulp.src( [paths.app.img] + '**/*' )

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plumber({ errorHandler: onError }) )

        /**
         * Optimise image files - .png .jpg .jpeg .gif .svg
         */
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

        /**
         * Define destination path
         */
        .pipe(gulp.dest( [paths.dist.img] + '' ))

        /**
         * Notify OS with message
         */
        .pipe(notify({
            title: 'Task finished',
            message: 'Images',
            onLast: true
        }));
});



/* $. Task: Sprites
\*----------------------------------------------------------------*/

gulp.task('sprites', function () {

    /**
     * Define source path
     */
    return gulp.src( [paths.app.icons] + '**/*.svg' )

        /**
         * Minify icons
         */
        .pipe(svgsymbols({
            className: '.icon--%f',
            title: false
        }))

        /**
         * Combine icons into <defs> block
         */
        //.pipe(svgstore())

        /**
         * Define destination path
         */
        .pipe(gulp.dest( [paths.dist.icons] + '' ))

        /**
         * Notify OS with message
         */
        .pipe(notify({
            title: 'Task finished',
            message: 'Sprites',
            onLast: true
        }));
});



/* $. Task: Watch
\*----------------------------------------------------------------*/

gulp.task('watch', function () {

    /**
     * Start Livereload
     */
    livereload.listen();

    /**
     * Watch .scss files for changes and run 'styles' task
     */
    gulp.watch( [paths.app.scss] + '**/*.scss', ['styles']);

    /**
     * Watch main.js files for changes and run 'scripts' task
     */
    gulp.watch( [paths.app.js] + 'main.js', ['scripts'] );

    /**
     * Watch head.js files for changes and run 'scripts-head' task
     */
    gulp.watch( [paths.app.js] + 'head.js', ['scripts-head'] );
});



/* $. Task: Default
\*----------------------------------------------------------------*/

gulp.task('default', function() {
    return gulp.start('styles', 'scripts', 'scripts-head');
});
