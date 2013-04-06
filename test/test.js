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
      return describe("Dropzone.discover()", function() {
        var element1, element2;

        element1 = document.createElement("div");
        element1.className = "dropzone";
        element2 = element1.cloneNode();
        element1.id = "test-element-1";
        element2.id = "test-element-2";
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
      it("should set itself as element.dropzone", function() {
        var dropzone, element;

        element = document.createElement("div");
        dropzone = new Dropzone(element, {
          url: "url"
        });
        return element.dropzone.should.equal(dropzone);
      });
      return describe("options", function() {
        before(function() {
          return Dropzone.options.testElement = {
            url: "/some/url",
            parallelUploads: 10
          };
        });
        after(function() {
          return delete Dropzone.options.testElement;
        });
        it("should take the options set in Dropzone.options", function() {
          var dropzone, element;

          element = document.createElement("div");
          element.id = "test-element";
          dropzone = new Dropzone(element);
          dropzone.options.url.should.equal("/some/url");
          return dropzone.options.parallelUploads.should.equal(10);
        });
        it("should prefer passed options over Dropzone.options", function() {
          var dropzone, element;

          element = document.createElement("div");
          element.id = "test-element";
          dropzone = new Dropzone(element, {
            url: "/some/other/url"
          });
          return dropzone.options.url.should.equal("/some/other/url");
        });
        return it("should take the default options if nothing set in Dropzone.options", function() {
          var dropzone, element;

          element = document.createElement("div");
          element.id = "test-element2";
          dropzone = new Dropzone(element, {
            url: "/some/url"
          });
          return dropzone.options.parallelUploads.should.equal(2);
        });
      });
    });
    return describe("init()", function() {
      return describe("clickable", function() {
        var dropzone, element;

        element = Dropzone.createElement("<form action=\"/\"></form>");
        dropzone = new Dropzone(element, {
          clickable: true
        });
        it("should create a hidden file input if clickable", function() {
          dropzone.hiddenFileInput.should.be.ok;
          return dropzone.hiddenFileInput.tagName.should.equal("INPUT");
        });
        return it("should create a new input element when something is selected to reset the input field", function() {
          var event, hiddenFileInput, i, _i, _results;

          _results = [];
          for (i = _i = 0; _i <= 3; i = ++_i) {
            hiddenFileInput = dropzone.hiddenFileInput;
            event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, true);
            hiddenFileInput.dispatchEvent(event);
            dropzone.hiddenFileInput.should.not.equal(hiddenFileInput);
            _results.push(Dropzone.elementInside(hiddenFileInput, document).should.not.be.ok);
          }
          return _results;
        });
      });
    });
  });

}).call(this);
