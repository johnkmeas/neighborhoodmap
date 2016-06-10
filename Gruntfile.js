module.exports = function(grunt) {

  // Project configuration.
grunt.initConfig({
  concat: {
    js: {
      src: ['js/knockout.js', 'js/app2.js'],
      dest: 'dist/js.concat.js',
    },
  },
  uglify: {
      js: {
        src: ['dist/js.concat.js'],
        dest: 'dist/js.min.js',
      },
  },
  cssmin: {
    css: {
      src: ['css/style.css'],
      dest: 'dist/style.min.css',
    },
  },
  watch: {
    js: {
      // js/**/*.js means any file ending in js and inside js folder
      files: ['js/**/*.js'],
      tasks: ['concat:js', 'uglify:js'],
    },
    css: {
      files: ['css/**/*.css'],
      tasks: ['cssmin:css'],
    },
  },
});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // run grunt default
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);
};


// Concat
// npm install grunt-contrib-concat --save-dev
// grunt.loadNpmTasks('grunt-contrib-concat');

// Uglify
// npm install grunt-contrib-uglify --save-dev
// grunt.loadNpmTasks('grunt-contrib-uglify');

// cssmin
// npm install grunt-contrib-cssmin --save-dev
// grunt.loadNpmTasks('grunt-contrib-cssmin');

// watch
// npm install grunt-contrib-watch --save-dev
// grunt.loadNpmTasks('grunt-contrib-watch');
