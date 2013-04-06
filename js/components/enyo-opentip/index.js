// Copyright (c) 2012 Matias Meno <m@tias.me>


// The index.js file for component
var Opentip = require("./lib/opentip.js");


var Adapter = require("./lib/adapter-component.js");

// Add the adapter to the list
Opentip.addAdapter(new Adapter());


// Exposing the Opentip class
module.exports = Opentip;