/*globals bean:true sink:true start:true Syn:true qwery: true*/

// basic feature-tests, some tests shouldn't run in certain browsers
var features = {
    w3c: !!window.addEventListener
  , qSA: !!document.querySelectorAll
  , createEvent: (function () {
      try {
        document.createEvent('KeyEvents')
        return true
      } catch (e) {
        try {
          document.createEvent('TextEvent')
          return true
        } catch (e) { }
      }
      return false
    }())
  , message: !!window.postMessage
}

if (!window.console) window.console = { log: function () {}}

sink('no conflict', function (test, ok) {
  test('should return old bean back to context', 1, function () {
    var b = bean.noConflict()
    ok(bean() == 'success', 'old bean called')
    window.bean = b
  })
})

sink('add', function (test, ok) {

  test('add: should return the element passed in', 1, function () {
    var el = document.getElementById('input')
      , returned = bean.add(el, 'click', function () {})
    ok(el == returned, 'returns the element passed in')
    bean.remove(el)
  })

  test('add: should be able to add single events to elements', 1, function () {
    var el = document.getElementById('input')
    bean.add(el, 'click', function () {
      bean.remove(el)
      ok(true, 'adds single events to elements')
    })
    Syn.click(el)
  })

  test('add: should be able to add single events to objects', 1, function () {
    var obj = {}
    bean.add(obj, 'complete', function () {
      ok(true, 'adds single events to objects')
    })
    bean.fire(obj, 'complete')
    bean.remove(obj)
    bean.fire(obj, 'complete')
  })

  test('add: scope should be equal to element', 1, function () {
    var el = document.getElementById('input')
    bean.add(el, 'click', function (e) {
      bean.remove(el)
      ok(this == el, 'equal to element')
    })
    Syn.click(el)
  })

  test('add: should recieve an event method', 1, function () {
    var el = document.getElementById('input')
    bean.add(el, 'click', function (e) {
      bean.remove(el)
      ok(e != null, 'recieves an event method')
    })
    Syn.click(el)
  })

  test('add: should be able to pass x amount of additional arguments', 4, function () {
    var el = document.getElementById('input')
      , handler = function (e, foo, bar, baz) {
          bean.remove(el)
          ok(e != null, 'listener was called with event')
          ok(foo === 1, 'listener was called with correct argument')
          ok(bar === 2, 'listener was called with correct argument')
          ok(baz === 3, 'listener was called with correct argument')
        }
    bean.add(el, 'click', handler, 1, 2, 3)
    Syn.click(el)
  })

  test('add: should be able to add multiple events by space seperating them', 2, function () {
    var el = document.getElementById('input')
    bean.add(el, 'click keypress', function () {
      ok(true, 'adds multiple events by space seperating them')
    })
    Syn.click(el).key('j')
  })

  test('add: should add same event only one time', 1, function () {
    var el = document.getElementById('input')
      , handler = function () {ok(true, 'adds same event only one time')}
    bean.remove(el)
    bean.add(el, 'click', handler)
    bean.add(el, 'click', handler)
    bean.add(el, 'click', handler)
    Syn.click(el)
  })

  test('add: should be able to add multiple events of the same type', 3, function () {
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, 'click', function () {ok(true, 'adds multiple events of the same type 1')})
    bean.add(el, 'click', function () {ok(true, 'adds multiple events of the same type 2')})
    bean.add(el, 'click', function () {ok(true, 'adds multiple events of the same type 3')})
    Syn.click(el)
  })

  test('add: should be able to add multiple events simultaneously with an object literal', 2, function () {
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, {
      click: function () {
        ok(true, 'adds multiple events simultaneously with an object literal 1')
      },
      keydown: function () {
        ok(true, 'adds multiple events simultaneously with an object literal 2')
        bean.remove(el)
      }
    })
    Syn.click(el).key('j')
  })

  test('add: should bubble up dom', 1, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
    bean.add(el1, 'click', function () {ok(true, 'bubbles up dom')})
    Syn.click(el2)
  })

  test('add: shouldn\'t trigger event when adding additional custom event listeners', 0, function () {
    var el = document.getElementById('input')
    bean.add(el, 'foo', function () {ok(true, 'additional custom event listeners trigger event 1')})
    bean.add(el, 'foo', function () {ok(true, 'additional custom event listeners trigger event 2')})
  })

  if (features.message) {
    test('add: should bind onmessage to window', 3, function () {
      bean.add(window, 'message', function(e) {
        ok(e.data === 'hello there',            'data should be copied')
        ok(e.origin === e.originalEvent.origin, 'origin should be copied')
        ok(e.source === e.originalEvent.source, 'source should be copied')
      })

      window.postMessage('hello there', '*')
    })
  }

  test('one: should only trigger handler once', 1, function () {
    var el = document.getElementById('input')
    bean.one(el, 'click', function () { ok(true, 'handler called exactly one time') })
    Syn.click(el)
    Syn.click(el)
    Syn.click(el)
  })

  test('one: should be removable', 0, function () {
    var el = document.getElementById('input')
      , handler = function () { ok(false, 'handler shouldn\'t have been called') }
    bean.one(el, 'click', handler)
    bean.remove(el, 'click', handler)
    Syn.click(el)
    Syn.click(el)
  })

})

