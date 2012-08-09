steal
  .plugins("funcunit/qunit", 
  "funcunit/synthetic",
  "funcunit/synthetic/drag"
  )
  .plugins("jquery", "jquery/event/drag", "jquery/event/drop")
  .then("drag_test")