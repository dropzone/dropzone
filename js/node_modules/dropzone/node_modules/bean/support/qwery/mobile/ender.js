!function (doc, $) {
  var q = require('qwery'), b

  $.pseudos = q.pseudos

  $._select = function (s, r) {
    // detect if sibling module 'bonzo' is available at run-time
    // rather than load-time since technically it's not a dependency and
    // can be loaded in any order
    // hence the lazy function re-definition
    $._select = !(b = require('bonzo')) ? q : function (s, r) {
      return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
    }
    return b && /^\s*</.test(s) ? b.create(s, r) : q(s, r)
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
}(document, ender);
