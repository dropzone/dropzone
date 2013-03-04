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
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
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
  var Dropzone, Em, camelize, o, without,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  o = typeof jQuery !== "undefined" && jQuery !== null ? jQuery : require("jquery");

  Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("emitter");

  Dropzone = (function(_super) {

    __extends(Dropzone, _super);

    Dropzone.prototype.version = "1.3.10";

    /*
      This is a list of all available events you can register on a dropzone object.
    
      You can register an event handler like this:
    
          dropzone.on("dragEnter", function() { });
    */


    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "selectedfiles", "addedfile", "removedfile", "thumbnail", "error", "processingfile", "uploadprogress", "sending", "success", "complete", "reset"];

    Dropzone.prototype.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

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
      accept: function(file, done) {
        return done();
      },
      fallback: function() {
        this.element.addClass("browser-not-supported");
        this.element.find(".message").removeClass("default");
        this.element.find(".message span").html("Your browser does not support drag'n'drop file uploads.");
        this.element.append("Please use the fallback form below to upload your files like in the olden days.</p>");
        return this.element.append(this.getFallbackForm());
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
        return this.element.removeClass("drag-hover");
      },
      dragstart: o.noop,
      dragend: function(e) {
        return this.element.removeClass("drag-hover");
      },
      dragenter: function(e) {
        return this.element.addClass("drag-hover");
      },
      dragover: function(e) {
        return this.element.addClass("drag-hover");
      },
      dragleave: function(e) {
        return this.element.removeClass("drag-hover");
      },
      selectedfiles: function(files) {
        if (this.element.is(this.previewsContainer)) {
          return this.element.addClass("started");
        }
      },
      reset: function() {
        return this.element.removeClass("started");
      },
      addedfile: function(file) {
        file.previewTemplate = o(this.options.previewTemplate);
        this.previewsContainer.append(file.previewTemplate);
        file.previewTemplate.find(".filename span").text(file.name);
        return file.previewTemplate.find(".details").append(o("<div class=\"size\">" + (this.filesize(file.size)) + "</div>"));
      },
      removedfile: function(file) {
        return file.previewTemplate.remove();
      },
      thumbnail: function(file, dataUrl) {
        file.previewTemplate.removeClass("file-preview").addClass("image-preview");
        return file.previewTemplate.find(".details").append(o("<img alt=\"" + file.name + "\" src=\"" + dataUrl + "\"/>"));
      },
      error: function(file, message) {
        file.previewTemplate.addClass("error");
        return file.previewTemplate.find(".error-message span").text(message);
      },
      processingfile: function(file) {
        return file.previewTemplate.addClass("processing");
      },
      uploadprogress: function(file, progress) {
        return file.previewTemplate.find(".progress .upload").css({
          width: "" + progress + "%"
        });
      },
      sending: o.noop,
      success: function(file) {
        return file.previewTemplate.addClass("success");
      },
      complete: o.noop,
      previewTemplate: "<div class=\"preview file-preview\">\n  <div class=\"details\">\n   <div class=\"filename\"><span></span></div>\n  </div>\n  <div class=\"progress\"><span class=\"upload\"></span></div>\n  <div class=\"success-mark\"><span>✔</span></div>\n  <div class=\"error-mark\"><span>✘</span></div>\n  <div class=\"error-message\"><span></span></div>\n</div>"
    };

    function Dropzone(element, options) {
      var elementId, elementOptions, extend, _ref;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.element = o(element);
      if (this.element.length !== 1) {
        throw new Error("You can only instantiate dropzone on a single element.");
      }
      if (this.element.data("dropzone")) {
        throw new Error("Dropzone already attached.");
      }
      this.element.data("dropzone", this);
      elementId = this.element.attr("id");
      elementOptions = (_ref = (elementId ? Dropzone.options[camelize(elementId)] : void 0)) != null ? _ref : {};
      this.elementTagName = this.element.get(0).tagName;
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
        this.options.url = this.element.attr("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      this.previewsContainer = this.options.previewsContainer ? o(this.options.previewsContainer) : this.element;
      this.init();
    }

    Dropzone.prototype.init = function() {
      var capableBrowser, regex, _i, _len, _ref, _ref1,
        _this = this;
      if (this.elementTagName === "form" && this.element.attr("enctype") !== "multipart/form-data") {
        this.element.attr("enctype", "multipart/form-data");
      }
      if (this.element.hasClass("dropzone") && this.element.find(".message").length === 0) {
        this.element.append(o("<div class=\"default message\"><span>Drop files here to upload</span></div>"));
      }
      capableBrowser = true;
      if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData) {
        _ref = this.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      } else {
        capableBrowser = false;
      }
      if (!capableBrowser) {
        return this.options.fallback.call(this);
      }
      if (this.options.clickable) {
        this.element.addClass("clickable");
        this.hiddenFileInput = o("<input type=\"file\" multiple />");
        this.element.click(function(evt) {
          var target;
          target = o(evt.target);
          if (target.is(_this.element) || target.is(_this.element.find(".message"))) {
            return _this.hiddenFileInput.click();
          }
        });
        this.hiddenFileInput.change(function() {
          var files;
          files = _this.hiddenFileInput.get(0).files;
          _this.emit("selectedfiles", files);
          if (files.length) {
            return _this.handleFiles(files);
          }
        });
      }
      this.files = [];
      this.filesQueue = [];
      this.filesProcessing = [];
      this.URL = (_ref1 = window.URL) != null ? _ref1 : window.webkitURL;
      return this.setupEventListeners();
    };

    Dropzone.prototype.getFallbackForm = function() {
      var fields;
      fields = o("<div class=\"fallback-elements\"><input type=\"file\" name=\"" + this.options.paramName + "\" multiple=\"multiple\" /><button type=\"submit\">Upload!</button></div>");
      if (this.elementTagName !== "FORM") {
        fields = o("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"post\"></form>").append(fields);
      } else {
        if (!this.element.attr("enctype")) {
          this.element.attr("enctype", "multipart/form-data");
        }
        if (!this.element.attr("method")) {
          this.element.attr("method", "post");
        }
      }
      return fields;
    };

    Dropzone.prototype.setupEventListeners = function() {
      var eventName, noPropagation, _i, _len, _ref,
        _this = this;
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        eventName = _ref[_i];
        this.on(eventName, this.options[eventName]);
      }
      noPropagation = function(e) {
        e.stopPropagation();
        return e.preventDefault();
      };
      this.element.on("dragstart.dropzone", function(e) {
        return _this.emit("dragstart", e);
      });
      this.element.on("dragenter.dropzone", function(e) {
        noPropagation(e);
        return _this.emit("dragenter", e);
      });
      this.element.on("dragover.dropzone", function(e) {
        noPropagation(e);
        return _this.emit("dragover", e);
      });
      this.element.on("dragleave.dropzone", function(e) {
        return _this.emit("dragleave", e);
      });
      this.element.on("drop.dropzone", function(e) {
        noPropagation(e);
        _this.drop(e);
        return _this.emit("drop", e);
      });
      return this.element.on("dragend.dropzone", function(e) {
        return _this.emit("dragend", e);
      });
    };

    Dropzone.prototype.removeEventListeners = function() {
      return this.element.off(".dropzone");
    };

    Dropzone.prototype.disable = function() {
      this.removeEventListeners();
      this.files = [];
      this.filesProcessing = [];
      return this.filesQueue = [];
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
      if (!e.originalEvent.dataTransfer) {
        return;
      }
      files = e.originalEvent.dataTransfer.files;
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
      var formData, handleError, input, inputElement, inputName, key, progressObj, value, xhr, _i, _len, _ref, _ref1, _ref2,
        _this = this;
      xhr = new XMLHttpRequest();
      xhr.open("POST", this.options.url, true);
      handleError = function() {
        return _this.errorProcessing(file, xhr.responseText || ("Server responded with " + xhr.status + " code."));
      };
      xhr.onload = function(e) {
        var response;
        if (xhr.status !== 200) {
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
      if (this.elementTagName = "FORM") {
        _ref2 = this.element.find("input, textarea, select, button");
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          inputElement = _ref2[_i];
          input = o(inputElement);
          inputName = input.attr("name");
          if (!input.attr("type") || input.attr("type").toLowerCase() !== "checkbox" || inputElement.checked) {
            formData.append(input.attr("name"), input.val());
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

  Dropzone.options = {};

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

  o.fn.dropzone = function(options) {
    return this.each(function() {
      return new Dropzone(this, options);
    });
  };

  o(function() {
    return o(".dropzone").dropzone();
  });

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

}).call(this);

});
require.alias("component-emitter/index.js", "dropzone/deps/emitter/index.js");

if (typeof exports == "object") {
  module.exports = require("dropzone");
} else if (typeof define == "function" && define.amd) {
  define(require("dropzone"));
} else {
  window["Dropzone"] = require("dropzone");
}})();