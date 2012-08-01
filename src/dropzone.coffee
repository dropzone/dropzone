
$ = jQuery

$.fn.dropzone = (options) ->
  new Dropzone(this, options)




XMLHttpRequest::sendBin = (datastr) ->
  byteValue = (x) ->
    x.charCodeAt(0) & 0xff
  ords = Array::map.call(datastr, byteValue)
  ui8a = new Uint8Array(ords)
  @send ui8a.buffer



# Behaves like the underscore function _.without()
# @param {List} list
# @param {Object...} list of objects that should be removed
without = (list) ->
  newList = []
  withoutList = []
  i = 1
  while i < arguments.length
    withoutList.push arguments[i]
    i++
  $.each list, ->
    newList.push this  if $.inArray(this, withoutList) is -1

  newList




noOp = ->


class Dropzone

  version: "0.1.6-dev"

  defaultOptions =
    url: ""
    parallelUploads: 2
    maxFilesize: 4 # in MB
    paramName: "file" # The name of the file param that gets transferred.
    createImageThumbnails: true
    maxThumbnailFilesize: 2 # in MB. When the filename exeeds this limit, the thumbnail will not be generated.
    thumbnailWidth: 120
    thumbnailHeight: 120
    
    # Called when the browser does not support drag and drop
    fallback: noOp
    
    # Those are self explanatory and simply concern the DragnDrop.
    drop: noOp
    dragStart: noOp
    dragEnd: noOp
    dragEnter: noOp
    dragOver: noOp
    dragLeave: noOp
    
    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: noOp
    
    # Called whenever an error occures
    # Receives `file`
    error: noOp
    
    # Called when a file is added to the queue
    # Receives `file`
    addedFile: noOp
    
    # Called when a file gets processed
    # Receives `file` and `dataUrl`
    processingFile: noOp
    
    # Called whenever the upload progress gets upadted.
    # You can be sure that this will be called with the percentage 100% when the file is finished uploading.
    # Receives `file` and `progress` (percentage)
    uploadProgress: noOp
    
    # When the complete upload is finished
    finished: noOp

    # if false the file does not get processed.
    accept: (file) -> true


  constructor: (element, options) ->
    @element = $(element)
    @options = $.extend({}, defaultOptions, options or {})
    @init()





  init: ->
    unless window.File and window.FileReader and window.FileList and window.Blob
      @options.fallback.call this
      return
    @files = [] # All files
    @files.queue = [] # The files that still have to be processed
    @files.processing = [] # The files currently processed
    @URL = window.URL or window.webkitURL
    @setupEventListeners()


  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  getFallbackForm: ->
    $ "<form action=\"" + @options.url + "\" enctype=\"multipart/form-data\" method=\"post\"><input type=\"file\" name=\"newFiles\" multiple=\"multiple\" /><button type=\"submit\">Upload!</button></form>"

  setupEventListeners: ->
    noPropagation = (e) ->
      e.stopPropagation()
      e.preventDefault()

    self = this
    @element.on "dragstart", (e) ->
      self.options.dragStart.call self, e

    @element.on "dragenter", (e) ->
      noPropagation e
      self.options.dragEnter.call self, e

    @element.on "dragover", (e) ->
      noPropagation e
      self.options.dragOver.call self, e

    @element.on "dragleave", (e) ->
      self.options.dragLeave.call self, e

    
    # There seems to be a conflict with jQuery
    @element.get(0).addEventListener "drop", ((e) ->
      noPropagation e
      self.drop e
      self.options.drop.call self, e
    ), false
    @element.on "dragend", (e) ->
      self.options.dragLeave.call self, e
      self.options.dragEnd.call self, e


  drop: (e) ->
    return  unless e.dataTransfer
    files = e.dataTransfer.files
    @handleFiles files  if files.length

  handleFiles: (files) ->
    self = this
    $.each files, ->
      self.addFile this  if self.accept(this)

    @processQueue()

  accept: (file) ->
    
    # Add file size check here.
    @options.accept.call this, file

  addFile: (file) ->
    @files.push file
    @files.queue.push file
    @options.addedFile.call this, file
    @createThumbnail file  if @options.createImageThumbnails and file.type.match(/image.*/) and file.size <= @options.maxThumbnailFilesize * 1024 * 1024

  createThumbnail: (file) ->
    self = this
    img = new Image()
    blobUrl = @URL.createObjectURL(file)
    img.onerror = img.onabort = ->
      self.URL.revokeObjectURL blobUrl
      img = null

    img.onload = ->
      canvas = document.createElement("canvas")
      ctx = canvas.getContext("2d")
      trgX = 0
      trgY = 0
      trgWidth = 0
      trgHeight = 0
      srcRatio = undefined
      trgRatio = undefined
      canvas.width = self.options.thumbnailWidth
      canvas.height = self.options.thumbnailHeight
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
      self.options.thumbnail file, thumbnail
      self.URL.revokeObjectURL blobUrl
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
    self = this
    @files.processing.push file
    @options.processingFile.call this, file
    if file.size > @options.maxFilesize * 1024 * 1024
      @errorProcessing file, "File is too big (" + (Math.round(file.size / 1024 / 10.24) / 100) + "MB). Max filesize: " + @options.maxFilesize + "MB"
    else
      @uploadFile file


  uploadFile: (file) ->
    xhr = new XMLHttpRequest()
    self = this
    formData = new FormData()
    formData.append @options.paramName, file
    xhr.open "POST", @options.url, true
    $(xhr).on("load", (e) ->
      self.options.uploadProgress file, 100
      self.finished file, e
    ).on "error", ->
      self.errorProcessing file

    if xhr.upload
      $(xhr.upload).on "progress", (e) ->
        oe = e.originalEvent
        self.options.uploadProgress file, Math.max(0, Math.min(100, (oe.loaded / oe.total) * 100))

    else
      $(xhr).on "progress", (e) ->
        oe = e.originalEvent
        self.options.uploadProgress file, Math.max(0, Math.min(100, (oe.loaded / oe.total) * 100))

    xhr.setRequestHeader "Accept", "application/json"
    xhr.setRequestHeader "Cache-Control", "no-cache"
    xhr.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    xhr.setRequestHeader "X-File-Name", file.name
    xhr.send formData


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  finished: (file) ->
    @files.processing = without(@files.processing, file)
    @options.finished.call this, file
    @processQueue()


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  errorProcessing: (file, message) ->
    @files.processing = without(@files.processing, file)
    @options.error.call this, file, message
    @processQueue()
