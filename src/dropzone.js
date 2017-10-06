/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */


// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
class Emitter {
  // Add an event listener for given event
  on(event, fn) {
    this._callbacks = this._callbacks || {};
    // Create namespace for this event
    if (!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(fn);
    return this;
  }


  emit(event, ...args) {
    this._callbacks = this._callbacks || {};
    let callbacks = this._callbacks[event];

    if (callbacks) {
      for (let callback of callbacks) {
        callback.apply(this, args);
      }
    }

    return this;
  }

  // Remove event listener for given event. If fn is not provided, all event
  // listeners for that event will be removed. If neither is provided, all
  // event listeners will be removed.
  off(event, fn) {
    if (!this._callbacks || (arguments.length === 0)) {
      this._callbacks = {};
      return this;
    }

    // specific event
    let callbacks = this._callbacks[event];
    if (!callbacks) {
      return this;
    }

    // remove all handlers
    if (arguments.length === 1) {
      delete this._callbacks[event];
      return this;
    }

    // remove specific handler
    for (let i = 0; i < callbacks.length; i++) {
      let callback = callbacks[i];
      if (callback === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }

    return this;
  }
}

class Dropzone extends Emitter {
  static initClass() {

    // Exposing the emitter class, mainly for tests
    this.prototype.Emitter = Emitter;

    /*
     This is a list of all available events you can register on a dropzone object.

     You can register an event handler like this:

     dropzone.on("dragEnter", function() { });

     */
    this.prototype.events = [
      "drop",
      "dragstart",
      "dragend",
      "dragenter",
      "dragover",
      "dragleave",
      "addedfile",
      "addedfiles",
      "removedfile",
      "thumbnail",
      "error",
      "errormultiple",
      "processing",
      "processingmultiple",
      "uploadprogress",
      "totaluploadprogress",
      "sending",
      "sendingmultiple",
      "success",
      "successmultiple",
      "canceled",
      "canceledmultiple",
      "complete",
      "completemultiple",
      "reset",
      "maxfilesexceeded",
      "maxfilesreached",
      "queuecomplete"
    ];


    this.prototype.defaultOptions = {
      /**
       * Has to be specified on elements other than form (or when the form
       * doesn't have an `action` attribute). You can also
       * provide a function that will be called with `files` and
       * must return the url (since `v3.12.0`)
       */
      url: null,

      /**
       * Can be changed to `"put"` if necessary. You can also provide a function
       * that will be called with `files` and must return the method (since `v3.12.0`).
       */
      method: "post",

      /**
       * Will be set on the XHRequest.
       */
      withCredentials: false,

      /**
       * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
       */
      timeout: 30000,

      /**
       * How many file uploads to process in parallel (See the
       * Enqueuing file uploads* documentation section for more info)
       */
      parallelUploads: 2,

      /**
       * Whether to send multiple files in one request. If
       * this it set to true, then the fallback file input element will
       * have the `multiple` attribute as well. This option will
       * also trigger additional events (like `processingmultiple`). See the events
       * documentation section for more information.
       */
      uploadMultiple: false,

      /**
       * Whether you want files to be uploaded in chunks to your server. This can't be
       * used in combination with `uploadMultiple`.
       *
       * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
       */
      chunking: false,

      /**
       * If `chunking` is enabled, this defines whether **every** file should be chunked,
       * even if the file size is below chunkSize. This means, that the additional chunk
       * form data will be submitted and the `chunksUploaded` callback will be invoked.
       */
      forceChunking: false,

      /**
       * If `chunking` is `true`, then this defines the chunk size in bytes.
       */
      chunkSize: 2000000,

      /**
       * If `true`, the individual chunks of a file are being uploaded simultaneously.
       */
      parallelChunkUploads: false,

      /**
       * Whether a chunk should be retried if it fails.
       */
      retryChunks: false,

      /**
       * If `retryChunks` is true, how many times should it be retried.
       */
      retryChunksLimit: 3,

      /**
       * If not `null` defines how many files this Dropzone handles. If it exceeds,
       * the event `maxfilesexceeded` will be called. The dropzone element gets the
       * class `dz-max-files-reached` accordingly so you can provide visual feedback.
       */
      maxFilesize: 256,

      /**
       * The name of the file param that gets transferred.
       * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
       * Dropzone will append `[]` to the name.
       */
      paramName: "file",

      /**
       * Whether thumbnails for images should be generated
       */
      createImageThumbnails: true,

      /**
       * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
       */
      maxThumbnailFilesize: 10,

      /**
       * If `null`, the ratio of the image will be used to calculate it.
       */
      thumbnailWidth: 120,

      /**
       * The same as `thumbnailWidth`. If both are null, images will not be resized.
       */
      thumbnailHeight: 120,

      /**
       * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
       * Can be either `contain` or `crop`.
       */
      thumbnailMethod: 'crop',

      /**
       * If set, images will be resized to these dimensions before being **uploaded**.
       * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
       * ratio of the file will be preserved.
       *
       * The `options.transformFile` function uses these options, so if the `transformFile` function
       * is overridden, these options don't do anything.
       */
      resizeWidth: null,

      /**
       * See `resizeWidth`.
       */
      resizeHeight: null,

      /**
       * The mime type of the resized image (before it gets uploaded to the server).
       * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
       * See `resizeWidth` for more information.
       */
      resizeMimeType: null,

      /**
       * The quality of the resized images. See `resizeWidth`.
       */
      resizeQuality: 0.8,

      /**
       * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
       * Can be either `contain` or `crop`.
       */
      resizeMethod: 'contain',

      /**
       * The base that is used to calculate the filesize. You can change this to
       * 1024 if you would rather display kibibytes, mebibytes, etc...
       * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
       * You can change this to `1024` if you don't care about validity.
       */
      filesizeBase: 1000,

      /**
       * Can be used to limit the maximum number of files that will be handled by this Dropzone
       */
      maxFiles: null,

      /**
       * An optional object to send additional headers to the server. Eg:
       * `{ "My-Awesome-Header": "header value" }`
       */
      headers: null,

      /**
       * If `true`, the dropzone element itself will be clickable, if `false`
       * nothing will be clickable.
       *
       * You can also pass an HTML element, a CSS selector (for multiple elements)
       * or an array of those. In that case, all of those elements will trigger an
       * upload when clicked.
       */
      clickable: true,

      /**
       * Whether hidden files in directories should be ignored.
       */
      ignoreHiddenFiles: true,


      /**
       * The default implementation of `accept` checks the file's mime type or
       * extension against this list. This is a comma separated list of mime
       * types or file extensions.
       *
       * Eg.: `image/*,application/pdf,.psd`
       *
       * If the Dropzone is `clickable` this option will also be used as
       * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
       * parameter on the hidden file input as well.
       */
      acceptedFiles: null,

      /**
       * **Deprecated!**
       * Use acceptedFiles instead.
       */
      acceptedMimeTypes: null,

      /**
       * If false, files will be added to the queue but the queue will not be
       * processed automatically.
       * This can be useful if you need some additional user input before sending
       * files (or if you want want all files sent at once).
       * If you're ready to send the file simply call `myDropzone.processQueue()`.
       *
       * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
       * section for more information.
       */
      autoProcessQueue: true,

      /**
       * If false, files added to the dropzone will not be queued by default.
       * You'll have to call `enqueueFile(file)` manually.
       */
      autoQueue: true,

      /**
       * If `true`, this will add a link to every file preview to remove or cancel (if
       * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
       * and `dictRemoveFile` options are used for the wording.
       */
      addRemoveLinks: false,

      /**
       * Defines where to display the file previews – if `null` the
       * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
       * selector. The element should have the `dropzone-previews` class so
       * the previews are displayed properly.
       */
      previewsContainer: null,

      /**
       * This is the element the hidden input field (which is used when clicking on the
       * dropzone to trigger file selection) will be appended to. This might
       * be important in case you use frameworks to switch the content of your page.
       */
      hiddenInputContainer: "body",

      /**
       * If null, no capture type will be specified
       * If camera, mobile devices will skip the file selection and choose camera
       * If microphone, mobile devices will skip the file selection and choose the microphone
       * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
       * On apple devices multiple must be set to false.  AcceptedFiles may need to
       * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
       */
      capture: null,

      /**
       * **Deprecated**. Use `renameFile` instead.
       */
      renameFilename: null,

      /**
       * A function that is invoked before the file is uploaded to the server and renames the file.
       * This function gets the `File` as argument and can use the `file.name`. The actual name of the
       * file that gets used during the upload can be accessed through `file.upload.filename`.
       */
      renameFile: null,

      /**
       * If `true` the fallback will be forced. This is very useful to test your server
       * implementations first and make sure that everything works as
       * expected without dropzone if you experience problems, and to test
       * how your fallbacks will look.
       */
      forceFallback: false,

      /**
       * The text used before any files are dropped.
       */
      dictDefaultMessage: "Drop files here to upload",

      /**
       * The text that replaces the default message text it the browser is not supported.
       */
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

      /**
       * The text that will be added before the fallback form.
       * If you provide a  fallback element yourself, or if this option is `null` this will
       * be ignored.
       */
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

      /**
       * If the filesize is too big.
       * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
       */
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

      /**
       * If the file doesn't match the file type.
       */
      dictInvalidFileType: "You can't upload files of this type.",

      /**
       * If the server response was invalid.
       * `{{statusCode}}` will be replaced with the servers status code.
       */
      dictResponseError: "Server responded with {{statusCode}} code.",

      /**
       * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
       */
      dictCancelUpload: "Cancel upload",

      /**
       * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
       */
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

      /**
       * If `addRemoveLinks` is true, the text to be used to remove a file.
       */
      dictRemoveFile: "Remove file",

      /**
       * If this is not null, then the user will be prompted before removing a file.
       */
      dictRemoveFileConfirmation: null,

      /**
       * Displayed if `maxFiles` is st and exceeded.
       * The string `{{maxFiles}}` will be replaced by the configuration value.
       */
      dictMaxFilesExceeded: "You can not upload any more files.",

      /**
       * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
       * `b` for bytes.
       */
      dictFileSizeUnits: {tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b"},

      /**
       * Called when dropzone initialized
       * You can add event listeners here
       */
      init() {},

      /**
       * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
       * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
       * of a function, this needs to return a map.
       *
       * The default implementation does nothing for normal uploads, but adds relevant information for
       * chunked uploads.
       *
       * This is the same as adding hidden input fields in the form element.
       */
      params(files, xhr, chunk) {
        if (chunk) {
          return {
            dzuuid: chunk.file.upload.uuid,
            dzchunkindex: chunk.index,
            dztotalfilesize: chunk.file.size,
            dzchunksize: this.options.chunkSize,
            dztotalchunkcount: chunk.file.upload.totalChunkCount,
            dzchunkbyteoffset: chunk.index * this.options.chunkSize
          };
        }
      },

      /**
       * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
       * and a `done` function as parameters.
       *
       * If the done function is invoked without arguments, the file is "accepted" and will
       * be processed. If you pass an error message, the file is rejected, and the error
       * message will be displayed.
       * This function will not be called if the file is too big or doesn't match the mime types.
       */
      accept(file, done) {
        return done();
      },

      /**
       * The callback that will be invoked when all chunks have been uploaded for a file.
       * It gets the file for which the chunks have been uploaded as the first parameter,
       * and the `done` function as second. `done()` needs to be invoked when everything
       * needed to finish the upload process is done.
       */
      chunksUploaded: function(file, done) { done(); },

      /**
       * Gets called when the browser is not supported.
       * The default implementation shows the fallback input field and adds
       * a text.
       */
      fallback() {
        // This code should pass in IE7... :(
        let messageElement;
        this.element.className = `${this.element.className} dz-browser-not-supported`;

        for (let child of this.element.getElementsByTagName("div")) {
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message"; // Removes the 'dz-default' class
            break;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }

        let span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          if (span.textContent != null) {
            span.textContent = this.options.dictFallbackMessage;
          } else if (span.innerText != null) {
            span.innerText = this.options.dictFallbackMessage;
          }
        }

        return this.element.appendChild(this.getFallbackForm());
      },


      /**
       * Gets called to calculate the thumbnail dimensions.
       *
       * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
       *
       *  - `srcWidth` & `srcHeight` (required)
       *  - `trgWidth` & `trgHeight` (required)
       *  - `srcX` & `srcY` (optional, default `0`)
       *  - `trgX` & `trgY` (optional, default `0`)
       *
       * Those values are going to be used by `ctx.drawImage()`.
       */
      resize(file, width, height, resizeMethod) {
        let info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };

        let srcRatio = file.width / file.height;

        // Automatically calculate dimensions if not specified
        if ((width == null) && (height == null)) {
          width = info.srcWidth;
          height = info.srcHeight;
        } else if ((width == null)) {
          width = height * srcRatio;
        } else if ((height == null)) {
          height = width / srcRatio;
        }

        // Make sure images aren't upscaled
        width = Math.min(width, info.srcWidth);
        height = Math.min(height, info.srcHeight);

        let trgRatio = width / height;

        if ((info.srcWidth > width) || (info.srcHeight > height)) {
          // Image is bigger and needs rescaling
          if (resizeMethod === 'crop') {
            if (srcRatio > trgRatio) {
              info.srcHeight = file.height;
              info.srcWidth = info.srcHeight * trgRatio;
            } else {
              info.srcWidth = file.width;
              info.srcHeight = info.srcWidth / trgRatio;
            }
          } else if (resizeMethod === 'contain') {
            // Method 'contain'
            if (srcRatio > trgRatio) {
              height = width / srcRatio;
            } else {
              width = height * srcRatio;
            }
          } else {
            throw new Error(`Unknown resizeMethod '${resizeMethod}'`);
          }
        }

        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;

        info.trgWidth = width;
        info.trgHeight = height;

        return info;
      },

      /**
       * Can be used to transform the file (for example, resize an image if necessary).
       *
       * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
       * images according to those dimensions.
       *
       * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
       * to be invoked with the file when the transformation is done.
       */
      transformFile(file, done) {
        if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
          return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
        } else {
          return done(file);
        }
      },


      /**
       * A string that contains the template used for each dropped
       * file. Change it to fulfill your needs but make sure to properly
       * provide all elements.
       *
       * If you want to use an actual HTML element instead of providing a String
       * as a config option, you could create a div with the id `tpl`,
       * put the template inside it and provide the element like this:
       *
       *     document
       *       .querySelector('#tpl')
       *       .innerHTML
       *
       */
      previewTemplate: `\
<div class="dz-preview dz-file-preview">
  <div class="dz-image"><img data-dz-thumbnail /></div>
  <div class="dz-details">
    <div class="dz-size"><span data-dz-size></span></div>
    <div class="dz-filename"><span data-dz-name></span></div>
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
  <div class="dz-success-mark">
    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
      <title>Check</title>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
      </g>
    </svg>
  </div>
  <div class="dz-error-mark">
    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
      <title>Error</title>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
        </g>
      </g>
    </svg>
  </div>
</div>\
`,

      // END OPTIONS
      // (Required by the dropzone documentation parser)


      /*
       Those functions register themselves to the events on init and handle all
       the user interface specific stuff. Overwriting them won't break the upload
       but can break the way it's displayed.
       You can overwrite them if you don't like the default behavior. If you just
       want to add an additional event handler, register it on the dropzone object
       and don't overwrite those options.
       */




      // Those are self explanatory and simply concern the DragnDrop.
      drop(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart(e) {
      },
      dragend(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave(e) {
        return this.element.classList.remove("dz-drag-hover");
      },

      paste(e) {
      },

      // Called whenever there are no files left in the dropzone anymore, and the
      // dropzone should be displayed as if in the initial state.
      reset() {
        return this.element.classList.remove("dz-started");
      },

      // Called when a file is added to the queue
      // Receives `file`
      addedfile(file) {
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }

        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement; // Backwards compatibility

          this.previewsContainer.appendChild(file.previewElement);
          for (var node of file.previewElement.querySelectorAll("[data-dz-name]")) {
            node.textContent = file.name;
          }
          for (node of file.previewElement.querySelectorAll("[data-dz-size]")) {
            node.innerHTML = this.filesize(file.size);
          }

          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement(`<a class="dz-remove" href="javascript:undefined;" data-dz-remove>${this.options.dictRemoveFile}</a>`);
            file.previewElement.appendChild(file._removeLink);
          }

          let removeFileEvent = e => {
            e.preventDefault();
            e.stopPropagation();
            if (file.status === Dropzone.UPLOADING) {
              return Dropzone.confirm(this.options.dictCancelUploadConfirmation, () => this.removeFile(file));
            } else {
              if (this.options.dictRemoveFileConfirmation) {
                return Dropzone.confirm(this.options.dictRemoveFileConfirmation, () => this.removeFile(file));
              } else {
                return this.removeFile(file);
              }
            }
          };

          for (let removeLink of file.previewElement.querySelectorAll("[data-dz-remove]")) {
             removeLink.addEventListener("click", removeFileEvent);
          }
        }
      },


      // Called whenever a file is removed.
      removedfile(file) {
        if (file.previewElement != null && file.previewElement.parentNode != null) {
          file.previewElement.parentNode.removeChild(file.previewElement);
        }
        return this._updateMaxFilesReachedClass();
      },

      // Called when a thumbnail has been generated
      // Receives `file` and `dataUrl`
      thumbnail(file, dataUrl) {
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          for (let thumbnailElement of file.previewElement.querySelectorAll("[data-dz-thumbnail]")) {
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }

          return setTimeout((() => file.previewElement.classList.add("dz-image-preview")), 1);
        }
      },

