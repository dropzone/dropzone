/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('Miscellaneous', function(test, ok, before, after) {
  test('should augment special methods', 3, function () {
    ok(!dom('#augment').color, 'bonzo has no "color" method')
    dom.aug({
      color: function (color) {
        ok(this.prototype == dom().prototype, 'calls augmented methods in scope of bonzo prototype')
        this.css('color', color)
      }
    })
    $('#augment').color('red')
    ok(!!dom('#augment').color, 'bonzo now has a "color" method')
  })

  test('first and last', 2, function () {
    ok($('#first-last div').first()[0].id == 'first', 'found first() element')
    ok($('#first-last div').last()[0].id == 'last', 'found last() element')
  })
})