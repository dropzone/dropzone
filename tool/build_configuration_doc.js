/**
 * This file builds the configuration documentation for the website, from the actual source file
 */

const fs = require('fs');

var data = fs.readFileSync('src/dropzone.coffee', "utf8");

// Get the content between `defaultOptions:` and `# END OPTIONS`

console.log(data);