module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-karma'); 
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            files: ['*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        serve: {
            options: {
                port: 8282
            }
        },
        karma: {  
            unit: {
                options: {
                    frameworks: ['jasmine'],
                    singleRun: true,
                    browsers: ['PhantomJS'],
                    files: [
                        'bower_components/angular/angular.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload-angular.js',
                        '*.js',
                        'test/**/*.js'
                    ]   
                }
            }
        }
    });
 

    grunt.registerTask('server', ['serve']);

    grunt.registerTask('test', [  
        'jshint',
        'karma'
    ]);
};