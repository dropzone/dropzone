chai.should()

describe "Dropzone", ->

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


  describe "constructor()", ->

    it "should throw an exception if the element is invalid", ->
      expect(-> new Dropzone "#invalid-element").to.throw "Invalid dropzone element."

    it "should throw an exception if assigned twice to the same element", ->
      element = document.createElement "div"
      new Dropzone element, url: "url"
      expect(-> new Dropzone element, url: "url").to.throw "Dropzone already attached."
