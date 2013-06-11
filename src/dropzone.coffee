###
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
###


# Dependencies
Em = Emitter ? require "emitter" # Can't be the same name because it will lead to a local variable

noop = ->

class Dropzone extends Em

  ###
  This is a list of all available events you can register on a dropzone object.

  You can register an event handler like this:

      dropzone.on("dragEnter", function() { });

  ###
  events: [
    "drop"
    "dragstart"
    "dragend"
    "dragenter"
    "dragover"
    "dragleave"
    "selectedfiles"
    "addedfile"
    "removedfile"
    "thumbnail"
    "error"
    "processingfile"
    "uploadprogress"
    "totaluploadprogress"
    "sending"
    "success"
    "complete"
    "reset"
  ]



  defaultOptions:
    url: null
    method: "post"
    withCredentials: no
    parallelUploads: 2
    maxFilesize: 256 # in MB
    paramName: "file" # The name of the file param that gets transferred.
    createImageThumbnails: true
    maxThumbnailFilesize: 10 # in MB. When the filename exceeds this limit, the thumbnail will not be generated.
    thumbnailWidth: 100
    thumbnailHeight: 100

    # Can be an object of additional parameters to transfer to the server.
    # This is the same as adding hidden input fields in the form element.
    params: { }

    # If true, the dropzone will present a file selector when clicked.
    clickable: yes

    # You can set accepted mime types here. 
    # 
    # The default implementation of the `accept()` function will check this 
    # property, and if the Dropzone is clickable this will be used as
    # `accept` attribute.
    # 
    # See https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
    # for a reference.
    acceptedMimeTypes: null # eg: "audio/*,video/*,image/*"

    # @deprecated
    # Use acceptedMimeTypes instead.
    acceptParameter: null

    # If false, files will not be added to the process queue automatically.
    # This can be useful if you need some additional user input before sending
    # files.
    # If you're ready to send the file, add it to the `filesQueue` and call
    # processQueue()
    enqueueForUpload: yes

    # A CSS selector or HTML element for the file previews container.
    # If null, the dropzone element itself will be used
    previewsContainer: null
    

    # Dictionary
     
    # The text used before any files are dropped
    dictDefaultMessage: "Drop files here to upload"

    # The text that replaces the default message text it the browser is not supported
    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads."

    # The text that will be added before the fallback form
    # If null, no text will be added at all.
    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days."

    # If the filesize is too big.
    dictFileTooBig: "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB."

    # If the file doesn't match the file type.
    dictInvalidFileType: "You can't upload files of this type."

    # If the server response was invalid.
    dictResponseError: "Server responded with {{statusCode}} code."

    # If `done()` is called without argument the file is accepted
    # If you call it with an error message, the file is rejected
    # (This allows for asynchronous validation).
    accept: (file, done) -> done()


    # Called when dropzone initialized
    # You can add event listeners here
    init: -> noop

    # Used to debug dropzone and force the fallback form.
    forceFallback: off

    # Called when the browser does not support drag and drop
    fallback: ->
      # This code should pass in IE7... :(
      @element.className = "#{@element.className} dz-browser-not-supported"

      for child in @element.getElementsByTagName "div"
        if /(^| )message($| )/.test child.className
          messageElement = child
          child.className = "dz-message" # Removes the 'default' class
          continue
      unless messageElement
        messageElement = Dropzone.createElement """<div class="dz-message"><span></span></div>"""
        @element.appendChild messageElement
          
      span = messageElement.getElementsByTagName("span")[0]
      span.textContent = @options.dictFallbackMessage if span

      @element.appendChild @getFallbackForm()
    


    # Gets called to calculate the thumbnail dimensions.
    # 
    # You can use file.width, file.height, options.thumbnailWidth and
    # options.thumbnailHeight to calculate the dimensions.
    # 
    # The dimensions are going to be used like this:
    #   
    #     var info = @options.resize.call(this, file);
    #     ctx.drawImage(img, info.srcX, info.srcY, info.srcWidth, info.srcHeight, info.trgX, info.trgY, info.trgWidth, info.trgHeight);
    #     
    #  srcX, srcy, trgX and trgY can be omitted (in which case 0 is assumed).
    #  trgWidth and trgHeight can be omitted (in which case the options.thumbnailWidth / options.thumbnailHeight are used)
    resize: (file) ->
      info =
        srcX: 0
        srcY: 0
        srcWidth: file.width
        srcHeight: file.height

      srcRatio = file.width / file.height
      trgRatio = @options.thumbnailWidth / @options.thumbnailHeight
      
      if file.height < @options.thumbnailHeight or file.width < @options.thumbnailWidth
        # This image is smaller than the canvas
        info.trgHeight = info.srcHeight
        info.trgWidth = info.srcWidth
      else
        # Image is bigger and needs rescaling
        if srcRatio > trgRatio
          info.srcHeight = file.height
          info.srcWidth = info.srcHeight * trgRatio
        else
          info.srcWidth = file.width
          info.srcHeight = info.srcWidth / trgRatio

      info.srcX = (file.width - info.srcWidth) / 2
      info.srcY = (file.height - info.srcHeight) / 2

      return info


    ###
    Those functions register themselves to the events on init and handle all
    the user interface specific stuff. Overwriting them won't break the upload
    but can break the way it's displayed.
    You can overwrite them if you don't like the default behavior. If you just
    want to add an additional event handler, register it on the dropzone object
    and don't overwrite those options.
    ###




    # Those are self explanatory and simply concern the DragnDrop.
    drop: (e) -> @element.classList.remove "dz-drag-hover"
    dragstart: noop
    dragend: (e) -> @element.classList.remove "dz-drag-hover"
    dragenter: (e) -> @element.classList.add "dz-drag-hover"
    dragover: (e) -> @element.classList.add "dz-drag-hover"
    dragleave: (e) -> @element.classList.remove "dz-drag-hover"
    
    # Called whenever files are dropped or selected
    selectedfiles: (files) ->
      @element.classList.add "dz-started" if @element == @previewsContainer

    # Called whenever there are no files left in the dropzone anymore, and the
    # dropzone should be displayed as if in the initial state.
    reset: ->
      @element.classList.remove "dz-started"

    # Called when a file is added to the queue
    # Receives `file`
    addedfile: (file) ->
      file.previewElement = Dropzone.createElement @options.previewTemplate
      file.previewTemplate = file.previewElement # Backwards compatibility

      @previewsContainer.appendChild file.previewElement
      file.previewElement.querySelector("[data-dz-name]").textContent = file.name
      file.previewElement.querySelector("[data-dz-size]").innerHTML = @filesize file.size


    # Called whenever a file is removed.
    removedfile: (file) ->
      file.previewElement?.parentNode.removeChild file.previewElement

    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: (file, dataUrl) ->
      file.previewElement.classList.remove "dz-file-preview"
      file.previewElement.classList.add "dz-image-preview"
      thumbnailElement = file.previewElement.querySelector("[data-dz-thumbnail]")
      thumbnailElement.alt = file.name
      thumbnailElement.src = dataUrl

    
    # Called whenever an error occurs
    # Receives `file` and `message`
    error: (file, message) ->
      file.previewElement.classList.add "dz-error"
      file.previewElement.querySelector("[data-dz-errormessage]").textContent = message
    
    
    # Called when a file gets processed. Since there is a cue, not all added
    # files are processed immediately.
    # Receives `file`
    processingfile: (file) ->
      file.previewElement.classList.add "dz-processing"
    
    # Called whenever the upload progress gets updated.
    # Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
    # To get the total number of bytes of the file, use `file.size`
    uploadprogress: (file, progress, bytesSent) ->
      file.previewElement.querySelector("[data-dz-uploadprogress]").style.width = "#{progress}%"

    # Called whenever the total upload progress gets updated.
    # Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
    totaluploadprogress: noop

    # Called just before the file is sent. Gets the `xhr` object as second
    # parameter, so you can modify it (for example to add a CSRF token) and a
    # `formData` object to add additional information.
    sending: noop
    
    # When the complete upload is finished and successfull
    # Receives `file`
    success: (file) ->
      file.previewElement.classList.add "dz-success"

    # When the upload is finished, either with success or an error.
    # Receives `file`
    complete: noop



    # This template will be chosen when a new file is dropped.
    previewTemplate:  """
                      <div class="dz-preview dz-file-preview">
                        <div class="dz-details">
                          <div class="dz-filename"><span data-dz-name></span></div>
                          <div class="dz-size" data-dz-size></div>
                          <img data-dz-thumbnail />
                        </div>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                        <div class="dz-success-mark"><span>✔</span></div>
                        <div class="dz-error-mark"><span>✘</span></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                      </div>
                      """

  # global utility
  extend = (target, objects...) ->
    for object in objects
      target[key] = val for key, val of object
    target

  constructor: (@element, options) ->
    # For backwards compatibility since the version was in the prototype previously
    @version = Dropzone.version

    @defaultOptions.previewTemplate = @defaultOptions.previewTemplate.replace /\n*/g, ""

    @clickableElements = [ ]
    @listeners = [ ]
    @files = [] # All files
    @acceptedFiles = [] # All files that are actually accepted
    @filesQueue = [] # The files that still have to be processed
    @filesProcessing = [] # The files currently processed

    @element = document.querySelector @element if typeof @element == "string"

    # Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    throw new Error "Invalid dropzone element." unless @element and @element.nodeType?

    throw new Error "Dropzone already attached." if @element.dropzone

    # Now add this dropzone to the instances.
    Dropzone.instances.push @

    # Put the dropzone inside the element itself.
    element.dropzone = @

    elementOptions = Dropzone.optionsForElement(@element) ? { }

    @options = extend { }, @defaultOptions, elementOptions, options ? { }

    @options.url = @element.action unless @options.url?

    throw new Error "No URL provided." unless @options.url

    throw new Error "You can't provide both 'acceptParameter' and 'acceptedMimeTypes'. 'acceptParameter' is deprecated." if @options.acceptParameter and @options.acceptedMimeTypes

    @options.method = @options.method.toUpperCase()

    # If the browser failed, just call the fallback and leave
    return @options.fallback.call this if @options.forceFallback or !Dropzone.isBrowserSupported()

    if (fallback = @getExistingFallback()) and fallback.parentNode
      # Remove the fallback
      fallback.parentNode.removeChild fallback

    if @options.previewsContainer
      @previewsContainer = Dropzone.getElement @options.previewsContainer, "previewsContainer"
    else
      @previewsContainer = @element

    if @options.clickable
      if @options.clickable == yes
        @clickableElements = [ @element ]
      else
        @clickableElements = Dropzone.getElements @options.clickable, "clickable"
      

    @init()




  init: ->
    # In case it isn't set already
    @element.setAttribute("enctype", "multipart/form-data") if @element.tagName == "form"

    if @element.classList.contains("dropzone") and !@element.querySelector("[data-dz-message]")
      @element.appendChild Dropzone.createElement """<div class="dz-default dz-message" data-dz-message><span>#{@options.dictDefaultMessage}</span></div>"""

    if @clickableElements.length
      setupHiddenFileInput = =>
        document.body.removeChild @hiddenFileInput if @hiddenFileInput
        @hiddenFileInput = document.createElement "input"
        @hiddenFileInput.setAttribute "type", "file"
        @hiddenFileInput.setAttribute "multiple", "multiple"

        @hiddenFileInput.setAttribute "accept", @options.acceptedMimeTypes if @options.acceptedMimeTypes?

        # Backwards compatibility
        @hiddenFileInput.setAttribute "accept", @options.acceptParameter if @options.acceptParameter?

        # Not setting `display="none"` because some browsers don't accept clicks
        # on elements that aren't displayed.
        @hiddenFileInput.style.visibility = "hidden"
        @hiddenFileInput.style.position = "absolute"
        @hiddenFileInput.style.top = "0"
        @hiddenFileInput.style.left = "0"
        @hiddenFileInput.style.height = "0"
        @hiddenFileInput.style.width = "0"
        document.body.appendChild @hiddenFileInput
        @hiddenFileInput.addEventListener "change", =>
          files = @hiddenFileInput.files
          if files.length
            @emit "selectedfiles", files
            @handleFiles files
          setupHiddenFileInput()
      setupHiddenFileInput()

    @URL = window.URL ? window.webkitURL


    # Setup all event listeners on the Dropzone object itself.
    # They're not in @setupEventListeners() because they shouldn't be removed
    # again when the dropzone gets disabled.
    @on eventName, @options[eventName] for eventName in @events

    @on "uploadprogress", (file) =>
      totalBytesSent = 0;
      totalBytes = 0;
      for file in @acceptedFiles
        totalBytesSent += file.upload.bytesSent
        totalBytes += file.upload.total
      totalUploadProgress = 100 * totalBytesSent / totalBytes
      @emit "totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent


    noPropagation = (e) ->
      e.stopPropagation()
      if e.preventDefault
        e.preventDefault()
      else
        e.returnValue = false

    # Create the listeners
    @listeners = [
      {
        element: @element
        events:
          "dragstart": (e) =>
            @emit "dragstart", e
          "dragenter": (e) =>
            noPropagation e
            @emit "dragenter", e
          "dragover": (e) =>
            noPropagation e
            @emit "dragover", e
          "dragleave": (e) =>
            @emit "dragleave", e
          "drop": (e) =>
            noPropagation e
            @drop e
            @emit "drop", e
          "dragend": (e) =>
            @emit "dragend", e
      }
    ]

    @clickableElements.forEach (clickableElement) =>
      @listeners.push
        element: clickableElement
        events:
          "click": (evt) =>
            # Only the actual dropzone or the message element should trigger file selection
            if (clickableElement != @element) or (evt.target == @element or Dropzone.elementInside evt.target, @element.querySelector ".dz-message")
              @hiddenFileInput.click() # Forward the click


    @enable()

    @options.init.call @

  # Not fully tested yet
  destroy: ->
    @disable()
    @removeAllFiles()
    if @hiddenFileInput?.parentNode
      @hiddenFileInput.parentNode.removeChild @hiddenFileInput 
      @hiddenFileInput = null


  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  #
  # If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
  # This code has to pass in IE7 :(
  getFallbackForm: ->
    return existingFallback if existingFallback = @getExistingFallback()

    fieldsString = """<div class="dz-fallback">"""
    fieldsString += """<p>#{@options.dictFallbackText}</p>""" if @options.dictFallbackText
    fieldsString += """<input type="file" name="#{@options.paramName}[]" multiple="multiple" /><button type="submit">Upload!</button></div>"""

    fields = Dropzone.createElement fieldsString
    if @element.tagName isnt "FORM"
      form = Dropzone.createElement("""<form action="#{@options.url}" enctype="multipart/form-data" method="#{@options.method}"></form>""")
      form.appendChild fields
    else
      # Make sure that the enctype and method attributes are set properly
      @element.setAttribute "enctype", "multipart/form-data"
      @element.setAttribute "method", @options.method
    form ? fields


  # Returns the fallback elements if they exist already
  # 
  # This code has to pass in IE7 :(
  getExistingFallback: ->
    getFallback = (elements) -> return el for el in elements when /(^| )fallback($| )/.test el.className

    for tagName in [ "div", "form" ]
      return fallback if fallback = getFallback @element.getElementsByTagName tagName


  # Activates all listeners stored in @listeners
  setupEventListeners: ->
    for elementListeners in @listeners
      elementListeners.element.addEventListener event, listener, false for event, listener of elementListeners.events
      

  # Deactivates all listeners stored in @listeners
  removeEventListeners: ->
    for elementListeners in @listeners
      elementListeners.element.removeEventListener event, listener, false for event, listener of elementListeners.events

  # Removes all event listeners and cancels all files in the queue or being processed.
  disable: ->
    @clickableElements.forEach (element) -> element.classList.remove "dz-clickable"
    @removeEventListeners()

    @cancelUpload file for file in @filesProcessing
    @cancelUpload file for file in @filesQueue

  enable: ->
    @clickableElements.forEach (element) -> element.classList.add "dz-clickable"
    @setupEventListeners()

  # Returns a nicely formatted filesize
  filesize: (size) ->
    if size >= 100000000000
      size = size / 100000000000
      string = "TB"
    else if size >= 100000000
      size = size / 100000000
      string = "GB"
    else if size >= 100000
      size = size / 100000
      string = "MB"
    else if size >= 100
      size = size / 100 
      string = "KB"
    else
      size = size * 10
      string = "b"
    "<strong>#{Math.round(size)/10}</strong> #{string}"

  drop: (e) ->
    return unless e.dataTransfer
    files = e.dataTransfer.files
    @emit "selectedfiles", files
    @handleFiles files if files.length


  handleFiles: (files) ->
    @addFile file for file in files

  # If `done()` is called without argument the file is accepted
  # If you call it with an error message, the file is rejected
  # (This allows for asynchronous validation)
  # 
  # This function checks the filesize, and if the file.type passes the 
  # `acceptedMimeTypes` check.
  accept: (file, done) ->
    if file.size > @options.maxFilesize * 1024 * 1024
      done @options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", @options.maxFilesize)
    else unless Dropzone.isValidMimeType file.type, @options.acceptedMimeTypes
      done @options.dictInvalidFileType
    else
      @options.accept.call this, file, done

  addFile: (file) ->
    file.upload =
      progress: 0
      # Setting the total upload size to file.size for the beginning
      # It's actual different than the size to be transmitted.
      total: file.size
      bytesSent: 0
    @files.push file

    file.status = Dropzone.ADDED

    @emit "addedfile", file

    @createThumbnail file  if @options.createImageThumbnails and file.type.match(/image.*/) and file.size <= @options.maxThumbnailFilesize * 1024 * 1024

    @accept file, (error) =>
      if error
        file.accepted = false # Backwards compatibility
        @errorProcessing file, error # Will set the file.status
      else
        file.status = Dropzone.ACCEPTED
        file.accepted = true # Backwards compatibility

        @acceptedFiles.push file
        if @options.enqueueForUpload
          @filesQueue.push file
          @processQueue()

  # Can be called by the user to remove a file
  removeFile: (file) ->
    @cancelUpload file if file.status == Dropzone.UPLOADING
    @files = without @files, file
    @filesQueue = without @filesQueue, file

    @emit "removedfile", file
    @emit "reset" if @files.length == 0

  # Removes all files that aren't currently processed from the list
  removeAllFiles: ->
    # Create a copy of files since removeFile() changes the @files array.
    for file in @files.slice()
      @removeFile file unless file in @filesProcessing
    return null

  createThumbnail: (file) ->

    fileReader = new FileReader

    fileReader.onload = =>
      img = new Image

      img.onload = =>
        file.width = img.width
        file.height = img.height

        resizeInfo = @options.resize.call @, file

        resizeInfo.trgWidth ?= @options.thumbnailWidth
        resizeInfo.trgHeight ?= @options.thumbnailHeight

        canvas = document.createElement "canvas"
        ctx = canvas.getContext "2d"
        canvas.width = resizeInfo.trgWidth
        canvas.height = resizeInfo.trgHeight
        ctx.drawImage img, resizeInfo.srcX ? 0, resizeInfo.srcY ? 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX ? 0, resizeInfo.trgY ? 0, resizeInfo.trgWidth, resizeInfo.trgHeight
        thumbnail = canvas.toDataURL "image/png"

        @emit "thumbnail", file, thumbnail

      img.src = fileReader.result

    fileReader.readAsDataURL file


  # Goes through the queue and processes files if there aren't too many already.
  processQueue: ->
    parallelUploads = @options.parallelUploads
    processingLength = @filesProcessing.length
    i = processingLength

    while i < parallelUploads
      return unless @filesQueue.length # Nothing left to process
      @processFile @filesQueue.shift()
      i++


  # Loads the file, then calls finishedLoading()
  processFile: (file) ->
    @filesProcessing.push file
    file.processing = yes # Backwards compatibility
    file.status = Dropzone.UPLOADING

    @emit "processingfile", file

    @uploadFile file



  # Cancels the file upload and sets the status to CANCELED
  # **if** the file is actually being uploaded.
  # If it's still in the queue, the file is being removed from it and the status
  # set to CANCELED.
  cancelUpload: (file) ->
    if file.status == Dropzone.UPLOADING
      file.status = Dropzone.CANCELED
      file.xhr.abort()
      @filesProcessing = without(@filesProcessing, file)
    else if file.status in [ Dropzone.ADDED, Dropzone.ACCEPTED ]
      file.status = Dropzone.CANCELED
      @filesQueue = without(@filesQueue, file)

  uploadFile: (file) ->
    xhr = new XMLHttpRequest()

    # Put the xhr object in the file object to be able to reference it later.
    file.xhr = xhr

    xhr.withCredentials = !!@options.withCredentials

    xhr.open @options.method, @options.url, true


    response = null

    handleError = =>
      @errorProcessing file, response || @options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr

    xhr.onload = (e) =>
      return if file.status == Dropzone.CANCELED

      response = xhr.responseText

      if xhr.getResponseHeader("content-type") and ~xhr.getResponseHeader("content-type").indexOf "application/json"
        try
          response = JSON.parse response 
        catch e
          response = "Invalid JSON response from server."

      unless 200 <= xhr.status < 300
        handleError()
      else
        @finished file, response, e

    xhr.onerror = =>
      return if file.status == Dropzone.CANCELED
      handleError()

    # Some browsers do not have the .upload property
    progressObj = xhr.upload ? xhr
    progressObj.onprogress = (e) =>
      file.upload =
        progress: progress
        total: e.total
        bytesSent: e.loaded
      progress = 100 * e.loaded / e.total
      @emit "uploadprogress", file, progress, e.loaded

    headers =
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "X-Requested-With": "XMLHttpRequest",
      "X-File-Name": encodeURIComponent file.name

    extend headers, @options.headers if @options.headers
      
    xhr.setRequestHeader header, name for header, name of headers

    formData = new FormData()

    # Adding all @options parameters
    formData.append key, value for key, value of @options.params if @options.params

    # Take care of other input elements
    if @element.tagName == "FORM"
      for input in @element.querySelectorAll "input, textarea, select, button"
        inputName = input.getAttribute "name"
        inputType = input.getAttribute "type"

        if !inputType or inputType.toLowerCase() != "checkbox" or input.checked
          formData.append inputName, input.value


    # Let the user add additional data if necessary
    @emit "sending", file, xhr, formData

    # Finally add the file
    # Has to be last because some servers (eg: S3) expect the file to be the
    # last parameter
    formData.append @options.paramName, file

    xhr.send formData


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  finished: (file, responseText, e) ->
    @filesProcessing = without(@filesProcessing, file)
    file.processing = no # Backwards compatibility
    file.status = Dropzone.SUCCESS
    @processQueue()
    @emit "success", file, responseText, e
    @emit "finished", file, responseText, e # For backwards compatibility
    @emit "complete", file


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  errorProcessing: (file, message, xhr) ->
    @filesProcessing = without(@filesProcessing, file)
    file.processing = no # Backwards compatibility
    file.status = Dropzone.ERROR
    @processQueue()
    @emit "error", file, message, xhr
    @emit "complete", file