sink('fire', function (test, ok) {

  test('fire: should be able to fire an event', 1, function () {
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, 'click', function () {ok(true, 'fires an event')})
    bean.fire(el, 'click')
  })

  test('fire: should be able to fire multiple events by space seperation', 2, function () {
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, 'mousedown', function () {ok(true, 'fires multiple events by space seperation 1')})
    bean.add(el, 'mouseup', function () {ok(true, 'fires multiple events by space seperation 2')})
    bean.fire(el, 'mousedown mouseup')
  })

  test('fire: should be able to pass multiple arguments to custom event', 4, function () {
    // jquery like array syntax
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, 'foo', function (one, two, three) {
      ok(arguments.length == 3, 'fires an event with 3 arguments')
      ok(one == 1, 'value should equal 1')
      ok(two == 2, 'value should equal 2')
      ok(three == 3, 'value should equal 3')
    })
    bean.fire(el, 'foo', [1, 2, 3])
  })

})

sink('custom', function (test, ok) {

  test('custom: should be able to add single custom events', 1, function () {
    var el = document.getElementById('input')
    bean.remove(el)
    bean.add(el, 'partytime', function () {
      ok(true, 'add single custom events')
    })
    bean.fire(el, 'partytime')
  })

  if (features.w3c) {
    //dean edwards' onpropertychange hack doesn't bubble unfortunately :(
    test('custom: should bubble up dom like traditional events', 1, function () {
      var el1 = document.getElementById('foo')
        , el2 = document.getElementById('bar')
      bean.add(el1, 'partytime', function () {ok(true, 'bubbles up dom like traditional events')})
      bean.fire(el2, 'partytime')
    })
  }

  test('custom: should be able to add, fire and remove custom events to document', 1, function () {
    bean.remove(document)
    bean.add(document, 'justlookatthat', function () {
      ok(true, 'add custom events to document')
      bean.remove(document, 'justlookatthat')
    })
    bean.fire(document, 'justlookatthat')
    bean.fire(document, 'justlookatthat')
  })

  test('custom: should be able to add, fire and remove custom events to window', 1, function () {
    bean.remove(window)
    bean.add(window, 'spiffy', function () {
      ok(true, 'add custom events to window')
      bean.remove(window, 'spiffy')
    })
    bean.fire(window, 'spiffy')
    bean.fire(window, 'spiffy')
  })

})

