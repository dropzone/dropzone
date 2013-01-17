---
layout: default
title: Dropzone.js
---

dropzone.js
===========

dropzone.js is an open source library that provides drag'n'drop file uploads by simply including a java-script file. It views previews of images and you can register to different events to control how and which files are uploaded.

Try it out:

<div id="dropzone"><form action="http://www.torrentplease.com/dropzone.php" class="dropzone" id="demo-upload">
</form></div>


(This is just a demo dropzone. Uploaded files are **not** stored.)


installation
------------

Download the standalone [dropzone.js](https://raw.github.com/enyo/dropzone/master/downloads/dropzone.js)
and include it with jQuery like this:

{% highlight html %}
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="./path/to/dropzone.js"></script>
{% endhighlight %}

Dropzone is now activated and available as `window.Dropzone`.

### with component

If you use [component](https://github.com/component/component) you can just add
dropzone as a dependency:

    "enyo/dropzone": "*"

Then include it like this:

{% highlight javascript %}
var Dropzone = require("dropzone");
{% endhighlight %}

so it is activated and scans the document.



* * *

This is all you need to get dropzone up and running. But if you want it to look
as cool as my dropzone, you'll need to **download the dropzone.css and
spritemap.png** as well from the [downloads folder](https://github.com/enyo/dropzone/tree/master/downloads).

usage
-----

The typical way of using dropzone is by creating a form element with the class `dropzone`:

{% highlight html %}
<form action="/file-upload" class="dropzone" id="my-awesome-dropzone"></form>
{% endhighlight %}

That's it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

{% highlight html %}
<input type="file" name="file" />
{% endhighlight %}

If you want another name than `file` you can [configure dropzone](#configuration)
with the option `paramName`.

> If you're using component don't forget to `require("dropzone");` otherwise it won't be activated.

### create dropzones programmatically

Alternatively you can create dropzones programmaticaly (even on non `form`
elements) in two ways:

- either with jQuery, or by simply
- instantiating the `Dropzone` class

{% highlight javascript %}
// jQuery
$("div#myId").dropzone({ url: "/file/post" });
// Dropzone class:
var myDropzone = new Dropzone($("div#myId"), { url: "/file/post"})
{% endhighlight %}

> Don't forget to specify an `url` option if you're not using a form element,
> since Dropzone doesn't know where to post to without an `action` attribute. 


configuration
-------------

There are two ways to configure dropzones.

The obvious way is to pass an options object when instantiating a dropzone
programmatically like in the previous [create dropzones programmatically](#create_dropzones_programmatically)
section.

But if you just have HTML elements with the `dropzone` class, then you don't
programmatically instantiate the objects, so you have to store the configuration
somewhere so Dropzone knows how to configure the dropzones when instantiating
them.

This is done with the `Dropzone.options` object.

{% highlight javascript %}
// "myAwesomeDropzone" is the camelized version of the HTML element's ID
Dropzone.options.myAwesomeDropzone = {
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  accept: (file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
};
{% endhighlight %}


The valid options are:

- `url` Has to be specified on elements other than form (or when the form doesn't have an `action` attribute)
- `parallelUploads` How many file uploads to process in parallel
- `maxFilesize` in MB
- `paramName` The name of the file param that gets transferred
- `createImageThumbnails`
- `maxThumbnailFilesize` in MB. When the filename exeeds this limit, the thumbnail will not be generated
- `thumbnailWidth`
- `thumbnailHeight`
- `accept` is a function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File) and a `done` function as parameter. If the done function is invoked without a parameter, the file will be processed. If you pass an error message it will be displayed and the file will not be uploaded.
- `previewTemplate` is a string that contains the template used for each dropped image. Change it to fulfill your needs but make sure to properly provide all elements.

> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiary with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **[listen to the events](#listen_to_events) instead**!

### listen to events

Dropzone triggers events when processing files, to which you can register easily.

Example:

{% highlight javascript %}
// Already instantiated dropzones are accessible through `.data("dropzone")`
var myDropzone = $("#my-dropzone").data("dropzone");

myDropzone.on("addedfile", function(file) {
  /* Maybe display some more file information on your page */
});
{% endhighlight %}


Available events are:

- `fallback` When the browser is not supported

All of these receive the [*jQuery* event](http://api.jquery.com/category/events/event-object/) as first parameter:

- `drop` The user dropped something onto the dropzone
- `dragstart`
- `dragend`
- `dragenter`
- `dragover`
- `dragleave`

All of these receive the [file](https://developer.mozilla.org/en-US/docs/DOM/File) as the first parameter:

- `addedfile`
- `thumbnail` When the thumbnail has been generated. Receives the [**dataUrl**](http://en.wikipedia.org/wiki/Data_URI_scheme) as second parameter.
- `error` An error occured. Receives the **errorMessage** as second parameter.
- `processingfile` When a file gets processed (since there is a queue not all files are currently processed)
- `uploadprogress` Gets called periodically whenever the file upload progress changes.
  Gets the **progress** parameter as second parameter which is a percentage (0-100).
  When an upload finishes dropzone *ensures* that uploadprogress will be called with a percentage of 100 *at least* once.
- `finished`


### layout

The HTML that is generated for each file by dropzone looks like this (although you can change it with the `previewTemplate` option):

{% highlight html %}
<div class="preview file-preview">
 <div class="details"></div>
 <div class="progress"><span class="load"></span><span class="upload"></span></div>
 <div class="success-mark"><span>Success</span></div>
 <div class="error-mark"><span>Error</span></div>
 <div class="error-message"><span></span></div>
 <div class="filename"><span></span></div>
</div>
{% endhighlight %}

`div.preview` gets the `processing` class when the file gets processed, `success` when the file got uploaded and `error` in case the file couldn't be uploaded. In the latter case, `div.error-message` will contain the text returned by the server.

Want your dropzone to look like the dropzone on this page? Just take [my stylesheet](/css/dropzone.css) and make sure you also provide the referenced [spritemap image](/images/spritemap.png). The font I'm using for the filesize previews (and for the headers on this site)
is [League Gothic](http://www.theleagueofmoveabletype.com/league-gothic).


browser support
---------------

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+
- Safari 5+

For all the other browsers, dropzone provides an oldschool file input fallback.


why?
----

I realize that there
[are](http://valums.com/ajax-upload/)
[already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/)
[other](http://code.google.com/p/html5uploader/)
[libraries](http://blueimp.github.com/jQuery-File-Upload/)
out there but the reasons I decided to write my own are the following:

- I didn't want it to be too big, and to cumbersome to dive into.
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.


other projects
--------------

<div id="opentip-demo" markdown="1">
You might also be interested in my [open source tooltip library Opentip](http://www.opentip.org/).
</div>

license
-------

> Dropzone is licensed under MIT.
> 
> Copyright (c) 2012 Matias Meno
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

