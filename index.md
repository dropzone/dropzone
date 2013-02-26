---
layout: default
title: Dropzone.js
---

<section markdown="1">

Try it out:

<div id="dropzone"><form action="http://www.torrentplease.com/dropzone.php" class="dropzone" id="demo-upload">
</form></div>


(This is just a demo dropzone. Uploaded files are **not** stored.)

</section>


<section markdown="1">

Installation
============

Download the standalone [dropzone.js](https://raw.github.com/enyo/dropzone/master/downloads/dropzone.js)
and include it with jQuery like this:

```html
<script src="./path/to/jquery/1.8/jquery.min.js"></script>
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


<section markdown="1">

Usage
=====

The typical way of using dropzone is by creating a form element with the class `dropzone`:

```html
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone"></form>
```

That's it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

{% highlight html %}
<input type="file" name="file" />
{% endhighlight %}

If you want another name than `file` you can [configure dropzone](#configure)
with the option `paramName`.

> If you're using component don't forget to `require("dropzone");` otherwise it won't be activated.

Create dropzones programmatically
---------------------------------

Alternatively you can create dropzones programmaticaly (even on non `form`
elements) in two ways:

- either with jQuery, or by simply
- instantiating the `Dropzone` class

```js
// jQuery
$("div#myId").dropzone({ url: "/file/post" });
// Dropzone class:
var myDropzone = new Dropzone($("div#myId"), { url: "/file/post"})
```

> Don't forget to specify an `url` option if you're not using a form element,
> since Dropzone doesn't know where to post to without an `action` attribute. 

</section>


<section markdown="1">


Configure
=========

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

| Option                  | Description
|-------------------------|-------------
| `url`                   | Has to be specified on elements other than form (or when the form doesn't have an `action` attribute)
| `parallelUploads`       | How many file uploads to process in parallel
| `maxFilesize`           | in MB
| `paramName`             | The name of the file param that gets transferred
| `previewsContainer`     | defines where to display the file previews – if `null` the Dropzone element is used. Can be a jQuery object or a selector. The element should have the `dropzone-previews` class so the previews are displayed properly.
| `clickable`             | Whether the dropzone should be clickable. Defaults to `true`
| `createImageThumbnails` |
| `maxThumbnailFilesize`  | in MB. When the filename exceeds this limit, the thumbnail will not be generated
| `thumbnailWidth`        |
| `thumbnailHeight`       |
| `accept`                | is a function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File) and a `done` function as parameter. If the done function is invoked without a parameter, the file will be processed. If you pass an error message it will be displayed and the file will not be uploaded.
| `enqueueForUpload`      | When false, dropped files aren't uploaded automatically. You have to call `myDZ.processFile(file)` or `myDZ.filesQueue.push(file); myDZ.processQueue();` yourself.
| `previewTemplate`       | is a string that contains the template used for each dropped image. Change it to fulfill your needs but make sure to properly provide all elements.
| `fallback`              | is a function that gets called when the browser is not supported. The default implementation shows the fallback input field and adds a text.

> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiar with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **[listen to the events](#listen_to_events) instead**!


## listen to events

Dropzone triggers events when processing files, to which you can register easily.

Example:

{% highlight javascript %}
// Already instantiated dropzones are accessible through `.data("dropzone")`
var myDropzone = $("#my-dropzone").data("dropzone");

myDropzone.on("addedfile", function(file) {
  /* Maybe display some more file information on your page */
});
{% endhighlight %}


Available events:

All of these receive the [*jQuery* event](http://api.jquery.com/category/events/event-object/) as first parameter:


| Parameter   | Description
|-------------|-------------
| `drop`      | The user dropped something onto the dropzone
| `dragstart` |
| `dragend`   |
| `dragenter` |
| `dragover`  |
| `dragleave` |


All of these receive the [file](https://developer.mozilla.org/en-US/docs/DOM/File) as the first parameter:

| Parameter         | Description
|-------------------|-------------
| `addedfile`       | 
| `removedfile`     | Called whenever a file is removed from the list. You can listen to this and delete the file from your server if you want to.
| `selectedfiles`   | Receives an array of files and gets called whenever files are dropped or selected.
| `thumbnail`       | When the thumbnail has been generated. Receives the [**dataUrl**](http://en.wikipedia.org/wiki/Data_URI_scheme) as second parameter.
| `error`           | An error occured. Receives the **errorMessage** as second parameter.
| `processingfile`  | When a file gets processed (since there is a queue not all files are processed immediately)
| `uploadprogress`  | Gets called periodically whenever the file upload progress changes.<br />Gets the **progress** parameter as second parameter which is a percentage (0-100).<br />When an upload finishes dropzone *ensures* that uploadprogress will be called with a percentage of 100 *at least* once.
| `sending`         | Called just before the file is sent. Gets the xhr object and the [formData](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData) objects as second and third parameters, so you can modify them (for example to add a CSRF token) or add additional data.
| `success`         | The file has been uploaded successfully. (This event was called `finished` previously)
| `complete`        | Called when the upload was either successful or erroneous.
| `reset`           | Called when all files in the list are removed and the dropzone is reset to initial state.


## layout

The HTML that is generated for each file by dropzone looks like this (although you can change it with the `previewTemplate` option):

{% highlight html %}
<div class="preview file-preview">
  <div class="details">
    <div class="filename"><span></span></div>    
  </div>
  <div class="progress"><span class="upload"></span></div>
  <div class="success-mark"><span>Success</span></div>
  <div class="error-mark"><span>Error</span></div>
  <div class="error-message"><span></span></div>
</div>
{% endhighlight %}

`div.preview` gets the `processing` class when the file gets processed, `success` when the file got uploaded and `error` in case the file couldn't be uploaded. In the latter case, `div.error-message` will contain the text returned by the server.

See the installation section on how to add the stylesheet and spritemaps if you want your dropzone to look like the one on this page.


## dropzone methods

If you want to remove an added file from the dropzone, you can call `.removeFile(file)`.
This method also triggers the `removedfile` event.

Here's an example that would automatically remove a file when it's finished uploading:

{% highlight js %}
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
{% endhighlight %}


If you do not need a dropzone anymore, just call `.disable()` on the object. This
will remove all event listeners on the element, and clear all file arrays.

## tips

If your dropzone is rather square than a wide horizontal bar, you can add the class
`square` to your dropzone and it will create the default message in three lines
so it's not that wide.

If you do not want the default message at all (»Drop files to upload (or click)«), you can
put an element inside your dropzone element with the class `message` and dropzone
will not create the message for you.

Dropzone will submit any hidden fields you have in your dropzone form. So this
is an easy way to submit additional data. You can also use the `params` option.

If you want to add additional data to the file upload that has to be specific for
each file, you can register for the `sending` event:

{% highlight js %}
myDropzone.on("sending", function(file, xhr, formData) {
  formData.append("filesize", file.size); // Will send the filesize along with the file as POST data.
});
{% endhighlight %}

To access the preview html of a file, you can access `file.previewTemplate`. For
example:

{% highlight js %}
myDropzone.on("addedfile", function(file) {
  file.previewTemplate.click(function() { myDropzone.removeFile(file); });
});
{% endhighlight %}


If you want the whole body to be a Dropzone and display the files somewhere else
you can simply instantiate a Dropzone object for the body, and define the
`previewsContainer` option. The `previewsContainer` should have the
`dropzone-previews` or `dropzone` class to properly display the file previews.

{% highlight js %}
new Dropzone(document.body, {
  previewsContainer: ".dropzone-previews",
  // You probably don't want the whole body
  // to be clickable to select files
  clickable: false
});
{% endhighlight %}



I'll add more examples soon (How to add delete/download buttons when an upload finished,
how to add file previews on your own, etc...)

Don't hesitate to create an issue on github if you're stuck or think a feature
is missing.

</section>


<section markdown="1">


browser support
===============

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Currently disabled for MacOS because their API is buggy)
- Safari 5+

For all the other browsers, dropzone provides an oldschool file input fallback.

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
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.

</section>

