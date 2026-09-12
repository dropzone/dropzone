import { vi } from "vitest";
import { Dropzone } from "../../src/dropzone";
import { useFakeXMLHttpRequest } from "../fake-xhr.js";
import { sleep } from "./utils";

// The transport-level failure paths. onload had tests; ontimeout, onerror and
// the progress forwarding did not, which is the half of uploading that only
// runs when something has already gone wrong.
describe("upload failures", function () {
  let getMockFile = (filename = "test file name") => {
    let file = new File(["file contents"], filename, { type: "text/html" });
    file.status = Dropzone.ADDED;
    file.accepted = true;
    file.upload = { filename };
    return file;
  };

  let xhr = null;
  let element = null;
  let dropzone = null;
  let requests = null;

  beforeEach(function () {
    xhr = useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = (request) => requests.push(request);

    element = Dropzone.createElement("<div></div>");
    document.body.appendChild(element);
  });

  afterEach(function () {
    dropzone.destroy();
    element.remove();
    xhr.restore();
  });

  let start = (options = {}) => {
    dropzone = new Dropzone(element, { url: "/upload", timeout: 30000, ...options });
    return dropzone;
  };

  describe("a request that times out", function () {
    it("should report the timeout in seconds", async function () {
      start();
      let errors = [];
      dropzone.on("error", (file, message) => errors.push(message));

      dropzone.addFile(getMockFile());
      await sleep(10);
      requests[0].ontimeout();

      expect(errors).toEqual(["Request timedout after 30 seconds"]);
    });

    it("should mark the file as errored", async function () {
      start();
      let file = getMockFile();

      dropzone.addFile(file);
      await sleep(10);
      requests[0].ontimeout();

      expect(file.status).toBe(Dropzone.ERROR);
    });

    it("should still emit complete", async function () {
      start();
      let complete = vi.fn();
      dropzone.on("complete", complete);

      dropzone.addFile(getMockFile());
      await sleep(10);
      requests[0].ontimeout();

      expect(complete).toHaveBeenCalledTimes(1);
    });
  });

  describe("a request that errors", function () {
    it("should emit error with the default message", async function () {
      start();
      let errors = [];
      dropzone.on("error", (file, message) => errors.push(message));

      dropzone.addFile(getMockFile());
      await sleep(10);
      requests[0].onerror();

      expect(errors).toEqual([dropzone.options.dictResponseError.replace("{{statusCode}}", "0")]);
    });

    it("should leave a cancelled file alone", async function () {
      start();
      let error = vi.fn();
      dropzone.on("error", error);
      let file = getMockFile();

      dropzone.addFile(file);
      await sleep(10);
      file.status = Dropzone.CANCELED;
      requests[0].onerror();

      expect(error).not.toHaveBeenCalled();
    });
  });

  describe("progress", function () {
    it("should forward upload progress to the file", async function () {
      start();
      dropzone.addFile(getMockFile());
      await sleep(10);

      requests[0].upload.onprogress({ lengthComputable: true, loaded: 50, total: 100 });

      expect(dropzone.files[0].upload.progress).toBe(50);
    });

    it("should emit uploadprogress", async function () {
      start();
      let progress = [];
      dropzone.on("uploadprogress", (file, percent) => progress.push(percent));

      dropzone.addFile(getMockFile());
      await sleep(10);
      requests[0].upload.onprogress({ lengthComputable: true, loaded: 25, total: 100 });

      expect(progress).toContain(25);
    });
  });

  describe("_getChunk", function () {
    it("should find the chunk belonging to an xhr", async function () {
      start({ forceChunking: true, chunking: true, chunkSize: 4 });
      dropzone.addFile(getMockFile());
      await sleep(10);

      let file = dropzone.files[0];
      let chunk = dropzone._getChunk(file, requests[0]);

      expect(chunk).toBeDefined();
      expect(chunk.xhr).toBe(requests[0]);
    });

    it("should return undefined for an xhr that belongs to no chunk", async function () {
      start({ forceChunking: true, chunking: true, chunkSize: 4 });
      dropzone.addFile(getMockFile());
      await sleep(10);

      expect(dropzone._getChunk(dropzone.files[0], {})).toBeUndefined();
    });
  });
});
