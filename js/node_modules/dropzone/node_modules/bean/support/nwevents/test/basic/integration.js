var debug = true,

  // aliases to Javascript objects Event API
  add = NW.Event.subscribe,
  rem = NW.Event.unsubscribe,
  dis = NW.Event.publish;

module("JS OBJECT INTEGRATION");

test('Event object should contain data object', function(){

    expect(1);

    add(parent, 'click', function(e){
        rem(parent, 'click', arguments.callee, false);
        equals(e.data.hello, 'world', 'e.data.hello should be "world"');
        debug && start();
    }, false);

    debug && stop(1000);

    dis(parent, 'click', {
        hello: "world"
    });

});

test('Object A should capture "done" event from Object B @bubble', function(){

    var objA = {id:"A"},
        objB = {id:"B", parentObject:objA};

    expect(4);

    add(objA, 'done', function(e){
        rem(objA, 'done', arguments.callee, false);
        equals(e.target, objB, 'Event Target should be objB');
        equals(e.target.id, 'B', 'Event target\'s id attribute should be "B"');
        equals(e.type, 'done', 'Should be "done" event');
        equals(e.eventPhase, 3, "Should be bubbling phase");
        debug && start();
    }, false);

    debug && stop(1000);

    dis(objB, 'done', false);

});

test('Object A should capture "done" event from Object B @capture', function(){

    var objA = {id:"A"},
        objB = {id:"B", parentObject:objA};

    expect(4);

    add(objA, 'done', function(e){
        rem(objA, 'done', arguments.callee, true);
        equals(e.target, objB, 'Event Target should be objB');
        equals(e.target.id, 'B', 'Evebt target\'s id attribute should be "B"');
        equals(e.type, 'done', 'Should be "done" event');
        equals(e.eventPhase, 1, "Should be capturing phase");
        debug && start();
    }, true);

    debug && stop(1000);

    dis(objB, 'done', true);

});

test('document should capture "done" event from Object B @bubble', function(){

    var objB = {id:"B", parentObject:document};

    expect(5);

    add(document, 'done', function(e){
        rem(document, 'done', arguments.callee, false);
        equals(e.target, objB, 'Event Target should be objB');
        equals(e.target.id, 'B', 'Evebt target\'s id attribute should be "B"');
        equals(e.currentTarget, document, 'Should be document');
        equals(e.type, 'done', 'Should be "done" event');
        equals(e.eventPhase, 3, "Should be bubbling phase");
        debug && start();
    }, false);

    debug && stop(1000);

    dis(objB, 'done', false);

});
