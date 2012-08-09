!function () {
  var pseudos = qwery.pseudos, i, l, p, r, nodes, m, nthPattern = /\s*((?:\+|\-)?(\d*))n\s*((?:\+|\-)\s*\d+)?\s*/

  function children(node, ofType) {
    nodes = node.childNodes, r = []

    for (i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType == 1 && (!ofType || nodes[i].nodeName == ofType)) r.push(nodes[i])
    }
    return r
  }

  function checkNthExpr(el, nodes, a, b) {
    if (!a) return (nodes[b-1] == el)
    for (i = b, l = nodes.length; ((a > 0) ? (i <= l) : (i >= 1)); i += a) if (el == nodes[i-1]) return true
    return false
  }

  function checkNth(el, nodes, val) {
    if (isFinite(val)) return nodes[val - 1] == el
    else if (val == 'odd') return checkNthExpr(el, nodes, 2, 1)
    else if (val == 'even') return checkNthExpr(el, nodes, 2, 0)
    else if (m = nthPattern.exec(val))
      return checkNthExpr(el, nodes,
                          (m[2] ? parseInt(m[1]) : parseInt(m[1] + '1')),  // Check case where coefficient is omitted
                          (m[3] ? parseInt(m[3].replace(/\s*/, '')) : 0)) // Check case where constant is omitted

    return false
  }

  pseudos['nth-child'] = function (el, val) {
    if (!val || !(p = el.parentNode)) return false
    return checkNth(el, children(p), val)
  }

  pseudos['nth-last-child'] = function (el, val) {
    if (!val || !(p = el.parentNode)) return false
    return checkNth(el, children(p).reverse(), val)
  }

  pseudos['nth-of-type'] = function (el, val) {
    if (!val || !(p = el.parentNode)) return false
    return checkNth(el, children(p, el.nodeName), val)
  }

  pseudos['nth-last-of-type'] = function (el, val) {
    if (!val || !(p = el.parentNode)) return false
    return checkNth(el, children(p, el.nodeName).reverse(), val)
  }

  pseudos['first-child'] = function (el) { return pseudos['nth-child'](el, 1) }
  pseudos['last-child'] = function (el) { return pseudos['nth-last-child'](el, 1) }
  pseudos['first-of-type'] = function (el) { return pseudos['nth-of-type'](el, 1) }
  pseudos['last-of-type'] = function (el) { return pseudos['nth-last-of-type'](el, 1) }

  pseudos['only-child'] = function (el) {
    return (p = el.parentNode) && (nodes = children(p)) && (nodes.length == 1) && (el == nodes[0])
  };

  pseudos['only-of-type'] = function (el) {
    return (p = el.parentNode) && (nodes = children(p, el.nodeName)) && (nodes.length == 1) && (el == nodes[0])
  };

  pseudos.target = function (el) {
    return (el.getAttribute('id') == location.hash.substr(1))
  }

  pseudos.checked = function (el) { return el.checked }

  pseudos.enabled = function (el) { return !el.disabled }

  pseudos.disabled = function (el) { return el.disabled }

  pseudos.empty = function (el) { return !el.childNodes.length }

}();