sink('event object', function (test, ok) {

  test('event: should have correct target', 1, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
    bean.remove(el1, 'click')
    bean.add(el1, 'click', function (e) {ok(e.target == el2, 'has correct target')})
    Syn.click(el2)
  })

  test('event: should have stop propagation method', 1, function () {
    var el = document.getElementById('foo')
    bean.remove(el)
    bean.add(el, 'click', function (e) {ok(e.stopPropagation != null, 'has stop propagation')})
    Syn.click(el)
  })

  test('event: should have preventDefault method', 1, function () {
    var el = document.getElementById('foo')
    bean.remove(el)
    bean.add(el, 'click', function (e) {ok(e.preventDefault != null, 'has prevent default method')})
    Syn.click(el)
  })

  test('event: should have stop propagation method on custom event', 1, function () {
    var el = document.getElementById('foo')
    bean.remove(el)
    bean.add(el, 'customEvent', function (e) {ok(e.stopPropagation != null, 'has stop propagation')})
    bean.fire(el, 'customEvent')
  })

  test('event: should have preventDefault method on custom event', 1, function () {
    var el = document.getElementById('foo')
    bean.remove(el)
    bean.add(el, 'customEvent', function (e) {ok(e.preventDefault != null, 'has prevent default method')})
    bean.fire(el, 'customEvent')
  })

  if (features.createEvent) {
    test('event: stop should preventDefault and stopPropagation', 1, function () {
      // we should be able to prevent a keypress and event propagation with stop()
      // on the keypress event, checking the parent doesn't receive the keypress
      // and then checking the input contents on a keyup, it should be empty.
      var txt = document.getElementById('txt')
        , parent = document.getElementById('stopper')
        , txtHandler = function (event) {
            event.stop()
          }
        , txtCheckHandler = function (event) {
            ok(!txt.value.length, 'input is has no text after keypress')
          }
        , parentHandler = function (event) {
            ok(true, 'parent should not receive event')
            bean.remove(parent)
          }

      txt.value = ''
      bean.add(txt, 'keypress', txtHandler)
      bean.add(txt, 'keyup', txtCheckHandler)
      bean.add(parent, 'keypress', parentHandler)
      Syn.key(txt, 'f')
    })
  }

  test('event: should have keyCode', 1, function () {
    var el = document.getElementById('input')
    bean.add(el, 'keypress', function (e) {
      bean.remove(el)
      ok(e.keyCode != null, 'has keycode')
    })
    Syn.key(el, 'f')
  })

  // the idea here is that we have a whitelist in bean.js for properties to copy over from the original
  // event object (if they exist) to the new synthetic one. But, there are a bunch of browser specific
  // properties we don't care about. We list those properties here and then we check to see if there are
  // any properties in source event objects that aren't being copied to the new event objects that we
  // haven't specifically listed as 'ignorable'. This way we should be able to pick up new event properties
  // browsers as they're implemented and then make a decision as to whether they should be copied or not

  var commonIgnorables = 'cancelBubble clipboardData defaultPrevented explicitOriginalTarget getPreventDefault initEvent initUIEvent isChar originalTarget preventCapture preventBubble rangeOffset rangeParent returnValue stopImmediatePropagation synthetic'.split(' ')
      // stuff from IE8 and below
    , oldIEIgnorables = 'recordset altLeft repeat reason data behaviorCookie source contentOverflow behaviorPart url shiftLeft dataFld qualifier wheelDelta bookmarks srcFilter nextPage srcUrn origin boundElements propertyName ctrlLeft'.split(' ')
    , clickIgnorables = commonIgnorables.concat(oldIEIgnorables).concat('charCode defaultPrevented initMouseEvent keyCode layerX layerY initNSMouseEvent x y'.split(' '))
    , oldIEKeyIgnorables = 'fromElement toElement dataTransfer button x y screenX screenY clientX clientY offsetX offsetY'.split(' ')
    , keyIgnorables = commonIgnorables.concat(oldIEIgnorables).concat(oldIEKeyIgnorables).concat('initKeyEvent layerX layerY pageX pageY'.split(' '))

    , getEventObject = function (evType, elType, trigger, callback) {
        var el = document.getElementById('input')
          , handler = function (e) {
              bean.remove(el)
              callback(e)
            }
        bean.add(el, evType, handler)
        trigger(el)
      }

    , contains = function (arr, e) {
        var i = arr.length
        while (i--) {
          if (arr[i] === e) return true
        }
        return false
      }

    , verifyEventObject = function (event, ignorables) {
        var p, orig = event.originalEvent
        for (p in orig) {
          if (   !event.hasOwnProperty(p)
              && !contains(ignorables, p)
              && !/^[A-Z_\d]+$/.test(p) // STUFF_LIKE_THIS
              && !/^moz[A-Z]/.test(p) // Mozilla prefixed properties
              ) {
            ok(true, 'additional, uncopied property: "' + p + '"')
          }
        }
      }

    , testMouseEvent = function (type, syn) {
        getEventObject(
            type
          , 'button'
          , function (el) { Syn[syn || type](el) }
          , function (event) {
              ok(!!event && !!event.originalEvent && event.type === type, 'got event object')
              verifyEventObject(event, clickIgnorables)
            }
        )
      }

  test('click: has correct properties', 1, function () { testMouseEvent('click') })
  test('dblclick: has correct properties', 1, function () { testMouseEvent('dblclick') })
  test('mousedown: has correct properties', 1, function () { testMouseEvent('mousedown', 'click') })
  test('mouseup: has correct properties', 1, function () { testMouseEvent('mouseup', 'click') })

  var testKeyEvent = function (type) {
    getEventObject(
        type
      , 'input'
      , function (el) { Syn.key(el, 'f') }
      , function (event) {
          ok(!!event && !!event.originalEvent && event.type === type, 'got event object')
          verifyEventObject(event, keyIgnorables)
        }
    )
  }

  test('keyup: has correct properties', 1, function () { testKeyEvent('keyup') })
  test('keydown: has correct properties', 1, function () { testKeyEvent('keydown') })
  test('keypress: has correct properties', 1, function () { testKeyEvent('keypress') })

})

