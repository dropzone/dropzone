var debug = false,

  // aliases to DOM elements Event API
  add = NW.Event.listen,
  rem = NW.Event.unlisten,
  dis = NW.Event.dispatch,

  parentNode = document.getElementById('parent'),
  childNode = document.getElementById('child');

module("PROPAGATION");

//1
test("Event should be stopped at first listener @ bubble only", function(){

    expect(1);

    var eventType = 'keypress',

    listenerOne = function(e){
        rem(this, eventType, arguments.callee, false);
        e.stopPropagation();
        equals(e.cancelBubble, true, 'e.cancelBubble should be "true"');
    },

    listenerTwo = function(e){
        rem(this, eventType, arguments.callee, false);
        equals(e.cancelBubble, false, 'Should not be false and should not fire at all!');
    };

    add(childNode, eventType, listenerOne, false);

    add(parentNode, eventType, listenerTwo, false);

    dis(childNode, eventType);

    rem(parentNode, eventType, listenerTwo, false);

});

//2
test('four listeners should fire in proper order', function() {

    expect(12);

    var iteration = 1;

    add(childNode, 'keypress', function(e) {
        rem(childNode, 'keypress', arguments.callee, true);
        equals(iteration, 1, 'Should go first');
        equals(e.target, childNode, 'Event target should be correct');
        equals(this, childNode, 'this should be childNode element');
        iteration++;
    }, true);

    add(childNode, 'keypress', function(e) {
        rem(childNode, 'keypress', arguments.callee, false);
        equals(iteration, 2, 'Should go second');
        equals(e.target, childNode, 'Event target should be correct');
        equals(childNode, childNode, 'this should be childNode element');
        iteration++;
    }, false);

    add(parentNode, 'keypress', function(e) {
        rem(parentNode, 'keypress', arguments.callee, false);
        equals(iteration, 3, 'Should go third');
        equals(e.target, childNode, 'Event target should be correct');
        equals(this, parentNode, 'this should be target element');
        iteration++;
    }, false);

    add(document, 'keypress', function(e) {
        rem(document, 'keypress', arguments.callee, false);
        equals(iteration, 4, 'Should go last');
        equals(e.target, childNode, 'Event target should be correct');
        equals(this, document, 'this should be document');
        debug && start();
    }, false);

    debug && stop(1000);

    dis(childNode, 'keypress');

});
