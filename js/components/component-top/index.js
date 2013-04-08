
/**
 * Module dependencies.
 */

var debounce = require('debounce')
  , html = require('./template')
  , domify = require('domify')
  , event = require('event')

/**
 * Expose `top`.
 */

module.exports = top;

/**
 * Add back-to-top link.
 *
 * @api public
 */

function top() {
  var el = domify(html)[0];
  var height = window.innerHeight;

  function onscroll() {
    var top = document.body.scrollTop;
    if (top < height / 2) return hide();
    show();
  }

  function show() {
    el.className = 'show';
  }

  function hide() {
    el.className = '';
  }

  event.bind(window, 'scroll', debounce(onscroll, 50));
  document.body.appendChild(el);
}