sink('remove', function (test, ok) {

  test('remove: should return the element passed in', 1, function () {
    var el = document.getElementById('foo')
      , handler = function () {}
      , returned
    bean.remove(el)
    bean.add(el, 'click', handler)
    returned = bean.remove(el, 'click', handler)
    ok(el == returned, 'returns the element passed in')
  })

  test('remove: should be able to remove a single event', 1, function () {
    var el = document.getElementById('foo')
      , handler = function () {
          ok(true, 'remove a single event')
          bean.remove(el, 'click', handler)
          Syn.click(el)
        }
    bean.remove(el)
    bean.add(el, 'click', handler)
    Syn.click(el)
  })

  test('remove: should be able to remove mulitple events with an object literal', 2, function () {
    var el = document.getElementById('input')
      , handler1 = function () {
          ok(true, 'remove mulitple events with an object literal (1)')
          bean.remove(el, {
              click: handler1
            , keydown: handler2
          })
          Syn.click(el).key('j')
        }
      , handler2 = function () {
          ok(true, 'remove mulitple events with an object literal (1)')
        }
      , handler3 = function () { // should be called once
          bean.remove(el, 'keydown', handler3)
          ok(true, 'remove mulitple events with an object literal (3)')
        }
    bean.add(el, 'click', handler1)
    bean.add(el, 'keydown', handler2)
    bean.add(el, 'keydown', handler3)
    Syn.click(el)
  })

  test('remove: should be able to remove all events of a specific type', 2, function () {
    var el = document.getElementById('input')
      , handler1 = function () {
          ok(true, 'removes all events of a specific type 1')
        }
      , handler2 = function () {
          ok(true, 'removes all events of a specific type 2')
          bean.remove(el, 'click')
          Syn.click(el)
        }
    bean.remove(el)
    bean.add(el, 'click', handler1)
    bean.add(el, 'click', handler2)
    Syn.click(el)
  })

  test('remove: should be able to remove all events of a specific type', 2, function () {
    var el = document.getElementById('input')
      , handler1 = function () {
          ok(true, 'removes all events of a specific type 1')
        }
      , handler2 = function () {
          ok(true, 'remove all events of a specific type 2')
          bean.remove(el, 'mousedown mouseup')
          Syn.click(el)
        }
    bean.remove(el)
    bean.add(el, 'mousedown', handler1)
    bean.add(el, 'mouseup', handler2)
    Syn.click(el)
  })

  test('remove: should be able to remove all events', 1, function () {
    var el = document.getElementById('input')
      , handler1 = function () {
          ok(true, 'remove all events 1')
          bean.remove(el)
          Syn.click(el).key('j')
        }
      , handler2 = function () {
          ok(true, 'remove all events 2')
        }
    bean.add(el, 'click', handler1)
    bean.add(el, 'keydown', handler2)
    Syn.click(el)
  })

  test('remove: should only remove events of specified type', 4, function () {
    // testing that bean.remove(el, type) removes *only* of that type and no others
    var el = document.getElementById('input')
      , handler1 = function (e) {
          ok(true, 'handled ' + e.type + ' event (1)')
        }
      , handler2 = function (e) {
          ok(true, 'handled ' + e.type + ' event (2)')
          bean.remove(el, e.type)
        }

    bean.add(el, 'click', handler1)
    bean.add(el, 'keyup', handler1)
    bean.add(el, 'click', handler2)
    bean.add(el, 'keyup', handler2)
    Syn.click(el)
    Syn.key(el, 'f')
    Syn.click(el)
    Syn.key(el, 'f')
  })

  test('remove: should only remove events for specified handler', 2, function () {
    // testing that bean.remove(el, fn) removes *only* that handler and no others
    var el = document.getElementById('input')
      , c = 0
      , handler1 = function (e) {
          ok(true, 'handled ' + e.type + ' event (1)')
        }
      , handler2 = function (e) {
          ok(true, 'handled ' + e.type + ' event (2)')
          if (++c == 2) bean.remove(el)
        }

    bean.add(el, 'click', handler1)
    bean.add(el, 'keyup', handler1)
    bean.add(el, 'click', handler2)
    bean.add(el, 'keyup', handler2)
    bean.remove(el, handler1)
    Syn.click(el)
    Syn.key(el, 'f')
  })

  test('remove: should be able to remove all events of a certain namespace', 3, function () {
    var el = document.getElementById('input')
      , handler1 = function () {
          ok(true, 'remove all events (1)')
          bean.remove(el, '.foo')
          Syn.click(el).key('j')
        }
      , handler2 = function () {
          ok(true, 'remove all events (2)')
        }
      , handler3 = function () { // should be called twice
          bean.remove(el, '.foo')
          ok(true, 'remove all events (3)')
        }
    bean.remove(el)
    bean.add(el, 'click.foo', handler1)
    bean.add(el, 'keydown.foo', handler2)
    bean.add(el, 'click.bar', handler3)
    Syn.click(el)
  })

})

