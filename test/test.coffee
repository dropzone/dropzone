chai.should()

describe "Dropzone", ->


  getMockFile = ->
    status: Dropzone.ADDED
    accepted: true
    name: "test file name"
    size: 123456
    type: "text/html"
    upload:
      filename: "test file name"


  xhr = null
  beforeEach -> xhr = sinon.useFakeXMLHttpRequest()

  describe "Emitter", ->
    emitter = null
    beforeEach -> emitter = new Dropzone::Emitter()


    it ".on() should return the object itself", ->
      (emitter.on "test", ->).should.equal emitter

    it ".on() should properly register listeners", ->
      (emitter._callbacks == undefined).should.be.true
      callback = ->
      callback2 = ->
      emitter.on "test", callback
      emitter.on "test", callback2
      emitter.on "test2", callback
      emitter._callbacks.test.length.should.equal 2
      emitter._callbacks.test[0].should.equal callback
      emitter._callbacks.test[1].should.equal callback2
      emitter._callbacks.test2.length.should.equal 1
      emitter._callbacks.test2[0].should.equal callback

    it ".emit() should return the object itself", ->
      emitter.emit('test').should.equal emitter

    it ".emit() should properly invoke all registered callbacks with arguments", ->
      callCount1 = 0
      callCount12 = 0
      callCount2 = 0
      callback1 = (var1, var2) ->
        callCount1++
        var1.should.equal 'callback1 var1'
        var2.should.equal 'callback1 var2'
      callback12 = (var1, var2) ->
        callCount12++
        var1.should.equal 'callback1 var1'
        var2.should.equal 'callback1 var2'
      callback2 = (var1, var2) ->
        callCount2++
        var1.should.equal 'callback2 var1'
        var2.should.equal 'callback2 var2'

      emitter.on "test1", callback1
      emitter.on "test1", callback12
      emitter.on "test2", callback2

      callCount1.should.equal 0
      callCount12.should.equal 0
      callCount2.should.equal 0

      emitter.emit "test1", "callback1 var1", "callback1 var2"

      callCount1.should.equal 1
      callCount12.should.equal 1
      callCount2.should.equal 0

      emitter.emit "test2", "callback2 var1", "callback2 var2"

      callCount1.should.equal 1
      callCount12.should.equal 1
      callCount2.should.equal 1

      emitter.emit "test1", "callback1 var1", "callback1 var2"

      callCount1.should.equal 2
      callCount12.should.equal 2
      callCount2.should.equal 1

    describe ".off()", ->

      callback1 = ->
      callback2 = ->
      callback3 = ->
      callback4 = ->

      beforeEach ->
        emitter._callbacks =
          'test1': [ callback1, callback2 ]
          'test2': [ callback3 ]
          'test3': [ callback1, callback4 ]
          'test4': [ ]

      it "should work without any listeners", ->
        emitter._callbacks = undefined
        emt = emitter.off()
        emitter._callbacks.should.eql {}
        emt.should.equal emitter

      it "should properly remove all event listeners", ->
        emt = emitter.off()
        emitter._callbacks.should.eql {}
        emt.should.equal emitter

      it "should properly remove all event listeners for specific event", ->
        emitter.off "test1"
        (emitter._callbacks["test1"] == undefined).should.be.true
        emitter._callbacks["test2"].length.should.equal 1
        emitter._callbacks["test3"].length.should.equal 2
        emt = emitter.off "test2"
        (emitter._callbacks["test2"] == undefined).should.be.true
        emt.should.equal emitter

      it "should properly remove specific event listener", ->
        emitter.off "test1", callback1
        emitter._callbacks["test1"].length.should.equal 1
        emitter._callbacks["test1"][0].should.equal callback2
        emitter._callbacks["test3"].length.should.equal 2
        emt = emitter.off "test3", callback4
        emitter._callbacks["test3"].length.should.equal 1
        emitter._callbacks["test3"][0].should.equal callback1
        emt.should.equal emitter




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

      it "should return undefined and not throw if it's a form with an input element of the name 'id'", ->
        element = Dropzone.createElement """<form><input name="id" /</form>"""
        expect(Dropzone.optionsForElement(element)).to.equal undefined

      it "should ignore input fields with the name='id'", ->
        element = Dropzone.createElement """<form id="test-element"><input type="hidden" name="id" value="fooo" /></form>"""
        Dropzone.optionsForElement(element).should.equal testOptions

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

      it "should throw an exception if no dropzone attached", ->
        expect(-> Dropzone.forElement document.createElement "div").to.throw "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone."

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

        it "should create dropzones even if Dropzone.autoDiscover == false", ->
          # Because the check is in the actual contentLoaded function.
          Dropzone.autoDiscover = off
          Dropzone.discover()
          expect(element3.dropzone).to.be.ok

        it "should not automatically be called if Dropzone.autoDiscover == false", ->
          Dropzone.autoDiscover = off
          Dropzone.discover = -> expect(false).to.be.ok
          Dropzone._autoDiscoverFunction()


    describe "Dropzone.isValidFile()", ->
      it "should return true if called without acceptedFiles", ->
        Dropzone.isValidFile({ type: "some/type" }, null).should.be.ok

      it "should properly validate if called with concrete mime types", ->
        acceptedMimeTypes = "text/html,image/jpeg,application/json"

        Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes).should.not.be.ok

      it "should properly validate if called with base mime types", ->
        acceptedMimeTypes = "text/*,image/*,application/*"

        Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes).should.not.be.ok

      it "should properly validate if called with mixed mime types", ->
        acceptedMimeTypes = "text/*,image/jpeg,application/*"

        Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes).should.not.be.ok
        Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes).should.not.be.ok

      it "should properly validate even with spaces in between", ->
        acceptedMimeTypes = "text/html ,   image/jpeg, application/json"

        Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be.ok

      it "should properly validate extensions", ->
        acceptedMimeTypes = "text/html ,    image/jpeg, .pdf  ,.png"

        Dropzone.isValidFile({ name: "somxsfsd", type: "text/html" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ name: "somesdfsdf", type: "image/jpeg" }, acceptedMimeTypes).should.be.ok
        Dropzone.isValidFile({ name: "somesdfadfadf", type: "application/json" }, acceptedMimeTypes).should.not.be.ok
        Dropzone.isValidFile({ name: "some-file file.pdf", type: "random/type" }, acceptedMimeTypes).should.be.ok
        # .pdf has to be in the end
        Dropzone.isValidFile({ name: "some-file.pdf file.gif", type: "random/type" }, acceptedMimeTypes).should.not.be.ok
        Dropzone.isValidFile({ name: "some-file file.png", type: "random/type" }, acceptedMimeTypes).should.be.ok

    describe "Dropzone.confirm", ->
      beforeEach -> sinon.stub window, "confirm"
      afterEach -> window.confirm.restore()
      it "should forward to window.confirm and call the callbacks accordingly", ->
        accepted = rejected = no
        window.confirm.returns yes
        Dropzone.confirm "test question", (-> accepted = yes), (-> rejected = yes)
        window.confirm.args[0][0].should.equal "test question"
        accepted.should.equal yes
        rejected.should.equal no

        accepted = rejected = no
        window.confirm.returns no
        Dropzone.confirm "test question 2", (-> accepted = yes), (-> rejected = yes)
        window.confirm.args[1][0].should.equal "test question 2"
        accepted.should.equal no
        rejected.should.equal yes

      it "should not error if rejected is not provided", ->
        accepted = rejected = no
        window.confirm.returns no
        Dropzone.confirm "test question", (-> accepted = yes)
        window.confirm.args[0][0].should.equal "test question"
        # Nothing should have changed since there is no rejected function.
        accepted.should.equal no
        rejected.should.equal no


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

    it "should throw an exception if both acceptedFiles and acceptedMimeTypes are specified", ->
      element = document.createElement "div"
      expect(-> dropzone = new Dropzone element, url: "test", acceptedFiles: "param", acceptedMimeTypes: "types").to.throw "You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated."

    it "should set itself as element.dropzone", ->
      element = document.createElement "div"
      dropzone = new Dropzone element, url: "url"
      element.dropzone.should.equal dropzone

    it "should add itself to Dropzone.instances", ->
      element = document.createElement "div"
      dropzone = new Dropzone element, url: "url"
      Dropzone.instances[Dropzone.instances.length - 1].should.equal dropzone

    it "should use the action attribute not the element with the name action", ->
      element = Dropzone.createElement """<form action="real-action"><input type="hidden" name="action" value="wrong-action" /></form>"""
      dropzone = new Dropzone element
      dropzone.options.url.should.equal "real-action"

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

      it "should set acceptedFiles if deprecated acceptedMimetypes option has been passed", ->
        dropzone = new Dropzone element,
          url: "/some/other/url"
          acceptedMimeTypes: "my/type"
        dropzone.options.acceptedFiles.should.equal "my/type"

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
        "using acceptedFiles": new Dropzone(Dropzone.createElement("""<form action="/"></form>"""), { clickable: yes, acceptedFiles: "audio/*,video/*" })
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

    it "should create a .dz-message element", ->
      element = Dropzone.createElement """<form class="dropzone" action="/"></form>"""
      dropzone = new Dropzone element, clickable: yes, acceptParameter: null, acceptedMimeTypes: null
      element.querySelector(".dz-message").should.be.instanceof Element

    it "should not create a .dz-message element if there already is one", ->
      element = Dropzone.createElement """<form class="dropzone" action="/"></form>"""
      msg = Dropzone.createElement """<div class="dz-message">TEST</div>"""
      element.appendChild msg

      dropzone = new Dropzone element, clickable: yes, acceptParameter: null, acceptedMimeTypes: null
      element.querySelector(".dz-message").should.equal msg

      element.querySelectorAll(".dz-message").length.should.equal 1



  describe "options", ->

    element = null
    dropzone = null

    beforeEach ->
      element = Dropzone.createElement """<div></div>"""
      dropzone = new Dropzone element, maxFilesize: 4, url: "url", acceptedMimeTypes: "audio/*,image/png", maxFiles: 3

    describe "file specific", ->
      file = null
      beforeEach ->
        file =
          name: "test name"
          size: 2 * 1024 * 1024
          width: 200
          height: 100
          upload:
            filename: "test name"
        dropzone.options.addedfile.call dropzone, file

      describe ".addedFile()", ->
        it "should properly create the previewElement", ->
          file.previewElement.should.be.instanceof Element

          file.previewElement.querySelector("[data-dz-name]").innerHTML.should.eql "test name"
          file.previewElement.querySelector("[data-dz-size]").innerHTML.should.eql "<strong>2.1</strong> MB"

      describe ".error()", ->
        it "should properly insert the error", ->
          dropzone.options.error.call dropzone, file, "test message"

          file.previewElement.querySelector("[data-dz-errormessage]").innerHTML.should.eql "test message"

        it "should properly insert the error when provided with an object containing the error", ->
          dropzone.options.error.call dropzone, file, error: "test message"

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

      describe ".resize()", ->

        describe "with default thumbnail settings", ->
          it "should properly return target dimensions for 'contain'", ->

            info = dropzone.options.resize.call dropzone, file, 120, 120, 'crop'
            info.trgWidth.should.eql 120
            info.trgHeight.should.eql 100
            info = dropzone.options.resize.call dropzone, file, 100, 100, 'crop'
            info.trgWidth.should.eql 100
            info.trgHeight.should.eql 100

          it "should properly return target dimensions for 'contain'", ->
            info = dropzone.options.resize.call dropzone, file, 120, 120, 'contain'
            info.trgWidth.should.eql 120
            info.trgHeight.should.eql 60
            info = dropzone.options.resize.call dropzone, file, 100, 100, 'contain'
            info.trgWidth.should.eql 100
            info.trgHeight.should.eql 50

        describe "with null thumbnail settings", ->
          it "should properly return target dimensions for crop", ->
            testSettings = [
              [null, null],
              [null, 80],
              [150, null]
            ]

            for setting, i in testSettings
              info = dropzone.options.resize.call dropzone, file, setting[0], setting[1], 'crop'

              if i is 0
                info.trgWidth.should.eql 200
                info.trgHeight.should.eql 100

              if i is 1
                info.trgWidth.should.eql 160
                info.trgHeight.should.eql 80

              if i is 2
                info.trgWidth.should.eql 150
                info.trgHeight.should.eql 75

          it "should properly return target dimensions for contain", ->
            testSettings = [
              [null, 80],
              [150, null]
            ]

            for setting, i in testSettings
              info = dropzone.options.resize.call dropzone, file, setting[0], setting[1], 'contain'

              if i is 0
                info.trgWidth.should.eql 160
                info.trgHeight.should.eql 80

              if i is 1
                info.trgWidth.should.eql 150
                info.trgHeight.should.eql 75

  describe "instance", ->

    element = null
    dropzone = null
    requests = null
    beforeEach ->
      requests = [ ]
      xhr.onCreate = (xhr) -> requests.push xhr

      element = Dropzone.createElement """<div></div>"""
      document.body.appendChild element
      dropzone = new Dropzone element, maxFilesize: 4, maxFiles: 100, url: "url", acceptedMimeTypes: "audio/*,image/png", uploadprogress: ->
    afterEach ->
      document.body.removeChild element
      dropzone.destroy()
      xhr.restore()

    describe ".accept()", ->

      it "should pass if the filesize is OK", ->
        dropzone.accept { size: 2 * 1024 * 1024, type: "audio/mp3" }, (err) -> expect(err).to.be.undefined

      it "shouldn't pass if the filesize is too big", ->
        dropzone.accept { size: 10 * 1024 * 1024, type: "audio/mp3" }, (err) -> err.should.eql "File is too big (10MiB). Max filesize: 4MiB."

      it "should properly accept files which mime types are listed in acceptedFiles", ->

        dropzone.accept { type: "audio/mp3" }, (err) -> expect(err).to.be.undefined
        dropzone.accept { type: "image/png" }, (err) -> expect(err).to.be.undefined
        dropzone.accept { type: "audio/wav" }, (err) -> expect(err).to.be.undefined

      it "should properly reject files when the mime type isn't listed in acceptedFiles", ->
        dropzone.accept { type: "image/jpeg" }, (err) -> err.should.eql "You can't upload files of this type."

      it "should fail if maxFiles has been exceeded and call the event maxfilesexceeded", ->
        sinon.stub dropzone, "getAcceptedFiles"
        file = { type: "audio/mp3" }

        dropzone.getAcceptedFiles.returns { length: 99 }

        dropzone.options.dictMaxFilesExceeded = "You can only upload {{maxFiles}} files."

        called = no
        dropzone.on "maxfilesexceeded", (lfile) ->
          lfile.should.equal file
          called = yes

        dropzone.accept file, (err) -> expect(err).to.be.undefined
        called.should.not.be.ok

        dropzone.getAcceptedFiles.returns { length: 100 }
        dropzone.accept file, (err) -> expect(err).to.equal "You can only upload 100 files."
        called.should.be.ok

        dropzone.getAcceptedFiles.restore()

      it "should properly handle if maxFiles is 0", ->
        file = { type: "audio/mp3" }

        dropzone.options.maxFiles = 0

        called = no
        dropzone.on "maxfilesexceeded", (lfile) ->
          lfile.should.equal file
          called = yes

        dropzone.accept file, (err) -> expect(err).to.equal "You can not upload any more files."
        called.should.be.ok



    describe ".removeFile()", ->
      it "should abort uploading if file is currently being uploaded", (done) ->
        mockFile = getMockFile()
        dropzone.uploadFile = (file) ->
        dropzone.accept = (file, done) -> done()

        sinon.stub dropzone, "cancelUpload"

        dropzone.addFile mockFile
        setTimeout ->
          mockFile.status.should.equal Dropzone.UPLOADING
          dropzone.getUploadingFiles()[0].should.equal mockFile

          dropzone.cancelUpload.callCount.should.equal 0
          dropzone.removeFile mockFile
          dropzone.cancelUpload.callCount.should.equal 1
          done()
        , 10

    describe ".cancelUpload()", ->
      it "should properly cancel upload if file currently uploading", (done) ->
        mockFile = getMockFile()

        dropzone.accept = (file, done) -> done()

        dropzone.addFile mockFile

        setTimeout ->
          mockFile.status.should.equal Dropzone.UPLOADING
          dropzone.getUploadingFiles()[0].should.equal mockFile
          dropzone.cancelUpload mockFile
          mockFile.status.should.equal Dropzone.CANCELED
          dropzone.getUploadingFiles().length.should.equal 0
          dropzone.getQueuedFiles().length.should.equal 0
          done()
        , 10

      it "should properly cancel the upload if file is not yet uploading", ->
        mockFile = getMockFile()

        dropzone.accept = (file, done) -> done()

        # Making sure the file stays in the queue.
        dropzone.options.parallelUploads = 0

        dropzone.addFile mockFile
        mockFile.status.should.equal Dropzone.QUEUED
        dropzone.getQueuedFiles()[0].should.equal mockFile

        dropzone.cancelUpload mockFile
        mockFile.status.should.equal Dropzone.CANCELED
        dropzone.getQueuedFiles().length.should.equal 0
        dropzone.getUploadingFiles().length.should.equal 0

      it "should call processQueue()", (done) ->
        mockFile = getMockFile()

        dropzone.accept = (file, done) -> done()

        # Making sure the file stays in the queue.
        dropzone.options.parallelUploads = 0

        sinon.spy dropzone, "processQueue"

        dropzone.addFile mockFile
        setTimeout ->
          dropzone.processQueue.callCount.should.equal 1

          dropzone.cancelUpload mockFile

          dropzone.processQueue.callCount.should.equal 2
          done()
        , 10

      it "should properly cancel all files with the same XHR if uploadMultiple is true", (done) ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()

        dropzone.accept = (file, done) -> done()

        # Making sure the file stays in the queue.
        dropzone.options.uploadMultiple = yes
        dropzone.options.parallelUploads = 3

        sinon.spy dropzone, "processFiles"

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3

        setTimeout ->
          dropzone.processFiles.callCount.should.equal 1

          sinon.spy mock1.xhr, "abort"

          dropzone.cancelUpload mock1

          expect(mock1.xhr == mock2.xhr == mock3.xhr).to.be.ok

          mock1.status.should.equal Dropzone.CANCELED
          mock2.status.should.equal Dropzone.CANCELED
          mock3.status.should.equal Dropzone.CANCELED

          # The XHR should only be aborted once!
          mock1.xhr.abort.callCount.should.equal 1

          done()
        , 10



    describe ".disable()", ->
      it "should properly cancel all pending uploads", (done) ->
          dropzone.accept = (file, done) -> done()

          dropzone.options.parallelUploads = 1

          dropzone.addFile getMockFile()
          dropzone.addFile getMockFile()

          setTimeout ->

            dropzone.getUploadingFiles().length.should.equal 1
            dropzone.getQueuedFiles().length.should.equal 1
            dropzone.files.length.should.equal 2

            sinon.spy requests[0], "abort"

            requests[0].abort.callCount.should.equal 0

            dropzone.disable()

            requests[0].abort.callCount.should.equal 1

            dropzone.getUploadingFiles().length.should.equal 0
            dropzone.getQueuedFiles().length.should.equal 0
            dropzone.files.length.should.equal 2

            dropzone.files[0].status.should.equal Dropzone.CANCELED
            dropzone.files[1].status.should.equal Dropzone.CANCELED
            done()
          , 10

    describe ".destroy()", ->
      it "should properly cancel all pending uploads and remove all file references", (done) ->
        dropzone.accept = (file, done) -> done()

        dropzone.options.parallelUploads = 1

        dropzone.addFile getMockFile()
        dropzone.addFile getMockFile()


        setTimeout ->
          dropzone.getUploadingFiles().length.should.equal 1
          dropzone.getQueuedFiles().length.should.equal 1
          dropzone.files.length.should.equal 2

          sinon.spy dropzone, "disable"

          dropzone.destroy()

          dropzone.disable.callCount.should.equal 1
          element.should.not.have.property "dropzone"
          done()
        , 10

      it "should be able to create instance of dropzone on the same element after destroy", ->
        dropzone.destroy()
        ( -> new Dropzone element, maxFilesize: 4, url: "url", acceptedMimeTypes: "audio/*,image/png", uploadprogress: -> ).should.not.throw( Error )

      it "should remove itself from Dropzone.instances", ->
        (Dropzone.instances.indexOf(dropzone) != -1).should.be.ok
        dropzone.destroy()
        (Dropzone.instances.indexOf(dropzone) == -1).should.be.ok



    describe ".filesize()", ->

      it "should handle files with 0 size properly", ->
        dropzone.filesize(0).should.eql "<strong>0</strong> b"

      it "should convert to KiloBytes, etc..", ->

        dropzone.options.filesizeBase.should.eql 1000 # Just making sure the default config is correct

        dropzone.filesize(2 * 1000 * 1000).should.eql "<strong>2</strong> MB"
        dropzone.filesize(2 * 1024 * 1024).should.eql "<strong>2.1</strong> MB"

        dropzone.filesize(2 * 1000 * 1000 * 1000).should.eql "<strong>2</strong> GB"
        dropzone.filesize(2 * 1024 * 1024 * 1024).should.eql "<strong>2.1</strong> GB"

        dropzone.filesize(2.5111 * 1000 * 1000 * 1000).should.eql "<strong>2.5</strong> GB"
        dropzone.filesize(1.1 * 1000).should.eql "<strong>1.1</strong> KB"
        dropzone.filesize(999 * 1000).should.eql "<strong>1</strong> MB"

      it "should convert to KibiBytes, etc.. when the filesizeBase is changed to 1024", ->

        dropzone.options.filesizeBase = 1024

        dropzone.filesize(2 * 1024 * 1024).should.eql "<strong>2</strong> MB"
        dropzone.filesize(2 * 1000 * 1000).should.eql "<strong>1.9</strong> MB"


    describe "._updateMaxFilesReachedClass()", ->
      it "should properly add the dz-max-files-reached class", ->
        dropzone.getAcceptedFiles = -> length: 10
        dropzone.options.maxFiles = 10
        dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok
        dropzone._updateMaxFilesReachedClass()
        dropzone.element.classList.contains("dz-max-files-reached").should.be.ok
      it "should fire the 'maxfilesreached' event when appropriate", ->
        spy = sinon.spy()
        dropzone.on "maxfilesreached", -> spy()
        dropzone.getAcceptedFiles = -> length: 9
        dropzone.options.maxFiles = 10
        dropzone._updateMaxFilesReachedClass()
        spy.should.not.have.been.called
        dropzone.getAcceptedFiles = -> length: 10
        dropzone._updateMaxFilesReachedClass()
        spy.should.have.been.called
        dropzone.getAcceptedFiles = -> length: 11
        dropzone._updateMaxFilesReachedClass()
        spy.should.have.been.calledOnce #ie, it has not been called again

      it "should properly remove the dz-max-files-reached class", ->
        dropzone.getAcceptedFiles = -> length: 10
        dropzone.options.maxFiles = 10
        dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok
        dropzone._updateMaxFilesReachedClass()
        dropzone.element.classList.contains("dz-max-files-reached").should.be.ok
        dropzone.getAcceptedFiles = -> length: 9
        dropzone._updateMaxFilesReachedClass()
        dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok

    describe "events", ->

      describe "progress updates", ->

        it "should properly emit a totaluploadprogress event", (done) ->
          dropzone.files = [
            {
              size: 1990
              accepted: true
              status: Dropzone.UPLOADING
              upload:
                progress: 20
                total: 2000 # The bytes to upload are higher than the file size
                bytesSent: 400
            }
            {
              size: 1990
              accepted: true
              status: Dropzone.UPLOADING
              upload:
                progress: 10
                total: 2000 # The bytes to upload are higher than the file size
                bytesSent: 200
            }
          ]

          _called = 0

          dropzone.on "totaluploadprogress", (progress) ->
            progress.should.equal totalProgressExpectation
            done() if ++_called == 3

          totalProgressExpectation = 15
          dropzone.emit "uploadprogress", { }

          totalProgressExpectation = 97.5
          dropzone.files[0].upload.bytesSent = 2000
          dropzone.files[1].upload.bytesSent = 1900
          # It shouldn't matter that progress is not properly updated since the total size
          # should be calculated from the bytes
          dropzone.emit "uploadprogress", { }

          totalProgressExpectation = 100
          dropzone.files[0].upload.bytesSent = 2000
          dropzone.files[1].upload.bytesSent = 2000
          # It shouldn't matter that progress is not properly updated since the total size
          # should be calculated from the bytes
          dropzone.emit "uploadprogress", { }

          # Just so the afterEach hook doesn't try to cancel them.
          dropzone.files[0].status = Dropzone.CANCELED
          dropzone.files[1].status = Dropzone.CANCELED


  describe "helper function", ->
    element = null
    dropzone = null
    beforeEach ->
      element = Dropzone.createElement """<div></div>"""
      dropzone = new Dropzone element, url: "url"

    describe "getExistingFallback()", ->
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

    describe "getFallbackForm()", ->
      it "should use the paramName without [0] if uploadMultiple is false", ->
        dropzone.options.uploadMultiple = false
        dropzone.options.paramName = "myFile"
        fallback = dropzone.getFallbackForm()
        fileInput = fallback.querySelector "input[type=file]"
        fileInput.name.should.equal "myFile"
      it "should properly add [0] to the file name if uploadMultiple is true", ->
        dropzone.options.uploadMultiple = yes
        dropzone.options.paramName = "myFile"
        fallback = dropzone.getFallbackForm()
        fileInput = fallback.querySelector "input[type=file]"
        fileInput.name.should.equal "myFile[0]"


    describe "getAcceptedFiles() / getRejectedFiles()", ->
      mock1 = mock2 = mock3 = mock4 = null
      beforeEach ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock4 = getMockFile()
        dropzone.options.accept = (file, done) ->
          if file in [ mock1, mock3 ]
            done()
          else
            done "error"
        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
        dropzone.addFile mock4

      it "getAcceptedFiles() should only return accepted files", ->
        dropzone.getAcceptedFiles().should.eql [ mock1, mock3 ]
      it "getRejectedFiles() should only return rejected files", ->
        dropzone.getRejectedFiles().should.eql [ mock2, mock4 ]

    describe "getQueuedFiles()", ->
      it "should return all files with the status Dropzone.QUEUED", ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock4 = getMockFile()

        dropzone.options.accept = (file, done) -> file.done = done

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
        dropzone.addFile mock4

        dropzone.getQueuedFiles().should.eql [ ]

        mock1.done()
        mock3.done()

        dropzone.getQueuedFiles().should.eql [ mock1, mock3 ]
        mock1.status.should.equal Dropzone.QUEUED
        mock3.status.should.equal Dropzone.QUEUED
        mock2.status.should.equal Dropzone.ADDED
        mock4.status.should.equal Dropzone.ADDED


    describe "getUploadingFiles()", ->
      it "should return all files with the status Dropzone.UPLOADING", (done) ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock4 = getMockFile()

        dropzone.options.accept = (file, _done) -> file.done = _done
        dropzone.uploadFile = ->

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
        dropzone.addFile mock4

        dropzone.getUploadingFiles().should.eql [ ]

        mock1.done()
        mock3.done()

        setTimeout (->
          dropzone.getUploadingFiles().should.eql [ mock1, mock3 ]
          mock1.status.should.equal Dropzone.UPLOADING
          mock3.status.should.equal Dropzone.UPLOADING
          mock2.status.should.equal Dropzone.ADDED
          mock4.status.should.equal Dropzone.ADDED
          done()
        ), 10


    describe "getActiveFiles()", ->
      it "should return all files with the status Dropzone.UPLOADING or Dropzone.QUEUED", (done) ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock4 = getMockFile()

        dropzone.options.accept = (file, _done) -> file.done = _done
        dropzone.uploadFile = ->
        dropzone.options.parallelUploads = 2

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
        dropzone.addFile mock4

        dropzone.getActiveFiles().should.eql [ ]

        mock1.done()
        mock3.done()
        mock4.done()

        setTimeout (->
          dropzone.getActiveFiles().should.eql [ mock1, mock3, mock4 ]
          mock1.status.should.equal Dropzone.UPLOADING
          mock3.status.should.equal Dropzone.UPLOADING
          mock2.status.should.equal Dropzone.ADDED
          mock4.status.should.equal Dropzone.QUEUED
          done()
        ), 10


    describe "getFilesWithStatus()", ->
      it "should return all files with provided status", ->
        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock4 = getMockFile()

        dropzone.options.accept = (file, _done) -> file.done = _done
        dropzone.uploadFile = ->

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
        dropzone.addFile mock4

        dropzone.getFilesWithStatus(Dropzone.ADDED).should.eql [ mock1, mock2, mock3, mock4 ]

        mock1.status = Dropzone.UPLOADING
        mock3.status = Dropzone.QUEUED
        mock4.status = Dropzone.QUEUED

        dropzone.getFilesWithStatus(Dropzone.ADDED).should.eql [ mock2 ]
        dropzone.getFilesWithStatus(Dropzone.UPLOADING).should.eql [ mock1 ]
        dropzone.getFilesWithStatus(Dropzone.QUEUED).should.eql [ mock3, mock4 ]
        



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
        mockFile.status.should.eql Dropzone.QUEUED

        mockFile = getMockFile()
        dropzone.addFile mockFile

        mockFile.status.should.eql Dropzone.ADDED
        doneFunction("error")
        mockFile.status.should.eql Dropzone.ERROR

      it "should properly set the status of the file if autoProcessQueue is false and not call processQueue", (done) ->
        doneFunction = null
        dropzone.options.autoProcessQueue = false
        dropzone.accept = (file, done) -> doneFunction = done
        dropzone.processFile = ->
        dropzone.uploadFile = ->

        dropzone.addFile mockFile
        sinon.stub dropzone, "processQueue"

        mockFile.status.should.eql Dropzone.ADDED
        doneFunction()
        mockFile.status.should.eql Dropzone.QUEUED
        dropzone.processQueue.callCount.should.equal 0
        setTimeout (->
          dropzone.processQueue.callCount.should.equal 0
          done()
        ), 10

      it "should not add the file to the queue if autoQueue is false", ->
        doneFunction = null
        dropzone.options.autoQueue = false
        dropzone.accept = (file, done) -> doneFunction = done
        dropzone.processFile = ->
        dropzone.uploadFile = ->

        dropzone.addFile mockFile

        mockFile.status.should.eql Dropzone.ADDED
        doneFunction()
        mockFile.status.should.eql Dropzone.ADDED

      it "should create a remove link if configured to do so", ->
        dropzone.options.addRemoveLinks = true
        dropzone.processFile = ->
        dropzone.uploadFile = ->

        sinon.stub dropzone, "processQueue"
        dropzone.addFile mockFile

        dropzone.files[0].previewElement.querySelector("a[data-dz-remove].dz-remove").should.be.ok


      it "should attach an event handler to data-dz-remove links", ->
        dropzone.options.previewTemplate = """
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
                                              <a class="link1" data-dz-remove></a>
                                              <a class="link2" data-dz-remove></a>
                                            </div>
                                            """

        sinon.stub dropzone, "processQueue"

        dropzone.addFile mockFile

        file = dropzone.files[0]
        removeLink1 = file.previewElement.querySelector("a[data-dz-remove].link1")
        removeLink2 = file.previewElement.querySelector("a[data-dz-remove].link2")

        sinon.stub dropzone, "removeFile"

        event = document.createEvent "HTMLEvents"
        event.initEvent "click", true, true
        removeLink1.dispatchEvent event

        dropzone.removeFile.callCount.should.eql 1

        event = document.createEvent "HTMLEvents"
        event.initEvent "click", true, true
        removeLink2.dispatchEvent event

        dropzone.removeFile.callCount.should.eql 2



      describe "thumbnails", ->
        it "should properly queue the thumbnail creation", (done) ->
          doneFunction = null

          dropzone.accept = (file, done) -> doneFunction = done
          dropzone.processFile = ->
          dropzone.uploadFile = ->

          mock1 = getMockFile()
          mock2 = getMockFile()
          mock3 = getMockFile()
          mock1.type = "image/jpg"
          mock2.type = "image/jpg"
          mock3.type = "image/jpg"

          ct_file = ct_callback = null
          dropzone.createThumbnail = (file, thumbnailWidth, thumbnailHeight, resizeMethod, fixOrientation, callback) ->
            ct_file = file
            ct_callback = callback

          sinon.spy dropzone, "createThumbnail"
          
          dropzone.addFile mock1
          dropzone.addFile mock2
          dropzone.addFile mock3

          dropzone.files.length.should.eql 3
          setTimeout (->
            dropzone.createThumbnail.callCount.should.eql 1
            mock1.should.equal ct_file
            ct_callback()
            dropzone.createThumbnail.callCount.should.eql 2
            mock2.should.equal ct_file
            ct_callback()
            dropzone.createThumbnail.callCount.should.eql 3
            mock3.should.equal ct_file

            done()
          ), 10
          
        describe "when file is SVG", ->
          it "should use the SVG image itself", (done) ->

            createBlob = (data, type) ->
              try
                new Blob([data], type: type)
              catch e
                BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                    window.MozBlobBuilder || window.MSBlobBuilder
                builder = new BlobBuilder()
                builder.append(data.buffer || data)
                builder.getBlob(type)

            blob = createBlob('foo', 'image/svg+xml')

            dropzone.createThumbnail blob, dropzone.options.thumbnailWidth, dropzone.options.thumbnailHeight, 'crop', false, (dataURI, canvas) ->
              fileReader = new FileReader
              fileReader.onload = ->
                fileReader.result.should.equal dataURI
                done()
              fileReader.readAsDataURL blob

    describe "enqueueFile()", ->
      it "should be wrapped by enqueueFiles()", ->
        sinon.stub dropzone, "enqueueFile"

        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()

        dropzone.enqueueFiles [ mock1, mock2, mock3 ]

        dropzone.enqueueFile.callCount.should.equal 3
        dropzone.enqueueFile.args[0][0].should.equal mock1
        dropzone.enqueueFile.args[1][0].should.equal mock2
        dropzone.enqueueFile.args[2][0].should.equal mock3

      it "should fail if the file has already been processed", ->
        mockFile.status = Dropzone.ERROR
        expect((-> dropzone.enqueueFile(mockFile))).to.throw "This file can't be queued because it has already been processed or was rejected."
        mockFile.status = Dropzone.COMPLETE
        expect((-> dropzone.enqueueFile(mockFile))).to.throw "This file can't be queued because it has already been processed or was rejected."
        mockFile.status = Dropzone.UPLOADING
        expect((-> dropzone.enqueueFile(mockFile))).to.throw "This file can't be queued because it has already been processed or was rejected."

      it "should set the status to QUEUED and call processQueue asynchronously if everything's ok", (done) ->
        mockFile.status = Dropzone.ADDED
        sinon.stub dropzone, "processQueue"
        dropzone.processQueue.callCount.should.equal 0
        dropzone.enqueueFile mockFile
        mockFile.status.should.equal Dropzone.QUEUED
        dropzone.processQueue.callCount.should.equal 0
        setTimeout ->
          dropzone.processQueue.callCount.should.equal 1
          done()
        , 10

    describe "uploadFiles()", ->
      requests = null



      beforeEach ->
        requests = [ ]

        xhr.onCreate = (xhr) -> requests.push xhr

      afterEach ->
        xhr.restore()

      # Removed this test because multiple filenames can be transmitted now
      # it "should properly urlencode the filename for the headers"

      it "should be wrapped by uploadFile()", ->
        sinon.stub dropzone, "uploadFiles"

        dropzone.uploadFile mockFile

        dropzone.uploadFiles.callCount.should.equal 1
        dropzone.uploadFiles.calledWith([ mockFile ]).should.be.ok

      it "should use url options if strings", (done) ->
        dropzone.addFile mockFile

        setTimeout ->
          expect(requests.length).to.equal 1
          expect(requests[0].url).to.equal dropzone.options.url
          expect(requests[0].method).to.equal dropzone.options.method
          done()
        , 10

      it "should call url options if functions", (done) ->
        method = "PUT"
        url = "/custom/upload/url"

        dropzone.options.method = sinon.stub().returns method
        dropzone.options.url = sinon.stub().returns url

        dropzone.addFile mockFile

        setTimeout ->
          dropzone.options.method.callCount.should.equal 1
          dropzone.options.url.callCount.should.equal 1
          sinon.assert.calledWith dropzone.options.method, [mockFile]
          sinon.assert.calledWith dropzone.options.url, [mockFile]
          expect(requests.length).to.equal 1
          expect(requests[0].url).to.equal url
          expect(requests[0].method).to.equal method
          done()
        , 10

      it "should use the timeout option", (done) ->
        dropzone.addFile mockFile

        setTimeout ->
          expect(requests.length).to.equal 1
          expect(requests[0].timeout).to.equal dropzone.options.timeout
          done()
        , 10

      it "should ignore the onreadystate callback if readyState != 4", (done) ->
        dropzone.addFile mockFile
        setTimeout ->
          mockFile.status.should.eql Dropzone.UPLOADING

          requests[0].status = 200
          requests[0].readyState = 3
          requests[0].responseHeaders = {'content-type': "text/plain"}
          requests[0].onload()

          mockFile.status.should.eql Dropzone.UPLOADING

          requests[0].readyState = 4
          requests[0].onload()

          mockFile.status.should.eql Dropzone.SUCCESS
          done()
        , 10
      

      it "should emit error and errormultiple when response was not OK", (done) ->
        dropzone.options.uploadMultiple = yes

        error = no
        errormultiple = no
        complete = no
        completemultiple = no
        dropzone.on "error", -> error = yes
        dropzone.on "errormultiple", -> errormultiple = yes
        dropzone.on "complete", -> complete = yes
        dropzone.on "completemultiple", -> completemultiple = yes

        dropzone.addFile mockFile

        setTimeout ->

          mockFile.status.should.eql Dropzone.UPLOADING

          requests[0].status = 400
          requests[0].readyState = 4
          requests[0].responseHeaders = {'content-type': "text/plain"}
          requests[0].onload()

          expect(yes == error == errormultiple == complete == completemultiple).to.be.ok

          done()
        , 10

      it "should include hidden files in the form and unchecked checkboxes and radiobuttons should be excluded", (done) ->
        element = Dropzone.createElement """<form action="/the/url">
                                              <input type="hidden" name="test" value="hidden" />
                                              <input type="checkbox" name="unchecked" value="1" />
                                              <input type="checkbox" name="checked" value="value1" checked="checked" />
                                              <input type="radio" value="radiovalue1" name="radio1" />
                                              <input type="radio" value="radiovalue2" name="radio1" checked="checked" />
                                              <select name="select"><option value="1">1</option><option value="2" selected>2</option></select>
                                            </form>"""
        dropzone = new Dropzone element, url: "/the/url"


        formData = null
        dropzone.on "sending", (file, xhr, tformData) ->
          formData = tformData
          sinon.spy tformData, "append"

        mock1 = getMockFile()

        dropzone.addFile mock1

        setTimeout ->
          formData.append.callCount.should.equal 5

          formData.append.args[0][0].should.eql "test"
          formData.append.args[0][1].should.eql "hidden"

          formData.append.args[1][0].should.eql "checked"
          formData.append.args[1][1].should.eql "value1"

          formData.append.args[2][0].should.eql "radio1"
          formData.append.args[2][1].should.eql "radiovalue2"

          formData.append.args[3][0].should.eql "select"
          formData.append.args[3][1].should.eql "2"

          formData.append.args[4][0].should.eql "file"
          formData.append.args[4][1].should.equal mock1

          # formData.append.args[1][0].should.eql "myName[]"
          done()
        , 10


      it "should all values of a select that has the multiple attribute", (done) ->
        element = Dropzone.createElement """<form action="/the/url">
                                              <select name="select" multiple>
                                                <option value="value1">1</option>
                                                <option value="value2" selected>2</option>
                                                <option value="value3">3</option>
                                                <option value="value4" selected>4</option>
                                              </select>
                                            </form>"""
        dropzone = new Dropzone element, url: "/the/url"


        formData = null
        dropzone.on "sending", (file, xhr, tformData) ->
          formData = tformData
          sinon.spy tformData, "append"

        mock1 = getMockFile()

        dropzone.addFile mock1

        setTimeout ->
          formData.append.callCount.should.equal 3

          formData.append.args[0][0].should.eql "select"
          formData.append.args[0][1].should.eql "value2"

          formData.append.args[1][0].should.eql "select"
          formData.append.args[1][1].should.eql "value4"

          formData.append.args[2][0].should.eql "file"
          formData.append.args[2][1].should.equal mock1

          # formData.append.args[1][0].should.eql "myName[]"
          done()
        , 10



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

        it "should not set headers on the xhr object that are empty", ->
          dropzone.options.headers = {"X-Requested-With": null}
          dropzone.uploadFile mockFile
          Object.keys(requests[0].requestHeaders).should.not.contain("X-Requested-With")

        it "should properly use the paramName without [n] as file upload if uploadMultiple is false", (done) ->
          dropzone.options.uploadMultiple = false
          dropzone.options.paramName = "myName"

          formData = [ ]
          sendingCount = 0
          dropzone.on "sending", (files, xhr, tformData) ->
            sendingCount++

            formData.push tformData
            sinon.spy tformData, "append"


          mock1 = getMockFile()
          mock2 = getMockFile()

          dropzone.addFile mock1
          dropzone.addFile mock2

          setTimeout ->
            sendingCount.should.equal 2

            formData.length.should.equal 2
            formData[0].append.callCount.should.equal 1
            formData[1].append.callCount.should.equal 1
            formData[0].append.args[0][0].should.eql "myName"
            formData[0].append.args[0][0].should.eql "myName"

            done()
          , 10


        it "should properly use the paramName with [n] as file upload if uploadMultiple is true", (done) ->
          dropzone.options.uploadMultiple = yes
          dropzone.options.paramName = "myName"

          formData = null
          sendingMultipleCount = 0
          sendingCount = 0
          dropzone.on "sending", (file, xhr, tformData) -> sendingCount++
          dropzone.on "sendingmultiple", (files, xhr, tformData) ->
            sendingMultipleCount++
            formData = tformData
            sinon.spy tformData, "append"

          mock1 = getMockFile()
          mock2 = getMockFile()

          dropzone.addFile mock1
          dropzone.addFile mock2

          setTimeout ->
            sendingCount.should.equal 2
            sendingMultipleCount.should.equal 1
            dropzone.uploadFiles [ mock1, mock2 ]
            formData.append.callCount.should.equal 2
            formData.append.args[0][0].should.eql "myName[0]"
            formData.append.args[1][0].should.eql "myName[1]"
            done()
          , 10


        it "should use resizeImage if dimensions are provided", (done) ->
          sinon.stub dropzone, "resizeImage"
          sinon.stub dropzone, "createThumbnail"

          dropzone.options.resizeWidth = 400

          mock1 = getMockFile()
          mock1.type = 'image/jpeg'

          dropzone.addFile mock1

          setTimeout ->
            dropzone.resizeImage.callCount.should.eql 1
            done()
          , 10

        it "should not use resizeImage if dimensions are not provided", (done) ->
          sinon.stub dropzone, "resizeImage"
          sinon.stub dropzone, "createThumbnail"

          mock1 = getMockFile()
          mock1.type = 'image/jpeg'

          dropzone.addFile mock1

          setTimeout ->
            dropzone.resizeImage.callCount.should.eql 0
            done()
          , 10

        it "should not use resizeImage if file is not an image", (done) ->
          sinon.stub dropzone, "resizeImage"
          sinon.stub dropzone, "createThumbnail"

          dropzone.options.resizeWidth = 400

          mock1 = getMockFile()
          mock1.type = 'text/plain'

          dropzone.addFile mock1

          setTimeout ->
            dropzone.resizeImage.callCount.should.eql 0
            done()
          , 10


      it "should not change the file name if the options.renameFile is not set", (done) ->
        mockFilename = 'T3sT ;:_-.,!¨@&%&'
        mockFile = getMockFile()
        mockFile.name = mockFilename

        renamedFilename = dropzone._renameFile mockFile

        renamedFilename.should.equal mockFilename
        done()

      it "should rename the file name if options.renamedFilename is set", (done) ->
        dropzone.options.renameFile = (file) ->
          file.name.toLowerCase().replace(/[^\w]/gi, '')

        mockFile = getMockFile()
        mockFile.name = 'T3sT ;:_-.,!¨@&%&'

        renamedFilename = dropzone._renameFile mockFile

        renamedFilename.should.equal 't3st_'
        done()

      describe "should properly set status of file", ->
        it "should correctly set `withCredentials` on the xhr object", (done) ->
          dropzone.addFile mockFile

          setTimeout ->
            mockFile.status.should.eql Dropzone.UPLOADING

            requests.length.should.equal 1
            requests[0].status = 400
            requests[0].readyState = 4
            requests[0].responseHeaders = {'content-type': "text/plain"}

            requests[0].onload()

            mockFile.status.should.eql Dropzone.ERROR


            mockFile = getMockFile()
            dropzone.addFile mockFile

            setTimeout ->
              mockFile.status.should.eql Dropzone.UPLOADING

              requests.length.should.equal 2
              requests[1].status = 200
              requests[1].readyState = 4
              requests[1].responseHeaders = {'content-type': "text/plain"}

              requests[1].onload()

              mockFile.status.should.eql Dropzone.SUCCESS
              done()
            , 10
          , 10

    describe "complete file", ->
      it "should properly emit the queuecomplete event when the complete queue is finished", (done) ->

        mock1 = getMockFile()
        mock2 = getMockFile()
        mock3 = getMockFile()
        mock1.status = Dropzone.ADDED
        mock2.status = Dropzone.ADDED
        mock3.status = Dropzone.ADDED
        mock1.name = "mock1"
        mock2.name = "mock2"
        mock3.name = "mock3"


        dropzone.uploadFiles = (files) ->
          setTimeout (=>
            @_finished files, null, null
          ), 1

        completedFiles = 0
        dropzone.on "complete", (file) ->
          completedFiles++

        dropzone.on "queuecomplete", ->
          completedFiles.should.equal 3
          done()

        dropzone.addFile mock1
        dropzone.addFile mock2
        dropzone.addFile mock3
