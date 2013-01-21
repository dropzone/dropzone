
var Dropzone = require("dropzone"),
    Opentip = require("opentip"),
    o = require("jquery");

Dropzone.options.demoUpload = {
  fallback: function() {
    this.element.addClass("browser-not-supported");
    this.element.find(".message span").html("Your browser does not support drag'n'drop file uploads.");
    this.element.append("<p>Sadly your dusty browser does not support nice drag'n'drop file uploads.<br />Please use the fallback form below to upload your files like in the olden days.</p>");
    this.element.append(this.getFallbackForm());
    this.element.append("<p>This is what your file upload should look like:<br /><img src=\"/images/preview.png\" alt=\"preview\" /></p>");
  }
};


o(function() {
  new Opentip("#opentip-demo", "Hi, I'm an Opentip", { style: "dark" });

  var dropzone = o("#demo-upload").data("dropzone");
  dropzone.on("fallback", function() {
    console.log("HI");
    this.element.append("bla");
  });
});
