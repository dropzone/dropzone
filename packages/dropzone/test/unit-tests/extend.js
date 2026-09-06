import extend from "../../src/extend.js";

// Vendored from just-extend, so these lock in the upstream behaviour Dropzone
// has always relied on -- particularly the array handling, which merges by
// index rather than replacing.
describe("extend", function () {
  it("should merge shallowly by default", function () {
    expect(extend({ a: 3, b: 5 }, { a: 4, c: 8 })).toEqual({ a: 4, b: 5, c: 8 });
  });

  it("should mutate the first argument", function () {
    let target = { a: 3 };
    let result = extend(target, { b: 5 });
    expect(result).toBe(target);
    expect(target).toEqual({ a: 3, b: 5 });
  });

  it("should leave later sources untouched when extending into a new object", function () {
    let source = { a: 3, b: 5 };
    extend({}, source, { a: 4 });
    expect(source).toEqual({ a: 3, b: 5 });
  });

  it("should merge nested objects when deep", function () {
    expect(extend(true, {}, { n: { x: 1, y: 2 } }, { n: { y: 9, z: 3 } })).toEqual({
      n: { x: 1, y: 9, z: 3 },
    });
  });

  it("should copy nested values rather than alias them when deep", function () {
    let source = { n: { y: 2 } };
    let result = extend(true, {}, source);
    result.n.y = 99;
    expect(source.n.y).toBe(2);
  });

  it("should alias nested values when not deep", function () {
    let source = { n: { y: 2 } };
    let result = extend({}, source);
    result.n.y = 99;
    expect(source.n.y).toBe(99);
  });

  it("should merge arrays by index rather than replacing them", function () {
    // Dropzone's options merging depends on this: a shorter override does not
    // truncate the default.
    expect(extend(true, {}, { arr: [1, 2, 3] }, { arr: [9] })).toEqual({ arr: [9, 2, 3] });
  });

  it("should ignore a leading boolean that is not followed by an object", () =>
    expect(() => extend(true, 3, { a: 1 })).toThrow("extendee must be an object"));

  it("should throw if the extendee is not an object", function () {
    expect(() => extend("hello", { a: 4 })).toThrow("extendee must be an object");
    expect(() => extend(3, { a: 4 })).toThrow("extendee must be an object");
  });

  it("should skip null and undefined sources", function () {
    expect(extend(true, {}, { a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("should carry functions across untouched", function () {
    let fn = () => "called";
    expect(extend(true, {}, { fn }).fn).toBe(fn);
  });
});