sink('clone', function (test, ok, before, after) {
  var el1 = document.getElementById('input')
    , el2 = document.getElementById('input2')

  before(function () {
    bean.remove(el1)
    bean.remove(el2)
  })

  after(function () {
    bean.remove(el1)
    bean.remove(el2)
  })

  test('clone: should be able to clone events of a specific type from one element to another', 2, function () {
    bean.add(el2, 'click', function () {ok(true, 'clones events of a specific type from one element to another 1')})
    bean.add(el2, 'click', function () {
      ok(true, 'clone events of a specific type from one element to another 2')
      bean.remove(el1)
    })
    bean.add(el2, 'keydown', function () {
      ok(true, 'clone events of a specific type from one element to another 3')
      bean.remove(el1)
    })
    bean.clone(el1, el2, 'click')
    Syn.click(el1).key('j')
  })

  test('clone: should be able to clone all events from one element to another', 3, function () {
    bean.add(el2, 'keypress', function () {ok(true, 'clones all events from one element to another 1')})
    bean.add(el2, 'click', function () {ok(true, 'clones all events from one element to another 2')})
    bean.add(el2, 'click', function () {ok(true, 'clonesall events from one element to another 3')})
    bean.clone(el1, el2)
    Syn.click(el1).key('j')
  })

  test('clone: should firere cloned event in scope of new element', 1, function () {
    bean.add(el1, 'click', function () {
      ok(this == el2, 'scope of "this" is the element that cloned the event')
    })
    bean.clone(el2, el1)
    Syn.click(el2)
  })

  test('clone: should work with delegated events', 3, function () {
      var foo = document.createElement('div')
        , realfoo = document.getElementById('foo')
        , bang = document.getElementById('bang')

      bean.add(foo, '.bang', 'click', function (e) {
        bean.remove(foo)
        ok(true, 'fires intended event')
        ok(this == bang, 'context was set to delegated element')
        ok(e.currentTarget === bang, 'degated event has currentTarget property correctly set')
      }, qwery)

      bean.add(foo, '.baz', 'click', function () {
        ok(false, 'fires unintended event')
      }, qwery)

      bean.clone(realfoo, foo)

      Syn.click(bang)
  })
})

