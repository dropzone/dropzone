/*! $script.js v1.1
 https://github.com/polvero/script.js
 Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
 License: CC Attribution: http://creativecommons.org/licenses/by/3.0/
*/

!function(win, doc, timeout) {
  var script = doc.getElementsByTagName("script")[0],
      list = {}, ids = {}, delay = {}, re = /in/,
      scripts = {}, s = 'string', f = false,
      push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState',
      addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange',
      every = function() {
        return Array.every || function(ar, fn) {
          for (var i=0, j=ar.length; i < j; ++i) {
            if (!fn(ar[i], i, ar)) {
              return 0;
            }
          }
          return 1;
        };
      }(),
      each = function(ar, fn) {
        every(ar, function(el, i) {
          return !fn(el, i, ar);
        });
      };

  if (!doc[readyState] && doc[addEventListener]) {
    doc[addEventListener](domContentLoaded, function fn() {
      doc.removeEventListener(domContentLoaded, fn, f);
      doc[readyState] = "complete";
    }, f);
    doc[readyState] = "loading";
  }

  win.$script = function(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths];
    var idOrDoneIsDone = idOrDone.call,
        done = idOrDoneIsDone ? idOrDone : optDone,
        id = idOrDoneIsDone ? paths.join('') : idOrDone,
        queue = paths.length,
        loopFn = function(item) {
          return item.call ? item() : list[item];
        },
        callback = function() {
          if (!--queue) {
            list[id] = 1;
            done && done();
            for (var dset in delay) {
              every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = []);
            }
          }
        };
    if (ids[id]) {
      return;
    }
    timeout(function() {
      each(paths, function(path) {
        if (scripts[path]) {
          return;
        }
        scripts[path] = ids[id] = 1;
        var el = doc.createElement("script"),
            loaded = 0;
        el.onload = el[onreadystatechange] = function () {
          if ((el[readyState] && !(!re.test(el[readyState]))) || loaded) {
            return;
          }
          el.onload = el[onreadystatechange] = null;
          loaded = 1;
          callback();
        };
        el.async = 1;
        el.src = path;
        script.parentNode.insertBefore(el, script);
      });
    }, 0);
    return $script;
  };

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

  function domReady(fn) {
    re.test(doc[readyState]) ? timeout(function() { domReady(fn); }, 50) : fn();
  }

  win.$script.domReady = domReady;

}(this, document, setTimeout);