      // Called whenever an error occurs
      // Receives `file` and `message`
      error(file, message) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if ((typeof message !== "String") && message.error) {
            message = message.error;
          }
          for (let node of file.previewElement.querySelectorAll("[data-dz-errormessage]")) {
            node.textContent = message;
          }
        }
      },

      errormultiple() {
      },

      // Called when a file gets processed. Since there is a cue, not all added
      // files are processed immediately.
      // Receives `file`
      processing(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },

      processingmultiple() {
      },

      // Called whenever the upload progress gets updated.
      // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
      // To get the total number of bytes of the file, use `file.size`
      uploadprogress(file, progress, bytesSent) {
        if (file.previewElement) {
          for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress]")) {
              node.nodeName === 'PROGRESS' ?
                  (node.value = progress)
                  :
                  (node.style.width = `${progress}%`)
          }
        }
      },

      // Called whenever the total upload progress gets updated.
      // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
      totaluploadprogress() {
      },

      // Called just before the file is sent. Gets the `xhr` object as second
      // parameter, so you can modify it (for example to add a CSRF token) and a
      // `formData` object to add additional information.
      sending() {
      },

      sendingmultiple() {},

      // When the complete upload is finished and successful
      // Receives `file`
      success(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },

      successmultiple() {},

      // When the upload is canceled.
      canceled(file) {
        return this.emit("error", file, "Upload canceled.");
      },

      canceledmultiple() {},

      // When the upload is finished, either with success or an error.
      // Receives `file`
      complete(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },

      completemultiple() {},

      maxfilesexceeded() {},

      maxfilesreached() {},

      queuecomplete() {},

      addedfiles() {}
    };


    this.prototype._thumbnailQueue = [];
    this.prototype._processingThumbnail = false;
  }

  // global utility
  static extend(target, ...objects) {
    for (let object of objects) {
      for (let key in object) {
        let val = object[key];
        target[key] = val;
      }
    }
    return target;
  }

  constructor(el, options) {
    super();
    let fallback, left;
    this.element = el;
    // For backwards compatibility since the version was in the prototype previously
    this.version = Dropzone.version;

    this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");

    this.clickableElements = [];
    this.listeners = [];
    this.files = []; // All files

    if (typeof this.element === "string") {
      this.element = document.querySelector(this.element);
    }

    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    if (!this.element || (this.element.nodeType == null)) {
      throw new Error("Invalid dropzone element.");
    }

    if (this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    }

    // Now add this dropzone to the instances.
    Dropzone.instances.push(this);

    // Put the dropzone inside the element itself.
    this.element.dropzone = this;

    let elementOptions = (left = Dropzone.optionsForElement(this.element)) != null ? left : {};

    this.options = Dropzone.extend({}, this.defaultOptions, elementOptions, options != null ? options : {});

    // If the browser failed, just call the fallback and leave
    if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      return this.options.fallback.call(this);
    }

    // @options.url = @element.getAttribute "action" unless @options.url?
    if (this.options.url == null) {
      this.options.url = this.element.getAttribute("action");
    }

    if (!this.options.url) {
      throw new Error("No URL provided.");
    }

    if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (this.options.uploadMultiple && this.options.chunking) {
      throw new Error('You cannot set both: uploadMultiple and chunking.');
    }

    // Backwards compatibility
    if (this.options.acceptedMimeTypes) {
      this.options.acceptedFiles = this.options.acceptedMimeTypes;
      delete this.options.acceptedMimeTypes;
    }

    // Backwards compatibility
    if (this.options.renameFilename != null) {
      this.options.renameFile = file => this.options.renameFilename.call(this, file.name, file);
    }

    this.options.method = this.options.method.toUpperCase();

    if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    }

    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
    if (this.options.previewsContainer !== false) {
      if (this.options.previewsContainer) {
        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
      } else {
        this.previewsContainer = this.element;
      }
    }

    if (this.options.clickable) {
      if (this.options.clickable === true) {
        this.clickableElements = [this.element];
      } else {
        this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
      }
    }


    this.init();
  }


  // Returns all files that have been accepted
  getAcceptedFiles() {
    return this.files.filter((file) => file.accepted).map((file) => file);
  }

  // Returns all files that have been rejected
  // Not sure when that's going to be useful, but added for completeness.
  getRejectedFiles() {
    return this.files.filter((file) => !file.accepted).map((file) => file);
  }

  getFilesWithStatus(status) {
    return this.files.filter((file) => file.status === status).map((file) => file);
  }

  // Returns all files that are in the queue
  getQueuedFiles() {
    return this.getFilesWithStatus(Dropzone.QUEUED);
  }

  getUploadingFiles() {
    return this.getFilesWithStatus(Dropzone.UPLOADING);
  }

  getAddedFiles() {
    return this.getFilesWithStatus(Dropzone.ADDED);
  }

  // Files that are either queued or uploading
  getActiveFiles() {
    return this.files.filter((file) => (file.status === Dropzone.UPLOADING) || (file.status === Dropzone.QUEUED)).map((file) => file);
  }

  // The function that gets called when Dropzone is initialized. You
  // can (and should) setup event listeners inside this function.
  init() {
    // In case it isn't set already
    if (this.element.tagName === "form") {
      this.element.setAttribute("enctype", "multipart/form-data");
    }

    if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
      this.element.appendChild(Dropzone.createElement(`<div class="dz-default dz-message"><span>${this.options.dictDefaultMessage}</span></div>`));
    }

    if (this.clickableElements.length) {
      let setupHiddenFileInput = () => {
        if (this.hiddenFileInput) {
          this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        }
        this.hiddenFileInput = document.createElement("input");
        this.hiddenFileInput.setAttribute("type", "file");
        if ((this.options.maxFiles === null) || (this.options.maxFiles > 1)) {
          this.hiddenFileInput.setAttribute("multiple", "multiple");
        }
        this.hiddenFileInput.className = "dz-hidden-input";

        if (this.options.acceptedFiles !== null) {
          this.hiddenFileInput.setAttribute("accept", this.options.acceptedFiles);
        }
        if (this.options.capture !== null) {
          this.hiddenFileInput.setAttribute("capture", this.options.capture);
        }

        // Not setting `display="none"` because some browsers don't accept clicks
        // on elements that aren't displayed.
        this.hiddenFileInput.style.visibility = "hidden";
        this.hiddenFileInput.style.position = "absolute";
        this.hiddenFileInput.style.top = "0";
        this.hiddenFileInput.style.left = "0";
        this.hiddenFileInput.style.height = "0";
        this.hiddenFileInput.style.width = "0";
        document.querySelector(this.options.hiddenInputContainer).appendChild(this.hiddenFileInput);
        return this.hiddenFileInput.addEventListener("change", () => {
          let {files} = this.hiddenFileInput;
          if (files.length) {
            for (let file of files) {
              this.addFile(file);
            }
          }
          this.emit("addedfiles", files);
          return setupHiddenFileInput();
        });
      };
      setupHiddenFileInput();
    }

    this.URL = window.URL !== null ? window.URL : window.webkitURL;


    // Setup all event listeners on the Dropzone object itself.
    // They're not in @setupEventListeners() because they shouldn't be removed
    // again when the dropzone gets disabled.
    for (let eventName of this.events) {
      this.on(eventName, this.options[eventName]);
    }

    this.on("uploadprogress", () => this.updateTotalUploadProgress());

    this.on("removedfile", () => this.updateTotalUploadProgress());

    this.on("canceled", file => this.emit("complete", file));

    // Emit a `queuecomplete` event if all files finished uploading.
    this.on("complete", file => {
      if ((this.getAddedFiles().length === 0) && (this.getUploadingFiles().length === 0) && (this.getQueuedFiles().length === 0)) {
        // This needs to be deferred so that `queuecomplete` really triggers after `complete`
        return setTimeout((() => this.emit("queuecomplete")), 0);
      }
    });


    let noPropagation = function (e) {
      e.stopPropagation();
      if (e.preventDefault) {
        return e.preventDefault();
      } else {
        return e.returnValue = false;
      }
    };

    // Create the listeners
    this.listeners = [
      {
        element: this.element,
        events: {
          "dragstart": e => {
            return this.emit("dragstart", e);
          },
          "dragenter": e => {
            noPropagation(e);
            return this.emit("dragenter", e);
          },
          "dragover": e => {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            let efct;
            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {
            }
            e.dataTransfer.dropEffect = ('move' === efct) || ('linkMove' === efct) ? 'move' : 'copy';

            noPropagation(e);
            return this.emit("dragover", e);
          },
          "dragleave": e => {
            return this.emit("dragleave", e);
          },
          "drop": e => {
            noPropagation(e);
            return this.drop(e);
          },
          "dragend": e => {
            return this.emit("dragend", e);
          }
        }

        // This is disabled right now, because the browsers don't implement it properly.
        // "paste": (e) =>
        //   noPropagation e
        //   @paste e
      }
    ];

    this.clickableElements.forEach(clickableElement => {
      return this.listeners.push({
        element: clickableElement,
        events: {
          "click": evt => {
            // Only the actual dropzone or the message element should trigger file selection
            if ((clickableElement !== this.element) || ((evt.target === this.element) || Dropzone.elementInside(evt.target, this.element.querySelector(".dz-message")))) {
              this.hiddenFileInput.click(); // Forward the click
            }
            return true;
          }
        }
      });
    });

    this.enable();

    return this.options.init.call(this);
  }

  // Not fully tested yet
  destroy() {
    this.disable();
    this.removeAllFiles(true);
    if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
      this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
      this.hiddenFileInput = null;
    }
    delete this.element.dropzone;
    return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
  }


  updateTotalUploadProgress() {
    let totalUploadProgress;
    let totalBytesSent = 0;
    let totalBytes = 0;

    let activeFiles = this.getActiveFiles();

    if (activeFiles.length) {
      for (let file of this.getActiveFiles()) {
        totalBytesSent += file.upload.bytesSent;
        totalBytes += file.upload.total;
      }
      totalUploadProgress = (100 * totalBytesSent) / totalBytes;
    } else {
      totalUploadProgress = 100;
    }

    return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
  }

  // @options.paramName can be a function taking one parameter rather than a string.
  // A parameter name for a file is obtained simply by calling this with an index number.
  _getParamName(n) {
    if (typeof this.options.paramName === "function") {
      return this.options.paramName(n);
    } else {
      return `${this.options.paramName}${this.options.uploadMultiple ? `[${n}]` : ""}`;
    }
  }

  // If @options.renameFile is a function,
  // the function will be used to rename the file.name before appending it to the formData
  _renameFile(file) {
    if (typeof this.options.renameFile !== "function") {
      return file.name;
    }
    return this.options.renameFile(file);
  }

  // Returns a form that can be used as fallback if the browser does not support DragnDrop
  //
  // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
  // This code has to pass in IE7 :(
  getFallbackForm() {
    let existingFallback, form;
    if (existingFallback = this.getExistingFallback()) {
      return existingFallback;
    }

    let fieldsString = "<div class=\"dz-fallback\">";
    if (this.options.dictFallbackText) {
      fieldsString += `<p>${this.options.dictFallbackText}</p>`;
    }
    fieldsString += `<input type="file" name="${this._getParamName(0)}" ${this.options.uploadMultiple ? 'multiple="multiple"' : undefined } /><input type="submit" value="Upload!"></div>`;

    let fields = Dropzone.createElement(fieldsString);
    if (this.element.tagName !== "FORM") {
      form = Dropzone.createElement(`<form action="${this.options.url}" enctype="multipart/form-data" method="${this.options.method}"></form>`);
      form.appendChild(fields);
    } else {
      // Make sure that the enctype and method attributes are set properly
      this.element.setAttribute("enctype", "multipart/form-data");
      this.element.setAttribute("method", this.options.method);
    }
    return form != null ? form : fields;
  }


  // Returns the fallback elements if they exist already
  //
  // This code has to pass in IE7 :(
  getExistingFallback() {
    let getFallback = function (elements) {
      for (let el of elements) {
        if (/(^| )fallback($| )/.test(el.className)) {
          return el;
        }
      }
    };

    for (let tagName of ["div", "form"]) {
      var fallback;
      if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
        return fallback;
      }
    }
  }


  // Activates all listeners stored in @listeners
  setupEventListeners() {
    return this.listeners.map((elementListeners) =>
        (() => {
          let result = [];
          for (let event in elementListeners.events) {
            let listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return result;
        })());
  }


  // Deactivates all listeners stored in @listeners
  removeEventListeners() {
    return this.listeners.map((elementListeners) =>
        (() => {
          let result = [];
          for (let event in elementListeners.events) {
            let listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return result;
        })());
  }

  // Removes all event listeners and cancels all files in the queue or being processed.
  disable() {
    this.clickableElements.forEach(element => element.classList.remove("dz-clickable"));
    this.removeEventListeners();

    return this.files.map((file) => this.cancelUpload(file));
  }

  enable() {
    this.clickableElements.forEach(element => element.classList.add("dz-clickable"));
    return this.setupEventListeners();
  }

  // Returns a nicely formatted filesize
  filesize(size) {
    let selectedSize = 0;
    let selectedUnit = "b";

    if (size > 0) {
      let units = ['tb', 'gb', 'mb', 'kb', 'b'];

      for (let i = 0; i < units.length; i++) {
        let unit = units[i];
        let cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

        if (size >= cutoff) {
          selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
          selectedUnit = unit;
          break;
        }
      }

      selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
    }

    return `<strong>${selectedSize}</strong> ${this.options.dictFileSizeUnits[selectedUnit]}`;
  }


  // Adds or removes the `dz-max-files-reached` class from the form.
  _updateMaxFilesReachedClass() {
    if ((this.options.maxFiles != null) && (this.getAcceptedFiles().length >= this.options.maxFiles)) {
      if (this.getAcceptedFiles().length === this.options.maxFiles) {
        this.emit('maxfilesreached', this.files);
      }
      return this.element.classList.add("dz-max-files-reached");
    } else {
      return this.element.classList.remove("dz-max-files-reached");
    }
  }


  drop(e) {
    if (!e.dataTransfer) {
      return;
    }
    this.emit("drop", e);

    let {files} = e.dataTransfer;
    this.emit("addedfiles", files);

    // Even if it's a folder, files.length will contain the folders.
    if (files.length) {
      let {items} = e.dataTransfer;
      if (items && items.length && (items[0].webkitGetAsEntry != null)) {
        // The browser supports dropping of folders, so handle items instead of files
        this._addFilesFromItems(items);
      } else {
        this.handleFiles(files);
      }
    }
  }

  paste(e) {
    if (__guard__(e != null ? e.clipboardData : undefined, x => x.items) == null) {
      return;
    }

    this.emit("paste", e);
    let {items} = e.clipboardData;

    if (items.length) {
      return this._addFilesFromItems(items);
    }
  }


  handleFiles(files) {
    return files.map((file) => this.addFile(file));
  }

  // When a folder is dropped (or files are pasted), items must be handled
  // instead of files.
  _addFilesFromItems(items) {
    return (() => {
      let result = [];
      for (let item of items) {
        var entry;
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            result.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            // Append all files from that directory to files
            result.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            result.push(undefined);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || (item.kind === "file")) {
            result.push(this.addFile(item.getAsFile()));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }


  // Goes through the directory, and adds each file it finds recursively
  _addFilesFromDirectory(directory, path) {
    let dirReader = directory.createReader();

    let errorHandler = error => __guardMethod__(console, 'log', o => o.log(error));

    var readEntries = () => {
      return dirReader.readEntries(entries => {
            if (entries.length > 0) {
              for (let entry of entries) {
                if (entry.isFile) {
                  entry.file(file => {
                    if (this.options.ignoreHiddenFiles && (file.name.substring(0, 1) === '.')) {
                      return;
                    }
                    file.fullPath = `${path}/${file.name}`;
                    return this.addFile(file);
                  });
                } else if (entry.isDirectory) {
                  this._addFilesFromDirectory(entry, `${path}/${entry.name}`);
                }
              }

              // Recursively call readEntries() again, since browser only handle
              // the first 100 entries.
              // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
              readEntries();
            }
            return null;
          }
          , errorHandler);
    };

    return readEntries();
  }


  // If `done()` is called without argument the file is accepted
  // If you call it with an error message, the file is rejected
  // (This allows for asynchronous validation)
  //
  // This function checks the filesize, and if the file.type passes the
  // `acceptedFiles` check.
  accept(file, done) {
    if (file.size > (this.options.maxFilesize * 1024 * 1024)) {
      return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
    } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
      return done(this.options.dictInvalidFileType);
    } else if ((this.options.maxFiles != null) && (this.getAcceptedFiles().length >= this.options.maxFiles)) {
      done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
      return this.emit("maxfilesexceeded", file);
    } else {
      return this.options.accept.call(this, file, done);
    }
  }

  addFile(file) {
    file.upload = {
      uuid: Dropzone.uuidv4(),
      progress: 0,
      // Setting the total upload size to file.size for the beginning
      // It's actual different than the size to be transmitted.
      total: file.size,
      bytesSent: 0,
      filename: this._renameFile(file),
      chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
      totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
    };
    this.files.push(file);

    file.status = Dropzone.ADDED;

    this.emit("addedfile", file);

    this._enqueueThumbnail(file);

    return this.accept(file, error => {
      if (error) {
        file.accepted = false;
        this._errorProcessing([file], error); // Will set the file.status
      } else {
        file.accepted = true;
        if (this.options.autoQueue) {
          this.enqueueFile(file);
        } // Will set .accepted = true
      }
      return this._updateMaxFilesReachedClass();
    });
  }


  // Wrapper for enqueueFile
  enqueueFiles(files) {
    for (let file of files) {
      this.enqueueFile(file);
    }
    return null;
  }

  enqueueFile(file) {
    if ((file.status === Dropzone.ADDED) && (file.accepted === true)) {
      file.status = Dropzone.QUEUED;
      if (this.options.autoProcessQueue) {
        return setTimeout((() => this.processQueue()), 0); // Deferring the call
      }
    } else {
      throw new Error("This file can't be queued because it has already been processed or was rejected.");
    }
  }

  _enqueueThumbnail(file) {
    if (this.options.createImageThumbnails && file.type.match(/image.*/) && (file.size <= (this.options.maxThumbnailFilesize * 1024 * 1024))) {
      this._thumbnailQueue.push(file);
      return setTimeout((() => this._processThumbnailQueue()), 0); // Deferring the call
    }
  }

  _processThumbnailQueue() {
    if (this._processingThumbnail || (this._thumbnailQueue.length === 0)) {
      return;
    }

    this._processingThumbnail = true;
    let file = this._thumbnailQueue.shift();
    return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, dataUrl => {
      this.emit("thumbnail", file, dataUrl);
      this._processingThumbnail = false;
      return this._processThumbnailQueue();
    });
  }


  // Can be called by the user to remove a file
  removeFile(file) {
    if (file.status === Dropzone.UPLOADING) {
      this.cancelUpload(file);
    }
    this.files = without(this.files, file);

    this.emit("removedfile", file);
    if (this.files.length === 0) {
      return this.emit("reset");
    }
  }

  // Removes all files that aren't currently processed from the list
  removeAllFiles(cancelIfNecessary) {
    // Create a copy of files since removeFile() changes the @files array.
    if (cancelIfNecessary == null) {
      cancelIfNecessary = false;
    }
    for (let file of this.files.slice()) {
      if ((file.status !== Dropzone.UPLOADING) || cancelIfNecessary) {
        this.removeFile(file);
      }
    }
    return null;
  }

  // Resizes an image before it gets sent to the server. This function is the default behavior of
  // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
  // the resized blob.
  resizeImage(file, width, height, resizeMethod, callback) {
    return this.createThumbnail(file, width, height, resizeMethod, false, (dataUrl, canvas) => {
      if (canvas === null) {
        // The image has not been resized
        return callback(file);
      } else {
        let {resizeMimeType} = this.options;
        if (resizeMimeType == null) {
          resizeMimeType = file.type;
        }
        let resizedDataURL = canvas.toDataURL(resizeMimeType, this.options.resizeQuality);
        if ((resizeMimeType === 'image/jpeg') || (resizeMimeType === 'image/jpg')) {
          // Now add the original EXIF information
          resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
        }
        return callback(Dropzone.dataURItoBlob(resizedDataURL));
      }
    });
  }

  createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
    let fileReader = new FileReader;

    fileReader.onload = () => {

      file.dataURL = fileReader.result;

      // Don't bother creating a thumbnail for SVG images since they're vector
      if (file.type === "image/svg+xml") {
        if (callback != null) {
          callback(fileReader.result);
        }
        return;
      }

      return this.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
    };

    return fileReader.readAsDataURL(file);
  }

  createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
    // Not using `new Image` here because of a bug in latest Chrome versions.
    // See https://github.com/enyo/dropzone/pull/226
    let img = document.createElement("img");

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    img.onload = () => {
      let loadExif = callback => callback(1);
      if ((typeof EXIF !== 'undefined' && EXIF !== null) && fixOrientation) {
        loadExif = callback =>
            EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, 'Orientation'));
            })
        ;
      }

      return loadExif(orientation => {
        file.width = img.width;
        file.height = img.height;

        let resizeInfo = this.options.resize.call(this, file, width, height, resizeMethod);

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = resizeInfo.trgWidth;
        canvas.height = resizeInfo.trgHeight;

        if (orientation > 4) {
          canvas.width = resizeInfo.trgHeight;
          canvas.height = resizeInfo.trgWidth;
        }

        switch (orientation) {
          case 2:
            // horizontal flip
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            break;
          case 3:
            // 180° rotate left
            ctx.translate(canvas.width, canvas.height);
            ctx.rotate(Math.PI);
            break;
          case 4:
            // vertical flip
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
            break;
          case 5:
            // vertical flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6:
            // 90° rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -canvas.height);
            break;
          case 7:
            // horizontal flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(canvas.width, -canvas.height);
            ctx.scale(-1, 1);
            break;
          case 8:
            // 90° rotate left
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-canvas.width, 0);
            break;
        }

        // This is a bugfix for iOS' scaling bug.
        drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

        let thumbnail = canvas.toDataURL("image/png");

        if (callback != null) {
          return callback(thumbnail, canvas);
        }
      });
    };

    if (callback != null) {
      img.onerror = callback;
    }

    return img.src = file.dataURL;
  }


  // Goes through the queue and processes files if there aren't too many already.
  processQueue() {
    let {parallelUploads} = this.options;
    let processingLength = this.getUploadingFiles().length;
    let i = processingLength;

    // There are already at least as many files uploading than should be
    if (processingLength >= parallelUploads) {
      return;
    }

    let queuedFiles = this.getQueuedFiles();

    if (!(queuedFiles.length > 0)) {
      return;
    }

    if (this.options.uploadMultiple) {
      // The files should be uploaded in one request
      return this.processFiles(queuedFiles.slice(0, (parallelUploads - processingLength)));
    } else {
      while (i < parallelUploads) {
        if (!queuedFiles.length) {
          return;
        } // Nothing left to process
        this.processFile(queuedFiles.shift());
        i++;
      }
    }
  }


  // Wrapper for `processFiles`
  processFile(file) {
    return this.processFiles([file]);
  }


  // Loads the file, then calls finishedLoading()
  processFiles(files) {
    for (let file of files) {
      file.processing = true; // Backwards compatibility
      file.status = Dropzone.UPLOADING;

      this.emit("processing", file);
    }

    if (this.options.uploadMultiple) {
      this.emit("processingmultiple", files);
    }

    return this.uploadFiles(files);
  }


  _getFilesWithXhr(xhr) {
    let files;
    return files = (this.files.filter((file) => file.xhr === xhr).map((file) => file));
  }


  // Cancels the file upload and sets the status to CANCELED
  // **if** the file is actually being uploaded.
  // If it's still in the queue, the file is being removed from it and the status
  // set to CANCELED.
  cancelUpload(file) {
    if (file.status === Dropzone.UPLOADING) {
      let groupedFiles = this._getFilesWithXhr(file.xhr);
      for (let groupedFile of groupedFiles) {
        groupedFile.status = Dropzone.CANCELED;
      }
      if (typeof file.xhr !== 'undefined') {
        file.xhr.abort();
      }
      for (let groupedFile of groupedFiles) {
        this.emit("canceled", groupedFile);
      }
      if (this.options.uploadMultiple) {
        this.emit("canceledmultiple", groupedFiles);
      }

    } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
      file.status = Dropzone.CANCELED;
      this.emit("canceled", file);
      if (this.options.uploadMultiple) {
        this.emit("canceledmultiple", [file]);
      }
    }

    if (this.options.autoProcessQueue) {
      return this.processQueue();
    }
  }

  resolveOption(option, ...args) {
    if (typeof option === 'function') {
      return option.apply(this, args);
    }
    return option;
  }

  uploadFile(file) { return this.uploadFiles([file]); }

  uploadFiles(files) {
    this._transformFiles(files, (transformedFiles) => {
      if (files[0].upload.chunked) {
        // This file should be sent in chunks!

        // If the chunking option is set, we **know** that there can only be **one** file, since
        // uploadMultiple is not allowed with this option.
        let file = files[0];
        let transformedFile = transformedFiles[0];
        let startedChunkCount = 0;

        file.upload.chunks = [];

        let handleNextChunk = () => {
          let chunkIndex = 0;

          // Find the next item in file.upload.chunks that is not defined yet.
          while (file.upload.chunks[chunkIndex] !== undefined) {
            chunkIndex++;
          }

          // This means, that all chunks have already been started.
          if (chunkIndex >= file.upload.totalChunkCount) return;

          startedChunkCount++;

          let start = chunkIndex * this.options.chunkSize;
          let end = Math.min(start + this.options.chunkSize, file.size);

          let dataBlock = {
            name: this._getParamName(0),
            data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
            filename: file.upload.filename,
            chunkIndex: chunkIndex
          };

          file.upload.chunks[chunkIndex] = {
            file: file,
            index: chunkIndex,
            dataBlock: dataBlock, // In case we want to retry.
            status: Dropzone.UPLOADING,
            progress: 0,
            retries: 0 // The number of times this block has been retried.
          };


          this._uploadData(files, [dataBlock]);
        };

        file.upload.finishedChunkUpload = (chunk) => {
          let allFinished = true;
          chunk.status = Dropzone.SUCCESS;

          // Clear the data from the chunk
          chunk.dataBlock = null;

          for (let i = 0; i < file.upload.totalChunkCount; i ++) {
            if (file.upload.chunks[i] === undefined) {
              return handleNextChunk();
            }
            if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
              allFinished = false;
            }
          }

          if (allFinished) {
            this.options.chunksUploaded(file, () => {
              this._finished(files, '', null);
            });
          }
        };

        if (this.options.parallelChunkUploads) {
          for (let i = 0; i < file.upload.totalChunkCount; i++) {
            handleNextChunk();
          }
        }
        else {
          handleNextChunk();
        }
      } else {
        let dataBlocks = [];
        for (let i = 0; i < files.length; i++) {
          dataBlocks[i] = {
            name: this._getParamName(i),
            data: transformedFiles[i],
            filename: files[i].upload.filename
          };
        }
        this._uploadData(files, dataBlocks);
      }
    });
  }

  /// Returns the right chunk for given file and xhr
  _getChunk(file, xhr) {
    for (let i = 0; i < file.upload.totalChunkCount; i++) {
      if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
        return file.upload.chunks[i];
      }
    }
  }

  // This function actually uploads the file(s) to the server.
  // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
  // files, or individual chunks for chunked upload).
  _uploadData(files, dataBlocks) {
    let xhr = new XMLHttpRequest();

    // Put the xhr object in the file objects to be able to reference it later.
    for (let file of files) {
      file.xhr = xhr;
    }
    if (files[0].upload.chunked) {
      // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
      files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
    }

    let method = this.resolveOption(this.options.method, files);
    let url = this.resolveOption(this.options.url, files);
    xhr.open(method, url, true);

    // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
    xhr.timeout = this.resolveOption(this.options.timeout, files);

    // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
    xhr.withCredentials = !!this.options.withCredentials;


    xhr.onload = e => {
      this._finishedUploading(files, xhr, e);
    };

    xhr.onerror = () => {
      this._handleUploadError(files, xhr);
    };

    // Some browsers do not have the .upload property
    let progressObj = xhr.upload != null ? xhr.upload : xhr;
    progressObj.onprogress = (e) => this._updateFilesUploadProgress(files, xhr, e);

    let headers = {
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "X-Requested-With": "XMLHttpRequest",
    };

    if (this.options.headers) {
      Dropzone.extend(headers, this.options.headers);
    }

    for (let headerName in headers) {
      let headerValue = headers[headerName];
      if (headerValue) {
        xhr.setRequestHeader(headerName, headerValue);
      }
    }

    let formData = new FormData();

    // Adding all @options parameters
    if (this.options.params) {
      let additionalParams = this.options.params;
      if (typeof additionalParams === 'function') {
        additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
      }

      for (let key in additionalParams) {
        let value = additionalParams[key];
        formData.append(key, value);
      }
    }

    // Let the user add additional data if necessary
    for (let file of files) {
      this.emit("sending", file, xhr, formData);
    }
    if (this.options.uploadMultiple) {
      this.emit("sendingmultiple", files, xhr, formData);
    }


    this._addFormElementData(formData);


    // Finally add the files
    // Has to be last because some servers (eg: S3) expect the file to be the last parameter
    for (let i = 0; i < dataBlocks.length; i++) {
      let dataBlock = dataBlocks[i];
      formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
    }

    this.submitRequest(xhr, formData, files);
  }


  // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.
  _transformFiles(files, done) {
    let transformedFiles = [];
    // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
    let doneCounter = 0;
    for (let i = 0; i < files.length; i++) {
      this.options.transformFile.call(this, files[i], (transformedFile) => {
        transformedFiles[i] = transformedFile;
        if (++doneCounter === files.length) {
          done(transformedFiles);
        }
      });
    }
  }

  // Takes care of adding other input elements of the form to the AJAX request
  _addFormElementData(formData) {
    // Take care of other input elements
    if (this.element.tagName === "FORM") {
      for (let input of this.element.querySelectorAll("input, textarea, select, button")) {
        let inputName = input.getAttribute("name");
        let inputType = input.getAttribute("type");
        if (inputType) inputType = inputType.toLowerCase();

        // If the input doesn't have a name, we can't use it.
        if (typeof inputName === 'undefined' || inputName === null) continue;

        if ((input.tagName === "SELECT") && input.hasAttribute("multiple")) {
          // Possibly multiple values
          for (let option of input.options) {
            if (option.selected) {
              formData.append(inputName, option.value);
            }
          }
        } else if (!inputType || (inputType !== "checkbox" && inputType !== "radio") || input.checked) {
          formData.append(inputName, input.value);
        }
      }
    }
  }

  // Invoked when there is new progress information about given files.
  // If e is not provided, it is assumed that the upload is finished.
  _updateFilesUploadProgress(files, xhr, e) {
    let progress;
    if (typeof e !== 'undefined') {
      progress = (100 * e.loaded) / e.total;

      if (files[0].upload.chunked) {
        let file = files[0];
        // Since this is a chunked upload, we need to update the appropriate chunk progress.
        let chunk = this._getChunk(file, xhr);
        chunk.progress = progress;
        chunk.total = e.total;
        chunk.bytesSent = e.loaded;
        let fileProgress = 0, fileTotal, fileBytesSent;
        file.upload.progress = 0;
        file.upload.total = 0;
        file.upload.bytesSent = 0;
        for (let i = 0; i < file.upload.totalChunkCount; i++) {
          if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
            file.upload.progress += file.upload.chunks[i].progress;
            file.upload.total += file.upload.chunks[i].total;
            file.upload.bytesSent += file.upload.chunks[i].bytesSent;
          }
        }
        file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
      } else {
        for (let file of files) {
          file.upload.progress = progress;
          file.upload.total = e.total;
          file.upload.bytesSent = e.loaded;
        }
      }
      for (let file of files) {
        this.emit("uploadprogress", file, file.upload.progress, file.upload.bytesSent);
      }
    } else {
      // Called when the file finished uploading

      let allFilesFinished = true;

      progress = 100;

      for (let file of files) {
        if ((file.upload.progress !== 100) || (file.upload.bytesSent !== file.upload.total)) {
          allFilesFinished = false;
        }
        file.upload.progress = progress;
        file.upload.bytesSent = file.upload.total;
      }

      // Nothing to do, all files already at 100%
      if (allFilesFinished) {
        return;
      }

      for (let file of files) {
        this.emit("uploadprogress", file, progress, file.upload.bytesSent);
      }
    }

  }


  _finishedUploading(files, xhr, e) {
    let response;

    if (files[0].status === Dropzone.CANCELED) {
      return;
    }

    if (xhr.readyState !== 4) {
      return;
    }

    if ((xhr.responseType !== 'arraybuffer') && (xhr.responseType !== 'blob')) {
      response = xhr.responseText;

      if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
        try {
          response = JSON.parse(response);
        } catch (error) {
          e = error;
          response = "Invalid JSON response from server.";
        }
      }
    }

    this._updateFilesUploadProgress(files);

    if (!(200 <= xhr.status && xhr.status < 300)) {
      this._handleUploadError(files, xhr, response);
    } else {
      if (files[0].upload.chunked) {
        files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
      } else {
        this._finished(files, response, e);
      }
    }
  }

  _handleUploadError(files, xhr, response) {
    if (files[0].status === Dropzone.CANCELED) {
      return;
    }

    if (files[0].upload.chunked && this.options.retryChunks) {
      let chunk = this._getChunk(files[0], xhr);
      if (chunk.retries++ < this.options.retryChunksLimit) {
        this._uploadData(files, [chunk.dataBlock]);
        return;
      } else {
        console.warn('Retried this chunk too often. Giving up.')
      }
    }

    for (let file of files) {
      this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
    }
  }

  submitRequest(xhr, formData, files) {
    xhr.send(formData);
  }

  // Called internally when processing is finished.
  // Individual callbacks have to be called in the appropriate sections.
  _finished(files, responseText, e) {
    for (let file of files) {
      file.status = Dropzone.SUCCESS;
      this.emit("success", file, responseText, e);
      this.emit("complete", file);
    }
    if (this.options.uploadMultiple) {
      this.emit("successmultiple", files, responseText, e);
      this.emit("completemultiple", files);
    }

    if (this.options.autoProcessQueue) {
      return this.processQueue();
    }
  }

  // Called internally when processing is finished.
  // Individual callbacks have to be called in the appropriate sections.
  _errorProcessing(files, message, xhr) {
    for (let file of files) {
      file.status = Dropzone.ERROR;
      this.emit("error", file, message, xhr);
      this.emit("complete", file);
    }
    if (this.options.uploadMultiple) {
      this.emit("errormultiple", files, message, xhr);
      this.emit("completemultiple", files);
    }

    if (this.options.autoProcessQueue) {
      return this.processQueue();
    }
  }

  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}