sink('delegation', function (test, ok) {

  test('delegate: should be able to delegate on selectors', 6, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
      , el3 = document.getElementById('baz')
      , el4 = document.getElementById('bang')
    bean.remove(el1)
    bean.remove(el2)
    bean.remove(el3)
    bean.add(el1, '.bar', 'click', function (e) {
      ok(true, 'delegation on selectors 1')
      ok(this == el2, 'delegation on selectors, context was set to delegated element 2')
      ok(e.currentTarget === el2, 'degated event has currentTarget property correctly set')
    }, qwery)
    Syn.click(el2)
    Syn.click(el3)
    Syn.click(el4)
  })

  test('delegate: should be able to delegate on arary', 4, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
      , el3 = document.getElementById('baz')
      , el4 = document.getElementById('bang')
    bean.remove(el1)
    bean.remove(el2)
    bean.remove(el3)
    bean.add(el1, [el2], 'click', function () {
      ok(true, 'delegation on arary 1')
      ok(this == el2, 'delegation on arary, context was set to delegated element 1')
    }, qwery)
    Syn.click(el2)
    Syn.click(el3)
    Syn.click(el4)
  })

  test('delegate: should be able to remove delegated handler', 1, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
      , fn = function () {
          ok(true, 'degegated event triggered once')
          bean.remove(el1, 'click', fn)
        }
    bean.remove(el1)
    bean.remove(el2)
    bean.add(el1, '.bar', 'click', fn, qwery)
    Syn.click(el2)
    Syn.click(el2)
  })

  if (features.qSA) {
    test('delegate: should use qSA if available', 6, function () {
      var el1 = document.getElementById('foo')
        , el2 = document.getElementById('bar')
        , el3 = document.getElementById('baz')
        , el4 = document.getElementById('bang')
      bean.remove(el1)
      bean.remove(el2)
      bean.remove(el3)
      bean.add(el1, '.bar', 'click', function (e) {
        ok(true, 'delegation on selectors 1')
        ok(this == el2, 'delegation on selectors, context was set to delegated element 2')
        ok(e.currentTarget === el2, 'degated event has currentTarget property correctly set')
      })
      Syn.click(el2)
      Syn.click(el3)
      Syn.click(el4)
    })
  } else {
    test('delegate: should throw error when no qSA available and no selector engine set', 1, function () {
      var el1 = document.getElementById('foo')
        , el2 = document.getElementById('bar')
      bean.remove(el1)
      bean.remove(el2)
      bean.add(el1, '.bar', 'click', function (e) {
        ok(false, 'don\'t fire delegated event without selector engine or qSA')
      })
      window.onerror = function (e) {
        ok(/Bean/.test(e.toString()), 'threw Error on delegated event trigger without selector engine or qSA')
        window.onerror = null
      }
      Syn.click(el2)
    })
  }

  test('delegate: should be able to set a default selector engine', 3 * 2 + 2 * 6, function () {
    var el1 = document.getElementById('foo')
      , el2 = document.getElementById('bar')
      , el3 = document.getElementById('baz')
      , el4 = document.getElementById('bang')
      , selector = "SELECTOR? WE DON'T NEED NO STINKIN' SELECTOR!"

    // 2 assertions, expect them twice per click = 6
    // TODO: findTarget() is called for setting event.currentTarget as well as checking for a match
    // fix this so it's only called once, otherwise it's a waste
    bean.setSelectorEngine(function (s, r) {
      ok(s === selector, 'selector engine passed correct selector string')
      ok(r === el1, 'selector engine passed correct root')
      return [ el2 ]
    })

    bean.remove(el1)
    bean.remove(el2)
    bean.remove(el3)
    // 3 assertions, expect them twice
    bean.add(el1, selector, 'click', function (e) {
      ok(true, 'delegation on selectors 1')
      ok(this == el2, 'delegation on selectors, context was set to delegated element 2')
      ok(e.currentTarget === el2, 'degated event has currentTarget property correctly set')
    })

    Syn.click(el2)
    Syn.click(el3)
    Syn.click(el4)
  })
})

