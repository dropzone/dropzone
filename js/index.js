
var Dropzone = require("dropzone"),
    Opentip = require("opentip"),
    o = require("jquery");

Dropzone.options.demoUpload = {
  fallback: function() {
    Dropzone.prototype.defaultOptions.fallback.call(this);
    this.element.append("<p>This is what the file uploads with Dropzone look like in modern browsers:<br /><img src=\"/images/preview.png\" alt=\"preview\" /></p>");
  }
};


o(function() {
  new Opentip("#opentip-demo", "Hi, I'm an Opentip", { style: "dark" });

  var dropzone = o("#demo-upload").data("dropzone");
});