Dropzone.initClass();


Dropzone.version = "5.2.0";


// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};


// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
};


// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }
  return element.dropzone;
};


// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
  let dropzones;
  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = [];
    // IE :(
    let checkElements = elements =>
        (() => {
          let result = [];
          for (let el of elements) {
            if (/(^| )dropzone($| )/.test(el.className)) {
              result.push(dropzones.push(el));
            } else {
              result.push(undefined);
            }
          }
          return result;
        })()
    ;
    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return (() => {
    let result = [];
    for (let dropzone of dropzones) {
      // Create a dropzone unless auto discover has been disabled for specific element
      if (Dropzone.optionsForElement(dropzone) !== false) {
        result.push(new Dropzone(dropzone));
      } else {
        result.push(undefined);
      }
    }
    return result;
  })();
};


// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
  // The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
  /opera.*(Macintosh|Windows Phone).*version\/12/i
];


// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
  let capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      // The browser supports the API, but may be blacklisted.
      for (let regex of Dropzone.blacklistedBrowsers) {
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

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  let byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], {type: mimeString});
};

// Returns an array without the rejected item
const without = (list, rejectedItem) => list.filter((item) => item !== rejectedItem).map((item) => item);

// abc-def_ghi -> abcDefGhi
const camelize = str => str.replace(/[\-_](\w)/g, match => match.charAt(1).toUpperCase());

