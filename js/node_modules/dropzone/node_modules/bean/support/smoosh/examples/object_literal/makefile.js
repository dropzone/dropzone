//var smoosh = require('smoosh'); //<-- run from npm
var smoosh = require('../../'); // <-- run from local repo

smoosh.make({
  "VERSION": "0.0.1",
  "JSHINT_OPTS": { "boss": true, "forin": true, "browser": true },
  "JAVASCRIPT": {
    "base": [ "./src/header.js", "./src/script.js" ],
    "secondary": [ "./src/foo.js", "./src/foo.bar.js", "./src/foo.bar.baz.js" ]
  }
});
