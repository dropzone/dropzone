var page = new WebPage()
  , url = "http://localhost:3000/tests/index.html"

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000
    , start = new Date().getTime()
    , condition = false
    , interval = setInterval(function() {
        var diff = new Date().getTime() - start
        if ( (diff < maxtimeOutMillis) && !condition ) {
          condition = testFx()
        } else {
          if (!condition) {
            console.log("'waitFor()' timeout")
            phantom.exit(1)
          } else {
            console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms");
            onReady()
            clearInterval(interval)
          }
        }
      }, 250)
}


page.open(url, function (status) {
  waitFor(function() {
    var result = page.evaluate(function () {
      return document.querySelectorAll('.sink-pass').length
    })
      , result2 = page.evaluate(function () {
        return document.querySelectorAll('.pass').length
      })
    console.log('-----------------------------------------')
    console.log(result2)
    return !!result
  }
, function() {
    console.log("qwery is loaded")
    phantom.exit()
  })
})