Bonzo
-----
a library agnostic extensible DOM utility. Nothing else.
Bonzo is designed to live in any host library, or simply as a stand-alone tool for the majority of your DOM-related tasks.

<h3>It looks like this</h3>

``` js
bonzo(elements)
  .hide()
  .addClass('foo')
  .append('<p>the happs</p>')
  .css({
    color: 'red',
    'background-color': 'white'
  })
  .show()
```

Paired with a Selector Engine
-----------------------------
A great way to use Bonzo is with a selector engine (like [Qwery](https://github.com/ded/qwery) for example). You could wrap bonzo up and augment your wrapper to inherit the same methods. That looks like this:

``` js
function $(selector) {
  return bonzo(qwery(selector));
}
```

This now allows you to write the following code:

``` js
$('#content a[rel~="bookmark"]').after('√').css('text-decoration', 'none');
```

Bonzo Extension API
-------------------
One of the greatest parts about Bonzo is its simplicity to hook into the internal chain to create custom methods. For example you can create a method called **color** like this:

``` js
bonzo.aug({
  color: function (c) {
    return this.css('color', c);
  }
})

// you can now do the following
$('p').color('aqua')
```

Bonzo Full API
---------------------

  * each(callback)
    - callback (element, index)
  * map(callback, reject)
    - callback (element, index)
    - reject (element)
  * html
    - html() get
    - html(str) set
  * text
    - text() get
    - text(str) set
  * addClass(c)
  * removeClass(c)
  * hasClass(c)
  * toggleClass(c)
  * show()
  * hide()
  * first()
  * last()
  * focus()
  * blur()
  * next()
  * previous()
  * parent()
  * append(html || node)
  * appendTo(target || selector)
  * prepend(html || node)
  * prependTo(target || selector)
  * before(html || node)
  * insertBefore(target || selector)
  * after(html || node)
  * insertAfter(target || selector)
  * replaceWith(html || node)
  * css()
    - css(prop) get
    - css(prop, val) set
    - css({properties}) set
  * offset()
    - offset(x, y) set
    - offset() get
      - top
      - left
      - width
      - height
  * dim()
    - width
    - height
  * attr
    - attr(k) get
    - attr(k, v) set
    - attr(obj) set
  * removeAttr(k)
  * val
    - val() get
    - val(s) set
  * data
    - data() get all
    - data(k) get
    - data(k, v) set
  * remove()
  * empty()
  * detach()
  * scrollLeft
    - scrollLeft() get
    - scrollLeft(x) set
  * scrollTop
    - scrollTop() get
    - scrollTop(y) set
  * bonzo.aug({ properties })
  * bonzo.doc()
    - width
    - height
  * bonzo.viewport()
    - width
    - height
  * bonzo.isAncestor(container, child)
  * bonzo.noConflict

Added in the Ender bridge

  * parents(selector)
  * closest(selector)
  * siblings()
  * children()
  * width()
  * height()

Setting a query engine host
------------------
For the insertion methods you can set a query selector host (like [qwery](https://github.com/ded/qwery)).

``` js
bonzo.setQueryEngine(qwery)
bonzo(bonzo.create('<div>')).insertAfter('.boosh a')
```

The name Bonzo
--------------
Bonzo Madrid was a malicious battle school commander of whom eventually is killed by [Ender Wiggin](http://en.wikipedia.org/wiki/Ender_Wiggin). Bonzo represents the DOM, of whom we'd all love to slay.

Building
--------

    $ npm install -d
    $ make

Tests
-----

    $ open tests/tests.html

Browser support
---------------
  * IE6+
  * Chrome
  * Safari 4+
  * Firefox 3+
  * Opera

Ender integration
----------
Bonzo is a registered npm package and fits in nicely with the [Ender](http://ender.no.de) framework. If you don't have Ender, you should install now, and never look back, ever. As a side note the *query engine host* is set for you when you include it with Ender.

    $ npm install ender -g

To combine Bonzo to your Ender build, you can add it as such:

    $ ender build bonzo[,modb, modc,...]

or, add it to your existing ender package

    $ ender add bonzo

Contributors
-----

  * [Dustin Diaz](https://github.com/ded/bonzo/commits/master?author=ded)
  * [Rod Vagg](https://github.com/ded/bonzo/commits/master?author=rvagg)
  * [Jacob Thornton](https://github.com/ded/bonzo/commits/master?author=fat)
