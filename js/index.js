
var Dropzone = require("dropzone"),
    Opentip = require("opentip"),
    o = require("jquery"),
    event = require("event"),
    position = require("position");


Dropzone.options.demoUpload = {
  fallback: function() {
    Dropzone.prototype.defaultOptions.fallback.call(this);
    o(this.element).append("<p>This is what the file uploads with Dropzone look like in modern browsers:<br /><img src=\"/images/preview.png\" alt=\"preview\" /></p>");
  }
};

o(function() {
  require("top")();



  if (!document.body.classList.contains("fixed-menu")) {
    var navElement = document.querySelector("nav#main"),
    navTop,
    fixedNav = false;
    
    setNavTop = function() { navTop = position(navElement).top };

    setNavTop()
    setTimeout(setNavTop, 500);

    event.bind(window, 'scroll', function() {
      var top = document.body.scrollTop;
      if (top < navTop && fixedNav) {
        navElement.classList.remove("fixed");
        fixedNav = false;
        setNavTop(); // Making sure the the top position of the nav is actually correct
      }
      else if (top > navTop && !fixedNav) {
        navElement.classList.add("fixed");
        fixedNav = true;
        setNavTop(); // Making sure the the top position of the nav is actually correct
      }
    });
  }
});

