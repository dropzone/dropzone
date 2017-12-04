<img alt="Dropzone.js" src="http://www.dropzonejs.com/images/new-logo.svg" />

Dropzone.js is a light weight JavaScript library that turns an HTML element into a dropzone.
This means that a user can drag and drop a file onto it, and the file gets uploaded to the server via AJAX.

* * *

_If you want support, please use [stackoverflow](http://stackoverflow.com/) with the `dropzone.js` tag and not the
GitLab issues tracker. Only post an issue here if you think you discovered a bug or have a feature request._

* * *

**Please read the [contributing guidelines](CONTRIBUTING.md) before you start working on Dropzone!**

<br>
<div align="center">
  <a href="https://gitlab.com/meno/dropzone/builds/artifacts/master/download?job=release"><strong>&gt;&gt; Download &lt;&lt;</strong></a>
</div>
<br>
<br>

Dropzone does **not** depend on jQuery.

Dropzone is compatible with bower, there's a standalone version of Dropzone, an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)
module that's compatible with [RequireJS](http://requirejs.org) in the downloads
folder.

<img alt="Dropzone Screenshot" width="585" src="http://i.imgur.com/Xf7QvVG.png" />

## Main features

- Image thumbnail previews. Simply register the callback `thumbnail(file, data)` and display the image wherever you like
- Retina enabled
- Multiple files and synchronous uploads
- Progress updates
- Support for large files
- Complete theming. The look and feel of Dropzone is just the default theme. You
  can define everything yourself by overwriting the default event listeners.
- Browser image resizing (resize the images before you upload them to your server)
- Well tested

## Documentation

For the full documentation and installation please visit [www.dropzonejs.com](http://www.dropzonejs.com)

Please also refer to the [FAQ](https://github.com/enyo/dropzone/wiki/FAQ).

## Examples

For examples, please see the [GitLab wiki](https://gitlab.com/meno/dropzone/wikis/home).


# Installation

You probably only need to look at the [simple example](http://www.dropzonejs.com/examples/simple.html) ([source](https://gitlab.com/meno/dropzone/raw/master/website/examples/simple.html))
to get started. Continue reading for step by step instructions and different
installation approaches.

* * *

Download the standalone [dropzone.js](https://gitlab.com/meno/dropzone/builds/artifacts/master/file/dist/dropzone.js?job=release)
and include it like this:

```html
<script src="./path/to/dropzone.js"></script>
```

Dropzone is now activated and available as `window.Dropzone`.

> Dropzone does *not* handle your file uploads on the server. You have to implement
> the code to receive and store the file yourself. See the section
> [Server side implementation](#server-side-implementation) for more information.

This is all you need to get dropzone up and running, but if you want it to look
like the dropzone on this page, you’ll need to use the **dropzone.css**
in the [dist folder](https://gitlab.com/meno/dropzone/builds/artifacts/master/download?job=release).


With RequireJS
--------------

Dropzone is also available as an [AMD module](https://github.com/amdjs/amdjs-api/wiki/AMD)
for [RequireJS](http://requirejs.org).

You can find the [dropzone-amd-module](https://gitlab.com/meno/dropzone/builds/artifacts/master/file/dist/dropzone-amd-module.js?job=release)
in the dist folder.



# Usage

The typical way of using dropzone is by creating a form element with the class `dropzone`:

```html
<form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone"></form>
```

That’s it. Dropzone will find all form elements with the class dropzone,
automatically attach itself to it, and upload files dropped into it to the
specified `action` attribute. The uploaded files can be handled just as if
there would have been a html input like this:

```html
<input type="file" name="file" />
```

If you want another name than `file` you can [configure dropzone](#configuration)
with the option `paramName`.


If you want your file uploads to work even without JavaScript, you can include
an element with the class `fallback` that dropzone will remove if the browser
is supported. If the browser isn’t supported, Dropzone will not create fallback
elements if there is a fallback element already provided. (Obviously, if the
browser doesn’t support JavaScript, the form will stay as is)

Typically this will look like this:

```html
<form action="/file-upload" class="dropzone">
  <div class="fallback">
    <input name="file" type="file" multiple />
  </div>
</form>
```



Create dropzones programmatically
---------------------------------

Alternatively you can create dropzones programmaticaly (even on non `form`
elements) by instantiating the `Dropzone` class

```js
// Dropzone class:
var myDropzone = new Dropzone("div#myId", { url: "/file/post"});
```

or if you use jQuery, you can use the jQuery plugin Dropzone ships with:

```js
// jQuery
$("div#myId").dropzone({ url: "/file/post" });
```

> Don’t forget to specify an `url` option if you’re not using a form element,
> since Dropzone doesn’t know where to post to without an `action` attribute.



Server side implementation
--------------------------

Dropzone does *not* provide the server side implementation of handling the files,
but the way files are uploaded is identical to simple file upload forms like this:

```html
<form action="" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

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
- [How to build a file upload form using DropzoneJS and Go](https://hackernoon.com/how-to-build-a-file-upload-form-using-dropzonejs-and-go-8fb9f258a991)
- [How to display existing files on server using DropzoneJS and Go](https://hackernoon.com/how-to-display-existing-files-on-server-using-dropzonejs-and-go-53e24b57ba19)

Paid documentations:

- [eBook for Dropzone with PHP](http://www.startutorial.com/homes/dropzonejs_php_the_complete_guide?utm_source=dzj&amp;utm_medium=banner&amp;utm_campaign=dropzonejs) by startutorial.com.


Please look at the [Dropzone FAQ](https://github.com/enyo/dropzone/wiki/FAQ) if
you need more information.




# Configuration

There are two ways to configure dropzones.

The obvious way is to pass an options object when instantiating a dropzone
programmatically like in the previous [create dropzones programmatically](#create-dropzones-programmatically)
section.

But if you just have HTML elements with the `dropzone` class, then you don’t
programmatically instantiate the objects, so you have to store the configuration
somewhere so Dropzone knows how to configure the dropzones when instantiating
them.

This is done with the `Dropzone.options` object.

```js
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
```


If you want to disable the auto discover behaviour of Dropzone, you can either disable
it on a per element basis, or in general:

```js
// Prevent Dropzone from auto discovering this element:
Dropzone.options.myAwesomeDropzone = false;
// This is useful when you want to create the
// Dropzone programmatically later

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;
```


[List of configuration options](http://www.dropzonejs.com/#configuration-options)


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

```html
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
```

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

```html
<img src="removebutton.png" alt="Click me to remove the file." data-dz-remove />
```

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

```js
myDropzone.on("complete", function(file) {
  myDropzone.removeFile(file);
});
```

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

```js
Dropzone.confirm = function(question, accepted, rejected) {
  // Ask the question, and call accepted() or rejected() accordingly.
  // CAREFUL: rejected might not be defined. Do nothing in that case.
};
```

* * *

If you want Dropzone to download a file from your server and display it,
you can use

```js
// callback and crossOrigin are optional
myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);
```

See the FAQ on [How to show files stored on server](https://github.com/enyo/dropzone/wiki/FAQ#how-to-show-files-already-stored-on-server)
 for more information.



# Events

Dropzone triggers events when processing files, to which you can register easily,
by calling `.on(eventName, callbackFunction)` on your _instance_.

Since listening to events can only be done on _instances_ of Dropzone, the best
place to setup your event listeners, is in the `init` function:

```js
// The recommended way from within the init configuration:
Dropzone.options.myAwesomeDropzone = {
  init: function() {
    this.on("addedfile", function(file) { alert("Added file."); });
  }
};
```

If you [create your Dropzones programmatically](#create-dropzones-programmatically),
you can setup your event listeners on your instances, like this:

```js
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
```

This is a bit more complex, and not necessary unless you have a good reason
to instantiate Dropzones programmatically.

> Dropzone itself relies heavily on events. Everything that’s visual is created
by listening to them. Those event listeners are setup in the default configuration
of every Dropzone and can be overwritten, thus replacing the default behavior
with your own event callback.

You should only do this when you really know how Dropzone works, and when you
want to [completely theme your Dropzone](#theming)


[List of events](http://www.dropzonejs.com/#event-list)


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


```js
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
```

Obviously this lacks the actual implementation. Look at the source to see how
Dropzone does it internally.

You should use this option if you don’t need any of the default Dropzone UI,
but are only interested in Dropzone for it’s event handlers, file upload and
drag’n’drop functionality.


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

```js
myDropzone.on("sending", function(file, xhr, formData) {
  // Will send the filesize along with the file as POST data.
  formData.append("filesize", file.size);
});
```

* * *

To access the preview html of a file, you can access `file.previewElement`. For
example:

```js
myDropzone.on("addedfile", function(file) {
  file.previewElement.addEventListener("click", function() {
    myDropzone.removeFile(file);
  });
});
```

* * *

If you want the whole body to be a Dropzone and display the files somewhere else
you can simply instantiate a Dropzone object for the body, and define the
[`previewsContainer`](#config-previewsContainer) option. The `previewsContainer` should have the
`dropzone-previews` or `dropzone` class to properly display the file previews.

```js
new Dropzone(document.body, {
  previewsContainer: ".dropzone-previews",
  // You probably don't want the whole body
  // to be clickable to select files
  clickable: false
});
```



Look at the [gitlab wiki](https://gitlab.com/meno/dropzone/wikis/home) for more examples.

If you have any problems using Dropzone, please try to find help on
[stackoverflow.com](http://stackoverflow.com/) by using the `dropzone.js`
tag.
Only create an issue on Github when you think you found a bug or want to
suggest a new feature.


# Compatibility

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

Version 5.0
---------

- Starting with version 5.2, dropzone is no longer written in CoffeeScript, but in EcmaScript6. To
  still work in older browsers, the code is still compiled with babel.

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

Another thing that changed, is that Dropzone no longer stores its instances
inside the element’s data property. So to get a dropzone for an element do this
now:

```js
// DEPRECATED, do not use:
$("#my-dropzone").data("dropzone"); // won't work anymore
// Do this now:
Dropzone.forElement(element); // Providing a raw HTMLElement
// or
Dropzone.forElement("#my-dropzone"); // Providing a selector string.
```


# Why another library?

I realize that there [are](http://valums.com/ajax-upload/) [already](http://tutorialzine.com/2011/09/html5-file-upload-jquery-php/) [other](https://github.com/taylor/html5uploader) [libraries](http://blueimp.github.com/jQuery-File-Upload/) out there but the reason I decided to write my own are the following:

- I didn't want it to be too big, and to cumbersome to dive into.
- I want to design my own elements. I only want to register callbacks so I can update my elements accordingly.
- Big files should get uploaded without a problem.
- I wanted a callback for image previews, that don't kill the browser if too many too big images are viewed.
- I want to use the latest API of browsers. I don't care if it falls back to the normal upload form if the browser is too old.
- I don't think that it's necessary anymore to depend on libraries such as jQuery (especially when providing functionality that isn't available in old browsers anyway).

# MIT License

See LICENSE file
