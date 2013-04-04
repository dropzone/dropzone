(function() {
  chai.should();

  describe("Dropzone", function() {
    return describe("constructor()", function() {
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
  });

}).call(this);