// Creates an element from string
Dropzone.createElement = function (string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops
  while ((element = element.parentNode)) {
    if (element === container) {
      return true;
    }
  }
  return false;
};


Dropzone.getElement = function (el, name) {
  let element;
  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }
  if (element == null) {
    throw new Error(`Invalid \`${name}\` option provided. Please provide a CSS selector or a plain HTML element.`);
  }
  return element;
};


Dropzone.getElements = function (els, name) {
  let el, elements;
  if (els instanceof Array) {
    elements = [];
    try {
      for (el of els) {
        elements.push(this.getElement(el, name));
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];
    for (el of document.querySelectorAll(els)) {
      elements.push(el);
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if ((elements == null) || !elements.length) {
    throw new Error(`Invalid \`${name}\` option provided. Please provide a CSS selector, a plain HTML element or a list of those.`);
  }

  return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK
  acceptedFiles = acceptedFiles.split(",");

  let mimeType = file.type;
  let baseMimeType = mimeType.replace(/\/.*$/, "");

  for (let validType of acceptedFiles) {
    validType = validType.trim();
    if (validType.charAt(0) === ".") {
      if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
        return true;
      }
    } else if (/\/\*$/.test(validType)) {
      // This is something like a image/* mime type
      if (baseMimeType === validType.replace(/\/.*$/, "")) {
        return true;
      }
    } else {
      if (mimeType === validType) {
        return true;
      }
    }
  }

  return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
}


if (typeof module !== 'undefined' && module !== null) {
  module.exports = Dropzone;
} else {
  window.Dropzone = Dropzone;
}


// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";


/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
let detectVerticalSquash = function (img) {
  let iw = img.naturalWidth;
  let ih = img.naturalHeight;
  let canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  let {data} = ctx.getImageData(1, 0, 1, ih);


  // search image edge pixel position in case it is squashed vertically.
  let sy = 0;
  let ey = ih;
  let py = ih;
  while (py > sy) {
    let alpha = data[((py - 1) * 4) + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = (ey + sy) >> 1;
  }
  let ratio = (py / ih);

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  let vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};


// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html
class ExifRestore {
  static initClass() {
    this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  }

  static encode64(input) {
    let output = '';
    let chr1 = undefined;
    let chr2 = undefined;
    let chr3 = '';
    let enc1 = undefined;
    let enc2 = undefined;
    let enc3 = undefined;
    let enc4 = '';
    let i = 0;
    while (true) {
      chr1 = input[i++];
      chr2 = input[i++];
      chr3 = input[i++];
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = (enc4 = 64);
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
      chr1 = (chr2 = (chr3 = ''));
      enc1 = (enc2 = (enc3 = (enc4 = '')));
      if (!(i < input.length)) {
        break;
      }
    }
    return output;
  }

  static restore(origFileBase64, resizedFileBase64) {
    if (!origFileBase64.match('data:image/jpeg;base64,')) {
      return resizedFileBase64;
    }
    let rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
    let segments = this.slice2Segments(rawImage);
    let image = this.exifManipulation(resizedFileBase64, segments);
    return `data:image/jpeg;base64,${this.encode64(image)}`;
  }

  static exifManipulation(resizedFileBase64, segments) {
    let exifArray = this.getExifArray(segments);
    let newImageArray = this.insertExif(resizedFileBase64, exifArray);
    let aBuffer = new Uint8Array(newImageArray);
    return aBuffer;
  }

  static getExifArray(segments) {
    let seg = undefined;
    let x = 0;
    while (x < segments.length) {
      seg = segments[x];
      if ((seg[0] === 255) & (seg[1] === 225)) {
        return seg;
      }
      x++;
    }
    return [];
  }

  static insertExif(resizedFileBase64, exifArray) {
    let imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
    let buf = this.decode64(imageData);
    let separatePoint = buf.indexOf(255, 3);
    let mae = buf.slice(0, separatePoint);
    let ato = buf.slice(separatePoint);
    let array = mae;
    array = array.concat(exifArray);
    array = array.concat(ato);
    return array;
  }

  static slice2Segments(rawImageArray) {
    let head = 0;
    let segments = [];
    while (true) {
      var length;
      if ((rawImageArray[head] === 255) & (rawImageArray[head + 1] === 218)) {
        break;
      }
      if ((rawImageArray[head] === 255) & (rawImageArray[head + 1] === 216)) {
        head += 2;
      } else {
        length = (rawImageArray[head + 2] * 256) + rawImageArray[head + 3];
        let endPoint = head + length + 2;
        let seg = rawImageArray.slice(head, endPoint);
        segments.push(seg);
        head = endPoint;
      }
      if (head > rawImageArray.length) {
        break;
      }
    }
    return segments;
  }

  static decode64(input) {
    let output = '';
    let chr1 = undefined;
    let chr2 = undefined;
    let chr3 = '';
    let enc1 = undefined;
    let enc2 = undefined;
    let enc3 = undefined;
    let enc4 = '';
    let i = 0;
    let buf = [];
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    let base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (true) {
      enc1 = this.KEY_STR.indexOf(input.charAt(i++));
      enc2 = this.KEY_STR.indexOf(input.charAt(i++));
      enc3 = this.KEY_STR.indexOf(input.charAt(i++));
      enc4 = this.KEY_STR.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      buf.push(chr1);
      if (enc3 !== 64) {
        buf.push(chr2);
      }
      if (enc4 !== 64) {
        buf.push(chr3);
      }
      chr1 = (chr2 = (chr3 = ''));
      enc1 = (enc2 = (enc3 = (enc4 = '')));
      if (!(i < input.length)) {
        break;
      }
    }
    return buf;
  }
}
ExifRestore.initClass();


/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
let contentLoaded = function (win, fn) {
  let done = false;
  let top = true;
  let doc = win.document;
  let root = doc.documentElement;
  let add = (doc.addEventListener ? "addEventListener" : "attachEvent");
  let rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
  let pre = (doc.addEventListener ? "" : "on");
  var init = function (e) {
    if ((e.type === "readystatechange") && (doc.readyState !== "complete")) {
      return;
    }
    ((e.type === "load" ? win : doc))[rem](pre + e.type, init, false);
    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function () {
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
      } catch (error) {
      }
      if (top) {
        poll();
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
};


// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}