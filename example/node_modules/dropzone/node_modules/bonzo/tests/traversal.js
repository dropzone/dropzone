/*global sink:true start:true Q:true dom:true $:true bowser:true ender:true*/

sink('DOM Traversal', function(test, ok, before, after) {
  test('next', 1, function () {
    ok($('#sibling-tests li.nextr').next().length == 2, 'els.next().length == 2')
  })

  test('previous', 1, function () {
    ok($('#sibling-tests li.nextr').previous().length == 3, 'els.previous().length == 3')
  })

  test('parent', 1, function () {
    ok($('#parent-test').parent()[0].id == 'parent-test-wrapper', 'parent() is parent-test-wrapper')
  })
})