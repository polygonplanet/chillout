/* jshint node: true */
'use strict';

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  var startYear = '2016';
  var thisYear = grunt.template.today('yyyy');
  var vars = {
    years: thisYear === startYear ? startYear : startYear + '-' + thisYear
  };
  var banner = [
    '/*!',
    ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>',
    ' * Copyright (c) <%= vars.years %> <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');

  grunt.util.linefeed = '\n';

  grunt.initConfig({
    pkg: pkg,
    vars: vars,
    browserify: {
      dist: {
        options: {
          banner: banner,
          transform: [['babelify', { presets: ['es2015'] }]],
          browserifyOptions: {
            standalone: pkg.name,
            bundleExternal: false,
            // --bare cli option
            builtins: false,
            commondir: false,
            detectGlobals: false,
            igv: [
              '__filename',
              '__dirname'
            ]
          }
        },
        src: ['./src/index.js'],
        dest: './dist/chillout.js'
      }
    },
    uglify: {
      dist: {
        options: {
          ASCIIOnly: true,
          maxLineLen: 8000,
          banner: banner
        },
        files: {
          './dist/chillout.min.js': './dist/chillout.js'
        }
      }
    },
    watch: {
      browserify: {
        files: ['./src/**/*.js'],
        tasks: ['browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify', 'uglify']);
};
