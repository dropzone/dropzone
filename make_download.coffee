#!/usr/bin/env coffee


fs = require "fs"
{exec} = require "child_process"

# For the standalone package, I don't want to include jQuery, since it's probably
# already in use in the app.
# So I create an ad hoc component.json without jquery, build it, and revert the
# component.json file.

# Setup
backupComponentFilename = "#{__dirname}/.component.jsonSAVE"
componentFilename = "#{__dirname}/component.json"
dropzoneFilename = "#{__dirname}/lib/dropzone.js"
emitterFilename = "#{__dirname}/components/component-emitter/index.js"
dependency = """"component/jquery": "*","""

targetFilename = "#{__dirname}/downloads/dropzone.js"
AMDFilename = "#{__dirname}/downloads/dropzone-amd-module.js"


applyBackup = -> fs.renameSync backupComponentFilename, componentFilename


# Get the component.json file contents
componentJson = fs.readFileSync "#{componentFilename}", "utf8"

# Make a backup of it
fs.writeFileSync "#{backupComponentFilename}", componentJson

# Remove the jQuery dependency
componentJson = componentJson.replace dependency, ""
# and save it
fs.writeFileSync "#{componentFilename}", componentJson

# Build the component
exec "component install && component build -s Dropzone", (err) ->

  dropzoneContent = fs.readFileSync dropzoneFilename, "utf8"
  emitterContent = fs.readFileSync emitterFilename, "utf8"

  AMDContent =  """
                // Uses AMD or browser globals to create a jQuery plugin.
                (function (factory) {
                  if (typeof define === 'function' && define.amd) {
                      // AMD. Register as an anonymous module.
                      define(['jquery'], factory);
                  } else {
                      // Browser globals
                      factory(jQuery);
                  }
                } (function (jQuery) {
                    var module = { exports: { } }; // Fake component
                    #{emitterContent}
                    #{dropzoneContent}
                    return module.exports;
                }));
                """

  fs.writeFileSync AMDFilename, AMDContent

  if err
    console.error err
  else
    # Move the build in the right place
    fs.rename "#{__dirname}/build/build.js", targetFilename

  applyBackup()