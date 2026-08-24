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
      expect(Dropzone.isBrowserSupported()).toBe(true);
      expect(initialValue).toBe(Dropzone.blockedBrowsers);

      Dropzone.blockedBrowsers = [/HeadlessChrome/];
      expect(Dropzone.isBrowserSupported()).toBe(false);
    });
    it("should user blacklistedBrowsers if its set", () => {
      let initialValue = Dropzone.blockedBrowsers;

      expect(Dropzone.isBrowserSupported()).toBe(true);

      Dropzone.blacklistedBrowsers = [/HeadlessChrome/];
      expect(Dropzone.isBrowserSupported()).toBe(false);
      expect(initialValue).not.toBe(Dropzone.blockedBrowsers);
      expect(Dropzone.blockedBrowsers).toBe(Dropzone.blacklistedBrowsers);
    });
  });

  describe("Dropzone.createElement()", function () {
    let element = Dropzone.createElement('<div class="test"><span>Hallo</span></div>');

    it("should properly create an element from a string", () =>
      expect(element.tagName).toBe("DIV"));
    it("should properly add the correct class", () =>
      expect(element.classList.contains("test")).toBeTruthy());
    it("should properly create child elements", () =>
      expect(element.querySelector("span").tagName).toBe("SPAN"));
    it("should always return only one element", function () {
      element = Dropzone.createElement("<div></div><span></span>");
      return expect(element.tagName).toBe("DIV");
    });
  });

  describe("Dropzone.elementInside()", function () {
    let element = Dropzone.createElement(
      '<div id="test"><div class="child1"><div class="child2"></div></div></div>',
    );
    document.body.appendChild(element);

    let child1 = element.querySelector(".child1");
    let child2 = element.querySelector(".child2");

    afterAll(() => document.body.removeChild(element));

    it("should return yes if elements are the same", () =>
      expect(Dropzone.elementInside(element, element)).toBeTruthy());
    it("should return yes if element is direct child", () =>
      expect(Dropzone.elementInside(child1, element)).toBeTruthy());
    it("should return yes if element is some child", function () {
      expect(Dropzone.elementInside(child2, element)).toBeTruthy();
      return expect(Dropzone.elementInside(child2, document.body)).toBeTruthy();
    });
    it("should return no unless element is some child", function () {
      expect(Dropzone.elementInside(element, child1)).toBeFalsy();
      return expect(Dropzone.elementInside(document.body, child1)).toBeFalsy();
    });
  });

  describe("Dropzone.optionsForElement()", function () {
    let testOptions = {
      url: "/some/url",
      method: "put",
    };

    beforeAll(() => (Dropzone.options.testElement = testOptions));
    afterAll(() => delete Dropzone.options.testElement);

    let element = document.createElement("div");

    it("should take options set in Dropzone.options from camelized id", function () {
      element.id = "test-element";
      return expect(Dropzone.optionsForElement(element)).toBe(testOptions);
    });

    it("should return undefined if no options set", function () {
      element.id = "test-element2";
      return expect(Dropzone.optionsForElement(element)).toBe(undefined);
    });

    it("should return undefined and not throw if it's a form with an input element of the name 'id'", function () {
      element = Dropzone.createElement('<form><input name="id" /</form>');
      return expect(Dropzone.optionsForElement(element)).toBe(undefined);
    });

    it("should ignore input fields with the name='id'", function () {
      element = Dropzone.createElement(
        '<form id="test-element"><input type="hidden" name="id" value="fooo" /></form>',
      );
      return expect(Dropzone.optionsForElement(element)).toBe(testOptions);
    });
  });

  describe("Dropzone.forElement()", function () {
    let element = document.createElement("div");
    element.id = "some-test-element";
    let dropzone = null;
    beforeAll(function () {
      document.body.appendChild(element);
      return (dropzone = new Dropzone(element, { url: "/test" }));
    });
    afterAll(function () {
      dropzone.disable();
      return document.body.removeChild(element);
    });

    it("should throw an exception if no dropzone attached", () =>
      expect(() => Dropzone.forElement(document.createElement("div"))).toThrow(
        "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.",
      ));

    it("should accept css selectors", () =>
      expect(Dropzone.forElement("#some-test-element")).toBe(dropzone));

    it("should accept native elements", () => expect(Dropzone.forElement(element)).toBe(dropzone));
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
      beforeAll(function () {
        Dropzone.options.testElement1 = { url: "test-url" };
        Dropzone.options.testElement2 = false; // Disabled
        document.body.appendChild(element1);
        document.body.appendChild(element2);
        return Dropzone.discover();
      });
      afterAll(function () {
        document.body.removeChild(element1);
        return document.body.removeChild(element2);
      });

      it("should find elements with a .dropzone class", () =>
        expect(element1.dropzone).toBeTruthy());

      it("should not create dropzones with disabled options", () =>
        expect(element2.dropzone).toBeFalsy());
    });
  });

  describe("Dropzone.isValidFile()", function () {
    it("should return true if called without acceptedFiles", () =>
      expect(Dropzone.isValidFile({ type: "some/type" }, null)).toBeTruthy());

    it("should properly validate if called with concrete mime types", function () {
      let acceptedMimeTypes = "text/html,image/jpeg,application/json";

      expect(Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)).toBeTruthy();
      return expect(Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes)).toBeFalsy();
    });

    it("should properly validate if called with base mime types", function () {
      let acceptedMimeTypes = "text/*,image/*,application/*";

      expect(Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes)).toBeTruthy();
      return expect(Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes)).toBeFalsy();
    });

    it("should properly validate if called with mixed mime types", function () {
      let acceptedMimeTypes = "text/*,image/jpeg,application/*";

      expect(Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes)).toBeTruthy();
      expect(Dropzone.isValidFile({ type: "image/bmp" }, acceptedMimeTypes)).toBeFalsy();
      expect(Dropzone.isValidFile({ type: "application/json" }, acceptedMimeTypes)).toBeTruthy();
      return expect(Dropzone.isValidFile({ type: "some/type" }, acceptedMimeTypes)).toBeFalsy();
    });

    it("should properly validate even with spaces in between", function () {
      let acceptedMimeTypes = "text/html ,   image/jpeg, application/json";

      expect(Dropzone.isValidFile({ type: "text/html" }, acceptedMimeTypes)).toBeTruthy();
      return expect(Dropzone.isValidFile({ type: "image/jpeg" }, acceptedMimeTypes)).toBeTruthy();
    });

    it("should properly validate extensions", function () {
      let acceptedMimeTypes = "text/html ,    image/jpeg, .pdf  ,.png";

      expect(
        Dropzone.isValidFile({ name: "somxsfsd", type: "text/html" }, acceptedMimeTypes),
      ).toBeTruthy();
      expect(
        Dropzone.isValidFile({ name: "somesdfsdf", type: "image/jpeg" }, acceptedMimeTypes),
      ).toBeTruthy();
      expect(
        Dropzone.isValidFile(
          { name: "somesdfadfadf", type: "application/json" },
          acceptedMimeTypes,
        ),
      ).toBeFalsy();
      expect(
        Dropzone.isValidFile(
          { name: "some-file file.pdf", type: "random/type" },
          acceptedMimeTypes,
        ),
      ).toBeTruthy();
      // .pdf has to be in the end
      expect(
        Dropzone.isValidFile(
          { name: "some-file.pdf file.gif", type: "random/type" },
          acceptedMimeTypes,
        ),
      ).toBeFalsy();
      return expect(
        Dropzone.isValidFile(
          { name: "some-file file.png", type: "random/type" },
          acceptedMimeTypes,
        ),
      ).toBeTruthy();
    });
  });

  describe("Dropzone.confirm", function () {
    beforeEach(() => vi.spyOn(window, "confirm").mockImplementation(() => {}));
    afterEach(() => window.confirm.mockRestore());
    it("should forward to window.confirm and call the callbacks accordingly", function () {
      let rejected;
      let accepted = (rejected = false);
      window.confirm.mockReturnValue(true);
      Dropzone.confirm(
        "test question",
        () => (accepted = true),
        () => (rejected = true),
      );
      expect(window.confirm.mock.calls[0][0]).toBe("test question");
      expect(accepted).toBe(true);
      expect(rejected).toBe(false);

      accepted = rejected = false;
      window.confirm.mockReturnValue(false);
      Dropzone.confirm(
        "test question 2",
        () => (accepted = true),
        () => (rejected = true),
      );
      expect(window.confirm.mock.calls[1][0]).toBe("test question 2");
      expect(accepted).toBe(false);
      return expect(rejected).toBe(true);
    });

    it("should not error if rejected is not provided", function () {
      let rejected;
      let accepted = (rejected = false);
      window.confirm.mockReturnValue(false);
      Dropzone.confirm("test question", () => (accepted = true));
      expect(window.confirm.mock.calls[0][0]).toBe("test question");
      // Nothing should have changed since there is no rejected function.
      expect(accepted).toBe(false);
      return expect(rejected).toBe(false);
    });
  });

  describe("Dropzone.getElement() / getElements()", function () {
    let tmpElements = [];

    beforeEach(function () {
      tmpElements = [];
      tmpElements.push(Dropzone.createElement('<div class="tmptest"></div>'));
      tmpElements.push(Dropzone.createElement('<div id="tmptest1" class="random"></div>'));
      tmpElements.push(Dropzone.createElement('<div class="random div"></div>'));
      return tmpElements.forEach((el) => document.body.appendChild(el));
    });

    afterEach(() => tmpElements.forEach((el) => document.body.removeChild(el)));

    describe(".getElement()", function () {
      it("should accept a string", function () {
        let el = Dropzone.getElement(".tmptest");
        expect(el).toBe(tmpElements[0]);
        el = Dropzone.getElement("#tmptest1");
        return expect(el).toBe(tmpElements[1]);
      });
      it("should accept a node", function () {
        let el = Dropzone.getElement(tmpElements[2]);
        return expect(el).toBe(tmpElements[2]);
      });
      it("should fail if invalid selector", function () {
        let errorMessage =
          "Invalid `clickable` option provided. Please provide a CSS selector or a plain HTML element.";
        expect(() => Dropzone.getElement("lblasdlfsfl", "clickable")).toThrow(errorMessage);
        expect(() => Dropzone.getElement({ lblasdlfsfl: "lblasdlfsfl" }, "clickable")).toThrow(
          errorMessage,
        );
        return expect(() => Dropzone.getElement(["lblasdlfsfl"], "clickable")).toThrow(
          errorMessage,
        );
      });
    });

    describe(".getElements()", function () {
      it("should accept a list of strings", function () {
        let els = Dropzone.getElements([".tmptest", "#tmptest1"]);
        return expect(els).toEqual([tmpElements[0], tmpElements[1]]);
      });
      it("should accept a list of nodes", function () {
        let els = Dropzone.getElements([tmpElements[0], tmpElements[2]]);
        return expect(els).toEqual([tmpElements[0], tmpElements[2]]);
      });
      it("should accept a mixed list", function () {
        let els = Dropzone.getElements(["#tmptest1", tmpElements[2]]);
        return expect(els).toEqual([tmpElements[1], tmpElements[2]]);
      });
      it("should accept a string selector", function () {
        let els = Dropzone.getElements(".random");
        return expect(els).toEqual([tmpElements[1], tmpElements[2]]);
      });
      it("should accept a single node", function () {
        let els = Dropzone.getElements(tmpElements[1]);
        return expect(els).toEqual([tmpElements[1]]);
      });
      it("should fail if invalid selector", function () {
        let errorMessage =
          "Invalid `clickable` option provided. Please provide a CSS selector, a plain HTML element or a list of those.";
        expect(() => Dropzone.getElements("lblasdlfsfl", "clickable")).toThrow(errorMessage);
        return expect(() => Dropzone.getElements(["lblasdlfsfl"], "clickable")).toThrow(
          errorMessage,
        );
      });
    });
  });
});