Dropzone.version = "3.3.0"


# This is a map of options for your different dropzones. Add configurations
# to this object for your different dropzone elemens.
#
# Example:
# 
#     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
# 
# To disable autoDiscover for a specific element, you can set `false` as an option:
# 
#     Dropzone.options.myDisabledElementId = false;
# 
# And in html:
# 
#     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = { }


# Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = (element) ->
  # Get the `Dropzone.options.elementId` for this element if it exists
  if element.id then Dropzone.options[camelize element.id] else undefined


# Holds a list of all dropzone instances
Dropzone.instances = [ ]

# Returns the dropzone for given element if any
Dropzone.forElement = (element) ->
  element = document.querySelector element if typeof element == "string"
  return element.dropzone ? null


# Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = on

# Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = ->
  return unless Dropzone.autoDiscover

  if document.querySelectorAll
    dropzones = document.querySelectorAll ".dropzone"
  else
    dropzones = [ ]
    # IE :(
    checkElements = (elements) ->
      for el in elements
        dropzones.push el if /(^| )dropzone($| )/.test el.className
    checkElements document.getElementsByTagName "div"
    checkElements document.getElementsByTagName "form"

  for dropzone in dropzones
    # Create a dropzone unless auto discover has been disabled for specific element
    new Dropzone dropzone unless Dropzone.optionsForElement(dropzone) == false



# Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
# but not correctly.
# So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
# But what to do when browsers *theoretically* support an API, but crash
# when using it.
# 
# This is a list of regular expressions tested against navigator.userAgent
# 
# ** It should only be used on browser that *do* support the API, but
# incorrectly **
# 
Dropzone.blacklistedBrowsers = [
  # The mac os version of opera 12 seems to have a problem with the File drag'n'drop API.
  /opera.*Macintosh.*version\/12/i
  # /MSIE\ 10/i
]


# Checks if the browser is supported
Dropzone.isBrowserSupported = ->
  capableBrowser = yes

  if window.File and window.FileReader and window.FileList and window.Blob and window.FormData and document.querySelector
    unless "classList" of document.createElement "a"
      capableBrowser = no
    else
      # The browser supports the API, but may be blacklisted.
      for regex in Dropzone.blacklistedBrowsers
        if regex.test navigator.userAgent
          capableBrowser = no
          continue
  else
    capableBrowser = no

  capableBrowser




# Returns an array without the rejected item
without = (list, rejectedItem) -> item for item in list when item isnt rejectedItem

# abc-def_ghi -> abcDefGhi
camelize = (str) -> str.replace /[\-_](\w)/g, (match) -> match[1].toUpperCase()

# Creates an element from string
Dropzone.createElement = (string) ->
  div = document.createElement "div"
  div.innerHTML = string
  div.childNodes[0]

