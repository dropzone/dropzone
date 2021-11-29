import { Dropzone } from "../../src/dropzone.js";

describe("Emitter", function () {
  let emitter = null;
  beforeEach(() => (emitter = new Dropzone.prototype.Emitter()));

  it(".on() should return the object itself", () =>
    emitter.on("test", function () {}).should.equal(emitter));

  it(".on() should properly register listeners", function () {
    (emitter._callbacks === undefined).should.be.true;
    let callback = function () {};
    let callback2 = function () {};
    emitter.on("test", callback);
    emitter.on("test", callback2);
    emitter.on("test2", callback);
    emitter._callbacks.test.length.should.equal(2);
    emitter._callbacks.test[0].should.equal(callback);
    emitter._callbacks.test[1].should.equal(callback2);
    emitter._callbacks.test2.length.should.equal(1);
    return emitter._callbacks.test2[0].should.equal(callback);
  });

  it(".emit() should return the object itself", () =>
    emitter.emit("test").should.equal(emitter));

  it(".emit() should properly invoke all registered callbacks with arguments", function () {
    let callCount1 = 0;
    let callCount12 = 0;
    let callCount2 = 0;
    let callback1 = function (var1, var2) {
      callCount1++;
      var1.should.equal("callback1 var1");
      return var2.should.equal("callback1 var2");
    };
    let callback12 = function (var1, var2) {
      callCount12++;
      var1.should.equal("callback1 var1");
      return var2.should.equal("callback1 var2");
    };
    let callback2 = function (var1, var2) {
      callCount2++;
      var1.should.equal("callback2 var1");
      return var2.should.equal("callback2 var2");
    };

    emitter.on("test1", callback1);
    emitter.on("test1", callback12);
    emitter.on("test2", callback2);

    callCount1.should.equal(0);
    callCount12.should.equal(0);
    callCount2.should.equal(0);

    emitter.emit("test1", "callback1 var1", "callback1 var2");

    callCount1.should.equal(1);
    callCount12.should.equal(1);
    callCount2.should.equal(0);

    emitter.emit("test2", "callback2 var1", "callback2 var2");

    callCount1.should.equal(1);
    callCount12.should.equal(1);
    callCount2.should.equal(1);

    emitter.emit("test1", "callback1 var1", "callback1 var2");

    callCount1.should.equal(2);
    callCount12.should.equal(2);
    return callCount2.should.equal(1);
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
        })
    );

    it("should work without any listeners", function () {
      emitter._callbacks = undefined;
      let emt = emitter.off();
      emitter._callbacks.should.eql({});
      return emt.should.equal(emitter);
    });

    it("should properly remove all event listeners", function () {
      let emt = emitter.off();
      emitter._callbacks.should.eql({});
      return emt.should.equal(emitter);
    });

    it("should properly remove all event listeners for specific event", function () {
      emitter.off("test1");
      (emitter._callbacks["test1"] === undefined).should.be.true;
      emitter._callbacks["test2"].length.should.equal(1);
      emitter._callbacks["test3"].length.should.equal(2);
      let emt = emitter.off("test2");
      (emitter._callbacks["test2"] === undefined).should.be.true;
      return emt.should.equal(emitter);
    });

    it("should properly remove specific event listener", function () {
      emitter.off("test1", callback1);
      emitter._callbacks["test1"].length.should.equal(1);
      emitter._callbacks["test1"][0].should.equal(callback2);
      emitter._callbacks["test3"].length.should.equal(2);
      let emt = emitter.off("test3", callback4);
      emitter._callbacks["test3"].length.should.equal(1);
      emitter._callbacks["test3"][0].should.equal(callback1);
      return emt.should.equal(emitter);
    });
  });
});
