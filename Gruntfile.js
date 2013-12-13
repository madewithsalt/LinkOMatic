module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: true,
        compress: true
      },
      dist: {
        files: {
          'min/<%= pkg.name %>.min.js': ['src/plugin.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['uglify']);

};