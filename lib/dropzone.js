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
  var Dropzone, Em, camelize, contentLoaded, noop, without,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("emitter");

  noop = function() {};

  Dropzone = (function(_super) {
    __extends(Dropzone, _super);

    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
    */


    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "selectedfiles", "addedfile", "removedfile", "thumbnail", "error", "processingfile", "uploadprogress", "totaluploadprogress", "sending", "success", "complete", "reset"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      parallelUploads: 2,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 100,
      thumbnailHeight: 100,
      params: {},
      clickable: true,
      acceptedMimeTypes: null,
      acceptParameter: null,
      enqueueForUpload: true,
      previewsContainer: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;

        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;

        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        trgRatio = this.options.thumbnailWidth / this.options.thumbnailHeight;
        if (file.height < this.options.thumbnailHeight || file.width < this.options.thumbnailWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
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
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      selectedfiles: function(files) {
        if (this.element === this.previewsContainer) {
          return this.element.classList.add("dz-started");
        }
      },
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        file.previewElement = Dropzone.createElement(this.options.previewTemplate);
        file.previewTemplate = file.previewElement;
        this.previewsContainer.appendChild(file.previewElement);
        file.previewElement.querySelector("[data-dz-name]").textContent = file.name;
        return file.previewElement.querySelector("[data-dz-size]").innerHTML = this.filesize(file.size);
      },
      removedfile: function(file) {
        return file.previewElement.parentNode.removeChild(file.previewElement);
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement;

        file.previewElement.classList.remove("dz-file-preview");
        file.previewElement.classList.add("dz-image-preview");
        thumbnailElement = file.previewElement.querySelector("[data-dz-thumbnail]");
        thumbnailElement.alt = file.name;
        return thumbnailElement.src = dataUrl;
      },
      error: function(file, message) {
        file.previewElement.classList.add("dz-error");
        return file.previewElement.querySelector("[data-dz-errormessage]").textContent = message;
      },
      processingfile: function(file) {
        return file.previewElement.classList.add("dz-processing");
      },
      uploadprogress: function(file, progress, bytesSent) {
        return file.previewElement.querySelector("[data-dz-uploadprogress]").style.width = "" + progress + "%";
      },
      totaluploadprogress: noop,
      sending: noop,
      success: function(file) {
        return file.previewElement.classList.add("dz-success");
      },
      complete: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
    };

    function Dropzone(element, options) {
      var elementOptions, extend, fallback, _ref;

      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
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
      if (this.options.acceptParameter && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptParameter' and 'acceptedMimeTypes'. 'acceptParameter' is deprecated.");
      }
      this.options.method = this.options.method.toUpperCase();
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer) {
        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
      } else {
        this.previewsContainer = this.element;
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      } else {
        this.clickableElements = [];
      }
      this.init();
    }

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1,
        _this = this;

      if (this.element.nodeName === "FORM") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector("[data-dz-message]")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\" data-dz-message><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = function() {
          if (_this.hiddenFileInput) {
            document.body.removeChild(_this.hiddenFileInput);
          }
          _this.hiddenFileInput = document.createElement("input");
          _this.hiddenFileInput.setAttribute("type", "file");
          _this.hiddenFileInput.setAttribute("multiple", "multiple");
          if (_this.options.acceptedMimeTypes != null) {
            _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedMimeTypes);
          }
          if (_this.options.acceptParameter != null) {
            _this.hiddenFileInput.setAttribute("accept", _this.options.acceptParameter);
          }
          _this.hiddenFileInput.style.visibility = "hidden";
          _this.hiddenFileInput.style.position = "absolute";
          _this.hiddenFileInput.style.top = "0";
          _this.hiddenFileInput.style.left = "0";
          _this.hiddenFileInput.style.height = "0";
          _this.hiddenFileInput.style.width = "0";
          document.body.appendChild(_this.hiddenFileInput);
          return _this.hiddenFileInput.addEventListener("change", function() {
            var files;

            files = _this.hiddenFileInput.files;
            if (files.length) {
              _this.emit("selectedfiles", files);
              _this.handleFiles(files);
            }
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }
      this.files = [];
      this.acceptedFiles = [];
      this.filesQueue = [];
      this.filesProcessing = [];
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", function(file) {
        var totalBytes, totalBytesSent, totalUploadProgress, _j, _len1, _ref2;

        totalBytesSent = 0;
        totalBytes = 0;
        _ref2 = _this.acceptedFiles;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          file = _ref2[_j];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
        return _this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
      });
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
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
            }
          }
        }
      ];
      this.clickableElements.forEach(function(clickableElement) {
        return _this.listeners.push({
          element: clickableElement,
          events: {
            "click": function(evt) {
              if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                return _this.hiddenFileInput.click();
              }
            }
          }
        });
      });
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;

      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this.options.paramName + "[]\" multiple=\"multiple\" /><button type=\"submit\">Upload!</button></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.nodeName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
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
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;

      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;

          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;

      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;

          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.filesProcessing = [];
      return this.filesQueue = [];
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
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
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidMimeType(file.type, this.options.acceptedMimeTypes)) {
        return done(this.options.dictInvalidFileType);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      var _this = this;

      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      this.emit("addedfile", file);
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this.createThumbnail(file);
      }
      return this.accept(file, function(error) {
        if (error) {
          file.accepted = false;
          return _this.errorProcessing(file, error);
        } else {
          file.accepted = true;
          _this.acceptedFiles.push(file);
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

    Dropzone.prototype.removeAllFiles = function() {
      var file, _i, _len, _ref;

      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (__indexOf.call(this.filesProcessing, file) < 0) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file) {
      var fileReader,
        _this = this;

      fileReader = new FileReader;
      fileReader.onload = function() {
        var img;

        img = new Image;
        img.onload = function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if ((_ref = resizeInfo.trgWidth) == null) {
            resizeInfo.trgWidth = _this.options.thumbnailWidth;
          }
          if ((_ref1 = resizeInfo.trgHeight) == null) {
            resizeInfo.trgHeight = _this.options.thumbnailHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          ctx.drawImage(img, (_ref2 = resizeInfo.srcX) != null ? _ref2 : 0, (_ref3 = resizeInfo.srcY) != null ? _ref3 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref4 = resizeInfo.trgX) != null ? _ref4 : 0, (_ref5 = resizeInfo.trgY) != null ? _ref5 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
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
      var formData, handleError, input, inputName, inputType, key, progressObj, response, value, xhr, _i, _len, _ref, _ref1, _ref2,
        _this = this;

      xhr = new XMLHttpRequest();
      xhr.open(this.options.method, this.options.url, true);
      response = null;
      handleError = function() {
        return _this.errorProcessing(file, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
      };
      xhr.onload = function(e) {
        var _ref;

        response = xhr.responseText;
        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (_error) {
            e = _error;
            response = "Invalid JSON response from server.";
          }
        }
        if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
          return handleError();
        } else {
          return _this.finished(file, response, e);
        }
      };
      xhr.onerror = function() {
        return handleError();
      };
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = function(e) {
        var progress;

        file.upload = {
          progress: progress,
          total: e.total,
          bytesSent: e.loaded
        };
        progress = 100 * e.loaded / e.total;
        return _this.emit("uploadprogress", file, progress, e.loaded);
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
      if (this.element.nodeName === "FORM") {
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

    Dropzone.prototype.errorProcessing = function(file, message, xhr) {
      this.filesProcessing = without(this.filesProcessing, file);
      file.processing = false;
      this.processQueue();
      this.emit("error", file, message, xhr);
      return this.emit("complete", file);
    };

    return Dropzone;

  })(Em);

  Dropzone.version = "3.2.0";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.id) {
      return Dropzone.options[camelize(element.id)];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    var _ref;

    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    return (_ref = element.dropzone) != null ? _ref : null;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;

    if (!Dropzone.autoDiscover) {
      return;
    }
    if (document.querySelectorAll) {
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
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;

    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
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

  Dropzone.createElement = function(string) {
    var div;

    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;

    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;

    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.isValidMimeType = function(mimeType, acceptedMimeTypes) {
    var baseMimeType, validMimeType, _i, _len;

    if (!acceptedMimeTypes) {
      return true;
    }
    acceptedMimeTypes = acceptedMimeTypes.split(",");
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedMimeTypes.length; _i < _len; _i++) {
      validMimeType = acceptedMimeTypes[_i];
      validMimeType = validMimeType.trim();
      if (/\/\*$/.test(validMimeType)) {
        if (baseMimeType === validMimeType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validMimeType) {
          return true;
        }
      }
    }
    return false;
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

  /*
  # contentloaded.js
  #
  # Author: Diego Perini (diego.perini at gmail.com)
  # Summary: cross-browser wrapper for DOMContentLoaded
  # Updated: 20101020
  # License: MIT
  # Version: 1.2
  #
  # URL:
  # http://javascript.nwbox.com/ContentLoaded/
  # http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
  */


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
      var e;

      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
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

  contentLoaded(window, Dropzone.discover);

}).call(this);
