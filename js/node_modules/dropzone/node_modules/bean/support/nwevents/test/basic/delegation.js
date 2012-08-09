var debug = false,

  parentNode = document.getElementById('parent'),
  childNode = document.getElementById('child'),

  // aliases
  add = NW.Event.delegate,
  rem = NW.Event.undelegate,
  dis = NW.Event.dispatch;

module("DELEGATION");

// 1
test('delegate on document for parentNode, dispatching "click" event on childNode', function() {

  expect(5);

  add('#parent', 'click', function(e) {
    rem('#parent', 'click', arguments.callee/*, document */);
    equals(e.type, 'click', 'e.type should equal "click"');
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, childNode, 'e.target should be parentNode element');
    equals(e.currentTarget, document, 'current target should be document node');
    debug && start();
  }/*, document */);

  debug && stop(1000);

  dis(childNode, 'click');

});

// 2
test('delegate on document for parentNode, dispatching "click" event on parentNode', function() {

  expect(5);

  add('#parent', 'click', function(e) {
    rem('#parent', 'click', arguments.callee/*, document */);
    equals(e.type, 'click', 'e.type should equal "click"');
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, parentNode, 'e.target should be parentNode element');
    equals(e.currentTarget, document, 'current target should be parentNode element');
    debug && start();
  }/*, document */);

  debug && stop(1000);

  dis(parentNode, 'click');

});

// 3
test('delegate on parentNode for childNode, dispatching "click" event on childNode', function() {

  expect(5);

  add('#child', 'click', function(e) {
    rem('#child', 'click', arguments.callee, parentNode);
    equals(e.type, 'click', 'e.type should equal "click"');
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, childNode, 'this should be parentNode element');
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, parentNode);

  debug && stop(1000);

  dis(childNode, 'click');

});

// 4
test('delegate on document for parentNode, should capture mousemove on childNode', function() {

  expect(4);

  add('#parent', 'mousemove', function(e) {
    rem('#parent', 'mousemove', arguments.callee/*, document */);
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.currentTarget, document, 'current target should be document node');
    debug && start();
  }/*, document */);

  debug && stop(1000);

  dis(childNode, 'mousemove');

});

// 5
test('delegate on document for parentNode, should capture mousemove on parentNode', function() {

  expect(4);

  add('#parent', 'mousemove', function(e) {
    rem('#parent', 'mousemove', arguments.callee/*, document */);
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, parentNode, 'this should be parentNode element');
    equals(e.target, parentNode, 'e.target should be childNode element');
    equals(e.currentTarget, document, 'current target should be document node');
    debug && start();
  }/*, document */);

  debug && stop(1000);

  dis(parentNode, 'mousemove');

});

// 6
test('delegate on parentNode for childNode, should capture mousemove on childNode', function() {

  expect(4);

  add('#child', 'mousemove', function(e) {
    rem('#child', 'mousemove', arguments.callee, parentNode);
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(this, childNode, 'this should be childNode element');
    equals(e.target, childNode, 'e.target should be childNode element');
    equals(e.currentTarget, parentNode, 'current target should be parentNode element');
    debug && start();
  }, parentNode);

  debug && stop(1000);

  dis(childNode, 'mousemove');

});

// 7
test('delegates on iframe document should capture iframe target element events', function() {

  expect(3);

  var iframeDoc = window.frames[0].document,
      iframeTarget = iframeDoc.getElementById('target');

  add('#target', 'click', function(e) {
    rem('#target', 'click', arguments.callee, iframeDoc);
    equals(e.target, iframeTarget, 'e.target should be iframe target element');
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(e.target.ownerDocument.title, 'A Iframe', 'Should have correct iframe title');
    debug && start();
  }, iframeDoc);

  debug && stop(1000);

  dis(iframeTarget, 'click');

});

// 8
test('delegates on iframe root element should capture iframe target element events', function() {

  expect(5);

  var iframeDoc = window.frames[0].document,
      iframeTarget = iframeDoc.getElementById('target');

  add('#target', 'mousedown', function(e) {
    rem('#target', 'mousedown', arguments.callee, iframeDoc.documentElement);
    equals(e.type, 'mousedown', 'event type should be "mousedown"');
    equals(e.target, iframeTarget, 'e.target should be iframe target element');
    equals(e.eventPhase, 1, 'Should be capturing phase');
    equals(e.currentTarget, iframeDoc.documentElement, 'current traget should be documentElement');
    equals(e.target.ownerDocument.title, 'A Iframe', 'Should have correct iframe title');
    debug && start();
  }, iframeDoc.documentElement);

  debug && stop(1000);

  dis(iframeTarget, 'mousedown');

});
