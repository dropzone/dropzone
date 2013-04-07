---
layout: default
title: Dropzone.js
---


<section markdown="1">


browser support
===============

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Currently disabled for MacOS because their API is buggy)
- Safari 6+

For all the other browsers, dropzone provides an oldschool file input fallback.

As a side note: I have received various «complaints» about not supporting
earlier versions of Internet Explorer – some even called me an IE hater. Although
I don't really object to that, the reason I do not support earlier versions of
IE is very simple: IE up until version 10 does not provide the required APIs
to implement only a fraction of what Dropzone aspires to do. If I were an IE
hater, I wouldn't implement IE10 neither. But IE10 actually supports the APIs
Dropzone requires, so it's supported. It's as simple as that. (The same goes
for earlier versions of Firefox, Opera and Safari but those browsers have a
good conversion rate and nobody uses Firefox 3.5 anymore. Why some people still
use IE8 is beyond me.)

</section>


<section markdown="1">

why?
====

I realize that there
[are](http://valums.com/ajax-upload/)
[already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/)
[other](http://code.google.com/p/html5uploader/)
[libraries](http://blueimp.github.com/jQuery-File-Upload/)
out there but the reasons I decided to write my own are the following:

- I didn't want it to be too big, and too cumbersome to dive into.
- I want it to work without frameworks (like jQuery)
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.


version 2.0
===========

Starting with version 2.0, Dropzone no longer depends on jQuery, but Dropzone
still registers itself as a jQuery module if available.

That means that creating your Dropzones like this still works:

```js
$("#my-dropzone").dropzone({ /* options */ });
```

If you create your Dropzones with the normal constructor though, you have to
pass either the raw HTMLElement, or a selector string. So those versions all
work:

```js
// With jQuery
new Dropzone($("#my-dropzone").get(0));
// Without jQuery
new Dropzone("#my-dropzone");
new Dropzone(document.querySelector("#my-dropzone"));
```

Another thing that changed, is that Dropzone no longer stores it's instances
inside the element's data property. So to get a dropzone for an element do this
now:

```js
// DEPRECATED, do not use:
$("#my-dropzone").data("dropzone"); // won't work anymore
// Do this now:
Dropzone.forElement(element); // Providing a raw HTMLElement
// or
Dropzone.forElement("#my-dropzone"); // Providing a selector string.
```

</section>
