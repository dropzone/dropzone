import { Dropzone } from "../../src/dropzone.js";

describe("Static functions", function () {
  describe("Dropzone.isBrowserSupported()", function () {
    let initialValue;
    beforeEach(() => {
      initialValue = Dropzone.blockedBrowsers;
    });
    afterEach(() => {
      Dropzone.blockedBrowsers = initialValue;
      Dropzone.blacklistedBrowsers = undefined;
    });
    it("should use blockedBrowsers usually", () => {
      let initialValue = Dropzone.blockedBrowsers;
      Dropzone.isBrowserSupported().should.be.true;
      initialValue.should.equal(Dropzone.blockedBrowsers);

      Dropzone.blockedBrowsers = [/HeadlessChrome/];
      Dropzone.isBrowserSupported().should.be.false;
    });
    it("should user blacklistedBrowsers if its set", () => {
      let initialValue = Dropzone.blockedBrowsers;

      Dropzone.isBrowserSupported().should.be.true;

      Dropzone.blacklistedBrowsers = [/HeadlessChrome/];
      Dropzone.isBrowserSupported().should.be.false;
      initialValue.should.not.equal(Dropzone.blockedBrowsers);
      Dropzone.blockedBrowsers.should.equal(Dropzone.blacklistedBrowsers);
    });
  });

  describe("Dropzone.createElement()", function () {
    let element = Dropzone.createElement(
      '<div class="test"><span>Hallo</span></div>'
    );

    it("should properly create an element from a string", () =>
      element.tagName.should.equal("DIV"));
    it("should properly add the correct class", () =>
      element.classList.contains("test").should.be.ok);
    it("should properly create child elements", () =>
      element.querySelector("span").tagName.should.equal("SPAN"));
    it("should always return only one element", function () {
      element = Dropzone.createElement("<div></div><span></span>");
      return element.tagName.should.equal("DIV");
    });
  });

  describe("Dropzone.elementInside()", function () {
    let element = Dropzone.createElement(
      '<div id="test"><div class="child1"><div class="child2"></div></div></div>'
    );
    document.body.appendChild(element);

    let child1 = element.querySelector(".child1");
    let child2 = element.querySelector(".child2");

    after(() => document.body.removeChild(element));

    it("should return yes if elements are the same", () =>
      Dropzone.elementInside(element, element).should.be.ok);
    it("should return yes if element is direct child", () =>
      Dropzone.elementInside(child1, element).should.be.ok);
    it("should return yes if element is some child", function () {
      Dropzone.elementInside(child2, element).should.be.ok;
      return Dropzone.elementInside(child2, document.body).should.be.ok;
    });
    it("should return no unless element is some child", function () {
      Dropzone.elementInside(element, child1).should.not.be.ok;
      return Dropzone.elementInside(document.body, child1).should.not.be.ok;
    });
  });

  describe("Dropzone.optionsForElement()", function () {
    let testOptions = {
      url: "/some/url",
      method: "put",
    };

    before(() => (Dropzone.options.testElement = testOptions));
    after(() => delete Dropzone.options.testElement);

    let element = document.createElement("div");

    it("should take options set in Dropzone.options from camelized id", function () {
      element.id = "test-element";
      return Dropzone.optionsForElement(element).should.equal(testOptions);
    });

    it("should return undefined if no options set", function () {
      element.id = "test-element2";
      return expect(Dropzone.optionsForElement(element)).to.equal(undefined);
    });

    it("should return undefined and not throw if it's a form with an input element of the name 'id'", function () {
      element = Dropzone.createElement('<form><input name="id" /</form>');
      return expect(Dropzone.optionsForElement(element)).to.equal(undefined);
    });

    it("should ignore input fields with the name='id'", function () {
      element = Dropzone.createElement(
        '<form id="test-element"><input type="hidden" name="id" value="fooo" /></form>'
      );
      return Dropzone.optionsForElement(element).should.equal(testOptions);
    });
  });

  describe("Dropzone.forElement()", function () {
    let element = document.createElement("div");
    element.id = "some-test-element";
    let dropzone = null;
    before(function () {
      document.body.appendChild(element);
      return (dropzone = new Dropzone(element, { url: "/test" }));
    });
    after(function () {
      dropzone.disable();
      return document.body.removeChild(element);
    });

    it("should throw an exception if no dropzone attached", () =>
      expect(() => Dropzone.forElement(document.createElement("div"))).to.throw(
        "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone."
      ));

    it("should accept css selectors", () =>
      expect(Dropzone.forElement("#some-test-element")).to.equal(dropzone));

    it("should accept native elements", () =>
      expect(Dropzone.forElement(element)).to.equal(dropzone));
  });

  describe("Dropzone.discover()", function () {
    let element1 = document.createElement("div");
    element1.className = "dropzone";
    let element2 = element1.cloneNode();
    let element3 = element1.cloneNode();

    element1.id = "test-element-1";
    element2.id = "test-element-2";
    element3.id = "test-element-3";

    describe("specific options", function () {
      before(function () {
        Dropzone.options.testElement1 = { url: "test-url" };
        Dropzone.options.testElement2 = false; // Disabled
        document.body.appendChild(element1);
        document.body.appendChild(element2);
        return Dropzone.discover();
      });
      after(function () {
        document.body.removeChild(element1);
        return document.body.removeChild(element2);
      });

      it("should find elements with a .dropzone class", () =>
        element1.dropzone.should.be.ok);

      it("should not create dropzones with disabled options", () =>
        expect(element2.dropzone).to.not.be.ok);
    });
  });

  describe("Dropzone.isValidFile()", function () {
    it("should return true if called without acceptedFiles", () =>
      Dropzone.isValidFile({ type: "some/type" }, null).should.be.ok);

    it("should properly validate if called with concrete mime types", function () {
      let acceptedMimeTypes = "text/html,image/jpeg,application/json";

      Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)
        .should.be.ok;
      return Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes)
        .should.not.be.ok;
    });

    it("should properly validate if called with base mime types", function () {
      let acceptedMimeTypes = "text/*,image/*,application/*";

      Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)
        .should.be.ok;
      Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes).should.be
        .ok;
      return Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes)
        .should.not.be.ok;
    });

    it("should properly validate if called with mixed mime types", function () {
      let acceptedMimeTypes = "text/*,image/jpeg,application/*";

      Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes).should.be
        .ok;
      Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes).should.not
        .be.ok;
      Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)
        .should.be.ok;
      return Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes)
        .should.not.be.ok;
    });

    it("should properly validate even with spaces in between", function () {
      let acceptedMimeTypes = "text/html ,   image/jpeg, application/json";

      Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes).should.be
        .ok;
      return Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes)
        .should.be.ok;
    });

    it("should properly validate extensions", function () {
      let acceptedMimeTypes = "text/html ,    image/jpeg, .pdf  ,.png";

      Dropzone.isValidFile(
        { name: "somxsfsd", type: "text/html" },
        acceptedMimeTypes
      ).should.be.ok;
      Dropzone.isValidFile(
        { name: "somesdfsdf", type: "image/jpeg" },
        acceptedMimeTypes
      ).should.be.ok;
      Dropzone.isValidFile(
        { name: "somesdfadfadf", type: "application/json" },
        acceptedMimeTypes
      ).should.not.be.ok;
      Dropzone.isValidFile(
        { name: "some-file file.pdf", type: "random/type" },
        acceptedMimeTypes
      ).should.be.ok;
      // .pdf has to be in the end
      Dropzone.isValidFile(
        { name: "some-file.pdf file.gif", type: "random/type" },
        acceptedMimeTypes
      ).should.not.be.ok;
      return Dropzone.isValidFile(
        { name: "some-file file.png", type: "random/type" },
        acceptedMimeTypes
      ).should.be.ok;
    });
  });

  describe("Dropzone.confirm", function () {
    beforeEach(() => sinon.stub(window, "confirm"));
    afterEach(() => window.confirm.restore());
    it("should forward to window.confirm and call the callbacks accordingly", function () {
      let rejected;
      let accepted = (rejected = false);
      window.confirm.returns(true);
      Dropzone.confirm(
        "test question",
        () => (accepted = true),
        () => (rejected = true)
      );
      window.confirm.args[0][0].should.equal("test question");
      accepted.should.equal(true);
      rejected.should.equal(false);

      accepted = rejected = false;
      window.confirm.returns(false);
      Dropzone.confirm(
        "test question 2",
        () => (accepted = true),
        () => (rejected = true)
      );
      window.confirm.args[1][0].should.equal("test question 2");
      accepted.should.equal(false);
      return rejected.should.equal(true);
    });

    it("should not error if rejected is not provided", function () {
      let rejected;
      let accepted = (rejected = false);
      window.confirm.returns(false);
      Dropzone.confirm("test question", () => (accepted = true));
      window.confirm.args[0][0].should.equal("test question");
      // Nothing should have changed since there is no rejected function.
      accepted.should.equal(false);
      return rejected.should.equal(false);
    });
  });

  describe("Dropzone.getElement() / getElements()", function () {
    let tmpElements = [];

    beforeEach(function () {
      tmpElements = [];
      tmpElements.push(Dropzone.createElement('<div class="tmptest"></div>'));
      tmpElements.push(
        Dropzone.createElement('<div id="tmptest1" class="random"></div>')
      );
      tmpElements.push(
        Dropzone.createElement('<div class="random div"></div>')
      );
      return tmpElements.forEach((el) => document.body.appendChild(el));
    });

    afterEach(() => tmpElements.forEach((el) => document.body.removeChild(el)));

    describe(".getElement()", function () {
      it("should accept a string", function () {
        let el = Dropzone.getElement(".tmptest");
        el.should.equal(tmpElements[0]);
        el = Dropzone.getElement("#tmptest1");
        return el.should.equal(tmpElements[1]);
      });
      it("should accept a node", function () {
        let el = Dropzone.getElement(tmpElements[2]);
        return el.should.equal(tmpElements[2]);
      });
      it("should fail if invalid selector", function () {
        let errorMessage =
          "Invalid `clickable` option provided. Please provide a CSS selector or a plain HTML element.";
        expect(() => Dropzone.getElement("lblasdlfsfl", "clickable")).to.throw(
          errorMessage
        );
        expect(() =>
          Dropzone.getElement({ lblasdlfsfl: "lblasdlfsfl" }, "clickable")
        ).to.throw(errorMessage);
        return expect(() =>
          Dropzone.getElement(["lblasdlfsfl"], "clickable")
        ).to.throw(errorMessage);
      });
    });

    describe(".getElements()", function () {
      it("should accept a list of strings", function () {
        let els = Dropzone.getElements([".tmptest", "#tmptest1"]);
        return els.should.eql([tmpElements[0], tmpElements[1]]);
      });
      it("should accept a list of nodes", function () {
        let els = Dropzone.getElements([tmpElements[0], tmpElements[2]]);
        return els.should.eql([tmpElements[0], tmpElements[2]]);
      });
      it("should accept a mixed list", function () {
        let els = Dropzone.getElements(["#tmptest1", tmpElements[2]]);
        return els.should.eql([tmpElements[1], tmpElements[2]]);
      });
      it("should accept a string selector", function () {
        let els = Dropzone.getElements(".random");
        return els.should.eql([tmpElements[1], tmpElements[2]]);
      });
      it("should accept a single node", function () {
        let els = Dropzone.getElements(tmpElements[1]);
        return els.should.eql([tmpElements[1]]);
      });
      it("should fail if invalid selector", function () {
        let errorMessage =
          "Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those.";
        expect(() => Dropzone.getElements("lblasdlfsfl", "clickable")).to.throw(
          errorMessage
        );
        return expect(() =>
          Dropzone.getElements(["lblasdlfsfl"], "clickable")
        ).to.throw(errorMessage);
      });
    });
  });
});
