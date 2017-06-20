module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),


    sass: {
      options: {
        sourcemap: 'none'
      },

      default: {
        files: [{
          "dist/basic.css": "src/basic.scss",
          "dist/dropzone.css": "src/dropzone.scss"
        }]
      },
      compressed: {
        options: {
          style: 'compressed'
        },
        files: [{
          "dist/min/basic.min.css": "src/basic.scss",
          "dist/min/dropzone.min.css": "src/dropzone.scss"
        }]
      }
    },
    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          "dist/dropzone.js": "src/dropzone.js"
        }
      }
    },
    concat: {
      amd: {
        src: [
          "tool/AMD_header",
          "dist/dropzone.js",
          "tool/AMD_footer"
        ],
        dest: "dist/dropzone-amd-module.js"
      }
    },

    watch: {
      js: {
        files: [
          "src/dropzone.js"
        ],
        tasks: ["js"],
        options: {
          nospawn: true
        }
      },
      css: {
        files: [
          "src/*.scss"
        ],
        tasks: ["css"],
        options: {
          nospawn: true
        }
      }
    },

    uglify: {
      js: {
        files: [{
          "dist/min/dropzone-amd-module.min.js": "dist/dropzone-amd-module.js",
          "dist/min/dropzone.min.js": "dist/dropzone.js"
        }]
      }
    }
  });


  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default tasks
  grunt.registerTask("default", ["downloads"]);

  grunt.registerTask("css", "Compile the sass files to css", ["sass"]);

  grunt.registerTask("js", "Compile ES6", ["babel", "concat"]);

  grunt.registerTask("downloads", "Compile all stylus and javascript files and generate the download files", ["js", "css", "uglify"]);

  grunt.registerTask("build-website", "Builds the website", function () {
    grunt.util.spawn({cmd: 'node', args: ['tool/build_configuration_doc.js']});
    grunt.util.spawn({cmd: 'node', args: ['tool/build_site_from_readme.js']});
  });
};
