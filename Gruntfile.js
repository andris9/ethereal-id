'use strict';

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            all: ['index.js', 'test/**/*.js', 'Gruntfile.js']
        },

        nodeunit: {
            all: ['test/**/*-test.js']
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Tasks
    grunt.registerTask('default', ['eslint', 'nodeunit']);
};
