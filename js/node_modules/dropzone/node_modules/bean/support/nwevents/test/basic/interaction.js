var debug = true,

  // aliases to DOM elements Event API
  add = NW.Event.listen,
  rem = NW.Event.unlisten,
  dis = NW.Event.dispatch;

  zone = document.getElementById('testzone');

  tests = [];

  next = function() {
    var fn = tests.shift();
    if (fn) {
      zone.style.borderColor = tests.length % 2 ? 'yellow' : 'red';
      fn();
    } else {
      zone.style.borderColor = '#999';
      zone.innerHTML = 'DONE!';
    }
  };

module('INTERACTION');

// 1
tests.push(function() {

  zone.innerHTML = '<div id="target">click me within 10 seconds or fail!</div>';
  var target = document.getElementById('target');

  test('Target should receive click event @ at-target phase IF CLICKED', function() {

    expect(4);

    add(target, 'click', function(e) {
      rem(document, 'click', arguments.callee, false);
      equals(e.type, 'click', 'Should be click event');
      equals(e.eventPhase, 2, 'Should be at at-target phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, target, 'this should be click target');
      debug && start();
      next();
    }, false);

    debug && stop(10000);

    dis(target, 'click');

  });

});

// 2
tests.push(function() {

  zone.innerHTML = '<div id="target">click me within 10 seconds or fail!</div>';
  var target = document.getElementById('target');

  test('Document should receive click event @ bubble IF CLICKED', function() {

    expect(4);

    add(document, 'click', function(e) {
      rem(document, 'click', arguments.callee, false);
      equals(e.type, 'click', 'Should be click event');
      equals(e.eventPhase, 3, 'Should be at bubble phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, false);

    debug && stop(10000);

    dis(target, 'click');

  });

});

// 3
tests.push(function() {

  zone.innerHTML = '<div id="target">click me within 10 seconds or fail!</div>';
  var target = document.getElementById('target');

  test('Document should receive click event @ capture IF CLICKED', function() {

    expect(4);

    add(document, 'click', function(e) {
      rem(document, 'click', arguments.callee, true);
      equals(e.type, 'click', 'Should be click event');
      equals(e.eventPhase, 1, 'Should be at capture phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, true);

    debug && stop(10000);

    dis(target, 'click');

  });

});

// 4
tests.push(function() {

  zone.innerHTML = '<div id="target"><input type="text" id="child" value="type something in here in 10 seconds!" /></div>';
  var target = document.getElementById('target'),
      childNode = document.getElementById('child');

  test('four listeners should fire in proper order', function() {

    var iteration = 1;

    expect(12);

    // should fire first
    add(childNode, 'keypress', function(e) {
      rem(this, 'keypress', arguments.callee, true);
      equals(iteration, 1, 'Should go first');
      equals(e.target, childNode, 'Event target should be correct');
      equals(this, childNode, 'this should be childNode element');
      iteration++;
    }, true);

    add(childNode, 'keypress', function(e) {
      rem(this, 'keypress', arguments.callee, false);
      equals(iteration, 2, 'Should go second');
      equals(e.target, childNode, 'Event target should be correct');
      equals(this, childNode, 'this should be childNode element');
      iteration++;
    }, false);

    add(target, 'keypress', function(e) {
      rem(this, 'keypress', arguments.callee, false);
      equals(iteration, 3, 'Should go third');
      equals(e.target, childNode, 'Event target should be correct');
      equals(this, target, 'this should be target element');
      iteration++;
    }, false);

    add(document, 'keypress', function(e) {
      rem(this, 'keypress', arguments.callee, false);
      equals(iteration, 4, 'Should go last');
      equals(e.target, childNode, 'Event target should be correct');
      equals(this, document, 'this should be document');
      iteration++;
      debug && start();
      next();
    }, false);

    debug && stop(10000);

    dis(childNode, 'keypress');

  });

});

// 5
tests.push(function() {

  zone.innerHTML = 'Change the value and click outside of the field.<input type="text" id="target" value="hello nurse!" />';
  var target = document.getElementById('target');

  test('Document should receive change event @ bubble IF CHANGED AND ON BLUR!', function() {

    expect(4);

    add(document, 'change', function(e) {
      rem(document, 'change', arguments.callee, false);
      equals(e.type, 'change', 'Should be change event');
      equals(e.eventPhase, 3, 'Should be at bubble phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, false);

    debug && stop(10000);

    dis(target, 'change');

  });

});

// 6
tests.push(function() {

  zone.innerHTML = 'Change the value and click outside of the field.<input type="text" id="target" value="hello nurse!" />';
  var target = document.getElementById('target');

  test('Document should receive change event @ capture IF CHANGED AND ON BLUR!', function() {

    expect(4);

    add(document, 'change', function(e) {
      rem(document, 'change', arguments.callee, true);
      equals(e.type, 'change', 'Should be change event');
      equals(e.eventPhase, 1, 'Should be at capture phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, true);

    debug && stop(10000);

    dis(target, 'change');

  });

});

// 7
tests.push(function() {

  zone.innerHTML = 'Select an option and click outside of the field.';
  zone.innerHTML += '<select id="target"><option>Choose next</option><option>Choose me</option></select>';
  var target = document.getElementById('target');

  test('Document should receive change event @ bubble IF CHANGED AND (maybe) ON BLUR!', function() {

    expect(4);

    add(document, 'change', function(e) {
      rem(document, 'change', arguments.callee, false);
      equals(e.type, 'change', 'Should be change event');
      equals(e.eventPhase, 3, 'Should be at bubble phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, false);

    debug && stop(10000);

    dis(target, 'change');

  });

});

// 8
tests.push(function() {

  zone.innerHTML = 'Select an option and click outside of the field.';
  zone.innerHTML += '<select id="target"><option>Choose next</option><option>Choose me</option></select>';
  var target = document.getElementById('target');

  test('Document should receive change event @ capture IF CHANGED AND (maybe) ON BLUR!', function() {

    expect(4);

    add(document, 'change', function(e) {
      rem(document, 'change', arguments.callee, true);
      equals(e.type, 'change', 'Should be change event');
      equals(e.eventPhase, 1, 'Should be at capture phase');
      equals(e.target, target, 'Event target should be correct');
      equals(this, document, 'this should be document');
      debug && start();
      next();
    }, true);

    debug && stop(10000);

    dis(target, 'change');

  });

});

next();

