import { Dropzone } from "../../src/dropzone.js";

describe("Amazon S3 Support", function () {
  let getMockFile = (
    type = "text/html",
    filename = "test file name",
    contents = ["file contents"]
  ) => {
    let file = new File(contents, filename, { type: type });
    file.status = Dropzone.ADDED;
    file.accepted = true;
    file.upload = {
      filename: filename,
    };
    return file;
  };

  let xhr = null;
  beforeEach(() => (xhr = sinon.useFakeXMLHttpRequest()));

  describe("constructor()", function () {
    let dropzone = null;

    afterEach(function () {
      if (dropzone != null) {
        dropzone.destroy();
      }
    });

    it("should throw an exception if binaryBody and uploadMultiple", () => {
      let element = document.createElement("div");
      expect(
        () =>
          (dropzone = new Dropzone(element, {
            url: "/",
            binaryBody: true,
            uploadMultiple: true,
          }))
      ).to.throw("You cannot set both: binaryBody and uploadMultiple.");
    });
  });
});
