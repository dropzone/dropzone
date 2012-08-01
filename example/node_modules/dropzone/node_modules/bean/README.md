Bean
----
Bean is a small, slick, cross-platform, framework-agnostic event utility designed for desktop, mobile, and touch-based browsers. In its simplest form - it works like this:

```javascript
bean.add(element, 'click', function (e) {
  console.log('hello');
});
```

API
---
Bean has five methods, each packing quite a punch.

  * bean.<code>add()</code>
  * bean.<code>one()</code>
  * bean.<code>remove()</code>
  * bean.<code>clone()</code>
  * bean.<code>fire()</code>

add()
---
<code>bean.add()</code> lets you attach event listeners to both elements and objects.

<h3>Signature</h3>

  * {1} element {DOM Element} an HTML DOM element
  * {2} event type(s) {String} an event (or multiple events) to listen to
  * {3} handler {Function} the callback function

  * {2,3} handlers {Object} a list of event keys with callback functions as the values

  * {4,n} optional args

<h3>Examples</h3>

```javascript
// simple
bean.add(element, 'click', handler);

// optional arguments passed to handler
bean.add(element, 'click', function(e, o1, o2) {
  console.log(o1, o2);
}, 'fat', 'ded');

// multiple events
bean.add(element, 'keydown keyup', handler);

// multiple handlers
bean.add(element, {
  click: function (e) {},
  mouseover: function (e) {},
  'focus blur': function (e) {}
});

// event delegated events
bean.add(element, '.content p', 'click', handler);
```

**Note**: the 5th parameter (selector engine) of previous Bean releases is now deprecated and will be removed in future versions. Use `setSelectorEngine()` instead.

