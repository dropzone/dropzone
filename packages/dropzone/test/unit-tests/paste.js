import { vi } from "vitest";
import { Dropzone } from "../../src/dropzone";

describe("paste", function () {
  let element = null;
  let dropzone = null;

  beforeEach(function () {
    element = document.createElement("div");
    document.body.appendChild(element);
    dropzone = new Dropzone(element, { url: "/upload", autoProcessQueue: false });
  });

  afterEach(function () {
    dropzone.destroy();
    element.remove();
  });

  let clipboardEvent = (items) => ({ clipboardData: items == null ? undefined : { items } });
  let fileItem = (name) => ({
    kind: "file",
    webkitGetAsEntry: () => null,
    getAsFile: () => new File(["x"], name),
  });

  describe("guards", function () {
    it("should ignore an event with no clipboardData", function () {
      let addFiles = vi.spyOn(dropzone, "_addFilesFromItems");
      dropzone.paste({});
      expect(addFiles).not.toHaveBeenCalled();
    });

    it("should ignore clipboardData with no items", function () {
      let addFiles = vi.spyOn(dropzone, "_addFilesFromItems");
      dropzone.paste(clipboardEvent(null));
      expect(addFiles).not.toHaveBeenCalled();
    });

    it("should ignore being called with nothing at all", function () {
      expect(() => dropzone.paste()).not.toThrow();
    });

    it("should not reach the items when the clipboard is empty", function () {
      let addFiles = vi.spyOn(dropzone, "_addFilesFromItems");
      dropzone.paste(clipboardEvent([]));
      expect(addFiles).not.toHaveBeenCalled();
    });
  });

  describe("with files on the clipboard", function () {
    it("should emit paste with the event", function () {
      let received = null;
      dropzone.on("paste", (e) => (received = e));

      let event = clipboardEvent([fileItem("pasted.png")]);
      dropzone.paste(event);

      expect(received).toBe(event);
    });

    it("should emit paste before adding anything", function () {
      let order = [];
      dropzone.on("paste", () => order.push("paste"));
      dropzone.on("addedfile", () => order.push("addedfile"));

      dropzone.paste(clipboardEvent([fileItem("pasted.png")]));

      expect(order[0]).toBe("paste");
    });

    it("should add the pasted file", function () {
      dropzone.paste(clipboardEvent([fileItem("pasted.png")]));

      expect(dropzone.files.map((f) => f.name)).toEqual(["pasted.png"]);
    });

    it("should add every pasted file", function () {
      dropzone.paste(clipboardEvent([fileItem("one.png"), fileItem("two.png")]));

      expect(dropzone.files.map((f) => f.name)).toEqual(["one.png", "two.png"]);
    });
  });

  // Documenting current behaviour rather than endorsing it. drop() emits
  // addedfiles as of 6.2 and the hidden input's change handler always has;
  // paste is the one entry point that does not, which the 7.0 roadmap lists as
  // an inconsistency to settle. If this test starts failing because paste
  // learned to emit it, that is the fix landing -- update the test.
  it("should not emit addedfiles, unlike the other two entry points", function () {
    let addedfiles = vi.fn();
    dropzone.on("addedfiles", addedfiles);

    dropzone.paste(clipboardEvent([fileItem("pasted.png")]));

    expect(addedfiles).not.toHaveBeenCalled();
  });
});
