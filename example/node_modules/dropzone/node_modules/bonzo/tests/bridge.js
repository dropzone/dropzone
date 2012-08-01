/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Ender bridge', function (test, ok) {
  test('height & width', 8, function () {
    var $el = ender(dom.create('<div/>')).css({
            height: '50px'
          , width: '200px'
          , lineHeight: 0 // old IE
        }).appendTo(document.body)

    ok($el.height() == 50, 'initial height() is 50')
    ok($el.width() == 200, 'initial width() is 200')

    $el.height(100)
    ok($el.height() == 100, 'after height(100), height() reports 100')
    ok($el.width() == 200, 'after height(100), width() reports 200')

    $el.width(20)
    ok($el.width() == 20, 'after width(20), width() reports 20')
    ok($el.height() == 100, 'after width(20), height() reports 100')

    $el.height(0)
    ok($el.height() === 0, 'after height(0), height() reports 0')

    $el.width(0)
    ok($el.width() === 0, 'after width(0), width() reports 0')

    $el.remove()
  })
})