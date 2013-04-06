var $, Adapter, _ref,
  __slice = [].slice;

$ = (_ref = window.jQuery) != null ? _ref : require("jquery");

module.exports = Adapter = (function() {
  function Adapter() {}

  Adapter.prototype.name = "component";

  Adapter.prototype.domReady = function(callback) {
    return $(callback);
  };

  Adapter.prototype.create = function(html) {
    return $(html);
  };

  Adapter.prototype.wrap = function(element) {
    element = $(element);
    if (element.length > 1) {
      throw new Error("Multiple elements provided.");
    }
    return element;
  };

  Adapter.prototype.unwrap = function(element) {
    return $(element)[0];
  };

  Adapter.prototype.tagName = function(element) {
    return this.unwrap(element).tagName;
  };

  Adapter.prototype.attr = function() {
    var args, element, _ref1;

    element = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref1 = $(element)).attr.apply(_ref1, args);
  };

  Adapter.prototype.data = function() {
    var args, element, _ref1;

    element = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref1 = $(element)).data.apply(_ref1, args);
  };

  Adapter.prototype.find = function(element, selector) {
    return $(element).find(selector)[0];
  };

  Adapter.prototype.findAll = function(element, selector) {
    return $(element).find(selector);
  };

  Adapter.prototype.update = function(element, content, escape) {
    element = $(element);
    if (escape) {
      return element.text(content);
    } else {
      return element.html(content);
    }
  };

  Adapter.prototype.append = function(element, child) {
    return $(element).append(child);
  };

  Adapter.prototype.remove = function(element) {
    return $(element).remove();
  };

  Adapter.prototype.addClass = function(element, className) {
    return $(element).addClass(className);
  };

  Adapter.prototype.removeClass = function(element, className) {
    return $(element).removeClass(className);
  };

  Adapter.prototype.css = function(element, properties) {
    return $(element).css(properties);
  };

  Adapter.prototype.dimensions = function(element) {
    return {
      width: $(element).outerWidth(),
      height: $(element).outerHeight()
    };
  };

  Adapter.prototype.scrollOffset = function() {
    return [window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop];
  };

  Adapter.prototype.viewportDimensions = function() {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  };

  Adapter.prototype.mousePosition = function(e) {
    if (e == null) {
      return null;
    }
    return {
      x: e.pageX,
      y: e.pageY
    };
  };

  Adapter.prototype.offset = function(element) {
    var offset;

    offset = $(element).offset();
    return {
      left: offset.left,
      top: offset.top
    };
  };

  Adapter.prototype.observe = function(element, eventName, observer) {
    return $(element).bind(eventName, observer);
  };

  Adapter.prototype.stopObserving = function(element, eventName, observer) {
    return $(element).unbind(eventName, observer);
  };

  Adapter.prototype.ajax = function(options) {
    var _ref1, _ref2;

    if (options.url == null) {
      throw new Error("No url provided");
    }
    return $.ajax({
      url: options.url,
      type: (_ref1 = (_ref2 = options.method) != null ? _ref2.toUpperCase() : void 0) != null ? _ref1 : "GET"
    }).done(function(content) {
      return typeof options.onSuccess === "function" ? options.onSuccess(content) : void 0;
    }).fail(function(request) {
      return typeof options.onError === "function" ? options.onError("Server responded with status " + request.status) : void 0;
    }).always(function() {
      return typeof options.onComplete === "function" ? options.onComplete() : void 0;
    });
  };

  Adapter.prototype.clone = function(object) {
    return $.extend({}, object);
  };

  Adapter.prototype.extend = function() {
    var sources, target;

    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return $.extend.apply($, [target].concat(__slice.call(sources)));
  };

  return Adapter;

})();
