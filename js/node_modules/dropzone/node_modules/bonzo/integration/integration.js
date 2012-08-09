sink('Ender', function(test, ok, before, after) {
  function byid(id) { return document.getElementById(id); }

  test('classes', 2, function() {
    var parents = $('#get-me').parents('div.robustr').addClass('aloha');
    parents.each(function (el, i) {
      $(el).addClass(i + '');
    });
    $('#get-me').closest('.robustr').addClass('closest robusto');

    var getme = byid('get-me');
    ok(getme.parentNode.className === 'robustr aloha 0 closest robusto', 'first parent has correct ');
    ok(getme.parentNode.parentNode.className === 'robustr aloha 1', 'second parent has correct class');
  });

  test('val', 1, function() {
    $('#input-test input[type=text]').val('hello');
    var input = document.getElementById('input-fixture');
    ok(input.value == 'hello', 'input value set');
  });

  test('css', 6, function() {
    var li = $('#color-test li');
    li.first().css('color', 'red').next().css('color', 'blue');
    li.last().css('color', 'green');
    ok(byid('first').style.color == 'red', 'first elem has color red');
    ok(byid('second').style.color == 'blue', 'second elem has color blue');
    ok(byid('last').style.color == 'green', 'third elem has color green');

    $('body').css({
      width: 500,
      margin: '0 auto',
      font: '300 14px/1.5 helvetica neue'
    });

    var style = document.body.style;
    ok(style.width == '500px', 'has width 500 px');

    // Style attribute output changes depending on browser. These only work
    // in Chrome. How best to test consistently?
    ok(style.margin == '0px auto', 'has margin 0 auto');
    ok(style.font.replace(/'/g, '') == "300 14px/1.5 helvetica neue", 'has correct font' + style.font);
  });

  test('creation', 3, function() {
    // append <em style="color:purple"> asdf </em>
    $('<em/>').css('color', 'purple').prependTo('#append-test-1 li').html(' asdf ');

    // append <b style="color:orange"> asdf </b>
    $('<b/>').appendTo('#append-test-1 li').css('color', 'orange').html(' asdf ');

    // append <li style="background:lightpink">extre<li>
    $('<li>extre</li>').insertAfter('#append-test-1 li').css('background', 'lightpink');
    
    var li = $('#append-test-1').children();
    ok(li.length === 4, 'has 4 children');
    ok(li[0].innerHTML = '<em style="color: purple; "> asdf </em><b style="color: orange; "> asdf </b>', 'first li has correct elems');
    ok(li[2].innerHTML = '<em style="color: purple; "> asdf </em><b style="color: orange; "> asdf </b>', 'third li has correct elems');
  });

  test('cloning', 2, function() {
    var outer = $('<div>i have a click handler<div>i have focus handler</div></div>')
      .css('cursor', 'pointer')
      .bind('click', function() {
        ok(true, 'click handler fired');
      });

    var inner = outer.find('div').bind('focus', function() {
        ok(true, 'focus handler fired');
      });

    // Using 'after' because it clones
    $('#fixtures').children().last().after(outer);

    outer.trigger('click');
    inner.trigger('focus');
  });

  test('transfer', 3, function() {
    $('.hello').appendTo('#hello-world');
    var hw = byid('hello-world');
    var hello = document.getElementsByClassName('hello');
    ok(hello.length === 2, "didn't create new elements");
    ok(hello[0].parentNode == hw, 'moved first elem');
    ok(hello[1].parentNode == hw, 'moved second elem');
  });

});

start();
