import { Dropzone } from "../../src/dropzone";

// Two dropzones on one page must not share mutable state. The thumbnail queue
// lived on the prototype, so pushing to it from one instance was visible from
// the other -- their thumbnails were rendered from a single queue.
describe("instance isolation", function () {
  let elements = [];
  let dropzones = [];

  let create = () => {
    let element = Dropzone.createElement('<div class="dropzone"></div>');
    document.body.appendChild(element);
    let dropzone = new Dropzone(element, { url: "/upload", autoProcessQueue: false });
    elements.push(element);
    dropzones.push(dropzone);
    return dropzone;
  };

  afterEach(function () {
    for (let d of dropzones) d.destroy();
    for (let e of elements) e.remove();
    dropzones = [];
    elements = [];
  });

  it("should give each dropzone its own thumbnail queue", function () {
    let first = create();
    let second = create();

    expect(first._thumbnailQueue).not.toBe(second._thumbnailQueue);
  });

  it("should not let one dropzone's queued thumbnail reach another", function () {
    let first = create();
    let second = create();

    first._thumbnailQueue.push({ name: "only-for-the-first.png" });

    expect(second._thumbnailQueue).toHaveLength(0);
  });
});
