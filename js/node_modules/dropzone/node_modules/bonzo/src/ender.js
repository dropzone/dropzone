(function ($) {

  var b = require('bonzo')
  b.setQueryEngine($)
  $.ender(b)
  $.ender(b(), true)
  $.ender({
    create: function (node) {
      return $(b.create(node))
    }
  })

  $.id = function (id) {
    return $([document.getElementById(id)])
  }

  function indexOf(ar, val) {
    for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
    return -1
  }

  function uniq(ar) {
    var r = [], i = 0, j = 0, k, item, inIt
    for (; item = ar[i]; ++i) {
      inIt = false
      for (k = 0; k < r.length; ++k) {
        if (r[k] === item) {
          inIt = true; break
        }
      }
      if (!inIt) r[j++] = item
    }
    return r
  }

  $.ender({
    parents: function (selector, closest) {
      if (!this.length) return this
      var collection = $(selector), j, k, p, r = []
      for (j = 0, k = this.length; j < k; j++) {
        p = this[j]
        while (p = p.parentNode) {
          if (~indexOf(collection, p)) {
            r.push(p)
            if (closest) break;
          }
        }
      }
      return $(uniq(r))
    }

  , parent: function() {
      return $(uniq(b(this).parent()))
    }

  , closest: function (selector) {
      return this.parents(selector, true)
    }

  , first: function () {
      return $(this.length ? this[0] : this)
    }

  , last: function () {
      return $(this.length ? this[this.length - 1] : [])
    }

  , next: function () {
      return $(b(this).next())
    }

  , previous: function () {
      return $(b(this).previous())
    }

  , appendTo: function (t) {
      return b(this.selector).appendTo(t, this)
    }

  , prependTo: function (t) {
      return b(this.selector).prependTo(t, this)
    }

  , insertAfter: function (t) {
      return b(this.selector).insertAfter(t, this)
    }

  , insertBefore: function (t) {
      return b(this.selector).insertBefore(t, this)
    }

  , replaceWith: function (t) {
      return b(this.selector).replaceWith(t, this)
    }

  , siblings: function () {
      var i, l, p, r = []
      for (i = 0, l = this.length; i < l; i++) {
        p = this[i]
        while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
        p = this[i]
        while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
      }
      return $(r)
    }

  , children: function () {
      var i, l, el, r = []
      for (i = 0, l = this.length; i < l; i++) {
        if (!(el = b.firstChild(this[i]))) continue;
        r.push(el)
        while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
      }
      return $(uniq(r))
    }

  , height: function (v) {
      return dimension.call(this, 'height', v)
    }

  , width: function (v) {
      return dimension.call(this, 'width', v)
    }
  }, true)

  /**
   * @param {string} type either width or height
   * @param {number=} opt_v becomes a setter instead of a getter
   * @return {number}
   */
  function dimension(type, opt_v) {
    return typeof opt_v == 'undefined'
      ? b(this).dim()[type]
      : this.css(type, opt_v)
  }
}(ender));