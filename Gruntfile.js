module.exports = function( grunt ) {

    // Only use quiet mode if param entered.
    if (grunt.option('q') || grunt.option('quiet')) {
        require('quiet-grunt');
    }

    // Load NPM tasks
    grunt.loadNpmTasks( 'grunt-notify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-pixrem' );
    grunt.loadNpmTasks( 'grunt-postcss' );
    grunt.loadNpmTasks( 'grunt-imageoptim' );
    grunt.loadNpmTasks( 'grunt-svgmin' );
    grunt.loadNpmTasks( 'grunt-grunticon' );
    grunt.loadNpmTasks( 'grunt-sass' );

    // Keep directories in variable for easy changes and CMS integration
    var dirs = {
        assets: 'assets',
        components: 'components',
        modules: 'node_modules'
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        dirs: dirs,

        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 3, // maximum number of notifications from jshint output
                duration: 0.5 // the duration of notification in seconds, for `notify-send only
            }
        },

        // Uglify [and Minify] Javascript
        uglify: {
            scripts: {
                options: {
                    compress: true,
                    sourceMap: true,
                    preserveComments: false,
                },
                files: {
                    '<%= dirs.assets %>/js/min/main.min.js': [
                        '<%= dirs.assets %>/grunticon/grunticon.loader.js',
                        '<%= dirs.assets %>/js/main.js'
                    ],
                    '<%= dirs.assets %>/js/min/head.min.js': [
                        '<%= dirs.modules %>/js/vendors/jquery.js',
                        '<%= dirs.assets %>/js/vendors/modernizr.js',
                        '<%= dirs.assets %>/js/head.js'
                    ]
                }
            }
        },

        // Compile Sass
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    '<%= dirs.assets %>/css/style.css': '<%= dirs.assets %>/scss/styles.scss',
                    '<%= dirs.assets %>/css/ie.css': '<%= dirs.assets %>/scss/ie.scss'
                }
            }
        },

        // Fallback for rem's
        pixrem: {
            options: {
                rootvalue: '1em'
            },
            dist: {
                files: {
                    '<%= dirs.assets %>/css/styles.css': ['<%= dirs.assets %>/css/styles.css'],
                    '<%= dirs.assets %>/css/ie.css': ['<%= dirs.assets %>/css/ie.css']
                }
            }
        },

        // Autoprefix .css files
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: [ 'last 2 versions', 'ie 8', 'ie 9', 'Firefox ESR', 'Opera 12.1' ],
                        remove: false
                    })
                ],
                map: true
            },
            dist: {
                expand: true,
                flatten: true,
                src: [
                    '<%= dirs.assets %>/css/styles.css',
                    '<%= dirs.assets %>/css/ie.css',
                ],
                dest: '<%= dirs.assets %>/css'
            }
        },

        // Optimise Images
        imageoptim: {
            src: '<%= dirs.assets %>/img',
            options: {
                quitAfter: true
            }
        },

        // Minify .svg files
        svgmin: {
            options: {
                plugins:[
                    {
                        removeViewBox: false
                    },
                    {
                        removeUselessStrokeAndFill: false
                    },
                    {
                        convertPathData: {
                            straightCurves: false
                        }
                    }
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.assets %>/img',
                    src: [ '**/*.svg' ],
                    dest: '<%= dirs.assets %>/img',
                    ext: '.svg'
                }]
            }
        },

        // Generate SVG/PNG icons + fallback
        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.assets %>/img/icons',
                    src: [ '*.svg', '*.png' ],
                    dest: "<%= dirs.assets %>/grunticon"
                }],
                options: {
                    loadersnippet: "grunticon.loader.js",
                    cssprefix: ".icon--"
                }
            }
        },

        // Watch Task
        watch: {
            scripts: {
                files: [ '<%= dirs.assets %>/js/*.js' ],
                tasks: [ 'uglify', 'notify:uglify' ],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            css: {
                files: '<%= dirs.assets %>/scss/**/*.scss',
                tasks: [ 'sass:dist', 'pixrem:dist', 'postcss:dist', 'notify:sass' ],
                options: {
                    livereload: true
                }
            },
            svg: {
                files: '<%= dirs.assets %>/img/icons/*.svg',
                tasks: [ 'svgmin', 'grunticon', 'sass:dist' ],
                options: {
                    livereload: true
                }
            }
        },

        notify: {
            uglify: {
                options: {
                    message: "Javascript compiled and minified successfully"
                }
            },
            sass: {
                options: {
                    message: 'CSS compiled and minified successfully'
                }
            }
        },
    });

    // Register above tasks
    grunt.registerTask(
        'default',
        [
            'svgmin',
            'grunticon',
            'imageoptim',
            'sass:dist',
            'pixrem:dist',
            'postcss',
            'uglify'
        ]
    );

    // This is required if you use any options.
    grunt.task.run('notify_hooks');
}
