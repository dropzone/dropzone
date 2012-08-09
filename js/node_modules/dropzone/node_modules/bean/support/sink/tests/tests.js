sink('first pass', function (test, ok, before, after) {

  before(function () {
    console.log('BEFORE');
  });

  after(function () {
    console.log('AFTER');
  });

  test('should pass a test thing or two', 2, function () {
    ok(true, 'first thing');
    ok(true, 'second thing');
  });

  test('should pass even another set of tests a test', 3, function () {
    ok(1, 'third thing');
    ok(1, 'fourth thing');
    ok(1, 'fifth thing');
  });

});

sink('secondary set', function (t, k, b, a) {

  b(function () {
    console.log('secondary before');
  });

  a(function () {
    console.log('secondary after');
  });

  t('many talented people cannot count to three', 3, function () {
    k(1, 'one');
    k(2, 'two');
    k(3, 'three');
  });

});

start();