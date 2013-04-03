module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"


    stylus:
      options:
        compress: false
      default:
        paths: [ "node_modules/nib/lib/" ]
        files: [
          "downloads/css/basic.css": "downloads/css/stylus/basic.styl"
          "downloads/css/dropzone.css": "downloads/css/stylus/dropzone.styl"
        ]

    coffee:
      default:
        files:
          "lib/dropzone.js": "src/dropzone.coffee"


    component:
      app:
        output: "build/"
        name: "build"
        config: "component.json"
        styles: false
        scripts: true
        standalone: "Dropzone"

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



    # watch:
    #   shop:
    #     files: "public_src/js/shop/**/*.coffee"
    #     tasks: [ "shop" ]
    #     options: nospawn: on
    #   admin:
    #     files: "public_src/js/admin/**/*.coffee"
    #     tasks: [ "admin" ]
    #     options: nospawn: on
    #   css:
    #     files: [ "public_src/css/**/*.styl", "public_src/css/**/*.css" ]
    #     tasks: [ "css" ]
    #     options: nospawn: on



  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-component-build"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"

  # Default tasks
  grunt.registerTask "default", [ "coffee" ]

  grunt.registerTask "css", [ "stylus" ]

  grunt.registerTask "downloads", [ "coffee", "stylus", "component", "copy", "concat" ]
