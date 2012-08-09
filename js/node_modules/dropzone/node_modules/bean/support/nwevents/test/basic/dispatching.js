var debug = false,

  parentNode = document.getElementById('parent'),
  childNode = document.getElementById('child'),

  // aliases
  add = NW.Event.listen,
  rem = NW.Event.unlisten,
  dis = NW.Event.dispatch;

module("DISPATCHING");

// 1
test('Dispatching "click" event on document object', function() {

  expect(4);

  add(document, 'click', function(e) {
    rem(document, 'click', arguments.callee, false);
    equals(this, document, 'this should be document object');
    equals(e.target, document, 'target should be document object');
    equals(e.currentTarget, document, 'current target should be document object');
    equals(e.eventPhase, 2, 'Should be at-target phase');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(document, 'click');

});

// 2
test('1 listener on bubbling phase, dispatching "click" event', function() {

  expect(5);

  add(parentNode, 'click', function(e) {
    rem(parentNode, 'click', arguments.callee, false);
    equals(e.type, 'click', 'e.type should equal "click"');
    equals(e.eventPhase, 2, 'Should be at-target phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, parentNode, 'e.target should be parentNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(parentNode, 'click');

});

// 3
test('1 listener on capture phase, dispatching "click" event', function() {

  expect(5);

  add(parentNode, 'click', function(e) {
    rem(parentNode, 'click', arguments.callee, true);
    equals(e.type, 'click', 'e.type should equal "click"');
    equals(e.eventPhase, 2, 'Should be at-target phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, parentNode, 'e.target should be parentNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, true);

  debug && stop(1000);

  dis(parentNode, 'click');

});

// 4
test('Listener on parentNode should capture childNode event @ bubble', function() {

  expect(4);

  add(parentNode, 'click', function(e) {
    rem(parentNode, 'click', arguments.callee, false);
    equals(e.eventPhase, 3, 'Should be bubbling phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(childNode, 'click');

});

// 5
test('Listener on parentNode should capture childNode event @ capture', function() {

  expect(4);

  add(parentNode, 'click', function(e) {
    rem(parentNode, 'click', arguments.callee, true);
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, true);

  debug && stop(1000);

  dis(childNode, 'click');

});

// 6
test('Dispatching CUSTOM "hello" event @ at-target phase', function() {

  expect(2);

  add(parentNode, 'hello', function(e) {
    rem(parentNode, 'hello', arguments.callee, false);
    equals(e.type, 'hello', 'Event type should match custom event type');
    equals(e.eventPhase, 2, 'Should be at-target phase');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(parentNode, 'hello');

});

// 7
test('Dispatching CUSTOM "hello" event @ capture phase', function() {

  expect(2);

  add(parentNode, 'hello', function(e) {
    rem(parentNode, 'hello', arguments.callee, true);
    equals(e.type, 'hello', 'Event type should match custom event type');
    equals(e.eventPhase, 1, 'Should be capture phase');
    debug && start();
  }, true);

  debug && stop(1000);

  dis(childNode, 'hello');

});

// 8
test('Dispatching CUSTOM "hello" event @ bubble phase', function() {

  expect(2);

  add(parentNode, 'hello', function(e) {
    rem(parentNode, 'hello', arguments.callee, false);
    equals(e.type, 'hello', 'Event type should match custom event type');
    equals(e.eventPhase, 3, 'Should be bubble phase');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(childNode, 'hello');

});

// 9
test('Omitting useCapture argument, should default to bubble (false)', function() {

  expect(2);

  add(parentNode, 'click', function(e) {
    rem(parentNode, 'click', arguments.callee);
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.eventPhase, 3, 'Should be bubbling phase');
    debug && start();
  });

  debug && stop(1000);

  dis(childNode, 'click');

});

// 10
test('Listener on iframe document should capture iframe target element event @ bubble', function() {

  expect(3);

  var iframeDoc = window.frames[0].document,
      iframeTarget = iframeDoc.getElementById('target');

  add(iframeDoc, 'click', function(e) {
    rem(iframeDoc, 'click', arguments.callee, false);
    equals(e.target, iframeTarget, 'e.target should be iframe target element');
    equals(e.eventPhase, 3, 'Should be bubbling phase');
    equals(e.target.ownerDocument.title, 'A Iframe', 'Should have correct iframe title');
    debug && start();
  }, false);

  debug && stop(1000);

  dis(iframeTarget, 'click');

});

// 11
test('Listener on iframe document should capture iframe target element event @ capture', function() {

  expect(3);

  var iframeDoc = window.frames[0].document,
      iframeTarget = iframeDoc.getElementById('target');

  add(iframeDoc, 'click', function(e) {
    rem(iframeDoc, 'click', arguments.callee, true);
    equals(e.target, iframeTarget, 'e.target should be iframe target element');
    equals(e.eventPhase, 1, 'e.eventPhase should be 1');
    equals(e.target.ownerDocument.title, 'A Iframe', 'Should have correct iframe title');
  }, true);

  dis(iframeTarget, 'click');

});
