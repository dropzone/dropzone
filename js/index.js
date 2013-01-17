
var Dropzone = require("dropzone"),
    Opentip = require("opentip"),
    o = require("jquery");

Dropzone.options.demoUpload = {
};


o(function() {
  new Opentip("#opentip-demo", "Hi, I'm an Opentip", { style: "dark" });
});
