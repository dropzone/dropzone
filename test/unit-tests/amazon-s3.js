import { Dropzone } from "../../src/dropzone.js";
import { sleep } from "./utils";

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
  let dropzone = null;
  beforeEach(() => (xhr = sinon.useFakeXMLHttpRequest()));

  afterEach(function () {
    if (dropzone != null) {
      dropzone.destroy();
    }
  });
  describe("constructor()", () => {
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

  describe.only("upload", () => {
    let element = null;
    let dropzone = null;
    let requests = null;
    beforeEach(function () {
      requests = [];
      xhr.onCreate = (xhr) => requests.push(xhr);

      element = Dropzone.createElement("<div></div>");
      document.body.appendChild(element);
      return (dropzone = new Dropzone(element, {
        url: "url",
        binaryBody: true,
        uploadprogress() {},
      }));
    });
    afterEach(function () {
      document.body.removeChild(element);
      dropzone.destroy();
      return xhr.restore();
    });
    it("should add proper Content-Type", async () => {
      dropzone.addFile(getMockFile());
      dropzone.addFile(getMockFile("image/jpeg", "some-file.jpg", [[1, 2, 3]]));
      await sleep(10);

      console.log(requests[0].requestHeaders);
      console.log(requests[1].requestHeaders);

      expect(requests[0].requestHeaders["Content-Type"]).eq(
        "text/html;charset=utf-8"
      );

      expect(requests[1].requestHeaders["Content-Type"]).eq(
        "image/jpeg;charset=utf-8"
      );
    });
  });
});
