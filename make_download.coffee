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
dependency = """"component/jquery": "*","""

targetFilename = "#{__dirname}/downloads/dropzone.js"


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
exec "component install && component build", (err) ->
  if err
    console.error err
  else
    # Move the build in the right place
    fs.rename "#{__dirname}/build/build.js", targetFilename

  applyBackup()