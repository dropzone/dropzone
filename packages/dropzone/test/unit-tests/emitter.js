import { Dropzone } from "../../src/dropzone.js";

describe("Emitter", function () {
  let emitter = null;
  beforeEach(() => (emitter = new Dropzone.prototype.Emitter()));

  it(".on() should return the object itself", () =>
    expect(emitter.on("test", function () {})).toBe(emitter));

  it(".on() should properly register listeners", function () {
    expect(emitter._callbacks === undefined).toBe(true);
    let callback = function () {};
    let callback2 = function () {};
    emitter.on("test", callback);
    emitter.on("test", callback2);
    emitter.on("test2", callback);
    expect(emitter._callbacks.test.length).toBe(2);
    expect(emitter._callbacks.test[0]).toBe(callback);
    expect(emitter._callbacks.test[1]).toBe(callback2);
    expect(emitter._callbacks.test2.length).toBe(1);
    return expect(emitter._callbacks.test2[0]).toBe(callback);
  });

  it(".emit() should return the object itself", () => expect(emitter.emit("test")).toBe(emitter));

  it(".emit() should properly invoke all registered callbacks with arguments", function () {
    let callCount1 = 0;
    let callCount12 = 0;
    let callCount2 = 0;
    let callback1 = function (var1, var2) {
      callCount1++;
      expect(var1).toBe("callback1 var1");
      return expect(var2).toBe("callback1 var2");
    };
    let callback12 = function (var1, var2) {
      callCount12++;
      expect(var1).toBe("callback1 var1");
      return expect(var2).toBe("callback1 var2");
    };
    let callback2 = function (var1, var2) {
      callCount2++;
      expect(var1).toBe("callback2 var1");
      return expect(var2).toBe("callback2 var2");
    };

    emitter.on("test1", callback1);
    emitter.on("test1", callback12);
    emitter.on("test2", callback2);

    expect(callCount1).toBe(0);
    expect(callCount12).toBe(0);
    expect(callCount2).toBe(0);

    emitter.emit("test1", "callback1 var1", "callback1 var2");

    expect(callCount1).toBe(1);
    expect(callCount12).toBe(1);
    expect(callCount2).toBe(0);

    emitter.emit("test2", "callback2 var1", "callback2 var2");

    expect(callCount1).toBe(1);
    expect(callCount12).toBe(1);
    expect(callCount2).toBe(1);

    emitter.emit("test1", "callback1 var1", "callback1 var2");

    expect(callCount1).toBe(2);
    expect(callCount12).toBe(2);
    return expect(callCount2).toBe(1);
  });

  return describe(".off()", function () {
    let callback1 = function () {};
    let callback2 = function () {};
    let callback3 = function () {};
    let callback4 = function () {};

    beforeEach(
      () =>
        (emitter._callbacks = {
          test1: [callback1, callback2],
          test2: [callback3],
          test3: [callback1, callback4],
          test4: [],
        }),
    );

    it("should work without any listeners", function () {
      emitter._callbacks = undefined;
      let emt = emitter.off();
      expect(emitter._callbacks).toEqual({});
      return expect(emt).toBe(emitter);
    });

    it("should properly remove all event listeners", function () {
      let emt = emitter.off();
      expect(emitter._callbacks).toEqual({});
      return expect(emt).toBe(emitter);
    });

    it("should properly remove all event listeners for specific event", function () {
      emitter.off("test1");
      expect(emitter._callbacks["test1"] === undefined).toBe(true);
      expect(emitter._callbacks["test2"].length).toBe(1);
      expect(emitter._callbacks["test3"].length).toBe(2);
      let emt = emitter.off("test2");
      expect(emitter._callbacks["test2"] === undefined).toBe(true);
      return expect(emt).toBe(emitter);
    });

    it("should properly remove specific event listener", function () {
      emitter.off("test1", callback1);
      expect(emitter._callbacks["test1"].length).toBe(1);
      expect(emitter._callbacks["test1"][0]).toBe(callback2);
      expect(emitter._callbacks["test3"].length).toBe(2);
      let emt = emitter.off("test3", callback4);
      expect(emitter._callbacks["test3"].length).toBe(1);
      expect(emitter._callbacks["test3"][0]).toBe(callback1);
      return expect(emt).toBe(emitter);
    });
  });
});
