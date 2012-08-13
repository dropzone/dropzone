---
layout: default
title: Dropzone.js
---

dropzone.js
===========

dropzone.js is an open source library that provides drag'n'drop file uploads by simply including a java-script file. It views previews of images and you can register to different events to control how and which files are uploaded.

Try it out:

<div id="dropzone"><form action="http://www.torrentplease.com/dropzone.php" class="dropzone">
</form></div>


(This is just a demo dropzone. Uploaded files are **not** stored.)


installation
------------

The easiest and recommended way to install dropzone is through [ender](http://ender.no.de/)

    $ ender build dropzone

If you don't use ender (shame on you) you can [download a bundle here](https://github.com/enyo/dropzonejs).


usage
-----

The typical way of using dropzone is by creating a form element with the class `dropzone`:

{% highlight html %}
<form action="/file-upload" class="dropzone"></form>
{% endhighlight %}

*That's it.* Dropzone will find all form elements with the class dropzone, automatically attach itself to it, and upload files dropped into it to the specified `action` attribute.

The instantiated dropzone object is stored in the HTML element itself. You can access it like this:

{% highlight javascript %}
$("form.dropzone").data("dropzone")
{% endhighlight %}

To manually create a dropzone on an element you can use the `enderElement.dropzone()` helper like this:

{% highlight javascript %}
$("div#my-dropzone").dropzone({ url: "/file-upload", maxFilesize: 8 });
{% endhighlight %}

The valid options are:

- `url`
- `parallelUploads` How many file uploads to process in parallel
- `maxFilesize` in MB
- `paramName` The name of the file param that gets transferred
- `createImageThumbnails`
- `maxThumbnailFilesize` in MB. When the filename exeeds this limit, the thumbnail will not be generated
- `thumbnailWidth`
- `thumbnailHeight`
- `accept` is a function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File) as parameter. If it returns `true` the file will be processed. Otherwise it will not be handled.
- `previewTemplate` is a string that contains the template used for each dropped image. Change it to fulfill your needs but make sure to properly provide all elements.

> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiary with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **listen to the events instead**!

### listen to events

Dropzone triggers events when processing files to which you can register easily with the [bean event utility](https://github.com/fat/bean/).

Example:

{% highlight javascript %}
var bean = require("bean"),
    myDropzone = $("div#my-dropzone").data("dropzone");

bean.add(myDropzone, "addedfile", function(file) { /* handle the file */ });
{% endhighlight %}


Available events are:

- `fallback` When the browser is not supported

All of these receive the event as first parameter:

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
- `uploadprogress` Gets called periodically whenever the file upload progress changes. Gets the **progress** parameter as second parameter which is a percentage (0-100). When an upload finishes dropzone *ensures* that uploadprogress will be called with a percentage of 100 *at least* once.
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

Want your dropzone to look like the dropzone on this page? Just take [my stylesheet](/css/dropzone.css) and make sure you also provide the used images.


browser support
---------------

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+
- Safari 5+

For all the other browsers, dropzone provides an oldschool file input fallback.

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
