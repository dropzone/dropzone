chai.should()

describe "Dropzone", ->
  describe "constructor()", ->

    it "should throw an exception if the element is invalid", ->
      expect(-> new Dropzone "#invalid-element").to.throw "Invalid dropzone element."

    it "should throw an exception if assigned twice to the same element", ->
      element = document.createElement "div"
      new Dropzone element, url: "url"
      expect(-> new Dropzone element, url: "url").to.throw "Dropzone already attached."
