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
    "sending"
    "success"
    "complete"
    "reset"
  ]



  defaultOptions:
    url: null
    parallelUploads: 2
    maxFilesize: 256 # in MB
    paramName: "file" # The name of the file param that gets transferred.
    createImageThumbnails: true
    maxThumbnailFilesize: 2 # in MB. When the filename exceeds this limit, the thumbnail will not be generated.
    thumbnailWidth: 100
    thumbnailHeight: 100

    # Can be an object of additional parameters to transfer to the server.
    # This is the same as adding hidden input fields in the form element.
    params: { }

    # If true, the dropzone will present a file selector when clicked.
    clickable: yes

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


    # If `done()` is called without argument the file is accepted
    # If you call it with an error message, the file is rejected
    # (This allows for asynchronous validation)
    accept: (file, done) -> done()


    # Called when dropzone initialized
    # You can add event listeners here
    init: -> noop

    # Called when the browser does not support drag and drop
    fallback: ->
      # This code should pass in IE7... :(
      @element.className = "#{@element.className} browser-not-supported"

      for child in @element.getElementsByTagName "div"
        if /(^| )message($| )/.test child.className
          messageElement = child
          child.className = "message" # Removes the 'default' class
          continue
      unless messageElement
        messageElement = createElement """<div class="message"><span></span></div>"""
        @element.appendChild messageElement
          
      span = messageElement.getElementsByTagName("span")[0]
      span.textContent = @options.dictFallbackMessage if span

      @element.appendChild @getFallbackForm()
    

    ###
    Those functions register themselves to the events on init and handle all
    the user interface specific stuff. Overwriting them won't break the upload
    but can break the way it's displayed.
    You can overwrite them if you don't like the default behavior. If you just
    want to add an additional event handler, register it on the dropzone object
    and don't overwrite those options.
    ###




    # Those are self explanatory and simply concern the DragnDrop.
    drop: (e) -> @element.classList.remove "drag-hover"
    dragstart: noop
    dragend: (e) -> @element.classList.remove "drag-hover"
    dragenter: (e) -> @element.classList.add "drag-hover"
    dragover: (e) -> @element.classList.add "drag-hover"
    dragleave: (e) -> @element.classList.remove "drag-hover"
    
    # Called whenever files are dropped or selected
    selectedfiles: (files) ->
      @element.classList.add "started" if @element == @previewsContainer

    # Called whenever there are no files left in the dropzone anymore, and the
    # dropzone should be displayed as if in the initial state.
    reset: ->
      @element.classList.remove "started"

    # Called when a file is added to the queue
    # Receives `file`
    addedfile: (file) ->
      file.previewTemplate = createElement @options.previewTemplate
      @previewsContainer.appendChild file.previewTemplate
      file.previewTemplate.querySelector(".filename span").textContent = file.name
      file.previewTemplate.querySelector(".details").appendChild createElement """<div class="size">#{@filesize file.size}</div>"""


    # Called whenever a file is removed.
    removedfile: (file) ->
      file.previewTemplate.parentNode.removeChild file.previewTemplate

    # Called when a thumbnail has been generated
    # Receives `file` and `dataUrl`
    thumbnail: (file, dataUrl) ->
      file.previewTemplate.classList.remove "file-preview"
      file.previewTemplate.classList.add "image-preview"
      file.previewTemplate.querySelector(".details").appendChild createElement """<img alt="#{file.name}" src="#{dataUrl}"/>"""

    
    # Called whenever an error occurs
    # Receives `file` and `message`
    error: (file, message) ->
      file.previewTemplate.classList.add "error"
      file.previewTemplate.querySelector(".error-message span").textContent = message
    
    
    # Called when a file gets processed. Since there is a cue, not all added
    # files are processed immediately.
    # Receives `file`
    processingfile: (file) ->
      file.previewTemplate.classList.add "processing"
    
    # Called whenever the upload progress gets updated.
    # You can be sure that this will be called with the percentage 100% when the file is finished uploading.
    # Receives `file` and `progress` (percentage)
    uploadprogress: (file, progress) ->
      file.previewTemplate.querySelector(".progress .upload").style.width = "#{progress}%"

    # Called just before the file is sent. Gets the `xhr` object as second
    # parameter, so you can modify it (for example to add a CSRF token) and a
    # `formData` object to add additional information.
    sending: noop
    
    # When the complete upload is finished and successfull
    # Receives `file`
    success: (file) ->
      file.previewTemplate.classList.add "success"

    # When the upload is finished, either with success or an error.
    # Receives `file`
    complete: noop



    # This template will be chosen when a new file is dropped.
    previewTemplate: """
                      <div class="preview file-preview">
                        <div class="details">
                         <div class="filename"><span></span></div>
                        </div>
                        <div class="progress"><span class="upload"></span></div>
                        <div class="success-mark"><span>✔</span></div>
                        <div class="error-mark"><span>✘</span></div>
                        <div class="error-message"><span></span></div>
                      </div>
                      """

  constructor: (@element, options) ->
    # For backwards compatibility since the version was in the prototype previously
    @version = Dropzone.version

    @defaultOptions.previewTemplate = @defaultOptions.previewTemplate.replace /\n*/g, ""


    @element = document.querySelector @element if typeof @element == "string"

    # Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    throw new Error "Invalid dropzone element." unless @element and @element.nodeType?

    throw new Error "Dropzone already attached." if Dropzone.forElement @element

    # Now add this dropzone to the instances.
    Dropzone.instances.push @

    # Get the `Dropzone.options.elementId` for this element if it exists
    elementId = @element.id
    elementOptions = (Dropzone.options[camelize elementId] if elementId) ? { }

    extend = (target, objects...) ->
      for object in objects
        target[key] = val for key, val of object
      target

    @options = extend { }, @defaultOptions, elementOptions, options ? { }


    @options.url = @element.action unless @options.url?

    throw new Error "No URL provided." unless @options.url

    # If the browser failed, just call the fallback and leave
    return @options.fallback.call this unless Dropzone.isBrowserSupported()

    if (fallback = @getExistingFallback()) and fallback.parentNode
      # Remove the fallback
      fallback.parentNode.removeChild fallback

    if @options.previewsContainer
      if typeof @options.previewsContainer == "string"
        @previewsContainer = document.querySelector @options.previewsContainer
      else if @options.previewsContainer.nodeType?
        @previewsContainer = @options.previewsContainer
      throw new Error "Invalid `previewsContainer` option provided. Please provide a CSS selector or a plain HTML element." unless @previewsContainer?
    else
      @previewsContainer = @element


    @init()



  init: ->
    # In case it isn't set already
    @element.setAttribute("enctype", "multipart/form-data") if @element.tagName == "form"

    if @element.classList.contains("dropzone") and !@element.querySelector(".message")
      @element.appendChild createElement """<div class="default message"><span>#{@options.dictDefaultMessage}</span></div>"""

    if @options.clickable
      @hiddenFileInput = document.createElement "input"
      @hiddenFileInput.setAttribute "type", "file"
      @hiddenFileInput.setAttribute "multiple", "multiple"
      @hiddenFileInput.style.display = "none"
      document.body.appendChild @hiddenFileInput
      @hiddenFileInput.addEventListener "change", =>
        files = @hiddenFileInput.files
        if files.length
          @emit "selectedfiles", files
          @handleFiles files

    @files = [] # All files
    @filesQueue = [] # The files that still have to be processed
    @filesProcessing = [] # The files currently processed
    @URL = window.URL ? window.webkitURL


    # Setup all event listeners on the Dropzone object itself.
    # They're not in @setupEventListeners() because they shouldn't be removed
    # again when the dropzone gets disabled.
    @on eventName, @options[eventName] for eventName in @events


    noPropagation = (e) ->
      e.stopPropagation()
      if e.preventDefault
        e.preventDefault()
      else
        e.returnValue = false

    # Create the listeners
    @listeners =
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
      "click": (evt) =>
        return unless @options.clickable
        # Only the actual dropzone or the message element should trigger file selection
        if evt.target == @element or evt.target == @element.querySelector ".message"
          @hiddenFileInput.click() # Forward the click


    @enable()

    @options.init.call @

  # Returns a form that can be used as fallback if the browser does not support DragnDrop
  #
  # If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
  # This code has to pass in IE7 :(
  getFallbackForm: ->
    return existingFallback if existingFallback = @getExistingFallback()

    fieldsString = """<div class="fallback">"""
    fieldsString += """<p>#{@options.dictFallbackText}</p>""" if @options.dictFallbackText
    fieldsString += """<input type="file" name="#{@options.paramName}" multiple="multiple" /><button type="submit">Upload!</button></div>"""

    fields = createElement fieldsString
    if @element.tagName isnt "FORM"
      form = createElement("""<form action="#{@options.url}" enctype="multipart/form-data" method="post"></form>""")
      form.appendChild fields
    else
      # Make sure that the enctype and method attributes are set properly
      @element.setAttribute "enctype", "multipart/form-data"
      @element.setAttribute "method", "post"
    form ? fields


  # Returns the fallback elements if they exist already
  # 
  # This code has to pass in IE7 :(
  getExistingFallback: ->
    getFallback = (elements) -> return el for el in elements when /(^| )fallback($| )/.test el.className

    for tagName in [ "div", "form" ]
      return fallback if fallback = getFallback @element.getElementsByTagName "div"


  # Activates all listeners stored in @listeners
  setupEventListeners: ->
    @element.addEventListener event, listener, false for event, listener of @listeners
      

  # Deactivates all listeners stored in @listeners
  removeEventListeners: ->
    @element.removeEventListener event, listener, false for event, listener of @listeners

  # Removes all event listeners and clears the arrays.
  disable: ->
    @element.classList.remove "clickable" if @options.clickable
    @removeEventListeners()
    @filesProcessing = [ ]
    @filesQueue = [ ]

  enable: ->
    @element.classList.add "clickable" if @options.clickable
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
        if @options.enqueueForUpload
          @filesQueue.push file
          @processQueue()

  # Can be called by the user to remove a file
  removeFile: (file) ->
    throw new Error "Can't remove file currently processing" if file.processing
    @files = without @files, file
    @filesQueue = without @filesQueue, file

    @emit "removedfile", file
    @emit "reset" if @files.length == 0

  createThumbnail: (file) ->

    fileReader = new FileReader

    fileReader.onload = =>
      img = new Image

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
    file.processing = yes

    @emit "processingfile", file

    @uploadFile file


  uploadFile: (file) ->
    xhr = new XMLHttpRequest()

    xhr.open "POST", @options.url, true

    handleError = =>
      @errorProcessing file, xhr.responseText || "Server responded with #{xhr.status} code."

    xhr.onload = (e) =>
      unless 200 <= xhr.status < 300
        handleError()
      else
        @emit "uploadprogress", file, 100
        response = xhr.responseText
        if xhr.getResponseHeader("content-type") and ~xhr.getResponseHeader("content-type").indexOf "application/json" then response = JSON.parse response
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


    formData = new FormData()

    # Adding all @options parameters
    formData.append key, value for key, value of @options.params if @options.params

    # Take care of other input elements
    if @element.tagName = "FORM"
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
    file.processing = no
    @processQueue()
    @emit "success", file, responseText, e
    @emit "finished", file, responseText, e # For backwards compatibility
    @emit "complete", file


  # Called internally when processing is finished.
  # Individual callbacks have to be called in the appropriate sections.
  errorProcessing: (file, message) ->
    @filesProcessing = without(@filesProcessing, file)
    file.processing = no
    @processQueue()
    @emit "error", file, message
    @emit "complete", file



