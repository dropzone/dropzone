module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"


    stylus:
      options:
        compress: false
      default:
        files: [
          "downloads/css/basic.css": "downloads/css/stylus/basic.styl"
          "downloads/css/dropzone.css": "downloads/css/stylus/dropzone.styl"
        ]

    coffee:
      default:
        files:
          "lib/dropzone.js": "src/dropzone.coffee"
      test:
        files:
          "test/test.js": "test/*.coffee"

    componentbuild:
      options:
        standalone: "Dropzone"
        
      app:
        # output: "build/"
        name: "build"
        src: "."
        dest: "./build"
        # config: "component.json"
        # styles: false
        # scripts: true

    copy:
      component:
        src: "build/build.js"
        dest: "downloads/dropzone.js"

    concat:
      amd:
        src: [
          "AMD_header"
          "components/component-emitter/index.js"
          "lib/dropzone.js"
          "AMD_footer"
        ]
        dest: "downloads/dropzone-amd-module.js"

    watch:
      js:
        files: [
          "src/dropzone.coffee"
        ]
        tasks: [ "js" ]
        options: nospawn: on
      test:
        files: [
          "test/*.coffee"
        ]
        tasks: [ "coffee:test" ]
        options: nospawn: on
      css:
        files: [
          "downloads/css/stylus/*.styl"
        ]
        tasks: [ "css" ]
        options: nospawn: on

    uglify:
      js:
        files: [
          "downloads/dropzone-amd-module.min.js": "downloads/dropzone-amd-module.js"
          "downloads/dropzone.min.js": "downloads/dropzone.js"
        ]



  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-component-build"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  # Default tasks
  grunt.registerTask "default", [ "downloads" ]

  grunt.registerTask "css", "Compile the stylus files to css", [ "stylus" ]

  grunt.registerTask "js", "Compile coffeescript", [ "coffee", "componentbuild", "copy", "concat" ]

  grunt.registerTask "downloads", "Compile all stylus and coffeescript files and generate the download files", [ "js", "css", "uglify" ]
