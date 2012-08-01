/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Selector engine', function (test, ok) {
  test('run insert with created nodes', 1, function () {
    var node = $.create('<p>world</p>')[0]
      , node2 = $.create('<p>hello</p>')[0]
    $([node, node2]).prependTo('.prepend-with-engine')
    ok($('.prepend-with-engine p').length == 4, 'prepends 4 elements total')
  })

  test('run insert with existing nodes', 2, function () {
    $('.prepend-with-engine p').prependTo('.prepend-with-engine-move')
    ok($('.prepend-with-engine p').length === 0, 'prepend now has no elements')
    ok($('.prepend-with-engine-move p').length == 4, 'elements were moved to target selector')
  })
})