sink('namespaces', function (test, ok) {

  test('namespace: should be able to name handlers', 1, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.fat', function () {ok(true, 'bubbles up dom')})
    Syn.click(el1)
  })

  test('namespace: should be able to add multiple handlers under the same namespace to the same element', 2, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.fat', function () {ok(true, 'bubbles up dom')})
    bean.add(el1, 'click.fat', function () {ok(true, 'bubbles up dom')})
    Syn.click(el1)
  })

  test('namespace: should be able to fire an event without handlers', 1, function () {
    var el1 = document.getElementById('foo'), succ = true
    bean.remove(el1)
    try {
      bean.fire(el1, 'click.fat')
    } catch (exc) {
      succ = false
    }
    ok(succ, 'fire namespaced event with no handlers')
  })

  test('namespace: should be able to target namespaced event handlers with fire', 1, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.fat', function () {ok(true, 'targets namespaced event handlers with fire (namespaced)')})
    bean.add(el1, 'click', function () {ok(true, 'targets namespaced event handlers with fire (plain)')})
    bean.fire(el1, 'click.fat')
  })

  test('namespace: should be able to target multiple namespaced event handlers with fire', 2, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.fat', function () {ok(true, 'target multiple namespaced event handlers with fire')})
    bean.add(el1, 'click.ded', function () {ok(true, 'targets multiple namespaced event handlers with fire')})
    bean.add(el1, 'click', function () {ok(true, 'targets multiple namespaced event handlers with fire')})
    bean.fire(el1, 'click.fat.ded')
  })

  test('namespace: should be able to remove handlers based on name', 1, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.ded', function () {ok(true, 'removes handlers based on name')})
    bean.add(el1, 'click', function () {ok(true, 'removes handlers based on name')})
    bean.remove(el1, 'click.ded')
    Syn.click(el1)
  })

  test('namespace: should be able to remove multiple handlers based on name', 1, function () {
    var el1 = document.getElementById('foo')
    bean.remove(el1)
    bean.add(el1, 'click.fat', function () {ok(true, 'removes multiple handlers based on name')})
    bean.add(el1, 'click.ded', function () {ok(true, 'removes multiple handlers based on name')})
    bean.add(el1, 'click', function () {ok(true, 'removes multiple handlers based on name')})
    bean.remove(el1, 'click.ded.fat')
    Syn.click(el1)
  })

})

