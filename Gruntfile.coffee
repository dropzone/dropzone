module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"


    stylus:
      options:
        compress: false
      default:
        files: [
          "css/general.css": "css/_stylus/general.styl"
        ]

    # coffee:
    #   default:
    #     expand: true
    #     options:
    #       bare: true
    #     cwd: "src/"
    #     src: [ "*.coffee" ]
    #     dest: "lib/"
    #     ext: ".js"

    #   test:
    #     files:
    #       "test/test.js": "test/src/*.coffee"

    watch:
      css:
        files: "css/_stylus/*.styl"
        tasks: [ "css" ]
        options: nospawn: on


    # curl:
    #   ".tmp-excanvas.js": "https://raw.github.com/enyo/excanvas/master/index.js"
    #   ".tmp-classlist.js": "https://raw.github.com/eligrey/classList.js/master/classList.js"
    #   ".tmp-addeventlistener.js": "https://gist.github.com/raw/4684216/c58a272ef9d9e0f55ea5e90ac313e3a3b2f2b7b3/eventListener.polyfill.js"

    # clean:
    #   tmp: ".tmp-*"

    # concat:
    #   js:
    #     files:
    #       "downloads/opentip-jquery.js": [ "lib/opentip.js", "lib/adapter-jquery.js" ]
    #       "downloads/opentip-jquery-excanvas.js": [ "downloads/opentip-jquery.js", ".tmp-excanvas.js" ]

    #       "downloads/opentip-prototype.js": [ "lib/opentip.js", "lib/adapter-prototype.js" ]
    #       "downloads/opentip-prototype-excanvas.js": [ "downloads/opentip-prototype.js", ".tmp-excanvas.js" ]

    #       "downloads/opentip-native.js": [ "lib/opentip.js", "lib/adapter-native.js", ".tmp-classlist.js", ".tmp-addeventlistener.js" ]
    #       "downloads/opentip-native-excanvas.js": [ "downloads/opentip-native.js", ".tmp-excanvas.js" ]


    # uglify:
    #   options:
    #     banner: """
    #             // Opentip v2.4.6-dev
    #             // Copyright (c) 2009-2012
    #             // www.opentip.org
    #             // MIT Licensed

    #             """
    #   js:
    #     files: [
    #       "downloads/opentip-jquery.min.js": "downloads/opentip-jquery.js"
    #       "downloads/opentip-jquery-excanvas.min.js": "downloads/opentip-jquery-excanvas.js"
    #       "downloads/opentip-prototype.min.js": "downloads/opentip-prototype.js"
    #       "downloads/opentip-prototype-excanvas.min.js": "downloads/opentip-prototype-excanvas.js"
    #       "downloads/opentip-native.min.js": "downloads/opentip-native.js"
    #       "downloads/opentip-native-excanvas.min.js": "downloads/opentip-native-excanvas.js"
    #     ]


  # grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  # grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  # grunt.loadNpmTasks "grunt-contrib-uglify"
  # grunt.loadNpmTasks "grunt-contrib-clean"

  # Default tasks
  grunt.registerTask "default", [ "css" ]

  grunt.registerTask "css", "Compile the stylus files to css", [ "stylus" ]

  grunt.registerTask "js", "Compile coffeescript and create all download files", [ "coffee" ]

  grunt.registerTask "downloads", [ "css", "js", "curl", "concat", "clean", "uglify" ]
