/*!
  * Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz & Jacob Thornton 2011
  * MIT License
  */

!function (context, doc, win) {

  var classOnly = /^\.([\w\-]+)$/,
      html = doc.documentElement,
      isAncestor = 'compareDocumentPosition' in html ?
        function (element, container) {
          return (container.compareDocumentPosition(element) & 16) == 16;
        } :
        function (element, container) {
          container = container == doc || container == window ? html : container;
          return container !== element && container.contains(element);
        };

  function array(ar) {
    return [].slice.call(ar, 0);
  }

  function isNode(el) {
    return (el && el.nodeType && (el.nodeType == 1 || el.nodeType == 9)) || el === window;
  }

  function uniq(ar) {
    var a = [], i, j;
    label:
    for (i = 0; i < ar.length; i++) {
      for (j = 0; j < a.length; j++) {
        if (a[j] == ar[i]) {
          continue label;
        }
      }
      a[a.length] = ar[i];
    }
    return a;
  }

  function qwery(selector, _root, m) {
    var root = (typeof _root == 'string') ? qwery(_root)[0] : (_root || doc);
    if (!root || !selector) {
      return [];
    }
    if (doc.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
      return array((root).getElementsByClassName(m[1]));
    }
    if (selector == win || selector == doc) {
      selector = selector == doc ? doc : win;
      return !_root ? [selector] : [null];
    }
    if (isNode(selector)) {
      return !root || (isAncestor(selector, root)) ? [selector] : [];
    }
    return array((root).querySelectorAll(selector));
  }


  qwery.uniq = uniq;
  var oldQwery = context.qwery;
  qwery.noConflict = function () {
    context.qwery = oldQwery;
    return this;
  };

  context['qwery'] = qwery;

}(this, document, window);