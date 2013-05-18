(function() {
  chai.should();

  describe("Dropzone", function() {
    describe("static functions", function() {
      describe("Dropzone.createElement()", function() {
        var element;

        element = Dropzone.createElement("<div class=\"test\"><span>Hallo</span></div>");
        it("should properly create an element from a string", function() {
          return element.tagName.should.equal("DIV");
        });
        it("should properly add the correct class", function() {
          return element.classList.contains("test").should.be.ok;
        });
        it("should properly create child elements", function() {
          return element.querySelector("span").tagName.should.equal("SPAN");
        });
        return it("should always return only one element", function() {
          element = Dropzone.createElement("<div></div><span></span>");
          return element.tagName.should.equal("DIV");
        });
      });
      describe("Dropzone.elementInside()", function() {
        var child1, child2, element;

        element = Dropzone.createElement("<div id=\"test\"><div class=\"child1\"><div class=\"child2\"></div></div></div>");
        document.body.appendChild(element);
        child1 = element.querySelector(".child1");
        child2 = element.querySelector(".child2");
        after(function() {
          return document.body.removeChild(element);
        });
        it("should return yes if elements are the same", function() {
          return Dropzone.elementInside(element, element).should.be.ok;
        });
        it("should return yes if element is direct child", function() {
          return Dropzone.elementInside(child1, element).should.be.ok;
        });
        it("should return yes if element is some child", function() {
          Dropzone.elementInside(child2, element).should.be.ok;
          return Dropzone.elementInside(child2, document.body).should.be.ok;
        });
        return it("should return no unless element is some child", function() {
          Dropzone.elementInside(element, child1).should.not.be.ok;
          return Dropzone.elementInside(document.body, child1).should.not.be.ok;
        });
      });
      describe("Dropzone.optionsForElement()", function() {
        var element, testOptions;

        testOptions = {
          url: "/some/url",
          method: "put"
        };
        before(function() {
          return Dropzone.options.testElement = testOptions;
        });
        after(function() {
          return delete Dropzone.options.testElement;
        });
        element = document.createElement("div");
        it("should take options set in Dropzone.options from camelized id", function() {
          element.id = "test-element";
          return Dropzone.optionsForElement(element).should.equal(testOptions);
        });
        return it("should return undefined if no options set", function() {
          element.id = "test-element2";
          return expect(Dropzone.optionsForElement(element)).to.equal(void 0);
        });
      });
      describe("Dropzone.forElement()", function() {
        var dropzone, element;

        element = document.createElement("div");
        element.id = "some-test-element";
        dropzone = null;
        before(function() {
          document.body.appendChild(element);
          return dropzone = new Dropzone(element, {
            url: "/test"
          });
        });
        after(function() {
          dropzone.disable();
          return document.body.removeChild(element);
        });
        it("should return null if no dropzone attached", function() {
          return expect(Dropzone.forElement(document.createElement("div"))).to.equal(null);
        });
        it("should accept css selectors", function() {
          return expect(Dropzone.forElement("#some-test-element")).to.equal(dropzone);
        });
        return it("should accept native elements", function() {
          return expect(Dropzone.forElement(element)).to.equal(dropzone);
        });
      });
      describe("Dropzone.discover()", function() {
        var element1, element2, element3;

        element1 = document.createElement("div");
        element1.className = "dropzone";
        element2 = element1.cloneNode();
        element3 = element1.cloneNode();
        element1.id = "test-element-1";
        element2.id = "test-element-2";
        element3.id = "test-element-3";
        describe("specific options", function() {
          before(function() {
            Dropzone.options.testElement1 = {
              url: "test-url"
            };
            Dropzone.options.testElement2 = false;
            document.body.appendChild(element1);
            document.body.appendChild(element2);
            return Dropzone.discover();
          });
          after(function() {
            document.body.removeChild(element1);
            return document.body.removeChild(element2);
          });
          it("should find elements with a .dropzone class", function() {
            return element1.dropzone.should.be.ok;
          });
          return it("should not create dropzones with disabled options", function() {
            return expect(element2.dropzone).to.not.be.ok;
          });
        });
        return describe("Dropzone.autoDiscover", function() {
          before(function() {
            Dropzone.options.testElement3 = {
              url: "test-url"
            };
            return document.body.appendChild(element3);
          });
          after(function() {
            return document.body.removeChild(element3);
          });
          return it("should not create dropzones if Dropzone.autoDiscover == false", function() {
            Dropzone.autoDiscover = false;
            Dropzone.discover();
            return expect(element3.dropzone).to.not.be.ok;
          });
        });
      });
      return describe("Dropzone.isValidMimeType()", function() {
        it("should return true if called without acceptedMimeTypes", function() {
          return Dropzone.isValidMimeType("some/type", null).should.be.ok;
        });
        it("should properly validate if called with concrete mime types", function() {
          var acceptedMimeTypes;

          acceptedMimeTypes = "text/html,image/jpeg,application/json";
          Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.not.be.ok;
        });
        it("should properly validate if called with base mime types", function() {
          var acceptedMimeTypes;

          acceptedMimeTypes = "text/*,image/*,application/*";
          Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidMimeType("some/type", acceptedMimeTypes).should.not.be.ok;
        });
        it("should properly validate if called with mixed mime types", function() {
          var acceptedMimeTypes;

          acceptedMimeTypes = "text/*,image/jpeg,application/*";
          Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok;
          Dropzone.isValidMimeType("image/bmp", acceptedMimeTypes).should.not.be.ok;
          Dropzone.isValidMimeType("application/json", acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidMimeType("some/type", acceptedMimeTypes).should.not.be.ok;
        });
        return it("should properly validate even with spaces in between", function() {
          var acceptedMimeTypes;

          acceptedMimeTypes = "text/html ,   image/jpeg, application/json";
          Dropzone.isValidMimeType("text/html", acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidMimeType("image/jpeg", acceptedMimeTypes).should.be.ok;
        });
      });
    });
    describe("constructor()", function() {
      it("should throw an exception if the element is invalid", function() {
        return expect(function() {
          return new Dropzone("#invalid-element");
        }).to["throw"]("Invalid dropzone element.");
      });
      it("should throw an exception if assigned twice to the same element", function() {
        var element;

        element = document.createElement("div");
        new Dropzone(element, {
          url: "url"
        });
        return expect(function() {
          return new Dropzone(element, {
            url: "url"
          });
        }).to["throw"]("Dropzone already attached.");
      });
      it("should throw an exception if both acceptParameter and acceptedMimeTypes are specified", function() {
        var element;

        element = document.createElement("div");
        return expect(function() {
          return new Dropzone(element, {
            url: "test",
            acceptParameter: "param",
            acceptedMimeTypes: "types"
          });
        }).to["throw"]("You can't provide both 'acceptParameter' and 'acceptedMimeTypes'. 'acceptParameter' is deprecated.");
      });
      it("should set itself as element.dropzone", function() {
        var dropzone, element;

        element = document.createElement("div");
        dropzone = new Dropzone(element, {
          url: "url"
        });
        return element.dropzone.should.equal(dropzone);
      });
      return describe("options", function() {
        var element, element2;

        element = null;
        element2 = null;
        beforeEach(function() {
          element = document.createElement("div");
          element.id = "test-element";
          element2 = document.createElement("div");
          element2.id = "test-element2";
          return Dropzone.options.testElement = {
            url: "/some/url",
            parallelUploads: 10
          };
        });
        afterEach(function() {
          return delete Dropzone.options.testElement;
        });
        it("should take the options set in Dropzone.options", function() {
          var dropzone;

          dropzone = new Dropzone(element);
          dropzone.options.url.should.equal("/some/url");
          return dropzone.options.parallelUploads.should.equal(10);
        });
        it("should prefer passed options over Dropzone.options", function() {
          var dropzone;

          dropzone = new Dropzone(element, {
            url: "/some/other/url"
          });
          return dropzone.options.url.should.equal("/some/other/url");
        });
        it("should take the default options if nothing set in Dropzone.options", function() {
          var dropzone;

          dropzone = new Dropzone(element2, {
            url: "/some/url"
          });
          return dropzone.options.parallelUploads.should.equal(2);
        });
        describe("options.clickable", function() {
          var clickableElement;

          clickableElement = null;
          beforeEach(function() {
            clickableElement = document.createElement("div");
            clickableElement.className = "some-clickable";
            return document.body.appendChild(clickableElement);
          });
          afterEach(function() {
            return document.body.removeChild(clickableElement);
          });
          it("should use the default element if clickable == true", function() {
            var dropzone;

            dropzone = new Dropzone(element, {
              clickable: true
            });
            return dropzone.clickableElement.should.equal(dropzone.element);
          });
          it("should lookup the element if clickable is a CSS selector", function() {
            var dropzone;

            dropzone = new Dropzone(element, {
              clickable: ".some-clickable"
            });
            return dropzone.clickableElement.should.equal(clickableElement);
          });
          it("should simply use the provided element", function() {
            var dropzone;

            dropzone = new Dropzone(element, {
              clickable: clickableElement
            });
            return dropzone.clickableElement.should.equal(clickableElement);
          });
          return it("should throw an exception if the element is invalid", function() {
            return expect(function() {
              return new Dropzone(element, {
                clickable: ".some-invalid-clickable"
              });
            }).to["throw"]("Invalid `clickable` element provided. Please set it to `true`, a plain HTML element or a valid CSS selector.");
          });
        });
        return it("should call the fallback function if forceFallback == true", function(done) {
          var dropzone;

          return dropzone = new Dropzone(element, {
            url: "/some/other/url",
            forceFallback: true,
            fallback: function() {
              return done();
            }
          });
        });
      });
    });
    describe("init()", function() {
      describe("clickable", function() {
        var dropzone, dropzones, name, _results;

        dropzones = {
          "using acceptParameter": new Dropzone(Dropzone.createElement("<form action=\"/\"></form>"), {
            clickable: true,
            acceptParameter: "audio/*,video/*"
          }),
          "using acceptedMimeTypes": new Dropzone(Dropzone.createElement("<form action=\"/\"></form>"), {
            clickable: true,
            acceptedMimeTypes: "audio/*,video/*"
          })
        };
        it("should not add an accept attribute if no acceptParameter", function() {
          var dropzone;

          dropzone = new Dropzone(Dropzone.createElement("<form action=\"/\"></form>"), {
            clickable: true,
            acceptParameter: null,
            acceptedMimeTypes: null
          });
          return dropzone.hiddenFileInput.hasAttribute("accept").should.be["false"];
        });
        _results = [];
        for (name in dropzones) {
          dropzone = dropzones[name];
          _results.push(describe(name, function() {
            return (function(dropzone) {
              it("should create a hidden file input if clickable", function() {
                dropzone.hiddenFileInput.should.be.ok;
                return dropzone.hiddenFileInput.tagName.should.equal("INPUT");
              });
              it("should use the acceptParameter", function() {
                return dropzone.hiddenFileInput.getAttribute("accept").should.equal("audio/*,video/*");
              });
              return it("should create a new input element when something is selected to reset the input field", function() {
                var event, hiddenFileInput, i, _i, _results1;

                _results1 = [];
                for (i = _i = 0; _i <= 3; i = ++_i) {
                  hiddenFileInput = dropzone.hiddenFileInput;
                  event = document.createEvent("HTMLEvents");
                  event.initEvent("change", true, true);
                  hiddenFileInput.dispatchEvent(event);
                  dropzone.hiddenFileInput.should.not.equal(hiddenFileInput);
                  _results1.push(Dropzone.elementInside(hiddenFileInput, document).should.not.be.ok);
                }
                return _results1;
              });
            })(dropzone);
          }));
        }
        return _results;
      });
      return it("should create a data-dz-message element", function() {
        var dropzone, element;

        element = Dropzone.createElement("<form class=\"dropzone\" action=\"/\"></form>");
        dropzone = new Dropzone(element, {
          clickable: true,
          acceptParameter: null,
          acceptedMimeTypes: null
        });
        return element.querySelector("[data-dz-message]").should.be["instanceof"](Element);
      });
    });
    describe("options", function() {
      var dropzone, element;

      element = null;
      dropzone = null;
      beforeEach(function() {
        element = Dropzone.createElement("<div></div>");
        return dropzone = new Dropzone(element, {
          maxFilesize: 4,
          url: "url",
          acceptedMimeTypes: "audio/*,image/png"
        });
      });
      return describe("file specific", function() {
        var file;

        file = null;
        beforeEach(function() {
          file = {
            name: "test name",
            size: 2 * 1000 * 1000
          };
          return dropzone.options.addedfile.call(dropzone, file);
        });
        describe(".addedFile()", function() {
          return it("should properly create the previewElement", function() {
            file.previewElement.should.be["instanceof"](Element);
            file.previewElement.querySelector("[data-dz-name]").innerHTML.should.eql("test name");
            return file.previewElement.querySelector("[data-dz-size]").innerHTML.should.eql("<strong>2</strong> MB");
          });
        });
        describe(".error()", function() {
          return it("should properly insert the error", function() {
            dropzone.options.error.call(dropzone, file, "test message");
            return file.previewElement.querySelector("[data-dz-errormessage]").innerHTML.should.eql("test message");
          });
        });
        describe(".thumbnail()", function() {
          return it("should properly insert the error", function() {
            var thumbnail, transparentGif;

            transparentGif = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
            dropzone.options.thumbnail.call(dropzone, file, transparentGif);
            thumbnail = file.previewElement.querySelector("[data-dz-thumbnail]");
            thumbnail.src.should.eql(transparentGif);
            return thumbnail.alt.should.eql("test name");
          });
        });
        return describe(".uploadprogress()", function() {
          return it("should properly set the width", function() {
            dropzone.options.uploadprogress.call(dropzone, file, 0);
            file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql("0%");
            dropzone.options.uploadprogress.call(dropzone, file, 80);
            file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql("80%");
            dropzone.options.uploadprogress.call(dropzone, file, 90);
            file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql("90%");
            dropzone.options.uploadprogress.call(dropzone, file, 100);
            return file.previewElement.querySelector("[data-dz-uploadprogress]").style.width.should.eql("100%");
          });
        });
      });
    });
    describe("instance", function() {
      var dropzone, element;

      element = null;
      dropzone = null;
      beforeEach(function() {
        element = Dropzone.createElement("<div></div>");
        document.body.appendChild(element);
        return dropzone = new Dropzone(element, {
          maxFilesize: 4,
          url: "url",
          acceptedMimeTypes: "audio/*,image/png",
          uploadprogress: function() {}
        });
      });
      afterEach(function() {
        return document.body.removeChild(element);
      });
      describe(".accept()", function() {
        it("should pass if the filesize is OK", function() {
          return dropzone.accept({
            size: 2 * 1024 * 1024,
            type: "audio/mp3"
          }, function(err) {
            return expect(err).to.be.undefined;
          });
        });
        it("shouldn't pass if the filesize is too big", function() {
          return dropzone.accept({
            size: 10 * 1024 * 1024,
            type: "audio/mp3"
          }, function(err) {
            return err.should.eql("File is too big (10MB). Max filesize: 4MB.");
          });
        });
        it("should properly accept files which mime types are listed in acceptedMimeTypes", function() {
          dropzone.accept({
            type: "audio/mp3"
          }, function(err) {
            return expect(err).to.be.undefined;
          });
          dropzone.accept({
            type: "image/png"
          }, function(err) {
            return expect(err).to.be.undefined;
          });
          return dropzone.accept({
            type: "audio/wav"
          }, function(err) {
            return expect(err).to.be.undefined;
          });
        });
        return it("should properly reject files when the mime type isn't listed in acceptedMimeTypes", function() {
          return dropzone.accept({
            type: "image/jpeg"
          }, function(err) {
            return err.should.eql("You can't upload files of this type.");
          });
        });
      });
      describe(".filesize()", function() {
        return it("should convert to KiloBytes, etc.. not KibiBytes", function() {
          dropzone.filesize(2 * 1024 * 1024).should.eql("<strong>2.1</strong> MB");
          dropzone.filesize(2 * 1000 * 1000).should.eql("<strong>2</strong> MB");
          dropzone.filesize(2 * 1024 * 1024 * 1024).should.eql("<strong>2.1</strong> GB");
          return dropzone.filesize(2 * 1000 * 1000 * 1000).should.eql("<strong>2</strong> GB");
        });
      });
      return describe("events", function() {
        return describe("progress updates", function() {
          return it("should properly emit a totaluploadprogress event", function() {
            var totalProgressExpectation;

            dropzone.files = [
              {
                size: 1990,
                upload: {
                  progress: 20,
                  total: 2000,
                  bytesSent: 400
                }
              }, {
                size: 1990,
                upload: {
                  progress: 10,
                  total: 2000,
                  bytesSent: 200
                }
              }
            ];
            totalProgressExpectation = 15;
            dropzone.on("totaluploadprogress", function(progress) {
              return progress.should.eql(totalProgressExpectation);
            });
            dropzone.emit("uploadprogress", {});
            totalProgressExpectation = 97.5;
            dropzone.files[0].upload.bytesSent = 2000;
            dropzone.files[1].upload.bytesSent = 1900;
            dropzone.on("totaluploadprogress", function(progress) {
              return progress.should.eql(totalProgressExpectation);
            });
            dropzone.emit("uploadprogress", {});
            totalProgressExpectation = 100;
            dropzone.files[0].upload.bytesSent = 2000;
            dropzone.files[1].upload.bytesSent = 2000;
            dropzone.on("totaluploadprogress", function(progress) {
              return progress.should.eql(totalProgressExpectation);
            });
            return dropzone.emit("uploadprogress", {});
          });
        });
      });
    });
    return describe("helper function", function() {
      return describe("getExistingFallback()", function() {
        var dropzone, element;

        element = null;
        dropzone = null;
        beforeEach(function() {
          element = Dropzone.createElement("<div></div>");
          return dropzone = new Dropzone(element, {
            url: "url"
          });
        });
        it("should return undefined if no fallback", function() {
          return expect(dropzone.getExistingFallback()).to.equal(void 0);
        });
        it("should only return the fallback element if it contains exactly fallback", function() {
          element.appendChild(Dropzone.createElement("<form class=\"fallbacks\"></form>"));
          element.appendChild(Dropzone.createElement("<form class=\"sfallback\"></form>"));
          return expect(dropzone.getExistingFallback()).to.equal(void 0);
        });
        it("should return divs as fallback", function() {
          var fallback;

          fallback = Dropzone.createElement("<form class=\" abc fallback test \"></form>");
          element.appendChild(fallback);
          return fallback.should.equal(dropzone.getExistingFallback());
        });
        return it("should return forms as fallback", function() {
          var fallback;

          fallback = Dropzone.createElement("<div class=\" abc fallback test \"></div>");
          element.appendChild(fallback);
          return fallback.should.equal(dropzone.getExistingFallback());
        });
      });
    });
  });

}).call(this);
