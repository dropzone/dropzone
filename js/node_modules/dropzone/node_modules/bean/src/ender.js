!function ($) {
  var b = require('bean')
    , integrate = function (method, type, method2) {
        var _args = type ? [type] : []
        return function () {
          for (var i = 0, l = this.length; i < l; i++) {
            if (!arguments.length && method == 'add' && type) method = 'fire'
            b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
          }
          return this
        }
      }
    , add = integrate('add')
    , remove = integrate('remove')
    , fire = integrate('fire')

    , methods = {
          on: add // NOTE: .on() is likely to change in the near future, don't rely on this as-is see https://github.com/fat/bean/issues/55
        , addListener: add
        , bind: add
        , listen: add
        , delegate: add

        , one: integrate('one')

        , off: remove
        , unbind: remove
        , unlisten: remove
        , removeListener: remove
        , undelegate: remove

        , emit: fire
        , trigger: fire

        , cloneEvents: integrate('clone')

        , hover: function (enter, leave, i) { // i for internal
            for (i = this.length; i--;) {
              b.add.call(this, this[i], 'mouseenter', enter)
              b.add.call(this, this[i], 'mouseleave', leave)
            }
            return this
          }
      }

    , shortcuts =
         ('blur change click dblclick error focus focusin focusout keydown keypress '
        + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
        + 'mousemove resize scroll select submit unload').split(' ')

  for (var i = shortcuts.length; i--;) {
    methods[shortcuts[i]] = integrate('add', shortcuts[i])
  }

  b.setSelectorEngine($)

  $.ender(methods, true)
}(ender)
