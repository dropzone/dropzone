
var Dropzone = require("dropzone"),
    Opentip = require("opentip"),
    o = require("jquery");

Dropzone.options.demoUpload = {
  addRemoveLinks: true,
  fallback: function() {
    Dropzone.prototype.defaultOptions.fallback.call(this);
    o(this.element).append("<p>This is what the file uploads with Dropzone look like in modern browsers:<br /><img src=\"/images/preview.png\" alt=\"preview\" /></p>");
  }
};

