!function (sink, start, global) {
  // <=IE8 garbage, lower our expectations
  var geriatric = 0

  if (typeof navigator != 'undefined' && /msie/i.test(navigator.userAgent))
    geriatric = navigator.userAgent.match(/msie (\d+(\.\d+)?);/i)[1]

  sink('Core', function (test, ok, before, after, assert) {

    test('Testing globals', 4, function () {
      ok(typeof ender == 'function', 'ender exists in global context and is a function')
      ok(typeof $ == 'function', '$ exists in global context and is a function')
      ok(typeof require == 'function', 'require exists in global context and is a function')
      ok(typeof provide == 'function', 'provide exists in global context and is a function')
    })

    test('Testing ender properties', 4, function () {
      ok(typeof ender._VERSION == 'string' && /^\d+\.\d+\.\d+(-.+)?$/.test(ender._VERSION), 'ender._VERSION is a semver key')
      ok(typeof ender.ender == 'function', 'ender.ender is a function')
      ok(typeof ender.fn == 'object', 'ender.fn is a function')
      ok(typeof ender._select == 'function', 'ender._select is a function')
    })

    test('Testing require() and provide()', 5, function () {
      var ex
        , foobar = { foo: 'bar' }
        , barfoo = { bar: 'foo' }

      try {
        require('foobar')
      } catch (e) {
        ex = e
      }
      ok((geriatric && geriatric <= 6) || !!ex, 'should throw an exception when requiring an unknown module')
      ok(geriatric || (!!ex && ex.message && /^.*foobar.* not .* defined.*$/.test(ex.message)), 'exception should say something about "foobar" not being "defined"') // should it?

      global.foobar = foobar
      ok(require('foobar') === foobar, 'require() retrieves from the global object')

      provide('barfoo', barfoo)
      ok(!global.barfoo, 'provide() doesn\'t attach to the global object')
      ok(require('barfoo') === barfoo, 'require() retrieves from internal store')
    })

    test('Testing ender() calls', 6, function () {
      function isEnder(e, selector, expected) {
        if (!e && (!selector || e.selector === selector) && typeof e.forEach == 'function')
          return false
        if (e.length != expected.length)
          return false
        for (var i = 0; i < expected.length; i++)
          if (e[i] !== expected[i])
            return false
        return true
      }

      // selector
      ok((geriatric && geriatric <= 7) || isEnder(ender('#tests'), '#tests', [ document.getElementById('tests') ]), 'ender("#id") looks up an element')
      ok((geriatric && geriatric <= 7) || isEnder(ender('ol'), 'ol', document.getElementsByTagName('ol')), 'looks up elements')

      // wrapping
      var els = document.getElementById('tests')
      ok(isEnder(ender(els), null, [ els ]), 'ender(element) wraps element')
      els = document.getElementsByTagName('script')
      ok(isEnder(ender(els), null, els), 'ender(elements) wraps elements')

      // nothing!
      ok(isEnder(ender([]), null, []), 'ender([]) gives an empty ender object')
      ok(isEnder(ender(), null, []), 'ender() gives an empty ender object')
    })

    test('Testing global ender extension', 2, function () {
      var fn1 = function () {}

      ender.ender({ 'test1fn1': fn1 })
      ok(ender.test1fn1 === fn1, 'Augmenting with ender.ender({}) works')
      ok(typeof ender().test1fn1 == 'undefined', 'Augmenting with ender.ender({}) doesn\'t augment internal call-chain')
    })

    test('Testing call-chain extension', 4, function () {
      var fn1 = function () {}
        , fn2 = function () {}

      ender.ender({ 'test2fn1': fn1 }, true)
      ok(ender().test2fn1 === fn1, 'Augmenting call-chain with ender.ender({}, true) works')
      ok(typeof ender.test2fn1 == 'undefined', 'Augmenting ender.ender({}) doesn\'t augment global ender')

      ender.fn.test2fn2 = fn2
      ok(ender().test2fn2 === fn2, 'Augmenting call-chain with ender.fn works')
      ok(typeof ender.test2fn2 == 'undefined', 'Augmenting with ender.fn doesn\'t augment global ender')

    })

    test('Testing noConflict', function (done) {
      ok(typeof ender.noConflict == 'function', 'ender.noConflict() is a function')
      var oldProvide = provide
        , oldRequire = require
      var e = $.noConflict(function (req, pro, e) {
        ok(req == oldRequire, 'old require is receveived')
        ok(pro == oldProvide, 'old provide is receveived')
        ok(e == ender, 'ender.noConflict() returns ender object in callback')
      })
      ok(e == ender, 'ender.noConflict() returns ender object')
      assert.isUndefined($, '$ is now undefined in global context and is a function')
      assert.isUndefined(provide, 'provide is now undefined')
      assert.isUndefined(require, 'require is now undefined')
      done()
    })

  })

  start()

}(
    typeof sink != 'undefined' ? sink :  require('sink-test').sink
  , typeof start != 'undefined' ? start : require('sink-test').start
  , this
)
