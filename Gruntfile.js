var timer = require("grunt-timer");

module.exports = function (grunt) {
    
    // Start timer
    timer.init(grunt, {
        deferLogs: true,
        ignoreAlias: ["run"]
    });
    
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-pixrem');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-imageoptim');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-purifycss');
    grunt.loadNpmTasks('grunt-browser-sync');
    
    
    // Keep directories in variable for easy changes and CMS integration
    var dirs = {
        assets_input: 'assets/app',
        assets_output: 'assets/dist',
        components: 'components',
        modules: 'node_modules'
    };
    
    /**
     * Change this var to suit your local development url
     *
     * @type {string}
     */
    var local_url = "frontend-framework.dev";
    
    grunt.initConfig({
    
        /**
         * Load local vars
         */
        
        pkg: grunt.file.readJSON('package.json'),
        dirs: dirs,
        local_url: local_url,
    
        
        
        /**
         * Scaffold tasks
         */
        
        browserSync: {
            bsFiles: {
                src: [
                    '<%= dirs.assets_output %>/css/*.css',
                    '<%= dirs.assets_output %>/js/*.js',
                    '*.php'
                ]
            },
            options: {
                watchTask: true,
                proxy: "<%= local_url %>",
                port: 8080,
                ghostMode: false,
                online: false,
                open: false,
                notify: false
            }
        },
        watch: {
            options: {
                spawn: false,
                interrupt: true,
                reload: false,
                interval: 1000
            },
            scripts: {
                files: ['<%= dirs.assets_input %>/js/*.js'],
                tasks: ['uglify']
            },
            css: {
                files: '<%= dirs.assets_input %>/scss/**/*.scss',
                tasks: ['sass:dist','pixrem','postcss:dist']
            },
            svg: {
                files: '<%= dirs.assets_input %>/icons/*.svg',
                tasks: ['svgmin','grunticon']
            }
        },
    
        
        
        /**
         * Sass
         */
        
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    '<%= dirs.assets_output %>/css/styles.css': [
                        '<%= dirs.assets_input %>/scss/styles.scss'
                    ],
                    '<%= dirs.assets_output %>/css/ie.css': [
                        '<%= dirs.assets_input %>/scss/ie.scss'
                    ],
                    '<%= dirs.assets_output %>/css/print.css': [
                        '<%= dirs.assets_input %>/scss/print.scss'
                    ]
                }
            }
        },
        purifycss: {
            options: {
                whitelist: ['*test--*', '*lt-ie9*', '*grid*', '*icon*', '.select'],
                minify: false
            },
            target: {
                src: ['**/**.php'],
                css: ['<%= dirs.assets_output %>/css/styles.css'],
                dest: '<%= dirs.assets_output %>/css/styles.css'
            }
        },
        pixrem: {
            options: {
                replace: true,
                rootvalue: '1em'
            },
            dist: {
                src: '<%= dirs.assets_output %>/css/ie.css',
                dest: '<%= dirs.assets_output %>/css/ie.css'
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')()
                ],
                map: true
            },
            dist: {
                expand: true,
                flatten: true,
                src: '<%= dirs.assets %>/css/*.css',
                dest: '<%= dirs.assets %>/css/'
            }
        },
    
        
        
        /**
         * Javascript
         */
        
        uglify: {
            scripts: {
                options: {
                    compress: true,
                    sourceMap: true,
                    preserveComments: 'some',
                    screwIE8: false,
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    '<%= dirs.assets_output %>/js/main.min.js': [
                        '<%= dirs.assets_input %>/js/partials/custom-select.js',
                        '<%= dirs.assets_input %>/js/main.js'
                    ],
                    '<%= dirs.assets_output %>/js/head.min.js': [
                        '<%= dirs.assets_input %>/js/vendor/modernizr.js',
                        '<%= dirs.assets_output %>/grunticon/grunticon.loader.js',
                        '<%= dirs.modules %>/jquery/dist/jquery.js',
                        '<%= dirs.assets_input %>/js/head.js'
                    ]
                }
            }
        },
    
        
        
        /**
         * SVGs
         */
        
        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    },
                    {
                        removeUselessStrokeAndFill: false
                    },
                    {
                        removeAttrs: {
                            attrs: ['xmlns']
                        }
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
                    cwd: '<%= dirs.assets_input %>/icons',
                    src: ['*.svg'],
                    dest: '<%= dirs.assets_input %>/icons',
                    ext: '.svg'
                }]
            }
        },
        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.assets_input %>/icons',
                    src: ['*.svg', '*.png'],
                    dest: "<%= dirs.assets_output %>/grunticon"
                }],
                options: {
                    loadersnippet: "grunticon.loader.js",
                    cssprefix: ".icon--",
                    compressPNG: true
                }
            }
        },
    
        
        
        /**
         * Image Optimisation
         */
        
        imageoptim: {
            src: '<%= dirs.assets_output %>/img',
            options: {
                quitAfter: true
            }
        }
        
    });
    
    // Register above tasks
    grunt.registerTask(
        'default',
        [
            // Sass
            'sass:dist',
            'purifycss',
            'postcss',
            'pixrem',
            'svgmin',
            'grunticon',
            'imageoptim',
            'uglify'
        ]
    );
    
    grunt.registerTask(
        'run',
        [
            'browserSync',
            'watch'
        ]
    );
    
};
