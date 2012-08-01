/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Element attributes', function (test, ok) {
  test('add/remove/has classes', 6, function () {
    var el = Q('#class-test')
    ok(!dom(el).hasClass('boosh'), 'element does not start off having class "boosh"')
    ok(dom(el).hasClass('existing-class'), 'element has existing class "existing-class"')
    dom(el).addClass('boosh')
    ok(dom(el).hasClass('boosh'), 'element now has class "boosh" after addClass()')
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"')
    dom(el).removeClass('boosh')
    ok(!dom(el).hasClass('boosh'), 'element no longer has class "boosh" after removeClass()')
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"')
  })

  test('add/remove/has multiple classes', 12 + 6 * 4, function () {
    var el = Q('#class-test')
    ok(!dom(el).hasClass('boosh'), 'element does not start off having class "boosh"')
    ok(!dom(el).hasClass('foo'), 'element does not start off having class "foo"')
    ok(!dom(el).hasClass('bar'), 'element does not start off having class "bar"')
    ok(dom(el).hasClass('existing-class'), 'element has existing class "existing-class"')
    dom(el).addClass('boosh foo bar')
    ok(dom(el).hasClass('boosh'), 'element now has class "boosh" after addClass()')
    ok(dom(el).hasClass('foo'), 'element now has class "foo" after addClass()')
    ok(dom(el).hasClass('bar'), 'element now has class "bar" after addClass()')
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"')
    dom(el).removeClass('foo bar boosh')
    ok(!dom(el).hasClass('boosh'), 'element no longer has class "boosh" after removeClass()')
    ok(!dom(el).hasClass('foo'), 'element no longer has class "foo" after removeClass()')
    ok(!dom(el).hasClass('bar'), 'element no longer has class "bar" after removeClass()')
    ok(el[0].className == 'existing-class', 'element is reset to class="existing-class"')

    // whitespace tests

    // 4 ok's each call
    function testwhitespace(s, expected, existing) {
      var ps = s.replace(/\t/, '\\t')
      ok(existing || !dom(el).hasClass(s), 'correctly performed !hasClass for "' + ps + '"')
      dom(el).addClass(s)
      ok(el[0].className == 'existing-class ' + expected, 'correctly added class(es) for "' + ps + '"')
      ok(existing || dom(el).hasClass(s), 'correctly performed hasClass for "' + ps + '"')
      dom(el).removeClass(s)
      ok(el[0].className == existing ? '' : 'existing-class', 'correctly removed class(es) for "' + ps + '"')
      if (existing) // reset
        el[0].className = 'existing-class'
    }

    testwhitespace('  foo', 'foo')
    testwhitespace('foo  ', 'foo')
    testwhitespace(' \tfoo ', 'foo')
    testwhitespace(' foo bar\tbaz  ', 'foo bar baz')
    // special cases of trying to re-add existing classes
    testwhitespace('existing-class foo', 'foo', true)
    testwhitespace('foo existing-class', 'foo', true)

  })

  test('toggleClass', 3, function () {
    ok($('#toggle-class').hasClass('toggle-me'), 'has class toggle-me')
    $('#toggle-class').toggleClass('toggle-me')
    ok(!$('#toggle-class').hasClass('toggle-me'), 'removed class toggle-me')
    $('#toggle-class').toggleClass('toggle-me')
    ok($('#toggle-class').hasClass('toggle-me'), 'has class toggle-me')
  })


  test('toggle multiple classes', 9, function () {
    var el = Q('#toggle-class')
    ok(dom(el).hasClass('toggle-me'), 'has class toggle-me')
    ok(!dom(el).hasClass('foo'), 'doesn\'t have class foo')
    ok(!dom(el).hasClass('bar'), 'doesn\'t have class bar')
    dom(el).toggleClass('toggle-me foo bar')
    ok(!dom(el).hasClass('toggle-me'), 'removed class toggle-me')
    ok(dom(el).hasClass('foo'), 'has class foo')
    ok(dom(el).hasClass('bar'), 'has class bar')
    dom(el).toggleClass('  foo\ttoggle-me  bar   ')
    ok(dom(el).hasClass('toggle-me'), 'has class toggle-me')
    ok(!dom(el).hasClass('foo'), 'removed class foo')
    ok(!dom(el).hasClass('bar'), 'removed class bar')
  })

  test('show and hide', 6, function () {
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow')
    $('#show-hide').hide()
    ok(Q('#show-hide')[0].offsetWidth === 0, 'element has no flow')
    $('#show-hide').show()
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow')
    $('#show-hide').hide()
    ok(Q('#show-hide')[0].offsetWidth === 0, 'element has no flow')
    $('#show-hide').attr('class','show-hide-css')
    $('#show-hide').show('block')
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow')
    $('#show-hide').hide()
    $('#show-hide').show('inline')
    ok($('#show-hide').css('display') == 'inline', 'element has flow')
  })

  test('toggle', 5, function () {
    ok($('#toggle').offset().width > 0, 'element has flow')
    $('#toggle').toggle(function () {
      ok(true, 'callback in toggle gets called')
    })
    ok($('#toggle').offset().width === 0, 'element has no flow')
    $('#toggle').toggle()
    ok($('#toggle').offset().width > 0, 'element has flow after toggling again')
    $('#toggle').toggle()
    $('#toggle').toggle(null, 'inline')
    ok($('#toggle')[0].style.display == 'inline', 'toggle accepts type override')
  })

  test('setting & getting attributes', 9, function () {
    ok($('a#twitter').attr('href') == 'http://twitter.com/', 'retrieves "href" attribute from anchor')
    ok($('a#hrefrel').attr('href') == '/relative', 'retrieves relative "href" attribute from anchor')
    ok($('a#hrefname').attr('href') == '#name', 'retrieves plain #name "href" attribute from anchor')
    ok($('img#srcabs').attr('src') == 'http://a2.twimg.com/a/1317419607/phoenix/img/twitter_logo_right.png', 'retrieves "src" attribute from image')
    ok($('img#srcrel').attr('src') == '/relative', 'retrieves relative "src" attribute from image')
    $('#resetme')[0].reset() // old IE does a funny cache-restore thing on docready, after this script is loaded but before sink is
                             // run so multiple runs can restore the value set by the next batch of sets on the input element
                             // so reset() right before we test to make sure we're in the original state and we get no failures
    var input = $('#attrs input[type="text"]')
    ok(input.val() == 'eyo', 'retrieves "value" attribute from {input} element')
    ok($('#attrs input[type="checkbox"]').attr('checked'), 'retrieves "checked" attribute without value as true')
    ok(input.attr('value', 'boosh').attr('value') == 'boosh', 'sets value attribute of input')
    input.val('eyoeyo')
    ok(input.val() == 'eyoeyo', 'val(val) can set value on input')
  })

  test('setting attributes using object', 2, function () {
    var input = $('#attrs input[type="text"]')
    input.attr({'value' : 'new-value', 'class' : 'css-class'})
    ok(input.val() == 'new-value', 'sets value attribute of input')
    ok(input.attr('class') == 'css-class', 'sets regular attribute')
  })

  test('setting & getting styles', 5, function () {
    ok($('#styles').css('margin-left') == '5px', 'margin-left is 5px by default')
    $('#styles').css('margin-left', 10)
    ok($('#styles').css('margin-left') == '10px', '10px after update. can also use unitless values')
    $('#styles').css({marginLeft: '15px'})
    ok($('#styles').css('margin-left') == '15px', 'blue after setting color with object')
    ok($('#styles div').css('float') == 'left', 'float is "left" by default')
    $('#styles div').css('float', "right")
    ok($('#styles div').css('float') == 'right', '"right" after update.')
  })

  if (!(bowser.msie && bowser.version <= 8) && !(bowser.firefox && bowser.version < 3.5)) {

    test('setting & getting transform styles', 3, function () {
      ok($('#styles').css('transform') == 'none', 'transform style blank by default')
      $('#styles').css({'transform':'rotate(30deg) scale(4)'})
      ok($('#styles').css('transform') == 'rotate(30deg) scale(4)', 'rotate(30deg) scale(4) after setting \'transform\'')
      $('#styles').css({'transform-origin':'40% 60%'})
      ok($('#styles').css('transform-origin') == '40% 60%', '40% 60% after setting \'transform-origin\' - ' + $('#styles').css('transform-origin'))
    })

  } else {

    test('setting & getting transform styles (old browser)', 3, function () {
      ok($('#styles').css('transform') == null, 'transform style returns null')
      ok($('#styles').css('transform-origin') == null, 'transform-origin style returns null')
      var ex = false
      try {
        $('#styles').css({'transform': 'rotate(30deg) scale(4)', 'transform-origin':'40% 60%'})
      } catch (e) {
        ex = true
      } finally {
        ok(!ex, 'setting transform style doesn\'t throw exception')
      }
    })

  }

  test('settings styles with a callback method', 2, function () {
    $('#callback-styles').css('margin-left', function (el) {
      ok(el == $('#callback-styles').get(0), 'element is passed back to callback')
      return el.getAttribute('data-original')
    })
    ok($('#styles').css('margin-left') == '15px', 'margin-left is 15px after setting with callback')
  })

  test('checkboxes bug', 6, function () {
    // don't trust qwery to get `:checked` pseudo right
    function checkedCount() {
      var i, cb = $('#checkboxes-bug input[type="checkbox"]'), c = 0
      for (i = 0; i < cb.length; i++) cb[i].checked && c++
      return c
    }
    ok(checkedCount() == 3, '3 checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").removeAttr('checked')
    ok(checkedCount() === 0, 'no checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").attr('checked', 'checked')
    ok(checkedCount() == 3, '3 checkboxes are checked again')
    $("#checkboxes-bug input[type='checkbox']").first().get(0).click()
    ok(checkedCount() == 2, '2 checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").removeAttr('checked')
    ok(checkedCount() === 0, 'no checkboxes are checked again')
    $("#checkboxes-bug input[type='checkbox']").attr('checked', 'checked')
    ok(checkedCount() == 3, 'all checkboxes are checked!')
  })

  test('data read and write', 18, function() {
    var el = $('#data-test'), data
      , attrCount = function(i, c) {
          for (i = c = 0; i < el[0].attributes.length; i++) !!el[0].attributes[i].nodeValue && c++
          return c
        }
      , expectedAttributes = attrCount()

    // test our DOM impact along the way, should only add a data-uid attribute & nothing else except via attr()

    el.data('disco', 'stu')
    el.data('neverGunna', 'give you up')
    ok(attrCount() == ++expectedAttributes
      , 'element has ' + expectedAttributes + ' attributes after data(k,v) calls (uid)')

    ok(el.data('foo') == 'bar', 'read existing data-* from dom')
    ok(el.data('disco') == 'stu', 'read data set by data(k,v)')

    data = el.data()
    ok(
      data &&
      data.foo === 'bar' &&
      data.disco === 'stu' &&
      data.neverGunna === 'give you up' &&
      data.hooHaa === true &&
      data.noHooHaa === false &&
      data.int === 100 &&
      data.float === 111.11 &&
      data.empty === '' &&
      data.whitespace === '   ' &&
      data.nulltastic === null
      , 'read all data, as correct type, with data()')
    ok(el.data('foo') === 'bar', 'data string #1 correct')
    ok(el.data('disco') === 'stu', 'data string #2 correct')
    ok(el.data('neverGunna') === 'give you up', 'data string #3 correct')
    ok(el.data('hooHaa') === true, 'data boolean (true) correct')
    ok(el.data('noHooHaa') === false, 'data boolean (false) correct')
    ok(el.data('int') === 100, 'data int correct')
    ok(el.data('float') === 111.11, 'data float correct')
    ok(el.data('empty') === '', 'data empty-string correct')
    ok(el.data('whitespace') === '   ', 'data whitespace correct')
    ok(el.data('nulltastic') === null, 'data null correct')
    ok(el.data('nosuchdata') === undefined, 'reading non-existant data yields undefined')
    ok(attrCount() == expectedAttributes
      , 'element still has ' + expectedAttributes + ' attributes after data(k,v),data(k) &amp; data() calls')

    // should be able to set a data-* attrib and read data from it, even after data() has looked for it previously
    el.attr('data-nosuchdata', 'such data!')
    ok(el.data('nosuchdata') === 'such data!'
      , 'reading previously non-existant data yields data written via attrib()')
    ok(attrCount() == ++expectedAttributes
      , 'element now has ' + expectedAttributes + ' attributes writing using attrib()')
  })

  test('data removal', 3, function() {
    var el = $('#data-temp'), fake, data, uid

    el.data('foo', 'bar')

    data = el.data()
    uid = el.data('node-uid')
    el.remove()

    fake = dom({
      attributes: [ { name: 'data-node-uid', value: uid } ],
      getAttribute: function () { return uid }
    }).data()

    ok(data, 'stored data object is intact after removal')
    ok(data.foo == 'bar', 'data object retains old values')
    ok(fake.nodeUid === uid && fake.foo === undefined, 'new data object is wiped clean')
  })
})