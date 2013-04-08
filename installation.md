---
id: installation
layout: default
title: Dropzone.js
---


<section markdown="1">

Installation
============

Download the standalone [dropzone.js](https://raw.github.com/enyo/dropzone/master/downloads/dropzone.js)
and include it like this:

```html
<script src="./path/to/dropzone.js"></script>
```

Dropzone is now activated and available as `window.Dropzone`.

> Dropzone does *not* handle your file uploads on the server. You have to implement
> the code to receive and store the file yourself.

</section>



<section markdown="1">

With component
--------------

If you use [component](https://github.com/component/component) you can just add
dropzone as a dependency:

    "enyo/dropzone": "*"

Then include it like this:

{% highlight javascript %}
var Dropzone = require("dropzone");
{% endhighlight %}

so it is activated and scans the document.

The basic CSS markup is also included with component, but if you want it to look
the same as on this page, you have to download the CSS (see below).


With RequireJS
--------------

Dropzone is also available as an [AMD module](https://github.com/amdjs/amdjs-api/wiki/AMD)
for [RequireJS](http://requirejs.org).

You can find the [dropzone-amd-module](https://raw.github.com/enyo/dropzone/master/downloads/dropzone-amd-module.js)
in the downloads folder.


* * *

This is all you need to get dropzone up and running. But if you want it to look
as cool as my dropzone, you'll need to **download the css/dropzone.css,
images/spritemap.png and images/spritemap.png@2x.png** as well from the
[downloads folder](https://github.com/enyo/dropzone/tree/master/downloads).

If you change the folder names make sure you adjust the paths in the css.

The `@2x.png` spritemap is to support high density (retina) displays.


</section>

