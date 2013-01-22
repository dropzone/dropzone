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
o = jQuery ? require "jquery" # Allows for a standalone package.
Em = Emitter ? require "emitter" # Can't be the same name because it will lead to a local variable


class Dropzone extends Em

  version: "1.2.6-dev"

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
    "addedfile"
    "thumbnail"
    "error"
    "processingfile"
    "uploadprogress"
    "finished"
  ]


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
  blacklistedBrowsers: [
    /opera.*version\/12/i
    /MSIE\ 10/i
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
    
    # If `done()` is called without argument the file is accepted
    # If you call it with an error message, the file is rejected
    # (This allows for asynchronous validation)
    accept: (file, done) -> done()


    # Called when the browser does not support drag and drop
    fallback: ->
      @element.addClass "browser-not-supported"
      @element.find(".message span").html "Your browser does not support drag'n'drop file uploads."
      @element.append """<p>Sadly your dusty browser does not support nice drag'n'drop file uploads.<br />Please use the fallback form below to upload your files like in the olden days.</p>"""
      @element.append @getFallbackForm()
    

    ###
    Those functions register themselves to the events on init.
    You can overwrite them if you don't like the default behavior. If you just want to add an additional
    event handler, register it on the dropzone object and don't overwrite those options.
    ###




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
      file.previewTemplate = o @options.previewTemplate
      @element.append file.previewTemplate
      file.previewTemplate.find(".filename span").text file.name
      file.previewTemplate.find(".details").append o """<div class="size">#{@filesize file.size}</div>"""


    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: (file, dataUrl) ->
      file.previewTemplate
        .removeClass("file-preview")
        .addClass("image-preview")
      file.previewTemplate.find(".details").append o """<img alt="#{file.name}" src="#{dataUrl}"/>"""

    
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
    @element = o element

    throw new Error "You can only instantiate dropzone on a single element." if @element.length != 1

    throw new Error "Dropzone already attached." if @element.data("dropzone")
    @element.data "dropzone", @

    
    # Get the `Dropzone.opions.elementId` for this element if it exists
    elementId = @element.attr "id"
    elementOptions = (Dropzone.options[camelize elementId] if elementId) ? { }

    @elementTagName = @element.get(0).tagName

    extend = (target, objects...) ->
      for object in objects
        target[key] = val for key, val of object
      target

    @options = extend { }, defaultOptions, elementOptions, options ? { }
    
    @options.url = @element.attr "action" unless @options.url?

    throw new Error "No URL provided." unless @options.url

    @init()





  init: ->
    if @elementTagName == "form" and @element.attr("enctype") != "multipart/form-data"
      @element.attr "enctype", "multipart/form-data"

    if @element.find(".message").length == 0
      @element.append o """<div class="message"><span>Drop files here to upload</span></div>"""

    capableBrowser = yes

    if window.File and window.FileReader and window.FileList and window.Blob and window.FormData
      # The browser supports the API, but may be blacklisted.
      for regex in @blacklistedBrowsers
        if regex.test navigator.userAgent
          capableBrowser = no
          continue
    else
      capableBrowser = no


    # If the browser failed, just call the fallback and leave
    return @options.fallback.call this unless capableBrowser


    @files = [] # All files
    @files.queue = [] # The files that still have to be processed
    @files.processing = [] # The files currently processed
    @URL = window.URL ? window.webkitURL
    @setupEventListeners()

  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  #
  # If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
  getFallbackForm: ->
    fields = o """<div class="fallback-elements"><input type="file" name="newFiles" multiple="multiple" /><button type="submit">Upload!</button></div>"""
    if @elementTagName isnt "FORM"
      fields = o("""<form action="#{@options.url}" enctype="multipart/form-data" method="post"></form>""").append fields
    fields

  setupEventListeners: ->

    # First setup all event listeners on the dropzone object itself.
    @on eventName, @options[eventName] for eventName in @events

    noPropagation = (e) ->
      e.stopPropagation()
      e.preventDefault()

    @element.on "dragstart", (e) =>
      @emit "dragstart", e

    @element.on "dragenter", (e) =>
      noPropagation e
      @emit "dragenter", e

    @element.on "dragover", (e) =>
      noPropagation e
      @emit "dragover", e

    @element.on "dragleave", (e) =>
      @emit "dragleave", e

    @element.on "drop", (e) =>
      noPropagation e
      @drop e
      @emit "drop", e
    
    @element.on "dragend", (e) =>
      @emit "dragend", e


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
    return unless e.originalEvent.dataTransfer
    files = e.originalEvent.dataTransfer.files
    @handleFiles files if files.length

  handleFiles: (files) ->
    @addFile file for file in files

  # If `done()` is called without argument the file is accepted
  # If you call it with an error message, the file is rejected
  # (This allows for asynchronous validation)
  accept: (file, done) ->
    if file.size > @options.maxFilesize * 1024 * 1024
      done "File is too big (" + (Math.round(file.size / 1024 / 10.24) / 100) + "MB). Max filesize: " + @options.maxFilesize + "MB"
    else
      # Add file size check here.
      @options.accept.call this, file, done

  addFile: (file) ->
    @files.push file

    @emit "addedfile", file

    @createThumbnail file  if @options.createImageThumbnails and file.type.match(/image.*/) and file.size <= @options.maxThumbnailFilesize * 1024 * 1024

    @accept file, (error) =>
      if error
        @errorProcessing file, error
      else
        @files.queue.push file
        @processQueue()

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

      @emit "thumbnail", file, thumbnail

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

    @emit "processingfile", file

    @uploadFile file


  uploadFile: (file) ->
    xhr = new XMLHttpRequest()

    formData = new FormData()
    formData.append @options.paramName, file

    if @elementTagName = "FORM"
      # Take care of other input elements
      for inputElement in @element.find "input, textarea, select, button"
        input = o inputElement
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
        @emit "uploadprogress", file, 100
        response = xhr.responseText
        if ~xhr.getResponseHeader("content-type").indexOf "application/json" then response = JSON.parse response
        @finished file, response, e

    xhr.onerror = =>
      handleError()

    # Some browsers do not have the .upload property
    progressObj = xhr.upload ? xhr
    progressObj.onprogress = (e) =>
      @emit "uploadprogress", file, Math.max(0, Math.min(100, (e.loaded / e.total) * 100))

    xhr.setRequestHeader "Accept", "application/json"
    xhr.setRequestHeader "Cache-Control", "no-cache"
    xhr.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    xhr.setRequestHeader "X-File-Name", file.name
    xhr.send formData


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  finished: (file, responseText, e) ->
    @files.processing = without(@files.processing, file)
    @emit "finished", file, responseText, e
    @processQueue()


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  errorProcessing: (file, message) ->
    @files.processing = without(@files.processing, file)
    @emit "error", file, message
    @processQueue()



# This is a map of options for your different dropzones. Add configurations
# to this object for your different dropzone elemens.
#
# Example:
# 
#     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
# 
# And in html:
# 
#     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = { }


without = (list, rejectedItem) -> item for item in list when item isnt rejectedItem

# abc-def_ghi -> abcDefGhi
camelize = (str) -> str.replace /[\-_](\w)/g, (match) -> match[1].toUpperCase()



# Augment jQuery
o.fn.dropzone = (options) ->
  this.each -> new Dropzone this, options


o -> o(".dropzone").dropzone()





if module?
  module.exports = Dropzone
else
  window.Dropzone = Dropzone

