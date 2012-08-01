
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

  version: "0.2.3-dev"

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
    thumbnailWidth: 120
    thumbnailHeight: 120
    
    # If false the file does not get processed.
    accept: (file) -> true


    ###
    Those functions register themselves to the events on init.
    You can overwrite them if you don't like the default behavior. If you just want to add an additional
    event handler, register it on the dropzone object and don't overwrite those options.
    ###




    # Called when the browser does not support drag and drop
    fallback: -> @element.find(".message").html "Your browser does not support drag'n'drop file uploads."
    
    # Those are self explanatory and simply concern the DragnDrop.
    drop: (e) -> @element.find(".message").hide()
    dragstart: (e) ->
    dragend: (e) ->
    dragenter: (e) -> @element.addClass "drag-hover"
    dragover: (e) -> @element.addClass "drag-hover"
    dragleave: (e) -> @element.removeClass "drag-hover"
    
    # Called when a file is added to the queue
    # Receives `file`
    addedfile: (file) ->
      file.previewTemplate = $ @options.previewTemplate
      @element.append file.previewTemplate
      file.previewTemplate.find(".details").html $("<span>#{file.name}</span>")


    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: (file, dataUrl) ->
      file.previewTemplate
        .removeClass("file-preview")
        .addClass("image-preview")

      file.previewTemplate.find(".details").html $("""<img alt="" src="#{dataUrl}"/>""")

    
    # Called whenever an error occures
    # Receives `file` and `message`
    error: (file, message) ->
      file.previewTemplate.addClass "process-error"
      file.previewTemplate.find(".error-message span").html message
    
    
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
      file.previewTemplate.addClass "finished"


    # This template will be chosen when a new file is dropped.
    previewTemplate: """
                     <div class="preview file-preview">
                       <div class="details"></div>
                       <div class="progress"><span class="load"></span><span class="upload"></span></div>
                       <div class="finished-success"><span>✔</span></div>
                       <div class="finished-error"><span>✘</span></div>
                       <div class="error-message"><span></span></div>
                     </div>
                     """

  defaultOptions.previewTemplate = defaultOptions.previewTemplate.replace /\n*/g, ""

  constructor: (element, options) ->
    @element = $ element

    throw new Error "Dropzone already attached." if @element.data("dropzone")
    @element.data "dropzone", @


    extend = (target, objects...) ->
      for object in objects
        target[key] = val for key, val of object
      target

    @options = extend { }, defaultOptions, options ? { }
    
    @options.url = @element.attr "action" unless @options.url?

    @init()





  init: ->
    unless window.File and window.FileReader and window.FileList and window.Blob and window.FormData
      @options.fallback.call this
      return

    @files = [] # All files
    @files.queue = [] # The files that still have to be processed
    @files.processing = [] # The files currently processed
    @URL = window.URL ? window.webkitURL
    @setupEventListeners()

    if @element.find(".message").length == 0
      @element.append $ """<div class="message">Drop files here to upload</div>"""

  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  getFallbackForm: ->
    $ """<form action="#{@options.url}" enctype="multipart/form-data" method="post"><input type="file" name="newFiles" multiple="multiple" /><button type="submit">Upload!</button></form>"""

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
      bean.fire @, "dragleave", e
      bean.fire @, "dragend", e


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
      trgX = 0
      trgY = 0
      trgWidth = 0
      trgHeight = 0
      srcRatio = undefined
      trgRatio = undefined
      canvas.width = @options.thumbnailWidth
      canvas.height = @options.thumbnailHeight
      srcRatio = img.width / img.height
      trgRatio = canvas.width / canvas.height
      
      # if (img.width < canvas.width && img.height < canvas.height) {
      #   // Source image is smaller
      #   trgWidth = img.width;
      #   trgHeight = img.height;
      # }
      if srcRatio > trgRatio
        trgWidth = canvas.width
        trgHeight = trgWidth / srcRatio
      else
        trgHeight = canvas.height
        trgWidth = trgHeight * srcRatio
      trgX = (canvas.width - trgWidth) / 2
      trgY = (canvas.height - trgHeight) / 2
      ctx.drawImage img, trgX, trgY, trgWidth, trgHeight
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
    formData.append "test", "HI"

    xhr.open "POST", @options.url, true

    xhr.onload = (e) =>
      if xhr.status isnt 200
        @errorProcessing file, "Server responded with #{xhr.status} code."
      else
        bean.fire @, "uploadprogress", [ file, 100 ]
        response = xhr.responseText
        if xhr.getResponseHeader("content-type") == "application/json" then response = JSON.parse response
        @finished file, response, e

    xhr.onerror = =>
      @errorProcessing file, xhr.responseText

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







