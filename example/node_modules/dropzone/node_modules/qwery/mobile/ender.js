(function ($) {
  var q = function () {
    var r
    try {
      r = require('qwery')
    } catch (ex) {
      r = require('qwery-mobile')
    } finally {
      return r
    }
  }()

  $.pseudos = q.pseudos

  $._select = function (s, r) {
    // detect if sibling module 'bonzo' is available at run-time
    // rather than load-time since technically it's not a dependency and
    // can be loaded in any order
    // hence the lazy function re-definition
    return ($._select = (function () {
      var b
      if (typeof $.create == 'function') return function (s, r) {
        return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
      }
      try {
        b = require('bonzo')
        return function (s, r) {
          return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
        }
      } catch (e) { }
      return q
    })())(s, r)
  }

  $.ender({
      find: function (s) {
        var r = [], i, l, j, k, els
        for (i = 0, l = this.length; i < l; i++) {
          els = q(s, this[i])
          for (j = 0, k = els.length; j < k; j++) r.push(els[j])
        }
        return $(q.uniq(r))
      }
    , and: function (s) {
        var plus = $(s)
        for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
          this[i] = plus[j]
        }
        this.length += plus.length
        return this
      }
    , is: function(s, r) {
        var i, l
        for (i = 0, l = this.length; i < l; i++) {
          if (q.is(this[i], s, r)) {
            return true
          }
        }
        return false
      }
  }, true)
}(ender));
