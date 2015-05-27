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
 * $. Sprites
 * $. Watch
 * $. Default
 *
 */



/* $. Required Packages
\*----------------------------------------------------------------*/

var gulp         = require('gulp'),                // https://www.npmjs.com/package/gulp
    plugins      = require('gulp-load-plugins')(); // https://www.npmjs.com/package/gulp-load-plugins

var autoprefixer = require('autoprefixer-core');   // https://www.npmjs.com/package/gulp-autoprefixer



/* $. Variables
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



/* $. Functions
\*----------------------------------------------------------------*/

/**
 * On call, edit/change the 'notify' onError method
 */
var onError = function(err) {
    plugins.notify.onError({
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

    /**
     * Define source path
     */
    return gulp.src( [paths.app.scss] + '*.scss' )

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plugins.plumber({ errorHandler: onError }) )

        /**
         * Start source maps module
         */
        .pipe( plugins.sourcemaps.init() )

        /**
         * Compile scss to css
         */
        .pipe( plugins.sass({ outputStyle: 'compressed' }) )

        /**
         * Prefix needed CSS based on http://caniuse.com
         */
        .pipe(
            plugins.postcss([
                autoprefixer({
                    browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
                    cascade: false
                })
            ])
        )

        /**
         * Pixel fallback for 'rem'
         */
        .pipe( plugins.pixrem('1em') )

        /**
         * Create Source Maps
         */
        .pipe( plugins.sourcemaps.write( './maps' ) )

        /**
         * Define destination path
         */
        .pipe( gulp.dest( [paths.dist.css] + '' ) )

        /**
         * Call livereload
         */
        .pipe( plugins.livereload() )

        /**
         * Notify OS with message
         */
        .pipe(
            plugins.notify({
                title: 'Task finished',
                message: 'Styles',
                onLast: true
            })
        );
});



/* $. Scripts
\*----------------------------------------------------------------*/

gulp.task('scripts', function() {

    /**
     * Define source path
     */
    return gulp.src([
        [paths.app.js] + 'main.js'
    ])

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plugins.plumber({ errorHandler: onError }) )

        /**
         * Merge files
         */
        .pipe( plugins.concat('main.js') )

        /**
         * Uglify files
         */
        .pipe( plugins.uglify() )

        /**
         * Define destination path
         */
        .pipe( gulp.dest([paths.dist.js] + '') )

        /**
         * Notify OS with message
         */
        .pipe(
            plugins.notify({
                title: 'Task finished',
                message: 'Scripts - Main',
                onLast: true
            })
        );
});



/* $. Scripts Head
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
        .pipe( plugins.plumber({ errorHandler: onError }) )

        /**
         * Merge files
         */
        .pipe( plugins.concat('head.js') )

        /**
         * Uglify files
         */
        .pipe( plugins.uglify() )

        /**
         * Define destination path
         */
        .pipe( gulp.dest([paths.dist.js] + '') )

        /**
         * Notify OS with message
         */
        .pipe(
            plugins.notify({
                title: 'Task finished',
                message: 'Scripts - Head',
                onLast: true
            })
        );
});



/* $. Images
\*----------------------------------------------------------------*/

gulp.task('images', function () {

    /**
     * Define source path
     */
    return gulp.src( [paths.dist.img] + '**/*' )

        /**
         * Stop pipeline breaks onError
         */
        .pipe( plugins.plumber({ errorHandler: onError }) )

        /**
         * Optimise image files - .png .jpg .jpeg .gif .svg
         */
        .pipe( plugins.imageoptim.optimize() )

        /**
         * Define destination path
         */
        .pipe( gulp.dest( [paths.dist.img] + '' ) )

        /**
         * Notify OS with message
         */
        .pipe(
            plugins.notify({
                title: 'Task finished',
                message: 'Images',
                onLast: true
            })
        );
});



/* $. Sprites
\*----------------------------------------------------------------*/

gulp.task('sprites', function () {

    /**
     * Define source path
     */
    return gulp.src( [paths.app.icons] + '**/*.svg' )

        /**
         * Combine icons into <symbols> within one .svg file
         */
        .pipe(
            plugins.svgSymbols({
                className: '.icon--%f',
                title: false
            })
        )

        /**
         * Define destination path
         */
        .pipe( gulp.dest( [paths.dist.icons] + '' ) )

        /**
         * Notify OS with message
         */
        .pipe(
            plugins.notify({
                title: 'Task finished',
                message: 'Sprites',
                onLast: true
            })
        );
});



/* $. Watch
\*----------------------------------------------------------------*/

gulp.task('watch', function () {

    /**
     * Start Livereload
     */
    plugins.livereload.listen();

    /**
     * Watch .scss files for changes and run 'styles' task
     */
    gulp.watch( [paths.app.scss] + '**/*.scss', ['styles'] );

    /**
     * Watch main.js files for changes and run 'scripts' task
     */
    gulp.watch( [paths.app.js] + 'main.js', ['scripts'] );

    /**
     * Watch head.js files for changes and run 'scripts-head' task
     */
    gulp.watch( [paths.app.js] + 'head.js', ['scripts-head'] );

    /**
     * Watch head.js files for changes and run 'scripts-head' task
     */
    gulp.watch( [paths.app.icons] + '**/*.svg', ['sprites'] );
});



/* $. Default
\*----------------------------------------------------------------*/

gulp.task('default', function() {

    /**
     * Call tasks to be run on 'gulp' or 'gulp start'
     */
    return gulp.start( 'styles', 'scripts', 'scripts-head', 'sprites' );
});
