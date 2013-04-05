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
      return describe("Dropzone.elementInside()", function() {
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
    });
    describe("constructor()", function() {
      it("should throw an exception if the element is invalid", function() {
        return expect(function() {
          return new Dropzone("#invalid-element");
        }).to["throw"]("Invalid dropzone element.");
      });
      return it("should throw an exception if assigned twice to the same element", function() {
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
