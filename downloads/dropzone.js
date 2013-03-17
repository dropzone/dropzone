;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("dropzone/index.js", function(exports, require, module){


/**
 * Exposing dropzone
 */
module.exports = require("./lib/dropzone.js");

});
require.register("dropzone/lib/dropzone.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0

/*
#
# More info at [www.dropzonejs.com](http://www.dropzonejs.com)
# 
# Copyright (c) 2012, Matias Meno  
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
*/


(function() {
  var Dropzone, Em, camelize, contentLoaded, createElement, noop, without,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("emitter");

  noop = function() {};

  Dropzone = (function(_super) {

    __extends(Dropzone, _super);

    /*
      This is a list of all available events you can register on a dropzone object.
    
      You can register an event handler like this:
    
          dropzone.on("dragEnter", function() { });
    */


    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "selectedfiles", "addedfile", "removedfile", "thumbnail", "error", "processingfile", "uploadprogress", "sending", "success", "complete", "reset"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      parallelUploads: 2,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 2,
      thumbnailWidth: 100,
      thumbnailHeight: 100,
      params: {},
      clickable: true,
      enqueueForUpload: true,
      previewsContainer: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = createElement("<div class=\"message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      /*
          Those functions register themselves to the events on init and handle all
          the user interface specific stuff. Overwriting them won't break the upload
          but can break the way it's displayed.
          You can overwrite them if you don't like the default behavior. If you just
          want to add an additional event handler, register it on the dropzone object
          and don't overwrite those options.
      */

      drop: function(e) {
        return this.element.classList.remove("drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("drag-hover");
      },
      selectedfiles: function(files) {
        if (this.element === this.previewsContainer) {
          return this.element.classList.add("started");
        }
      },
      reset: function() {
        return this.element.classList.remove("started");
      },
      addedfile: function(file) {
        file.previewTemplate = createElement(this.options.previewTemplate);
        this.previewsContainer.appendChild(file.previewTemplate);
        file.previewTemplate.querySelector(".filename span").textContent = file.name;
        return file.previewTemplate.querySelector(".details").appendChild(createElement("<div class=\"size\">" + (this.filesize(file.size)) + "</div>"));
      },
      removedfile: function(file) {
        return file.previewTemplate.parentNode.removeChild(file.previewTemplate);
      },
      thumbnail: function(file, dataUrl) {
        file.previewTemplate.classList.remove("file-preview");
        file.previewTemplate.classList.add("image-preview");
        return file.previewTemplate.querySelector(".details").appendChild(createElement("<img alt=\"" + file.name + "\" src=\"" + dataUrl + "\"/>"));
      },
      error: function(file, message) {
        file.previewTemplate.classList.add("error");
        return file.previewTemplate.querySelector(".error-message span").textContent = message;
      },
      processingfile: function(file) {
        return file.previewTemplate.classList.add("processing");
      },
      uploadprogress: function(file, progress) {
        return file.previewTemplate.querySelector(".progress .upload").style.width = "" + progress + "%";
      },
      sending: noop,
      success: function(file) {
        return file.previewTemplate.classList.add("success");
      },
      complete: noop,
      previewTemplate: "<div class=\"preview file-preview\">\n  <div class=\"details\">\n   <div class=\"filename\"><span></span></div>\n  </div>\n  <div class=\"progress\"><span class=\"upload\"></span></div>\n  <div class=\"success-mark\"><span>✔</span></div>\n  <div class=\"error-mark\"><span>✘</span></div>\n  <div class=\"error-message\"><span></span></div>\n</div>"
    };

    function Dropzone(element, options) {
      var elementId, elementOptions, extend, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (Dropzone.forElement(this.element)) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      elementId = this.element.id;
      elementOptions = (_ref = (elementId ? Dropzone.options[camelize(elementId)] : void 0)) != null ? _ref : {};
      extend = function() {
        var key, object, objects, target, val, _i, _len;
        target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          object = objects[_i];
          for (key in object) {
            val = object[key];
            target[key] = val;
          }
        }
        return target;
      };
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.url == null) {
        this.options.url = this.element.action;
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (!Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      this.previewsContainer = this.options.previewsContainer ? createElement(this.options.previewsContainer) : this.element;
      this.init();
    }

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, _i, _len, _ref, _ref1,
        _this = this;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".message")) {
        this.element.appendChild(createElement("<div class=\"default message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.options.clickable) {
        this.hiddenFileInput = document.createElement("input");
        this.hiddenFileInput.setAttribute("type", "file");
        this.hiddenFileInput.setAttribute("multiple", "multiple");
        this.hiddenFileInput.style.display = "none";
        document.body.appendChild(this.hiddenFileInput);
        this.hiddenFileInput.addEventListener("change", function() {
          var files;
          files = _this.hiddenFileInput.files;
          if (files.length) {
            _this.emit("selectedfiles", files);
            return _this.handleFiles(files);
          }
        });
      }
      this.files = [];
      this.filesQueue = [];
      this.filesProcessing = [];
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = {
        "dragstart": function(e) {
          return _this.emit("dragstart", e);
        },
        "dragenter": function(e) {
          noPropagation(e);
          return _this.emit("dragenter", e);
        },
        "dragover": function(e) {
          noPropagation(e);
          return _this.emit("dragover", e);
        },
        "dragleave": function(e) {
          return _this.emit("dragleave", e);
        },
        "drop": function(e) {
          noPropagation(e);
          _this.drop(e);
          return _this.emit("drop", e);
        },
        "dragend": function(e) {
          return _this.emit("dragend", e);
        },
        "click": function(evt) {
          if (!_this.options.clickable) {
            return;
          }
          if (evt.target === _this.element || evt.target === _this.element.querySelector(".message")) {
            return _this.hiddenFileInput.click();
          }
        }
      };
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this.options.paramName + "\" multiple=\"multiple\" /><button type=\"submit\">Upload!</button></div>";
      fields = createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"post\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", "post");
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName("div"))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var event, listener, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (event in _ref) {
        listener = _ref[event];
        _results.push(this.element.addEventListener(event, listener, false));
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var event, listener, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (event in _ref) {
        listener = _ref[event];
        _results.push(this.element.removeEventListener(event, listener, false));
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      if (this.options.clickable) {
        this.element.classList.remove("clickable");
      }
      this.removeEventListeners();
      this.filesProcessing = [];
      return this.filesQueue = [];
    };

    Dropzone.prototype.enable = function() {
      if (this.options.clickable) {
        this.element.classList.add("clickable");
      }
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var string;
      if (size >= 100000000000) {
        size = size / 100000000000;
        string = "TB";
      } else if (size >= 100000000) {
        size = size / 100000000;
        string = "GB";
      } else if (size >= 100000) {
        size = size / 100000;
        string = "MB";
      } else if (size >= 100) {
        size = size / 100;
        string = "KB";
      } else {
        size = size * 10;
        string = "b";
      }
      return "<strong>" + (Math.round(size) / 10) + "</strong> " + string;
    };

    Dropzone.prototype.drop = function(e) {
      var files;
      if (!e.dataTransfer) {
        return;
      }
      files = e.dataTransfer.files;
      this.emit("selectedfiles", files);
      if (files.length) {
        return this.handleFiles(files);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done("File is too big (" + (Math.round(file.size / 1024 / 10.24) / 100) + "MB). Max filesize: " + this.options.maxFilesize + "MB");
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      var _this = this;
      this.files.push(file);
      this.emit("addedfile", file);
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this.createThumbnail(file);
      }
      return this.accept(file, function(error) {
        if (error) {
          return _this.errorProcessing(file, error);
        } else {
          if (_this.options.enqueueForUpload) {
            _this.filesQueue.push(file);
            return _this.processQueue();
          }
        }
      });
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.processing) {
        throw new Error("Can't remove file currently processing");
      }
      this.files = without(this.files, file);
      this.filesQueue = without(this.filesQueue, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.createThumbnail = function(file) {
      var fileReader,
        _this = this;
      fileReader = new FileReader;
      fileReader.onload = function() {
        var img;
        img = new Image;
        img.onload = function() {
          var canvas, ctx, srcHeight, srcRatio, srcWidth, srcX, srcY, thumbnail, trgHeight, trgRatio, trgWidth, trgX, trgY;
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          srcX = 0;
          srcY = 0;
          srcWidth = img.width;
          srcHeight = img.height;
          canvas.width = _this.options.thumbnailWidth;
          canvas.height = _this.options.thumbnailHeight;
          trgX = 0;
          trgY = 0;
          trgWidth = canvas.width;
          trgHeight = canvas.height;
          srcRatio = img.width / img.height;
          trgRatio = canvas.width / canvas.height;
          if (img.height < canvas.height || img.width < canvas.width) {
            trgHeight = srcHeight;
            trgWidth = srcWidth;
          } else {
            if (srcRatio > trgRatio) {
              srcHeight = img.height;
              srcWidth = srcHeight * trgRatio;
            } else {
              srcWidth = img.width;
              srcHeight = srcWidth / trgRatio;
            }
          }
          srcX = (img.width - srcWidth) / 2;
          srcY = (img.height - srcHeight) / 2;
          trgY = (canvas.height - trgHeight) / 2;
          trgX = (canvas.width - trgWidth) / 2;
          ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          return _this.emit("thumbnail", file, thumbnail);
        };
        return img.src = fileReader.result;
      };
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.filesProcessing.length;
      i = processingLength;
      while (i < parallelUploads) {
        if (!this.filesQueue.length) {
          return;
        }
        this.processFile(this.filesQueue.shift());
        i++;
      }
    };

    Dropzone.prototype.processFile = function(file) {
      this.filesProcessing.push(file);
      file.processing = true;
      this.emit("processingfile", file);
      return this.uploadFile(file);
    };

    Dropzone.prototype.uploadFile = function(file) {
      var formData, handleError, input, inputName, inputType, key, progressObj, value, xhr, _i, _len, _ref, _ref1, _ref2,
        _this = this;
      xhr = new XMLHttpRequest();
      xhr.open("POST", this.options.url, true);
      handleError = function() {
        return _this.errorProcessing(file, xhr.responseText || ("Server responded with " + xhr.status + " code."));
      };
      xhr.onload = function(e) {
        var response, _ref;
        if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
          return handleError();
        } else {
          _this.emit("uploadprogress", file, 100);
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            response = JSON.parse(response);
          }
          return _this.finished(file, response, e);
        }
      };
      xhr.onerror = function() {
        return handleError();
      };
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = function(e) {
        return _this.emit("uploadprogress", file, Math.max(0, Math.min(100, (e.loaded / e.total) * 100)));
      };
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.setRequestHeader("X-File-Name", file.name);
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      if (this.element.tagName = "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          input = _ref2[_i];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (!inputType || inputType.toLowerCase() !== "checkbox" || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      this.emit("sending", file, xhr, formData);
      formData.append(this.options.paramName, file);
      return xhr.send(formData);
    };

    Dropzone.prototype.finished = function(file, responseText, e) {
      this.filesProcessing = without(this.filesProcessing, file);
      file.processing = false;
      this.processQueue();
      this.emit("success", file, responseText, e);
      this.emit("finished", file, responseText, e);
      return this.emit("complete", file);
    };

    Dropzone.prototype.errorProcessing = function(file, message) {
      this.filesProcessing = without(this.filesProcessing, file);
      file.processing = false;
      this.processQueue();
      this.emit("error", file, message);
      return this.emit("complete", file);
    };

    return Dropzone;

  })(Em);

  Dropzone.version = "2.0.3";

  Dropzone.options = {};

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    var instance, _i, _len, _ref;
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    _ref = Dropzone.instances;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      instance = _ref[_i];
      if (instance.element === element) {
        return instance;
      }
    }
    return null;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match[1].toUpperCase();
    });
  };

  createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      try {
        root.doScroll("left");
      } catch (e) {
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  contentLoaded(window, function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (false) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      _results.push(new Dropzone(dropzone));
    }
    return _results;
  });

}).call(this);

});
require.alias("component-emitter/index.js", "dropzone/deps/emitter/index.js");

if (typeof exports == "object") {
  module.exports = require("dropzone");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("dropzone"); });
} else {
  window["Dropzone"] = require("dropzone");
}})();