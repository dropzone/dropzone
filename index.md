---
layout: default
title: Dropzone.js
---

<section markdown="1">

It's lightweight, doesn't depend on any other library (like jQuery) and
is [highly customizable](/bootstrap.html).

Try it out:

<div id="dropzone"><form action="http://www.torrentplease.com/dropzone.php" class="dropzone" id="demo-upload">
</form></div>


(This is just a demo dropzone. Uploaded files are **not** stored.)

* * *

> I just released a new article on my website [www.colorglare.com](http://www.colorglare.com/2014/11/24/stateless-html.html).
> If you're interested in my work, please subscribe to my [RSS feed](http://www.colorglare.com/feed.xml).

**We just released our latest album!** It's called «YES / NO» by *Gin Ga* and is now available
in stores, on Spotify and [on iTunes](https://itunes.apple.com/at/album/yes-no/id722931771).
You can see our [latest video clip on youtube](http://youtu.be/3EPWhYmgdJk).




* * *

Please consider donating if you like this project. I've put a lot of my free
time into this project and donations help to justify it.

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="CA598M5X362GQ">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
</form>

Use the Paypal button above, [tiptheweb](http://tiptheweb.org/) or my [Bitcoin](http://bitcoin.org/) address: **19k17pTRGS1ykZaL7Qeju2HgXnoPXceQme**

</section>


<section markdown="1">

Installation
============

Download the standalone [dropzone.js](https://raw.github.com/enyo/dropzone/master/downloads/dropzone.js)
and include it like this:

{% highlight html %}
<script src="./path/to/dropzone.js"></script>
{% endhighlight %}

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
images/spritemap.png and images/spritemap@2x.png** as well from the
[downloads folder](https://github.com/enyo/dropzone/tree/master/downloads).

If you change the folder names make sure you adjust the paths in the css.

The `@2x.png` spritemap is to support high density (retina) displays.


</section>


<section markdown="1">

Usage
=====

The typical way of using dropzone is by creating a form element with the class `dropzone`:

{% highlight html %}
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone"></form>
{% endhighlight %}

That's it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

{% highlight html %}
<input type="file" name="file" />
{% endhighlight %}

If you want another name than `file` you can [configure dropzone](#toc_6)
with the option `paramName`.

> If you're using component don't forget to `require("dropzone");` otherwise it won't be activated.


If you want your file uploads to work even without JavaScript, you can include
an element with the class `fallback` that dropzone will remove if the browser
is supported. If the browser isn't supported, Dropzone will not create fallback
elements if there is a fallback element already provided. (Obviously, if the
browser doesn't support JavaScript, the form will stay as is)

Typically this will look like this:

{% highlight html %}
<form action="/file-upload" class="dropzone">
  <div class="fallback">
    <input name="file" type="file" multiple />
  </div>
</form>
{% endhighlight %}



Create dropzones programmatically
---------------------------------

Alternatively you can create dropzones programmaticaly (even on non `form`
elements) by instantiating the `Dropzone` class

{% highlight js %}
// Dropzone class:
var myDropzone = new Dropzone("div#myId", { url: "/file/post"});
{% endhighlight %}

or if you use jQuery, you can use the jQuery plugin Dropzone ships with:

{% highlight js %}
// jQuery
$("div#myId").dropzone({ url: "/file/post" });
{% endhighlight %}

> Don't forget to specify an `url` option if you're not using a form element,
> since Dropzone doesn't know where to post to without an `action` attribute.



Server side implementation
--------------------------

Dropzone does *not* provide the server side implementation of handling the files,
but the way files are uploaded is identical to simple file upload forms like this:

{% highlight html %}
<form action="" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
{% endhighlight %}

To handle basic file uploads on the server, please look at the corresponding
documentation. Here are a few documentations, if you think I should add some,
please contact me.

- [NodeJS with express](http://howtonode.org/really-simple-file-uploads)
- [Ruby on rails](http://guides.rubyonrails.org/form_helpers.html#uploading-files)
- [Complete PHP tutorial](http://www.startutorial.com/articles/view/how-to-build-a-file-upload-form-using-dropzonejs-and-php) by startutorial.com
- [Basic PHP file upload](http://www.php.net/manual/en/features.file-upload.post-method.php#example-354)
- [Tutorial for Dropzone and Lavarel (PHP)](http://maxoffsky.com/code-blog/howto-ajax-multiple-file-upload-in-laravel/) written by Maksim Surguy
- [Symfony2 and Amazon S3](http://www.jesuisundev.fr/upload-drag-drop-via-dropzonejs-symfony2-on-cloud-amazon-s3/)
- [File upload in ASP.NET MVC using Dropzone JS and HTML5](http://venkatbaggu.com/file-upload-in-asp-net-mvc-using-dropzone-js-and-html5/)

Paid documentations:

- [eBook for Dropzone with PHP](http://www.startutorial.com/homes/dropzonejs_php_the_complete_guide?utm_source=dzj&amp;utm_medium=banner&amp;utm_campaign=dropzonejs) by startutorial.com.


Please look at the [Dropzone FAQ](https://github.com/enyo/dropzone/wiki/FAQ) if
you need more information.


</section>


<section markdown="1">


Configure
=========

There are two ways to configure dropzones.

The obvious way is to pass an options object when instantiating a dropzone
programmatically like in the previous [create dropzones programmatically](#toc_4)
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
  accept: function(file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
};
{% endhighlight %}


If you want to disable the auto discover behaviour of Dropzone, you can either disable
it on a per element basis, or in general:

{% highlight javascript %}
// Prevent Dropzone from auto discovering this element:
Dropzone.options.myAwesomeDropzone = false;
// This is useful when you want to create the
// Dropzone programmatically later

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;
{% endhighlight %}


The valid options are:

| Option                  | Description
|-------------------------|-------------
| `url`                   | Has to be specified on elements other than form (or when the form doesn't have an `action` attribute). You can also provide a function that will be called with `files` and must return the url (since `v3.12.0`)
| `method`                | Defaults to `"post"` and can be changed to `"put"` if necessary. You can also provide a function that will be called with `files` and must return the method (since `v3.12.0`)
| `parallelUploads`       | How many file uploads to process in parallel (See the *Enqueuing file uploads* section for more info)
| `maxFilesize`           | in MB
| `paramName`             | The name of the file param that gets transferred. Defaults to `file`. **NOTE**: If you have the option `uploadMultiple` set to `true`, then Dropzone will append `[]` to the name.
| `uploadMultiple`        | Whether Dropzone should send multiple files in one request. If this it set to true, then the fallback file input element will have the `multiple` attribute as well. This option will also trigger additional events (like `processingmultiple`). See the events section for more information.
| `headers`               | An object to send additional headers to the server. Eg: `headers: { "My-Awesome-Header": "header value" }`
| `addRemoveLinks`        | This will add a link to every file preview to remove or cancel (if already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation` and `dictRemoveFile` options are used for the wording.
| `previewsContainer`     | defines where to display the file previews – if `null` the Dropzone element is used. Can be a plain HTMLElement or a CSS selector. The element should have the `dropzone-previews` class so the previews are displayed properly.
| `clickable`             | If `true`, the dropzone element itself will be clickable, if `false` nothing will be clickable. Otherwise you can pass an HTML element, a CSS selector (for multiple elements) or an array of those.
| `createImageThumbnails` |
| `maxThumbnailFilesize`  | in MB. When the filename exceeds this limit, the thumbnail will not be generated
| `thumbnailWidth`        | if `null`, the ratio of the image will be used to calculate it.
| `thumbnailHeight`       | the same as `thumbnailWidth`. If both are null, images will not be resized.
| `maxFiles`              | if not `null` defines how many files this Dropzone handles. If it exceeds, the event `maxfilesexceeded` will be called. The dropzone element gets the class `dz-max-files-reached` accordingly so you can provided visual feedback.
| `resize`                | is the function that gets called to create the resize information. It gets the `file` as first parameter and must return an object with `srcX`, `srcY`, `srcWidth` and `srcHeight` and the same for `trg*`. Those values are going to be used by `ctx.drawImage()`.
| `init`                  | is a function that gets called when Dropzone is initialized. You can setup event listeners inside this function.
| <strike>`acceptedMimeTypes`</strike> | Deprecated in favor of `acceptedFiles`
| `acceptedFiles`         | The default implementation of `accept` checks the file's mime type or extension against this list. This is a comma separated list of mime types or file extensions. Eg.: `image/*,application/pdf,.psd`. If the Dropzone is `clickable` this option will be used as [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept) parameter on the hidden file input as well.
| `accept`                | is a function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File) and a `done` function as parameter. If the done function is invoked without a parameter, the file will be processed. If you pass an error message it will be displayed and the file will not be uploaded. This function will not be called if the file is too big or doesn't match the mime types.
| <strike>`enqueueForUpload`</strike> | Deprecated in favor of `autoProcessQueue`.
| `autoProcessQueue`      | When set to `false` you have to call `myDropzone.processQueue()` yourself in order to upload the dropped files. See below for more information on handling queues.
| `previewTemplate`       | is a string that contains the template used for each dropped image. Change it to fulfill your needs but make sure to properly provide all elements.
| `forceFallback`         | defaults to `false`. If `true` the fallback will be forced. This is very useful to test your server implementations first and make sure that everything works as expected without dropzone if you experience problems, and to test how your fallbacks will look.
| `fallback`              | is a function that gets called when the browser is not supported. The default implementation shows the fallback input field and adds a text.

to translate dropzone, you can also provide these options:

| Option                         | Description
|--------------------------------|-------------
| `dictDefaultMessage`           | The message that gets displayed before any files are dropped. This is normally replaced by an image but defaults to "Drop files here to upload"
| `dictFallbackMessage`          | If the browser is not supported, the default message will be replaced with this text. Defaults to "Your browser does not support drag'n'drop file uploads."
| `dictFallbackText`             | This will be added before the file input files. If you provide a fallback element yourself, or if this option is `null` this will be ignored. Defaults to "Please use the fallback form below to upload your files like in the olden days."
| `dictInvalidFileType`          | Shown as error message if the file doesn't match the file type.
| `dictFileTooBig`               | Shown when the file is too big. {{filesize}} and {{maxFilesize}} will be replaced.
| `dictResponseError`            | Shown as error message if the server response was invalid. `{{statusCode}}` will be replaced with the servers status code.
| `dictCancelUpload`             | If `addRemoveLinks` is true, the text to be used for the cancel upload link.
| `dictCancelUploadConfirmation` | If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
| `dictRemoveFile`               | If `addRemoveLinks` is true, the text to be used to remove a file.
| `dictMaxFilesExceeded`         | If `maxFiles` is set, this will be the error message when it's exceeded.


> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiar with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **[listen to the events](#toc_8) instead**!


### Enqueuing file uploads

When a file gets added to the dropzone, it's `status` gets set to `Dropzone.QUEUED`
(after the `accept` function check passes) which means that the file is now
in the queue.

If you have the option `autoProcessQueue` set to `true` then the queue is immediately
processed, after a file is dropped or an upload finished, by calling
`.processQueue()` which checks how many files are currently uploading,
and if it's less than `options.parallelUploads` `.processFile(file)` is called.

If you set `autoProcessQueue` to `false`, then `.processQueue()` is never called
implicitly. This means that you have to call it yourself when you want to
upload all files currently queued.


## listen to events

Dropzone triggers events when processing files, to which you can register easily.

Example:

{% highlight javascript %}
// The recommended way from within the init configuration:
Dropzone.options.myAwesomeDropzone = {
  init: function() {
    this.on("addedfile", function(file) { alert("Added file."); });
  }
};

// Or programmatically, when creating a Dropzone.
// This is more complex and should only be used if you need to create your
// Dropzones on demand.
//
// This example uses jQuery so it creates the Dropzone, only when the DOM has
// loaded.

// Disabling autoDiscover, otherwise Dropzone will try to attach twice.
Dropzone.autoDiscover = false;
// or disable for specific dropzone:
// Dropzone.options.myDropzone = false;

$(function() {
  // Now that the DOM is fully loaded, create the dropzone, and setup the
  // event listeners

  var myDropzone = new Dropzone("#my-dropzone");

  myDropzone.on("addedfile", function(file) {
    /* Maybe display some more file information on your page */
  });

})
{% endhighlight %}


Available events:

All of these receive the [event](https://developer.mozilla.org/en-US/docs/DOM/event) as first parameter:


| Parameter   | Description
|-------------|-------------
| `drop`      | The user dropped something onto the dropzone
| `dragstart` |
| `dragend`   |
| `dragenter` |
| `dragover`  |
| `dragleave` |


All of these receive the [file](https://developer.mozilla.org/en-US/docs/DOM/File) as the first parameter:

| Parameter             | Description
|-----------------------|-------------
| `addedfile`           |
| `removedfile`         | Called whenever a file is removed from the list. You can listen to this and delete the file from your server if you want to.
| `thumbnail`           | When the thumbnail has been generated. Receives the [**dataUrl**](http://en.wikipedia.org/wiki/Data_URI_scheme) as second parameter.
| `error`               | An error occured. Receives the **errorMessage** as second parameter and if the error was due to the XMLHttpRequest the xhr object as third.
| `processing`          | When a file gets processed (since there is a queue not all files are processed immediately). This event was called `processingfile` previously.
| `uploadprogress`      | Gets called periodically whenever the file upload progress changes.<br />Gets the **progress** parameter as second parameter which is a percentage (0-100) and the **bytesSent** parameter as third which is the number of the bytes that have been sent to the server.<br />When an upload finishes dropzone *ensures* that uploadprogress will be called with a percentage of 100 *at least* once.<br />**Warning:** This function can potentially be called with the same progress multiple times.
| `sending`             | Called just before each file is sent. Gets the xhr object and the [formData](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData) objects as second and third parameters, so you can modify them (for example to add a CSRF token) or add additional data.
| `success`             | The file has been uploaded successfully. Gets the server response as second argument. (This event was called `finished` previously)
| `complete`            | Called when the upload was either successful or erroneous.
| `canceled`            | Called when a file upload gets canceled.
| `maxfilesreached`     | Called when the number of files accepted reached the `maxFiles` limit.
| `maxfilesexceeded`    | Called for each file that has been rejected because the number of files exceeds the `maxFiles` limit.

All of these receive a list of files as first parameter and are only called if the `uploadMultiple` option is true:

| Parameter             | Description
|-----------------------|-------------
| `processingmultiple`  | See `processing` for description.
| `sendingmultiple`     | See `sending` for description.
| `successmultiple`     | See `success` for description.
| `completemultiple`    | See `complete` for description.
| `canceledmultiple`    | See `canceled` for description.


Special events:

| Parameter             | Description
|-----------------------|-------------
| `totaluploadprogress` | Called with the total upload progress (0-100), the totalBytes and the totalBytesSent. This event can be used to show the overall upload progress of all files.
| `reset`               | Called when all files in the list are removed and the dropzone is reset to initial state.
| `queuecomplete`       | Called when all files in the queue finished uploading.


## layout

The HTML that is generated for each file by dropzone is defined with the option `previewTemplate` which defaults to this:

{% highlight html %}
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size" data-dz-size></div>
    <img data-dz-thumbnail />
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-success-mark"><span>✔</span></div>
  <div class="dz-error-mark"><span>✘</span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
</div>
{% endhighlight %}

The container (`dz-preview`) gets the `dz-processing` class when the file gets processed, `dz-success` when the file got uploaded and `dz-error` in case the file couldn't be uploaded.
In the latter case, `[data-dz-errormessage]` will contain the text returned by the server.

You can access the HTML of the file preview in any of the events with `file.previewElement`.

If you decide to rewrite the `previewTemplate` from scratch, you should put elements with the `data-dz-*` attributes inside:

- `data-dz-name`
- `data-dz-size`
- `data-dz-thumbnail` (This has to be an `<img />` element and the `alt` and `src` attributes will be changed by Dropzone)
- `data-dz-uploadprogress` (Dropzone will change the `style.width` property from `0%` to `100%` whenever there's a `uploadprogress` event)
- `data-dz-errormessage`

The default options for Dropzone will look for those element and update the content for it.

If you want some specific link to remove a file (instead of the built in `addRemoveLinks` option), you can simply insert elements
in the template with the `data-dz-remove` attribute. Example:

{% highlight html %}
  <img src="removebutton.png" alt="Click me to remove the file." data-dz-remove />
{% endhighlight %}

You are not forced to use those conventions though. If you override all the default event listeners
you can completely rebuild your layout from scratch.


See the installation section on how to add the stylesheet and spritemaps if you want your dropzone to look like the one on this page.


Again, please look at the [Dropzone FAQ](https://github.com/enyo/dropzone/wiki/FAQ) if
you're still unclear about some features.



## dropzone methods

If you want to remove an added file from the dropzone, you can call `.removeFile(file)`.
This method also triggers the `removedfile` event.

Here's an example that would automatically remove a file when it's finished uploading:

{% highlight js %}
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
{% endhighlight %}

If you want to remove all files, simply use `.removeAllFiles()`. Files that are
in the process of being uploaded won't be removed. If you want files that are
currently uploading to be canceled, call `.removeAllFiles(true)` which will
cancel the uploads.

* * *

If you have `autoProcessQueue` disabled, you'll need to call `.processQueue()`
yourself.

This can be useful if you want to display the files and let the user click an
accept button to actually upload the file(s).

* * *

To access all files in the dropzone, use `myDropzone.files`.

To get

- all accepted files: `.getAcceptedFiles()`
- all rejected files: `.getRejectedFiles()`
- all queued files: `.getQueuedFiles()`
- all uploading files: `.getUploadingFiles()`

* * *

If you do not need a dropzone anymore, just call `.disable()` on the object. This
will remove all event listeners on the element, and clear all file arrays. To
reenable a Dropzone use `.enable()`.

* * *

If you don't like the default browser modals for `confirm` calls,
you can handle them yourself by overwriting `Dropzone.confirm`.

{% highlight js %}
Dropzone.confirm = function(question, accepted, rejected) {
  // Ask the question, and call accepted() or rejected() accordingly.
  // CAREFUL: rejected might not be defined. Do nothing in that case.
};
{% endhighlight %}



## tips

If your dropzone is rather square than a wide horizontal bar, you can add the class
`square` to your dropzone and it will create the default message in three lines
so it's not that wide.

If you do not want the default message at all (»Drop files to upload (or click)«), you can
put an element inside your dropzone element with the class `dz-message` and dropzone
will not create the message for you.

Dropzone will submit any hidden fields you have in your dropzone form. So this
is an easy way to submit additional data. You can also use the `params` option.

Dropzone adds data to the `file` object you can use when events fire. You can access
`file.width` and `file.height` if it's an image, as well as `file.upload` which
is an object containing: `progress` (0-100), `total` (the total bytes) and
`bytesSent`.

If you want to add additional data to the file upload that has to be specific for
each file, you can register for the `sending` event:

{% highlight js %}
myDropzone.on("sending", function(file, xhr, formData) {
  formData.append("filesize", file.size); // Will send the filesize along with the file as POST data.
});
{% endhighlight %}

To access the preview html of a file, you can access `file.previewElement`. For
example:

{% highlight js %}
myDropzone.on("addedfile", function(file) {
  file.previewElement.addEventListener("click", function() { myDropzone.removeFile(file); });
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
how to add file previews on your own, etc...). In the meantime you can look at
the [github wiki](https://github.com/enyo/dropzone/wiki) for some information.

Don't hesitate to create an issue on github if you're stuck or think a feature
is missing.

</section>


<section markdown="1">


browser support
===============

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Version 12 for MacOS is disabled because their API is buggy)
- Safari 6+

For all the other browsers, dropzone provides an oldschool file input fallback.

As a side note: I have received various «complaints» about not supporting
earlier versions of Internet Explorer – some even called me an IE hater. Although
I don't really object to that, the reason I do not support earlier versions of
IE is very simple: IE up until version 10 does not provide the required APIs
to implement only a fraction of what Dropzone aspires to do. If I were an IE
hater, I wouldn't implement IE10 either. But IE10 actually supports the APIs
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


version 3.0
===========

- All classes are prefixed with `dz-` now to prevent clashing with other CSS definitions
- The way `previewTemplate` is defined has changed. You have to provide `data-dz-*` elements now
- If the server returns JSON, it will be parsed for error messages as well
- There's a `dict*` option for all of the visible messages
- Lots of minor fixes and changes

version 2.0
===========

Starting with version 2.0, Dropzone no longer depends on jQuery, but Dropzone
still registers itself as a jQuery module if available.

That means that creating your Dropzones like this still works:

{% highlight js %}
$("#my-dropzone").dropzone({ /* options */ });
{% endhighlight %}

If you create your Dropzones with the normal constructor though, you have to
pass either the raw HTMLElement, or a selector string. So those versions all
work:

{% highlight js %}
// With jQuery
new Dropzone($("#my-dropzone").get(0));
// Without jQuery
new Dropzone("#my-dropzone");
new Dropzone(document.querySelector("#my-dropzone"));
{% endhighlight %}

Another thing that changed, is that Dropzone no longer stores it's instances
inside the element's data property. So to get a dropzone for an element do this
now:

{% highlight js %}
// DEPRECATED, do not use:
$("#my-dropzone").data("dropzone"); // won't work anymore
// Do this now:
Dropzone.forElement(element); // Providing a raw HTMLElement
// or
Dropzone.forElement("#my-dropzone"); // Providing a selector string.
{% endhighlight %}

</section>