# Tests if given element is inside (or simply is) the container
Dropzone.elementInside = (element, container) ->
  return yes if element == container # Coffeescript doesn't support do/while loops
  return yes while element = element.parentNode when element == container
  return no



Dropzone.getElement = (el, name) ->
  if typeof el == "string"
    element = document.querySelector el
  else if el.nodeType?
    element = el
  throw new Error "Invalid `#{name}` option provided. Please provide a CSS selector or a plain HTML element." unless element?
  return element


Dropzone.getElements = (els, name) ->
  if els instanceof Array
    elements = [ ]
    try
      elements.push @getElement el, name for el in els
    catch e
      elements = null
  else if typeof els == "string"
    elements = [ ]
    elements.push el for el in document.querySelectorAll els
  else if els.nodeType?
    elements = [ els ]

  throw new Error "Invalid `#{name}` option provided. Please provide a CSS selector, a plain HTML element or a list of those." unless elements? and elements.length

  return elements



# Validates the mime type like this:
# 
# https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidMimeType = (mimeType, acceptedMimeTypes) ->
  return yes unless acceptedMimeTypes # If there are no accepted mime types, it's OK
  acceptedMimeTypes = acceptedMimeTypes.split ","

  baseMimeType = mimeType.replace /\/.*$/, ""

  for validMimeType in acceptedMimeTypes
    validMimeType = validMimeType.trim()
    if /\/\*$/.test validMimeType
      # This is something like a image/* mime type
      return yes if baseMimeType == validMimeType.replace /\/.*$/, ""
    else
      return yes if mimeType == validMimeType

  return no