sink('custom types', function (test, ok) {

  test('custom types: mouseenter/mouseleave should wrap simple mouseover/mouseout', 4, function () {
    var html = document.documentElement
      , foo = document.getElementById('foo')
      , bar = document.getElementById('bar')
      , bang = document.getElementById('bang')
      , me = function (e) {
          ok(true, 'triggers single mouseenter event')
          ok(e.currentTarget === foo, 'currentTarget property of event set correctly')
        }
      , ml = function (e) {
          ok(true, 'triggers single mouseleave event')
          ok(e.currentTarget === foo, 'currentTarget property of event set correctly')
        }
    bean.remove(foo)
    bean.add(foo, 'mouseenter', me)
    bean.add(foo, 'mouseleave', ml)
    // relatedTarget is where the mouse came from for mouseover and where it's going to in mouseout
    Syn.trigger('mouseover', { relatedTarget: html }, foo)
    Syn.trigger('mouseover', { relatedTarget: foo }, bar)
    Syn.trigger('mouseover', { relatedTarget: bar }, bang)
    Syn.trigger('mouseout', { relatedTarget: bar }, bang)
    Syn.trigger('mouseout', { relatedTarget: foo }, bar)
    Syn.trigger('mouseout', { relatedTarget: html }, foo)
    bean.remove(foo)
  })

  function testRemove(removeFn) {
    var html = document.documentElement
      , foo = document.getElementById('foo')
      , me = function (e) { ok(true, 'triggers single mouseenter event') }
      , ml = function (e) { ok(true, 'triggers single mouseleave event') }

    bean.remove(foo)
    bean.add(foo, 'mouseenter', me)
    bean.add(foo, 'mouseleave', ml)
    Syn.trigger('mouseover', { relatedTarget: html }, foo)
    Syn.trigger('mouseout', { relatedTarget: html }, foo)
    removeFn(foo, me, ml)
    Syn.trigger('mouseover', { relatedTarget: html }, foo)
    Syn.trigger('mouseout', { relatedTarget: html }, foo)
  }

  test('custom types: custom events should be removable', 2, function () {
    testRemove(function (foo, me, ml) {
      bean.remove(foo)
    })
  })

  test('custom types: custom events should be removable by type', 2, function () {
    testRemove(function (foo, me, ml) {
      bean.remove(foo, 'mouseenter')
      bean.remove(foo, 'mouseleave')
    })
  })

  test('custom types: custom events should be removable by type+handler', 2, function () {
    testRemove(function (foo, me, ml) {
      bean.remove(foo, 'mouseenter', me)
      bean.remove(foo, 'mouseleave', ml)
    })
  })

  test('custom types: custom events should work with deleate', 4, function () {
    var html = document.documentElement
      , foo = document.getElementById('foo')
      , bar = document.getElementById('bar')
      , bang = document.getElementById('bang')
      , me = function (e) {
          ok(true, 'triggers delegated mouseenter event')
          ok(e.currentTarget === bang, 'currentTarget property of event set correctly')
        }
      , ml = function (e) {
          ok(true, 'triggers delegated mouseleave event')
          ok(e.currentTarget === bang, 'currentTarget property of event set correctly')
        }
    bean.remove(foo)
    bean.add(foo, '.bang', 'mouseenter', me, qwery)
    bean.add(foo, '.bang', 'mouseleave', ml, qwery)
    Syn.trigger('mouseover', { relatedTarget: html }, foo)
    Syn.trigger('mouseover', { relatedTarget: foo }, bar)
    Syn.trigger('mouseover', { relatedTarget: bar }, bang)
    Syn.trigger('mouseout', { relatedTarget: bar }, bang)
    Syn.trigger('mouseout', { relatedTarget: foo }, bar)
    Syn.trigger('mouseout', { relatedTarget: html }, foo)
    bean.remove(foo)
  })
})

window.onload = start