Dropzone.version = "2.0.4"


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


# Holds a list of all dropzone instances
Dropzone.instances = [ ]

# Returns the dropzone for given element if any
Dropzone.forElement = (element) ->
  element = document.querySelector element if typeof element == "string"
  for instance in Dropzone.instances
    return instance if instance.element == element
  return null




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
createElement = (string) ->
  div = document.createElement "div"
  div.innerHTML = string
  div.childNodes[0]


# Augment jQuery
if jQuery?
  jQuery.fn.dropzone = (options) ->
    this.each -> new Dropzone this, options




if module?
  module.exports = Dropzone
else
  window.Dropzone = Dropzone











#!
# * contentloaded.js
# *
# * Author: Diego Perini (diego.perini at gmail.com)
# * Summary: cross-browser wrapper for DOMContentLoaded
# * Updated: 20101020
# * License: MIT
# * Version: 1.2
# *
# * URL:
# * http://javascript.nwbox.com/ContentLoaded/
# * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
# *
# 

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


contentLoaded window, ->
  if false #document.querySelectorAll
    dropzones = document.querySelectorAll ".dropzone"
  else
    dropzones = [ ]
    # IE :(
    checkElements = (elements) ->
      for el in elements
        dropzones.push el if /(^| )dropzone($| )/.test el.className
    checkElements document.getElementsByTagName "div"
    checkElements document.getElementsByTagName "form"

  new Dropzone dropzone for dropzone in dropzones

