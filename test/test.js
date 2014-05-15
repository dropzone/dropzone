(function() {
  chai.should();

  describe("Dropzone", function() {
    var getMockFile, xhr;
    getMockFile = function() {
      return {
        status: Dropzone.ADDED,
        accepted: true,
        name: "test file name",
        size: 123456,
        type: "text/html"
      };
    };
    xhr = null;
    beforeEach(function() {
      return xhr = sinon.useFakeXMLHttpRequest();
    });
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
        it("should return undefined if no options set", function() {
          element.id = "test-element2";
          return expect(Dropzone.optionsForElement(element)).to.equal(void 0);
        });
        it("should return undefined and not throw if it's a form with an input element of the name 'id'", function() {
          element = Dropzone.createElement("<form><input name=\"id\" /</form>");
          return expect(Dropzone.optionsForElement(element)).to.equal(void 0);
        });
        return it("should ignore input fields with the name='id'", function() {
          element = Dropzone.createElement("<form id=\"test-element\"><input type=\"hidden\" name=\"id\" value=\"fooo\" /></form>");
          return Dropzone.optionsForElement(element).should.equal(testOptions);
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
        it("should throw an exception if no dropzone attached", function() {
          return expect(function() {
            return Dropzone.forElement(document.createElement("div"));
          }).to["throw"]("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
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
          it("should create dropzones even if Dropzone.autoDiscover == false", function() {
            Dropzone.autoDiscover = false;
            Dropzone.discover();
            return expect(element3.dropzone).to.be.ok;
          });
          return it("should not automatically be called if Dropzone.autoDiscover == false", function() {
            Dropzone.autoDiscover = false;
            Dropzone.discover = function() {
              return expect(false).to.be.ok;
            };
            return Dropzone._autoDiscoverFunction();
          });
        });
      });
      describe("Dropzone.isValidFile()", function() {
        it("should return true if called without acceptedFiles", function() {
          return Dropzone.isValidFile({
            type: "some/type"
          }, null).should.be.ok;
        });
        it("should properly validate if called with concrete mime types", function() {
          var acceptedMimeTypes;
          acceptedMimeTypes = "text/html,image/jpeg,application/json";
          Dropzone.isValidFile({
            type: "text/html"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "image/jpeg"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "application/json"
          }, acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidFile({
            type: "image/bmp"
          }, acceptedMimeTypes).should.not.be.ok;
        });
        it("should properly validate if called with base mime types", function() {
          var acceptedMimeTypes;
          acceptedMimeTypes = "text/*,image/*,application/*";
          Dropzone.isValidFile({
            type: "text/html"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "image/jpeg"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "application/json"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "image/bmp"
          }, acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidFile({
            type: "some/type"
          }, acceptedMimeTypes).should.not.be.ok;
        });
        it("should properly validate if called with mixed mime types", function() {
          var acceptedMimeTypes;
          acceptedMimeTypes = "text/*,image/jpeg,application/*";
          Dropzone.isValidFile({
            type: "text/html"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "image/jpeg"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            type: "image/bmp"
          }, acceptedMimeTypes).should.not.be.ok;
          Dropzone.isValidFile({
            type: "application/json"
          }, acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidFile({
            type: "some/type"
          }, acceptedMimeTypes).should.not.be.ok;
        });
        it("should properly validate even with spaces in between", function() {
          var acceptedMimeTypes;
          acceptedMimeTypes = "text/html ,   image/jpeg, application/json";
          Dropzone.isValidFile({
            type: "text/html"
          }, acceptedMimeTypes).should.be.ok;
          return Dropzone.isValidFile({
            type: "image/jpeg"
          }, acceptedMimeTypes).should.be.ok;
        });
        return it("should properly validate extensions", function() {
          var acceptedMimeTypes;
          acceptedMimeTypes = "text/html ,    image/jpeg, .pdf  ,.png";
          Dropzone.isValidFile({
            name: "somxsfsd",
            type: "text/html"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            name: "somesdfsdf",
            type: "image/jpeg"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            name: "somesdfadfadf",
            type: "application/json"
          }, acceptedMimeTypes).should.not.be.ok;
          Dropzone.isValidFile({
            name: "some-file file.pdf",
            type: "random/type"
          }, acceptedMimeTypes).should.be.ok;
          Dropzone.isValidFile({
            name: "some-file.pdf file.gif",
            type: "random/type"
          }, acceptedMimeTypes).should.not.be.ok;
          return Dropzone.isValidFile({
            name: "some-file file.png",
            type: "random/type"
          }, acceptedMimeTypes).should.be.ok;
        });
      });
      return describe("Dropzone.confirm", function() {
        beforeEach(function() {
          return sinon.stub(window, "confirm");
        });
        afterEach(function() {
          return window.confirm.restore();
        });
        it("should forward to window.confirm and call the callbacks accordingly", function() {
          var accepted, rejected;
          accepted = rejected = false;
          window.confirm.returns(true);
          Dropzone.confirm("test question", (function() {
            return accepted = true;
          }), (function() {
            return rejected = true;
          }));
          window.confirm.args[0][0].should.equal("test question");
          accepted.should.equal(true);
          rejected.should.equal(false);
          accepted = rejected = false;
          window.confirm.returns(false);
          Dropzone.confirm("test question 2", (function() {
            return accepted = true;
          }), (function() {
            return rejected = true;
          }));
          window.confirm.args[1][0].should.equal("test question 2");
          accepted.should.equal(false);
          return rejected.should.equal(true);
        });
        return it("should not error if rejected is not provided", function() {
          var accepted, rejected;
          accepted = rejected = false;
          window.confirm.returns(false);
          Dropzone.confirm("test question", (function() {
            return accepted = true;
          }));
          window.confirm.args[0][0].should.equal("test question");
          accepted.should.equal(false);
          return rejected.should.equal(false);
        });
      });
    });
    describe("Dropzone.getElement() / getElements()", function() {
      var tmpElements;
      tmpElements = [];
      beforeEach(function() {
        tmpElements = [];
        tmpElements.push(Dropzone.createElement("<div class=\"tmptest\"></div>"));
        tmpElements.push(Dropzone.createElement("<div id=\"tmptest1\" class=\"random\"></div>"));
        tmpElements.push(Dropzone.createElement("<div class=\"random div\"></div>"));
        return tmpElements.forEach(function(el) {
          return document.body.appendChild(el);
        });
      });
      afterEach(function() {
        return tmpElements.forEach(function(el) {
          return document.body.removeChild(el);
        });
      });
      describe(".getElement()", function() {
        it("should accept a string", function() {
          var el;
          el = Dropzone.getElement(".tmptest");
          el.should.equal(tmpElements[0]);
          el = Dropzone.getElement("#tmptest1");
          return el.should.equal(tmpElements[1]);
        });
        it("should accept a node", function() {
          var el;
          el = Dropzone.getElement(tmpElements[2]);
          return el.should.equal(tmpElements[2]);
        });
        return it("should fail if invalid selector", function() {
          var errorMessage;
          errorMessage = "Invalid `clickable` option provided. Please provide a CSS selector or a plain HTML element.";
          expect(function() {
            return Dropzone.getElement("lblasdlfsfl", "clickable");
          }).to["throw"](errorMessage);
          expect(function() {
            return Dropzone.getElement({
              "lblasdlfsfl": "lblasdlfsfl"
            }, "clickable");
          }).to["throw"](errorMessage);
          return expect(function() {
            return Dropzone.getElement(["lblasdlfsfl"], "clickable");
          }).to["throw"](errorMessage);
        });
      });
      return describe(".getElements()", function() {
        it("should accept a list of strings", function() {
          var els;
          els = Dropzone.getElements([".tmptest", "#tmptest1"]);
          return els.should.eql([tmpElements[0], tmpElements[1]]);
        });
        it("should accept a list of nodes", function() {
          var els;
          els = Dropzone.getElements([tmpElements[0], tmpElements[2]]);
          return els.should.eql([tmpElements[0], tmpElements[2]]);
        });
        it("should accept a mixed list", function() {
          var els;
          els = Dropzone.getElements(["#tmptest1", tmpElements[2]]);
          return els.should.eql([tmpElements[1], tmpElements[2]]);
        });
        it("should accept a string selector", function() {
          var els;
          els = Dropzone.getElements(".random");
          return els.should.eql([tmpElements[1], tmpElements[2]]);
        });
        it("should accept a single node", function() {
          var els;
          els = Dropzone.getElements(tmpElements[1]);
          return els.should.eql([tmpElements[1]]);
        });
        return it("should fail if invalid selector", function() {
          var errorMessage;
          errorMessage = "Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those.";
          expect(function() {
            return Dropzone.getElements("lblasdlfsfl", "clickable");
          }).to["throw"](errorMessage);
          return expect(function() {
            return Dropzone.getElements(["lblasdlfsfl"], "clickable");
          }).to["throw"](errorMessage);
        });
      });
    });
    describe("constructor()", function() {
      var dropzone;
      dropzone = null;
      afterEach(function() {
        if (dropzone != null) {
          return dropzone.destroy();
        }
      });
      it("should throw an exception if the element is invalid", function() {
        return expect(function() {
          return dropzone = new Dropzone("#invalid-element");
        }).to["throw"]("Invalid dropzone element.");
      });
      it("should throw an exception if assigned twice to the same element", function() {
        var element;
        element = document.createElement("div");
        dropzone = new Dropzone(element, {
          url: "url"
        });
        return expect(function() {
          return new Dropzone(element, {
            url: "url"
          });
        }).to["throw"]("Dropzone already attached.");
      });
      it("should throw an exception if both acceptedFiles and acceptedMimeTypes are specified", function() {
        var element;
        element = document.createElement("div");
        return expect(function() {
          return dropzone = new Dropzone(element, {
            url: "test",
            acceptedFiles: "param",
            acceptedMimeTypes: "types"
          });
        }).to["throw"]("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      });
      it("should set itself as element.dropzone", function() {
        var element;
        element = document.createElement("div");
        dropzone = new Dropzone(element, {
          url: "url"
        });
        return element.dropzone.should.equal(dropzone);
      });
      it("should add itself to Dropzone.instances", function() {
        var element;
        element = document.createElement("div");
        dropzone = new Dropzone(element, {
          url: "url"
        });
        return Dropzone.instances[Dropzone.instances.length - 1].should.equal(dropzone);
      });
      it("should use the action attribute not the element with the name action", function() {
        var element;
        element = Dropzone.createElement("<form action=\"real-action\"><input type=\"hidden\" name=\"action\" value=\"wrong-action\" /></form>");
        dropzone = new Dropzone(element);
        return dropzone.options.url.should.equal("real-action");
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
          dropzone = new Dropzone(element);
          dropzone.options.url.should.equal("/some/url");
          return dropzone.options.parallelUploads.should.equal(10);
        });
        it("should prefer passed options over Dropzone.options", function() {
          dropzone = new Dropzone(element, {
            url: "/some/other/url"
          });
          return dropzone.options.url.should.equal("/some/other/url");
        });
        it("should take the default options if nothing set in Dropzone.options", function() {
          dropzone = new Dropzone(element2, {
            url: "/some/url"
          });
          return dropzone.options.parallelUploads.should.equal(2);
        });
        it("should call the fallback function if forceFallback == true", function(done) {
          return dropzone = new Dropzone(element, {
            url: "/some/other/url",
            forceFallback: true,
            fallback: function() {
              return done();
            }
          });
        });
        it("should set acceptedFiles if deprecated acceptedMimetypes option has been passed", function() {
          dropzone = new Dropzone(element, {
            url: "/some/other/url",
            acceptedMimeTypes: "my/type"
          });
          return dropzone.options.acceptedFiles.should.equal("my/type");
        });
        return describe("options.clickable", function() {
          var clickableElement;
          clickableElement = null;
          dropzone = null;
          beforeEach(function() {
            clickableElement = document.createElement("div");
            clickableElement.className = "some-clickable";
            return document.body.appendChild(clickableElement);
          });
          afterEach(function() {
            document.body.removeChild(clickableElement);
            if (dropzone != null) {
              return dropzone.destroy;
            }
          });
          it("should use the default element if clickable == true", function() {
            dropzone = new Dropzone(element, {
              clickable: true
            });
            return dropzone.clickableElements.should.eql([dropzone.element]);
          });
          it("should lookup the element if clickable is a CSS selector", function() {
            dropzone = new Dropzone(element, {
              clickable: ".some-clickable"
            });
            return dropzone.clickableElements.should.eql([clickableElement]);
          });
          it("should simply use the provided element", function() {
            dropzone = new Dropzone(element, {
              clickable: clickableElement
            });
            return dropzone.clickableElements.should.eql([clickableElement]);
          });
          it("should accept multiple clickable elements", function() {
            dropzone = new Dropzone(element, {
              clickable: [document.body, ".some-clickable"]
            });
            return dropzone.clickableElements.should.eql([document.body, clickableElement]);
          });
          return it("should throw an exception if the element is invalid", function() {
            return expect(function() {
              return dropzone = new Dropzone(element, {
                clickable: ".some-invalid-clickable"
              });
            }).to["throw"]("Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
          });
        });
      });
    });
    describe("init()", function() {
      describe("clickable", function() {
        var dropzone, dropzones, name, _results;
        dropzones = {
          "using acceptedFiles": new Dropzone(Dropzone.createElement("<form action=\"/\"></form>"), {
            clickable: true,
            acceptedFiles: "audio/*,video/*"
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
      it("should create a .dz-message element", function() {
        var dropzone, element;
        element = Dropzone.createElement("<form class=\"dropzone\" action=\"/\"></form>");
        dropzone = new Dropzone(element, {
          clickable: true,
          acceptParameter: null,
          acceptedMimeTypes: null
        });
        return element.querySelector(".dz-message").should.be["instanceof"](Element);
      });
      return it("should not create a .dz-message element if there already is one", function() {
        var dropzone, element, msg;
        element = Dropzone.createElement("<form class=\"dropzone\" action=\"/\"></form>");
        msg = Dropzone.createElement("<div class=\"dz-message\">TEST</div>");
        element.appendChild(msg);
        dropzone = new Dropzone(element, {
          clickable: true,
          acceptParameter: null,
          acceptedMimeTypes: null
        });
        element.querySelector(".dz-message").should.equal(msg);
        return element.querySelectorAll(".dz-message").length.should.equal(1);
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
          acceptedMimeTypes: "audio/*,image/png",
          maxFiles: 3
        });
      });
      return describe("file specific", function() {
        var file;
        file = null;
        beforeEach(function() {
          file = {
            name: "test name",
            size: 2 * 1024 * 1024,
            width: 200,
            height: 100
          };
          return dropzone.options.addedfile.call(dropzone, file);
        });
        describe(".addedFile()", function() {
          return it("should properly create the previewElement", function() {
            file.previewElement.should.be["instanceof"](Element);
            file.previewElement.querySelector("[data-dz-name]").innerHTML.should.eql("test name");
            return file.previewElement.querySelector("[data-dz-size]").innerHTML.should.eql("<strong>2</strong> MiB");
          });
        });
        describe(".error()", function() {
          it("should properly insert the error", function() {
            dropzone.options.error.call(dropzone, file, "test message");
            return file.previewElement.querySelector("[data-dz-errormessage]").innerHTML.should.eql("test message");
          });
          return it("should properly insert the error when provided with an object containing the error", function() {
            dropzone.options.error.call(dropzone, file, {
              error: "test message"
            });
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
        describe(".uploadprogress()", function() {
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
        return describe(".resize()", function() {
          describe("with default thumbnail settings", function() {
            return it("should properly return target dimensions", function() {
              var info;
              info = dropzone.options.resize.call(dropzone, file);
              info.optWidth.should.eql(100);
              return info.optHeight.should.eql(100);
            });
          });
          return describe("with null thumbnail settings", function() {
            return it("should properly return target dimensions", function() {
              var i, info, setting, testSettings, _i, _len, _results;
              testSettings = [[null, null], [null, 150], [150, null]];
              _results = [];
              for (i = _i = 0, _len = testSettings.length; _i < _len; i = ++_i) {
                setting = testSettings[i];
                dropzone.options.thumbnailWidth = setting[0];
                dropzone.options.thumbnailHeight = setting[1];
                info = dropzone.options.resize.call(dropzone, file);
                if (i === 0) {
                  info.optWidth.should.eql(200);
                  info.optHeight.should.eql(100);
                }
                if (i === 1) {
                  info.optWidth.should.eql(300);
                  info.optHeight.should.eql(150);
                }
                if (i === 2) {
                  info.optWidth.should.eql(150);
                  _results.push(info.optHeight.should.eql(75));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            });
          });
        });
      });
    });
    describe("instance", function() {
      var dropzone, element, requests;
      element = null;
      dropzone = null;
      requests = null;
      beforeEach(function() {
        requests = [];
        xhr.onCreate = function(xhr) {
          return requests.push(xhr);
        };
        element = Dropzone.createElement("<div></div>");
        document.body.appendChild(element);
        return dropzone = new Dropzone(element, {
          maxFilesize: 4,
          maxFiles: 100,
          url: "url",
          acceptedMimeTypes: "audio/*,image/png",
          uploadprogress: function() {}
        });
      });
      afterEach(function() {
        document.body.removeChild(element);
        dropzone.destroy();
        return xhr.restore();
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
            return err.should.eql("File is too big (10MiB). Max filesize: 4MiB.");
          });
        });
        it("should properly accept files which mime types are listed in acceptedFiles", function() {
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
        it("should properly reject files when the mime type isn't listed in acceptedFiles", function() {
          return dropzone.accept({
            type: "image/jpeg"
          }, function(err) {
            return err.should.eql("You can't upload files of this type.");
          });
        });
        it("should fail if maxFiles has been exceeded and call the event maxfilesexceeded", function() {
          var called, file;
          sinon.stub(dropzone, "getAcceptedFiles");
          file = {
            type: "audio/mp3"
          };
          dropzone.getAcceptedFiles.returns({
            length: 99
          });
          dropzone.options.dictMaxFilesExceeded = "You can only upload {{maxFiles}} files.";
          called = false;
          dropzone.on("maxfilesexceeded", function(lfile) {
            lfile.should.equal(file);
            return called = true;
          });
          dropzone.accept(file, function(err) {
            return expect(err).to.be.undefined;
          });
          called.should.not.be.ok;
          dropzone.getAcceptedFiles.returns({
            length: 100
          });
          dropzone.accept(file, function(err) {
            return expect(err).to.equal("You can only upload 100 files.");
          });
          called.should.be.ok;
          return dropzone.getAcceptedFiles.restore();
        });
        return it("should properly handle if maxFiles is 0", function() {
          var called, file;
          file = {
            type: "audio/mp3"
          };
          dropzone.options.maxFiles = 0;
          called = false;
          dropzone.on("maxfilesexceeded", function(lfile) {
            lfile.should.equal(file);
            return called = true;
          });
          dropzone.accept(file, function(err) {
            return expect(err).to.equal("You can not upload any more files.");
          });
          return called.should.be.ok;
        });
      });
      describe(".removeFile()", function() {
        return it("should abort uploading if file is currently being uploaded", function(done) {
          var mockFile;
          mockFile = getMockFile();
          dropzone.uploadFile = function(file) {};
          dropzone.accept = function(file, done) {
            return done();
          };
          sinon.stub(dropzone, "cancelUpload");
          dropzone.addFile(mockFile);
          return setTimeout(function() {
            mockFile.status.should.equal(Dropzone.UPLOADING);
            dropzone.getUploadingFiles()[0].should.equal(mockFile);
            dropzone.cancelUpload.callCount.should.equal(0);
            dropzone.removeFile(mockFile);
            dropzone.cancelUpload.callCount.should.equal(1);
            return done();
          }, 10);
        });
      });
      describe(".cancelUpload()", function() {
        it("should properly cancel upload if file currently uploading", function(done) {
          var mockFile;
          mockFile = getMockFile();
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.addFile(mockFile);
          return setTimeout(function() {
            mockFile.status.should.equal(Dropzone.UPLOADING);
            dropzone.getUploadingFiles()[0].should.equal(mockFile);
            dropzone.cancelUpload(mockFile);
            mockFile.status.should.equal(Dropzone.CANCELED);
            dropzone.getUploadingFiles().length.should.equal(0);
            dropzone.getQueuedFiles().length.should.equal(0);
            return done();
          }, 10);
        });
        it("should properly cancel the upload if file is not yet uploading", function() {
          var mockFile;
          mockFile = getMockFile();
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.options.parallelUploads = 0;
          dropzone.addFile(mockFile);
          mockFile.status.should.equal(Dropzone.QUEUED);
          dropzone.getQueuedFiles()[0].should.equal(mockFile);
          dropzone.cancelUpload(mockFile);
          mockFile.status.should.equal(Dropzone.CANCELED);
          dropzone.getQueuedFiles().length.should.equal(0);
          return dropzone.getUploadingFiles().length.should.equal(0);
        });
        it("should call processQueue()", function(done) {
          var mockFile;
          mockFile = getMockFile();
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.options.parallelUploads = 0;
          sinon.spy(dropzone, "processQueue");
          dropzone.addFile(mockFile);
          return setTimeout(function() {
            dropzone.processQueue.callCount.should.equal(1);
            dropzone.cancelUpload(mockFile);
            dropzone.processQueue.callCount.should.equal(2);
            return done();
          }, 10);
        });
        return it("should properly cancel all files with the same XHR if uploadMultiple is true", function(done) {
          var mock1, mock2, mock3;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.options.uploadMultiple = true;
          dropzone.options.parallelUploads = 3;
          sinon.spy(dropzone, "processFiles");
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          return setTimeout(function() {
            var _ref;
            dropzone.processFiles.callCount.should.equal(1);
            sinon.spy(mock1.xhr, "abort");
            dropzone.cancelUpload(mock1);
            expect((mock1.xhr === (_ref = mock2.xhr) && _ref === mock3.xhr)).to.be.ok;
            mock1.status.should.equal(Dropzone.CANCELED);
            mock2.status.should.equal(Dropzone.CANCELED);
            mock3.status.should.equal(Dropzone.CANCELED);
            mock1.xhr.abort.callCount.should.equal(1);
            return done();
          }, 10);
        });
      });
      describe(".disable()", function() {
        return it("should properly cancel all pending uploads", function(done) {
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.options.parallelUploads = 1;
          dropzone.addFile(getMockFile());
          dropzone.addFile(getMockFile());
          return setTimeout(function() {
            dropzone.getUploadingFiles().length.should.equal(1);
            dropzone.getQueuedFiles().length.should.equal(1);
            dropzone.files.length.should.equal(2);
            sinon.spy(requests[0], "abort");
            requests[0].abort.callCount.should.equal(0);
            dropzone.disable();
            requests[0].abort.callCount.should.equal(1);
            dropzone.getUploadingFiles().length.should.equal(0);
            dropzone.getQueuedFiles().length.should.equal(0);
            dropzone.files.length.should.equal(2);
            dropzone.files[0].status.should.equal(Dropzone.CANCELED);
            dropzone.files[1].status.should.equal(Dropzone.CANCELED);
            return done();
          }, 10);
        });
      });
      describe(".destroy()", function() {
        it("should properly cancel all pending uploads and remove all file references", function(done) {
          dropzone.accept = function(file, done) {
            return done();
          };
          dropzone.options.parallelUploads = 1;
          dropzone.addFile(getMockFile());
          dropzone.addFile(getMockFile());
          return setTimeout(function() {
            dropzone.getUploadingFiles().length.should.equal(1);
            dropzone.getQueuedFiles().length.should.equal(1);
            dropzone.files.length.should.equal(2);
            sinon.spy(dropzone, "disable");
            dropzone.destroy();
            dropzone.disable.callCount.should.equal(1);
            element.should.not.have.property("dropzone");
            return done();
          }, 10);
        });
        it("should be able to create instance of dropzone on the same element after destroy", function() {
          dropzone.destroy();
          return (function() {
            return new Dropzone(element, {
              maxFilesize: 4,
              url: "url",
              acceptedMimeTypes: "audio/*,image/png",
              uploadprogress: function() {}
            });
          }).should.not["throw"](Error);
        });
        return it("should remove itself from Dropzone.instances", function() {
          (Dropzone.instances.indexOf(dropzone) !== -1).should.be.ok;
          dropzone.destroy();
          return (Dropzone.instances.indexOf(dropzone) === -1).should.be.ok;
        });
      });
      describe(".filesize()", function() {
        return it("should convert to KiloBytes, etc.. not KibiBytes", function() {
          dropzone.filesize(2 * 1024 * 1024).should.eql("<strong>2</strong> MiB");
          dropzone.filesize(2 * 1000 * 1000 * 1000).should.eql("<strong>1.9</strong> GiB");
          return dropzone.filesize(2 * 1024 * 1024 * 1024).should.eql("<strong>2</strong> GiB");
        });
      });
      describe("._updateMaxFilesReachedClass()", function() {
        it("should properly add the dz-max-files-reached class", function() {
          dropzone.getAcceptedFiles = function() {
            return {
              length: 10
            };
          };
          dropzone.options.maxFiles = 10;
          dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok;
          dropzone._updateMaxFilesReachedClass();
          return dropzone.element.classList.contains("dz-max-files-reached").should.be.ok;
        });
        it("should fire the 'maxfilesreached' event when appropriate", function() {
          var spy;
          spy = sinon.spy();
          dropzone.on("maxfilesreached", function() {
            return spy();
          });
          dropzone.getAcceptedFiles = function() {
            return {
              length: 9
            };
          };
          dropzone.options.maxFiles = 10;
          dropzone._updateMaxFilesReachedClass();
          spy.should.not.have.been.called;
          dropzone.getAcceptedFiles = function() {
            return {
              length: 10
            };
          };
          dropzone._updateMaxFilesReachedClass();
          spy.should.have.been.called;
          dropzone.getAcceptedFiles = function() {
            return {
              length: 11
            };
          };
          dropzone._updateMaxFilesReachedClass();
          return spy.should.have.been.calledOnce;
        });
        return it("should properly remove the dz-max-files-reached class", function() {
          dropzone.getAcceptedFiles = function() {
            return {
              length: 10
            };
          };
          dropzone.options.maxFiles = 10;
          dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok;
          dropzone._updateMaxFilesReachedClass();
          dropzone.element.classList.contains("dz-max-files-reached").should.be.ok;
          dropzone.getAcceptedFiles = function() {
            return {
              length: 9
            };
          };
          dropzone._updateMaxFilesReachedClass();
          return dropzone.element.classList.contains("dz-max-files-reached").should.not.be.ok;
        });
      });
      return describe("events", function() {
        return describe("progress updates", function() {
          return it("should properly emit a totaluploadprogress event", function(done) {
            var totalProgressExpectation, _called;
            dropzone.files = [
              {
                size: 1990,
                accepted: true,
                status: Dropzone.UPLOADING,
                upload: {
                  progress: 20,
                  total: 2000,
                  bytesSent: 400
                }
              }, {
                size: 1990,
                accepted: true,
                status: Dropzone.UPLOADING,
                upload: {
                  progress: 10,
                  total: 2000,
                  bytesSent: 200
                }
              }
            ];
            _called = 0;
            dropzone.on("totaluploadprogress", function(progress) {
              progress.should.equal(totalProgressExpectation);
              if (++_called === 3) {
                return done();
              }
            });
            totalProgressExpectation = 15;
            dropzone.emit("uploadprogress", {});
            totalProgressExpectation = 97.5;
            dropzone.files[0].upload.bytesSent = 2000;
            dropzone.files[1].upload.bytesSent = 1900;
            dropzone.emit("uploadprogress", {});
            totalProgressExpectation = 100;
            dropzone.files[0].upload.bytesSent = 2000;
            dropzone.files[1].upload.bytesSent = 2000;
            dropzone.emit("uploadprogress", {});
            dropzone.files[0].status = Dropzone.CANCELED;
            return dropzone.files[1].status = Dropzone.CANCELED;
          });
        });
      });
    });
    describe("helper function", function() {
      var dropzone, element;
      element = null;
      dropzone = null;
      beforeEach(function() {
        element = Dropzone.createElement("<div></div>");
        return dropzone = new Dropzone(element, {
          url: "url"
        });
      });
      describe("getExistingFallback()", function() {
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
      describe("getFallbackForm()", function() {
        it("should use the paramName without [0] if uploadMultiple is false", function() {
          var fallback, fileInput;
          dropzone.options.uploadMultiple = false;
          dropzone.options.paramName = "myFile";
          fallback = dropzone.getFallbackForm();
          fileInput = fallback.querySelector("input[type=file]");
          return fileInput.name.should.equal("myFile");
        });
        return it("should properly add [0] to the file name if uploadMultiple is true", function() {
          var fallback, fileInput;
          dropzone.options.uploadMultiple = true;
          dropzone.options.paramName = "myFile";
          fallback = dropzone.getFallbackForm();
          fileInput = fallback.querySelector("input[type=file]");
          return fileInput.name.should.equal("myFile[0]");
        });
      });
      describe("getAcceptedFiles() / getRejectedFiles()", function() {
        var mock1, mock2, mock3, mock4;
        mock1 = mock2 = mock3 = mock4 = null;
        beforeEach(function() {
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock4 = getMockFile();
          dropzone.options.accept = function(file, done) {
            if (file === mock1 || file === mock3) {
              return done();
            } else {
              return done("error");
            }
          };
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          return dropzone.addFile(mock4);
        });
        it("getAcceptedFiles() should only return accepted files", function() {
          return dropzone.getAcceptedFiles().should.eql([mock1, mock3]);
        });
        return it("getRejectedFiles() should only return rejected files", function() {
          return dropzone.getRejectedFiles().should.eql([mock2, mock4]);
        });
      });
      describe("getQueuedFiles()", function() {
        return it("should return all files with the status Dropzone.QUEUED", function() {
          var mock1, mock2, mock3, mock4;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock4 = getMockFile();
          dropzone.options.accept = function(file, done) {
            return file.done = done;
          };
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          dropzone.addFile(mock4);
          dropzone.getQueuedFiles().should.eql([]);
          mock1.done();
          mock3.done();
          dropzone.getQueuedFiles().should.eql([mock1, mock3]);
          mock1.status.should.equal(Dropzone.QUEUED);
          mock3.status.should.equal(Dropzone.QUEUED);
          mock2.status.should.equal(Dropzone.ADDED);
          return mock4.status.should.equal(Dropzone.ADDED);
        });
      });
      describe("getUploadingFiles()", function() {
        return it("should return all files with the status Dropzone.UPLOADING", function(done) {
          var mock1, mock2, mock3, mock4;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock4 = getMockFile();
          dropzone.options.accept = function(file, _done) {
            return file.done = _done;
          };
          dropzone.uploadFile = function() {};
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          dropzone.addFile(mock4);
          dropzone.getUploadingFiles().should.eql([]);
          mock1.done();
          mock3.done();
          return setTimeout((function() {
            dropzone.getUploadingFiles().should.eql([mock1, mock3]);
            mock1.status.should.equal(Dropzone.UPLOADING);
            mock3.status.should.equal(Dropzone.UPLOADING);
            mock2.status.should.equal(Dropzone.ADDED);
            mock4.status.should.equal(Dropzone.ADDED);
            return done();
          }), 10);
        });
      });
      describe("getActiveFiles()", function() {
        return it("should return all files with the status Dropzone.UPLOADING or Dropzone.QUEUED", function(done) {
          var mock1, mock2, mock3, mock4;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock4 = getMockFile();
          dropzone.options.accept = function(file, _done) {
            return file.done = _done;
          };
          dropzone.uploadFile = function() {};
          dropzone.options.parallelUploads = 2;
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          dropzone.addFile(mock4);
          dropzone.getActiveFiles().should.eql([]);
          mock1.done();
          mock3.done();
          mock4.done();
          return setTimeout((function() {
            dropzone.getActiveFiles().should.eql([mock1, mock3, mock4]);
            mock1.status.should.equal(Dropzone.UPLOADING);
            mock3.status.should.equal(Dropzone.UPLOADING);
            mock2.status.should.equal(Dropzone.ADDED);
            mock4.status.should.equal(Dropzone.QUEUED);
            return done();
          }), 10);
        });
      });
      return describe("getFilesWithStatus()", function() {
        return it("should return all files with provided status", function() {
          var mock1, mock2, mock3, mock4;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock4 = getMockFile();
          dropzone.options.accept = function(file, _done) {
            return file.done = _done;
          };
          dropzone.uploadFile = function() {};
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          dropzone.addFile(mock3);
          dropzone.addFile(mock4);
          dropzone.getFilesWithStatus(Dropzone.ADDED).should.eql([mock1, mock2, mock3, mock4]);
          mock1.status = Dropzone.UPLOADING;
          mock3.status = Dropzone.QUEUED;
          mock4.status = Dropzone.QUEUED;
          dropzone.getFilesWithStatus(Dropzone.ADDED).should.eql([mock2]);
          dropzone.getFilesWithStatus(Dropzone.UPLOADING).should.eql([mock1]);
          return dropzone.getFilesWithStatus(Dropzone.QUEUED).should.eql([mock3, mock4]);
        });
      });
    });
    return describe("file handling", function() {
      var dropzone, mockFile;
      mockFile = null;
      dropzone = null;
      beforeEach(function() {
        var element;
        mockFile = getMockFile();
        element = Dropzone.createElement("<div></div>");
        return dropzone = new Dropzone(element, {
          url: "/the/url"
        });
      });
      afterEach(function() {
        return dropzone.destroy();
      });
      describe("addFile()", function() {
        it("should properly set the status of the file", function() {
          var doneFunction;
          doneFunction = null;
          dropzone.accept = function(file, done) {
            return doneFunction = done;
          };
          dropzone.processFile = function() {};
          dropzone.uploadFile = function() {};
          dropzone.addFile(mockFile);
          mockFile.status.should.eql(Dropzone.ADDED);
          doneFunction();
          mockFile.status.should.eql(Dropzone.QUEUED);
          mockFile = getMockFile();
          dropzone.addFile(mockFile);
          mockFile.status.should.eql(Dropzone.ADDED);
          doneFunction("error");
          return mockFile.status.should.eql(Dropzone.ERROR);
        });
        it("should properly set the status of the file if autoProcessQueue is false and not call processQueue", function(done) {
          var doneFunction;
          doneFunction = null;
          dropzone.options.autoProcessQueue = false;
          dropzone.accept = function(file, done) {
            return doneFunction = done;
          };
          dropzone.processFile = function() {};
          dropzone.uploadFile = function() {};
          dropzone.addFile(mockFile);
          sinon.stub(dropzone, "processQueue");
          mockFile.status.should.eql(Dropzone.ADDED);
          doneFunction();
          mockFile.status.should.eql(Dropzone.QUEUED);
          dropzone.processQueue.callCount.should.equal(0);
          return setTimeout((function() {
            dropzone.processQueue.callCount.should.equal(0);
            return done();
          }), 10);
        });
        it("should not add the file to the queue if autoQueue is false", function() {
          var doneFunction;
          doneFunction = null;
          dropzone.options.autoQueue = false;
          dropzone.accept = function(file, done) {
            return doneFunction = done;
          };
          dropzone.processFile = function() {};
          dropzone.uploadFile = function() {};
          dropzone.addFile(mockFile);
          mockFile.status.should.eql(Dropzone.ADDED);
          doneFunction();
          return mockFile.status.should.eql(Dropzone.ADDED);
        });
        it("should create a remove link if configured to do so", function() {
          dropzone.options.addRemoveLinks = true;
          dropzone.processFile = function() {};
          dropzone.uploadFile = function() {};
          sinon.stub(dropzone, "processQueue");
          dropzone.addFile(mockFile);
          return dropzone.files[0].previewElement.querySelector("a[data-dz-remove].dz-remove").should.be.ok;
        });
        it("should attach an event handler to data-dz-remove links", function() {
          var event, file, removeLink1, removeLink2;
          dropzone.options.previewTemplate = "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <a class=\"link1\" data-dz-remove></a>\n  <a class=\"link2\" data-dz-remove></a>\n</div>";
          sinon.stub(dropzone, "processQueue");
          dropzone.addFile(mockFile);
          file = dropzone.files[0];
          removeLink1 = file.previewElement.querySelector("a[data-dz-remove].link1");
          removeLink2 = file.previewElement.querySelector("a[data-dz-remove].link2");
          sinon.stub(dropzone, "removeFile");
          event = document.createEvent("HTMLEvents");
          event.initEvent("click", true, true);
          removeLink1.dispatchEvent(event);
          dropzone.removeFile.callCount.should.eql(1);
          event = document.createEvent("HTMLEvents");
          event.initEvent("click", true, true);
          removeLink2.dispatchEvent(event);
          return dropzone.removeFile.callCount.should.eql(2);
        });
        return describe("thumbnails", function() {
          return it("should properly queue the thumbnail creation", function(done) {
            var ct_callback, ct_file, doneFunction, mock1, mock2, mock3;
            doneFunction = null;
            dropzone.accept = function(file, done) {
              return doneFunction = done;
            };
            dropzone.processFile = function() {};
            dropzone.uploadFile = function() {};
            mock1 = getMockFile();
            mock2 = getMockFile();
            mock3 = getMockFile();
            mock1.type = "image/jpg";
            mock2.type = "image/jpg";
            mock3.type = "image/jpg";
            dropzone.on("thumbnail", function() {
              return console.log("HII");
            });
            ct_file = ct_callback = null;
            dropzone.createThumbnail = function(file, callback) {
              ct_file = file;
              return ct_callback = callback;
            };
            sinon.spy(dropzone, "createThumbnail");
            dropzone.addFile(mock1);
            dropzone.addFile(mock2);
            dropzone.addFile(mock3);
            dropzone.files.length.should.eql(3);
            return setTimeout((function() {
              dropzone.createThumbnail.callCount.should.eql(1);
              mock1.should.equal(ct_file);
              ct_callback();
              dropzone.createThumbnail.callCount.should.eql(2);
              mock2.should.equal(ct_file);
              ct_callback();
              dropzone.createThumbnail.callCount.should.eql(3);
              mock3.should.equal(ct_file);
              return done();
            }), 10);
          });
        });
      });
      describe("enqueueFile()", function() {
        it("should be wrapped by enqueueFiles()", function() {
          var mock1, mock2, mock3;
          sinon.stub(dropzone, "enqueueFile");
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          dropzone.enqueueFiles([mock1, mock2, mock3]);
          dropzone.enqueueFile.callCount.should.equal(3);
          dropzone.enqueueFile.args[0][0].should.equal(mock1);
          dropzone.enqueueFile.args[1][0].should.equal(mock2);
          return dropzone.enqueueFile.args[2][0].should.equal(mock3);
        });
        it("should fail if the file has already been processed", function() {
          mockFile.status = Dropzone.ERROR;
          expect((function() {
            return dropzone.enqueueFile(mockFile);
          })).to["throw"]("This file can't be queued because it has already been processed or was rejected.");
          mockFile.status = Dropzone.COMPLETE;
          expect((function() {
            return dropzone.enqueueFile(mockFile);
          })).to["throw"]("This file can't be queued because it has already been processed or was rejected.");
          mockFile.status = Dropzone.UPLOADING;
          return expect((function() {
            return dropzone.enqueueFile(mockFile);
          })).to["throw"]("This file can't be queued because it has already been processed or was rejected.");
        });
        return it("should set the status to QUEUED and call processQueue asynchronously if everything's ok", function(done) {
          mockFile.status = Dropzone.ADDED;
          sinon.stub(dropzone, "processQueue");
          dropzone.processQueue.callCount.should.equal(0);
          dropzone.enqueueFile(mockFile);
          mockFile.status.should.equal(Dropzone.QUEUED);
          dropzone.processQueue.callCount.should.equal(0);
          return setTimeout(function() {
            dropzone.processQueue.callCount.should.equal(1);
            return done();
          }, 10);
        });
      });
      describe("uploadFiles()", function() {
        var requests;
        requests = null;
        beforeEach(function() {
          requests = [];
          return xhr.onCreate = function(xhr) {
            return requests.push(xhr);
          };
        });
        afterEach(function() {
          return xhr.restore();
        });
        it("should be wrapped by uploadFile()", function() {
          sinon.stub(dropzone, "uploadFiles");
          dropzone.uploadFile(mockFile);
          dropzone.uploadFiles.callCount.should.equal(1);
          return dropzone.uploadFiles.calledWith([mockFile]).should.be.ok;
        });
        it("should ignore the onreadystate callback if readyState != 4", function(done) {
          dropzone.addFile(mockFile);
          return setTimeout(function() {
            mockFile.status.should.eql(Dropzone.UPLOADING);
            requests[0].status = 200;
            requests[0].readyState = 3;
            requests[0].onload();
            mockFile.status.should.eql(Dropzone.UPLOADING);
            requests[0].readyState = 4;
            requests[0].onload();
            mockFile.status.should.eql(Dropzone.SUCCESS);
            return done();
          }, 10);
        });
        it("should emit error and errormultiple when response was not OK", function(done) {
          var complete, completemultiple, error, errormultiple;
          dropzone.options.uploadMultiple = true;
          error = false;
          errormultiple = false;
          complete = false;
          completemultiple = false;
          dropzone.on("error", function() {
            return error = true;
          });
          dropzone.on("errormultiple", function() {
            return errormultiple = true;
          });
          dropzone.on("complete", function() {
            return complete = true;
          });
          dropzone.on("completemultiple", function() {
            return completemultiple = true;
          });
          dropzone.addFile(mockFile);
          return setTimeout(function() {
            mockFile.status.should.eql(Dropzone.UPLOADING);
            requests[0].status = 400;
            requests[0].readyState = 4;
            requests[0].onload();
            expect((((true === error && error === errormultiple) && errormultiple === complete) && complete === completemultiple)).to.be.ok;
            return done();
          }, 10);
        });
        it("should include hidden files in the form and unchecked checkboxes and radiobuttons should be excluded", function(done) {
          var element, formData, mock1;
          element = Dropzone.createElement("<form action=\"/the/url\">\n  <input type=\"hidden\" name=\"test\" value=\"hidden\" />\n  <input type=\"checkbox\" name=\"unchecked\" value=\"1\" />\n  <input type=\"checkbox\" name=\"checked\" value=\"value1\" checked=\"checked\" />\n  <input type=\"radio\" value=\"radiovalue1\" name=\"radio1\" />\n  <input type=\"radio\" value=\"radiovalue2\" name=\"radio1\" checked=\"checked\" />\n  <select name=\"select\"><option value=\"1\">1</option><option value=\"2\" selected>2</option></select>\n</form>");
          dropzone = new Dropzone(element, {
            url: "/the/url"
          });
          formData = null;
          dropzone.on("sending", function(file, xhr, tformData) {
            formData = tformData;
            return sinon.spy(tformData, "append");
          });
          mock1 = getMockFile();
          dropzone.addFile(mock1);
          return setTimeout(function() {
            formData.append.callCount.should.equal(5);
            formData.append.args[0][0].should.eql("test");
            formData.append.args[0][1].should.eql("hidden");
            formData.append.args[1][0].should.eql("checked");
            formData.append.args[1][1].should.eql("value1");
            formData.append.args[2][0].should.eql("radio1");
            formData.append.args[2][1].should.eql("radiovalue2");
            formData.append.args[3][0].should.eql("select");
            formData.append.args[3][1].should.eql("2");
            formData.append.args[4][0].should.eql("file");
            formData.append.args[4][1].should.equal(mock1);
            return done();
          }, 10);
        });
        it("should all values of a select that has the multiple attribute", function(done) {
          var element, formData, mock1;
          element = Dropzone.createElement("<form action=\"/the/url\">\n  <select name=\"select\" multiple>\n    <option value=\"value1\">1</option>\n    <option value=\"value2\" selected>2</option>\n    <option value=\"value3\">3</option>\n    <option value=\"value4\" selected>4</option>\n  </select>\n</form>");
          dropzone = new Dropzone(element, {
            url: "/the/url"
          });
          formData = null;
          dropzone.on("sending", function(file, xhr, tformData) {
            formData = tformData;
            return sinon.spy(tformData, "append");
          });
          mock1 = getMockFile();
          dropzone.addFile(mock1);
          return setTimeout(function() {
            formData.append.callCount.should.equal(3);
            formData.append.args[0][0].should.eql("select");
            formData.append.args[0][1].should.eql("value2");
            formData.append.args[1][0].should.eql("select");
            formData.append.args[1][1].should.eql("value4");
            formData.append.args[2][0].should.eql("file");
            formData.append.args[2][1].should.equal(mock1);
            return done();
          }, 10);
        });
        describe("settings()", function() {
          it("should correctly set `withCredentials` on the xhr object", function() {
            dropzone.uploadFile(mockFile);
            requests.length.should.eql(1);
            requests[0].withCredentials.should.eql(false);
            dropzone.options.withCredentials = true;
            dropzone.uploadFile(mockFile);
            requests.length.should.eql(2);
            return requests[1].withCredentials.should.eql(true);
          });
          it("should correctly override headers on the xhr object", function() {
            dropzone.options.headers = {
              "Foo-Header": "foobar"
            };
            dropzone.uploadFile(mockFile);
            return requests[0].requestHeaders["Foo-Header"].should.eql('foobar');
          });
          it("should properly use the paramName without [n] as file upload if uploadMultiple is false", function(done) {
            var formData, mock1, mock2, sendingCount;
            dropzone.options.uploadMultiple = false;
            dropzone.options.paramName = "myName";
            formData = [];
            sendingCount = 0;
            dropzone.on("sending", function(files, xhr, tformData) {
              sendingCount++;
              formData.push(tformData);
              return sinon.spy(tformData, "append");
            });
            mock1 = getMockFile();
            mock2 = getMockFile();
            dropzone.addFile(mock1);
            dropzone.addFile(mock2);
            return setTimeout(function() {
              sendingCount.should.equal(2);
              formData.length.should.equal(2);
              formData[0].append.callCount.should.equal(1);
              formData[1].append.callCount.should.equal(1);
              formData[0].append.args[0][0].should.eql("myName");
              formData[0].append.args[0][0].should.eql("myName");
              return done();
            }, 10);
          });
          return it("should properly use the paramName with [n] as file upload if uploadMultiple is true", function(done) {
            var formData, mock1, mock2, sendingCount, sendingMultipleCount;
            dropzone.options.uploadMultiple = true;
            dropzone.options.paramName = "myName";
            formData = null;
            sendingMultipleCount = 0;
            sendingCount = 0;
            dropzone.on("sending", function(file, xhr, tformData) {
              return sendingCount++;
            });
            dropzone.on("sendingmultiple", function(files, xhr, tformData) {
              sendingMultipleCount++;
              formData = tformData;
              return sinon.spy(tformData, "append");
            });
            mock1 = getMockFile();
            mock2 = getMockFile();
            dropzone.addFile(mock1);
            dropzone.addFile(mock2);
            return setTimeout(function() {
              sendingCount.should.equal(2);
              sendingMultipleCount.should.equal(1);
              dropzone.uploadFiles([mock1, mock2]);
              formData.append.callCount.should.equal(2);
              formData.append.args[0][0].should.eql("myName[0]");
              formData.append.args[1][0].should.eql("myName[1]");
              return done();
            }, 10);
          });
        });
        return describe("should properly set status of file", function() {
          return it("should correctly set `withCredentials` on the xhr object", function(done) {
            dropzone.addFile(mockFile);
            return setTimeout(function() {
              mockFile.status.should.eql(Dropzone.UPLOADING);
              requests.length.should.equal(1);
              requests[0].status = 400;
              requests[0].readyState = 4;
              requests[0].onload();
              mockFile.status.should.eql(Dropzone.ERROR);
              mockFile = getMockFile();
              dropzone.addFile(mockFile);
              return setTimeout(function() {
                mockFile.status.should.eql(Dropzone.UPLOADING);
                requests.length.should.equal(2);
                requests[1].status = 200;
                requests[1].readyState = 4;
                requests[1].onload();
                mockFile.status.should.eql(Dropzone.SUCCESS);
                return done();
              }, 10);
            }, 10);
          });
        });
      });
      return describe("complete file", function() {
        return it("should properly emit the queuecomplete event when the complete queue is finished", function(done) {
          var completedFiles, mock1, mock2, mock3;
          mock1 = getMockFile();
          mock2 = getMockFile();
          mock3 = getMockFile();
          mock1.status = Dropzone.ADDED;
          mock2.status = Dropzone.ADDED;
          mock3.status = Dropzone.ADDED;
          mock1.name = "mock1";
          mock2.name = "mock2";
          mock3.name = "mock3";
          dropzone.uploadFiles = function(files) {
            return setTimeout(((function(_this) {
              return function() {
                return _this._finished(files, null, null);
              };
            })(this)), 1);
          };
          completedFiles = 0;
          dropzone.on("complete", function(file) {
            return completedFiles++;
          });
          dropzone.on("queuecomplete", function() {
            completedFiles.should.equal(3);
            return done();
          });
          dropzone.addFile(mock1);
          dropzone.addFile(mock2);
          return dropzone.addFile(mock3);
        });
      });
    });
  });

}).call(this);