# Augment jQuery
if jQuery?
  jQuery.fn.dropzone = (options) ->
    this.each -> new Dropzone this, options




if module?
  module.exports = Dropzone
else
  window.Dropzone = Dropzone





Dropzone.ADDED = "added";
Dropzone.ACCEPTED = "accepted";
Dropzone.UPLOADING = "uploading";
Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";







###
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
###

# @win window reference
# @fn function reference
contentLoaded = (win, fn) ->
  done = false
  top = true
  doc = win.document
  root = doc.documentElement
  add = (if doc.addEventListener then "addEventListener" else "attachEvent")
  rem = (if doc.addEventListener then "removeEventListener" else "detachEvent")
  pre = (if doc.addEventListener then "" else "on")
  init = (e) ->
    return  if e.type is "readystatechange" and doc.readyState isnt "complete"
    ((if e.type is "load" then win else doc))[rem] pre + e.type, init, false
    fn.call win, e.type or e  if not done and (done = true)

  poll = ->
    try
      root.doScroll "left"
    catch e
      setTimeout poll, 50
      return
    init "poll"

  unless doc.readyState is "complete"
    if doc.createEventObject and root.doScroll
      try
        top = not win.frameElement
      poll()  if top
    doc[add] pre + "DOMContentLoaded", init, false
    doc[add] pre + "readystatechange", init, false
    win[add] pre + "load", init, false


contentLoaded window, Dropzone.discover
