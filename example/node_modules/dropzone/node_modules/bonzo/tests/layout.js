/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Layout', function (test, ok) {
  test('offsets', 6, function () {
    var $el = $(dom.create('<div/>')).css({
          position: 'absolute',
          left: '50px',
          top: -999
        }).appendTo(document.body)

    ok($el.offset().left == 50, 'initial offset.left is 50')
    ok($el.offset().left == 50, 'initial offset.top is -999')
    $el.offset(100, null)
    $el.offset(null, -100)
    ok($el.offset().left == 100, 'after offset(100, null), left == 100')
    ok($el.offset().top == -100, 'after offset(null, -100), top == -100')

    $el.offset(0, 0)
    ok($el.offset().top === 0, 'setting "0" doesnt become falsy')
    ok($el.offset().left === 0, 'setting "0" doesnt become falsy')
  })

  test('offset + scroll', 2, function () {
    var $el = $(dom.create('<div/>')).css({
          width: '100px',
          height: '100px',
          'max-height': '100px',
          overflow: 'scroll',
          position: 'relative'
        }).appendTo(document.body)

      , $el2 = $(dom.create('<div/>')).css({
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '50px',
          left: '50px'
        }).appendTo($el)

    $el[0].scrollTop = 50
    $el[0].scrollLeft = 50

    ok($el2.offset().top == $el.offset().top, 'account for scrollTop')
    ok($el2.offset().left == $el.offset().left, 'account for scrollLeft')
  })

  test('offset() returns 0s when element not found', 4, function () {
    var nullSet = $('div.this-element-dont-exist').offset()
    ok(!nullSet.left, 'no offset().left')
    ok(!nullSet.top, 'no offset().top')
    ok(!nullSet.width, 'no offset().width')
    ok(!nullSet.height, 'no offset().height')
  })

  test('dimensions', 5, function () {
    var $el = $(dom.create('<div/>')).css({
            position: 'absolute'
          , left: '50px'
          , top: '-999px'
          , height: '30px'
          , width: '40px'
          , padding: 0
          , border: 'solid 1px #f00'
        }).appendTo(document.body)
      , $hidden = $(dom.create('<p>some text in here</p>')).hide().css({
             marginLeft: '100px'
           , marginRight: '100px'
        }).appendTo(document.body)

    ok($el.dim().height == 32, 'dim().height is 32')
    ok($el.dim().width == 42, 'dim().width is 42')

    ok($hidden.dim().height > 0 && $hidden.dim().height < 100, 'hidden element dim().height is reasonable non-zero')
    ok($hidden.dim().width > 0 && $hidden.dim().width < 10000, 'hidden element dim().width is reasonable non-zero')
    ok($hidden[0].style.display == 'none', 'hidden element is still hidden after dim() call')
  })

  test('viewport width & height', 2, function () {
    ok(isFinite($.viewport().width), 'has width property')
    ok(isFinite($.viewport().height), 'has height property')
  })

  test('document width & height', 2, function () {
    ok(isFinite($.doc().width), 'has width property')
    ok(isFinite($.doc().height), 'has height property')
  })

  test('scrollTop && scrollLeft', 2, function () {
    // there's gotta be a better way to test this than making the spec page height: 10000px
    $(window).scrollTop(1)
    ok($(window).scrollTop() == 1, 'condition1')
    $('#overflowed').scrollLeft(150)
    ok($('#overflowed').scrollLeft() == 150, 'condition2')
  })

  test('width & height can be accessed on window and document', 2, function () {
    ok($(window).css('width') == $(document).css('width'), 'win and doc have same width')
    ok($(window).css('height') < $(document).css('height'), 'document height is much larger than win height')
  })
})