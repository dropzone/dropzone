//var smoosh = require('smoosh'); //<-- run from npm
var smoosh = require('../../'); //<-- run from repo

smoosh
  .config('./config.json')
  .clean() //removes dist directory
  .run() //runs jshint on full build
  .build() //builds both uncompressed and compressed files
  .analyze() //analyzes all
