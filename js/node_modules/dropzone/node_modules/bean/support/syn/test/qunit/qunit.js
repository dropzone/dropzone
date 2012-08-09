//we probably have to have this only describing where the tests are
steal
 .plugins("jquery")
 .plugins("funcunit/syn")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("syn_test", "mouse_test", "key_test"
 
 )