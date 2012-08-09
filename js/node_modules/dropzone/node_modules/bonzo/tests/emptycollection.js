/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Empty-collection safety', function (test, ok) {
  function runWith(label, container) {
    var notest = []
      , zeroargs = []
      , multiargs = []
      , multiargTests = 0

    // utility functions, mainly matchers for expected vs actual
    var isEmptyContainer = function (o) {
          return !!o && o.length === 0 &&
            // if we're working with an Ender container then simply test for the 'ender' func
            (container.ender && o.ender) ||
            // if we're working with Bonzo then we can't access the Bonzo function so __proto__
            // is the best we can do (if it's available! otherwise 'length' is the best)
            (!o.__proto__ || o.__proto__ == container.__proto__)
        }
        // to check for `return this`, the most common case
      , isSameContainer = function (o) { return o === container }
        // to check for `return []`
      , isEmptyArray = function (o) {
          return !!o && o.length === 0 && Object.prototype.toString.call(o) === '[object Array]'
        }
      //, isUndefined = function (o) { return o === undefined }
      , isNull = function (o) { return o === null }
      , isFalse = function (o) { return o === false }
        // an empty function
      , K = function () {}


    //-----------------------------------------------------------------------------------------
    // This is the most important bit. We need a definition here for each Bonzo/Ender function
    // that takes one or more arguments or else you'll get failures (see below). You need to
    // define the arguments and what you expect the return value matcher for when the function is
    // called on an empty set. You can include an array of multiple tests if you have different
    // numbers and/or types of arguments.
    // Functions that don't take an argument (at all) can be omitted only if you expect the
    // function to return 'this' (the default test case for no-arg functions).
    // Also note that this data is used to test both Bonzo raw and Bonzo in Ender, though you
    // can define tests that only appear in one.

    var funcTests = {
    //  FUNCTION NAME         ARGUMENT SIGNATURE        ARGUMENTS ARRAY            EXPECTED RESULT MATCHER
        first:         { str: '',                 args: [],                expect: isEmptyContainer }
      , last:          { str: '',                 args: [],                expect: isEmptyContainer }
      , parent:        { str: '',                 args: [],                expect: isEmptyArray }
      , next:          { str: '',                 args: [],                expect: isEmptyArray }
      , previous:      { str: '',                 args: [],                expect: isEmptyArray }
      , dim:           { str: '',                 args: [],                expect: function(r) { return r.height === 0 && r.width === 0 } }
      , get:           { str: 'index',            args: [0],               expect: isNull }
      , detach:        { str: '',                 args: [],                expect: isSameContainer }
      , each: [        { str: 'fn',               args: [K],               expect: isSameContainer }
                     , { str: 'fn, scope',        args: [K, K],            expect: isSameContainer }
        ]
      , deepEach: [    { str: 'fn',               args: [K],               expect: isSameContainer }
                     , { str: 'fn, scope',        args: [K, K],            expect: isSameContainer }
        ]
      , map: [         { str: 'fn',               args: [K],               expect: isEmptyArray }
                     , { str: 'fn, reject',       args: [K, K],            expect: isEmptyArray }
        ]
      , html:          { str: 'html',             args: ['<a/>'],          expect: isSameContainer }
      , text:          { str: 'text',             args: ['text'],          expect: isSameContainer }
      , addClass:      { str: 'className',        args: ['x'],             expect: isSameContainer }
      , removeClass:   { str: 'className',        args: ['x'],             expect: isSameContainer }
      , hasClass:      { str: 'className',        args: ['x'],             expect: isFalse }
      , toggleClass: [ { str: 'className',        args: ['x'],             expect: isSameContainer }
                     , { str: 'className, true',  args: ['x', true],       expect: isSameContainer }
                     , { str: 'className, false', args: ['x', false],      expect: isSameContainer }
        ]
      , show:          { str: '',                  args: [],               expect: isSameContainer }
      , hide:          { str: '',                  args: [],               expect: isSameContainer }
      , append:        { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , prepend:       { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , appendTo:      { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , prependTo:     { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , related:       { str: 'method',            args: ['parentNode'],   expect: isEmptyArray }
      , before:        { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , after:         { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , insertBefore:  { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , insertAfter:   { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , replaceWith:   { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , css: [         { str: 'prop',              args: ['color'],        expect: isNull } // not sure about this one, depending on the browser you might get "" for an empty property on a real element and undefined for an unknown property on a real element
                     , { str: 'prop, val',         args: ['color', 'red'], expect: isSameContainer }
                     , { str: '{prop: val}',       args: [{color: 'red'}], expect: isSameContainer }
        ]
      , offset: [      { str: '',                  args: [],               expect: function (r) { return r.top === 0 && r.left === 0 && r.height === 0 && r.width === 0 } }
                     , { str: 'x, y',              args: [1, 1],           expect: isSameContainer }
        ]
      , attr: [        { str: 'key',               args: ['href'],         expect: isNull }
                     , { str: 'key, value',        args: ['href','#x'],    expect: isSameContainer }
                     , { str: '{key: value}',      args: [{href: '#x'}],   expect: isSameContainer }
        ]
      , val: [         { str: '',                  args: [],               expect: isNull }
                     , { str: 'value',             args: ['x'],            expect: isSameContainer }
        ]
      , removeAttr:    { str: 'key',               args: ['href'],         expect: isSameContainer }
      , data: [        { str: 'key',               args: ['x'],            expect: isNull }
                     , { str: 'key, value',        args: ['x','y'],        expect: isSameContainer }
        ]
      , scrollTop: [   { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'y',                 args: [1],              expect: isSameContainer }
        ]
      , scrollLeft: [  { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'x',                 args: [1],              expect: isSameContainer }
        ]
      , toggle: [      { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'fn',                args: [K],              expect: isSameContainer }
                     , { str: 'fn, type',          args: [K, 'block'],     expect: isSameContainer }
        ]
      //** Ender bridge specific functions **//
      , siblings:      { str: '',                  args: [],               expect: isEmptyContainer }
      , children:      { str: '',                  args: [],               expect: isEmptyContainer }
      , parents: [     { str: '',                  args: [],               expect: isEmptyContainer }
                     , { str: 'selector',          args: ['*'],            expect: isEmptyContainer }
        ]
      , closest: [     { str: '',                  args: [],               expect: isEmptyContainer }
                     , { str: 'selector',          args: ['*'],            expect: isEmptyContainer }
        ]
      , height: [      { str: '',                  args: [],               expect: function (r) {  return r === 0 } }
                     , { str: 'value',             args: [1],              expect: isSameContainer }
        ]
      , width: [       { str: '',                  args: [],               expect: function (r) {  return r === 0 } }
                     , { str: 'value',             args: [1],              expect: isSameContainer }
        ]
    }

    // collect info about the container's functions
    for (var p in container) {
      if (
             p !== 'color'   // introduced in test case for aug()
          && p !== '$'       // Ender self-ref
          && p !== 'forEach' // Ender native
          && typeof container[p] === 'function') {
        if (container[p].length > 0 && funcTests[p]) {
          multiargs.push(p)
          multiargTests += funcTests[p].length || 1
        } else if (container[p].length === 0) zeroargs.push(p)
        else notest.push(p)
      }
    }

    // we have ways to make you test! If you introduce a new function and it ought to have
    // tests listed above then you'll get a failure here
    test(label + ' have test data', Math.max(1, notest.length), function () {
      if (notest.length) {
        for (var i = 0; i < notest.length; i++)
          ok(false, 'test data for function "' + label + '.' + notest[i] + '()"')
      } else
        ok(true, 'test data for all "' + label + '.*()" functions')
    })

    // handle no-arg functions, default return expected is 'this', override that
    // by making an entry in the table above
    test(label + ' zero-argument functions', zeroargs.length, function () {
      for (var i = 0; i < zeroargs.length; i++) {
        var fn = zeroargs[i]
        try {
          var actual = container[fn]()
          if (funcTests[fn]) {
            ok(funcTests[fn].expect(actual)
              , 'got expected return value for "' + label + '.' + fn + '()"'
            )
          } else
            ok(isSameContainer(actual), 'got same ' + label + ' object as return value for "' + label + '.' + fn + '()"')
        } catch (ex) {
          ok(false, 'error while calling "' + label + '.' + fn + '()": ' + (ex.message || ex))
        }
      }
    })

    // for functions that take 1 or more arguments, we need an entry for each function
    // in the table above. You can have as many tests as required to cover all the bases
    test(label + ' multi-argument functions', multiargTests, function (){
      for (var i = 0; i < multiargs.length; i++) {
        var fn = multiargs[i]
          , t = funcTests[fn]
        if (!t.length) t = [t]
        for (var j = 0; j < t.length; j++) {
          try {
            var actual = container[fn].apply(container, t[j].args)
            ok(
              typeof t[j].expect === 'function' ?
                t[j].expect(actual) :
                actual == t[j].expect
              , 'got expected return value for "' + label + '.' + fn + '(' + t[j].str + ')"'
            )
          } catch (ex) {
            ok(false, 'error while calling "' + label + '.' + fn + '(' + t[j].str + ')": ' + (ex.message || ex))
          }
        }
      }
    })
  }

  runWith('Bonzo', dom([]))
  runWith('Ender', ender([]))
})