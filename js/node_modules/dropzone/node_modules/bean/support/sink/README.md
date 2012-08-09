Sink Test
---------

An Asynchronous JavaScript Unit Testing Framework designed to run headless, or in the browser.

Sink test is used to test JavaScript that is run asynchronously whereby you tell the test a number of expectations and Sink will tell you if they each pass successfully.

How to write a Sink test
------------------------

``` js
test('should have foo', 1, function() {
  $.ajax('/foo', function(resp) {
    ok(resp.stat == '200');
  });
});
```

Loading a suite of tests
------------------------

The above example illustrates the basic syntax of a single test, however loading your tests is done via the *sink* module which exports the test and ok methods. See the example below:

``` js
sink('my module', function(test, ok, before, after) {
  before(function () {
    // run this before every test
  });

  after(function () {
    // run this after every test
  });

  test('should have foo', 2, function () {
    ok(true, 'this is basically true');
    ok(1 == 1, 'also true for you math majors');
  });
});

sink('another module', function (t, o, b, a) {
  test('a failure', 1, function () {
    ok(1 == 2, 'should fail');
  });
});

start(); // start all test modules
```

Browser support
---------------

Any browser that supports JavaScript as well as Headless via command line with Node. (see below)

``` js
// tests.js
/** this snippet can be found in src/headless.js */
var sink = require('path/to/sink');
var start = sink.start;
sink = sink.sink;

sink('some module', function (test, ok) {
  // write tests
});

sink('another module', function (test, ok) {
  // write tests
});

start();
```

in your terminal

    $ node path/to/my/tests.js

Happy testing!