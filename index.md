---
layout: new
title: Dropzone.js
---

<section markdown="1">

Try it out!
===========

<div id="dropzone"><form action="/upload" class="dropzone needsclick" id="demo-upload">

  <div class="dz-message needsclick">
    Drop files here or click to upload.<br>
    <span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>
  </div>

</form></div>

</section>



<section class="news" markdown="1">

News
====

{% comment %}
{% include _for_hire.html %}
{% endcomment %}

**Build the Stackoverflow documentation with me**

Hey you! If you have already answered a question about dropzone on
stackoverflow, you could help build the documentation on the new
**stackoverflow documentation beta**. To get this project started, we need
at least 5 "committers" to support the project - then I could lay the
ground work.

If you would like to see this project happen, please [click the "commit"
button on the stackoverflow documentation page](http://stackoverflow.com/documentation/dropzone.js).

Thanks!

**Update on my closed PayPal account**

PayPal recently closed my account because they mistook this website for
a file sharing service. This is why I couldn't receive donations for about
7 weeks now (yes... it took them **7 weeks** to rectify their mistake).

They finally enabled the account now, so feel free to donate again.

Thanks

* * *

I recently released my Solo EP called **Meno - Flashlights** on all major Streaming and Music platforms!

<div>
  <div class="embedded-video">
    <iframe style="margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/sFBFkZYGgcE?rel=0&amp;showinfo=1" frameborder="0" allowfullscreen></iframe>
  </div>
</div>

Here is the <em>full</em> Desktop experience: <a href="http://www.meno.fm/flashlights">www.meno.fm/flashlights</a>.
I wrote a [**COLORGLARE** post about the build process](http://www.colorglare.com/2016/02/05/flashlights.html). 
<br>

<div>
  To keep updated like my <a href="https://www.facebook.com/thisismeno/">Facebook artist page</a>.
  <div style="display: inline-block; position: relative; top: -0.2em; margin-left: 0.4em;"><div class="fb-like" data-href="https://www.facebook.com/thisismeno/" data-layout="button" data-action="like" data-show-faces="false" data-share="false" data-colorscheme="dark"></div></div>
</div>

Purchase my EP on
[Google Play](https://play.google.com/store/music/album/Meno_Flashlights?id=Bvkm477idlkjw6joacowb7aa4he),
[Amazon Music](https://www.amazon.com/gp/product/B01AP3ETYO?ie=UTF8&keywords=meno%20flashlights&qid=1454067033&ref_=sr_1_3&s=dmusic&sr=8-3)
or [iTunes](https://itunes.apple.com/at/album/flashlights-ep/id1075875101?l=en) –
or stream it on [Spotify](https://open.spotify.com/album/14y7LCmuPCBAZqrvc6uqkd):

<div>
    <iframe style="display: block; width: 300px; margin: 0 auto;" src="https://embed.spotify.com/?uri=spotify%3Aalbum%3A14y7LCmuPCBAZqrvc6uqkd&theme=white&view=coverart" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
</div>



<!--Dropzone **v4.0.0** is released! It has been completely redesigned, and
the website has been updated. Big thanks to [1910](http://www.weare1910.com)
for designing the new logo and website. It looks fantastic. Check out their 
work!-->

</section>


<section markdown="1">

Installation
============

You probably only need to look at the [simple example](examples/simple.html) ([source](https://github.com/enyo/dropzone/blob/gh-pages/examples/simple.html))
to get started. Continue reading for step by step instructions and different
installation approaches.

* * *

Download the standalone [dropzone.js](https://raw.github.com/enyo/dropzone/master/dist/dropzone.js)
and include it like this:

{% highlight html %}
<script src="./path/to/dropzone.js"></script>
{% endhighlight %}

Dropzone is now activated and available as `window.Dropzone`.

> Dropzone does *not* handle your file uploads on the server. You have to implement
> the code to receive and store the file yourself. See the section
> [Server side implementation](#server-side-implementation) for more information.

This is all you need to get dropzone up and running, but if you want it to look
like the dropzone on this page, you’ll need to **download dropzone.css**
from the [dist folder](https://github.com/enyo/dropzone/tree/master/dist).


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

You can find the [dropzone-amd-module](https://raw.github.com/enyo/dropzone/master/dist/dropzone-amd-module.js)
in the downloads folder.


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

That’s it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

{% highlight html %}
<input type="file" name="file" />
{% endhighlight %}

If you want another name than `file` you can [configure dropzone](#configuration)
with the option `paramName`.

> If you’re using component don’t forget to `require("dropzone");` otherwise it won’t be activated.


If you want your file uploads to work even without JavaScript, you can include
an element with the class `fallback` that dropzone will remove if the browser
is supported. If the browser isn’t supported, Dropzone will not create fallback
elements if there is a fallback element already provided. (Obviously, if the
browser doesn’t support JavaScript, the form will stay as is)

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

> Don’t forget to specify an `url` option if you’re not using a form element,
> since Dropzone doesn’t know where to post to without an `action` attribute.



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

- [AngularJS and Spring](http://www.cantangosolutions.com/blog/Easy-File-Upload-Using-DropzoneJS-AngularJs-And-Spring)
- [NodeJS with express](http://howtonode.org/really-simple-file-uploads)
- [Ruby on rails](http://guides.rubyonrails.org/form_helpers.html#uploading-files)
- [Complete PHP tutorial](http://www.startutorial.com/articles/view/how-to-build-a-file-upload-form-using-dropzonejs-and-php) by startutorial.com
- [Basic PHP file upload](http://www.php.net/manual/en/features.file-upload.post-method.php#example-354)
- [Tutorial for Dropzone and Lavarel (PHP)](http://maxoffsky.com/code-blog/howto-ajax-multiple-file-upload-in-laravel/) written by Maksim Surguy
- [Symfony2 and Amazon S3](http://www.jesuisundev.fr/upload-drag-drop-via-dropzonejs-symfony2-on-cloud-amazon-s3/)
- [File upload in ASP.NET MVC using Dropzone JS and HTML5](http://venkatbaggu.com/file-upload-in-asp-net-mvc-using-dropzone-js-and-html5/)
- [Servicestack and Dropzone](http://www.buildclassifieds.com/2016/01/08/uploading-images-servicestack-and-dropzone/)

Paid documentations:

- [eBook for Dropzone with PHP](http://www.startutorial.com/homes/dropzonejs_php_the_complete_guide?utm_source=dzj&amp;utm_medium=banner&amp;utm_campaign=dropzonejs) by startutorial.com.


Please look at the [Dropzone FAQ](https://github.com/enyo/dropzone/wiki/FAQ) if
you need more information.


</section>


<section markdown="1">


Configuration
=============

There are two ways to configure dropzones.

The obvious way is to pass an options object when instantiating a dropzone
programmatically like in the previous [create dropzones programmatically](#create-dropzones-programmatically)
section.

But if you just have HTML elements with the `dropzone` class, then you don’t
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


{% include configuration-options.html %}


> You can also overwrite all default event actions in the options. So if you provide the option `drop` you can overwrite the default `drop` event handler.
> *You should be familiar with the code if you do that because you can easily break the upload like this.*
> If you just want to do additional stuff, like adding a few classes here and there, **[listen to the events](#events) instead**!


## Enqueuing file uploads

When a file gets added to the dropzone, its `status` gets set to `Dropzone.QUEUED`
(after the `accept` function check passes) which means that the file is now
in the queue.

If you have the option `autoProcessQueue` set to `true` then the queue is immediately
processed, after a file is dropped or an upload finished, by calling
`.processQueue()` which checks how many files are currently uploading,
and if it’s less than `options.parallelUploads`, `.processFile(file)` is called.

If you set `autoProcessQueue` to `false`, then `.processQueue()` is never called
implicitly. This means that you have to call it yourself when you want to
upload all files currently queued.



## Layout

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

The container (`dz-preview`) gets the `dz-processing` class when the file gets processed, `dz-success` when the file got uploaded and `dz-error` in case the file couldn’t be uploaded.
In the latter case, `data-dz-errormessage` will contain the text returned by the server.

To overwrite the default template, use the [`previewTemplate`](#config-previewTemplate)
config.

You can access the HTML of the file preview in any of the events with `file.previewElement`.

If you decide to rewrite the `previewTemplate` from scratch, you should put elements with the `data-dz-*` attributes inside:

- `data-dz-name`
- `data-dz-size`
- `data-dz-thumbnail` (This has to be an `<img />` element and the `alt` and `src` attributes will be changed by Dropzone)
- `data-dz-uploadprogress` (Dropzone will change the `style.width` property from `0%` to `100%` whenever there’s a `uploadprogress` event)
- `data-dz-errormessage`

The default options for Dropzone will look for those element and update the content for it.

If you want some specific link to remove a file (instead of the built in [`addRemoveLinks`](#config-addRemoveLinks) config), you can simply insert elements
in the template with the `data-dz-remove` attribute. Example:

{% highlight html %}
  <img src="removebutton.png" alt="Click me to remove the file." data-dz-remove />
{% endhighlight %}

You are not forced to use those conventions though. If you override all the default event listeners
you can completely rebuild your layout from scratch.

See the installation section on how to add the stylesheet and spritemaps if you want your dropzone to look like the one on this page.

See the [Theming](#theming) section, for a more in depth look at how to change Dropzone’s UI.

I created an example where I made Dropzone look and feel exactly the way jQuery
File Uploader does with a few lines of configuration code. [Check it out!](/bootstrap.html)

> Again, please look at the [Dropzone FAQ](https://github.com/enyo/dropzone/wiki/FAQ) if
> you’re still unclear about some features.



## Dropzone methods

If you want to remove an added file from the dropzone, you can call `.removeFile(file)`.
This method also triggers the `removedfile` event.

Here’s an example that would automatically remove a file when it’s finished uploading:

{% highlight js %}
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
{% endhighlight %}

If you want to remove all files, simply use `.removeAllFiles()`. Files that are
in the process of being uploaded won’t be removed. If you want files that are
currently uploading to be canceled, call `.removeAllFiles(true)` which will
cancel the uploads.

* * *

If you have `autoProcessQueue` disabled, you’ll need to call `.processQueue()`
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

If you don’t like the default browser modals for `confirm` calls,
you can handle them yourself by overwriting `Dropzone.confirm`.

{% highlight js %}
Dropzone.confirm = function(question, accepted, rejected) {
  // Ask the question, and call accepted() or rejected() accordingly.
  // CAREFUL: rejected might not be defined. Do nothing in that case.
};
{% endhighlight %}

* * *

If you want Dropzone to download a file from your server and display it,
you can use

{% highlight js %}
// callback and crossOrigin are optional
myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);
{% endhighlight %}

See the FAQ on [How to show files stored on server](https://github.com/enyo/dropzone/wiki/FAQ#how-to-show-files-already-stored-on-server)
 for more information.


</section>


<section markdown="1">

# Events

Dropzone triggers events when processing files, to which you can register easily,
by calling `.on(eventName, callbackFunction)` on your _instance_.

Since listening to events can only be done on _instances_ of Dropzone, the best
place to setup your event listeners, is in the `init` function:

{% highlight javascript %}
// The recommended way from within the init configuration:
Dropzone.options.myAwesomeDropzone = {
  init: function() {
    this.on("addedfile", function(file) { alert("Added file."); });
  }
};
{% endhighlight %}

If you [create your Dropzones programmatically](#create-dropzones-programmatically),
you can setup your event listeners on your instances, like this:

{% highlight javascript %}

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

This is a bit more complex, and not necessary unless you have a good reason
to instantiate Dropzones programmatically.

> Dropzone itself relies heavily on events. Everything that’s visual is created
by listening to them. Those event listeners are setup in the default configuration
of every Dropzone and can be overwritten, thus replacing the default behavior
with your own event callback.

You should only do this when you really know how Dropzone works, and when you
want to [completely theme your Dropzone](#theming)


{% include event-list.html %}

## Theming

If you want to theme your Dropzone to look fully customized, in most cases you
can simply [replace the preview HTML template](#layout), adapt your CSS, and maybe create
a few additional event listeners.

You will go very far with this approach. As an example, I created an example
where I made Dropzone look and feel exactly the way jQuery File Uploader does
with a few lines of configuration code. [Check it out!](/bootstrap.html)

As you can see, the biggest change is the `previewTemplate`. I then added a few
additional event listeners to make it look exactly like the reference.

*You can however, implement your UI completely from scratch.*

Dropzone itself sets up a lot of event listeners when a Dropzone is created,
that handle all your UI. They do stuff like: create a new HTML element,
add the `<img>` element when provided with image data (with the [`thumbnail`](#event-thumbnail) event),
update the progress bar when the [`uploadprogress`](#event-uploadprogress) event fires,
show a checkmark when the [`success`](#event-success) event fires,
etc...


_Everything_ visual is done in those event handlers. If you would overwrite all
of them with empty functions, Dropzone
would still be fully functional, but wouldn’t display the dropped files anymore.

> If you like the default look of Dropzone, but would just like to add a few
> bells and whistles here and there, you should just [add additional event 
> listeners](#events) instead.

Overwriting the default event listeners, and creating your own, custom Dropzone,
would look something like this:


{% highlight javascript %}
// This is an example of completely disabling Dropzone's default behavior.
// Do *not* use this unless you really know what you are doing.
Dropzone.myDropzone.options = {
  previewTemplate: document.querySelector('#template-container').innerHTML,
  // Specifing an event as an configuration option overwrites the default
  // `addedfile` event handler.
  addedfile: function(file) {
    file.previewElement = Dropzone.createElement(this.options.previewTemplate);
    // Now attach this new element some where in your page
  },
  thumbnail: function(file, dataUrl) {
    // Display the image in your file.previewElement
  },
  uploadprogress: function(file, progress, bytesSent) {
    // Display the progress
  }
  // etc...
};
{% endhighlight %}

Obviously this lacks the actual implementation. Look at the source to see how
Dropzone does it internally.

You should use this option if you don’t need any of the default Dropzone UI,
but are only interested in Dropzone for it’s event handlers, file upload and
drag’n’drop functionality.


</section>

<section markdown="1">

# Tips

If you do not want the default message at all (»Drop files to upload (or click)«), you can
put an element inside your dropzone element with the class `dz-message` and dropzone
will not create the message for you.

* * *

Dropzone will submit any hidden fields you have in your dropzone form. So this
is an easy way to submit additional data. You can also use the `params` option.

* * *

Dropzone adds data to the `file` object you can use when events fire. You can
access `file.width` and `file.height` if it’s an image, as well as
`file.upload` which is an object containing: `progress` (0-100), `total` (the
total bytes) and `bytesSent`.

* * *

If you want to add additional data to the file upload that has to be specific for
each file, you can register for the [`sending`](#event-sending) event:

{% highlight js %}
myDropzone.on("sending", function(file, xhr, formData) {
  // Will send the filesize along with the file as POST data.
  formData.append("filesize", file.size);
});
{% endhighlight %}

* * *

To access the preview html of a file, you can access `file.previewElement`. For
example:

{% highlight js %}
myDropzone.on("addedfile", function(file) {
  file.previewElement.addEventListener("click", function() {
    myDropzone.removeFile(file);
  });
});
{% endhighlight %}

* * *

If you want the whole body to be a Dropzone and display the files somewhere else
you can simply instantiate a Dropzone object for the body, and define the
[`previewsContainer`](#config-previewsContainer) option. The `previewsContainer` should have the
`dropzone-previews` or `dropzone` class to properly display the file previews.

{% highlight js %}
new Dropzone(document.body, {
  previewsContainer: ".dropzone-previews",
  // You probably don't want the whole body
  // to be clickable to select files
  clickable: false
});
{% endhighlight %}



Look at the [github wiki](https://github.com/enyo/dropzone/wiki) for more examples.

If you have any problems using Dropzone, please try to find help on
[stackoverflow.com](http://stackoverflow.com/) by using the `dropzone.js`
tag.
Only create an issue on Github when you think you found a bug or want to
suggest a new feature.

</section>


<section markdown="1">

Compatibility
=============

This section describes compatibility with browsers and older versions of
Dropzone.

Browser Support
---------------

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+ (Version 12 for MacOS is disabled because their API is buggy)
- Safari 6+

For all the other browsers, dropzone provides an oldschool file input fallback.

There is no workaround for drag’n’drop in older browsers – it simply isn't
supported. The same goes for image previews, etc... But using dropzone, your
users using an old browser _will_ be able to upload files. It just won’t look
and feel great. But hey, that’s their fault.

Version 4.0
-----------

<aside>This is not a changelog. Only compatibility problems are listed.</aside>

- Changed the default [`previewTemplate`](#config-previewTemplate). Check out the
  new one in the [layout section](#layout).
- Using an already included SVG instead of a PNG spritemap (the CSS file is now
  the only additional file that you need to include)


Version 3.0
-----------

<aside>This is not a changelog. Only compatibility problems are listed.</aside>

- All classes are prefixed with `dz-` now to prevent clashing with other CSS definitions
- The way `previewTemplate` is defined has changed. You have to provide `data-dz-*` elements now
- If the server returns JSON, it will be parsed for error messages as well
- There’s a `dict*` option for all of the visible messages
- Lots of minor fixes and changes

Version 2.0
-----------

<aside>This is not a changelog. Only compatibility problems are listed.</aside>

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

Another thing that changed, is that Dropzone no longer stores its instances
inside the element’s data property. So to get a dropzone for an element do this
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



<section markdown="1">

Donate
======

Please consider donating if you like this project. I’ve put a lot of my free
time into this project and donations help to justify it.


<div>
Use the Paypal

<form class="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="CA598M5X362GQ">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
</form>

button, <a href="http://tiptheweb.org/">tiptheweb</a> or my
<a href="http://bitcoin.org/">Bitcoin</a> address:
<div class="bitcoin"><code>19k17pTRGS1ykZaL7Qeju2HgXnoPXceQme</code></div>.
</div>

</section>

