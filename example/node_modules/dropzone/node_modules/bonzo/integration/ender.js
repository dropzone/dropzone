/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build scriptjs bean domready qwery
  * =============================================================
  */

/*!
  * Ender-JS: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * https://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context;

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {};

  function require (identifier) {
    var module = modules[identifier] || window[identifier];
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.");
    return module;
  }

  function provide (name, what) {
    return modules[name] = what;
  }

  context['provide'] = provide;
  context['require'] = require;

  // Implements Ender's $ global access object
  // =========================================

  function aug(o, o2) {
    for (var k in o2) {
      k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k]);
    }
    return o;
  }

  function boosh(s, r, els) {
                          // string || node || nodelist || window
    if (ender._select && (typeof s == 'string' || s.nodeName || s.length && 'item' in s || s == window)) {
      els = ender._select(s, r);
      els.selector = s;
    } else {
      els = isFinite(s.length) ? s : [s];
    }
    return aug(els, boosh);
  }

  function ender(s, r) {
    return boosh(s, r);
  }

  aug(ender, {
    _VERSION: '0.2.5',
    ender: function (o, chain) {
      aug(chain ? boosh : ender, o);
    },
    fn: context.$ && context.$.fn || {} // for easy compat to jQuery plugins
  });

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) {
        i in this && fn.call(scope || this[i], this[i], i, this);
      }
      // return self for chaining
      return this;
    },
    $: ender // handy reference to self
  });

  var old = context.$;
  ender.noConflict = function () {
    context.$ = old;
    return this;
  };

  (typeof module !== 'undefined') && module.exports && (module.exports = ender);
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender;

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * $script.js v1.3
    * https://github.com/ded/script.js
    * Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
    * Follow our software http://twitter.com/dedfat
    * License: MIT
    */
  !function(win, doc, timeout) {
    var head = doc.getElementsByTagName('head')[0],
        list = {}, ids = {}, delay = {},
        scripts = {}, s = 'string', f = false,
        push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState',
        addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange',
        every = function(ar, fn) {
          for (var i = 0, j = ar.length; i < j; ++i) {
            if (!fn(ar[i])) {
              return f;
            }
          }
          return 1;
        };
        function each(ar, fn) {
          every(ar, function(el) {
            return !fn(el);
          });
        }
  
    if (!doc[readyState] && doc[addEventListener]) {
      doc[addEventListener](domContentLoaded, function fn() {
        doc.removeEventListener(domContentLoaded, fn, f);
        doc[readyState] = "complete";
      }, f);
      doc[readyState] = "loading";
    }
  
    var $script = function(paths, idOrDone, optDone) {
      paths = paths[push] ? paths : [paths];
      var idOrDoneIsDone = idOrDone && idOrDone.call,
          done = idOrDoneIsDone ? idOrDone : optDone,
          id = idOrDoneIsDone ? paths.join('') : idOrDone,
          queue = paths.length;
      function loopFn(item) {
        return item.call ? item() : list[item];
      }
      function callback() {
        if (!--queue) {
          list[id] = 1;
          done && done();
          for (var dset in delay) {
            every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = []);
          }
        }
      }
      timeout(function() {
        each(paths, function(path) {
          if (scripts[path]) {
            id && (ids[id] = 1);
            scripts[path] == 2 && callback();
            return;
          }
          scripts[path] = 1;
          id && (ids[id] = 1);
          create($script.path ?
            $script.path + path + '.js' :
            path, callback);
        });
      }, 0);
      return $script;
    };
  
    function create(path, fn) {
      var el = doc.createElement("script"),
          loaded = f;
      el.onload = el.onerror = el[onreadystatechange] = function () {
        if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) {
          return;
        }
        el.onload = el[onreadystatechange] = null;
        loaded = 1;
        scripts[path] = 2;
        fn();
      };
      el.async = 1;
      el.src = path;
      head.insertBefore(el, head.firstChild);
    }
  
    $script.get = create;
  
    $script.ready = function(deps, ready, req) {
      deps = deps[push] ? deps : [deps];
      var missing = [];
      !each(deps, function(dep) {
        list[dep] || missing[push](dep);
      }) && every(deps, function(dep) {
        return list[dep];
      }) ? ready() : !function(key) {
        delay[key] = delay[key] || [];
        delay[key][push](ready);
        req && req(missing);
      }(deps.join('|'));
      return $script;
    };
  
    var old = win.$script;
    $script.noConflict = function () {
      win.$script = old;
      return this;
    };
  
    (typeof module !== 'undefined' && module.exports) ?
      (module.exports = $script) :
      (win['$script'] = $script);
  
  }(this, document, setTimeout);
  

  provide("scriptjs", module.exports);

  var $script = require('scriptjs');
  ender.ender({
    script: $script,
    ready: $script.ready,
    require: $script,
    getScript: $script.get
  });

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * bean.js - copyright Jacob Thornton 2011
    * https://github.com/fat/bean
    * MIT License
    * special thanks to:
    * dean edwards: http://dean.edwards.name/
    * dperini: https://github.com/dperini/nwevents
    * the entire mootools team: github.com/mootools/mootools-core
    */
  !function (context) {
    var __uid = 1,
        registry = {},
        collected = {},
        overOut = /over|out/,
        namespace = /[^\.]*(?=\..*)\.|.*/,
        stripName = /\..*/,
        addEvent = 'addEventListener',
        attachEvent = 'attachEvent',
        removeEvent = 'removeEventListener',
        detachEvent = 'detachEvent',
        doc = context.document || {},
        root = doc.documentElement || {},
        W3C_MODEL = root[addEvent],
        eventSupport = W3C_MODEL ? addEvent : attachEvent,
  
    isDescendant = function (parent, child) {
      var node = child.parentNode;
      while (node !== null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
    },
  
    retrieveUid = function (obj, uid) {
      return (obj.__uid = uid && (uid + '::' + __uid++) || obj.__uid || __uid++);
    },
  
    retrieveEvents = function (element) {
      var uid = retrieveUid(element);
      return (registry[uid] = registry[uid] || {});
    },
  
    listener = W3C_MODEL ? function (element, type, fn, add) {
      element[add ? addEvent : removeEvent](type, fn, false);
    } : function (element, type, fn, add, custom) {
      custom && add && (element['_on' + custom] = element['_on' + custom] || 0);
      element[add ? attachEvent : detachEvent]('on' + type, fn);
    },
  
    nativeHandler = function (element, fn, args) {
      return function (event) {
        event = fixEvent(event || ((this.ownerDocument || this.document || this).parentWindow || context).event);
        return fn.apply(element, [event].concat(args));
      };
    },
  
    customHandler = function (element, fn, type, condition, args) {
      return function (e) {
        if (condition ? condition.apply(this, arguments) : W3C_MODEL ? true : e && e.propertyName == '_on' + type || !e) {
          fn.apply(element, Array.prototype.slice.call(arguments, e ? 0 : 1).concat(args));
        }
      };
    },
  
    addListener = function (element, orgType, fn, args) {
      var type = orgType.replace(stripName, ''),
          events = retrieveEvents(element),
          handlers = events[type] || (events[type] = {}),
          originalFn = fn,
          uid = retrieveUid(fn, orgType.replace(namespace, ''));
      if (handlers[uid]) {
        return element;
      }
      var custom = customEvents[type];
      if (custom) {
        fn = custom.condition ? customHandler(element, fn, type, custom.condition) : fn;
        type = custom.base || type;
      }
      var isNative = nativeEvents[type];
      fn = isNative ? nativeHandler(element, fn, args) : customHandler(element, fn, type, false, args);
      isNative = W3C_MODEL || isNative;
      if (type == 'unload') {
        var org = fn;
        fn = function () {
          removeListener(element, type, fn) && org();
        };
      }
      element[eventSupport] && listener(element, isNative ? type : 'propertychange', fn, true, !isNative && type);
      handlers[uid] = fn;
      fn.__uid = uid;
      fn.__originalFn = originalFn;
      return type == 'unload' ? element : (collected[retrieveUid(element)] = element);
    },
  
    removeListener = function (element, orgType, handler) {
      var uid, names, uids, i, events = retrieveEvents(element), type = orgType.replace(stripName, '');
      if (!events || !events[type]) {
        return element;
      }
      names = orgType.replace(namespace, '');
      uids = names ? names.split('.') : [handler.__uid];
  
      function destroyHandler(uid) {
        handler = events[type][uid];
        if (!handler) {
          return;
        }
        delete events[type][uid];
        if (element[eventSupport]) {
          type = customEvents[type] ? customEvents[type].base : type;
          var isNative = W3C_MODEL || nativeEvents[type];
          listener(element, isNative ? type : 'propertychange', handler, false, !isNative && type);
        }
      }
  
      destroyHandler(names); //get combos
      for (i = uids.length; i--; destroyHandler(uids[i])) {} //get singles
  
      return element;
    },
  
    del = function (selector, fn, $) {
      return function (e) {
        var array = typeof selector == 'string' ? $(selector, this) : selector;
        for (var target = e.target; target && target != this; target = target.parentNode) {
          for (var i = array.length; i--;) {
            if (array[i] == target) {
              return fn.apply(target, arguments);
            }
          }
        }
      };
    },
  
    add = function (element, events, fn, delfn, $) {
      if (typeof events == 'object' && !fn) {
        for (var type in events) {
          events.hasOwnProperty(type) && add(element, type, events[type]);
        }
      } else {
        var isDel = typeof fn == 'string', types = (isDel ? fn : events).split(' ');
        fn = isDel ? del(events, delfn, $) : fn;
        for (var i = types.length; i--;) {
          addListener(element, types[i], fn, Array.prototype.slice.call(arguments, isDel ? 4 : 3));
        }
      }
      return element;
    },
  
    remove = function (element, orgEvents, fn) {
      var k, m, type, events, i,
          isString = typeof(orgEvents) == 'string',
          names = isString && orgEvents.replace(namespace, ''),
          names = names && names.split('.'),
          rm = removeListener,
          attached = retrieveEvents(element);
      if (isString && /\s/.test(orgEvents)) {
        orgEvents = orgEvents.split(' ');
        i = orgEvents.length - 1;
        while (remove(element, orgEvents[i]) && i--) {}
        return element;
      }
      events = isString ? orgEvents.replace(stripName, '') : orgEvents;
      if (!attached || names || (isString && !attached[events])) {
        for (k in attached) {
          if (attached.hasOwnProperty(k)) {
            for (i in attached[k]) {
              for (m = names.length; m--;) {
                attached[k].hasOwnProperty(i) && new RegExp('^' + names[m] + '::\\d*(\\..*)?$').test(i) && rm(element, [k, i].join('.'));
              }
            }
          }
        }
        return element;
      }
      if (typeof fn == 'function') {
        rm(element, events, fn);
      } else if (names) {
        rm(element, orgEvents);
      } else {
        rm = events ? rm : remove;
        type = isString && events;
        events = events ? (fn || attached[events] || events) : attached;
        for (k in events) {
          if (events.hasOwnProperty(k)) {
            rm(element, type || k, events[k]);
            delete events[k]; // remove unused leaf keys
          }
        }
      }
      return element;
    },
  
    fire = function (element, type, args) {
      var evt, k, i, m, types = type.split(' ');
      for (i = types.length; i--;) {
        type = types[i].replace(stripName, '');
        var isNative = nativeEvents[type],
            isNamespace = types[i].replace(namespace, ''),
            handlers = retrieveEvents(element)[type];
        if (isNamespace) {
          isNamespace = isNamespace.split('.');
          for (k = isNamespace.length; k--;) {
            for (m in handlers) {
              handlers.hasOwnProperty(m) && new RegExp('^' + isNamespace[k] + '::\\d*(\\..*)?$').test(m) && handlers[m].apply(element, [false].concat(args));
            }
          }
        } else if (!args && element[eventSupport]) {
          fireListener(isNative, type, element);
        } else {
          for (k in handlers) {
            handlers.hasOwnProperty(k) && handlers[k].apply(element, [false].concat(args));
          }
        }
      }
      return element;
    },
  
    fireListener = W3C_MODEL ? function (isNative, type, element) {
      evt = document.createEvent(isNative ? "HTMLEvents" : "UIEvents");
      evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, context, 1);
      element.dispatchEvent(evt);
    } : function (isNative, type, element) {
      isNative ? element.fireEvent('on' + type, document.createEventObject()) : element['_on' + type]++;
    },
  
    clone = function (element, from, type) {
      var events = retrieveEvents(from), obj, k;
      var uid = retrieveUid(element);
      obj = type ? events[type] : events;
      for (k in obj) {
        obj.hasOwnProperty(k) && (type ? add : clone)(element, type || from, type ? obj[k].__originalFn : k);
      }
      return element;
    },
  
    fixEvent = function (e) {
      var result = {};
      if (!e) {
        return result;
      }
      var type = e.type, target = e.target || e.srcElement;
      result.preventDefault = fixEvent.preventDefault(e);
      result.stopPropagation = fixEvent.stopPropagation(e);
      result.target = target && target.nodeType == 3 ? target.parentNode : target;
      if (~type.indexOf('key')) {
        result.keyCode = e.which || e.keyCode;
      } else if ((/click|mouse|menu/i).test(type)) {
        result.rightClick = e.which == 3 || e.button == 2;
        result.pos = { x: 0, y: 0 };
        if (e.pageX || e.pageY) {
          result.clientX = e.pageX;
          result.clientY = e.pageY;
        } else if (e.clientX || e.clientY) {
          result.clientX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          result.clientY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        overOut.test(type) && (result.relatedTarget = e.relatedTarget || e[(type == 'mouseover' ? 'from' : 'to') + 'Element']);
      }
      for (var k in e) {
        if (!(k in result)) {
          result[k] = e[k];
        }
      }
      return result;
    };
  
    fixEvent.preventDefault = function (e) {
      return function () {
        if (e.preventDefault) {
          e.preventDefault();
        }
        else {
          e.returnValue = false;
        }
      };
    };
  
    fixEvent.stopPropagation = function (e) {
      return function () {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      };
    };
  
    var nativeEvents = { click: 1, dblclick: 1, mouseup: 1, mousedown: 1, contextmenu: 1, //mouse buttons
      mousewheel: 1, DOMMouseScroll: 1, //mouse wheel
      mouseover: 1, mouseout: 1, mousemove: 1, selectstart: 1, selectend: 1, //mouse movement
      keydown: 1, keypress: 1, keyup: 1, //keyboard
      orientationchange: 1, // mobile
      touchstart: 1, touchmove: 1, touchend: 1, touchcancel: 1, // touch
      gesturestart: 1, gesturechange: 1, gestureend: 1, // gesture
      focus: 1, blur: 1, change: 1, reset: 1, select: 1, submit: 1, //form elements
      load: 1, unload: 1, beforeunload: 1, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
      error: 1, abort: 1, scroll: 1 }; //misc
  
    function check(event) {
      var related = event.relatedTarget;
      if (!related) {
        return related === null;
      }
      return (related != this && related.prefix != 'xul' && !/document/.test(this.toString()) && !isDescendant(this, related));
    }
  
    var customEvents = {
      mouseenter: { base: 'mouseover', condition: check },
      mouseleave: { base: 'mouseout', condition: check },
      mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
    };
  
    var bean = { add: add, remove: remove, clone: clone, fire: fire };
  
    var clean = function (el) {
      var uid = remove(el).__uid;
      if (uid) {
        delete collected[uid];
        delete registry[uid];
      }
    };
  
    if (context[attachEvent]) {
      add(context, 'unload', function () {
        for (var k in collected) {
          collected.hasOwnProperty(k) && clean(collected[k]);
        }
        context.CollectGarbage && CollectGarbage();
      });
    }
  
    var oldBean = context.bean;
    bean.noConflict = function () {
      context.bean = oldBean;
      return this;
    };
  
    (typeof module !== 'undefined' && module.exports) ?
      (module.exports = bean) :
      (context['bean'] = bean);
  
  }(this);

  provide("bean", module.exports);

  !function ($) {
    var b = require('bean'),
        integrate = function (method, type, method2) {
          var _args = type ? [type] : [];
          return function () {
            for (var args, i = 0, l = this.length; i < l; i++) {
              args = [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0));
              args.length == 4 && args.push($);
              !arguments.length && method == 'add' && type && (method = 'fire');
              b[method].apply(this, args);
            }
            return this;
          };
        };
  
    var add = integrate('add'),
        remove = integrate('remove'),
        fire = integrate('fire');
  
    var methods = {
  
      on: add,
      addListener: add,
      bind: add,
      listen: add,
      delegate: add,
  
      unbind: remove,
      unlisten: remove,
      removeListener: remove,
      undelegate: remove,
  
      emit: fire,
      trigger: fire,
  
      cloneEvents: integrate('clone'),
  
      hover: function (enter, leave, i) { // i for internal
        for (i = this.length; i--;) {
          b.add.call(this, this[i], 'mouseenter', enter);
          b.add.call(this, this[i], 'mouseleave', leave);
        }
        return this;
      }
    };
  
    var i, shortcuts = [
      'blur', 'change', 'click', 'dblclick', 'error', 'focus', 'focusin',
      'focusout', 'keydown', 'keypress', 'keyup', 'load', 'mousedown',
      'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mouseup', 'mousemove',
      'resize', 'scroll', 'select', 'submit', 'unload'
    ];
  
    for (i = shortcuts.length; i--;) {
      methods[shortcuts[i]] = integrate('add', shortcuts[i]);
    }
  
    $.ender(methods, true);
  }(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  !function (context, doc) {
    var fns = [], ol, fn, f = false,
        testEl = doc.documentElement,
        hack = testEl.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        addEventListener = 'addEventListener',
        onreadystatechange = 'onreadystatechange',
        loaded = /^loade|c/.test(doc.readyState);
  
    function flush(i) {
      loaded = 1;
      while (i = fns.shift()) { i() }
    }
    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f);
      flush();
    }, f);
  
  
    hack && doc.attachEvent(onreadystatechange, (ol = function () {
      if (/^c/.test(doc.readyState)) {
        doc.detachEvent(onreadystatechange, ol);
        flush();
      }
    }));
  
    context['domReady'] = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left');
            } catch (e) {
              return setTimeout(function() { context['domReady'](fn) }, 50);
            }
            fn();
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn);
      };
  
  }(this, document);
  

  provide("domready", module.exports);

  !function ($) {
    $.ender({domReady: domReady});
    $.ender({
      ready: function (f) {
        domReady(f);
        return this;
      }
    }, true);
  }(ender);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Qwery - A Blazing Fast query selector engine
    * https://github.com/ded/qwery
    * copyright Dustin Diaz & Jacob Thornton 2011
    * MIT License
    */
  
  !function (context, doc) {
  
    var c, i, j, k, l, m, o, p, r, v,
        el, node, len, found, classes, item, items, token,
        html = doc.documentElement,
        id = /#([\w\-]+)/,
        clas = /\.[\w\-]+/g,
        idOnly = /^#([\w\-]+$)/,
        classOnly = /^\.([\w\-]+)$/,
        tagOnly = /^([\w\-]+)$/,
        tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/,
        normalizr = /\s*([\s\+\~>])\s*/g,
        splitters = /[\s\>\+\~]/,
        splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\])/,
        dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g'),
        tokenizr = new RegExp(splitters.source + splittersMore.source),
        specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g,
        simple = /^([a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/,
        attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/,
        pseudo = /:([\w\-]+)(\(['"]?(\w+)['"]?\))?/,
        chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?'),
        walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      },
      '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode;
      },
      '~': function (node) {
        return node && node.previousSibling;
      },
      '+': function (node, contestant, p1, p2) {
        if (!node) {
          return false;
        }
        p1 = previous(node);
        p2 = previous(contestant);
        return p1 && p2 && p1 == p2 && p1;
      }
    };
    function cache() {
      this.c = {};
    }
    cache.prototype = {
      g: function (k) {
        return this.c[k] || undefined;
      },
      s: function (k, v) {
        this.c[k] = v;
        return v;
      }
    };
  
    var classCache = new cache(),
        cleanCache = new cache(),
        attrCache = new cache(),
        tokenCache = new cache();
  
    function array(ar) {
      r = [];
      for (i = 0, len = ar.length; i < len; i++) {
        r[i] = ar[i];
      }
      return r;
    }
  
    function previous(n) {
      while (n = n.previousSibling) {
        if (n.nodeType == 1) {
          break;
        }
      }
      return n
    }
  
    function q(query) {
      return query.match(chunker);
    }
  
    // this next method expect at most these args
    // given => div.hello[title="world"]:foo('bar')
  
    // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  
    function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
      var m, c, k;
      if (tag && this.tagName.toLowerCase() !== tag) {
        return false;
      }
      if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) {
        return false;
      }
      if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
        for (i = classes.length; i--;) {
          c = classes[i].slice(1);
          if (!(classCache.g(c) || classCache.s(c, new RegExp('(^|\\s+)' + c + '(\\s+|$)'))).test(this.className)) {
            return false;
          }
        }
      }
      if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) {
        return false;
      }
      if (wholeAttribute && !value) {
        o = this.attributes;
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
            return this;
          }
        }
      }
      if (wholeAttribute && !checkAttr(qualifier, this.getAttribute(attribute) || '', value)) {
        return false;
      }
      return this;
    }
  
    function clean(s) {
      return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'));
    }
  
    function checkAttr(qualify, actual, val) {
      switch (qualify) {
      case '=':
        return actual == val;
      case '^=':
        return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, new RegExp('^' + clean(val))));
      case '$=':
        return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, new RegExp(clean(val) + '$')));
      case '*=':
        return actual.match(attrCache.g(val) || attrCache.s(val, new RegExp(clean(val))));
      case '~=':
        return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, new RegExp('(?:^|\\s+)' + clean(val) + '(?:\\s+|$)')));
      case '|=':
        return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, new RegExp('^' + clean(val) + '(-|$)')));
      }
      return 0;
    }
  
    function _qwery(selector) {
      var r = [], ret = [], i, j = 0, k, l, m, p, token, tag, els, root, intr, item, children,
          tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr)),
          dividedTokens = selector.match(dividers), dividedToken;
      tokens = tokens.slice(0); // this makes a copy of the array so the cached original is not effected
      if (!tokens.length) {
        return r;
      }
  
      token = tokens.pop();
      root = tokens.length && (m = tokens[tokens.length - 1].match(idOnly)) ? doc.getElementById(m[1]) : doc;
      if (!root) {
        return r;
      }
      intr = q(token);
      els = dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ? function (r) {
          while (root = root.nextSibling) {
            root.nodeType == 1 && (intr[1] ? intr[1] == root.tagName.toLowerCase() : 1) && r.push(root)
          }
          return r
        }([]) :
        root.getElementsByTagName(intr[1] || '*');
      for (i = 0, l = els.length; i < l; i++) {
        if (item = interpret.apply(els[i], intr)) {
          r[j++] = item;
        }
      }
      if (!tokens.length) {
        return r;
      }
  
      // loop through all descendent tokens
      for (j = 0, l = r.length, k = 0; j < l; j++) {
        p = r[j];
        // loop through each token backwards crawling up tree
        for (i = tokens.length; i--;) {
          // loop through parent nodes
          while (p = walker[dividedTokens[i]](p, r[j])) {
            if (found = interpret.apply(p, q(tokens[i]))) {
              break;
            }
          }
        }
        found && (ret[k++] = r[j]);
      }
      return ret;
    }
  
    function boilerPlate(selector, _root, fn) {
      var root = (typeof _root == 'string') ? fn(_root)[0] : (_root || doc);
      if (selector === window || isNode(selector)) {
        return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : [];
      }
      if (selector && typeof selector === 'object' && isFinite(selector.length)) {
        return array(selector);
      }
      if (m = selector.match(idOnly)) {
        return (el = doc.getElementById(m[1])) ? [el] : [];
      }
      if (m = selector.match(tagOnly)) {
        return array(root.getElementsByTagName(m[1]));
      }
      return false;
    }
  
    function isNode(el) {
      return (el && el.nodeType && (el.nodeType == 1 || el.nodeType == 9));
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
  
    function qwery(selector, _root) {
      var root = (typeof _root == 'string') ? qwery(_root)[0] : (_root || doc);
      if (!root || !selector) {
        return [];
      }
      if (m = boilerPlate(selector, _root, qwery)) {
        return m;
      }
      return select(selector, root);
    }
  
    var isAncestor = 'compareDocumentPosition' in html ?
      function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16;
      } : 'contains' in html ?
      function (element, container) {
        container = container == doc || container == window ? html : container;
        return container !== element && container.contains(element);
      } :
      function (element, container) {
        while (element = element.parentNode) {
          if (element === container) {
            return 1;
          }
        }
        return 0;
      },
  
    select = (doc.querySelector && doc.querySelectorAll) ?
      function (selector, root) {
        if (doc.getElementsByClassName && (m = selector.match(classOnly))) {
          return array((root).getElementsByClassName(m[1]));
        }
        return array((root).querySelectorAll(selector));
      } :
      function (selector, root) {
        selector = selector.replace(normalizr, '$1');
        var result = [], collection, collections = [], i;
        if (m = selector.match(tagAndOrClass)) {
          items = root.getElementsByTagName(m[1] || '*');
          r = classCache.g(m[2]) || classCache.s(m[2], new RegExp('(^|\\s+)' + m[2] + '(\\s+|$)'));
          for (i = 0, l = items.length, j = 0; i < l; i++) {
            r.test(items[i].className) && (result[j++] = items[i]);
          }
          return result;
        }
        for (i = 0, items = selector.split(','), l = items.length; i < l; i++) {
          collections[i] = _qwery(items[i]);
        }
        for (i = 0, l = collections.length; i < l && (collection = collections[i]); i++) {
          var ret = collection;
          if (root !== doc) {
            ret = [];
            for (j = 0, m = collection.length; j < m && (element = collection[j]); j++) {
              // make sure element is a descendent of root
              isAncestor(element, root) && ret.push(element);
            }
          }
          result = result.concat(ret);
        }
        return uniq(result);
      };
  
    qwery.uniq = uniq;
    qwery.pseudos = {};
  
    var oldQwery = context.qwery;
    qwery.noConflict = function () {
      context.qwery = oldQwery;
      return this;
    };
    context['qwery'] = qwery;
  
  }(this, document);

  provide("qwery", module.exports);

  !function (doc) {
    var q = qwery.noConflict();
    var table = 'table',
        nodeMap = {
          thead: table,
          tbody: table,
          tfoot: table,
          tr: 'tbody',
          th: 'tr',
          td: 'tr',
          fieldset: 'form',
          option: 'select'
        }
    function create(node, root) {
      var tag = /^<([^\s>]+)/.exec(node)[1]
      var el = (root || doc).createElement(nodeMap[tag] || 'div'), els = [];
      el.innerHTML = node;
      var nodes = el.childNodes;
      el = el.firstChild;
      els.push(el);
      while (el = el.nextSibling) {
        (el.nodeType == 1) && els.push(el);
      }
      return els;
    }
    $._select = function (s, r) {
      return /^\s*</.test(s) ? create(s, r) : q(s, r);
    };
    $.pseudos = q.pseudos;
    $.ender({
      find: function (s) {
        var r = [], i, l, j, k, els;
        for (i = 0, l = this.length; i < l; i++) {
          els = q(s, this[i]);
          for (j = 0, k = els.length; j < k; j++) {
            r.push(els[j]);
          }
        }
        return $(q.uniq(r));
      }
      , and: function (s) {
        var plus = $(s);
        for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
          this[i] = plus[j];
        }
        return this;
      }
    }, true);
  }(document);

}();