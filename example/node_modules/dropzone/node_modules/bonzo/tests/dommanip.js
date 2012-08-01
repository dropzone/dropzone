/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('DOM Manipulation', function(test, ok, before, after, assert) {
  test('bonzo.create() should not error with empty string', 1, function () {
    var noError = true
    try {
      $('body').append('')
    } catch (ex) {
      noError = false
    } finally {
      ok(noError, '$("body").append("")')
    }
  })

  test('`create` with whitespace', 4, function() {
    var e = $.create('  <p>something in here</p>  <div/>\t')
    ok(e && e.length == 2, 'create() 2 elements with extra whitespace')
    ok(e && e.length == 2 && e[0].nodeType == 1 && e[0].tagName.toLowerCase() == 'p', 'first element of create() called with additional whitespace')
    ok(e && e.length == 2 && e[0].nodeType == 1 && e[0].innerHTML == 'something in here', 'content of first element of create() called with additional whitespace')
    ok(e && e.length == 2 && e[1].nodeType == 1 && e[1].tagName.toLowerCase() == 'div', 'second element of create() called with additional whitespace')
  })

  function testCreate(node, createFn) {
    var e, ex
    try {
      e = createFn ? createFn() : $.create('<' + node + '>')
    } catch (e) {}
    ok(e && e.length == 1 && e[0].tagName.toUpperCase() == node, 'created &lt;' + node + '&gt; element')
    ok(!ex, 'no exception while creating &lt;' + node + '&gt; element')
  }

  // omitted from these lists, can't be reliably created across browsers: FRAME FRAMESET HEAD HTML ISINDEX TITLE
  // ABBR omitted because IE6 doesn't know about it but should work in all other browsers
  // AREA omitted because FF3.6 and below can't create it with innerHTML, works in all other browsers
  var html4Tags = 'A ACRONYM ADDRESS B BDO BIG BLOCKQUOTE BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIV DL DT EM FIELDSET FONT FORM H1 H2 H3 H4 H5 H6 HR I IFRAME IMG INPUT INS KBD LABEL LEGEND LI MAP OBJECT OL OPTGROUP OPTION P PRE Q S SAMP SELECT SMALL SPAN STRIKE STRONG SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TR TT U UL VAR'.split(' ')
  var html4NoScopeTags = 'BASE LINK PARAM SCRIPT STYLE'.split(' ')

  test('`create` for HTML4 tags', html4Tags.length * 2, function() {
    for (var i = 0; i < html4Tags.length; i++)
      testCreate(html4Tags[i])
  })

  test('`create` for HTML4 NoScope tags', html4NoScopeTags.length * 2, function() {
    for (var i = 0; i < html4NoScopeTags.length; i++)
      testCreate(html4NoScopeTags[i])
  })

  test('`create` IE-NoScope SCRIPT &amp; STYLE with contents', 4, function() {
    // not expecting the contents do do anything here, just trying to insert with contents
    testCreate('SCRIPT', function() {
      return $.create('<script type="text/javascript">var foo = bar;</' + 'script>') // need '</' + 'script>' or else it'll close our main <script> body
    })
    testCreate('STYLE', function() {
      return $.create('<style type="text/css">.foo { color: red; }</style>') // need '</' + 'script>' or else it'll close our main <script> body
    })
  })

  test('should append nodes', 1, function () {
    $('#append div').append('<p>hello</p><p>world <a href="#">hunger</a></p>')
    ok(Q('#append p').length == 4, 'appended two {p} nodes on all elements')
  })

  test('should prepend nodes', 2, function () {
    $('#prepend').prepend('<p>hello</p><p>world <a href="#">hunger</a></p>')
    ok(Q('#prepend p')[0] == Q('#prepend')[0].firstChild, 'prepend two {p} nodes on all elements')
    ok(Q('#prepend p').length == 2, 'prepended 2 {p} nodes')
  })

  test('should insert nodes before target', 2, function () {
    var el = document.createElement('span')
    el.innerHTML = '<b>some <em>shiza</em></b>'
    $('.before-examples').before(el)
    ok(Q('#before span').length == 2, 'inserted all nodes')
    ok(Q('#before span')[0] == Q('.before-examples')[0].previousSibling, 'target node inserted before collection')
  })

  test('should insert nodes after target', 2, function () {
    $('.after-examples').after('<span>some <em>shiza</em></span>')
    ok(Q('#after em').length == 2, 'inserted all nodes')
    ok(Q('#after span')[0] == Q('.after-examples')[0].nextSibling, 'inserted node after target')
  })

  test('should insert target before nodes', 1, function () {
    $($.create('<p>eyo</p>')).insertBefore($('.before-target'))
    ok(Q('.before-target')[0].previousSibling.tagName.toLowerCase() == 'p', 'created element was inserted before the target')
  })

  test('should insert target after nodes', 1, function () {
    $($.create('<p>eyo</p>')).insertAfter($('.after-target'))
    ok(Q('.after-target')[0].nextSibling && Q('.after-target')[0].nextSibling.tagName.toLowerCase() == 'p', 'created element was inserted after the target')
  })

  test('should insert target after last node', 1, function () {
    $($.create('<p>eyo</p>')).insertAfter($('.after-last-target'))
    ok(Q('.after-last-target')[0].nextSibling && Q('.after-last-target')[0].nextSibling.tagName.toLowerCase() == 'p', 'created element was inserted after the target (target is last child)')
  })


  test('appendTo', 1, function () {
    var node = $.create('<p>i am append-to</p>')[0]
      , append = Q('#append-to')[0]
    $(node).appendTo(append)
    ok($('#append-to p').length == 1, '$("#append-to p").length == 1 - appended to target node')
  })

  test('prependTo', 3, function () {
    var node = $.create('<p>hello</p>')[0]
      , node2 = $.create('<p>world</p>')[0]
      , prepend = Q('#prepend-to')[0]
      // whazzis? , prependWithNoFirstChild = Q('#prepend-first-child')[0]
    $([node, node2]).prependTo(prepend)
    ok($('#prepend-to p').length == 2, '$("#prepend-to p").length == 2 - prepended to target node')
    ok($('#prepend-to p').first().html() == 'hello', 'first node is "hello"')
    ok($('#prepend-to p').last().html() == 'world', 'last node is "world"')
  })

  test('get and set html', 9, function () {
    var el, ex
      , fixture = '<p>oh yeeeeeah!</p>'
      , fixture2 = '&lt;oh yeeeeeah&gt;'
      , fixture3 = '<div>oh yeeeeeah!</div>'
      , fixture4 = '<span>oh yeeeeeah!</span>'

    $('#html').html(fixture)
    ok(Q('#html')[0].innerHTML.toLowerCase() == fixture, 'sets appropriate fixture html')
    ok($('#html').html().toLowerCase() == fixture, 'gets appropriate fixture html')

    $('#html').empty().html(fixture2)
    ok(Q('#html')[0].innerHTML == fixture2, 'sets appropriate tag-less fixture html')
    ok($('#html').html() == fixture2, 'gets appropriate tag-less fixture html')

    ex = false
    try { $('#html-p').html(fixture3) }
    catch(e) { ex = true }
    finally {
      ok(!ex, 'setting block-level fixture inside paragraph element doesn\'t throw exception')
      ok($('#html-p').html().toLowerCase() == fixture3, 'block-level element actually got appended to &lt;p&gt;')
    }

    ex = false
    try { $('#html-p').html(fixture4) }
    catch(e) { ex = true }
    finally {
      ok(!ex, 'setting inline fixture inside paragraph element doesn\'t throw exception')
      ok($('#html-p').html().toLowerCase() == fixture4, 'inline element actually got appended to &lt;p&gt;')
    }

    ex = false
    try { el = $($.create(fixture)).html(fixture)[0] }
    catch(e) { ex = true }
    finally {
      ok(el && el.innerHTML.toLowerCase().indexOf(fixture) != -1, 'got a &lt;p&gt; into a &lt;p&gt;')
    }
  })

  test('set html on special tags', 3, function () {
    var fixture = '<option class="bad">i am an option</option>'
      , fixture2 = '<option>i am an option</option><option>and yet another</option>'
      , fixture3 = 'chicka chicka chomp chomp'

    $('#html-select').append('<select id="select-test-2"/>')
    $('#select-test-2').html(fixture2)
    ok($('#select-test-2 option').length == 2, "$('#select-test-2 option').length == 2")

    $('#html-select').append('<select id="select-test"/>')
    $('#select-test').html(fixture)
    ok($('#select-test option').length == 1, "$('#select-test option').length == 1")

    $('#html-table').append('<table><tbody><tr><td id="table-test"></td></tr></tbody></table>')
    $('#table-test').html(fixture3)
    ok($('#table-test')[0].innerHTML == fixture3, 'sets appropriate html in TD element')
  })

  test('get and set text', 4, function () {
    var fixture = '<p>boosh</p>'
      , expected = '&lt;p&gt;boosh&lt;/p&gt;'

    $('#text').text(fixture)
    ok(Q('#text')[0].innerHTML.toLowerCase() == expected, 'sets appropriate fixture text')
    ok($('#text').text().toLowerCase() == fixture, 'gets appropriate fixture text')

    $('#html-table').empty().append('<table><tbody><tr><td id="table-test"></td></tr></tbody></table>')
    $('#table-test').text(fixture)
    ok($('#table-test')[0].innerHTML == expected, 'sets appropriate fixture text in TD element')
    ok($('#table-test').text() == fixture, 'gets appropriate fixture text in TD element')
  })

  test('should empty a node without removing node', 2, function () {
    ok(Q('#empty p').length == 3, 'target has 3 {p} elements')
    $('#empty').empty()
    ok(Q('#empty p').length === 0, 'target has 0 {p} elements')
  })

  test('should detach and return node list', 4, function () {
    ok(Q('#detach div').length == 2, 'target originally has 2 nodes')
    var orphans = $('#detach div').detach()
    ok(Q('#detach div').length === 0, 'target has detached 2 nodes')
    ok(orphans.length == 2, '2 orphans were returned')
    ok(!$.isAncestor(document.body, orphans[0]), 'orphans do not exist in document')
  })
})