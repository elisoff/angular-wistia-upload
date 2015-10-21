module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-karma'); 
	grunt.loadNpmTasks('grunt-html2js');
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
		html2js:{
			main: {
				src: ['wistia-upload.html'],
				dest: 'template.js'
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
                        'bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload.js',
                        'bower_components/blueimp-file-upload/js/jquery.fileupload-angular.js',
                        '*.js',
                        'test/**/*.js'
                    ]   
                }
            }
        }
    });
 

    grunt.registerTask('server', ['serve']);

    grunt.registerTask('template', ['html2js']);

    grunt.registerTask('test', [  
        'jshint',
		'html2js',
        'karma'
    ]);
};