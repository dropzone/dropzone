import { vi } from "vitest";
import { Dropzone } from "../../src/dropzone";

// The listeners the constructor binds to the element. The existing suite calls
// dropzone.drop() directly, which skips this wiring entirely -- so every one of
// these handlers, the whole point of the library, was previously unreached.
describe("drag and drop", function () {
  let element = null;
  let dropzone = null;

  beforeEach(function () {
    element = document.createElement("div");
    // The class matters: the default message, and so the .dz-message element
    // the click handler looks for, is only injected when it is present.
    element.className = "dropzone";
    document.body.appendChild(element);
    dropzone = new Dropzone(element, { url: "/upload", autoProcessQueue: false });
  });

  afterEach(function () {
    dropzone.destroy();
    element.remove();
  });

  // A drag event carrying whatever dataTransfer the test needs. `types` is what
  // the library inspects to decide whether a drag is worth intercepting at all.
  let dragEvent = function (type, { types = ["Files"], effectAllowed } = {}) {
    let event = new Event(type, { bubbles: true, cancelable: true });
    event.dataTransfer = { types, effectAllowed, dropEffect: null, files: [], items: [] };
    return event;
  };

  describe("events", function () {
    for (let type of ["dragstart", "dragenter", "dragover", "dragleave", "dragend"]) {
      it(`should emit ${type}`, function () {
        let received = null;
        dropzone.on(type, (e) => (received = e));

        let event = dragEvent(type);
        element.dispatchEvent(event);

        expect(received).toBe(event);
      });
    }

    it("should hand a drop to drop()", function () {
      let drop = vi.spyOn(dropzone, "drop").mockImplementation(() => {});

      let event = dragEvent("drop");
      element.dispatchEvent(event);

      expect(drop).toHaveBeenCalledTimes(1);
      expect(drop.mock.calls[0][0]).toBe(event);
    });
  });

  // A drag carrying anything other than files belongs to whatever else is on
  // the page, so the library deliberately keeps its hands off it.
  describe("propagation", function () {
    for (let type of ["dragenter", "dragover", "drop"]) {
      it(`should swallow ${type} when the drag carries files`, function () {
        vi.spyOn(dropzone, "drop").mockImplementation(() => {});
        let event = dragEvent(type);
        let stop = vi.spyOn(event, "stopPropagation");
        let prevent = vi.spyOn(event, "preventDefault");

        element.dispatchEvent(event);

        expect(stop).toHaveBeenCalled();
        expect(prevent).toHaveBeenCalled();
      });

      it(`should leave ${type} alone when the drag carries no files`, function () {
        vi.spyOn(dropzone, "drop").mockImplementation(() => {});
        let event = dragEvent(type, { types: ["text/plain"] });
        let stop = vi.spyOn(event, "stopPropagation");
        let prevent = vi.spyOn(event, "preventDefault");

        element.dispatchEvent(event);

        expect(stop).not.toHaveBeenCalled();
        expect(prevent).not.toHaveBeenCalled();
      });
    }

    it("should not be confused by a dataTransfer with no types at all", function () {
      let event = new Event("dragenter", { bubbles: true, cancelable: true });
      event.dataTransfer = { files: [], items: [] };
      let stop = vi.spyOn(event, "stopPropagation");

      expect(() => element.dispatchEvent(event)).not.toThrow();
      expect(stop).not.toHaveBeenCalled();
    });
  });

  // Without this, dragging a file out of Chrome's download bar drops nothing:
  // the browser needs to be told the drag is a copy.
  describe("dropEffect", function () {
    it("should be copy by default", function () {
      let event = dragEvent("dragover");
      element.dispatchEvent(event);
      expect(event.dataTransfer.dropEffect).toBe("copy");
    });

    for (let effectAllowed of ["move", "linkMove"]) {
      it(`should be move when effectAllowed is ${effectAllowed}`, function () {
        let event = dragEvent("dragover", { effectAllowed });
        element.dispatchEvent(event);
        expect(event.dataTransfer.dropEffect).toBe("move");
      });
    }

    it("should survive a dataTransfer that throws when read", function () {
      // Internet Explorer 11 threw SCRIPT65535 here, which is why the read is
      // wrapped. The guard is still load-bearing for any exotic dataTransfer.
      let event = new Event("dragover", { bubbles: true, cancelable: true });
      event.dataTransfer = {
        types: ["Files"],
        get effectAllowed() {
          throw new Error("nope");
        },
        set dropEffect(value) {
          this._dropEffect = value;
        },
        get dropEffect() {
          return this._dropEffect;
        },
      };

      expect(() => element.dispatchEvent(event)).not.toThrow();
      expect(event.dataTransfer.dropEffect).toBe("copy");
    });
  });

  describe("clicking", function () {
    it("should forward a click on the element to the hidden input", function () {
      let click = vi.spyOn(dropzone.hiddenFileInput, "click").mockImplementation(() => {});

      element.dispatchEvent(new Event("click", { bubbles: true }));

      expect(click).toHaveBeenCalledTimes(1);
    });

    it("should forward a click on the message element", function () {
      let message = element.querySelector(".dz-message");
      let click = vi.spyOn(dropzone.hiddenFileInput, "click").mockImplementation(() => {});

      message.dispatchEvent(new Event("click", { bubbles: true }));

      expect(click).toHaveBeenCalledTimes(1);
    });

    it("should not forward a click on some other child", function () {
      let other = document.createElement("span");
      element.appendChild(other);
      let click = vi.spyOn(dropzone.hiddenFileInput, "click").mockImplementation(() => {});

      other.dispatchEvent(new Event("click", { bubbles: true }));

      expect(click).not.toHaveBeenCalled();
    });

    it("should not forward anything once disabled", function () {
      let click = vi.spyOn(dropzone.hiddenFileInput, "click").mockImplementation(() => {});
      dropzone.disable();

      element.dispatchEvent(new Event("click", { bubbles: true }));

      expect(click).not.toHaveBeenCalled();
    });
  });
});
