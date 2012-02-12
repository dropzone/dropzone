(function($) {


  $.fn.dropzone = function(options) {
    return new Dropzone(this, options);
  };



  /**
   * @param {String} element
   * @param {Object} options optional
   */
  var Dropzone = function(element, options) {
    this.element = $(element);
    this.options = $.extend({ }, defaultOptions, options || {});
    this.init();
  };
  Dropzone.prototype.version = '0.1.2';






  XMLHttpRequest.prototype.sendBin = function(datastr) {
    function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
    }
    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);
  }

  var noOp = function() { };
  var defaultOptions = {
    url: '',
    parallelUploads: 2,
    maxFilesize: 4, // in MB
    paramName: 'file', // The name of the file param that gets transferred.

    createImageThumbnails: true,
    maxThumbnailFilesize: 2, // in MB. When the filename exeeds this limit, the thumbnail will not be generated.
    thumbnailWidth: 120,
    thumbnailHeight: 120,

    /**
     * Called when the browser does not support drag and drop
     */
    fallback: noOp,

    // Those are self explanatory and simply concern the DragnDrop.
    drop: noOp,
    dragStart: noOp,
    dragEnd: noOp,
    dragEnter: noOp,
    dragOver: noOp,
    dragLeave: noOp,

    /**
     * Called when a thumbnail has been generated
     * @param {Object} file
     * @param {String} dataUrl
     */
    thumbnail: noOp,
    /**
     * Called whenever an error occures
     * @param {Object} file
     */
    error: noOp,
    /**
     * Called when a file is added to the queue
     * @param {Object} file
     */
    addedFile: noOp,
    /**
     * Called when a file gets processed
     * @param {Object} file
     */
    processingFile: noOp(),
    /**
     * Called whenever the upload progress gets upadted.
     * You can be sure that this will be called with the percentage 100% when the file is finished uploading.
     * @param {Object} file
     * @param {Number} progress percentage
     */
    uploadProgress: noOp,
    /**
     * When the complete upload is finished
     */
    finished: noOp,
    
    accept: function(file) { return true; } // if false the file does not get processed.
  };

  /**
   * Behaves like the underscore function _.bind()
   * @param {Function} func
   * @param {Object} obj the object you want the function bound to.
   * @param {...} Any additional parameters
   */
  var bind = function(func, obj) {
    var args = [], i;
    for (i = 2; i < arguments.length; i ++) {
      args.push(arguments[i]);
    }
    return function() {
      for (i = 0; i < arguments.length; i ++) {
        args.push(arguments[i]);
      }
      func.apply(obj, args);
    }
  };

  /**
   * Behaves like the underscore function _.without()
   * @param {List} list
   * @param {Object...} list of objects that should be removed
   */
  var without = function(list) {
    var newList = [],
      withoutList = [];

    for (i = 1; i < arguments.length; i ++) {
      withoutList.push(arguments[i]);
    };

    $.each(list, function() {
      if ($.inArray(this, withoutList) === -1) {
        newList.push(this);
      }
    });
    return newList;
  };



  Dropzone.prototype.init = function() {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      this.options.fallback.call(this);
      return;
    }
    this.files = []; // All files
    this.files.queue = []; // The files that still have to be processed
    this.files.processing = []; // The files currently processed
    this.URL = window.URL || window.webkitURL;
    this.setupEventListeners();
  };

  /**
   * Returns a form that can be used as fallback if the browser does not support DragnDrop
   */
  Dropzone.prototype.getFallbackForm = function() {
    return $('<form action="' + this.options.url + '" enctype="multipart/form-data" method="post"><input type="file" name="newFiles" multiple="multiple" /><button type="submit">Upload!</button></form>');
  };

  Dropzone.prototype.setupEventListeners = function() {
    var noPropagation = function(e) {
      e.stopPropagation();  
      e.preventDefault();  
    };
    var self = this;

    this.element.on('dragstart', function(e) { self.options.dragStart.call(self, e); });
    this.element.on('dragenter', function(e) { noPropagation(e); self.options.dragEnter.call(self, e); });
    this.element.on('dragover', function(e) { noPropagation(e); self.options.dragOver.call(self, e); });
    this.element.on('dragleave', function(e) { self.options.dragLeave.call(self, e); });
    // There seems to be a conflict with jQuery
    this.element.get(0).addEventListener('drop', function(e) { noPropagation(e); self.drop(e); self.options.drop.call(self, e); }, false);
    this.element.on('dragend', function(e) { self.options.dragLeave.call(self, e); self.options.dragEnd.call(self, e); });
  };

  Dropzone.prototype.drop = function(e) {
    if (!e.dataTransfer) return;
    var files = e.dataTransfer.files;
    if (files.length) {
      this.handleFiles(files); 
    }
  };

  Dropzone.prototype.handleFiles = function(files) {
    var self = this;
    $.each(files, function() {
      if (self.accept(this)) {
        self.addFile(this);
      }
    });
    this.processQueue();
  };

  Dropzone.prototype.accept = function(file) {
    // Add file size check here.
    return this.options.accept.call(this, file);
  };


  Dropzone.prototype.addFile = function(file) {
    this.files.push(file);
    this.files.queue.push(file);
    this.options.addedFile.call(this, file);

    if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
      this.createThumbnail(file);
    }
  };


  Dropzone.prototype.createThumbnail = function(file) {
    var self = this
      , img = new Image()
      , blobUrl = this.URL.createObjectURL(file);


    img.onerror = img.onabort = function() {
      self.URL.revokeObjectURL(blobUrl);
      img = null;
    };

    img.onload = function() {
      var canvas = document.createElement("canvas")
        , ctx = canvas.getContext('2d')
        , trgX = 0
        , trgY = 0
        , trgWidth = 0
        , trgHeight = 0
        , srcRatio
        , trgRatio;

      canvas.width = self.options.thumbnailWidth;
      canvas.height = self.options.thumbnailHeight;

      srcRatio = img.width / img.height;
      trgRatio = canvas.width / canvas.height;

      // if (img.width < canvas.width && img.height < canvas.height) {
      //   // Source image is smaller
      //   trgWidth = img.width;
      //   trgHeight = img.height;
      // }
      if (srcRatio > trgRatio) {
        trgWidth = canvas.width;
        trgHeight = trgWidth / srcRatio;
        console.log('Width: %d, height: %d', trgWidth, trgHeight);
      }
      else {
        console.log('hi2');
        trgHeight = canvas.height;
        trgWidth = trgHeight * srcRatio;
      }
      
      trgX = (canvas.width - trgWidth) / 2;
      trgY = (canvas.height - trgHeight) / 2;

      ctx.drawImage(img, trgX, trgY, trgWidth, trgHeight);

      var thumbnail = canvas.toDataURL('image/png');
      self.options.thumbnail(file, thumbnail);
      self.URL.revokeObjectURL(blobUrl);
      img = null;
    }

    img.src = blobUrl;    
  }

  /**
   * Goes through the qeue and processes files if there aren't too many already.
   */
  Dropzone.prototype.processQueue = function() {
    var parallelUploads = this.options.parallelUploads
      , processingLength = this.files.processing.length;

    for (var i = processingLength; i < parallelUploads; i ++) {
      if (!this.files.queue.length) return; // Nothing left to process
      this.processFile(this.files.queue.shift());
    }
  };

  /**
   * Loads the file, then calls finishedLoading()
   * @param {Object} file
   */
  Dropzone.prototype.processFile = function(file) {
    var fileReader = new FileReader(),
        self = this;

    this.files.processing.push(file);
    this.options.processingFile.call(this, file);

    if (file.size > this.options.maxFilesize * 1024 * 1024) {
      this.errorProcessing(file, 'File is too big (' + file.size / 1024 * 1024 + 'MB). Max filesize: ' + this.options.maxFilesize);
    }
    else {
      this.uploadFile(file);
    }
  };
  /**
   * @param {Object} file
   * @param {Object} e
   */
  Dropzone.prototype.uploadFile = function(file) {
    var xhr = new XMLHttpRequest(),
        self = this,
        formData = new FormData();

    formData.append(this.options.paramName, file);

    xhr.open("POST", this.options.url, true);


    xhr.onload = function(e) {
      self.options.uploadProgress(file, 100);
      self.finished(file, e);
    };
    xhr.onerror = function() {
      self.errorProcessing(file);
    };
    xhr.onprogress = function(e) {
      self.options.uploadProgress(file, Math.max(0, Math.min(100, (e.loaded / e.total) * 100)));
    };

    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", file.name);
    xhr.send(formData);
  };

  /**
   * Called internally when processing is finished.
   * Individual callbacks have to be called in the appropriate sections.
   */
  Dropzone.prototype.finished = function(file) {
    this.files.processing = without(this.files.processing, file);
    this.options.finished.call(this, file);
    this.processQueue();
  },

  /**
   * Called internally when processing is finished.
   * Individual callbacks have to be called in the appropriate sections.
   */
  Dropzone.prototype.errorProcessing = function(file, message) {
    this.files.processing = without(this.files.processing, file);
    this.options.error.call(this, file, message);
    this.processQueue();
  }

})(jQuery);