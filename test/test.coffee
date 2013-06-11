chai.should()

describe "Dropzone", ->


  getMockFile = ->
    name: "test file name"
    size: 123456
    type: "text/html"


  describe "static functions", ->

    describe "Dropzone.createElement()", ->

      element = Dropzone.createElement """<div class="test"><span>Hallo</span></div>"""

      it "should properly create an element from a string", ->
        element.tagName.should.equal "DIV"
      it "should properly add the correct class", ->
        element.classList.contains("test").should.be.ok
      it "should properly create child elements", ->
        element.querySelector("span").tagName.should.equal "SPAN"
      it "should always return only one element", ->
        element = Dropzone.createElement """<div></div><span></span>"""
        element.tagName.should.equal "DIV"

    describe "Dropzone.elementInside()", ->
      element = Dropzone.createElement """<div id="test"><div class="child1"><div class="child2"></div></div></div>"""
      document.body.appendChild element

      child1 = element.querySelector ".child1"
      child2 = element.querySelector ".child2"

      after -> document.body.removeChild element

      it "should return yes if elements are the same", ->
        Dropzone.elementInside(element, element).should.be.ok
      it "should return yes if element is direct child", ->
        Dropzone.elementInside(child1, element).should.be.ok
      it "should return yes if element is some child", ->
        Dropzone.elementInside(child2, element).should.be.ok
        Dropzone.elementInside(child2, document.body).should.be.ok
      it "should return no unless element is some child", ->
        Dropzone.elementInside(element, child1).should.not.be.ok
        Dropzone.elementInside(document.body, child1).should.not.be.ok

    describe "Dropzone.optionsForElement()", ->
      testOptions =
        url: "/some/url"
        method: "put"

      before -> Dropzone.options.testElement = testOptions
      after -> delete Dropzone.options.testElement

      element = document.createElement "div"

      it "should take options set in Dropzone.options from camelized id", ->
        element.id = "test-element"
        Dropzone.optionsForElement(element).should.equal testOptions

      it "should return undefined if no options set", ->
        element.id = "test-element2"
        expect(Dropzone.optionsForElement(element)).to.equal undefined

    describe "Dropzone.forElement()", ->
      element = document.createElement "div"
      element.id = "some-test-element"
      dropzone = null
      before ->
        document.body.appendChild element
        dropzone = new Dropzone element, url: "/test"
      after ->
        dropzone.disable()
        document.body.removeChild element

      it "should return null if no dropzone attached", ->
        expect(Dropzone.forElement document.createElement "div").to.equal null

      it "should accept css selectors", ->
        expect(Dropzone.forElement "#some-test-element").to.equal dropzone

      it "should accept native elements", ->
        expect(Dropzone.forElement element).to.equal dropzone

    describe "Dropzone.discover()", ->
      element1 = document.createElement "div"
      element1.className = "dropzone"
      element2 = element1.cloneNode()
      element3 = element1.cloneNode()

      element1.id = "test-element-1"
      element2.id = "test-element-2"
      element3.id = "test-element-3"

      describe "specific options", ->
        before ->
          Dropzone.options.testElement1 = url: "test-url"
          Dropzone.options.testElement2 = false # Disabled
          document.body.appendChild element1
          document.body.appendChild element2
          Dropzone.discover()
        after ->
          document.body.removeChild element1
          document.body.removeChild element2

        it "should find elements with a .dropzone class", ->
          element1.dropzone.should.be.ok

        it "should not create dropzones with disabled options", ->
          expect(element2.dropzone).to.not.be.ok

      describe "Dropzone.autoDiscover", ->
        before ->
          Dropzone.options.testElement3 = url: "test-url"
          document.body.appendChild element3
        after ->
          document.body.removeChild element3

        it "should not create dropzones if Dropzone.autoDiscover == false", ->
          Dropzone.autoDiscover = off
          Dropzone.discover()
          expect(element3.dropzone).to.not.be.ok

    describe "Dropzone.isValidMimeType()", ->
      it "should return true if called without acceptedMimeTypes", ->
        Dropzone.isValidMimeType("some/type", null).should.be.ok

      it "should properly validate if called with concrete mime types", ->
        acceptedMimeTypes = "text/html,image/jpeg,application/json"

        Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.not.be.ok

      it "should properly validate if called with base mime types", ->
        acceptedMimeTypes = "text/*,image/*,application/*"

        Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("some/type", acceptedMimeTypes).should.not.be.ok

      it "should properly validate if called with mixed mime types", ->
        acceptedMimeTypes = "text/*,image/jpeg,application/*"

        Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.not.be.ok
        Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("some/type", acceptedMimeTypes).should.not.be.ok

      it "should properly validate even with spaces in between", ->
        acceptedMimeTypes = "text/html ,   image/jpeg, application/json"

        Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok
        Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok

  describe "Dropzone.getElement() / getElements()", ->
    tmpElements = [ ]

    beforeEach ->
      tmpElements = [ ]
      tmpElements.push Dropzone.createElement """<div class="tmptest"></div>"""
      tmpElements.push Dropzone.createElement """<div id="tmptest1" class="random"></div>"""
      tmpElements.push Dropzone.createElement """<div class="random div"></div>"""
      tmpElements.forEach (el) -> document.body.appendChild el

    afterEach ->
      tmpElements.forEach (el) -> document.body.removeChild el

    describe ".getElement()", ->
      it "should accept a string", ->
        el = Dropzone.getElement ".tmptest"
        el.should.equal tmpElements[0]
        el = Dropzone.getElement "#tmptest1"
        el.should.equal tmpElements[1]
      it "should accept a node", ->
        el = Dropzone.getElement tmpElements[2]
        el.should.equal tmpElements[2]
      it "should fail if invalid selector", ->
        errorMessage = "Invalid `clickable` option provided. Please provide a CSS selector or a plain HTML element."
        expect(-> Dropzone.getElement "lblasdlfsfl", "clickable").to.throw errorMessage
        expect(-> Dropzone.getElement { "lblasdlfsfl" }, "clickable").to.throw errorMessage
        expect(-> Dropzone.getElement [ "lblasdlfsfl" ], "clickable").to.throw errorMessage

    describe ".getElements()", ->
      it "should accept a list of strings", ->
        els = Dropzone.getElements [ ".tmptest", "#tmptest1" ]
        els.should.eql [ tmpElements[0], tmpElements[1] ]
      it "should accept a list of nodes", ->
        els = Dropzone.getElements [ tmpElements[0], tmpElements[2] ]
        els.should.eql [ tmpElements[0], tmpElements[2] ]
      it "should accept a mixed list", ->
        els = Dropzone.getElements [ "#tmptest1", tmpElements[2] ]
        els.should.eql [ tmpElements[1], tmpElements[2] ]
      it "should accept a string selector", ->
        els = Dropzone.getElements ".random"
        els.should.eql [ tmpElements[1], tmpElements[2] ]
      it "should accept a single node", ->
        els = Dropzone.getElements tmpElements[1]
        els.should.eql [ tmpElements[1] ]
      it "should fail if invalid selector", ->
        errorMessage = "Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those."
        expect(-> Dropzone.getElements "lblasdlfsfl", "clickable").to.throw errorMessage
        expect(-> Dropzone.getElements [ "lblasdlfsfl" ], "clickable").to.throw errorMessage

  describe "constructor()", ->

    dropzone = null

    afterEach -> dropzone.destroy() if dropzone?

    it "should throw an exception if the element is invalid", ->
      expect(-> dropzone = new Dropzone "#invalid-element").to.throw "Invalid dropzone element."

    it "should throw an exception if assigned twice to the same element", ->
      element = document.createElement "div"
      dropzone = new Dropzone element, url: "url"
      expect(-> new Dropzone element, url: "url").to.throw "Dropzone already attached."

    it "should throw an exception if both acceptParameter and acceptedMimeTypes are specified", ->
      element = document.createElement "div"
      expect(-> dropzone = new Dropzone element, url: "test", acceptParameter: "param", acceptedMimeTypes: "types").to.throw "You can't provide both 'acceptParameter' and 'acceptedMimeTypes'. 'acceptParameter' is deprecated."

    it "should set itself as element.dropzone", ->
      element = document.createElement "div"
      dropzone = new Dropzone element, url: "url"
      element.dropzone.should.equal dropzone

    describe "options", ->
      element = null
      element2 = null
      beforeEach ->
        element = document.createElement "div"
        element.id = "test-element"
        element2 = document.createElement "div"
        element2.id = "test-element2"
        Dropzone.options.testElement = url: "/some/url", parallelUploads: 10
      afterEach -> delete Dropzone.options.testElement

      it "should take the options set in Dropzone.options", ->
        dropzone = new Dropzone element
        dropzone.options.url.should.equal "/some/url"
        dropzone.options.parallelUploads.should.equal 10

      it "should prefer passed options over Dropzone.options", ->
        dropzone = new Dropzone element, url: "/some/other/url"
        dropzone.options.url.should.equal "/some/other/url"

      it "should take the default options if nothing set in Dropzone.options", ->
        dropzone = new Dropzone element2, url: "/some/url"
        dropzone.options.parallelUploads.should.equal 2

      it "should call the fallback function if forceFallback == true", (done) ->
        dropzone = new Dropzone element,
          url: "/some/other/url"
          forceFallback: on
          fallback: -> done()

      describe "options.clickable", ->
        clickableElement = null
        dropzone = null
        beforeEach ->
          clickableElement = document.createElement "div"
          clickableElement.className = "some-clickable"
          document.body.appendChild clickableElement
        afterEach ->
          document.body.removeChild clickableElement
          dropzone.destroy if dropzone?

        it "should use the default element if clickable == true", ->
          dropzone = new Dropzone element, clickable: yes
          dropzone.clickableElements.should.eql [ dropzone.element ]
        it "should lookup the element if clickable is a CSS selector", ->
          dropzone = new Dropzone element, clickable: ".some-clickable"
          dropzone.clickableElements.should.eql [ clickableElement ]
        it "should simply use the provided element", ->
          dropzone = new Dropzone element, clickable: clickableElement
          dropzone.clickableElements.should.eql [ clickableElement ]
        it "should accept multiple clickable elements", ->
          dropzone = new Dropzone element, clickable: [ document.body, ".some-clickable" ]
          dropzone.clickableElements.should.eql [ document.body, clickableElement ]
        it "should throw an exception if the element is invalid", ->
          expect(-> dropzone = new Dropzone element, clickable: ".some-invalid-clickable").to.throw "Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those."




  describe "init()", ->
    describe "clickable", ->

      dropzones =
        "using acceptParameter": new Dropzone(Dropzone.createElement("""<form action="/"></form>"""), { clickable: yes, acceptParameter: "audio/*,video/*" })
        "using acceptedMimeTypes": new Dropzone(Dropzone.createElement("""<form action="/"></form>"""), { clickable: yes, acceptedMimeTypes: "audio/*,video/*" })

      it "should not add an accept attribute if no acceptParameter", ->
        dropzone = new Dropzone (Dropzone.createElement """<form action="/"></form>"""), clickable: yes, acceptParameter: null, acceptedMimeTypes: null
        dropzone.hiddenFileInput.hasAttribute("accept").should.be.false


      for name, dropzone of dropzones
        describe name, ->
          do (dropzone) ->
            it "should create a hidden file input if clickable", ->
              dropzone.hiddenFileInput.should.be.ok
              dropzone.hiddenFileInput.tagName.should.equal "INPUT"

            it "should use the acceptParameter", ->
              dropzone.hiddenFileInput.getAttribute("accept").should.equal "audio/*,video/*"

            it "should create a new input element when something is selected to reset the input field", ->
              for i in [0..3]
                hiddenFileInput = dropzone.hiddenFileInput
                event = document.createEvent "HTMLEvents"
                event.initEvent "change", true, true
                hiddenFileInput.dispatchEvent event
                dropzone.hiddenFileInput.should.not.equal hiddenFileInput
                Dropzone.elementInside(hiddenFileInput, document).should.not.be.ok

    it "should create a data-dz-message element", ->
      element = Dropzone.createElement """<form class="dropzone" action="/"></form>"""
      dropzone = new Dropzone element, clickable: yes, acceptParameter: null, acceptedMimeTypes: null
      element.querySelector("[data-dz-message]").should.be.instanceof Element



  describe "options", ->

    element = null
    dropzone = null

    beforeEach ->
      element = Dropzone.createElement """<div></div>"""
      dropzone = new Dropzone element, maxFilesize: 4, url: "url", acceptedMimeTypes: "audio/*,image/png"

    describe "file specific", ->
      file = null
      beforeEach ->
        file =
          name: "test name"
          size: 2 * 1000 * 1000
        dropzone.options.addedfile.call dropzone, file

      describe ".addedFile()", ->
        it "should properly create the previewElement", ->
          file.previewElement.should.be.instanceof Element

          file.previewElement.querySelector("[data-dz-name]").innerHTML.should.eql "test name"
          file.previewElement.querySelector("[data-dz-size]").innerHTML.should.eql "<strong>2</strong> MB"

      describe ".error()", ->
        it "should properly insert the error", ->
          dropzone.options.error.call dropzone, file, "test message"

          file.previewElement.querySelector("[data-dz-errormessage]").innerHTML.should.eql "test message"

      describe ".thumbnail()", ->
        it "should properly insert the error", ->
          transparentGif = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          dropzone.options.thumbnail.call dropzone, file, transparentGif
          thumbnail = file.previewElement.querySelector("[data-dz-thumbnail]")
          thumbnail.src.should.eql transparentGif
          thumbnail.alt.should.eql "test name"

      describe ".uploadprogress()", ->
        it "should properly set the width", ->
          dropzone.options.uploadprogress.call dropzone, file, 0
          file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql "0%"
          dropzone.options.uploadprogress.call dropzone, file, 80
          file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql "80%"
          dropzone.options.uploadprogress.call dropzone, file, 90
          file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql "90%"
          dropzone.options.uploadprogress.call dropzone, file, 100
          file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql "100%"


  describe "instance", ->

    element = null
    dropzone = null
    xhr = null
    requests = null
    beforeEach ->
      xhr = sinon.useFakeXMLHttpRequest()
      requests = [ ]
      xhr.onCreate = (xhr) -> requests.push xhr

      element = Dropzone.createElement """<div></div>"""
      document.body.appendChild element
      dropzone = new Dropzone element, maxFilesize: 4, url: "url", acceptedMimeTypes: "audio/*,image/png", uploadprogress: ->
    afterEach ->
      document.body.removeChild element
      dropzone.destroy()
      xhr.restore()

    describe ".accept()", ->

      it "should pass if the filesize is OK", ->
        dropzone.accept { size: 2 * 1024 * 1024, type: "audio/mp3" }, (err) -> expect(err).to.be.undefined

      it "shouldn't pass if the filesize is too big", ->
        dropzone.accept { size: 10 * 1024 * 1024, type: "audio/mp3" }, (err) -> err.should.eql "File is too big (10MB). Max filesize: 4MB."

      it "should properly accept files which mime types are listed in acceptedMimeTypes", ->

        dropzone.accept { type: "audio/mp3" }, (err) -> expect(err).to.be.undefined
        dropzone.accept { type: "image/png" }, (err) -> expect(err).to.be.undefined
        dropzone.accept { type: "audio/wav" }, (err) -> expect(err).to.be.undefined

      it "should properly reject files when the mime type isn't listed in acceptedMimeTypes", ->

        dropzone.accept { type: "image/jpeg" }, (err) -> err.should.eql "You can't upload files of this type."


    describe ".removeFile()", ->
      it "should abort uploading if file is currently being uploaded", ->
        mockFile = getMockFile()
        dropzone.uploadFile = (file) ->
        dropzone.accept = (file, done) -> done()

        sinon.stub dropzone, "cancelUpload"

        dropzone.addFile mockFile
        mockFile.status.should.equal Dropzone.UPLOADING
        dropzone.filesProcessing[0].should.equal mockFile

        dropzone.cancelUpload.callCount.should.equal 0
        dropzone.removeFile mockFile
        dropzone.cancelUpload.callCount.should.equal 1

    describe ".cancelUpload()", ->
      it "should properly cancel upload if file currently uploading", ->
          mockFile = getMockFile()

          dropzone.accept = (file, done) -> done()

          dropzone.addFile mockFile
          mockFile.status.should.equal Dropzone.UPLOADING
          dropzone.filesProcessing[0].should.equal mockFile
          dropzone.cancelUpload mockFile
          mockFile.status.should.equal Dropzone.CANCELED
          dropzone.filesProcessing.length.should.equal 0
          dropzone.filesQueue.length.should.equal 0

      it "should properly cancel the upload if file is not yet uploading", ->
          mockFile = getMockFile()

          dropzone.accept = (file, done) -> done()

          # Making sure the file stays in the queue.
          dropzone.options.parallelUploads = 0

          dropzone.addFile mockFile
          mockFile.status.should.equal Dropzone.ACCEPTED
          dropzone.filesQueue[0].should.equal mockFile

          dropzone.cancelUpload mockFile
          mockFile.status.should.equal Dropzone.CANCELED
          dropzone.filesQueue.length.should.equal 0
          dropzone.filesProcessing.length.should.equal 0

    describe ".disable()", ->
      it "should properly cancel all pending uploads", ->
          dropzone.accept = (file, done) -> done()

          dropzone.options.parallelUploads = 1

          dropzone.addFile getMockFile()
          dropzone.addFile getMockFile()

          dropzone.filesProcessing.length.should.equal 1
          dropzone.filesQueue.length.should.equal 1
          dropzone.files.length.should.equal 2

          sinon.spy requests[0], "abort"

          requests[0].abort.callCount.should.equal 0

          dropzone.disable()

          requests[0].abort.callCount.should.equal 1

          dropzone.filesProcessing.length.should.equal 0
          dropzone.filesQueue.length.should.equal 0
          dropzone.files.length.should.equal 2

          dropzone.files[0].status.should.equal Dropzone.CANCELED
          dropzone.files[1].status.should.equal Dropzone.CANCELED

    describe ".destroy()", ->
      it "should properly cancel all pending uploads and remove all file references", ->
          dropzone.accept = (file, done) -> done()

          dropzone.options.parallelUploads = 1

          dropzone.addFile getMockFile()
          dropzone.addFile getMockFile()

          dropzone.filesProcessing.length.should.equal 1
          dropzone.filesQueue.length.should.equal 1
          dropzone.files.length.should.equal 2

          sinon.spy dropzone, "disable"

          dropzone.destroy()

          dropzone.disable.callCount.should.equal 1



    describe ".filesize()", ->

      it "should convert to KiloBytes, etc.. not KibiBytes", ->

        dropzone.filesize(2 * 1024 * 1024).should.eql "<strong>2.1</strong> MB"
        dropzone.filesize(2 * 1000 * 1000).should.eql "<strong>2</strong> MB"
        dropzone.filesize(2 * 1024 * 1024 * 1024).should.eql "<strong>2.1</strong> GB"
        dropzone.filesize(2 * 1000 * 1000 * 1000).should.eql "<strong>2</strong> GB"

    describe "events", ->

      describe "progress updates", ->

        it "should properly emit a totaluploadprogress event", ->
          dropzone.files = [
            {
              size: 1990
              upload:
                progress: 20
                total: 2000 # The bytes to upload are higher than the file size
                bytesSent: 400
            }
            {
              size: 1990
              upload:
                progress: 10
                total: 2000 # The bytes to upload are higher than the file size
                bytesSent: 200
            }
          ]
          dropzone.acceptedFiles = dropzone.files

          totalProgressExpectation = 15
          dropzone.on "totaluploadprogress", (progress) -> progress.should.eql totalProgressExpectation
          dropzone.emit "uploadprogress", { }

          totalProgressExpectation = 97.5
          dropzone.files[0].upload.bytesSent = 2000
          dropzone.files[1].upload.bytesSent = 1900
          # It shouldn't matter that progress is not properly updated since the total size
          # should be calculated from the bytes
          dropzone.on "totaluploadprogress", (progress) -> progress.should.eql totalProgressExpectation
          dropzone.emit "uploadprogress", { }

          totalProgressExpectation = 100
          dropzone.files[0].upload.bytesSent = 2000
          dropzone.files[1].upload.bytesSent = 2000
          # It shouldn't matter that progress is not properly updated since the total size
          # should be calculated from the bytes
          dropzone.on "totaluploadprogress", (progress) -> progress.should.eql totalProgressExpectation
          dropzone.emit "uploadprogress", { }


  describe "helper function", ->
    describe "getExistingFallback()", ->
      element = null
      dropzone = null
      beforeEach ->
        element = Dropzone.createElement """<div></div>"""
        dropzone = new Dropzone element, url: "url"

      it "should return undefined if no fallback", ->
        expect(dropzone.getExistingFallback()).to.equal undefined

      it "should only return the fallback element if it contains exactly fallback", ->
        element.appendChild Dropzone.createElement """<form class="fallbacks"></form>"""
        element.appendChild Dropzone.createElement """<form class="sfallback"></form>"""
        expect(dropzone.getExistingFallback()).to.equal undefined

      it "should return divs as fallback", ->
        fallback = Dropzone.createElement """<form class=" abc fallback test "></form>"""
        element.appendChild fallback
        fallback.should.equal dropzone.getExistingFallback()
      it "should return forms as fallback", ->
        fallback = Dropzone.createElement """<div class=" abc fallback test "></div>"""
        element.appendChild fallback
        fallback.should.equal dropzone.getExistingFallback()


  describe "file handling", ->
    mockFile = null
    dropzone = null


    beforeEach ->
      mockFile = getMockFile()

      element = Dropzone.createElement """<div></div>"""
      dropzone = new Dropzone element, url: "/the/url"

    afterEach ->
      dropzone.destroy()


    describe "addFile()", ->
      it "should properly set the status of the file", ->
        doneFunction = null

        dropzone.accept = (file, done) -> doneFunction = done
        dropzone.processFile = ->
        dropzone.uploadFile = ->

        dropzone.addFile mockFile

        mockFile.status.should.eql Dropzone.ADDED
        doneFunction()
        mockFile.status.should.eql Dropzone.ACCEPTED

        mockFile = getMockFile()
        dropzone.addFile mockFile

        mockFile.status.should.eql Dropzone.ADDED
        doneFunction("error")
        mockFile.status.should.eql Dropzone.ERROR



    describe "uploadFile()", ->
      xhr = null
      requests = null



      beforeEach ->
        xhr = sinon.useFakeXMLHttpRequest()
        requests = [ ]

        xhr.onCreate = (xhr) -> requests.push xhr

      afterEach ->
        xhr.restore()

      it "should properly urlencode the filename for the headers", ->
        dropzone.uploadFile mockFile
        requests[0].requestHeaders["X-File-Name"].should.eql 'test%20file%20name'


      describe "settings()", ->
        it "should correctly set `withCredentials` on the xhr object", ->
          dropzone.uploadFile mockFile
          requests.length.should.eql 1
          requests[0].withCredentials.should.eql no
          dropzone.options.withCredentials = yes
          dropzone.uploadFile mockFile
          requests.length.should.eql 2
          requests[1].withCredentials.should.eql yes

        it "should correctly override headers on the xhr object", ->
          dropzone.options.headers = {"Foo-Header": "foobar"}
          dropzone.uploadFile mockFile
          requests[0].requestHeaders["Foo-Header"].should.eql 'foobar'
          requests[0].requestHeaders["X-File-Name"].should.eql 'test%20file%20name'

      describe "should properly set status of file", ->
        it "should correctly set `withCredentials` on the xhr object", ->
          dropzone.addFile mockFile

          mockFile.status.should.eql Dropzone.UPLOADING

          requests.length.should.equal 1
          requests[0].status = 400

          requests[0].onload()

          mockFile.status.should.eql Dropzone.ERROR


          mockFile = getMockFile()
          dropzone.addFile mockFile

          mockFile.status.should.eql Dropzone.UPLOADING

          requests.length.should.equal 2
          requests[1].status = 200

          requests[1].onload()

          mockFile.status.should.eql Dropzone.SUCCESS

