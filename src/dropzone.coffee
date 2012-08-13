
$ = ender


$.ender
  dropzone: (options) ->
    for element in @
      new Dropzone element, options
, true # Should be added to the internal chain


$.domReady -> $(".dropzone").dropzone()


bean = require "bean"


noOp = ->


class Dropzone

  version: "1.0.0"

  ###
  This is a list of all available events you can register on a dropzone object.

  You can register an event handler like this:

      var bean = require("bean");
      bean.add(dropzone, "dragEnter", function() { });

  ###
  events: [
    "fallback"
    "drop"
    "dragstart"
    "dragend"
    "dragenter"
    "dragover"
    "dragleave"
    "addedfile"
    "thumbnail"
    "error"
    "processingfile"
    "uploadprogress"
    "finished"
  ]



  defaultOptions =
    url: null
    parallelUploads: 2
    maxFilesize: 256 # in MB
    paramName: "file" # The name of the file param that gets transferred.
    createImageThumbnails: true
    maxThumbnailFilesize: 2 # in MB. When the filename exeeds this limit, the thumbnail will not be generated.
    thumbnailWidth: 100
    thumbnailHeight: 100
    
    # If false the file does not get processed.
    accept: (file) -> true


    ###
    Those functions register themselves to the events on init.
    You can overwrite them if you don't like the default behavior. If you just want to add an additional
    event handler, register it on the dropzone object and don't overwrite those options.
    ###




    # Called when the browser does not support drag and drop
    fallback: ->
      @element.addClass "browser-not-supported"
      @element.find(".message span").html "Your browser does not support drag'n'drop file uploads."
      @element.append """<p>Sadly your dusty browser does not support nice drag'n'drop file uploads.<br />Please use the fallback form below to upload your files like in the olden days.</p>"""
      @element.append @getFallbackForm()
    
    # Those are self explanatory and simply concern the DragnDrop.
    drop: (e) ->
      @element.removeClass "drag-hover"
      @element.addClass "started"
    dragstart: (e) ->
    dragend: (e) -> @element.removeClass "drag-hover"
    dragenter: (e) -> @element.addClass "drag-hover"
    dragover: (e) -> @element.addClass "drag-hover"
    dragleave: (e) -> @element.removeClass "drag-hover"
    
    # Called when a file is added to the queue
    # Receives `file`
    addedfile: (file) ->
      file.previewTemplate = $ @options.previewTemplate
      @element.append file.previewTemplate
      file.previewTemplate.find(".filename span").text file.name
      file.previewTemplate.find(".details").append $("""<div class="size">#{@filesize file.size}</div>""")


    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: (file, dataUrl) ->
      file.previewTemplate
        .removeClass("file-preview")
        .addClass("image-preview")
      file.previewTemplate.find(".details").append $("""<img alt="#{file.name}" src="#{dataUrl}"/>""")

    
    # Called whenever an error occures
    # Receives `file` and `message`
    error: (file, message) ->
      file.previewTemplate.addClass "error"
      file.previewTemplate.find(".error-message span").text message
    
    
    # Called when a file gets processed
    # Receives `file`
    processingfile: (file) ->
      file.previewTemplate.addClass "processing"
    
    # Called whenever the upload progress gets upadted.
    # You can be sure that this will be called with the percentage 100% when the file is finished uploading.
    # Receives `file` and `progress` (percentage)
    uploadprogress: (file, progress) ->
      file.previewTemplate.find(".progress .upload").css { width: "#{progress}%" }
    
    # When the complete upload is finished
    # Receives `file`
    finished: (file) ->
      file.previewTemplate.addClass "success"


    # This template will be chosen when a new file is dropped.
    previewTemplate: """
                     <div class="preview file-preview">
                       <div class="details"></div>
                       <div class="progress"><span class="load"></span><span class="upload"></span></div>
                       <div class="success-mark"><span>✔</span></div>
                       <div class="error-mark"><span>✘</span></div>
                       <div class="error-message"><span></span></div>
                       <div class="filename"><span></span></div>
                     </div>
                     """

  defaultOptions.previewTemplate = defaultOptions.previewTemplate.replace /\n*/g, ""

  constructor: (element, options) ->
    @element = $ element

    throw new Error "You can only instantiate dropzone on a single element." if @element.length != 1

    throw new Error "Dropzone already attached." if @element.data("dropzone")
    @element.data "dropzone", @

    @elementTagName = @element.get(0).tagName

    extend = (target, objects...) ->
      for object in objects
        target[key] = val for key, val of object
      target

    @options = extend { }, defaultOptions, options ? { }
    
    @options.url = @element.attr "action" unless @options.url?

    @init()





  init: ->
    if @elementTagName == "form" and @element.attr("enctype") != "multipart/form-data"
      @element.attr "enctype", "multipart/form-data"

    if @element.find(".message").length == 0
      @element.append $ """<div class="message"><span>Drop files here to upload</span></div>"""

    unless window.File and window.FileReader and window.FileList and window.Blob and window.FormData
      @options.fallback.call this
      return

    @files = [] # All files
    @files.queue = [] # The files that still have to be processed
    @files.processing = [] # The files currently processed
    @URL = window.URL ? window.webkitURL
    @setupEventListeners()

  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  #
  # If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
  getFallbackForm: ->
    fields = $ """<div class="fallback-elements"><input type="file" name="newFiles" multiple="multiple" /><button type="submit">Upload!</button></div>"""
    if @elementTagName isnt "FORM"
      fields = $("""<form action="#{@options.url}" enctype="multipart/form-data" method="post"></form>""").append fields
    fields

  setupEventListeners: ->

    # First setup all event listeners on the dropzone object itself.
    bean.add @, eventName, @options[eventName] for eventName in @events

    noPropagation = (e) ->
      e.stopPropagation()
      e.preventDefault()

    @element.on "dragstart", (e) =>
      bean.fire @, "dragstart", e

    @element.on "dragenter", (e) =>
      noPropagation e
      bean.fire @, "dragenter", e

    @element.on "dragover", (e) =>
      noPropagation e
      bean.fire @, "dragover", e

    @element.on "dragleave", (e) =>
      bean.fire @, "dragleave", e

    @element.on "drop", (e) =>
      noPropagation e
      @drop e
      bean.fire @, "drop", e
    
    @element.on "dragend", (e) =>
      bean.fire @, "dragend", e


  # Returns a nicely formatted filesize
  filesize: (size) ->
    if size >= 100000000000
      size = size / 100000000000
      string = "tb"
    else if size >= 100000000
      size = size / 100000000
      string = "gb"
    else if size >= 100000
      size = size / 100000
      string = "mb"
    else if size >= 100
      size = size / 100 
      string = "kb"
    else
      size = size * 10
      string = "by"
    "#{Math.round(size)/10} #{string}"

  drop: (e) ->
    return unless e.dataTransfer
    files = e.dataTransfer.files
    @handleFiles files  if files.length

  handleFiles: (files) ->
    @addFile file for file in files when @accept file
    @processQueue()

  accept: (file) ->
    
    # Add file size check here.
    @options.accept.call this, file

  addFile: (file) ->
    @files.push file
    @files.queue.push file

    bean.fire @, "addedfile", file

    @createThumbnail file  if @options.createImageThumbnails and file.type.match(/image.*/) and file.size <= @options.maxThumbnailFilesize * 1024 * 1024

  createThumbnail: (file) ->

    img = new Image()
    blobUrl = @URL.createObjectURL file
    img.onerror = img.onabort = ->
      @URL.revokeObjectURL blobUrl
      img = null

    img.onload = =>
      canvas = document.createElement("canvas")
      ctx = canvas.getContext("2d")
      srcX = 0
      srcY = 0
      srcWidth = img.width
      srcHeight = img.height
      canvas.width = @options.thumbnailWidth
      canvas.height = @options.thumbnailHeight
      trgX = 0
      trgY = 0
      trgWidth = canvas.width
      trgHeight = canvas.height
      srcRatio = img.width / img.height
      trgRatio = canvas.width / canvas.height
      
      if img.height < canvas.height or img.width < canvas.width
        # This image is smaller than the canvas
        trgHeight = srcHeight
        trgWidth = srcWidth
      else
        # Image is bigger and needs rescaling
        if srcRatio > trgRatio
          srcHeight = img.height
          srcWidth = srcHeight * trgRatio
        else
          srcWidth = img.width
          srcHeight = srcWidth / trgRatio


      srcX = (img.width - srcWidth) / 2
      srcY = (img.height - srcHeight) / 2
      trgY = (canvas.height - trgHeight) / 2
      trgX = (canvas.width - trgWidth) / 2
      ctx.drawImage img, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight
      thumbnail = canvas.toDataURL("image/png")

      bean.fire @, "thumbnail", [ file, thumbnail ]

      @URL.revokeObjectURL blobUrl
      img = null

    img.src = blobUrl


  # Goes through the qeue and processes files if there aren't too many already.
  processQueue: ->
    parallelUploads = @options.parallelUploads
    processingLength = @files.processing.length
    i = processingLength

    while i < parallelUploads
      return  unless @files.queue.length # Nothing left to process
      @processFile @files.queue.shift()
      i++


  # Loads the file, then calls finishedLoading()
  processFile: (file) ->
    fileReader = new FileReader()

    @files.processing.push file

    bean.fire @, "processingfile", file

    if file.size > @options.maxFilesize * 1024 * 1024
      @errorProcessing file, "File is too big (" + (Math.round(file.size / 1024 / 10.24) / 100) + "MB). Max filesize: " + @options.maxFilesize + "MB"
    else
      @uploadFile file


  uploadFile: (file) ->
    xhr = new XMLHttpRequest()

    formData = new FormData()
    formData.append @options.paramName, file

    if @elementTagName = "FORM"
      # Take care of other input elements
      for inputElement in @element.find "input, textarea, select, button"
        input = $ inputElement
        inputName = input.attr("name")

        if !input.attr("type") or input.attr("type").toLowerCase() != "checkbox" or inputElement.checked
          formData.append input.attr("name"), input.val()

    xhr.open "POST", @options.url, true

    handleError = =>
      @errorProcessing file, xhr.responseText || "Server responded with #{xhr.status} code."

    xhr.onload = (e) =>
      if xhr.status isnt 200
        handleError()
      else
        bean.fire @, "uploadprogress", [ file, 100 ]
        response = xhr.responseText
        if ~xhr.getResponseHeader("content-type").indexOf "application/json" then response = JSON.parse response
        @finished file, response, e

    xhr.onerror = =>
      handleError()

    # Some browsers do not have the .upload property
    progressObj = xhr.upload ? xhr
    progressObj.onprogress = (e) =>
      bean.fire @, "uploadprogress", [ file, Math.max(0, Math.min(100, (e.loaded / e.total) * 100)) ]

    xhr.setRequestHeader "Accept", "application/json"
    xhr.setRequestHeader "Cache-Control", "no-cache"
    xhr.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    xhr.setRequestHeader "X-File-Name", file.name
    xhr.send formData


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  finished: (file, responseText, e) ->
    @files.processing = without(@files.processing, file)
    bean.fire @, "finished", [ file, responseText, e ]
    @processQueue()


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  errorProcessing: (file, message) ->
    @files.processing = without(@files.processing, file)
    bean.fire @, "error", [ file, message ]
    @processQueue()





without = (list, rejectedItem) -> item for item in list when item isnt rejectedItem