Or alternatively, you can pass an array of elements (this actually cuts down on selector engine work, and is a more performant means of delegation if you know your DOM won't be changing:

```javascript
bean.add(element, [el, el2, el3], 'click', handler);
//or
bean.add(element, $('.myClass'), 'click', handler);
```

*(note: the focus, blur, and submit events will not delegate)*

<h3>Namespacing</h3>
Bean also now supports namespacing your events! This makes it much easier to target them down the line with things like remove or fire. To name space an event just add a dot followed by your unique name identifier:

```javascript
bean.add(element, 'click.fat', fn);
bean.add(element, 'click.ded', fn);
bean.add(element, 'click', fn);

//later...
bean.fire(element, 'click.ded');
bean.remove(element, 'click.fat');

//alternatively you can specify mutliple remove or fire handlers at once
bean.fire(element, 'click.ded.fat');
bean.remove(element, 'click.fat.ded');
```

one()
---
<code>bean.one()</code> is an alias for <code>bean.add()</code> except that the handler will only be executed once and then removed for the event type(s).

remove()
------
<code>bean.remove()</code> is how you get rid of listeners once you no longer want them. It's also a good idea to call remove on elements before you remove elements from your dom (this gives Bean a chance to clean up some things and prevents memory leaks)

```javascript
// remove a single event handlers
bean.remove(element, 'click', handler);

// remove all click handlers
bean.remove(element, 'click');

// remove handler for all events
bean.remove(element, handler);

// remove multiple events
bean.remove(element, 'mousedown mouseup');

// remove all events
bean.remove(element);

// remove handlers for events using object literal
bean.remove(element, { click: clickHandler, keyup: keyupHandler })
```

clone()
-----
<code>bean.clone()</code> is a method for cloning events from one element to another.

```javascript
// clone all events at once by doing this:
bean.clone(toElement, fromElement);

// clone events of a specific type
bean.clone(toElement, fromElement, 'click');
```

fire()
----
<code>bean.fire()</code> gives you the ability to trigger events.

```javascript
// fire a single event on an element
bean.fire(element, 'click');

// fire multiple types
bean.fire(element, 'mousedown mouseup');
```

setSelectorEngine()
----
<code>bean.setSelectorEngine()</code> allows you to set a default selector engine for all your delegation needs.

```javascript
bean.setSelectorEngine(qwery);
```

**Note**: `querySelectorAll()` is used as the default selector engine, this is available on most modern platforms such as mobile WebKit. To support event delegation on older browsers you will need to install a selector engine.

Custom events
-------------
Bean uses methods similar to [Dean Edwards' event model](http://dean.edwards.name/weblog/2009/03/callbacks-vs-events/) to ensure custom events behave like real events, rather than just callbacks.

For all intents and purposes, you can just think of them as native events, which will bubble up, and everything else you would expect...

use them like this:

```javascript
bean.add(element, 'partytime', handler);
bean.fire(element, 'partytime');
```

mouseenter, mouseleave
----------------------
Bean provides you with two custom DOM events, <code>mouseenter</code> and <code>mouseleave</code>. They are essentially just helpers for making your mouseover/mouseout lives a bit easier.

use them like regular events:

    bean.add(element, 'mouseenter', handler);

Object support
--------------
Good news, everything you can do in Bean with an element, you can also do with an object! This is particularly useful for working with classes or plugins.

```javascript
var inst = new Klass();
bean.add(inst, 'complete', handler);

//later on...
bean.fire(inst, 'complete');
```

Browser Support
---------------
Bean passes our tests in all the following browsers. If you've found bugs in these browsers or others please let us know!

  - IE6, IE7, IE8, IE9
  - Chrome 1-10
  - Safari 4-5
  - Firefox 3, 4

Other important browser notes
--------------
One of the great things about Bean is that it fixes a number of distinguishable browser differences and also provides proper cross-platform support for certain special events.

```javascript
// normalized browser event model for default behavior and propagation
bean.add(el, 'click', function (e) {
  e.preventDefault();
  e.stopPropagation();
});

// a simple shortcut, since you usually want preventDefault() and stopPropagation() at the same time
// (works the same as the previous example)
bean.add(el, 'click', function (e) {
  e.stop();
});

// DOMContentLoaded
bean.add(document, 'DOMContentLoaded', fn);

// mousewheel
bean.add(el, 'mousewheel', fn);

// mobile
bean.add(window, 'orientationchange', fn);

// touch events
bean.add(el, 'touchstart touchmove touchend touchcancel', fn);

// gestures
bean.add(el, 'gesturestart gesturechange gestureend', fn);
```

Building Bean
-------------
Bean uses [JSHint](http://www.jshint.com/) to keep some house rules as well as [UglifyJS](https://github.com/mishoo/UglifyJS) for its compression. For those interested in building Bean yourself. Run *make* in the root of the project.

Tests
-----
point your browser at <code>bean/tests/index.html</code>

Ender Integration API
---------------------

If you use Bean with Ender its API is greatly extended through its bridge file. This extension aims to give Bean the look and feel of jQuery, but at the tiny size of Bean.

Here's the run down of the method alias' added...

**ADD EVENTS**

 + on - <code>$(element).on('click', fn);</code> *NOTE: This API is likely to change slightly in the near future see [#55](https://github.com/fat/bean/issues/55)*
 + addListener - <code>$(element).addListener('click', fn);</code>
 + bind - <code>$(element).bind('click', fn);</code>
 + listen - <code>$(element).listen('click', fn);</code>


**REMOVE EVENTS**

 + unbind - <code>$(element).unbind('click');</code>
 + unlisten - <code>$(element).unlisten('click');</code>
 + removeListener - <code>$(element).removeListener('click');</code>


**DELEGATE EVENTS**

 + delegate - <code>$(element).delegate('.foo', 'click', fn);</code>
 + undelegate - <code>$(element).undelegate('.foo', 'click');</code>


**CLONE EVENTS**

 + cloneEvents - <code>$(element).cloneEvents('.foo', fn);</code>


**CUSTOM EVENTS**

 + fire / emit / trigger - <code>$(element).trigger('click')

**SPECIAL EVENTS**

 + hover - <code>$(element).hover(enterfn, leavefn);</code>
 + blur - <code>$(element).blur(fn);</code>
 + change - <code>$(element).change(fn);</code>
 + click - <code>$(element).click(fn);</code>
 + dblclick - <code>$(element).dblclick(fn);</code>
 + focusin - <code>$(element).focusin(fn);</code>
 + focusout - <code>$(element).focusout(fn);</code>
 + keydown - <code>$(element).keydown(fn);</code>
 + keypress - <code>$(element).keypress(fn);</code>
 + keyup - <code>$(element).keyup(fn);</code>
 + mousedown - <code>$(element).mousedown(fn);</code>
 + mouseenter - <code>$(element).mouseenter(fn);</code>
 + mouseleave - <code>$(element).mouseleave(fn);</code>
 + mouseout - <code>$(element).mouseout(fn);</code>
 + mouseover - <code>$(element).mouseover(fn);</code>
 + mouseup - <code>$(element).mouseup(fn);</code>
 + mousemove - <code>$(element).mousemove(fn);</code>
 + resize - <code>$(element).resize(fn);</code>
 + scroll - <code>$(element).scroll(fn);</code>
 + select - <code>$(element).select(fn);</code>
 + submit - <code>$(element).submit(fn);</code>
 + unload - <code>$(element).unload(fn);</code>

Contributors
-------

  * [Dustin Diaz](https://github.com/fat/bean/commits/master?author=ded)
  * [Jacob Thornton](https://github.com/fat/bean/commits/master?author=fat)
  * Follow our software [@dedfat](http://twitter.com/dedfat)
